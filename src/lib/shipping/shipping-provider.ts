/**
 * Sulaf Unified Universal Shipping & Tracking Engine
 * Supports STOX Egypt (Official Merchant API), Bosta, Aramex, Mylerz, and Custom Shipping APIs
 */

import { readJsonFile } from "@/lib/db/json-db";
import {
  DEFAULT_STORE_SETTINGS,
  DEFAULT_SHIPPING_PROVIDERS,
  ShippingProviderConfig,
  ShippingProviderType,
  StoreSettings,
} from "@/lib/settings/store-settings";
import { EGYPT_GOVERNORATES_RATES } from "./stox";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  governorate: string;
  city: string;
  street: string;
  building?: string;
  notes?: string;
}

export interface ShippingCreateShipmentParams {
  orderId: string;
  orderNumber: string;
  recipient: ShippingAddress;
  codAmount: number;
  items: {
    sku: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  packageDescription?: string;
}

export interface ShippingShipmentResult {
  success: boolean;
  provider: ShippingProviderType;
  providerName: string;
  trackingNumber: string;
  carrierOrderId?: string;
  waybillUrl?: string;
  trackingUrl?: string;
  status: string;
  rawResponse?: any;
  error?: string;
}

export interface ShippingTrackingEvent {
  status: string;
  timestamp: string;
  hubName?: string;
  notes?: string;
}

export interface ShippingTrackingResult {
  trackingNumber: string;
  provider: ShippingProviderType;
  providerName: string;
  currentStatus: "CREATED" | "PICKED_UP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED" | "FAILED";
  statusTextAr: string;
  statusTextEn: string;
  lastUpdated: string;
  carrierHub: string;
  trackingUrl: string;
  events: ShippingTrackingEvent[];
}

interface StoxAreaRecord {
  id: number;
  name?: string;
  ar_name?: string;
  en_name?: string;
  child_name_ar?: string;
  child_name_en?: string;
  active?: boolean;
}

interface StoxProductRecord {
  id: number;
  name?: string;
  sku?: string;
  sku_aliases?: string[];
  inventories?: number;
  price?: string | number;
}

/**
 * Verified fallback STOX Egypt area_id per Governorate (from https://merchants.stox-eg.com/api/areas)
 */
const STOX_GOVERNORATE_DEFAULT_AREA_ID: Record<string, number> = {
  "القاهره": 320,
  "الجيزه": 290,
  "الاسكندريه": 38,
  "القليوبيه": 372,
  "الدقهليه": 83,
  "البحيره": 66,
  "الغربيه": 149,
  "الشرقيه": 111,
  "المنوفيه": 101,
  "كفر الشيخ": 142,
  "دمياط": 232,
  "بورسعيد": 226,
  "الاسماعيليه": 242,
  "السويس": 220,
  "الفيوم": 214,
  "بني سويف": 208,
  "المنيا": 191,
  "اسيوط": 200,
  "سوهاج": 18,
  "قنا": 12,
  "الاقصر": 184,
  "اسوان": 4,
  "البحر الاحمر": 133,
  "مطروح": 175,
  "جنوب سيناء": 162,
  "شمال سيناء": 157,
  "الوادي الجديد": 247,
};

let cachedStoxAreas: { fetchedAt: number; data: StoxAreaRecord[] } | null = null;
let cachedStoxProducts: { fetchedAt: number; tokenKey: string; data: StoxProductRecord[] } | null = null;

function isPlaceholderKey(key?: string): boolean {
  if (!key) return true;
  const clean = key.trim();
  return (
    !clean ||
    clean === "stox_live_or_sandbox_api_token_here" ||
    clean === "ENV_OR_TEST_API_KEY" ||
    clean.includes("sample")
  );
}

function normalizeArabicText(input?: string): string {
  if (!input) return "";
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ");
}

function normalizeEgyptianMobile(phone?: string): string {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "01000000000";
  if (digits.startsWith("0020") && digits.length >= 14) {
    return "0" + digits.slice(4, 14);
  }
  if (digits.startsWith("20") && digits.length === 12) {
    return "0" + digits.slice(2);
  }
  if (digits.startsWith("1") && digits.length === 10) {
    return "0" + digits;
  }
  if (digits.startsWith("01") && digits.length >= 11) {
    return digits.slice(0, 11);
  }
  return digits;
}

export class UniversalShippingService {
  /**
   * Reads dynamic settings from local JSON DB
   */
  public getSettings(): StoreSettings {
    try {
      return readJsonFile<StoreSettings>("store-settings.json", DEFAULT_STORE_SETTINGS);
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  }

  /**
   * Returns current active provider configuration merged with .env fallbacks
   */
  public getActiveProvider(): ShippingProviderConfig {
    const settings = this.getSettings();
    const activeKey = settings.shipping?.activeProvider || "stox";
    const providers = settings.shipping?.providers || DEFAULT_SHIPPING_PROVIDERS;
    const baseConfig = {
      ...(DEFAULT_SHIPPING_PROVIDERS[activeKey] || DEFAULT_SHIPPING_PROVIDERS.stox),
      ...(providers[activeKey] || {}),
    };

    if (activeKey === "stox") {
      if (isPlaceholderKey(baseConfig.apiKey) && !isPlaceholderKey(process.env.STOX_API_KEY)) {
        baseConfig.apiKey = process.env.STOX_API_KEY!.trim();
      }
      if (!baseConfig.baseUrl && process.env.STOX_BASE_URL) {
        baseConfig.baseUrl = process.env.STOX_BASE_URL.trim();
      }
    }

    return baseConfig;
  }

  /**
   * Normalizes any STOX URL (`https://merchants.stox-eg.com/api/orders`, `/api/v1`, etc.)
   * into the clean official STOX API root: `https://merchants.stox-eg.com/api`
   */
  public resolveStoxApiRoot(baseUrl?: string): string {
    const raw = (baseUrl || "https://merchants.stox-eg.com/api").trim().replace(/\/+$/, "");
    const cleaned = raw
      .replace(/\/api\/v1(\/.*)?$/i, "/api")
      .replace(/\/api\/(orders|shipments|areas|products|user)(\/.*)?$/i, "/api");
    if (cleaned.endsWith("/api")) return cleaned;
    if (
      cleaned === "https://merchants.stox-eg.com" ||
      cleaned === "http://merchants.stox-eg.com" ||
      cleaned.includes("stox-eg.com")
    ) {
      try {
        const parsed = new URL(cleaned);
        return `${parsed.origin}/api`;
      } catch {
        return "https://merchants.stox-eg.com/api";
      }
    }
    return cleaned;
  }

  /**
   * Interpolates the tracking number into the carrier tracking template
   */
  public getTrackingUrl(trackingNumber: string, providerConfig?: ShippingProviderConfig): string {
    const provider = providerConfig || this.getActiveProvider();
    const template = provider.trackingUrlTemplate || "https://merchants.stox-eg.com/track/{tracking}";
    return template.replace(/\{tracking\}/g, encodeURIComponent(trackingNumber));
  }

  /**
   * Calculates shipping fee based on governorate and cart total
   */
  public calculateShippingFee(governorate: string, orderSubtotal: number): number {
    const settings = this.getSettings();
    const threshold = settings.shipping?.freeShippingThreshold ?? 800;
    if (orderSubtotal >= threshold) {
      return 0;
    }

    const cleanGov = governorate.trim();
    const customRate = settings.shipping?.customGovernorateRates?.find(
      (r) => r.governorate.trim() === cleanGov
    );
    if (customRate && typeof customRate.rate === "number") {
      return customRate.rate;
    }

    const standardRate = EGYPT_GOVERNORATES_RATES[cleanGov];
    if (standardRate) {
      return standardRate.fee;
    }

    return settings.shipping?.defaultUnifiedRate || 45;
  }

  /**
   * Build authentication headers for a provider
   */
  private buildAuthHeaders(provider: ShippingProviderConfig): Record<string, string> {
    const cleanKey = (provider.apiKey || "").trim().replace(/^Bearer\s+/i, "");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (!cleanKey) return headers;

    if (provider.id === "stox") {
      headers["Authorization"] = `Bearer ${cleanKey}`;
    } else if (provider.id === "bosta") {
      headers["Authorization"] = cleanKey;
    } else if (provider.authHeaderType === "ApiKey") {
      headers[provider.authHeaderName || "X-API-Key"] = cleanKey;
    } else if (provider.authHeaderType === "Basic" && provider.apiSecret) {
      const credentials = Buffer.from(`${cleanKey}:${provider.apiSecret}`).toString("base64");
      headers["Authorization"] = `Basic ${credentials}`;
    } else {
      headers["Authorization"] = `Bearer ${cleanKey}`;
      headers["api-key"] = cleanKey;
      headers["x-api-key"] = cleanKey;
    }

    return headers;
  }

  /**
   * Fetches STOX Egypt areas (`GET /api/areas`) and resolves the best matching `area_id`
   * for the customer's governorate and city/street.
   */
  private async resolveStoxAreaId(
    apiRoot: string,
    headers: Record<string, string>,
    governorate: string,
    city: string,
    street: string
  ): Promise<number> {
    const normGov = normalizeArabicText(governorate);
    const normCity = normalizeArabicText(city);
    const normStreet = normalizeArabicText(street);

    // 1. Fetch live areas list (cached for 60 minutes)
    let areas: StoxAreaRecord[] = [];
    if (cachedStoxAreas && Date.now() - cachedStoxAreas.fetchedAt < 60 * 60 * 1000) {
      areas = cachedStoxAreas.data;
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const res = await fetch(`${apiRoot}/areas`, {
          method: "GET",
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json().catch(() => ({}));
          if (Array.isArray(json.data) && json.data.length > 0) {
            areas = json.data;
            cachedStoxAreas = { fetchedAt: Date.now(), data: areas };
          }
        }
      } catch {}
    }

    if (areas.length > 0) {
      const activeAreas = areas.filter((a) => a.active !== false);

      // Filter by governorate first
      const govMatches = activeAreas.filter((a) => {
        const arFull = normalizeArabicText(a.ar_name || a.name || "");
        const enFull = normalizeArabicText(a.en_name || "");
        const govPartAr = arFull.split("-")[0]?.trim() || "";
        return (
          (normGov && govPartAr === normGov) ||
          (normGov && arFull.startsWith(normGov)) ||
          (normGov && enFull.startsWith(normGov))
        );
      });

      const pool = govMatches.length > 0 ? govMatches : activeAreas;

      // Try matching city or district (`child_name_ar` / `child_name_en`)
      if (normCity || normStreet) {
        const exactDistrict = pool.find((a) => {
          const childAr = normalizeArabicText(a.child_name_ar || "");
          const childEn = normalizeArabicText(a.child_name_en || "");
          return (
            (childAr && normCity && (childAr === normCity || normCity.includes(childAr) || childAr.includes(normCity))) ||
            (childEn && normCity && (childEn === normCity || normCity.includes(childEn) || childEn.includes(normCity))) ||
            (childAr && normStreet && normStreet.includes(childAr))
          );
        });
        if (exactDistrict) {
          return Number(exactDistrict.id);
        }
      }

      if (govMatches.length > 0) {
        return Number(govMatches[0].id);
      }
    }

    // 2. Fallback to verified Governorate Area ID dictionary
    if (normGov && STOX_GOVERNORATE_DEFAULT_AREA_ID[normGov]) {
      return STOX_GOVERNORATE_DEFAULT_AREA_ID[normGov];
    }
    for (const [govKey, defaultId] of Object.entries(STOX_GOVERNORATE_DEFAULT_AREA_ID)) {
      if (normGov.includes(govKey) || govKey.includes(normGov)) {
        return defaultId;
      }
    }

    return 320; // Default Cairo area_id
  }

  /**
   * Fetches the merchant's catalog products in STOX (`GET /api/products`)
   * and maps order items to STOX's required `products: [{ id: number, qty: number }]` format.
   */
  private async resolveStoxProducts(
    apiRoot: string,
    headers: Record<string, string>,
    items: ShippingCreateShipmentParams["items"]
  ): Promise<{ id: number; qty: number }[]> {
    let catalog: StoxProductRecord[] = [];
    const authHeader = headers["Authorization"] || "";

    if (
      cachedStoxProducts &&
      cachedStoxProducts.tokenKey === authHeader &&
      Date.now() - cachedStoxProducts.fetchedAt < 10 * 60 * 1000
    ) {
      catalog = cachedStoxProducts.data;
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        const res = await fetch(`${apiRoot}/products`, {
          method: "GET",
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const json = await res.json().catch(() => ({}));
          if (Array.isArray(json.data) && json.data.length > 0) {
            catalog = json.data;
            cachedStoxProducts = { fetchedAt: Date.now(), tokenKey: authHeader, data: catalog };
          }
        }
      } catch {}
    }

    const defaultStoxProductId = catalog[0]?.id ? Number(catalog[0].id) : 21174;
    const qtyByProductId = new Map<number, number>();

    const sourceItems =
      Array.isArray(items) && items.length > 0
        ? items
        : [{ sku: "Urea", name: "Absolute Smoothing", quantity: 1, price: 0 }];

    for (const item of sourceItems) {
      const qty = Math.max(1, Math.round(Number(item.quantity) || 1));
      let matchedId: number | null = null;

      if (catalog.length > 0) {
        const cleanSku = String(item.sku || "").trim().toLowerCase();
        const cleanName = normalizeArabicText(item.name || "");

        // 1. Direct numeric ID match
        const numericSku = Number(cleanSku);
        if (numericSku > 0) {
          const byId = catalog.find((p) => Number(p.id) === numericSku);
          if (byId) matchedId = Number(byId.id);
        }

        // 2. Match by SKU or SKU aliases
        if (!matchedId && cleanSku) {
          const bySku = catalog.find(
            (p) =>
              String(p.sku || "").trim().toLowerCase() === cleanSku ||
              (Array.isArray(p.sku_aliases) &&
                p.sku_aliases.some((alias) => String(alias).trim().toLowerCase() === cleanSku))
          );
          if (bySku) matchedId = Number(bySku.id);
        }

        // 3. Match by product name substring
        if (!matchedId && cleanName) {
          const byName = catalog.find((p) => {
            const pName = normalizeArabicText(p.name || "");
            return pName && (cleanName.includes(pName) || pName.includes(cleanName));
          });
          if (byName) matchedId = Number(byName.id);
        }
      }

      const finalId = matchedId || defaultStoxProductId;
      qtyByProductId.set(finalId, (qtyByProductId.get(finalId) || 0) + qty);
    }

    return Array.from(qtyByProductId.entries()).map(([id, qty]) => ({ id, qty }));
  }

  /**
   * Dispatches shipment to the active provider API (Real live connection)
   */
  public async createShipment(params: ShippingCreateShipmentParams): Promise<ShippingShipmentResult> {
    const provider = this.getActiveProvider();
    console.log(
      `[Shipping Service] Dispatching Order ${params.orderNumber} via ${provider.nameEn} (COD: ${params.codAmount} EGP)`
    );

    const hasRealApiKey = !isPlaceholderKey(provider.apiKey);

    if (!hasRealApiKey) {
      return {
        success: false,
        provider: provider.id,
        providerName: provider.nameAr,
        trackingNumber: "",
        status: "FAILED",
        error: `يرجى إدخال مفتاح الربط الحقيقي (API Key / Token) الخاص بشركة الشحن (${provider.nameAr}) في إعدادات المتجر لإرسال الطلبات تلقائياً.`,
      };
    }

    try {
      if (provider.id === "stox") {
        return await this.dispatchStox(params, provider);
      } else if (provider.id === "bosta") {
        return await this.dispatchBosta(params, provider);
      } else {
        return await this.dispatchGenericRest(params, provider);
      }
    } catch (err: any) {
      console.error(`[Shipping Service] Live dispatch to ${provider.nameEn} failed:`, err);
      return {
        success: false,
        provider: provider.id,
        providerName: provider.nameAr,
        trackingNumber: "",
        status: "FAILED",
        error: err.message || `تعذر إرسال الطلب إلى ${provider.nameAr}`,
      };
    }
  }

  /**
   * Live dispatch to Official STOX Egypt Merchant API (`POST https://merchants.stox-eg.com/api/orders/store`)
   */
  private async dispatchStox(
    params: ShippingCreateShipmentParams,
    provider: ShippingProviderConfig
  ): Promise<ShippingShipmentResult> {
    const apiRoot = this.resolveStoxApiRoot(provider.baseUrl);
    const headers = this.buildAuthHeaders(provider);

    // 1. Resolve STOX area_id & STOX warehouse products in parallel
    const [areaId, stoxProducts] = await Promise.all([
      this.resolveStoxAreaId(
        apiRoot,
        headers,
        params.recipient.governorate || "القاهرة",
        params.recipient.city || "",
        params.recipient.street || ""
      ),
      this.resolveStoxProducts(apiRoot, headers, params.items),
    ]);

    const addressParts = [
      params.recipient.governorate,
      params.recipient.city,
      params.recipient.street,
      params.recipient.building ? `مبنى/شقة: ${params.recipient.building}` : "",
    ]
      .map((s) => (s || "").trim())
      .filter(Boolean);
    const fullAddress = addressParts.join(" - ") || "القاهرة";

    const descriptionText =
      params.packageDescription ||
      params.items.map((i) => `${i.name} (x${i.quantity})`).join(" + ");

    const codAmount = Math.max(0, Math.round(Number(params.codAmount) || 0));
    const paymentType: "COD" | "CC" = codAmount > 0 ? "COD" : "CC";
    const cleanPhone = normalizeEgyptianMobile(params.recipient.phone);

    const stoxOrderObj: Record<string, any> = {
      customer_name: (params.recipient.fullName || "عميل سلاف").trim(),
      mobile_1: cleanPhone,
      address: fullAddress,
      area_id: areaId,
      payment_type: paymentType,
      ...(paymentType === "COD" ? { cod_amount: codAmount } : {}),
      notes: `${descriptionText}${
        params.recipient.notes ? ` | ${params.recipient.notes}` : ""
      } | رقم الطلب: ${params.orderNumber}`,
      reference_id: params.orderNumber,
      products: stoxProducts,
    };

    const storeEndpoint = `${apiRoot}/orders/store`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(storeEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ orders: [stoxOrderObj] }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const contentType = res.headers.get("content-type") || "";
      const data: any = contentType.includes("application/json")
        ? await res.json().catch(() => ({}))
        : { rawText: (await res.text().catch(() => "")).slice(0, 300) };

      if (res.ok && data.success !== false) {
        // Extract order/tracking identifier from response or query latest order from GET /api/orders
        const createdOrder =
          (Array.isArray(data.data) ? data.data[0] : data.data) ||
          (Array.isArray(data.orders) ? data.orders[0] : data.order) ||
          data;

        let tracking =
          createdOrder?.tracking_number ||
          createdOrder?.trackingNumber ||
          createdOrder?.awb ||
          createdOrder?.code ||
          createdOrder?.order_number ||
          createdOrder?.id;

        if (!tracking) {
          // Query GET /api/orders?page=1 to fetch the newly created order ID/code
          try {
            const listRes = await fetch(`${apiRoot}/orders?page=1`, {
              method: "GET",
              headers,
            });
            if (listRes.ok) {
              const listJson = await listRes.json().catch(() => ({}));
              const latest = Array.isArray(listJson.data) ? listJson.data[0] : null;
              if (latest) {
                tracking =
                  latest.tracking_number ||
                  latest.awb ||
                  latest.code ||
                  latest.order_number ||
                  latest.id;
              }
            }
          } catch {}
        }

        const trackingStr = String(tracking || `STX-${params.orderNumber}`);
        return {
          success: true,
          provider: "stox",
          providerName: provider.nameAr,
          trackingNumber: trackingStr,
          carrierOrderId: String(createdOrder?.id || trackingStr),
          waybillUrl:
            createdOrder?.waybill_url ||
            createdOrder?.awb_url ||
            `https://merchants.stox-eg.com/orders`,
          trackingUrl: this.getTrackingUrl(trackingStr, provider),
          status: "CREATED",
          rawResponse: data,
        };
      }

      const errorMsg =
        data.message ||
        data.error ||
        data.detail ||
        (data.errors ? JSON.stringify(data.errors) : "") ||
        `HTTP ${res.status}`;

      throw new Error(`رفض خادم STOX إنشاء الشحنة (HTTP ${res.status}): ${errorMsg}`);
    } catch (err: any) {
      clearTimeout(timeoutId);
      throw new Error(err.message || "تعذر الاتصال بخادم STOX لإنشاء الشحنة");
    }
  }

  /**
   * Live dispatch to Bosta Egypt
   */
  private async dispatchBosta(
    params: ShippingCreateShipmentParams,
    provider: ShippingProviderConfig
  ): Promise<ShippingShipmentResult> {
    const endpoint = `${provider.baseUrl.replace(/\/+$/, "")}/deliveries`;
    const payload = {
      type: 10,
      specs: {
        packageDetails: {
          itemsCount: params.items.reduce((s, i) => s + i.quantity, 0),
          description: params.items.map((i) => `${i.name} x${i.quantity}`).join(", "),
        },
      },
      receiver: {
        firstName: params.recipient.fullName.split(" ")[0] || params.recipient.fullName,
        lastName: params.recipient.fullName.split(" ").slice(1).join(" ") || "Customer",
        phone: params.recipient.phone,
      },
      dropOffAddress: {
        city: params.recipient.governorate,
        firstLine: `${params.recipient.city} - ${params.recipient.street}`,
        buildingNumber: params.recipient.building || "1",
      },
      cod: Number(params.codAmount) || 0,
      businessReference: params.orderNumber,
      notes: params.recipient.notes,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: provider.apiKey.trim(),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    const tracking = data.trackingNumber || data.data?.trackingNumber || data._id || data.data?._id;
    if (res.ok && tracking) {
      return {
        success: true,
        provider: "bosta",
        providerName: provider.nameAr,
        trackingNumber: String(tracking),
        carrierOrderId: String(data._id || data.data?._id || tracking),
        waybillUrl: `https://api.bosta.co/api/v0/deliveries/awb/${data._id || tracking}`,
        trackingUrl: this.getTrackingUrl(String(tracking), provider),
        status: "CREATED",
        rawResponse: data,
      };
    }

    throw new Error(data.message || `Bosta returned HTTP ${res.status}`);
  }

  /**
   * Live dispatch to Generic / Custom Shipping Provider REST API
   */
  private async dispatchGenericRest(
    params: ShippingCreateShipmentParams,
    provider: ShippingProviderConfig
  ): Promise<ShippingShipmentResult> {
    const endpoint = `${provider.baseUrl.replace(/\/+$/, "")}/shipments`;
    const headers = this.buildAuthHeaders(provider);

    const payload = {
      orderId: params.orderId,
      orderNumber: params.orderNumber,
      recipient: params.recipient,
      codAmount: params.codAmount,
      items: params.items,
    };

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    const tracking = data.trackingNumber || data.tracking_number || data.tracking || data.id;

    if (res.ok && tracking) {
      return {
        success: true,
        provider: provider.id,
        providerName: provider.nameAr,
        trackingNumber: String(tracking),
        carrierOrderId: String(data.orderId || data.id || tracking),
        waybillUrl: data.waybillUrl || data.waybill_url,
        trackingUrl: this.getTrackingUrl(String(tracking), provider),
        status: "CREATED",
        rawResponse: data,
      };
    }

    throw new Error(data.message || `${provider.nameEn} returned HTTP ${res.status}`);
  }

  /**
   * Tracks a shipment by tracking number using active provider
   */
  public async trackShipment(trackingNumber: string): Promise<ShippingTrackingResult> {
    const provider = this.getActiveProvider();
    const trackingUrl = this.getTrackingUrl(trackingNumber, provider);

    if (isPlaceholderKey(provider.apiKey)) {
      return {
        trackingNumber,
        provider: provider.id,
        providerName: provider.nameAr,
        currentStatus: "CREATED",
        statusTextAr: `رقم التتبع لدى ${provider.nameAr}: ${trackingNumber}`,
        statusTextEn: `Tracking number with ${provider.nameEn}: ${trackingNumber}`,
        lastUpdated: new Date().toISOString(),
        carrierHub: provider.nameAr,
        trackingUrl,
        events: [],
      };
    }

    try {
      const headers = this.buildAuthHeaders(provider);

      // Official STOX live order status lookup via GET /api/orders
      if (provider.id === "stox") {
        const apiRoot = this.resolveStoxApiRoot(provider.baseUrl);
        const res = await fetch(`${apiRoot}/orders?page=1`, { headers });
        if (res.ok) {
          const json = await res.json().catch(() => ({}));
          const list: any[] = Array.isArray(json.data) ? json.data : [];
          const cleanTrack = trackingNumber.trim().toLowerCase();
          const matched = list.find(
            (o) =>
              String(o.id || "").toLowerCase() === cleanTrack ||
              String(o.code || "").toLowerCase() === cleanTrack ||
              String(o.awb || "").toLowerCase() === cleanTrack ||
              String(o.tracking_number || "").toLowerCase() === cleanTrack ||
              String(o.reference_id || "").toLowerCase() === cleanTrack
          );
          if (matched) {
            const rawStatus = String(matched.status || matched.order_status || "CREATED").toUpperCase();
            let mappedStatus: ShippingTrackingResult["currentStatus"] = "CREATED";
            if (rawStatus.includes("DELIVER")) mappedStatus = "DELIVERED";
            else if (rawStatus.includes("OUT") || rawStatus.includes("SHIP") || rawStatus.includes("DISPATCH"))
              mappedStatus = "OUT_FOR_DELIVERY";
            else if (rawStatus.includes("PICK") || rawStatus.includes("PREPAR")) mappedStatus = "PICKED_UP";
            else if (rawStatus.includes("RETURN") || rawStatus.includes("CANCEL")) mappedStatus = "RETURNED";

            return {
              trackingNumber,
              provider: "stox",
              providerName: provider.nameAr,
              currentStatus: mappedStatus,
              statusTextAr: matched.status_ar || matched.status || "مسجل لدى STOX جاري التجهيز والشحن",
              statusTextEn: matched.status || "Registered with STOX",
              lastUpdated: matched.updated_at || matched.created_at || new Date().toISOString(),
              carrierHub: "مخازن STOX الرئيسية",
              trackingUrl,
              events: [],
            };
          }
        }
      }

      const endpoint = `${provider.baseUrl.replace(/\/+$/, "")}${
        provider.trackingEndpoint?.replace(/\{tracking\}/g, encodeURIComponent(trackingNumber)) ||
        `/shipments/track/${encodeURIComponent(trackingNumber)}`
      }`;

      const res = await fetch(endpoint, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      return {
        trackingNumber,
        provider: provider.id,
        providerName: provider.nameAr,
        currentStatus: data.status || data.data?.status || "OUT_FOR_DELIVERY",
        statusTextAr: data.status_description_ar || data.statusTextAr || "قيد التوصيل",
        statusTextEn: data.status_description_en || data.statusTextEn || "In Transit",
        lastUpdated: data.updated_at || new Date().toISOString(),
        carrierHub: data.hub_name || `${provider.nameEn} Hub`,
        trackingUrl,
        events: data.events || data.data?.events || [],
      };
    } catch (e: any) {
      console.warn(`[Shipping Track] Live query to ${provider.nameEn} failed:`, e.message);
      return {
        trackingNumber,
        provider: provider.id,
        providerName: provider.nameAr,
        currentStatus: "CREATED",
        statusTextAr: `تم تسجيل الشحنة لدى ${provider.nameAr}`,
        statusTextEn: `Shipment registered with ${provider.nameEn}`,
        lastUpdated: new Date().toISOString(),
        carrierHub: provider.nameEn,
        trackingUrl,
        events: [],
      };
    }
  }

  /**
   * Tests REAL API connection for STOX Egypt or any shipping provider
   */
  public async testProviderConnection(provider: ShippingProviderConfig): Promise<{
    success: boolean;
    provider: ShippingProviderType;
    messageAr: string;
    messageEn: string;
    latencyMs: number;
    details?: any;
  }> {
    const startTime = Date.now();
    const cleanKey = (provider.apiKey || "").trim();

    if (isPlaceholderKey(cleanKey)) {
      return {
        success: false,
        provider: provider.id,
        messageAr: `يرجى إدخال مفتاح الربط الحقيقي (API Key / Bearer Token) الخاص بـ ${provider.nameAr} أولاً لاختبار الاتصال الفعلي بالخادم.`,
        messageEn: `Please enter a valid ${provider.nameEn} API Key / Bearer Token first to test live connection.`,
        latencyMs: 0,
        details: { error: "MISSING_API_KEY" },
      };
    }

    const cleanBase = (provider.baseUrl || "").trim().replace(/\/+$/, "");
    if (!cleanBase || !cleanBase.startsWith("http")) {
      return {
        success: false,
        provider: provider.id,
        messageAr: "يرجى إدخال رابط خادم صحيح (API Base URL يبدأ بـ https://).",
        messageEn: "Please enter a valid API Base URL starting with https://.",
        latencyMs: 0,
      };
    }

    const headers = this.buildAuthHeaders(provider);

    // Dedicated Official STOX Egypt Verification (/api/user + /api/products + /api/orders)
    if (provider.id === "stox") {
      const apiRoot = this.resolveStoxApiRoot(cleanBase);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const [userRes, prodRes, ordersRes] = await Promise.all([
          fetch(`${apiRoot}/user`, { method: "GET", headers, redirect: "manual", signal: controller.signal }),
          fetch(`${apiRoot}/products`, { method: "GET", headers, redirect: "manual", signal: controller.signal }).catch(
            () => null
          ),
          fetch(`${apiRoot}/orders`, { method: "GET", headers, redirect: "manual", signal: controller.signal }).catch(
            () => null
          ),
        ]);
        clearTimeout(timeoutId);
        const latencyMs = Date.now() - startTime;

        if (userRes.status === 401 || userRes.status === 403 || (userRes.status >= 300 && userRes.status < 400)) {
          return {
            success: false,
            provider: "stox",
            messageAr: `رفض خادم STOX مفتاح الـ API Token (HTTP ${userRes.status}). تأكد من نسخ الـ Bearer Token الصحيح من حساب التاجر في STOX.`,
            messageEn: `STOX rejected the API Token (HTTP ${userRes.status}). Please verify your STOX Merchant Bearer Token.`,
            latencyMs,
          };
        }

        if (userRes.ok) {
          const userData = await userRes.json().catch(() => ({}));
          const prodData = prodRes && prodRes.ok ? await prodRes.json().catch(() => ({})) : {};
          const ordersData = ordersRes && ordersRes.ok ? await ordersRes.json().catch(() => ({})) : {};

          const productsList: StoxProductRecord[] = Array.isArray(prodData.data) ? prodData.data : [];
          if (productsList.length > 0) {
            cachedStoxProducts = {
              fetchedAt: Date.now(),
              tokenKey: headers["Authorization"] || "",
              data: productsList,
            };
          }

          const merchantName = userData.name || userData.email || "تاجر معتمد";
          const firstProd = productsList[0];
          const prodSummaryAr = firstProd
            ? `المنتج المربوط بالمخزن: ${firstProd.name} (المخزون في STOX: ${firstProd.inventories ?? "متاح"})`
            : `عدد المنتجات في مخزن STOX: ${productsList.length}`;

          return {
            success: true,
            provider: "stox",
            messageAr: `تم الاتصال والمصادقة الحقيقية بنجاح مع خوادم STOX Egypt! الحساب: ${merchantName} — ${prodSummaryAr} — (الاستجابة: ${latencyMs}ms)`,
            messageEn: `Successfully connected & authenticated with STOX Egypt! Account: ${merchantName} (${latencyMs}ms)`,
            latencyMs,
            details: {
              apiRoot,
              merchantId: userData.id,
              merchantName: userData.name,
              merchantEmail: userData.email,
              warehouseProductsCount: productsList.length,
              primaryProduct: firstProd
                ? { id: firstProd.id, name: firstProd.name, sku: firstProd.sku, stock: firstProd.inventories }
                : null,
              totalSyncedOrders: ordersData.meta?.total ?? 0,
              orderStoreEndpoint: `${apiRoot}/orders/store`,
              status: "ONLINE_AUTHENTICATED",
            },
          };
        }
      } catch (err: any) {
        const latencyMs = Date.now() - startTime;
        return {
          success: false,
          provider: "stox",
          messageAr: `تعذر الوصول إلى خادم STOX Egypt: ${err.message}`,
          messageEn: `Failed to reach STOX Egypt server: ${err.message}`,
          latencyMs,
        };
      }
    }

    const probeUrls = [
      `${cleanBase}/orders`,
      `${cleanBase}/shipments`,
      `${cleanBase}/profile`,
      cleanBase,
    ];

    let lastStatus = 0;
    let lastError = "";

    for (const url of probeUrls) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      try {
        const res = await fetch(url, {
          method: "GET",
          headers,
          redirect: "manual",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const latencyMs = Date.now() - startTime;
        lastStatus = res.status;

        if (res.status >= 300 && res.status < 400) {
          const loc = res.headers.get("location") || "";
          if (loc.includes("login") || loc.includes("auth")) {
            return {
              success: false,
              provider: provider.id,
              messageAr: `رفض خادم ${provider.nameAr} المصادقة (تحويل لصفحة الدخول). تأكد من صحة مفتاح الـ API Key ورابط الـ API Base URL.`,
              messageEn: `${provider.nameEn} redirected to login. Please verify your API Key and API Base URL.`,
              latencyMs,
              details: { httpStatus: res.status, redirectLocation: loc },
            };
          }
        }

        if (res.status === 401 || res.status === 403) {
          const errBody = await res.json().catch(() => ({}));
          return {
            success: false,
            provider: provider.id,
            messageAr: `رفض خادم ${provider.nameAr} مفتاح الـ API (HTTP ${res.status} Unauthorized): ${
              errBody.message || errBody.error || "المفتاح غير صحيح أو منتهي الصلاحية"
            }`,
            messageEn: `${provider.nameEn} rejected API Key (HTTP ${res.status} Unauthorized).`,
            latencyMs,
            details: { httpStatus: res.status, response: errBody },
          };
        }

        const contentType = res.headers.get("content-type") || "";
        if ((res.ok && contentType.includes("application/json")) || res.status === 405 || res.status === 422) {
          return {
            success: true,
            provider: provider.id,
            messageAr: `تم الاتصال والمصادقة الحقيقية بنجاح مع خوادم ${provider.nameAr}! (HTTP ${res.status} — زمن الاستجابة: ${latencyMs}ms)`,
            messageEn: `Successfully authenticated with ${provider.nameEn} API! (HTTP ${res.status} — Latency: ${latencyMs}ms)`,
            latencyMs,
            details: {
              endpoint: url,
              httpStatus: res.status,
              status: "ONLINE_AUTHENTICATED",
            },
          };
        }

        if (res.ok && !contentType.includes("text/html")) {
          return {
            success: true,
            provider: provider.id,
            messageAr: `تم الاتصال بنجاح بخادم ${provider.nameAr}! (زمن الاستجابة: ${latencyMs}ms)`,
            messageEn: `Connected successfully to ${provider.nameEn}! (Latency: ${latencyMs}ms)`,
            latencyMs,
            details: {
              endpoint: url,
              httpStatus: res.status,
              status: "ONLINE",
            },
          };
        }

        lastError = contentType.includes("text/html")
          ? `الخادم أعاد صفحة ويب HTML بدلاً من استجابة JSON API على الرابط (${url})`
          : `HTTP ${res.status}`;
      } catch (err: any) {
        clearTimeout(timeoutId);
        lastError = err.message || "Network timeout / unreachable";
      }
    }

    const latencyMs = Date.now() - startTime;
    return {
      success: false,
      provider: provider.id,
      messageAr: `تعذر التحقق من استجابة الـ API لـ ${provider.nameAr}: ${lastError} (تأكد من صحة رابط الـ API Base URL ومفتاح الربط من حسابك في الشركة).`,
      messageEn: `Could not verify ${provider.nameEn} API response: ${lastError}`,
      latencyMs,
      details: { httpStatus: lastStatus, error: lastError },
    };
  }
}

export const universalShippingService = new UniversalShippingService();
export default universalShippingService;

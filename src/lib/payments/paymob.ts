import crypto from "crypto";
import { readJsonFile } from "@/lib/db/json-db";
import { DEFAULT_STORE_SETTINGS, StoreSettings } from "@/lib/settings/store-settings";

export interface PaymobIntentionParams {
  amountCents: number;
  currency?: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    street: string;
    building?: string;
    city: string;
    governorate: string;
    country?: string;
  };
  paymentMethods?: ("card" | "wallet" | "fawry")[];
  walletPhone?: string;
  originUrl?: string;
}

export interface PaymobPaymentResult {
  success: boolean;
  mode?: "intention_v1" | "classic_v2";
  clientSecret?: string;
  paymentUrl?: string;
  iframeUrl?: string;
  transactionId?: string;
  paymobOrderId?: string;
  error?: string;
}

export interface PaymobConfig {
  enabled: boolean;
  isSandbox: boolean;
  apiKey: string;
  secretKey: string;
  publicKey: string;
  hmacSecret: string;
  cardIntegrationId: string;
  applePayIntegrationId: string;
  walletIntegrationId: string;
  iframeId: string;
}

export class PaymobService {
  /**
   * Reads live Paymob configuration from store-settings.json with .env fallback
   */
  public getConfig(overrides?: Partial<PaymobConfig>): PaymobConfig {
    let storedPaymob: Partial<PaymobConfig> = {};
    try {
      const settings = readJsonFile<StoreSettings>("store-settings.json", DEFAULT_STORE_SETTINGS);
      storedPaymob = settings.paymob || {};
    } catch {}

    const isPlaceholder = (val?: string) => {
      if (!val) return true;
      const clean = val.trim();
      return (
        !clean ||
        clean.includes("sample") ||
        clean.includes("12345") ||
        clean === "482019" ||
        clean === "482020" ||
        clean === "847291" ||
        clean === "654321" ||
        clean === "ENV_OR_TEST_API_KEY" ||
        clean.includes("sulaf_gateway_accept") ||
        clean.includes("hmac_secret_sulaf_paymob_hash")
      );
    };

    const cleanValue = (val?: string) => (isPlaceholder(val) ? "" : val!.trim());
    const cleanNumericId = (val?: string) => {
      if (isPlaceholder(val)) return "";
      return String(val || "").replace(/\D/g, "");
    };

    const envApiKey = cleanValue(process.env.PAYMOB_API_KEY);
    const envSecretKey = cleanValue(process.env.PAYMOB_SECRET_KEY);
    const envPublicKey = cleanValue(process.env.PAYMOB_PUBLIC_KEY);
    const envHmac = cleanValue(process.env.PAYMOB_HMAC_SECRET);
    const envCardId = cleanNumericId(process.env.PAYMOB_INTEGRATION_CARD_ID);
    const envApplePayId = cleanNumericId(process.env.PAYMOB_INTEGRATION_APPLE_PAY_ID);
    const envWalletId = cleanNumericId(process.env.PAYMOB_INTEGRATION_WALLET_ID);
    const envIframeId = cleanNumericId(process.env.PAYMOB_IFRAME_ID);

    return {
      enabled: overrides?.enabled ?? storedPaymob.enabled ?? true,
      isSandbox: overrides?.isSandbox ?? storedPaymob.isSandbox ?? false,
      apiKey: cleanValue(overrides?.apiKey) || cleanValue(storedPaymob.apiKey) || envApiKey,
      secretKey: cleanValue(overrides?.secretKey) || cleanValue(storedPaymob.secretKey) || envSecretKey,
      publicKey: cleanValue(overrides?.publicKey) || cleanValue(storedPaymob.publicKey) || envPublicKey,
      hmacSecret: cleanValue(overrides?.hmacSecret) || cleanValue(storedPaymob.hmacSecret) || envHmac,
      cardIntegrationId:
        cleanNumericId(overrides?.cardIntegrationId) ||
        cleanNumericId(storedPaymob.cardIntegrationId) ||
        envCardId ||
        "6061385",
      applePayIntegrationId:
        cleanNumericId(overrides?.applePayIntegrationId) ||
        cleanNumericId(storedPaymob.applePayIntegrationId) ||
        envApplePayId ||
        "6061713",
      walletIntegrationId:
        cleanNumericId(overrides?.walletIntegrationId) ||
        cleanNumericId(storedPaymob.walletIntegrationId) ||
        envWalletId ||
        "6057158",
      iframeId:
        cleanNumericId(overrides?.iframeId) || cleanNumericId(storedPaymob.iframeId) || envIframeId || "6061385",
    };
  }

  /**
   * Detects whether a key is a Paymob v1 Intention Secret Key (`egy_sk_...`, `sk_...`)
   * or a Classic Paymob API Key (used with `/api/auth/tokens`).
   */
  public isIntentionSecretKey(key: string): boolean {
    const clean = key.trim();
    return (
      clean.startsWith("egy_sk_") ||
      clean.startsWith("sk_test_") ||
      clean.startsWith("sk_live_") ||
      clean.startsWith("are_sk_") ||
      clean.startsWith("sau_sk_") ||
      clean.startsWith("omn_sk_")
    );
  }

  /**
   * Automatically discovers the merchant's active Integration IDs from Paymob
   * (`/api/auth/tokens` -> `/api/ecommerce/integrations`) if an Integration ID is missing or mismatched.
   */
  public async discoverIntegrationIds(
    classicApiKey: string,
    preferLive = true,
    preferWallet = false
  ): Promise<number[]> {
    try {
      const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: classicApiKey.trim() }),
      });
      const authData = await authRes.json().catch(() => ({}));
      if (!authRes.ok || !authData.token) return [];

      const intRes = await fetch("https://accept.paymob.com/api/ecommerce/integrations", {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const intData = await intRes.json().catch(() => ({}));
      const list: any[] = Array.isArray(intData.results) ? intData.results : [];
      if (list.length === 0) return [];

      const active = list.filter(
        (x) => !x.is_deprecated && (x.integration_type === "online" || x.integration_type === "online_new")
      );
      const pool = active.length > 0 ? active : list;

      const sorted = [...pool].sort((a, b) => {
        const aModeMatch = Boolean(a.is_live) === preferLive ? 1 : 0;
        const bModeMatch = Boolean(b.is_live) === preferLive ? 1 : 0;
        if (aModeMatch !== bModeMatch) return bModeMatch - aModeMatch;

        const targetGw = preferWallet ? "UIG" : "VPC";
        const aGwMatch = a.gateway_type === targetGw ? 1 : 0;
        const bGwMatch = b.gateway_type === targetGw ? 1 : 0;
        return bGwMatch - aGwMatch;
      });

      return sorted.map((x) => Number(x.id)).filter((n) => n > 0);
    } catch {
      return [];
    }
  }

  /**
   * Verifies Paymob Webhook / Redirect Callback HMAC-SHA512 signature
   * Supports both POST JSON (`obj`) and GET redirect query parameters per official Paymob docs.
   */
  public verifyHmac(payload: Record<string, any>, receivedHmac: string): boolean {
    const config = this.getConfig();
    if (!config.hmacSecret) return true;
    if (!receivedHmac) return false;

    const getField = (key: string): string => {
      switch (key) {
        case "order":
          if (payload.order && typeof payload.order === "object") {
            return String(payload.order.id ?? "");
          }
          return String(payload["order.id"] ?? payload.order ?? payload.order_id ?? "");
        case "source_data.pan":
          return String(
            payload.source_data?.pan ?? payload["source_data.pan"] ?? payload.source_data_pan ?? ""
          );
        case "source_data.sub_type":
          return String(
            payload.source_data?.sub_type ??
              payload["source_data.sub_type"] ??
              payload.source_data_sub_type ??
              ""
          );
        case "source_data.type":
          return String(
            payload.source_data?.type ?? payload["source_data.type"] ?? payload.source_data_type ?? ""
          );
        default: {
          const val = payload[key];
          if (val === undefined || val === null) return "";
          if (typeof val === "boolean") return val ? "true" : "false";
          return String(val);
        }
      }
    };

    // Official Paymob lexicographical field sequence (20 fields)
    const keys = [
      "amount_cents",
      "created_at",
      "currency",
      "error_occured",
      "has_parent_transaction",
      "id",
      "integration_id",
      "is_3d_secure",
      "is_auth",
      "is_capture",
      "is_refunded",
      "is_standalone_payment",
      "is_voided",
      "order",
      "owner",
      "pending",
      "source_data.pan",
      "source_data.sub_type",
      "source_data.type",
      "success",
    ];

    const concatenated = keys.map(getField).join("");
    const calculatedHmac = crypto
      .createHmac("sha512", config.hmacSecret)
      .update(concatenated)
      .digest("hex");

    return calculatedHmac.toLowerCase() === receivedHmac.trim().toLowerCase();
  }

  /**
   * Verifies a Paymob transaction directly with Paymob servers when Classic API Key is available.
   */
  public async verifyTransactionServerSide(params: {
    transactionId?: string;
    paymobOrderId?: string;
    merchantOrderId?: string;
  }): Promise<{
    verified: boolean;
    success: boolean;
    pending: boolean;
    transactionId?: string;
    paymobOrderId?: string;
  } | null> {
    const config = this.getConfig();
    const classicApiKey =
      !this.isIntentionSecretKey(config.apiKey) && config.apiKey
        ? config.apiKey
        : !this.isIntentionSecretKey(config.secretKey) && config.secretKey
        ? config.secretKey
        : "";

    if (!classicApiKey) return null;

    try {
      const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: classicApiKey }),
      });
      const authData = await authRes.json().catch(() => ({}));
      const authToken = authData?.token;
      if (!authRes.ok || !authToken) return null;

      if (params.transactionId) {
        const txRes = await fetch(
          `https://accept.paymob.com/api/acceptance/transactions/${encodeURIComponent(
            params.transactionId
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const txData = await txRes.json().catch(() => ({}));
        if (txRes.ok && txData && typeof txData.success === "boolean") {
          return {
            verified: true,
            success: txData.success === true,
            pending: txData.pending === true,
            transactionId: txData.id ? String(txData.id) : params.transactionId,
            paymobOrderId: txData.order?.id ? String(txData.order.id) : params.paymobOrderId,
          };
        }
      }

      if (params.paymobOrderId || params.merchantOrderId) {
        const inqRes = await fetch(
          "https://accept.paymob.com/api/ecommerce/orders/transaction_inquiry",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              auth_token: authToken,
              ...(params.paymobOrderId ? { order_id: params.paymobOrderId } : {}),
              ...(params.merchantOrderId ? { merchant_order_id: params.merchantOrderId } : {}),
            }),
          }
        );
        const inqData = await inqRes.json().catch(() => ({}));
        if (inqRes.ok && inqData && typeof inqData.success === "boolean") {
          return {
            verified: true,
            success: inqData.success === true,
            pending: inqData.pending === true,
            transactionId: inqData.id ? String(inqData.id) : undefined,
            paymobOrderId: inqData.order?.id ? String(inqData.order.id) : params.paymobOrderId,
          };
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Creates a real Paymob payment session using either:
   * 1. Paymob Intention / Unified Checkout API (`https://accept.paymob.com/v1/intention/`)
   * 2. Paymob Classic 3-Step Accept API (`https://accept.paymob.com/api/auth/tokens` -> `orders` -> `payment_keys`)
   */
  public async createIntention(
    params: PaymobIntentionParams,
    configOverrides?: Partial<PaymobConfig>
  ): Promise<PaymobPaymentResult> {
    const config = this.getConfig(configOverrides);
    const amountCents = Math.max(100, Math.round(Number(params.amountCents) || 0));
    const currency = params.currency || "EGP";

    const rawSecret = config.secretKey || config.apiKey;
    if (!rawSecret) {
      return {
        success: false,
        error:
          "لم يتم ضبط مفاتيح الربط الخاصة ببوابة Paymob في لوحة التحكم (Secret Key أو API Key). يرجى إدخالها من الإعدادات أولاً.",
      };
    }

    const origin = (
      params.originUrl ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.COOLIFY_URL ||
      "http://localhost:3000"
    ).replace(/\/+$/, "");

    const notificationUrl = `${origin}/api/webhooks/paymob`;
    const redirectionUrl = `${origin}/checkout?paymob_return=1&sulaf_order=${encodeURIComponent(params.orderNumber)}`;
    const uniqueMerchantOrderId = `${params.orderNumber}__${Date.now().toString().slice(-5)}`;

    const billingData = {
      apartment: "NA",
      first_name: params.customer.firstName || "عميل",
      last_name: params.customer.lastName || "سلاف",
      street: params.billingAddress.street || "القاهرة",
      building: params.billingAddress.building || "NA",
      phone_number: params.customer.phone || "+201000000000",
      country: "EG",
      email: params.customer.email || "customer@sulaf.com",
      floor: "NA",
      state: params.billingAddress.governorate || "القاهرة",
      city: params.billingAddress.city || params.billingAddress.governorate || "القاهرة",
      postal_code: "NA",
      shipping_method: "PKG",
    };

    const wantsWallet = params.paymentMethods?.includes("wallet");
    const cardIdNum = Number(config.cardIntegrationId) || 0;
    const applePayIdNum = Number(config.applePayIntegrationId) || 0;
    const walletIdNum = Number(config.walletIntegrationId) || 0;

    const orderedIds = wantsWallet
      ? [walletIdNum, cardIdNum, applePayIdNum]
      : [cardIdNum, applePayIdNum, walletIdNum];

    const integrationIds: number[] = Array.from(new Set(orderedIds.filter((n) => n > 0)));

    // Determine whether we have an Intention Secret Key (`egy_sk_...`) or a Classic API Key
    const intentionSecret = this.isIntentionSecretKey(config.secretKey)
      ? config.secretKey
      : this.isIntentionSecretKey(config.apiKey)
      ? config.apiKey
      : "";

    const classicApiKey = !this.isIntentionSecretKey(config.apiKey) && config.apiKey
      ? config.apiKey
      : !this.isIntentionSecretKey(config.secretKey) && config.secretKey
      ? config.secretKey
      : "";

    // -------------------------------------------------------------------------
    // FLOW 1: Modern Paymob Intention API (`https://accept.paymob.com/v1/intention/`)
    // -------------------------------------------------------------------------
    if (intentionSecret) {
      try {
        // If no integration IDs configured or if we have classicApiKey to auto-discover valid Integration IDs
        if (integrationIds.length === 0 && classicApiKey) {
          const discovered = await this.discoverIntegrationIds(
            classicApiKey,
            !intentionSecret.includes("_test_"),
            wantsWallet
          );
          if (discovered.length > 0) {
            integrationIds.push(discovered[0]);
          }
        }

        const buildIntentionPayload = (pmList: (number | string)[]) => ({
          amount: amountCents,
          currency,
          payment_methods: pmList,
          items: [
            {
              name: `طلب سلاف رقم ${params.orderNumber}`,
              amount: amountCents,
              description: `Sulaf Order ${params.orderNumber}`,
              quantity: 1,
            },
          ],
          billing_data: billingData,
          customer: {
            first_name: billingData.first_name,
            last_name: billingData.last_name,
            email: billingData.email,
            phone_number: billingData.phone_number,
          },
          special_reference: uniqueMerchantOrderId,
          extras: {
            sulaf_order_number: params.orderNumber,
          },
          notification_url: notificationUrl,
          redirection_url: redirectionUrl,
        });

        let response = await fetch("https://accept.paymob.com/v1/intention/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${intentionSecret}`,
          },
          body: JSON.stringify(
            buildIntentionPayload(integrationIds.length > 0 ? integrationIds : [6061385, 6061713, 6057158])
          ),
        });

        let data = await response.json().catch(() => ({}));

        // If 404 (one of the Integration IDs does not exist), retry with primary ID or auto-discover
        if (response.status === 404 && integrationIds.length > 1) {
          response = await fetch("https://accept.paymob.com/v1/intention/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${intentionSecret}`,
            },
            body: JSON.stringify(buildIntentionPayload([integrationIds[0]])),
          });
          data = await response.json().catch(() => ({}));
        }

        if (response.status === 404 && classicApiKey) {
          const discovered = await this.discoverIntegrationIds(
            classicApiKey,
            !intentionSecret.includes("_test_"),
            wantsWallet
          );
          const fallbackId = discovered.find((id) => !integrationIds.includes(id)) || discovered[0];
          if (fallbackId) {
            response = await fetch("https://accept.paymob.com/v1/intention/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${intentionSecret}`,
              },
              body: JSON.stringify(buildIntentionPayload([fallbackId])),
            });
            data = await response.json().catch(() => ({}));
          }
        }

        if (response.ok && data.client_secret) {
          if (!config.publicKey) {
            return {
              success: false,
              error:
                "تم إنشاء جلسة Paymob Intention بنجاح، ولكن يرجى إدخال المفتاح العام (Public Key مثل egy_pk_...) في إعدادات Paymob لفتح صفحة الدفع الموحدة.",
            };
          }
          const unifiedUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(
            config.publicKey
          )}&clientSecret=${encodeURIComponent(data.client_secret)}`;

          return {
            success: true,
            mode: "intention_v1",
            clientSecret: data.client_secret,
            paymentUrl: unifiedUrl,
            iframeUrl: unifiedUrl,
            transactionId: data.id ? String(data.id) : undefined,
            paymobOrderId: data.intention_order_id ? String(data.intention_order_id) : undefined,
          };
        }

        // If classic API key is also available, fall through to classic v2 flow; otherwise return exact Paymob error
        if (!classicApiKey) {
          const errDetail =
            data.detail || data.message || (typeof data === "object" ? JSON.stringify(data) : String(data));
          return {
            success: false,
            error: `رفض خادم Paymob Intention الطلب (HTTP ${response.status}): ${errDetail}`,
          };
        }
      } catch (err: any) {
        if (!classicApiKey) {
          return {
            success: false,
            error: `تعذر الاتصال بخادم Paymob Intention: ${err.message}`,
          };
        }
      }
    }

    // -------------------------------------------------------------------------
    // FLOW 2: Classic Paymob 3-Step Accept API (`/api/auth/tokens` -> `/api/ecommerce/orders` -> `/api/acceptance/payment_keys`)
    // -------------------------------------------------------------------------
    if (classicApiKey) {
      try {
        // Step 1: Authenticate & obtain Auth Token
        const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: classicApiKey }),
        });
        const authData = await authRes.json().catch(() => ({}));
        if (!authRes.ok || !authData.token) {
          return {
            success: false,
            error: `فشل المصادقة مع Paymob (HTTP ${authRes.status}): ${
              authData.detail || authData.message || "تأكد من صحة الـ API Key"
            }`,
          };
        }
        const authToken: string = authData.token;

        // Step 2: Register Order on Paymob
        const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: authToken,
            delivery_needed: "false",
            amount_cents: String(amountCents),
            currency,
            merchant_order_id: uniqueMerchantOrderId,
            items: [
              {
                name: `طلب سلاف رقم ${params.orderNumber}`,
                amount_cents: String(amountCents),
                description: `Sulaf Order ${params.orderNumber}`,
                quantity: "1",
              },
            ],
          }),
        });
        const orderData = await orderRes.json().catch(() => ({}));
        if (!orderRes.ok || !orderData.id) {
          return {
            success: false,
            error: `فشل تسجيل الطلب لدى Paymob (HTTP ${orderRes.status}): ${
              orderData.detail || orderData.message || JSON.stringify(orderData)
            }`,
          };
        }
        const paymobOrderId = orderData.id;

        // Step 3: Generate Payment Key
        const targetIntegrationId = integrationIds[0];
        if (!targetIntegrationId) {
          return {
            success: false,
            error: "يرجى إدخال معرف الربط (Card Integration ID أو Wallet Integration ID) في إعدادات Paymob.",
          };
        }

        const keyRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth_token: authToken,
            amount_cents: String(amountCents),
            expiration: 3600,
            order_id: paymobOrderId,
            billing_data: billingData,
            currency,
            integration_id: Number(targetIntegrationId),
            lock_order_when_paid: "false",
          }),
        });
        const keyData = await keyRes.json().catch(() => ({}));
        if (!keyRes.ok || !keyData.token) {
          return {
            success: false,
            error: `فشل إصدار مفتاح الدفع Payment Key من Paymob (HTTP ${keyRes.status}): ${
              keyData.detail || keyData.message || JSON.stringify(keyData)
            }`,
          };
        }
        const paymentToken: string = keyData.token;

        // Step 4A: If Mobile Wallet payment requested via Paymob
        if (wantsWallet && params.walletPhone) {
          const payRes = await fetch("https://accept.paymob.com/api/acceptance/payments/pay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: {
                identifier: params.walletPhone.replace(/\D/g, ""),
                subtype: "WALLET",
              },
              payment_token: paymentToken,
            }),
          });
          const payData = await payRes.json().catch(() => ({}));
          const redirectUrl = payData.redirect_url || payData.iframe_redirection_url;
          if (payRes.ok && redirectUrl) {
            return {
              success: true,
              mode: "classic_v2",
              paymentUrl: redirectUrl,
              iframeUrl: redirectUrl,
              paymobOrderId: String(paymobOrderId),
              transactionId: payData.id ? String(payData.id) : undefined,
            };
          }
          return {
            success: false,
            error: `فشل توجيه الدفع للمحفظة عبر Paymob: ${
              payData.detail || payData.data?.message || JSON.stringify(payData)
            }`,
          };
        }

        // Step 4B: Card Iframe URL
        if (!config.iframeId) {
          return {
            success: false,
            error:
              "تم إصدار مفتاح الدفع من Paymob بنجاح، ولكن يرجى تحديد رقم الـ Iframe ID في إعدادات Paymob لفتح شاشة البطاقة البنكية.",
          };
        }

        const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${encodeURIComponent(
          config.iframeId
        )}?payment_token=${encodeURIComponent(paymentToken)}`;

        return {
          success: true,
          mode: "classic_v2",
          paymentUrl: iframeUrl,
          iframeUrl,
          paymobOrderId: String(paymobOrderId),
        };
      } catch (err: any) {
        return {
          success: false,
          error: `حدث خطأ أثناء الاتصال بخوادم Paymob: ${err.message}`,
        };
      }
    }

    return {
      success: false,
      error: "مفاتيح Paymob غير مكتملة.",
    };
  }
}

export const paymobService = new PaymobService();
export default paymobService;

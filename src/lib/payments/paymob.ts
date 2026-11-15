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

    const isPlaceholder = (val?: string) =>
      !val ||
      val.includes("sample") ||
      val.includes("12345") ||
      val.includes("sulaf_gateway_accept");

    const envApiKey = !isPlaceholder(process.env.PAYMOB_API_KEY) ? process.env.PAYMOB_API_KEY! : "";
    const envSecretKey = !isPlaceholder(process.env.PAYMOB_SECRET_KEY) ? process.env.PAYMOB_SECRET_KEY! : "";
    const envPublicKey = !isPlaceholder(process.env.PAYMOB_PUBLIC_KEY) ? process.env.PAYMOB_PUBLIC_KEY! : "";
    const envHmac = !isPlaceholder(process.env.PAYMOB_HMAC_SECRET) ? process.env.PAYMOB_HMAC_SECRET! : "";
    const envCardId = !isPlaceholder(process.env.PAYMOB_INTEGRATION_CARD_ID)
      ? process.env.PAYMOB_INTEGRATION_CARD_ID!
      : "";
    const envWalletId = !isPlaceholder(process.env.PAYMOB_INTEGRATION_WALLET_ID)
      ? process.env.PAYMOB_INTEGRATION_WALLET_ID!
      : "";
    const envIframeId = !isPlaceholder(process.env.PAYMOB_IFRAME_ID) ? process.env.PAYMOB_IFRAME_ID! : "";

    return {
      enabled: overrides?.enabled ?? storedPaymob.enabled ?? true,
      isSandbox: overrides?.isSandbox ?? storedPaymob.isSandbox ?? false,
      apiKey: (overrides?.apiKey ?? storedPaymob.apiKey ?? envApiKey ?? "").trim(),
      secretKey: (overrides?.secretKey ?? storedPaymob.secretKey ?? envSecretKey ?? "").trim(),
      publicKey: (overrides?.publicKey ?? storedPaymob.publicKey ?? envPublicKey ?? "").trim(),
      hmacSecret: (overrides?.hmacSecret ?? storedPaymob.hmacSecret ?? envHmac ?? "").trim(),
      cardIntegrationId: String(
        overrides?.cardIntegrationId ?? storedPaymob.cardIntegrationId ?? envCardId ?? ""
      ).trim(),
      walletIntegrationId: String(
        overrides?.walletIntegrationId ?? storedPaymob.walletIntegrationId ?? envWalletId ?? ""
      ).trim(),
      iframeId: String(overrides?.iframeId ?? storedPaymob.iframeId ?? envIframeId ?? "").trim(),
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
          return String(payload["order.id"] ?? payload.order ?? "");
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
    const redirectionUrl = `${origin}/checkout?paymob_return=1&order=${encodeURIComponent(params.orderNumber)}`;

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
    const integrationIds: number[] = [];
    if (wantsWallet && Number(config.walletIntegrationId) > 0) {
      integrationIds.push(Number(config.walletIntegrationId));
    }
    if (!wantsWallet && Number(config.cardIntegrationId) > 0) {
      integrationIds.push(Number(config.cardIntegrationId));
    }
    if (integrationIds.length === 0) {
      if (Number(config.cardIntegrationId) > 0) integrationIds.push(Number(config.cardIntegrationId));
      if (Number(config.walletIntegrationId) > 0) integrationIds.push(Number(config.walletIntegrationId));
    }

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
        const intentionPayload: Record<string, any> = {
          amount: amountCents,
          currency,
          payment_methods: integrationIds.length > 0 ? integrationIds : ["card"],
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
          special_reference: params.orderNumber,
          notification_url: notificationUrl,
          redirection_url: redirectionUrl,
        };

        const response = await fetch("https://accept.paymob.com/v1/intention/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${intentionSecret}`,
          },
          body: JSON.stringify(intentionPayload),
        });

        const data = await response.json().catch(() => ({}));
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
        const uniqueMerchantOrderId = `${params.orderNumber}__${Date.now().toString().slice(-5)}`;
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

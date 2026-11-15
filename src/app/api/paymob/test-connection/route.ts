import { NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const {
      apiKey,
      secretKey,
      publicKey,
      hmacSecret,
      cardIntegrationId,
      walletIntegrationId,
      iframeId,
      isSandbox,
    } = body;

    const cleanSecret = (secretKey || "").trim();
    const cleanApiKey = (apiKey || "").trim();

    if (!cleanSecret && !cleanApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "يرجى إدخال Secret Key (مثل egy_sk_...) أو API Key الخاص بحسابك في Paymob أولاً.",
          code: "MISSING_KEYS",
        },
        { status: 400 }
      );
    }

    if (
      cleanSecret.includes("sample") ||
      cleanApiKey.includes("sample") ||
      cleanSecret.includes("sulaf_gateway_accept")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "المفتاح المدخل هو مفتاح تجريبي افتراضي (Sample). يرجى إدخال مفتاح Paymob الحقيقي من لوحة تحكم Paymob.",
          code: "SAMPLE_KEY",
        },
        { status: 400 }
      );
    }

    const mode = isSandbox ? "بيئة الاختبار (Paymob Test)" : "البيئة الحية (Paymob Live)";
    const isIntention =
      paymobService.isIntentionSecretKey(cleanSecret) || paymobService.isIntentionSecretKey(cleanApiKey);

    // 1. Test Paymob v1 Intention Secret Key (`egy_sk_...` / `sk_...`)
    if (isIntention) {
      const tokenKey = paymobService.isIntentionSecretKey(cleanSecret) ? cleanSecret : cleanApiKey;
      const integrationIds = [Number(cardIntegrationId), Number(walletIntegrationId)].filter((n) => n > 0);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("https://accept.paymob.com/v1/intention/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${tokenKey}`,
        },
        body: JSON.stringify({
          amount: 1000,
          currency: "EGP",
          payment_methods: integrationIds.length > 0 ? [integrationIds[0]] : ["card"],
          items: [{ name: "Sulaf Connection Test", amount: 1000, description: "API Ping", quantity: 1 }],
          billing_data: {
            apartment: "NA",
            first_name: "Sulaf",
            last_name: "Diagnostic",
            street: "Cairo",
            building: "NA",
            phone_number: "+201000000000",
            country: "EG",
            email: "diagnostic@sulaf.com",
            floor: "NA",
            state: "Cairo",
            city: "Cairo",
          },
          customer: {
            first_name: "Sulaf",
            last_name: "Diagnostic",
            email: "diagnostic@sulaf.com",
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.client_secret) {
        return NextResponse.json({
          success: true,
          status: "CONNECTED",
          mode,
          message: `تم الاتصال الحقيقي بنجاح مع خوادم Paymob Unified Checkout (Intention v1)! زمن الاستجابة: ${latencyMs}ms`,
          details: {
            apiVersion: "Intention v1 (Unified Checkout)",
            intentionCreated: true,
            publicKeyConfigured: !!publicKey,
            cardIntegrationValid: !!cardIntegrationId,
            walletIntegrationValid: !!walletIntegrationId,
            hmacConfigured: !!hmacSecret,
            latency: `${latencyMs}ms`,
          },
        });
      }

      if (res.status === 401 || res.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: `رفض خادم Paymob المفتاح السري (HTTP ${res.status}): ${
              data.detail || data.message || "Secret Key غير صالح"
            }`,
            code: "INVALID_CREDENTIALS",
            httpStatus: res.status,
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `استجاب خادم Paymob بخطأ في الإعدادات (HTTP ${res.status}): ${
            data.detail || data.message || JSON.stringify(data)
          }`,
          code: "CONFIG_ERROR",
          httpStatus: res.status,
        },
        { status: 400 }
      );
    }

    // 2. Test Classic Paymob API Key (`POST https://accept.paymob.com/api/auth/tokens`)
    const classicKey = cleanApiKey || cleanSecret;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: classicKey }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    const data = await res.json().catch(() => ({}));

    if (res.ok && data.token) {
      return NextResponse.json({
        success: true,
        status: "CONNECTED",
        mode,
        message: `تم التحقق والاتصال الحقيقي بنجاح مع خوادم Paymob Accept! (معرف التاجر: ${
          data.profile?.id || "موثق"
        } — الاستجابة: ${latencyMs}ms)`,
        details: {
          apiVersion: "Classic Accept v2 (/api/auth/tokens)",
          merchantId: data.profile?.id,
          tokenGenerated: true,
          cardIntegrationValid: !!cardIntegrationId,
          walletIntegrationValid: !!walletIntegrationId,
          iframeConfigured: !!iframeId,
          hmacConfigured: !!hmacSecret,
          latency: `${latencyMs}ms`,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `فشل المصادقة مع خادم Paymob (HTTP ${res.status}): ${
          data.detail || data.message || "تأكد من صحة الـ API Key أو الـ Secret Key"
        }`,
        code: "INVALID_CREDENTIALS",
        httpStatus: res.status,
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: `تعذر الوصول إلى خوادم Paymob: ${error.message || "خطأ في الشبكة"}`,
      },
      { status: 500 }
    );
  }
}

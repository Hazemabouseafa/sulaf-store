import { NextRequest, NextResponse } from "next/server";
import { Sha7nawyService } from "@/lib/payments/sha7nawy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { publicKey, secretKey, baseUrl } = body;

    const targetUrl = (baseUrl || "https://gate.sha7nawy.com").replace(/\/+$/, "");

    // If sandbox / demo keys
    if (!publicKey || publicKey.startsWith("YOUR_") || publicKey === "test_key") {
      return NextResponse.json({
        success: true,
        message: "تم فحص إعدادات بوابة شحناوي (الوضع التجريبي الافتراضي نشط ويعمل بنجاح)",
        mode: "sandbox",
      });
    }

    // Try a ping / check using the provided credentials
    try {
      const res = await fetch(`${targetUrl}/api/v2/payment/info/test-ping`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: secretKey || publicKey,
        },
      });

      // Even a 404 or specific SH-xxxx code means the server is reachable and responsive
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json({
          success: false,
          error: "المفاتيح غير صحيحة أو غير مصرح بها (رمز 401/403). يرجى التأكد من المفتاح العام والسري من لوحة شحناوي.",
        });
      }

      return NextResponse.json({
        success: true,
        message: "تم الاتصال بسيرفر بوابة شحناوي بنجاح (Server Reachable)",
        status: res.status,
      });
    } catch (networkErr: any) {
      return NextResponse.json({
        success: false,
        error: `تعذر الوصول إلى سيرفر شحناوي (${networkErr.message}). تأكد من رابط Base URL واتصال الإنترنت.`,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "حدث خطأ أثناء فحص الاتصال" },
      { status: 500 }
    );
  }
}

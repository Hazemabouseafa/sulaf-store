import { NextRequest, NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      amountEgp,
      customerName,
      customerPhone,
      customerEmail,
      governorate,
      city,
      street,
      building,
      paymentMethodType,
      walletPhone,
    } = body;

    if (!orderNumber || !amountEgp || Number(amountEgp) <= 0) {
      return NextResponse.json(
        { success: false, error: "بيانات الطلب أو المبلغ غير صالحة لإنشاء جلسة الدفع." },
        { status: 400 }
      );
    }

    const nameParts = String(customerName || "عميل سلاف").trim().split(/\s+/);
    const firstName = nameParts[0] || "عميل";
    const lastName = nameParts.slice(1).join(" ") || "سلاف";

    const originUrl =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.COOLIFY_URL ||
      new URL(req.url).origin;

    const result = await paymobService.createIntention({
      amountCents: Math.round(Number(amountEgp) * 100),
      currency: "EGP",
      orderNumber: String(orderNumber),
      customer: {
        firstName,
        lastName,
        email: customerEmail || "customer@sulaf.com",
        phone: customerPhone || "+201000000000",
      },
      billingAddress: {
        street: street || "القاهرة",
        building: building || "NA",
        city: city || governorate || "القاهرة",
        governorate: governorate || "القاهرة",
        country: "EG",
      },
      paymentMethods: paymentMethodType === "wallet" ? ["wallet"] : ["card"],
      walletPhone,
      originUrl,
    });

    if (!result.success || !result.paymentUrl) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "تعذر إنشاء رابط الدفع عبر بوابة Paymob.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: result.mode,
      paymentUrl: result.paymentUrl,
      iframeUrl: result.iframeUrl,
      clientSecret: result.clientSecret,
      transactionId: result.transactionId,
      paymobOrderId: result.paymobOrderId,
    });
  } catch (err: any) {
    console.error("[Paymob Create API Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "خطأ أثناء الاتصال ببوابة Paymob." },
      { status: 500 }
    );
  }
}

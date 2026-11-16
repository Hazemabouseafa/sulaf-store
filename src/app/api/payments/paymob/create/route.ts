import { NextRequest, NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import { findOrderIndex, withOrdersFileLock } from "@/lib/shipping/order-dispatch";

export const dynamic = "force-dynamic";

function resolvePublicOrigin(req: NextRequest): string {
  const originHeader = req.headers.get("origin");
  if (originHeader && /^https?:\/\//i.test(originHeader)) {
    return originHeader.replace(/\/+$/, "");
  }

  const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const forwardedProto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  if (
    forwardedHost &&
    !forwardedHost.startsWith("0.0.0.0") &&
    !forwardedHost.startsWith("localhost")
  ) {
    return `${forwardedProto}://${forwardedHost}`.replace(/\/+$/, "");
  }

  const envUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.COOLIFY_URL || "")
    .split(",")[0]
    .trim();
  if (envUrl) {
    return (/^https?:\/\//i.test(envUrl) ? envUrl : `https://${envUrl}`).replace(/\/+$/, "");
  }

  return new URL(req.url).origin;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
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

    const originUrl = resolvePublicOrigin(req);

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

    // Persist paymobOrderId on the order record so webhook/redirect matching always succeeds.
    if (result.paymobOrderId) {
      try {
        await withOrdersFileLock(() => {
          const orders = readJsonFile<OrderRecord[]>("orders.json", []);
          const idx = findOrderIndex(orders, [orderId, orderNumber]);
          if (idx !== -1) {
            orders[idx].paymobOrderId = String(result.paymobOrderId);
            writeJsonFile("orders.json", orders);
          }
        });
      } catch (e) {
        console.warn("[Paymob Create] Failed to save paymobOrderId:", e);
      }
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

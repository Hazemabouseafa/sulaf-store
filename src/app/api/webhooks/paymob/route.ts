export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";
import { updateOrderStatus, getOrderById } from "@/lib/orders/order-store";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const hmacHeader = req.nextUrl.searchParams.get("hmac") || req.headers.get("x-paymob-hmac") || "";

    // Verify HMAC
    const isValid = paymobService.verifyHmac(payload.obj || payload, hmacHeader);
    if (!isValid) {
      console.warn("[Paymob Webhook] Invalid HMAC signature detected!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const transaction = payload.obj || payload;
    const orderNumber = transaction.order?.merchant_order_id || transaction.special_reference;
    const success = transaction.success === true;

    console.log(`[Paymob Webhook] Received status for order ${orderNumber}: success=${success}`);

    if (orderNumber && success) {
      const order = getOrderById(orderNumber);
      if (order) {
        updateOrderStatus(order.id, {
          paymentStatus: order.isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID",
          orderStatus: "PROCESSING",
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Paymob Webhook Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

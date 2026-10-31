export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";

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

    if (orderNumber) {
      const orders = readJsonFile<OrderRecord[]>("orders.json", []);
      const cleanRef = String(orderNumber).trim().toLowerCase();
      const idx = orders.findIndex(
        (o) =>
          (o.orderNumber || "").toLowerCase() === cleanRef ||
          (o.id || "").toLowerCase() === cleanRef
      );
      if (idx !== -1) {
        if (success) {
          orders[idx].paymentStatus = orders[idx].isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID";
          orders[idx].orderStatus = "PROCESSING";
        } else {
          orders[idx].paymentStatus = "FAILED";
        }
        writeJsonFile("orders.json", orders);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Paymob Webhook Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

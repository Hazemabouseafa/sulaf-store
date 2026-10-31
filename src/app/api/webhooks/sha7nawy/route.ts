import { NextRequest, NextResponse } from "next/server";
import { Sha7nawyService } from "@/lib/payments/sha7nawy";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-sha7nawy-signature-256") || "";
    const eventType = req.headers.get("x-sha7nawy-event") || "";

    const sha7nawy = new Sha7nawyService();

    // Verify HMAC-SHA256 signature if secretKey is set
    const isValid = sha7nawy.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[Sha7nawy Webhook] Invalid HMAC signature received.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const event = eventType || payload.event;
    const data = payload.data || {};
    const orderId = data.order_id;
    const reference = data.reference;

    console.log(`[Sha7nawy Webhook] Received ${event} for order: ${orderId} (ref: ${reference})`);

    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const idx = orders.findIndex(
      (o) =>
        o.orderNumber === orderId ||
        o.id === orderId ||
        (o.notes && o.notes.includes(reference))
    );

    if (idx !== -1) {
      if (event === "transaction.completed" || data.status === "completed") {
        orders[idx].paymentStatus = orders[idx].isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID";
        orders[idx].orderStatus = "PROCESSING";
        orders[idx].notes = `${orders[idx].notes || ""}\n[Sha7nawy Webhook] تم استلام إشعار الدفع بنجاح (المعاملة: ${data.transaction_id || reference})`;
      } else if (event === "transaction.rejected" || data.status === "rejected") {
        orders[idx].paymentStatus = "FAILED";
        orders[idx].notes = `${orders[idx].notes || ""}\n[Sha7nawy Webhook] تم رفض العملية من مزود الخدمة`;
      }
      writeJsonFile("orders.json", orders);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error("[Sha7nawy Webhook Handler Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

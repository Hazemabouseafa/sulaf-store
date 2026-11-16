export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";
import { handlePaymobPaymentConfirmation } from "@/lib/shipping/order-dispatch";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const hmacHeader =
      req.nextUrl.searchParams.get("hmac") ||
      payload.hmac ||
      req.headers.get("x-paymob-hmac") ||
      "";

    // Ignore non-transaction events such as card token saves or standalone notifications
    if (payload.type && payload.type !== "TRANSACTION") {
      return NextResponse.json({ received: true, ignored: payload.type });
    }

    const transaction = payload.obj || payload;

    // Verify HMAC-SHA512 signature
    const isValid = paymobService.verifyHmac(transaction, hmacHeader);
    if (!isValid) {
      console.warn("[Paymob Webhook] Invalid HMAC signature detected!");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const orderLookupKeys = [
      transaction.order?.merchant_order_id,
      transaction.special_reference,
      transaction.merchant_order_id,
      transaction.payment_key_claims?.extra?.sulaf_order_number,
    ].filter(Boolean);

    const paymobOrderId =
      transaction.order?.id !== undefined && transaction.order?.id !== null
        ? String(transaction.order.id)
        : undefined;
    const transactionId =
      transaction.id !== undefined && transaction.id !== null ? String(transaction.id) : undefined;
    const isPending = transaction.pending === true || String(transaction.pending) === "true";
    const isSuccess = transaction.success === true || String(transaction.success) === "true";

    console.log(
      `[Paymob Webhook] Received status for order keys [${orderLookupKeys.join(",")}] (paymobOrderId=${paymobOrderId}): success=${isSuccess}, pending=${isPending}`
    );

    const result = await handlePaymobPaymentConfirmation({
      orderLookupKeys,
      paymobOrderId,
      isSuccess,
      isPending,
      transactionId,
      source: "WEBHOOK",
    });

    if (result.stoxDispatch) {
      if (result.stoxDispatch.success) {
        console.log(
          `[Paymob Webhook] Auto-dispatched order ${result.order?.orderNumber} to STOX: AWB=${result.stoxDispatch.trackingNumber}`
        );
      } else {
        console.error(
          `[Paymob Webhook] Auto-dispatch to STOX failed for ${result.order?.orderNumber}: ${result.stoxDispatch.error}`
        );
      }
    }

    return NextResponse.json({
      received: true,
      found: result.found,
      pending: result.pending,
      orderStatus: result.order?.orderStatus,
      paymentStatus: result.order?.paymentStatus,
      stoxTrackingNumber: result.order?.stoxTrackingNumber,
    });
  } catch (err: any) {
    console.error("[Paymob Webhook Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

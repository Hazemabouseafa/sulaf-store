import { NextRequest, NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";
import { readJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import {
  findOrderIndex,
  handlePaymobPaymentConfirmation,
} from "@/lib/shipping/order-dispatch";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const queryParams: Record<string, string> = body.queryParams || {};

    const orderLookupKeys = [
      body.orderNumber,
      queryParams.sulaf_order,
      queryParams.merchant_order_id,
      queryParams.special_reference,
      queryParams.order,
    ].filter(Boolean);

    const paymobOrderId = queryParams.order || queryParams.order_id || undefined;

    if (orderLookupKeys.length === 0 && !paymobOrderId) {
      return NextResponse.json({ success: false, error: "رقم الطلب مفقود." }, { status: 400 });
    }

    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const existingIdx = findOrderIndex(orders, orderLookupKeys, paymobOrderId);
    if (existingIdx === -1) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    const existingOrder = orders[existingIdx];
    const alreadyPaidByWebhook =
      existingOrder.paymentStatus === "FULLY_PAID" ||
      existingOrder.paymentStatus === "DEPOSIT_PAID";

    const receivedHmac = (queryParams.hmac || "").trim();
    const config = paymobService.getConfig();

    if (receivedHmac && Object.keys(queryParams).length > 3) {
      const valid = paymobService.verifyHmac(queryParams, receivedHmac);
      if (!valid && !alreadyPaidByWebhook) {
        return NextResponse.json(
          { success: false, error: "توقيع HMAC غير مطابق لبيانات Paymob." },
          { status: 401 }
        );
      }
    }

    let isPending = queryParams.pending === "true" || String(queryParams.pending) === "true";
    let isSuccess =
      alreadyPaidByWebhook ||
      queryParams.success === "true" ||
      String(queryParams.success) === "true" ||
      body.success === true;
    let verifiedTransactionId = queryParams.id ? String(queryParams.id) : existingOrder.paymobTransactionId;

    // Security guard: never accept unauthenticated ?success=true URL tampering when hmacSecret is set
    if (!alreadyPaidByWebhook && isSuccess && config.hmacSecret && !receivedHmac) {
      const serverCheck = await paymobService.verifyTransactionServerSide({
        transactionId: verifiedTransactionId,
        paymobOrderId: paymobOrderId || existingOrder.paymobOrderId,
        merchantOrderId: queryParams.merchant_order_id || queryParams.special_reference,
      });

      if (serverCheck?.verified) {
        isSuccess = serverCheck.success;
        isPending = serverCheck.pending;
        verifiedTransactionId = serverCheck.transactionId || verifiedTransactionId;
      } else {
        return NextResponse.json(
          { success: false, error: "تعذر التحقق من توقيع Paymob HMAC." },
          { status: 401 }
        );
      }
    }

    const result = await handlePaymobPaymentConfirmation({
      orderLookupKeys: [existingOrder.id, ...orderLookupKeys],
      paymobOrderId: paymobOrderId || existingOrder.paymobOrderId,
      isSuccess,
      isPending,
      transactionId: verifiedTransactionId,
      source: "VERIFY",
    });

    return NextResponse.json({
      success: Boolean(isSuccess && !isPending),
      pending: result.pending,
      order: result.order || existingOrder,
      stoxDispatch: result.stoxDispatch,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

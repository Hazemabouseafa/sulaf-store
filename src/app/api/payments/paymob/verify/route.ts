import { NextRequest, NextResponse } from "next/server";
import { paymobService } from "@/lib/payments/paymob";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const queryParams: Record<string, string> = body.queryParams || {};
    const orderNumberRaw =
      body.orderNumber ||
      queryParams.order ||
      queryParams.merchant_order_id ||
      queryParams.special_reference ||
      "";
    const orderNumber = String(orderNumberRaw).split("__")[0].trim();

    if (!orderNumber) {
      return NextResponse.json({ success: false, error: "رقم الطلب مفقود." }, { status: 400 });
    }

    const receivedHmac = queryParams.hmac || "";
    if (receivedHmac && Object.keys(queryParams).length > 3) {
      const valid = paymobService.verifyHmac(queryParams, receivedHmac);
      if (!valid) {
        return NextResponse.json(
          { success: false, error: "توقيع HMAC غير مطابق لبيانات Paymob." },
          { status: 401 }
        );
      }
    }

    const isSuccess =
      queryParams.success === "true" ||
      String(queryParams.success) === "true" ||
      body.success === true;

    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const cleanRef = orderNumber.toLowerCase();
    const idx = orders.findIndex(
      (o) =>
        (o.orderNumber || "").toLowerCase() === cleanRef ||
        (o.id || "").toLowerCase() === cleanRef
    );

    if (idx === -1) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    if (isSuccess) {
      orders[idx].paymentStatus = orders[idx].isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID";
      const txId = queryParams.id || "";
      if (txId && !(orders[idx].notes || "").includes(txId)) {
        orders[idx].notes = `${orders[idx].notes || ""}\n[Paymob] تم الدفع الإلكتروني بنجاح (معاملة رقم: ${txId})`.trim();
      }
      writeJsonFile("orders.json", orders);
    } else if (queryParams.success === "false") {
      orders[idx].paymentStatus = "FAILED";
      writeJsonFile("orders.json", orders);
    }

    return NextResponse.json({
      success: isSuccess,
      order: orders[idx],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

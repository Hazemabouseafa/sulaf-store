import { NextRequest, NextResponse } from "next/server";
import { Sha7nawyService } from "@/lib/payments/sha7nawy";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reference, orderId } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, error: "الكود المرجعي reference مطلوب لتأكيد الدفع" },
        { status: 400 }
      );
    }

    const sha7nawy = new Sha7nawyService();
    const result = await sha7nawy.confirmPayment(reference);

    if (result.success && result.data?.status === "completed") {
      try {
        const orders = readJsonFile<OrderRecord[]>("orders.json", []);
        const idx = orders.findIndex(
          (o) =>
            o.id === orderId ||
            o.orderNumber === orderId ||
            (o.notes && o.notes.includes(reference))
        );

        if (idx !== -1) {
          orders[idx].paymentStatus = orders[idx].isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID";
          orders[idx].orderStatus = "PROCESSING";
          orders[idx].notes = `${orders[idx].notes || ""}\n[شحناوي] تم تأكيد سحب الدفعة بنجاح (مرجع: ${reference} - معاملة: ${result.data.transaction_id || "N/A"})`;
          writeJsonFile("orders.json", orders);
        }
      } catch (err) {
        console.warn("Order confirm update warning:", err);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Sha7nawy confirm route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ أثناء تأكيد العملية" },
      { status: 500 }
    );
  }
}

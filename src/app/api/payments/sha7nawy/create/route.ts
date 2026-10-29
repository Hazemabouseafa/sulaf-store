import { NextRequest, NextResponse } from "next/server";
import { Sha7nawyService, Sha7nawyWalletMethod } from "@/lib/payments/sha7nawy";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderNumber, number, amount, method, customerName, customerEmail } = body;

    if (!orderId || !number || !amount || !method) {
      return NextResponse.json(
        { success: false, error: "جميع الحقول الإلزامية مطلوبة (معرف الطلب، رقم الهاتف، القيمة، طريقة المحفظة)" },
        { status: 400 }
      );
    }

    const sha7nawy = new Sha7nawyService();
    const result = await sha7nawy.createPayment({
      orderId: orderNumber || orderId,
      number,
      amount: Number(amount),
      method: method as Sha7nawyWalletMethod,
      customerName: customerName || "عميلة سُـلاف",
      customerEmail: customerEmail || "",
      description: `سُـلاف | طلب رقم ${orderNumber || orderId}`,
      metadata: {
        internalOrderId: orderId,
        orderNumber: orderNumber || orderId,
      },
    });

    if (result.success && result.data) {
      // Record transaction reference in the order
      try {
        const orders = readJsonFile<OrderRecord[]>("orders.json", []);
        const idx = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
        if (idx !== -1) {
          orders[idx].notes = `${orders[idx].notes || ""}\n[شحناوي] تم إنشاء مطالبة دفع (${method}) برقم مرجعي: ${result.data.reference}`;
          writeJsonFile("orders.json", orders);
        }
      } catch (e) {
        console.warn("Order note update warning:", e);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Sha7nawy create payment route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "حدث خطأ غير متوقع أثناء بدء الدفع بالمحفظة" },
      { status: 500 }
    );
  }
}

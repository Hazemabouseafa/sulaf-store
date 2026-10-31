import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import { ProductData } from "@/lib/data/mock-data";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const cleanId = id.trim().toLowerCase();
    const order = orders.find(
      (o) =>
        (o.id || "").toLowerCase() === cleanId ||
        (o.orderNumber || "").toLowerCase() === cleanId ||
        o.stoxTrackingNumber?.toLowerCase() === cleanId ||
        (o.customerPhone || "").replace(/\s+/g, "") === cleanId.replace(/\s+/g, "")
    );

    if (!order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const index = orders.findIndex(
      (o) => o.id === id || (o.orderNumber || "").toLowerCase() === id.toLowerCase()
    );

    if (index === -1) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    const previousStatus = orders[index].orderStatus;
    const newStatus = body.orderStatus;

    // Handle stock restoration if order was cancelled, or re-deduction if un-cancelled
    if (
      (newStatus === "CANCELLED" && previousStatus !== "CANCELLED") ||
      (previousStatus === "CANCELLED" && newStatus && newStatus !== "CANCELLED")
    ) {
      const sign = newStatus === "CANCELLED" ? 1 : -1;
      const products = readJsonFile<ProductData[]>("products.json", []);
      for (const item of orders[index].items || []) {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const prodIndex = products.findIndex((p) => p.id === item.productId || p.slug === item.productId);
        if (prodIndex !== -1) {
          const prod = products[prodIndex];
          prod.stock = Math.max(0, (Number(prod.stock) || 0) + sign * qty);
          if (Array.isArray(prod.variants) && prod.variants.length > 0) {
            const varIdx = item.variantId
              ? prod.variants.findIndex((v) => v.id === item.variantId)
              : item.variantTitle
              ? prod.variants.findIndex((v) => v.titleAr === item.variantTitle || v.titleEn === item.variantTitle)
              : 0;
            const targetIdx = varIdx !== -1 ? varIdx : 0;
            if (prod.variants.length === 1) {
              prod.variants[0].stock = prod.stock;
            } else if (prod.variants[targetIdx]) {
              prod.variants[targetIdx].stock = Math.max(
                0,
                (Number(prod.variants[targetIdx].stock) || 0) + sign * qty
              );
            }
          }
        }
      }
      writeJsonFile("products.json", products);
    }

    // When an order is marked DELIVERED, mark its payment as FULLY_PAID and remaining COD as 0 (unless explicitly overridden)
    const autoPaymentUpdates =
      newStatus === "DELIVERED" && !body.paymentStatus
        ? { paymentStatus: "FULLY_PAID" as const, remainingCodAmount: 0 }
        : {};

    // Merge updates
    orders[index] = {
      ...orders[index],
      ...autoPaymentUpdates,
      ...body,
    };

    writeJsonFile("orders.json", orders);

    return NextResponse.json({
      success: true,
      message: "تم تحديث بيانات الطلب بنجاح.",
      order: orders[index],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const filtered = orders.filter(
      (o) => o.id !== id && o.orderNumber.toLowerCase() !== id.toLowerCase()
    );

    if (filtered.length === orders.length) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    writeJsonFile("orders.json", filtered);
    return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import { ProductData } from "@/lib/data/mock-data";
import {
  dispatchOrderToShipping,
  withOrdersFileLock,
} from "@/lib/shipping/order-dispatch";

export const dynamic = "force-dynamic";

function adjustProductInventoryForOrderStatus(
  order: OrderRecord,
  sign: 1 | -1
): void {
  const products = readJsonFile<ProductData[]>("products.json", []);
  for (const item of order.items || []) {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const prodIndex = products.findIndex(
      (p) => p.id === item.productId || p.slug === item.productId
    );
    if (prodIndex !== -1) {
      const prod = products[prodIndex];
      prod.stock = Math.max(0, (Number(prod.stock) || 0) + sign * qty);
      if (Array.isArray(prod.variants) && prod.variants.length > 0) {
        const varIdx = item.variantId
          ? prod.variants.findIndex((v) => v.id === item.variantId)
          : item.variantTitle
          ? prod.variants.findIndex(
              (v) => v.titleAr === item.variantTitle || v.titleEn === item.variantTitle
            )
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
    const { dispatchToStox, forceRedispatch, ...orderFields } = body;
    const newStatus = body.orderStatus;

    // Dispatch automatically when Admin marks order as PROCESSING,
    // or when Admin clicks manual dispatchToStox / forceRedispatch.
    // (Paymob orders also dispatch automatically upon payment confirmation via handlePaymobPaymentConfirmation.)
    const result = await dispatchOrderToShipping([id], {
      forceRedispatch: forceRedispatch === true,
      shouldDispatch: (targetOrder) =>
        dispatchToStox === true ||
        forceRedispatch === true ||
        (newStatus === "PROCESSING" &&
          (!targetOrder.stoxTrackingNumber || targetOrder.stoxStatus === "FAILED")),
      preDispatchPatch: (existing) => {
        const previousStatus = existing.orderStatus;
        if (
          (newStatus === "CANCELLED" && previousStatus !== "CANCELLED") ||
          (previousStatus === "CANCELLED" && newStatus && newStatus !== "CANCELLED")
        ) {
          const sign: 1 | -1 = newStatus === "CANCELLED" ? 1 : -1;
          adjustProductInventoryForOrderStatus(existing, sign);
        }

        const autoPaymentUpdates =
          newStatus === "DELIVERED" && !body.paymentStatus
            ? { paymentStatus: "FULLY_PAID" as const, remainingCodAmount: 0 }
            : {};

        return {
          ...autoPaymentUpdates,
          ...orderFields,
        };
      },
    });

    if (!result.found || !result.order) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    const stoxDispatch = result.stoxDispatch;

    return NextResponse.json({
      success: true,
      message: stoxDispatch
        ? stoxDispatch.success
          ? `تم تحديث الطلب إلى قيد التجهيز وإرساله إلى ${stoxDispatch.providerName} بنجاح (بوليصة: ${stoxDispatch.trackingNumber})`
          : `تم تحديث حالة الطلب، ولكن تعذر الإرسال لـ ${stoxDispatch.providerName}: ${stoxDispatch.error}`
        : "تم تحديث بيانات الطلب بنجاح.",
      order: result.order,
      stoxDispatch,
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
    const deleted = await withOrdersFileLock(() => {
      const orders = readJsonFile<OrderRecord[]>("orders.json", []);
      const filtered = orders.filter(
        (o) => o.id !== id && o.orderNumber.toLowerCase() !== id.toLowerCase()
      );

      if (filtered.length === orders.length) {
        return false;
      }

      writeJsonFile("orders.json", filtered);
      return true;
    });

    if (!deleted) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

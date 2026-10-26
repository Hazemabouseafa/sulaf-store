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
        o.id.toLowerCase() === cleanId ||
        o.orderNumber.toLowerCase() === cleanId ||
        o.stoxTrackingNumber?.toLowerCase() === cleanId ||
        o.customerPhone.replace(/\s+/g, "") === cleanId.replace(/\s+/g, "")
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
      (o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase()
    );

    if (index === -1) {
      return NextResponse.json({ success: false, error: "الطلب غير موجود." }, { status: 404 });
    }

    const previousStatus = orders[index].orderStatus;
    const newStatus = body.orderStatus;

    // Handle stock restoration if order was cancelled
    if (newStatus === "CANCELLED" && previousStatus !== "CANCELLED") {
      const products = readJsonFile<ProductData[]>("products.json", []);
      for (const item of orders[index].items) {
        const prodIndex = products.findIndex((p) => p.id === item.productId);
        if (prodIndex !== -1) {
          products[prodIndex].stock += item.quantity || 1;
        }
      }
      writeJsonFile("products.json", products);
    }

    // Merge updates
    orders[index] = {
      ...orders[index],
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

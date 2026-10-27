import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import { ProductData } from "@/lib/data/mock-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let filtered = [...orders];

    if (status && status !== "ALL") {
      filtered = filtered.filter((o) => o.orderStatus === status);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.governorate.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, count: filtered.length, orders: filtered });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "بيانات الطلب غير مكتملة." },
        { status: 400 }
      );
    }

    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const products = readJsonFile<ProductData[]>("products.json", []);

    const orderNumber = body.orderNumber || `SLF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      ...body,
      id: body.id || `ord-${Date.now()}`,
      orderNumber,
      orderStatus: body.orderStatus || "PENDING_CONFIRMATION",
      paymentStatus: body.paymentStatus || (body.paymentMethod === "CARD" ? "PAID" : "PENDING"),
      createdAt: body.createdAt || new Date().toISOString(),
    };

    // Auto-deduct stock from purchased products
    let productsUpdated = false;
    for (const item of body.items) {
      const prodIndex = products.findIndex((p) => p.id === item.productId);
      if (prodIndex !== -1) {
        products[prodIndex].stock = Math.max(0, products[prodIndex].stock - (item.quantity || 1));
        if (products[prodIndex].variants?.[0]) {
          products[prodIndex].variants[0].stock = products[prodIndex].stock;
        }
        productsUpdated = true;
      }
    }
    if (productsUpdated) {
      writeJsonFile("products.json", products);
    }

    // Increment coupon usage count if coupon applied
    if (body.couponCode) {
      try {
        const coupons = readJsonFile<any[]>("coupons.json", []);
        const cleanCode = body.couponCode.trim().toUpperCase();
        const couponIdx = coupons.findIndex((c) => c.code === cleanCode);
        if (couponIdx !== -1) {
          coupons[couponIdx].usedCount = (coupons[couponIdx].usedCount || 0) + 1;
          writeJsonFile("coupons.json", coupons);
        }
      } catch (e) {
        console.error("Coupon usage increment error:", e);
      }
    }

    orders.unshift(newOrder);
    writeJsonFile("orders.json", orders);

    return NextResponse.json({
      success: true,
      message: "تم حفظ الطلب بنجاح في قاعدة البيانات وتحديث المخزون.",
      order: newOrder,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

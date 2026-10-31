import { NextResponse } from "next/server";
import { readJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import { ProductData } from "@/lib/data/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const products = readJsonFile<ProductData[]>("products.json", []);

    // 1. Financial summary (exclude CANCELLED orders from revenue & AOV)
    const totalOrdersCount = orders.length;
    const validOrders = orders.filter((o) => o.orderStatus !== "CANCELLED");
    const grossRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const collectedRevenue = validOrders.reduce((sum, o) => {
      if (o.paymentStatus === "FULLY_PAID" || o.orderStatus === "DELIVERED") {
        return sum + (Number(o.total) || 0);
      }
      if (o.paymentStatus === "DEPOSIT_PAID") {
        return sum + (Number(o.depositAmount) || 0);
      }
      return sum;
    }, 0);
    const pendingCodRevenue = validOrders.reduce((sum, o) => {
      if (o.orderStatus !== "DELIVERED" && o.paymentStatus !== "FULLY_PAID") {
        return sum + (Number(o.remainingCodAmount) || 0);
      }
      return sum;
    }, 0);

    const aov = validOrders.length > 0 ? Math.round(grossRevenue / validOrders.length) : 0;

    // 2. Status counts
    const statusCounts = {
      PENDING_CONFIRMATION: orders.filter((o) => o.orderStatus === "PENDING_CONFIRMATION").length,
      PROCESSING: orders.filter((o) => o.orderStatus === "PROCESSING").length,
      SHIPPED: orders.filter((o) => o.orderStatus === "SHIPPED").length,
      DELIVERED: orders.filter((o) => o.orderStatus === "DELIVERED").length,
      CANCELLED: orders.filter((o) => o.orderStatus === "CANCELLED").length,
    };

    // 3. Low stock products
    const lowStockProducts = products.filter((p) => p.stock < 10);

    // 4. Governorate distribution
    const govCounts: Record<string, number> = {};
    for (const o of orders) {
      const g = o.governorate || "غير محدد";
      govCounts[g] = (govCounts[g] || 0) + 1;
    }
    const governorates = Object.entries(govCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // 5. 7-Day sales trend (excluding cancelled orders)
    const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
    const salesTrend = days.map((day, idx) => {
      const dayOrders = validOrders.filter((o) => {
        const parsed = new Date(o.createdAt);
        if (isNaN(parsed.getTime())) return false;
        const d = parsed.getDay();
        return (d + 1) % 7 === idx;
      });
      const dayAmount = dayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      return {
        day,
        amount: dayAmount,
        ordersCount: dayOrders.length,
      };
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalOrdersCount,
        grossRevenue,
        collectedRevenue,
        pendingCodRevenue,
        aov,
        productsCount: products.length,
        lowStockCount: lowStockProducts.length,
      },
      statusCounts,
      governorates,
      salesTrend,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        nameAr: p.nameAr,
        stock: p.stock,
        sku: p.sku,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

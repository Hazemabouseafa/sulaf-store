export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import { stoxService } from "@/lib/shipping/stox";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const orders = readJsonFile<OrderRecord[]>("orders.json", []);
    const shippedOrders = orders.filter((o) => o.orderStatus === "SHIPPED");
    let synced = 0;

    for (const order of shippedOrders) {
      if (order.stoxTrackingNumber) {
        const tracking = await stoxService.trackShipment(order.stoxTrackingNumber);
        if (tracking && tracking.currentStatus === "DELIVERED") {
          order.orderStatus = "DELIVERED";
          order.stoxStatus = "DELIVERED";
          order.paymentStatus = "FULLY_PAID";
          order.remainingCodAmount = 0;
          synced++;
        }
      }
    }

    if (synced > 0) {
      writeJsonFile("orders.json", orders);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      checkedCount: shippedOrders.length,
      deliveredSynced: synced,
    });
  } catch (err: any) {
    console.error("[Cron Sync Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

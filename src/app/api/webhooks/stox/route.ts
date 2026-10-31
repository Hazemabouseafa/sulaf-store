export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const trackingNo = payload.tracking_number || payload.awb;
    const status = payload.status; // e.g. "DELIVERED", "OUT_FOR_DELIVERY"

    console.log(`[Stox Webhook] Received update for AWB ${trackingNo}: ${status}`);

    if (trackingNo && status) {
      const orders = readJsonFile<OrderRecord[]>("orders.json", []);
      const cleanTrack = String(trackingNo).trim().toLowerCase();
      const idx = orders.findIndex(
        (o) =>
          o.stoxTrackingNumber?.toLowerCase() === cleanTrack ||
          (o.orderNumber || "").toLowerCase() === cleanTrack
      );
      if (idx !== -1) {
        orders[idx].stoxStatus = status;
        if (status === "DELIVERED") {
          orders[idx].orderStatus = "DELIVERED";
          orders[idx].paymentStatus = "FULLY_PAID";
          orders[idx].remainingCodAmount = 0;
        }
        writeJsonFile("orders.json", orders);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Stox Webhook Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

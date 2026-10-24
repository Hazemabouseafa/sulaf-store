export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, getOrderByTracking } from "@/lib/orders/order-store";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const trackingNo = payload.tracking_number || payload.awb;
    const status = payload.status; // e.g. "DELIVERED", "OUT_FOR_DELIVERY"

    console.log(`[Stox Webhook] Received update for AWB ${trackingNo}: ${status}`);

    if (trackingNo && status) {
      const order = getOrderByTracking(trackingNo);
      if (order) {
        updateOrderStatus(order.id, {
          stoxStatus: status,
          orderStatus: status === "DELIVERED" ? "DELIVERED" : order.orderStatus,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Stox Webhook Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

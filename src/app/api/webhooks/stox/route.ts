export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";

export async function GET() {
  return NextResponse.json({
    success: true,
    service: "Sulaf Store - STOX Egypt Webhook Receiver",
    status: "ACTIVE",
    endpoint: "/api/webhooks/stox",
  });
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    const source = payload.data || payload.order || payload;

    const candidates = [
      source.awb_number,
      source.reference_number,
      source.tracking_number,
      source.trackingNumber,
      source.awb,
      source.code,
      source.reference_id,
      source.order_reference,
      source.order_id,
      source.id,
      payload.awb_number,
      payload.reference_number,
      payload.tracking_number,
      payload.reference_id,
      payload.id,
    ]
      .filter(Boolean)
      .map((v) => String(v).trim().toLowerCase());

    const rawStatus = String(
      source.status || source.order_status || payload.status || payload.event || ""
    ).trim();

    console.log(`[Stox Webhook] Received update for [${candidates.join(", ")}]: ${rawStatus}`);

    if (candidates.length > 0 && rawStatus) {
      const orders = readJsonFile<OrderRecord[]>("orders.json", []);
      const idx = orders.findIndex((o) => {
        const oTrack = (o.stoxTrackingNumber || "").trim().toLowerCase();
        const oId = (o.stoxOrderId || "").trim().toLowerCase();
        const oNum = (o.orderNumber || "").trim().toLowerCase();
        return (
          (oTrack && candidates.includes(oTrack)) ||
          (oId && candidates.includes(oId)) ||
          (oNum && candidates.includes(oNum))
        );
      });

      if (idx !== -1) {
        const upper = rawStatus.toUpperCase();
        orders[idx].stoxStatus = rawStatus;

        if (
          upper.includes("DELIVERED") ||
          upper.includes("COMPLETED") ||
          rawStatus.includes("تم التوصيل") ||
          rawStatus.includes("تم التسليم")
        ) {
          orders[idx].orderStatus = "DELIVERED";
          orders[idx].paymentStatus = "FULLY_PAID";
          orders[idx].remainingCodAmount = 0;
        } else if (
          upper.includes("OUT_FOR_DELIVERY") ||
          upper.includes("SHIPPED") ||
          upper.includes("IN_TRANSIT") ||
          upper.includes("DISPATCHED") ||
          rawStatus.includes("جاري التوصيل") ||
          rawStatus.includes("تم الشحن")
        ) {
          orders[idx].orderStatus = "SHIPPED";
        } else if (
          upper.includes("CANCEL") ||
          upper.includes("RETURN") ||
          upper.includes("REJECT") ||
          rawStatus.includes("ملغي") ||
          rawStatus.includes("مرتجع")
        ) {
          orders[idx].orderStatus = "CANCELLED";
        }

        writeJsonFile("orders.json", orders);
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    console.error("[Stox Webhook Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

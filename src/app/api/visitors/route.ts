import { NextRequest, NextResponse } from "next/server";
import {
  buildVisitorAnalyticsReport,
  DeviceCategory,
  readVisitorsStore,
  recordVisitorHit,
  VisitorQueryOptions,
} from "@/lib/analytics/visitor-store";

export const dynamic = "force-dynamic";

function detectDevice(userAgent: string, hint?: string): DeviceCategory {
  if (hint === "mobile" || hint === "tablet" || hint === "desktop") return hint;
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

function isAutomatedCrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  return /bot|crawler|spider|slurp|mediapartners|facebookexternalhit|whatsapp|curl|wget|python-requests/i.test(
    userAgent
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Raw store mode for pre-build Coolify data preservation & backups
    if (searchParams.get("raw") === "1") {
      const raw = readVisitorsStore();
      return NextResponse.json(
        { success: true, raw },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    const rangeParam = searchParams.get("range") as VisitorQueryOptions["range"] | null;
    const dateParam = searchParams.get("date") || undefined;
    const dayParam = searchParams.get("day");
    const parsedDay =
      dayParam !== null && dayParam !== "" && !isNaN(Number(dayParam))
        ? Number(dayParam)
        : null;

    const report = buildVisitorAnalyticsReport({
      range: rangeParam || "today",
      date: dateParam,
      dayOfWeek: parsedDay,
    });

    return NextResponse.json(
      { success: true, ...report },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (isAutomatedCrawler(userAgent)) {
      return NextResponse.json({ success: true, recorded: false, reason: "bot_filtered" });
    }

    const body = await req.json().catch(() => ({}));
    const visitorId = String(body?.visitorId || "");
    const path = String(body?.path || "/");
    const device = detectDevice(userAgent, body?.device);
    const referrer = typeof body?.referrer === "string" ? body.referrer : undefined;

    const result = await recordVisitorHit({
      visitorId,
      path,
      device,
      referrer,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

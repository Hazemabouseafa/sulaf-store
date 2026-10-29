import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_STORE_SETTINGS, StoreSettings } from "@/lib/settings/store-settings";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

function readStoredSettings(): StoreSettings {
  try {
    const raw = readJsonFile<StoreSettings>("store-settings.json", DEFAULT_STORE_SETTINGS);
    return { ...DEFAULT_STORE_SETTINGS, ...raw };
  } catch (e) {
    console.error("Error reading stored settings:", e);
    return DEFAULT_STORE_SETTINGS;
  }
}

function writeStoredSettings(settings: StoreSettings) {
  try {
    writeJsonFile("store-settings.json", settings);
  } catch (e) {
    console.error("Error writing stored settings:", e);
  }
}

export async function GET() {
  const settings = readStoredSettings();
  return NextResponse.json(
    { success: true, settings },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || !body.settings) {
      return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 400 });
    }

    const current = readStoredSettings();
    const updated = { ...current, ...body.settings };
    writeStoredSettings(updated);

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

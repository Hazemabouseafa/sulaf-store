import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_STORE_SETTINGS, StoreSettings } from "@/lib/settings/store-settings";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "store-settings.json");

function readStoredSettings(): StoreSettings {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf8");
      return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error("Error reading stored settings:", e);
  }
  return DEFAULT_STORE_SETTINGS;
}

function writeStoredSettings(settings: StoreSettings) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(settings, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing stored settings:", e);
  }
}

export async function GET() {
  const settings = readStoredSettings();
  return NextResponse.json({ success: true, settings });
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

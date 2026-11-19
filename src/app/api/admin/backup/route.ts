import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { DEFAULT_STORE_SETTINGS } from "@/lib/settings/store-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      products: readJsonFile("products.json", []),
      settings: readJsonFile("store-settings.json", DEFAULT_STORE_SETTINGS),
      orders: readJsonFile("orders.json", []),
      coupons: readJsonFile("coupons.json", []),
      pages: readJsonFile("pages.json", []),
      reviews: readJsonFile("reviews.json", []),
      customers: readJsonFile("registered-customers.json", []),
      visitors: readJsonFile("visitors.json", null),
    };

    return NextResponse.json(
      { success: true, snapshot },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const snap = body?.snapshot || body;
    if (!snap || typeof snap !== "object") {
      return NextResponse.json({ success: false, error: "ملف النسخة الاحتياطية غير صالح." }, { status: 400 });
    }

    if (Array.isArray(snap.products) && snap.products.length > 0) {
      writeJsonFile("products.json", snap.products);
    }
    if (snap.settings && typeof snap.settings === "object") {
      const currentSettings = readJsonFile("store-settings.json", DEFAULT_STORE_SETTINGS);
      writeJsonFile("store-settings.json", { ...currentSettings, ...snap.settings });
    }
    if (Array.isArray(snap.orders) && snap.orders.length > 0) {
      writeJsonFile("orders.json", snap.orders);
    }
    if (Array.isArray(snap.coupons) && snap.coupons.length > 0) {
      writeJsonFile("coupons.json", snap.coupons);
    }
    if (Array.isArray(snap.pages) && snap.pages.length > 0) {
      writeJsonFile("pages.json", snap.pages);
    }
    if (Array.isArray(snap.reviews) && snap.reviews.length > 0) {
      writeJsonFile("reviews.json", snap.reviews);
    }
    if (Array.isArray(snap.customers) && snap.customers.length > 0) {
      writeJsonFile("registered-customers.json", snap.customers);
    }
    if (snap.visitors && typeof snap.visitors === "object" && Number(snap.visitors.totalPageViews) > 0) {
      writeJsonFile("visitors.json", snap.visitors);
    }

    return NextResponse.json({
      success: true,
      message: "تم استعادة وتطبيق النسخة الاحتياطية بنجاح دون فقدان أي بيانات.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

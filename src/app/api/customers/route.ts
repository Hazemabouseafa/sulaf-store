import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customers = readJsonFile<any[]>("registered-customers.json", []);
    return NextResponse.json({ success: true, count: customers.length, customers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.email || !body.name) {
      return NextResponse.json({ success: false, error: "بيانات غير مكتملة" }, { status: 400 });
    }

    const customers = readJsonFile<any[]>("registered-customers.json", []);
    const cleanEmail = body.email.trim().toLowerCase();
    const cleanPhone = (body.phone || "").trim().replace(/\s+/g, "");

    const existingIndex = customers.findIndex(
      (c: any) =>
        (c.email || "").toLowerCase() === cleanEmail ||
        (cleanPhone && (c.phone || "").replace(/\s+/g, "") === cleanPhone)
    );

    if (existingIndex >= 0) {
      customers[existingIndex] = { ...customers[existingIndex], ...body };
    } else {
      customers.push({
        ...body,
        id: body.id || "cust_" + Date.now().toString(36),
        registeredAt: body.registeredAt || new Date().toISOString().split("T")[0],
        customCoupons: body.customCoupons || [],
        customNotifications: body.customNotifications || []
      });
    }

    writeJsonFile("registered-customers.json", customers);
    return NextResponse.json({ success: true, message: "تم حفظ بيانات العميل بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

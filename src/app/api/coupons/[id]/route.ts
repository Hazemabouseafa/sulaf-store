import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { CouponData } from "@/lib/coupons/coupon-store";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const coupons = readJsonFile<CouponData[]>("coupons.json", []);
    const index = coupons.findIndex((c) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: "الكوبون غير موجود." }, { status: 404 });
    }

    coupons[index] = {
      ...coupons[index],
      ...body,
      code: body.code ? body.code.trim().toUpperCase() : coupons[index].code,
    };

    writeJsonFile("coupons.json", coupons);
    return NextResponse.json({
      success: true,
      message: "تم تحديث الكوبون بنجاح.",
      coupon: coupons[index],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const coupons = readJsonFile<CouponData[]>("coupons.json", []);
    const filtered = coupons.filter((c) => c.id !== id);

    if (filtered.length === coupons.length) {
      return NextResponse.json({ success: false, error: "الكوبون غير موجود." }, { status: 404 });
    }

    writeJsonFile("coupons.json", filtered);
    return NextResponse.json({ success: true, message: "تم حذف الكوبون بنجاح." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

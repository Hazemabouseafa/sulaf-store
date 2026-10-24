import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { CouponData } from "@/lib/coupons/coupon-store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coupons = readJsonFile<CouponData[]>("coupons.json", []);
    return NextResponse.json({ success: true, count: coupons.length, coupons });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.code || !body.discountValue) {
      return NextResponse.json(
        { success: false, error: "يرجى إدخال كود الكوبون وقيمة الخصم." },
        { status: 400 }
      );
    }

    const coupons = readJsonFile<CouponData[]>("coupons.json", []);
    const code = body.code.trim().toUpperCase();

    // Check duplicate
    if (coupons.some((c) => c.code === code)) {
      return NextResponse.json(
        { success: false, error: "كود الكوبون هذا مستخدم بالفعل." },
        { status: 400 }
      );
    }

    const newCoupon: CouponData = {
      ...body,
      id: `coup-${Date.now()}`,
      code,
      discountValue: Number(body.discountValue),
      minOrderAmount: Number(body.minOrderAmount) || 0,
      usedCount: 0,
      isActive: body.isActive ?? true,
    };

    coupons.unshift(newCoupon);
    writeJsonFile("coupons.json", coupons);

    return NextResponse.json({
      success: true,
      message: "تم إنشاء كوبون الخصم بنجاح.",
      coupon: newCoupon,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

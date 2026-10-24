import { NextRequest, NextResponse } from "next/server";
import { readJsonFile } from "@/lib/db/json-db";
import { CouponData } from "@/lib/coupons/coupon-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, cartSubtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: "يرجى إدخال كود الخصم." }, { status: 400 });
    }

    const clean = code.trim().toUpperCase();
    const coupons = readJsonFile<CouponData[]>("coupons.json", []);
    const coupon = coupons.find((c) => c.code === clean);

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "كود الخصم غير صحيح أو غير موجود." });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: "عذراً، هذا الكوبون غير مفعّل حالياً." });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ valid: false, message: "عذراً، انتهت صلاحية هذا الكوبون." });
    }

    const subtotal = Number(cartSubtotal) || 0;
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `الحد الأدنى لتفعيل هذا الكوبون هو ${coupon.minOrderAmount} ج.م.`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return NextResponse.json({
      valid: true,
      discount,
      message: `تم تطبيق خصم بقيمة ${discount} ج.م بنجاح!`,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
  }
}

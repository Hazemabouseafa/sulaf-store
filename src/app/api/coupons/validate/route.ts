import { NextRequest, NextResponse } from "next/server";
import { readJsonFile } from "@/lib/db/json-db";
import { CouponData } from "@/lib/coupons/coupon-store";

export const dynamic = "force-dynamic";

function isCouponExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const trimmed = expiryDate.trim();
  if (!trimmed) return false;
  const target = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T23:59:59.999`)
    : new Date(trimmed);
  return !isNaN(target.getTime()) && target < new Date();
}

export async function POST(req: NextRequest) {
  try {
    const { code, cartSubtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, message: "يرجى إدخال كود الخصم." }, { status: 400 });
    }

    const clean = code.trim().toUpperCase();
    const coupons = readJsonFile<CouponData[]>("coupons.json", []);
    let coupon: CouponData | undefined = coupons.find((c) => c.code?.trim().toUpperCase() === clean);

    // Fallback: Check customer VIP assigned coupons in registered-customers.json
    if (!coupon) {
      const customers = readJsonFile<any[]>("registered-customers.json", []);
      for (const cust of customers) {
        if (Array.isArray(cust.customCoupons)) {
          const vipMatch = cust.customCoupons.find(
            (c: any) => c.code?.trim().toUpperCase() === clean
          );
          if (vipMatch) {
            coupon = {
              id: vipMatch.id || `vip-${clean}`,
              code: clean,
              discountType: vipMatch.discountType || "PERCENTAGE",
              discountValue: Number(vipMatch.discountValue) || 0,
              minOrderAmount: Number(vipMatch.minOrderAmount) || 0,
              usedCount: 0,
              isActive: vipMatch.isActive !== false,
              expiryDate: vipMatch.expiryDate,
            };
            break;
          }
        }
      }
    }

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "كود الخصم غير صحيح أو غير موجود." });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: "عذراً، هذا الكوبون غير مفعّل حالياً." });
    }

    if (isCouponExpired(coupon.expiryDate)) {
      return NextResponse.json({ valid: false, message: "عذراً، انتهت صلاحية هذا الكوبون." });
    }

    if (coupon.maxUsageCount && (coupon.usedCount || 0) >= coupon.maxUsageCount) {
      return NextResponse.json({ valid: false, message: "عذراً، تم استنفاد الحد الأقصى لاستخدام هذا الكوبون." });
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

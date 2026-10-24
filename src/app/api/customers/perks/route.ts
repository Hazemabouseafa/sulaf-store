import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, customerId } = body;
    const customers = readJsonFile<any[]>("registered-customers.json", []);

    if (action === "assign_coupon") {
      const { coupon } = body;
      if (!coupon || !coupon.code || !coupon.discountValue) {
        return NextResponse.json({ success: false, error: "بيانات الكوبون غير مكتملة." }, { status: 400 });
      }

      const formattedCode = coupon.code.trim().toUpperCase();
      const newCoupon = {
        id: "cc-" + Date.now(),
        code: formattedCode,
        titleAr: coupon.titleAr || `خصم خاص ${coupon.discountValue}${coupon.discountType === "PERCENTAGE" ? "%" : " ج.م"}`,
        titleEn: coupon.titleEn || `Special ${coupon.discountValue}${coupon.discountType === "PERCENTAGE" ? "%" : " EGP"} Off`,
        descAr: coupon.descAr || "كوبون مخصص لحسابكِ تقديراً لثقتكِ بمنتجات سُـلاف.",
        descEn: coupon.descEn || "Personalized discount assigned to your account.",
        discountType: coupon.discountType || "PERCENTAGE",
        discountValue: Number(coupon.discountValue),
        minOrderAmount: Number(coupon.minOrderAmount) || 0,
        expiryDate: coupon.expiryDate || "2026-12-31",
        isActive: true,
        assignedAt: new Date().toISOString().split("T")[0]
      };

      // Also ensure it is registered in main coupons.json
      const storeCoupons = readJsonFile<any[]>("coupons.json", []);
      if (!storeCoupons.some((c: any) => c.code === formattedCode)) {
        storeCoupons.unshift({
          id: "coup-" + Date.now(),
          code: formattedCode,
          discountType: newCoupon.discountType,
          discountValue: newCoupon.discountValue,
          minOrderAmount: newCoupon.minOrderAmount,
          maxUsageCount: 100,
          usedCount: 0,
          isActive: true,
          expiryDate: newCoupon.expiryDate,
          notes: `كوبون خاص مخصص للعميل (${customerId})`
        });
        writeJsonFile("coupons.json", storeCoupons);
      }

      // Assign to specific customer or all
      let affectedCount = 0;
      customers.forEach((cust: any) => {
        if (customerId === "ALL" || cust.id === customerId) {
          if (!cust.customCoupons) cust.customCoupons = [];
          cust.customCoupons = cust.customCoupons.filter((c: any) => c.code !== formattedCode);
          cust.customCoupons.unshift(newCoupon);

          // If autoNotify is true, also create a notification for them!
          if (body.autoNotify) {
            if (!cust.customNotifications) cust.customNotifications = [];
            cust.customNotifications.unshift({
              id: "cn-" + Date.now() + Math.random().toString(36).substring(2, 5),
              titleAr: `🎉 هدية وخصم مخصص لكِ (${newCoupon.titleAr})`,
              titleEn: `Special VIP Discount: ${newCoupon.titleEn}`,
              messageAr: `يسعدنا إعلامكِ بأنه تم تخصيص كوبون الخصم (${formattedCode}) لحسابكِ للاستفادة منه فورياً عند الطلب.`,
              messageEn: `We are pleased to inform you that coupon (${formattedCode}) has been exclusively assigned to your account.`,
              couponCode: formattedCode,
              type: "gift",
              isRead: false,
              createdAt: new Date().toISOString().split("T")[0]
            });
          }
          affectedCount++;
        }
      });

      writeJsonFile("registered-customers.json", customers);
      return NextResponse.json({ success: true, message: `تم تخصيص الكوبون بنجاح لـ ${affectedCount} عميل.`, coupon: newCoupon });
    }

    if (action === "send_notification") {
      const { notification } = body;
      if (!notification || !notification.titleAr || !notification.messageAr) {
        return NextResponse.json({ success: false, error: "يرجى كتابة عنوان ورسالة الإشعار." }, { status: 400 });
      }

      const newNotif = {
        id: "cn-" + Date.now(),
        titleAr: notification.titleAr.trim(),
        titleEn: notification.titleEn?.trim() || notification.titleAr.trim(),
        messageAr: notification.messageAr.trim(),
        messageEn: notification.messageEn?.trim() || notification.messageAr.trim(),
        couponCode: notification.couponCode?.trim() || undefined,
        type: notification.type || "gift",
        isRead: false,
        createdAt: new Date().toISOString().split("T")[0]
      };

      let affectedCount = 0;
      customers.forEach((cust: any) => {
        if (customerId === "ALL" || cust.id === customerId) {
          if (!cust.customNotifications) cust.customNotifications = [];
          cust.customNotifications.unshift(newNotif);
          affectedCount++;
        }
      });

      writeJsonFile("registered-customers.json", customers);
      return NextResponse.json({ success: true, message: `تم إرسال الإشعار المخصص لـ ${affectedCount} عميل بنجاح.`, notification: newNotif });
    }

    if (action === "delete_coupon") {
      const { couponId } = body;
      customers.forEach((cust: any) => {
        if (customerId === "ALL" || cust.id === customerId) {
          if (cust.customCoupons) {
            cust.customCoupons = cust.customCoupons.filter((c: any) => c.id !== couponId && c.code !== couponId);
          }
        }
      });
      writeJsonFile("registered-customers.json", customers);
      return NextResponse.json({ success: true, message: "تم حذف الكوبون المخصص." });
    }

    if (action === "delete_notification") {
      const { notificationId } = body;
      customers.forEach((cust: any) => {
        if (customerId === "ALL" || cust.id === customerId) {
          if (cust.customNotifications) {
            cust.customNotifications = cust.customNotifications.filter((n: any) => n.id !== notificationId);
          }
        }
      });
      writeJsonFile("registered-customers.json", customers);
      return NextResponse.json({ success: true, message: "تم حذف الإشعار المخصص." });
    }

    if (action === "mark_notification_read") {
      const { notificationId } = body;
      customers.forEach((cust: any) => {
        if (cust.id === customerId) {
          if (cust.customNotifications) {
            cust.customNotifications.forEach((n: any) => {
              if (n.id === notificationId) n.isRead = true;
            });
          }
        }
      });
      writeJsonFile("registered-customers.json", customers);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

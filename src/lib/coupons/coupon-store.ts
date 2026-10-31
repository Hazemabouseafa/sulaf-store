export interface CouponData {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  maxUsageCount?: number;
  usedCount: number;
  isActive: boolean;
  expiryDate?: string;
  notes?: string;
}

const DEFAULT_COUPONS: CouponData[] = [];

const STORAGE_KEY = "sulaf_coupons_store_v2";
const CUSTOMER_SESSION_KEY = "sulaf_customer_session_v2";

export function getStoredCoupons(): CouponData[] {
  if (typeof window === "undefined") return DEFAULT_COUPONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      syncCouponsFromServer();
      return DEFAULT_COUPONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_COUPONS;
  } catch (err) {
    console.error("Failed to load coupons:", err);
    return DEFAULT_COUPONS;
  }
}

export async function syncCouponsFromServer(): Promise<CouponData[]> {
  if (typeof window === "undefined") return DEFAULT_COUPONS;
  try {
    const res = await fetch("/api/coupons", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.coupons)) {
        saveCoupons(data.coupons);
        return data.coupons;
      }
    }
  } catch (err) {
    console.warn("Coupon sync failed:", err);
  }
  return getStoredCoupons();
}

export function saveCoupons(coupons: CouponData[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new Event("sulaf_coupons_updated"));
  } catch (err) {
    console.error("Failed to save coupons:", err);
  }
}

export function addCoupon(coupon: Omit<CouponData, "id" | "usedCount">): CouponData {
  const current = getStoredCoupons();
  const newCoupon: CouponData = {
    ...coupon,
    id: `coup-${Date.now()}`,
    code: coupon.code.trim().toUpperCase(),
    usedCount: 0,
  };

  const updated = [newCoupon, ...current];
  saveCoupons(updated);
  return newCoupon;
}

export function updateCoupon(id: string, updates: Partial<CouponData>): CouponData | null {
  const current = getStoredCoupons();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    ...updates,
    code: updates.code ? updates.code.trim().toUpperCase() : current[index].code,
  };

  saveCoupons(current);
  return current[index];
}

export function deleteCoupon(id: string): boolean {
  const current = getStoredCoupons();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  saveCoupons(filtered);
  return true;
}

export function toggleCoupon(id: string): boolean {
  const current = getStoredCoupons();
  const coupon = current.find((c) => c.id === id);
  if (!coupon) return false;

  coupon.isActive = !coupon.isActive;
  saveCoupons(current);
  return true;
}

function isCouponExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const trimmed = expiryDate.trim();
  if (!trimmed) return false;
  const target = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T23:59:59.999`)
    : new Date(trimmed);
  return !isNaN(target.getTime()) && target < new Date();
}

export function validateCouponCode(
  code: string,
  subtotal: number
): { valid: boolean; discount: number; message: string } {
  const clean = code.trim().toUpperCase();
  if (!clean) {
    return { valid: false, discount: 0, message: "يرجى إدخال كود الخصم" };
  }

  const coupons = getStoredCoupons();
  let found: {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderAmount: number;
    maxUsageCount?: number;
    usedCount?: number;
    isActive: boolean;
    expiryDate?: string;
  } | undefined = coupons.find((c) => c.code === clean && c.isActive);

  // Also check personalized customer VIP coupons if logged in
  if (!found && typeof window !== "undefined") {
    try {
      const rawSession = localStorage.getItem(CUSTOMER_SESSION_KEY);
      if (rawSession) {
        const sessionUser = JSON.parse(rawSession);
        if (Array.isArray(sessionUser?.customCoupons)) {
          found = sessionUser.customCoupons.find(
            (c: any) => c.code?.trim().toUpperCase() === clean && c.isActive !== false
          );
        }
      }
    } catch {}
  }

  if (!found) {
    return { valid: false, discount: 0, message: "كود الخصم غير صالح أو منتهي الصلاحية" };
  }

  if (isCouponExpired(found.expiryDate)) {
    return { valid: false, discount: 0, message: "عذراً، انتهت صلاحية هذا الكوبون" };
  }

  if (found.maxUsageCount && (found.usedCount || 0) >= found.maxUsageCount) {
    return { valid: false, discount: 0, message: "عذراً، تم استنفاد الحد الأقصى لاستخدام هذا الكوبون" };
  }

  if (subtotal < (found.minOrderAmount || 0)) {
    return {
      valid: false,
      discount: 0,
      message: `الحد الأدنى لتطبيق هذا الكوبون هو ${found.minOrderAmount} ج.م`,
    };
  }

  let discount = 0;
  if (found.discountType === "PERCENTAGE") {
    discount = Math.round((subtotal * found.discountValue) / 100);
  } else {
    discount = Math.min(subtotal, found.discountValue);
  }

  return { valid: true, discount, message: `تم تطبيق خصم بقيمة ${discount} ج.م!` };
}

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

const DEFAULT_COUPONS: CouponData[] = [
  {
    id: "coup-1",
    code: "SULAF10",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderAmount: 300,
    usedCount: 42,
    isActive: true,
    expiryDate: "2026-12-31",
    notes: "خصم 10% بمناسبة إطلاق البراند",
  },
  {
    id: "coup-2",
    code: "ROUGH50",
    discountType: "FIXED",
    discountValue: 50,
    minOrderAmount: 400,
    usedCount: 28,
    isActive: true,
    expiryDate: "2026-11-30",
    notes: "خصم 50 ج.م على كريم سلاف رف أواي",
  },
  {
    id: "coup-3",
    code: "VIP20",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderAmount: 800,
    usedCount: 15,
    isActive: true,
    expiryDate: "2026-12-31",
    notes: "خصم خاص للطلبات فوق 800 ج",
  },
];

const STORAGE_KEY = "sulaf_coupons_store_v1";

export function getStoredCoupons(): CouponData[] {
  if (typeof window === "undefined") return DEFAULT_COUPONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COUPONS;
  } catch (err) {
    console.error("Failed to load coupons:", err);
    return DEFAULT_COUPONS;
  }
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

export function validateCouponCode(code: string, subtotal: number): { valid: boolean; discount: number; message: string } {
  const coupons = getStoredCoupons();
  const found = coupons.find((c) => c.code === code.trim().toUpperCase() && c.isActive);

  if (!found) {
    return { valid: false, discount: 0, message: "كود الخصم غير صالح أو منتهي الصلاحية" };
  }

  if (subtotal < found.minOrderAmount) {
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

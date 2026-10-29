/**
 * Sulaf Unified Order & Checkout Store
 * Connected with live backend API: /api/orders
 */

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  governorate: string;
  city: string;
  street: string;
  building?: string;
  notes?: string;
  adminNotes?: string;
  items: {
    productId: string;
    productName: string;
    variantTitle?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  isDepositMode: boolean;
  depositAmount: number;
  remainingCodAmount: number;
  paymentMethod: "PAYMOB_CARD" | "PAYMOB_WALLET" | "SHA7NAWY_WALLET" | "MANUAL_INSTAPAY" | "MANUAL_VODAFONE_CASH" | "COD";
  paymentStatus: "PENDING" | "DEPOSIT_PAID" | "FULLY_PAID" | "FAILED" | "REFUNDED";
  orderStatus: "PENDING_CONFIRMATION" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  receiptUrl?: string;
  receiptVerifiedAt?: string;
  stoxTrackingNumber?: string;
  stoxStatus?: string;
  birthdate?: string;
  closePersonName?: string;
  createdAt: string;
}

const STORAGE_KEY = "sulaf_orders_cache_v2";

export function getCachedOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCachedOrders(orders: OrderRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("sulaf_orders_updated"));
  } catch {}
}

export async function fetchAllOrders(): Promise<OrderRecord[]> {
  try {
    const res = await fetch("/api/orders", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.orders) {
        setCachedOrders(data.orders);
        return data.orders;
      }
    }
  } catch (err) {
    console.warn("Using cached orders due to network:", err);
  }
  return getCachedOrders();
}

export async function fetchOrderById(idOrNumber: string): Promise<OrderRecord | null> {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(idOrNumber)}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.order) return data.order;
    }
  } catch (err) {
    console.warn("Failed to fetch order by id:", err);
  }
  const cached = getCachedOrders();
  return cached.find((o) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()) || null;
}

export async function createOrderApi(
  data: Omit<OrderRecord, "id" | "orderNumber" | "createdAt"> & Partial<Pick<OrderRecord, "id" | "orderNumber" | "createdAt">>
): Promise<OrderRecord> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("فشل إرسال الطلب إلى الخادم.");
  }

  const result = await res.json();
  if (!result.success || !result.order) {
    throw new Error(result.error || "خطأ في تسجيل الطلب.");
  }

  // Update local cache without duplicating
  const cached = getCachedOrders().filter(
    (o) => o.id !== result.order.id && o.orderNumber !== result.order.orderNumber
  );
  setCachedOrders([result.order, ...cached]);

  return result.order;
}

export async function updateOrderApi(orderId: string, updates: Partial<OrderRecord>): Promise<OrderRecord> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error("فشل تحديث الطلب على الخادم.");
  }

  const result = await res.json();
  const cached = getCachedOrders();
  const index = cached.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
  if (index !== -1) {
    cached[index] = { ...cached[index], ...updates };
    setCachedOrders([...cached]);
  }

  return result.order;
}

export async function deleteOrderApi(orderId: string): Promise<boolean> {
  const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
    method: "DELETE",
  });
  if (res.ok) {
    const cached = getCachedOrders();
    setCachedOrders(cached.filter((o) => o.id !== orderId && o.orderNumber !== orderId));
    return true;
  }
  return false;
}

// Synchronous legacy bridges for existing components
export function getAllOrders(): OrderRecord[] {
  return getCachedOrders();
}

export function getOrderById(orderIdOrNumber: string): OrderRecord | undefined {
  const cached = getCachedOrders();
  return cached.find(
    (o) => o.id === orderIdOrNumber || o.orderNumber.toLowerCase() === orderIdOrNumber.toLowerCase()
  );
}

export function getOrderByTracking(trackingNumber: string): OrderRecord | undefined {
  const cached = getCachedOrders();
  return cached.find(
    (o) => o.stoxTrackingNumber?.toLowerCase() === trackingNumber.toLowerCase()
  );
}

export const getOrders = getAllOrders;
export function createOrder(data: Omit<OrderRecord, "id" | "orderNumber" | "createdAt">): OrderRecord {
  // Synchronous client fallback
  const newOrder: OrderRecord = {
    ...data,
    id: `ord-${Date.now()}`,
    orderNumber: `SLF-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  const cached = getCachedOrders();
  setCachedOrders([newOrder, ...cached]);
  // Also push to API asynchronously in background with the same id & orderNumber
  createOrderApi(newOrder).catch((e) => console.error("Async order sync err:", e));
  return newOrder;
}

export function updateOrderStatus(orderId: string, updates: Partial<OrderRecord>): OrderRecord | null {
  const cached = getCachedOrders();
  const index = cached.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
  if (index === -1) return null;
  cached[index] = { ...cached[index], ...updates };
  setCachedOrders([...cached]);
  updateOrderApi(orderId, updates).catch((e) => console.error("Async update sync err:", e));
  return cached[index];
}

export function updatePaymentStatus(orderId: string, status: OrderRecord["paymentStatus"]): OrderRecord | null {
  return updateOrderStatus(orderId, { paymentStatus: status });
}

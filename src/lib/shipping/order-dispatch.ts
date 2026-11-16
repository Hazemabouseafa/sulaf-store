import { readJsonFile, writeJsonFile } from "@/lib/db/json-db";
import { OrderRecord } from "@/lib/orders/order-store";
import {
  universalShippingService,
  ShippingShipmentResult,
} from "@/lib/shipping/shipping-provider";

const globalLockState = globalThis as typeof globalThis & {
  __sulafOrdersFileQueue?: Promise<void>;
  __sulafOrderDispatchLocks?: Map<string, Promise<void>>;
};

/**
 * Serializes atomic read-modify-write operations on `orders.json` so concurrent
 * webhooks, redirect callbacks, order creations, and admin updates never overwrite each other.
 */
export async function withOrdersFileLock<T>(fn: () => Promise<T> | T): Promise<T> {
  const prev = globalLockState.__sulafOrdersFileQueue || Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  globalLockState.__sulafOrdersFileQueue = prev.then(() => current, () => current);

  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
}

/**
 * Serializes carrier dispatch per order ID so simultaneous Paymob Webhook +
 * Redirect Verify callbacks cannot create duplicate shipments in STOX.
 */
export async function withOrderDispatchLock<T>(
  orderKey: string,
  fn: () => Promise<T>
): Promise<T> {
  if (!globalLockState.__sulafOrderDispatchLocks) {
    globalLockState.__sulafOrderDispatchLocks = new Map();
  }
  const locks = globalLockState.__sulafOrderDispatchLocks;
  const prev = locks.get(orderKey) || Promise.resolve();

  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const chained = prev.then(() => current, () => current);
  locks.set(orderKey, chained);

  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(orderKey) === chained) {
      locks.delete(orderKey);
    }
  }
}

export function cleanOrderReference(raw?: string | null): string {
  if (!raw) return "";
  return String(raw).split("__")[0].trim().toLowerCase();
}

export function findOrderIndex(
  orders: OrderRecord[],
  lookupKeys: (string | undefined | null)[],
  paymobOrderId?: string | null
): number {
  const cleanKeys = Array.from(
    new Set(lookupKeys.map((k) => cleanOrderReference(k)).filter(Boolean))
  );

  for (const key of cleanKeys) {
    const idx = orders.findIndex(
      (o) =>
        (o.orderNumber || "").trim().toLowerCase() === key ||
        (o.id || "").trim().toLowerCase() === key
    );
    if (idx !== -1) return idx;
  }

  const cleanPaymobOrderId = String(paymobOrderId || "").trim();
  if (cleanPaymobOrderId) {
    const idx = orders.findIndex(
      (o) => String(o.paymobOrderId || "").trim() === cleanPaymobOrderId
    );
    if (idx !== -1) return idx;
  }

  return -1;
}

export interface DispatchOrderOptions {
  forceRedispatch?: boolean;
  shouldDispatch?: (order: OrderRecord) => boolean;
  preDispatchPatch?: (order: OrderRecord) => Partial<OrderRecord>;
  appendNote?: string;
  noteDedupeToken?: string;
}

export interface DispatchOrderResult {
  found: boolean;
  order?: OrderRecord;
  stoxDispatch: ShippingShipmentResult | null;
  skippedAlreadyDispatched?: boolean;
}

/**
 * Safely applies updates to an order and dispatches to the active shipping carrier (STOX)
 * inside a per-order lock with idempotency protection.
 */
export async function dispatchOrderToShipping(
  orderLookupKeys: string | (string | undefined | null)[],
  options: DispatchOrderOptions = {},
  paymobOrderId?: string
): Promise<DispatchOrderResult> {
  const keysArray = Array.isArray(orderLookupKeys) ? orderLookupKeys : [orderLookupKeys];

  const initialOrders = readJsonFile<OrderRecord[]>("orders.json", []);
  const initialIdx = findOrderIndex(initialOrders, keysArray, paymobOrderId);
  if (initialIdx === -1) {
    return { found: false, stoxDispatch: null };
  }

  const canonicalId = initialOrders[initialIdx].id;

  return withOrderDispatchLock(canonicalId, async () => {
    let targetSnapshot: OrderRecord | null = null;
    let shouldSendToCarrier = false;

    const updatedOrderBeforeCall = await withOrdersFileLock(() => {
      const orders = readJsonFile<OrderRecord[]>("orders.json", []);
      const idx = orders.findIndex((o) => o.id === canonicalId);
      if (idx === -1) return null;

      const existing = orders[idx];
      const patch = options.preDispatchPatch ? options.preDispatchPatch(existing) : {};
      const merged: OrderRecord = {
        ...existing,
        ...patch,
      };

      if (options.appendNote) {
        const dedupe = options.noteDedupeToken || options.appendNote;
        const currentNotes = merged.notes || "";
        if (!currentNotes.includes(dedupe)) {
          merged.notes = `${currentNotes}\n${options.appendNote}`.trim();
        }
      }

      const alreadyHasTracking = Boolean(
        merged.stoxTrackingNumber && merged.stoxStatus !== "FAILED"
      );
      const wantsDispatch = options.shouldDispatch ? options.shouldDispatch(merged) : true;

      shouldSendToCarrier =
        Boolean(options.forceRedispatch) || (wantsDispatch && !alreadyHasTracking);

      orders[idx] = merged;
      writeJsonFile("orders.json", orders);
      targetSnapshot = { ...merged };
      return merged;
    });

    if (!updatedOrderBeforeCall || !targetSnapshot) {
      return { found: false, stoxDispatch: null };
    }

    if (!shouldSendToCarrier) {
      return {
        found: true,
        order: updatedOrderBeforeCall,
        stoxDispatch: null,
        skippedAlreadyDispatched: Boolean(
          (updatedOrderBeforeCall as OrderRecord).stoxTrackingNumber
        ),
      };
    }

    const orderForShipment: OrderRecord = targetSnapshot;
    const codToCollect =
      orderForShipment.paymentStatus === "FULLY_PAID"
        ? 0
        : typeof orderForShipment.remainingCodAmount === "number"
        ? orderForShipment.remainingCodAmount
        : orderForShipment.total;

    const stoxDispatch = await universalShippingService.createShipment({
      orderId: orderForShipment.id,
      orderNumber: orderForShipment.orderNumber,
      recipient: {
        fullName: orderForShipment.customerName,
        phone: orderForShipment.customerPhone,
        governorate: orderForShipment.governorate,
        city: orderForShipment.city,
        street: orderForShipment.street,
        building: orderForShipment.building,
        notes: orderForShipment.notes,
      },
      codAmount: codToCollect,
      items: (orderForShipment.items || []).map((item) => ({
        sku: item.variantId || item.productId || "SLF-001",
        name: `${item.productName}${item.variantTitle ? ` (${item.variantTitle})` : ""}`,
        quantity: Number(item.quantity) || 1,
        price: Number(item.unitPrice) || 0,
      })),
    });

    const finalOrder = await withOrdersFileLock(() => {
      const freshOrders = readJsonFile<OrderRecord[]>("orders.json", []);
      const idx = freshOrders.findIndex((o) => o.id === canonicalId);
      if (idx === -1) return null;

      if (stoxDispatch.success && stoxDispatch.trackingNumber) {
        freshOrders[idx].stoxTrackingNumber = stoxDispatch.trackingNumber;
        freshOrders[idx].stoxStatus = stoxDispatch.status || "CREATED";
        freshOrders[idx].stoxOrderId = stoxDispatch.carrierOrderId;
        freshOrders[idx].waybillUrl = stoxDispatch.waybillUrl;
        freshOrders[idx].stoxDispatchedAt = new Date().toISOString();
        freshOrders[idx].stoxError = undefined;
      } else {
        freshOrders[idx].stoxStatus = "FAILED";
        freshOrders[idx].stoxError =
          stoxDispatch.error || "تعذر إرسال الشحنة لشركة الشحن";
      }

      writeJsonFile("orders.json", freshOrders);
      return freshOrders[idx];
    });

    return {
      found: true,
      order: finalOrder || updatedOrderBeforeCall,
      stoxDispatch,
    };
  });
}

export interface PaymobConfirmationParams {
  orderLookupKeys: (string | undefined | null)[];
  paymobOrderId?: string;
  isSuccess: boolean;
  isPending?: boolean;
  transactionId?: string;
  source: "WEBHOOK" | "VERIFY";
}

export interface PaymobConfirmationResult {
  found: boolean;
  pending: boolean;
  order?: OrderRecord;
  stoxDispatch: ShippingShipmentResult | null;
}

/**
 * Handles confirmed Paymob payment notifications (Webhook or Redirect Verify):
 * 1. Marks order as FULLY_PAID (or DEPOSIT_PAID)
 * 2. Automatically promotes orderStatus from PENDING_CONFIRMATION to PROCESSING (no admin needed)
 * 3. Automatically dispatches the order to STOX idempotently (no duplicate shipments)
 */
export async function handlePaymobPaymentConfirmation(
  params: PaymobConfirmationParams
): Promise<PaymobConfirmationResult> {
  const initialOrders = readJsonFile<OrderRecord[]>("orders.json", []);
  const initialIdx = findOrderIndex(
    initialOrders,
    params.orderLookupKeys,
    params.paymobOrderId
  );

  if (initialIdx === -1) {
    return { found: false, pending: Boolean(params.isPending), stoxDispatch: null };
  }

  const canonicalId = initialOrders[initialIdx].id;

  // Pending Paymob wallet/OTP payment: do not mark FAILED and do not dispatch yet.
  if (params.isPending) {
    return {
      found: true,
      pending: true,
      order: initialOrders[initialIdx],
      stoxDispatch: null,
    };
  }

  // Successful Paymob payment: confirm payment, promote to PROCESSING, and auto-dispatch to STOX.
  if (params.isSuccess) {
    const txLabel = params.transactionId ? `معاملة رقم: ${params.transactionId}` : params.source;
    const noteText = `[Paymob ${params.source === "WEBHOOK" ? "Webhook" : "Verified"}] تم الدفع الإلكتروني بنجاح (${txLabel}) وتحويل الطلب تلقائياً إلى قيد التجهيز وإرساله لشركة الشحن`;

    const result = await dispatchOrderToShipping(
      [canonicalId, ...params.orderLookupKeys],
      {
        shouldDispatch: (order) => order.orderStatus !== "CANCELLED",
        preDispatchPatch: (existing) => ({
          paymentStatus: existing.isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID",
          remainingCodAmount: existing.isDepositMode ? existing.remainingCodAmount : 0,
          orderStatus:
            existing.orderStatus === "PENDING_CONFIRMATION"
              ? "PROCESSING"
              : existing.orderStatus,
          ...(params.paymobOrderId ? { paymobOrderId: params.paymobOrderId } : {}),
          ...(params.transactionId ? { paymobTransactionId: params.transactionId } : {}),
        }),
        appendNote: noteText,
        noteDedupeToken: params.transactionId || "[Paymob",
      },
      params.paymobOrderId
    );

    return {
      found: result.found,
      pending: false,
      order: result.order,
      stoxDispatch: result.stoxDispatch,
    };
  }

  // Explicit failed payment: mark FAILED only if the order is not already paid.
  const updatedFailedOrder = await withOrderDispatchLock(canonicalId, async () => {
    return withOrdersFileLock(() => {
      const orders = readJsonFile<OrderRecord[]>("orders.json", []);
      const idx = orders.findIndex((o) => o.id === canonicalId);
      if (idx === -1) return undefined;

      if (
        orders[idx].paymentStatus !== "FULLY_PAID" &&
        orders[idx].paymentStatus !== "DEPOSIT_PAID"
      ) {
        orders[idx].paymentStatus = "FAILED";
        if (params.paymobOrderId) {
          orders[idx].paymobOrderId = params.paymobOrderId;
        }
        writeJsonFile("orders.json", orders);
      }
      return orders[idx];
    });
  });

  return {
    found: Boolean(updatedFailedOrder),
    pending: false,
    order: updatedFailedOrder,
    stoxDispatch: null,
  };
}

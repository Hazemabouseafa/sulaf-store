"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { validateCouponCode, syncCouponsFromServer } from "@/lib/coupons/coupon-store";
import { ProductData, ProductVariantData, SULAF_SETTINGS } from "../data/mock-data";
import { useStoreSettings } from "../settings/store-settings-context";

export interface CartItem {
  id: string;
  product: ProductData;
  variant?: ProductVariantData;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: ProductData, variant?: ProductVariantData, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isDepositMode: boolean;
  setIsDepositMode: (val: boolean) => void;
  depositAmount: number;
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDepositMode, setIsDepositMode] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load cart from localStorage and sync server coupons on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sulaf_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsHydrated(true);
    }
    syncCouponsFromServer();
  }, []);

  // Save cart to localStorage only after initial hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("sulaf_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, isHydrated]);

  const { settings } = useStoreSettings();
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const depositAmount = settings.payment?.depositAmount ?? SULAF_SETTINGS.depositAmountEgp;

  // Keep discountAmount dynamically synced with subtotal changes
  useEffect(() => {
    if (!appliedCoupon) {
      setDiscountAmount(0);
      return;
    }
    const res = validateCouponCode(appliedCoupon, subtotal);
    if (res.valid) {
      setDiscountAmount(res.discount);
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  }, [subtotal, appliedCoupon]);

  function openCart() {
    setIsOpen(true);
  }

  function closeCart() {
    setIsOpen(false);
  }

  function addItem(product: ProductData, variant?: ProductVariantData, quantity = 1) {
    setItems((prev) => {
      const itemId = variant ? `${product.id}-${variant.id}` : product.id;
      const existing = prev.find((i) => i.id === itemId);
      const unitPrice = variant ? variant.price : product.price;

      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity, unitPrice } : i
        );
      }
      return [...prev, { id: itemId, product, variant, quantity, unitPrice }];
    });
    setIsOpen(true);
  }

  function removeItem(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  }

  function applyCoupon(code: string) {
    const clean = code.trim().toUpperCase();
    const result = validateCouponCode(clean, subtotal);
    if (result.valid) {
      setAppliedCoupon(clean);
      setDiscountAmount(result.discount);
      return { success: true, message: result.message };
    }
    return { success: false, message: result.message };
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isDepositMode,
        setIsDepositMode,
        depositAmount,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

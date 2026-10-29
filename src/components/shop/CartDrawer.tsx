"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Truck,
  Tag,
  CheckCircle2,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    isDepositMode,
    setIsDepositMode,
    depositAmount,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { settings } = useStoreSettings();
  const { isArabic, t, dir } = useLanguage();

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  if (!isOpen) return null;

  // Multi-product Promo & Volume Discount (matching CheckoutPage)
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const multiPromo = settings.multiProductPromo || {
    enabled: true,
    minQuantity: 2,
    discountType: "PERCENTAGE" as const,
    discountValue: 10,
    freeShippingEnabled: true,
  };
  const isMultiPromoEligible = multiPromo.enabled && totalItemsCount >= (multiPromo.minQuantity || 2);
  let multiProductDiscount = 0;
  if (isMultiPromoEligible) {
    if (multiPromo.discountType === "PERCENTAGE") {
      multiProductDiscount = Math.round((subtotal * multiPromo.discountValue) / 100);
    } else {
      multiProductDiscount = multiPromo.discountValue;
    }
  }
  const combinedDiscount = discountAmount + multiProductDiscount;

  const finalTotal = Math.max(0, subtotal - combinedDiscount);
  const remainingCod = isDepositMode ? Math.max(0, finalTotal - depositAmount) : 0;
  const payNowAmount = isDepositMode ? Math.min(finalTotal, depositAmount) : finalTotal;

  // Free shipping progress (Threshold OR Multi-item Promo)
  const freeShippingThreshold = settings.shipping?.freeShippingThreshold || SULAF_SETTINGS.freeShippingThreshold;
  const isFreeShippingViaPromo = isMultiPromoEligible && multiPromo.freeShippingEnabled;
  const progressPercent = isFreeShippingViaPromo ? 100 : Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diffToFree = isFreeShippingViaPromo ? 0 : freeShippingThreshold - subtotal;
  const currency = isArabic ? "ج.م" : "EGP";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  function handleCouponSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponCode("");
  }

  return (
    <div className="fixed inset-0 z-[999] flex justify-end" dir={dir}>
      {/* Dimmed Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Sheet */}
      <div className={`relative z-10 w-full sm:max-w-md bg-[#fafcf3] text-[#222b1a] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in duration-300 ${
        isArabic ? "slide-in-from-left" : "slide-in-from-right"
      }`}>
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#e2e8c0] flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#485c36]" />
            <h2 className="font-amiri text-2xl font-bold text-[#485c36]">
              {t.cart.title}
            </h2>
            <span className="text-xs bg-[#485c36]/10 text-[#485c36] font-semibold px-2 py-0.5 rounded-full">
              {items.length} {t.cart.itemsCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            aria-label={t.nav.close}
          >
            <X className="w-5 h-5 text-[#610b0d]" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#485c36]/10 border-b border-[#e2e8c0]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 font-medium text-[#485c36]">
              <Truck className="w-4 h-4 shrink-0" />
              <span>
                {diffToFree > 0
                  ? (isArabic
                      ? `أضيفي منتجات بقيمة ${diffToFree} ج.م للحصول على شحن مجاني!`
                      : `Add ${diffToFree} EGP to unlock Free Nationwide Delivery!`)
                  : t.cart.freeShippingAchieved}
              </span>
            </span>
            <span className="font-bold text-[#485c36]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full bg-[#485c36] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#485c36]/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-[#485c36]/60" />
              </div>
              <p className="font-amiri text-xl font-bold text-[#485c36]">{t.cart.emptyTitle}</p>
              <p className="text-xs text-gray-600 mt-1 max-w-xs">
                {t.cart.emptyDesc}
              </p>
              <button
                onClick={closeCart}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#485c36] text-[#f6f9e6] text-sm font-semibold hover:bg-[#3a4a2b] transition-colors cursor-pointer"
              >
                {t.cart.startShopping}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3.5 rounded-2xl bg-white border border-[#e2e8c0] shadow-sm relative group"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-[#f4f1e6] border border-[#e2e8c0] flex items-center justify-center shrink-0 p-2 relative">
                  <Image
                    src={item.product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                    alt={item.product.nameAr}
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#222b1a] line-clamp-1">
                      {isArabic ? item.product.nameAr : item.product.nameEn}
                    </h3>
                    {item.variant && (
                      <span className="text-[11px] text-gray-500">
                        {isArabic ? item.variant.titleAr : item.variant.titleEn}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#e2e8c0] rounded-lg overflow-hidden bg-[#f4f1e6]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-black/5 text-[#485c36] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-black/5 text-[#485c36] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Item Total Price */}
                    <span className="font-bold text-sm text-[#485c36]">
                      {item.unitPrice * item.quantity} {currency}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className={`absolute top-2.5 ${isArabic ? "left-2.5" : "right-2.5"} p-1 text-gray-400 hover:text-[#ca384a] transition-colors cursor-pointer`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Breakdown */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#e2e8c0] bg-white space-y-3 sm:space-y-4 shadow-lg pb-safe">
            {/* Dual Payment Option Selector (Deposit vs Full) */}
            <div className="p-3 rounded-2xl bg-[#fafcf3] border border-[#e2e8c0] space-y-2">
              <span className="block text-xs font-bold text-[#485c36]">
                {t.cart.paymentChoiceTitle}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsDepositMode(false)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    !isDepositMode
                      ? "bg-[#485c36] text-[#f6f9e6] border-[#485c36] shadow-sm font-bold"
                      : "bg-white text-gray-700 border-[#e2e8c0] hover:bg-black/5"
                  }`}
                >
                  <span>{t.cart.fullPayBadge}</span>
                  <span className="text-[10px] opacity-80">{t.cart.fullPayDesc}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDepositMode(true)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isDepositMode
                      ? "bg-[#610b0d] text-[#f6f9e6] border-[#610b0d] shadow-sm font-bold"
                      : "bg-white text-gray-700 border-[#e2e8c0] hover:bg-black/5"
                  }`}
                >
                  <span>{t.cart.depositBadge.replace('{amount}', String(depositAmount))}</span>
                  <span className="text-[10px] opacity-80">{t.cart.depositDesc}</span>
                </button>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{isArabic ? "تم تطبيق الكوبون:" : "Coupon Applied:"} <strong>{appliedCoupon}</strong> (-{discountAmount} {currency})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    {isArabic ? "إلغاء" : "Remove"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder={t.cart.couponPlaceholder}
                      className="w-full py-2 px-3 text-xs rounded-xl bg-[#fafcf3] border border-[#e2e8c0] focus:outline-none focus:ring-1 focus:ring-[#485c36]"
                    />
                    <Tag className={`w-3.5 h-3.5 absolute ${isArabic ? "left-2.5" : "right-2.5"} top-1/2 -translate-y-1/2 text-gray-400`} />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#485c36] text-[#f6f9e6] rounded-xl text-xs font-semibold hover:bg-[#3a4a2b] transition-colors cursor-pointer"
                  >
                    {t.cart.applyCoupon}
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                <p className={`mt-1 text-[11px] ${couponMsg.error ? "text-red-600" : "text-green-600"}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-[#e2e8c0]">
              <div className="flex justify-between text-gray-600">
                <span>{t.cart.subtotal}</span>
                <span>{subtotal} {currency}</span>
              </div>
              {multiProductDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>
                    {isArabic
                      ? `خصم شراء ${multiPromo.minQuantity}+ قطع (${multiPromo.discountType === "PERCENTAGE" ? `${multiPromo.discountValue}%` : `${multiPromo.discountValue} ${currency}`})`
                      : `Multi-item Promo (${multiPromo.minQuantity}+ items)`}
                  </span>
                  <span>-{multiProductDiscount} {currency}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>{t.cart.discount}</span>
                  <span>-{discountAmount} {currency}</span>
                </div>
              )}
              {isDepositMode && (
                <div className="flex justify-between text-[#610b0d] font-semibold">
                  <span>{t.cart.remainingCod}</span>
                  <span>{remainingCod} {currency}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#485c36] pt-1 border-t border-dashed border-[#e2e8c0]">
                <span>{t.cart.dueNow}</span>
                <span>{payNowAmount} {currency}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 rounded-2xl bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>{t.cart.checkoutBtn}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#485c36]" />
              <span>{t.cart.guarantee}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

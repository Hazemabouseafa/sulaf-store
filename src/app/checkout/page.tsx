"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useCustomerAuth } from "@/lib/auth/customer-auth";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { EGYPT_GOVERNORATES_RATES } from "@/lib/shipping/stox";
import { createOrder } from "@/lib/orders/order-store";
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Upload,
  MessageCircle,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Receipt,
  FileCheck,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    isDepositMode,
    setIsDepositMode,
    depositAmount,
    discountAmount,
    appliedCoupon,
    clearCart,
  } = useCart();
  const { settings } = useStoreSettings();
  const { isArabic, t, dir } = useLanguage();
  const { user } = useCustomerAuth();

  const currency = isArabic ? "ج.م" : "EGP";

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [governorate, setGovernorate] = useState("القاهرة");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [building, setBuilding] = useState("");
  const [notes, setNotes] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [closePersonName, setClosePersonName] = useState("");

  useEffect(() => {
    if (!user) return;
    if (!fullName && user.name) setFullName(user.name);
    if (!phone && user.phone) setPhone(user.phone);
    if (!email && user.email) setEmail(user.email);
    const defaultAddr = user.savedAddresses?.find((a) => a.isDefault) || user.savedAddresses?.[0];
    if (defaultAddr) {
      if (defaultAddr.governorate) setGovernorate(defaultAddr.governorate);
      if (!city && defaultAddr.city) setCity(defaultAddr.city);
      if (!street && defaultAddr.address) setStreet(defaultAddr.address);
    }
  }, [user]);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"PAYMOB" | "INSTAPAY">("INSTAPAY");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>("");

  // Order state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  // 1. Multi-product Promo & Volume Discount
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

  // 2. Custom Governorate Shipping Rate vs Default Unified Rate
  const defaultUnifiedRate = settings.shipping?.defaultUnifiedRate ?? 45;
  const customRateMatch = settings.shipping?.customGovernorateRates?.find(
    (r) => r.governorate === governorate
  );
  const governorateBaseFee = customRateMatch ? customRateMatch.rate : defaultUnifiedRate;

  // 3. Free Shipping Logic: Multi-item exemption OR order threshold
  const freeThreshold = settings.shipping?.freeShippingThreshold || SULAF_SETTINGS.freeShippingThreshold;
  const isFreeShippingViaPromo = isMultiPromoEligible && multiPromo.freeShippingEnabled;
  const isFreeShippingViaThreshold = subtotal >= freeThreshold;
  const isFreeShipping = isFreeShippingViaPromo || isFreeShippingViaThreshold;

  const rawShipping = isFreeShipping ? 0 : governorateBaseFee;
  const finalTotal = Math.max(0, subtotal - combinedDiscount + rawShipping);
  const payNow = isDepositMode ? Math.min(finalTotal, depositAmount) : finalTotal;
  const remainingCod = isDepositMode ? Math.max(0, finalTotal - depositAmount) : 0;

  // Handle Mock Receipt Upload
  function handleReceiptChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle Order Placement
  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !phone || !street || !city) {
      alert(t.checkout.requiredFieldsAlert);
      return;
    }

// Receipt image upload is optional/waived for smooth checkout

    setIsSubmitting(true);

    try {
      // Create Order Record
      const newOrder = createOrder({
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        governorate,
        city,
        street,
        building,
        notes,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: isArabic ? i.product.nameAr : i.product.nameEn,
          variantTitle: isArabic ? i.variant?.titleAr : i.variant?.titleEn,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          total: i.unitPrice * i.quantity,
        })),
        subtotal,
        discount: combinedDiscount,
        shippingFee: rawShipping,
        total: finalTotal,
        isDepositMode,
        depositAmount: isDepositMode ? depositAmount : 0,
        remainingCodAmount: remainingCod,
        paymentMethod: paymentMethod === "PAYMOB" ? "PAYMOB_CARD" : "MANUAL_INSTAPAY",
        paymentStatus: paymentMethod === "PAYMOB" ? (isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID") : "PENDING",
        orderStatus: paymentMethod === "PAYMOB" ? "PROCESSING" : "PENDING_CONFIRMATION",
        receiptUrl: receiptImage || undefined,
        birthdate: birthdate || undefined,
        closePersonName: closePersonName || undefined,
        stoxTrackingNumber: `STX-EG-${Math.floor(100000 + Math.random() * 900000)}`,
        stoxStatus: "CREATED",
      });

      setCreatedOrderNumber(newOrder.orderNumber);
      clearCart();

      // If InstaPay, optionally open WhatsApp
      if (paymentMethod === "INSTAPAY") {
        const msg = encodeURIComponent(
          isArabic
            ? `مرحباً براند سلاف، لقد أتممت طلبي عبر الموقع برقم: ${newOrder.orderNumber}\n` +
              `الاسم: ${fullName}\n` +
              `المبلغ المسدد: ${payNow} ${currency} (${isDepositMode ? "عربون" : "المبلغ كاملاً"})\n` +
              `المتبقي عند الاستلام: ${remainingCod} ${currency}\n` +
              `المحافظة: ${governorate} - ${city}\n` +
              `مرفق إيصال التحويل.`
            : `Hello Sulaf Team, I have placed an order with ref: ${newOrder.orderNumber}\n` +
              `Name: ${fullName}\n` +
              `Amount Paid: ${payNow} ${currency} (${isDepositMode ? "Deposit" : "Full Payment"})\n` +
              `Balance on Delivery: ${remainingCod} ${currency}\n` +
              `Address: ${governorate} - ${city}\n` +
              `Attached is my transfer receipt.`
        );
        const waNumber = (settings.contacts?.whatsapp || SULAF_SETTINGS.whatsappNumber).replace(/[^0-9]/g, "");
        window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
      }
    } catch (err) {
      console.error(err);
      alert(isArabic ? "حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى." : "An error occurred while processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Success Screen
  if (createdOrderNumber) {
    return (
      <div className="py-20 bg-[#f6f9e6] min-h-screen flex items-center justify-center px-4 font-cairo">
        <div className="max-w-xl w-full p-8 md:p-10 rounded-3xl bg-white border border-[#e2e8c0] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="font-cairo text-xs font-bold text-[#d4af37] tracking-widest uppercase">
              {t.checkout.orderSuccess}
            </span>
            <h1 className="font-amiri text-3xl font-bold text-[#485c36] mt-1">
              {t.checkout.thanksMessage}
            </h1>
            <p className="font-cairo text-xs sm:text-sm text-gray-600 mt-2">
              {t.checkout.orderNumber}{" "}
              <strong className="text-[#610b0d] text-base font-mono">{createdOrderNumber}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f6f9e6] border border-[#e2e8c0] text-start font-cairo text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.checkout.paidAmount}</span>
              <strong className="text-[#485c36]">{payNow} {currency}</strong>
            </div>
            {isDepositMode && (
              <div className="flex justify-between text-[#610b0d] font-bold">
                <span>{t.checkout.remainingOnDelivery}</span>
                <span>{remainingCod} {currency}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">{t.checkout.shippingAddress}</span>
              <span>{governorate}، {city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.checkout.carrierPartner}</span>
              <span className="text-[#485c36] font-semibold">Stox Egypt Express</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/track"
              className="flex-1 py-3.5 rounded-2xl bg-[#485c36] text-[#f6f9e6] font-cairo font-bold text-xs hover:bg-[#3a4a2b] transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>{t.checkout.trackOrderBtn}</span>
            </Link>

            <Link
              href="/"
              className="py-3.5 px-6 rounded-2xl border border-[#e2e8c0] bg-[#f6f9e6] text-gray-700 font-cairo font-semibold text-xs hover:bg-[#e2e8c0] transition-colors"
            >
              {t.checkout.backToHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 bg-[#f6f9e6] min-h-screen text-center px-4 flex flex-col items-center justify-center font-cairo">
        <h2 className="font-amiri text-3xl font-bold text-[#485c36]">{t.checkout.emptyTitle}</h2>
        <p className="text-xs text-gray-600 font-cairo mt-2 mb-6">
          {t.checkout.emptyDesc}
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-2xl bg-[#485c36] text-[#f6f9e6] font-cairo font-bold text-xs shadow-md hover:bg-[#3a4a2b] transition-colors"
        >
          {t.checkout.goToShop}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#f6f9e6] min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
            {t.checkout.title}
          </h1>
          <p className="text-xs text-gray-600 font-cairo mt-1">
            {t.checkout.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Delivery Address */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#e2e8c0] pb-3">
                <Truck className="w-5 h-5 text-[#485c36]" />
                <h3 className="font-amiri text-xl font-bold text-[#222b1a]">
                  {t.checkout.step1}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 font-cairo mb-1">
                    {t.checkout.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.checkout.fullNamePlaceholder}
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f6f9e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 font-cairo mb-1">
                    {t.checkout.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.checkout.phonePlaceholder}
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f6f9e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 font-cairo mb-1">
                    {t.checkout.governorate}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f6f9e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                  >
                    {Object.keys(EGYPT_GOVERNORATES_RATES).map((gov) => {
                      const customMatch = settings.shipping?.customGovernorateRates?.find((r) => r.governorate === gov);
                      const fee = customMatch ? customMatch.rate : defaultUnifiedRate;
                      return (
                        <option key={gov} value={gov}>
                          {gov} ({fee} {currency}{customMatch ? (isArabic ? " - سعر خاص" : " - Special") : ""})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 font-cairo mb-1">
                    {t.checkout.city}
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t.checkout.cityPlaceholder}
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f6f9e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 font-cairo mb-1">
                    {t.checkout.address}
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder={t.checkout.addressPlaceholder}
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f6f9e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 font-cairo mb-1">
                    {t.checkout.notes}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.checkout.notesPlaceholder}
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f6f9e6] border border-[#e2e8c0]"
                  />
                </div>

                {/* Optional Birthday & Loved One Fields (Manager Controlled) */}
                {((settings.checkoutFields?.showBirthdate ?? true) || (settings.checkoutFields?.showClosePerson ?? true)) && (
                  <div className="sm:col-span-2 pt-3 border-t border-[#e2e8c0]/70 grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#fbfdf7] p-4 rounded-2xl border border-[#dbe2bd]">
                    {(settings.checkoutFields?.showBirthdate ?? true) && (
                      <div>
                        <label className="block text-xs font-bold text-gray-800 font-cairo mb-1 flex items-center justify-between">
                          <span>{isArabic ? "🎂 تاريخ ميلادكِ (اختياري)" : "🎂 Date of Birth (Optional)"}</span>
                          <span className="text-[10px] text-amber-800 font-semibold">{isArabic ? "لمفاجآت وهدايا VIP" : "For VIP gifts"}</span>
                        </label>
                        <input
                          type="date"
                          value={birthdate}
                          onChange={(e) => setBirthdate(e.target.value)}
                          className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-white border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                        />
                      </div>
                    )}

                    {(settings.checkoutFields?.showClosePerson ?? true) && (
                      <div>
                        <label className="block text-xs font-bold text-gray-800 font-cairo mb-1 flex items-center justify-between">
                          <span>{isArabic ? "💝 اسم شخص مقرب لكِ (اختياري)" : "💝 Loved One's Name (Optional)"}</span>
                          <span className="text-[10px] text-amber-800 font-semibold">{isArabic ? "لهدايا ومفاجآت سُـلاف" : "For gifting"}</span>
                        </label>
                        <input
                          type="text"
                          value={closePersonName}
                          onChange={(e) => setClosePersonName(e.target.value)}
                          placeholder={isArabic ? "مثال: مريم أو الوالدة أو د. أحمد..." : "e.g., Sarah or Mom..."}
                          className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-white border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Payment Policy & Methods */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#e2e8c0] pb-3">
                <CreditCard className="w-5 h-5 text-[#485c36]" />
                <h3 className="font-amiri text-xl font-bold text-[#222b1a]">
                  {t.checkout.step2}
                </h3>
              </div>

              {/* Deposit Toggle */}
              <div className="p-4 rounded-2xl bg-[#f6f9e6] border border-[#e2e8c0] space-y-2">
                <span className="block text-xs font-bold text-[#485c36] font-cairo">
                  {t.checkout.depositOptionTitle}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDepositMode(true)}
                    className={`p-3 rounded-xl border text-xs font-cairo font-bold transition-all ${
                      isDepositMode
                        ? "bg-[#610b0d] text-white border-[#610b0d] shadow-sm"
                        : "bg-white text-gray-700 border-[#e2e8c0]"
                    }`}
                  >
                    <span>{t.checkout.depositChoice.replace('{amount}', depositAmount.toString())}</span>
                    <span className="block text-[10px] opacity-80 mt-0.5">{t.checkout.depositChoiceSub}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDepositMode(false)}
                    className={`p-3 rounded-xl border text-xs font-cairo font-bold transition-all ${
                      !isDepositMode
                        ? "bg-[#485c36] text-white border-[#485c36] shadow-sm"
                        : "bg-white text-gray-700 border-[#e2e8c0]"
                    }`}
                  >
                    <span>{t.checkout.fullPayChoice}</span>
                    <span className="block text-[10px] opacity-80 mt-0.5">{t.checkout.fullPayChoiceSub}</span>
                  </button>
                </div>
              </div>

              {/* Payment Methods Options */}
              <div className="space-y-3 pt-2">
                {/* Method 1: InstaPay & Vodafone Cash Manual Transfer */}
                <div
                  onClick={() => setPaymentMethod("INSTAPAY")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    paymentMethod === "INSTAPAY"
                      ? "bg-[#485c36]/5 border-[#485c36] ring-1 ring-[#485c36]"
                      : "bg-white border-[#e2e8c0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#485c36]" />
                      <span className="font-cairo text-sm font-bold text-[#222b1a]">
                        {t.checkout.instapayOption}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "INSTAPAY"}
                      onChange={() => setPaymentMethod("INSTAPAY")}
                      className="accent-[#485c36]"
                    />
                  </div>

                  {paymentMethod === "INSTAPAY" && (
                    <div className="pt-2 border-t border-[#e2e8c0] space-y-3 font-cairo text-xs text-gray-700 animate-in fade-in">
                      <div className="p-3 rounded-xl bg-white border border-[#d4af37]/40 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">{t.checkout.instapayHandleLabel}</span>
                          <strong className="text-[#610b0d] font-bold text-sm select-all">
                            {settings.payment?.instapayHandle || SULAF_SETTINGS.instapayHandle}
                          </strong>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">{t.checkout.vodafoneLabel}</span>
                          <strong className="text-[#485c36] font-bold text-sm select-all">
                            {settings.payment?.vodafoneCash || SULAF_SETTINGS.vodafoneCashNumber}
                          </strong>
                        </div>
                      </div>

                      {/* Friendly InstaPay confirmation - No image upload required */}
                      <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <strong className="block text-xs font-bold text-emerald-950">
                            {isArabic ? "لا حاجة لرفع صورة الإيصال!" : "No receipt upload required!"}
                          </strong>
                          <p className="text-[11px] text-emerald-800 leading-relaxed">
                            {isArabic
                              ? "حوّل القيمة المطلوبة عبر إنستاباي أو المحفظة، واضغط 'تأكيد الطلب'. سيقوم فريقنا بمطابقة التحويل وتأكيد الشحن فوراً عبر الهاتف أو واتساب."
                              : "Transfer the amount via InstaPay or wallet, then click confirm. Our team will verify and dispatch your order promptly."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Method 2: Paymob Gateway */}
                <div
                  onClick={() => setPaymentMethod("PAYMOB")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    paymentMethod === "PAYMOB"
                      ? "bg-[#485c36]/5 border-[#485c36] ring-1 ring-[#485c36]"
                      : "bg-white border-[#e2e8c0]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#485c36]" />
                      <span className="font-cairo text-sm font-bold text-[#222b1a]">
                        {t.checkout.paymobOption}
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "PAYMOB"}
                      onChange={() => setPaymentMethod("PAYMOB")}
                      className="accent-[#485c36]"
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-cairo">
                    {t.checkout.paymobDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Order Summary & Submit Column */}
          <div className="lg:col-span-5 space-y-5 sticky top-28">
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-4">
              <h3 className="font-amiri text-xl font-bold text-[#485c36] border-b border-[#e2e8c0] pb-3">
                {t.checkout.orderSummary.replace('{count}', items.length.toString())}
              </h3>

              {/* Items summary */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center text-xs font-cairo">
                    <div>
                      <span className="font-bold text-gray-800 block">
                        {isArabic ? i.product.nameAr : i.product.nameEn}
                      </span>
                      <span className="text-gray-500">
                        {isArabic ? "الكمية:" : "Qty:"} {i.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[#485c36]">
                      {i.unitPrice * i.quantity} {currency}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Math */}
              <div className="pt-3 border-t border-[#e2e8c0] space-y-2 font-cairo text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>{t.checkout.productsTotal}</span>
                  <span>{subtotal} {currency}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>{t.checkout.couponDiscount.replace('{coupon}', appliedCoupon || '')}</span>
                    <span>-{discountAmount} {currency}</span>
                  </div>
                )}
                {multiProductDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isArabic ? `خصم الشراء المتعدد (${totalItemsCount} منتجات)` : `Volume Discount (${totalItemsCount} items)`}</span>
                    </span>
                    <span>-{multiProductDiscount} {currency}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t.checkout.shippingCost.replace('{gov}', governorate)}</span>
                  <span className={rawShipping === 0 ? "text-emerald-700 font-bold" : ""}>
                    {rawShipping === 0
                      ? (isFreeShippingViaPromo
                          ? (isArabic ? "مجاناً (عرض المنتجات المتعددة)" : "Free (Multi-item Offer)")
                          : t.checkout.free)
                      : `${rawShipping} ${currency}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#e2e8c0] flex justify-between font-bold text-sm text-gray-900">
                  <span>{t.checkout.orderTotal}</span>
                  <span>{finalTotal} {currency}</span>
                </div>

                {isDepositMode && (
                  <div className="flex justify-between text-xs text-[#610b0d] font-bold p-2.5 rounded-xl bg-[#610b0d]/10 border border-[#610b0d]/20">
                    <span>{t.checkout.remainingOnDelivery}</span>
                    <span>{remainingCod} {currency}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-between text-base font-bold text-[#485c36]">
                  <span>{t.checkout.payNowLabel}</span>
                  <span>{payNow} {currency}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] font-cairo font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t.checkout.submitting}</span>
                ) : (
                  <>
                    <span>
                      {paymentMethod === "INSTAPAY"
                        ? t.checkout.confirmInstapayBtn
                        : t.checkout.confirmPaymobBtn.replace('{amount}', `${payNow} ${currency}`)}
                    </span>
                    {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-cairo text-center">
                <ShieldCheck className="w-4 h-4 text-[#485c36] shrink-0" />
                <span>{t.checkout.securityGuarantee}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

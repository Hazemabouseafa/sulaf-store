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
import { createOrder, OrderRecord } from "@/lib/orders/order-store";
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
  Wallet,
  Clock,
  PhoneCall,
  X,
  RotateCw,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { SulafRosette } from "@/components/home/HeroSection";

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
    applyCoupon,
    removeCoupon,
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

  // Active Gateways policy from Store Settings
  const gatewaysMode = settings.gatewaysMode || "both";
  const isSha7nawyActive = (gatewaysMode === "both" || gatewaysMode === "sha7nawy_only") && settings.sha7nawy?.enabled !== false;
  const isPaymobActive = (gatewaysMode === "both" || gatewaysMode === "paymob_only") && settings.paymob?.enabled !== false;

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"SHA7NAWY" | "PAYMOB" | "INSTAPAY">(() => {
    if (isSha7nawyActive) return "SHA7NAWY";
    if (isPaymobActive) return "PAYMOB";
    return "INSTAPAY";
  });

  const [selectedWallet, setSelectedWallet] = useState<"vf_cash" | "or_cash" | "et_cash">("vf_cash");
  const [walletPhone, setWalletPhone] = useState("");

  // Sha7nawy Interactive Modal States
  const [sha7nawyModalOpen, setSha7nawyModalOpen] = useState(false);
  const [sha7nawyPaymentData, setSha7nawyPaymentData] = useState<any>(null);
  const [sha7nawyTimer, setSha7nawyTimer] = useState(60);
  const [sha7nawyConfirming, setSha7nawyConfirming] = useState(false);
  const [sha7nawySuccess, setSha7nawySuccess] = useState(false);
  const [sha7nawyError, setSha7nawyError] = useState("");
  const [pendingOrder, setPendingOrder] = useState<OrderRecord | null>(null);

  // Sync default payment method if settings change
  useEffect(() => {
    if (isSha7nawyActive && paymentMethod !== "SHA7NAWY" && paymentMethod !== "PAYMOB" && paymentMethod !== "INSTAPAY") {
      setPaymentMethod("SHA7NAWY");
    } else if (!isSha7nawyActive && paymentMethod === "SHA7NAWY") {
      setPaymentMethod(isPaymobActive ? "PAYMOB" : "INSTAPAY");
    } else if (!isPaymobActive && paymentMethod === "PAYMOB") {
      setPaymentMethod(isSha7nawyActive ? "SHA7NAWY" : "INSTAPAY");
    }
  }, [isSha7nawyActive, isPaymobActive]);

  // Sha7nawy Countdown Timer
  useEffect(() => {
    if (!sha7nawyModalOpen || sha7nawySuccess || sha7nawyTimer <= 0) return;
    const interval = setInterval(() => {
      setSha7nawyTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [sha7nawyModalOpen, sha7nawySuccess, sha7nawyTimer]);

  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string>("");

  // Coupon state on Checkout
  const [checkoutCouponInput, setCheckoutCouponInput] = useState("");
  const [checkoutCouponMsg, setCheckoutCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Order state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  const [completedOrderSummary, setCompletedOrderSummary] = useState<{
    orderNumber: string;
    payNow: number;
    remainingCod: number;
    isDepositMode: boolean;
    governorate: string;
    city: string;
    carrierName: string;
  } | null>(null);

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

  const activeProviderKey = settings.shipping?.activeProvider || "stox";
  const activeCarrierObj = settings.shipping?.providers?.[activeProviderKey];
  const activeCarrierName =
    (isArabic ? activeCarrierObj?.nameAr : activeCarrierObj?.nameEn) ||
    activeCarrierObj?.nameEn ||
    "Stox Egypt Express";

  async function handleApplyCheckoutCoupon(e: React.FormEvent) {
    e.preventDefault();
    const clean = checkoutCouponInput.trim();
    if (!clean) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: clean, cartSubtotal: subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        applyCoupon(clean, Number(data.discount) || 0);
        setCheckoutCouponMsg({ text: data.message, error: false });
        setCheckoutCouponInput("");
        return;
      }
      if (data.message) {
        setCheckoutCouponMsg({ text: data.message, error: true });
        return;
      }
    } catch {}
    const localRes = applyCoupon(clean);
    setCheckoutCouponMsg({ text: localRes.message, error: !localRes.success });
    if (localRes.success) setCheckoutCouponInput("");
  }

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

    // Sha7nawy Wallet Validation
    if (paymentMethod === "SHA7NAWY") {
      const cleanWalletNum = (walletPhone.trim() || phone.trim()).replace(/\D/g, "");
      if (!cleanWalletNum || cleanWalletNum.length < 11) {
        alert(isArabic ? "يرجى إدخال رقم محفظة إلكترونية صحيح مكون من 11 رقماً (مثال: 01012345678)" : "Please enter a valid 11-digit mobile wallet number.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPaymentMethod = paymentMethod === "SHA7NAWY"
        ? "SHA7NAWY_WALLET"
        : (paymentMethod === "PAYMOB" ? "PAYMOB_CARD" : "MANUAL_INSTAPAY");

      // Reuse pendingOrder on retry so we do not create duplicate orders or double-deduct stock
      const newOrder =
        pendingOrder ||
        createOrder({
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
            variantId: i.variant?.id,
            variantTitle: isArabic ? i.variant?.titleAr : i.variant?.titleEn,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            total: i.unitPrice * i.quantity,
          })),
          subtotal,
          discount: combinedDiscount,
          couponCode: appliedCoupon || undefined,
          shippingFee: rawShipping,
          total: finalTotal,
          isDepositMode,
          depositAmount: isDepositMode ? depositAmount : 0,
          remainingCodAmount: remainingCod,
          paymentMethod: orderPaymentMethod,
          paymentStatus: paymentMethod === "PAYMOB" ? (isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID") : "PENDING",
          orderStatus: paymentMethod === "PAYMOB" ? "PROCESSING" : "PENDING_CONFIRMATION",
          receiptUrl: receiptImage || undefined,
          birthdate: birthdate || undefined,
          closePersonName: closePersonName || undefined,
          stoxTrackingNumber: `STX-EG-${Math.floor(100000 + Math.random() * 900000)}`,
          stoxStatus: "CREATED",
        });

      const orderSummarySnapshot = {
        orderNumber: newOrder.orderNumber,
        payNow,
        remainingCod,
        isDepositMode,
        governorate,
        city,
        carrierName: activeCarrierName,
      };

      // Special Flow for Sha7nawy Wallet
      if (paymentMethod === "SHA7NAWY") {
        setPendingOrder(newOrder);
        setCompletedOrderSummary(orderSummarySnapshot);
        const cleanWalletNum = (walletPhone.trim() || phone.trim()).replace(/\D/g, "");

        const res = await fetch("/api/payments/sha7nawy/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: newOrder.id,
            orderNumber: newOrder.orderNumber,
            number: cleanWalletNum,
            amount: payNow,
            method: selectedWallet,
            customerName: fullName,
            customerEmail: email,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success && data.data) {
          setSha7nawyPaymentData(data.data);
          setSha7nawyTimer(60);
          setSha7nawySuccess(false);
          setSha7nawyError("");
          setSha7nawyModalOpen(true);
        } else {
          alert(data.error || (isArabic ? "تعذر إنشاء طلب الدفع بالمحفظة، يرجى المحاولة لاحقاً." : "Failed to initiate wallet payment."));
        }
        return;
      }

      setCompletedOrderSummary(orderSummarySnapshot);
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

  // Sha7nawy Confirm Payment Action
  async function handleConfirmSha7nawyPayment() {
    if (!sha7nawyPaymentData?.reference) return;
    setSha7nawyConfirming(true);
    setSha7nawyError("");
    try {
      const res = await fetch("/api/payments/sha7nawy/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: sha7nawyPaymentData.reference,
          orderId: pendingOrder?.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSha7nawySuccess(true);
        clearCart();
        setTimeout(() => {
          setSha7nawyModalOpen(false);
          if (pendingOrder) {
            setCreatedOrderNumber(pendingOrder.orderNumber);
          }
        }, 1500);
      } else {
        setSha7nawyError(
          data.error ||
          (isArabic
            ? "لم يتم تأكيد السحب بعد. يرجى التأكد من الموافقة على هاتفك أولاً والمحاولة مجدداً."
            : "Payment not verified yet. Please approve on your phone and try again.")
        );
      }
    } catch {
      setSha7nawyError(isArabic ? "حدث خطأ في الاتصال بالخادم." : "Server connection error.");
    } finally {
      setSha7nawyConfirming(false);
    }
  }

  // Success Screen
  if (createdOrderNumber) {
    return (
      <div className="py-20 bg-[#f4f1e6] min-h-screen flex items-center justify-center px-4 font-cairo">
        <div className="max-w-xl w-full p-8 md:p-10 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-xl text-center space-y-6">
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

          <div className="p-4 rounded-2xl bg-[#f4f1e6] border border-[#e2e8c0] text-start font-cairo text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">{t.checkout.paidAmount}</span>
              <strong className="text-[#485c36]">
                {completedOrderSummary ? completedOrderSummary.payNow : payNow} {currency}
              </strong>
            </div>
            {(completedOrderSummary ? completedOrderSummary.isDepositMode : isDepositMode) && (
              <div className="flex justify-between text-[#610b0d] font-bold">
                <span>{t.checkout.remainingOnDelivery}</span>
                <span>
                  {completedOrderSummary ? completedOrderSummary.remainingCod : remainingCod} {currency}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">{t.checkout.shippingAddress}</span>
              <span>
                {completedOrderSummary ? completedOrderSummary.governorate : governorate}،{" "}
                {completedOrderSummary ? completedOrderSummary.city : city}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t.checkout.carrierPartner}</span>
              <span className="text-[#485c36] font-semibold">
                {completedOrderSummary?.carrierName || activeCarrierName}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/track?id=${encodeURIComponent(createdOrderNumber)}`}
              className="flex-1 py-3.5 rounded-2xl bg-[#485c36] text-[#f6f9e6] font-cairo font-bold text-xs hover:bg-[#3a4a2b] transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Truck className="w-4 h-4" />
              <span>{t.checkout.trackOrderBtn}</span>
            </Link>

            <Link
              href="/"
              className="py-3.5 px-6 rounded-2xl border border-[#e2e8c0] bg-[#f4f1e6] text-gray-700 font-cairo font-semibold text-xs hover:bg-[#e2e8c0] transition-colors"
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
      <div className="py-24 bg-[#f4f1e6] min-h-screen text-center px-4 flex flex-col items-center justify-center font-cairo">
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
    <div className="py-12 bg-[#f4f1e6] min-h-screen font-cairo">
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
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm space-y-4">
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
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f4f1e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
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
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f4f1e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 font-cairo mb-1">
                    {t.checkout.governorate}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f4f1e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
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
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f4f1e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
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
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f4f1e6] border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36]"
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
                    className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-[#f4f1e6] border border-[#e2e8c0]"
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
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#e2e8c0] pb-3">
                <CreditCard className="w-5 h-5 text-[#485c36]" />
                <h3 className="font-amiri text-xl font-bold text-[#222b1a]">
                  {t.checkout.step2}
                </h3>
              </div>

              {/* Deposit Toggle */}
              <div className="p-4 rounded-2xl bg-[#f4f1e6] border border-[#e2e8c0] space-y-2">
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
                {/* Method 1: Sha7nawy Smart Mobile Wallets (Vodafone Cash, Orange, Etisalat) */}
                {isSha7nawyActive && (
                  <div
                    onClick={() => setPaymentMethod("SHA7NAWY")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                      paymentMethod === "SHA7NAWY"
                        ? "bg-[#485c36]/5 border-[#485c36] ring-1 ring-[#485c36]"
                        : "bg-white border-[#e2e8c0] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center shrink-0">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-cairo text-sm font-bold text-[#222b1a]">
                              {isArabic ? "المحافظ الإلكترونية الذكية (فودافون كاش، أورنج، اتصالات)" : "Smart Mobile Wallets (Vodafone, Orange, Etisalat)"}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {isArabic ? "دفع مباشر فوري" : "Direct & Instant"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-cairo mt-0.5">
                            {isArabic ? "بوابة شحnaوي المعتمدة (API v2.0) — سحب فوري بضغطة زر وأمان تام" : "Sha7nawy Gate v2.0 — Instant debit with mobile approval"}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "SHA7NAWY"}
                        onChange={() => setPaymentMethod("SHA7NAWY")}
                        className="accent-[#485c36]"
                      />
                    </div>

                    {paymentMethod === "SHA7NAWY" && (
                      <div className="pt-3 border-t border-[#e2e8c0] space-y-3 font-cairo text-xs text-gray-700 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-xs font-bold text-gray-800">
                          {isArabic ? "اختاري نوع محفظتكِ الإلكترونية:" : "Choose your wallet provider:"}
                        </label>

                        {/* 3 Wallet Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Vodafone Cash */}
                          <div
                            onClick={() => setSelectedWallet("vf_cash")}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${
                              selectedWallet === "vf_cash"
                                ? "bg-rose-50/70 border-rose-600 text-rose-950 shadow-2xs font-bold"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                              VF
                            </div>
                            <div className="text-start">
                              <span className="block text-xs font-bold">فودافون كاش</span>
                              <span className="text-[10px] text-gray-500 font-mono block">اطلب *9*1#</span>
                            </div>
                          </div>

                          {/* Orange Cash */}
                          <div
                            onClick={() => setSelectedWallet("or_cash")}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${
                              selectedWallet === "or_cash"
                                ? "bg-amber-50/70 border-amber-600 text-amber-950 shadow-2xs font-bold"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                              OR
                            </div>
                            <div className="text-start">
                              <span className="block text-xs font-bold">أورنج كاش</span>
                              <span className="text-[10px] text-gray-500 font-mono block">تطبيق Orange</span>
                            </div>
                          </div>

                          {/* Etisalat Cash */}
                          <div
                            onClick={() => setSelectedWallet("et_cash")}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 ${
                              selectedWallet === "et_cash"
                                ? "bg-emerald-50/70 border-emerald-600 text-emerald-950 shadow-2xs font-bold"
                                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                              e&
                            </div>
                            <div className="text-start">
                              <span className="block text-xs font-bold">اتصالات كاش</span>
                              <span className="text-[10px] text-gray-500 font-mono block">اطلب *777*11#</span>
                            </div>
                          </div>
                        </div>

                        {/* Dedicated Wallet Phone Input */}
                        <div className="pt-1">
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {isArabic ? "رقم هاتف المحفظة التي سيتم الخصم منها:" : "Wallet Mobile Number:"}
                          </label>
                          <input
                            type="tel"
                            value={walletPhone || phone}
                            onChange={(e) => setWalletPhone(e.target.value)}
                            placeholder="01012345678"
                            className="w-full py-2.5 px-3.5 text-xs font-cairo rounded-xl bg-white border border-[#e2e8c0] focus:ring-1 focus:ring-[#485c36] font-mono"
                          />
                          <p className="text-[11px] text-gray-500 mt-1">
                            {isArabic
                              ? "فور الضغط على 'تأكيد الطلب'، سيظهر لكِ كود تأكيد السحب وطلب الرقم السري على هاتفك فوراً."
                              : "After clicking confirm, an approval prompt will trigger on your phone to complete payment."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Method 2: Paymob Credit / Debit Cards */}
                {isPaymobActive && (
                  <div
                    onClick={() => setPaymentMethod("PAYMOB")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      paymentMethod === "PAYMOB"
                        ? "bg-[#485c36]/5 border-[#485c36] ring-1 ring-[#485c36]"
                        : "bg-white border-[#e2e8c0] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center shrink-0">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-cairo text-sm font-bold text-[#222b1a]">
                            {t.checkout.paymobOption} (Visa / Mastercard)
                          </span>
                          <p className="text-xs text-gray-500 font-cairo mt-0.5">
                            {t.checkout.paymobDesc}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "PAYMOB"}
                        onChange={() => setPaymentMethod("PAYMOB")}
                        className="accent-[#485c36]"
                      />
                    </div>
                  </div>
                )}

                {/* Method 3: InstaPay & Vodafone Cash Manual Transfer */}
                <div
                  onClick={() => setPaymentMethod("INSTAPAY")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                    paymentMethod === "INSTAPAY"
                      ? "bg-[#485c36]/5 border-[#485c36] ring-1 ring-[#485c36]"
                      : "bg-white border-[#e2e8c0] hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-cairo text-sm font-bold text-[#222b1a]">
                          {t.checkout.instapayOption} (تحويل يدوي)
                        </span>
                        <p className="text-xs text-gray-500 font-cairo mt-0.5">
                          {isArabic ? "تحويل عبر تطبيق إنستاباي أو تطبيق المحفظة ثم تأكيد الشحن هاتفياً" : "Direct manual transfer via InstaPay handle"}
                        </p>
                      </div>
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
                    <div className="pt-2 border-t border-[#e2e8c0] space-y-3 font-cairo text-xs text-gray-700 animate-in fade-in" onClick={(e) => e.stopPropagation()}>
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
                              ? "حوّلي القيمة المطلوبة عبر إنستاباي، واضغطي 'تأكيد الطلب'. سيقوم فريقنا بمطابقة التحويل وتأكيد الشحن فوراً."
                              : "Transfer the amount via InstaPay, then click confirm. Our team will verify and dispatch your order promptly."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Order Summary & Submit Column */}
          <div className="lg:col-span-5 space-y-5 sticky top-28">
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm space-y-4">
              <h3 className="font-amiri text-xl font-bold text-[#485c36] border-b border-[#e2e8c0] pb-3">
                {t.checkout.orderSummary.replace('{count}', totalItemsCount.toString())}
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

              {/* Coupon Input inside Checkout Summary */}
              <div className="pt-3 border-t border-[#e2e8c0]">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 font-cairo">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span>
                        {isArabic ? "كود الخصم المطبق:" : "Coupon Applied:"}{" "}
                        <strong className="font-mono">{appliedCoupon}</strong> (-{discountAmount} {currency})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeCoupon();
                        setCheckoutCouponMsg(null);
                      }}
                      className="text-red-600 hover:underline font-bold cursor-pointer"
                    >
                      {isArabic ? "إلغاء" : "Remove"}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={checkoutCouponInput}
                        onChange={(e) => setCheckoutCouponInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyCheckoutCoupon(e as any);
                          }
                        }}
                        placeholder={t.cart.couponPlaceholder}
                        className="w-full py-2 px-3 text-xs rounded-xl bg-[#fafcf3] border border-[#e2e8c0] focus:outline-none focus:ring-1 focus:ring-[#610b0d]"
                      />
                      <Tag className={`w-3.5 h-3.5 absolute ${isArabic ? "left-2.5" : "right-2.5"} top-1/2 -translate-y-1/2 text-gray-400`} />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleApplyCheckoutCoupon(e as any)}
                      className="px-4 py-2 bg-[#610b0d] text-[#f6f9e6] rounded-xl text-xs font-bold hover:bg-[#470708] transition-colors cursor-pointer"
                    >
                      {t.cart.applyCoupon}
                    </button>
                  </div>
                )}
                {checkoutCouponMsg && !appliedCoupon && (
                  <p className={`mt-1 text-[11px] font-cairo ${checkoutCouponMsg.error ? "text-red-600" : "text-green-600"}`}>
                    {checkoutCouponMsg.text}
                  </p>
                )}
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
                      {paymentMethod === "SHA7NAWY"
                        ? (isArabic ? `دفع ${payNow} ${currency} بالمحفظة الإلكترونية` : `Pay ${payNow} ${currency} via Wallet`)
                        : (paymentMethod === "INSTAPAY"
                            ? t.checkout.confirmInstapayBtn
                            : t.checkout.confirmPaymobBtn.replace('{amount}', `${payNow} ${currency}`))}
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

        {/* Sha7nawy Interactive Wallet Payment Modal */}
        {sha7nawyModalOpen && sha7nawyPaymentData && (
          <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-[#fdfef8] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#485c36]/20 space-y-5 text-start relative overflow-hidden">
              {/* Decorative Rosette Watermark */}
              <div className="absolute -top-10 -end-10 w-40 h-40 opacity-5 pointer-events-none text-[#485c36]">
                <SulafRosette className="w-full h-full" />
              </div>

              {sha7nawySuccess ? (
                <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl text-gray-900 font-amiri">
                      {isArabic ? "تم تأكيد السحب بنجاح واكتمال الدفع! 🎉" : "Payment Confirmed Successfully! 🎉"}
                    </h3>
                    <p className="text-xs text-gray-500 font-cairo">
                      {isArabic ? "جاري تحويلك إلى صفحة تفاصيل الطلب وتأكيد الشحن..." : "Redirecting to order confirmation..."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-gray-900 font-cairo">
                          {isArabic ? "تأكيد الدفع عبر المحفظة الإلكترونية" : "Confirm Wallet Payment"}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          Sha7nawy Gate v2.0 • {sha7nawyPaymentData.reference}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSha7nawyModalOpen(false)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Amount & Timer Row */}
                  <div className="p-4 rounded-2xl bg-[#f4f1e6] border border-[#dbe2bd] flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-500 font-cairo block">
                        {isArabic ? "المبلغ المطلوب سحبه:" : "Amount to debit:"}
                      </span>
                      <strong className="text-xl font-black text-[#610b0d] font-mono">
                        {sha7nawyPaymentData.amount} {currency}
                      </strong>
                    </div>

                    {/* Circular / Pill Countdown */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-amber-300 shadow-2xs text-amber-700 text-xs font-mono font-bold">
                      <Clock className="w-3.5 h-3.5 animate-pulse text-amber-600" />
                      <span>{sha7nawyTimer}s</span>
                    </div>
                  </div>

                  {/* Dynamic Wallet Instructions Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{isArabic ? "خطوات التأكيد على هاتفك:" : "Action Required on Your Phone:"}</span>
                    </div>

                    {selectedWallet === "vf_cash" && (
                      <div className="space-y-2 pt-1">
                        <p className="leading-relaxed">
                          {isArabic
                            ? "يُرجى طلب الكود التالي على هاتفك فوراً لإدخال الرقم السري لمحفظتك وتأكيد السحب:"
                            : "Please dial the code below on your phone now to confirm with your PIN:"}
                        </p>
                        <div className="flex items-center justify-center gap-2 py-1">
                          <a
                            href="tel:*9*1%23"
                            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono font-black text-lg tracking-wider shadow flex items-center gap-2 cursor-pointer"
                          >
                            <PhoneCall className="w-4 h-4" />
                            <span>*9*1#</span>
                          </a>
                        </div>
                        <p className="text-[11px] text-amber-800 text-center">
                          {isArabic ? "(اضغطي على الكود للاتصال السريع من هاتفك)" : "(Click code above to dial directly on mobile)"}
                        </p>
                      </div>
                    )}

                    {selectedWallet === "or_cash" && (
                      <p className="leading-relaxed">
                        {isArabic
                          ? "افتحي تطبيق Orange Cash الآن ووافقي على إشعار السحب المعلق الخاص بمتجر سُلاف وأدخلي رقمكِ السري."
                          : "Open your Orange Cash app and approve the pending payment request with your PIN."}
                      </p>
                    )}

                    {selectedWallet === "et_cash" && (
                      <div className="space-y-1">
                        <p className="leading-relaxed">
                          {isArabic
                            ? "اطلبي الكود *777*11# على هاتفك أو افتحي تطبيق e& Money للموافقة على السحب وإدخال رقمكِ السري."
                            : "Dial *777*11# or open e& Money app to approve the payment request with your PIN."}
                        </p>
                        <div className="text-center pt-1">
                          <a
                            href="tel:*777*11%23"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-mono font-bold text-sm shadow cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>*777*11#</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error Message if any */}
                  {sha7nawyError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-bold">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{sha7nawyError}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      disabled={sha7nawyConfirming}
                      onClick={handleConfirmSha7nawyPayment}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#485c36] hover:bg-[#38492a] disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {sha7nawyConfirming ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>{isArabic ? "جاري التحقق من السحب..." : "Verifying payment..."}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>{isArabic ? "وافقْتُ على هاتفي — تأكيد السحب الآن ✓" : "I approved on phone — Confirm Now ✓"}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSha7nawyModalOpen(false)}
                      className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-800 font-bold text-center cursor-pointer"
                    >
                      {isArabic ? "إلغاء أو اختيار طريقة دفع أخرى" : "Cancel or choose another payment method"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

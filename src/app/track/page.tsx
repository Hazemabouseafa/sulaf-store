"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderById, getOrderByTracking, OrderRecord } from "@/lib/orders/order-store";
import { StoxTrackingResult } from "@/lib/shipping/stox";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Search,
  Truck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

function buildRealTrackingFromOrder(order: OrderRecord): StoxTrackingResult {
  const createdDate = new Date(order.createdAt).toLocaleString("ar-EG");
  const statusMap: Record<OrderRecord["orderStatus"], { ar: string; hub: string }> = {
    PENDING_CONFIRMATION: {
      ar: "تم استلام الطلب • بانتظار المراجعة والتأكيد",
      hub: `مركز تجهيز سُـلاف الرئيسي (${order.governorate})`,
    },
    PROCESSING: {
      ar: "جاري التجهيز والتغليف السريري للطرد",
      hub: `مختبر التغليف والشحن — متجه إلى ${order.governorate}`,
    },
    SHIPPED: {
      ar: "خرج للتوصيل مع مندوب الشحن (معاينة قبل السداد)",
      hub: `فرع توزيع ${order.governorate} - ${order.city}`,
    },
    DELIVERED: {
      ar: "تم التسليم بنجاح للعميل ✓",
      hub: `${order.governorate} - ${order.city}`,
    },
    CANCELLED: {
      ar: "تم إلغاء الطلب",
      hub: "إدارة الطلبات",
    },
  };

  const info = statusMap[order.orderStatus] || statusMap.PENDING_CONFIRMATION;
  const events: StoxTrackingResult["events"] = [
    {
      status: "تسجيل الطلب عبر متجر سُـلاف الرسمي",
      timestamp: createdDate,
      hubName: "نظام الطلبات المركزي",
      notes: `رقم الطلب: ${order.orderNumber} — المستلم: ${order.customerName}`,
    },
  ];

  if (order.orderStatus === "PROCESSING" || order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED") {
    events.unshift({
      status: "تأكيد الطلب وتجهيز العبوة السريرية بمعايير الأمان",
      timestamp: createdDate,
      hubName: "مركز تجهيز سُـلاف",
      notes: "مسموح بمعاينة وفحص العبوة قبل الاستلام",
    });
  }

  if (order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED") {
    events.unshift({
      status: `انطلاق الشحنة إلى ${order.governorate} (${order.city})`,
      timestamp: new Date().toLocaleDateString("ar-EG"),
      hubName: `فرع توزيع ${order.governorate}`,
      notes: "سيتواصل معكِ المندوب هاتفياً قبل الوصول",
    });
  }

  if (order.orderStatus === "DELIVERED") {
    events.unshift({
      status: "تم تسليم الشحنة بنجاح ✓",
      timestamp: new Date().toLocaleDateString("ar-EG"),
      hubName: `${order.governorate} - ${order.city}`,
    });
  }

  return {
    trackingNumber: order.stoxTrackingNumber || order.orderNumber,
    currentStatus:
      order.orderStatus === "DELIVERED"
        ? "DELIVERED"
        : order.orderStatus === "SHIPPED"
        ? "OUT_FOR_DELIVERY"
        : "CREATED",
    statusTextAr: info.ar,
    carrierHub: info.hub,
    lastUpdated: createdDate,
    events,
  };
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("id") || "";
  const { isArabic, dir } = useLanguage();

  const [query, setQuery] = useState(initialQuery);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [trackingData, setTrackingData] = useState<StoxTrackingResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  async function handleSearchQuery(searchTerm: string) {
    const clean = searchTerm.trim();
    if (!clean) return;

    setIsLoading(true);
    setSearched(true);

    let found: OrderRecord | undefined = undefined;
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(clean)}`, { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        if (d.order) found = d.order;
      }
    } catch (e) {
      console.warn("Live tracking lookup error:", e);
    }

    if (!found) {
      found = getOrderById(clean) || getOrderByTracking(clean);
    }

    if (found) {
      setOrder(found);
      setTrackingData(buildRealTrackingFromOrder(found));
    } else {
      setOrder(null);
      setTrackingData(null);
    }

    setIsLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearchQuery(query);
  }

  const currency = isArabic ? "ج.م" : "EGP";

  return (
    <div className="py-16 bg-[#f6f9e6] min-h-screen font-cairo" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold mb-3">
            <Truck className="w-4 h-4 text-[#485c36]" />
            <span>
              {isArabic ? "خدمة التتبع المباشر للشحنات" : "Sulaf Realtime Shipment Tracking"}
            </span>
          </div>
          <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
            {isArabic ? "تتبع مسار شحنتك لحظة بلحظة" : "Track Your Order in Realtime"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 font-medium mt-2 leading-relaxed">
            {isArabic
              ? "أدخلي رقم الطلب (مثل SLF-8821) أو رقم الهاتف المسجل بالطلب لمعرفة حالة طردك وموعد وصول المندوب."
              : "Enter your order reference (e.g. SLF-8821) or registered phone number to verify shipment status."}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative max-w-xl mx-auto flex items-center shadow-md rounded-2xl overflow-hidden bg-white border border-[#e2e8c0]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isArabic ? "اكتبي رقم طلب سلاف أو رقم الهاتف..." : "Enter order reference or phone number..."}
              className="w-full py-4 px-5 text-xs sm:text-sm font-medium focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-4 bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] font-bold text-xs shrink-0 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? (isArabic ? "جاري البحث..." : "Searching...") : (isArabic ? "تتبع الآن" : "Track Now")}</span>
            </button>
          </div>
        </form>

        {/* Tracking Results Card */}
        {searched && (
          <div className="space-y-6">
            {trackingData && order ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2e8c0] shadow-md space-y-6">
                {/* Header status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e8c0] pb-4">
                  <div>
                    <span className="text-xs text-gray-500 block mb-0.5">
                      {isArabic ? "رقم الطلب وكود التتبع:" : "Order & Waybill Reference:"}
                    </span>
                    <strong className="text-base sm:text-lg text-[#610b0d] font-mono font-bold">
                      {order.orderNumber} ({trackingData.trackingNumber})
                    </strong>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] border border-[#485c36]/25 text-xs font-bold self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-[#485c36] shrink-0" />
                    <span>{isArabic ? trackingData.statusTextAr : order.orderStatus}</span>
                  </div>
                </div>

                {/* Hub & Last update */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700 bg-[#f6f9e6] p-4 rounded-2xl border border-[#e2e8c0]/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#485c36] shrink-0" />
                    <span>
                      {isArabic ? "نقطة التوزيع والوجهة:" : "Distribution Hub:"}{" "}
                      <strong>{trackingData.carrierHub}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#485c36] shrink-0" />
                    <span>
                      {isArabic ? "تاريخ تسجيل الطلب:" : "Order Date:"}{" "}
                      <strong>{trackingData.lastUpdated}</strong>
                    </span>
                  </div>
                </div>

                {/* COD & Financial Balance details */}
                <div className="p-4 rounded-2xl bg-[#f6f9e6] border border-[#485c36]/25 text-xs text-[#1c2616] space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span>{isArabic ? "إجمالي قيمة الطلب:" : "Grand Total:"}</span>
                    <span>{order.total} {currency}</span>
                  </div>
                  {order.isDepositMode ? (
                    <div className="flex justify-between text-[#610b0d] font-bold pt-1.5 border-t border-[#485c36]/20">
                      <span>{isArabic ? "المبلغ المطلوب سداده للمندوب عند الاستلام:" : "Remaining Balance Due on Delivery (COD):"}</span>
                      <span className="text-sm">{order.remainingCodAmount} {currency}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-[#485c36] font-bold pt-1.5 border-t border-[#485c36]/20">
                      <span>{isArabic ? "حالة السداد:" : "Payment Status:"}</span>
                      <span>
                        {order.paymentStatus === "FULLY_PAID"
                          ? (isArabic ? "مدفوع بالكامل مقدماً ✓" : "Fully Prepaid ✓")
                          : (isArabic ? "بانتظار مراجعة وتأكيد الدفع" : "Pending Payment Verification")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Timeline checkpoints */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-amiri text-xl font-bold text-[#485c36]">
                    {isArabic ? "سجل حركة وتحديثات الطرد" : "Shipment Progress & Timeline"}
                  </h4>
                  <div className={`relative ${isArabic ? "border-r-2 pr-5 mr-3" : "border-l-2 pl-5 ml-3"} border-[#485c36]/30 space-y-6`}>
                    {trackingData.events.map((ev, i) => (
                      <div key={i} className="relative text-xs space-y-1">
                        <span className={`absolute ${isArabic ? "-right-[27px]" : "-left-[27px]"} top-1 w-3 h-3 rounded-full bg-[#485c36] ring-4 ring-[#f6f9e6]`} />
                        <span className="font-bold text-gray-900 block">{ev.status}</span>
                        <span className="text-gray-500 text-[11px] block">{ev.timestamp} • {ev.hubName}</span>
                        {ev.notes && (
                          <p className="text-[#610b0d] text-[11px] font-semibold">{ev.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support contact button */}
                <div className="pt-4 border-t border-[#e2e8c0] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">
                    {isArabic ? "توصيل سريع ومؤمن لكافة محافظات مصر" : "Express and secure delivery across all governorates"}
                  </span>

                  <a
                    href="https://wa.me/201099887766"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{isArabic ? "مساعدة فورية من خدمة عملاء سلاف" : "Direct WhatsApp Support"}</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-white border border-[#e2e8c0] text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-[#ca384a] mx-auto" />
                <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
                  {isArabic ? "لم يتم العثور على شحنة بهذا الرقم" : "No Shipment Found"}
                </h3>
                <p className="text-xs text-gray-600">
                  {isArabic
                    ? "تأكدي من كتابة رقم الطلب (مثال: SLF-8821) أو رقم الهاتف المسجل في الطلب بالشكل الصحيح."
                    : "Please check your order reference number or phone number and try again."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center font-cairo">Loading shipment data...</div>}>
      <TrackOrderContent />
    </React.Suspense>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { MessageCircle, Sparkles, Truck, ArrowLeft, ArrowRight } from "lucide-react";

export function ConsultationBanner() {
  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();
  const vis = settings.elementsVisibility || {
    consultationBadge: true,
    consultationHeading: true,
    consultationDesc: true,
    consultationButton: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const whatsappMessage = isArabic
    ? "مرحباً فريق سلاف، أود استشارة صيدلانية بخصوص علاج جلد الوزة والخشونة مع كريم Absolutes Smoothing Body Cream."
    : "Hello Sulaf Team, I would like a clinical consultation regarding Keratosis Pilaris and Absolutes Smoothing Body Cream.";

  return (
    <section className="py-10 sm:py-14 bg-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 2-CELL BENTO CONSULTATION & TRACKING DOCK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* BENTO CELL 1 (8 Cols): Direct Pharmacist Consultation */}
          <div className="lg:col-span-8 rounded-[2rem] bg-[#610b0d] text-[#f6f9e6] p-7 sm:p-10 flex flex-col justify-between border border-[#f3a5a1]/30 shadow-lg text-start relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              {vis.consultationBadge !== false && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ca384a] text-[#f6f9e6] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{custom.consultationBadgeText || t.consultationBanner.badge}</span>
                </span>
              )}

              {vis.consultationHeading !== false && (
                <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-[#f6f9e6] leading-snug">
                  {custom.consultationHeadingText || t.consultationBanner.heading}
                </h2>
              )}

              {vis.consultationDesc !== false && (
                <p className="text-xs sm:text-sm text-[#f6f9e6]/85 max-w-xl leading-relaxed">
                  {custom.consultationDescText || t.consultationBanner.desc}
                </p>
              )}
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3 relative z-10">
              <a
                href={`https://wa.me/${SULAF_SETTINGS.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-[#485c36] hover:bg-[#ca384a] text-[#f6f9e6] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#f3a5a1]" />
                <span>{custom.consultationButtonText || t.consultationBanner.whatsappBtn}</span>
              </a>

              <Link
                href="/shop"
                className="px-6 py-3.5 rounded-2xl bg-[#f6f9e6] hover:bg-[#f3a5a1] text-[#610b0d] font-bold text-xs sm:text-sm transition-colors inline-flex items-center gap-2"
              >
                <span>{t.consultationBanner.exploreStore}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* BENTO CELL 2 (4 Cols): Order Tracking & Deposit Quick Card */}
          <div className="lg:col-span-4 rounded-[2rem] bg-[#485c36] text-[#f6f9e6] p-7 sm:p-8 flex flex-col justify-between border border-[#485c36] shadow-md text-start">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#f6f9e6]/15 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#f3a5a1]" />
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#f6f9e6]">
                {isArabic ? "تتبع فوري لشحنتكِ" : "Live Shipment Tracking"}
              </h3>
              <p className="text-xs text-[#f6f9e6]/85 leading-relaxed">
                {isArabic
                  ? "تابعي مسار عبوتكِ لحظة بلحظة برقم الطلب أو رقم الهاتف من لحظة خروجها من معمل سُـلاف وحتى باب منزلكِ."
                  : "Track your package step-by-step using your order number or phone number."}
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/track"
                className="w-full py-3.5 px-5 rounded-2xl bg-[#f3a5a1] hover:bg-[#ca384a] text-[#610b0d] hover:text-[#f6f9e6] font-bold text-xs flex items-center justify-between transition-colors"
              >
                <span>{isArabic ? "الانتقال لبوابة التتبع المباشر" : "Open Tracking Portal"}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

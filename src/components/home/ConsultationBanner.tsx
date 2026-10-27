"use client";

import React from "react";
import Link from "next/link";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { MessageCircle, Sparkles } from "lucide-react";

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

  const whatsappMessage = isArabic
    ? "مرحباً فريق سلاف، أود استشارة صيدلانية بخصوص علاج جلد الوزة والخشونة مع كريم Absolutes Smoothing Body Cream."
    : "Hello Sulaf Team, I would like a clinical consultation regarding Keratosis Pilaris and Absolutes Smoothing Body Cream.";

  return (
    <section className="py-14 sm:py-20 bg-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* SINGLE SCULPTURAL ANDALUSIAN ARCH PAVILION */}
        <div className="p-2.5 rounded-t-[14rem] rounded-b-[2.5rem] border border-[#610b0d]/25 bg-white/50 shadow-lg">
          <div className="rounded-t-[13rem] rounded-b-[2rem] bg-[#610b0d] text-[#f6f9e6] pt-14 pb-10 px-6 sm:px-12 text-center space-y-4 border border-[#f3a5a1]/35">
            {vis.consultationBadge !== false && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ca384a] text-[#f6f9e6] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{custom.consultationBadgeText || t.consultationBanner.badge}</span>
              </span>
            )}

            {vis.consultationHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#f6f9e6]">
                {custom.consultationHeadingText || t.consultationBanner.heading}
              </h2>
            )}

            {vis.consultationDesc !== false && (
              <p className="text-xs sm:text-sm text-[#f6f9e6]/85 max-w-lg mx-auto leading-relaxed">
                {custom.consultationDescText || t.consultationBanner.desc}
              </p>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto">
              <a
                href={`https://wa.me/${SULAF_SETTINGS.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#485c36] hover:bg-[#ca384a] text-[#f6f9e6] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#f3a5a1]" />
                <span>{custom.consultationButtonText || t.consultationBanner.whatsappBtn}</span>
              </a>

              <Link
                href="/shop"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#f6f9e6] hover:bg-[#f3a5a1] text-[#610b0d] font-bold text-xs transition-colors flex items-center justify-center"
              >
                {t.consultationBanner.exploreStore}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

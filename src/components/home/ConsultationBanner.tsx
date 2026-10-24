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
    : "Hello Sulaf Team, I would like a clinical consultation regarding Keratosis Pilaris and Absolutes Smoothing Body Cream cream.";

  return (
    <section className="py-16 bg-[#610b0d] text-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
        {vis.consultationBadge !== false && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#f3a5a1] text-xs font-cairo font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{custom.consultationBadgeText || t.consultationBanner.badge}</span>
        </span>
      )}

        {vis.consultationHeading !== false && (
        <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-white">
          {custom.consultationHeadingText || t.consultationBanner.heading}
        </h2>
      )}

        {vis.consultationDesc !== false && (
        <p className="text-xs sm:text-sm text-[#f6f9e6]/80 font-cairo max-w-xl mx-auto leading-relaxed">
          {custom.consultationDescText || t.consultationBanner.desc}
        </p>
      )}

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`https://wa.me/${SULAF_SETTINGS.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3.5 rounded-2xl bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] font-cairo font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-green-300" />
            <span>{custom.consultationButtonText || t.consultationBanner.whatsappBtn}</span>
          </a>

          <Link
            href="/shop"
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-cairo font-semibold text-xs border border-white/20 transition-colors"
          >
            {t.consultationBanner.exploreStore}
          </Link>
        </div>
      </div>
    </section>
  );
}

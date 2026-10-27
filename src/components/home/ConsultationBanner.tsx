"use client";

import React from "react";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { MessageCircle } from "lucide-react";

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

  // IDEA #1: Quiet Apothecary Scroll — Minimalist Footnote Consultation on Warm Parchment (#f6f9e6)
  return (
    <section className="py-20 bg-[#f6f9e6] text-[#485c36] border-t border-[#485c36]/15 font-cairo">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center space-y-5">
        {vis.consultationBadge !== false && (
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#610b0d] block">
            {custom.consultationBadgeText || t.consultationBanner.badge}
          </span>
        )}

        {vis.consultationHeading !== false && (
          <h2 className="font-amiri text-3xl sm:text-4xl font-normal text-[#485c36]">
            {custom.consultationHeadingText || t.consultationBanner.heading}
          </h2>
        )}

        {vis.consultationDesc !== false && (
          <p className="text-xs sm:text-sm text-[#485c36]/75 max-w-lg mx-auto leading-relaxed">
            {custom.consultationDescText || t.consultationBanner.desc}
          </p>
        )}

        {vis.consultationButton !== false && (
          <div className="pt-3">
            <a
              href={`https://wa.me/${SULAF_SETTINGS.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-[#610b0d] hover:bg-[#485c36] text-[#f6f9e6] font-bold text-xs tracking-wide transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#f3a5a1]" />
              <span>{custom.consultationButtonText || t.consultationBanner.whatsappBtn}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

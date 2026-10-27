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

  // ACT III (Part 2): SEAMLESS ROYAL BURGUNDY (#610b0d) CONSULTATION BAR
  return (
    <section className="pb-20 pt-6 bg-[#610b0d] text-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#f6f9e6]/10 border border-[#f3a5a1]/30 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start">
          <div className="space-y-2 max-w-xl">
            {vis.consultationHeading !== false && (
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#f6f9e6]">
                {custom.consultationHeadingText || t.consultationBanner.heading}
              </h2>
            )}

            {vis.consultationDesc !== false && (
              <p className="text-xs sm:text-sm text-[#f6f9e6]/80 leading-relaxed">
                {custom.consultationDescText || t.consultationBanner.desc}
              </p>
            )}
          </div>

          {vis.consultationButton !== false && (
            <a
              href={`https://wa.me/${SULAF_SETTINGS.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 px-8 py-4 rounded-full bg-[#ca384a] hover:bg-[#485c36] text-[#f6f9e6] font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#f6f9e6]" />
              <span>{custom.consultationButtonText || t.consultationBanner.whatsappBtn}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

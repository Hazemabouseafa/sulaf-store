"use client";

import React from "react";
import Link from "next/link";
import { AndalusianPattern } from "../brand/AndalusianPattern";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";

export function ClinicalStorySection() {
  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();
  const vis = settings.elementsVisibility || {
    clinicalBadge: true,
    clinicalHeading: true,
    clinicalDesc: true,
    clinicalStats: true,
    clinicalButtons: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  return (
    <section className="py-24 bg-[#485c36] text-[#f6f9e6] relative overflow-hidden font-cairo">
      {/* Background Engraving */}
      <AndalusianPattern opacity={0.06} color="#f6f9e6" scale={1.5} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Statistics Grid */}
          {vis.clinicalStats !== false && (
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.clinicalEvidence.stats.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-[#f6f9e6]/20 shadow-lg space-y-2 hover:bg-white/15 transition-colors"
              >
                <span className="font-cormorant text-4xl sm:text-5xl font-bold text-[#f3e5ab] block">
                  {s.percentage}
                </span>
                <h4 className="font-amiri text-xl font-bold text-white">
                  {s.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#f6f9e6]/90 font-cairo font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
          )}

          {/* Clinical Philosophy Text */}
          <div className="lg:col-span-6 space-y-6 text-start">
            {vis.clinicalBadge !== false && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#f3e5ab] text-xs font-cairo border border-[#d4af37]/40">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>{custom.clinicalBadgeText || t.clinicalEvidence.badge}</span>
              </div>
            )}

            {vis.clinicalHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#f6f9e6] leading-tight">
                {custom.clinicalHeadingText || t.clinicalEvidence.heading}
              </h2>
            )}

            {vis.clinicalDesc !== false && (
              <p className="font-cairo text-base sm:text-lg text-[#f6f9e6] leading-relaxed font-medium">
                {custom.clinicalDescText || t.clinicalEvidence.desc}
              </p>
            )}

            {vis.clinicalButtons !== false && (
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/philosophy"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#d4af37] text-[#222b1a] font-cairo font-bold text-xs hover:bg-[#c29e2e] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>{custom.clinicalReadResearchText || t.clinicalEvidence.readResearch}</span>
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <Link
                href="/guide"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/10 text-white border border-white/20 font-cairo font-semibold text-xs hover:bg-white/20 transition-colors text-center"
              >
                {custom.clinicalUsageGuideText || t.clinicalEvidence.usageGuide}
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

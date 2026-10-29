"use client";

import React from "react";
import { PearlOrbs } from "../motion/PearlOrbs";
import { Dna, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";

export function CosmeceuticalsArtSection() {
  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();

  const vis = settings.elementsVisibility || {
    artBadge: true,
    artHeading: true,
    artDesc: true,
    artGuarantee: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  return (
    <section className="relative py-20 bg-[#f4f1e6] text-[#222b1a] overflow-hidden font-cairo">
      {/* Background Decorative Macro Lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#485c36]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Section Pill Badge */}
        {vis.artBadge !== false && (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-4">
            <Dna className="w-3.5 h-3.5 text-[#485c36]" />
            <span>{custom.artBadgeText || t.artOfCosmeceuticals.badge}</span>
          </div>
        )}

        {/* Section Heading */}
        {vis.artHeading !== false && (
          <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36] max-w-3xl mx-auto leading-tight">
            {custom.artHeadingText || t.artOfCosmeceuticals.heading}
          </h2>
        )}

        {vis.artDesc !== false && (
          <p className="mt-4 font-cairo text-base sm:text-lg font-medium text-[#1c2616] max-w-2xl mx-auto leading-relaxed">
            {custom.artDescText || t.artOfCosmeceuticals.desc}
          </p>
        )}

        {/* Interactive 3D Pearl Orbs Component */}
        <PearlOrbs className="mt-8" />

        {/* Scientific Guarantee Note */}
        {vis.artGuarantee !== false && (
          <div className="mt-6 inline-flex items-center gap-2 p-4 rounded-2xl bg-white border border-[#dbe2bd] shadow-md text-xs sm:text-sm font-bold font-cairo text-[#1c2616]">
            <ShieldCheck className="w-4 h-4 text-[#485c36] shrink-0" />
            <span>{custom.artGuaranteeText || t.artOfCosmeceuticals.guarantee}</span>
          </div>
        )}
      </div>
    </section>
  );
}

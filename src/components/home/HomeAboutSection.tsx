"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";

export function HomeAboutSection() {
  const { isArabic, t, dir } = useLanguage();
  const { settings } = useStoreSettings();
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const vis = settings.elementsVisibility || {
    aboutBadge: true,
    aboutHeading: true,
    aboutParagraph: true,
    aboutCta: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  const aboutText = isArabic
    ? (settings.ourStory?.paragraph1 || "من عبق الهوية العربية، وسحر الروح الأندلسية، وُلدت سُلاف؛ حيث يلتقي العلم الصيدلاني بفنّ العناية بالجمال.")
    : "Born from the essence of Arab identity and the poetic charm of Andalusia, Sulaf bridges pharmaceutical science with the highest art of beauty care.";

  return (
    <section className="py-16 bg-[#f6f9e6] border-b border-[#e2e8c0] text-center font-cairo" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {vis.aboutBadge !== false && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#485c36]" />
            <span>
              {custom.aboutBadgeText || (isArabic ? "عن سُـلاف • حيث يلتقي العلم الصيدلاني بالجمال" : "About Sulaf • Where Pharmaceutical Science Meets Beauty.")}
            </span>
          </div>
        )}

        {vis.aboutHeading !== false && (
          <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-[#1c2616]">
            {custom.aboutHeadingText || (isArabic ? "قصة سُـلاف والجمال الأندلسي" : "The Sulaf Story & Andalusian Grace")}
          </h2>
        )}

        {vis.aboutParagraph !== false && (
          <p className="text-base sm:text-xl font-medium text-gray-800 leading-[2.1] max-w-3xl mx-auto">
            {custom.aboutParagraphText || aboutText}
          </p>
        )}

        {vis.aboutCta !== false && (
          <div className="pt-2">
            <Link
              href="/story"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#485c36] hover:bg-[#3a4a2b] text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>{custom.aboutCtaText || (isArabic ? "اقرأ قصتنا" : "Read Our Story")}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { FourPointStar } from "./HeroSection";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";

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

  // EXACT REFERENCE BOTTOM BANNER: "Your Best Skin Journey Starts Here"
  return (
    <section className="relative bg-[#e8ead6] text-[#1e2b18] py-14 sm:py-16 overflow-hidden border-t border-[#485c36]/15 font-cairo">
      {/* Subtle Curved Wireframe Arch Lines on Left & Right Edges */}
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-[#485c36]/15 pointer-events-none" />
      <div className="absolute -top-20 -left-8 w-56 h-56 rounded-full border border-[#485c36]/10 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-[#485c36]/15 pointer-events-none" />
      <div className="absolute -top-20 -right-8 w-56 h-56 rounded-full border border-[#485c36]/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Start: 4-Pointed Star + 2-Line Serif Heading */}
          <div className="flex items-center gap-6 text-center md:text-start">
            <FourPointStar className="hidden sm:block w-4 h-4 text-[#22301e] shrink-0" />
            <div>
              {vis.consultationHeading !== false && (
                <h2
                  className={`${
                    isArabic
                      ? "font-amiri text-2xl sm:text-3xl leading-snug"
                      : "font-cormorant text-2xl sm:text-3xl leading-tight"
                  } font-normal text-[#1e2b18]`}
                >
                  {custom.consultationHeadingText ||
                    (isArabic ? (
                      <>
                        رحلتكِ نحو بشرة حريرية
                        <br />
                        لا تُهزم تبدأ من هنا
                      </>
                    ) : (
                      <>
                        Your Best Skin Journey
                        <br />
                        Starts Here
                      </>
                    ))}
                </h2>
              )}
            </div>
          </div>

          {/* Vertical Hairline Divider */}
          <div className="hidden md:block w-px h-14 bg-[#485c36]/25" />

          {/* Center: Dark Olive Pill CTA + WhatsApp Pharmacist Link */}
          {vis.consultationButton !== false && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/shop"
                className="px-8 py-3.5 rounded-full bg-[#22301e] hover:bg-[#610b0d] text-[#f6f9e6] text-xs font-bold tracking-wide inline-flex items-center gap-3 transition-colors shadow-sm"
              >
                <span>{isArabic ? "تسوقي الآن" : "Shop Now"}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>

              <a
                href={`https://wa.me/${SULAF_SETTINGS.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3.5 rounded-full border border-[#22301e]/30 hover:border-[#610b0d] text-[#1e2b18] hover:text-[#610b0d] text-xs font-bold inline-flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#485c36]" />
                <span>{custom.consultationButtonText || t.consultationBanner.whatsappBtn}</span>
              </a>
            </div>
          )}

          {/* End: Stacked Uppercase Micro Label */}
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#485c36] text-center md:text-start leading-relaxed">
            <span className="block">{isArabic ? "اكتشفي" : "DISCOVER"}</span>
            <span className="block font-bold text-[#610b0d]">
              {isArabic ? "بروتوكول سُـلاف" : "THE RITUAL"}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

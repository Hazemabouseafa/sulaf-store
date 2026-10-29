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

  const whatsappNum = (settings.contacts?.whatsapp || SULAF_SETTINGS.whatsappNumber).replace(/[^0-9]/g, "");
  const whatsappMessage = isArabic
    ? "مرحباً فريق سلاف، أود استشارة صيدلانية بخصوص علاج جلد الوزة والخشونة مع كريم Absolutes Smoothing Body Cream."
    : "Hello Sulaf Team, I would like a clinical consultation regarding Keratosis Pilaris and Absolutes Smoothing Body Cream.";

  // EXACT REFERENCE BOTTOM BANNER: "Your Best Skin Journey Starts Here"
  return (
    <section className="relative bg-[#f4f1e6] text-[#1e2b18] py-14 sm:py-16 overflow-hidden border-t border-[#485c36]/15 font-cairo">
      {/* Ambient Soft Glow and Subtle Curved Arch Lines with Gentle Breath */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[240px] rounded-full bg-[#f3a5a1]/15 blur-[80px] animate-sulaf-aura pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full border border-[#485c36]/15 animate-sulaf-float pointer-events-none" />
      <div className="absolute -top-20 -left-8 w-56 h-56 rounded-full border border-[#485c36]/10 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-[#485c36]/15 animate-sulaf-float pointer-events-none" />
      <div className="absolute -top-20 -right-8 w-56 h-56 rounded-full border border-[#485c36]/10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Start: 4-Pointed Star + 2-Line Serif Heading */}
          <div className="flex items-center gap-6 text-center md:text-start">
            <FourPointStar className="hidden sm:block w-4 h-4 text-[#22301e] shrink-0" />
            <div>
              {vis.consultationBadge !== false && custom.consultationBadgeText && (
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#610b0d] font-bold block mb-1">
                  {custom.consultationBadgeText}
                </span>
              )}
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
              {vis.consultationDesc !== false && custom.consultationDescText && (
                <p className="text-xs text-[#1e2b18]/75 mt-1 max-w-sm">
                  {custom.consultationDescText}
                </p>
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
                className="silk-button px-8 py-3.5 rounded-full bg-[#22301e] hover:bg-[#610b0d] text-[#f6f9e6] text-xs font-bold tracking-wide inline-flex items-center gap-3 shadow-sm cursor-pointer"
              >
                <span>{custom.consultationShopBtnText || (isArabic ? "تسوقي الآن" : "Shop Now")}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="silk-button px-5 py-3.5 rounded-full border border-[#485c36]/40 hover:border-[#610b0d] text-[#1e2b18] hover:text-[#610b0d] text-xs font-bold inline-flex items-center gap-2 cursor-pointer bg-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-105 animate-glow-ring"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#485c36]" />
                <span>{custom.consultationButtonText || t.consultationBanner.whatsappBtn}</span>
              </a>
            </div>
          )}

          {/* End: Stacked Uppercase Micro Label */}
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#485c36] text-center md:text-start leading-relaxed">
            <span className="block">{custom.consultationSideLabel1 || (isArabic ? "اكتشفي" : "DISCOVER")}</span>
            <span className="block font-bold text-[#610b0d]">
              {custom.consultationSideLabel2 || (isArabic ? "بروتوكول سُـلاف" : "THE RITUAL")}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

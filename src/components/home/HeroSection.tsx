"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Diamond,
  Leaf,
} from "lucide-react";

/**
 * 8-Fold Andalusian Floral Rosette Emblem matching the reference design
 */
export function SulafRosette({
  className = "w-16 h-16",
  strokeWidth = 1.4,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Outer 8-lobed Andalusian petals */}
        <path d="M50 6 C59 19, 63 32, 50 45 C37 32, 41 19, 50 6 Z" />
        <path d="M50 94 C59 81, 63 68, 50 55 C37 68, 41 81, 50 94 Z" />
        <path d="M6 50 C19 41, 32 37, 45 50 C32 63, 19 59, 6 50 Z" />
        <path d="M94 50 C81 41, 68 37, 55 50 C68 63, 81 59, 94 50 Z" />
        <path d="M18.8 18.8 C30 23, 39 30, 46 46 C30 39, 23 30, 18.8 18.8 Z" />
        <path d="M81.2 81.2 C70 77, 61 70, 54 54 C70 61, 77 70, 81.2 81.2 Z" />
        <path d="M81.2 18.8 C70 23, 61 30, 54 46 C70 39, 77 30, 81.2 18.8 Z" />
        <path d="M18.8 81.2 C30 77, 39 70, 46 54 C30 61, 23 70, 18.8 81.2 Z" />
        {/* Inner Octagram / Arabesque Ring */}
        <rect
          x="36"
          y="36"
          width="28"
          height="28"
          rx="4"
          transform="rotate(45 50 50)"
        />
        <circle cx="50" cy="50" r="8" />
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * 4-Pointed Star Accent (✦)
 */
export function FourPointStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0 C12.8 8.2 15.8 11.2 24 12 C15.8 12.8 12.8 15.8 12 24 C11.2 15.8 8.2 12.8 0 12 C8.2 11.2 11.2 8.2 12 0 Z" />
    </svg>
  );
}

export function HeroSection() {
  const { settings } = useStoreSettings();
  const { isArabic } = useLanguage();

  const vis = settings.elementsVisibility || {
    heroBadge: true,
    heroPoem: true,
    heroSubheading: true,
    heroPriceCard: false,
    heroPrimaryCta: true,
    heroSecondaryCta: true,
    heroTrustBadges: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  const poemLine1 =
    custom.heroPoemLine1 || (isArabic ? settings.hero.poemLine1 : "Timeless Care for");
  const poemLine2 =
    custom.heroPoemLine2 || (isArabic ? settings.hero.poemLine2 : "Modern Skin.");

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const ritualArches = [
    {
      num: "01",
      icon: Sparkles,
      title: isArabic ? "الترطيب العميق" : "HYDRATE",
      desc: isArabic
        ? "استعادة رطوبة الخلايا وتوازن البشرة."
        : "Restore moisture & balance",
      href: "/shop",
    },
    {
      num: "02",
      icon: Diamond,
      title: isArabic ? "ترميم الحاجز" : "REPAIR",
      desc: isArabic
        ? "تقوية الحاجز الدهني بسيراميدات حيوية."
        : "Strengthen your skin barrier",
      href: "/shop",
    },
    {
      num: "03",
      icon: Sparkles,
      title: isArabic ? "تنعيم جلد الوزة" : "BRIGHTEN",
      desc: isArabic
        ? "إذابة التقرن والخشونة بـ 30% يوريا نقية."
        : "Reveal a more even tone",
      href: "/product/absolutes-smoothing-body-cream",
    },
    {
      num: "04",
      icon: Leaf,
      title: isArabic ? "التجديد الخلوي" : "ANTI-AGING",
      desc: isArabic
        ? "دعم مرونة ونضارة البشرة بنعومة دائمة."
        : "Support youthful, resilient skin",
      href: "/shop",
    },
  ];

  return (
    <div className="w-full font-cairo">
      {/* ===================================================================== */}
      {/* SECTION 1: SUNLIT ARCHITECTURAL ARCHWAY HERO                          */}
      {/* ===================================================================== */}
      <section className="relative bg-[#f4f1e6] text-[#18271b] pt-8 sm:pt-12 pb-24 sm:pb-28 overflow-hidden">
        {/* Diagonal Sunlit Architectural Shadow Rays across the Limestone Wall */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(128deg, rgba(232,226,209,0.75) 0%, rgba(244,241,230,0.15) 38%, rgba(244,241,230,0.9) 62%, rgba(226,220,202,0.7) 100%)",
          }}
        />
        <div
          className="hidden lg:block absolute -top-20 left-1/4 w-[420px] h-[140%] bg-white/45 -rotate-[28deg] blur-xl pointer-events-none"
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px] sm:min-h-[540px]">
            
            {/* LEFT/START EDITORIAL COLUMN (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 text-start relative z-20">
              {vis.heroBadge !== false && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-1"
                >
                  <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#485c36] block">
                    {isArabic ? "التراث الأندلسي الأصيل" : "ANDALUSIAN HERITAGE"}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#610b0d] font-bold">
                      {custom.heroBadgeText ||
                        (isArabic ? "العلم الصيدلاني الحديث" : "MODERN DERMATOLOGY")}
                    </span>
                    <span className="w-12 h-px bg-[#485c36]/45 inline-block" />
                  </div>
                </motion.div>
              )}

              {/* Large 3-Line Editorial Heading with Italic Final Line */}
              {vis.heroPoem !== false && (
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.1 }}
                  className={`${
                    isArabic
                      ? "font-amiri text-[clamp(2.1rem,4.2vw,3.5rem)] leading-[1.48]"
                      : "font-cormorant text-[clamp(2.6rem,5vw,4.3rem)] leading-[1.06]"
                  } font-normal text-[#18271b]`}
                >
                  <span className="block">{poemLine1}</span>
                  <span className="block italic text-[#485c36] mt-1">{poemLine2}</span>
                </motion.h1>
              )}

              {/* Italic Subheading Paragraph */}
              {vis.heroSubheading !== false && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.2 }}
                  className={`${
                    isArabic
                      ? "font-amiri text-base sm:text-lg leading-relaxed"
                      : "font-cormorant italic text-base sm:text-lg leading-relaxed"
                  } text-[#18271b]/80 max-w-sm`}
                >
                  {custom.heroSubheading ||
                    (isArabic
                      ? settings.hero.subheading
                      : "Inspired by Andalusian wisdom, crafted with modern science. Sulaf cosmeceuticals bring you pure, effective skincare for lasting radiance.")}
                </motion.p>
              )}

              {/* Dark Forest Pill CTA */}
              {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#18271b] hover:bg-[#610b0d] text-[#f6f9e6] text-xs font-bold tracking-wide transition-colors shadow-sm"
                  >
                    <span>
                      {custom.heroPrimaryCtaText ||
                        (isArabic ? "اكتشفي تركيباتنا السريرية" : "Explore Our Formulas")}
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              )}
            </div>

            {/* CENTER 3D ARCHITECTURAL ANDALUSIAN ARCHWAY SCENE (5 Cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[380px] h-[420px] sm:h-[470px] rounded-t-full overflow-hidden shadow-[0_24px_60px_rgba(24,39,27,0.18)] border border-[#485c36]/20 bg-[#dfd8c5]"
              >
                {/* Distant Serene Horizon / Sky Strip on the Right */}
                <div className="absolute inset-y-0 right-0 w-[26%] bg-gradient-to-b from-[#9eb1aa] via-[#c7d2cb] to-[#e3dfd3]" />

                {/* Deep Forest Green Inner Sanctum Wall with Golden-Champagne Rosette */}
                <div className="absolute inset-y-0 left-[12%] w-[64%] bg-gradient-to-b from-[#162519] via-[#1f3322] to-[#142217] flex items-center justify-center shadow-2xl">
                  <div className="text-[#c5b37a]/85 -mt-12">
                    <SulafRosette className="w-24 h-24 sm:w-28 sm:h-28" strokeWidth={1.2} />
                  </div>
                </div>

                {/* Inner Limestone Archway Depth Reveal on Left */}
                <div className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-[#e7e1d0] to-[#cfc6b0] rounded-tr-full" />

                {/* Sculptural Sunlit Curved Plinth / Steps at the Base of the Archway */}
                <div className="absolute bottom-0 left-0 w-[55%] h-44 bg-gradient-to-tr from-[#d5ccb6] to-[#ece7d8] rounded-tr-[5rem] shadow-md" />
                <div className="absolute bottom-0 right-0 w-[62%] h-28 bg-gradient-to-tl from-[#d8cfb8] via-[#eae4d5] to-[#f4f1e6] rounded-tl-[3rem] shadow-lg" />

                {/* Botanical Olive Foliage Silhouette in Bottom Right Foreground */}
                <svg
                  viewBox="0 0 120 140"
                  fill="none"
                  className="absolute bottom-0 right-0 w-28 h-32 text-[#18271b] z-20 pointer-events-none"
                >
                  <path
                    d="M95 140 C90 100, 75 65, 55 30"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M85 110 C65 105, 55 95, 72 88 C82 95, 85 105, 85 110 Z"
                    fill="#263822"
                  />
                  <path
                    d="M78 85 C58 78, 48 66, 66 60 C76 68, 78 78, 78 85 Z"
                    fill="#354a2d"
                  />
                  <path
                    d="M92 95 C105 82, 115 75, 102 65 C92 72, 90 85, 92 95 Z"
                    fill="#18271b"
                  />
                  <path
                    d="M68 58 C50 48, 45 36, 62 34 C70 42, 70 52, 68 58 Z"
                    fill="#263822"
                  />
                  <path
                    d="M82 65 C96 52, 106 42, 92 35 C82 44, 80 56, 82 65 Z"
                    fill="#354a2d"
                  />
                </svg>
              </motion.div>
            </div>

            {/* FAR RIGHT/END VERTICAL SCROLL INDICATOR COLUMN (2 Cols) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-between h-[430px] py-4">
              {/* Top Vertical Stem + TRADITION MEETS SCIENCE + Star */}
              <div className="flex flex-col items-start gap-2 border-s border-[#485c36]/30 ps-3 py-2">
                <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-[#485c36] leading-relaxed">
                  <span className="block">{isArabic ? "أصـالـة" : "TRADITION"}</span>
                  <span className="block">{isArabic ? "تـلـتـقـي" : "MEETS"}</span>
                  <span className="block font-bold text-[#610b0d]">
                    {isArabic ? "بـالـعـلـم" : "SCIENCE"}
                  </span>
                </div>
                <FourPointStar className="w-3 h-3 text-[#18271b] mt-1" />
              </div>

              {/* Long Vertical Hairline */}
              <div className="w-px flex-1 bg-[#485c36]/25 my-3" />

              {/* Scroll Mouse Capsule Indicator */}
              <a
                href="#sulaf-ritual-band"
                className="flex flex-col items-center gap-2 text-[#18271b]/80 hover:text-[#610b0d] transition-colors"
              >
                <FourPointStar className="w-2.5 h-2.5" />
                <div className="w-5 h-9 rounded-full border border-[#18271b]/45 flex items-start justify-center p-1">
                  <motion.span
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1 h-2 rounded-full bg-[#18271b]"
                  />
                </div>
                <span className="font-mono text-[9px] tracking-widest uppercase">
                  {isArabic ? "مرري" : "Scroll"}
                </span>
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Wave Transition into the Dark Forest Green Ritual Section */}
        <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none pointer-events-none z-20">
          <svg
            viewBox="0 0 1440 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 sm:h-14"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 L380 10 C480 10, 520 68, 640 68 L1440 68 L1440 70 L0 70 Z"
              fill="#18271b"
            />
          </svg>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 2: DARK FOREST BAND — "YOUR SKIN DESERVES A RITUAL."          */}
      {/* ===================================================================== */}
      <section
        id="sulaf-ritual-band"
        className="relative bg-[#18271b] text-[#f6f9e6] py-16 sm:py-24 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left/Start Editorial Column (4 Cols) with Vertical Hairline */}
            <div className="lg:col-span-4 lg:border-e border-[#f6f9e6]/15 lg:pe-8 space-y-4 text-start">
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#f3a5a1] block">
                {isArabic ? "طقوس سُـلاف السريرية" : "OUR RITUAL"}
              </span>

              <h2
                className={`${
                  isArabic
                    ? "font-amiri text-3xl sm:text-4xl leading-snug"
                    : "font-cormorant text-3xl sm:text-5xl leading-[1.1]"
                } font-normal text-[#f6f9e6]`}
              >
                {isArabic ? (
                  <>
                    بشرتكِ تستحق
                    <br />
                    عناية سريرية
                    <br />
                    <span className="italic text-[#f3a5a1]">استثنائية.</span>
                  </>
                ) : (
                  <>
                    Your Skin
                    <br />
                    Deserves a
                    <br />
                    <span className="italic text-[#f3a5a1]">Ritual.</span>
                  </>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-[#f6f9e6]/75 leading-relaxed max-w-xs">
                {isArabic
                  ? "أكثر من مجرد ترطيب يومي — إنه بروتوكول علاجي متكامل للتوازن والحماية وتجديد الملمس الحريري، متجذر في قرون من الحكمة الأندلسية."
                  : "More than just skincare — it's a ritual of balance, protection and renewal, rooted in centuries of wisdom."}
              </p>

              <div className="pt-2">
                <Link
                  href="/guide"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#f6f9e6] hover:text-[#f3a5a1] border-b border-[#f6f9e6]/40 pb-1 transition-colors"
                >
                  <span>{isArabic ? "اكتشفي البروتوكول السريري" : "Discover the Ritual"}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right/End 4 Closed Wireframe Arches on Dark Forest Green (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {ritualArches.map((arch, idx) => {
                const Icon = arch.icon;
                return (
                  <Link
                    key={idx}
                    href={arch.href}
                    className="group rounded-t-full border border-[#f6f9e6]/20 hover:border-[#f3a5a1]/60 bg-[#1f3123]/40 pt-7 pb-6 px-4 flex flex-col items-center text-center justify-between min-h-[240px] sm:min-h-[265px] transition-all"
                  >
                    <span className="font-mono text-[9px] text-[#f6f9e6]/40 tracking-widest">
                      {arch.num}
                    </span>

                    <div className="my-2 text-[#f6f9e6]/90 group-hover:text-[#f3a5a1] transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.3]" />
                    </div>

                    <div className="space-y-1.5 my-1">
                      <span className="font-mono text-[10px] text-[#f3a5a1] font-bold block">
                        {arch.num}
                      </span>
                      <h3 className="font-mono text-xs tracking-[0.18em] uppercase font-bold text-[#f6f9e6]">
                        {arch.title}
                      </h3>
                      <p className="text-[11px] text-[#f6f9e6]/70 leading-relaxed">
                        {arch.desc}
                      </p>
                    </div>

                    <ArrowIcon className="w-3.5 h-3.5 text-[#f6f9e6]/60 group-hover:text-[#f3a5a1] transition-colors mt-2" />
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

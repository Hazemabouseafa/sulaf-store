"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  ArrowLeft,
  ArrowRight,
  Droplet,
  Shield,
  Sparkles,
  Leaf,
} from "lucide-react";

/**
 * 8-Fold Andalusian Floral Rosette Emblem matching the reference design
 */
export function SulafRosette({ className = "w-16 h-16", strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer 8-lobed Andalusian petals */}
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 8 C58 20, 62 32, 50 44 C38 32, 42 20, 50 8 Z" />
        <path d="M50 92 C58 80, 62 68, 50 56 C38 68, 42 80, 50 92 Z" />
        <path d="M8 50 C20 42, 32 38, 44 50 C32 62, 20 58, 8 50 Z" />
        <path d="M92 50 C80 42, 68 38, 56 50 C68 62, 80 58, 92 50 Z" />
        <path d="M20.3 20.3 C31 24, 39 31, 45.5 45.5 C31 39, 24 31, 20.3 20.3 Z" />
        <path d="M79.7 79.7 C69 76, 61 69, 54.5 54.5 C69 61, 76 69, 79.7 79.7 Z" />
        <path d="M79.7 20.3 C69 24, 61 31, 54.5 45.5 C69 39, 76 31, 79.7 20.3 Z" />
        <path d="M20.3 79.7 C31 76, 39 69, 45.5 54.5 C31 61, 24 69, 20.3 79.7 Z" />
        {/* Inner diamond & center ring */}
        <rect x="38" y="38" width="24" height="24" rx="3" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="5" />
      </g>
    </svg>
  );
}

/**
 * 4-Pointed Star Accent (✦) from the reference image
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
  const { isArabic, t } = useLanguage();

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

  const poemLine1 = custom.heroPoemLine1 || (isArabic ? settings.hero.poemLine1 : "Ancient Wisdom.");
  const poemLine2 = custom.heroPoemLine2 || (isArabic ? settings.hero.poemLine2 : "Modern Skin Science.");

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const skinNeedsArches = [
    {
      icon: Droplet,
      title: isArabic ? "الترطيب العميق" : "Hydration",
      desc: isArabic
        ? "استعادة رطوبة الخلايا وتوازن البشرة الفسيولوجي."
        : "Restore moisture and balance.",
      href: "/shop",
    },
    {
      icon: Shield,
      title: isArabic ? "ترميم الحاجز" : "Repair",
      desc: isArabic
        ? "تقوية الحاجز الدهني بسيراميدات متطابقة حيوياً."
        : "Strengthen your skin barrier.",
      href: "/shop",
    },
    {
      icon: Sparkles,
      title: isArabic ? "تنعيم جلد الوزة" : "Smoothing",
      desc: isArabic
        ? "إذابة التقرن والخشونة بتركيز 30% يوريا نقية."
        : "Reveal a smoother, even texture.",
      href: "/product/absolutes-smoothing-body-cream",
    },
    {
      icon: Leaf,
      title: isArabic ? "التجديد الخلوي" : "Resurfacing",
      desc: isArabic
        ? "تنقية المسام ودعم مرونة ونضارة الجلد."
        : "Support youthful, resilient skin.",
      href: "/shop",
    },
  ];

  return (
    <div className="w-full font-cairo">
      {/* ===================================================================== */}
      {/* SECTION 1: EXACT REFERENCE HERO — SPLIT ARCH & OVERLAPPING SERIF      */}
      {/* ===================================================================== */}
      <section className="relative bg-[#f6f9e6] text-[#22301e] pt-10 sm:pt-16 pb-0 overflow-hidden border-b border-[#485c36]/15">
        {/* Subtle Diagonal Sunlight / Window Shadow Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.55) 0%, rgba(246,249,230,0) 42%, rgba(72,92,54,0.06) 70%, rgba(255,255,255,0.4) 100%)",
          }}
        />

        {/* Vertical architectural hairline dividing the canvas */}
        <div className="hidden lg:block absolute inset-y-0 left-[68%] w-px bg-[#485c36]/15 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-end min-h-[480px] sm:min-h-[540px]">
            
            {/* TEXT COLUMN (Left in EN / Right in AR) — Overlaps slightly onto the Arch */}
            <div className="lg:col-span-7 pb-14 sm:pb-20 pt-4 relative z-20 text-start space-y-6">
              {vis.heroBadge !== false && (
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="font-mono text-[11px] tracking-[0.28em] uppercase text-[#610b0d] font-bold block"
                >
                  {custom.heroBadgeText ||
                    (isArabic
                      ? "حيث يلتقي العلم الصيدلاني بالتراث الأندلسي"
                      : "SCIENCE MEETS HERITAGE")}
                </motion.span>
              )}

              {vis.heroPoem !== false && (
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.1 }}
                  className={`${
                    isArabic
                      ? "font-amiri text-[clamp(2.2rem,4.6vw,3.9rem)] leading-[1.45]"
                      : "font-cormorant text-[clamp(2.5rem,5.2vw,4.4rem)] leading-[1.08]"
                  } font-normal text-[#1e2b18] tracking-tight`}
                >
                  <span className="block">{poemLine1}</span>
                  <span className="block mt-1">{poemLine2}</span>
                </motion.h1>
              )}

              {vis.heroSubheading !== false && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.2 }}
                  className={`${
                    isArabic
                      ? "font-amiri text-base sm:text-xl leading-relaxed"
                      : "font-cormorant italic text-lg sm:text-xl leading-relaxed"
                  } text-[#485c36] max-w-md`}
                >
                  {custom.heroSubheading ||
                    (isArabic
                      ? settings.hero.subheading
                      : "Rooted in Andalusian heritage, crafted with modern dermatological science for healthier, more radiant skin.")}
                </motion.p>
              )}

              {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.3 }}
                  className="pt-2"
                >
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#22301e] hover:bg-[#610b0d] text-[#f6f9e6] text-xs font-bold tracking-wide transition-colors shadow-sm"
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

            {/* SCULPTURAL SPLIT-TONE ARCH COLUMN (Right in EN / Left in AR) */}
            <div className="lg:col-span-5 relative flex items-end justify-center pt-6 lg:pt-0">
              {/* Top Corner Micro Stacked Words: PURE / ACTIVE / EFFECTIVE */}
              <div
                className={`hidden sm:flex flex-col gap-1 font-mono text-[10px] tracking-[0.25em] uppercase text-[#485c36]/80 absolute top-4 ${
                  isArabic ? "left-0" : "right-0"
                } z-20`}
              >
                <span>{isArabic ? "نـقـاء صـيـدلانـي" : "P U R E"}</span>
                <span>{isArabic ? "تـراكـيـز فـعـالـة" : "A C T I V E"}</span>
                <span>{isArabic ? "أثـر سـريـري" : "E F F E C T I V E"}</span>
              </div>

              {/* Background Offset Sand/Parchment Shadow Arch */}
              <div
                className={`w-[270px] sm:w-[320px] h-[340px] sm:h-[400px] rounded-t-full bg-[#e6e7d4] absolute bottom-0 ${
                  isArabic ? "-left-8" : "-right-8"
                } pointer-events-none`}
              />

              {/* Main Split-Tone Olive Arch Rising from Bottom Edge */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[260px] sm:w-[310px] h-[340px] sm:h-[410px] rounded-t-full overflow-hidden flex items-center justify-center shadow-[0_20px_50px_rgba(34,48,30,0.18)] z-10"
              >
                {/* Left/Start Half of Arch: Botanical Olive (#485c36) */}
                <div
                  className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-b from-[#536840] to-[#3f522f]"
                />
                {/* Right/End Half of Arch: Deep Forest Olive (#192414) */}
                <div
                  className="absolute inset-y-0 right-0 w-[38%] bg-[#182314]"
                />

                {/* Inner subtle arch highlight */}
                <div className="absolute inset-3 rounded-t-full border border-[#f6f9e6]/15 pointer-events-none" />

                {/* Center White 8-Petal Andalusian Sulaf Rosette */}
                <div className="relative z-10 text-[#f6f9e6] -mt-6">
                  <SulafRosette className="w-20 h-20 sm:w-24 sm:h-24" strokeWidth={1.8} />
                </div>
              </motion.div>

              {/* Flanking Wireframe Outline Arch 1 (Bottom Start) */}
              <div
                className={`w-[120px] sm:w-[140px] h-[140px] sm:h-[165px] rounded-t-full border-t border-x border-[#485c36]/35 absolute bottom-0 ${
                  isArabic ? "-right-10" : "-left-10"
                } z-20 pointer-events-none`}
              />

              {/* Flanking Wireframe Outline Arch 2 (Bottom End) */}
              <div
                className={`w-[130px] sm:w-[155px] h-[200px] sm:h-[235px] rounded-t-full border-t border-x border-[#485c36]/35 absolute bottom-0 ${
                  isArabic ? "-left-6" : "-right-6"
                } z-20 pointer-events-none`}
              />

              {/* 4-Pointed Star + Vertical Stem on Far Corner */}
              <div
                className={`hidden sm:flex flex-col items-center absolute bottom-0 ${
                  isArabic ? "-left-12" : "-right-12"
                } z-20 text-[#22301e]`}
              >
                <FourPointStar className="w-3.5 h-3.5 mb-2" />
                <div className="w-px h-14 bg-[#485c36]/40" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 2: "FIND YOUR PERFECT RITUAL" — 4 WIREFRAME ARCHES            */}
      {/* ===================================================================== */}
      <section className="bg-[#ebeed8] text-[#22301e] py-16 sm:py-20 border-b border-[#485c36]/15">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left/Start Editorial Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-4 text-start">
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#610b0d] font-bold block">
                {isArabic ? "احتياجات بشرتكِ السريرية" : "YOUR SKIN NEEDS"}
              </span>

              <h2
                className={`${
                  isArabic
                    ? "font-amiri text-3xl sm:text-4xl leading-snug"
                    : "font-cormorant text-3xl sm:text-4xl leading-tight"
                } font-normal text-[#1e2b18]`}
              >
                {isArabic ? (
                  <>
                    اكتشفي بروتوكول
                    <br />
                    العناية المثالي لبشرتكِ
                  </>
                ) : (
                  <>
                    Find Your
                    <br />
                    Perfect Ritual
                  </>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-[#485c36]/85 leading-relaxed max-w-xs">
                {isArabic
                  ? "عناية سريرية موجهة لكل مشكلة جلدية — مستلهمة من الرقة الأندلسية وموثقة بالعلم الصيدلاني."
                  : "Targeted care for every concern — powered by nature, backed by science."}
              </p>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#1e2b18] hover:text-[#610b0d] border-b border-[#1e2b18]/40 pb-1 transition-colors"
                >
                  <span>{isArabic ? "استكشفي جميع المستحضرات" : "Explore All Products"}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right/End 4 Wireframe Arches (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {skinNeedsArches.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group rounded-t-full border-t border-x border-[#485c36]/30 hover:border-[#610b0d] pt-10 pb-6 px-4 flex flex-col items-center text-center justify-between min-h-[220px] sm:min-h-[245px] transition-colors"
                  >
                    <div className="w-9 h-9 flex items-center justify-center text-[#485c36] group-hover:text-[#610b0d] transition-colors">
                      <Icon className="w-6 h-6 stroke-[1.5]" />
                    </div>

                    <div className="space-y-1.5 my-3">
                      <h3
                        className={`${
                          isArabic ? "font-amiri text-xl" : "font-cormorant text-xl"
                        } font-bold text-[#1e2b18] group-hover:text-[#610b0d] transition-colors`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-[#485c36]/80 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <ArrowIcon className="w-3.5 h-3.5 text-[#485c36]/70 group-hover:text-[#ca384a] group-hover:translate-x-0.5 transition-all" />
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

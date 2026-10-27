"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Diamond,
  Leaf,
  ShoppingBag,
  Check,
} from "lucide-react";

/**
 * 8-Fold Andalusian Floral Rosette Emblem with optional continuous slow rotation
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
        <path d="M50 6 C59 19, 63 32, 50 45 C37 32, 41 19, 50 6 Z" />
        <path d="M50 94 C59 81, 63 68, 50 55 C37 68, 41 81, 50 94 Z" />
        <path d="M6 50 C19 41, 32 37, 45 50 C32 63, 19 59, 6 50 Z" />
        <path d="M94 50 C81 41, 68 37, 55 50 C68 63, 81 59, 94 50 Z" />
        <path d="M18.8 18.8 C30 23, 39 30, 46 46 C30 39, 23 30, 18.8 18.8 Z" />
        <path d="M81.2 81.2 C70 77, 61 70, 54 54 C70 61, 77 70, 81.2 81.2 Z" />
        <path d="M81.2 18.8 C70 23, 61 30, 54 46 C70 39, 77 30, 81.2 18.8 Z" />
        <path d="M18.8 81.2 C30 77, 39 70, 46 54 C30 61, 23 70, 18.8 81.2 Z" />
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
  const { addItem } = useCart();
  const { settings } = useStoreSettings();
  const { isArabic, t } = useLanguage();
  const products = useProducts();
  const roughAway = products[0] || MOCK_PRODUCTS[0];
  const [addedHero, setAddedHero] = useState(false);

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

  // Authentic Sulaf Hero Texts from Settings & Translations
  const poemLine1 =
    custom.heroPoemLine1 || (isArabic ? settings.hero.poemLine1 || t.brand.poemLine1 : t.brand.poemLine1);
  const poemLine2 =
    custom.heroPoemLine2 || (isArabic ? settings.hero.poemLine2 || t.brand.poemLine2 : t.brand.poemLine2);

  const wordsLine1 = poemLine1.split(" ");
  const wordsLine2 = poemLine2.split(" ");

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  function handleQuickOrder() {
    addItem(roughAway);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1800);
  }

  const ritualArches = [
    {
      num: "01",
      icon: Sparkles,
      title: isArabic ? t.hero.clinicalDose : "30% PURE UREA",
      desc: isArabic ? t.hero.clinicalDoseDesc : "30% Pure Urea + 2% Medical Salicylic Acid",
      href: "/product/absolutes-smoothing-body-cream",
    },
    {
      num: "02",
      icon: Diamond,
      title: isArabic ? t.hero.barrierRepair : "BARRIER REPAIR",
      desc: isArabic ? t.hero.barrierRepairDesc : "Phyto-ceramides & ammonium lactate",
      href: "/shop",
    },
    {
      num: "03",
      icon: Sparkles,
      title: isArabic ? t.hero.fastAbsorption : "SILKY ABSORPTION",
      desc: isArabic ? t.hero.fastAbsorptionDesc : "Non-greasy finish tailored for warm climates",
      href: "/shop",
    },
    {
      num: "04",
      icon: Leaf,
      title: isArabic ? "نتائج من اليوم السابع" : "7-DAY SILK RESET",
      desc: isArabic
        ? "القضاء الجذري على مظهر جلد الوزة والخشونة المتصلبة"
        : "Eliminate keratosis pilaris & severe roughness",
      href: "/guide",
    },
  ];

  return (
    <div className="w-full font-cairo">
      {/* ===================================================================== */}
      {/* SECTION 1: SUNLIT ARCHITECTURAL ARCHWAY HERO WITH SULAF TEXTS         */}
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

        {/* Animated Drifting Sunbeam Shimmer */}
        <motion.div
          animate={{ x: [-35, 35, -35], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="hidden lg:block absolute -top-24 left-1/4 w-[440px] h-[145%] bg-white/50 -rotate-[28deg] blur-2xl pointer-events-none"
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[490px] sm:min-h-[550px]">
            
            {/* LEFT/START EDITORIAL COLUMN WITH SULAF COPY (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 text-start relative z-20">
              {vis.heroBadge !== false && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-1.5"
                >
                  <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#485c36] block">
                    {t.hero.clinicalHeritage}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#610b0d] font-bold">
                      {custom.heroBadgeText || t.hero.badge}
                    </span>
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: 48 }}
                      transition={{ duration: 0.9, delay: 0.3 }}
                      className="h-px bg-[#610b0d]/50 inline-block"
                    />
                  </div>
                </motion.div>
              )}

              {/* Sulaf Poetic Verse with Word-by-Word Fluid Animation */}
              {vis.heroPoem !== false && (
                <h1
                  className={`${
                    isArabic
                      ? "font-amiri text-[clamp(2rem,4vw,3.35rem)] leading-[1.6]"
                      : "font-cormorant text-[clamp(2.2rem,4.4vw,3.7rem)] leading-[1.15]"
                  } font-normal text-[#18271b]`}
                >
                  <span className="block">
                    {wordsLine1.map((word, i) => (
                      <motion.span
                        key={`l1-${i}`}
                        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                          duration: 0.65,
                          delay: 0.1 + i * 0.07,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block me-2"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>

                  <span className="block italic text-[#610b0d] mt-1.5">
                    {wordsLine2.map((word, i) => (
                      <motion.span
                        key={`l2-${i}`}
                        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                          duration: 0.65,
                          delay: 0.45 + i * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block me-2"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                </h1>
              )}

              {/* Authentic Sulaf Clinical Subheading */}
              {vis.heroSubheading !== false && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className={`${
                    isArabic
                      ? "font-amiri text-base sm:text-lg leading-relaxed"
                      : "font-cormorant italic text-base sm:text-lg leading-relaxed"
                  } text-[#18271b]/85 max-w-md`}
                >
                  {custom.heroSubheading ||
                    (isArabic ? settings.hero.subheading || t.hero.subheading : t.hero.subheading)}
                </motion.p>
              )}

              {/* Sulaf CTA Buttons with Hover Fluidity */}
              {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="pt-2 flex flex-wrap items-center gap-3"
                >
                  {vis.heroPrimaryCta !== false && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleQuickOrder}
                      className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#18271b] hover:bg-[#610b0d] text-[#f6f9e6] text-xs font-bold tracking-wide transition-colors shadow-[0_12px_28px_rgba(24,39,27,0.2)] cursor-pointer"
                    >
                      {addedHero ? (
                        <>
                          <Check className="w-4 h-4 text-[#f3a5a1]" />
                          <span>{isArabic ? "تمت الإضافة لحقيبتكِ ✓" : "Added to Bag ✓"}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-[#f3a5a1]" />
                          <span>
                            {custom.heroPrimaryCtaText ||
                              (isArabic
                                ? settings.hero.ctaText || t.hero.ctaOrder
                                : t.hero.ctaOrder)}
                          </span>
                          <ArrowIcon className="w-3.5 h-3.5" />
                        </>
                      )}
                    </motion.button>
                  )}

                  {vis.heroSecondaryCta !== false && (
                    <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-[#18271b]/30 hover:border-[#610b0d] text-[#18271b] hover:text-[#610b0d] text-xs font-bold transition-colors"
                      >
                        <span>{custom.heroSecondaryCtaText || t.hero.ctaExplore}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>

            {/* CENTER 3D ARCHITECTURAL ANDALUSIAN ARCHWAY SCENE WITH LIVE MOTION (5 Cols) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[380px] h-[420px] sm:h-[470px] rounded-t-full overflow-hidden shadow-[0_28px_65px_rgba(24,39,27,0.2)] border border-[#485c36]/20 bg-[#dfd8c5]"
              >
                {/* Distant Serene Horizon / Sky Strip on the Right */}
                <div className="absolute inset-y-0 right-0 w-[26%] bg-gradient-to-b from-[#9eb1aa] via-[#c7d2cb] to-[#e3dfd3]" />

                {/* Deep Forest Green Inner Sanctum Wall with Slowly Rotating & Breathing Rosette */}
                <div className="absolute inset-y-0 left-[12%] w-[64%] bg-gradient-to-b from-[#162519] via-[#1f3322] to-[#142217] flex items-center justify-center shadow-2xl">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.06, 1],
                    }}
                    transition={{
                      rotate: { duration: 85, repeat: Infinity, ease: "linear" },
                      scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="text-[#c5b37a]/85 -mt-12"
                  >
                    <SulafRosette className="w-24 h-24 sm:w-28 sm:h-28" strokeWidth={1.2} />
                  </motion.div>
                </div>

                {/* Inner Limestone Archway Depth Reveal on Left */}
                <div className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-[#e7e1d0] to-[#cfc6b0] rounded-tr-full" />

                {/* Sculptural Sunlit Curved Plinth / Steps at the Base of the Archway */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.35 }}
                  className="absolute bottom-0 left-0 w-[55%] h-44 bg-gradient-to-tr from-[#d5ccb6] to-[#ece7d8] rounded-tr-[5rem] shadow-md"
                />
                <motion.div
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.45 }}
                  className="absolute bottom-0 right-0 w-[62%] h-28 bg-gradient-to-tl from-[#d8cfb8] via-[#eae4d5] to-[#f4f1e6] rounded-tl-[3rem] shadow-lg"
                />

                {/* Gently Swaying Botanical Olive Foliage Silhouette in Foreground */}
                <motion.svg
                  animate={{ rotate: [-2.5, 2.5, -2.5], y: [0, -2, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "bottom right" }}
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
                </motion.svg>
              </motion.div>
            </div>

            {/* FAR RIGHT/END VERTICAL SCROLL INDICATOR COLUMN (2 Cols) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-between h-[430px] py-4">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col items-start gap-2 border-s border-[#485c36]/30 ps-3 py-2"
              >
                <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-[#485c36] leading-relaxed">
                  <span className="block">{isArabic ? "أصـالـة" : "TRADITION"}</span>
                  <span className="block">{isArabic ? "تـلـتـقـي" : "MEETS"}</span>
                  <span className="block font-bold text-[#610b0d]">
                    {isArabic ? "بـالـعـلـم" : "SCIENCE"}
                  </span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FourPointStar className="w-3 h-3 text-[#18271b] mt-1" />
                </motion.div>
              </motion.div>

              <div className="w-px flex-1 bg-[#485c36]/25 my-3" />

              <a
                href="#sulaf-ritual-band"
                className="flex flex-col items-center gap-2 text-[#18271b]/80 hover:text-[#610b0d] transition-colors"
              >
                <FourPointStar className="w-2.5 h-2.5" />
                <div className="w-5 h-9 rounded-full border border-[#18271b]/45 flex items-start justify-center p-1">
                  <motion.span
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
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
      {/* SECTION 2: DARK FOREST BAND — SULAF CLINICAL PILLARS & 4 ARCHES       */}
      {/* ===================================================================== */}
      <section
        id="sulaf-ritual-band"
        className="relative bg-[#18271b] text-[#f6f9e6] py-16 sm:py-24 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left/Start Editorial Column (4 Cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 lg:border-e border-[#f6f9e6]/15 lg:pe-8 space-y-4 text-start"
            >
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
                    {t.hero.heading}
                    <br />
                    <span className="italic text-[#f3a5a1]">برفقٍ لا ينهزم.</span>
                  </>
                ) : (
                  <>
                    {t.hero.heading}
                  </>
                )}
              </h2>

              <p className="text-xs sm:text-sm text-[#f6f9e6]/75 leading-relaxed max-w-xs">
                {isArabic
                  ? t.gallery.desc
                  : t.gallery.desc}
              </p>

              <div className="pt-2">
                <Link
                  href="/guide"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#f6f9e6] hover:text-[#f3a5a1] border-b border-[#f6f9e6]/40 pb-1 transition-colors"
                >
                  <span>{isArabic ? t.clinicalEvidence.usageGuide : "Discover the Ritual"}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Right/End 4 Closed Wireframe Arches with Staggered & Hover Animations (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {ritualArches.map((arch, idx) => {
                const Icon = arch.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -8 }}
                  >
                    <Link
                      href={arch.href}
                      className="group h-full rounded-t-full border border-[#f6f9e6]/20 hover:border-[#f3a5a1]/70 bg-[#1f3123]/40 hover:bg-[#243928]/70 pt-7 pb-6 px-4 flex flex-col items-center text-center justify-between min-h-[245px] sm:min-h-[265px] transition-all duration-300 shadow-sm hover:shadow-[0_16px_35px_rgba(0,0,0,0.28)]"
                    >
                      <span className="font-mono text-[9px] text-[#f6f9e6]/40 tracking-widest">
                        {arch.num}
                      </span>

                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 3.5,
                          delay: idx * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="my-2 text-[#f6f9e6]/90 group-hover:text-[#f3a5a1] transition-colors"
                      >
                        <Icon className="w-6 h-6 stroke-[1.3]" />
                      </motion.div>

                      <div className="space-y-1.5 my-1">
                        <span className="font-mono text-[10px] text-[#f3a5a1] font-bold block">
                          {arch.num}
                        </span>
                        <h3 className="font-cairo text-xs font-bold text-[#f6f9e6]">
                          {arch.title}
                        </h3>
                        <p className="text-[11px] text-[#f6f9e6]/70 leading-relaxed">
                          {arch.desc}
                        </p>
                      </div>

                      <ArrowIcon className="w-3.5 h-3.5 text-[#f6f9e6]/60 group-hover:text-[#f3a5a1] group-hover:scale-110 transition-all mt-2" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

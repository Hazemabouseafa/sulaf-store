"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AndalusianPattern } from "../brand/AndalusianPattern";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  FlaskConical,
} from "lucide-react";

export function HeroSection() {
  const { addItem } = useCart();
  const { settings } = useStoreSettings();
  const { isArabic, t } = useLanguage();
  const roughAway = MOCK_PRODUCTS[0];

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

  // Dynamic poem from custom content, settings or translations
  const poemLine1 = custom.heroPoemLine1 || (isArabic ? settings.hero.poemLine1 : t.brand.poemLine1);
  const poemLine2 = custom.heroPoemLine2 || (isArabic ? settings.hero.poemLine2 : t.brand.poemLine2);
  const fullPoem = `${poemLine1} — ${poemLine2}`;
  const poemWords = fullPoem.split(" ");

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[55vh] lg:min-h-[65vh] flex items-center justify-center bg-gradient-to-br from-[#2f3d23] via-[#3a4d2b] to-[#1e2716] text-[#f6f9e6] overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Background Islamic Geometric Engraving Rotating Slowly */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] opacity-10 pointer-events-none"
      >
        <AndalusianPattern opacity={1} color="#d4af37" scale={1.4} />
      </motion.div>

      {/* Atmospheric Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[480px] lg:w-[600px] h-[280px] sm:h-[480px] lg:h-[600px] bg-[#d4af37]/15 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-[#610b0d]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#485c36]/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center space-y-4 sm:space-y-5">
        
        {/* Heritage / Clinical Tag */}
        {vis.heroBadge !== false && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#d4af37]/40 backdrop-blur-md text-[#f3e5ab] text-xs shadow-sm font-semibold"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>
              {custom.heroBadgeText || (isArabic ? (settings.hero?.badge && settings.hero.badge !== "Where Pharmaceutical Science Meets Beauty." ? settings.hero.badge : "حيث يلتقي العلم الصيدلاني بالجمال") : (t.hero?.badge || "Where Pharmaceutical Science Meets Beauty."))}
            </span>
          </motion.div>
        )}

        {/* Word-by-word Poetic Reveal */}
        {vis.heroPoem !== false && (
          <div className="w-full max-w-3xl py-3 sm:py-5 px-2 overflow-visible">
            <h1
              className={`${
                isArabic
                  ? "font-amiri text-2xl sm:text-4xl lg:text-5xl leading-[1.8] sm:leading-[1.85] lg:leading-[1.9]"
                  : "font-cormorant italic text-2xl sm:text-3xl lg:text-4xl leading-relaxed"
              } font-bold text-[#f6f9e6] drop-shadow-md text-center`}
            >
              {poemWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.07,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className={`inline-block mx-1 sm:mx-1.5 py-1.5 sm:py-2.5 ${
                    word.includes("سلاف") ||
                    word.includes("حسن") ||
                    word.toLowerCase().includes("sulaf") ||
                    word.toLowerCase().includes("beauty")
                      ? "text-[#f3e5ab] underline decoration-[#d4af37]/60 underline-offset-[12px] sm:underline-offset-[14px]"
                      : ""
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>
        )}

        {/* Subtitle / Clinical Promise */}
        {vis.heroSubheading !== false && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-sm sm:text-base lg:text-lg text-white/90 max-w-xl sm:max-w-2xl mx-auto leading-relaxed font-medium text-center"
          >
            {custom.heroSubheading || (isArabic ? settings.hero.subheading : t.hero.subheading)}
          </motion.p>
        )}

        {/* Action Buttons: Order & Explore Our Products */}
        {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1"
          >
            {vis.heroPrimaryCta !== false && (
              <button
                onClick={() => addItem(roughAway)}
                className="px-7 py-3 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#d4af37] hover:bg-[#c29e2e] text-[#222b1a] font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.5)] flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>
                  {custom.heroPrimaryCtaText || (isArabic ? (settings.hero.ctaText || t.hero.ctaOrder) : t.hero.ctaOrder)}
                </span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            )}

            {vis.heroSecondaryCta !== false && (
              <Link
                href="/shop"
                className="px-7 py-3 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-[#f6f9e6] border border-[#d4af37]/40 hover:border-[#d4af37] font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer shadow-sm backdrop-blur-sm"
              >
                <span>{custom.heroSecondaryCtaText || t.hero.ctaExplore}</span>
                <ArrowIcon className="w-4 h-4 opacity-80" />
              </Link>
            )}
          </motion.div>
        )}

        {/* Trust Badges */}
        {vis.heroTrustBadges !== false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs sm:text-sm font-bold text-[#f6f9e6]"
          >
            <div className="flex items-center gap-2 bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-xs shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>
                {custom.heroTrustEfficacy || (isArabic ? "ضمان سريري مثبت معملياً" : "Certified Clinical Efficacy")}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-xs shadow-sm">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>
                {custom.heroTrustShipping || (isArabic ? "شحن فوري مؤمن لجميع المحافظات" : "Fast Doorstep Delivery Nationwide")}
              </span>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

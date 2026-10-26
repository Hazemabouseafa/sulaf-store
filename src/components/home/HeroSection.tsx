"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AndalusianPattern } from "../brand/AndalusianPattern";
import { MarblePodium } from "../shop/MarblePodium";
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
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  PackageCheck,
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
    <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#1a2313] via-[#2a3820] to-[#151c11] text-[#f6f9e6] overflow-hidden py-12 sm:py-16 lg:py-20 font-cairo">
      {/* Background Sacred Andalusian Geometric Engraving Rotating Slowly */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] opacity-10"
        >
          <AndalusianPattern opacity={1} color="#f6f9e6" scale={1.4} />
        </motion.div>
      </div>

      {/* Atmospheric Ambient Glows strictly using the 5 image palette colors */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[650px] h-[300px] sm:h-[500px] lg:h-[650px] bg-[#485c36]/35 rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#610b0d]/35 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-[#ca384a]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#f3a5a1]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center space-y-5 sm:space-y-6">
        
        {/* Heritage / Clinical Tag */}
        {vis.heroBadge !== false && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#f3a5a1]/30 backdrop-blur-md text-[#f6f9e6] text-xs shadow-sm font-semibold max-w-full"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#f3a5a1] shrink-0" />
            <span className="truncate">
              {custom.heroBadgeText || (isArabic ? (settings.hero?.badge && settings.hero.badge !== "Where Pharmaceutical Science Meets Beauty." ? settings.hero.badge : "حيث يلتقي العلم الصيدلاني بالجمال • التركيبة الأندلسية") : (t.hero?.badge || "Where Pharmaceutical Science Meets Beauty."))}
            </span>
          </motion.div>
        )}

        {/* Word-by-word Poetic Reveal */}
        {vis.heroPoem !== false && (
          <div className="w-full max-w-4xl py-2 sm:py-4 px-1 sm:px-2 overflow-visible">
            <h1
              className={`${
                isArabic
                  ? "font-amiri text-2xl sm:text-4xl lg:text-5xl leading-[1.8] sm:leading-[1.85] lg:leading-[1.9]"
                  : "font-cormorant italic text-2xl sm:text-4xl lg:text-5xl leading-relaxed"
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
                  className={`inline-block mx-1 sm:mx-1.5 py-1 sm:py-2 ${
                    word.includes("سلاف") ||
                    word.includes("حسن") ||
                    word.toLowerCase().includes("sulaf") ||
                    word.toLowerCase().includes("beauty")
                      ? "text-[#f3a5a1] underline decoration-[#ca384a]/70 underline-offset-[8px] sm:underline-offset-[14px]"
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
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xs sm:text-base lg:text-lg text-white/90 max-w-xl sm:max-w-2xl mx-auto leading-relaxed font-medium text-center px-2"
          >
            {custom.heroSubheading || (isArabic ? settings.hero.subheading : t.hero.subheading)}
          </motion.p>
        )}

        {/* Interactive Floating Flagship Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="w-full max-w-xl p-4 sm:p-6 rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Behind Card */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#ca384a]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#485c36]/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-start">
            {/* Left: Podium Mini Showcase */}
            <div className="shrink-0 flex flex-col items-center">
              <MarblePodium
                imageSrc={roughAway?.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                alt="Absolutes Smoothing Body Cream"
                size="sm"
                priority={true}
              />
            </div>

            {/* Right: Key Actives & Silk Promise */}
            <div className="flex-1 space-y-2.5 text-center sm:text-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#ca384a] text-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>الترميم الكيراتيني السريري • تحول في 7 أيام</span>
              </div>

              <h2 className="font-amiri text-lg sm:text-xl font-bold text-[#f6f9e6]">
                Absolutes Smoothing Body Cream
              </h2>

              <p className="text-xs text-white/80 leading-relaxed font-cairo">
                {isArabic
                  ? "تركيبة علاجية متطورة بقلب 30% يوريا طبية نقية لإنهاء خشونة جلد الوزة والتصلب الجلدي بدون احتكاك."
                  : "Architectural 30% pure urea reset for rough and bumpy skin with zero micro-tears."}
              </p>

              {/* 3 Active Ingredients Badges in exact palette */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6f9e6] text-[#485c36] border border-[#485c36]/30">
                  30% يوريا نقية
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6f9e6] text-[#610b0d] border border-[#610b0d]/30">
                  10% أمونيوم لاكتات
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6f9e6] text-[#ca384a] border border-[#ca384a]/30">
                  2% حمض ساليسيليك
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons: Order & Explore Our Products */}
        {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-1 w-full max-w-xs sm:max-w-none"
          >
            {vis.heroPrimaryCta !== false && (
              <button
                onClick={() => addItem(roughAway)}
                className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl bg-[#ca384a] hover:bg-[#b02e3f] text-white font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(202,56,74,0.4)] hover:shadow-[0_12px_32px_rgba(202,56,74,0.55)] flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer font-cairo"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {custom.heroPrimaryCtaText || (isArabic ? (settings.hero.ctaText || "اطلبي الآن — تسليم فوري") : t.hero.ctaOrder)}
                </span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            )}

            {vis.heroSecondaryCta !== false && (
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl bg-[#485c36] hover:bg-[#38492a] text-[#f6f9e6] border border-[#f3a5a1]/40 hover:border-[#f3a5a1] font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md backdrop-blur-sm font-cairo"
              >
                <Sparkles className="w-4 h-4 text-[#f3a5a1]" />
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
            transition={{ duration: 1, delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-6 pt-2 text-xs sm:text-sm font-bold text-[#f6f9e6] w-full"
          >
            <div className="flex items-center gap-2 bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-xs shadow-sm max-w-full">
              <ShieldCheck className="w-4 h-4 text-[#ca384a] shrink-0" />
              <span className="truncate">
                {custom.heroTrustEfficacy || (isArabic ? "ضمان سريري مثبت معملياً" : "Certified Clinical Efficacy")}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-xs shadow-sm max-w-full">
              <PackageCheck className="w-4 h-4 text-[#f3a5a1] shrink-0" />
              <span className="truncate">
                {isArabic ? "معاينة العبوة قبل الاستلام والدفع" : "Inspect Package on Delivery"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.08] px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-xs shadow-sm max-w-full">
              <Truck className="w-4 h-4 text-[#ca384a] shrink-0" />
              <span className="truncate">
                {custom.heroTrustShipping || (isArabic ? "شحن فوري مؤمن لجميع المحافظات" : "Fast Doorstep Delivery Nationwide")}
              </span>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

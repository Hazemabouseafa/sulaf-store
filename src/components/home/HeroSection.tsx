"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  PackageCheck,
  Calendar,
  Layers,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

export function HeroSection() {
  const { addItem } = useCart();
  const { settings } = useStoreSettings();
  const { isArabic, t } = useLanguage();
  const roughAway = MOCK_PRODUCTS[0];

  // Interactive Card States
  const [activeTab, setActiveTab] = useState<"formula" | "timeline">("formula");
  const [selectedActive, setSelectedActive] = useState<number>(0);

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

  const activesInfo = [
    {
      title: isArabic ? "30% يوريا نقية" : "30% Pure Urea",
      role: isArabic ? "إذابة كيراتينية هيكلية" : "Architectural Keratolytic Reset",
      desc: isArabic
        ? "تفكك الروابط المتصلبة في بصيلات الشعر وتزيل خشونة جلد الوزة والتكلسات الجافة من الجذور بدون أي احتكاك قاسٍ."
        : "Dissolves hyper-keratinized follicular plugs at the root with zero abrasive friction.",
      badgeColor: "bg-[#485c36]",
    },
    {
      title: isArabic ? "10% أمونيوم لاكتات" : "10% Ammonium Lactate",
      role: isArabic ? "ترميم المرونة الخلوية" : "Cellular Elasticity Turnover",
      desc: isArabic
        ? "تحفيز تجدد خلايا البشرة وحبس الرطوبة في أعماق الحاجز الدهني لمنع أي انتكاس للخشونة والحفاظ على ملمس الحرير."
        : "Accelerates epidermal renewal and locks moisture within the lipid matrix to prevent rebound roughness.",
      badgeColor: "bg-[#610b0d]",
    },
    {
      title: isArabic ? "2% حمض ساليسيليك" : "2% Salicylic Acid",
      role: isArabic ? "تنقية مسام فائقة" : "Micro-Pore Purification",
      desc: isArabic
        ? "مصفوفة دهنية متطورة تتغلغل داخل المسام لتنقيتها وتنعيم نتوءات البشرة الحبيبية لتجانس ملمس الجلد في 72 ساعة."
        : "Lipid-soluble beta-hydroxy acid clearing follicular congestion and smoothing texture within 72 hours.",
      badgeColor: "bg-[#ca384a]",
    },
  ];

  const timelineSteps = [
    {
      day: isArabic ? "اليوم 1 — 2" : "Days 1 — 2",
      title: isArabic ? "صدمة التنعيم الفوري" : "Immediate Smoothing",
      desc: isArabic
        ? "إذابة القشور السطحية الجافة، وتلاشي ملمس الخشونة البارز فور امتصاص التركيبة."
        : "Dissolution of dry surface flakes and noticeable softening upon first absorption.",
    },
    {
      day: isArabic ? "اليوم 3 — 5" : "Days 3 — 5",
      title: isArabic ? "انحسار جلد الوزة" : "Keratosis Pilaris Retreat",
      desc: isArabic
        ? "تفريغ المسام من الحبيبات الكيراتينية المتكلسة وانحسار مظهر الحبوب الداكنة."
        : "Clearing of plugged hair follicles and visible flattening of dark strawberry bumps.",
    },
    {
      day: isArabic ? "اليوم 7+" : "Day 7+",
      title: isArabic ? "ملمس الحرير الأندلسي" : "Undefeated Silk Texture",
      desc: isArabic
        ? "تحول ملمس الجلد إلى نعومة حريرية كاملة متجانسة واستعادة مناعة الحاجز الواقي."
        : "Complete architectural restoration: undefeated silky epidermal smoothness.",
    },
  ];

  return (
    <section className="relative min-h-[65vh] sm:min-h-[75vh] lg:min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-[#162010] via-[#24331b] to-[#12190d] text-[#f6f9e6] overflow-hidden py-12 sm:py-16 lg:py-20 font-cairo">
      {/* Background Sacred Andalusian Geometric Engraving Rotating Slowly */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 260, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] opacity-10"
        >
          <AndalusianPattern opacity={1} color="#f6f9e6" scale={1.4} />
        </motion.div>
      </div>

      {/* Atmospheric Ambient Glows strictly using the 5 image palette colors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[550px] lg:w-[700px] h-[320px] sm:h-[550px] lg:h-[700px] bg-[#485c36]/35 rounded-full blur-[100px] sm:blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-80 sm:w-96 h-80 sm:h-96 bg-[#610b0d]/35 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-[#ca384a]/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-5 right-1/4 w-64 h-64 bg-[#f3a5a1]/15 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center space-y-5 sm:space-y-6">
        
        {/* Heritage / Clinical Tag with Live Status */}
        {vis.heroBadge !== false && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#f3a5a1]/30 backdrop-blur-md text-[#f6f9e6] text-xs shadow-sm font-semibold max-w-full"
          >
            <span className="w-2 h-2 rounded-full bg-[#f3a5a1] animate-ping shrink-0" />
            <span className="truncate">
              {custom.heroBadgeText || (isArabic ? "حيث يلتقي العلم الصيدلاني بالجمال • التركيبة الأندلسية السريرية" : (t.hero?.badge || "Where Pharmaceutical Science Meets Beauty."))}
            </span>
          </motion.div>
        )}

        {/* Word-by-word Poetic Reveal */}
        {vis.heroPoem !== false && (
          <div className="w-full max-w-4xl py-2 sm:py-3 px-1 sm:px-2 overflow-visible">
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
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-xs sm:text-base lg:text-lg text-white/90 max-w-xl sm:max-w-2xl mx-auto leading-relaxed font-medium text-center px-2"
          >
            {custom.heroSubheading || (isArabic ? settings.hero.subheading : t.hero.subheading)}
          </motion.p>
        )}

        {/* ========================================================================= */}
        {/* CREATIVE INTERACTIVE FLAGSHIP CAPSULE: Formula Actives vs 7-Day Timeline */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl p-5 sm:p-7 rounded-3xl bg-white/[0.08] border border-white/15 backdrop-blur-xl shadow-2xl relative overflow-hidden text-start font-cairo"
        >
          {/* Subtle Ambient Backing */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ca384a]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#485c36]/35 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive Top Tab Toggle: Formula vs 7-Day Silk Timeline */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15 gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-black/25 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("formula")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "formula"
                    ? "bg-[#485c36] text-white shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#f3a5a1]" />
                <span>{isArabic ? "التركيبة السريرية الثلاثية" : "Triple Actives"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("timeline")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "timeline"
                    ? "bg-[#ca384a] text-white shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#f6f9e6]" />
                <span>{isArabic ? "رحلة الحرير في 7 أيام" : "7-Day Silk Journey"}</span>
              </button>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#ca384a]/20 text-[#f3a5a1] border border-[#ca384a]/40">
              <Sparkles className="w-3 h-3 text-[#f3a5a1]" />
              <span>{isArabic ? "ترميم هيكلي بدون احتكاك" : "Zero Micro-tears"}</span>
            </span>
          </div>

          {/* Main Content Area: Podium + Interactive Explanation */}
          <div className="pt-5 flex flex-col sm:flex-row items-center gap-6">
            {/* Left: Flagship Podium Preview with hover lift */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 flex flex-col items-center"
            >
              <MarblePodium
                imageSrc={roughAway?.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                alt="Absolutes Smoothing Body Cream"
                size="sm"
                priority={true}
              />
              <span className="mt-1 font-mono text-[10px] text-white/60 tracking-wider">
                Absolutes Core 200ml
              </span>
            </motion.div>

            {/* Right: Dynamic Interactive Content based on Tab */}
            <div className="flex-1 min-w-0 w-full space-y-3">
              <AnimatePresence mode="wait">
                {activeTab === "formula" ? (
                  <motion.div
                    key="tab-formula"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-3"
                  >
                    {/* Active Buttons Selector */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {activesInfo.map((act, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedActive(idx)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedActive === idx
                              ? `${act.badgeColor} text-white ring-2 ring-white/30 shadow-md`
                              : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/10"
                          }`}
                        >
                          {act.title}
                        </button>
                      ))}
                    </div>

                    {/* Active Explanation Card */}
                    <div className="p-3.5 rounded-2xl bg-black/20 border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#f3a5a1]" />
                        <h4 className="font-bold text-xs text-[#f3a5a1]">
                          {activesInfo[selectedActive].role}
                        </h4>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed font-cairo">
                        {activesInfo[selectedActive].desc}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="tab-timeline"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-2.5"
                  >
                    {timelineSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 sm:p-3 rounded-2xl bg-black/20 border border-white/10 flex items-start gap-3 text-start"
                      >
                        <div className="px-2 py-0.5 rounded-md bg-[#ca384a] text-white text-[11px] font-mono font-bold shrink-0 mt-0.5">
                          {step.day}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="font-bold text-xs text-[#f3a5a1]">{step.title}</h4>
                          <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Instant Shipping Live Banner */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#f6f9e6]/90 border-t border-white/10">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{isArabic ? "متاح للشحن الفوري لكافة المحافظات" : "In Stock — Express Delivery"}</span>
                </span>
                <span className="text-[#f3a5a1] font-semibold text-[10px]">
                  {isArabic ? "معاينة العبوة بيدك قبل السداد" : "Inspect on Delivery"}
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
            transition={{ duration: 0.7, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-xs sm:max-w-none"
          >
            {vis.heroPrimaryCta !== false && (
              <button
                onClick={() => addItem(roughAway)}
                className="w-full sm:w-auto px-8 py-3.5 sm:px-9 sm:py-4 rounded-2xl bg-[#ca384a] hover:bg-[#b02e3f] text-white font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(202,56,74,0.45)] hover:shadow-[0_12px_32px_rgba(202,56,74,0.6)] flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer font-cairo"
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
            transition={{ duration: 0.9, delay: 1.15 }}
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

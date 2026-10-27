"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AndalusianPattern } from "../brand/AndalusianPattern";
import { MarblePodium } from "../shop/MarblePodium";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
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
  Check,
  Eye,
} from "lucide-react";

export function HeroSection() {
  const { addItem } = useCart();
  const { settings } = useStoreSettings();
  const { isArabic, t } = useLanguage();
  const products = useProducts();
  const roughAway = products[0] || MOCK_PRODUCTS[0];

  const [selectedActive, setSelectedActive] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(0);
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

  const poemLine1 = custom.heroPoemLine1 || (isArabic ? settings.hero.poemLine1 : t.brand.poemLine1);
  const poemLine2 = custom.heroPoemLine2 || (isArabic ? settings.hero.poemLine2 : t.brand.poemLine2);

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const currency = isArabic ? "ج.م" : "EGP";

  const activesInfo = [
    {
      code: "30% UREA",
      title: isArabic ? "30% يوريا نقية" : "30% Pure Urea",
      role: isArabic ? "تفكيك التقرن وجلد الوزة" : "Keratolytic Reset",
      desc: isArabic
        ? "تذيب السدادات الكيراتينية المتصلبة في المسام بهدوء تام وبدون أي تقشير فيزيائي قاسٍ."
        : "Dissolves hyper-keratinized plugs gently with zero abrasive friction.",
      pillBg: "bg-[#485c36] text-[#f6f9e6]",
    },
    {
      code: "10% LACTATE",
      title: isArabic ? "10% أمونيوم لاكتات" : "10% Lactate",
      role: isArabic ? "توحيد الملمس وحبس الرطوبة" : "Surface Resurfacing",
      desc: isArabic
        ? "يجدد الخلايا السطحية ويمحو مظهر النقط الداكنة مع جذب الماء لأعماق الجلد."
        : "Accelerates epidermal renewal and locks deep cellular hydration.",
      pillBg: "bg-[#ca384a] text-[#f6f9e6]",
    },
    {
      code: "2% SALICYLIC",
      title: isArabic ? "2% ساليسيليك + سيراميد" : "2% BHA + Ceramides",
      role: isArabic ? "تنقية المسام وإغلاق الحاجز" : "Pore & Barrier Lock",
      desc: isArabic
        ? "يحرر الشعر المحتجز تحت الجلد ويرمم الحاجز الدهني لمنع عودة الجفاف."
        : "Frees trapped ingrown hairs and seals the lipid barrier against dryness.",
      pillBg: "bg-[#610b0d] text-[#f3a5a1]",
    },
  ];

  const timelineDays = [
    {
      day: isArabic ? "اليوم 01" : "Day 01",
      metric: "92%",
      title: isArabic ? "تهدئة فورية للملمس الخشن" : "Instant Roughness Relief",
      desc: isArabic
        ? "امتصاص فوري يذيب القشور السطحية الجافة من أول استخدام دون أي لزوجة."
        : "Rapid absorption dissolving dry surface flakes from the first application.",
    },
    {
      day: isArabic ? "اليوم 03" : "Day 03",
      metric: "72h",
      title: isArabic ? "انحسار حبيبات جلد الوزة" : "Keratosis Pilaris Retreat",
      desc: isArabic
        ? "تفرغ المسام من التكلسات الكيراتينية وتبدأ النتوءات الخشنة بالتلاشي التدريجي."
        : "Follicles clear out keratin plugs and bumpy texture visibly flattens.",
    },
    {
      day: isArabic ? "اليوم 07" : "Day 07",
      metric: "100%",
      title: isArabic ? "ملمس الحرير الأندلسي" : "Undefeated Silk Texture",
      desc: isArabic
        ? "بشرة ملساء متجانسة كالحرير مع حاجز دهني مرمم يمنع انتكاس الجفاف."
        : "Silky, unified skin architecture with a restored moisture barrier.",
    },
  ];

  function handleQuickOrder() {
    addItem(roughAway);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1800);
  }

  return (
    <section className="relative bg-[#f6f9e6] text-[#485c36] py-6 sm:py-10 lg:py-12 overflow-hidden font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* =================================================================== */}
        {/* SULAF ARCHITECTURAL BENTO GRID HERO (12-COLUMN ASYMMETRIC MATRIX)   */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 auto-rows-auto">
          
          {/* BENTO CELL 1: MAIN BRAND MANIFESTO & POETIC IDENTITY (7 Cols, 2 Rows) */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 lg:row-span-2 relative rounded-[2rem] bg-[#485c36] text-[#f6f9e6] p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(72,92,54,0.18)] border border-[#485c36]"
          >
            {/* Subtle Andalusian Geometric Watermark */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <AndalusianPattern opacity={1} color="#f6f9e6" scale={1.35} />
            </div>
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#ca384a]/25 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#610b0d]/40 blur-3xl pointer-events-none" />

            {/* Top Row: Brand Pill & Minimalist Manifesto Tag */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              {vis.heroBadge !== false && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#610b0d] border border-[#f3a5a1]/40 text-[#f6f9e6] text-xs font-bold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#f3a5a1] animate-pulse shrink-0" />
                  <span>
                    {custom.heroBadgeText ||
                      (isArabic
                        ? "سُـلاف • الصيدلية الأندلسية السريرية"
                        : t.hero?.badge || "Sulaf • Clinical Andalusian Apothecary")}
                  </span>
                </div>
              )}

              <span className="font-mono text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#f6f9e6]/10 text-[#f3a5a1] border border-[#f6f9e6]/15">
                DERM-GRADE • pH 5.2
              </span>
            </div>

            {/* Center: Poetic Verse & Simple Unique Value Proposition */}
            <div className="relative z-10 my-8 sm:my-10 space-y-5 text-start">
              {vis.heroPoem !== false && (
                <h1
                  className={`${
                    isArabic
                      ? "font-amiri text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.65]"
                      : "font-cormorant italic text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.35]"
                  } font-bold text-[#f6f9e6]`}
                >
                  <span className="block">{poemLine1}</span>
                  <span className="block mt-1 text-[#f3a5a1] decoration-[#ca384a] underline decoration-2 underline-offset-8">
                    {poemLine2}
                  </span>
                </h1>
              )}

              {vis.heroSubheading !== false && (
                <p className="text-xs sm:text-base text-[#f6f9e6]/90 max-w-xl leading-relaxed font-normal">
                  {custom.heroSubheading ||
                    (isArabic ? settings.hero.subheading : t.hero.subheading)}
                </p>
              )}

              {/* Minimalist Key Metrics Bento Strip inside Hero */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 max-w-lg">
                <div className="p-3 rounded-2xl bg-[#f6f9e6]/10 border border-[#f6f9e6]/15 backdrop-blur-xs">
                  <span className="block font-mono text-base sm:text-xl font-black text-[#f3a5a1]">
                    30%
                  </span>
                  <span className="text-[11px] text-[#f6f9e6]/90 font-bold">
                    {isArabic ? "يوريا علاجية نقية" : "Pure Urea USP"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#f6f9e6]/10 border border-[#f6f9e6]/15 backdrop-blur-xs">
                  <span className="block font-mono text-base sm:text-xl font-black text-[#f6f9e6]">
                    10%
                  </span>
                  <span className="text-[11px] text-[#f6f9e6]/90 font-bold">
                    {isArabic ? "أمونيوم لاكتات" : "Lactate AHA"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#610b0d] border border-[#f3a5a1]/30">
                  <span className="block font-mono text-base sm:text-xl font-black text-[#f3a5a1]">
                    0%
                  </span>
                  <span className="text-[11px] text-[#f6f9e6] font-bold">
                    {isArabic ? "احتكاك أو خدوش" : "Micro-tears"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Action Buttons & Trust Pills */}
            <div className="relative z-10 space-y-5">
              {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {vis.heroPrimaryCta !== false && (
                    <button
                      type="button"
                      onClick={handleQuickOrder}
                      className="px-7 py-3.5 rounded-2xl bg-[#ca384a] hover:bg-[#610b0d] text-[#f6f9e6] font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
                    >
                      {addedHero ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isArabic ? "تمت الإضافة لحقيبتكِ ✓" : "Added to Bag ✓"}</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>
                            {custom.heroPrimaryCtaText ||
                              (isArabic
                                ? settings.hero.ctaText || "اطلبي الآن — تسليم فوري"
                                : t.hero.ctaOrder)}
                          </span>
                          <ArrowIcon className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}

                  {vis.heroSecondaryCta !== false && (
                    <Link
                      href="/shop"
                      className="px-6 py-3.5 rounded-2xl bg-[#f6f9e6] hover:bg-[#f3a5a1] text-[#485c36] hover:text-[#610b0d] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Sparkles className="w-4 h-4 text-[#ca384a]" />
                      <span>{custom.heroSecondaryCtaText || t.hero.ctaExplore}</span>
                    </Link>
                  )}
                </div>
              )}

              {vis.heroTrustBadges !== false && (
                <div className="pt-4 border-t border-[#f6f9e6]/15 flex flex-wrap items-center gap-4 text-[11px] font-bold text-[#f6f9e6]/90">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#f3a5a1]" />
                    <span>
                      {custom.heroTrustEfficacy ||
                        (isArabic ? "تركيبات سريرية معتمدة" : "Clinical Grade")}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#f3a5a1]" />
                    <span>
                      {isArabic ? "معاينة العبوة قبل الدفع" : "Inspect Before Paying"}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#f3a5a1]" />
                    <span>
                      {custom.heroTrustShipping ||
                        (isArabic ? "شحن مؤمن لكافة المحافظات" : "Insured Delivery")}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </motion.article>

          {/* BENTO CELL 2: FLAGSHIP PRODUCT & ACTIVE MOLECULE SWITCHER (5 Cols) */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 rounded-[2rem] bg-[#610b0d] text-[#f6f9e6] p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden shadow-[0_16px_40px_rgba(97,11,13,0.18)] border border-[#f3a5a1]/30"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#ca384a]/30 blur-2xl pointer-events-none" />

            {/* Top Header */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ca384a] text-[#f6f9e6] text-[11px] font-bold">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>{isArabic ? "المستحضر الرئيسي" : "Flagship Formula"}</span>
              </span>

              <Link
                href={`/product/${roughAway.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#f3a5a1] hover:text-[#f6f9e6] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isArabic ? "صفحة المستحضر" : "View Formula"}</span>
              </Link>
            </div>

            {/* Center Podium + Product Title */}
            <div className="relative z-10 my-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0">
                <MarblePodium
                  imageSrc={roughAway?.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                  alt={isArabic ? roughAway.nameAr : roughAway.nameEn}
                  size="sm"
                  priority={true}
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-start flex-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#f3a5a1]">
                  {roughAway.sku || "SLF-ABS-200"} • 200 ML
                </span>
                <h2 className="font-amiri text-xl sm:text-2xl font-bold text-[#f6f9e6] leading-snug">
                  {isArabic ? roughAway.nameAr : roughAway.nameEn}
                </h2>
                <p className="text-xs text-[#f6f9e6]/80 leading-relaxed line-clamp-2">
                  {isArabic ? roughAway.subtitleAr : roughAway.subtitleEn}
                </p>
                <div className="pt-1 flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="font-mono text-xl font-black text-[#f3a5a1]">
                    {roughAway.price} {currency}
                  </span>
                  {roughAway.compareAtPrice > roughAway.price && (
                    <span className="font-mono text-xs text-[#f6f9e6]/50 line-through">
                      {roughAway.compareAtPrice} {currency}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Active Ingredient Selector */}
            <div className="relative z-10 bg-[#f6f9e6] text-[#485c36] p-4 rounded-2xl space-y-2.5 border border-[#f3a5a1]">
              <div className="flex items-center gap-1.5 flex-wrap">
                {activesInfo.map((act, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedActive(idx)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      selectedActive === idx
                        ? `${act.pillBg} shadow-xs scale-[1.02]`
                        : "bg-[#485c36]/10 text-[#485c36] hover:bg-[#485c36]/20"
                    }`}
                  >
                    {act.title}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedActive}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-start space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#610b0d]">
                      {activesInfo[selectedActive].role}
                    </span>
                    <span className="font-mono text-[10px] font-black text-[#ca384a]">
                      {activesInfo[selectedActive].code}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#485c36] leading-relaxed">
                    {activesInfo[selectedActive].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.article>

          {/* BENTO CELL 3: 7-DAY SILK TRANSFORMATION INTERACTIVE CARD (3 Cols) */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 rounded-[2rem] bg-white border-2 border-[#485c36]/20 p-6 flex flex-col justify-between shadow-sm text-start"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#485c36]/10 text-[#485c36]">
                  {isArabic ? "الجدول السريري للتحول" : "Clinical Reset"}
                </span>
                <span className="font-mono text-xs font-black text-[#ca384a]">
                  {timelineDays[selectedDay].metric}
                </span>
              </div>

              {/* Day switcher pills */}
              <div className="grid grid-cols-3 gap-1.5 bg-[#f6f9e6] p-1 rounded-xl border border-[#485c36]/15">
                {timelineDays.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDay(idx)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      selectedDay === idx
                        ? "bg-[#485c36] text-[#f6f9e6] shadow-xs"
                        : "text-[#485c36] hover:bg-[#485c36]/10"
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22 }}
                className="my-4 space-y-1.5"
              >
                <h3 className="font-amiri text-xl font-bold text-[#610b0d]">
                  {timelineDays[selectedDay].title}
                </h3>
                <p className="text-xs text-[#485c36] leading-relaxed">
                  {timelineDays[selectedDay].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="pt-3 border-t border-[#485c36]/15 flex items-center justify-between text-[11px] font-bold text-[#485c36]">
              <span>{isArabic ? "نتائج تدريجية موثقة" : "Progressive Silk Reset"}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ca384a]" />
            </div>
          </motion.article>

          {/* BENTO CELL 4: SULAF ARCHITECTURAL PROMISE CARD (2 Cols) */}
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 rounded-[2rem] bg-[#f3a5a1] text-[#610b0d] p-6 flex flex-col justify-between border border-[#ca384a]/30 shadow-sm text-start relative overflow-hidden"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#610b0d] text-[#f6f9e6] flex items-center justify-center shadow-xs">
              <PackageCheck className="w-5 h-5 text-[#f3a5a1]" />
            </div>

            <div className="my-4 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#ca384a] text-[#f6f9e6] inline-block">
                {isArabic ? "ضمان سُـلاف" : "Sulaf Guarantee"}
              </span>
              <h3 className="font-amiri text-xl font-bold text-[#610b0d] leading-snug">
                {isArabic ? "معاينة العبوة بيدكِ قبل السداد" : "Inspect Before Paying"}
              </h3>
              <p className="text-[11px] text-[#610b0d]/90 font-semibold leading-relaxed">
                {isArabic
                  ? "افحصي عبوتكِ وتأكدي من الختم السريري الأصلي عند الاستلام قبل دفع قيمة الطلب."
                  : "Verify your sealed clinical jar upon delivery before completing payment."}
              </p>
            </div>

            <Link
              href="/track"
              className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-[#610b0d] hover:bg-[#485c36] text-[#f6f9e6] text-[11px] font-bold transition-colors"
            >
              <span>{isArabic ? "تتبع شحنتك" : "Track Order"}</span>
              <ArrowIcon className="w-3.5 h-3.5 text-[#f3a5a1]" />
            </Link>
          </motion.article>

        </div>
      </div>
    </section>
  );
}

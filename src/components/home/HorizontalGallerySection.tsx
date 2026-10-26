"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductData } from "@/lib/data/mock-data";
import { useProducts } from "@/lib/products/product-store";
import { ProductCard } from "../shop/ProductCard";
import { QuickViewModal } from "../shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
} from "lucide-react";

export function HorizontalGallerySection() {
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "urea" | "barrier">("all");
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();
  const allProducts = useProducts();
  const vis = settings.elementsVisibility || {
    galleryBadge: true,
    galleryHeading: true,
    galleryDesc: true,
    galleryViewAll: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  const handleScrollUpdate = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(1);
    } else {
      const progress = Math.min(1, Math.max(0, Math.abs(scrollLeft) / maxScroll));
      setScrollProgress(progress);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScrollUpdate, { passive: true });
    handleScrollUpdate();
    return () => el.removeEventListener("scroll", handleScrollUpdate);
  }, [handleScrollUpdate]);

  function scroll(direction: "left" | "right") {
    if (!scrollContainerRef.current) return;
    const distance = 360;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  const filteredProducts = allProducts.filter((p) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "urea") {
      return (
        p.activeIngredients?.some(
          (ing) =>
            ing.id.toLowerCase().includes("urea") ||
            ing.nameAr.includes("يوريا") ||
            ing.nameEn?.toLowerCase().includes("urea")
        ) ||
        p.nameAr.includes("كريم") ||
        (p.concernsAr && p.concernsAr.some((c) => c.includes("جلد الوزة") || c.includes("خشونة")))
      );
    }
    if (activeCategory === "barrier") {
      return (
        p.activeIngredients?.some(
          (ing) =>
            ing.id.toLowerCase().includes("ceramide") ||
            ing.id.toLowerCase().includes("lactate") ||
            ing.nameAr.includes("سيراميد") ||
            ing.nameAr.includes("لاكتات")
        ) ||
        (p.concernsAr && p.concernsAr.some((c) => c.includes("ترميم") || c.includes("جفاف")))
      );
    }
    return true;
  });

  const categories = [
    { id: "all" as const, labelAr: "الكل • الصيدلية السريرية", labelEn: "All Formulas" },
    { id: "urea" as const, labelAr: "الترميم الكيراتيني وجلد الوزة (30% Urea)", labelEn: "Keratosis Pilaris & Urea" },
    { id: "barrier" as const, labelAr: "الحاجز الدهني والترطيب الفائق", labelEn: "Lipid Barrier & Hydration" },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f6f9e6] via-white to-[#f6f9e6] relative overflow-hidden font-cairo">
      {/* Subtle Ambient Decorative Gradient Mesh in palette colors */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#485c36]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#f3a5a1]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 3 Pillars of Architectural Clinical Excellence with staggered reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#e2e8c0] hover:border-[#485c36] shadow-xs hover:shadow-md transition-all text-start space-y-2.5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center font-bold transition-transform group-hover:scale-110">
              <Sparkles className="w-6 h-6 text-[#485c36]" />
            </div>
            <h3 className="font-amiri font-bold text-lg text-[#1c2616]">
              {isArabic ? "30% يوريا علاجية نقية" : "30% Pure Clinical Urea"}
            </h3>
            <p className="font-cairo text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isArabic
                ? "إذابة الروابط الكيراتينية المتصلبة وتنعيم جلد الوزة والخشونة الشديدة بدون احتكاك أو خدوش مجهرية."
                : "Dissolves hardened keratin plugs, resetting keratosis pilaris and rough bumps with zero abrasion."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#e2e8c0] hover:border-[#ca384a] shadow-xs hover:shadow-md transition-all text-start space-y-2.5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ca384a]/10 text-[#ca384a] flex items-center justify-center font-bold transition-transform group-hover:scale-110">
              <ShieldCheck className="w-6 h-6 text-[#ca384a]" />
            </div>
            <h3 className="font-amiri font-bold text-lg text-[#1c2616]">
              {isArabic ? "أمونيوم لاكتات 10% وسيراميدات" : "10% Ammonium Lactate & Ceramides"}
            </h3>
            <p className="font-cairo text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isArabic
                ? "ترميم عميق للحاجز الدهني لحبس الرطوبة داخل الخلايا ومنع انتكاس الخشونة، لنعومة حريرية دائمة."
                : "Deep structural lipid replenishment locking cellular hydration and preventing dry rebound."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-[#e2e8c0] hover:border-[#610b0d] shadow-xs hover:shadow-md transition-all text-start space-y-2.5 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#610b0d]/10 text-[#610b0d] flex items-center justify-center font-bold transition-transform group-hover:scale-110">
              <PackageCheck className="w-6 h-6 text-[#610b0d]" />
            </div>
            <h3 className="font-amiri font-bold text-lg text-[#1c2616]">
              {isArabic ? "معاينة العبوة قبل الاستلام" : "Inspect Before Payment"}
            </h3>
            <p className="font-cairo text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isArabic
                ? "حق فحص وتفقد العبوة قبل السداد لمندوب الشحن، مع توصيل سريع ومؤمن لكافة محافظات الجمهورية."
                : "Inspect your package upon delivery before completing payment, with express insured shipping nationwide."}
            </p>
          </motion.div>
        </div>

        {/* Interactive 3-Stage Clinical Texture Transformation Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 rounded-3xl bg-[#485c36] text-[#f6f9e6] p-6 sm:p-8 md:p-10 shadow-xl border border-[#f3a5a1]/30 relative overflow-hidden"
        >
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#ca384a]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#610b0d]/35 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3 text-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#610b0d] border border-[#f3a5a1]/40 text-[#f3a5a1] text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#ca384a]" />
                <span>
                  {isArabic ? "آلية التحول الهيكلي ثلاثية المراحل" : "3-Stage Structural Skin Reset"}
                </span>
              </div>
              <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#f6f9e6] leading-snug">
                {isArabic
                  ? "كيف تعيد تركيبات سُـلاف بناء ملمس البشرة الحريري؟"
                  : "How Sulaf Formulas Rebuild Silky Skin Architecture"}
              </h3>
              <p className="text-xs sm:text-sm text-[#f6f9e6]/85 leading-relaxed">
                {isArabic
                  ? "اضغطي على كل مرحلة لاستكشاف التفاعل الحيوي المتكامل بين اليوريا النقية وحمض اللاكتيك والسيراميدات."
                  : "Select each stage to explore the clinical synergy between Pure Urea, Lactic Acid, and Ceramides."}
              </p>

              {/* Stage Selector Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  {
                    idx: 0 as const,
                    badge: "01",
                    labelAr: "تفكيك التقرن (30% Urea)",
                    labelEn: "Keratolytic Reset",
                  },
                  {
                    idx: 1 as const,
                    badge: "02",
                    labelAr: "صقل المسام (10% Lactate)",
                    labelEn: "Pore Resurfacing",
                  },
                  {
                    idx: 2 as const,
                    badge: "03",
                    labelAr: "إغلاق الحاجز (Ceramides)",
                    labelEn: "Lipid Barrier Lock",
                  },
                ].map((st) => {
                  const active = activeStage === st.idx;
                  return (
                    <button
                      key={st.idx}
                      type="button"
                      onClick={() => setActiveStage(st.idx)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        active
                          ? "bg-[#ca384a] text-[#f6f9e6] shadow-md scale-[1.02]"
                          : "bg-[#f6f9e6]/10 text-[#f6f9e6] hover:bg-[#f6f9e6]/20 border border-[#f6f9e6]/15"
                      }`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-[#610b0d] text-[#f3a5a1]">
                        {st.badge}
                      </span>
                      <span>{isArabic ? st.labelAr : st.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Stage Visualization Card */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {activeStage === 0 && (
                  <motion.div
                    key="stage-0"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-7 rounded-3xl bg-[#f6f9e6] text-[#485c36] border-2 border-[#f3a5a1] shadow-lg space-y-4 text-start"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#485c36] text-[#f6f9e6] text-xs font-bold">
                        {isArabic ? "المرحلة الأولى • الإذابة الكيراتينية" : "Stage 01 • Keratolytic Dissolution"}
                      </span>
                      <span className="font-mono text-sm font-black text-[#ca384a]">30% UREA USP</span>
                    </div>
                    <h4 className="font-amiri text-2xl font-bold text-[#610b0d]">
                      {isArabic
                        ? "إذابة السدادات الكيراتينية المسببة لجلد الوزة والشعر تحت الجلد"
                        : "Dissolving Hardened Keratin Plugs & Ingrown Hairs"}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#485c36] leading-relaxed">
                      {isArabic
                        ? "يتغلغل تركيز 30% يوريا طبية نقية داخل الطبقة المتقرنة لتفكيك الروابط الجزيئية الخشنة بهدوء تام دون أي مقشرات فيزيائية قاسية، مما يحرر المسام المحتجزة منذ الاستعمالات الأولى."
                        : "Clinical 30% Urea penetrates the stratum corneum to gently break down rough molecular bonds without harsh physical scrubs, freeing trapped follicles."}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="p-3 rounded-2xl bg-[#485c36]/10 border border-[#485c36]/20 text-center">
                        <span className="block font-mono text-sm font-black text-[#610b0d]">0%</span>
                        <span className="text-[11px] font-bold text-[#485c36]">{isArabic ? "خدوش مجهرية" : "Micro-tears"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#ca384a]/10 border border-[#ca384a]/25 text-center">
                        <span className="block font-mono text-sm font-black text-[#ca384a]">30%</span>
                        <span className="text-[11px] font-bold text-[#610b0d]">{isArabic ? "يوريا علاجية" : "Pure Urea"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#610b0d] text-[#f6f9e6] text-center">
                        <span className="block font-mono text-sm font-black text-[#f3a5a1]">pH 5.2</span>
                        <span className="text-[11px] font-bold text-[#f6f9e6]">{isArabic ? "توازن فسيولوجي" : "Balanced pH"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStage === 1 && (
                  <motion.div
                    key="stage-1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-7 rounded-3xl bg-[#f6f9e6] text-[#485c36] border-2 border-[#ca384a] shadow-lg space-y-4 text-start"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#ca384a] text-[#f6f9e6] text-xs font-bold">
                        {isArabic ? "المرحلة الثانية • التجديد الخلوي" : "Stage 02 • Cellular Resurfacing"}
                      </span>
                      <span className="font-mono text-sm font-black text-[#610b0d]">10% AMMONIUM LACTATE</span>
                    </div>
                    <h4 className="font-amiri text-2xl font-bold text-[#610b0d]">
                      {isArabic
                        ? "توحيد لون المسام الداكنة وصقل الملمس السطحي للبشرة"
                        : "Refining Dark Follicular Dots & Surface Texture"}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#485c36] leading-relaxed">
                      {isArabic
                        ? "يعمل أمونيوم لاكتات بتركيز 10% على تحفيز التجدد الطبيعي للخلايا السطحية وإزالة التصبغات الناتجة عن احتباس الشعر، مع جذب جزيئات الماء داخل الأدمة."
                        : "10% Ammonium Lactate accelerates natural surface cell turnover, fading follicular hyperpigmentation while drawing deep moisture into the dermis."}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="p-3 rounded-2xl bg-[#ca384a]/10 border border-[#ca384a]/25 text-center">
                        <span className="block font-mono text-sm font-black text-[#ca384a]">10%</span>
                        <span className="text-[11px] font-bold text-[#610b0d]">{isArabic ? "أمونيوم لاكتات" : "Lactate AHA"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#485c36]/10 border border-[#485c36]/20 text-center">
                        <span className="block font-mono text-sm font-black text-[#485c36]">2%</span>
                        <span className="text-[11px] font-bold text-[#485c36]">{isArabic ? "سالسليك نقي" : "BHA Salicylic"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#610b0d] text-[#f6f9e6] text-center">
                        <span className="block font-mono text-sm font-black text-[#f3a5a1]">24h</span>
                        <span className="text-[11px] font-bold text-[#f6f9e6]">{isArabic ? "نعومة مستمرة" : "Active Renewal"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStage === 2 && (
                  <motion.div
                    key="stage-2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-7 rounded-3xl bg-[#f6f9e6] text-[#485c36] border-2 border-[#610b0d] shadow-lg space-y-4 text-start"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#610b0d] text-[#f3a5a1] text-xs font-bold">
                        {isArabic ? "المرحلة الثالثة • الترميم الدهني" : "Stage 03 • Lipid Barrier Lock"}
                      </span>
                      <span className="font-mono text-sm font-black text-[#485c36]">CERAMIDES NP • AP • EOP</span>
                    </div>
                    <h4 className="font-amiri text-2xl font-bold text-[#610b0d]">
                      {isArabic
                        ? "إعادة بناء الحاجز الدهني لمنع عودة الجفاف أو الخشونة"
                        : "Rebuilding the Lipid Matrix to Prevent Dry Rebound"}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#485c36] leading-relaxed">
                      {isArabic
                        ? "تعمل السيراميدات المتطابقة حيوياً مع البانثينول 5% على ختم الرطوبة داخل طبقات الجلد وإصلاح الفجوات بين الخلايا، لتبقى بشرتكِ ناعمة كالحرير دون أي ملمس دهني."
                        : "Bio-identical Ceramides and 5% Panthenol seal hydration inside skin layers and repair intercellular gaps for a non-greasy, velvet finish."}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="p-3 rounded-2xl bg-[#485c36]/10 border border-[#485c36]/20 text-center">
                        <span className="block font-mono text-sm font-black text-[#485c36]">3x</span>
                        <span className="text-[11px] font-bold text-[#485c36]">{isArabic ? "سيراميدات حيوية" : "Bio-Ceramides"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#ca384a]/10 border border-[#ca384a]/25 text-center">
                        <span className="block font-mono text-sm font-black text-[#ca384a]">5%</span>
                        <span className="text-[11px] font-bold text-[#610b0d]">{isArabic ? "بانثينول مهدئ" : "D-Panthenol"}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#610b0d] text-[#f6f9e6] text-center">
                        <span className="block font-mono text-sm font-black text-[#f3a5a1]">72h</span>
                        <span className="text-[11px] font-bold text-[#f6f9e6]">{isArabic ? "حبس الرطوبة" : "Moisture Lock"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Section Header with controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="text-start">
            {vis.galleryBadge !== false && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#485c36]" />
                <span>{custom.galleryBadgeText || (isArabic ? "المستحضرات السريرية المعتمدة" : t.gallery.badge)}</span>
              </div>
            )}
            {vis.galleryHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#1c2616]">
                {custom.galleryHeadingText || (isArabic ? "مجموعة سُـلاف للترميم الهيكلي والعناية الفائقة" : t.gallery.heading)}
              </h2>
            )}
            {vis.galleryDesc !== false && (
              <p className="mt-1 text-xs sm:text-sm text-gray-600 font-cairo max-w-xl">
                {custom.galleryDescText || (isArabic ? "تركيبات صيدلانية متطورة مصممة لتحويل ملمس البشرة الخشن إلى حرير لا يُهزم." : t.gallery.desc)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {vis.galleryViewAll !== false && (
              <Link
                href="/shop"
                className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-cairo font-bold text-[#485c36] hover:text-[#38492a] ${
                  isArabic ? "pl-4 border-l border-[#e2e8c0]" : "pr-4 border-r border-[#e2e8c0]"
                }`}
              >
                <span>{custom.galleryViewAllText || t.gallery.viewAll}</span>
                {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            )}

            {/* Slider navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label={t.gallery.prev}
                className="p-2.5 rounded-full border border-[#e2e8c0] bg-white text-[#485c36] hover:bg-[#485c36] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label={t.gallery.next}
                className="p-2.5 rounded-full border border-[#e2e8c0] bg-white text-[#485c36] hover:bg-[#485c36] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Category Pill Tabs with animated indicator */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "text-[#f6f9e6] shadow-sm"
                    : "text-[#485c36] hover:bg-white/80 bg-white/50 border border-[#e2e8c0]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute inset-0 bg-[#485c36] rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{isArabic ? cat.labelAr : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((prod) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35 }}
                className="w-[82vw] max-w-[300px] sm:w-[320px] md:w-[350px] shrink-0 snap-center"
              >
                <ProductCard
                  product={prod}
                  displayMode="podium"
                  onQuickView={setSelectedQuickView}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Elegant Horizontal Progress Bar */}
        <div className="mt-2 flex items-center justify-between gap-4 max-w-xs mx-auto px-4">
          <div className="h-1 flex-1 bg-[#485c36]/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#485c36] via-[#ca384a] to-[#485c36] rounded-full transition-all duration-150"
              style={{ width: `${Math.max(18, scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-[#485c36]/80">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />
    </section>
  );
}

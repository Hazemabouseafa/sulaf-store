"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductData } from "@/lib/data/mock-data";
import { getStoredProducts } from "@/lib/products/product-store";
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();
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

  const allProducts = getStoredProducts();
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

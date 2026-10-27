"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProductData } from "@/lib/data/mock-data";
import { useProducts } from "@/lib/products/product-store";
import { useCart } from "@/lib/cart/cart-context";
import { MarblePodium } from "../shop/MarblePodium";
import { QuickViewModal } from "../shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  ShoppingBag,
  Eye,
  Check,
  Star,
  FlaskConical,
} from "lucide-react";

export function HorizontalGallerySection() {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "urea" | "barrier">("all");
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);
  const [addedId, setAddedId] = useState<string | null>(null);

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
  const currency = isArabic ? "ج.م" : "EGP";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

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
    { id: "all" as const, labelAr: "كل التركيبات السريرية", labelEn: "All Formulas" },
    { id: "urea" as const, labelAr: "علاج جلد الوزة والخشونة (30% Urea)", labelEn: "Keratosis Pilaris & Urea" },
    { id: "barrier" as const, labelAr: "ترميم الحاجز والترطيب العميق", labelEn: "Barrier & Hydration" },
  ];

  function handleAdd(e: React.MouseEvent, prod: ProductData) {
    e.preventDefault();
    e.stopPropagation();
    addItem(prod);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1600);
  }

  // Bento span assignments for an asymmetric, simple, architectural layout
  function getBentoSpan(index: number, total: number): string {
    if (total === 1) return "lg:col-span-12";
    if (total === 2) return index === 0 ? "lg:col-span-7" : "lg:col-span-5";
    if (total === 3) {
      if (index === 0) return "lg:col-span-7";
      if (index === 1) return "lg:col-span-5";
      return "lg:col-span-12";
    }
    // 4 or more products: Row 1 = 7 + 5, Row 2 = 5 + 7
    const mod = index % 4;
    if (mod === 0) return "lg:col-span-7";
    if (mod === 1) return "lg:col-span-5";
    if (mod === 2) return "lg:col-span-5";
    return "lg:col-span-7";
  }

  return (
    <section className="py-12 sm:py-16 bg-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* =================================================================== */}
        {/* HEADER BAR + MINIMALIST FILTER PILLS                                */}
        {/* =================================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2 border-b border-[#485c36]/15">
          <div className="space-y-2 text-start">
            {vis.galleryBadge !== false && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#485c36] text-[#f6f9e6] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#f3a5a1]" />
                <span>
                  {custom.galleryBadgeText ||
                    (isArabic ? "مختبر سُـلاف السريري" : t.gallery.badge)}
                </span>
              </div>
            )}

            {vis.galleryHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
                {custom.galleryHeadingText ||
                  (isArabic
                    ? "مجموعة سُـلاف للترميم الهيكلي والعناية الفائقة"
                    : t.gallery.heading)}
              </h2>
            )}

            {vis.galleryDesc !== false && (
              <p className="text-xs sm:text-sm text-[#485c36]/80 max-w-xl leading-relaxed">
                {custom.galleryDescText ||
                  (isArabic
                    ? "تركيبات صيدلانية مركزة مصممة بهندسة دقيقة لتحويل ملمس البشرة الخشن إلى نعومة حريرية دائمة."
                    : t.gallery.desc)}
              </p>
            )}
          </div>

          {/* Category Filter Pills + View All Link */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#610b0d] text-[#f6f9e6] shadow-sm"
                      : "bg-white text-[#485c36] border border-[#485c36]/20 hover:border-[#485c36]"
                  }`}
                >
                  {isArabic ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}

            {vis.galleryViewAll !== false && (
              <Link
                href="/shop"
                className="px-4 py-2 rounded-2xl bg-[#485c36]/10 hover:bg-[#485c36] text-[#485c36] hover:text-[#f6f9e6] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>{custom.galleryViewAllText || t.gallery.viewAll}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* PART 1: ASYMMETRIC BENTO GRID FOR PRODUCTS                          */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((prod, idx) => {
              const spanClass = getBentoSpan(idx, filteredProducts.length);
              const isWideBento = spanClass.includes("col-span-7") || spanClass.includes("col-span-12");
              const isAdded = addedId === prod.id;
              const prodName = isArabic ? prod.nameAr : prod.nameEn;
              const prodSub = isArabic ? prod.subtitleAr : prod.subtitleEn;

              // Distinctive Bento card surface themes strictly from the 5 colors
              const isFlagship = idx === 0;

              return (
                <motion.article
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  onClick={() => router.push(`/product/${prod.slug}`)}
                  className={`${spanClass} group relative rounded-[2rem] p-6 sm:p-8 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isFlagship
                      ? "bg-[#485c36] text-[#f6f9e6] border-2 border-[#485c36] shadow-[0_18px_45px_rgba(72,92,54,0.16)]"
                      : "bg-white text-[#485c36] border-2 border-[#485c36]/15 hover:border-[#485c36] shadow-[0_8px_28px_rgba(72,92,54,0.06)]"
                  }`}
                >
                  {/* Top Meta Bar */}
                  <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                        isFlagship
                          ? "bg-[#ca384a] text-[#f6f9e6]"
                          : "bg-[#610b0d] text-[#f3a5a1]"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span>
                        {isArabic
                          ? prod.badgeAr || "تركيبة سريرية"
                          : "Clinical Formula"}
                      </span>
                    </span>

                    {prod.reviewsCount > 0 ? (
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isFlagship
                            ? "bg-[#f6f9e6]/15 text-[#f3a5a1]"
                            : "bg-[#ca384a]/10 text-[#ca384a]"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{prod.rating}</span>
                        <span className="opacity-75">({prod.reviewsCount})</span>
                      </div>
                    ) : (
                      <span
                        className={`font-mono text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          isFlagship
                            ? "bg-[#f6f9e6]/10 text-[#f3a5a1]"
                            : "bg-[#f6f9e6] text-[#485c36]"
                        }`}
                      >
                        {prod.sku || "SULAF-RX"}
                      </span>
                    )}
                  </div>

                  {/* Main Body: Side-by-side on Wide Bento Cards, Stacked on Compact Bento Cards */}
                  <div
                    className={`relative z-10 my-2 flex flex-col ${
                      isWideBento ? "md:flex-row md:items-center gap-6" : "items-center gap-4"
                    }`}
                  >
                    {/* Product Podium */}
                    <div
                      className={`shrink-0 flex items-center justify-center rounded-3xl p-3 ${
                        isFlagship
                          ? "bg-[#f6f9e6]/10 border border-[#f6f9e6]/15"
                          : "bg-[#f6f9e6] border border-[#485c36]/10"
                      } ${isWideBento ? "w-full md:w-52" : "w-full"}`}
                    >
                      <MarblePodium
                        imageSrc={prod.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                        alt={prodName}
                        size="sm"
                      />
                    </div>

                    {/* Text & Active Ingredients */}
                    <div className="flex-1 space-y-3 text-start w-full">
                      {/* Active Ingredient Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {prod.activeIngredients.slice(0, 3).map((ing) => (
                          <span
                            key={ing.id}
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              isFlagship
                                ? "bg-[#610b0d] text-[#f3a5a1] border border-[#f3a5a1]/30"
                                : "bg-[#f6f9e6] text-[#485c36] border border-[#485c36]/25"
                            }`}
                          >
                            {ing.concentration} {isArabic ? ing.nameAr : ing.nameEn}
                          </span>
                        ))}
                      </div>

                      <h3
                        className={`font-amiri text-2xl sm:text-3xl font-bold leading-snug ${
                          isFlagship ? "text-[#f6f9e6]" : "text-[#610b0d]"
                        }`}
                      >
                        {prodName}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                          isFlagship ? "text-[#f6f9e6]/85" : "text-[#485c36]/85"
                        }`}
                      >
                        {prodSub}
                      </p>

                      {isWideBento && prod.concernsAr && prod.concernsAr.length > 0 && (
                        <div className="pt-1 flex flex-wrap items-center gap-1.5">
                          {prod.concernsAr.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isFlagship
                                  ? "bg-[#f6f9e6]/10 text-[#f6f9e6]"
                                  : "bg-[#f3a5a1]/25 text-[#610b0d]"
                              }`}
                            >
                              • {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Price & Action Footer */}
                  <div
                    className={`relative z-10 mt-6 pt-4 border-t flex items-center justify-between gap-3 ${
                      isFlagship ? "border-[#f6f9e6]/15" : "border-[#485c36]/15"
                    }`}
                  >
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`font-mono text-xl sm:text-2xl font-black ${
                          isFlagship ? "text-[#f3a5a1]" : "text-[#485c36]"
                        }`}
                      >
                        {prod.price} {currency}
                      </span>
                      {prod.compareAtPrice > prod.price && (
                        <span
                          className={`font-mono text-xs line-through ${
                            isFlagship ? "text-[#f6f9e6]/50" : "text-[#485c36]/50"
                          }`}
                        >
                          {prod.compareAtPrice} {currency}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedQuickView(prod);
                        }}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                          isFlagship
                            ? "border-[#f6f9e6]/25 text-[#f6f9e6] hover:bg-[#f6f9e6]/15"
                            : "border-[#485c36]/20 text-[#485c36] hover:bg-[#f6f9e6]"
                        }`}
                        title={t.product.quickView}
                        aria-label={t.product.quickView}
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleAdd(e, prod)}
                        className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isAdded
                            ? "bg-[#610b0d] text-[#f3a5a1]"
                            : isFlagship
                            ? "bg-[#ca384a] hover:bg-[#610b0d] text-[#f6f9e6]"
                            : "bg-[#485c36] hover:bg-[#610b0d] text-[#f6f9e6]"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.product.addedToBag}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{t.product.addToBag}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* =================================================================== */}
        {/* PART 2: SULAF IDENTITY BENTO MATRIX (3-STAGE LAB + 2 PILLAR CELLS)  */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4">
          
          {/* BENTO LAB CELL (7 Cols): Interactive 3-Stage Structural Skin Reset */}
          <div className="lg:col-span-7 rounded-[2rem] bg-[#610b0d] text-[#f6f9e6] p-6 sm:p-8 flex flex-col justify-between border border-[#f3a5a1]/30 shadow-lg text-start relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ca384a] text-[#f6f9e6] text-xs font-bold">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>
                    {isArabic
                      ? "هندسة سُـلاف ثلاثية المراحل"
                      : "Sulaf 3-Stage Skin Architecture"}
                  </span>
                </span>
                <span className="font-mono text-xs text-[#f3a5a1] font-bold">
                  UREA • LACTATE • CERAMIDES
                </span>
              </div>

              <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#f6f9e6]">
                {isArabic
                  ? "كيف تتحول البشرة من الخشونة والتقرن إلى نعومة الحرير؟"
                  : "How Rough Keratin Transforms Into Undefeated Silk"}
              </h3>

              {/* 3 Stage Selector Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {[
                  {
                    idx: 0 as const,
                    code: "01",
                    titleAr: "إذابة التقرن (30% Urea)",
                    titleEn: "Keratolytic Reset",
                  },
                  {
                    idx: 1 as const,
                    code: "02",
                    titleAr: "صقل المسام (10% Lactate)",
                    titleEn: "Pore Resurfacing",
                  },
                  {
                    idx: 2 as const,
                    code: "03",
                    titleAr: "ختم الحاجز (Ceramides)",
                    titleEn: "Lipid Barrier Lock",
                  },
                ].map((st) => {
                  const active = activeStage === st.idx;
                  return (
                    <button
                      key={st.idx}
                      type="button"
                      onClick={() => setActiveStage(st.idx)}
                      className={`p-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer text-start ${
                        active
                          ? "bg-[#f6f9e6] text-[#610b0d] shadow-md"
                          : "bg-[#f6f9e6]/10 text-[#f6f9e6] hover:bg-[#f6f9e6]/20 border border-[#f6f9e6]/15"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-black ${
                          active
                            ? "bg-[#ca384a] text-[#f6f9e6]"
                            : "bg-[#610b0d] text-[#f3a5a1]"
                        }`}
                      >
                        {st.code}
                      </span>
                      <span className="truncate">{isArabic ? st.titleAr : st.titleEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage Content Box */}
            <div className="relative z-10 mt-5">
              <AnimatePresence mode="wait">
                {activeStage === 0 && (
                  <motion.div
                    key="st-0"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="p-5 rounded-2xl bg-[#f6f9e6] text-[#485c36] space-y-2 border border-[#f3a5a1]"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-amiri text-xl font-bold text-[#610b0d]">
                        {isArabic
                          ? "تفكيك السدادات الكيراتينية والشعر تحت الجلد بهدوء"
                          : "Gentle Keratin Plug Dissolution"}
                      </h4>
                      <span className="font-mono text-xs font-black text-[#ca384a]">
                        30% UREA USP
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#485c36]">
                      {isArabic
                        ? "يتغلغل تركيز 30% يوريا نقية لتفكيك التكلسات الكيراتينية المسببة لجلد الوزة دون أي مقشرات حبيبية تسبب خدوشاً مجهرية."
                        : "30% Pure Urea penetrates to dissolve rough follicular plugs without harsh physical scrubs."}
                    </p>
                  </motion.div>
                )}

                {activeStage === 1 && (
                  <motion.div
                    key="st-1"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="p-5 rounded-2xl bg-[#f6f9e6] text-[#485c36] space-y-2 border border-[#ca384a]"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-amiri text-xl font-bold text-[#610b0d]">
                        {isArabic
                          ? "تجديد الخلايا السطحية وتوحيد مظهر المسام الداكنة"
                          : "Surface Renewal & Pore Refinement"}
                      </h4>
                      <span className="font-mono text-xs font-black text-[#ca384a]">
                        10% LACTATE + 2% BHA
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#485c36]">
                      {isArabic
                        ? "يحفز أمونيوم لاكتات 10% مع الساليسيليك 2% التجدد الطبيعي للطبقة السطحية ويصقل النتوءات ليمنح البشرة ملمساً متجانساً."
                        : "10% Ammonium Lactate and 2% Salicylic Acid accelerate cell turnover and refine dark follicular dots."}
                    </p>
                  </motion.div>
                )}

                {activeStage === 2 && (
                  <motion.div
                    key="st-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="p-5 rounded-2xl bg-[#f6f9e6] text-[#485c36] space-y-2 border border-[#485c36]"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-amiri text-xl font-bold text-[#610b0d]">
                        {isArabic
                          ? "ترميم الحاجز الدهني لمنع عودة الجفاف لمدة 72 ساعة"
                          : "72-Hour Lipid Matrix Restoration"}
                      </h4>
                      <span className="font-mono text-xs font-black text-[#485c36]">
                        CERAMIDES NP • AP • EOP
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#485c36]">
                      {isArabic
                        ? "تغلق السيراميدات المتطابقة حيوياً والبانثينول 5% الفجوات بين الخلايا لحبس الرطوبة ومنع انتكاس الجفاف."
                        : "Bio-identical Ceramides and 5% Panthenol seal intercellular gaps to lock in lasting silkiness."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT STACKED BENTO CELLS (5 Cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            
            {/* Pillar Cell A: Clinical Gentleness */}
            <div className="rounded-[2rem] bg-[#485c36] text-[#f6f9e6] p-6 sm:p-7 flex flex-col justify-between border border-[#485c36] shadow-md text-start">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#f6f9e6]/15 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#f3a5a1]" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#610b0d] text-[#f3a5a1]">
                  pH 5.2 BALANCED
                </span>
              </div>

              <div className="my-4 space-y-1.5">
                <h3 className="font-amiri text-2xl font-bold text-[#f6f9e6]">
                  {isArabic
                    ? "فلسفة الرفق الصيدلاني • بدون تقشير قاسٍ"
                    : "Clinical Gentleness • Zero Abrasion"}
                </h3>
                <p className="text-xs text-[#f6f9e6]/85 leading-relaxed">
                  {isArabic
                    ? "صُممت تركيبات سُـلاف لتعالج خشونة الجلد والتقرن بالتحلل الجزيئي الهادئ دون التهاب أو احمرار، استلهاماً من شعارنا: ما كان في رفقٍ يداوينا سلاف به."
                    : "Engineered to resolve roughness through calm molecular dissolution rather than harsh physical scrubbing."}
                </p>
              </div>
            </div>

            {/* Pillar Cell B: Flexible Deposit & Inspection */}
            <div className="rounded-[2rem] bg-[#f3a5a1] text-[#610b0d] p-6 sm:p-7 flex flex-col justify-between border border-[#ca384a]/35 shadow-sm text-start">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#610b0d] flex items-center justify-center">
                  <PackageCheck className="w-5 h-5 text-[#f3a5a1]" />
                </div>
                <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#ca384a] text-[#f6f9e6]">
                  STOXX EXPRESS
                </span>
              </div>

              <div className="my-4 space-y-1.5">
                <h3 className="font-amiri text-2xl font-bold text-[#610b0d]">
                  {isArabic
                    ? "معاينة العبوة قبل الدفع + شحن مؤمن"
                    : "Inspect Upon Delivery + Insured Shipping"}
                </h3>
                <p className="text-xs text-[#610b0d]/90 font-semibold leading-relaxed">
                  {isArabic
                    ? "نضمن لكِ حق فتح الطرد ومعاينة عبوة سُـلاف الأصلية مع مندوب الشحن قبل السداد، مع إمكانية الحجز بعربون 100 ج.م أو الدفع الكامل."
                    : "Open and verify your authentic Sulaf package upon delivery before paying the courier."}
                </p>
              </div>
            </div>

          </div>
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

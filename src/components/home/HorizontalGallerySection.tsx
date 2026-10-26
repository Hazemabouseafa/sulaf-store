"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
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
  CheckCircle2,
  PackageCheck,
  Layers,
} from "lucide-react";

export function HorizontalGallerySection() {
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);
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

  function scroll(direction: "left" | "right") {
    if (!scrollContainerRef.current) return;
    const distance = 360;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#f6f9e6] via-white to-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 3 Pillars of Architectural Clinical Excellence in exact palette */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-14">
          <div className="p-6 rounded-3xl bg-white border border-[#e2e8c0] hover:border-[#485c36] shadow-sm hover:shadow-md transition-all text-start space-y-2.5 group">
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
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e2e8c0] hover:border-[#ca384a] shadow-sm hover:shadow-md transition-all text-start space-y-2.5 group">
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
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e2e8c0] hover:border-[#610b0d] shadow-sm hover:shadow-md transition-all text-start space-y-2.5 group">
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
          </div>
        </div>

        {/* Section Header with controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
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
                onClick={() => scroll("left")}
                aria-label={t.gallery.prev}
                className="p-2.5 rounded-full border border-[#e2e8c0] bg-white text-[#485c36] hover:bg-[#485c36] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label={t.gallery.next}
                className="p-2.5 rounded-full border border-[#e2e8c0] bg-white text-[#485c36] hover:bg-[#485c36] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {getStoredProducts().map((prod) => (
            <div
              key={prod.id}
              className="w-[82vw] max-w-[300px] sm:w-[320px] md:w-[350px] shrink-0 snap-center"
            >
              <ProductCard
                product={prod}
                displayMode="podium"
                onQuickView={setSelectedQuickView}
              />
            </div>
          ))}
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

"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ProductData } from "@/lib/data/mock-data";
import { getStoredProducts } from "@/lib/products/product-store";
import { ProductCard } from "../shop/ProductCard";
import { QuickViewModal } from "../shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ChevronLeft, ChevronRight, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

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
    <section className="py-20 bg-gradient-to-b from-[#f6f9e6] via-white to-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            {vis.galleryBadge !== false && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#485c36]" />
                <span>{custom.galleryBadgeText || t.gallery.badge}</span>
              </div>
            )}
            {vis.galleryHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#222b1a]">
                {custom.galleryHeadingText || t.gallery.heading}
              </h2>
            )}
            {vis.galleryDesc !== false && (
              <p className="mt-1 text-xs sm:text-sm text-gray-600 font-cairo max-w-xl">
                {custom.galleryDescText || t.gallery.desc}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {vis.galleryViewAll !== false && (
            <Link
              href="/shop"
              className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-cairo font-bold text-[#485c36] hover:text-[#2c3821] ${
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
                className="p-2.5 rounded-full border border-[#e2e8c0] bg-white hover:bg-[#485c36] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label={t.gallery.next}
                className="p-2.5 rounded-full border border-[#e2e8c0] bg-white hover:bg-[#485c36] hover:text-white transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {getStoredProducts().map((prod) => (
            <div
              key={prod.id}
              className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0 snap-center"
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

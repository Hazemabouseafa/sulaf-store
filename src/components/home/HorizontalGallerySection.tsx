"use client";

import React from "react";
import Link from "next/link";
import { useProducts } from "@/lib/products/product-store";
import { ProductCard } from "../shop/ProductCard";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function HorizontalGallerySection() {
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
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // ACT II: THE CLINICAL REMEDY — CLEAN HORIZONTAL ROW ON CREAM (#f6f9e6)
  return (
    <section
      id="act-formulas"
      className="py-20 sm:py-24 bg-[#f6f9e6] text-[#485c36] relative overflow-hidden font-cairo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Simple Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#485c36]/15 pb-5">
          <div className="text-start space-y-1">
            {vis.galleryBadge !== false && (
              <span className="text-xs font-bold text-[#ca384a] block">
                {custom.galleryBadgeText ||
                  (isArabic ? "المشهد الثاني • المستحضرات السريرية" : t.gallery.badge)}
              </span>
            )}

            {vis.galleryHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
                {custom.galleryHeadingText ||
                  (isArabic ? "مستحضرات سُـلاف العلاجية" : t.gallery.heading)}
              </h2>
            )}
          </div>

          {vis.galleryViewAll !== false && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#610b0d] hover:text-[#ca384a] transition-colors"
            >
              <span>{custom.galleryViewAllText || t.gallery.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Clean 4-Column Horizontal Product Row (Image + Name + Price + Cart Button Only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </div>
    </section>
  );
}

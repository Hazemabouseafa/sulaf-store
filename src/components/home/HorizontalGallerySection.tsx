"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductData } from "@/lib/data/mock-data";
import { useProducts } from "@/lib/products/product-store";
import { ProductCard } from "../shop/ProductCard";
import { QuickViewModal } from "../shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";

export function HorizontalGallerySection() {
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);
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

  return (
    <section className="py-16 sm:py-20 bg-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        
        {/* 1. CENTERED MINIMALIST ARCHED HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {vis.galleryBadge !== false && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold border border-[#485c36]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#ca384a]" />
              <span>
                {custom.galleryBadgeText ||
                  (isArabic ? "المستحضرات السريرية المعتمدة" : t.gallery.badge)}
              </span>
            </div>
          )}

          {vis.galleryHeading !== false && (
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
              {custom.galleryHeadingText ||
                (isArabic
                  ? "أقواس سُـلاف للترميم الهيكلي والعناية الفائقة"
                  : t.gallery.heading)}
            </h2>
          )}

          {vis.galleryDesc !== false && (
            <p className="text-xs sm:text-sm text-[#485c36]/80 leading-relaxed">
              {custom.galleryDescText ||
                (isArabic
                  ? "تركيبات صيدلانية نقية مصممة بهدوء ورفق لتحويل ملمس البشرة الخشن إلى حرير لا يُهزم."
                  : t.gallery.desc)}
            </p>
          )}
        </div>

        {/* 2. THE ANDALUSIAN ARCH PRODUCT GALLERY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.map((prod, idx) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
            >
              <ProductCard
                product={prod}
                displayMode="podium"
                onQuickView={setSelectedQuickView}
              />
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        {vis.galleryViewAll !== false && (
          <div className="text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#485c36] hover:bg-[#610b0d] text-[#f6f9e6] text-xs font-bold transition-colors shadow-sm"
            >
              <span>{custom.galleryViewAllText || t.gallery.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5 text-[#f3a5a1]" />
            </Link>
          </div>
        )}

        {/* 3. QUIET 3-ARCH CLINICAL PHILOSOPHY ALCOVES */}
        <div className="pt-8 border-t border-[#485c36]/15 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-t-[7rem] rounded-b-3xl bg-white/80 border border-[#485c36]/20 pt-10 pb-7 px-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#485c36] text-[#f6f9e6] flex items-center justify-center mx-auto">
              <Sparkles className="w-4 h-4 text-[#f3a5a1]" />
            </div>
            <h3 className="font-amiri text-xl font-bold text-[#610b0d]">
              {isArabic ? "30% يوريا علاجية نقية" : "30% Pure Clinical Urea"}
            </h3>
            <p className="text-xs text-[#485c36]/85 leading-relaxed">
              {isArabic
                ? "إذابة هادئة للتقرن وجلد الوزة والشعر المحتجز تحت الجلد دون أي احتكاك قاسٍ."
                : "Gentle dissolution of keratin plugs and rough bumps with zero abrasion."}
            </p>
          </div>

          <div className="rounded-t-[7rem] rounded-b-3xl bg-white/80 border border-[#485c36]/20 pt-10 pb-7 px-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#610b0d] text-[#f6f9e6] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-4 h-4 text-[#f3a5a1]" />
            </div>
            <h3 className="font-amiri text-xl font-bold text-[#610b0d]">
              {isArabic ? "10% لاكتات وسيراميدات" : "10% Lactate & Ceramides"}
            </h3>
            <p className="text-xs text-[#485c36]/85 leading-relaxed">
              {isArabic
                ? "ترميم عميق للحاجز الدهني لحبس الرطوبة داخل الخلايا ومنع عودة الجفاف."
                : "Deep structural lipid barrier repair locking moisture for lasting silkiness."}
            </p>
          </div>

          <div className="rounded-t-[7rem] rounded-b-3xl bg-white/80 border border-[#485c36]/20 pt-10 pb-7 px-6 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#ca384a] text-[#f6f9e6] flex items-center justify-center mx-auto">
              <PackageCheck className="w-4 h-4 text-[#f6f9e6]" />
            </div>
            <h3 className="font-amiri text-xl font-bold text-[#610b0d]">
              {isArabic ? "معاينة العبوة قبل السداد" : "Inspect Before Payment"}
            </h3>
            <p className="text-xs text-[#485c36]/85 leading-relaxed">
              {isArabic
                ? "حق فتح الطرد ومعاينة عبوتكِ الأصلية عند الاستلام قبل دفع قيمة الطلب."
                : "Verify your sealed clinical package upon delivery before completing payment."}
            </p>
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

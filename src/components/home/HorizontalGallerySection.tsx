"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ProductData } from "@/lib/data/mock-data";
import { useProducts } from "@/lib/products/product-store";
import { useCart } from "@/lib/cart/cart-context";
import { QuickViewModal } from "../shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ShoppingBag, Check, ArrowLeft, ArrowRight } from "lucide-react";

export function HorizontalGallerySection() {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);
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

  function handleAdd(e: React.MouseEvent, prod: ProductData) {
    e.preventDefault();
    e.stopPropagation();
    addItem(prod);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1600);
  }

  // IDEA #1: THE ROYAL PRESCRIPTION LEDGER (الروشتة الملكية)
  // Each product appears in a wide, serene independent space on the #f6f9e6 parchment,
  // separated only by a hairline border, showing formula number, floating bottle,
  // active prescription ratios, price, and one-click add.
  return (
    <section className="py-16 sm:py-24 bg-[#f6f9e6] text-[#485c36] relative font-cairo">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        
        {/* Quiet Section Heading */}
        <div className="pb-12 border-b border-[#485c36]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-start">
          <div className="space-y-2">
            {vis.galleryBadge !== false && (
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#610b0d] block">
                {custom.galleryBadgeText ||
                  (isArabic ? "سجل التركيبات السريرية" : "APOTHECARY FORMULARY")}
              </span>
            )}
            {vis.galleryHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-normal text-[#485c36]">
                {custom.galleryHeadingText ||
                  (isArabic
                    ? "المخطوطة العلاجية لمستحضرات سُـلاف"
                    : t.gallery.heading)}
              </h2>
            )}
          </div>

          {vis.galleryViewAll !== false && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#610b0d] hover:text-[#ca384a] transition-colors"
            >
              <span>{custom.galleryViewAllText || t.gallery.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Independent Spacious Prescription Rows */}
        <div className="divide-y divide-[#485c36]/15">
          {allProducts.map((prod, idx) => {
            const isAdded = addedId === prod.id;
            const prodName = isArabic ? prod.nameAr : prod.nameEn;
            const prodSub = isArabic ? prod.subtitleAr : prod.subtitleEn;
            const num = String(idx + 1).padStart(2, "0");

            const prescriptionLine =
              prod.activeIngredients && prod.activeIngredients.length > 0
                ? prod.activeIngredients
                    .map(
                      (ing) =>
                        `${ing.concentration} ${isArabic ? ing.nameAr : ing.nameEn}`
                    )
                    .join("  —  ")
                : isArabic
                ? "تركيبة سريرية متوازنة pH 5.2"
                : "Balanced Clinical Formula pH 5.2";

            return (
              <motion.article
                key={prod.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6 }}
                onClick={() => router.push(`/product/${prod.slug}`)}
                className="group py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center cursor-pointer text-start"
              >
                {/* Col 1: Prescription Number & Floating Bottle (4 Cols) */}
                <div className="md:col-span-4 flex items-center gap-6">
                  <span className="font-mono text-xs text-[#610b0d]/60 tracking-widest shrink-0">
                    /{num}
                  </span>

                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
                    <Image
                      src={prod.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                      alt={prodName}
                      width={165}
                      height={165}
                      className="object-contain drop-shadow-[0_16px_22px_rgba(72,92,54,0.14)] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Col 2: Royal Prescription Details & Active Ratios (5 Cols) */}
                <div className="md:col-span-5 space-y-3">
                  <span className="font-mono text-[11px] text-[#ca384a] font-bold tracking-wider block">
                    Rx • {prescriptionLine}
                  </span>

                  <h3 className="font-amiri text-2xl sm:text-3xl font-normal text-[#485c36] group-hover:text-[#610b0d] transition-colors">
                    {prodName}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#485c36]/75 leading-relaxed">
                    {prodSub}
                  </p>
                </div>

                {/* Col 3: Price & Single-Click Add Button (3 Cols) */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#485c36]/10">
                  <div className="text-start md:text-end">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#610b0d] block">
                      {prod.price} {currency}
                    </span>
                    <span className="font-mono text-[10px] text-[#485c36]/60 uppercase tracking-widest">
                      {prod.variants?.[0]?.volumeMl || 200} ML • {prod.sku}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, prod)}
                    className={`px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? "bg-[#610b0d] text-[#f3a5a1]"
                        : "bg-transparent hover:bg-[#485c36] text-[#485c36] hover:text-[#f6f9e6] border border-[#485c36]"
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
              </motion.article>
            );
          })}
        </div>

        {/* Quiet 3-Column Manuscript Footnote */}
        <div className="pt-12 border-t border-[#485c36]/20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-start">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#ca384a] tracking-widest uppercase">
              I. 30% UREA USP
            </span>
            <p className="text-xs text-[#485c36]/80 leading-relaxed">
              {isArabic
                ? "إذابة هادئة للتقرن وجلد الوزة بدون أي احتكاك أو مقشرات فيزيائية قاسية."
                : "Gentle keratolytic dissolution with zero abrasive friction."}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#ca384a] tracking-widest uppercase">
              II. CERAMIDES & LACTATE
            </span>
            <p className="text-xs text-[#485c36]/80 leading-relaxed">
              {isArabic
                ? "إعادة بناء الحاجز الدهني وحبس الرطوبة داخل الخلايا لنعومة حريرية تدوم."
                : "Deep lipid matrix replenishment locking cellular moisture."}
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#ca384a] tracking-widest uppercase">
              III. INSPECT ON DELIVERY
            </span>
            <p className="text-xs text-[#485c36]/80 leading-relaxed">
              {isArabic
                ? "معاينة العبوة بيدكِ عند الاستلام قبل السداد، مع شحن مؤمن لكافة المحافظات."
                : "Inspect your package upon delivery before completing payment."}
            </p>
          </div>
        </div>

      </div>

      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />
    </section>
  );
}

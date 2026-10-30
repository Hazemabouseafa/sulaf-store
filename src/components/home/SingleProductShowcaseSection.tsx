"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";

export function SingleProductShowcaseSection() {
  const { isArabic, t } = useLanguage();
  const { addItem } = useCart();
  const products = useProducts();
  const { settings } = useStoreSettings();
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find featured product by settings ID, isFeatured flag, or first product
  const heroProduct =
    (settings?.featuredProductId &&
      products.find(
        (p) =>
          p.id === settings.featuredProductId ||
          p.slug === settings.featuredProductId
      )) ||
    products.find((p) => (p as any).isFeatured === true) ||
    products.find(
      (p) =>
        p.slug === "absolutes-smoothing-body-cream" ||
        p.id === "prod-absolutes-cream" ||
        p.nameAr?.includes("Absolutes")
    ) ||
    products[0] ||
    null;

  // Sync active image index when heroProduct changes or primary image is set
  useEffect(() => {
    if (heroProduct?.images && heroProduct.images.length > 0) {
      const pIdx = heroProduct.images.findIndex((img) => img.isPrimary);
      setActiveImageIndex(pIdx >= 0 ? pIdx : 0);
    } else {
      setActiveImageIndex(0);
    }
  }, [heroProduct?.id, heroProduct?.images]);

  if (!heroProduct) return null;

  const currency = isArabic ? "ج.م" : "EGP";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const currentImgObj =
    heroProduct.images?.[activeImageIndex] ||
    heroProduct.images?.find((img) => img.isPrimary) ||
    heroProduct.images?.[0];

  const productImage =
    currentImgObj?.url ||
    (heroProduct as any)?.imageUrl ||
    "/brand/sulaf-flower-symbol.png";

  const handleQuickAdd = () => {
    addItem(heroProduct, heroProduct.variants?.[0], 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section
      data-live-section="singleProductShowcase"
      data-section-name="قسم استعراض المنتج الواحد"
      className="relative w-full py-16 sm:py-24 bg-[#f6f9e6] text-[#220809] overflow-hidden border-b border-[#610b0d]/10"
    >
      {/* Ambient Floating Luminous Glows matching Hero Section */}
      <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-[#610b0d]/15 via-[#f3a5a1]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#610b0d]/10 via-[#f3a5a1]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Diagonal Sunlit Architectural Shadow Rays across the Limestone Wall */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(128deg, rgba(232,226,209,0.75) 0%, rgba(244,241,230,0.15) 38%, rgba(244,241,230,0.9) 62%, rgba(226,220,202,0.7) 100%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* IMAGE SIDE (5 Cols on desktop): Just the clean product image on a frosted pedestal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex flex-col items-center justify-center"
          >
            <div className="relative w-64 sm:w-72 aspect-square rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-[#610b0d]/15 p-6 flex items-center justify-center shadow-[0_20px_50px_rgba(97,11,13,0.08)] group">
              <div className="relative w-44 sm:w-52 h-44 sm:h-52 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={productImage}
                  alt={heroProduct.nameAr || "Sulaf Product"}
                  fill
                  className="object-contain drop-shadow-[0_16px_30px_rgba(97,11,13,0.18)]"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* Thumbnail Navigation Row if Multiple Images */}
            {heroProduct.images && heroProduct.images.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-20">
                {heroProduct.images.map((img, idx) => {
                  const isSelected = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-11 h-11 rounded-xl p-1 bg-white border-2 transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-[#610b0d] shadow-sm scale-105"
                          : "border-[#610b0d]/20 hover:border-[#610b0d]/40 opacity-70 hover:opacity-100"
                      }`}
                      title={img.alt || heroProduct.nameAr}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || heroProduct.nameAr}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* SIMPLE TEXT SIDE (7 Cols on desktop): Elegant, simple copy beside it */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 space-y-4 text-start"
          >
            {/* Subtle Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#610b0d]/10 border border-[#610b0d]/20 text-[#610b0d] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#610b0d]" />
              <span>
                {heroProduct.badgeAr || (isArabic ? "مستحضر سُـلاف الأيقوني" : "Sulaf Flagship Formulation")}
              </span>
            </div>

            {/* Product Title */}
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#220809] tracking-tight ${
                isArabic ? "font-gulzar leading-snug" : "font-cinzel"
              }`}
            >
              {isArabic ? (heroProduct.nameAr || "Absolutes Smoothing Body Cream") : (heroProduct.nameEn || heroProduct.nameAr)}
            </h2>

            {/* Simple Subtitle */}
            {(heroProduct.subtitleAr || heroProduct.subtitleEn) && (
              <p className="text-xs sm:text-sm font-semibold text-[#610b0d] font-mono tracking-wide">
                {isArabic
                  ? (heroProduct.subtitleAr || heroProduct.subtitleEn)
                  : (heroProduct.subtitleEn || heroProduct.subtitleAr)}
              </p>
            )}

            {/* Dynamic Product Description from DB (كلام المستحضر المعدل) */}
            <p
              className={`text-sm sm:text-base text-[#220809]/80 leading-relaxed max-w-xl ${
                isArabic ? "font-cairo" : "font-glacial"
              }`}
            >
              {isArabic
                ? (heroProduct.descriptionAr || "تحفة صيدلانية سريرية مصممة لإنهاء مظهر جلد الوزة والخشونة المتصلبة، تمنح بشرتكِ نعومة الحرير الأندلسي الفاخر بلطفٍ سريري متقن دون أي تقشير كاشط.")
                : (heroProduct.descriptionEn || heroProduct.descriptionAr || "A clinical formulation crafted to end Keratosis Pilaris (Strawberry Skin) and structural roughness, restoring silk-like skin with pure pharmaceutical gentleness.")}
            </p>

            {/* Price & Action */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-[#220809]">
                  {heroProduct.price}
                </span>
                <span className="text-xs font-bold text-[#610b0d]">{currency}</span>
                {heroProduct.compareAtPrice > heroProduct.price && (
                  <span className="text-xs text-[#220809]/45 line-through ms-1 font-mono">
                    {heroProduct.compareAtPrice} {currency}
                  </span>
                )}
              </div>

              {/* Action Buttons: Simple & Clean in Royal Burgundy & Ivory Accents */}
              <div className="flex items-center gap-2.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuickAdd}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                    added
                      ? "bg-[#ca384a] text-white"
                      : "bg-[#610b0d] hover:bg-[#470708] text-[#f6f9e6] shadow-[#610b0d]/20 hover:shadow-[0_8px_20px_rgba(97,11,13,0.3)]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>{isArabic ? "تمت الإضافة ✓" : "Added ✓"}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#f3a5a1]" />
                      <span>{isArabic ? "أضيفي للحقيبة" : "Add to Bag"}</span>
                    </>
                  )}
                </motion.button>

                <Link
                  href={`/product/${heroProduct.slug || heroProduct.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#610b0d]/30 hover:border-[#610b0d] text-[#610b0d] hover:bg-[#610b0d]/5 text-xs font-bold transition-all"
                >
                  <span>{isArabic ? "استكشفي المستحضر" : "Explore Product"}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";

export function SingleProductShowcaseSection() {
  const { isArabic } = useLanguage();
  const { addItem } = useCart();
  const products = useProducts();
  const { settings } = useStoreSettings();
  const [added, setAdded] = useState(false);

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

  if (!heroProduct) return null;

  const currency = isArabic ? "ج.م" : "EGP";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const currentImgObj =
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
      className="relative w-full pt-16 sm:pt-24 pb-20 sm:pb-28 bg-[#610b0d] text-[#f6f9e6] overflow-hidden"
    >
      {/* Ambient Rich Burgundy Background Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#610b0d] via-[#52090b] to-[#420607] pointer-events-none" />

      {/* Floating Luminous Glows */}
      <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-gradient-to-br from-[#ca384a]/25 via-[#f3a5a1]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#ca384a]/20 via-[#f3a5a1]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle Andalusian Architectural Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(243,165,161,0.18) 0%, transparent 75%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          {/* IMAGE SIDE: Pure product image filling the area completely with NO pedestal or surrounding elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 flex items-center justify-center w-full"
          >
            <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/5] md:aspect-square flex items-center justify-center">
              <Image
                src={productImage}
                alt={heroProduct.nameAr || "Sulaf Product"}
                fill
                className="object-contain object-center drop-shadow-[0_20px_45px_rgba(0,0,0,0.55)]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
              />
            </div>
          </motion.div>

          {/* SIMPLE TEXT SIDE (6 Cols on desktop): High-contrast white and ivory copy on Royal Burgundy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-6 space-y-4 text-start"
          >
            {/* Subtle Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ca384a]/40 border border-[#f3a5a1]/30 text-[#f3e5ab] text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#f3a5a1]" />
              <span>
                {heroProduct.badgeAr || (isArabic ? "مستحضر سُـلاف الأيقوني" : "Sulaf Flagship Formulation")}
              </span>
            </div>

            {/* Product Title */}
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] ${
                isArabic ? "font-gulzar leading-snug" : "font-cinzel"
              }`}
            >
              {isArabic ? (heroProduct.nameAr || "Absolutes Smoothing Body Cream") : (heroProduct.nameEn || heroProduct.nameAr)}
            </h2>

            {/* Simple Subtitle */}
            {(heroProduct.subtitleAr || heroProduct.subtitleEn) && (
              <p className="text-xs sm:text-sm font-semibold text-[#f3a5a1] font-mono tracking-wide drop-shadow-sm">
                {isArabic
                  ? (heroProduct.subtitleAr || heroProduct.subtitleEn)
                  : (heroProduct.subtitleEn || heroProduct.subtitleAr)}
              </p>
            )}

            {/* Dynamic Product Description from DB */}
            <p
              className={`text-sm sm:text-base text-[#f6f9e6]/90 leading-relaxed max-w-xl ${
                isArabic ? "font-cairo" : "font-glacial"
              }`}
            >
              {isArabic
                ? (heroProduct.descriptionAr || "تحفة صيدلانية سريرية مصممة لإنهاء مظهر جلد الوزة والخشونة المتصلبة، تمنح بشرتكِ نعومة الحرير الأندلسي الفاخر بلطفٍ سريري متقن دون أي تقشير كاشط.")
                : (heroProduct.descriptionEn || heroProduct.descriptionAr || "A clinical formulation crafted to end Keratosis Pilaris (Strawberry Skin) and structural roughness, restoring silk-like skin with pure pharmaceutical gentleness.")}
            </p>

            {/* Price & Action */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white drop-shadow-sm">
                  {heroProduct.price}
                </span>
                <span className="text-xs font-bold text-[#f3a5a1]">{currency}</span>
                {heroProduct.compareAtPrice > heroProduct.price && (
                  <span className="text-xs text-white/50 line-through ms-1 font-mono">
                    {heroProduct.compareAtPrice} {currency}
                  </span>
                )}
              </div>

              {/* Action Buttons: Clean & Elegant */}
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuickAdd}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                    added
                      ? "bg-[#2563eb] text-white"
                      : "bg-[#ca384a] hover:bg-[#a52838] text-white border border-[#f3a5a1]/35 shadow-[0_8px_20px_rgba(202,56,74,0.4)]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>{isArabic ? "تمت الإضافة ✓" : "Added ✓"}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#f3e5ab]" />
                      <span>{isArabic ? "أضيفي للحقيبة" : "Add to Bag"}</span>
                    </>
                  )}
                </motion.button>

                <Link
                  href={`/product/${heroProduct.slug || heroProduct.id}`}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-white/30 hover:border-white/60 text-white hover:bg-white/10 backdrop-blur-sm text-xs font-bold transition-all"
                >
                  <span>{isArabic ? "استكشفي المستحضر" : "Explore Product"}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </motion.div>

        </div>
      </div>

      {/* Bottom Wavy Curve Divider (التعريجة السفلية) into Cream Gallery Section */}
      <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none pointer-events-none z-20">
        <svg
          viewBox="0 0 1440 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-12"
          preserveAspectRatio="none"
        >
          <path
            d="M0 68 L380 68 C480 68, 520 10, 640 10 L1440 10 L1440 70 L0 70 Z"
            fill="#f4f1e6"
          />
        </svg>
      </div>
    </section>
  );
}

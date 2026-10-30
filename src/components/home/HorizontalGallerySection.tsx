"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProductData } from "@/lib/data/mock-data";
import { useProducts } from "@/lib/products/product-store";
import { useCart } from "@/lib/cart/cart-context";
import { QuickViewModal } from "../shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { SulafRosette, FourPointStar } from "./HeroSection";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  FlaskConical,
  Heart,
  Droplet,
  Sparkles,
  Check,
} from "lucide-react";

export function HorizontalGallerySection() {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);
  const [selectedBestSellerIdx, setSelectedBestSellerIdx] = useState<number>(0);
  const [addedBestSeller, setAddedBestSeller] = useState(false);

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

  // The 5 Arched Showcase Cards matching Section 3 of the reference image
  const fiveArches = [
    {
      num: "01",
      titleAr: custom.arch1Title || "بلسم التنظيف",
      titleEn: custom.arch1Title || "Cleansers",
      subAr: custom.arch1Sub || "تنقية وإذابة الشوائب",
      subEn: custom.arch1Sub || "Purify & refresh",
      href: `/product/${allProducts[2]?.slug || "sulaf-melt-cleansing-balm"}`,
      productIndex: 2,
      accentType: "sand" as const,
    },
    {
      num: "02",
      titleAr: custom.arch2Title || "إكسير الحاجز",
      titleEn: custom.arch2Title || "Serums",
      subAr: custom.arch2Sub || "ترميم مركز بالسيراميد",
      subEn: custom.arch2Sub || "Targeted solutions",
      href: `/product/${allProducts[1]?.slug || "sulaf-barrier-restoration-elixir"}`,
      productIndex: 1,
      accentType: "plain" as const,
    },
    {
      num: "03",
      titleAr: custom.arch3Title || "كريمات اليوريا 30%",
      titleEn: custom.arch3Title || "Moisturizers",
      subAr: custom.arch3Sub || "علاج جلد الوزة والخشونة",
      subEn: custom.arch3Sub || "Nourish & restore",
      href: `/product/${allProducts[0]?.slug || "absolutes-smoothing-body-cream"}`,
      productIndex: 0,
      accentType: "darkCrescent" as const,
    },
    {
      num: "04",
      titleAr: custom.arch4Title || "العلاجات المركزة",
      titleEn: custom.arch4Title || "Treatments",
      subAr: custom.arch4Sub || "عناية سريرية متطورة",
      subEn: custom.arch4Sub || "Advanced care",
      href: `/product/${allProducts[0]?.slug || "absolutes-smoothing-body-cream"}`,
      productIndex: 0,
      accentType: "roseBorder" as const,
    },
    {
      num: "05",
      titleAr: custom.arch5Title || "تونر الأحماض",
      titleEn: custom.arch5Title || "Toners",
      subAr: custom.arch5Sub || "توازن وتجديد المسام",
      subEn: custom.arch5Sub || "Balance & prepare",
      href: `/product/${allProducts[3]?.slug || "sulaf-andalusian-aha-clarifying-toner"}`,
      productIndex: 3,
      accentType: "cornerNode" as const,
    },
  ];

  const featuredProduct = allProducts[selectedBestSellerIdx] || allProducts[0];

  function handleBestSellerAdd() {
    if (!featuredProduct) return;
    addItem(featuredProduct);
    setAddedBestSeller(true);
    setTimeout(() => setAddedBestSeller(false), 1800);
  }

  return (
    <div className="w-full font-cairo">
      {/* ===================================================================== */}
      {/* SECTION 3: "THE SCIENCE OF ANDALUSIAN BEAUTY" — 5 ARCHED CARDS        */}
      {/* ===================================================================== */}
      <section className="relative bg-[#f4f1e6] text-[#18271b] py-20 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-14">
          
          {/* Top Split Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
          >
            <div className="lg:col-span-6 space-y-2 text-start">
              {vis.galleryBadge !== false && custom.galleryBadgeText && (
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#610b0d] font-bold block">
                  {custom.galleryBadgeText}
                </span>
              )}

              {vis.galleryHeading !== false && (
                <h2
                  className={`${
                    isArabic
                      ? "font-amiri text-3xl sm:text-5xl leading-snug"
                      : "font-cormorant text-4xl sm:text-5xl leading-[1.08]"
                  } font-normal text-[#18271b]`}
                >
                  {custom.galleryHeadingText || t.gallery.heading}
                </h2>
              )}
            </div>

            <div className="lg:col-span-6 lg:border-s border-[#610b0d]/25 lg:ps-10 space-y-3 text-start">
              {vis.galleryDesc !== false && (
                <p className="text-xs sm:text-sm text-[#220809]/80 leading-relaxed max-w-md">
                  {custom.galleryDescText || t.gallery.desc}
                </p>
              )}

              {vis.galleryViewAll !== false && (
                <div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#610b0d] hover:text-[#ca384a] border-b border-[#610b0d]/45 pb-1 transition-colors"
                  >
                    <span>{custom.galleryViewAllText || t.gallery.viewAll}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* 5 Sculptural Arches Row with Fluid Hover Lift & Staggered Reveal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-2">
            {fiveArches.map((arch, idx) => {
              const linkedProd = allProducts[arch.productIndex] || allProducts[0];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.65,
                    delay: idx * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  {/* Decorative Background Accents behind specific arches */}
                  {arch.accentType === "sand" && (
                    <div className="absolute -top-2 -right-1.5 inset-x-2 h-36 rounded-t-full border-t-4 border-r-4 border-[#cbb994]/60 pointer-events-none transition-transform duration-500 group-hover:scale-105" />
                  )}

                  {arch.accentType === "darkCrescent" && (
                    <>
                      <div className="absolute top-6 -left-2.5 w-16 h-40 rounded-l-full bg-[#220809] pointer-events-none transition-transform duration-500 group-hover:-translate-x-1" />
                      <div className="absolute -bottom-1 -right-2 w-12 h-44 bg-[#220809] rounded-br-xl pointer-events-none transition-transform duration-500 group-hover:translate-x-1" />
                      <div className="absolute -top-2 inset-x-3 h-28 rounded-t-full border border-[#610b0d]/30 rotate-6 pointer-events-none" />
                    </>
                  )}

                  {arch.accentType === "cornerNode" && (
                    <div className="hidden lg:block absolute -top-4 -right-3 w-12 h-full border-t border-r border-[#610b0d]/30 pointer-events-none">
                      <span className="w-3 h-3 rounded-full border border-[#610b0d]/50 bg-[#f6f9e6] absolute -top-1.5 -left-1.5" />
                    </div>
                  )}

                  {/* Main Arch Card */}
                  <div
                    onClick={() => router.push(arch.href)}
                    className={`relative z-10 rounded-t-full bg-[#f6f9e6] group-hover:bg-[#faf8f0] pt-9 pb-7 px-4 flex flex-col items-center text-center justify-between min-h-[255px] cursor-pointer silk-card shadow-[0_8px_24px_rgba(97,11,13,0.06)] ${
                      arch.accentType === "roseBorder"
                        ? "border border-[#ca384a]/45 hover:border-[#ca384a]"
                        : "border border-[#610b0d]/25 hover:border-[#610b0d]"
                    }`}
                  >
                    {/* Top Minimal Botanical / Geometric Symbol with gentle float */}
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 3.5,
                        delay: idx * 0.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className={`${
                        arch.accentType === "roseBorder"
                          ? "text-[#ca384a]/80"
                          : arch.accentType === "sand"
                          ? "text-[#b69b68]"
                          : "text-[#610b0d]/75"
                      }`}
                    >
                      {idx % 2 === 1 ? (
                        <Droplet className="w-5 h-5 stroke-[1.3]" />
                      ) : (
                        <Sparkles className="w-5 h-5 stroke-[1.3]" />
                      )}
                    </motion.div>

                    {/* Center Number + Serif Title + Subtitle */}
                    <div className="space-y-1.5 my-4">
                      <span className="font-mono text-[10px] text-[#610b0d]/70 block">
                        {arch.num}
                      </span>
                      <h3
                        className={`${
                          isArabic ? "font-amiri text-xl" : "font-cormorant text-xl"
                        } font-bold text-[#220809] group-hover:text-[#610b0d] transition-colors`}
                      >
                        {isArabic ? arch.titleAr : arch.titleEn}
                      </h3>
                      <p className="text-[11px] text-[#610b0d]/80">
                        {isArabic ? arch.subAr : arch.subEn}
                      </p>
                      {linkedProd && (
                        <span className="block font-mono text-[10px] font-bold text-[#610b0d] pt-0.5">
                          {linkedProd.price} {currency}
                        </span>
                      )}
                    </div>

                    {/* Bottom Circular Arrow Button */}
                    <div className="w-8 h-8 rounded-full border border-[#18271b]/30 group-hover:bg-[#18271b] group-hover:text-[#f6f9e6] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 4: DARK FOREST BEST-SELLER BAND WITH ANIMATED MANDALA         */}
      {/* ===================================================================== */}
      <section className="relative bg-[#18271b] text-[#f6f9e6] py-20 sm:py-24 overflow-hidden">
        {/* Atmospheric Soothing Light Aura */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#f3a5a1]/10 blur-[100px] animate-sulaf-aura pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#ca384a]/10 blur-[90px] animate-sulaf-aura pointer-events-none" />

        {/* Decorative Botanical Leaf Curves in Bottom Right Corner */}
        <svg
          viewBox="0 0 300 200"
          fill="none"
          className="absolute bottom-0 right-0 w-72 h-48 text-[#f6f9e6]/10 pointer-events-none"
        >
          <path
            d="M300 200 C220 190, 160 130, 190 40 C240 80, 280 140, 300 200 Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M240 200 C160 180, 110 140, 90 80 C150 100, 210 150, 240 200 Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Col 1: Giant Rotating Wireframe Rosette + Lit 3D Andalusian Archway Niche (4 Cols) */}
            <div className="lg:col-span-4 relative flex items-center justify-center min-h-[300px]">
              {/* Large Champagne-Gold Wireframe Mandala rotating smoothly */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
                className={`text-[#c5b37a]/75 ${
                  isArabic ? "-ml-10" : "-mr-10"
                } relative z-10 pointer-events-none`}
              >
                <SulafRosette className="w-52 h-52 sm:w-60 sm:h-60" strokeWidth={0.9} />
              </motion.div>

              {/* Sunlit 3D Andalusian Archway Portal beside it */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-40 sm:w-44 h-64 sm:h-72 rounded-t-full overflow-hidden border border-[#f6f9e6]/20 shadow-2xl relative flex items-end justify-center bg-gradient-to-b from-[#dfd5c0] via-[#efeae0] to-[#cfc4ae]"
              >
                <div className="absolute inset-y-0 right-0 w-[44%] bg-gradient-to-b from-[#2f4431] to-[#1e2e20]" />
                <div className="w-24 h-48 rounded-t-full bg-gradient-to-b from-[#f5f0e6] to-[#e2d9c5] relative z-10 mr-4 shadow-inner flex items-end justify-start p-2">
                  <motion.div
                    animate={{ rotate: [40, 48, 40] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Leaf className="w-6 h-6 text-[#18271b]/80" />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Col 2: Best Seller Product Details & 3 Circular Ingredient Badges (5 Cols) */}
            <div className="lg:col-span-5 lg:border-x border-[#f6f9e6]/15 lg:px-10 space-y-5 text-start">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#f3a5a1] font-bold">
                  {custom.bestSellerBadgeText || (isArabic ? "الأكثر مبيعاً واعتماداً" : "BEST SELLER")}
                </span>

                {/* Switch between Sulaf's 4 clinical formulas */}
                <div className="flex items-center gap-1.5">
                  {allProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedBestSellerIdx(idx)}
                      className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        selectedBestSellerIdx === idx
                          ? "bg-[#f3a5a1] text-[#18271b] font-bold scale-105"
                          : "text-[#f6f9e6]/60 hover:text-[#f6f9e6] border border-[#f6f9e6]/20"
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={featuredProduct?.id || selectedBestSellerIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <h3
                    className={`${
                      isArabic
                        ? "font-amiri text-3xl sm:text-4xl leading-snug"
                        : "font-cormorant text-3xl sm:text-4xl leading-tight"
                    } font-normal text-[#f6f9e6]`}
                  >
                    {featuredProduct
                      ? isArabic
                        ? featuredProduct.nameAr
                        : featuredProduct.nameEn
                      : "Absolutes Smoothing Body Cream"}
                  </h3>

                  <p className="text-xs text-[#f6f9e6]/75 leading-relaxed">
                    {featuredProduct
                      ? isArabic
                        ? featuredProduct.subtitleAr
                        : featuredProduct.subtitleEn
                      : ""}
                  </p>

                  {/* 3 Circular Ingredient Badges */}
                  <div className="pt-1 flex flex-wrap items-center gap-4">
                    {(featuredProduct?.activeIngredients?.slice(0, 3) || []).map((ing) => (
                      <div key={ing.id} className="inline-flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full border border-[#f6f9e6]/30 flex items-center justify-center text-[#f3a5a1]">
                          <Droplet className="w-3.5 h-3.5 stroke-[1.4]" />
                        </span>
                        <span className="text-xs text-[#f6f9e6]/90">
                          {ing.concentration} {isArabic ? ing.nameAr : ing.nameEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Price + Add to Bag Pill Button */}
              <div className="pt-5 border-t border-[#f6f9e6]/15 flex items-center gap-6">
                <span className="font-mono text-xl font-bold text-[#f6f9e6]">
                  {featuredProduct?.price || 480} {currency}
                </span>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleBestSellerAdd}
                  className="px-6 py-2.5 rounded-full border border-[#f6f9e6]/40 hover:bg-[#ca384a] hover:border-[#ca384a] text-[#f6f9e6] text-xs font-bold inline-flex items-center gap-2.5 transition-all cursor-pointer"
                >
                  {addedBestSeller ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#f3a5a1]" />
                      <span>{t.product.addedToBag}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.product.addToBag}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Col 3: Number 01 + Poetic Quote + Star Stem (3 Cols) */}
            <div className="lg:col-span-3 space-y-4 text-start">
              <span className="font-cormorant text-3xl text-[#f6f9e6]/90 block">
                0{selectedBestSellerIdx + 1}
              </span>

              <p
                className={`${
                  isArabic
                    ? "font-amiri text-lg leading-relaxed"
                    : "font-cormorant text-lg leading-relaxed"
                } text-[#f6f9e6]/85 max-w-[220px]`}
              >
                {custom.bestSellerQuoteText ||
                  (isArabic
                    ? `${t.brand.poemLine1}.. ${t.brand.poemLine2}`
                    : `${t.brand.poemLine1} ${t.brand.poemLine2}`)}
              </p>

              <div className="flex items-center gap-2 text-[#c5b37a] pt-2">
                <FourPointStar className="w-3 h-3" />
                <div className="w-16 h-px bg-[#f4f1e6]/25" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5: "THE SULAF DIFFERENCE — MORE THAN SKINCARE" (LEFT + 4)     */}
      {/* ===================================================================== */}
      <section className="bg-[#f6f9e6] text-[#220809] py-16 sm:py-20 border-t border-[#610b0d]/15">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Start Heading Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-2 text-start">
              {custom.diffBadgeText && (
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#610b0d] font-bold block">
                  {custom.diffBadgeText}
                </span>
              )}
              <h2
                className={`${
                  isArabic
                    ? "font-amiri text-3xl sm:text-4xl leading-snug"
                    : "font-cormorant text-3xl sm:text-4xl leading-tight"
                } font-normal text-[#220809]`}
              >
                {custom.diffHeadingText ||
                  (isArabic ? (
                    <>{t.brand.tagline}</>
                  ) : (
                    <>
                      More Than Skincare.
                      <br />A Lasting Ritual.
                    </>
                  ))}
              </h2>
            </div>

            {/* Right/End 4 Icon Columns with Vertical Dividers (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-[#610b0d]/20 border-s border-[#610b0d]/20">
              
              <motion.div
                whileHover={{ y: -4 }}
                className="py-4 px-4 flex flex-col items-center text-center space-y-2"
              >
                <Leaf className="w-6 h-6 text-[#610b0d] stroke-[1.4]" />
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#220809]`}
                >
                  {custom.diff1Title || (isArabic ? t.hero.clinicalDose : "Premium Ingredients")}
                </h3>
                <p className="text-[11px] text-[#610b0d]/80 leading-relaxed">
                  {custom.diff1Desc || (isArabic ? t.hero.clinicalDoseDesc : "Naturally sourced, carefully selected.")}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="py-4 px-4 flex flex-col items-center text-center space-y-2"
              >
                <FlaskConical className="w-6 h-6 text-[#610b0d] stroke-[1.4]" />
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#220809]`}
                >
                  {custom.diff2Title || (isArabic ? t.hero.fastAbsorption : "Dermatologically Tested")}
                </h3>
                <p className="text-[11px] text-[#610b0d]/80 leading-relaxed">
                  {custom.diff2Desc || (isArabic ? t.hero.fastAbsorptionDesc : "Safe, effective, and skin-friendly.")}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="py-4 px-4 flex flex-col items-center text-center space-y-2"
              >
                <div className="text-[#610b0d]">
                  <SulafRosette className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#220809]`}
                >
                  {custom.diff3Title || (isArabic ? t.hero.barrierRepair : "Heritage Inspired")}
                </h3>
                <p className="text-[11px] text-[#610b0d]/80 leading-relaxed">
                  {custom.diff3Desc || (isArabic ? t.hero.barrierRepairDesc : "Centuries of wisdom, modernized.")}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="py-4 px-4 flex flex-col items-center text-center space-y-2"
              >
                <Heart className="w-6 h-6 text-[#610b0d] stroke-[1.4]" />
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#220809]`}
                >
                  {custom.diff4Title || (isArabic ? "معاينة العبوة قبل الدفع" : "Real Results")}
                </h3>
                <p className="text-[11px] text-[#610b0d]/80 leading-relaxed">
                  {custom.diff4Desc ||
                    (isArabic
                      ? "شحن فوري مؤمن لجميع المحافظات مع حق المعاينة."
                      : "Healthier skin, lasting confidence.")}
                </p>
              </motion.div>

            </div>

          </div>
        </div>
      </section>

      <QuickViewModal
        product={selectedQuickView}
        onClose={() => setSelectedQuickView(null)}
      />
    </div>
  );
}

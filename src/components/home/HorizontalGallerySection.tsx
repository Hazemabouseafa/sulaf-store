"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
      titleAr: "بلسم التنظيف",
      titleEn: "Cleansers",
      subAr: "تنقية وإذابة الشوائب",
      subEn: "Purify & refresh",
      href: `/product/${allProducts[2]?.slug || "sulaf-melt-cleansing-balm"}`,
      productIndex: 2,
      accentType: "sand" as const,
    },
    {
      num: "02",
      titleAr: "إكسير الحاجز",
      titleEn: "Serums",
      subAr: "ترميم مركز بالسيراميد",
      subEn: "Targeted solutions",
      href: `/product/${allProducts[1]?.slug || "sulaf-barrier-restoration-elixir"}`,
      productIndex: 1,
      accentType: "plain" as const,
    },
    {
      num: "03",
      titleAr: "كريمات اليوريا 30%",
      titleEn: "Moisturizers",
      subAr: "علاج جلد الوزة والخشونة",
      subEn: "Nourish & restore",
      href: `/product/${allProducts[0]?.slug || "absolutes-smoothing-body-cream"}`,
      productIndex: 0,
      accentType: "darkCrescent" as const,
    },
    {
      num: "04",
      titleAr: "العلاجات المركزة",
      titleEn: "Treatments",
      subAr: "عناية سريرية متطورة",
      subEn: "Advanced care",
      href: `/product/${allProducts[0]?.slug || "absolutes-smoothing-body-cream"}`,
      productIndex: 0,
      accentType: "roseBorder" as const,
    },
    {
      num: "05",
      titleAr: "تونر الأحماض",
      titleEn: "Toners",
      subAr: "توازن وتجديد المسام",
      subEn: "Balance & prepare",
      href: `/product/${allProducts[3]?.slug || "sulaf-andalusian-aha-clarifying-toner"}`,
      productIndex: 3,
      accentType: "cornerNode" as const,
    },
  ];

  const featuredProduct = allProducts[selectedBestSellerIdx] || allProducts[1] || allProducts[0];

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-6 space-y-2 text-start">
              {vis.galleryBadge !== false && (
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#610b0d] font-bold block">
                  {custom.galleryBadgeText ||
                    (isArabic ? "المجموعة السريرية المختارة" : "FEATURED COLLECTION")}
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
                  {custom.galleryHeadingText ||
                    (isArabic ? (
                      <>
                        علم الجمال الأندلسي
                        <br />
                        والترميم الصيدلاني
                      </>
                    ) : (
                      <>
                        The Science of
                        <br />
                        Andalusian Beauty
                      </>
                    ))}
                </h2>
              )}
            </div>

            <div className="lg:col-span-6 lg:border-s border-[#485c36]/25 lg:ps-10 space-y-3 text-start">
              {vis.galleryDesc !== false && (
                <p className="text-xs sm:text-sm text-[#18271b]/80 leading-relaxed max-w-md">
                  {custom.galleryDescText ||
                    (isArabic
                      ? "تركيبات علاجية متطورة مستلهمة من خلاصات التراث الأندلسي، ومصاغة بدقة العلم الصيدلاني الحديث لعلاج الخشونة وجلد الوزة."
                      : "Advanced formulations inspired by Andalusian botanicals, combined with modern dermatological science.")}
                </p>
              )}

              {vis.galleryViewAll !== false && (
                <div>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#18271b] hover:text-[#610b0d] border-b border-[#18271b]/45 pb-1 transition-colors"
                  >
                    <span>
                      {custom.galleryViewAllText ||
                        (isArabic ? "عرض جميع المستحضرات" : "View All Products")}
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 5 Sculptural Arches Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 pt-2">
            {fiveArches.map((arch, idx) => {
              const linkedProd = allProducts[arch.productIndex] || allProducts[0];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  className="relative group"
                >
                  {/* Decorative Background Accents behind specific arches matching reference */}
                  {arch.accentType === "sand" && (
                    <div className="absolute -top-2 -right-1.5 inset-x-2 h-36 rounded-t-full border-t-4 border-r-4 border-[#cbb994]/60 pointer-events-none" />
                  )}

                  {arch.accentType === "darkCrescent" && (
                    <>
                      <div className="absolute top-6 -left-2.5 w-16 h-40 rounded-l-full bg-[#18271b] pointer-events-none" />
                      <div className="absolute -bottom-1 -right-2 w-12 h-44 bg-[#18271b] rounded-br-xl pointer-events-none" />
                      <div className="absolute -top-2 inset-x-3 h-28 rounded-t-full border border-[#485c36]/30 rotate-6 pointer-events-none" />
                    </>
                  )}

                  {arch.accentType === "cornerNode" && (
                    <div className="hidden lg:block absolute -top-4 -right-3 w-12 h-full border-t border-r border-[#485c36]/30 pointer-events-none">
                      <span className="w-3 h-3 rounded-full border border-[#485c36]/50 bg-[#f4f1e6] absolute -top-1.5 -left-1.5" />
                    </div>
                  )}

                  {/* Main Arch Card */}
                  <div
                    onClick={() => router.push(arch.href)}
                    className={`relative z-10 rounded-t-full bg-[#f4f1e6] pt-9 pb-7 px-4 flex flex-col items-center text-center justify-between min-h-[255px] cursor-pointer transition-all ${
                      arch.accentType === "roseBorder"
                        ? "border border-[#ca384a]/45 hover:border-[#ca384a]"
                        : "border border-[#485c36]/25 hover:border-[#18271b]"
                    }`}
                  >
                    {/* Top Minimal Botanical / Geometric Symbol */}
                    <div
                      className={`${
                        arch.accentType === "roseBorder"
                          ? "text-[#ca384a]/80"
                          : arch.accentType === "sand"
                          ? "text-[#b69b68]"
                          : "text-[#485c36]/75"
                      }`}
                    >
                      {idx % 2 === 1 ? (
                        <Droplet className="w-5 h-5 stroke-[1.3]" />
                      ) : (
                        <Sparkles className="w-5 h-5 stroke-[1.3]" />
                      )}
                    </div>

                    {/* Center Number + Serif Title + Subtitle */}
                    <div className="space-y-1.5 my-4">
                      <span className="font-mono text-[10px] text-[#485c36]/70 block">
                        {arch.num}
                      </span>
                      <h3
                        className={`${
                          isArabic ? "font-amiri text-xl" : "font-cormorant text-xl"
                        } font-bold text-[#18271b] group-hover:text-[#610b0d] transition-colors`}
                      >
                        {isArabic ? arch.titleAr : arch.titleEn}
                      </h3>
                      <p className="text-[11px] text-[#485c36]/80">
                        {isArabic ? arch.subAr : arch.subEn}
                      </p>
                      {linkedProd && (
                        <span className="block font-mono text-[10px] font-bold text-[#610b0d] pt-0.5">
                          {linkedProd.price} {currency}
                        </span>
                      )}
                    </div>

                    {/* Bottom Circular Arrow Button */}
                    <div className="w-8 h-8 rounded-full border border-[#18271b]/30 group-hover:bg-[#18271b] group-hover:text-[#f6f9e6] flex items-center justify-center transition-colors">
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
      {/* SECTION 4: DARK FOREST BEST-SELLER BAND WITH MANDALA & ARCH PORTAL    */}
      {/* ===================================================================== */}
      <section className="relative bg-[#18271b] text-[#f6f9e6] py-20 sm:py-24 overflow-hidden">
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
            
            {/* Col 1: Giant Wireframe Rosette + Lit 3D Andalusian Archway Niche (4 Cols) */}
            <div className="lg:col-span-4 relative flex items-center justify-center min-h-[300px]">
              {/* Large Champagne-Gold Wireframe Mandala on the Left */}
              <div
                className={`text-[#c5b37a]/75 ${
                  isArabic ? "-ml-10" : "-mr-10"
                } relative z-10 pointer-events-none`}
              >
                <SulafRosette className="w-52 h-52 sm:w-60 sm:h-60" strokeWidth={0.9} />
              </div>

              {/* Sunlit 3D Andalusian Archway Portal beside it */}
              <div className="w-40 sm:w-44 h-64 sm:h-72 rounded-t-full overflow-hidden border border-[#f6f9e6]/20 shadow-2xl relative flex items-end justify-center bg-gradient-to-b from-[#dfd5c0] via-[#efeae0] to-[#cfc4ae]">
                {/* Inner Olive Shadow Archway Depth */}
                <div className="absolute inset-y-0 right-0 w-[44%] bg-gradient-to-b from-[#2f4431] to-[#1e2e20]" />
                {/* Inner Illuminated Archway Opening */}
                <div className="w-24 h-48 rounded-t-full bg-gradient-to-b from-[#f5f0e6] to-[#e2d9c5] relative z-10 mr-4 shadow-inner flex items-end justify-start p-2">
                  {/* Small Olive Branch Silhouette */}
                  <Leaf className="w-6 h-6 text-[#18271b]/80 rotate-45" />
                </div>
              </div>
            </div>

            {/* Col 2: Best Seller Product Details & 3 Circular Ingredient Badges (5 Cols) */}
            <div className="lg:col-span-5 lg:border-x border-[#f6f9e6]/15 lg:px-10 space-y-5 text-start">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#f3a5a1] font-bold">
                  {isArabic ? "الأكثر مبيعاً واعتماداً" : "BEST SELLER"}
                </span>

                {/* Switch between Sulaf's 4 clinical formulas */}
                <div className="flex items-center gap-1.5">
                  {allProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedBestSellerIdx(idx)}
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        selectedBestSellerIdx === idx
                          ? "bg-[#f3a5a1] text-[#18271b] font-bold"
                          : "text-[#f6f9e6]/60 hover:text-[#f6f9e6] border border-[#f6f9e6]/20"
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

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
                  : "Sulaf Barrier Restoration Elixir"}
              </h3>

              <p className="text-xs text-[#f6f9e6]/70 tracking-wider">
                {isArabic
                  ? "ترميم الحاجز  ·  تنعيم فائق  ·  توازن فسيولوجي"
                  : "Repair  ·  Strengthen  ·  Balance"}
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

              {/* Price + Add to Bag Pill Button */}
              <div className="pt-5 border-t border-[#f6f9e6]/15 flex items-center gap-6">
                <span className="font-mono text-xl font-bold text-[#f6f9e6]">
                  {featuredProduct?.price || 490} {currency}
                </span>

                <button
                  type="button"
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
                      <span>{isArabic ? "أضيفي إلى الحقيبة" : "Add to Bag"}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
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
                } text-[#f6f9e6]/85 max-w-[210px]`}
              >
                {isArabic
                  ? "لأن البشرة السليمة المتوازنة هي الأساس الحقيقي لكل جمال لا ينهزم."
                  : "Because healthy skin is the foundation of lasting beauty."}
              </p>

              <div className="flex items-center gap-2 text-[#c5b37a] pt-2">
                <FourPointStar className="w-3 h-3" />
                <div className="w-16 h-px bg-[#f6f9e6]/25" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5: "THE SULAF DIFFERENCE — MORE THAN SKINCARE" (LEFT + 4)     */}
      {/* ===================================================================== */}
      <section className="bg-[#f4f1e6] text-[#18271b] py-16 sm:py-20 border-t border-[#485c36]/15">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Start Heading Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-2 text-start">
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#610b0d] font-bold block">
                {isArabic ? "ميثاق الثقة في سُـلاف" : "THE SULAF DIFFERENCE"}
              </span>
              <h2
                className={`${
                  isArabic
                    ? "font-amiri text-3xl sm:text-4xl leading-snug"
                    : "font-cormorant text-3xl sm:text-4xl leading-tight"
                } font-normal text-[#18271b]`}
              >
                {isArabic ? (
                  <>
                    أكثر من مجرد عناية.
                    <br />
                    طقس سريري يدوم أثره.
                  </>
                ) : (
                  <>
                    More Than Skincare.
                    <br />A Lasting Ritual.
                  </>
                )}
              </h2>
            </div>

            {/* Right/End 4 Icon Columns with Vertical Dividers (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-[#485c36]/20 border-s border-[#485c36]/20">
              
              <div className="py-4 px-4 flex flex-col items-center text-center space-y-2">
                <Leaf className="w-6 h-6 text-[#18271b] stroke-[1.4]" />
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#18271b]`}
                >
                  {isArabic ? "مكونات علاجية نقية" : "Premium Ingredients"}
                </h3>
                <p className="text-[11px] text-[#485c36]/80 leading-relaxed">
                  {isArabic
                    ? "30% يوريا نقية و10% لاكتات مختارة بعناية."
                    : "Naturally sourced, carefully selected."}
                </p>
              </div>

              <div className="py-4 px-4 flex flex-col items-center text-center space-y-2">
                <FlaskConical className="w-6 h-6 text-[#18271b] stroke-[1.4]" />
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#18271b]`}
                >
                  {isArabic ? "مختبر سريرياً وآمِن" : "Dermatologically Tested"}
                </h3>
                <p className="text-[11px] text-[#485c36]/80 leading-relaxed">
                  {isArabic
                    ? "توازن فسيولوجي pH 5.2 لطيف على البشرة."
                    : "Safe, effective, and skin-friendly."}
                </p>
              </div>

              <div className="py-4 px-4 flex flex-col items-center text-center space-y-2">
                <div className="text-[#18271b]">
                  <SulafRosette className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#18271b]`}
                >
                  {isArabic ? "إلهام أندلسي أصيل" : "Heritage Inspired"}
                </h3>
                <p className="text-[11px] text-[#485c36]/80 leading-relaxed">
                  {isArabic
                    ? "قرون من الحكمة الأندلسية بصياغة حديثة."
                    : "Centuries of wisdom, modernized."}
                </p>
              </div>

              <div className="py-4 px-4 flex flex-col items-center text-center space-y-2">
                <Heart className="w-6 h-6 text-[#18271b] stroke-[1.4]" />
                <h3
                  className={`${
                    isArabic ? "font-amiri text-lg" : "font-cormorant text-base"
                  } font-bold text-[#18271b]`}
                >
                  {isArabic ? "نتائج حقيقية ومعاينة" : "Real Results"}
                </h3>
                <p className="text-[11px] text-[#485c36]/80 leading-relaxed">
                  {isArabic
                    ? "ملمس حريري موثق ومعاينة قبل الاستلام."
                    : "Healthier skin, lasting confidence."}
                </p>
              </div>

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

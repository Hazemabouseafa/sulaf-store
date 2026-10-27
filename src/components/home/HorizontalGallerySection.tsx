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
  Check,
  ShoppingBag,
} from "lucide-react";

export function HorizontalGallerySection() {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedQuickView, setSelectedQuickView] = useState<ProductData | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeDot, setActiveDot] = useState<number>(0);

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

  const categoryLabelsAr = ["كريمات الترميم", "إكسير الحاجز", "بلسم التنظيف", "تونر الأحماض"];
  const categoryLabelsEn = ["MOISTURIZERS", "SERUMS", "CLEANSERS", "TONERS"];

  const benefitTripletsAr = [
    "30% يوريا · 10% لاكتات · تنعيم",
    "سيراميد · ترميم · توازن",
    "إذابة · تنقية · نعومة",
    "تقشير لطيف · نضارة · تجديد",
  ];
  const benefitTripletsEn = [
    "Nourish · Restore · Replenish",
    "Repair · Strengthen · Balance",
    "Dissolve · Purify · Soften",
    "Clarify · Refine · Renew",
  ];

  function handleAdd(e: React.MouseEvent, prod: ProductData) {
    e.preventDefault();
    e.stopPropagation();
    addItem(prod);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1600);
  }

  return (
    <div className="w-full font-cairo">
      {/* ===================================================================== */}
      {/* SECTION 3: "TARGETED FORMULAS. VISIBLE RESULTS." (01, 02, 03, 04)     */}
      {/* ===================================================================== */}
      <section className="relative bg-[#f6f9e6] text-[#22301e] py-20 sm:py-24 overflow-hidden">
        {/* Far Left/Start Decorative Vertical Line with 4-Pointed Star (✦) */}
        <div
          className={`hidden xl:flex flex-col items-center absolute inset-y-0 ${
            isArabic ? "right-10" : "left-10"
          } pointer-events-none`}
        >
          <div className="w-px flex-1 bg-[#485c36]/20" />
          <FourPointStar className="w-4 h-4 text-[#22301e] my-2" />
          <div className="w-px flex-1 bg-[#485c36]/20" />
        </div>

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left/Start Editorial Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-4 text-start">
              {vis.galleryBadge !== false && (
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#610b0d] font-bold block">
                  {custom.galleryBadgeText ||
                    (isArabic ? "طقوس سُـلاف السريرية" : "THE SULAF RITUAL")}
                </span>
              )}

              {vis.galleryHeading !== false && (
                <h2
                  className={`${
                    isArabic
                      ? "font-amiri text-3xl sm:text-4xl leading-snug"
                      : "font-cormorant text-3xl sm:text-4xl leading-tight"
                  } font-normal text-[#1e2b18]`}
                >
                  {custom.galleryHeadingText ||
                    (isArabic ? (
                      <>
                        تركيبات علاجية مركزة.
                        <br />
                        نتائج سريرية ملموسة.
                      </>
                    ) : (
                      <>
                        Targeted Formulas.
                        <br />
                        Visible Results.
                      </>
                    ))}
                </h2>
              )}

              {vis.galleryDesc !== false && (
                <p className="text-xs sm:text-sm text-[#485c36]/85 leading-relaxed max-w-xs">
                  {custom.galleryDescText ||
                    (isArabic
                      ? "كل مستحضر هو ثمرة بحث صيدلاني دقيق، وتراكيز فعالة نقية تحترم التوازن الفسيولوجي الطبيعي لبشرتكِ."
                      : "Each product is a result of careful research, premium ingredients, and a deep respect for your skin's natural balance.")}
                </p>
              )}

              {vis.galleryViewAll !== false && (
                <div className="pt-3">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#1e2b18] hover:text-[#610b0d] border-b border-[#1e2b18]/40 pb-1 transition-colors"
                  >
                    <span>
                      {custom.galleryViewAllText ||
                        (isArabic ? "تصفحي جميع المستحضرات" : "Shop All Products")}
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right/End 4 Numbered Cards (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allProducts.slice(0, 4).map((prod, idx) => {
                  const num = String(idx + 1).padStart(2, "0");
                  const isAdded = addedId === prod.id;
                  const prodName = isArabic ? prod.nameAr : prod.nameEn;
                  const catLabel = isArabic
                    ? categoryLabelsAr[idx % categoryLabelsAr.length]
                    : categoryLabelsEn[idx % categoryLabelsEn.length];
                  const triplet = isArabic
                    ? benefitTripletsAr[idx % benefitTripletsAr.length]
                    : benefitTripletsEn[idx % benefitTripletsEn.length];

                  return (
                    <motion.article
                      key={prod.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.08 }}
                      onClick={() => {
                        setActiveDot(idx);
                        router.push(`/product/${prod.slug}`);
                      }}
                      className="group rounded-xl bg-[#f9fbf0] border border-[#485c36]/15 hover:border-[#610b0d]/50 p-5 flex flex-col justify-between min-h-[255px] shadow-[0_6px_22px_rgba(34,48,30,0.05)] hover:shadow-[0_12px_30px_rgba(34,48,30,0.1)] transition-all cursor-pointer text-start"
                    >
                      {/* Top: Number + Crimson Vertical Stem */}
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-[#22301e] font-bold pl-1.5 border-s-2 border-[#610b0d]">
                            {num}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#610b0d]">
                            {prod.price} {currency}
                          </span>
                        </div>
                        <div className="w-px h-6 bg-[#ca384a]/60 my-3 ms-0.5" />
                      </div>

                      {/* Middle: Category, Serif Title, 3-Word Dot Summary */}
                      <div className="space-y-1.5 my-2">
                        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#485c36]/75 block">
                          {catLabel}
                        </span>

                        <h3
                          className={`${
                            isArabic
                              ? "font-amiri text-xl leading-snug"
                              : "font-cormorant text-lg leading-snug"
                          } font-bold text-[#1e2b18] group-hover:text-[#610b0d] transition-colors line-clamp-2 min-h-[2.75rem]`}
                        >
                          {prodName}
                        </h3>

                        <p className="text-[10px] text-[#485c36]/75 pt-1">
                          {triplet}
                        </p>
                      </div>

                      {/* Bottom: Shop Now + Quick Add Icon */}
                      <div className="pt-4 mt-2 border-t border-[#485c36]/10 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1e2b18] group-hover:text-[#610b0d] transition-colors">
                          <span>{isArabic ? "اطلبي الآن" : "Shop Now"}</span>
                          <ArrowIcon className="w-3 h-3" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleAdd(e, prod)}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            isAdded
                              ? "bg-[#610b0d] text-[#f3a5a1]"
                              : "bg-[#485c36]/10 hover:bg-[#485c36] text-[#485c36] hover:text-[#f6f9e6]"
                          }`}
                          title={t.product.addToBag}
                          aria-label={t.product.addToBag}
                        >
                          {isAdded ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <ShoppingBag className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Pagination Dots & Arrows matching reference image */}
              <div className="flex items-center justify-center gap-3 pt-2 text-[#485c36]">
                <button
                  type="button"
                  onClick={() =>
                    setActiveDot((prev) => (prev - 1 + allProducts.length) % allProducts.length)
                  }
                  className="p-1 hover:text-[#610b0d] transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  {isArabic ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-2">
                  {allProducts.slice(0, 4).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveDot(i)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        activeDot === i
                          ? "bg-[#22301e] scale-110"
                          : "border border-[#485c36]/50 bg-transparent"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDot((prev) => (prev + 1) % allProducts.length)}
                  className="p-1 hover:text-[#610b0d] transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  {isArabic ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 4: DARK OLIVE WAVY PHILOSOPHY BAND ("Beauty is a Form...")    */}
      {/* ===================================================================== */}
      <section className="relative bg-[#354627] text-[#f6f9e6] pt-20 pb-28 sm:pt-24 sm:pb-36 overflow-hidden">
        {/* Subtle organic botanical veining overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(246,249,230,0.18) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(97,11,13,0.35) 0%, transparent 50%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Col 1: OUR PHILOSOPHY Heading (4 Cols) */}
            <div className="lg:col-span-4 space-y-3 text-start">
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#f3a5a1] block">
                {isArabic ? "فلسفة سُـلاف السريرية" : "OUR PHILOSOPHY"}
              </span>
              <h2
                className={`${
                  isArabic
                    ? "font-amiri text-3xl sm:text-4xl leading-snug"
                    : "font-cormorant text-3xl sm:text-4xl leading-tight"
                } font-normal text-[#f6f9e6]`}
              >
                {isArabic ? (
                  <>
                    الجمال الحقيقي هو
                    <br />
                    قمة التوازن والرفق.
                  </>
                ) : (
                  <>
                    Beauty is a
                    <br />
                    Form of Balance.
                  </>
                )}
              </h2>
              <div className="w-24 h-px bg-[#f6f9e6]/25 pt-2" />
            </div>

            {/* Col 2: Philosophy Paragraph with Left/Right Hairline Borders (5 Cols) */}
            <div className="lg:col-span-5 lg:border-x border-[#f6f9e6]/20 lg:px-10 space-y-5 text-start">
              <p className="text-xs sm:text-sm text-[#f6f9e6]/85 leading-relaxed">
                {isArabic
                  ? "في سُـلاف، نؤمن أن الجمال الدائم ينبع من التوازن الدقيق بين رفق التراث الأندلسي وصرامة العلم الصيدلاني الحديث. صُممت تركيباتنا بتركيز 30% يوريا نقية وسيراميدات حيوية لتداوي خشونة البشرة وجلد الوزة بهدوء تام، دون أي احتكاك أو خدوش مجهرية."
                  : "At Sulaf, we believe true beauty comes from balance — between nature and science, tradition and innovation, care and results. Our formulas are inspired by the timeless wisdom of Andalusia and created with the precision of modern skincare."}
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#f6f9e6] hover:text-[#f3a5a1] border-b border-[#f6f9e6]/40 pb-1 transition-colors"
              >
                <span>{isArabic ? "اكتشفي كافة المستحضرات" : "Discover All Products"}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Col 3: Centered White Sulaf Rosette + Stacked Heritage Text (3 Cols) */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-[#f6f9e6]">
                <SulafRosette className="w-16 h-16" strokeWidth={1.6} />
              </div>
              <div className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#f6f9e6]/85 space-y-1 leading-relaxed">
                <span className="block">{isArabic ? "تـراث أنـدلـسـي أصـيـل" : "ANDALUSIAN"}</span>
                <span className="block text-[#f3a5a1]">{isArabic ? "رفـق بـالـبـشـرة" : "HERITAGE"}</span>
                <span className="block">{isArabic ? "عـلـم صـيـدلانـي حـديـث" : "MODERN SCIENCE"}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Graceful Curved Wave Divider at the Bottom of the Olive Band */}
        <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 sm:h-20 preserve-3d"
            preserveAspectRatio="none"
          >
            <path
              d="M0 45 C320 105, 680 -15, 1120 45 C1280 68, 1380 30, 1440 15 L1440 90 L0 90 Z"
              fill="#f6f9e6"
            />
          </svg>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* SECTION 5: "THE SULAF DIFFERENCE — CARE YOU CAN TRUST" (4 COLUMNS)    */}
      {/* ===================================================================== */}
      <section className="bg-[#f6f9e6] text-[#22301e] pt-12 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
          
          {/* Centered Heading */}
          <div className="text-center space-y-2">
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#ca384a] font-bold block">
              {isArabic ? "ميثاق الثقة في سُـلاف" : "THE SULAF DIFFERENCE"}
            </span>
            <h2
              className={`${
                isArabic ? "font-amiri text-3xl sm:text-4xl" : "font-cormorant text-3xl sm:text-4xl"
              } font-normal text-[#1e2b18]`}
            >
              {isArabic ? "عناية سريرية يمكنكِ الوثوق بها" : "Care You Can Trust"}
            </h2>
          </div>

          {/* 4 Columns with Subtle Vertical Hairline Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-[#485c36]/15">
            
            <div className="py-6 sm:py-2 px-6 flex flex-col items-center text-center space-y-2.5">
              <Leaf className="w-7 h-7 text-[#22301e] stroke-[1.4]" />
              <h3
                className={`${
                  isArabic ? "font-amiri text-xl" : "font-cormorant text-xl"
                } font-bold text-[#1e2b18]`}
              >
                {isArabic ? "مكونات علاجية نقية" : "Premium Ingredients"}
              </h3>
              <p className="text-xs text-[#485c36]/80 max-w-[200px] leading-relaxed">
                {isArabic
                  ? "30% يوريا نقية و10% أمونيوم لاكتات وسيراميدات مختارة بعناية."
                  : "Naturally sourced, clinically selected active concentrations."}
              </p>
            </div>

            <div className="py-6 sm:py-2 px-6 flex flex-col items-center text-center space-y-2.5">
              <FlaskConical className="w-7 h-7 text-[#22301e] stroke-[1.4]" />
              <h3
                className={`${
                  isArabic ? "font-amiri text-xl" : "font-cormorant text-xl"
                } font-bold text-[#1e2b18]`}
              >
                {isArabic ? "مختبر سريرياً وآمِن" : "Dermatologically Tested"}
              </h3>
              <p className="text-xs text-[#485c36]/80 max-w-[200px] leading-relaxed">
                {isArabic
                  ? "توازن فسيولوجي pH 5.2 آمن وفعال للبشرة الحساسة والجافة."
                  : "Safe, effective, and gentle on sensitive skin barriers."}
              </p>
            </div>

            <div className="py-6 sm:py-2 px-6 flex flex-col items-center text-center space-y-2.5">
              <div className="text-[#22301e]">
                <SulafRosette className="w-7 h-7" strokeWidth={1.8} />
              </div>
              <h3
                className={`${
                  isArabic ? "font-amiri text-xl" : "font-cormorant text-xl"
                } font-bold text-[#1e2b18]`}
              >
                {isArabic ? "إلهام أندلسي أصيل" : "Heritage Inspired"}
              </h3>
              <p className="text-xs text-[#485c36]/80 max-w-[200px] leading-relaxed">
                {isArabic
                  ? "قرون من حكمة العناية الأندلسية المصاغة بمعايير صيدلانية حديثة."
                  : "Centuries of Andalusian wisdom, clinically modernized."}
              </p>
            </div>

            <div className="py-6 sm:py-2 px-6 flex flex-col items-center text-center space-y-2.5">
              <Heart className="w-7 h-7 text-[#22301e] stroke-[1.4]" />
              <h3
                className={`${
                  isArabic ? "font-amiri text-xl" : "font-cormorant text-xl"
                } font-bold text-[#1e2b18]`}
              >
                {isArabic ? "نتائج حقيقية ومعاينة" : "Real Results"}
              </h3>
              <p className="text-xs text-[#485c36]/80 max-w-[200px] leading-relaxed">
                {isArabic
                  ? "ملمس حريري موثق وحق معاينة العبوة عند الاستلام قبل الدفع."
                  : "Healthier skin, lasting confidence, and doorstep inspection."}
              </p>
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

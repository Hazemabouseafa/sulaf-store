"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AndalusianPattern } from "../brand/AndalusianPattern";
import { MarblePodium } from "../shop/MarblePodium";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  PackageCheck,
  Check,
} from "lucide-react";

export function HeroSection() {
  const { addItem } = useCart();
  const { settings } = useStoreSettings();
  const { isArabic, t } = useLanguage();
  const products = useProducts();
  const roughAway = products[0] || MOCK_PRODUCTS[0];

  const [addedHero, setAddedHero] = useState(false);

  const vis = settings.elementsVisibility || {
    heroBadge: true,
    heroPoem: true,
    heroSubheading: true,
    heroPriceCard: false,
    heroPrimaryCta: true,
    heroSecondaryCta: true,
    heroTrustBadges: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  const poemLine1 = custom.heroPoemLine1 || (isArabic ? settings.hero.poemLine1 : t.brand.poemLine1);
  const poemLine2 = custom.heroPoemLine2 || (isArabic ? settings.hero.poemLine2 : t.brand.poemLine2);

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const currency = isArabic ? "ج.م" : "EGP";

  function handleQuickOrder() {
    addItem(roughAway);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1800);
  }

  return (
    <section className="relative bg-[#f6f9e6] text-[#485c36] py-12 sm:py-16 lg:py-20 overflow-hidden font-cairo border-b border-[#485c36]/10">
      {/* Subtle Architectural Hairlines framing the stage */}
      <div className="hidden lg:block absolute inset-y-0 left-12 w-px bg-[#485c36]/10 pointer-events-none" />
      <div className="hidden lg:block absolute inset-y-0 right-12 w-px bg-[#485c36]/10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        
        {/* 1. Minimalist Heritage Pill */}
        {vis.heroBadge !== false && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#485c36]/10 border border-[#485c36]/20 text-[#485c36] text-xs font-bold mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#ca384a]" />
            <span>
              {custom.heroBadgeText ||
                (isArabic
                  ? "سُـلاف • حيث يلتقي العلم الصيدلاني بالجمال الأندلسي"
                  : t.hero?.badge || "Where Pharmaceutical Science Meets Beauty")}
            </span>
          </motion.div>
        )}

        {/* 2. Poetic Verse Above the Arch */}
        {vis.heroPoem !== false && (
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className={`${
              isArabic
                ? "font-amiri text-[clamp(1.85rem,4vw,3.35rem)] leading-[1.6]"
                : "font-cormorant italic text-[clamp(1.85rem,4vw,3.35rem)] leading-[1.3]"
            } font-bold text-[#485c36] max-w-3xl mb-4`}
          >
            <span>{poemLine1}</span>
            <span className="block text-[#610b0d] mt-1">{poemLine2}</span>
          </motion.h1>
        )}

        {/* 3. Simple Clinical Subtitle */}
        {vis.heroSubheading !== false && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xs sm:text-base text-[#485c36]/85 max-w-xl leading-relaxed mb-10"
          >
            {custom.heroSubheading ||
              (isArabic ? settings.hero.subheading : t.hero.subheading)}
          </motion.p>
        )}

        {/* =================================================================== */}
        {/* 4. THE GRAND ANDALUSIAN ARCH FOCAL STAGE                            */}
        {/* =================================================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[340px] sm:max-w-[390px] mx-auto"
        >
          {/* Outer Decorative Double-Arch Ring */}
          <div className="p-2.5 sm:p-3.5 rounded-t-[14rem] rounded-b-[2.5rem] border border-[#485c36]/25 bg-white/50 shadow-[0_24px_60px_rgba(72,92,54,0.14)]">
            
            {/* Inner Primary Olive Andalusian Mihrab / Arch */}
            <div className="relative rounded-t-[13rem] rounded-b-[2rem] bg-[#485c36] text-[#f6f9e6] pt-12 pb-8 px-6 flex flex-col items-center overflow-hidden border border-[#f3a5a1]/35">
              
              {/* Subtle Andalusian Pattern inside the Arch */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <AndalusianPattern opacity={1} color="#f6f9e6" scale={1.1} />
              </div>

              {/* Soft Crimson / Blush Glow at the Crown of the Arch */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#f3a5a1]/20 blur-2xl pointer-events-none" />

              {/* Top Arch Keystone Label */}
              <span className="relative z-10 font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-[#610b0d] text-[#f3a5a1] border border-[#f3a5a1]/30 mb-3">
                30% UREA • 10% LACTATE • 2% BHA
              </span>

              {/* Floating Flagship Product on Marble Podium */}
              <div className="relative z-10 my-2">
                <MarblePodium
                  imageSrc={roughAway?.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                  alt={isArabic ? roughAway.nameAr : roughAway.nameEn}
                  size="md"
                  priority={true}
                />
              </div>

              {/* Minimal Product Caption inside the Arch Base */}
              <div className="relative z-10 mt-3 space-y-1 text-center">
                <Link
                  href={`/product/${roughAway.slug}`}
                  className="font-amiri text-xl sm:text-2xl font-bold text-[#f6f9e6] hover:text-[#f3a5a1] transition-colors block"
                >
                  {isArabic ? roughAway.nameAr : roughAway.nameEn}
                </Link>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="font-mono text-lg font-black text-[#f3a5a1]">
                    {roughAway.price} {currency}
                  </span>
                  {roughAway.compareAtPrice > roughAway.price && (
                    <span className="font-mono text-xs text-[#f6f9e6]/50 line-through">
                      {roughAway.compareAtPrice} {currency}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 5. Clean Single-Focus Action Row Below the Arch */}
        {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 w-full max-w-xs sm:max-w-none"
          >
            {vis.heroPrimaryCta !== false && (
              <button
                type="button"
                onClick={handleQuickOrder}
                className="px-8 py-4 rounded-full bg-[#ca384a] hover:bg-[#610b0d] text-[#f6f9e6] font-bold text-sm shadow-[0_10px_28px_rgba(202,56,74,0.3)] flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                {addedHero ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isArabic ? "تمت الإضافة إلى حقيبتكِ ✓" : "Added to Bag ✓"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {custom.heroPrimaryCtaText ||
                        (isArabic
                          ? settings.hero.ctaText || "اطلبي الآن — تسليم فوري"
                          : t.hero.ctaOrder)}
                    </span>
                    <ArrowIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {vis.heroSecondaryCta !== false && (
              <Link
                href="/shop"
                className="px-8 py-4 rounded-full bg-white hover:bg-[#485c36] text-[#485c36] hover:text-[#f6f9e6] border border-[#485c36]/25 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#ca384a]" />
                <span>{custom.heroSecondaryCtaText || t.hero.ctaExplore}</span>
              </Link>
            )}
          </motion.div>
        )}

        {/* 6. Quiet Minimalist Trust Ribbon */}
        {vis.heroTrustBadges !== false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10 pt-6 border-t border-[#485c36]/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-[#485c36]/85"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#610b0d]" />
              <span>
                {custom.heroTrustEfficacy ||
                  (isArabic ? "تركيبات سريرية معتمدة" : "Verified Clinical Efficacy")}
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#ca384a]" />
              <span>
                {isArabic ? "معاينة العبوة قبل الاستلام والدفع" : "Inspect Before Paying"}
              </span>
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#485c36]" />
              <span>
                {custom.heroTrustShipping ||
                  (isArabic ? "شحن فوري مؤمن لجميع المحافظات" : "Insured Nationwide Delivery")}
              </span>
            </span>
          </motion.div>
        )}

      </div>
    </section>
  );
}

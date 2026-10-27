"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AndalusianPattern } from "../brand/AndalusianPattern";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Sparkles,
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

  function handleQuickOrder() {
    addItem(roughAway);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1800);
  }

  return (
    <section className="relative min-h-[78dvh] flex items-center justify-center bg-[#485c36] text-[#f6f9e6] py-20 sm:py-28 overflow-hidden font-cairo">
      {/* Subtle Andalusian Watermark at 5% Opacity */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <AndalusianPattern opacity={1} color="#f6f9e6" scale={1.3} />
      </div>

      {/* ACT I: THE POEM & THE PROMISE — PURE, SERENE, UNCLUTTERED */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center space-y-8">
        
        {/* Act Indicator & Brand Tagline */}
        {vis.heroBadge !== false && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#610b0d] text-[#f3a5a1] text-xs font-bold border border-[#f3a5a1]/30"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f3a5a1]" />
            <span>
              {custom.heroBadgeText ||
                (isArabic
                  ? "سُـلاف • حيث يلتقي العلم الصيدلاني بالجمال"
                  : t.hero?.badge || "Where Pharmaceutical Science Meets Beauty")}
            </span>
          </motion.div>
        )}

        {/* The Poetic Verse — Centerpiece of Act I */}
        {vis.heroPoem !== false && (
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className={`${
              isArabic
                ? "font-amiri text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.75]"
                : "font-cormorant italic text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.35]"
            } font-bold text-[#f6f9e6] max-w-3xl`}
          >
            <span className="block">{poemLine1}</span>
            <span className="block text-[#f3a5a1] mt-2">{poemLine2}</span>
          </motion.h1>
        )}

        {/* Quiet Single-Line Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="w-20 h-0.5 bg-[#f3a5a1]/50 rounded-full"
        />

        {/* Concise Clinical Promise */}
        {vis.heroSubheading !== false && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-sm sm:text-base text-[#f6f9e6]/85 max-w-xl leading-relaxed font-normal"
          >
            {custom.heroSubheading ||
              (isArabic ? settings.hero.subheading : t.hero.subheading)}
          </motion.p>
        )}

        {/* Pure Action Buttons */}
        {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none"
          >
            {vis.heroSecondaryCta !== false && (
              <a
                href="#act-formulas"
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#ca384a] hover:bg-[#610b0d] text-[#f6f9e6] font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#f6f9e6]" />
                <span>
                  {custom.heroSecondaryCtaText ||
                    (isArabic ? "اكتشفي العلاج" : t.hero.ctaExplore)}
                </span>
                <ArrowIcon className="w-4 h-4" />
              </a>
            )}

            {vis.heroPrimaryCta !== false && (
              <button
                type="button"
                onClick={handleQuickOrder}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#f6f9e6] hover:bg-[#f3a5a1] text-[#485c36] hover:text-[#610b0d] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedHero ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isArabic ? "تمت الإضافة للسلة ✓" : "Added ✓"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      {custom.heroPrimaryCtaText ||
                        (isArabic
                          ? settings.hero.ctaText || "اطلبي الآن"
                          : t.hero.ctaOrder)}
                    </span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}

      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import { ShoppingBag, Check } from "lucide-react";

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

  function handleQuickOrder() {
    addItem(roughAway);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1800);
  }

  // IDEA #1: THE QUIET APOTHECARY SCROLL (Aesop & Byredo Inspired)
  // Unified warm parchment (#f6f9e6), generous whitespace, no boxes or cards,
  // poetic verse in Olive (#485c36), softly floating bottle, and a single CTA.
  return (
    <section className="relative bg-[#f6f9e6] text-[#485c36] pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden font-cairo">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 flex flex-col items-center text-center">
        
        {/* Whisper-quiet manuscript catalog header */}
        {vis.heroBadge !== false && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-mono text-[11px] tracking-[0.28em] uppercase text-[#610b0d] mb-8 block"
          >
            {custom.heroBadgeText ||
              (isArabic
                ? "سُـلاف • دستور المستحضرات السريرية"
                : "SULAF • CLINICAL FORMULARY NO. 01")}
          </motion.span>
        )}

        {/* The Poetic Verse in Olive (#485c36) — Zero Boxes, Pure Typography */}
        {vis.heroPoem !== false && (
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className={`${
              isArabic
                ? "font-amiri text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.75]"
                : "font-cormorant italic text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.35]"
            } font-normal text-[#485c36] max-w-3xl`}
          >
            <span className="block">{poemLine1}</span>
            <span className="block text-[#610b0d] mt-1">{poemLine2}</span>
          </motion.h1>
        )}

        {/* Quiet Subtitle */}
        {vis.heroSubheading !== false && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-5 text-xs sm:text-sm text-[#485c36]/75 max-w-md leading-relaxed"
          >
            {custom.heroSubheading ||
              (isArabic ? settings.hero.subheading : t.hero.subheading)}
          </motion.p>
        )}

        {/* Softly Floating Product Image with Gentle Natural Shadow — No Card, No Border */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="my-12 sm:my-16 relative flex flex-col items-center"
        >
          <Link
            href={`/product/${roughAway.slug}`}
            className="group relative block focus:outline-none"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center"
            >
              <Image
                src={roughAway?.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                alt={isArabic ? roughAway.nameAr : roughAway.nameEn}
                width={240}
                height={240}
                priority
                className="object-contain drop-shadow-[0_24px_28px_rgba(72,92,54,0.16)] transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
            {/* Soft contact shadow on the parchment */}
            <div className="w-28 h-2.5 bg-[#485c36]/15 rounded-full blur-md mx-auto mt-2" />
          </Link>

          <span className="mt-5 font-mono text-[11px] tracking-[0.2em] text-[#610b0d]/80 uppercase">
            30% UREA — 10% AMMONIUM LACTATE — 2% SALICYLIC
          </span>
        </motion.div>

        {/* Single Focal Action Button */}
        {vis.heroPrimaryCta !== false && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              type="button"
              onClick={handleQuickOrder}
              className="px-10 py-4 rounded-full bg-[#485c36] hover:bg-[#610b0d] text-[#f6f9e6] font-bold text-xs sm:text-sm tracking-wide transition-colors duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_12px_30px_rgba(72,92,54,0.18)]"
            >
              {addedHero ? (
                <>
                  <Check className="w-4 h-4 text-[#f3a5a1]" />
                  <span>{isArabic ? "أُضيف إلى الحقيبة ✓" : "Added to Bag ✓"}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#f3a5a1]" />
                  <span>
                    {custom.heroPrimaryCtaText ||
                      (isArabic
                        ? `${ settings.hero.ctaText || "اطلبي المستحضر الآن"} — ${roughAway.price} ج.م`
                        : `${t.hero.ctaOrder} — ${roughAway.price} EGP`)}
                  </span>
                </>
              )}
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
}

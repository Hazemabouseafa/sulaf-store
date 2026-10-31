"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart/cart-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import { MOCK_PRODUCTS } from "@/lib/data/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Check,
} from "lucide-react";

/**
 * 8-Fold Andalusian Floral Rosette Emblem with optional continuous slow rotation
 */
export function SulafRosette({
  className = "w-16 h-16",
  strokeWidth = 1.4,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M50 6 C59 19, 63 32, 50 45 C37 32, 41 19, 50 6 Z" />
        <path d="M50 94 C59 81, 63 68, 50 55 C37 68, 41 81, 50 94 Z" />
        <path d="M6 50 C19 41, 32 37, 45 50 C32 63, 19 59, 6 50 Z" />
        <path d="M94 50 C81 41, 68 37, 55 50 C68 63, 81 59, 94 50 Z" />
        <path d="M18.8 18.8 C30 23, 39 30, 46 46 C30 39, 23 30, 18.8 18.8 Z" />
        <path d="M81.2 81.2 C70 77, 61 70, 54 54 C70 61, 77 70, 81.2 81.2 Z" />
        <path d="M81.2 18.8 C70 23, 61 30, 54 46 C70 39, 77 30, 81.2 18.8 Z" />
        <path d="M18.8 81.2 C30 77, 39 70, 46 54 C30 61, 23 70, 18.8 81.2 Z" />
        <rect
          x="36"
          y="36"
          width="28"
          height="28"
          rx="4"
          transform="rotate(45 50 50)"
        />
        <circle cx="50" cy="50" r="8" />
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
      </g>
    </svg>
  );
}

/**
 * 4-Pointed Star Accent (✦)
 */
export function FourPointStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0 C12.8 8.2 15.8 11.2 24 12 C15.8 12.8 12.8 15.8 12 24 C11.2 15.8 8.2 12.8 0 12 C8.2 11.2 11.2 8.2 12 0 Z" />
    </svg>
  );
}

export function HeroSection() {
  const { addItem } = useCart();
  const { settings } = useStoreSettings();
  const { isArabic, t } = useLanguage();
  const products = useProducts();
  const heroProduct =
    (settings?.featuredProductId &&
      products.find(
        (p) =>
          p.id === settings.featuredProductId ||
          p.slug === settings.featuredProductId
      )) ||
    products.find((p) => (p as any).isFeatured === true) ||
    products[0] ||
    MOCK_PRODUCTS[0];
  const [addedHero, setAddedHero] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.controls = false;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.removeAttribute("controls");

    const ensurePlaying = () => {
      const el = videoRef.current;
      if (!el) return;
      el.muted = true;
      if (el.paused) {
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    };

    ensurePlaying();
    video.addEventListener("loadedmetadata", ensurePlaying);
    video.addEventListener("loadeddata", ensurePlaying);
    video.addEventListener("canplay", ensurePlaying);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") ensurePlaying();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onFirstInteraction = () => ensurePlaying();
    window.addEventListener("touchstart", onFirstInteraction, { passive: true, once: true });
    window.addEventListener("scroll", onFirstInteraction, { passive: true, once: true });
    window.addEventListener("click", onFirstInteraction, { passive: true, once: true });

    return () => {
      video.removeEventListener("loadedmetadata", ensurePlaying);
      video.removeEventListener("loadeddata", ensurePlaying);
      video.removeEventListener("canplay", ensurePlaying);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).__SULAF_LOADED__) {
      setIsReady(true);
      return;
    }
    const onReady = () => setIsReady(true);
    window.addEventListener("sulaf:ready", onReady, { once: true });
    const timer = setTimeout(onReady, 750);
    return () => {
      window.removeEventListener("sulaf:ready", onReady);
      clearTimeout(timer);
    };
  }, []);

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

  // Authentic Sulaf Hero Texts from Settings & Translations
  const poemLine1 =
    custom.heroPoemLine1 || (isArabic ? settings.hero.poemLine1 || t.brand.poemLine1 : t.brand.poemLine1);
  const poemLine2 =
    custom.heroPoemLine2 || (isArabic ? settings.hero.poemLine2 || t.brand.poemLine2 : t.brand.poemLine2);

  const wordsLine1 = poemLine1.split(" ");
  const wordsLine2 = poemLine2.split(" ");

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  function handleQuickOrder() {
    if (!heroProduct) return;
    addItem(heroProduct, heroProduct.variants?.[0], 1);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1800);
  }

  return (
    <div className="w-full font-cairo">
      {/* ===================================================================== */}
      {/* HERO SECTION: FULL-BLEED VIDEO BACKGROUND WITH HIGH-CONTRAST TEXT    */}
      {/* ===================================================================== */}
      <section className="relative w-full min-h-[82vh] sm:min-h-[88vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-black text-[#f6f9e6]">
        
        {/* Full-bleed background video filled completely — 100% automatic with zero controls */}
        <video
          ref={videoRef}
          src="/videos/SULAF.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
          className="sulaf-bg-video absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
        />

        {/* Cinematic dark gradients for pristine legibility and zero contrast clash */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 rtl:from-black/85 rtl:via-black/60 rtl:to-black/35 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/55 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 z-10 pointer-events-none" />

        {/* Ambient Warm Golden & Burgundy Vignette Glow */}
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#ca384a]/25 via-[#610b0d]/15 to-transparent blur-3xl pointer-events-none z-10" />
        <div className="absolute bottom-12 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#610b0d]/30 via-[#ca384a]/15 to-transparent blur-3xl pointer-events-none z-10" />

        {/* Editorial Text Content */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-28 relative z-20 w-full">
          <div className="max-w-3xl space-y-6 text-start">
            
            {/* Top Heritage Badge */}
            {vis.heroBadge !== false && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-1.5"
              >
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[#f3a5a1] block font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {custom.heroHeritageText || t.hero.clinicalHeritage}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-white font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {custom.heroBadgeText || (isArabic ? settings.hero.badge || t.hero.badge : t.hero.badge)}
                  </span>
                  <motion.span
                    initial={{ width: 0 }}
                    animate={isReady ? { width: 56 } : { width: 0 }}
                    transition={{ duration: 0.9, delay: isReady ? 0.3 : 0 }}
                    className="h-px bg-[#f3a5a1]/70 inline-block shadow-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Sulaf Poetic Verse with Word-by-Word Fluid Animation */}
            {vis.heroPoem !== false && (
              <h1
                className={`${
                  isArabic
                    ? "font-gulzar text-[clamp(2.3rem,4.6vw,3.8rem)] leading-[1.6]"
                    : "font-cinzel text-[clamp(2.4rem,4.8vw,4.2rem)] leading-[1.15]"
                } font-normal text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]`}
              >
                <span className="block">
                  {wordsLine1.map((word, i) => (
                    <motion.span
                      key={`l1-${i}`}
                      initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                      animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 18, filter: "blur(4px)" }}
                      transition={{
                        duration: 0.65,
                        delay: isReady ? (0.05 + i * 0.07) : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block me-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>

                <span className="block italic text-[#f3a5a1] mt-2 drop-shadow-[0_4px_22px_rgba(202,56,74,0.45)]">
                  {wordsLine2.map((word, i) => (
                    <motion.span
                      key={`l2-${i}`}
                      initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                      animate={isReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 18, filter: "blur(4px)" }}
                      transition={{
                        duration: 0.65,
                        delay: isReady ? (0.35 + i * 0.08) : 0,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block me-2"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>
            )}

            {/* Authentic Sulaf Clinical Subheading */}
            {vis.heroSubheading !== false && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.8, delay: isReady ? 0.65 : 0, ease: [0.16, 1, 0.3, 1] }}
                className={`${
                  isArabic
                    ? "font-amiri text-lg sm:text-xl leading-relaxed"
                    : "font-cormorant italic text-lg sm:text-xl leading-relaxed"
                } text-[#f6f9e6]/95 max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
              >
                {custom.heroSubheading ||
                  (isArabic ? settings.hero.subheading || t.hero.subheading : t.hero.subheading)}
              </motion.p>
            )}

            {/* Sulaf CTA Buttons */}
            {(vis.heroPrimaryCta !== false || vis.heroSecondaryCta !== false) && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: 0.8, delay: isReady ? 0.8 : 0, ease: [0.16, 1, 0.3, 1] }}
                className="pt-4 flex flex-wrap items-center gap-3.5"
              >
                {vis.heroPrimaryCta !== false && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleQuickOrder}
                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#ca384a] hover:bg-[#a52838] text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-[0_12px_28px_rgba(202,56,74,0.45)] hover:shadow-[0_16px_36px_rgba(202,56,74,0.6)] border border-[#f3a5a1]/40 cursor-pointer animate-sulaf-shimmer"
                  >
                    {addedHero ? (
                      <>
                        <Check className="w-4 h-4 text-[#f3e5ab]" />
                        <span>{isArabic ? "تمت الإضافة لحقيبتكِ ✓" : "Added to Bag ✓"}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#f3e5ab]" />
                        <span>
                          {custom.heroPrimaryCtaText ||
                            (isArabic
                              ? settings.hero.ctaText || t.hero.ctaOrder
                              : t.hero.ctaOrder)}
                        </span>
                        <ArrowIcon className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                )}

                {vis.heroSecondaryCta !== false && (
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/35 hover:border-white/70 bg-white/10 hover:bg-white/20 text-[#f6f9e6] backdrop-blur-md text-xs sm:text-sm font-bold transition-all shadow-lg"
                    >
                      <span>{custom.heroSecondaryCtaText || t.hero.ctaExplore}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}

          </div>
        </div>

        {/* Bottom Wavy Curve Shape Divider (التعريجة) transitioning into Royal Burgundy Section */}
        <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none pointer-events-none z-20">
          <svg
            viewBox="0 0 1440 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-10 sm:h-14 lg:h-18"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 L380 10 C480 10, 520 68, 640 68 L1440 68 L1440 70 L0 70 Z"
              fill="#610b0d"
            />
          </svg>
        </div>
      </section>
    </div>
  );
}

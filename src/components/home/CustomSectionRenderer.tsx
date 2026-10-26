"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CustomHomepageSection } from "@/lib/settings/store-settings";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  ShieldCheck,
  Star,
  Heart,
  Truck,
  FlaskConical,
  Award,
  Clock,
  HelpCircle,
  Quote as QuoteIcon,
  ExternalLink,
} from "lucide-react";

interface CustomSectionRendererProps {
  section: CustomHomepageSection;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  star: Star,
  heart: Heart,
  truck: Truck,
  flask: FlaskConical,
  award: Award,
  clock: Clock,
  check: CheckCircle2,
  help: HelpCircle,
};

export function CustomSectionRenderer({ section }: CustomSectionRendererProps) {
  const { isArabic } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const title = (isArabic ? section.titleAr : (section.titleEn || section.titleAr)) || "";
  const subtitle = (isArabic ? section.subtitleAr : (section.subtitleEn || section.subtitleAr)) || "";
  const badge = (isArabic ? section.badgeAr : (section.badgeEn || section.badgeAr)) || "";
  const content = (isArabic ? section.contentAr : (section.contentEn || section.contentAr)) || "";
  const ctaText = (isArabic ? section.ctaTextAr : (section.ctaTextEn || section.ctaTextAr)) || "";
  const ctaUrl = section.ctaUrl || "#";
  const secondaryCtaText = (isArabic ? section.secondaryCtaTextAr : (section.secondaryCtaTextEn || section.secondaryCtaTextAr)) || "";
  const secondaryCtaUrl = section.secondaryCtaUrl || "#";

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // Background style helper
  const getBgClasses = () => {
    switch (section.bgStyle) {
      case "dark":
        return "bg-gradient-to-br from-[#1e2716] via-[#2a3820] to-[#1a2213] text-[#f6f9e6]";
      case "primary":
        return "bg-gradient-to-br from-[#2f3d23] via-[#3d502d] to-[#25321b] text-[#f6f9e6]";
      case "gradient":
        return "bg-gradient-to-br from-[#fbfdf7] via-[#f4f7e8] to-[#e8ecd2] text-[#1c2616]";
      case "glass":
        return "bg-white/80 backdrop-blur-md text-[#1c2616] border-y border-[#dbe2bd]/70";
      default:
        return "bg-[#f6f9e6] text-[#1c2616]";
    }
  };

  const isDark = section.bgStyle === "dark" || section.bgStyle === "primary";

  // 1. BANNER TYPE
  if (section.type === "banner") {
    return (
      <section className={`relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${getBgClasses()}`}>
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[120px] pointer-events-none" />
        
        {section.imageUrl && (
          <div className="absolute inset-0 z-0 opacity-15 overflow-hidden">
            <Image
              src={section.imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center space-y-4">
          {badge && (
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border shadow-xs ${
              isDark
                ? "bg-white/10 border-[#d4af37]/40 text-[#f3e5ab]"
                : "bg-white border-[#dbe2bd] text-[#485c36]"
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{badge}</span>
            </span>
          )}

          <h2 className={`font-amiri text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight ${isDark ? "text-white" : "text-[#233019]"}`}>
            {title}
          </h2>

          {subtitle && (
            <p className={`font-cairo text-sm sm:text-base max-w-2xl font-medium leading-relaxed ${isDark ? "text-white/80" : "text-gray-700"}`}>
              {subtitle}
            </p>
          )}

          {content && (
            <p className={`font-cairo text-xs sm:text-sm max-w-xl leading-relaxed whitespace-pre-line ${isDark ? "text-white/70" : "text-gray-600"}`}>
              {content}
            </p>
          )}

          {(ctaText || secondaryCtaText) && (
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {ctaText && (
                <Link
                  href={ctaUrl}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#ca384a] hover:bg-[#a82637] text-white font-bold font-cairo text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>{ctaText}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              )}
              {secondaryCtaText && (
                <Link
                  href={secondaryCtaUrl}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl border font-bold font-cairo text-sm transition-all flex items-center justify-center gap-2 ${
                    isDark
                      ? "border-white/30 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // 2. FEATURES GRID TYPE
  if (section.type === "features") {
    const items = section.items || [];
    return (
      <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${getBgClasses()}`}>
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            {badge && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isDark ? "bg-white/10 border-[#d4af37]/40 text-[#f3e5ab]" : "bg-[#f6f9e6] border-[#dbe2bd] text-[#485c36]"
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{badge}</span>
              </span>
            )}
            <h2 className={`font-amiri text-2xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-[#233019]"}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`font-cairo text-xs sm:text-sm ${isDark ? "text-white/80" : "text-gray-600"}`}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item, idx) => {
              const itemTitle = isArabic ? item.titleAr : (item.titleEn || item.titleAr);
              const itemDesc = isArabic ? item.descAr : (item.descEn || item.descAr);
              const ItemIcon = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : Sparkles;

              return (
                <div
                  key={item.id || idx}
                  className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:border-[#d4af37]/50"
                      : "bg-white border-[#dbe2bd] hover:border-[#485c36] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#485c36]/15 text-[#485c36] flex items-center justify-center mb-4">
                    <ItemIcon className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <h3 className={`font-bold font-cairo text-base mb-2 ${isDark ? "text-white" : "text-[#233019]"}`}>
                    {itemTitle}
                  </h3>
                  {itemDesc && (
                    <p className={`font-cairo text-xs sm:text-sm leading-relaxed ${isDark ? "text-white/70" : "text-gray-600"}`}>
                      {itemDesc}
                    </p>
                  )}
                  {item.linkUrl && item.linkTextAr && (
                    <Link
                      href={item.linkUrl}
                      className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#485c36] hover:text-[#ca384a] transition-colors"
                    >
                      <span>{isArabic ? item.linkTextAr : (item.linkTextEn || item.linkTextAr)}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {ctaText && (
            <div className="text-center pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#3d502d] hover:bg-[#233019] text-white font-bold font-cairo text-sm shadow-md"
              >
                <span>{ctaText}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  // 3. MEDIA + TEXT SHOWCASE
  if (section.type === "mediaText") {
    const isImageLeft = section.imagePosition === "left";
    return (
      <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${getBgClasses()}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Media Column */}
          <div className={`lg:col-span-6 ${isImageLeft ? "lg:order-1" : "lg:order-2"}`}>
            <div className="relative rounded-3xl overflow-hidden border border-[#dbe2bd] shadow-lg bg-white aspect-4/3 flex items-center justify-center">
              {section.imageUrl ? (
                <Image
                  src={section.imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#485c36]/10 text-[#485c36] mx-auto flex items-center justify-center">
                    <FlaskConical className="w-8 h-8 text-[#d4af37]" />
                  </div>
                  <p className="font-cairo text-xs text-gray-400">سُـلاف كوزمتكس</p>
                </div>
              )}
            </div>
          </div>

          {/* Copy Column */}
          <div className={`lg:col-span-6 space-y-4 ${isImageLeft ? "lg:order-2" : "lg:order-1"}`}>
            {badge && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isDark ? "bg-white/10 border-[#d4af37]/40 text-[#f3e5ab]" : "bg-white border-[#dbe2bd] text-[#485c36]"
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{badge}</span>
              </span>
            )}

            <h2 className={`font-amiri text-2xl sm:text-4xl font-bold leading-tight ${isDark ? "text-white" : "text-[#233019]"}`}>
              {title}
            </h2>

            {subtitle && (
              <p className={`font-cairo text-sm sm:text-base font-semibold ${isDark ? "text-white/90" : "text-[#485c36]"}`}>
                {subtitle}
              </p>
            )}

            {content && (
              <p className={`font-cairo text-xs sm:text-sm leading-relaxed whitespace-pre-line ${isDark ? "text-white/70" : "text-gray-700"}`}>
                {content}
              </p>
            )}

            {ctaText && (
              <div className="pt-3">
                <Link
                  href={ctaUrl}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-[#ca384a] hover:bg-[#a82637] text-white font-bold font-cairo text-sm shadow-md"
                >
                  <span>{ctaText}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 4. FAQ ACCORDION
  if (section.type === "faq") {
    const items = section.items || [];
    return (
      <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${getBgClasses()}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            {badge && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                isDark ? "bg-white/10 border-[#d4af37]/40 text-[#f3e5ab]" : "bg-white border-[#dbe2bd] text-[#485c36]"
              }`}>
                <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{badge}</span>
              </span>
            )}
            <h2 className={`font-amiri text-2xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-[#233019]"}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`font-cairo text-xs sm:text-sm ${isDark ? "text-white/80" : "text-gray-600"}`}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const q = isArabic ? item.titleAr : (item.titleEn || item.titleAr);
              const a = isArabic ? item.descAr : (item.descEn || item.descAr);
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={item.id || idx}
                  className={`rounded-2xl border transition-all ${
                    isDark
                      ? "bg-white/5 border-white/10"
                      : "bg-white border-[#dbe2bd] shadow-xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-start cursor-pointer focus:outline-none"
                  >
                    <span className={`font-bold font-cairo text-sm sm:text-base ${isDark ? "text-white" : "text-[#1c2616]"}`}>
                      {q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#485c36] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-4 sm:px-5 pb-5 pt-1 font-cairo text-xs sm:text-sm leading-relaxed border-t ${
                          isDark ? "text-white/70 border-white/10" : "text-gray-600 border-gray-100"
                        }`}>
                          {a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {ctaText && (
            <div className="text-center pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3d502d] text-white font-bold font-cairo text-xs shadow-sm"
              >
                <span>{ctaText}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  // 5. QUOTE / TESTIMONIAL TYPE
  if (section.type === "quote") {
    return (
      <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${getBgClasses()}`}>
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-[#d4af37]/15 text-[#d4af37] flex items-center justify-center mx-auto">
            <QuoteIcon className="w-7 h-7" />
          </div>

          {badge && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isDark ? "bg-white/10 border-[#d4af37]/40 text-[#f3e5ab]" : "bg-white border-[#dbe2bd] text-[#485c36]"
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{badge}</span>
            </span>
          )}

          <blockquote className={`font-amiri text-xl sm:text-3xl font-bold leading-relaxed italic ${isDark ? "text-white" : "text-[#233019]"}`}>
            «{title}»
          </blockquote>

          {subtitle && (
            <p className={`font-cairo text-sm font-bold ${isDark ? "text-[#f3e5ab]" : "text-[#ca384a]"}`}>
              — {subtitle}
            </p>
          )}

          {content && (
            <p className={`font-cairo text-xs max-w-lg mx-auto leading-relaxed ${isDark ? "text-white/70" : "text-gray-500"}`}>
              {content}
            </p>
          )}
        </div>
      </section>
    );
  }

  // 6. RICH TEXT / EDITORIAL TYPE (DEFAULT)
  return (
    <section className={`py-14 sm:py-20 px-4 sm:px-6 lg:px-8 ${getBgClasses()}`}>
      <div className="max-w-3xl mx-auto space-y-5 text-start">
        {badge && (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isDark ? "bg-white/10 border-[#d4af37]/40 text-[#f3e5ab]" : "bg-white border-[#dbe2bd] text-[#485c36]"
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{badge}</span>
          </span>
        )}

        <h2 className={`font-amiri text-2xl sm:text-4xl font-bold ${isDark ? "text-white" : "text-[#233019]"}`}>
          {title}
        </h2>

        {subtitle && (
          <p className={`font-cairo text-sm sm:text-base font-semibold ${isDark ? "text-white/90" : "text-[#485c36]"}`}>
            {subtitle}
          </p>
        )}

        {content && (
          <div className={`font-cairo text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-3 ${isDark ? "text-white/75" : "text-gray-700"}`}>
            {content}
          </div>
        )}

        {ctaText && (
          <div className="pt-2">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3d502d] text-white font-bold font-cairo text-xs shadow-sm"
            >
              <span>{ctaText}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

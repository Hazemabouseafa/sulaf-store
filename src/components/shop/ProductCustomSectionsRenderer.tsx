"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ProductData,
  ProductCustomSection,
  ProductCustomCard,
} from "@/lib/data/mock-data";
import { PearlOrbs } from "@/components/motion/PearlOrbs";
import { AndalusianPattern } from "@/components/brand/AndalusianPattern";
import {
  BookOpen,
  Sparkles,
  Clock,
  Dna,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Award,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Layers,
  FileText,
  Star,
  Quote,
} from "lucide-react";

interface ProductCustomSectionsRendererProps {
  product: ProductData;
  isArabic: boolean;
  t: any;
  customSettings?: any;
}

export function ProductCustomSectionsRenderer({
  product,
  isArabic,
  t,
  customSettings = {},
}: ProductCustomSectionsRendererProps) {
  const [openFaq, setOpenFaq] = useState<Record<string, boolean>>({});
  const [openInci, setOpenInci] = useState(false);
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const pb = product.pageBuilder || {};
  const customSections = pb.customSections || product.customSections || [];

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full">
      {/* ===================================================================== */}
      {/* 1. CLINICAL STORY SECTION (Default or Custom)                         */}
      {/* ===================================================================== */}
      {pb.storyEnabled !== false && (
        <section className="py-20 bg-[#f4f1e6] border-b border-[#e2e8c0] relative overflow-hidden">
          <AndalusianPattern opacity={0.03} color="#485c36" scale={1.2} />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
                <BookOpen className="w-4 h-4 text-[#485c36]" />
                <span>
                  {isArabic
                    ? pb.storyBadgeAr || customSettings.productStoryBadge || "فلسفة الترميم السريري"
                    : pb.storyBadgeEn || customSettings.productStoryBadge || "Clinical Philosophy & Origin"}
                </span>
              </div>
              <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
                {isArabic
                  ? pb.storyTitleAr || customSettings.productStoryTitle || "قصة المستحضر: ترميم هيكلي، بدون احتكاك"
                  : pb.storyTitleEn || customSettings.productStoryTitle || "The Story: Structural Restoration, Not Friction"}
              </h2>
            </div>

            <div className="space-y-6 text-gray-800 font-cairo text-base sm:text-lg leading-relaxed bg-[#fdfef8] p-8 sm:p-12 rounded-3xl border border-[#e2e8c0] shadow-sm">
              {((isArabic ? pb.storyParagraphs : (pb.storyParagraphsEn || pb.storyParagraphs)) && (isArabic ? pb.storyParagraphs : (pb.storyParagraphsEn || pb.storyParagraphs))!.length > 0) ? (
                (isArabic ? pb.storyParagraphs! : (pb.storyParagraphsEn || pb.storyParagraphs)!).map((paragraph, i, arr) => (
                  <p
                    key={i}
                    className={`font-medium text-[#1c2616] ${
                      i === arr.length - 1
                        ? "p-6 rounded-2xl bg-[#f9fbf0] border-s-4 border-[#485c36] shadow-sm"
                        : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="font-medium text-[#1c2616]">
                    {isArabic
                      ? customSettings.productStoryParagraph1 ||
                        "حين شيد الحرفيون القدامى قصور الأندلس، فهموا قانوناً جوهرياً للتوازن: الحجر لا يخضع للقوة الغاشمة، بل للهندسة المتقنة."
                      : "When ancient artisans raised the palaces of Andalusia, they understood a fundamental law of balance: stone never submits to brute force, only to enduring geometry."}
                  </p>

                  <p className="font-medium text-[#1c2616]">
                    {isArabic
                      ? customSettings.productStoryParagraph2 ||
                        "بشرتك تتحدث باللغة ذاتها. تلك الحبيبات الخشنة وجلد الوزة ليست أوساخاً لتُفرك بخشونة، بل هي دروع كيراتينية دفاعية بنتها بشرتك لحماية حاجز فقد ترطيبه."
                      : "Your skin speaks the same language. Those rough, strawberry bumps are not debris to be scrubbed away—they are fragile ramparts, desperate keratin shields raised by a barrier stripped of moisture."}
                  </p>

                  <p className="font-medium text-[#1c2616] p-6 rounded-2xl bg-[#f9fbf0] border-s-4 border-[#485c36] shadow-sm">
                    {isArabic
                      ? customSettings.productStoryParagraph3 ||
                        `${product.nameAr} تحفة سريرية صُممت لإنهاء الحرب بين بشرتك والمقشرات القاسية. بتركيبة صيدلانية متطورة تذيب الروابط المتصلبة من الجذور. لا خدوش دقيقة، ولا انتكاس للخشونة. بل كيمياء حيوية راقية تحول الملمس الخشن إلى حرير لا يُهزم.`
                      : `${product.nameEn} is a clinical masterpiece formulated to end the war between your skin and coarse exfoliants. Crafted with a medical-grade formulation that dissolves stubborn keratin plugs from the root up with no micro-tears and no rebound roughness.`}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 2. ACTIVE INGREDIENTS / CARDS SECTION                                 */}
      {/* ===================================================================== */}
      {pb.activesEnabled !== false && (
        <section className="py-20 bg-[#f4f1e6] border-b border-[#e2e8c0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#485c36]" />
              <span>
                {isArabic
                  ? customSettings.productActivesBadge || "الهندسة الجزيئية والمكونات الفعالة"
                  : "Molecular Architecture & Bio-Actives"}
              </span>
            </div>

            <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
              {isArabic
                ? pb.activesTitleAr || customSettings.productActivesTitle || "المركب الثلاثي السريري والمركبات الفعالة"
                : pb.activesTitleEn || customSettings.productActivesTitle || "The Triple Clinical Complex & Key Actives"}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-700 font-cairo max-w-2xl mx-auto font-medium">
              {isArabic
                ? pb.activesSubtitleAr ||
                  customSettings.productActivesDesc ||
                  "فحص الميكانيزم الجزيئي لكل مركب سريري فعال في تركيبة المستحضر."
                : pb.activesSubtitleEn ||
                  customSettings.productActivesDesc ||
                  "Inspect the molecular mechanism of each clinical active in the formulation."}
            </p>

            {/* Custom Actives Cards (if defined by manager) or Pearl Orbs */}
            {pb.activesCards && pb.activesCards.length > 0 ? (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
                {pb.activesCards.map((card, i) => (
                  <div
                    key={card.id || i}
                    className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      {card.concentration && (
                        <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] border border-[#485c36]/20">
                          {card.concentration}
                        </span>
                      )}
                      <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="font-amiri text-xl font-bold text-[#1e2b18] mb-2 group-hover:text-[#610b0d] transition-colors">
                      {isArabic ? card.titleAr : card.titleEn || card.titleAr}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed">
                      {isArabic ? card.descAr : card.descEn || card.descAr}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <PearlOrbs className="mt-8" isRtl={isArabic} />
            )}
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 3. APPLICATION RITUAL & TIMELINE STEPS                                */}
      {/* ===================================================================== */}
      {pb.ritualEnabled !== false && (
        <section className="py-20 bg-[#f4f1e6] border-b border-[#e2e8c0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#610b0d]/10 text-[#610b0d] text-xs font-cairo font-bold mb-3">
                <Clock className="w-4 h-4" />
                <span>
                  {isArabic
                    ? customSettings.productRitualBadge || "بروتوكول التطبيق والطقوس"
                    : "Application Protocol & Phases"}
                </span>
              </div>
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#222b1a]">
                {isArabic
                  ? pb.ritualTitleAr || customSettings.productRitualTitle || "بروتوكول الاستخدام والتطبيق الهيكلي"
                  : pb.ritualTitleEn || customSettings.productRitualTitle || "Ritual & Architectural Application"}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 font-cairo">
                {isArabic
                  ? pb.ritualSubtitleAr ||
                    customSettings.productRitualSubtitle ||
                    "تسلسل مرقم لتحقيق أعلى استجابة خلوية ونعومة حريرية دائمة."
                  : pb.ritualSubtitleEn ||
                    customSettings.productRitualSubtitle ||
                    "Numbered sequence for peak cellular response and lasting epidermal silkiness."}
              </p>
            </div>

            {/* Step-by-Step Cards */}
            <div className="space-y-4">
              {pb.ritualSteps && pb.ritualSteps.length > 0 ? (
                pb.ritualSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-6 sm:p-7 rounded-2xl bg-[#fdfef8] border border-[#e2e8c0] shadow-xs flex items-start gap-4 sm:gap-6 text-start"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#485c36] text-[#f6f9e6] flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-sm">
                      {step.stepNum || String(idx + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#1e2b18] mb-1">
                        {isArabic ? step.titleAr : step.titleEn || step.titleAr}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed">
                        {isArabic ? step.descAr : step.descEn || step.descAr}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-6 sm:p-7 rounded-2xl bg-[#fdfef8] border border-[#e2e8c0] shadow-xs flex items-start gap-4 sm:gap-6 text-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#485c36] text-[#f6f9e6] flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-sm">
                      01
                    </div>
                    <div>
                      <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#1e2b18] mb-1">
                        {isArabic ? "التطبيق على بشرة دافئة ونظيفة" : "Apply to Warm, Clean Skin"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed">
                        {isArabic
                          ? "استخدمي المستحضر مباشرة بعد الاستحمام بالماء الدافئ حين تكون المسام مهيأة لامتصاص اليوريا والأمونيوم لاكتات بعمق."
                          : "Apply directly after a warm shower when follicles are receptive to deep urea and ammonium lactate infiltration."}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-[#fdfef8] border border-[#e2e8c0] shadow-xs flex items-start gap-4 sm:gap-6 text-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#485c36] text-[#f6f9e6] flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-sm">
                      02
                    </div>
                    <div>
                      <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#1e2b18] mb-1">
                        {isArabic ? "التوزيع الحركي الدائري اللطيف" : "Gentle Circular Kinetic Distribution"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed">
                        {isArabic
                          ? "دلكي بحركات دائرية هادئة على مناطق الخشونة وجلد الوزة (الذراعين، الفخذين، الركبتين) دون فرك عنيف حتى يُمتص تماماً."
                          : "Massage in calm circular strokes over targeted rough patches until fully absorbed without aggressive friction."}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 rounded-2xl bg-[#fdfef8] border border-[#e2e8c0] shadow-xs flex items-start gap-4 sm:gap-6 text-start">
                    <div className="w-12 h-12 rounded-2xl bg-[#610b0d] text-[#f6f9e6] flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-sm">
                      03
                    </div>
                    <div>
                      <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#1e2b18] mb-1">
                        {isArabic ? "المواظبة لليوم السابع لترسيخ النعومة الحريرية" : "Maintain Through Day 7 for Silk Lock"}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed">
                        {isArabic
                          ? "كرري الطقس مساءً كل يوم. من اليوم الثالث تبدأ الروابط الكيراتينية بالذوبان، وبحلول اليوم السابع يستقر ملمس الحرير الدائم."
                          : "Repeat nightly. By day 3 keratin plugs dissolve from the root, reaching lasting touchable silk by day 7."}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 4. DYNAMIC CUSTOM SECTIONS & CARDS ADDED BY MANAGER                   */}
      {/* ===================================================================== */}
      {customSections && customSections.length > 0 && (
        <div className="w-full space-y-0">
          {customSections
            .filter((s) => s.enabled !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((section) => {
              // 4.1 Feature Cards Grid
              if (section.type === "cards") {
                return (
                  <section
                    key={section.id}
                    className="py-20 bg-[#f4f1e6] border-b border-[#e2e8c0] relative overflow-hidden"
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                      {section.badgeAr && (
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{isArabic ? section.badgeAr : section.badgeEn || section.badgeAr}</span>
                        </div>
                      )}

                      <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
                        {isArabic ? section.titleAr : section.titleEn || section.titleAr}
                      </h2>

                      {section.subtitleAr && (
                        <p className="mt-3 text-sm sm:text-base text-gray-700 font-cairo max-w-2xl mx-auto font-medium">
                          {isArabic ? section.subtitleAr : section.subtitleEn || section.subtitleAr}
                        </p>
                      )}

                      {/* Cards Grid */}
                      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
                        {(section.cards || []).map((c, idx) => (
                          <div
                            key={c.id || idx}
                            className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                          >
                            <div className="flex items-center justify-between mb-4">
                              {c.concentration ? (
                                <span className="font-mono text-xs font-black px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] border border-[#485c36]/20">
                                  {c.concentration}
                                </span>
                              ) : (
                                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                                  {String(idx + 1).padStart(2, "0")}
                                </span>
                              )}
                              {c.badge && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  {c.badge}
                                </span>
                              )}
                            </div>

                            <h3 className="font-amiri text-xl font-bold text-[#1e2b18] mb-2">
                              {isArabic ? c.titleAr : c.titleEn || c.titleAr}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed">
                              {isArabic ? c.descAr : c.descEn || c.descAr}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              // 4.2 Media & Text Split (Clinical Results / Photo)
              if (section.type === "mediaText") {
                return (
                  <section
                    key={section.id}
                    className="py-20 bg-[#f4f1e6] border-b border-[#e2e8c0] relative overflow-hidden"
                  >
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-6 space-y-4 text-start">
                          {section.badgeAr && (
                            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#610b0d] font-bold block">
                              {isArabic ? section.badgeAr : section.badgeEn || section.badgeAr}
                            </span>
                          )}
                          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#1e2b18]">
                            {isArabic ? section.titleAr : section.titleEn || section.titleAr}
                          </h2>
                          {section.subtitleAr && (
                            <p className="font-cormorant italic text-base text-[#485c36] font-semibold">
                              {isArabic ? section.subtitleAr : section.subtitleEn || section.subtitleAr}
                            </p>
                          )}
                          <div className="text-sm text-gray-700 font-cairo leading-relaxed whitespace-pre-line pt-2">
                            {isArabic ? section.contentAr : section.contentEn || section.contentAr}
                          </div>

                          {section.buttonTextAr && section.buttonLink && (
                            <div className="pt-4">
                              <Link
                                href={section.buttonLink}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#485c36] hover:bg-[#34482f] text-[#f6f9e6] text-xs font-bold transition-all shadow-sm"
                              >
                                <span>{isArabic ? section.buttonTextAr : section.buttonTextEn || section.buttonTextAr}</span>
                                <ArrowIcon className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>

                        <div className="lg:col-span-6 flex justify-center">
                          <div className="relative w-full max-w-md h-72 sm:h-96 rounded-3xl overflow-hidden shadow-lg border border-[#e2e8c0] bg-white">
                            <Image
                              src={section.imageUrl || "/brand/sulaf-flower-symbol.png"}
                              alt={section.imageAlt || section.titleAr}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              }

              // 4.3 FAQ Accordion
              if (section.type === "faq") {
                return (
                  <section
                    key={section.id}
                    className="py-20 bg-[#f4f1e6] border-b border-[#e2e8c0] relative overflow-hidden"
                  >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-cairo font-bold mb-3">
                          <HelpCircle className="w-4 h-4 text-amber-800" />
                          <span>{isArabic ? section.badgeAr || "الأسئلة الشائعة" : section.badgeEn || "Product FAQs"}</span>
                        </div>
                        <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#1e2b18]">
                          {isArabic ? section.titleAr : section.titleEn || section.titleAr}
                        </h2>
                      </div>

                      <div className="space-y-3">
                        {(section.cards || []).map((faqItem, idx) => {
                          const isOpen = !!openFaq[faqItem.id || String(idx)];
                          return (
                            <div
                              key={faqItem.id || idx}
                              className="rounded-2xl bg-[#fdfef8] border border-[#e2e8c0] overflow-hidden shadow-xs transition-all"
                            >
                              <button
                                type="button"
                                onClick={() => toggleFaq(faqItem.id || String(idx))}
                                className="w-full p-5 text-start font-amiri text-lg font-bold text-[#1e2b18] flex items-center justify-between gap-4 cursor-pointer"
                              >
                                <span>{isArabic ? faqItem.titleAr : faqItem.titleEn || faqItem.titleAr}</span>
                                {isOpen ? (
                                  <ChevronUp className="w-5 h-5 text-[#485c36] shrink-0" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                )}
                              </button>

                              {isOpen && (
                                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed border-t border-gray-100 pt-3">
                                  {isArabic ? faqItem.descAr : faqItem.descEn || faqItem.descAr}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              }

              // 4.4 Callout Banner
              if (section.type === "banner") {
                return (
                  <section
                    key={section.id}
                    className="py-14 sm:py-16 bg-[#18271b] text-[#f6f9e6] border-b border-[#e2e8c0] relative overflow-hidden"
                  >
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
                      {section.badgeAr && (
                        <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#f3a5a1] font-bold block">
                          {isArabic ? section.badgeAr : section.badgeEn || section.badgeAr}
                        </span>
                      )}
                      <h2 className="font-amiri text-2xl sm:text-4xl font-bold text-[#f6f9e6]">
                        {isArabic ? section.titleAr : section.titleEn || section.titleAr}
                      </h2>
                      {section.contentAr && (
                        <p className="text-sm sm:text-base text-[#f6f9e6]/80 font-cairo max-w-2xl mx-auto leading-relaxed">
                          {isArabic ? section.contentAr : section.contentEn || section.contentAr}
                        </p>
                      )}
                      {section.buttonTextAr && section.buttonLink && (
                        <div className="pt-2">
                          <Link
                            href={section.buttonLink}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#f6f9e6] hover:bg-white text-[#18271b] text-xs font-bold transition-all shadow-md"
                          >
                            <span>{isArabic ? section.buttonTextAr : section.buttonTextEn || section.buttonTextAr}</span>
                            <ArrowIcon className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </section>
                );
              }

              // 4.5 Rich Text
              if (section.type === "richText") {
                return (
                  <section
                    key={section.id}
                    className="py-16 bg-[#f4f1e6] border-b border-[#e2e8c0] relative overflow-hidden"
                  >
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                      <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1e2b18] mb-6 text-center">
                        {isArabic ? section.titleAr : section.titleEn || section.titleAr}
                      </h2>
                      <div className="p-8 sm:p-10 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] text-sm sm:text-base text-gray-800 font-cairo leading-relaxed whitespace-pre-line shadow-sm">
                        {isArabic ? section.contentAr : section.contentEn || section.contentAr}
                      </div>
                    </div>
                  </section>
                );
              }

              return null;
            })}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. FULL INCI COMPOSITION ACCORDION                                    */}
      {/* ===================================================================== */}
      {pb.inciEnabled !== false && (
        <section className="py-16 bg-[#f4f1e6] border-b border-[#e2e8c0]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm">
              <button
                type="button"
                onClick={() => setOpenInci(!openInci)}
                className="w-full flex items-center justify-between text-start font-amiri text-xl sm:text-2xl font-bold text-[#485c36] cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Dna className="w-5 h-5 text-[#485c36]" />
                  <span>
                    {isArabic
                      ? pb.inciTitleAr || customSettings.productInciTitle || "قائمة المكونات التفصيلية الكاملة (Full INCI)"
                      : pb.inciTitleEn || customSettings.productInciTitle || "Full INCI Composition"}
                  </span>
                </div>
                {openInci ? (
                  <ChevronUp className="w-5 h-5 text-[#485c36]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {openInci && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-700 font-mono leading-relaxed space-y-3">
                  <p>
                    {isArabic
                      ? pb.inciContentAr ||
                        "Aqua (Purified Water), Medical-grade Urea (30%), Ammonium Lactate (10%), Salicylic Acid (2%), Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Butyrospermum Parkii (Shea Butter), Caprylic/Capric Triglyceride, Glycerin, Dimethicone, Allantoin, Panthenol (Vitamin B5), Tocopheryl Acetate (Vitamin E), Xanthan Gum, Carbomer, Phenoxyethanol, Ethylhexylglycerin."
                      : pb.inciContentEn ||
                        "Aqua (Purified Water), Medical-grade Urea (30%), Ammonium Lactate (10%), Salicylic Acid (2%), Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Butyrospermum Parkii (Shea Butter), Caprylic/Capric Triglyceride, Glycerin, Dimethicone, Allantoin, Panthenol (Vitamin B5), Tocopheryl Acetate (Vitamin E), Xanthan Gum, Carbomer, Phenoxyethanol, Ethylhexylglycerin."}
                  </p>
                  <p className="text-[11px] text-gray-500 font-cairo">
                    {isArabic
                      ? "خالٍ من العطور الاصطناعية، البارابين، والزيوت المعدنية المسدة للمسام. مصادق عليه سريرياً."
                      : "Formulated without synthetic fragrance, parabens, or comedogenic mineral oils. Dermatologically tested."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* 6. BRAND SIGNATURE & CALLIGRAPHY VERSE                                */}
      {/* ===================================================================== */}
      {pb.signatureEnabled !== false && (
        <section className="py-24 bg-gradient-to-b from-[#18271b] via-[#1f3322] to-[#142217] text-[#f6f9e6] relative overflow-hidden text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <span className="font-mono text-xs tracking-[0.28em] uppercase text-[#f3a5a1] font-bold block">
              SULAF CLINICAL SIGNATURE
            </span>

            <p className="font-amiri text-2xl sm:text-4xl text-[#f6f9e6] leading-relaxed">
              &quot;
              {isArabic
                ? pb.signatureArabic || "وما الحُسنُ في الأجسادِ إلا دلالةٌ • على رقةٍ في الروحِ لا تتكلّفُ"
                : pb.signatureTranslation ||
                  "Beauty on the skin is but a quiet reflection of an effortless grace within the soul."}
              &quot;
            </p>

            <span className="font-cormorant italic text-sm text-[#c5b37a] block">
              {pb.signatureAuthor || "Sulaf Cosmeceuticals Laboratories"}
            </span>
          </div>
        </section>
      )}
    </div>
  );
}

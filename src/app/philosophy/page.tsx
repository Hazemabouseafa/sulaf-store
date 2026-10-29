"use client";

import React from "react";
import Link from "next/link";
import { PearlOrbs } from "@/components/motion/PearlOrbs";
import { Dna, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { usePageContent } from "@/lib/pages/use-page-content";

export default function PhilosophyPage() {
  const { settings } = useStoreSettings();
  const { isArabic, dir } = useLanguage();
  const { page } = usePageContent("philosophy");

  const elements = settings?.elementsVisibility || {};
  const custom = (isArabic ? settings?.customContent : settings?.customContentEn) || settings?.customContent || {};

  if (page && !page.published && typeof window !== "undefined" && !localStorage.getItem("sulaf_admin_auth")) {
    return (
      <div className="py-24 bg-[#f4f1e6] min-h-screen text-[#1c2616] font-cairo flex items-center justify-center px-4" dir={dir}>
        <div className="max-w-md w-full bg-[#fdfef8] p-8 rounded-3xl border border-[#dbe2bd] text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#fbf9f0] border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="font-amiri text-2xl font-bold text-gray-900">
            {isArabic ? "الصفحة غير متوفرة حالياً" : "Page Not Found"}
          </h2>
          <p className="text-xs text-gray-500">
            {isArabic ? "هذه الصفحة مسودة غير منشورة في الوقت الحالي." : "This page is currently unpublished."}
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#485c36] text-white text-xs font-bold">
            <span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = (isArabic ? page?.titleAr : (page?.titleEn || page?.titleAr)) || custom.philosophyHeadingText || (isArabic ? "الفلسفة العلاجية ومفهوم الـ Cosmeceuticals" : "Therapeutic Philosophy & Cosmeceuticals");
  const rawContent = isArabic ? page?.contentAr : (page?.contentEn || page?.contentAr);

  return (
    <div className="py-16 bg-[#f4f1e6] min-h-screen text-[#222b1a] font-cairo" dir={dir}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          {elements.philosophyBadgeVis !== false && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold">
              <Dna className="w-3.5 h-3.5" />
              <span>{custom.philosophyBadgeText || (isArabic ? "مختبر سلاف للأبحاث السريرية" : "Sulaf Clinical Research Lab")}</span>
            </div>
          )}

          {elements.philosophyHeadingVis !== false && (
            <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#485c36]">
              {title}
            </h1>
          )}

          {page?.subtitleAr && (
            <p className="text-sm text-gray-700 max-w-2xl mx-auto leading-relaxed">
              {isArabic ? page.subtitleAr : (page.subtitleEn || page.subtitleAr)}
            </p>
          )}
        </div>

        {rawContent ? (
          <div
            className="p-8 sm:p-12 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm text-gray-800 leading-[2.2] space-y-4
              [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2
              [&_h3]:font-amiri [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#610b0d] [&_h3]:pt-2
              [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-gray-700
              [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-2
              [&_strong]:text-gray-900 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm space-y-2">
              <span className="font-amiri text-2xl font-bold text-[#485c36] block">1. كسر الكيراتين المتصلب</span>
              <p className="text-xs text-gray-600 leading-relaxed">باستخدام اليوريا 30% لتفكيك الروابط بين خلايا الكيراتين المتراكمة.</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm space-y-2">
              <span className="font-amiri text-2xl font-bold text-[#610b0d] block">2. تنقية المسام العميقة</span>
              <p className="text-xs text-gray-600 leading-relaxed">عبر حمض الساليسيليك BHA المحب للدهون لاختراق أعماق بصيلات الشعر.</p>
            </div>
            <div className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm space-y-2">
              <span className="font-amiri text-2xl font-bold text-[#d4af37] block">3. إعادة بناء الحاجز الدهني</span>
              <p className="text-xs text-gray-600 leading-relaxed">بواسطة السيراميدات المتطابقة حيوياً لمنع ارتداد الجفاف نهائياً.</p>
            </div>
          </div>
        )}

        {/* Interactive Molecules Section */}
        {(elements.philosophyMoleculesVis !== false || elements.philosophyOrbsVis !== false) && (
          <div className="text-center pt-8">
            {elements.philosophyMoleculesVis !== false && (
              <h2 className="font-amiri text-3xl font-bold text-[#485c36] mb-2">
                {custom.philosophyMoleculesTitle || (isArabic ? "فحص الجزيئات الكيميائية لتركيبة سلاف" : "Chemical Molecules Inspection of Sulaf Formula")}
              </h2>
            )}
            {elements.philosophyOrbsVis !== false && (
              <PearlOrbs className="mt-4" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

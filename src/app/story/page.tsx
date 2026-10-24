"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AndalusianPattern } from "@/components/brand/AndalusianPattern";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { usePageContent } from "@/lib/pages/use-page-content";
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Heart, FileText } from "lucide-react";

export default function StoryPage() {
  const { settings } = useStoreSettings();
  const { isArabic, dir } = useLanguage();
  const { page } = usePageContent("story");

  const elements = settings?.elementsVisibility || {};
  const custom = (isArabic ? settings?.customContent : settings?.customContentEn) || settings?.customContent || {};

  if (page && !page.published && typeof window !== "undefined" && !localStorage.getItem("sulaf_admin_auth")) {
    return (
      <div className="py-24 bg-[#f6f9e6] min-h-screen text-[#1c2616] font-cairo flex items-center justify-center px-4" dir={dir}>
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#dbe2bd] text-center space-y-4 shadow-sm">
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

  const rawContent = isArabic ? page?.contentAr : (page?.contentEn || page?.contentAr);

  return (
    <div className="py-20 bg-[#f6f9e6] min-h-screen text-[#1c2616] font-cairo selection:bg-[#485c36] selection:text-[#f6f9e6]" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Brand Tagline Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-20 h-20 mx-auto relative flex items-center justify-center bg-white rounded-3xl border border-[#dbe2bd] shadow-sm p-3"
          >
            <Image
              src="/brand/sulaf-flower-symbol.png"
              alt="سُلاف | Sulaf"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </motion.div>

          <div className="space-y-1 pt-2">
            <h1 className="font-amiri text-3xl sm:text-4xl font-black text-[#1c2616] tracking-wide">
              {isArabic ? page?.titleAr : (page?.titleEn || page?.titleAr)}
            </h1>
            <p className="font-amiri text-lg text-[#610b0d] font-bold tracking-wider">
              {isArabic ? page?.subtitleAr : (page?.subtitleEn || page?.subtitleAr)}
            </p>
          </div>
        </div>

        {rawContent ? (
          <div
            className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm text-gray-800 leading-[2.2] space-y-4 relative overflow-hidden
              [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2
              [&_h3]:font-amiri [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#610b0d] [&_h3]:pt-2
              [&_p]:text-sm [&_p]:text-gray-700
              [&_blockquote]:border-s-4 [&_blockquote]:border-[#d4af37] [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:bg-[#fbf9f0] [&_blockquote]:py-2
              [&_strong]:text-gray-900 [&_strong]:font-bold"
          >
            <AndalusianPattern opacity={0.03} color="#485c36" scale={1.2} />
            <div dangerouslySetInnerHTML={{ __html: rawContent }} />
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm">
            <p className="text-gray-700">قصة سُلاف والهوية الأندلسية...</p>
          </div>
        )}
      </div>
    </div>
  );
}

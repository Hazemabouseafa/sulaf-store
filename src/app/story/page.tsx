"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AndalusianPattern } from "@/components/brand/AndalusianPattern";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { usePageContent } from "@/lib/pages/use-page-content";
import { Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Heart, FileText, ShoppingBag } from "lucide-react";

export default function StoryPage() {
  const { settings } = useStoreSettings();
  const { isArabic, dir } = useLanguage();
  const { page } = usePageContent("story");

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

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

  const title = (isArabic ? page?.titleAr : (page?.titleEn || page?.titleAr)) || "SULAF | سُلاف";
  const subtitle = (isArabic ? page?.subtitleAr : (page?.subtitleEn || page?.subtitleAr)) || "Where Pharmaceutical Science Meets Beauty.";
  const rawContent = isArabic ? page?.contentAr : (page?.contentEn || page?.contentAr);

  return (
    <div className="py-16 sm:py-24 bg-[#f4f1e6] min-h-screen text-[#1c2616] font-cairo selection:bg-[#485c36] selection:text-[#f6f9e6] relative overflow-hidden" dir={dir}>
      {/* Background Andalusian Motifs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <AndalusianPattern opacity={0.35} color="#485c36" scale={1.5} />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-24 h-24 mx-auto relative flex items-center justify-center bg-[#fdfef8] rounded-3xl border-2 border-[#dbe2bd] shadow-md p-4 group hover:border-[#485c36] transition-colors"
          >
            <Image
              src="/brand/sulaf-flower-symbol.png"
              alt="سُلاف | Sulaf"
              width={64}
              height={64}
              className="object-contain transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-2 pt-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold border border-[#485c36]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isArabic ? "الهوية والفلسفة" : "Identity & Philosophy"}</span>
            </span>

            <h1 className={`${isArabic ? "font-gulzar" : "font-cinzel"} text-3xl sm:text-4xl md:text-5xl font-black text-[#1c2616] tracking-wide`}>
              {title}
            </h1>
            <p className={`${isArabic ? "font-gulzar" : "font-cormorant"} text-lg sm:text-xl text-[#610b0d] font-bold tracking-wider`}>
              {subtitle}
            </p>
          </motion.div>
        </div>

        {/* Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="p-8 sm:p-14 rounded-3xl bg-[#fdfef8] backdrop-blur-xs border-2 border-[#e2e8c0] shadow-xl text-gray-800 leading-[2.3] space-y-6 relative overflow-hidden text-center sm:text-start"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#485c36] via-[#d4af37] to-[#610b0d]" />
          
          {rawContent ? (
            <div
              className="space-y-6 text-gray-800 text-sm sm:text-base
                [&_p]:leading-[2.2]
                [&_blockquote]:border-s-4 [&_blockquote]:border-[#d4af37] [&_blockquote]:ps-6 [&_blockquote]:pe-4 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-[#fbf9f0] [&_blockquote]:rounded-2xl [&_blockquote]:font-gulzar [&_blockquote]:text-lg sm:[&_blockquote]:text-xl [&_blockquote]:text-gray-900 [&_blockquote]:shadow-2xs
                [&_strong]:text-gray-900 [&_strong]:font-bold"
              dangerouslySetInnerHTML={{ __html: rawContent }}
            />
          ) : (
            <div className="space-y-6 text-gray-800 text-base leading-[2.2]">
              <p className="text-base sm:text-lg leading-relaxed font-semibold text-[#485c36]">
                {isArabic
                  ? "من جذورٍ عربية، بروحٍ أندلسية، وبرؤيةٍ معاصرة، تأتي سُلاف لتعيد صياغة مفهوم العناية بالبشرة."
                  : "From Arab roots, with an Andalusian soul, and a contemporary vision, Sulaf arrives to redefine skincare."}
              </p>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {isArabic
                  ? "نمزج العلم الصيدلاني بفلسفة الجمال، لنقدّم عنايةً تبدأ من فهم البشرة، وتُصاغ بمعرفة، وتُقدَّم بروحٍ من الرفق."
                  : "We blend pharmaceutical science with the philosophy of beauty, delivering care that begins with understanding the skin, formulated with knowledge, and presented with gentle grace."}
              </p>

              <blockquote className="my-6 border-s-4 border-[#d4af37] ps-6 pe-4 py-4 italic bg-[#fbf9f0] rounded-2xl font-gulzar text-lg sm:text-xl text-gray-900 text-start shadow-2xs leading-relaxed">
                {isArabic
                  ? "«لسنا مجرد عنايةٍ تُضاف إلى روتينك؛ بل فلسفة ترى في كل تفصيلة علمًا، وفي كل خطوة عناية، وفي الجمال حكايةً تستحق أن تُروى.»"
                  : "“We are not merely care added to your routine; we are a philosophy that sees science in every detail, devotion in every step, and a story worthy of telling in beauty.”"}
              </blockquote>

              <p className="text-base sm:text-lg font-bold font-gulzar text-[#610b0d] text-center pt-2">
                {isArabic
                  ? "سُلاف | علمٌ يُلهم العناية، وجمالٌ تحكيه الهوية."
                  : "SULAF | Science Inspiring Care, Beauty Telling Identity."}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-8 border-t border-[#e2e8c0] flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#485c36] hover:bg-[#3d502d] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isArabic ? "اكتشفي مستحضرات سُـلاف" : "Explore Sulaf Collection"}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>

            <Link
              href="/product/absolutes-smoothing-body-cream"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#f4f1e6] hover:bg-[#e8ecd0] text-[#485c36] border border-[#dbe2bd] text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>{isArabic ? "كريم سُـلاف لتنعيم وترميم البشرة" : "Absolutes Smoothing Body Cream"}</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

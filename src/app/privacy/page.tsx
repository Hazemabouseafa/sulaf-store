"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileText } from "lucide-react";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { usePageContent } from "@/lib/pages/use-page-content";

export default function PrivacyPage() {
  const { settings } = useStoreSettings();
  const { isArabic, dir } = useLanguage();
  const { page } = usePageContent("privacy");

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

  const title = (isArabic ? page?.titleAr : (page?.titleEn || page?.titleAr)) || (isArabic ? "سياسة الخصوصية وحماية البيانات" : "Privacy Policy");
  const rawContent = isArabic ? page?.contentAr : (page?.contentEn || page?.contentAr);

  return (
    <div className="py-16 bg-[#f6f9e6] min-h-screen text-[#222b1a] font-cairo" dir={dir}>
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="space-y-2 text-center sm:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isArabic ? "سُـلاف | حماية وسرية البيانات" : "Sulaf | Privacy & Security"}</span>
          </div>
          <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
            {title}
          </h1>
          {page?.subtitleAr && (
            <p className="text-xs sm:text-sm text-gray-600">
              {isArabic ? page.subtitleAr : (page.subtitleEn || page.subtitleAr)}
            </p>
          )}
        </div>

        {rawContent ? (
          <div
            className="p-8 sm:p-10 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm text-gray-800 leading-[2.2] space-y-4
              [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:pt-2 [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2
              [&_h3]:font-amiri [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#610b0d] [&_h3]:pt-2
              [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-gray-700
              [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5
              [&_strong]:text-gray-900 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        ) : (
          <div className="p-8 rounded-3xl bg-white border border-[#e2e8c0] space-y-4 text-xs text-gray-700 leading-relaxed shadow-sm">
            <p>
              {isArabic
                ? "نلتزم في سُلاف بأقصى معايير السرية والأمان لحماية بيانات عميلاتنا وعملائنا الكرام. لا نقوم بمشاركة أي معلومات شخصية مع أي جهة خارجية."
                : "At Sulaf, we uphold strict standards of confidentiality and security to safeguard our clients' data."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { usePageContent } from "@/lib/pages/use-page-content";

export default function TermsPage() {
  const { settings } = useStoreSettings();
  const { isArabic, dir } = useLanguage();
  const { page } = usePageContent("terms");

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

  const title = (isArabic ? page?.titleAr : (page?.titleEn || page?.titleAr)) || custom.termsTitleText || (isArabic ? "الشروط والأحكام" : "Terms & Conditions");
  const rawContent = isArabic ? page?.contentAr : (page?.contentEn || page?.contentAr);

  return (
    <div className="py-16 bg-[#f4f1e6] min-h-screen text-[#222b1a] font-cairo" dir={dir}>
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="space-y-2 text-center sm:text-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold">
            <FileText className="w-3.5 h-3.5" />
            <span>{isArabic ? "سُـلاف | السياسات واللوائح" : "Sulaf | Policies & Terms"}</span>
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
            className="p-8 sm:p-10 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm text-gray-800 leading-[2.2] space-y-4
              [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:pt-2 [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2
              [&_h3]:font-amiri [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#610b0d] [&_h3]:pt-2
              [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-gray-700
              [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5
              [&_strong]:text-gray-900 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        ) : (
          <div className="p-8 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] space-y-4 text-xs text-gray-700 leading-relaxed shadow-sm">
            {elements.termsIntroVis !== false && (
              <p>
                {custom.termsIntroText || (isArabic
                  ? "أهلاً بكم في متجر سُلاف الرسمي. تنظم هذه الشروط استخدامكم للموقع وعمليات شراء مستحضرات Cosmeceuticals."
                  : "Welcome to Sulaf official store. These terms govern your usage and purchase of our cosmeceutical formulations.")}
              </p>
            )}

            {elements.termsDepositVis !== false && (
              <div className="space-y-1">
                <h3 className="font-bold text-[#485c36] text-sm">
                  {custom.termsDepositTitle || (isArabic ? "تأكيد الطلب والشحن:" : "Order Confirmation & Shipping:")}
                </h3>
                <p>
                  {custom.termsDepositText || (isArabic
                    ? "يتم تجهيز وشحن الطلبات بأعلى معايير الحفظ الصيدلاني والتوصيل السريع بالتعاون مع كبرى شركات الشحن المؤمّنة."
                    : "Orders are prepared under strict pharmaceutical safety standards and shipped via insured express couriers.")}
                </p>
              </div>
            )}

            {elements.termsInspectionVis !== false && (
              <div className="space-y-1">
                <h3 className="font-bold text-[#485c36] text-sm">
                  {custom.termsInspectionTitle || (isArabic ? "حق المعاينة والتسليم:" : "Inspection on Delivery:")}
                </h3>
                <p>
                  {custom.termsInspectionText || (isArabic
                    ? "يحق للعميل معاينة الطرد الخارجي والتأكد من سلامة التغليف قبل استلام الشحنة."
                    : "Clients retain full right to inspect external security packaging prior to receiving shipment.")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

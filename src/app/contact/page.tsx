"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail, MapPin, Send, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { usePageContent } from "@/lib/pages/use-page-content";

export default function ContactPage() {
  const { settings } = useStoreSettings();
  const { isArabic, dir } = useLanguage();
  const { page } = usePageContent("contact");

  const [formSent, setFormSent] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const elements = (settings?.elementsVisibility || {}) as any;
  const custom = ((isArabic ? settings?.customContent : settings?.customContentEn) || settings?.customContent || {}) as any;

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

  const title = (isArabic ? page?.titleAr : (page?.titleEn || page?.titleAr)) || custom.contactHeadingText || (isArabic ? "تواصل مع فريق سُـلاف" : "Contact Sulaf Care Team");
  const rawContent = isArabic ? page?.contentAr : (page?.contentEn || page?.contentAr);

  return (
    <div className="py-16 bg-[#f4f1e6] min-h-screen text-[#222b1a] font-cairo" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          {elements.contactBadgeVis !== false && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{custom.contactBadgeText || (isArabic ? "فريق الاستشارات الصيدلانية" : "Clinical Consultation Team")}</span>
            </div>
          )}

          {elements.contactHeadingVis !== false && (
            <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#485c36]">
              {title}
            </h1>
          )}

          {page?.subtitleAr && (
            <p className="text-sm text-gray-700 max-w-xl mx-auto leading-relaxed">
              {isArabic ? page.subtitleAr : (page.subtitleEn || page.subtitleAr)}
            </p>
          )}
        </div>

        {rawContent && (
          <div
            className="p-8 sm:p-10 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm text-gray-800 leading-[2.2] space-y-4
              [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2
              [&_h3]:font-amiri [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#610b0d]
              [&_p]:text-xs [&_p]:sm:text-sm [&_p]:text-gray-700
              [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5
              [&_strong]:text-gray-900 [&_strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: rawContent }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct channels */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 font-semibold">{isArabic ? "استشارة فورية عبر واتساب" : "Direct WhatsApp"}</span>
                <p className="font-bold text-gray-900 font-mono text-base">01099887766</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#610b0d]/10 text-[#610b0d] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 font-semibold">{isArabic ? "البريد الإلكتروني الرسمي" : "Email Support"}</span>
                <p className="font-bold text-gray-900 font-mono text-base">care@sulaf.com</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 text-[#91751d] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 font-semibold">{isArabic ? "مقر المختبر الصيدلاني" : "Clinical Lab"}</span>
                <p className="font-bold text-gray-900 text-sm">{isArabic ? "القاهرة الجديدة، التجمع الخامس، مصر" : "New Cairo, Egypt"}</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="p-8 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm space-y-4">
            <h3 className="font-amiri text-xl font-bold text-gray-900">
              {isArabic ? "أرسلي استفساركِ مباشرة" : "Send an Inquiry"}
            </h3>

            {formSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">{isArabic ? "تم استلام رسالتكِ بنجاح!" : "Message received!"}</p>
                <p className="text-xs text-emerald-700">{isArabic ? "سيتواصل معكِ أحد صيادلتنا خلال ساعات قليلة." : "We will reply shortly."}</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSent(true);
                  try {
                    const wa = (settings?.contacts?.whatsapp || "201099887766").replace(/[^0-9]/g, "");
                    const msg = encodeURIComponent(
                      `استشارة جديدة عبر متجر سُلاف:\nالاسم: ${senderName}\nالهاتف: ${senderPhone}\nالاستفسار: ${senderMessage}`
                    );
                    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
                  } catch {}
                }}
                className="space-y-3"
              >
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={isArabic ? "الاسم الكريم" : "Your Name"}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                />
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder={isArabic ? "رقم الهاتف / واتساب" : "Phone / WhatsApp"}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                />
                <textarea
                  rows={3}
                  required
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  placeholder={isArabic ? "اكتبي استفساركِ أو تفاصيل حالتكِ هنا..." : "Your question or consultation details..."}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#485c36] hover:bg-[#38482a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isArabic ? "إرسال الاستفسار الآن" : "Send Consultation"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

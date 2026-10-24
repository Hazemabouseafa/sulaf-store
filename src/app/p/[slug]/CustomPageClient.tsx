"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import { AndalusianPattern } from "@/components/brand/AndalusianPattern";
import { Sparkles, ArrowRight, ArrowLeft, MessageCircle, FileText, ShoppingBag, ShieldCheck } from "lucide-react";

export interface StorePage {
  id: string;
  slug: string;
  route: string;
  type: "builtin" | "custom";
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  contentAr?: string;
  contentEn?: string;
  published: boolean;
  updatedAt: string;
}

interface CustomPageClientProps {
  slug: string;
  initialPage: StorePage | null;
}

export default function CustomPageClient({ slug, initialPage }: CustomPageClientProps) {
  const { isArabic, dir } = useLanguage();
  const [page, setPage] = useState<StorePage | null>(initialPage);
  const [loading, setLoading] = useState(!initialPage);

  useEffect(() => {
    if (!initialPage && slug) {
      async function loadPage() {
        try {
          const res = await fetch("/api/pages", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const found = (data.pages || []).find((p: StorePage) => p.slug === slug);
            setPage(found || null);
          }
        } catch (err) {
          console.error("Failed to load page:", err);
        } finally {
          setLoading(false);
        }
      }
      loadPage();
    }
  }, [slug, initialPage]);

  if (loading) {
    return (
      <div className="py-24 bg-[#f6f9e6] min-h-screen flex items-center justify-center font-cairo">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#485c36] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-600 font-bold">
            {isArabic ? "جاري تحميل محتوى الصفحة..." : "Loading page..."}
          </p>
        </div>
      </div>
    );
  }

  if (!page || (!page.published && typeof window !== "undefined" && !localStorage.getItem("sulaf_admin_auth"))) {
    return (
      <div className="py-24 bg-[#f6f9e6] min-h-screen text-[#1c2616] font-cairo flex items-center justify-center px-4" dir={dir}>
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#dbe2bd] text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#fbf9f0] border border-[#d4af37]/40 flex items-center justify-center mx-auto text-[#d4af37]">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-amiri text-2xl font-bold text-gray-900">
              {isArabic ? "الصفحة غير متوفرة حالياً" : "Page Not Found"}
            </h2>
            <p className="text-xs text-gray-500">
              {isArabic
                ? "قد تكون هذه الصفحة قيد التحديث أو مسودة غير منشورة في الوقت الحالي."
                : "This page is either in draft mode or currently unpublished."}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#485c36] hover:bg-[#38482a] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>{isArabic ? "العودة للرئيسية" : "Back to Home"}</span>
              {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = isArabic ? page.titleAr : (page.titleEn || page.titleAr);
  const subtitle = isArabic ? page.subtitleAr : (page.subtitleEn || page.subtitleAr);
  const rawContent = isArabic ? (page.contentAr || page.contentEn) : (page.contentEn || page.contentAr);

  return (
    <div className="py-16 sm:py-20 bg-[#f6f9e6] min-h-screen text-[#1c2616] font-cairo" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#485c36] transition-colors">
            {isArabic ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-[#485c36] font-bold truncate">{title}</span>
        </nav>

        {/* Page Header */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm relative overflow-hidden space-y-4">
          <AndalusianPattern opacity={0.03} color="#485c36" scale={1.4} />

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isArabic ? "سُـلاف | منشورات ومقالات رسمية" : "Sulaf | Official Publications"}</span>
            </div>

            <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#1c2616] leading-[1.3]">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="pt-2 text-[11px] text-gray-500 flex items-center gap-3">
              <span>{isArabic ? "آخر تحديث:" : "Last Updated:"} {page.updatedAt}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? "موثق معملياً" : "Verified Publication"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm relative overflow-hidden">
          <div
            className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-[2] sm:leading-[2.2] space-y-4
              [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:pt-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-100
              [&_h3]:font-amiri [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#610b0d] [&_h3]:pt-3
              [&_p]:text-gray-700 [&_p]:text-sm [&_p]:sm:text-base
              [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-2
              [&_li]:text-gray-700 [&_li]:text-xs [&_li]:sm:text-sm
              [&_strong]:text-[#1c2616] [&_strong]:font-bold
              [&_blockquote]:border-s-4 [&_blockquote]:border-[#d4af37] [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:bg-[#fbf9f0] [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl"
            dangerouslySetInnerHTML={{ __html: rawContent || "" }}
          />
        </div>

        {/* Footer Actions & Direct WhatsApp Consultation */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2c3821] to-[#1c2616] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="font-amiri text-xl font-bold text-[#fbf9f0]">
              {isArabic ? "هل لديكِ استفسار حول هذه الصفحة؟" : "Have questions about this topic?"}
            </h3>
            <p className="text-xs text-[#f6f9e6]/80">
              {isArabic ? "فريقنا الصيدلاني متواجد دائماً لتقديم المساعدة والاستشارة مجاناً." : "Our clinical pharmacists are ready to help."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/201099887766"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white text-[#2c3821] font-bold text-xs flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-green-700" />
              <span>{isArabic ? "استشارة عبر واتساب" : "WhatsApp"}</span>
            </a>

            <Link
              href="/shop"
              className="px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c49e28] text-black font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isArabic ? "استكشاف المستحضرات" : "Shop"}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

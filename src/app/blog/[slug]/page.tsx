"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MOCK_BLOG_POSTS } from "@/lib/data/mock-data";
import { Clock, ArrowRight, ArrowLeft, BookOpen, User, Calendar } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug) || MOCK_BLOG_POSTS[0];

  return (
    <div className="py-16 bg-[#f4f1e6] min-h-screen text-[#222b1a]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-cairo font-bold text-[#485c36] hover:underline"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة لمجلة سلاف</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-cairo text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#485c36] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {post.readTimeAr}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          </div>

          <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36] leading-tight">
            {post.titleAr}
          </h1>

          <p className="font-cairo text-sm text-gray-600 font-semibold border-r-4 border-[#610b0d] pr-4 py-1">
            {post.excerptAr}
          </p>
        </header>

        {/* Article Body */}
        <div className="p-8 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-6 font-cairo text-sm text-gray-700 leading-relaxed">
          <p>
            تُعد اليوريا أحد أهم العوامل الطبيعية المرطبة (Natural Moisturizing Factor - NMF) التي تُنتجها خلايا البشرة السليمة ذاتياً للاحتفاظ بالماء. ولكن في حالات التقرن الشعري (Keratosis Pilaris)، المعروف شعبياً بـ "جلد الوزة"، يفرز الجلد كميات مفرطة ومتصلبة من الكيراتين تسد فوهات بصيلات الشعر، مما يتسبب في بروز حبيبات خشنة داكنة اللون.
          </p>

          <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
            كيف تعمل اليوريا بتركيز 30% على الصعيد السريري؟
          </h3>
          <p>
            عندما ترتفع نسبة اليوريا إلى 30%، فإن وظيفتها تتجاوز مجرد الترطيب الخارجي وتتحول إلى عامل مذيب للروابط الكيراتينية الميتة (Keratolytic Action). تعمل اليوريا على كسر الروابط الهيدروجينية بين ألياف البروتين القاسية في الطبقة القرنية، مما يفكك الحبيبات الخشنة المتراكمة ويسمح بتقشيرها فسيولوجياً دون أي خدوش ميكانيكية.
          </p>

          <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
            التآزر مع حمض الساليسيليك 2% والسيراميدات
          </h3>
          <p>
            في تركيبة <strong className="text-[#610b0d]">Absolutes Smoothing Body Cream</strong>، تم دعم اليوريا بحمض الساليسيليك الطبي 2% الذي يتغلغل بعمق داخل مسام الدهون المسببة للاحمرار، وبمركب السيراميدات المعملي الذي يغلق فجوات الرطوبة ويحمي الحاجز الطبيعي من التلف.
          </p>

          <div className="pt-6 border-t border-[#e2e8c0] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#f4f1e6] p-4 rounded-2xl">
            <div>
              <strong className="block text-xs font-bold text-[#485c36]">
                جربي التركيبة السريرية الآن:
              </strong>
              <span className="text-[11px] text-gray-600">
                Absolutes Smoothing Body Cream (30% Urea • 10% Ammonium Lactate • 2% Salicylic Acid)
              </span>
            </div>

            <Link
              href="/product/absolutes-smoothing-body-cream"
              className="px-5 py-2.5 rounded-xl bg-[#485c36] text-white font-bold text-xs hover:bg-[#3a4a2b] transition-colors"
            >
              طلب المستحضر بعربون 100 ج.م
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

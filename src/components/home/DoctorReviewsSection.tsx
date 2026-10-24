"use client";

import React from "react";
import { Star, ShieldCheck, Quote, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";

export function DoctorReviewsSection() {
  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();
  const vis = settings.elementsVisibility || {
    reviewsBadge: true,
    reviewsHeading: true,
    reviewsDesc: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  const reviews = isArabic
    ? [
        {
          id: "rev-1",
          authorName: "د. ياسمين الشاذلي",
          title: "نتائج سريرية مبهرة على جلد الوزة",
          comment: "كنت أعاني من جلد الوزة في الذراعين لسنوات، وبعد 8 أيام فقط من استخدام Absolutes Smoothing Body Cream اختفت الحبوب الخشنة تماماً وأصبح ملمس الجلد فائق النعومة. تركيبة عالمية تضاهي أفضل المستحضرات الفرنسية.",
          date: "منذ 3 أيام",
          rating: 5,
          isVerifiedPurchase: true,
        },
        {
          id: "rev-2",
          authorName: "مريم عبد الرحمن",
          title: "أفضل كريم يوريا جربته في حياتي",
          comment: "عادة كريمات اليوريا تكون لزجة أو لها رائحة كريهة، لكن سلاف أبدعوا! قوام كريمي راقي يمتص بسرعة فائقة وترطيب يدوم ليومين كاملين. دفعت عربون 100 جنيه واستلمت الطلب خلال 48 ساعة فقط بتوصيل فوري.",
          date: "منذ أسبوع",
          rating: 5,
          isVerifiedPurchase: true,
        },
        {
          id: "rev-3",
          authorName: "نورهان كمال",
          title: "علاج فوري لتشقق الكعبين والركب",
          comment: "نتيجته مع الأكواع والركب سحرية، من أول يومين النتيجة واضحة. تجربة الشراء والدفع السلسة وتغليف البراند الفاخر يشعرك بالفخامة الحقيقية.",
          date: "منذ أسبوعين",
          rating: 5,
          isVerifiedPurchase: true,
        },
      ]
    : [
        {
          id: "rev-1",
          authorName: "Dr. Yasmine El-Shazly",
          title: "Remarkable clinical efficacy on Keratosis Pilaris",
          comment: "I dealt with severe strawberry skin on my arms for years. Within 8 days of using Absolutes Smoothing Body Cream, the stubborn bumps dissolved completely, leaving pure silk texture. Comparable to prestigious French dermocosmetics.",
          date: "3 days ago",
          rating: 5,
          isVerifiedPurchase: true,
        },
        {
          id: "rev-2",
          authorName: "Mariam Abdelrahman",
          title: "The highest quality Urea cream I have ever used",
          comment: "Most 30% urea creams are sticky or unpleasant. Sulaf perfected this! Elegant velvety texture, ultra-fast absorption, and true 48-hour moisture lock. Reserved with a 100 EGP deposit and received it in 48 hours with direct doorstep delivery.",
          date: "1 week ago",
          rating: 5,
          isVerifiedPurchase: true,
        },
        {
          id: "rev-3",
          authorName: "Nourhan Kamal",
          title: "Immediate transformation for elbows & heels",
          comment: "Noticeable softening from day 2. The seamless deposit payment flow and royal Andalusian packaging make the entire unboxing experience feel truly bespoke.",
          date: "2 weeks ago",
          rating: 5,
          isVerifiedPurchase: true,
        },
      ];

  return (
    <section className="py-20 bg-[#f6f9e6] text-[#222b1a] relative font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {vis.reviewsBadge !== false && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-[#485c36]" />
              <span>{custom.reviewsBadgeText || t.reviews.badge}</span>
            </div>
          )}
          {vis.reviewsHeading !== false && (
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
              {custom.reviewsHeadingText || t.reviews.heading}
            </h2>
          )}
          {vis.reviewsDesc !== false && (
            <p className="mt-2 text-xs sm:text-sm text-gray-600 font-cairo">
              {custom.reviewsDescText || t.reviews.desc}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative group text-start"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#485c36]/20" />
                </div>

                <h3 className="font-cairo text-base font-bold text-[#1c2616] mb-2">
                  {rev.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-800 font-cairo font-medium leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#e2e8c0] flex items-center justify-between">
                <div>
                  <span className="font-cairo text-sm font-bold text-[#3d502d] block">
                    {rev.authorName}
                  </span>
                  <span className="text-[10px] text-gray-500 font-cairo">{rev.date}</span>
                </div>

                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{t.reviews.verified}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

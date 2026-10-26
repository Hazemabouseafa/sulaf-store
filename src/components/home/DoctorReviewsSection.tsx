"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Quote, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ReviewItem } from "@/lib/reviews/review-store";

export function DoctorReviewsSection() {
  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // If reviews section is hidden in settings, don't render anything
  if (settings.sectionsVisibility?.reviewsSection === false) {
    return null;
  }

  const vis = settings.elementsVisibility || {
    reviewsBadge: true,
    reviewsHeading: true,
    reviewsDesc: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  useEffect(() => {
    fetch("/api/reviews?status=APPROVED")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.reviews)) {
          setReviews(d.reviews);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // If no approved reviews yet, don't show fake reviews
  if (!loading && reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#f6f9e6] text-[#222b1a] relative font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {vis.reviewsBadge !== false && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
              <ShieldCheck className="w-4 h-4 text-[#485c36]" />
              <span>{custom.reviewsBadgeText || (isArabic ? "تجارب حقيقية موثقة" : "Verified Clinical Reviews")}</span>
            </div>
          )}
          {vis.reviewsHeading !== false && (
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
              {custom.reviewsHeadingText || (isArabic ? "تجارب أطباء الجلدية وعملاء سُـلاف" : "Endorsed by Dermatologists & Verified Clients")}
            </h2>
          )}
          {vis.reviewsDesc !== false && (
            <p className="mt-2 text-xs sm:text-sm text-gray-600 font-cairo">
              {custom.reviewsDescText || (isArabic ? "آراء حقيقية موثقة من عملاء وأطباء جربوا تركيبة سُـلاف السريرية." : "Real verified experiences from dermatologists and clients.")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-white border border-[#e2e8c0] hover:border-[#485c36] shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group text-start"
            >
              <div>
                {/* Star rating in crimson #ca384a */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ca384a] text-[#ca384a]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#485c36]/20" />
                </div>

                {rev.title && (
                  <h3 className="font-cairo text-base font-bold text-[#1c2616] mb-2">
                    {rev.title}
                  </h3>
                )}
                <p className="text-xs sm:text-sm text-gray-800 font-cairo font-medium leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#e2e8c0] flex items-center justify-between">
                <div>
                  <span className="font-cairo text-sm font-bold text-[#485c36] block">
                    {rev.authorName}
                  </span>
                  <span className="text-[10px] text-gray-500 font-cairo">
                    {rev.authorRole || (isArabic ? "عميل موثق" : "Verified Customer")}
                  </span>
                </div>

                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#485c36] bg-[#485c36]/10 px-2.5 py-0.5 rounded-full border border-[#485c36]/20">
                    <CheckCircle2 className="w-3 h-3 text-[#485c36]" />
                    <span>{isArabic ? "شراء موثق" : "Verified"}</span>
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

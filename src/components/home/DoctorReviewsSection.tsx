"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, Send, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ReviewItem } from "@/lib/reviews/review-store";

export function DoctorReviewsSection() {
  const { isArabic } = useLanguage();
  const { settings } = useStoreSettings();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  if (settings.sectionsVisibility?.reviewsSection === false) {
    return null;
  }

  const vis = settings.elementsVisibility || {
    reviewsBadge: true,
    reviewsHeading: true,
    reviewsDesc: true,
  };
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setSubmitError(isArabic ? "يرجى إدخال الاسم ونص التقييم." : "Please enter your name and review.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "prod-absolutes-cream",
          productName: "Absolutes Smoothing Body Cream",
          authorName: authorName.trim(),
          authorRole: isArabic ? "عميلة موثقة" : "Verified Client",
          rating,
          title: "",
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setAuthorName("");
        setComment("");
        setRating(5);
      } else {
        setSubmitError(data.error || (isArabic ? "تعذر إرسال التقييم." : "Failed to submit review."));
      }
    } catch {
      setSubmitError(isArabic ? "حدث خطأ في الاتصال." : "Network error.");
    } finally {
      setSubmitting(false);
    }
  }

  // IDEA #1: Quiet Apothecary Scroll — Continuous Warm Parchment (#f6f9e6) with thin ledger lines
  return (
    <section className="py-16 sm:py-24 bg-[#f6f9e6] text-[#485c36] font-cairo">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-10">
        
        <div className="pb-8 border-b border-[#485c36]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-start">
          <div className="space-y-1.5">
            {vis.reviewsBadge !== false && (
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#610b0d] block">
                {custom.reviewsBadgeText ||
                  (isArabic ? "دفتر التجارب الموثقة" : "CLINICAL TESTIMONIALS")}
              </span>
            )}
            {vis.reviewsHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-normal text-[#485c36]">
                {custom.reviewsHeadingText ||
                  (isArabic ? "شهادات وتجارب عميلات سُـلاف" : "Verified Client Notes")}
              </h2>
            )}
            {vis.reviewsDesc !== false && custom.reviewsDescText && (
              <p className="text-xs text-[#485c36]/75 max-w-md pt-0.5">
                {custom.reviewsDescText}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setSubmitSuccess(false);
            }}
            className="self-start sm:self-auto px-6 py-2.5 rounded-full border border-[#485c36] text-[#485c36] hover:bg-[#485c36] hover:text-[#f6f9e6] text-xs font-bold transition-colors cursor-pointer"
          >
            {custom.reviewsAddBtnText || (isArabic ? "تدوين تجربتكِ +" : "Write a Note +")}
          </button>
        </div>

        {showForm && (
          <div className="py-8 border-b border-[#485c36]/20 max-w-lg text-start relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-8 end-0 p-1 text-[#610b0d] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="py-4 flex items-center gap-2 text-xs font-bold text-[#485c36]">
                <CheckCircle2 className="w-4 h-4 text-[#485c36]" />
                <span>
                  {isArabic
                    ? "تم استلام تقييمكِ وسيُدرج في السجل بعد مراجعة الإدارة."
                    : "Your note has been received for verification."}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#610b0d]">
                    {isArabic ? "التقييم:" : "Rating:"}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= rating
                              ? "fill-[#ca384a] text-[#ca384a]"
                              : "text-[#485c36]/25"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={isArabic ? "الاسم الكريم *" : "Your Name *"}
                  className="w-full py-2.5 bg-transparent border-b border-[#485c36]/30 text-xs text-[#485c36] placeholder:text-[#485c36]/50 focus:outline-none focus:border-[#485c36]"
                />

                <textarea
                  rows={2}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isArabic ? "دوني تجربتكِ مع المستحضر... *" : "Your experience... *"}
                  className="w-full py-2.5 bg-transparent border-b border-[#485c36]/30 text-xs text-[#485c36] placeholder:text-[#485c36]/50 focus:outline-none focus:border-[#485c36]"
                />

                {submitError && (
                  <p className="text-xs font-bold text-[#ca384a]">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 rounded-full bg-[#485c36] text-[#f6f9e6] font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isArabic ? "إرسال للتوثيق" : "Submit"}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {!loading && reviews.length === 0 ? (
          <p className="text-xs text-[#485c36]/70 text-start py-2">
            {isArabic
              ? "يُعرض في هذا السجل فقط التجارب الحقيقية الموثقة لعميلات سُـلاف بعد الاستعمال."
              : "Only verified client notes are recorded here."}
          </p>
        ) : (
          <div className="divide-y divide-[#485c36]/15">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 text-start"
              >
                <p className="font-amiri text-xl text-[#485c36] max-w-2xl leading-relaxed">
                  «{rev.comment}»
                </p>
                <div className="shrink-0 font-mono text-xs text-[#610b0d]">
                  — {rev.authorName} ({rev.rating}/5)
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

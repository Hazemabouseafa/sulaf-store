"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, MessageSquarePlus, Send, X } from "lucide-react";
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

  // ACT III (Part 1): ROYAL BURGUNDY (#610b0d) VERIFIED TRUST BAND
  return (
    <section className="pt-20 pb-10 bg-[#610b0d] text-[#f6f9e6] relative overflow-hidden font-cairo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Simple Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#f6f9e6]/15 pb-5">
          <div className="text-start space-y-1">
            {vis.reviewsBadge !== false && (
              <span className="text-xs font-bold text-[#f3a5a1] block">
                {custom.reviewsBadgeText ||
                  (isArabic ? "المشهد الثالث • الثقة والتجارب الموثقة" : "Verified Reviews")}
              </span>
            )}

            {vis.reviewsHeading !== false && (
              <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#f6f9e6]">
                {custom.reviewsHeadingText ||
                  (isArabic ? "آراء عميلات سُـلاف" : "Client Experiences")}
              </h2>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setSubmitSuccess(false);
            }}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#f6f9e6] hover:bg-[#f3a5a1] text-[#610b0d] text-xs font-bold transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#ca384a]" />
            <span>{isArabic ? "أضيفي تقييمكِ" : "Add Review"}</span>
          </button>
        </div>

        {/* Simple Collapsible Form */}
        {showForm && (
          <div className="max-w-lg mx-auto p-6 rounded-3xl bg-[#f6f9e6] text-[#485c36] relative text-start">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 end-4 p-1.5 rounded-full text-[#610b0d] cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#485c36] mx-auto" />
                <p className="text-xs font-bold text-[#610b0d]">
                  {isArabic
                    ? "تم إرسال تقييمكِ بنجاح وسيظهر بعد مراجعة الإدارة ✓"
                    : "Review submitted for approval ✓"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-amiri text-xl font-bold text-[#610b0d]">
                    {isArabic ? "شاركينا رأيكِ" : "Your Feedback"}
                  </span>
                  <div className="flex items-center gap-1 pe-6">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none"
                />

                <textarea
                  rows={2}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isArabic ? "اكتبي تجربتكِ باختصار... *" : "Your review... *"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none"
                />

                {submitError && (
                  <p className="text-xs font-bold text-[#ca384a]">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-full bg-[#ca384a] text-[#f6f9e6] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isArabic ? "إرسال التقييم" : "Submit"}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Reviews Row or Minimalist Note */}
        {!loading && reviews.length === 0 ? (
          <p className="text-xs sm:text-sm text-[#f6f9e6]/80 text-center py-4">
            {isArabic
              ? "تُعرض هنا فقط التقييمات الحقيقية الموثقة لعميلات سُـلاف بعد التجربة."
              : "Only verified client reviews are displayed here."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="p-5 rounded-2xl bg-[#f6f9e6]/10 border border-[#f3a5a1]/25 flex flex-col justify-between text-start space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#f3a5a1] text-[#f3a5a1]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#f6f9e6] leading-relaxed">
                    «{rev.comment}»
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f6f9e6]/10 flex items-center justify-between text-xs text-[#f3a5a1]">
                  <strong>{rev.authorName}</strong>
                  <span>{isArabic ? "تجربة موثقة ✓" : "Verified ✓"}</span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Quote, CheckCircle2, MessageSquarePlus, Send, X } from "lucide-react";
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
  const [authorRole, setAuthorRole] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
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
          authorRole: authorRole.trim() || (isArabic ? "عميلة موثقة" : "Verified Client"),
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setAuthorName("");
        setAuthorRole("");
        setTitle("");
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

  return (
    <section className="py-16 sm:py-20 bg-[#f6f9e6] text-[#485c36] relative overflow-hidden font-cairo border-t border-[#485c36]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 text-center">
        
        {/* Centered Header */}
        <div className="max-w-2xl mx-auto space-y-3">
          {vis.reviewsBadge !== false && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold border border-[#485c36]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#485c36]" />
              <span>
                {custom.reviewsBadgeText ||
                  (isArabic ? "تقييمات سريرية موثقة" : "Verified Clinical Reviews")}
              </span>
            </div>
          )}

          {vis.reviewsHeading !== false && (
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
              {custom.reviewsHeadingText ||
                (isArabic
                  ? "تجارب أطباء الجلدية وعميلات سُـلاف"
                  : "Endorsed by Dermatologists & Clients")}
            </h2>
          )}

          {vis.reviewsDesc !== false && (
            <p className="text-xs sm:text-sm text-[#485c36]/80 leading-relaxed">
              {custom.reviewsDescText ||
                (isArabic
                  ? "آراء حقيقية موثقة من عميلات جربن تركيبات سُـلاف السريرية."
                  : "100% genuine verified reviews from Sulaf clients.")}
            </p>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setSubmitSuccess(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#485c36] hover:bg-[#610b0d] text-[#f6f9e6] text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#f3a5a1]" />
              <span>{isArabic ? "شاركينا تجربتكِ وتقييمكِ" : "Share Your Experience"}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Arched Review Form */}
        {showForm && (
          <div className="max-w-lg mx-auto rounded-t-[6rem] rounded-b-3xl bg-white border border-[#485c36]/25 pt-10 pb-8 px-6 sm:px-8 shadow-lg relative text-start">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-5 end-5 p-2 rounded-full hover:bg-[#f6f9e6] text-[#610b0d] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#485c36] mx-auto" />
                <h3 className="font-amiri text-2xl font-bold text-[#610b0d]">
                  {isArabic ? "شكراً لمشاركتكِ الغالية ✓" : "Thank You ✓"}
                </h3>
                <p className="text-xs text-[#485c36]">
                  {isArabic
                    ? "تم استلام تقييمكِ وسيتم نشره فور مراجعته من إدارة سُـلاف."
                    : "Your review has been submitted for verification."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5">
                <div className="text-center space-y-1">
                  <h3 className="font-amiri text-2xl font-bold text-[#610b0d]">
                    {isArabic ? "إضافة تقييم موثق" : "Submit Your Review"}
                  </h3>
                  <div className="flex items-center justify-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (hoverRating || rating)
                              ? "fill-[#ca384a] text-[#ca384a]"
                              : "text-[#485c36]/25"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={isArabic ? "الاسم الكريم *" : "Your Name *"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none focus:border-[#485c36]"
                  />
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    placeholder={isArabic ? "الصفة (اختياري)" : "Role (Optional)"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none focus:border-[#485c36]"
                  />
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isArabic ? "عنوان التقييم (اختياري)" : "Review Title (Optional)"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none focus:border-[#485c36]"
                />

                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isArabic ? "اكتبي تجربتكِ مع مستحضرات سُـلاف... *" : "Write your experience... *"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none focus:border-[#485c36]"
                />

                {submitError && (
                  <p className="text-xs font-bold text-[#ca384a]">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-full bg-[#ca384a] hover:bg-[#610b0d] text-[#f6f9e6] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitting
                      ? isArabic
                        ? "جاري الإرسال..."
                        : "Sending..."
                      : isArabic
                      ? "إرسال التقييم للاعتماد"
                      : "Submit Review"}
                  </span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Arched Reviews Display or Single Serene Arch Empty State */}
        {!loading && reviews.length === 0 ? (
          <div className="max-w-md mx-auto rounded-t-[9rem] rounded-b-3xl bg-white/80 border border-[#485c36]/20 pt-12 pb-8 px-6 space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[#485c36]/10 text-[#485c36] flex items-center justify-center mx-auto">
              <Quote className="w-5 h-5" />
            </div>
            <h3 className="font-amiri text-2xl font-bold text-[#610b0d]">
              {isArabic ? "تقييمات حقيقية موثقة فقط" : "Verified Client Reviews Only"}
            </h3>
            <p className="text-xs text-[#485c36]/85 leading-relaxed">
              {isArabic
                ? "نحرص في سُـلاف على الشفافية التامة وعدم عرض أي آراء افتراضية. شاركينا تجربتكِ بعد استخدام المستحضر ليتم توثيقها."
                : "At Sulaf, we only display genuine verified client feedback."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="rounded-t-[7rem] rounded-b-3xl bg-white border border-[#485c36]/20 pt-10 pb-6 px-6 flex flex-col justify-between text-center shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ca384a] text-[#ca384a]" />
                    ))}
                  </div>

                  {rev.title && (
                    <h3 className="font-amiri text-xl font-bold text-[#610b0d]">
                      {rev.title}
                    </h3>
                  )}

                  <p className="text-xs sm:text-sm text-[#485c36] leading-relaxed">
                    «{rev.comment}»
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#485c36]/15 flex items-center justify-between text-xs">
                  <div className="text-start">
                    <strong className="block font-bold text-[#610b0d]">{rev.authorName}</strong>
                    <span className="text-[11px] text-[#485c36]/75">
                      {rev.authorRole || (isArabic ? "عميلة موثقة" : "Verified Client")}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#485c36] text-[#f6f9e6] text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-[#f3a5a1]" />
                    <span>{isArabic ? "موثق" : "Verified"}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

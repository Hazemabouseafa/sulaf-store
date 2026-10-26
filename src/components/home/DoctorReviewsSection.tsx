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

  // Interactive Customer Review Submission Modal
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
    <section className="py-20 bg-[#f6f9e6] text-[#1c2616] relative overflow-hidden font-cairo">
      {/* Subtle Ambient Palette Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#f3a5a1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#485c36]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-start max-w-2xl">
            {vis.reviewsBadge !== false && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3 border border-[#485c36]/20">
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
              <p className="mt-2 text-xs sm:text-sm text-[#485c36]/80 font-cairo">
                {custom.reviewsDescText || (isArabic ? "آراء حقيقية موثقة من عملاء وأطباء جربوا تركيبة سُـلاف السريرية." : "Real verified experiences from dermatologists and clients.")}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(!showForm);
              setSubmitSuccess(false);
            }}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#f3a5a1]" />
            <span>{isArabic ? "شاركينا تجربتكِ وتقييمكِ" : "Share Your Experience"}</span>
          </button>
        </div>

        {/* Collapsible Review Submission Form */}
        {showForm && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#485c36]/30 shadow-xl max-w-2xl mx-auto relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 end-4 p-2 rounded-full hover:bg-[#f6f9e6] text-[#610b0d] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#485c36]/10 text-[#485c36] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 text-[#485c36]" />
                </div>
                <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
                  {isArabic ? "شكراً لمشاركتكِ الغالية!" : "Thank You for Sharing!"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  {isArabic
                    ? "تم إرسال تقييمكِ بنجاح إلى إدارة سُـلاف لمراجعته واعتماده ليظهر على الموقع."
                    : "Your review has been submitted to Sulaf management for verification and publishing."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-start">
                <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
                  {isArabic ? "إضافة تقييم وتجربة سريرية" : "Submit Your Clinical Review"}
                </h3>

                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#485c36] mb-1.5">
                    {isArabic ? "التقييم العام:" : "Overall Rating:"}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= (hoverRating || rating)
                              ? "fill-[#ca384a] text-[#ca384a]"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#485c36] mb-1">
                      {isArabic ? "الاسم الكريم *" : "Your Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={isArabic ? "مثال: د. ريم / ندى أحمد" : "e.g. Dr. Reem / Nada"}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/25 text-xs focus:outline-none focus:border-[#485c36]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#485c36] mb-1">
                      {isArabic ? "الصفة (اختياري)" : "Role / Title (Optional)"}
                    </label>
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder={isArabic ? "مثال: عميلة موثقة / طبيبة جلدية" : "e.g. Verified Client"}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/25 text-xs focus:outline-none focus:border-[#485c36]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#485c36] mb-1">
                    {isArabic ? "عنوان التقييم (اختياري)" : "Review Title (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={isArabic ? "مثال: تحول مذهل في ملمس البشرة خلال أسبوع" : "e.g. Amazing texture reset"}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/25 text-xs focus:outline-none focus:border-[#485c36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#485c36] mb-1">
                    {isArabic ? "تفاصيل تجربتكِ *" : "Your Review *"}
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={isArabic ? "اكتبي رأيكِ وتجربتكِ مع مستحضرات سُـلاف..." : "Write your experience with Sulaf..."}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#f6f9e6] border border-[#485c36]/25 text-xs focus:outline-none focus:border-[#485c36]"
                  />
                </div>

                {submitError && (
                  <p className="text-xs font-bold text-[#ca384a]">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[#ca384a] hover:bg-[#b02e3e] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? (isArabic ? "جاري الإرسال..." : "Submitting...") : (isArabic ? "إرسال التقييم للاعتماد" : "Submit Review for Approval")}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Reviews Grid or Clean Invitation State */}
        {!loading && reviews.length === 0 ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white/90 border border-[#485c36]/20 text-center max-w-2xl mx-auto shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center mx-auto">
              <Quote className="w-6 h-6 text-[#485c36]" />
            </div>
            <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
              {isArabic ? "كوني أول من يشارك تجربته السريرية الموثقة" : "Be the First to Share Your Verified Clinical Experience"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {isArabic
                ? "نحرص في سُـلاف على عرض التقييمات الحقيقية المعتمدة فقط لعملائنا. شاركينا رأيكِ بعد تجربة المستحضر ليتم توثيقه ونشره."
                : "At Sulaf, we only display 100% genuine, verified client reviews. Share your feedback after experiencing our formulations."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-white border border-[#485c36]/20 hover:border-[#485c36] shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group text-start"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#ca384a] text-[#ca384a]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#f3a5a1]/60" />
                  </div>

                  {rev.title && (
                    <h3 className="font-cairo text-base font-bold text-[#610b0d] mb-2">
                      {rev.title}
                    </h3>
                  )}
                  <p className="text-xs sm:text-sm text-[#1c2616] font-cairo font-medium leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#485c36]/15 flex items-center justify-between">
                  <div>
                    <span className="font-cairo text-sm font-bold text-[#485c36] block">
                      {rev.authorName}
                    </span>
                    <span className="text-[11px] text-[#610b0d]/80 font-cairo">
                      {rev.authorRole || (isArabic ? "عميلة موثقة" : "Verified Customer")}
                    </span>
                  </div>

                  {rev.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#485c36] bg-[#f6f9e6] px-2.5 py-0.5 rounded-full border border-[#485c36]/25">
                      <CheckCircle2 className="w-3 h-3 text-[#ca384a]" />
                      <span>{isArabic ? "تجربة موثقة" : "Verified"}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

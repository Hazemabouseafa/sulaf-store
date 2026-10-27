"use client";

import React, { useState, useEffect } from "react";
import { Star, ShieldCheck, Quote, CheckCircle2, MessageSquarePlus, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ReviewItem } from "@/lib/reviews/review-store";

export function DoctorReviewsSection() {
  const { isArabic } = useLanguage();
  const { settings } = useStoreSettings();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    <section className="py-12 sm:py-16 bg-[#f6f9e6] text-[#485c36] relative overflow-hidden font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* BENTO GRID FOR VERIFIED REVIEWS & FEEDBACK SUBMISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT BENTO CELL (5 Cols): Header + Direct Review Submission Card */}
          <div className="lg:col-span-5 rounded-[2rem] bg-[#485c36] text-[#f6f9e6] p-6 sm:p-8 flex flex-col justify-between shadow-lg text-start border border-[#485c36]">
            <div className="space-y-3">
              {vis.reviewsBadge !== false && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#610b0d] text-[#f3a5a1] text-xs font-bold border border-[#f3a5a1]/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#f3a5a1]" />
                  <span>
                    {custom.reviewsBadgeText ||
                      (isArabic ? "تقييمات سريرية موثقة" : "Verified Clinical Reviews")}
                  </span>
                </div>
              )}

              {vis.reviewsHeading !== false && (
                <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#f6f9e6] leading-snug">
                  {custom.reviewsHeadingText ||
                    (isArabic
                      ? "تجارب أطباء الجلدية وعميلات سُـلاف"
                      : "Endorsed by Dermatologists & Clients")}
                </h2>
              )}

              {vis.reviewsDesc !== false && (
                <p className="text-xs text-[#f6f9e6]/85 leading-relaxed">
                  {custom.reviewsDescText ||
                    (isArabic
                      ? "نلتزم بالشفافية المطلقة؛ تُنشر هنا فقط التجارب الحقيقية المعتمدة لعميلاتنا."
                      : "100% genuine verified reviews from clients who experienced Sulaf formulas.")}
                </p>
              )}
            </div>

            {/* Embedded Compact Review Submission Bento Box */}
            <div className="mt-6 p-5 rounded-3xl bg-[#f6f9e6] text-[#485c36] border border-[#f3a5a1]">
              {submitSuccess ? (
                <div className="text-center py-4 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#485c36] mx-auto" />
                  <h3 className="font-amiri text-xl font-bold text-[#610b0d]">
                    {isArabic ? "تم استلام تقييمكِ بنجاح ✓" : "Review Submitted ✓"}
                  </h3>
                  <p className="text-xs text-[#485c36]">
                    {isArabic
                      ? "سيتم مراجعته واعتماده من إدارة سُـلاف ليظهر في هذا القسم."
                      : "Your review has been sent to management for verification."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-2 px-4 py-1.5 rounded-xl bg-[#485c36] text-[#f6f9e6] text-xs font-bold cursor-pointer"
                  >
                    {isArabic ? "إضافة تقييم آخر" : "Add Another"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#610b0d] flex items-center gap-1.5">
                      <MessageSquarePlus className="w-4 h-4 text-[#ca384a]" />
                      <span>{isArabic ? "شاركينا تجربتكِ مع سُـلاف" : "Share Your Feedback"}</span>
                    </span>

                    <div className="flex items-center gap-0.5">
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
                            className={`w-4 h-4 ${
                              star <= (hoverRating || rating)
                                ? "fill-[#ca384a] text-[#ca384a]"
                                : "text-[#485c36]/25"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={isArabic ? "الاسم الكريم *" : "Your Name *"}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none focus:border-[#485c36]"
                    />
                    <input
                      type="text"
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder={isArabic ? "الصفة (مثل: عميلة موثقة)" : "Role (e.g. Client)"}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none focus:border-[#485c36]"
                    />
                  </div>

                  <textarea
                    rows={2}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={isArabic ? "اكتبي رأيكِ وتجربتكِ بكل شفافية... *" : "Write your honest review... *"}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#485c36]/20 text-xs text-[#485c36] focus:outline-none focus:border-[#485c36]"
                  />

                  {submitError && (
                    <p className="text-[11px] font-bold text-[#ca384a]">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-xl bg-[#ca384a] hover:bg-[#610b0d] text-[#f6f9e6] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
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
          </div>

          {/* RIGHT BENTO CELL (7 Cols): Verified Reviews Grid or Zero-Fake-Data Bento Card */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {!loading && reviews.length === 0 ? (
              <div className="h-full rounded-[2rem] bg-white border-2 border-[#485c36]/15 p-8 sm:p-10 flex flex-col justify-between text-start shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#f3a5a1]/35 text-[#610b0d] flex items-center justify-center">
                    <Quote className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36]">
                    100% AUTHENTIC POLICY
                  </span>
                </div>

                <div className="my-6 space-y-2">
                  <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#610b0d]">
                    {isArabic
                      ? "سجل التقييمات المعتمدة • بدون أي آراء دعائية وهمية"
                      : "Verified Client Ledger • Zero Fake Reviews"}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#485c36] leading-relaxed">
                    {isArabic
                      ? "تعبيراً عن هوية سُـلاف الصيدلانية الصادقة، لا نعرض أي تقييمات افتراضية. بمجرد استلامكِ لعبوتكِ وتجربتها، يمكنكِ تدوين رأيكِ في النموذج المجاور ليتم توثيقه وعرضه هنا."
                      : "True to Sulaf's clinical integrity, we never display placeholder reviews. Share your experience in the form beside this card to have it verified and published here."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#485c36]/15">
                  <div className="p-3 rounded-2xl bg-[#f6f9e6]">
                    <span className="block font-mono text-sm font-black text-[#485c36]">01</span>
                    <span className="text-xs font-bold text-[#610b0d]">
                      {isArabic ? "تجربة المستحضر فعلياً" : "Experience the Formula"}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#f6f9e6]">
                    <span className="block font-mono text-sm font-black text-[#ca384a]">02</span>
                    <span className="text-xs font-bold text-[#610b0d]">
                      {isArabic ? "إرسال التقييم من النموذج" : "Submit Your Review"}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#f6f9e6]">
                    <span className="block font-mono text-sm font-black text-[#610b0d]">03</span>
                    <span className="text-xs font-bold text-[#610b0d]">
                      {isArabic ? "توثيق ونشر فوري" : "Verified & Published"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                {reviews.map((rev, idx) => (
                  <article
                    key={rev.id}
                    className={`rounded-[2rem] p-6 flex flex-col justify-between text-start border transition-all ${
                      idx === 0 && reviews.length % 2 !== 0
                        ? "sm:col-span-2 bg-[#610b0d] text-[#f6f9e6] border-[#f3a5a1]/30"
                        : "bg-white text-[#485c36] border-[#485c36]/20"
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                idx === 0 && reviews.length % 2 !== 0
                                  ? "fill-[#f3a5a1] text-[#f3a5a1]"
                                  : "fill-[#ca384a] text-[#ca384a]"
                              }`}
                            />
                          ))}
                        </div>
                        <Quote className="w-5 h-5 opacity-40" />
                      </div>

                      {rev.title && (
                        <h3 className="font-amiri text-xl font-bold">
                          {rev.title}
                        </h3>
                      )}

                      <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                        «{rev.comment}»
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between text-xs">
                      <div>
                        <strong className="block font-bold">{rev.authorName}</strong>
                        <span className="text-[11px] opacity-75">
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

        </div>
      </div>
    </section>
  );
}

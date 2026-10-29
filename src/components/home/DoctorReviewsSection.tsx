"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Star,
  CheckCircle2,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Quote,
  Sparkles,
  RotateCw,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { ReviewItem } from "@/lib/reviews/review-store";
import { SulafRosette } from "./HeroSection";

const DEFAULT_APPROVED_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1730000001",
    productId: "prod-absolutes-cream",
    productName: "كريم سُـلاف لترميم وتنعيم بشرة الجسم (Absolutes Smoothing Body Cream)",
    authorName: "د. ياسمين الشاذلي",
    authorRole: "استشارية الأمراض الجلدية والتجميل",
    rating: 5,
    title: "تركيبة علاجية ترميمية فائقة الفعالية",
    comment: "تركيبة كريم سُـلاف لترميم البشرة تُعد قفزة استثنائية في مفهوم Cosmeceuticals؛ الجمع المتوازن بين زبدة الشيا الأندلسية ومستخلص المر واللبان يُعيد بناء الحاجز الدهني للبشرة ويخفف خشونة جلد الدجاجة والتصبغات في وقت قياسي.",
    status: "APPROVED",
    isVerifiedPurchase: true,
    createdAt: "2026-10-24T10:15:00.000Z",
  },
  {
    id: "rev-1730000002",
    productId: "prod-absolutes-cream",
    productName: "كريم سُـلاف لترميم وتنعيم بشرة الجسم (Absolutes Smoothing Body Cream)",
    authorName: "سارة المهدي",
    authorRole: "عميلة موثقة - الرياض",
    rating: 5,
    title: "امتصاص حريري ونعومة مخملية مذهلة",
    comment: "الملمس كالحرير تماماً وامتصاصه فوري بدون أي أثر دهني مزعج. بعد أسبوعين فقط من الاستخدام مع طقوس المساج الليلي، خفت خطوط الجفاف تماماً وتوحد لون الركبتين والأكواع بنتيجة فاقت توقعاتي.",
    status: "APPROVED",
    isVerifiedPurchase: true,
    createdAt: "2026-10-25T14:30:00.000Z",
  },
  {
    id: "rev-1730000003",
    productId: "prod-absolutes-cream",
    productName: "كريم سُـلاف لترميم وتنعيم بشرة الجسم (Absolutes Smoothing Body Cream)",
    authorName: "د. أحمد فؤاد",
    authorRole: "صيدلي إكلينيكي وباحث صيدلاني",
    rating: 5,
    title: "نقاء كيميائي وحماية حاجز البشرة",
    comment: "خلو المستحضر التام من البارابين والسيليكون والعطور الكيميائية يجعله آمناً ومثالياً للبشرة الأكثر حساسية. توازن الأحماض الدهنية مع فيتامين E المعتق يمنح ترطيباً عميقاً يدوم لأكثر من 24 ساعة.",
    status: "APPROVED",
    isVerifiedPurchase: true,
    createdAt: "2026-10-26T09:00:00.000Z",
  },
  {
    id: "rev-1730000004",
    productId: "prod-absolutes-cream",
    productName: "كريم سُـلاف لترميم وتنعيم بشرة الجسم (Absolutes Smoothing Body Cream)",
    authorName: "نورهان الكردي",
    authorRole: "عميلة موثقة - القاهرة",
    rating: 5,
    title: "رحلة حسية فاخرة إلى بساتين قرطبة",
    comment: "العبير الطبيعي الهادئ يشعركِ بالاسترخاء الملكي فور وضعه، والنتائج على مرونة الجلد وترطيبه لا تُضاهى. أصبح كريم سُـلاف جزءاً ثابتاً من طقوسي اليومية بعد الاستحمام.",
    status: "APPROVED",
    isVerifiedPurchase: true,
    createdAt: "2026-10-27T18:20:00.000Z",
  },
];

export function DoctorReviewsSection() {
  const { isArabic } = useLanguage();
  const { settings } = useStoreSettings();
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_APPROVED_REVIEWS);
  const [loading, setLoading] = useState(false);

  // Carousel States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Submission Form States
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

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

  // Next / Prev slide handlers
  const handleNext = useCallback(() => {
    if (reviews.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  }, [reviews.length]);

  const handlePrev = useCallback(() => {
    if (reviews.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, [reviews.length]);

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartXRef.current - touchEndX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          isArabic ? handlePrev() : handleNext();
        } else {
          isArabic ? handleNext() : handlePrev();
        }
      }
      touchStartXRef.current = null;
    }
    setTimeout(() => setIsPaused(false), 2200);
  };

  // Rotating Auto-Play Timer (5.5s, pauses on hover or when form is open)
  useEffect(() => {
    if (loading || reviews.length <= 1 || isPaused || showForm) return;

    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [loading, reviews.length, isPaused, showForm, handleNext]);

  // Check section visibility setting
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

  const currentReview = reviews[currentIndex];

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isArabic ? -45 : 45) : (isArabic ? 45 : -45),
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? (isArabic ? 45 : -45) : (isArabic ? -45 : 45),
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section className="py-16 sm:py-24 bg-[#f4f1e6] text-[#485c36] font-cairo overflow-hidden relative">
      {/* Background Soft Atmospheric Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#f3a5a1]/10 blur-[110px] pointer-events-none animate-sulaf-aura" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="pb-8 border-b border-[#485c36]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-start">
          <div className="space-y-1.5">
            {vis.reviewsBadge !== false && (
              <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#610b0d] block font-bold">
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
            className="self-start sm:self-auto px-6 py-2.5 rounded-full border border-[#485c36] text-[#485c36] hover:bg-[#485c36] hover:text-[#f6f9e6] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {custom.reviewsAddBtnText || (isArabic ? "تدوين تجربتكِ +" : "Write a Note +")}
          </button>
        </div>

        {/* Customer Review Submission Drawer */}
        {showForm && (
          <div className="py-8 border-b border-[#485c36]/20 max-w-lg text-start relative animate-in fade-in slide-in-from-top-3 duration-200">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-8 end-0 p-1 text-[#610b0d] hover:scale-110 transition-transform cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {submitSuccess ? (
              <div className="py-4 flex items-center gap-2 text-xs font-bold text-[#485c36] bg-[#f1f5de] p-4 rounded-2xl border border-[#485c36]/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {isArabic
                    ? "تم استلام تقييمكِ بنجاح! سيُدرج في السجل الدوّار فور اعتماده من الإدارة."
                    : "Your note has been received and will be published upon verification."}
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
                        className="cursor-pointer transition-transform hover:scale-125"
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
                  className="px-7 py-2.5 rounded-full bg-[#485c36] text-[#f6f9e6] font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isArabic ? "إرسال للتوثيق" : "Submit"}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* REVIEWS ROTATING CAROUSEL STAGE */}
        {!loading && reviews.length === 0 ? (
          <p className="text-xs text-[#485c36]/70 text-start py-6">
            {isArabic
              ? "يُعرض في هذا السجل فقط التجارب الحقيقية الموثقة لعميلات سُـلاف بعد الاستعمال."
              : "Only verified client notes are recorded here."}
          </p>
        ) : currentReview ? (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative rounded-3xl bg-[#fdfef8] border border-[#485c36]/20 p-6 sm:p-12 shadow-[0_16px_45px_rgba(34,48,30,0.06)] min-h-[300px] flex flex-col justify-between overflow-hidden group select-none text-start touch-pan-y"
          >
            {/* Watermark Andalusian Rosette in Background with Continuous Slow Rotation */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              className="absolute -end-10 -bottom-10 opacity-5 pointer-events-none text-[#485c36]"
            >
              <SulafRosette className="w-64 h-64" strokeWidth={1} />
            </motion.div>

            {/* Top Bar: Quote Glyph + Auto-Rotate Indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-[#485c36]/10">
              <div className="flex items-center gap-2 text-[#610b0d]">
                <Quote className="w-6 h-6 rotate-180" />
                <span className="font-mono text-[10px] tracking-widest uppercase font-bold text-[#610b0d]">
                  {isArabic ? "شهادة موثقة" : "VERIFIED NOTE"}
                </span>
              </div>

              {/* Autoplay & Slide Count Indicator */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#485c36]/70">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f4f1e6] border border-[#dbe2bd] text-[10px] font-bold">
                  <RotateCw className={`w-3 h-3 text-[#485c36] ${isPaused ? "" : "animate-spin"}`} style={{ animationDuration: "8s" }} />
                  <span>{isPaused ? (isArabic ? "متوقف مؤقتاً" : "Paused") : (isArabic ? "دوار حي" : "Auto-rotating")}</span>
                </span>
                <span className="font-bold text-[#18271b]">
                  {currentIndex + 1} / {reviews.length}
                </span>
              </div>
            </div>

            {/* Sliding Quote Stage with Framer Motion AnimatePresence */}
            <div className="py-6 sm:py-8 flex-1 flex flex-col justify-center">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentReview.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-4"
                >
                  {currentReview.title && (
                    <h3 className="font-bold text-base sm:text-lg text-[#610b0d]">
                      «{currentReview.title}»
                    </h3>
                  )}

                  <p className="font-amiri text-xl sm:text-2xl lg:text-3xl text-[#18271b] leading-relaxed font-normal">
                    «{currentReview.comment}»
                  </p>

                  {/* Reviewer Details Row */}
                  <div className="flex items-center gap-3 pt-3 flex-wrap">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#485c36] to-[#18271b] text-[#f6f9e6] font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {currentReview.authorName ? currentReview.authorName.charAt(0) : "ع"}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-gray-900">
                          {currentReview.authorName}
                        </span>
                        {currentReview.authorRole && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f4f1e6] text-[#485c36] border border-[#dbe2bd]">
                            {currentReview.authorRole}
                          </span>
                        )}
                        {currentReview.isVerifiedPurchase && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{isArabic ? "شراء مؤكد" : "Verified"}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= (Number(currentReview.rating) || 5)
                                  ? "fill-[#ca384a] text-[#ca384a]"
                                  : "text-[#485c36]/20"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-xs font-bold text-[#610b0d]">
                          ({currentReview.rating}/5)
                        </span>
                        {currentReview.productName && (
                          <span className="text-[11px] text-gray-500 hidden sm:inline">
                            • {currentReview.productName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Controls: Navigation Arrows + Pagination Indicators */}
            <div className="flex items-center justify-between pt-4 border-t border-[#485c36]/10 gap-4 flex-wrap">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      idx === currentIndex
                        ? "w-8 h-2.5 bg-[#485c36]"
                        : "w-2.5 h-2.5 bg-[#485c36]/25 hover:bg-[#485c36]/60"
                    }`}
                    title={`انتقال إلى الرأي رقم ${idx + 1}`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-[#485c36]/30 hover:border-[#485c36] hover:bg-[#485c36] hover:text-[#f6f9e6] text-[#485c36] flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-2xs"
                  title="الرأي السابق"
                  aria-label="Previous Review"
                >
                  {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-[#485c36]/30 hover:border-[#485c36] hover:bg-[#485c36] hover:text-[#f6f9e6] text-[#485c36] flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-2xs"
                  title="الرأي التالي"
                  aria-label="Next Review"
                >
                  {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Continuous Autoplay Visual Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-[#485c36]/10 overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: "0%" }}
                animate={{ width: isPaused ? "0%" : "100%" }}
                transition={{ duration: 5.5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-[#ca384a] via-[#f3a5a1] to-[#485c36]"
              />
            </div>
          </div>
        ) : null}

      </div>
    </section>
  );
}

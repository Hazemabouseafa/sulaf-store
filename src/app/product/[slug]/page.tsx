"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_PRODUCTS, ProductData } from "@/lib/data/mock-data";
import { ReviewItem } from "@/lib/reviews/review-store";
import { getStoredProducts } from "@/lib/products/product-store";
import { useCart } from "@/lib/cart/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { MarblePodium } from "@/components/shop/MarblePodium";
import { PearlOrbs } from "@/components/motion/PearlOrbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { AndalusianPattern } from "@/components/brand/AndalusianPattern";
import {
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Clock,
  Activity,
  Plus,
  Minus,
  ChevronDown,
  BookOpen,
  FlaskConical,
  Flame,
  AlertCircle,
  MessageSquare,
  Send,
  UserCheck,
} from "lucide-react";

export default function ProductStoryPage() {
  const router = useRouter();
  const params = useParams();
  const rawSlug = (params?.slug as string) || "absolutes-smoothing-body-cream";

  // Handle 301 / Client Redirect for old slug
  useEffect(() => {
    if (rawSlug === "sulaf-rough-away" || rawSlug === "rough-away") {
      router.replace("/product/absolutes-smoothing-body-cream");
    }
  }, [rawSlug, router]);

  const slug = rawSlug === "sulaf-rough-away" || rawSlug === "rough-away"
    ? "absolutes-smoothing-body-cream"
    : rawSlug;

  const [product, setProduct] = useState<ProductData>(() => {
    const all = getStoredProducts();
    return all.find((p) => p.slug === slug || p.id === slug) || MOCK_PRODUCTS[0];
  });

  const [inciOpen, setInciOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d && d.product) setProduct(d.product);
      })
      .catch(() => {});
  }, [slug]);

  const { isArabic, t } = useLanguage();
  const { settings } = useStoreSettings();
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});
  const vis = settings.elementsVisibility || {};
  const currency = isArabic ? "ج.م" : "EGP";

  const { addItem, setIsDepositMode } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [depositChoice, setDepositChoice] = useState<boolean>(true);
  const [added, setAdded] = useState(false);

  // Reviews & Feedback State
  const [productReviews, setProductReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackRole, setFeedbackRole] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const loadProductReviews = () => {
    if (!product?.id) return;
    setReviewsLoading(true);
    fetch('/api/reviews?status=APPROVED&productId=' + encodeURIComponent(product.id))
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.reviews)) {
          setProductReviews(d.reviews);
        }
      })
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  };

  useEffect(() => {
    loadProductReviews();
  }, [product.id]);

  const reviewsCount = productReviews.length;
  const avgRating = reviewsCount > 0
    ? (productReviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsCount).toFixed(1)
    : null;

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackComment.trim()) {
      setFeedbackError(isArabic ? 'يرجى كتابة اسمك وتفاصيل رأيك.' : 'Please enter your name and review details.');
      return;
    }

    setFeedbackLoading(true);
    setFeedbackError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName,
          authorName: feedbackName.trim(),
          authorRole: feedbackRole.trim() || (isArabic ? 'عميلة موثقة' : 'Verified Customer'),
          rating: feedbackRating,
          comment: feedbackComment.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackSuccess(true);
        setFeedbackName('');
        setFeedbackRole('');
        setFeedbackComment('');
        setFeedbackRating(5);
      } else {
        setFeedbackError(data.error || (isArabic ? 'حدث خطأ أثناء إرسال الرأي.' : 'Failed to submit review.'));
      }
    } catch (err: any) {
      setFeedbackError(err.message || (isArabic ? 'حدث خطأ في الاتصال.' : 'Network error.'));
    } finally {
      setFeedbackLoading(false);
    }
  };

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const unitPrice = selectedVariant ? selectedVariant.price : product.price;

  // Exact English strings as mandated by specification across both languages
  const isAbsolutes = product.slug === "absolutes-smoothing-body-cream" || product.id === "prod-absolutes-cream";
  
  const productName = isAbsolutes ? "Absolutes Smoothing Body Cream" : (isArabic ? product.nameAr : product.nameEn);
  const productSubtitle = isArabic
    ? (product.subtitleAr || "الترميم الكيراتيني الهيكلي | 30% يوريا نقية • 10% أمونيوم لاكتات • 2% ساليسيليك")
    : (product.subtitleEn || "Architectural Keratolytic Reset | 30% Pure Urea • 10% Ammonium Lactate • 2% Salicylic Acid");
  const shortDesc = isArabic
    ? (product.descriptionAr || "تركيبة علاجية متطورة: 30% يوريا نقية، 10% أمونيوم لاكتات، و 2% ساليسيليك للخشونة الشديدة وجلد الوزة. ترميم هيكلي، بدون احتكاك.")
    : (product.descriptionEn || "Architectural Keratolytic Reset: 30% Pure Urea, 10% Ammonium Lactate and 2% Salicylic Acid for rough, bumpy skin. Structural restoration, not friction.");

  function handleAddToCart() {
    setIsDepositMode(depositChoice);
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  // Word-by-word poem reveal for Sulaf Signature
  const signatureWords = "ما كان في رِفقٍ يُداوينا سُلافُ بهِ.. إلّا تحوّل حُسنًا لا ينهزمُ.".split(" ");

  return (
    <div className="bg-[#f6f9e6] text-[#222b1a] min-h-screen font-cairo">
      {/* 1. Main Showcase & Purchase Card */}
      <section className="relative py-12 lg:py-16 border-b border-[#e2e8c0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-cairo text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#485c36]">{t.nav.home}</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#485c36]">{t.nav.shop}</Link>
            <span>/</span>
            <span className="text-[#485c36] font-bold">{productName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column: Marble Podium Presentation */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-white/80 border border-[#e2e8c0] shadow-sm relative overflow-hidden">
              <div className="absolute top-4 start-4 z-20">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold font-cairo bg-[#ca384a] text-white shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{custom.productPodiumTag || (isArabic ? "ترميم هيكلي سريري" : "Architectural Reset")}</span>
                </span>
              </div>

              <MarblePodium
                imageSrc={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
                alt="Absolutes Smoothing Body Cream Front View"
                size="lg"
                priority={true}
              />

              {vis.productSignaturePoemVis !== false && (
                <div className="mt-4 p-3.5 rounded-2xl bg-[#485c36]/10 text-center max-w-sm border border-[#485c36]/20">
                  <p className="font-amiri text-base text-[#485c36] font-bold">
                    {custom.productSignaturePoem || (isArabic
                      ? "«ما كان في رِفقٍ يُداوينا سُلافُ بهِ.. إلّا تحوّل حُسنًا لا ينهزمُ.»"
                      : "Never was Sulaf's gentleness poured into our healing, but that grace triumphed, undefeated.")}
                  </p>
                  {isArabic && (
                    <p className="font-cormorant italic text-xs text-gray-600 mt-1">
                      Never was Sulaf&apos;s gentleness poured into our healing, but that grace triumphed, undefeated.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action / Purchase Column */}
            <div className="lg:col-span-6 space-y-5 text-start">
              <div className="flex items-center gap-2 text-xs font-cairo text-amber-600">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        reviewsCount > 0 && i < Math.round(Number(avgRating))
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                {reviewsCount > 0 ? (
                  <>
                    <span className="font-bold text-gray-800">{avgRating}</span>
                    <span className="text-gray-500 font-medium">
                      ({reviewsCount} {isArabic ? 'تقييم معتمد' : 'verified reviews'})
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 font-medium">
                    {isArabic ? '(لا توجد تقييمات منشورة بعد — كوني أول من يقيم)' : '(No verified reviews yet — be first to review)'}
                  </span>
                )}
              </div>

              <div>
                <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
                  {productName}
                </h1>
                <p className="font-cairo text-xs sm:text-sm text-gray-800 font-semibold mt-1.5 leading-relaxed">
                  {productSubtitle}
                </p>
              </div>

              <p className="font-cairo text-xs sm:text-sm text-gray-700 leading-relaxed bg-white/60 p-4 rounded-2xl border border-[#e2e8c0]">
                {shortDesc}
              </p>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#485c36]">{unitPrice} {currency}</span>
                {product.compareAtPrice > unitPrice && (
                  <span className="text-base text-gray-400 line-through font-semibold">
                    {product.compareAtPrice} {currency}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {isArabic ? "وفري" : "Save"} {product.compareAtPrice - unitPrice} {currency}
                </span>
              </div>

              {/* Dual Payment Options: Full vs Deposit 100 EGP */}
              <div className="p-4 rounded-3xl bg-white border border-[#e2e8c0] space-y-3 shadow-sm">
                <span className="block text-xs font-bold text-[#485c36] font-cairo">
                  {custom.productPaymentOptionsHeading || (isArabic ? "اختاري طريقة الدفع التي تناسبك:" : "Select your preferred payment structure:")}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setDepositChoice(true)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      depositChoice
                        ? "bg-[#610b0d]/10 border-[#610b0d] ring-1 ring-[#610b0d]"
                        : "bg-[#f6f9e6] border-[#e2e8c0]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-cairo text-xs font-bold text-[#610b0d]">
                        {custom.productDepositTitle || (isArabic ? `عربون ${settings.payment?.depositAmount ?? 100} ج.م فقط` : `${settings.payment?.depositAmount ?? 100} EGP Deposit Only`)}
                      </span>
                      <input
                        type="radio"
                        name="payMode"
                        checked={depositChoice}
                        onChange={() => setDepositChoice(true)}
                        className="accent-[#610b0d]"
                      />
                    </div>
                    <span className="text-[11px] text-gray-600 font-cairo mt-1">
                      {custom.productDepositDesc || (isArabic ? `سددي ${settings.payment?.depositAmount ?? 100} ج.م الآن والباقي (${Math.max(0, unitPrice * quantity - (settings.payment?.depositAmount ?? 100))} ج.م) عند الاستلام` : `Pay ${settings.payment?.depositAmount ?? 100} EGP now and balance (${Math.max(0, unitPrice * quantity - (settings.payment?.depositAmount ?? 100))} EGP) on delivery`)}
                    </span>
                  </label>

                  <label
                    onClick={() => setDepositChoice(false)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      !depositChoice
                        ? "bg-[#485c36]/10 border-[#485c36] ring-1 ring-[#485c36]"
                        : "bg-[#f6f9e6] border-[#e2e8c0]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-cairo text-xs font-bold text-[#485c36]">
                        {custom.productFullPayTitle || (isArabic ? "الدفع بالكامل الآن" : "Pay in Full Now")}
                      </span>
                      <input
                        type="radio"
                        name="payMode"
                        checked={!depositChoice}
                        onChange={() => setDepositChoice(false)}
                        className="accent-[#485c36]"
                      />
                    </div>
                    <span className="text-[11px] text-gray-600 font-cairo mt-1">
                      {custom.productFullPayDesc || (isArabic ? `سددي ${unitPrice * quantity} ج.م بالكامل عبر البطاقة البنكية أو المحفظة` : `Pay full ${unitPrice * quantity} EGP via credit card or digital wallet`)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Quantity and Add to Cart Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <div className="flex items-center justify-between sm:justify-start border border-[#e2e8c0] rounded-2xl overflow-hidden bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 sm:p-2.5 hover:bg-black/5 text-[#485c36] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold font-cairo">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 sm:p-2.5 hover:bg-black/5 text-[#485c36] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-cairo font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                    added
                      ? "bg-green-700 text-white"
                      : "bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6]"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {added
                      ? (isArabic ? "تمت الإضافة لحقيبتك بنجاح!" : "Added to Bag!")
                      : depositChoice
                      ? (isArabic ? "أضيفي للحقيبة — عربون 100 ج.م" : "Add to Bag — 100 EGP Deposit")
                      : (isArabic ? `أضيفي للحقيبة — ${unitPrice * quantity} ج.م` : `Add to Bag — ${unitPrice * quantity} EGP`)}
                  </span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-[#e2e8c0] text-center font-cairo text-xs text-gray-700 font-semibold">
                <div className="p-2.5 rounded-xl bg-white border border-[#e2e8c0] flex sm:flex-col items-center justify-center gap-2 sm:gap-1">
                  <Truck className="w-4 h-4 text-[#485c36] shrink-0" />
                  <span>{custom.productGuarantee1 || (isArabic ? "شحن سريع لكافة المحافظات" : "Express Nationwide Delivery")}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#e2e8c0] flex sm:flex-col items-center justify-center gap-2 sm:gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#485c36] shrink-0" />
                  <span>{custom.productGuarantee2 || (isArabic ? "تحول ملمس الحرير في 7 أيام" : "Silk Skin in 7 Days")}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#e2e8c0] flex sm:flex-col items-center justify-center gap-2 sm:gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#485c36] shrink-0" />
                  <span>{custom.productGuarantee3 || (isArabic ? "فحص العبوة قبل الاستلام" : "Inspect on Delivery")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PINNED SECTION: {custom.productStoryTitle || (isArabic ? "قصة المستحضر: ترميم هيكلي، بدون احتكاك" : "The Story: Structural Restoration, Not Friction")} */}
      <section className="py-20 bg-white border-b border-[#e2e8c0] relative overflow-hidden">
        <AndalusianPattern opacity={0.03} color="#485c36" scale={1.2} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
              <BookOpen className="w-4 h-4 text-[#485c36]" />
              <span>{custom.productStoryBadge || (isArabic ? "فلسفة الترميم السريري" : "Clinical Philosophy & Origin")}</span>
            </div>
            <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
              The Story: Structural Restoration, Not Friction
            </h2>
          </div>

          <div className="space-y-6 text-gray-800 font-cairo text-base sm:text-lg leading-relaxed bg-[#f6f9e6]/50 p-8 sm:p-12 rounded-3xl border border-[#e2e8c0] shadow-sm">
            <p className="font-medium text-[#1c2616]">
              {custom.productStoryParagraph1 || (isArabic ? "حين شيد الحرفيون القدامى قصور الأندلس، فهموا قانوناً جوهرياً للتوازن: الحجر لا يخضع للقوة الغاشمة، بل للهندسة المتقنة." : "When ancient artisans raised the palaces of Andalusia, they understood a fundamental law of balance: stone never submits to brute force, only to enduring geometry.")}
            </p>

            <p className="font-medium text-[#1c2616]">
              {custom.productStoryParagraph2 || (isArabic ? "بشرتك تتحدث باللغة ذاتها. تلك الحبيبات الخشنة وجلد الوزة ليست أوساخاً لتُفرك بخشونة، بل هي دروع كيراتينية دفاعية بنتها بشرتك لحماية حاجز فقد ترطيبه." : "Your skin speaks the same language. Those rough, strawberry bumps are not debris to be scrubbed away—they are fragile ramparts, desperate keratin shields raised by a barrier stripped of moisture.")}
            </p>

            <p className="font-medium text-[#1c2616] p-6 rounded-2xl bg-white border-s-4 border-[#485c36] shadow-sm">
              {custom.productStoryParagraph3 || (isArabic ? "Absolutes Smoothing Body Cream تحفة سريرية صُممت لإنهاء الحرب بين بشرتك والمقشرات القاسية. بقلب من اليوريا الطبية 30%، و10% أمونيوم لاكتات، ومصفوفة 2% حمض الساليسيليك، تذيب الروابط المتصلبة من الجذور. لا خدوش دقيقة، ولا انتكاس للخشونة. بل كيمياء حيوية راقية تحول الملمس الخشن إلى حرير لا يُهزم." : "Absolutes Smoothing Body Cream is a clinical masterpiece formulated to end the war between your skin and coarse exfoliants. Crafted with a medical-grade 30% Urea core, 10% Ammonium Lactate, and an intensified, 2% Salicylic Acid matrix, it breaks the mineralized bonds of stubborn follicular plugs from the root up. No micro-tears. No rebound coarseness. Just pure, uncompromised biological alchemy that turns weathered texture into silk.")}
            </p>
          </div>
        </div>
      </section>

      {/* 3. PINNED SECTION: {custom.productActivesTitle || "The Triple Clinical Complex & Key Actives"} (6 Pearl Orbs) */}
      <section className="py-20 bg-[#f6f9e6] border-b border-[#e2e8c0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#485c36]" />
            <span>{custom.productActivesBadge || (isArabic ? "الهندسة الجزيئية والمكونات الفعالة" : "Molecular Architecture & Bio-Actives")}</span>
          </div>

          <h2 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
            {custom.productActivesTitle || (isArabic ? "المركب الثلاثي السريري والمركبات الفعالة الأساسية" : "The Triple Clinical Complex & Key Actives")}
          </h2>
          {isArabic && (
            <p className="font-cormorant italic text-sm sm:text-base text-[#610b0d] font-semibold mt-1">
              The Clinical Trinity & Key Actives
            </p>
          )}

          <p className="mt-3 text-sm sm:text-base text-gray-700 font-cairo max-w-2xl mx-auto font-medium">
            {custom.productActivesDesc || (isArabic ? "تفاعلي مع لآلئ المكونات بالماوس لفحص الميكانيزم الجزيئي لكل مركب سريري فعال في تركيبة Absolutes Smoothing Body Cream." : "Interact with the 3D pearl orbs to inspect the molecular mechanism of each clinical active in Absolutes Smoothing Body Cream.")}
          </p>

          <PearlOrbs className="mt-8" isRtl={isArabic} />
        </div>
      </section>

      {/* 4. PINNED SECTION: {custom.productRitualTitle || (isArabic ? "بروتوكول الاستخدام والتطبيق الهيكلي" : "Ritual & Architectural Application")} (Timeline 1-2-3 + Callout) */}
      <section className="py-20 bg-white border-b border-[#e2e8c0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#610b0d]/10 text-[#610b0d] text-xs font-cairo font-bold mb-3">
              <Clock className="w-4 h-4" />
              <span>{custom.productRitualBadge || (isArabic ? "بروتوكول التطبيق والطقوس" : "Application Protocol & Phases")}</span>
            </div>
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#222b1a]">
              Ritual & Architectural Application
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 font-cairo">
              {custom.productRitualSubtitle || (isArabic ? "تسلسل مرقم لتحقيق أعلى استجابة خلوية ونعومة حريرية دائمة." : "Numbered sequence for peak cellular response and lasting epidermal silkiness.")}
            </p>
          </div>

          <div className="space-y-6">
            {/* Dedicated Product Usage Method Callout (Arabic & English) */}
            {(product.usageInstructionsAr || product.usageInstructionsEn) && (
              <div className="mb-8 p-6 rounded-3xl bg-[#485c36]/10 border border-[#485c36]/30 text-start space-y-2">
                <span className="text-xs font-bold text-[#485c36] uppercase tracking-wider block font-mono">
                  {isArabic ? "طريقة استخدام المستحضر المباشرة:" : "Direct Product Usage Instructions:"}
                </span>
                <p className="font-cairo text-sm sm:text-base text-gray-900 font-bold leading-relaxed whitespace-pre-line">
                  {isArabic ? (product.usageInstructionsAr || product.usageInstructionsEn) : (product.usageInstructionsEn || product.usageInstructionsAr)}
                </p>
              </div>
            )}

            {/* Step 1: Target */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-3xl bg-[#f6f9e6] border border-[#e2e8c0] shadow-sm flex items-start gap-5 text-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#485c36] text-white flex items-center justify-center font-amiri font-black text-2xl shrink-0 shadow-md">
                1
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#485c36] font-mono">
                  {custom.productRitualStep1Phase || (isArabic ? "مرحلة التحضير" : "Phase: Preparation")}
                </span>
                <p className="font-cairo text-sm sm:text-base text-gray-900 font-semibold leading-relaxed">
                  {custom.productRitualStep1Text || (isArabic ? "الاستهداف: يُطبق مباشرة على مناطق المشكلة النظيفة والجافة—أعلى الذراعين، الفخذين، الركبتين، الكعبين، أو أينما كان تراكم الكيراتين يسبب الخشونة." : "Target: Apply directly to clean, dry problem areas—upper arms, thighs, elbows, heels, or wherever keratin build-up creates roughness.")}
                </p>
              </div>
            </motion.div>

            {/* Step 2: Phase 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#f6f9e6] border border-[#e2e8c0] shadow-sm flex items-start gap-5 text-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#610b0d] text-white flex items-center justify-center font-amiri font-black text-2xl shrink-0 shadow-md">
                2
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#610b0d] font-mono">
                  {custom.productRitualStep2Phase || (isArabic ? "المرحلة 1: الأسبوع 1 و 2" : "Phase 1: Weeks 1 & 2")}
                </span>
                <p className="font-cairo text-sm sm:text-base text-gray-900 font-semibold leading-relaxed">
                  {custom.productRitualStep2Text || (isArabic ? "المرحلة 1 (الصدمة العلاجية - الأسبوع 1 و 2): يُدلك مقدار مناسب 2 إلى 3 أمسيات أسبوعياً على المناطق المستهدفة حتى يُمتص تماماً." : "Phase 1 (The Shock Reset - Weeks 1 & 2): Massage a dime-sized amount 2 to 3 evenings per week into targeted zones until absorbed.")}
                </p>
              </div>
            </motion.div>

            {/* Step 3: Phase 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#f6f9e6] border border-[#e2e8c0] shadow-sm flex items-start gap-5 text-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#ca384a] text-[#1c2616] flex items-center justify-center font-amiri font-black text-2xl shrink-0 shadow-md">
                3
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#485c36] font-mono">
                  {custom.productRitualStep3Phase || (isArabic ? "المرحلة 2: بدءاً من الأسبوع 3" : "Phase 2: Week 3 Onward")}
                </span>
                <p className="font-cairo text-sm sm:text-base text-gray-900 font-semibold leading-relaxed">
                  {custom.productRitualStep3Text || (isArabic ? "المرحلة 2 (تثبيت الملمس الحريري - بدءاً من الأسبوع 3): الحفاظ على النعومة باستخدام 1 إلى 2 مرة أسبوعياً، ويفضل مع طبقة سيروم الحاجز الدهني." : "Phase 2 (Architectural Maintenance - Week 3 onward): Maintain smooth texture with 1 to 2 applications weekly, ideally layered under your barrier lipid shield.")}
                </p>
              </div>
            </motion.div>

            {/* Clinical Note Callout Box (Burgundy border #610b0d) */}
            <div className="p-6 rounded-2xl bg-[#610b0d]/5 border-2 border-[#610b0d] text-start flex items-start gap-4 shadow-sm mt-8">
              <AlertCircle className="w-6 h-6 text-[#610b0d] shrink-0 mt-0.5" />
              <p className="font-cairo text-xs sm:text-sm text-[#400708] font-bold leading-relaxed">
                {custom.productClinicalNote || (isArabic ? "ملاحظة سريرية: تركيبة خالية تماماً من المقشرات الفيزيائية الخشنة، والكبريتات المسببة للجفاف، والشموع التي تسد المسام. يجب دائماً وضع واقي شمس نهاري SPF على المناطق المعالجة المعرضة للشمس." : "Clinical Note: Formulated without harsh physical abrasives, drying sulfates, or pore-clogging waxes. Always apply daytime SPF to sun-exposed treated zones.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PINNED SECTION: {custom.productInciTitle || (isArabic ? "قائمة المكونات التفصيلية (Full INCI)" : "Full INCI Composition")} (Quote intro + Accordion) */}
      <section className="py-16 bg-[#f6f9e6] border-b border-[#e2e8c0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-start">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#485c36] font-mono uppercase tracking-widest block mb-1">
              Transparency & Purity Standard
            </span>
            <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1c2616]">
              Full INCI Composition
            </h3>
            <p className="italic text-gray-700 font-cairo text-sm mt-2 border-s-2 border-[#ca384a] ps-3">
              {custom.productInciIntro || (isArabic ? "مصمم وفق أعلى معايير النقاء الصيدلاني والكوزميسوتيكال الأوروبي:" : "Formulated to strict clinical and cosmetic purity standards:")}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#e2e8c0] shadow-sm overflow-hidden">
            <button
              onClick={() => setInciOpen(!inciOpen)}
              className="w-full p-5 flex items-center justify-between text-start text-xs sm:text-sm font-bold font-cairo text-[#1c2616] hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#485c36]" />
                <span>عرض قائمة المكونات الكاملة وفق النظام الدولي (Complete INCI List)</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${inciOpen ? "rotate-180" : ""}`} />
            </button>

            {inciOpen && (
              <div className="p-6 pt-0 border-t border-gray-100 font-mono text-xs text-gray-700 leading-loose bg-gray-50/70 select-text">
                Aqua (Deionized Water), Urea, Ammonium Lactate, Niacinamide, Salicylic Acid, Butyrospermum Parkii (Shea) Butter, Cetearyl Alcohol, Glycerin, Polysorbate 60, C12-15 Alkyl Benzoate, Panthenol (D-Panthenol), Centella Asiatica Leaf Extract, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Tocopherol (Vitamin E), Allantoin, Argania Spinosa (Argan) Kernel Oil, Persea Gratissima (Avocado) Oil, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Dimethicone, Theobroma Cacao (Cocoa) Seed Butter, Cetyl Alcohol, Phenoxyethanol, Ethylhexylglycerin, Disodium EDTA, Fragrance.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. PINNED SECTION: The Sulaf Signature (Calligraphy verse word-by-word reveal + Translation) */}
      <section className="py-24 bg-gradient-to-b from-[#182313] to-[#11190d] text-[#f6f9e6] relative overflow-hidden text-center">
        <AndalusianPattern opacity={0.08} color="#ca384a" scale={1.5} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#ca384a]/15 text-[#f6f9e6] text-xs font-mono font-bold tracking-widest uppercase border border-[#ca384a]/30">
            The Sulaf Signature
          </span>

          {/* Word-by-word Arabic Poetic Line */}
          <div className="py-6 overflow-visible">
            <h2 className="font-amiri text-3xl sm:text-5xl lg:text-6xl font-black text-[#f6f9e6] leading-[1.8] sm:leading-[1.85] drop-shadow-lg">
              {signatureWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.08,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="inline-block mx-1.5 py-2 hover:text-[#ca384a] transition-colors"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* English translation underneath in smaller italic */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="font-cormorant italic text-lg sm:text-2xl text-[#f6f9e6]/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            &ldquo;Never was Sulaf&apos;s gentleness poured into our healing, but that grace triumphed, undefeated.&rdquo;
          </motion.p>
        </div>
      </section>

      {/* 6.5 Customer Reviews & Feedback Section */}
      <section id="reviews" className="py-20 bg-white border-b border-[#e2e8c0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>{isArabic ? 'تجارب موثقة وسريرية' : 'Verified Experiences'}</span>
            </div>
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#485c36]">
              {isArabic ? 'تقييمات وآراء العملاء' : 'Customer Reviews & Experiences'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-gray-600 font-cairo">
              {isArabic
                ? 'تجارب حقيقية لعميلاتنا بعد استخدام المستحضر معتمدة من إدارة سُلاف'
                : 'Real experiences approved by Sulaf Store Management'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Reviews List Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8c0]">
                <h3 className="font-cairo font-bold text-base text-[#1c2616]">
                  {isArabic ? 'التقييمات المعتمدة' : 'Approved Reviews'}
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#f6f9e6] text-[#485c36] font-mono font-bold">
                  {reviewsCount} {isArabic ? 'رأي معتمد' : 'approved'}
                </span>
              </div>

              {reviewsLoading ? (
                <div className="p-8 text-center text-xs font-cairo text-gray-500 bg-[#f6f9e6]/50 rounded-2xl border border-[#e2e8c0]">
                  {isArabic ? 'جارِ تحميل التقييمات...' : 'Loading reviews...'}
                </div>
              ) : reviewsCount === 0 ? (
                <div className="p-8 text-center bg-[#f6f9e6]/60 rounded-3xl border border-dashed border-[#ccd6a3] space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#485c36]/10 flex items-center justify-center text-[#485c36]">
                    <Star className="w-6 h-6" />
                  </div>
                  <h4 className="font-cairo font-bold text-sm text-[#222b1a]">
                    {isArabic ? 'لا توجد تقييمات منشورة بعد لهذا المنتج' : 'No approved reviews yet for this product'}
                  </h4>
                  <p className="font-cairo text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                    {isArabic
                      ? 'كوني أول من يشارك تجربته مع هذا المستحضر عبر النموذج المجاور!'
                      : 'Be the first to share your experience using the form on the side!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-[#f6f9e6]/40 border border-[#e2e8c0] shadow-sm text-start space-y-2.5"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-cairo font-bold text-sm text-[#1c2616]">
                            {rev.authorName}
                          </span>
                          {rev.authorRole && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-cairo font-bold bg-[#485c36]/10 text-[#485c36] flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              {rev.authorRole}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {rev.title && (
                        <h5 className="font-cairo font-bold text-xs text-[#485c36]">
                          {rev.title}
                        </h5>
                      )}

                      <p className="font-cairo text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                        {rev.comment}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-2 border-t border-[#e2e8c0]/60">
                        <span>
                          {new Date(rev.createdAt).toLocaleDateString(
                            isArabic ? 'ar-EG' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' }
                          )}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="text-emerald-700 font-cairo font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {isArabic ? 'تجربة موثقة' : 'Verified'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submission Form Column (5 cols) */}
            <div className="lg:col-span-5 bg-[#f6f9e6] p-6 sm:p-7 rounded-3xl border border-[#e2e8c0] shadow-sm text-start space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#485c36]">
                  {isArabic ? 'رأيك يهمنا' : 'Feedback'}
                </span>
                <h3 className="font-amiri text-2xl font-bold text-[#1c2616]">
                  {isArabic ? 'شاركينا تجربتك ورأيك' : 'Share Your Experience'}
                </h3>
                <p className="text-xs font-cairo text-gray-600">
                  {isArabic
                    ? 'تقييمك يخضع لمراجعة إدارة المتجر قبل النشر لضمان المصداقية.'
                    : 'Your review is reviewed by management before publishing to ensure authenticity.'}
                </p>
              </div>

              {feedbackSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-cairo font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      {isArabic
                        ? 'شكراً لمشاركتك الصادقة!'
                        : 'Thank you for your review!'}
                    </span>
                  </div>
                  <p className="text-xs font-cairo text-emerald-800 leading-relaxed">
                    {isArabic
                      ? 'تم استلام رأيك بنجاح، وهو قيد المراجعة والاعتماد من قبل إدارة سُلاف وسيظهر فور الموافقة عليه ✓'
                      : 'Your review has been received and is pending confirmation by store management before publishing.'}
                  </p>
                  <button
                    onClick={() => setFeedbackSuccess(false)}
                    className="mt-2 text-xs font-cairo font-bold text-emerald-700 underline cursor-pointer"
                  >
                    {isArabic ? 'إرسال تقييم آخر' : 'Submit another review'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4 font-cairo">
                  {feedbackError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{feedbackError}</span>
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-[#1c2616] mb-1.5">
                      {isArabic ? 'التقييم بالنجوم:' : 'Your Rating:'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          aria-label={`${star} stars`}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              (hoverRating || feedbackRating) >= star
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ms-2 text-xs font-bold text-amber-600 font-mono">
                        {hoverRating || feedbackRating} / 5
                      </span>
                    </div>
                  </div>

                  {/* Author Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#1c2616] mb-1">
                      {isArabic ? 'الاسم الكريم *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder={isArabic ? 'مثال: مروة أحمد' : 'e.g. Sarah Smith'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8c0] bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485c36]"
                    />
                  </div>

                  {/* Author Role (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-[#1c2616] mb-1">
                      {isArabic ? 'صفتك (اختياري)' : 'Role / Title (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={feedbackRole}
                      onChange={(e) => setFeedbackRole(e.target.value)}
                      placeholder={isArabic ? 'مثال: عميلة سُلاف / صيدلانية / طبيبة جلدية' : 'e.g. Dermatologist / Verified Client'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8c0] bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485c36]"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-[#1c2616] mb-1">
                      {isArabic ? 'رأيك وتفاصيل تجربتك *' : 'Your Review & Experience *'}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder={
                        isArabic
                          ? 'اكتبي تجربتك الصادقة مع المستحضر، التغيير في ملمس البشرة، والمدة التي لاحظتِ فيها النتيجة...'
                          : 'Describe your experience, texture improvements, and results...'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8c0] bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485c36] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={feedbackLoading}
                    className="w-full py-3 px-4 rounded-xl font-cairo font-bold text-xs bg-[#485c36] hover:bg-[#3a4a2b] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {feedbackLoading
                        ? (isArabic ? 'جارِ الإرسال...' : 'Submitting...')
                        : (isArabic ? 'إرسال التقييم للإدارة للاعتماد' : 'Submit Review for Approval')}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Complementary Formulations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-amiri text-3xl font-bold text-[#485c36]">
              {isArabic ? "روتين سلاف المتكامل للعناية الفائقة" : "Sulaf Complete High-Performance Ritual"}
            </h2>
            <p className="text-xs text-gray-600 font-cairo mt-1">
              Complementary clinical formulas formulated to reinforce epidermal cellular renewal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.filter((p) => p.id !== product.id).map((cp) => (
              <ProductCard key={cp.id} product={cp} displayMode="podium" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

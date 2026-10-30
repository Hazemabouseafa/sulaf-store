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
import { ProductCustomSectionsRenderer } from "@/components/shop/ProductCustomSectionsRenderer";
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
    <div className="bg-[#f4f1e6] text-[#222b1a] min-h-screen font-cairo">
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
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-[#fdfef8]/90 border border-[#e2e8c0] shadow-sm relative overflow-hidden">
              <div className="absolute top-4 start-4 z-20">
                <span className="px-3.5 py-1 rounded-full text-xs font-bold font-cairo bg-[#ca384a] text-white shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{custom.productPodiumTag || (isArabic ? "ترميم هيكلي سريري" : "Architectural Reset")}</span>
                </span>
              </div>

              <MarblePodium
                imageSrc={
                  product.images?.[selectedImageIndex]?.url ||
                  product.images?.[0]?.url ||
                  (product as any).imageUrl ||
                  "/brand/sulaf-flower-symbol.png"
                }
                alt={product.nameAr || "Sulaf Product"}
                size="lg"
                priority={true}
              />

              {/* Thumbnails row if multiple images exist */}
              {product.images && product.images.length > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-20">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-12 h-12 rounded-xl p-1 bg-white border-2 transition-all cursor-pointer overflow-hidden ${
                        selectedImageIndex === i
                          ? "border-[#610b0d] shadow-sm scale-105"
                          : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                      }`}
                      title={img.alt || product.nameAr}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || product.nameAr}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {vis.productSignaturePoemVis !== false && (
                <div className="mt-4 p-3.5 rounded-2xl bg-[#485c36]/10 text-center max-w-sm border border-[#485c36]/20">
                  <p className={`${isArabic ? "font-gulzar" : "font-cormorant"} text-base text-[#485c36] font-bold`}>
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
              <div className="flex items-center gap-2 text-xs font-cairo text-[#610b0d]">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        reviewsCount > 0 && i < Math.round(Number(avgRating))
                          ? 'fill-[#ca384a] text-[#ca384a]'
                          : 'text-[#dbe2bd]'
                      }`}
                    />
                  ))}
                </div>
                {reviewsCount > 0 ? (
                  <>
                    <span className="font-bold text-[#1c2616]">{avgRating}</span>
                    <span className="text-gray-600 font-medium">
                      ({reviewsCount} {isArabic ? 'تقييم معتمد' : 'verified reviews'})
                    </span>
                  </>
                ) : (
                  <span className="text-gray-600 font-medium">
                    {isArabic ? '(لا توجد تقييمات منشورة بعد — كوني أول من يقيم)' : '(No verified reviews yet — be first to review)'}
                  </span>
                )}
              </div>

              <div>
                <h1 className={`${isArabic ? "font-gulzar" : "font-cinzel"} text-3xl sm:text-4xl font-bold text-[#485c36]`}>
                  {productName}
                </h1>
                <p className="font-cairo text-xs sm:text-sm text-gray-800 font-semibold mt-1.5 leading-relaxed">
                  {productSubtitle}
                </p>
              </div>

              <p className="font-cairo text-xs sm:text-sm text-[#1c2616] leading-relaxed bg-[#fdfef8]/80 p-4 rounded-2xl border border-[#e2e8c0]">
                {shortDesc}
              </p>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#610b0d]">{unitPrice} {currency}</span>
                {product.compareAtPrice > unitPrice && (
                  <span className="text-base text-gray-400 line-through font-semibold">
                    {product.compareAtPrice} {currency}
                  </span>
                )}
                {product.compareAtPrice > unitPrice && (
                  <span className="text-xs font-bold text-[#485c36] bg-[#485c36]/10 px-2.5 py-1 rounded-full border border-[#485c36]/20">
                    {isArabic ? "وفري" : "Save"} {product.compareAtPrice - unitPrice} {currency}
                  </span>
                )}
              </div>

              {/* Dual Payment Options: Full vs Deposit 100 EGP */}
              <div className="p-4 rounded-3xl bg-[#fdfef8] border border-[#e2e8c0] space-y-3 shadow-sm">
                <span className="block text-xs font-bold text-[#485c36] font-cairo">
                  {custom.productPaymentOptionsHeading || (isArabic ? "اختاري طريقة الدفع التي تناسبك:" : "Select your preferred payment structure:")}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setDepositChoice(true)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      depositChoice
                        ? "bg-[#610b0d]/10 border-[#610b0d] ring-1 ring-[#610b0d]"
                        : "bg-[#f4f1e6] border-[#e2e8c0]"
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
                        : "bg-[#f4f1e6] border-[#e2e8c0]"
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
                <div className="flex items-center justify-between sm:justify-start border border-[#e2e8c0] rounded-2xl overflow-hidden bg-[#fdfef8] p-1">
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
                      ? "bg-[#38492a] text-[#f6f9e6]"
                      : "bg-[#485c36] hover:bg-[#38492a] text-[#f6f9e6]"
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
                <div className="p-2.5 rounded-xl bg-[#fdfef8] border border-[#e2e8c0] flex sm:flex-col items-center justify-center gap-2 sm:gap-1">
                  <Truck className="w-4 h-4 text-[#485c36] shrink-0" />
                  <span>{custom.productGuarantee1 || (isArabic ? "شحن سريع لكافة المحافظات" : "Express Nationwide Delivery")}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#fdfef8] border border-[#e2e8c0] flex sm:flex-col items-center justify-center gap-2 sm:gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#485c36] shrink-0" />
                  <span>{custom.productGuarantee2 || (isArabic ? "تحول ملمس الحرير في 7 أيام" : "Silk Skin in 7 Days")}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#fdfef8] border border-[#e2e8c0] flex sm:flex-col items-center justify-center gap-2 sm:gap-1">
                  <CheckCircle2 className="w-4 h-4 text-[#485c36] shrink-0" />
                  <span>{custom.productGuarantee3 || (isArabic ? "فحص العبوة قبل الاستلام" : "Inspect on Delivery")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Product Custom Sections (Story, Actives, Ritual, Custom Cards & Sections, INCI, Signature) */}
      <ProductCustomSectionsRenderer
        product={product}
        isArabic={isArabic}
        t={t}
        customSettings={custom}
      />

      {/* 6.5 Customer Reviews & Feedback Section */}
      <section id="reviews" className="py-20 bg-[#f4f1e6] border-b border-[#e2e8c0]">
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
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#f4f1e6] text-[#485c36] font-mono font-bold">
                  {reviewsCount} {isArabic ? 'رأي معتمد' : 'approved'}
                </span>
              </div>

              {reviewsLoading ? (
                <div className="p-8 text-center text-xs font-cairo text-gray-500 bg-[#fdfef8] rounded-2xl border border-[#e2e8c0]">
                  {isArabic ? 'جارِ تحميل التقييمات...' : 'Loading reviews...'}
                </div>
              ) : reviewsCount === 0 ? (
                <div className="p-8 text-center bg-[#fdfef8] rounded-3xl border border-dashed border-[#ccd6a3] space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#485c36]/10 flex items-center justify-center text-[#485c36]">
                    <Star className="w-6 h-6 fill-[#ca384a] text-[#ca384a]" />
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
                      className="p-5 rounded-2xl bg-[#fdfef8] border border-[#e2e8c0] shadow-sm text-start space-y-2.5"
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
                                  ? 'fill-[#ca384a] text-[#ca384a]'
                                  : 'text-[#dbe2bd]'
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
                          <span className="text-[#485c36] font-cairo font-bold flex items-center gap-1">
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
            <div className="lg:col-span-5 bg-[#fdfef8] p-6 sm:p-7 rounded-3xl border border-[#e2e8c0] shadow-sm text-start space-y-4">
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
                <div className="p-5 rounded-2xl bg-[#485c36]/10 border border-[#485c36]/25 text-[#18271b] space-y-2">
                  <div className="flex items-center gap-2 font-cairo font-bold text-sm text-[#485c36]">
                    <CheckCircle2 className="w-5 h-5 text-[#485c36] shrink-0" />
                    <span>
                      {isArabic
                        ? 'شكراً لمشاركتك الصادقة!'
                        : 'Thank you for your review!'}
                    </span>
                  </div>
                  <p className="text-xs font-cairo text-[#18271b] leading-relaxed">
                    {isArabic
                      ? 'تم استلام رأيك بنجاح، وهو قيد المراجعة والاعتماد من قبل إدارة سُلاف وسيظهر فور الموافقة عليه ✓'
                      : 'Your review has been received and is pending confirmation by store management before publishing.'}
                  </p>
                  <button
                    onClick={() => setFeedbackSuccess(false)}
                    className="mt-2 text-xs font-cairo font-bold text-[#485c36] underline cursor-pointer"
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
                                ? 'fill-[#ca384a] text-[#ca384a]'
                                : 'text-[#dbe2bd]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ms-2 text-xs font-bold text-[#610b0d] font-mono">
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8c0] bg-[#fdfef8] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485c36]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8c0] bg-[#fdfef8] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485c36]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8c0] bg-[#fdfef8] text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#485c36] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={feedbackLoading}
                    className="w-full py-3 px-4 rounded-xl font-cairo font-bold text-xs bg-[#485c36] hover:bg-[#38492a] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      <section className="py-20 pb-28 lg:pb-20 bg-[#f4f1e6]">
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

      {/* Mobile Sticky Add to Bag Bar for Seamless Phone Experience */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#fdfef8]/95 backdrop-blur-md border-t border-[#e2e8c0] p-3 px-4 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3 pb-safe">
        <div className="flex flex-col text-start">
          <span className="text-[11px] font-bold text-gray-500 font-cairo">
            {depositChoice ? (isArabic ? "عربون الحجز:" : "Deposit:") : (isArabic ? "السعر:" : "Price:")}
          </span>
          <span className="text-base font-black text-[#610b0d] font-mono">
            {depositChoice ? (settings.payment?.depositAmount ?? 100) : unitPrice * quantity} {currency}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-4 rounded-xl font-cairo font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
            added
              ? "bg-[#38492a] text-[#f6f9e6]"
              : "bg-[#485c36] hover:bg-[#38492a] text-[#f6f9e6]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {added
              ? (isArabic ? "تمت الإضافة لحقيبتكِ ✓" : "Added to Bag ✓")
              : depositChoice
              ? (isArabic ? "حجز بعربون 100 ج.م" : "Reserve with 100 EGP")
              : (isArabic ? `أضيفي للحقيبة — ${unitPrice * quantity} ج.م` : `Add to Bag — ${unitPrice * quantity} EGP`)}
          </span>
        </button>
      </div>
    </div>
  );
}

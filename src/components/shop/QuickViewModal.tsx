"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductData } from "@/lib/data/mock-data";
import { useCart } from "@/lib/cart/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { X, Check, Star, ShoppingBag, ArrowLeft, ArrowRight, Shield } from "lucide-react";

interface QuickViewModalProps {
  product: ProductData | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { isArabic, t, dir } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currency = isArabic ? "ج.م" : "EGP";
  const currentVariant = product.variants.find((v) => v.id === selectedVariant) || product.variants[0];
  const price = currentVariant ? currentVariant.price : product.price;

  const productName = isArabic ? product.nameAr : product.nameEn;
  const productSubtitle = isArabic ? product.subtitleAr : product.subtitleEn;
  const productDescription = isArabic ? product.descriptionAr : product.descriptionEn;

  function handleAdd() {
    if (!product) return;
    addItem(product, currentVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-cairo">
      <div className="relative w-full max-w-2xl bg-[#f6f9e6] rounded-2xl sm:rounded-3xl border border-[#ebdcd5] shadow-2xl p-5 sm:p-6 md:p-8 overflow-hidden max-h-[90dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} p-2 rounded-full bg-white/80 hover:bg-white text-[#610b0d] transition-colors cursor-pointer`}
          aria-label={t.nav.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/70 rounded-2xl border border-[#e2e8c0]">
            <Image
              src={product.images?.[0]?.url || (product as any).imageUrl || "/brand/sulaf-flower-symbol.png"}
              alt={productName}
              width={220}
              height={220}
              unoptimized
              className="object-contain"
            />
          </div>

          {/* Details */}
          <div className="space-y-4 text-start">
            <div>
              {product.reviewsCount > 0 ? (
                <div className="flex items-center gap-1.5 text-xs text-[#ca384a] font-cairo mb-1">
                  <Star className="w-4 h-4 fill-[#ca384a] text-[#ca384a]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-gray-500">
                    ({product.reviewsCount} {t.product.reviewsCount})
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-[11px] text-[#485c36] font-cairo font-bold mb-1">
                  <Shield className="w-3.5 h-3.5 text-[#485c36]" />
                  <span>{isArabic ? "تركيبة سريرية معتمدة" : "Verified Clinical Formula"}</span>
                </div>
              )}
              <h2 className="font-amiri text-2xl font-bold text-[#222b1a]">
                {productName}
              </h2>
              <p className="text-xs text-[#485c36] font-cairo font-semibold">
                {productSubtitle}
              </p>
            </div>

            <p className="text-xs text-gray-700 font-cairo leading-relaxed line-clamp-3">
              {productDescription}
            </p>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold font-cairo text-[#485c36]">
                  {t.product.selectSize}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-cairo border transition-all cursor-pointer ${
                        (selectedVariant === v.id || (!selectedVariant && v === product.variants[0]))
                          ? "bg-[#610b0d] text-white border-[#610b0d]"
                          : "bg-white text-gray-700 border-[#ebdcd5]"
                      }`}
                    >
                      {isArabic ? v.titleAr : v.titleEn} ({v.price} {currency})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Deposit */}
            <div className="pt-2 border-t border-[#ebdcd5]">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-cairo text-[#610b0d]">
                  {price * quantity} {currency}
                </span>
                
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl bg-[#610b0d] hover:bg-[#470708] text-[#f6f9e6] font-cairo font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t.product.addedToBag}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.product.addToBag}</span>
                  </>
                )}
              </button>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="p-3 rounded-xl border border-[#610b0d] text-[#610b0d] hover:bg-[#610b0d]/10 transition-colors"
                title={t.product.fullStory}
              >
                {isArabic ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 font-cairo">
              <Shield className="w-3.5 h-3.5 text-[#485c36] shrink-0" />
              <span>{t.product.guaranteeBadge}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

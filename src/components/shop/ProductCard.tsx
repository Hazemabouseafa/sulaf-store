"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductData } from "@/lib/data/mock-data";
import { useCart } from "@/lib/cart/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { MarblePodium } from "./MarblePodium";
import { ShoppingBag, Eye, Star, Sparkles, Check } from "lucide-react";

interface ProductCardProps {
  product: ProductData;
  displayMode?: "podium" | "standard";
  onQuickView?: (product: ProductData) => void;
}

export function ProductCard({
  product,
  displayMode = "podium",
  onQuickView,
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isArabic, t } = useLanguage();
  const [added, setAdded] = useState(false);

  const currency = isArabic ? "ج.م" : "EGP";

  function handleCardClick() {
    router.push(`/product/${product.slug}`);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const productName = isArabic ? product.nameAr : product.nameEn;
  const productSubtitle = isArabic ? product.subtitleAr : product.subtitleEn;
  const badgeText = isArabic 
    ? (product.badgeAr || "مستحضر حصري")
    : (product.badgeAr ? "Exclusive" : "Featured");

  return (
    <div
      onClick={handleCardClick}
      className="group relative h-full flex flex-col justify-between rounded-3xl bg-white/90 backdrop-blur-md border border-[#e2e8c0] hover:border-[#d4af37] p-4 sm:p-5 shadow-[0_4px_20px_rgba(72,92,54,0.06)] hover:shadow-[0_16px_36px_rgba(72,92,54,0.15)] transition-all duration-300 overflow-hidden font-cairo cursor-pointer"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#485c36]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#485c36]/12 transition-all" />

      {/* Top Meta: Badge & Rating */}
      <div className="relative z-20 flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-cairo bg-[#ca384a] text-white shadow-xs">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[120px]">{badgeText}</span>
        </span>

        <div className="flex items-center gap-1 text-[11px] font-bold font-cairo text-amber-600 bg-amber-50/90 px-2 py-0.5 rounded-md border border-amber-200/70 shrink-0">
          <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
          <span>{product.rating}</span>
          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Product Image & Podium */}
      <div className="relative block my-1 group/img focus:outline-none">
        {displayMode === "podium" ? (
          <MarblePodium
            imageSrc={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
            alt={productName}
            size="md"
          />
        ) : (
          <div className="relative h-48 w-full flex items-center justify-center p-3">
            <Image
              src={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
              alt={productName}
              width={140}
              height={140}
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Active Ingredient Pills */}
      <div className="min-h-[26px] flex flex-wrap gap-1 my-2">
        {product.activeIngredients.slice(0, 3).map((ing) => (
          <span
            key={ing.id}
            className="text-[10px] sm:text-[11px] font-semibold font-cairo px-2 py-0.5 rounded-full bg-[#f6f9e6] border border-[#d4af37]/35 text-[#485c36] truncate max-w-[150px]"
          >
            {ing.concentration} {isArabic ? ing.nameAr : ing.nameEn}
          </span>
        ))}
      </div>

      {/* Title & Subtitle with fixed min-height for uniform alignment */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-start">
        <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#1c2616] group-hover:text-[#3d502d] transition-colors line-clamp-1 min-h-[1.75rem]">
          {productName}
        </h3>
        <p className="text-xs text-gray-700 font-cairo font-medium line-clamp-2 min-h-[2rem] leading-relaxed">
          {productSubtitle}
        </p>
      </div>

      {/* Pinned Bottom Row: Pricing & Action Buttons */}
      <div className="mt-3 pt-3 border-t border-[#e2e8c0] flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-cairo text-base sm:text-lg font-black text-[#3d502d] leading-tight">
            {product.price} {currency}
          </span>
          {product.compareAtPrice && (
            <span className="text-[11px] text-gray-400 line-through font-cairo">
              {product.compareAtPrice} {currency}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="p-2 rounded-xl border border-[#e2e8c0] text-gray-600 hover:text-[#485c36] hover:bg-[#f6f9e6] transition-colors cursor-pointer"
              title={t.product.quickView}
              aria-label={t.product.quickView}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-3 sm:px-4 py-2 rounded-xl font-cairo font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all duration-300 cursor-pointer ${
              added
                ? "bg-green-700 text-white"
                : "bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] active:scale-95"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.product.addedToBag}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.product.addToBag}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductData } from "@/lib/data/mock-data";
import { useCart } from "@/lib/cart/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { MarblePodium } from "./MarblePodium";
import { ShoppingBag, Eye, Star, Sparkles, Check, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: ProductData;
  displayMode?: "podium" | "standard";
  featuredBento?: boolean;
  onQuickView?: (product: ProductData) => void;
}

export function ProductCard({
  product,
  displayMode = "podium",
  featuredBento = false,
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
    ? product.badgeAr || "مستحضر سريري"
    : product.badgeAr
    ? "Clinical Formula"
    : "Featured";

  return (
    <article
      onClick={handleCardClick}
      className={`group relative h-full flex flex-col justify-between rounded-[2rem] p-5 sm:p-7 transition-all duration-300 overflow-hidden font-cairo cursor-pointer ${
        featuredBento
          ? "bg-[#485c36] text-[#f6f9e6] border-2 border-[#485c36] shadow-[0_18px_45px_rgba(72,92,54,0.16)]"
          : "bg-white text-[#485c36] border-2 border-[#485c36]/15 hover:border-[#485c36] shadow-[0_8px_28px_rgba(72,92,54,0.06)]"
      }`}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Top Meta: Badge & Rating / Verified Tag */}
      <div className="relative z-20 flex items-center justify-between gap-2 mb-3">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${
            featuredBento
              ? "bg-[#ca384a] text-[#f6f9e6]"
              : "bg-[#610b0d] text-[#f3a5a1]"
          }`}
        >
          <Sparkles className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[140px]">{badgeText}</span>
        </span>

        {product.reviewsCount > 0 ? (
          <div
            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
              featuredBento
                ? "bg-[#f6f9e6]/15 text-[#f3a5a1]"
                : "bg-[#ca384a]/10 text-[#ca384a]"
            }`}
          >
            <Star className="w-3 h-3 fill-current shrink-0" />
            <span>{product.rating}</span>
            <span className="opacity-75">({product.reviewsCount})</span>
          </div>
        ) : (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              featuredBento
                ? "bg-[#f6f9e6]/10 text-[#f3a5a1]"
                : "bg-[#f6f9e6] text-[#485c36]"
            }`}
          >
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span>{product.sku || "SULAF-RX"}</span>
          </div>
        )}
      </div>

      {/* Main Content Layout: Horizontal split if featuredBento, vertical otherwise */}
      <div
        className={`relative z-10 my-2 flex flex-col ${
          featuredBento ? "md:flex-row md:items-center gap-6" : "gap-4"
        }`}
      >
        {/* Product Image & Podium */}
        <div
          className={`relative flex items-center justify-center rounded-3xl p-3 ${
            featuredBento
              ? "bg-[#f6f9e6]/10 border border-[#f6f9e6]/15 md:w-52 shrink-0"
              : "bg-[#f6f9e6] border border-[#485c36]/10"
          }`}
        >
          {displayMode === "podium" ? (
            <MarblePodium
              imageSrc={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
              alt={productName}
              size="sm"
            />
          ) : (
            <div className="relative h-44 w-full flex items-center justify-center p-2">
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

        {/* Text & Active Ingredients */}
        <div className="space-y-2.5 flex-1 text-start">
          {/* Active Ingredient Pills */}
          <div className="flex flex-wrap gap-1.5">
            {product.activeIngredients.slice(0, 3).map((ing) => (
              <span
                key={ing.id}
                className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  featuredBento
                    ? "bg-[#610b0d] text-[#f3a5a1] border border-[#f3a5a1]/30"
                    : "bg-[#f6f9e6] border border-[#485c36]/30 text-[#485c36]"
                }`}
              >
                {ing.concentration} {isArabic ? ing.nameAr : ing.nameEn}
              </span>
            ))}
          </div>

          <h3
            className={`font-amiri text-xl sm:text-2xl font-bold leading-snug ${
              featuredBento ? "text-[#f6f9e6]" : "text-[#610b0d]"
            }`}
          >
            {productName}
          </h3>

          <p
            className={`text-xs leading-relaxed line-clamp-2 ${
              featuredBento ? "text-[#f6f9e6]/85" : "text-[#485c36]/85"
            }`}
          >
            {productSubtitle}
          </p>
        </div>
      </div>

      {/* Pinned Bottom Row: Pricing & Action Buttons */}
      <div
        className={`mt-4 pt-4 border-t flex items-center justify-between gap-2 ${
          featuredBento ? "border-[#f6f9e6]/15" : "border-[#485c36]/15"
        }`}
      >
        <div className="flex items-baseline gap-2">
          <span
            className={`font-mono text-lg sm:text-xl font-black ${
              featuredBento ? "text-[#f3a5a1]" : "text-[#485c36]"
            }`}
          >
            {product.price} {currency}
          </span>
          {product.compareAtPrice > product.price && (
            <span
              className={`font-mono text-xs line-through ${
                featuredBento ? "text-[#f6f9e6]/50" : "text-[#485c36]/50"
              }`}
            >
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
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                featuredBento
                  ? "border-[#f6f9e6]/25 text-[#f6f9e6] hover:bg-[#f6f9e6]/15"
                  : "border-[#485c36]/20 text-[#485c36] hover:bg-[#f6f9e6]"
              }`}
              title={t.product.quickView}
              aria-label={t.product.quickView}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleAddToCart}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all duration-300 cursor-pointer ${
              added
                ? "bg-[#610b0d] text-[#f3a5a1]"
                : featuredBento
                ? "bg-[#ca384a] hover:bg-[#610b0d] text-[#f6f9e6]"
                : "bg-[#485c36] hover:bg-[#610b0d] text-[#f6f9e6] active:scale-95"
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
    </article>
  );
}

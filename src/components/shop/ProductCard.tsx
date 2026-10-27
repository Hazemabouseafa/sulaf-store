"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductData } from "@/lib/data/mock-data";
import { useCart } from "@/lib/cart/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { MarblePodium } from "./MarblePodium";
import { ShoppingBag, Eye, Star, Check } from "lucide-react";

interface ProductCardProps {
  product: ProductData;
  displayMode?: "podium" | "standard";
  featuredBento?: boolean;
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

  return (
    <article
      onClick={handleCardClick}
      className="group relative h-full flex flex-col justify-between rounded-t-[11rem] rounded-b-[2rem] bg-white border border-[#485c36]/20 hover:border-[#485c36] p-4 sm:p-5 shadow-[0_10px_30px_rgba(72,92,54,0.06)] hover:shadow-[0_18px_42px_rgba(72,92,54,0.14)] transition-all duration-300 font-cairo cursor-pointer text-center"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 1. ANDALUSIAN ARCH NICHE FOR THE PRODUCT */}
      <div className="relative rounded-t-[10rem] rounded-b-2xl bg-[#f6f9e6] border border-[#485c36]/15 pt-8 pb-4 px-4 flex flex-col items-center justify-center overflow-hidden group-hover:bg-[#485c36]/[0.06] transition-colors">
        {/* Top Arch Keystone Concentration Tag */}
        <span className="font-mono text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full bg-[#485c36] text-[#f6f9e6] mb-2">
          {product.activeIngredients[0]
            ? `${product.activeIngredients[0].concentration} ${
                isArabic
                  ? product.activeIngredients[0].nameAr
                  : product.activeIngredients[0].nameEn
              }`
            : isArabic
            ? "تركيبة سريرية"
            : "Clinical Formula"}
        </span>

        {displayMode === "podium" ? (
          <MarblePodium
            imageSrc={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
            alt={productName}
            size="sm"
          />
        ) : (
          <div className="relative h-40 w-full flex items-center justify-center p-2">
            <Image
              src={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
              alt={productName}
              width={135}
              height={135}
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Quick View Floating Icon inside Arch Corner */}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 end-3 p-2 rounded-full bg-white/90 hover:bg-[#610b0d] text-[#485c36] hover:text-[#f6f9e6] border border-[#485c36]/15 transition-colors cursor-pointer shadow-xs"
            title={t.product.quickView}
            aria-label={t.product.quickView}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. MINIMAL PRODUCT DETAILS */}
      <div className="mt-4 space-y-1.5 flex-1 flex flex-col justify-start px-1">
        {product.reviewsCount > 0 && (
          <div className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-[#ca384a]">
            <Star className="w-3 h-3 fill-[#ca384a] text-[#ca384a]" />
            <span>{product.rating}</span>
            <span className="text-[#485c36]/60">({product.reviewsCount})</span>
          </div>
        )}

        <h3 className="font-amiri text-xl font-bold text-[#610b0d] group-hover:text-[#485c36] transition-colors line-clamp-1">
          {productName}
        </h3>

        <p className="text-xs text-[#485c36]/80 line-clamp-2 leading-relaxed">
          {productSubtitle}
        </p>
      </div>

      {/* 3. SIMPLE PRICE & ONE-CLICK ADD ROW */}
      <div className="mt-4 pt-3.5 border-t border-[#485c36]/15 flex items-center justify-between gap-2 px-1">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-lg font-black text-[#485c36]">
            {product.price} {currency}
          </span>
          {product.compareAtPrice > product.price && (
            <span className="font-mono text-[11px] text-[#485c36]/45 line-through">
              {product.compareAtPrice}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            added
              ? "bg-[#610b0d] text-[#f3a5a1]"
              : "bg-[#485c36] hover:bg-[#ca384a] text-[#f6f9e6] active:scale-95"
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
    </article>
  );
}

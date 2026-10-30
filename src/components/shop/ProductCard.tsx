"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductData } from "@/lib/data/mock-data";
import { useCart } from "@/lib/cart/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { ShoppingBag, Check, ArrowLeft, ArrowRight, Eye } from "lucide-react";

interface ProductCardProps {
  product: ProductData;
  index?: number;
  displayMode?: "podium" | "standard";
  featuredBento?: boolean;
  onQuickView?: (product: ProductData) => void;
}

export function ProductCard({
  product,
  index = 0,
  onQuickView,
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isArabic, t } = useLanguage();
  const [added, setAdded] = useState(false);

  const currency = isArabic ? "ج.م" : "EGP";
  const productName = isArabic ? product.nameAr : product.nameEn;
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const num = String(index + 1).padStart(2, "0");

  const triplet =
    product.activeIngredients && product.activeIngredients.length > 0
      ? product.activeIngredients
          .slice(0, 3)
          .map((ing) => `${ing.concentration} ${isArabic ? ing.nameAr : ing.nameEn}`)
          .join(" · ")
      : isArabic
      ? "تغذية · ترميم · نعومة"
      : "Nourish · Restore · Replenish";

  function handleCardClick() {
    router.push(`/product/${product.slug}`);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  // Matches the numbered card aesthetic (| 01, crimson stem, category, serif title, dot summary, Shop Now ->)
  return (
    <article
      onClick={handleCardClick}
      className="group silk-card rounded-xl bg-[#f9fbf0] border border-[#485c36]/15 hover:border-[#610b0d]/50 p-6 flex flex-col justify-between shadow-[0_6px_22px_rgba(34,48,30,0.05)] cursor-pointer font-cairo text-start"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Top: Number + Price + Quick View */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[#22301e] font-bold ps-1.5 border-s-2 border-[#610b0d]">
            {num}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-[#610b0d]">
              {product.price} {currency}
            </span>
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="p-1 text-[#610b0d]/70 hover:text-[#610b0d] cursor-pointer"
                title={t.product.quickView}
                aria-label={t.product.quickView}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="w-px h-6 bg-[#ca384a]/60 my-3 ms-0.5" />
      </div>

      {/* Center Bottle Preview */}
      <div className="relative h-36 w-full flex items-center justify-center my-2">
        {/* Soft luminous breathing aura on hover */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#f3a5a1]/25 via-[#e5c876]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <Image
          src={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
          alt={productName}
          width={125}
          height={125}
          className="object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-translate-y-2.5 drop-shadow-[0_8px_16px_rgba(97,11,13,0.06)] group-hover:drop-shadow-[0_18px_30px_rgba(97,11,13,0.18)]"
        />
      </div>

      {/* Category + Serif Title + Triplet */}
      <div className="space-y-1.5 my-2">
        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#610b0d]/75 block">
          {isArabic ? product.badgeAr || "مستحضر سريري" : "CLINICAL FORMULA"}
        </span>

        <h3
          className={`${
            isArabic
              ? "font-gulzar text-xl leading-snug"
              : "font-cinzel text-xl leading-snug"
          } font-bold text-[#220809] group-hover:text-[#610b0d] transition-colors line-clamp-2 min-h-[2.75rem]`}
        >
          {productName}
        </h3>

        <p className="text-[11px] text-[#610b0d]/80 pt-1 line-clamp-1">
          {triplet}
        </p>
      </div>

      {/* Bottom: Shop Now + Quick Add */}
      <div className="pt-4 mt-2 border-t border-[#610b0d]/10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#220809] group-hover:text-[#610b0d] transition-colors">
          <span>{isArabic ? "اطلبي الآن" : "Shop Now"}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </span>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            added
              ? "bg-[#ca384a] text-white"
              : "bg-[#610b0d] hover:bg-[#470708] text-[#f6f9e6]"
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

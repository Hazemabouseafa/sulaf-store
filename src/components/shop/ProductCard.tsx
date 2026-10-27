"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductData } from "@/lib/data/mock-data";
import { useCart } from "@/lib/cart/cart-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { ShoppingBag, Check } from "lucide-react";

interface ProductCardProps {
  product: ProductData;
  displayMode?: "podium" | "standard";
  featuredBento?: boolean;
  onQuickView?: (product: ProductData) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isArabic, t } = useLanguage();
  const [added, setAdded] = useState(false);

  const currency = isArabic ? "ج.م" : "EGP";
  const productName = isArabic ? product.nameAr : product.nameEn;

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

  // Ultra-simple card for Act II: Image + Name + Price + Cart Button ONLY
  return (
    <article
      onClick={handleCardClick}
      className="group h-full flex flex-col justify-between rounded-3xl bg-white border border-[#485c36]/15 hover:border-[#485c36] p-5 transition-all duration-300 font-cairo cursor-pointer"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 1. Clean Image Frame */}
      <div className="relative aspect-square w-full rounded-2xl bg-[#f6f9e6] flex items-center justify-center p-6 overflow-hidden">
        <Image
          src={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
          alt={productName}
          width={180}
          height={180}
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 2. Product Name Only (No long descriptions) */}
      <div className="mt-4 text-start">
        <h3 className="font-amiri text-xl font-bold text-[#485c36] group-hover:text-[#610b0d] transition-colors line-clamp-1">
          {productName}
        </h3>
      </div>

      {/* 3. Price + Single Add to Cart Button */}
      <div className="mt-4 pt-3 border-t border-[#485c36]/10 flex items-center justify-between gap-2">
        <span className="font-mono text-lg font-black text-[#610b0d]">
          {product.price} {currency}
        </span>

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

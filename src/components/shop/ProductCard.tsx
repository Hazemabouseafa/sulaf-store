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
  const productSubtitle = isArabic ? product.subtitleAr : product.subtitleEn;

  const prescriptionLine =
    product.activeIngredients && product.activeIngredients.length > 0
      ? product.activeIngredients
          .slice(0, 2)
          .map((ing) => `${ing.concentration} ${isArabic ? ing.nameAr : ing.nameEn}`)
          .join(" — ")
      : isArabic
      ? "تركيبة سريرية"
      : "Clinical Formula";

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

  // IDEA #1: Quiet Apothecary Specimen (No heavy card borders, pure parchment aesthetic)
  return (
    <article
      onClick={handleCardClick}
      className="group py-6 flex flex-col justify-between border-t border-[#485c36]/20 font-cairo cursor-pointer text-start"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Floating Bottle without a Box */}
      <div className="relative h-56 w-full flex items-center justify-center my-4">
        <Image
          src={product.images[0]?.url || "/brand/sulaf-flower-symbol.png"}
          alt={productName}
          width={175}
          height={175}
          className="object-contain drop-shadow-[0_18px_24px_rgba(72,92,54,0.14)] transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Minimalist Prescription Line & Name */}
      <div className="space-y-1.5">
        <span className="font-mono text-[10px] text-[#ca384a] font-bold tracking-wider uppercase block">
          {prescriptionLine}
        </span>

        <h3 className="font-amiri text-2xl font-normal text-[#485c36] group-hover:text-[#610b0d] transition-colors">
          {productName}
        </h3>

        <p className="text-xs text-[#485c36]/75 line-clamp-2 leading-relaxed">
          {productSubtitle}
        </p>
      </div>

      {/* Price & Thin Outlined Add Button */}
      <div className="mt-6 pt-4 border-t border-[#485c36]/10 flex items-center justify-between gap-2">
        <span className="font-mono text-lg font-bold text-[#610b0d]">
          {product.price} {currency}
        </span>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            added
              ? "bg-[#610b0d] text-[#f3a5a1]"
              : "bg-transparent hover:bg-[#485c36] text-[#485c36] hover:text-[#f6f9e6] border border-[#485c36]"
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

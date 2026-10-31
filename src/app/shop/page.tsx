"use client";

import React, { useState, useMemo } from "react";
import { ProductData } from "@/lib/data/mock-data";
import { useProducts } from "@/lib/products/product-store";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickViewModal } from "@/components/shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import { Search, RotateCcw } from "lucide-react";

export default function ShopPage() {
  const { isArabic } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState<ProductData | null>(null);
  const allProducts = useProducts();

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;

    const q = searchQuery.toLowerCase();
    return allProducts.filter((prod) => {
      return (
        (prod.nameAr || "").toLowerCase().includes(q) ||
        (prod.nameEn || "").toLowerCase().includes(q) ||
        (prod.descriptionAr || "").toLowerCase().includes(q) ||
        (prod.descriptionEn || "").toLowerCase().includes(q) ||
        (prod.subtitleAr || "").toLowerCase().includes(q) ||
        (prod.subtitleEn || "").toLowerCase().includes(q)
      );
    });
  }, [allProducts, searchQuery]);

  return (
    <div className="py-16 sm:py-20 bg-[#f4f1e6] text-[#22301e] min-h-screen font-cairo">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Editorial Header matching the reference layout */}
        <div className="pb-10 border-b border-[#485c36]/15 flex flex-col md:flex-row md:items-end justify-between gap-6 text-start">
          <div className="space-y-2 max-w-xl">
            <h1
              className={`${
                isArabic ? "font-gulzar text-3xl sm:text-5xl" : "font-cinzel text-3xl sm:text-4xl"
              } font-normal text-[#1e2b18]`}
            >
              {isArabic
                ? "تركيبات علاجية مركزة. نتائج ملموسة."
                : "Targeted Formulas. Visible Results."}
            </h1>
          </div>

          <div className="w-full md:w-64 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic ? "ابحثي باسم المستحضر..." : "Search formulas..."
              }
              className="w-full py-2.5 px-8 rounded-full bg-[#f9fbf0] border border-[#485c36]/25 text-xs text-[#22301e] placeholder:text-[#485c36]/55 focus:outline-none focus:border-[#610b0d]"
            />
            <Search
              className={`w-3.5 h-3.5 absolute ${
                isArabic ? "right-3" : "left-3"
              } top-1/2 -translate-y-1/2 text-[#485c36]/70`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute ${
                  isArabic ? "left-3" : "right-3"
                } top-1/2 -translate-y-1/2 text-[#610b0d] cursor-pointer`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4-Column Numbered Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>

      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

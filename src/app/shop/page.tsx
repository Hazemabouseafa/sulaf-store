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
        prod.nameAr.toLowerCase().includes(q) ||
        prod.nameEn.toLowerCase().includes(q) ||
        prod.descriptionAr.toLowerCase().includes(q) ||
        prod.descriptionEn.toLowerCase().includes(q) ||
        prod.subtitleAr.toLowerCase().includes(q) ||
        prod.subtitleEn.toLowerCase().includes(q)
      );
    });
  }, [allProducts, searchQuery]);

  // IDEA #1: Quiet Apothecary Formulary Index
  return (
    <div className="py-16 sm:py-24 bg-[#f6f9e6] text-[#485c36] min-h-screen font-cairo">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-14">
        
        {/* Minimalist Manuscript Header */}
        <div className="pb-10 border-b border-[#485c36]/20 flex flex-col md:flex-row md:items-end justify-between gap-6 text-start">
          <div className="space-y-2 max-w-xl">
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#610b0d] block">
              {isArabic ? "فهرس المستحضرات السريرية" : "APOTHECARY INDEX"}
            </span>
            <h1 className="font-amiri text-3xl sm:text-5xl font-normal text-[#485c36]">
              {isArabic
                ? "مخطوطة سُـلاف للتركيبات العلاجية"
                : "Sulaf Clinical Formulary"}
            </h1>
          </div>

          {/* Minimalist Underline Search */}
          <div className="w-full md:w-64 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic ? "ابحثي باسم المستحضر..." : "Search formulary..."
              }
              className="w-full py-2 px-7 bg-transparent border-b border-[#485c36]/35 text-xs text-[#485c36] placeholder:text-[#485c36]/55 focus:outline-none focus:border-[#485c36]"
            />
            <Search
              className={`w-3.5 h-3.5 absolute ${
                isArabic ? "right-0" : "left-0"
              } top-1/2 -translate-y-1/2 text-[#485c36]/70`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute ${
                  isArabic ? "left-0" : "right-0"
                } top-1/2 -translate-y-1/2 text-[#610b0d] cursor-pointer`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quiet 2-Column Specimen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
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

"use client";

import React, { useState, useMemo } from "react";
import { ProductData } from "@/lib/data/mock-data";
import { useProducts } from "@/lib/products/product-store";
import { ProductCard } from "@/components/shop/ProductCard";
import { QuickViewModal } from "@/components/shop/QuickViewModal";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  Search,
  FlaskConical,
  RotateCcw,
} from "lucide-react";

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

  return (
    <div className="py-14 bg-[#f6f9e6] min-h-screen font-cairo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* SERENE CENTERED HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold border border-[#485c36]/20">
            <FlaskConical className="w-3.5 h-3.5 text-[#ca384a]" />
            <span>
              {isArabic
                ? "معرض مستحضرات سُـلاف السريرية"
                : "Sulaf Clinical Cosmeceuticals"}
            </span>
          </div>

          <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
            {isArabic
              ? "صيدلية سُـلاف للترميم والجمال الأندلسي"
              : "Sulaf Apothecary for Barrier Repair"}
          </h1>

          <p className="text-xs sm:text-sm text-[#485c36]/80 leading-relaxed">
            {isArabic
              ? "استكشفي تركيباتنا الصيدلانية المصممة لعلاج مشاكل البشرة المستعصية برفق وفعالية."
              : "Discover clinical-grade formulas engineered to treat stubborn skin concerns gently."}
          </p>

          {/* Simple Search Pill */}
          <div className="pt-3 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? "ابحثي باسم المستحضر أو التركيبة..."
                  : "Search formulations by name..."
              }
              className={`w-full py-3 px-5 ${
                isArabic ? "pr-11 pl-10" : "pl-11 pr-10"
              } text-xs rounded-full bg-white text-[#485c36] border border-[#485c36]/25 shadow-xs focus:outline-none focus:border-[#485c36]`}
            />
            <Search
              className={`w-4 h-4 absolute ${
                isArabic ? "right-4" : "left-4"
              } top-1/2 -translate-y-1/2 mt-1.5 text-[#485c36]`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute ${
                  isArabic ? "left-4" : "right-4"
                } top-1/2 -translate-y-1/2 mt-1.5 p-1 text-[#610b0d] cursor-pointer`}
                title={isArabic ? "مسح البحث" : "Clear search"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ARCHED PRODUCT CARDS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="max-w-md mx-auto rounded-t-[9rem] rounded-b-3xl bg-white border border-[#485c36]/20 pt-12 pb-8 px-6 text-center space-y-3">
            <FlaskConical className="w-10 h-10 text-[#485c36]/50 mx-auto" />
            <h3 className="font-amiri text-2xl font-bold text-[#610b0d]">
              {isArabic ? "لم نعثر على مستحضرات تطابق بحثك" : "No formulations found"}
            </h3>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 rounded-full bg-[#485c36] text-[#f6f9e6] text-xs font-bold hover:bg-[#610b0d] cursor-pointer"
            >
              {isArabic ? "عرض كافة المستحضرات" : "View All Formulations"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                displayMode="podium"
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

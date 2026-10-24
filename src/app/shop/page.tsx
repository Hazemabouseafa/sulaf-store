"use client";

import React, { useState, useMemo } from "react";
import { ProductData } from "@/lib/data/mock-data";
import { getStoredProducts } from "@/lib/products/product-store";
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

  const filteredProducts = useMemo(() => {
    const allProducts = getStoredProducts();
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
  }, [searchQuery]);

  return (
    <div className="py-12 bg-[#f6f9e6] min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold mb-3">
            <FlaskConical className="w-3.5 h-3.5 text-[#485c36]" />
            <span>
              {isArabic
                ? "معرض مستحضرات سلاف السريرية"
                : "Sulaf Clinical Cosmeceuticals Collection"}
            </span>
          </div>
          <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#485c36]">
            {isArabic
              ? "صيدلية سلاف للترميم والجمال الأندلسي"
              : "Sulaf Apothecary for Barrier Repair & Andalusian Elegance"}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-700 font-cairo leading-relaxed">
            {isArabic
              ? "استكشفي تركيباتنا الطبية المصممة خصيصاً لعلاج مشاكل البشرة المستعصية مع إمكانية الدفع بالعربون (100 ج.م فقط) أو الدفع بالكامل عبر Paymob ومحفظتك المفضلة."
              : "Discover prescription-grade formulas engineered to treat stubborn skin concerns, with flexible 100 EGP deposit reservation or direct payment via Paymob."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? "ابحثي باسم المستحضر أو التركيبة..."
                  : "Search formulations by name..."
              }
              className={`w-full py-3 px-4 ${
                isArabic ? "pr-11 pl-10" : "pl-11 pr-10"
              } text-xs font-cairo rounded-2xl bg-white border border-[#e2e8c0] shadow-sm focus:outline-none focus:ring-1 focus:ring-[#485c36]`}
            />
            <Search
              className={`w-4 h-4 absolute ${
                isArabic ? "right-4" : "left-4"
              } top-1/2 -translate-y-1/2 text-[#485c36]`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={`absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer`}
                title={isArabic ? "مسح البحث" : "Clear search"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid with Marble Podiums */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-[#e2e8c0] p-8">
            <FlaskConical className="w-12 h-12 text-[#485c36]/40 mx-auto mb-3" />
            <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
              {isArabic ? "لم نعثر على مستحضرات تطابق بحثك" : "No formulations found"}
            </h3>
            <p className="text-xs text-gray-600 font-cairo mt-1">
              {isArabic
                ? "جربي البحث باسم مستحضر آخر أو مسح كلمة البحث."
                : "Try searching with different terms or clearing your search."}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#485c36] text-white text-xs font-cairo font-semibold hover:bg-[#3a4a2b] cursor-pointer"
            >
              {isArabic ? "عرض كافة المستحضرات" : "View All Formulations"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

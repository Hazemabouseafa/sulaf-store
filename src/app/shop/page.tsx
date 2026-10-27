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
  ShieldCheck,
  PackageCheck,
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

  function getBentoSpan(index: number, total: number): string {
    if (total === 1) return "lg:col-span-12";
    if (total === 2) return index === 0 ? "lg:col-span-7" : "lg:col-span-5";
    const mod = index % 4;
    if (mod === 0) return "lg:col-span-7";
    if (mod === 1) return "lg:col-span-5";
    if (mod === 2) return "lg:col-span-5";
    return "lg:col-span-7";
  }

  return (
    <div className="py-10 sm:py-14 bg-[#f6f9e6] min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* BENTO SHOP HEADER MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Title Bento Cell (8 Cols) */}
          <div className="lg:col-span-8 rounded-[2rem] bg-[#485c36] text-[#f6f9e6] p-7 sm:p-10 flex flex-col justify-between text-start shadow-md">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#610b0d] text-[#f3a5a1] text-xs font-bold border border-[#f3a5a1]/30">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>
                  {isArabic
                    ? "معرض مستحضرات سُـلاف السريرية"
                    : "Sulaf Clinical Cosmeceuticals"}
                </span>
              </div>

              <h1 className="font-amiri text-3xl sm:text-5xl font-bold text-[#f6f9e6] leading-tight">
                {isArabic
                  ? "صيدلية سُـلاف للترميم الهيكلي والجمال الأندلسي"
                  : "Sulaf Apothecary for Structural Barrier Repair"}
              </h1>

              <p className="text-xs sm:text-sm text-[#f6f9e6]/85 max-w-2xl leading-relaxed">
                {isArabic
                  ? "تركيبات صيدلانية مركزة لعلاج جلد الوزة والخشونة المستعصية وترميم الحاجز الدهني، مع ضمان معاينة العبوة قبل الدفع."
                  : "Prescription-inspired formulas engineered for keratosis pilaris, rough texture, and lipid barrier repair."}
              </p>
            </div>

            {/* Search Input Inside Header Bento */}
            <div className="mt-6 max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isArabic
                    ? "ابحثي باسم المستحضر أو المادة الفعالة..."
                    : "Search formulations or actives..."
                }
                className={`w-full py-3 px-4 ${
                  isArabic ? "pr-11 pl-10" : "pl-11 pr-10"
                } text-xs rounded-2xl bg-[#f6f9e6] text-[#485c36] placeholder:text-[#485c36]/60 border border-[#f3a5a1]/40 focus:outline-none focus:ring-2 focus:ring-[#f3a5a1]`}
              />
              <Search
                className={`w-4 h-4 absolute ${
                  isArabic ? "right-4" : "left-4"
                } top-1/2 -translate-y-1/2 text-[#485c36]`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`absolute ${
                    isArabic ? "left-3" : "right-3"
                  } top-1/2 -translate-y-1/2 p-1 text-[#610b0d] cursor-pointer`}
                  title={isArabic ? "مسح البحث" : "Clear search"}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Side Assurance Bento Cell (4 Cols) */}
          <div className="lg:col-span-4 rounded-[2rem] bg-[#610b0d] text-[#f6f9e6] p-7 sm:p-8 flex flex-col justify-between text-start border border-[#f3a5a1]/30 shadow-md">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ca384a] text-[#f6f9e6] text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isArabic ? "ميثاق الثقة السريرية" : "Clinical Charter"}</span>
              </span>
              <h2 className="font-amiri text-2xl font-bold text-[#f3a5a1]">
                {isArabic
                  ? "دفع مرن ومعاينة مضمونة عند الاستلام"
                  : "Flexible Deposit & Doorstep Inspection"}
              </h2>
              <p className="text-xs text-[#f6f9e6]/85 leading-relaxed">
                {isArabic
                  ? "احجزي طلبكِ بعربون 100 ج.م فقط أو ادفعي بالكامل عبر InstaPay وPaymob، مع حق فتح الطرد ومعاينة العبوة قبل السداد."
                  : "Reserve with a 100 EGP deposit or pay in full via InstaPay or Paymob, with full package inspection upon delivery."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#f6f9e6]/15 flex items-center justify-between text-xs font-bold text-[#f3a5a1]">
              <span>{isArabic ? "شحن مؤمن عبر Stox" : "Insured Stox Delivery"}</span>
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ASYMMETRIC BENTO PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-[2rem] border-2 border-[#485c36]/15 p-8">
            <FlaskConical className="w-12 h-12 text-[#485c36]/40 mx-auto mb-3" />
            <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
              {isArabic ? "لم نعثر على مستحضرات تطابق بحثك" : "No formulations found"}
            </h3>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#485c36] text-[#f6f9e6] text-xs font-bold hover:bg-[#610b0d] cursor-pointer"
            >
              {isArabic ? "عرض كافة المستحضرات" : "View All Formulations"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {filteredProducts.map((product, idx) => {
              const span = getBentoSpan(idx, filteredProducts.length);
              const isFeatured = idx === 0;
              return (
                <div key={product.id} className={span}>
                  <ProductCard
                    product={product}
                    displayMode="podium"
                    featuredBento={isFeatured}
                    onQuickView={setQuickViewProduct}
                  />
                </div>
              );
            })}
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

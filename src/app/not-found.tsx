"use client";
import React from "react";
import Link from "next/link";
import { SulafFlowerIcon } from "@/components/brand/SulafLogo";

export default function NotFound() {
  return (
    <div className="py-24 bg-[#f4f1e6] min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <SulafFlowerIcon size={72} animated />
      <div>
        <h1 className="font-amiri text-6xl font-bold text-[#485c36]">404</h1>
        <h2 className="font-amiri text-2xl font-bold text-[#610b0d] mt-2">
          الصفحة المطلوبة غير موجودة في ديوان سلاف
        </h2>
        <p className="text-xs text-gray-600 font-cairo mt-2">
          ربما تم نقل الصفحة أو تغيير الرابط. تفضلي بالعودة إلى متجرنا لاستكشاف تركيباتنا الطبية.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-[#485c36] text-white font-cairo font-bold text-xs hover:bg-[#3a4a2b] transition-colors shadow-md"
      >
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
}
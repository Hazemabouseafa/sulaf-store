"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MOCK_BLOG_POSTS } from "@/lib/data/mock-data";
import { BookOpen, Clock, ArrowLeft } from "lucide-react";

export default function BlogListPage() {
  return (
    <div className="py-16 bg-[#f4f1e6] min-h-screen text-[#222b1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-cairo font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>مجلة سلاف للجلدية والـ Cosmeceuticals</span>
          </div>
          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#485c36]">
            أبحاث ومقالات العناية الطبية الفاخرة
          </h1>
          <p className="font-cairo text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            مقالات علمية مبسطة بأقلام نخبة من أطباء الجلدية والباحثين في مختبرات سلاف.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-cairo text-gray-500">
                  <span>{post.publishedAt}</span>
                  <span className="flex items-center gap-1 text-[#485c36] font-semibold">
                    <Clock className="w-3 h-3" />
                    {post.readTimeAr}
                  </span>
                </div>

                <h3 className="font-amiri text-2xl font-bold text-[#222b1a] hover:text-[#485c36] transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.titleAr}</Link>
                </h3>

                <p className="font-cairo text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {post.excerptAr}
                </p>
              </div>

              <div className="pt-3 border-t border-[#e2e8c0] flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-cairo">{post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-cairo font-bold text-[#485c36] hover:underline"
                >
                  <span>قراءة المقال</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

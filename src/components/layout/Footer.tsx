"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SulafLogo } from "../brand/SulafLogo";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  MessageCircle,
  Mail,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

export function Footer() {
  const { settings } = useStoreSettings();
  const { isArabic, t, dir } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer
      className="relative bg-[#18271b] text-[#f6f9e6] pt-16 pb-10 overflow-hidden select-none font-cairo"
      dir={dir}
    >
      {/* Subtle Botanical Line-Art in Bottom Right Corner matching Reference Image */}
      <svg
        viewBox="0 0 240 200"
        fill="none"
        className="absolute bottom-0 right-0 w-60 h-48 text-[#c5b37a]/20 pointer-events-none"
      >
        <path
          d="M220 200 C180 150, 140 110, 110 50"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M175 145 C140 140, 125 120, 155 110 C175 118, 178 135, 175 145 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M195 115 C215 95, 228 80, 205 70 C190 80, 190 100, 195 115 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M145 95 C115 88, 105 70, 130 62 C145 70, 148 85, 145 95 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#f6f9e6]/15">
          
          {/* Col 1: Brand Logo & Tagline (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 text-start">
            <SulafLogo size="md" color="cream" />
            <p
              className={`${
                isArabic ? "font-amiri text-lg" : "font-cormorant italic text-base"
              } text-[#f6f9e6]/85 tracking-wide`}
            >
              {custom.footerTagline ||
                (isArabic
                  ? "دقة صيدلانية.. وروح أندلسية."
                  : "Clinical Precision. Andalusian Soul.")}
            </p>

            <div className="pt-2 flex items-center gap-2.5">
              <a
                href={`https://wa.me/${
                  settings.contacts?.whatsapp
                    ? settings.contacts.whatsapp.replace(/[^0-9]/g, "")
                    : SULAF_SETTINGS.whatsappNumber
                }`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg border border-[#f6f9e6]/25 hover:border-[#f3a5a1] flex items-center justify-center text-[#f6f9e6]/80 hover:text-[#f3a5a1] transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.contacts?.email || "care@sulaf.com"}`}
                className="w-8 h-8 rounded-lg border border-[#f6f9e6]/25 hover:border-[#f3a5a1] flex items-center justify-center text-[#f6f9e6]/80 hover:text-[#f3a5a1] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                className="w-8 h-8 rounded-lg border border-[#f6f9e6]/25 hover:border-[#f3a5a1] flex items-center justify-center text-[#f6f9e6]/80 hover:text-[#f3a5a1] transition-colors"
                aria-label="Location"
              >
                <MapPin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Shop (2 Cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs text-start">
            <h4 className="font-cormorant text-base font-bold text-[#f6f9e6]">
              {isArabic ? "المتجر" : "Shop"}
            </h4>
            <ul className="space-y-2 text-[#f6f9e6]/70">
              <li>
                <Link href="/shop" className="hover:text-[#f6f9e6] transition-colors">
                  {isArabic ? "جميع المستحضرات" : "All Products"}
                </Link>
              </li>
              <li>
                <Link
                  href="/product/absolutes-smoothing-body-cream"
                  className="hover:text-[#f6f9e6] transition-colors"
                >
                  {isArabic ? "كريم أبسوليوتس 30% يوريا" : "Body Care"}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#f6f9e6] transition-colors">
                  {isArabic ? "ترميم الحاجز" : "Skincare"}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-[#f6f9e6] transition-colors">
                  {isArabic ? "دليل الروتين" : "Our Ritual"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: About (2 Cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs text-start">
            <h4 className="font-cormorant text-base font-bold text-[#f6f9e6]">
              {isArabic ? "عن سُـلاف" : "About"}
            </h4>
            <ul className="space-y-2 text-[#f6f9e6]/70">
              <li>
                <Link href="/story" className="hover:text-[#f6f9e6] transition-colors">
                  {t.nav.story}
                </Link>
              </li>
              <li>
                <Link href="/philosophy" className="hover:text-[#f6f9e6] transition-colors">
                  {t.nav.philosophy}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#f6f9e6] transition-colors">
                  {t.nav.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Help (2 Cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs text-start">
            <h4 className="font-cormorant text-base font-bold text-[#f6f9e6]">
              {isArabic ? "المساعدة" : "Help"}
            </h4>
            <ul className="space-y-2 text-[#f6f9e6]/70">
              <li>
                <Link href="/track" className="hover:text-[#f6f9e6] transition-colors text-[#f3a5a1]">
                  {isArabic ? "تتبع شحنتك" : "Shipping & Track"}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#f6f9e6] transition-colors">
                  {isArabic ? "حسابي" : "My Account"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f6f9e6] transition-colors">
                  {isArabic ? "تواصلي معنا" : "Contact Us"}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-[#f6f9e6] transition-colors">
                  {isArabic ? "سياسة الاسترجاع" : "Returns"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Join Our Newsletter (2 Cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs text-start">
            <h4 className="font-cormorant text-base font-bold text-[#f6f9e6]">
              {custom.footerNewsletterTitle || (isArabic ? "النشرة السريرية" : "Join Our Newsletter")}
            </h4>
            <p className="text-[11px] text-[#f6f9e6]/70 leading-relaxed">
              {custom.footerNewsletterDesc ||
                (isArabic
                  ? "كوني أول من يعلم بالإصدارات الجديدة ونصائح العناية السريرية."
                  : "Be the first to know about new launches, exclusive offers and skincare tips.")}
            </p>
            <form onSubmit={handleSubscribe} className="relative pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isArabic ? "بريدكِ الإلكتروني" : "Your email address"}
                className="w-full py-2.5 ps-3.5 pe-10 rounded-full bg-transparent border border-[#f6f9e6]/25 text-[11px] text-[#f6f9e6] placeholder:text-[#f6f9e6]/45 focus:outline-none focus:border-[#f3a5a1]"
              />
              <button
                type="submit"
                className="absolute top-1/2 -translate-y-1/2 end-1.5 mt-0.5 w-7 h-7 rounded-full bg-[#f6f9e6] text-[#22301e] flex items-center justify-center hover:bg-[#f3a5a1] transition-colors cursor-pointer"
                aria-label="Subscribe"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowIcon className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#f6f9e6]/55">
          <span>{t.footer.rights}</span>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#f6f9e6] transition-colors">
              {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>
            <Link href="/privacy" className="hover:text-[#f6f9e6] transition-colors">
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

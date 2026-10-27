"use client";

import React from "react";
import Link from "next/link";
import { SulafLogo } from "../brand/SulafLogo";
import { AndalusianPattern } from "../brand/AndalusianPattern";
import { SULAF_SETTINGS } from "@/lib/data/mock-data";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  ShieldCheck,
  Truck,
  MessageCircle,
  Mail,
  MapPin,
  Heart,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export function Footer() {
  const { settings } = useStoreSettings();
  const { isArabic, t, dir } = useLanguage();

  return (
    <footer className="relative bg-[#485c36] text-[#f6f9e6] pt-16 pb-8 overflow-hidden select-none" dir={dir}>
      {/* Background Islamic Geometric Engraving */}
      <AndalusianPattern opacity={0.06} color="#f6f9e6" scale={1.2} />

      {/* Hero Quote Ribbon */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mb-16 pb-12 border-b border-[#f6f9e6]/15">
        <p className={`${isArabic ? "font-amiri text-2xl md:text-3xl" : "font-cormorant italic text-2xl md:text-3xl"} text-[#f3a5a1] italic leading-relaxed`}>
          {isArabic
            ? `«${settings.hero.poemLine1} ${settings.hero.poemLine2}»`
            : t.footer.quote}
        </p>
        <span className="mt-3 block text-xs text-[#f6f9e6]/70 uppercase tracking-widest">
          {t.footer.quoteSource}
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#f6f9e6]/15">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <SulafLogo size="md" color="cream" className="sm:hidden" />
            <SulafLogo size="lg" color="cream" className="hidden sm:inline-flex" />
            <p className={`${isArabic ? "font-amiri text-base" : "font-cormorant italic text-sm"} text-[#f3a5a1] font-bold tracking-wide`}>
              {isArabic ? "حيث يلتقي العلم الصيدلاني بالجمال." : "Where Pharmaceutical Science Meets Beauty."}
            </p>
            <p className="text-xs text-[#f6f9e6]/80 leading-relaxed max-w-sm">
              {t.footer.aboutDesc}
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-[#f6f9e6]/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f3a5a1]" />
                <span>{t.footer.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f3a5a1]" />
                <span>care@sulaf.com</span>
              </div>
              <a
                href={`https://wa.me/${settings.contacts?.whatsapp ? settings.contacts.whatsapp.replace('+', '') : SULAF_SETTINGS.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-green-300 hover:text-green-200 transition-colors font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t.footer.whatsappBtn}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-amiri text-lg font-bold text-[#f3a5a1]">
              {t.footer.linksTitle}
            </h4>
            <ul className="space-y-2 text-[#f6f9e6]/80">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link href="/product/absolutes-smoothing-body-cream" className="hover:text-white transition-colors">
                  Absolutes Smoothing Body Cream
                </Link>
              </li>
              <li>
                <Link href="/philosophy" className="hover:text-white transition-colors">
                  {t.nav.philosophy}
                </Link>
              </li>
              <li>
                <Link href="/story" className="hover:text-white transition-colors">
                  {t.nav.story}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="hover:text-white transition-colors">
                  {t.nav.guide}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {t.nav.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Tracking */}
          <div className="space-y-3 text-xs">
            <h4 className="font-amiri text-lg font-bold text-[#f3a5a1]">
              {isArabic ? "خدمة العملاء والشحن" : "Care & Delivery"}
            </h4>
            <ul className="space-y-2 text-[#f6f9e6]/80">
              <li>
                <Link href="/account" className="hover:text-white transition-colors font-semibold text-[#f3a5a1]">
                  {isArabic ? "حسابي وتسجيل الدخول" : "My Account & Login"}
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors font-semibold text-[#f3a5a1]">
                  {isArabic ? "تتبع مسار شحنتك المباشر" : "Track Your Order"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {isArabic ? "الدعم الفني والاستشارات" : "Consultation & Support"}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  {isArabic ? "سياسة الاسترجاع والضمان السريري" : "Refund & Return Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {isArabic ? "سياسة الخصوصية وأمان البيانات" : "Privacy Policy"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Logistics */}
          <div className="space-y-3 text-xs">
            <h4 className="font-amiri text-lg font-bold text-[#f3a5a1]">
              {t.footer.shippingTitle}
            </h4>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-[#f6f9e6]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#f3a5a1] font-bold">
                <Truck className="w-4 h-4 text-[#f3a5a1]" />
                <span>{t.footer.stoxPartner}</span>
              </div>
              <p className="text-[11px] text-[#f6f9e6]/80 leading-relaxed">
                {t.footer.stoxDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#f6f9e6]/70">
          <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 flex-wrap">
            <span className="font-semibold text-white">{isArabic ? "طرق الدفع:" : "Payment:"}</span>
            <span className="bg-white/15 px-2.5 py-1 rounded-md text-[11px]">Paymob Accept</span>
            <span className="bg-white/15 px-2.5 py-1 rounded-md text-[11px]">Visa / Mastercard</span>
            <span className="bg-white/15 px-2.5 py-1 rounded-md text-[11px]">Meeza</span>
            <span className="bg-white/15 px-2.5 py-1 rounded-md text-[11px]">InstaPay</span>
            <span className="bg-white/15 px-2.5 py-1 rounded-md text-[11px]">Vodafone Cash</span>
            <span className="bg-white/15 px-2.5 py-1 rounded-md text-[11px]">{isArabic ? "الدفع عند الاستلام" : "Cash on Delivery"}</span>
          </div>

          <div className="text-center md:text-left">
            <span>{t.footer.rights}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

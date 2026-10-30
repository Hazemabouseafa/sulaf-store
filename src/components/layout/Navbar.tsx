"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { useCustomerAuth } from "@/lib/auth/customer-auth";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import { useProducts } from "@/lib/products/product-store";
import {
  User,
  ShoppingBag,
  Truck,
  Sparkles,
  Globe,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { settings } = useStoreSettings();
  const { toggleLanguage, isArabic, t } = useLanguage();
  const { user, isLoggedIn } = useCustomerAuth();
  const products = useProducts();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(90);

  useEffect(() => {
    function updateHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [settings.sectionsVisibility?.announcementBar, settings.announcement.enabled]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll on mobile when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full select-none font-cairo">
      {/* 1. Top Luxury Announcement Ribbon (Clean, no Stox / Paymob / Deposit) */}
      {(settings.sectionsVisibility?.announcementBar !== false && settings.announcement.enabled !== false) && (
        <div data-live-section="announcementBar" data-section-name="شريط الإعلانات العلوي" className="bg-gradient-to-r from-[#3e0708] via-[#610b0d] to-[#3e0708] text-[#f6f9e6] px-4 py-2 text-xs font-semibold shadow-inner border-b border-[#f3a5a1]/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center gap-2.5 overflow-hidden text-center">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f3a5a1] animate-pulse shrink-0" />
                <span className="tracking-wide">
                  {settings.elementsVisibility?.announcementText !== false ? (custom.announcementText || (isArabic ? settings.announcement.text : t.announcement.defaultText)) : ""}
                </span>
              </span>

              {(settings.announcement.badge && settings.elementsVisibility?.announcementBadge !== false) && (
                <span className="hidden sm:inline bg-[#ca384a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#f3a5a1]/40 shrink-0 shadow-xs">
                  {custom.announcementBadge || (isArabic ? settings.announcement.badge : t.announcement.badge)}
                </span>
              )}
            </div>

            {/* Quick Switch in ribbon */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[#f6f9e6] text-[11px] font-bold border border-white/20 transition-all cursor-pointer"
                title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
              >
                <Globe className="w-3 h-3 text-[#f3a5a1]" />
                <span>{isArabic ? "English" : "العربية"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main High-Clarity Navbar with Dropdowns */}
      <nav
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#fbfdf7]/98 backdrop-blur-xl shadow-md border-b border-[#ebdcd5] py-2.5"
            : "bg-[#f6f9e6] border-b border-[#ebdcd5] py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo (Guaranteed Single Direct Responsive Element) */}
          <Link
            href="/"
            className="relative inline-flex items-center justify-center shrink-0 focus:outline-none group select-none py-0.5"
            aria-label="سُـلاف | Sulaf"
          >
            <Image
              src="/brand/sulaf-brand-logo.png"
              alt="سُلاف | Sulaf"
              width={200}
              height={56}
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* 1. Home */}
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                pathname === "/"
                  ? "bg-[#610b0d] text-[#f6f9e6] font-bold shadow-xs"
                  : "text-[#220809] hover:text-[#610b0d] hover:bg-[#610b0d]/10"
              }`}
            >
              {t.nav.home}
            </Link>

            {/* 2. Direct Shop Link (No Dropdown) */}
            <Link
              href="/shop"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                pathname === "/shop" || pathname.startsWith("/product")
                  ? "bg-[#610b0d] text-[#f6f9e6] font-bold shadow-xs"
                  : "text-[#220809] hover:text-[#610b0d] hover:bg-[#610b0d]/10"
              }`}
            >
              {t.nav.shop}
            </Link>

            {/* 3. About Sulaf (Single direct page, no dropdown) */}
            <Link
              href="/story"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                pathname === "/story"
                  ? "bg-[#610b0d] text-[#f6f9e6] font-bold shadow-xs"
                  : "text-[#220809] hover:text-[#610b0d] hover:bg-[#610b0d]/10"
              }`}
            >
              <span>{isArabic ? "عن سُـلاف" : "About Sulaf"}</span>
            </Link>

            {/* 4. Track Order */}
            <Link
              href="/track"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                pathname === "/track"
                  ? "bg-[#610b0d] text-[#f6f9e6] font-bold shadow-xs"
                  : "text-[#220809] hover:text-[#610b0d] hover:bg-[#610b0d]/10"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t.nav.track}</span>
            </Link>
          </div>

          {/* Action Utilities Area */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* 1. Language Toggle Pill (Visible on tablet/desktop, mobile drawer has dedicated switcher) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#610b0d]/30 hover:border-[#610b0d] bg-white text-[#220809] text-xs font-bold transition-all hover:shadow-xs active:scale-95 cursor-pointer"
              title={isArabic ? "Switch website to English" : "تغيير واجهة المتجر إلى العربية"}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#610b0d]" />
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className={isArabic ? "text-[#610b0d] font-black" : "text-gray-400 font-normal"}>
                  عربي
                </span>
                <span className="text-gray-300">/</span>
                <span className={!isArabic ? "text-[#610b0d] font-black" : "text-gray-400 font-normal"}>
                  EN
                </span>
              </div>
            </button>

            {/* Customer Account Portal Shortcut (Visible on tablet/desktop, inside mobile drawer on small screens) */}
            <Link
              href="/account"
              className={`hidden sm:inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                pathname === "/account"
                  ? "bg-[#610b0d] text-white border-[#610b0d]"
                  : "bg-white border-[#ebdcd5] hover:border-[#610b0d] text-[#220809]"
              }`}
              title={isLoggedIn ? (isArabic ? `حسابي (${user?.name})` : `My Account (${user?.name})`) : (isArabic ? "تسجيل الدخول / حسابي" : "Sign In / Account")}
            >
              <User className="w-4 h-4 text-[#610b0d]" />
              <span className="hidden sm:inline">
                {isLoggedIn ? (user?.name?.split(" ")[0] || t.nav.account) : t.nav.account}
              </span>
              {isLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
              )}
            </Link>


            {/* 3. Shopping Bag */}
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#610b0d] hover:bg-[#470708] text-[#f6f9e6] font-bold text-xs shadow-md border border-[#610b0d]/40 transition-all active:scale-95 cursor-pointer"
              aria-label={t.nav.cart}
            >
              <ShoppingBag className="w-4 h-4 text-[#f6f9e6]" />
              <span className="hidden sm:inline font-bold">{t.nav.cart}</span>

              {totalItems > 0 ? (
                <span className="bg-[#ca384a] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white min-w-[18px] text-center animate-pulse">
                  {totalItems}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#f3a5a1]/80" />
              )}
            </button>

            {/* 4. Chic Bespoke Luxury Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden relative w-11 h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer border ${
                mobileMenuOpen
                  ? "bg-[#610b0d] border-[#610b0d] text-[#f6f9e6] shadow-md shadow-[#610b0d]/20"
                  : "bg-white/95 hover:bg-white border-[#ebdcd5] hover:border-[#610b0d]/40 text-[#220809] shadow-xs active:scale-95"
              }`}
              aria-label={mobileMenuOpen ? (isArabic ? "إغلاق القائمة" : "Close menu") : (isArabic ? "القائمة الرئيسية" : "Open menu")}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                <span
                  className={`h-[2px] w-5 rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen
                      ? "translate-y-[7px] rotate-45 bg-[#f6f9e6]"
                      : "bg-[#220809]"
                  }`}
                />
                <span
                  className={`h-[2px] rounded-full transition-all duration-200 ease-out ${
                    mobileMenuOpen
                      ? "w-0 opacity-0 bg-[#f6f9e6]"
                      : "w-3.5 bg-[#ca384a] self-start"
                  }`}
                />
                <span
                  className={`h-[2px] w-5 rounded-full transition-all duration-300 ease-out origin-center ${
                    mobileMenuOpen
                      ? "-translate-y-[7px] -rotate-45 bg-[#f6f9e6]"
                      : "bg-[#220809]"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* 2.5 Subtle Luxury Reading Progress Hairline Indicator */}
      <div className="h-[2px] w-full bg-transparent overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#610b0d] via-[#ca384a] to-[#f3a5a1] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 3. Mobile Navigation Drawer (Editorial Luxury, Strictly 4 Core Links, Bilingual) */}
      {mobileMenuOpen && (
        <div
          style={{ top: `${headerHeight}px` }}
          className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-[#fbfdf7]/98 backdrop-blur-2xl border-t border-[#ebdcd5] p-5 pb-safe overflow-y-auto animate-in slide-in-from-top-4 duration-300 shadow-2xl"
        >
          <div className="flex flex-col space-y-4 max-w-md mx-auto">
            {/* Strictly 4 Direct Navigation Links — Zero Submenus */}
            <div className="space-y-2.5">
              {[
                {
                  num: "01",
                  label: isArabic ? "الرئيسية" : "Home",
                  href: "/",
                  active: pathname === "/",
                },
                {
                  num: "02",
                  label: isArabic ? "المتجر" : "Shop",
                  href: "/shop",
                  active: pathname === "/shop" || pathname.startsWith("/product"),
                },
                {
                  num: "03",
                  label: isArabic ? "عن سُـلاف" : "About Sulaf",
                  href: "/story",
                  active: pathname === "/story",
                },
                {
                  num: "04",
                  label: isArabic ? "تتبع شحنتك" : "Track Order",
                  href: "/track",
                  active: pathname === "/track",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
                    link.active
                      ? "bg-[#610b0d] text-[#f6f9e6] border-[#610b0d] shadow-md shadow-[#610b0d]/20"
                      : "bg-white/90 hover:bg-white border-[#ebdcd5] text-[#220809] hover:border-[#610b0d]/40 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`font-mono text-xs tracking-widest font-bold ${
                        link.active ? "text-[#f3a5a1]" : "text-[#610b0d]/60 group-hover:text-[#610b0d]"
                      }`}
                    >
                      {link.num}
                    </span>
                    <span
                      className={`text-base font-bold tracking-wide ${
                        isArabic ? "font-cairo" : "font-cinzel text-[15px]"
                      }`}
                    >
                      {link.label}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                      link.active
                        ? "bg-white/15 text-[#f3a5a1]"
                        : "bg-[#f6f9e6] text-[#610b0d] group-hover:bg-[#610b0d]/10"
                    }`}
                  >
                    <ArrowIcon className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Bilingual Quick Toggle Pill at Bottom */}
            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-white border border-[#ebdcd5] shadow-xs flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#610b0d]" />
                  <span>{isArabic ? "اللغة:" : "Language:"}</span>
                </span>
                <div className="flex items-center gap-1.5 bg-[#f6f9e6] p-1 rounded-xl border border-[#ebdcd5]">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isArabic) toggleLanguage();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isArabic ? "bg-[#610b0d] text-white shadow-xs" : "text-gray-600 hover:text-black"
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (isArabic) toggleLanguage();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isArabic ? "bg-[#610b0d] text-white shadow-xs" : "text-gray-600 hover:text-black"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

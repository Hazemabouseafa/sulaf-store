"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SulafLogo } from "../brand/SulafLogo";
import { useCart } from "@/lib/cart/cart-context";
import { useCustomerAuth } from "@/lib/auth/customer-auth";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  User,
  ShoppingBag,
  Menu,
  X,
  Truck,
  Sparkles,
  Globe,
  ChevronDown,
  FlaskConical,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Flame,
  CheckCircle2,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { settings } = useStoreSettings();
  const { toggleLanguage, isArabic, t } = useLanguage();
  const { user, isLoggedIn } = useCustomerAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dropdown States
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [heritageDropdownOpen, setHeritageDropdownOpen] = useState(false);

  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const heritageDropdownRef = useRef<HTMLDivElement>(null);
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
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on path change
  useEffect(() => {
    setShopDropdownOpen(false);
    setHeritageDropdownOpen(false);
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

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
      if (heritageDropdownRef.current && !heritageDropdownRef.current.contains(e.target as Node)) {
        setHeritageDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;
  const custom = isArabic ? (settings.customContent || {}) : (settings.customContentEn || {});

  return (
    <header ref={headerRef} className="sticky top-0 z-50 w-full select-none font-cairo">
      {/* 1. Top Luxury Announcement Ribbon (Clean, no Stox / Paymob / Deposit) */}
      {(settings.sectionsVisibility?.announcementBar !== false && settings.announcement.enabled) && (
        <div className="bg-gradient-to-r from-[#2c3821] via-[#485c36] to-[#2c3821] text-[#f6f9e6] px-4 py-2 text-xs font-semibold shadow-inner border-b border-[#d4af37]/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center gap-2.5 overflow-hidden text-center">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse shrink-0" />
                <span className="tracking-wide">
                  {settings.elementsVisibility?.announcementText !== false ? (custom.announcementText || (isArabic ? settings.announcement.text : t.announcement.defaultText)) : ""}
                </span>
              </span>

              {(settings.announcement.badge && settings.elementsVisibility?.announcementBadge !== false) && (
                <span className="hidden sm:inline bg-[#610b0d] text-[#f3e5ab] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#d4af37]/40 shrink-0">
                  {custom.announcementBadge || (isArabic ? settings.announcement.badge : t.announcement.badge)}
                </span>
              )}
            </div>

            {/* Quick Switch in ribbon */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleLanguage}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[#f3e5ab] text-[11px] font-bold border border-white/20 transition-all cursor-pointer"
                title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
              >
                <Globe className="w-3 h-3 text-[#d4af37]" />
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
            ? "bg-[#fafcf3]/98 backdrop-blur-xl shadow-md border-b border-[#d8dfbe] py-2.5"
            : "bg-[#f8faf0] border-b border-[#e2e8c0] py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 shrink-0 group focus:outline-none"
            aria-label="سُـلاف | Sulaf"
          >
            <SulafLogo size="sm" color="green" className="sm:hidden" />
            <SulafLogo size="md" color="green" className="hidden sm:inline-flex" />
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* 1. Home */}
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                pathname === "/"
                  ? "bg-[#485c36] text-[#f6f9e6] font-bold shadow-xs"
                  : "text-[#24301a] hover:text-[#485c36] hover:bg-[#485c36]/10"
              }`}
            >
              {t.nav.home}
            </Link>

            {/* 2. Shop & Formulations Dropdown */}
            <div
              ref={shopDropdownRef}
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  pathname.startsWith("/shop") || pathname.startsWith("/product")
                    ? "bg-[#485c36] text-[#f6f9e6] font-bold shadow-xs"
                    : "text-[#24301a] hover:text-[#485c36] hover:bg-[#485c36]/10"
                }`}
              >
                <span>{t.nav.shopMenu}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    shopDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Shop Dropdown Menu */}
              {shopDropdownOpen && (
                <div className="absolute top-full start-0 mt-1 w-80 rounded-2xl bg-white border border-[#e2e8c0] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    {/* Absolutes Smoothing Body Cream Highlight */}
                    <Link
                      href="/product/absolutes-smoothing-body-cream"
                      className="p-2.5 rounded-xl hover:bg-[#f6f9e6] transition-colors block border border-[#485c36]/20 bg-[#485c36]/5"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-[#485c36] flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-[#ca384a]" />
                          <span>Absolutes Smoothing Body Cream</span>
                        </span>
                        <span className="text-[10px] bg-[#ca384a] text-white px-2 py-0.5 rounded-full font-bold">
                          {isArabic ? "الأكثر طلباً" : "Best Seller"}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-600 block line-clamp-1">
                        {isArabic ? "30% Urea • 10% Ammonium Lactate • 2% Salicylic Acid" : "30% Urea • 10% Ammonium Lactate • 2% Salicylic Acid"}
                      </span>
                    </Link>

                    {/* Velvet Cleanser */}
                    <Link
                      href="/product/sulaf-velvet-barrier-cleanser"
                      className="p-2.5 rounded-xl hover:bg-[#f6f9e6] transition-colors block"
                    >
                      <span className="font-semibold text-xs text-gray-800 block">
                        {t.nav.cleanser}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {isArabic ? "غسول زيتي-كريمي لطيف ومرمم للحاجز" : "Gentle barrier repairing cleanser"}
                      </span>
                    </Link>

                    {/* Gold Nectar */}
                    <Link
                      href="/product/sulaf-gold-radiance-nectar"
                      className="p-2.5 rounded-xl hover:bg-[#f6f9e6] transition-colors block"
                    >
                      <span className="font-semibold text-xs text-gray-800 block">
                        {t.nav.goldNectar}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {isArabic ? "أوراق الذهب والأزيليك 10% لتوحيد اللون" : "24K Gold flakes & Azelaic 10%"}
                      </span>
                    </Link>

                    <div className="pt-2 border-t border-[#e2e8c0] mt-2">
                      <Link
                        href="/shop"
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#485c36] hover:bg-[#485c36]/10 transition-colors flex items-center justify-between"
                      >
                        <span>{t.nav.allProducts}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Heritage & Science Dropdown */}
            <div
              ref={heritageDropdownRef}
              className="relative"
              onMouseEnter={() => setHeritageDropdownOpen(true)}
              onMouseLeave={() => setHeritageDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setHeritageDropdownOpen(!heritageDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  pathname === "/philosophy" || pathname === "/story" || pathname === "/guide" || pathname === "/blog"
                    ? "bg-[#485c36] text-[#f6f9e6] font-bold shadow-xs"
                    : "text-[#24301a] hover:text-[#485c36] hover:bg-[#485c36]/10"
                }`}
              >
                <span>{t.nav.heritageMenu}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    heritageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Heritage Dropdown Menu */}
              {heritageDropdownOpen && (
                <div className="absolute top-full start-0 mt-1 w-72 rounded-2xl bg-white border border-[#e2e8c0] shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <Link
                      href="/philosophy"
                      className="p-2.5 rounded-xl hover:bg-[#f6f9e6] transition-colors block"
                    >
                      <span className="font-semibold text-xs text-gray-800 block">
                        {t.nav.philosophy}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {isArabic ? "علم الـ Cosmeceuticals وترميم حاجز البشرة" : "Science of barrier reconstruction"}
                      </span>
                    </Link>

                    <Link
                      href="/story"
                      className="p-2.5 rounded-xl hover:bg-[#f6f9e6] transition-colors block"
                    >
                      <span className="font-semibold text-xs text-gray-800 block">
                        {t.nav.story}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {isArabic ? "رحلة سلاف من قصر الحمراء إلى المختبر" : "From Alhambra palace to clinical lab"}
                      </span>
                    </Link>

                    <Link
                      href="/guide"
                      className="p-2.5 rounded-xl hover:bg-[#f6f9e6] transition-colors block"
                    >
                      <span className="font-semibold text-xs text-gray-800 block">
                        {t.nav.guide}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {isArabic ? "بروتوكول وطقوس الاستخدام للحصول على نتائج الحرير" : "Rituals for silk-like skin results"}
                      </span>
                    </Link>

                    <Link
                      href="/blog"
                      className="p-2.5 rounded-xl hover:bg-[#f6f9e6] transition-colors block"
                    >
                      <span className="font-semibold text-xs text-gray-800 block">
                        {t.nav.blog}
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        {isArabic ? "مقالات واستشارات جلدية صيدلانية" : "Dermatology insights & clinical advice"}
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Track Order */}
            <Link
              href="/track"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                pathname === "/track"
                  ? "bg-[#485c36] text-[#f6f9e6] font-bold shadow-xs"
                  : "text-[#24301a] hover:text-[#485c36] hover:bg-[#485c36]/10"
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#485c36]/30 hover:border-[#485c36] bg-white text-[#2c3821] text-xs font-bold transition-all hover:shadow-xs active:scale-95 cursor-pointer"
              title={isArabic ? "Switch website to English" : "تغيير واجهة المتجر إلى العربية"}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#485c36]" />
              <div className="flex items-center gap-1 font-mono text-[11px]">
                <span className={isArabic ? "text-[#485c36] font-black" : "text-gray-400 font-normal"}>
                  عربي
                </span>
                <span className="text-gray-300">/</span>
                <span className={!isArabic ? "text-[#485c36] font-black" : "text-gray-400 font-normal"}>
                  EN
                </span>
              </div>
            </button>

            {/* Customer Account Portal Shortcut (Visible on tablet/desktop, inside mobile drawer on small screens) */}
            <Link
              href="/account"
              className={`hidden sm:inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                pathname === "/account"
                  ? "bg-[#485c36] text-white border-[#485c36]"
                  : "bg-white border-[#e2e8c0] hover:border-[#485c36] text-[#2c3821]"
              }`}
              title={isLoggedIn ? (isArabic ? `حسابي (${user?.name})` : `My Account (${user?.name})`) : (isArabic ? "تسجيل الدخول / حسابي" : "Sign In / Account")}
            >
              <User className="w-4 h-4 text-[#485c36]" />
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
              className="relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#485c36] hover:bg-[#38482a] text-[#f6f9e6] font-bold text-xs shadow-md border border-[#d4af37]/40 transition-all active:scale-95 cursor-pointer"
              aria-label={t.nav.cart}
            >
              <ShoppingBag className="w-4 h-4 text-[#f3e5ab]" />
              <span className="hidden sm:inline font-bold">{t.nav.cart}</span>

              {totalItems > 0 ? (
                <span className="bg-[#ca384a] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white min-w-[18px] text-center animate-pulse">
                  {totalItems}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#d4af37]/80" />
              )}
            </button>

            {/* 4. Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#2c3821] bg-white border border-[#e2e8c0] hover:bg-[#f6f9e6] transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? t.nav.close : t.nav.menu}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Mobile Navigation Drawer (Clean, Grouped, High-Contrast) */}
      {mobileMenuOpen && (
        <div
          style={{ top: `${headerHeight}px` }}
          className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-[#fafcf3]/98 backdrop-blur-2xl border-t border-[#d8dfbe] p-5 pb-safe overflow-y-auto animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col space-y-4 max-w-md mx-auto">
            {/* Language Switcher Bar in Mobile Drawer */}
            <div className="p-3 rounded-2xl bg-white border border-[#e2e8c0] shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#485c36]" />
                <span>{t.nav.language}:</span>
              </span>
              <div className="flex items-center gap-1.5 bg-[#f6f9e6] p-1 rounded-xl border border-[#e2e8c0]">
                <button
                  type="button"
                  onClick={() => toggleLanguage()}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isArabic ? "bg-[#485c36] text-white shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => toggleLanguage()}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    !isArabic ? "bg-[#485c36] text-white shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Customer Account Button in Mobile Drawer */}
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3.5 rounded-2xl bg-white border border-[#e2e8c0] shadow-sm flex items-center justify-between font-bold text-xs text-[#2c3821] hover:border-[#485c36] transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#485c36]/10 text-[#485c36] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-sm font-amiri font-bold text-[#485c36]">
                    {isLoggedIn ? (isArabic ? `مرحباً، ${user?.name}` : `Welcome, ${user?.name}`) : (isArabic ? "لوحة تحكم ودخول العميل" : "Customer Portal & Login")}
                  </span>
                  <span className="text-[11px] text-gray-500 font-normal">
                    {isLoggedIn ? (isArabic ? "إدارة طلباتك، شحناتك، وعناوينك" : "Manage orders, shipments & addresses") : (isArabic ? "تسجيل الدخول أو إنشاء حساب جديد" : "Sign in or create account")}
                  </span>
                </div>
              </div>
              <ArrowIcon className="w-4 h-4 text-gray-400" />
            </Link>

            {/* Mobile Nav Links */}
            <div className="space-y-2">
              <Link
                href="/"
                className="block p-3 rounded-xl bg-white border border-[#e2e8c0] text-sm font-bold text-[#24301a]"
              >
                {t.nav.home}
              </Link>

              {/* Group 1: Shop */}
              <div className="p-3 rounded-xl bg-white border border-[#e2e8c0] space-y-2">
                <span className="block text-xs font-bold text-[#485c36]">{t.nav.shopMenu}</span>
                <div className="space-y-1.5 ps-2 border-s-2 border-[#485c36]/20">
                  <Link href="/shop" className="block text-xs font-semibold text-gray-800">
                    {t.nav.allProducts}
                  </Link>
                  <Link href="/product/absolutes-smoothing-body-cream" className="block text-xs font-bold text-[#ca384a]">
                    Absolutes Smoothing Body Cream ★
                  </Link>
                  <Link href="/product/sulaf-velvet-barrier-cleanser" className="block text-xs text-gray-700">
                    {t.nav.cleanser}
                  </Link>
                  <Link href="/product/sulaf-gold-radiance-nectar" className="block text-xs text-gray-700">
                    {t.nav.goldNectar}
                  </Link>
                </div>
              </div>

              {/* Group 2: Heritage & Science */}
              <div className="p-3 rounded-xl bg-white border border-[#e2e8c0] space-y-2">
                <span className="block text-xs font-bold text-[#485c36]">{t.nav.heritageMenu}</span>
                <div className="space-y-1.5 ps-2 border-s-2 border-[#485c36]/20">
                  <Link href="/philosophy" className="block text-xs text-gray-700">
                    {t.nav.philosophy}
                  </Link>
                  <Link href="/story" className="block text-xs text-gray-700">
                    {t.nav.story}
                  </Link>
                  <Link href="/guide" className="block text-xs text-gray-700">
                    {t.nav.guide}
                  </Link>
                  <Link href="/blog" className="block text-xs text-gray-700">
                    {t.nav.blog}
                  </Link>
                </div>
              </div>

              <Link
                href="/track"
                className="block p-3 rounded-xl bg-white border border-[#e2e8c0] text-sm font-semibold text-gray-800"
              >
                {t.nav.track}
              </Link>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}

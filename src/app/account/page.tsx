"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCustomerAuth, CustomerAddress } from "@/lib/auth/customer-auth";
import { getAllOrders, OrderRecord } from "@/lib/orders/order-store";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  User,
  ShoppingBag,
  Truck,
  Tag,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Package,
  MessageCircle,
  AlertCircle,
  FileText,
  Bell,
  X,
} from "lucide-react";

export default function CustomerAccountPage() {
  const { isArabic, dir } = useLanguage();
  const {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    quickDemoLogin,
    googleLogin,
    updateProfile,
    addAddress,
    removeAddress,
    setDefaultAddress,
    changePassword,
    dismissNotification,
    refreshUserData,
  } = useCustomerAuth();

  // Navigation tab in portal
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "offers" | "security">("orders");

  // Auth form state (when logged out)
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regGov, setRegGov] = useState("القاهرة");
  const [regCity, setRegCity] = useState("");
  const [regAddress, setRegAddress] = useState("");

  // New Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState("المنزل");
  const [newAddrName, setNewAddrName] = useState("");
  const [newAddrPhone, setNewAddrPhone] = useState("");
  const [newAddrGov, setNewAddrGov] = useState("القاهرة");
  const [newAddrCity, setNewAddrCity] = useState("");
  const [newAddrDetails, setNewAddrDetails] = useState("");

  // Change Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Profile Edit state
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Coupon copy feedback
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Orders
  const [allOrders, setAllOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAllOrders(getAllOrders());
      refreshUserData();
    }
  }, [refreshUserData]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfilePhone(user.phone);
      setProfileCity(user.city || "");
    }
  }, [user]);

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // Filter orders related to this customer or show recent
  const customerOrders = user
    ? allOrders.filter(
        (o) =>
          o.customerEmail?.toLowerCase() === user.email.toLowerCase() ||
          o.customerPhone.replace(/\s+/g, "") === user.phone.replace(/\s+/g, "")
      )
    : [];

  const displayOrders = customerOrders.length > 0 ? customerOrders : allOrders.slice(0, 3);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const res = await login(loginIdentifier, loginPassword);
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || "خطأ في تسجيل الدخول");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      governorate: regGov,
      city: regCity,
      address: regAddress,
    });
    setAuthLoading(false);
    if (!res.success) {
      setAuthError(res.error || "خطأ في إنشاء الحساب");
    }
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName || !newAddrPhone || !newAddrDetails) return;
    addAddress({
      label: newAddrLabel,
      recipientName: newAddrName,
      phone: newAddrPhone,
      governorate: newAddrGov,
      city: newAddrCity || newAddrGov,
      address: newAddrDetails,
      isDefault: false,
    });
    setShowAddressModal(false);
    setNewAddrName("");
    setNewAddrPhone("");
    setNewAddrCity("");
    setNewAddrDetails("");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    const res = changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ type: "success", text: isArabic ? "تم تحديث كلمة المرور بنجاح!" : "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
    } else {
      setPasswordMsg({ type: "error", text: res.error || (isArabic ? "تعذر تحديث كلمة المرور" : "Failed to update password") });
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      phone: profilePhone,
      city: profileCity,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const copyCode = (code: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(code);
      setCopiedCoupon(code);
      setTimeout(() => setCopiedCoupon(null), 2500);
    }
  };

  // ==========================================
  // VIEW 1: GUEST AUTH VIEW (LOGIN / REGISTER)
  // ==========================================
  if (!isLoggedIn || !user) {
    return (
      <div className="py-16 md:py-24 bg-[#f6f9e6] min-h-[85vh] flex items-center justify-center px-4 font-cairo" dir={dir}>
        <div className="max-w-lg w-full bg-white rounded-3xl border border-[#dbe2bd] shadow-xl p-6 sm:p-10 space-y-7">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#485c36]/10 border border-[#485c36]/20 flex items-center justify-center mx-auto p-3 shadow-xs">
              <Image
                src="/brand/sulaf-flower-symbol.png"
                alt="سُلاف | Sulaf"
                width={44}
                height={44}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1c2616]">
                {isArabic ? "بوابة عملاء سُـلاف" : "Sulaf Customer Portal"}
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                {isArabic
                  ? "تسجيل دخول آمن لإدارة وتتبع شحناتك، عروضك الحصرية، وعناوين التوصيل."
                  : "Secure customer login to manage shipments, exclusive VIP rewards, and addresses."}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-[#f6f9e6] p-1 border border-[#e2e8c0]">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                authMode === "login"
                  ? "bg-[#485c36] text-white shadow-xs"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {isArabic ? "تسجيل الدخول" : "Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError("");
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                authMode === "register"
                  ? "bg-[#485c36] text-white shadow-xs"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {isArabic ? "إنشاء حساب جديد" : "Create Account"}
            </button>
          </div>

          {/* Error Alert */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          {/* MODE A: LOGIN FORM */}
          {authMode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {isArabic ? "البريد الإلكتروني أو رقم الهاتف" : "Email or Phone Number"}
                </label>
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={isArabic ? "مثال: 01012345678 أو email@example.com" : "e.g. 01012345678 or email@example.com"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:ring-1 focus:ring-[#485c36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  {isArabic ? "كلمة المرور" : "Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:ring-1 focus:ring-[#485c36] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#485c36] hover:bg-[#394a2a] text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authLoading ? (isArabic ? "جاري التحقق..." : "Signing in...") : (isArabic ? "تسجيل الدخول" : "Sign In")}
              </button>
            </form>
          ) : (
            /* MODE B: REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isArabic ? "الاسم بالكامل" : "Full Name"} *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder={isArabic ? "مثال: سارة الأندلسي" : "e.g. Sarah Andalusi"}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "البريد الإلكتروني" : "Email Address"} *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "رقم الهاتف (واتساب)" : "Phone Number"} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "المحافظة" : "Governorate"}
                  </label>
                  <select
                    value={regGov}
                    onChange={(e) => setRegGov(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:border-[#485c36] focus:outline-none"
                  >
                    <option value="القاهرة">القاهرة (Cairo)</option>
                    <option value="الجيزة">الجيزة (Giza)</option>
                    <option value="الإسكندرية">الإسكندرية (Alexandria)</option>
                    <option value="الدقهلية">الدقهلية (Dakahlia)</option>
                    <option value="البحيرة">البحيرة (Beheira)</option>
                    <option value="الشرقية">الشرقية (Sharqia)</option>
                    <option value="أخرى">محافظة أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "المدينة / الحي" : "City / District"}
                  </label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder={isArabic ? "مثال: التجمع الخامس" : "e.g. New Cairo"}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isArabic ? "عنوان التوصيل المفضل" : "Default Shipping Address"}
                </label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder={isArabic ? "اسم الشارع، رقم العمارة، رقم الشقة" : "Street name, building, apartment"}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isArabic ? "كلمة المرور" : "Password"} *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder={isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#485c36] hover:bg-[#394a2a] text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {authLoading ? (isArabic ? "جاري الإنشاء..." : "Creating account...") : (isArabic ? "إنشاء الحساب والتفعيل فورياً" : "Create Account & Activate")}
              </button>
            </form>
          )}

          {/* Quick Demo & Google Alternatives */}
          <div className="pt-2 border-t border-gray-100 space-y-2.5 text-center">
            <span className="text-[11px] text-gray-500 font-semibold block">
              {isArabic ? "أو تجربة سريعة بدون إدخال بيانات:" : "Or quick instant access:"}
            </span>

            <button
              type="button"
              onClick={quickDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-[#d4af37]/60 bg-[#fbf9f0] hover:bg-[#f6f2dd] text-[#2c3821] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isArabic ? "دخول سريع بحساب تجريبي (سارة الأندلسي)" : "One-Click Demo Account Login"}</span>
            </button>

            <button
              type="button"
              onClick={googleLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{isArabic ? "متابعة التسجيل بحساب Google" : "Continue with Google"}</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LOGGED-IN CUSTOMER DASHBOARD
  // ==========================================
  return (
    <div className="py-10 sm:py-16 bg-[#f6f9e6] min-h-screen text-[#222b1a] font-cairo" dir={dir}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* VIP Personalized Notifications */}
        {user.customNotifications && user.customNotifications.filter((n) => !n.isRead).length > 0 && (
          <div className="space-y-3">
            {user.customNotifications.filter((n) => !n.isRead).map((notif) => (
              <div
                key={notif.id}
                className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#2a381f] via-[#3a4d2c] to-[#1c2616] text-white border-2 border-[#d4af37]/70 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center shrink-0 text-[#f3e5ab] mt-0.5">
                      <Sparkles className="w-5 h-5 animate-pulse text-[#d4af37]" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#d4af37] text-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {isArabic ? "إشعار VIP مخصص لكِ" : "Exclusive VIP Notice"}
                        </span>
                        <h3 className="font-amiri text-lg sm:text-xl font-bold text-[#fbf9f0]">
                          {isArabic ? notif.titleAr : (notif.titleEn || notif.titleAr)}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#f6f9e6]/90 leading-relaxed max-w-2xl">
                        {isArabic ? notif.messageAr : (notif.messageEn || notif.messageAr)}
                      </p>
                      {notif.couponCode && (
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <span className="text-xs text-[#f3e5ab] font-bold">
                            {isArabic ? "كود الخصم الممنوح لكِ:" : "Your Special Code:"}
                          </span>
                          <span className="font-mono font-black text-sm bg-black/40 border border-[#d4af37]/50 px-3 py-1 rounded-xl text-[#f3e5ab]">
                            {notif.couponCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCode(notif.couponCode!)}
                            className="px-3 py-1 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          >
                            {copiedCoupon === notif.couponCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedCoupon === notif.couponCode ? (isArabic ? "تم النسخ ✓" : "Copied ✓") : (isArabic ? "نسخ الكود وتطبيقه" : "Copy Code")}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => dismissNotification(notif.id)}
                    className="shrink-0 self-end sm:self-center p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                    title={isArabic ? "إغلاق الإشعار" : "Dismiss notice"}
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">{isArabic ? "إغلاق" : "Dismiss"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 1. Header Profile Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#485c36] to-[#2c3821] text-white flex items-center justify-center font-amiri text-2xl sm:text-3xl font-bold shadow-md border-2 border-[#d4af37]/40 shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1c2616]">
                  {isArabic ? `مرحباً بكِ، ${user.name}` : `Welcome, ${user.name}`}
                </h1>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>{isArabic ? "عميلة سلاف المميزة" : "Sulaf VIP Member"}</span>
                </span>
              </div>
              <p className="text-xs text-gray-600">
                <span>{user.email}</span> • <span>{user.phone}</span>
                {user.city && <span> • {user.city}</span>}
              </p>
              <span className="text-[11px] text-gray-600 block">
                {isArabic ? `عضوة في سُـلاف منذ: ${user.registeredAt}` : `Member since: ${user.registeredAt}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>{isArabic ? "تعديل البيانات" : "Edit Profile"}</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isArabic ? "تسجيل الخروج" : "Sign Out"}</span>
            </button>
          </div>
        </div>

        {/* 2. Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#e2e8c0] shadow-xs">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
              <ShoppingBag className="w-4 h-4 text-[#485c36]" />
              <span>{isArabic ? "إجمالي الطلبات" : "Total Orders"}</span>
            </div>
            <span className="text-2xl font-bold text-[#1c2616] font-mono">{displayOrders.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e8c0] shadow-xs">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span>{isArabic ? "الشحنات النشطة" : "Active Delivery"}</span>
            </div>
            <span className="text-sm font-bold text-emerald-800">
              {displayOrders.some((o) => o.orderStatus === "SHIPPED")
                ? (isArabic ? "في الطريق مع Stox" : "In Transit")
                : (isArabic ? "لا توجد شحنات معلقة" : "None pending")}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e8c0] shadow-xs">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
              <MapPin className="w-4 h-4 text-[#ca384a]" />
              <span>{isArabic ? "العناوين المسجلة" : "Saved Addresses"}</span>
            </div>
            <span className="text-2xl font-bold text-[#1c2616] font-mono">{user.savedAddresses.length}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#e2e8c0] shadow-xs">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold mb-1">
              <Tag className="w-4 h-4 text-amber-700" />
              <span>{isArabic ? "كوبونات VIP" : "VIP Coupons"}</span>
            </div>
            <span className="text-sm font-bold text-amber-800">
              {(user.customCoupons?.length || 0) + 3} {isArabic ? "كوبونات نشطة" : "Active Codes"}
            </span>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#e2e8c0] pb-3">
          {[
            { id: "orders", label: isArabic ? "طلباتي والشحنات" : "My Orders", icon: ShoppingBag, count: displayOrders.length },
            { id: "addresses", label: isArabic ? "عناويني المسجلة" : "Saved Addresses", icon: MapPin, count: user.savedAddresses.length },
            { id: "offers", label: isArabic ? "عروضي الخاصة وكوبونات الخصم" : "VIP Offers & Coupons", icon: Tag, count: (user.customCoupons?.length || 0) + 3 },
            { id: "security", label: isArabic ? "الملف الشخصي والأمان" : "Profile & Security", icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? "bg-[#485c36] text-white shadow-sm"
                    : "bg-white text-gray-700 border border-[#e2e8c0] hover:bg-[#e2e8c0]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    active ? "bg-white/20 text-white" : "bg-black/10 text-gray-800"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-5">
            {displayOrders.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#e2e8c0] space-y-4">
                <Package className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="font-amiri text-xl font-bold text-gray-800">
                  {isArabic ? "لم تقومي بطلب أي مستحضر حتى الآن" : "You have not placed any orders yet"}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {isArabic
                    ? "استكشفي تركيبات سُـلاف السريرية وابدئي رحلة تحول ملمس بشرتكِ الآن."
                    : "Explore Sulaf clinical cosmeceuticals and begin your skin transformation today."}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#485c36] text-white font-bold text-xs shadow-md"
                >
                  <span>{isArabic ? "استكشاف المستحضرات" : "Explore Formulations"}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              displayOrders.map((o) => (
                <div
                  key={o.id}
                  className="p-6 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-5"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{isArabic ? "رقم الطلب:" : "Order #:"}</span>
                        <strong className="text-sm font-bold text-[#610b0d] font-mono">{o.orderNumber}</strong>
                      </div>
                      <span className="text-[11px] text-gray-600 block">
                        {isArabic ? "تاريخ الطلب:" : "Date:"} {new Date(o.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        o.orderStatus === "DELIVERED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : o.orderStatus === "SHIPPED"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {o.orderStatus === "DELIVERED"
                          ? (isArabic ? "تم التوصيل بنجاح ✓" : "Delivered ✓")
                          : o.orderStatus === "SHIPPED"
                          ? (isArabic ? "الشحنة في الطريق مع Stox" : "In Transit with Stox")
                          : (isArabic ? "جاري تحضير المستحضر" : "Processing")}
                      </span>

                      <span className="text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                        {o.paymentStatus === "FULLY_PAID"
                          ? (isArabic ? "مدفوع بالكامل" : "Fully Paid")
                          : o.paymentStatus === "DEPOSIT_PAID"
                          ? (isArabic ? `عربون مسدد (${o.depositAmount} ج)` : `Deposit Paid (${o.depositAmount})`)
                          : (isArabic ? "الدفع عند الاستلام" : "Cash on Delivery")}
                      </span>
                    </div>
                  </div>

                  {/* Shipment Tracking Timeline */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs font-bold">
                      <div className="text-emerald-700 flex flex-col items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isArabic ? "تأكيد الطلب" : "Confirmed"}</span>
                      </div>
                      <div className={`flex flex-col items-center gap-1 ${
                        o.orderStatus !== "PENDING_CONFIRMATION" ? "text-emerald-700" : "text-gray-400"
                      }`}>
                        <Clock className="w-4 h-4" />
                        <span>{isArabic ? "تجهيز المستحضر" : "Preparing"}</span>
                      </div>
                      <div className={`flex flex-col items-center gap-1 ${
                        o.orderStatus === "SHIPPED" || o.orderStatus === "DELIVERED" ? "text-emerald-700" : "text-gray-400"
                      }`}>
                        <Truck className="w-4 h-4" />
                        <span>{isArabic ? "مع مندوب Stox" : "Shipped"}</span>
                      </div>
                      <div className={`flex flex-col items-center gap-1 ${
                        o.orderStatus === "DELIVERED" ? "text-emerald-700" : "text-gray-400"
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isArabic ? "تم التسليم" : "Delivered"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 bg-[#fbfdf6] p-4 rounded-2xl border border-[#e2e8c0]/80">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-[#485c36]" />
                          <strong className="text-gray-900">{it.productName}</strong>
                          <span className="text-gray-500 font-mono">× {it.quantity}</span>
                        </div>
                        <span className="font-bold text-[#485c36] font-mono">{it.total} {isArabic ? "ج.م" : "EGP"}</span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs font-bold text-gray-900">
                      <span>{isArabic ? "إجمالي الفاتورة:" : "Total Amount:"}</span>
                      <span className="text-sm text-[#1c2616] font-mono">{o.total} {isArabic ? "ج.م" : "EGP"}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Link
                      href={`/track?id=${o.orderNumber}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#485c36] hover:bg-[#38482a] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isArabic ? "تتبع مباشر لموقع الشحنة" : "Track Live Shipment"}</span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href="https://wa.me/201099887766"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-green-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                      <span>{isArabic ? "استفسار أو مساعدة عبر واتساب" : "Support on WhatsApp"}</span>
                    </a>
                  </div>

                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-amiri text-xl font-bold text-[#1c2616]">
                  {isArabic ? "دفتر العناوين المسجلة" : "Saved Delivery Addresses"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isArabic ? "عناوين التوصيل المستخدمة لملء تفاصيل الطلب تلقائياً." : "Addresses used for quick checkout."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 rounded-2xl bg-[#485c36] hover:bg-[#394a2a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isArabic ? "إضافة عنوان جديد" : "Add Address"}</span>
              </button>
            </div>

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-3xl bg-white border transition-all ${
                    addr.isDefault
                      ? "border-[#485c36] shadow-sm ring-1 ring-[#485c36]/20"
                      : "border-[#e2e8c0] shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#485c36]" />
                      <strong className="text-sm font-bold text-gray-900">{addr.label}</strong>
                    </div>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {isArabic ? "العنوان الافتراضي ✓" : "Default Address ✓"}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed mb-4">
                    <strong className="block text-gray-900">{addr.recipientName} ({addr.phone})</strong>
                    <span>{addr.governorate} — {addr.city}</span><br />
                    <span>{addr.address}</span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    {!addr.isDefault ? (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[#485c36] hover:underline font-bold"
                      >
                        {isArabic ? "تعيين كافتراضي" : "Set as Default"}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-[11px]">{isArabic ? "العنوان النشط حالياً" : "Active Delivery Target"}</span>
                    )}

                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      className="text-red-600 hover:text-red-800 p-1 transition-colors"
                      title={isArabic ? "حذف العنوان" : "Delete Address"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#dbe2bd] space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h4 className="font-amiri text-lg font-bold text-[#1c2616]">
                      {isArabic ? "إضافة عنوان توصيل جديد" : "Add New Delivery Address"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="text-gray-400 hover:text-black text-sm"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddAddressSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        {isArabic ? "تسمية العنوان (المنزل / العمل)" : "Address Label"}
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddrLabel}
                        onChange={(e) => setNewAddrLabel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          {isArabic ? "اسم المستلم" : "Recipient Name"}
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrName}
                          onChange={(e) => setNewAddrName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          {isArabic ? "رقم الهاتف" : "Phone"}
                        </label>
                        <input
                          type="tel"
                          required
                          value={newAddrPhone}
                          onChange={(e) => setNewAddrPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          {isArabic ? "المحافظة" : "Governorate"}
                        </label>
                        <select
                          value={newAddrGov}
                          onChange={(e) => setNewAddrGov(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs bg-white focus:border-[#485c36] focus:outline-none"
                        >
                          <option value="القاهرة">القاهرة</option>
                          <option value="الجيزة">الجيزة</option>
                          <option value="الإسكندرية">الإسكندرية</option>
                          <option value="الدقهلية">الدقهلية</option>
                          <option value="الشرقية">الشرقية</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          {isArabic ? "المدينة / الحي" : "City"}
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddrCity}
                          onChange={(e) => setNewAddrCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        {isArabic ? "تفاصيل العنوان (الشارع والعمارة)" : "Detailed Address"}
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={newAddrDetails}
                        onChange={(e) => setNewAddrDetails(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:border-[#485c36] focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700"
                      >
                        {isArabic ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#485c36] text-white text-xs font-bold shadow-sm"
                      >
                        {isArabic ? "حفظ العنوان" : "Save Address"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VIP OFFERS & REWARDS */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-amiri text-xl font-bold text-[#1c2616]">
                {isArabic ? "عروض ومكافآت عميلات سلاف VIP" : "Exclusive VIP Offers & Coupons"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isArabic ? "كوبونات حصرية مخصصة لحسابكِ للاستفادة منها عند تأكيد الطلب." : "Personalized promo codes ready to use at checkout."}
              </p>
            </div>

            {/* Custom Assigned VIP Coupons */}
            {user?.customCoupons && user.customCoupons.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold text-[#485c36]">
                    {isArabic ? "كوبونات وخصومات استثنائية مخصصة لحسابكِ VIP:" : "Personalized VIP Coupons Assigned to You:"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.customCoupons.map((cp) => (
                    <div
                      key={cp.id}
                      className="p-6 rounded-3xl bg-gradient-to-br from-[#2c3821] via-[#3a4d2c] to-[#1c2616] text-[#f6f9e6] space-y-4 shadow-lg border-2 border-[#d4af37]/60 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-black bg-[#d4af37] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {isArabic ? "كوبون VIP خاص" : "VIP Exclusive"}
                        </span>
                        <span className="text-[10px] text-[#f3e5ab] font-mono">
                          {isArabic ? "صالح حتى:" : "Expires:"} {cp.expiryDate}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-amiri text-2xl font-bold text-white">
                          {isArabic ? cp.titleAr : (cp.titleEn || cp.titleAr)}
                        </h4>
                        <p className="text-xs text-[#f6f9e6]/80 mt-1 leading-relaxed">
                          {isArabic ? cp.descAr : (cp.descEn || cp.descAr)}
                        </p>
                      </div>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="font-mono font-black text-base bg-black/40 border border-[#d4af37]/40 px-3 py-1 rounded-xl text-[#f3e5ab]">
                          {cp.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCode(cp.code)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c29d2b] text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        >
                          {copiedCoupon === cp.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCoupon === cp.code ? (isArabic ? "تم النسخ ✓" : "Copied ✓") : (isArabic ? "نسخ الكود" : "Copy Code")}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Offer 1 */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#485c36] to-[#24301a] text-[#f6f9e6] space-y-4 shadow-md relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#d4af37] bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  {isArabic ? "خصم عملاء VIP" : "VIP Discount"}
                </span>
                <h4 className="font-amiri text-2xl font-bold text-white">
                  {isArabic ? "خصم 10% فوري" : "10% Instant Off"}
                </h4>
                <p className="text-xs text-[#f6f9e6]/80 leading-relaxed">
                  {isArabic
                    ? "يطبق على كامل سلة المشتريات للتركيبات السريرية بدون حد أقصى."
                    : "Applies to your full basket on all clinical formulations."}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono font-bold text-base bg-white/20 px-3 py-1 rounded-xl text-[#f3e5ab]">
                    SULAF10
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode("SULAF10")}
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCoupon === "SULAF10" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
                    <span>{copiedCoupon === "SULAF10" ? (isArabic ? "تم النسخ" : "Copied") : (isArabic ? "نسخ الكود" : "Copy")}</span>
                  </button>
                </div>
              </div>

              {/* Offer 2 */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#610b0d] to-[#3a0607] text-[#f6f9e6] space-y-4 shadow-md relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#f3a5a1] bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  {isArabic ? "شحن مجاني فوري" : "Free Express Shipping"}
                </span>
                <h4 className="font-amiri text-2xl font-bold text-white">
                  {isArabic ? "شحن مجاني مؤمن" : "Free Delivery"}
                </h4>
                <p className="text-xs text-[#f6f9e6]/80 leading-relaxed">
                  {isArabic
                    ? "توصيل مجاني لكافة محافظات مصر على أي طلب بقيمة 800 ج أو أكثر."
                    : "Free doorstep delivery across Egypt on orders above 800 EGP."}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono font-bold text-base bg-white/20 px-3 py-1 rounded-xl text-[#f3a5a1]">
                    FREESHIP
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode("FREESHIP")}
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCoupon === "FREESHIP" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-[#f3a5a1]" />}
                    <span>{copiedCoupon === "FREESHIP" ? (isArabic ? "تم النسخ" : "Copied") : (isArabic ? "نسخ الكود" : "Copy")}</span>
                  </button>
                </div>
              </div>

              {/* Offer 3 */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#3d502d] to-[#1c2715] text-[#f6f9e6] space-y-4 shadow-md relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#d4af37] bg-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                  {isArabic ? "هدية حصرية" : "Luxury Gift"}
                </span>
                <h4 className="font-amiri text-2xl font-bold text-white">
                  {isArabic ? "حقيبة مخملية + عينة" : "Velvet Pouch + Sample"}
                </h4>
                <p className="text-xs text-[#f6f9e6]/80 leading-relaxed">
                  {isArabic
                    ? "حقيبة مخملية وعينة مجانية من غسول السيراميدات عند طلب عبوتين."
                    : "Free velvet travel pouch and cleanser sample when ordering 2 jars."}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono font-bold text-base bg-white/20 px-3 py-1 rounded-xl text-[#f3e5ab]">
                    VIPGIFT
                  </span>
                  <button
                    type="button"
                    onClick={() => copyCode("VIPGIFT")}
                    className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCoupon === "VIPGIFT" ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
                    <span>{copiedCoupon === "VIPGIFT" ? (isArabic ? "تم النسخ" : "Copied") : (isArabic ? "نسخ الكود" : "Copy")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE & SECURITY */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Edit Personal Info */}
            <div className="p-6 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-4">
              <h4 className="font-amiri text-lg font-bold text-[#1c2616] flex items-center gap-2 border-b pb-3">
                <User className="w-4 h-4 text-[#485c36]" />
                <span>{isArabic ? "البيانات الشخصية" : "Personal Information"}</span>
              </h4>

              {profileSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isArabic ? "تم حفظ البيانات الشخصية بنجاح ✓" : "Profile saved successfully ✓"}</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "الاسم" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "المدينة / الحي" : "City / District"}
                  </label>
                  <input
                    type="text"
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#485c36] hover:bg-[#394a2a] text-white text-xs font-bold shadow-sm transition-all"
                >
                  {isArabic ? "حفظ التعديلات" : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="p-6 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-4">
              <h4 className="font-amiri text-lg font-bold text-[#1c2616] flex items-center gap-2 border-b pb-3">
                <Key className="w-4 h-4 text-[#d4af37]" />
                <span>{isArabic ? "أمان الحساب وكلمة المرور" : "Account Security"}</span>
              </h4>

              {passwordMsg && (
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  passwordMsg.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  {passwordMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "كلمة المرور الحالية" : "Current Password"}
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isArabic ? "كلمة المرور الجديدة" : "New Password"}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isArabic ? "6 أحرف على الأقل" : "Min 6 characters"}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-[#485c36] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
                >
                  {isArabic ? "تحديث كلمة المرور" : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

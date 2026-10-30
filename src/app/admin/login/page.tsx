"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SulafLogo } from "@/components/brand/SulafLogo";
import { adminLogin, isAdminAuthenticated } from "@/lib/auth/admin-auth";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("sulaf_admin_auth", "true");
          const session = {
            username: username.trim(),
            loginTime: new Date().toISOString(),
            token: data.token || ("token_" + Math.random().toString(36).substring(2)),
          };
          localStorage.setItem("sulaf_admin_auth_session", JSON.stringify(session));
          document.cookie = `sulaf_admin_token=${session.token}; path=/; max-age=604800; SameSite=Lax`;
        }
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 500);
        return;
      }

      const localRes = adminLogin(username, password);
      if (localRes.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 500);
        return;
      }

      setError(data.error || "بيانات الدخول غير صحيحة. تحقق من اسم المستخدم وكلمة المرور.");
    } catch {
      const localRes = adminLogin(username, password);
      if (localRes.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 500);
        return;
      }
      setError("حدث خطأ أثناء محاولة تسجيل الدخول.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("admin");
    setPassword("sulaf2026");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#2c3821] text-[#f6f9e6] flex items-center justify-center p-4 relative overflow-hidden font-cairo">
      {/* Background Decorative Andalusian Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#485c36]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#610b0d]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Brand Card Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
            <SulafLogo size="lg" color="cream" />
          </Link>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#485c36]/60 border border-[#d4af37]/40 text-xs text-[#f3e5ab]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>بوابة الإدارة المركزية والتحكم في المتجر</span>
          </div>
          <p className="text-xs text-[#e8ecd0]/70 mt-2">
            تسجيل الدخول محمي بتشفير الجلسات المعتمد لبراند سُـلاف
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#1f2717]/90 backdrop-blur-xl border border-[#485c36] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          <h1 className="text-xl font-bold text-white mb-2 text-center">
            تسجيل دخول المشرف
          </h1>
          <p className="text-xs text-center text-[#e8ecd0]/60 mb-6">
            أدخل بيانات حسابك لإدارة المبيعات، بوابات الدفع، وإعدادات المتجر
          </p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ca384a]/20 border border-[#ca384a]/50 text-[#f3a5a1] text-xs flex items-center gap-2 animate-shake">
              <span className="font-bold">تنبيه:</span> {error}
            </div>
          )}

          {isSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تم التحقق بنجاح! جاري توجيهك إلى لوحة التحكم...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#e8ecd0] mb-1.5 text-right">
                اسم المستخدم
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  dir="ltr"
                  className="w-full bg-[#2c3821]/80 border border-[#485c36] focus:border-[#d4af37] text-white rounded-xl py-3 pr-10 pl-4 text-sm outline-none transition-colors placeholder:text-white/30"
                />
                <User className="w-4 h-4 text-[#d4af37] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#e8ecd0] mb-1.5 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-[#2c3821]/80 border border-[#485c36] focus:border-[#d4af37] text-white rounded-xl py-3 pr-10 pl-11 text-sm outline-none transition-colors placeholder:text-white/30"
                />
                <Lock className="w-4 h-4 text-[#d4af37] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-[#485c36] to-[#5f7a47] hover:from-[#5f7a47] hover:to-[#485c36] text-[#f6f9e6] font-bold rounded-xl border border-[#d4af37]/50 shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>مرحباً بك في سُـلاف</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>دخول لوحة التحكم</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-[#485c36]/60">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-3 rounded-lg bg-[#2c3821]/60 hover:bg-[#485c36]/50 border border-[#d4af37]/30 text-xs text-[#f3e5ab] flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37] group-hover:rotate-12 transition-transform" />
                <span>تعبئة بيانات الأدمن الافتراضية (سريع)</span>
              </div>
              <span className="font-mono text-[11px] bg-black/40 px-2 py-0.5 rounded text-white/80">
                admin / sulaf2026
              </span>
            </button>
          </div>
        </div>

        {/* Return to store link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#e8ecd0]/80 hover:text-[#f3e5ab] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى واجهة متجر سُـلاف الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

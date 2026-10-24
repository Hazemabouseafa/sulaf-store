"use client";

import { getClientSettings } from "@/lib/settings/store-settings";

const AUTH_STORAGE_KEY = "sulaf_admin_auth_session";

export interface AdminSession {
  username: string;
  loginTime: string;
  token: string;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    // Session expires after 7 days
    const loginDate = new Date(session.loginTime);
    if (Date.now() - loginDate.getTime() > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function adminLogin(username: string, password: string): { success: boolean; error?: string } {
  const settings = getClientSettings();
  const validUsername = settings.admin?.username || "admin";
  const validPassword = settings.admin?.password || "sulaf2026";

  if (username.trim() === validUsername && password === validPassword) {
    const session: AdminSession = {
      username: validUsername,
      loginTime: new Date().toISOString(),
      token: "sulaf_admin_token_" + Math.random().toString(36).substring(2),
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      // Also set document cookie for HTTP requests
      document.cookie = `sulaf_admin_token=${session.token}; path=/; max-age=604800; SameSite=Lax`;
    }
    return { success: true };
  }

  return { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" };
}

export function adminLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = "sulaf_admin_token=; path=/; max-age=0";
  }
}

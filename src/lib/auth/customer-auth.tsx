"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CustomerAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  isDefault: boolean;
}

export interface CustomerCustomCoupon {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
  assignedAt: string;
}

export interface CustomerCustomNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  type?: "gift" | "discount" | "clinical" | "general";
  couponCode?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  governorate?: string;
  city?: string;
  address?: string;
  registeredAt: string;
  role: "customer" | "vip";
  savedAddresses: CustomerAddress[];
  customCoupons?: CustomerCustomCoupon[];
  customNotifications?: CustomerCustomNotification[];
}

export interface CustomerAuthContextType {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    governorate?: string;
    city?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: () => void;
  googleLogin: () => void;
  updateProfile: (data: Partial<CustomerUser>) => void;
  addAddress: (addr: Omit<CustomerAddress, "id">) => void;
  updateAddress: (id: string, addr: Partial<CustomerAddress>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  dismissNotification: (id: string) => void;
  refreshUserData: () => Promise<void>;
}

const CUSTOMERS_DB_KEY = "sulaf_customers_db_v1";
const CUSTOMER_SESSION_KEY = "sulaf_customer_session_v1";

const DEFAULT_DEMO_USER: CustomerUser = {
  id: "cust-sarah-demo",
  name: "سارة الأندلسي",
  email: "sarah.andalusi@gmail.com",
  phone: "01012345678",
  password: "password123",
  governorate: "القاهرة",
  city: "التجمع الخامس",
  address: "شارع التسعين الشمالي، كمبوند النرجس، عمارة 14، شقة 5",
  registeredAt: "2026-01-15",
  role: "vip",
  savedAddresses: [
    {
      id: "addr-1",
      label: "المنزل (التجمع الخامس)",
      recipientName: "سارة الأندلسي",
      phone: "01012345678",
      governorate: "القاهرة",
      city: "التجمع الخامس",
      address: "شارع التسعين الشمالي، كمبوند النرجس، عمارة 14، شقة 5",
      isDefault: true,
    },
    {
      id: "addr-2",
      label: "العيادة / العمل (المهندسين)",
      recipientName: "د. سارة الأندلسي",
      phone: "01012345678",
      governorate: "الجيزة",
      city: "المهندسين",
      address: "شارع جامعة الدول العربية، برج الأطباء، الدور الرابع",
      isDefault: false,
    },
  ],
  customCoupons: [
    {
      id: "cc-sarah-25",
      code: "SARAH-VIP25",
      titleAr: "خصم VIP استثنائي 25%",
      titleEn: "Exclusive 25% VIP Discount",
      descAr: "كوبون مخصص لحسابكِ تقديراً لولائكِ واختياركِ الدائم لمستحضرات سُـلاف.",
      descEn: "Personalized coupon assigned exclusively to your account as a valued client.",
      discountType: "PERCENTAGE",
      discountValue: 25,
      minOrderAmount: 0,
      expiryDate: "2026-12-31",
      isActive: true,
      assignedAt: "2026-10-24",
    },
  ],
  customNotifications: [
    {
      id: "cn-sarah-1",
      titleAr: "🎉 هدية خاصة واستثنائية من إدارة سُـلاف",
      titleEn: "Special Exclusive Gift from Sulaf Management",
      messageAr: "يسعدنا تخصيص كود الخصم الحصري (SARAH-VIP25) بخصم 25% لحسابكِ تقديراً لثقتكِ الغالية بنا. يطبق تلقائياً على كامل سلتكِ القادمة!",
      messageEn: "We are thrilled to assign an exclusive 25% discount code (SARAH-VIP25) to your account. Enjoy premium care!",
      couponCode: "SARAH-VIP25",
      type: "gift",
      isRead: false,
      createdAt: "2026-10-24",
    },
  ],
};

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshUserData = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.customers)) {
          localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(data.customers));

          // If current user is logged in, sync with server data
          const rawSession = localStorage.getItem(CUSTOMER_SESSION_KEY);
          if (rawSession) {
            const current = JSON.parse(rawSession) as CustomerUser;
            const updated = data.customers.find((c: any) => c.id === current.id || c.email === current.email);
            if (updated) {
              const merged: CustomerUser = { ...current, ...updated };
              setUser(merged);
              localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(merged));
            }
          }
        }
      }
    } catch (err) {
      console.warn("Failed to sync customers from server:", err);
    }
  }, []);

  // Initialize DB and load session on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Ensure customers DB exists with at least the demo user
      const rawDb = localStorage.getItem(CUSTOMERS_DB_KEY);
      if (!rawDb) {
        localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify([DEFAULT_DEMO_USER]));
      }

      // Load session
      const rawSession = localStorage.getItem(CUSTOMER_SESSION_KEY);
      if (rawSession) {
        const sessionUser = JSON.parse(rawSession) as CustomerUser;
        setUser(sessionUser);
      }
    } catch (e) {
      console.error("Error reading customer auth state:", e);
    } finally {
      setIsLoaded(true);
    }

    refreshUserData();
  }, [refreshUserData]);

  const getDb = (): CustomerUser[] => {
    if (typeof window === "undefined") return [DEFAULT_DEMO_USER];
    try {
      const raw = localStorage.getItem(CUSTOMERS_DB_KEY);
      return raw ? JSON.parse(raw) : [DEFAULT_DEMO_USER];
    } catch {
      return [DEFAULT_DEMO_USER];
    }
  };

  const saveDb = (db: CustomerUser[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Failed to save customers db", e);
    }
  };

  const persistSession = (u: CustomerUser | null) => {
    setUser(u);
    if (typeof window === "undefined") return;
    try {
      if (u) {
        localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(u));
        document.cookie = `sulaf_customer_id=${u.id}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        localStorage.removeItem(CUSTOMER_SESSION_KEY);
        document.cookie = "sulaf_customer_id=; path=/; max-age=0";
      }
    } catch (e) {
      console.error("Failed to persist session", e);
    }
  };

  const login = async (identifier: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const db = getDb();

    const found = db.find(
      (c) =>
        c.email.toLowerCase() === cleanId ||
        c.phone.replace(/\s+/g, "") === cleanId.replace(/\s+/g, "")
    );

    if (!found) {
      return { success: false, error: "لم نجد حساباً مسجلاً بهذا البريد أو رقم الهاتف. يمكنك إنشاء حساب جديد خلال ثوانٍ." };
    }

    if (password && found.password && found.password !== password) {
      return { success: false, error: "كلمة المرور غير صحيحة، يرجى التأكد وإعادة المحاولة." };
    }

    persistSession(found);
    return { success: true };
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    governorate?: string;
    city?: string;
    address?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || data.name.trim().length < 3) {
      return { success: false, error: "يرجى كتابة الاسم بالكامل بشكل صحيح." };
    }
    if (!data.email || !data.email.includes("@")) {
      return { success: false, error: "يرجى إدخال بريد إلكتروني صحيح." };
    }
    if (!data.phone || data.phone.trim().length < 10) {
      return { success: false, error: "يرجى إدخال رقم هاتف صحيح مكوّن من 11 رقماً." };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim().replace(/\s+/g, "");
    const db = getDb();

    const exists = db.some(
      (c) =>
        c.email.toLowerCase() === cleanEmail ||
        c.phone.replace(/\s+/g, "") === cleanPhone
    );

    if (exists) {
      return {
        success: false,
        error: "هذا البريد الإلكتروني أو رقم الهاتف مسجل لدينا بالفعل. يمكنك تسجيل الدخول مباشرة.",
      };
    }

    const newId = "cust_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6);
    const initialAddress: CustomerAddress | null = data.address
      ? {
          id: "addr_" + Date.now(),
          label: "العنوان الرئيسي",
          recipientName: data.name.trim(),
          phone: cleanPhone,
          governorate: data.governorate || "القاهرة",
          city: data.city || "القاهرة",
          address: data.address.trim(),
          isDefault: true,
        }
      : null;

    const newUser: CustomerUser = {
      id: newId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: data.password || "sulaf123",
      governorate: data.governorate || "القاهرة",
      city: data.city || "",
      address: data.address || "",
      registeredAt: new Date().toISOString().split("T")[0],
      role: "customer",
      savedAddresses: initialAddress ? [initialAddress] : [],
      customCoupons: [],
      customNotifications: [
        {
          id: "cn-welcome-" + Date.now(),
          titleAr: "✨ مرحباً بكِ في عائلة سُـلاف",
          titleEn: "Welcome to the Sulaf Family",
          messageAr: "أهلاً بكِ في حسابكِ السريري المعتمد. ستحصلين على عروض حصرية وتتبع مباشر لكافة شحناتكِ.",
          messageEn: "Welcome to your clinical account. Track orders and enjoy exclusive rewards.",
          type: "general",
          isRead: false,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ],
    };

    const newDb = [...db, newUser];
    saveDb(newDb);
    persistSession(newUser);

    // Sync to server backend
    try {
      fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }).catch(() => {});
    } catch {}

    return { success: true };
  };

  const logout = () => {
    persistSession(null);
  };

  const quickDemoLogin = () => {
    persistSession(DEFAULT_DEMO_USER);
  };

  const googleLogin = () => {
    persistSession(DEFAULT_DEMO_USER);
  };

  const updateProfile = (data: Partial<CustomerUser>) => {
    if (!user) return;
    const updated: CustomerUser = { ...user, ...data };
    persistSession(updated);

    const db = getDb().map((c) => (c.id === user.id ? updated : c));
    saveDb(db);

    try {
      fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).catch(() => {});
    } catch {}
  };

  const addAddress = (addr: Omit<CustomerAddress, "id">) => {
    if (!user) return;
    const newAddr: CustomerAddress = {
      ...addr,
      id: "addr_" + Date.now(),
      isDefault: user.savedAddresses.length === 0 ? true : addr.isDefault,
    };

    let updatedList = [...user.savedAddresses];
    if (newAddr.isDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }
    updatedList.push(newAddr);

    updateProfile({ savedAddresses: updatedList });
  };

  const updateAddress = (id: string, addr: Partial<CustomerAddress>) => {
    if (!user) return;
    let updatedList = user.savedAddresses.map((a) =>
      a.id === id ? { ...a, ...addr } : a
    );
    if (addr.isDefault) {
      updatedList = updatedList.map((a) =>
        a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }
      );
    }
    updateProfile({ savedAddresses: updatedList });
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const updatedList = user.savedAddresses.filter((a) => a.id !== id);
    if (updatedList.length > 0 && !updatedList.some((a) => a.isDefault)) {
      updatedList[0].isDefault = true;
    }
    updateProfile({ savedAddresses: updatedList });
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updatedList = user.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    updateProfile({ savedAddresses: updatedList });
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; error?: string } => {
    if (!user) return { success: false, error: "المستخدم غير مسجل" };
    if (user.password && user.password !== oldPass) {
      return { success: false, error: "كلمة المرور الحالية غير صحيحة" };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: "كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف" };
    }

    updateProfile({ password: newPass });
    return { success: true };
  };

  const dismissNotification = (id: string) => {
    if (!user || !user.customNotifications) return;
    const updated = user.customNotifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    updateProfile({ customNotifications: updated });

    try {
      fetch("/api/customers/perks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_notification_read", customerId: user.id, notificationId: id }),
      }).catch(() => {});
    } catch {}
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        quickDemoLogin,
        googleLogin,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        changePassword,
        dismissNotification,
        refreshUserData,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
}

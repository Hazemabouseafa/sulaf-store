"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { OrderRecord } from "@/lib/orders/order-store";
import { ProductData, ProductPageBuilderData } from "@/lib/data/mock-data";
import { ProductPageBuilderModal } from "@/components/admin/ProductPageBuilderModal";
import { PageContentEditor } from "@/components/admin/PageContentEditor";
import { HomepageSectionBuilder } from "@/components/admin/HomepageSectionBuilder";
import { ShippingCarrierSettings } from "@/components/admin/ShippingCarrierSettings";
import { CouponData } from "@/lib/coupons/coupon-store";
import { ReviewItem } from "@/lib/reviews/review-store";
import { saveProducts } from "@/lib/products/product-store";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import {
  DEFAULT_SHIPPING_PROVIDERS,
  ShippingProviderConfig,
  ShippingProviderType,
} from "@/lib/settings/store-settings";
import {
  SectionVisibilitySettings,
  ElementVisibilitySettings,
  CustomContentSettings,
  CustomHomepageSection,
  DEFAULT_SECTION_VISIBILITY,
  DEFAULT_ELEMENT_VISIBILITY,
  HomepageSectionKey,
  DEFAULT_HOMEPAGE_SECTIONS_ORDER,
  CustomGovernorateShippingRate,
  DEFAULT_THEME_COLORS,
  LUXURY_THEME_PRESETS,
  ThemeColorsSettings,
  ThemePreset,
  adjustHexBrightness,
} from "@/lib/settings/store-settings";
import {
  ShieldCheck,
  Package,
  Ticket,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Smartphone,
  MessageCircle,
  Clock,
  Truck,
  CreditCard,
  FileCheck,
  ChevronDown,
  Layers,
  Sparkles,
  AlertCircle,
  Check,
  X,
  Printer,
  Download,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Sliders,
  BadgeCheck,
  Palette,
  Calendar,
  MapPin,
  Percent,
  Heart,
  FlaskConical,
  Award,
  Gift,
  Bell,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  RotateCcw,
  FileText,
  Copy,
  Zap,
  Globe,
  BookOpen,
  Star,
  UploadCloud,
  ImagePlus,
  Upload,
  ImageIcon,
} from "lucide-react";


const ALL_EGYPT_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "البحيرة", "الدقهلية", "الغربية", "الشرقية", "المنوفية",
  "القليوبية", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "الفيوم", "بني سويف",
  "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "مطروح",
  "جنوب سيناء", "شمال سيناء", "الوادي الجديد"
];

const HOMEPAGE_SECTION_META: Record<
  HomepageSectionKey,
  { nameAr: string; nameEn: string; desc: string; icon: any }
> = {
  heroSection: {
    nameAr: "قسم الهيرو الرئيسي",
    nameEn: "Hero Section",
    desc: "العنوان والبيت الشعري والشارات والوعد السريري",
    icon: Sparkles,
  },
  singleProductShowcase: {
    nameAr: "قسم استعراض المنتج الواحد الأيقوني",
    nameEn: "Single Product Spotlight & Commerce",
    desc: "عرض المستحضر الأيقوني الأكثر طلباً مع التركيبة الثلاثية، السعر وزر الإضافة للسلة الفوري",
    icon: Package,
  },
  aboutSection: {
    nameAr: "قسم عن سُلاف والقصة",
    nameEn: "About Sulaf & Story",
    desc: "نبذة عن البراند والفلسفة الأندلسية الصيدلانية",
    icon: FileText,
  },
  artOfCosmeceuticals: {
    nameAr: "فن الـ Cosmeceuticals ولآلئ المكونات",
    nameEn: "Art of Cosmeceuticals & Pearl Orbs",
    desc: "لآلئ المكونات التفاعلية والضمان الأوروبي",
    icon: FlaskConical,
  },
  gallerySection: {
    nameAr: "معرض المستحضرات على المنصات الرخامية",
    nameEn: "Marble Podium Products Gallery",
    desc: "كاروسيل بطاقات المنتجات على منصات الرخام",
    icon: Package,
  },
  clinicalStorySection: {
    nameAr: "الأدلة السريرية والدراسات المعملية",
    nameEn: "Clinical Evidence & Studies",
    desc: "إحصائيات النتائج السريرية وروابط الأبحاث",
    icon: Activity,
  },
  reviewsSection: {
    nameAr: "تجارب وآراء الأطباء والعملاء",
    nameEn: "Doctor & Customer Verified Reviews",
    desc: "تقييمات وآراء العملاء والأطباء المعتمدة",
    icon: Award,
  },
  consultationSection: {
    nameAr: "بنر الاستشارة الجلدية عبر واتساب",
    nameEn: "WhatsApp Dermatological Consultation",
    desc: "دعوة العميل للاستشارة المجانية المباشرة",
    icon: MessageCircle,
  },
};



const ADMIN_I18N = {
  ar: {
    currency: "ج.م",
    header: {
      title: "سُـلاف | لوحة الإدارة العامة",
      liveDb: "قاعدة بيانات حية (JSON Server Live)",
      lastSync: "آخر تحديث:",
      syncBtn: "تحديث البيانات الآن",
      syncing: "جاري المزامنة...",
      preview: "معاينة المتجر",
      logout: "خروج",
      langBtn: "English",
    },
    navSection: "أقسام الإدارة",
    tabs: {
      overview: "نظرة عامة والتقارير",
      orders: "إدارة الطلبات",
      products: "المنتجات والمخزون",
      coupons: "كوبونات الخصم",
      customers: "العملاء ومكافآت VIP",
      pages: "تعديل صفحات الموقع",
      reviews: "تقييمات وآراء العملاء",
      cms: "الأقسام والنصوص (CMS)",
      settings: "إعدادات المتجر والدفع",
    },
    overview: {
      totalSales: "إجمالي المبيعات",
      salesVerified: "مبيعات موثقة داخل النظام",
      collectedRevenue: "المحصل الفعلي (عربون + كامل)",
      collectedDesc: "مسدد عبر إنستاباي، فودافون، أو كارت",
      pendingCod: "المتبقي قيد التحصيل (COD)",
      pendingCodDesc: "يتم تحصيله بمعرفة مندوب شركة الشحن",
      totalOrders: "إجمالي الطلبات المسجلة",
      ordersUnit: "طلب",
      aov: "متوسط قيمة الطلب:",
      recentOrders: "أحدث الطلبات المسجلة",
      urgentStock: "تنبيه عاجل: نواقص بالمخزون في بعض المستحضرات!",
      urgentStockDesc: "هناك {count} مستحضر شارف مخزونه على النفاد (أقل من 10 عبوات).",
      viewStock: "فحص وتحديث المخزون الآن",
    },
    orders: {
      searchPlaceholder: "بحث برقم الطلب، اسم العميل، الهاتف، أو المدينة...",
      all: "جميع الحالات",
      exportCsv: "تصدير كشف الطلبات (CSV)",
      thOrderNo: "رقم الطلب",
      thCustomer: "العميل",
      thPhone: "الهاتف",
      thLocation: "المحافظة والمدينة",
      thTotal: "المبلغ الإجمالي",
      thPayment: "حالة الدفع",
      thStatus: "حالة الطلب",
      thDate: "تاريخ الطلب",
      thActions: "الإجراءات",
      whatsappConfirm: "تأكيد واتساب",
      whatsappDispatch: "إشعار الشحن",
      changeStatus: "تغيير الحالة:",
    },
    products: {
      addProduct: "إضافة مستحضر جديد",
      searchPlaceholder: "بحث باسم المستحضر أو الـ SKU...",
      all: "جميع المنتجات",
      inStock: "متوفر بالمخزون",
      lowStock: "مخزون منخفض (< 10)",
      outOfStock: "نفد المخزون",
      thProduct: "المستحضر",
      thSku: "المعرف (SKU)",
      thPrice: "السعر",
      thStock: "المخزون",
      thBadge: "الشارة",
      thActions: "الإجراءات",
      edit: "تعديل",
      delete: "حذف",
      saveStock: "حفظ",
      cancel: "إلغاء",
    },
    coupons: {
      createCoupon: "إنشاء كود خصم جديد",
      searchPlaceholder: "بحث بكود الخصم...",
      thCode: "الكود",
      thType: "نوع الخصم",
      thValue: "القيمة",
      thMin: "الحد الأدنى",
      thUsage: "مرات الاستخدام",
      thExpiry: "تاريخ الانتهاء",
      thStatus: "الحالة",
      thActions: "الإجراءات",
      active: "مفعل",
      inactive: "معطل",
      delete: "حذف",
    },
    customers: {
      searchPlaceholder: "بحث باسم العميل أو رقم الهاتف...",
      exportCsv: "تصدير كشف العملاء (CSV)",
      thName: "اسم العميل",
      thPhone: "الهاتف",
      thLocation: "المحافظة والمدينة",
      thOrdersCount: "عدد الطلبات",
      thTotalSpent: "إجمالي المشتريات",
      thLastOrder: "آخر طلب",
    },
    settings: {
      title: "إعدادات المتجر وهوية البراند",
      saveBtn: "حفظ كافة التعديلات والإعدادات",
      saving: "جاري الحفظ...",
      storyTab: "الهوية وقصة البراند",
      paymentTab: "خيارات الدفع والعربون",
      shippingTab: "رسوم الشحن والمحافظات",
      announcementTab: "شريط الإعلانات",
    },
    status: {
      PENDING_CONFIRMATION: "قيد المراجعة",
      PROCESSING: "قيد التجهيز",
      SHIPPED: "تم الشحن",
      DELIVERED: "تم التوصيل",
      CANCELLED: "ملغي",
    },
    payment: {
      FULLY_PAID: "مدفوع بالكامل ✓",
      DEPOSIT_PAID: "مسدد العربون",
      UNPAID: "بانتظار السداد",
    },
    login: {
      title: "لوحة تحكم سلاف | Sulaf",
      subtitle: "البوابة الإدارية والتحكم السريري المباشر",
      userLabel: "اسم المستخدم",
      userPlaceholder: "اسم المستخدم (admin)",
      passLabel: "كلمة المرور",
      passPlaceholder: "كلمة المرور (sulaf2026)",
      submit: "تسجيل الدخول إلى النظام",
      submitting: "جاري التحقق والاتصال...",
      demoHint: "بيانات الدخول الافتراضية:",
    },
  },
  en: {
    currency: "EGP",
    header: {
      title: "Sulaf | Central Admin Portal",
      liveDb: "Live Database (JSON Server Live)",
      lastSync: "Last Synced:",
      syncBtn: "Refresh Data Now",
      syncing: "Syncing...",
      preview: "Storefront Preview",
      logout: "Logout",
      langBtn: "العربية",
    },
    navSection: "MANAGEMENT SECTIONS",
    tabs: {
      overview: "Overview",
      orders: "Orders",
      products: "Products & Stock",
      coupons: "Coupons",
      customers: "Customers & VIP Perks",
      pages: "Site Pages Management",
      analytics: "Analytics & Sales",
      reviews: "Customer Reviews",
      cms: "Sections & CMS",
      settings: "Store Settings",
    },
    overview: {
      totalSales: "Total Sales",
      salesVerified: "System-verified orders revenue",
      collectedRevenue: "Actually Collected (Deposit + Full)",
      collectedDesc: "Paid via InstaPay, Wallet, or Card",
      pendingCod: "Balance Due on Delivery (COD)",
      pendingCodDesc: "Collected by courier upon delivery",
      totalOrders: "Total Orders Recorded",
      ordersUnit: "orders",
      aov: "Avg. Order Value:",
      recentOrders: "Recent Recorded Orders",
      urgentStock: "Urgent Alert: Low stock in formulations!",
      urgentStockDesc: "There are {count} products running low (less than 10 units).",
      viewStock: "Inspect & Update Stock",
    },
    orders: {
      searchPlaceholder: "Search by order #, customer, phone, or city...",
      all: "All Statuses",
      exportCsv: "Export Orders (CSV)",
      thOrderNo: "Order #",
      thCustomer: "Customer",
      thPhone: "Phone",
      thLocation: "Governorate & City",
      thTotal: "Total Amount",
      thPayment: "Payment",
      thStatus: "Order Status",
      thDate: "Order Date",
      thActions: "Actions",
      whatsappConfirm: "WhatsApp Confirm",
      whatsappDispatch: "Dispatch Notice",
      changeStatus: "Change Status:",
    },
    products: {
      addProduct: "Add New Formulation",
      searchPlaceholder: "Search by product name or SKU...",
      all: "All Products",
      inStock: "In Stock",
      lowStock: "Low Stock (< 10)",
      outOfStock: "Out of Stock",
      thProduct: "Product",
      thSku: "SKU",
      thPrice: "Price",
      thStock: "Stock",
      thBadge: "Badge",
      thActions: "Actions",
      edit: "Edit",
      delete: "Delete",
      saveStock: "Save",
      cancel: "Cancel",
    },
    coupons: {
      createCoupon: "Create Promo Code",
      searchPlaceholder: "Search coupon code...",
      thCode: "Code",
      thType: "Discount Type",
      thValue: "Value",
      thMin: "Min Order",
      thUsage: "Usage Count",
      thExpiry: "Expiry Date",
      thStatus: "Status",
      thActions: "Actions",
      active: "Active",
      inactive: "Disabled",
      delete: "Delete",
    },
    customers: {
      searchPlaceholder: "Search by name or phone...",
      exportCsv: "Export Customers (CSV)",
      thName: "Customer Name",
      thPhone: "Phone",
      thLocation: "Location",
      thOrdersCount: "Orders",
      thTotalSpent: "Total Spent",
      thLastOrder: "Last Order",
    },
    settings: {
      title: "Store Settings & Brand Story",
      saveBtn: "Save All Store Settings",
      saving: "Saving Settings...",
      storyTab: "Brand Identity & Story",
      paymentTab: "Payment & Deposit Options",
      shippingTab: "Shipping Fees & Governorates",
      announcementTab: "Announcement Bar",
    },
    status: {
      PENDING_CONFIRMATION: "Pending Review",
      PROCESSING: "Processing",
      SHIPPED: "Shipped",
      DELIVERED: "Delivered",
      CANCELLED: "Cancelled",
    },
    payment: {
      FULLY_PAID: "Fully Paid ✓",
      DEPOSIT_PAID: "Deposit Paid",
      UNPAID: "Awaiting Payment",
    },
    login: {
      title: "Sulaf Admin Portal",
      subtitle: "Direct Clinical & Administrative Control",
      userLabel: "Username",
      userPlaceholder: "Username (admin)",
      passLabel: "Password",
      passPlaceholder: "Password (sulaf2026)",
      submit: "Sign in to Dashboard",
      submitting: "Authenticating with server...",
      demoHint: "Default Demo Credentials:",
    },
  },
};


export default function AdminPage() {
  // Admin Language State (Arabic / English)
  const [adminLang, setAdminLang] = useState<"ar" | "en">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sulaf_admin_lang") as "ar" | "en") || "en";
    }
    return "en";
  });

  const toggleAdminLang = () => {
    const next = adminLang === "ar" ? "en" : "ar";
    setAdminLang(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("sulaf_admin_lang", next);
    }
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Password Change State
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newUsername: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Navigation Tab
  // Shipping Provider API States
  const [selectedShippingCarrier, setSelectedShippingCarrier] = useState<ShippingProviderType>("stox");
  const [shippingTestLoading, setShippingTestLoading] = useState(false);
  const [shippingTestResult, setShippingTestResult] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "coupons" | "customers" | "pages" | "cms" | "settings" | "reviews"
  >("overview");

  // Data Stores
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  const { settings, updateSettings } = useStoreSettings();
  // Visual CMS & Content Visibility States
  const [cmsSections, setCmsSections] = useState<SectionVisibilitySettings>(
    () => settings.sectionsVisibility || DEFAULT_SECTION_VISIBILITY
  );
  const [cmsSectionsOrder, setCmsSectionsOrder] = useState<string[]>(
    () => (settings.sectionsOrder && settings.sectionsOrder.length > 0)
      ? settings.sectionsOrder
      : DEFAULT_HOMEPAGE_SECTIONS_ORDER
  );
  const [customSections, setCustomSections] = useState<CustomHomepageSection[]>(
    () => settings.customSections || []
  );
  const [cmsElements, setCmsElements] = useState<ElementVisibilitySettings>(
    () => settings.elementsVisibility || DEFAULT_ELEMENT_VISIBILITY
  );
  const [cmsContent, setCmsContent] = useState<CustomContentSettings>(
    () => settings.customContent || {}
  );
  const [cmsContentEn, setCmsContentEn] = useState<CustomContentSettings>(
    () => settings.customContentEn || {}
  );
  const [cmsTargetLang, setCmsTargetLang] = useState<"ar" | "en">("ar");
  const [cmsSubTab, setCmsSubTab] = useState<string>("announcement");
  const [isCmsSaving, setIsCmsSaving] = useState(false);
  const [isThemeSaving, setIsThemeSaving] = useState(false);

  // Sync CMS states when settings update from server
  useEffect(() => {
    if (settings) {
      if (settings.sectionsVisibility) setCmsSections(settings.sectionsVisibility);
      if (settings.elementsVisibility) setCmsElements(settings.elementsVisibility);
      if (settings.customContent) setCmsContent(settings.customContent);
      if (settings.customContentEn) setCmsContentEn(settings.customContentEn);
      if (settings.customSections) setCustomSections(settings.customSections);
      if (settings.sectionsOrder && Array.isArray(settings.sectionsOrder) && settings.sectionsOrder.length > 0) {
        setCmsSectionsOrder(settings.sectionsOrder);
      }
    }
  }, [settings]);

  function moveSectionUp(index: number) {
    if (index <= 0) return;
    setCmsSectionsOrder((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  }

  function moveSectionDown(index: number) {
    if (index >= cmsSectionsOrder.length - 1) return;
    setCmsSectionsOrder((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  }

  async function handleSaveCms() {
    setIsCmsSaving(true);
    try {
      updateSettings({
        sectionsVisibility: cmsSections,
        elementsVisibility: cmsElements,
        customContent: cmsContent,
        customContentEn: cmsContentEn,
        sectionsOrder: cmsSectionsOrder,
        customSections: customSections,
      });
      showToast(
        adminLang === "ar"
          ? "تم حفظ كافة إعدادات الأقسام وترتيبها والنصوص وتحديث المتجر بنجاح ✓"
          : "All sections, order & texts saved and storefront updated successfully ✓"
      );
    } catch {
      showToast(
        adminLang === "ar" ? "فشل حفظ إعدادات المحتوى." : "Failed to save CMS settings.",
        "error"
      );
    } finally {
      setIsCmsSaving(false);
    }
  }

  function handleResetCmsDefaults() {
    if (!confirm(adminLang === "ar" ? "هل ترغب في استعادة ضبط الرؤية والنصوص والترتيب الأصلي؟" : "Reset all visibility, order & texts to default?")) return;
    setCmsSections(DEFAULT_SECTION_VISIBILITY);
    setCmsElements(DEFAULT_ELEMENT_VISIBILITY);
    setCmsContent({});
    setCmsContentEn({});
    setCustomSections([]);
    setCmsSectionsOrder(DEFAULT_HOMEPAGE_SECTIONS_ORDER);
    updateSettings({
      sectionsVisibility: DEFAULT_SECTION_VISIBILITY,
      elementsVisibility: DEFAULT_ELEMENT_VISIBILITY,
      customContent: {},
      customContentEn: {},
      customSections: [],
      sectionsOrder: DEFAULT_HOMEPAGE_SECTIONS_ORDER,
    });
    showToast(adminLang === "ar" ? "تمت استعادة الإعدادات الأصلية والترتيب الافتراضي للأقسام." : "Restored default settings and order for all sections.");
  }


  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<string>("ALL");
  const [productSearch, setProductSearch] = useState("");
  const [productFilter, setProductFilter] = useState<string>("ALL");
  const [customerSearch, setCustomerSearch] = useState("");

  // Reviews & Feedback Admin State
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [reviewSearch, setReviewSearch] = useState("");
  const [addReviewModalOpen, setAddReviewModalOpen] = useState(false);
  const [manualReviewForm, setManualReviewForm] = useState({
    productId: "",
    productName: "Absolutes Smoothing Body Cream",
    authorName: "",
    authorRole: "دكتورة صيدلانية",
    rating: 5,
    title: "",
    comment: "",
    isVerifiedPurchase: true,
  });

  async function handleApproveReview(id: string) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "APPROVED", approvedAt: new Date().toISOString() } : r))
        );
        showToast(adminLang === "ar" ? "تم اعتماد ونشر التقييم بنجاح في المتجر ✓" : "Review approved and published ✓");
      } else {
        showToast(data.error || "تعذر اعتماد التقييم", "error");
      }
    } catch {
      showToast("حدث خطأ أثناء اعتماد التقييم", "error");
    }
  }

  async function handleRejectReview(id: string) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
        );
        showToast(adminLang === "ar" ? "تم رفض التقييم وإخفاؤه." : "Review rejected.");
      } else {
        showToast(data.error || "تعذر تحديث التقييم", "error");
      }
    } catch {
      showToast("حدث خطأ أثناء رفض التقييم", "error");
    }
  }

  async function handleUnapproveReview(id: string) {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PENDING" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "PENDING" } : r))
        );
        showToast(adminLang === "ar" ? "تم إرجاع التقييم لحالة قيد المراجعة." : "Review moved back to pending.");
      } else {
        showToast(data.error || "تعذر تحديث التقييم", "error");
      }
    } catch {
      showToast("حدث خطأ أثناء تحديث التقييم", "error");
    }
  }

  async function handleDeleteReview(id: string) {
    if (!confirm(adminLang === "ar" ? "هل أنت متأكد من حذف هذا الرأي / التقييم نهائياً؟" : "Are you sure you want to delete this review?")) {
      return;
    }
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList((prev) => prev.filter((r) => r.id !== id));
        showToast(adminLang === "ar" ? "تم حذف التقييم نهائياً بنجاح ✓" : "Review deleted successfully ✓");
      } else {
        showToast(data.error || "تعذر حذف التقييم", "error");
      }
    } catch {
      showToast("حدث خطأ أثناء حذف التقييم", "error");
    }
  }

  async function handleAddManualReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualReviewForm.authorName.trim() || !manualReviewForm.comment.trim()) {
      showToast(adminLang === "ar" ? "يرجى كتابة اسم العميل وتفاصيل الرأي." : "Please fill author name and comment.", "error");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAdmin: true,
          productId: manualReviewForm.productId || (products[0]?.id || "prod-absolutes-cream"),
          productName: manualReviewForm.productName,
          authorName: manualReviewForm.authorName.trim(),
          authorRole: manualReviewForm.authorRole.trim(),
          rating: manualReviewForm.rating,
          title: manualReviewForm.title.trim(),
          comment: manualReviewForm.comment.trim(),
          isVerifiedPurchase: manualReviewForm.isVerifiedPurchase,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviewsList((prev) => [data.review, ...prev]);
        setAddReviewModalOpen(false);
        setManualReviewForm({
          productId: "",
          productName: "Absolutes Smoothing Body Cream",
          authorName: "",
          authorRole: "دكتورة صيدلانية",
          rating: 5,
          title: "",
          comment: "",
          isVerifiedPurchase: true,
        });
        showToast(adminLang === "ar" ? "تمت إضافة واعتماد رأي العميل بنجاح ونشره بالمتجر ✓" : "Manual review added and approved ✓");
      } else {
        showToast(data.error || "تعذر إضافة التقييم", "error");
      }
    } catch {
      showToast("حدث خطأ أثناء إضافة التقييم", "error");
    }
  }

  async function toggleReviewsSectionVisibility() {
    const current = settings.sectionsVisibility?.reviewsSection !== false;
    const next = !current;
    await updateSettings({
      sectionsVisibility: {
        ...(settings.sectionsVisibility || DEFAULT_SECTION_VISIBILITY),
        reviewsSection: next,
      },
    });
    showToast(next
      ? (adminLang === "ar" ? "تم إظهار وتفعيل قسم آراء العملاء في الصفحة الرئيسية ✓" : "Reviews section enabled on homepage ✓")
      : (adminLang === "ar" ? "تم إخفاء قسم آراء العملاء من الصفحة الرئيسية ✓" : "Reviews section hidden from homepage ✓")
    );
  }
  // Customer VIP Perks & Personalized Notifications State
  const [registeredCustomers, setRegisteredCustomers] = useState<any[]>([]);
  const [selectedPerkCustomerId, setSelectedPerkCustomerId] = useState<string>("ALL");
  const [perkOrderFilter, setPerkOrderFilter] = useState<string>("ALL");
  const [perkCustomerSearch, setPerkCustomerSearch] = useState<string>("");
  // Site Pages Management & Editor State
  const [storePages, setStorePages] = useState<any[]>([]);
  const [pageSearch, setPageSearch] = useState("");
  const [pageFilter, setPageFilter] = useState<"ALL" | "builtin" | "custom">("ALL");
  const [pageEditorModalOpen, setPageEditorModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [pageEditorTab, setPageEditorTab] = useState<"edit" | "preview">("edit");
  const [pageEditorLang, setPageEditorLang] = useState<"ar" | "en">("ar");
  const [isPageSaving, setIsPageSaving] = useState(false);
  const [pageEditorForm, setPageEditorForm] = useState({
    id: "",
    titleAr: "",
    titleEn: "",
    slug: "",
    subtitleAr: "",
    subtitleEn: "",
    contentAr: "",
    contentEn: "",
    published: true,
    type: "custom" as "custom" | "builtin",
    route: "",
  });

  const [assignPerkModalOpen, setAssignPerkModalOpen] = useState(false);
  const [sendPerkNotifModalOpen, setSendPerkNotifModalOpen] = useState(false);
  const [isPerkSubmitting, setIsPerkSubmitting] = useState(false);

  const [perkCouponForm, setPerkCouponForm] = useState({
    code: "",
    titleAr: "خصم خاص لعملاء VIP",
    titleEn: "Special VIP Customer Discount",
    descAr: "كوبون مخصص لحسابكِ تقديراً لثقتكِ واختياركِ الدائم لمستحضرات سُـلاف.",
    descEn: "Personalized discount assigned exclusively to your account.",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: 20,
    minOrderAmount: 0,
    expiryDate: "2026-12-31",
    autoNotify: true,
  });

  const [perkNotifForm, setPerkNotifForm] = useState({
    titleAr: "🎉 هدية خاصة واستثنائية من إدارة سُـلاف",
    titleEn: "Special Exclusive Gift from Sulaf Management",
    messageAr: "يسعدنا تقديم كود خصم خاص لحسابكِ للاستفادة منه عند طلبكِ القادم!",
    messageEn: "We are thrilled to offer you a personalized VIP discount on your next purchase!",
    couponCode: "",
    type: "gift" as "gift" | "coupon" | "announcement",
  });


  // Modals States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [builderModalProduct, setBuilderModalProduct] = useState<ProductData | null>(null);
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [receiptModalUrl, setReceiptModalUrl] = useState<string | null>(null);
  const [receiptModalOrder, setReceiptModalOrder] = useState<OrderRecord | null>(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState<OrderRecord | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<OrderRecord | null>(null);
  const [orderNotesModal, setOrderNotesModal] = useState<OrderRecord | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  // Inline Quick Edit States
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Paymob Test Connection State
  const [paymobTestLoading, setPaymobTestLoading] = useState(false);
  const [paymobTestResult, setPaymobTestResult] = useState<any>(null);

  // Sha7nawy Test Connection State
  const [sha7nawyTestLoading, setSha7nawyTestLoading] = useState(false);
  const [sha7nawyTestResult, setSha7nawyTestResult] = useState<any>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function showToast(text: string, type: "success" | "error" = "success") {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  }

  // New Product Form State
  const [productForm, setProductForm] = useState({
    nameAr: "",
    nameEn: "",
    subtitleAr: "",
    subtitleEn: "",
    price: 420,
    compareAtPrice: 530,
    stock: 100,
    sku: "",
    badgeAr: "",
    descriptionAr: "",
    descriptionEn: "",
    usageInstructionsAr: "",
    usageInstructionsEn: "",
    imageUrl: "/brand/sulaf-flower-symbol.png",
    images: [] as { url: string; alt: string; isPrimary: boolean }[],
    isFeatured: false,
    pageBuilder: undefined as ProductPageBuilderData | undefined,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [customImageUrlInput, setCustomImageUrlInput] = useState("");
  const productFileInputRef = useRef<HTMLInputElement>(null);

  async function handleProductImageUpload(files: FileList | File[]) {
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.uploads && data.uploads.length > 0) {
        const newImages = data.uploads.map((u: any, index: number) => ({
          url: u.url,
          alt: productForm.nameAr || "Sulaf Product",
          isPrimary: productForm.images.length === 0 && index === 0,
        }));

        setProductForm((prev) => {
          const combined = [...prev.images, ...newImages];
          if (!combined.some((img) => img.isPrimary) && combined.length > 0) {
            combined[0].isPrimary = true;
          }
          const primaryUrl = combined.find((img) => img.isPrimary)?.url || combined[0]?.url || prev.imageUrl;
          return {
            ...prev,
            images: combined,
            imageUrl: primaryUrl,
          };
        });

        showToast(data.message || "تم رفع الصور بنجاح.", "success");
      } else {
        showToast(data.error || "فشل رفع الصور.", "error");
      }
    } catch (err: any) {
      showToast("حدث خطأ أثناء رفع الصورة: " + (err?.message || ""), "error");
    } finally {
      setIsUploadingImage(false);
      if (productFileInputRef.current) {
        productFileInputRef.current.value = "";
      }
    }
  }

  function handleAddImageUrl() {
    if (!customImageUrlInput.trim()) return;
    const url = customImageUrlInput.trim();
    setProductForm((prev) => {
      const isFirst = prev.images.length === 0;
      const updated = [
        ...prev.images,
        {
          url,
          alt: prev.nameAr || "Sulaf Product",
          isPrimary: isFirst,
        },
      ];
      return {
        ...prev,
        images: updated,
        imageUrl: isFirst ? url : prev.imageUrl,
      };
    });
    setCustomImageUrlInput("");
    showToast("تمت إضافة رابط الصورة بنجاح.");
  }

  function handleSetPrimaryImage(index: number) {
    setProductForm((prev) => {
      const updated = prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      const primaryUrl = updated[index]?.url || prev.imageUrl;
      return {
        ...prev,
        images: updated,
        imageUrl: primaryUrl,
      };
    });
    showToast("تم تعيين الصورة كصورة رئيسية للمستحضر.");
  }

  function handleDeleteProductImage(index: number) {
    setProductForm((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      const primaryUrl = updated.find((img) => img.isPrimary)?.url || (updated[0]?.url || "/brand/sulaf-flower-symbol.png");
      return {
        ...prev,
        images: updated,
        imageUrl: primaryUrl,
      };
    });
    showToast("تم حذف الصورة من المستحضر.");
  }

  async function handleSetFeaturedProduct(productId: string, productName: string) {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          action: "setFeatured",
          isFeatured: true,
        }),
      });
      if (res.ok) {
        showToast(
          adminLang === "ar"
            ? `✨ تم تعيين "${productName}" كمنتج رئيسي في الصفحة الرئيسية بنجاح!`
            : `"${productName}" is now the featured product on homepage!`,
          "success"
        );
        updateSettings({ featuredProductId: productId });
        loadLiveBackendData(true);
      } else {
        showToast("فشل تعيين المنتج الرئيسي.", "error");
      }
    } catch {
      showToast("حدث خطأ في الاتصال بالخادم.", "error");
    }
  }

  // New Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: 10,
    minOrderAmount: 300,
    maxUsageCount: 200,
    expiryDate: "2026-12-31",
    notes: "",
  });

  // Settings Edit State
    const [newGovName, setNewGovName] = useState("أسوان");
  const [newGovFee, setNewGovFee] = useState(65);
  const [settingsForm, setSettingsForm] = useState({
    whatsapp: "",
    instapay: "",
    vodafone: "",
    shippingFeeCairo: 45,
    shippingFeeGov: 65,
    shippingUnifiedRate: 45,
    shippingActiveProvider: "stox" as ShippingProviderType,
    shippingProviders: DEFAULT_SHIPPING_PROVIDERS,
    customGovernorateRates: [] as CustomGovernorateShippingRate[],
    multiPromoEnabled: true,
    multiPromoMinQty: 2,
    multiPromoDiscountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    multiPromoDiscountValue: 10,
    multiPromoFreeShipping: true,
    showBirthdateField: true,
    showClosePersonField: true,
    themePrimary: DEFAULT_THEME_COLORS.primary,
    themeSecondary: DEFAULT_THEME_COLORS.secondary,
    themeGold: DEFAULT_THEME_COLORS.gold,
    themeBackground: DEFAULT_THEME_COLORS.background,
    themeSurface: DEFAULT_THEME_COLORS.surface,
    themeText: DEFAULT_THEME_COLORS.text,
    freeThreshold: 800,
    depositAmount: 100,
    announcementText: "",
    announcementEnabled: true,
    paymobEnabled: true,
    paymobSandbox: true,
    paymobApiKey: "",
    paymobSecretKey: "",
    paymobCardId: "482019",
    paymobWalletId: "482020",
    paymobHmac: "",
    // Payment Gateways Selection & Sha7nawy Config
    gatewaysMode: "both" as "both" | "paymob_only" | "sha7nawy_only",
    sha7nawyEnabled: true,
    sha7nawySandbox: true,
    sha7nawyBaseUrl: "https://gate.sha7nawy.com",
    sha7nawyPublicKey: "",
    sha7nawySecretKey: "",
    sha7nawyAppName: "Sulaf-Store",
    // Our Story & Taglines
    taglineLine1: "SULAF | سُلاف",
    taglineLine2: "Where Pharmaceutical Science Meets Beauty.",
    storyP1: "من عبق الهوية العربية، وسحر الروح الأندلسية، وُلدت سُلاف؛ حيث يلتقي العلم الصيدلاني بفنّ العناية بالجمال.",
    storyP2: "نؤمن أن الجمال ليس مجرد مظهر، بل رحلة من الفهم والعناية والتوازن؛ لذلك نجمع بين المعرفة الصيدلانية، وفهم احتياجات البشرة، وفلسفة العناية المدروسة، لنقدّم تجربة تتجاوز المألوف.",
    storyP3: "في سُلاف، لا نرى العناية بالبشرة مجرد خطوات، بل لغةً من الرفق، وعلمًا يُترجم إلى عناية، وجمالًا تُصاغ تفاصيله بعناية.",
    storyP4: "نستلهم من تراثنا العربي أصالته، ومن الأندلس روحها الشعرية، ومن العلم دقّته؛ لنصنع هويةً تحتفي بجمالك المعاصر دون أن تنسى جذورها.",
    storyClosing: "سُلاف… حين يلتقي العلم بالجمال، وتُروى العناية بروحٍ عربية.",
    storyDecorative: "مَا كَانَ فِي رِفْقٍ يُدَاوِينَا، سُلَافٌ بِهِ.",
  });

  // 1. Initial Load & Background Auto-Polling
  useEffect(() => {
    const auth = localStorage.getItem("sulaf_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    loadLiveBackendData();

    // Auto-poll every 25 seconds for new customer orders
    const interval = setInterval(() => {
      loadLiveBackendData(true);
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  // Sync settings into form
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        whatsapp: settings.contacts?.whatsapp || "01099887766",
        instapay: settings.payment?.instapayHandle || "sulaf.care@instapay",
        vodafone: settings.payment?.vodafoneCash || "01099887766",
        shippingFeeCairo: settings.shipping?.cairoGiza || 45,
        shippingFeeGov: settings.shipping?.alexDelta || 65,
        shippingUnifiedRate: settings.shipping?.defaultUnifiedRate ?? 45,
        shippingActiveProvider: (settings.shipping?.activeProvider as any) || "stox",
        shippingProviders: {
          ...DEFAULT_SHIPPING_PROVIDERS,
          ...(settings.shipping?.providers || {}),
        },
        customGovernorateRates: settings.shipping?.customGovernorateRates || [],
        multiPromoEnabled: settings.multiProductPromo?.enabled ?? true,
        multiPromoMinQty: settings.multiProductPromo?.minQuantity ?? 2,
        multiPromoDiscountType: settings.multiProductPromo?.discountType ?? "PERCENTAGE",
        multiPromoDiscountValue: settings.multiProductPromo?.discountValue ?? 10,
        multiPromoFreeShipping: settings.multiProductPromo?.freeShippingEnabled ?? true,
        showBirthdateField: settings.checkoutFields?.showBirthdate ?? true,
        showClosePersonField: settings.checkoutFields?.showClosePerson ?? true,
        themePrimary: settings.themeColors?.primary || DEFAULT_THEME_COLORS.primary,
        themeSecondary: settings.themeColors?.secondary || DEFAULT_THEME_COLORS.secondary,
        themeGold: settings.themeColors?.gold || DEFAULT_THEME_COLORS.gold,
        themeBackground: settings.themeColors?.background || DEFAULT_THEME_COLORS.background,
        themeSurface: settings.themeColors?.surface || DEFAULT_THEME_COLORS.surface,
        themeText: settings.themeColors?.text || DEFAULT_THEME_COLORS.text,
        freeThreshold: settings.shipping?.freeShippingThreshold || 800,
        depositAmount: settings.payment?.depositAmount || 100,
        announcementText: settings.announcement?.text || "شحن مجاني وسريع لكافة المحافظات على الطلبات فوق 800 ج",
        announcementEnabled: settings.announcement?.enabled ?? true,
        paymobEnabled: settings.paymob?.enabled ?? true,
        paymobSandbox: settings.paymob?.isSandbox ?? true,
        paymobApiKey: settings.paymob?.apiKey || "",
        paymobSecretKey: settings.paymob?.secretKey || "",
        paymobCardId: settings.paymob?.cardIntegrationId || "482019",
        paymobWalletId: settings.paymob?.walletIntegrationId || "482020",
        paymobHmac: settings.paymob?.hmacSecret || "",
        gatewaysMode: (settings.gatewaysMode as any) || "both",
        sha7nawyEnabled: settings.sha7nawy?.enabled ?? true,
        sha7nawySandbox: settings.sha7nawy?.isSandbox ?? true,
        sha7nawyBaseUrl: settings.sha7nawy?.baseUrl || "https://gate.sha7nawy.com",
        sha7nawyPublicKey: settings.sha7nawy?.publicKey || "",
        sha7nawySecretKey: settings.sha7nawy?.secretKey || "",
        sha7nawyAppName: settings.sha7nawy?.appName || "Sulaf-Store",
        taglineLine1: settings.ourStory?.taglineLine1 || "SULAF | سُلاف",
        taglineLine2: settings.ourStory?.taglineLine2 || "Where Pharmaceutical Science Meets Beauty.",
        storyP1: settings.ourStory?.paragraph1 || "من عبق الهوية العربية، وسحر الروح الأندلسية، وُلدت سُلاف؛ حيث يلتقي العلم الصيدلاني بفنّ العناية بالجمال.",
        storyP2: settings.ourStory?.paragraph2 || "نؤمن أن الجمال ليس مجرد مظهر، بل رحلة من الفهم والعناية والتوازن؛ لذلك نجمع بين المعرفة الصيدلانية، وفهم احتياجات البشرة، وفلسفة العناية المدروسة، لنقدّم تجربة تتجاوز المألوف.",
        storyP3: settings.ourStory?.paragraph3 || "في سُلاف، لا نرى العناية بالبشرة مجرد خطوات، بل لغةً من الرفق، وعلمًا يُترجم إلى عناية، وجمالًا تُصاغ تفاصيله بعناية.",
        storyP4: settings.ourStory?.paragraph4 || "نستلهم من تراثنا العربي أصالته، ومن الأندلس روحها الشعرية، ومن العلم دقّته؛ لنصنع هويةً تحتفي بجمالك المعاصر دون أن تنسى جذورها.",
        storyClosing: settings.ourStory?.closingTitle || "سُلاف… حين يلتقي العلم بالجمال، وتُروى العناية بروحٍ عربية.",
        storyDecorative: settings.ourStory?.closingDecorative || "مَا كَانَ فِي رِفْقٍ يُدَاوِينَا، سُلَافٌ بِهِ.",
      });
    }
  }, [settings]);

  // Fetch all live data from backend API
  async function loadLiveBackendData(silent = false) {
    if (!silent) setIsSyncing(true);
    try {
      const [resOrders, resProducts, resCoupons, resAnalytics, resCustomers, resPages, resReviews] = await Promise.all([
        fetch("/api/orders", { cache: "no-store" }),
        fetch("/api/products", { cache: "no-store" }),
        fetch("/api/coupons", { cache: "no-store" }),
        fetch("/api/analytics", { cache: "no-store" }),
        fetch("/api/customers", { cache: "no-store" }),
        fetch("/api/pages", { cache: "no-store" }),
        fetch("/api/reviews", { cache: "no-store" }),
      ]);

      if (resOrders.ok) {
        const d = await resOrders.json();
        if (d.orders) setOrders(d.orders);
      }
      if (resProducts.ok) {
        const d = await resProducts.json();
        if (d.products) {
          setProducts(d.products);
          saveProducts(d.products);
        }
      }
      if (resCoupons.ok) {
        const d = await resCoupons.json();
        if (d.coupons) setCoupons(d.coupons);
      }
      if (resAnalytics.ok) {
        const d = await resAnalytics.json();
        setAnalytics(d);
      }
      if (resCustomers && resCustomers.ok) {
        const cd = await resCustomers.json();
        if (cd.customers) setRegisteredCustomers(cd.customers);
      }
      if (resPages && resPages.ok) {
        const pd = await resPages.json();
        if (pd.pages) setStorePages(pd.pages);
      }
      if (resReviews && resReviews.ok) {
        const rd = await resReviews.json();
        if (Array.isArray(rd.reviews)) setReviewsList(rd.reviews);
      }
      setLastSyncTime(new Date().toLocaleTimeString("ar-EG"));
    } catch (err) {
      console.error("Backend fetch error:", err);
      if (!silent) showToast("تعذر الاتصال بالخادم، يرجى المحاولة ثانية.", "error");
    } finally {
      if (!silent) setIsSyncing(false);
    }
  }

  // Handle Login via API
  
  // Perk Action Handlers
  
  // Page Management Handlers
  function openCreatePageModal() {
    setEditingPage(null);
    setPageEditorForm({
      id: "",
      titleAr: "",
      titleEn: "",
      slug: "",
      subtitleAr: "",
      subtitleEn: "",
      contentAr: "<h2>عنوان الفقرة</h2><p>اكتب هنا محتوى وتفاصيل الصفحة...</p>",
      contentEn: "<h2>Section Title</h2><p>Write your page content here...</p>",
      published: true,
      type: "custom",
      route: "",
    });
    setPageEditorTab("edit");
    setPageEditorLang("ar");
    setPageEditorModalOpen(true);
  }

  function openEditPageModal(p: any) {
    setEditingPage(p);
    setPageEditorForm({
      id: p.id,
      titleAr: p.titleAr || "",
      titleEn: p.titleEn || "",
      slug: p.slug || "",
      subtitleAr: p.subtitleAr || "",
      subtitleEn: p.subtitleEn || "",
      contentAr: p.contentAr || "",
      contentEn: p.contentEn || "",
      published: p.published !== false,
      type: p.type || "custom",
      route: p.route || "",
    });
    setPageEditorTab("edit");
    setPageEditorLang("ar");
    setPageEditorModalOpen(true);
  }

  async function handleSaveCustomPage(e: React.FormEvent) {
    e.preventDefault();
    if (!pageEditorForm.titleAr) {
      showToast(adminLang === "ar" ? "يرجى كتابة عنوان الصفحة." : "Please enter page title.", "error");
      return;
    }
    setIsPageSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_page",
          page: pageEditorForm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(adminLang === "ar" ? "تم حفظ وتحديث الصفحة بنجاح ✓" : "Page saved successfully ✓");
        setPageEditorModalOpen(false);
        if (data.pages) setStorePages(data.pages);
      } else {
        showToast(data.error || "تعذر حفظ الصفحة", "error");
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم", "error");
    } finally {
      setIsPageSaving(false);
    }
  }

  async function handleTogglePagePublished(id: string) {
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_published", id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(adminLang === "ar" ? "تم تحديث حالة نشر الصفحة ✓" : "Publication status updated ✓");
        if (data.pages) setStorePages(data.pages);
      }
    } catch {
      showToast("تعذر تحديث حالة النشر", "error");
    }
  }

  async function handleDeletePage(id: string) {
    if (!confirm(adminLang === "ar" ? "هل ترغب في حذف هذه الصفحة نهائياً؟" : "Delete this page permanently?")) return;
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_page", id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(adminLang === "ar" ? "تم حذف الصفحة بنجاح ✓" : "Page deleted successfully ✓");
        if (data.pages) setStorePages(data.pages);
      } else {
        showToast(data.error || "فشل حذف الصفحة", "error");
      }
    } catch {
      showToast("تعذر حذف الصفحة", "error");
    }
  }

  function insertFormatting(tag: string, placeholder: string = "نص هنا") {
    let snippet = "";
    if (tag === "h2") snippet = `\n<h2>${placeholder}</h2>\n`;
    else if (tag === "h3") snippet = `\n<h3>${placeholder}</h3>\n`;
    else if (tag === "b") snippet = `<strong>${placeholder}</strong>`;
    else if (tag === "ul") snippet = `\n<ul>\n  <li>عنصر أول</li>\n  <li>عنصر ثانٍ</li>\n</ul>\n`;
    else if (tag === "quote") snippet = `\n<blockquote>${placeholder}</blockquote>\n`;
    else if (tag === "badge") snippet = `\n<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold font-cairo">✨ ${placeholder}</div>\n`;

    if (pageEditorLang === "ar") {
      setPageEditorForm(prev => ({ ...prev, contentAr: (prev.contentAr || "") + snippet }));
    } else {
      setPageEditorForm(prev => ({ ...prev, contentEn: (prev.contentEn || "") + snippet }));
    }
  }

  async function handleAssignPerkCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!perkCouponForm.code || !perkCouponForm.discountValue) {
      showToast(adminLang === "ar" ? "يرجى إدخال كود الخصم وقيمة الخصم." : "Please provide code and discount value.", "error");
      return;
    }
    setIsPerkSubmitting(true);
    try {
      const res = await fetch("/api/customers/perks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "assign_coupon",
          customerId: selectedPerkCustomerId,
          coupon: perkCouponForm,
          autoNotify: perkCouponForm.autoNotify,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || (adminLang === "ar" ? "تم تخصيص الكوبون للعميل بنجاح ✓" : "Coupon assigned successfully ✓"));
        setAssignPerkModalOpen(false);
        setPerkCouponForm({
          code: "",
          titleAr: "خصم خاص لعملاء VIP",
          titleEn: "Special VIP Customer Discount",
          descAr: "كوبون مخصص لحسابكِ تقديراً لثقتكِ واختياركِ الدائم لمستحضرات سُـلاف.",
          descEn: "Personalized discount assigned exclusively to your account.",
          discountType: "PERCENTAGE",
          discountValue: 20,
          minOrderAmount: 0,
          expiryDate: "2026-12-31",
          autoNotify: true,
        });
        loadLiveBackendData(true);
      } else {
        showToast(data.error || (adminLang === "ar" ? "تعذر تخصيص الكوبون" : "Failed to assign coupon"), "error");
      }
    } catch {
      showToast(adminLang === "ar" ? "خطأ في الاتصال بالخادم" : "Server connection error", "error");
    } finally {
      setIsPerkSubmitting(false);
    }
  }

  async function handleSendPerkNotification(e: React.FormEvent) {
    e.preventDefault();
    if (!perkNotifForm.titleAr || !perkNotifForm.messageAr) {
      showToast(adminLang === "ar" ? "يرجى كتابة عنوان ورسالة الإشعار." : "Please provide notification title and message.", "error");
      return;
    }
    setIsPerkSubmitting(true);
    try {
      const res = await fetch("/api/customers/perks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_notification",
          customerId: selectedPerkCustomerId,
          notification: perkNotifForm,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || (adminLang === "ar" ? "تم إرسال الإشعار والبنر الترحيبي بنجاح ✓" : "Notification sent successfully ✓"));
        setSendPerkNotifModalOpen(false);
        setPerkNotifForm({
          titleAr: "🎉 هدية خاصة واستثنائية من إدارة سُـلاف",
          titleEn: "Special Exclusive Gift from Sulaf Management",
          messageAr: "يسعدنا تقديم كود خصم خاص لحسابكِ للاستفادة منه عند طلبكِ القادم!",
          messageEn: "We are thrilled to offer you a personalized VIP discount on your next purchase!",
          couponCode: "",
          type: "gift",
        });
        loadLiveBackendData(true);
      } else {
        showToast(data.error || (adminLang === "ar" ? "تعذر إرسال الإشعار" : "Failed to send notification"), "error");
      }
    } catch {
      showToast(adminLang === "ar" ? "خطأ في الاتصال بالخادم" : "Server connection error", "error");
    } finally {
      setIsPerkSubmitting(false);
    }
  }

  async function handleDeletePerkCoupon(customerId: string, couponId: string) {
    if (!confirm(adminLang === "ar" ? "هل ترغب في حذف هذا الكوبون المخصص من حساب العميل؟" : "Delete this custom coupon?")) return;
    try {
      const res = await fetch("/api/customers/perks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_coupon", customerId, couponId }),
      });
      if (res.ok) {
        showToast(adminLang === "ar" ? "تم حذف الكوبون المخصص بنجاح" : "Custom coupon deleted");
        loadLiveBackendData(true);
      }
    } catch {
      showToast(adminLang === "ar" ? "تعذر حذف الكوبون" : "Failed to delete coupon", "error");
    }
  }

  async function handleDeletePerkNotification(customerId: string, notificationId: string) {
    if (!confirm(adminLang === "ar" ? "هل ترغب في حذف هذا الإشعار من حساب العميل؟" : "Delete this notification?")) return;
    try {
      const res = await fetch("/api/customers/perks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_notification", customerId, notificationId }),
      });
      if (res.ok) {
        showToast(adminLang === "ar" ? "تم حذف الإشعار بنجاح" : "Notification deleted");
        loadLiveBackendData(true);
      }
    } catch {
      showToast(adminLang === "ar" ? "تعذر حذف الإشعار" : "Failed to delete notification", "error");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("sulaf_admin_auth", "true");
        loadLiveBackendData();
        showToast("مرحباً بك في لوحة تحكم سلاف!");
      } else {
        setLoginError(data.error || "اسم المستخدم أو كلمة المرور غير صحيحة.");
      }
    } catch {
      // Fallback
      if (username === "admin" && password === "sulaf2026") {
        setIsAuthenticated(true);
        localStorage.setItem("sulaf_admin_auth", "true");
        loadLiveBackendData();
      } else {
        setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem("sulaf_admin_auth");
    showToast("تم تسجيل الخروج بنجاح.");
  }

  async function handleChangeAdminPassword(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    const currentPass = passwordForm.currentPassword.trim();
    const newPass = passwordForm.newPassword.trim();
    const confirmPass = passwordForm.confirmPassword.trim();
    const newUsr = passwordForm.newUsername.trim();

    if (!currentPass) {
      setPasswordError(adminLang === "ar" ? "يرجى إدخال كلمة المرور الحالية." : "Please enter your current password.");
      return;
    }

    if (!newPass) {
      setPasswordError(adminLang === "ar" ? "يرجى إدخال كلمة المرور الجديدة." : "Please enter a new password.");
      return;
    }

    if (newPass.length < 6) {
      setPasswordError(adminLang === "ar" ? "يجب ألا تقل كلمة المرور الجديدة عن 6 خانات." : "New password must be at least 6 characters.");
      return;
    }

    if (newPass !== confirmPass) {
      setPasswordError(adminLang === "ar" ? "كلمة المرور الجديدة وتأكيدها غير متطابقين." : "New password and confirmation do not match.");
      return;
    }

    setIsSubmittingPassword(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
          confirmPassword: confirmPass,
          newUsername: newUsr || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess(data.message || (adminLang === "ar" ? "تم تغيير كلمة المرور بنجاح!" : "Password updated successfully!"));
        showToast(adminLang === "ar" ? "✨ تم تغيير كلمة مرور المدير بنجاح!" : "Admin password updated successfully!", "success");

        if (data.admin?.username) {
          updateSettings({
            admin: {
              username: data.admin.username,
              password: newPass,
            },
          });
        }

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          newUsername: data.admin?.username || newUsr,
        });

        setTimeout(() => {
          setChangePasswordModalOpen(false);
          setPasswordSuccess(null);
        }, 1800);
      } else {
        setPasswordError(data.error || (adminLang === "ar" ? "فشل تغيير كلمة المرور." : "Failed to change password."));
        showToast(data.error || "فشل تغيير كلمة المرور", "error");
      }
    } catch (err: any) {
      setPasswordError(err.message || (adminLang === "ar" ? "حدث خطأ في الاتصال بالخادم." : "Network error."));
      showToast("حدث خطأ في الاتصال بالخادم", "error");
    } finally {
      setIsSubmittingPassword(false);
    }
  }

  // ----------------------------------------------------------------
  // Order Operations (Real Backend API)
  // ----------------------------------------------------------------
  async function handleUpdateOrderStatus(orderId: string, newStatus: OrderRecord["orderStatus"]) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        showToast(`تم تحديث حالة الطلب إلى ${getStatusLabel(newStatus)}`);
        loadLiveBackendData(true);
      } else {
        showToast("فشل تحديث حالة الطلب على الخادم.", "error");
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم.", "error");
    }
  }

  async function handleVerifyReceipt(order: OrderRecord) {
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: order.isDepositMode ? "DEPOSIT_PAID" : "FULLY_PAID",
          orderStatus: "PROCESSING",
          receiptVerifiedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        showToast("تم اعتماد إيصال التحويل وتأكيد الدفع بنجاح ✓");
        setReceiptModalUrl(null);
        setReceiptModalOrder(null);
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل اعتماد الإيصال.", "error");
    }
  }

  async function handleSaveOrderNotes(orderId: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: tempNotes }),
      });
      if (res.ok) {
        showToast("تم حفظ ملاحظات الطلب بنجاح.");
        setOrderNotesModal(null);
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل حفظ الملاحظات.", "error");
    }
  }

  async function handleDeleteOrder(orderId: string) {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً من السجلات؟")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم حذف الطلب بنجاح.");
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل حذف الطلب.", "error");
    }
  }

  // ----------------------------------------------------------------
  // Product Operations (Real Backend API)
  // ----------------------------------------------------------------
  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!productForm.nameAr || Number(productForm.price) <= 0) {
      showToast("يرجى إدخال اسم المستحضر وسعره بشكل صحيح.", "error");
      return;
    }

    try {
      if (editingProduct) {
        // Update product via PATCH
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameAr: productForm.nameAr,
            nameEn: productForm.nameEn || productForm.nameAr,
            subtitleAr: productForm.subtitleAr,
            subtitleEn: productForm.subtitleEn,
            price: Number(productForm.price),
            compareAtPrice: Number(productForm.compareAtPrice) || 0,
            stock: Number(productForm.stock),
            sku: productForm.sku || editingProduct.sku,
            badgeAr: productForm.badgeAr || undefined,
            descriptionAr: productForm.descriptionAr,
            descriptionEn: productForm.descriptionEn,
            usageInstructionsAr: productForm.usageInstructionsAr,
            usageInstructionsEn: productForm.usageInstructionsEn,
            imageUrl:
              productForm.images.find((img) => img.isPrimary)?.url ||
              productForm.images[0]?.url ||
              productForm.imageUrl ||
              "/brand/sulaf-flower-symbol.png",
            images:
              productForm.images.length > 0
                ? productForm.images
                : [
                    {
                      url: productForm.imageUrl || "/brand/sulaf-flower-symbol.png",
                      alt: productForm.nameAr,
                      isPrimary: true,
                    },
                  ],
            isFeatured: productForm.isFeatured,
            pageBuilder: productForm.pageBuilder,
          }),
        });
        if (res.ok) {
          if (productForm.isFeatured) {
            updateSettings({ featuredProductId: editingProduct.id });
          }
          showToast("تم تحديث بيانات المستحضر بنجاح على الخادم.");
        }
      } else {
        // Add product via POST
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nameAr: productForm.nameAr,
            nameEn: productForm.nameEn || productForm.nameAr,
            subtitleAr: productForm.subtitleAr || "مستحضر علاجي متقدم",
            subtitleEn: productForm.subtitleEn || "Advanced clinical treatment",
            descriptionAr: productForm.descriptionAr || "تركيبة صيدلانية متطورة لترميم حاجز البشرة.",
            descriptionEn: productForm.descriptionEn || "Advanced dermatological formula restoring skin barrier.",
            usageInstructionsAr: productForm.usageInstructionsAr || "",
            usageInstructionsEn: productForm.usageInstructionsEn || "",
            price: Number(productForm.price),
            compareAtPrice: Number(productForm.compareAtPrice) || 0,
            stock: Number(productForm.stock),
            sku: productForm.sku || `SLF-${Math.floor(100 + Math.random() * 900)}`,
            badgeAr: productForm.badgeAr || undefined,
            imageUrl:
              productForm.images.find((img) => img.isPrimary)?.url ||
              productForm.images[0]?.url ||
              productForm.imageUrl ||
              "/brand/sulaf-flower-symbol.png",
            images:
              productForm.images.length > 0
                ? productForm.images
                : [
                    {
                      url: productForm.imageUrl || "/brand/sulaf-flower-symbol.png",
                      alt: productForm.nameAr,
                      isPrimary: true,
                    },
                  ],
            isFeatured: productForm.isFeatured,
            pageBuilder: productForm.pageBuilder,
          }),
        });
        if (res.ok) {
          const newD = await res.json();
          if (productForm.isFeatured && newD.product?.id) {
            updateSettings({ featuredProductId: newD.product.id });
          }
          showToast("تمت إضافة المستحضر الجديد بنجاح إلى قاعدة البيانات.");
        }
      }

      setProductModalOpen(false);
      setEditingProduct(null);
      loadLiveBackendData(true);
    } catch {
      showToast("حدث خطأ أثناء حفظ المستحضر.", "error");
    }
  }

  async function handleQuickStockDelta(id: string, delta: number) {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stockDelta: delta }),
      });
      if (res.ok) {
        showToast(`تم تعديل المخزون بنجاح (${delta > 0 ? "+" + delta : delta})`);
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل تحديث المخزون.", "error");
    }
  }

  async function handleSaveInlineStock(id: string) {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: Number(tempStockValue) }),
      });
      if (res.ok) {
        showToast("تم تعيين كمية المخزون بنجاح.");
        setEditingStockId(null);
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل تحديث المخزون.", "error");
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المستحضر نهائياً من المتجر؟")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم حذف المستحضر بنجاح.");
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل حذف المستحضر.", "error");
    }
  }

  // ----------------------------------------------------------------
  // Coupon Operations (Real Backend API)
  // ----------------------------------------------------------------
  async function handleSaveCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!couponForm.code || Number(couponForm.discountValue) <= 0) {
      showToast("يرجى إدخال كود الكوبون وقيمة الخصم بشكل صحيح.", "error");
      return;
    }

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponForm.code,
          discountType: couponForm.discountType,
          discountValue: Number(couponForm.discountValue),
          minOrderAmount: Number(couponForm.minOrderAmount) || 0,
          maxUsageCount: Number(couponForm.maxUsageCount) || 500,
          expiryDate: couponForm.expiryDate,
          notes: couponForm.notes,
        }),
      });

      const d = await res.json();
      if (res.ok && d.success) {
        showToast(`تم إنشاء كود الخصم ${couponForm.code.toUpperCase()} بنجاح!`);
        setCouponModalOpen(false);
        setCouponForm({
          code: "",
          discountType: "PERCENTAGE",
          discountValue: 10,
          minOrderAmount: 300,
          maxUsageCount: 200,
          expiryDate: "2026-12-31",
          notes: "",
        });
        loadLiveBackendData(true);
      } else {
        showToast(d.error || "فشل إنشاء الكوبون.", "error");
      }
    } catch {
      showToast("خطأ في الاتصال بالخادم.", "error");
    }
  }

  async function handleToggleCoupon(id: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        showToast(!currentStatus ? "تم تفعيل الكوبون بنجاح" : "تم تعطيل الكوبون");
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل تحديث حالة الكوبون.", "error");
    }
  }

  async function handleDeleteCoupon(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الكوبون نهائياً؟")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم حذف الكوبون بنجاح.");
        loadLiveBackendData(true);
      }
    } catch {
      showToast("فشل حذف الكوبون.", "error");
    }
  }

  // ----------------------------------------------------------------
  // Settings & Paymob Diagnostics
  // ----------------------------------------------------------------
  
  function handleAddCustomGovernorate() {
    if (!newGovName) return;
    if (settingsForm.customGovernorateRates.some((r) => r.governorate === newGovName)) {
      showToast("هذه المحافظة مستثناة بالفعل في القائمة أدناه", "error");
      return;
    }
    const updated: CustomGovernorateShippingRate[] = [
      ...settingsForm.customGovernorateRates,
      { governorate: newGovName, rate: Number(newGovFee) || 0, shippingFee: Number(newGovFee) || 0 },
    ];
    setSettingsForm({ ...settingsForm, customGovernorateRates: updated });
    const available = ALL_EGYPT_GOVERNORATES.filter((g) => !updated.some((r) => r.governorate === g));
    if (available.length > 0) {
      setNewGovName(available[0]);
    }
    showToast(`تمت إضافة استثناء لمحافظة ${newGovName} بقيمة ${newGovFee} ج`);
  }

  function handleRemoveCustomGovernorate(govName: string) {
    const updated = settingsForm.customGovernorateRates.filter((r) => r.governorate !== govName);
    setSettingsForm({ ...settingsForm, customGovernorateRates: updated });
    showToast(`تمت إزالة الاستثناء لمحافظة ${govName} والعودة للسعر الموحد`);
  }

  function handleUpdateCustomGovernorateFee(govName: string, fee: number) {
    const updated: CustomGovernorateShippingRate[] = settingsForm.customGovernorateRates.map((r) =>
      r.governorate === govName ? { ...r, rate: fee, shippingFee: fee } : r
    );
    setSettingsForm({ ...settingsForm, customGovernorateRates: updated });
  }

  
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateSettings({
        payment: {
          ...settings.payment,
          instapayHandle: settingsForm.instapay,
          vodafoneCash: settingsForm.vodafone,
          depositAmount: Number(settingsForm.depositAmount),
        },
        shipping: {
          ...settings.shipping,
          cairoGiza: Number(settingsForm.shippingFeeCairo),
          alexDelta: Number(settingsForm.shippingFeeGov),
          freeShippingThreshold: Number(settingsForm.freeThreshold),
          defaultUnifiedRate: Number(settingsForm.shippingUnifiedRate),
          activeProvider: settingsForm.shippingActiveProvider,
          providers: settingsForm.shippingProviders,
          customGovernorateRates: settingsForm.customGovernorateRates,
        },
        multiProductPromo: {
          enabled: settingsForm.multiPromoEnabled,
          minQuantity: Number(settingsForm.multiPromoMinQty),
          discountType: settingsForm.multiPromoDiscountType,
          discountValue: Number(settingsForm.multiPromoDiscountValue),
          freeShippingEnabled: settingsForm.multiPromoFreeShipping,
        },
        checkoutFields: {
          showBirthdate: settingsForm.showBirthdateField,
          showClosePerson: settingsForm.showClosePersonField,
        },
        contacts: {
          ...settings.contacts,
          whatsapp: settingsForm.whatsapp,
        },
        paymob: {
          ...settings.paymob,
          enabled: settingsForm.paymobEnabled,
          isSandbox: settingsForm.paymobSandbox,
          apiKey: settingsForm.paymobApiKey,
          secretKey: settingsForm.paymobSecretKey,
          cardIntegrationId: settingsForm.paymobCardId,
          walletIntegrationId: settingsForm.paymobWalletId,
          hmacSecret: settingsForm.paymobHmac,
        },
        gatewaysMode: settingsForm.gatewaysMode,
        sha7nawy: {
          enabled: settingsForm.sha7nawyEnabled,
          isSandbox: settingsForm.sha7nawySandbox,
          baseUrl: settingsForm.sha7nawyBaseUrl,
          publicKey: settingsForm.sha7nawyPublicKey,
          secretKey: settingsForm.sha7nawySecretKey,
          appName: settingsForm.sha7nawyAppName,
          webhookUrl: "/api/webhooks/sha7nawy",
        },
      });
      showToast("تم حفظ كافة إعدادات المتجر وبوابات الدفع بنجاح ✓");
    } catch {
      showToast("فشل حفظ الإعدادات.", "error");
    }
  }

  async function handleTestShippingConnection(provider: ShippingProviderConfig) {
    setShippingTestLoading(true);
    setShippingTestResult(null);
    try {
      const res = await fetch("/api/shipping/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      setShippingTestResult(data);
      if (data.success) {
        showToast(adminLang === "ar" ? data.messageAr : data.messageEn);
      } else {
        showToast(adminLang === "ar" ? data.messageAr : data.messageEn, "error");
      }
    } catch {
      showToast(adminLang === "ar" ? "فشل الاتصال بخادم الشحن." : "Failed to connect to shipping carrier API.", "error");
    } finally {
      setShippingTestLoading(false);
    }
  }

  async function handleTestSha7nawyConnection() {
    setSha7nawyTestLoading(true);
    setSha7nawyTestResult(null);
    try {
      const res = await fetch("/api/payments/sha7nawy/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: settingsForm.sha7nawyPublicKey,
          secretKey: settingsForm.sha7nawySecretKey,
          baseUrl: settingsForm.sha7nawyBaseUrl,
        }),
      });
      const data = await res.json();
      setSha7nawyTestResult(data);
      if (data.success) {
        showToast("تم فحص والتحقق من اتصال بوابة شحناوي للمحافظ بنجاح! 🟢");
      } else {
        showToast(data.error || "فشل الاتصال ببوابة شحناوي.", "error");
      }
    } catch {
      showToast("حدث خطأ في الاتصال بالخادم.", "error");
    } finally {
      setSha7nawyTestLoading(false);
    }
  }

  async function handleTestPaymobConnection() {
    setPaymobTestLoading(true);
    setPaymobTestResult(null);
    try {
      const res = await fetch("/api/paymob/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: settingsForm.paymobApiKey,
          secretKey: settingsForm.paymobSecretKey,
          cardIntegrationId: settingsForm.paymobCardId,
          walletIntegrationId: settingsForm.paymobWalletId,
          hmacSecret: settingsForm.paymobHmac,
          isSandbox: settingsForm.paymobSandbox,
        }),
      });
      const data = await res.json();
      setPaymobTestResult(data);
      if (data.success) {
        showToast("تم التحقق بنجاح من اتصال بوابة Paymob!");
      } else {
        showToast(data.error || "فشل الاتصال ببوابة الدفع.", "error");
      }
    } catch {
      showToast("حدث خطأ في الاتصال بالخادم.", "error");
    } finally {
      setPaymobTestLoading(false);
    }
  }

  // ----------------------------------------------------------------
  // Customer CRM Aggregation
  // ----------------------------------------------------------------
  const customersList = useMemo(() => {
    const map = new Map<string, {
      name: string;
      phone: string;
      governorate: string;
      city: string;
      ordersCount: number;
      totalSpent: number;
      lastOrderDate: string;
    }>();

    for (const o of orders) {
      const key = o.customerPhone || o.customerName;
      if (!map.has(key)) {
        map.set(key, {
          name: o.customerName,
          phone: o.customerPhone,
          governorate: o.governorate,
          city: o.city,
          ordersCount: 1,
          totalSpent: o.total || 0,
          lastOrderDate: o.createdAt,
        });
      } else {
        const existing = map.get(key)!;
        existing.ordersCount += 1;
        existing.totalSpent += o.total || 0;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
      }
    }

    let list = Array.from(map.values());
    if (customerSearch) {
      const q = customerSearch.toLowerCase().trim();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.governorate.includes(q)
      );
    }
    return list.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders, customerSearch]);

  // ----------------------------------------------------------------
  // Filtered Orders & Products
  // ----------------------------------------------------------------
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesFilter = orderFilter === "ALL" || o.orderStatus === orderFilter;
      const q = orderSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.governorate.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [orders, orderFilter, orderSearch]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      let matchesFilter = true;
      if (productFilter === "LOW_STOCK") matchesFilter = p.stock > 0 && p.stock < 10;
      else if (productFilter === "OUT_OF_STOCK") matchesFilter = p.stock === 0;
      else if (productFilter === "IN_STOCK") matchesFilter = p.stock >= 10;

      const q = productSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [products, productFilter, productSearch]);

  // ----------------------------------------------------------------
  // CSV Data Exports
  // ----------------------------------------------------------------
  function exportOrdersCsv() {
    const headers = [
      "رقم الطلب",
      "اسم العميل",
      "رقم الهاتف",
      "المحافظة",
      "المدينة",
      "إجمالي المبلغ",
      "طريقة الدفع",
      "حالة الدفع",
      "حالة الطلب",
      "تاريخ الطلب",
    ];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerPhone,
      o.governorate,
      o.city,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
      o.createdAt.substring(0, 10),
    ]);
    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sulaf_orders_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تنزيل ملف إكسل بكافة الطلبات بنجاح!");
  }

  function exportCustomersCsv() {
    const headers = ["اسم العميل", "رقم الهاتف", "المحافظة", "المدينة", "عدد الطلبات", "إجمالي الإنفاق (ج.م)", "آخر طلب"];
    const rows = customersList.map((c) => [
      `"${c.name}"`,
      c.phone,
      c.governorate,
      c.city,
      c.ordersCount,
      c.totalSpent,
      c.lastOrderDate.substring(0, 10),
    ]);
    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sulaf_customers_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("تم تنزيل ملف إكسل بقائمة العملاء بنجاح!");
  }

  // ----------------------------------------------------------------
  // Helper UI Helpers
  // ----------------------------------------------------------------
  function getStatusLabel(status: OrderRecord["orderStatus"]): string {
    switch (status) {
      case "PENDING_CONFIRMATION":
        return "قيد المراجعة";
      case "PROCESSING":
        return "قيد التجهيز";
      case "SHIPPED":
        return "تم الشحن";
      case "DELIVERED":
        return "تم التوصيل";
      case "CANCELLED":
        return "ملغي";
      default:
        return status;
    }
  }

  function getStatusBadge(status: OrderRecord["orderStatus"]) {
    switch (status) {
      case "PENDING_CONFIRMATION":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">{ADMIN_I18N[adminLang].status.PENDING_CONFIRMATION}</span>;
      case "PROCESSING":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">{ADMIN_I18N[adminLang].status.PROCESSING}</span>;
      case "SHIPPED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">{ADMIN_I18N[adminLang].status.SHIPPED}</span>;
      case "DELIVERED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">{ADMIN_I18N[adminLang].status.DELIVERED}</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">{ADMIN_I18N[adminLang].status.CANCELLED}</span>;
      default:
        return null;
    }
  }

  function getPaymentBadge(status: OrderRecord["paymentStatus"], method: OrderRecord["paymentMethod"]) {
    if (status === "FULLY_PAID") {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">{ADMIN_I18N[adminLang].payment.FULLY_PAID}</span>;
    }
    if (status === "DEPOSIT_PAID") {
      return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">{ADMIN_I18N[adminLang].payment.DEPOSIT_PAID}</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800">{ADMIN_I18N[adminLang].payment.UNPAID}</span>;
  }

  // Smart WhatsApp Message Dispatchers
  function openWhatsAppConfirmOrder(order: OrderRecord) {
    const itemsList = order.items.map((i) => `- ${i.productName} (${i.quantity} قطعة)`).join("\n");
    const msg = encodeURIComponent(
      `مرحباً أ/ ${order.customerName}،\n` +
      `سعداء باختيارك براند سلاف للجمال الأندلسي والطب السريري 🌿\n\n` +
      `تم تأكيد استلام طلبك رقم (${order.orderNumber}) وجاري تجهيزه بالمختبر الآن:\n` +
      `${itemsList}\n\n` +
      `إجمالي الطلب: ${order.total} ج.م\n` +
      `المسدد: ${order.isDepositMode ? order.depositAmount + " ج.م (عربون)" : order.total + " ج.م"}\n` +
      `المتبقي عند الاستلام: ${order.remainingCodAmount} ج.م\n\n` +
      `عنوان التوصيل: ${order.governorate} - ${order.city} - ${order.street}\n` +
      `سنقوم بإشعارك فور خروج الشحنة مع المندوب. دمتم بجمال وصحة.`
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  }

  function openWhatsAppDispatchShipment(order: OrderRecord) {
    const tracking = order.stoxTrackingNumber || "STX-EG-" + Math.floor(100000 + Math.random() * 900000);
    const msg = encodeURIComponent(
      `مرحباً أ/ ${order.customerName}،\n` +
      `بشرى سارة! تم تسليم طلبك رقم (${order.orderNumber}) لشركة الشحن والتوصيل 🚚\n\n` +
      `كود بوليصة التتبع: ${tracking}\n` +
      `المبلغ المطلوب سداده للمندوب: ${order.remainingCodAmount} ج.م\n\n` +
      `يمكنك متابعة خط سير المندوب لحظة بلحظة عبر الرابط التالي:\n` +
      `http://localhost:7777/track?id=${order.orderNumber}\n\n` +
      `شكراً لثقتك في سلاف.`
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
  }

  // ----------------------------------------------------------------
  // Render: Login Screen (If not authenticated)
  // ----------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#11190d] flex items-center justify-center p-4 font-cairo relative" dir={adminLang === "ar" ? "rtl" : "ltr"}>
        {/* Language switch on login screen */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleAdminLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f6f9e6] text-xs font-bold transition-all border border-white/20 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{ADMIN_I18N[adminLang].header.langBtn}</span>
          </button>
        </div>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-[#e2e8c0]">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center bg-[#f6f9e6] rounded-2xl border border-[#dbe2bd] shadow-inner">
              <Image
                src="/brand/sulaf-flower-symbol.png"
                alt="شعار سلاف"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="font-amiri text-3xl font-black text-[#1c2616]">
              {ADMIN_I18N[adminLang].login.title}
            </h1>
            <p className="text-sm font-semibold text-[#485c36] mt-1">
              {ADMIN_I18N[adminLang].login.subtitle}
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">{ADMIN_I18N[adminLang].login.userLabel}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#3d502d] focus:outline-none text-base font-semibold text-gray-900 bg-gray-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">{ADMIN_I18N[adminLang].login.passLabel}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#3d502d] focus:outline-none text-base font-semibold text-gray-900 bg-gray-50/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-[#3d502d] hover:bg-[#2e3d22] text-[#f6f9e6] font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isLoggingIn ? ADMIN_I18N[adminLang].login.submitting : ADMIN_I18N[adminLang].login.submit}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs font-semibold text-gray-500">
              بيانات الدخول التجريبية الافتراضية: <span className="font-bold text-[#3d502d]">admin</span> / <span className="font-bold text-[#3d502d]">sulaf2026</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // Render: Full Dedicated Admin Portal
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f1f4e3] flex flex-col font-cairo text-[#1c2616] w-full max-w-full overflow-x-hidden" dir={adminLang === "ar" ? "rtl" : "ltr"}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-bold text-sm transition-all transform animate-bounce ${
            toastMessage.type === "success" ? "bg-emerald-700 border-2 border-emerald-400" : "bg-rose-700 border-2 border-rose-400"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Bar for Admin */}
      <header className="bg-white border-b border-[#dbe2bd] shadow-sm sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex items-center justify-center bg-[#f6f9e6] rounded-xl border border-[#dbe2bd]">
              <Image src="/brand/sulaf-flower-symbol.png" alt="Sulaf" width={28} height={28} className="object-contain" />
            </div>
            <div>
              <h1 className="font-amiri text-xl font-black text-[#1c2616] leading-none">
                {ADMIN_I18N[adminLang].header.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {ADMIN_I18N[adminLang].header.liveDb}
                </span>
                {lastSyncTime && (
                  <span className="text-[11px] font-medium text-gray-500">
                    {ADMIN_I18N[adminLang].header.lastSync} {lastSyncTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={toggleAdminLang}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#485c36]/10 hover:bg-[#485c36]/20 text-[#485c36] font-bold text-xs transition-colors border border-[#485c36]/20 cursor-pointer"
            title={adminLang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          >
            <Globe className="w-4 h-4 text-[#485c36]" />
            <span className="font-bold">{ADMIN_I18N[adminLang].header.langBtn}</span>
          </button>
          <button
            onClick={() => loadLiveBackendData(false)}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition-colors"
            title="تحديث البيانات لحظياً من الخادم"
          >
            <RefreshCw className={`w-4 h-4 text-[#3d502d] ${isSyncing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isSyncing ? ADMIN_I18N[adminLang].header.syncing : ADMIN_I18N[adminLang].header.syncBtn}</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e8ecd0] hover:bg-[#dbe2bd] text-[#233019] font-bold text-xs transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">{ADMIN_I18N[adminLang].header.preview}</span>
          </Link>

          <button
            onClick={() => {
              setPasswordError(null);
              setPasswordSuccess(null);
              setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
                newUsername: settings?.admin?.username || "admin",
              });
              setChangePasswordModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
            title={adminLang === "ar" ? "تغيير كلمة مرور المدير" : "Change Admin Password"}
          >
            <KeyRound className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">{adminLang === "ar" ? "تغيير كلمة المرور" : "Change Password"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{ADMIN_I18N[adminLang].header.logout}</span>
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full min-w-0 overflow-x-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 bg-[#162112] text-white p-3 sm:p-5 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-e border-[#28381e] select-none">
          <nav className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 md:gap-0 md:space-y-1.5 pb-2 md:pb-0 scrollbar-none">
            <div className="hidden md:block px-3 py-2 text-xs font-black text-emerald-400 tracking-wider">
              {ADMIN_I18N[adminLang].navSection}
            </div>

            {/* 1. Overview */}
            <button
              onClick={() => setActiveTab("overview")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <BarChart3 className="w-4 h-4 shrink-0 text-emerald-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.overview}</span>
              </div>
            </button>

            {/* 2. Orders */}
            <button
              onClick={() => setActiveTab("orders")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShoppingBag className="w-4 h-4 shrink-0 text-emerald-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.orders}</span>
              </div>
              <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black">
                {orders.length}
              </span>
            </button>

            {/* 3. Products */}
            <button
              onClick={() => setActiveTab("products")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "products"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Package className="w-4 h-4 shrink-0 text-emerald-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.products}</span>
              </div>
              <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                {products.length}
              </span>
            </button>

            {/* 3.5 Reviews & Customer Feedback */}
            <button
              onClick={() => setActiveTab("reviews")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Star className="w-4 h-4 shrink-0 text-amber-300 fill-amber-300/30" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.reviews || (adminLang === "ar" ? "تقييمات وآراء العملاء" : "Reviews")}</span>
              </div>
              {reviewsList.filter((r) => r.status === "PENDING").length > 0 ? (
                <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-black animate-pulse">
                  {reviewsList.filter((r) => r.status === "PENDING").length} معلق
                </span>
              ) : (
                <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#485c36] text-white">
                  {reviewsList.length}
                </span>
              )}
            </button>

            {/* 4. Coupons */}
            <button
              onClick={() => setActiveTab("coupons")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "coupons"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Ticket className="w-4 h-4 shrink-0 text-emerald-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.coupons}</span>
              </div>
              <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#485c36] text-white">
                {coupons.length}
              </span>
            </button>

            {/* 5.5 Customer Perks VIP */}
            <button
              onClick={() => setActiveTab("customers")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "customers"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Gift className="w-4 h-4 shrink-0 text-amber-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.customers}</span>
              </div>
              <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-xs">
                VIP
              </span>
            </button>

            {/* 6.5 Pages Management (تعديل صفحات الموقع) */}
            <button
              onClick={() => setActiveTab("pages")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "pages"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 shrink-0 text-amber-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.pages || (adminLang === "ar" ? "تعديل صفحات الموقع" : "Site Pages")}</span>
              </div>
              <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#485c36] text-white">
                {storePages.length}
              </span>
            </button>

            {/* 7. CMS (Content & Sections) */}
            <button
              onClick={() => setActiveTab("cms")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "cms"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sliders className="w-4 h-4 shrink-0 text-emerald-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.cms}</span>
              </div>
              <span className="shrink-0 ms-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-emerald-100">
                CMS
              </span>
            </button>

            {/* 8. Settings */}
            <button
              onClick={() => setActiveTab("settings")}
              className={`shrink-0 md:w-full flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl font-bold text-xs lg:text-sm transition-all overflow-hidden cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#3d502d] text-white shadow-md ring-2 ring-emerald-400/40"
                  : "text-gray-300 hover:bg-[#233019] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Settings className="w-4 h-4 shrink-0 text-emerald-300" />
                <span className="truncate">{ADMIN_I18N[adminLang].tabs.settings}</span>
              </div>
            </button>
          </nav>

          {/* Quick Support Card */}
          <div className="hidden md:block mt-6 p-4 rounded-2xl bg-[#233019] border border-[#3d502d] text-xs">
            <div className="font-bold text-emerald-300 mb-1">
              {adminLang === "ar" ? "منظومة سُلاف السريرية" : "Sulaf Clinical System"}
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed mb-2">
              {adminLang === "ar"
                ? "لوحة تحكم إدارية فورية للطلبات والمخزون والمحتوى."
                : "Central portal for orders, inventory, and storefront content."}
            </p>
            <div className="text-[10px] text-gray-400 font-mono">v2.6 • Active</div>
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & KEY PERFORMANCE INDICATORS              */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Top Banner Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-600">{ADMIN_I18N[adminLang].overview.totalSales}</span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#1c2616]">
                    {analytics?.summary?.grossRevenue ?? orders.reduce((sum, o) => sum + (o.total || 0), 0)} <span className="text-base font-bold text-gray-600">ج.م</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-800 mt-2 flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{ADMIN_I18N[adminLang].overview.salesVerified}</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-600">{ADMIN_I18N[adminLang].overview.collectedRevenue}</span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#1c2616]">
                    {analytics?.summary?.collectedRevenue ?? orders.reduce((sum, o) => sum + (o.paymentStatus === "FULLY_PAID" ? o.total : o.depositAmount || 0), 0)} <span className="text-base font-bold text-gray-600">ج.م</span>
                  </div>
                  <div className="text-xs font-bold text-blue-800 mt-2">
                    {ADMIN_I18N[adminLang].overview.collectedDesc}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-600">{ADMIN_I18N[adminLang].overview.pendingCod}</span>
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#1c2616]">
                    {analytics?.summary?.pendingCodRevenue ?? orders.reduce((sum, o) => sum + (o.remainingCodAmount || 0), 0)} <span className="text-base font-bold text-gray-600">ج.م</span>
                  </div>
                  <div className="text-xs font-bold text-amber-800 mt-2">
                    {ADMIN_I18N[adminLang].overview.pendingCodDesc}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-gray-600">{ADMIN_I18N[adminLang].overview.totalOrders}</span>
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#1c2616]">
                    {orders.length} <span className="text-base font-bold text-gray-600">طلب</span>
                  </div>
                  <div className="text-xs font-bold text-purple-800 mt-2">
                    {ADMIN_I18N[adminLang].overview.aov} {analytics?.summary?.aov || 0} {ADMIN_I18N[adminLang].currency}
                  </div>
                </div>
              </div>

              {/* Pending Reviews Urgent Alert in Overview */}
              {reviewsList.filter((r) => r.status === "PENDING").length > 0 && (
                <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                      <Star className="w-6 h-6 fill-amber-600 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-black text-base font-cairo">
                        {adminLang === "ar" ? "تنبيه: آراء وتقييمات جديدة من العملاء بانتظار الاعتماد!" : "New customer reviews pending approval!"}
                      </div>
                      <div className="text-xs font-semibold text-amber-800 font-cairo mt-0.5">
                        {adminLang === "ar"
                          ? `هناك ${reviewsList.filter((r) => r.status === "PENDING").length} فيدباك وارد بحاجة لاعتمادك قبل ظهوره في المتجر.`
                          : `${reviewsList.filter((r) => r.status === "PENDING").length} feedback pending your approval before publishing.`}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="px-5 py-2.5 rounded-xl bg-[#3d502d] text-white font-bold text-xs hover:bg-[#2b3a1f] transition-all cursor-pointer shadow-sm shrink-0 font-cairo flex items-center gap-1.5"
                  >
                    <span>{adminLang === "ar" ? "فحص واعتماد التقييمات الآن ←" : "Review & Approve Now →"}</span>
                  </button>
                </div>
              )}

              {/* Low Stock Urgent Alerts (if any) */}
              {products.filter((p) => p.stock < 10).length > 0 && (
                <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-base">تنبيه عاجل: نواقص بالمخزون في بعض المستحضرات!</div>
                      <div className="text-xs font-semibold text-amber-800">
                        هناك {products.filter((p) => p.stock < 10).length} مستحضر شارف مخزونه على النفاد (أقل من 10 عبوات).
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("products");
                      setProductFilter("LOW_STOCK");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shrink-0 transition-colors shadow"
                  >
                    عرض النواقص وإعادة التعبئة
                  </button>
                </div>
              )}

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">أحدث طلبات العملاء الحية</h3>
                    <p className="text-xs text-gray-500 mt-0.5">محدثة لحظياً وتتزامن تلقائياً مع طلبات المتجر</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-[#3d502d] hover:underline flex items-center gap-1"
                  >
                    <span>عرض كافة الطلبات ({orders.length})</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                      <tr>
                        <th className="py-3 px-3.5 whitespace-nowrap">{adminLang === "ar" ? "رقم الطلب والتاريخ" : "Order # & Date"}</th>
                        <th className="py-3 px-3.5 min-w-[130px]">{adminLang === "ar" ? "العميل والموقع" : "Customer & City"}</th>
                        <th className="py-3 px-3.5 min-w-[140px]">{adminLang === "ar" ? "المستحضرات" : "Products"}</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">{adminLang === "ar" ? "المبلغ والتحصيل" : "Amount & COD"}</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">{adminLang === "ar" ? "الدفع والإيصال" : "Payment & Receipt"}</th>
                        <th className="py-3 px-3.5 min-w-[110px]">{adminLang === "ar" ? "حالة الطلب" : "Status"}</th>
                        <th className="py-3 px-3.5 text-center whitespace-nowrap">{adminLang === "ar" ? "الإجراءات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/80 transition-colors font-medium">
                          <td className="py-4 px-6 font-mono font-bold text-[#3d502d]">{order.orderNumber}</td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-900">{order.customerName}</div>
                            <div className="text-xs text-gray-500 font-mono">{order.customerPhone}</div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-800">{order.governorate}</td>
                          <td className="py-4 px-6 font-black text-gray-900">{order.total} ج.م</td>
                          <td className="py-4 px-6">{getPaymentBadge(order.paymentStatus, order.paymentMethod)}</td>
                          <td className="py-4 px-6">{getStatusBadge(order.orderStatus)}</td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => setOrderDetailsModal(order)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#3d502d] hover:text-white text-gray-700 text-xs font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>فحص</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ADVANCED ORDERS MANAGEMENT & LOGISTICS             */}
          {/* ========================================================= */}
          {activeTab === "orders" && (
            <div className="space-y-6 w-full min-w-0">
              
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm w-full min-w-0">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{adminLang === "ar" ? "إدارة الطلبات والشحن المباشر" : "Live Orders & Logistics"}</span>
                  </div>
                  <h2 className="font-bold text-2xl text-gray-900">
                    {adminLang === "ar" ? "سجل ومتابعة طلبات العملاء" : "Customer Orders Registry"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-semibold">
                    {adminLang === "ar"
                      ? "التحكم في دورة حياة الطلبات، تأكيد الحوالات، الشحن، وطباعة الفواتير وبوالص التتبع."
                      : "Manage order lifecycles, verify payment receipts, dispatch orders, and print invoices."}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={exportOrdersCsv}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2d3b21] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{adminLang === "ar" ? "تصدير الطلبات CSV" : "Export CSV"}</span>
                  </button>
                </div>
              </div>

              {/* INLINE ORDER INSPECTION & ACTIONS (NO POPUP) */}
              {invoiceModalOrder && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#d4af37] shadow-lg animate-in fade-in duration-200 print:p-0 print:border-none print:shadow-none space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 print:hidden">
                    <button
                      type="button"
                      onClick={() => setInvoiceModalOrder(null)}
                      className="px-4 py-2 rounded-2xl bg-[#f6f9e6] hover:bg-[#485c36] hover:text-white text-[#3d502d] transition-all flex items-center gap-2 text-xs font-bold border border-[#dbe2bd] cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "← العودة لسجل الطلبات" : "← Back to Orders"}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="px-5 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2e3d22] text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>{adminLang === "ar" ? "طباعة البوليصة الآن" : "Print Invoice"}</span>
                      </button>
                      <button
                        onClick={() => setInvoiceModalOrder(null)}
                        className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* The Waybill Document */}
                  <div className="max-w-2xl mx-auto p-4 sm:p-8 border border-gray-200 rounded-3xl bg-[#fcfdfa] font-cairo">
                    <div className="flex items-center justify-between pb-6 border-b-2 border-gray-900 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 relative flex items-center justify-center bg-[#f6f9e6] rounded-2xl border border-gray-300">
                          <Image src="/brand/sulaf-flower-symbol.png" alt="Sulaf" width={40} height={40} className="object-contain" />
                        </div>
                        <div>
                          <h2 className="font-amiri text-2xl font-black text-gray-950">سُـلاف | Sulaf Cosmeceuticals</h2>
                          <p className="text-xs font-semibold text-gray-600">بوليصة شحن وفاتورة مبيعات معتمدة</p>
                        </div>
                      </div>

                      <div className="text-left font-mono">
                        <div className="text-base font-black text-gray-900">{invoiceModalOrder.orderNumber}</div>
                        <div className="text-xs text-gray-500">{invoiceModalOrder.createdAt ? invoiceModalOrder.createdAt.substring(0, 10) : "2026-10-24"}</div>
                        <div className="text-[10px] text-gray-400 mt-1">ترخيص طبي: 2026/SLF-EG</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-6 text-xs">
                      <div>
                        <span className="font-bold text-gray-500 block">بيانات العميل المستلم:</span>
                        <span className="font-black text-sm text-gray-900 block mt-1">{invoiceModalOrder.customerName}</span>
                        <span className="font-mono font-bold text-gray-700 block mt-0.5">{invoiceModalOrder.customerPhone}</span>
                        {(invoiceModalOrder.birthdate || invoiceModalOrder.closePersonName) && (
                          <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                            {invoiceModalOrder.birthdate && (
                              <div className="text-[11px] text-amber-900 font-bold">🎂 تاريخ الميلاد: {invoiceModalOrder.birthdate}</div>
                            )}
                            {invoiceModalOrder.closePersonName && (
                              <div className="text-[11px] text-rose-900 font-bold">❤️ شخص مقرب: {invoiceModalOrder.closePersonName}</div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-gray-500 block">عنوان الشحن والتوصيل:</span>
                        <span className="font-bold text-gray-900 block mt-1">
                          {invoiceModalOrder.governorate} • {invoiceModalOrder.city}
                        </span>
                        <span className="text-gray-700 block mt-0.5">{invoiceModalOrder.street}</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-gray-100 font-bold text-gray-800">
                          <tr>
                            <th className="py-2.5 px-4">المستحضر</th>
                            <th className="py-2.5 px-4 text-center">الكمية</th>
                            <th className="py-2.5 px-4">السعر</th>
                            <th className="py-2.5 px-4 text-left">الإجمالي</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {invoiceModalOrder.items.map((it: any, idx: number) => (
                            <tr key={idx}>
                              <td className="py-2.5 px-4 font-bold">{it.productName}</td>
                              <td className="py-2.5 px-4 text-center font-mono">{it.quantity}</td>
                              <td className="py-2.5 px-4 font-mono">{it.price} ج</td>
                              <td className="py-2.5 px-4 text-left font-mono font-bold">{it.price * it.quantity} ج</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="space-y-1.5 text-xs text-left ms-auto max-w-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">المجموع الفرعي:</span>
                        <span className="font-bold">{invoiceModalOrder.subtotal} ج.م</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">تكلفة الشحن:</span>
                        <span className="font-bold">{invoiceModalOrder.shippingFee} ج.م</span>
                      </div>
                      <div className="flex justify-between text-base font-black border-t-2 border-gray-900 pt-2 text-gray-950">
                        <span>إجمالي الفاتورة:</span>
                        <span>{invoiceModalOrder.total} ج.م</span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-950 font-bold text-center border border-amber-200 mt-2">
                        المطلوب تحصيله عند الاستلام: {invoiceModalOrder.remainingCodAmount} ج.م
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {orderDetailsModal && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-300 shadow-md animate-in fade-in duration-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOrderDetailsModal(null)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#f6f9e6] hover:bg-[#485c36] hover:text-white text-[#3d502d] transition-all flex items-center gap-1.5 text-xs font-bold border border-[#dbe2bd] cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>{adminLang === "ar" ? "← إغلاق العرض" : "← Close"}</span>
                      </button>
                      <h3 className="font-bold text-lg text-gray-900">
                        {adminLang === "ar" ? `تفاصيل الطلب: ${orderDetailsModal.orderNumber}` : `Order Details: ${orderDetailsModal.orderNumber}`}
                      </h3>
                    </div>
                    <button
                      onClick={() => setOrderDetailsModal(null)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2 bg-[#fcfdfa] p-4 rounded-2xl border border-gray-200">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-500">اسم العميل:</span>
                        <span className="font-black text-gray-900">{orderDetailsModal.customerName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-500">رقم الهاتف:</span>
                        <span className="font-mono font-bold text-gray-900">{orderDetailsModal.customerPhone}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-500">العنوان:</span>
                        <span className="font-semibold text-gray-900">{orderDetailsModal.governorate} • {orderDetailsModal.city} - {orderDetailsModal.street}</span>
                      </div>
                      {orderDetailsModal.birthdate && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span className="font-bold text-gray-500">🎂 تاريخ الميلاد:</span>
                          <span className="font-bold text-[#3d502d]">{orderDetailsModal.birthdate}</span>
                        </div>
                      )}
                      {orderDetailsModal.closePersonName && (
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span className="font-bold text-gray-500">❤️ شخص مقرب:</span>
                          <span className="font-bold text-[#610b0d]">{orderDetailsModal.closePersonName}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 bg-[#fcfdfa] p-4 rounded-2xl border border-gray-200">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-500">المستحضرات:</span>
                        <span className="font-bold text-gray-900">
                          {orderDetailsModal.items.map((i: any) => `${i.productName} (×${i.quantity})`).join("، ")}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-500">إجمالي المبلغ:</span>
                        <span className="font-black text-base text-[#3d502d]">{orderDetailsModal.total} ج.م</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="font-bold text-gray-500">طريقة الدفع:</span>
                        <span>{orderDetailsModal.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {orderDetailsModal.notes && (
                    <div className="p-3 rounded-xl bg-gray-50 text-gray-700 text-xs">
                      <span className="font-bold">ملاحظات العميل: </span>
                      {orderDetailsModal.notes}
                    </div>
                  )}
                </div>
              )}

              {receiptModalUrl && receiptModalOrder && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-400 shadow-md animate-in fade-in duration-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-base text-gray-900">
                        إيصال تحويل الطلب: {receiptModalOrder.orderNumber}
                      </h3>
                      <p className="text-xs text-gray-500">
                        العميل: {receiptModalOrder.customerName} ({receiptModalOrder.customerPhone})
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setReceiptModalUrl(null);
                        setReceiptModalOrder(null);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative w-full h-80 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200">
                    <Image
                      src={receiptModalUrl}
                      alt="إيصال التحويل"
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <span className="text-xs font-bold text-gray-600">
                      المبلغ المطلوب اعتماده: {receiptModalOrder.isDepositMode ? `${receiptModalOrder.depositAmount} ج (عربون)` : `${receiptModalOrder.total} ج`}
                    </span>
                    <button
                      onClick={() => handleVerifyReceipt(receiptModalOrder)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>اعتماد الإيصال وتأكيد الدفع ✓</span>
                    </button>
                  </div>
                </div>
              )}

              {orderNotesModal && (
                <div className="bg-white rounded-3xl p-6 border-2 border-gray-300 shadow-md animate-in fade-in duration-200 space-y-4 max-w-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-base text-gray-900">
                      ملاحظات المدير الداخلية للطلب: {orderNotesModal.orderNumber}
                    </h3>
                    <button
                      onClick={() => setOrderNotesModal(null)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">الملاحظة (مرئية للإدارة فقط):</label>
                    <textarea
                      rows={4}
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="مثال: تم الاتصال بالعميلة لتأكيد موعد التوصيل، عميلة VIP..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:border-[#3d502d]"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setOrderNotesModal(null)}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => handleSaveOrderNotes(orderNotesModal.id)}
                      className="px-5 py-2 rounded-xl bg-[#3d502d] text-white font-bold text-xs shadow cursor-pointer"
                    >
                      حفظ الملاحظة
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Status KPI Cards (Click to Filter) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
                {[
                  {
                    filter: "ALL",
                    labelAr: "إجمالي الطلبات",
                    labelEn: "Total Orders",
                    count: orders.length,
                    color: "bg-gray-50 border-gray-200 text-gray-900",
                    badge: "bg-gray-200 text-gray-800",
                  },
                  {
                    filter: "PENDING_CONFIRMATION",
                    labelAr: "بانتظار المراجعة",
                    labelEn: "Pending Review",
                    count: orders.filter(o => o.orderStatus === "PENDING_CONFIRMATION").length,
                    color: "bg-amber-50/70 border-amber-200 text-amber-950",
                    badge: "bg-amber-200 text-amber-900",
                  },
                  {
                    filter: "PROCESSING",
                    labelAr: "قيد التجهيز بالمختبر",
                    labelEn: "Processing",
                    count: orders.filter(o => o.orderStatus === "PROCESSING").length,
                    color: "bg-blue-50/70 border-blue-200 text-blue-950",
                    badge: "bg-blue-200 text-blue-900",
                  },
                  {
                    filter: "SHIPPED",
                    labelAr: "تم تسليمه للشحن",
                    labelEn: "Shipped",
                    count: orders.filter(o => o.orderStatus === "SHIPPED").length,
                    color: "bg-purple-50/70 border-purple-200 text-purple-950",
                    badge: "bg-purple-200 text-purple-900",
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.filter}
                    onClick={() => setOrderFilter(kpi.filter)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-center justify-between ${kpi.color} ${
                      orderFilter === kpi.filter ? "ring-2 ring-[#3d502d] shadow-sm font-black" : "hover:shadow-xs opacity-90 hover:opacity-100"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block opacity-80">
                        {adminLang === "ar" ? kpi.labelAr : kpi.labelEn}
                      </span>
                      <span className="text-2xl font-black">{kpi.count}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${kpi.badge}`}>
                      {kpi.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Search & Filter Tabs */}
              <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 w-full min-w-0">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute right-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder={
                      adminLang === "ar"
                        ? "بحث برقم الطلب (SLF-XXXX)، اسم العميل، الهاتف، أو المدينة..."
                        : "Search by order number, customer name, phone, or city..."
                    }
                    className="w-full py-2.5 pr-11 pl-4 rounded-2xl bg-white border border-[#dbe2bd] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#3d502d] shadow-2xs"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch("")}
                      className="absolute left-3 top-3 text-gray-400 hover:text-gray-700 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                  {[
                    { id: "ALL", labelAr: "الكل", labelEn: "All", count: orders.length },
                    { id: "PENDING_CONFIRMATION", labelAr: "قيد المراجعة", labelEn: "Pending", count: orders.filter(o => o.orderStatus === "PENDING_CONFIRMATION").length },
                    { id: "PROCESSING", labelAr: "قيد التجهيز", labelEn: "Processing", count: orders.filter(o => o.orderStatus === "PROCESSING").length },
                    { id: "SHIPPED", labelAr: "تم الشحن", labelEn: "Shipped", count: orders.filter(o => o.orderStatus === "SHIPPED").length },
                    { id: "DELIVERED", labelAr: "تم التوصيل", labelEn: "Delivered", count: orders.filter(o => o.orderStatus === "DELIVERED").length },
                    { id: "CANCELLED", labelAr: "ملغي", labelEn: "Cancelled", count: orders.filter(o => o.orderStatus === "CANCELLED").length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderFilter(tab.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                        orderFilter === tab.id
                          ? "bg-[#3d502d] text-white shadow-sm"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-[#dbe2bd]"
                      }`}
                    >
                      <span>{adminLang === "ar" ? tab.labelAr : tab.labelEn}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${orderFilter === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* DESKTOP ORDERS TABLE (Visible on md and up)                    */}
              {/* ------------------------------------------------------------- */}
              <div className="hidden md:block bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden w-full min-w-0">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-right text-xs sm:text-sm">
                    <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                      <tr>
                        <th className="py-3.5 px-3.5 whitespace-nowrap">{adminLang === "ar" ? "رقم الطلب والتاريخ" : "Order # & Date"}</th>
                        <th className="py-3.5 px-3.5 min-w-[130px]">{adminLang === "ar" ? "العميل والموقع" : "Customer & City"}</th>
                        <th className="py-3.5 px-3.5 min-w-[140px]">{adminLang === "ar" ? "المستحضرات" : "Products"}</th>
                        <th className="py-3.5 px-3.5 whitespace-nowrap">{adminLang === "ar" ? "المبلغ والتحصيل" : "Amount & COD"}</th>
                        <th className="py-3.5 px-3.5 whitespace-nowrap">{adminLang === "ar" ? "الدفع والإيصال" : "Payment & Receipt"}</th>
                        <th className="py-3.5 px-3.5 min-w-[110px]">{adminLang === "ar" ? "حالة الطلب" : "Status"}</th>
                        <th className="py-3.5 px-3.5 text-center whitespace-nowrap">{adminLang === "ar" ? "الإجراءات" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500 font-bold">
                            {adminLang === "ar" ? "لا توجد طلبات تطابق معايير البحث الحالية." : "No orders match current criteria."}
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                            {/* Order # */}
                            <td className="py-3 px-3.5 align-top">
                              <span className="font-mono font-bold text-sm text-[#3d502d] block">{order.orderNumber}</span>
                              <span className="text-[11px] text-gray-400 block mt-0.5">
                                {order.createdAt?.substring(0, 10)}
                              </span>
                            </td>

                            {/* Customer & Location */}
                            <td className="py-3 px-3.5 align-top">
                              <div className="font-bold text-gray-900 text-sm">{order.customerName}</div>
                              <div className="text-xs text-gray-600 font-mono mt-0.5">{order.customerPhone}</div>
                              <div className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-semibold">
                                {order.governorate} • {order.city}
                              </div>
                              {(order.birthdate || order.closePersonName) && (
                                <div className="flex items-center gap-1.5 flex-wrap mt-1 text-[10px]">
                                  {order.birthdate && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                                      🎂 {order.birthdate}
                                    </span>
                                  )}
                                  {order.closePersonName && (
                                    <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-900 border border-rose-200 font-bold">
                                      ❤️ {order.closePersonName}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Products */}
                            <td className="py-3 px-3.5 align-top">
                              <div className="space-y-1">
                                {order.items.map((i, idx) => (
                                  <div key={idx} className="text-xs font-semibold text-gray-900 flex items-center justify-between gap-2">
                                    <span className="line-clamp-1">{i.productName}</span>
                                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-bold shrink-0">
                                      ×{i.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              {order.adminNotes && (
                                <div className="mt-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200">
                                  <span>ملاحظة: {order.adminNotes}</span>
                                </div>
                              )}
                            </td>

                            {/* Amount & COD */}
                            <td className="py-3 px-3.5 align-top">
                              <div className="font-black text-gray-900 text-sm">{order.total} {ADMIN_I18N[adminLang].currency}</div>
                              {order.isDepositMode ? (
                                <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                                  <div>مسدد: {order.depositAmount} ج</div>
                                  <div>المتبقي COD: {order.remainingCodAmount} ج</div>
                                </div>
                              ) : (
                                <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                                  سداد كامل ✓
                                </span>
                              )}
                            </td>

                            {/* Payment & Receipt */}
                            <td className="py-3 px-3.5 align-top">
                              <div className="mb-1.5">{getPaymentBadge(order.paymentStatus, order.paymentMethod)}</div>
                              {order.receiptUrl ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReceiptModalUrl(order.receiptUrl!);
                                    setReceiptModalOrder(order);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <FileCheck className="w-3.5 h-3.5" />
                                  <span>{adminLang === "ar" ? "معاينة الإيصال" : "View Receipt"}</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-gray-400 block">{adminLang === "ar" ? "لا يوجد إيصال" : "No receipt"}</span>
                              )}
                            </td>

                            {/* Status Selector */}
                            <td className="py-3 px-3.5 align-top">
                              <select
                                value={order.orderStatus}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                className="w-full px-2.5 py-1.5 rounded-xl border border-gray-300 bg-white font-bold text-xs focus:outline-none focus:border-[#3d502d] text-gray-900 shadow-2xs"
                              >
                                <option value="PENDING_CONFIRMATION">{adminLang === "ar" ? "قيد المراجعة" : "Pending"}</option>
                                <option value="PROCESSING">{adminLang === "ar" ? "قيد التجهيز" : "Processing"}</option>
                                <option value="SHIPPED">{adminLang === "ar" ? "تم الشحن" : "Shipped"}</option>
                                <option value="DELIVERED">{adminLang === "ar" ? "تم التوصيل" : "Delivered"}</option>
                                <option value="CANCELLED">{adminLang === "ar" ? "ملغي" : "Cancelled"}</option>
                              </select>
                            </td>

                            {/* Action Buttons Toolbar */}
                            <td className="py-3 px-3.5 align-top text-center">
                              <div className="flex items-center justify-center gap-1">
                                {/* Inspect */}
                                <button
                                  type="button"
                                  onClick={() => setOrderDetailsModal(order)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                  title={adminLang === "ar" ? "فحص تفاصيل الطلب" : "View Details"}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Print Invoice */}
                                <button
                                  type="button"
                                  onClick={() => setInvoiceModalOrder(order)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#3d502d] hover:text-white text-gray-700 transition-colors"
                                  title={adminLang === "ar" ? "طباعة الفاتورة وبوليصة الشحن" : "Print Waybill"}
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>

                                {/* WhatsApp Confirm */}
                                <button
                                  type="button"
                                  onClick={() => openWhatsAppConfirmOrder(order)}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition-colors"
                                  title={adminLang === "ar" ? "إرسال رسالة تأكيد واتساب" : "WhatsApp Confirm"}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>

                                {/* WhatsApp Dispatch */}
                                <button
                                  type="button"
                                  onClick={() => openWhatsAppDispatchShipment(order)}
                                  className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 transition-colors"
                                  title={adminLang === "ar" ? "إرسال بيانات الشحن والتتبع واتساب" : "WhatsApp Dispatch"}
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                </button>

                                {/* Internal Notes */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOrderNotesModal(order);
                                    setTempNotes(order.adminNotes || "");
                                  }}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 transition-colors"
                                  title={adminLang === "ar" ? "ملاحظات داخلية" : "Admin Notes"}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 transition-colors"
                                  title={adminLang === "ar" ? "حذف الطلب" : "Delete Order"}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* MOBILE ORDERS CARDS (Visible on sm and mobile screens)        */}
              {/* ------------------------------------------------------------- */}
              <div className="md:hidden space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-gray-200 text-gray-500 font-bold">
                    {adminLang === "ar" ? "لا توجد طلبات تطابق معايير البحث الحالية." : "No orders found."}
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-[#dbe2bd] p-5 shadow-sm space-y-3.5"
                    >
                      {/* Top Row: Order # and Status */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                        <div>
                          <span className="font-mono font-bold text-base text-[#3d502d] block">
                            {order.orderNumber}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {order.createdAt?.substring(0, 10)}
                          </span>
                        </div>
                        <div>{getStatusBadge(order.orderStatus)}</div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-gray-900">{order.customerName}</div>
                          <div className="text-xs text-gray-600 font-mono mt-0.5">{order.customerPhone}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {order.governorate} • {order.city}
                          </div>
                        </div>

                        {/* Quick Call / WhatsApp */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
                            title="اتصال هاتفي"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => openWhatsAppConfirmOrder(order)}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-3 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="text-xs text-gray-800 flex items-center justify-between font-semibold">
                            <span>{i.productName}</span>
                            <span className="font-mono font-bold text-[#3d502d]">×{i.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Financial info */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div>
                          <span className="text-gray-500 block text-[10px]">الإجمالي</span>
                          <span className="font-black text-base text-gray-900">{order.total} {ADMIN_I18N[adminLang].currency}</span>
                        </div>
                        <div className="text-end">
                          <span className="text-gray-500 block text-[10px]">حالة السداد</span>
                          <div>{getPaymentBadge(order.paymentStatus, order.paymentMethod)}</div>
                        </div>
                      </div>

                      {order.isDepositMode && (
                        <div className="text-[11px] font-semibold text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200 flex justify-between">
                          <span>مسدد عربون: {order.depositAmount} ج</span>
                          <span>متبقي عند الاستلام: {order.remainingCodAmount} ج</span>
                        </div>
                      )}

                      {/* Mobile Status Changer */}
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          تحديث حالة الطلب:
                        </label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-bold text-xs text-gray-900 shadow-2xs"
                        >
                          <option value="PENDING_CONFIRMATION">قيد المراجعة</option>
                          <option value="PROCESSING">قيد التجهيز</option>
                          <option value="SHIPPED">تم الشحن</option>
                          <option value="DELIVERED">تم التوصيل</option>
                          <option value="CANCELLED">ملغي</option>
                        </select>
                      </div>

                      {/* Action buttons bar */}
                      <div className="pt-2 border-t border-gray-100 grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderDetailsModal(order)}
                          className="py-2 px-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold flex flex-col items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-700" />
                          <span>التفاصيل</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInvoiceModalOrder(order)}
                          className="py-2 px-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold flex flex-col items-center justify-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5 text-[#3d502d]" />
                          <span>الفاتورة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openWhatsAppDispatchShipment(order)}
                          className="py-2 px-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold flex flex-col items-center justify-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5 text-purple-700" />
                          <span>الشحن</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.id)}
                          className="py-2 px-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold flex flex-col items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}{/* ========================================================= */}
          {/* TAB 3: PRODUCTS & LIVE INVENTORY MANAGEMENT               */}
          {/* ========================================================= */}
          {activeTab === "products" && (
            productModalOpen ? (
              /* INLINE PRODUCT ADD / EDIT WORKSPACE (NO POPUP) */
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header with Return button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setProductModalOpen(false)}
                      className="px-4 py-2.5 rounded-2xl bg-[#f6f9e6] hover:bg-[#485c36] hover:text-white text-[#3d502d] transition-all flex items-center gap-2 text-xs font-bold border border-[#dbe2bd] cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "← العودة لقائمة المستحضرات" : "← Back to Products List"}</span>
                    </button>
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    <div>
                      <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
                        {editingProduct
                          ? (adminLang === "ar" ? `تعديل بيانات: ${productForm.nameAr || editingProduct.nameAr}` : `Edit: ${productForm.nameEn || editingProduct.nameEn}`)
                          : (adminLang === "ar" ? "إضافة مستحضر كوزميسوتيكال جديد للمتجر" : "Add New Cosmeceutical Product")}
                      </h2>
                      <span className="text-xs text-gray-500 font-mono">
                        {productForm.sku || "SLF-NEW"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setProductModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      {adminLang === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </div>

                {/* Inline Product Form */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dbe2bd] shadow-sm">
                  {/* Advanced Per-Product Page Sections & Cards Builder Banner */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1e6] border-2 border-[#485c36]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#485c36] text-[#f6f9e6] flex items-center justify-center shrink-0 shadow-xs">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-[#1e2b18]">
                            {adminLang === "ar" ? "محرر أقسام وبلوكات صفحة المستحضر المتقدم" : "Advanced Product Page Sections & Cards Builder"}
                          </h4>
                          {productForm.pageBuilder && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {adminLang === "ar" ? "تم تخصيص الأقسام ✓" : "Customized ✓"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {adminLang === "ar"
                            ? "تحكم كامل في كل ما بعد القسم الأول: قصة المستحضر، كروت المكونات الفعالة، طقوس الاستخدام، وإضافة كروت مخصصة وأسئلة شائعة."
                            : "Customize everything after Section 1: Clinical story, ingredient cards, ritual phases, custom cards & FAQs."}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const current = editingProduct
                          ? { ...editingProduct, ...productForm }
                          : ({ ...productForm, id: "temp-new", slug: "temp-new" } as any);
                        setBuilderModalProduct(current);
                        setIsBuilderModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#485c36] hover:bg-[#34482f] text-[#f6f9e6] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "فتح محرر أقسام الصفحة الآن ✨" : "Open Page Sections Builder ✨"}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">اسم المستحضر (عربي) *</label>
                        <input
                          type="text"
                          value={productForm.nameAr}
                          onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })}
                          placeholder="Absolutes Smoothing Body Cream..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">الاسم بالإنجليزي (English Name)</label>
                        <input
                          type="text"
                          value={productForm.nameEn}
                          onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                          placeholder="Absolutes Smoothing Body Cream..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* PRODUCT IMAGES UPLOADER & GALLERY MANAGEMENT             */}
                    {/* ========================================================= */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#fbfdf7] to-[#f4f7ea] border-2 border-[#610b0d]/20 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#610b0d] text-[#f6f9e6] flex items-center justify-center shrink-0 shadow-xs">
                            <ImagePlus className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                              <span>{adminLang === "ar" ? "صور المستحضر والمعرض الحي" : "Product Images & Media"}</span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#610b0d]/10 text-[#610b0d] font-bold">
                                {productForm.images.length} {adminLang === "ar" ? "صور" : "images"}
                              </span>
                            </h3>
                            <p className="text-xs text-gray-600">
                              {adminLang === "ar"
                                ? "ارفع صور المنتج من جهازك أو اسحبها هنا. الصورة المحددة بـ (رئيسية) ستظهر كصورة غلاف في واجهة المتجر."
                                : "Upload images from your device or drop them here. The primary image will appear across the storefront."}
                            </p>
                          </div>
                        </div>

                        {/* Direct URL Input quick trigger */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            value={customImageUrlInput}
                            onChange={(e) => setCustomImageUrlInput(e.target.value)}
                            placeholder={adminLang === "ar" ? "أو الصق رابط صورة مباشر (URL)..." : "Or paste image URL..."}
                            className="text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#610b0d] w-full sm:w-60"
                            dir="ltr"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddImageUrl();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddImageUrl}
                            disabled={!customImageUrlInput.trim()}
                            className="px-3 py-2 rounded-xl bg-[#610b0d] hover:bg-[#470708] disabled:opacity-50 text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                          >
                            {adminLang === "ar" ? "إضافة" : "Add"}
                          </button>
                        </div>
                      </div>

                      {/* Drag & Drop File Upload Zone */}
                      <input
                        type="file"
                        ref={productFileInputRef}
                        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
                        multiple
                        onChange={(e) => e.target.files && handleProductImageUpload(e.target.files)}
                        className="hidden"
                      />

                      <div
                        onClick={() => productFileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingImage(true);
                        }}
                        onDragLeave={() => setIsDraggingImage(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingImage(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleProductImageUpload(e.dataTransfer.files);
                          }
                        }}
                        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
                          isDraggingImage
                            ? "border-[#610b0d] bg-[#610b0d]/10 scale-[1.01]"
                            : "border-[#610b0d]/30 hover:border-[#610b0d] bg-white hover:bg-[#fcfdfa]"
                        }`}
                      >
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center gap-3 py-4">
                            <div className="w-10 h-10 border-3 border-[#610b0d] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-bold text-[#610b0d]">
                              {adminLang === "ar" ? "جاري رفع ومعالجة الصور على الخادم..." : "Uploading & optimizing images..."}
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2.5">
                            <div className="w-12 h-12 rounded-2xl bg-[#610b0d]/10 text-[#610b0d] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {adminLang === "ar"
                                  ? "اضغط لاختيار صور من جهازك أو اسحب الصور وأفلتها هنا"
                                  : "Click to upload photos from device or drag and drop"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {adminLang === "ar"
                                  ? "يدعم صور PNG, JPG, JPEG, WEBP, SVG حتى 10 ميجابايت لكل صورة"
                                  : "Supports PNG, JPG, WEBP, SVG up to 10MB per image"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Uploaded Images Gallery Grid */}
                      {productForm.images.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 font-semibold px-1">
                            <span>{adminLang === "ar" ? "الصور المرفوعة للمستحضر:" : "Uploaded Images:"}</span>
                            <span className="text-[11px] text-[#610b0d]">
                              {adminLang === "ar" ? "💡 اضغط على النجمة لتعيين الصورة الرئيسية" : "💡 Click star to set primary image"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {productForm.images.map((img, idx) => {
                              const isPrimary = img.isPrimary || (idx === 0 && !productForm.images.some((i) => i.isPrimary));
                              return (
                                <div
                                  key={idx}
                                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all aspect-square bg-white shadow-xs flex flex-col justify-between ${
                                    isPrimary
                                      ? "border-[#610b0d] ring-2 ring-[#610b0d]/20"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  {/* Primary Badge */}
                                  {isPrimary && (
                                    <div className="absolute top-2 start-2 z-10 px-2 py-0.5 rounded-full bg-[#610b0d] text-[#f6f9e6] text-[10px] font-bold shadow-xs flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-current" />
                                      <span>{adminLang === "ar" ? "رئيسية" : "Primary"}</span>
                                    </div>
                                  )}

                                  {/* Image View */}
                                  <div className="relative w-full h-full p-2 flex items-center justify-center">
                                    <img
                                      src={img.url}
                                      alt={img.alt || productForm.nameAr || "Sulaf Product"}
                                      className="max-h-full max-w-full object-contain"
                                    />
                                  </div>

                                  {/* Hover Actions Bar */}
                                  <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-center justify-between opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    {!isPrimary && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSetPrimaryImage(idx);
                                        }}
                                        className="p-1 rounded-lg bg-white/90 hover:bg-white text-[#610b0d] text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                                        title={adminLang === "ar" ? "تعيين كرئيسية" : "Set as primary"}
                                      >
                                        <Star className="w-3 h-3" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProductImage(idx);
                                      }}
                                      className="p-1 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition-all ms-auto cursor-pointer"
                                      title={adminLang === "ar" ? "حذف الصورة" : "Delete image"}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Featured Product Designation Switch */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                          👑
                        </div>
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-amber-950">
                            {adminLang === "ar"
                              ? "تعيين هذا المستحضر كـ (منتج رئيسي) في واجهة المتجر"
                              : "Set as Featured Product in Homepage Showcase"}
                          </h4>
                          <p className="text-xs text-amber-800/80">
                            {adminLang === "ar"
                              ? "سيظهر هذا المستحضر بصوره وتفاصيله وسعره تلقائياً في سيكشن المنتج الواحد بالصفحة الرئيسية."
                              : "This product, its primary photo, and updated details will appear in the Homepage Showcase section."}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={productForm.isFeatured}
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#610b0d]"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">السعر للبيع (ج.م) *</label>
                        <input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-[#3d502d] focus:border-[#3d502d] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">السعر قبل الخصم (ج.م)</label>
                        <input
                          type="number"
                          value={productForm.compareAtPrice}
                          onChange={(e) => setProductForm({ ...productForm, compareAtPrice: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">الكمية بالمخزون *</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">الرمز التعريفي (SKU)</label>
                        <input
                          type="text"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          placeholder="SLF-001"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono font-semibold focus:border-[#3d502d] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">الشارة المميزة (Badge)</label>
                        <input
                          type="text"
                          value={productForm.badgeAr}
                          onChange={(e) => setProductForm({ ...productForm, badgeAr: e.target.value })}
                          placeholder="الأكثر طلباً سريرياً"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">العنوان الفرعي (عربي)</label>
                        <input
                          type="text"
                          value={productForm.subtitleAr}
                          onChange={(e) => setProductForm({ ...productForm, subtitleAr: e.target.value })}
                          placeholder="كريم الترميم السريري وعلاج جلد الوزة باليوريا 30%..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:border-[#3d502d] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">العنوان الفرعي (إنجليزي - Subtitle EN)</label>
                        <input
                          type="text"
                          value={productForm.subtitleEn}
                          onChange={(e) => setProductForm({ ...productForm, subtitleEn: e.target.value })}
                          placeholder="Architectural Keratolytic Reset | 30% Pure Urea..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:border-[#3d502d] focus:outline-none"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* Product Descriptions: Arabic & English */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                          <span>🇸🇦</span>
                          <span>وصف المستحضر (باللغة العربية)</span>
                        </label>
                        <textarea
                          rows={4}
                          value={productForm.descriptionAr}
                          onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })}
                          placeholder="تركيبة علاجية متقدمة: 30% يوريا نقية..."
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-emerald-600"
                          dir="rtl"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-indigo-900 mb-1.5 flex items-center gap-1.5">
                          <span>🇬🇧</span>
                          <span>وصف المستحضر (باللغة الإنجليزية - Description EN)</span>
                        </label>
                        <textarea
                          rows={4}
                          value={productForm.descriptionEn}
                          onChange={(e) => setProductForm({ ...productForm, descriptionEn: e.target.value })}
                          placeholder="Architectural Keratolytic Reset: 30% Pure Urea..."
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-indigo-600"
                          dir="ltr"
                        ></textarea>
                      </div>
                    </div>

                    {/* Product How To Use: Arabic & English */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f6f9e6]/60 p-4 rounded-2xl border border-[#dbe2bd]">
                      <div>
                        <label className="block text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
                          <span>🇸🇦</span>
                          <span>طريقة الاستخدام (بالعربي)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={productForm.usageInstructionsAr}
                          onChange={(e) => setProductForm({ ...productForm, usageInstructionsAr: e.target.value })}
                          placeholder="يُطبق مساءً 2-3 مرات أسبوعياً على بشرة نظيفة وجافة..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:border-emerald-600"
                          dir="rtl"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-indigo-900 mb-1.5 flex items-center gap-1.5">
                          <span>🇬🇧</span>
                          <span>طريقة الاستخدام (بالإنجليزي - How to Use EN)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={productForm.usageInstructionsEn}
                          onChange={(e) => setProductForm({ ...productForm, usageInstructionsEn: e.target.value })}
                          placeholder="Apply in the evening 2-3 times weekly on clean, dry areas..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-semibold focus:outline-none focus:border-indigo-600"
                          dir="ltr"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setProductModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs"
                      >
                        {adminLang === "ar" ? "إلغاء والعودة" : "Cancel & Return"}
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 rounded-2xl bg-[#3d502d] hover:bg-[#2d3b21] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>{editingProduct ? (adminLang === "ar" ? "حفظ التعديلات على المستحضر ✓" : "Save Changes ✓") : (adminLang === "ar" ? "إضافة المستحضر للمتجر الآن ✓" : "Add Product Now ✓")}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                <div>
                  <h2 className="font-bold text-2xl text-gray-900">إدارة المستحضرات والمخزون الحي</h2>
                  <p className="text-xs text-gray-600 mt-1 font-semibold">
                    إضافة وتعديل المنتجات، تعديل الأسعار، ومراقبة النواقص وتعديل المخزون الفوري بضغطة زر.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      nameAr: "",
                      nameEn: "",
                      subtitleAr: "",
                      subtitleEn: "",
                      price: 420,
                      compareAtPrice: 530,
                      stock: 100,
                      sku: `SLF-${Math.floor(100 + Math.random() * 900)}`,
                      badgeAr: "",
                      descriptionAr: "",
                      descriptionEn: "",
                      usageInstructionsAr: "",
                      usageInstructionsEn: "",
                      imageUrl: "/brand/sulaf-flower-symbol.png",
                      images: [],
                      isFeatured: false,
                      pageBuilder: undefined,
                    });
                    setProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#3d502d] hover:bg-[#2d3b21] text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة مستحضر سريري جديد</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="ابحث باسم المستحضر أو الرمز (SKU)..."
                    className="w-full py-3 pr-12 pl-4 rounded-2xl bg-white border border-[#dbe2bd] text-sm font-semibold focus:outline-none focus:border-[#3d502d]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { id: "ALL", label: "كافة المستحضرات" },
                    { id: "IN_STOCK", label: "متوفر (> 10)" },
                    { id: "LOW_STOCK", label: "نواقص ومخزون منخفض (< 10)" },
                    { id: "OUT_OF_STOCK", label: "نفد (0)" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setProductFilter(f.id)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                        productFilter === f.id
                          ? "bg-[#3d502d] text-white shadow"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-[#dbe2bd]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                      <tr>
                        <th className="py-4 px-6">المستحضر</th>
                        <th className="py-4 px-6">الرمز (SKU)</th>
                        <th className="py-4 px-6">السعر الحالي</th>
                        <th className="py-4 px-6">المخزون والتحكم السريع</th>
                        <th className="py-4 px-6">الحالة</th>
                        <th className="py-4 px-6 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                                <Image
                                  src={product.images?.[0]?.url || (product as any).imageUrl || "/brand/sulaf-flower-symbol.png"}
                                  alt={product.nameAr}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                              <div>
                                <div className="font-bold text-gray-900 text-sm">{product.nameAr}</div>
                                <div className="text-xs text-gray-500 font-mono">{product.nameEn}</div>
                                {product.badgeAr && (
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#e8ecd0] text-[#3d502d] text-[10px] font-bold">
                                    {product.badgeAr}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 font-mono font-bold text-gray-600 text-xs">
                            {product.sku || "SLF-001"}
                          </td>

                          <td className="py-4 px-6">
                            <div className="font-black text-[#3d502d] text-base">{product.price} ج.م</div>
                            {product.compareAtPrice > product.price && (
                              <div className="text-xs text-gray-400 line-through">
                                {product.compareAtPrice} ج.م
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 flex-wrap">
                              {editingStockId === product.id ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="number"
                                    value={tempStockValue}
                                    onChange={(e) => setTempStockValue(Number(e.target.value))}
                                    className="w-16 px-2 py-1 text-xs font-bold border border-gray-300 rounded-lg text-center"
                                  />
                                  <button
                                    onClick={() => handleSaveInlineStock(product.id)}
                                    className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingStockId(null)}
                                    className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span
                                  onClick={() => {
                                    setEditingStockId(product.id);
                                    setTempStockValue(product.stock);
                                  }}
                                  className={`cursor-pointer px-3 py-1 rounded-lg text-xs font-black border transition-all ${
                                    product.stock === 0
                                      ? "bg-rose-100 text-rose-800 border-rose-300"
                                      : product.stock < 10
                                      ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                                      : "bg-gray-100 text-gray-900 border-gray-300"
                                  }`}
                                  title="انقر لتعديل الكمية مباشرة"
                                >
                                  {product.stock} عبوة
                                </span>
                              )}

                              {/* Quick stock adjustment buttons */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleQuickStockDelta(product.id, 10)}
                                  className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors"
                                  title="إضافة 10 عبوات للمخزون"
                                >
                                  +10
                                </button>
                                <button
                                  onClick={() => handleQuickStockDelta(product.id, 50)}
                                  className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors"
                                  title="إضافة 50 عبوة للمخزون"
                                >
                                  +50
                                </button>
                                <button
                                  onClick={() => handleQuickStockDelta(product.id, -1)}
                                  className="px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-800 font-bold text-[11px] border border-rose-200 transition-colors"
                                  title="خصم عبوة واحدة"
                                >
                                  -1
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            {product.stock > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>متاح للبيع</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>نفد من المخزون</span>
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {product.isFeatured || product.id === settings?.featuredProductId ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border-2 border-amber-400 text-amber-950 text-xs font-black shadow-xs">
                                <span>👑</span>
                                <span>{adminLang === "ar" ? "رئيسي بالواجهة" : "Featured"}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetFeaturedProduct(product.id, product.nameAr)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-amber-100 text-gray-700 hover:text-amber-900 border border-gray-300 hover:border-amber-400 text-xs font-bold transition-all cursor-pointer hover:scale-105 shadow-2xs"
                                title={adminLang === "ar" ? "تعيين هذا المستحضر ليعرض كمنتج رئيسي في قسم المنتج الواحد بالصفحة الرئيسية" : "Set as featured product on homepage"}
                              >
                                <span>👑</span>
                                <span>{adminLang === "ar" ? "تعيين كرئيسي" : "Set Featured"}</span>
                              </button>
                            )}
                          </td>

                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Link
                                href={`/product/${product.slug}`}
                                target="_blank"
                                className="p-2 rounded-xl bg-gray-100 hover:bg-[#3d502d] hover:text-white text-gray-700 transition-colors"
                                title="معاينة صفحة المنتج بالمتجر"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => {
                                  setEditingProduct(product);
                                  setProductForm({
                                    nameAr: product.nameAr,
                                    nameEn: product.nameEn,
                                    subtitleAr: product.subtitleAr || "",
                                    subtitleEn: product.subtitleEn || "",
                                    price: product.price,
                                    compareAtPrice: product.compareAtPrice,
                                    stock: product.stock,
                                    sku: product.sku,
                                    badgeAr: product.badgeAr || "",
                                    descriptionAr: product.descriptionAr || "",
                                    descriptionEn: product.descriptionEn || "",
                                    usageInstructionsAr: product.usageInstructionsAr || "",
                                    usageInstructionsEn: product.usageInstructionsEn || "",
                                    imageUrl: product.images?.[0]?.url || (product as any).imageUrl || "/brand/sulaf-flower-symbol.png",
                                    images: product.images && product.images.length > 0
                                      ? [...product.images]
                                      : [{ url: (product as any).imageUrl || "/brand/sulaf-flower-symbol.png", alt: product.nameAr, isPrimary: true }],
                                    isFeatured: product.isFeatured || product.id === settings?.featuredProductId || false,
                                    pageBuilder: product.pageBuilder,
                                  });
                                  setProductModalOpen(true);
                                }}
                                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition-colors"
                                title="تعديل بيانات المستحضر"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 transition-colors"
                                title="حذف المستحضر"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )
          )}

          {/* ========================================================= */}
          {/* TAB 3.5: REVIEWS & CLINICAL TESTIMONIALS                 */}
          {/* ========================================================= */}
          {activeTab === "reviews" && (() => {
            const totalReviews = reviewsList.length;
            const pendingReviews = reviewsList.filter((r) => r.status === "PENDING");
            const approvedReviews = reviewsList.filter((r) => r.status === "APPROVED");
            const rejectedReviews = reviewsList.filter((r) => r.status === "REJECTED");
            const avgRating = totalReviews > 0
              ? (reviewsList.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
              : "5.0";

            const filteredReviews = reviewsList.filter((rev) => {
              if (reviewFilter !== "ALL" && rev.status !== reviewFilter) return false;
              if (reviewSearch.trim()) {
                const q = reviewSearch.toLowerCase().trim();
                const matchAuthor = rev.authorName?.toLowerCase().includes(q);
                const matchRole = rev.authorRole?.toLowerCase().includes(q);
                const matchComment = rev.comment?.toLowerCase().includes(q);
                const matchTitle = rev.title?.toLowerCase().includes(q);
                const matchProduct = rev.productName?.toLowerCase().includes(q);
                return matchAuthor || matchRole || matchComment || matchTitle || matchProduct;
              }
              return true;
            });

            const isReviewsVisible = settings.sectionsVisibility?.reviewsSection !== false;

            return (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header & Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                      <h2 className="font-bold text-xl sm:text-2xl text-gray-900 font-amiri">
                        {adminLang === "ar" ? "سجل التقييمات وتجارب العميلات" : "Reviews & Testimonials Ledger"}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {adminLang === "ar"
                        ? "توثيق وتدقيق آراء العميلات والشهادات الإكلينيكية، والموافقة عليها لتظهر في الواجهة وصفحة المنتج."
                        : "Verify, audit and approve customer testimonials before displaying on storefront & product pages."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Storefront Visibility Toggle Button */}
                    <button
                      type="button"
                      onClick={toggleReviewsSectionVisibility}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 ${
                        isReviewsVisible
                          ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                      title={adminLang === "ar" ? "التحكم في ظهور أو إخفاء قسم التقييمات في الصفحة الرئيسية" : "Toggle reviews visibility on homepage"}
                    >
                      {isReviewsVisible ? (
                        <>
                          <EyeOff className="w-4 h-4 text-rose-600" />
                          <span>{adminLang === "ar" ? "إخفاء القسم من الواجهة" : "Hide from Storefront"}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span>{adminLang === "ar" ? "إظهار القسم في الواجهة ✓" : "Show on Storefront ✓"}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAddReviewModalOpen(true)}
                      className="px-4 py-2.5 rounded-2xl bg-[#485c36] hover:bg-[#3d502d] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "إضافة رأي / شهادة +" : "Add Review +"}</span>
                    </button>
                  </div>
                </div>

                {/* Storefront Section Visibility Control Banner */}
                <div className={`p-4 sm:p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isReviewsVisible
                    ? "bg-emerald-50/60 border-emerald-200/80 text-emerald-950"
                    : "bg-amber-50/60 border-amber-200/80 text-amber-950"
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isReviewsVisible ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                    }`}>
                      {isReviewsVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {adminLang === "ar" ? "حالة ظهور قسم الآراء في المتجر الرئيسي:" : "Storefront Reviews Visibility Status:"}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isReviewsVisible
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                          {isReviewsVisible
                            ? (adminLang === "ar" ? "ظاهر في المتجر (Carousel دوار) 🟢" : "Visible (Rotating Carousel) 🟢")
                            : (adminLang === "ar" ? "مخفي من المتجر حالياً 🔴" : "Currently Hidden from Store 🔴")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {adminLang === "ar"
                          ? (isReviewsVisible
                              ? "قسم آراء وتقييمات العميلات مفعل ويظهر كـ Carousel دوار متحرك وسلس للزوار في الواجهة."
                              : "قسم الآراء والتقييمات مخفي بالكامل من الصفحة الرئيسية للزوار، يمكنك إظهاره بضغطة زر واحدة.")
                          : (isReviewsVisible
                              ? "Customer reviews section is live and displays as an auto-rotating carousel on the storefront."
                              : "Reviews section is completely hidden from the storefront for visitors. You can show it with one click.")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleReviewsSectionVisibility}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0 active:scale-95 ${
                      isReviewsVisible
                        ? "bg-white hover:bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-[#485c36] hover:bg-[#3d502d] text-white shadow"
                    }`}
                  >
                    {isReviewsVisible ? (
                      <>
                        <EyeOff className="w-4 h-4 text-rose-600" />
                        <span>{adminLang === "ar" ? "إخفاء القسم من الواجهة" : "Hide from Storefront"}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-white" />
                        <span>{adminLang === "ar" ? "إظهار وتفعيل في الواجهة ✓" : "Show on Storefront ✓"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* KPI Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Reviews */}
                  <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="text-xs font-bold">{adminLang === "ar" ? "إجمالي التقييمات" : "Total Reviews"}</span>
                      <Award className="w-4 h-4 text-[#485c36]" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">{totalReviews}</span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <span>⭐ {avgRating}</span>
                        <span className="text-gray-400 text-[10px]">/ 5</span>
                      </span>
                    </div>
                  </div>

                  {/* Pending Reviews */}
                  <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="text-xs font-bold">{adminLang === "ar" ? "بانتظار الموافقة" : "Pending Approval"}</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">{pendingReviews.length}</span>
                      {pendingReviews.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 animate-pulse">
                          {adminLang === "ar" ? "يتطلب إجراء" : "Action Needed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Approved Reviews */}
                  <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="text-xs font-bold">{adminLang === "ar" ? "معتمدة ومنشورة" : "Approved & Live"}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">{approvedReviews.length}</span>
                      <span className="text-[10px] text-gray-400">
                        {adminLang === "ar" ? "نشط بالمتجر" : "Active on store"}
                      </span>
                    </div>
                  </div>

                  {/* Rejected Reviews */}
                  <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-gray-500">
                      <span className="text-xs font-bold">{adminLang === "ar" ? "تقييمات مرفوضة" : "Rejected"}</span>
                      <XCircle className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black text-gray-600 font-mono">{rejectedReviews.length}</span>
                      <span className="text-[10px] text-gray-400">
                        {adminLang === "ar" ? "مخفية" : "Hidden"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      <button
                        type="button"
                        onClick={() => setReviewFilter("ALL")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          reviewFilter === "ALL"
                            ? "bg-[#485c36] text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {adminLang === "ar" ? "الكل" : "All"} ({totalReviews})
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewFilter("PENDING")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                          reviewFilter === "PENDING"
                            ? "bg-amber-500 text-black shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <span>{adminLang === "ar" ? "قيد المراجعة" : "Pending"}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${reviewFilter === "PENDING" ? "bg-black/20 text-black font-black" : "bg-amber-100 text-amber-800"}`}>
                          {pendingReviews.length}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewFilter("APPROVED")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          reviewFilter === "APPROVED"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {adminLang === "ar" ? "المعتمدة" : "Approved"} ({approvedReviews.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setReviewFilter("REJECTED")}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          reviewFilter === "REJECTED"
                            ? "bg-rose-600 text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {adminLang === "ar" ? "المرفوضة" : "Rejected"} ({rejectedReviews.length})
                      </button>
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[240px] sm:w-80">
                      <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={reviewSearch}
                        onChange={(e) => setReviewSearch(e.target.value)}
                        placeholder={adminLang === "ar" ? "ابحث بالاسم، نص التجربة، الصفة..." : "Search by name, comment, role..."}
                        className="w-full ps-9 pe-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#485c36]"
                      />
                      {reviewSearch && (
                        <button
                          type="button"
                          onClick={() => setReviewSearch("")}
                          className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reviews List Cards */}
                {filteredReviews.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-[#dbe2bd] text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#f6f9e6] text-[#485c36] flex items-center justify-center mx-auto">
                      <Star className="w-6 h-6 text-amber-500 fill-amber-400/40" />
                    </div>
                    <h3 className="font-bold text-base text-gray-900">
                      {adminLang === "ar" ? "لا توجد تقييمات مطابقة" : "No Matching Reviews"}
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      {adminLang === "ar"
                        ? "لم يتم العثور على أي آراء أو تقييمات تطابق خيارات التصفية الحالية. يمكنك إضافة تقييم جديد يدوياً الآن."
                        : "No reviews found for current filter. You can add a new review manually."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setAddReviewModalOpen(true)}
                      className="mt-2 px-5 py-2 rounded-xl bg-[#485c36] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{adminLang === "ar" ? "إضافة تقييم جديد الآن" : "Add New Review"}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReviews.map((rev) => {
                      const isPending = rev.status === "PENDING";
                      const isApproved = rev.status === "APPROVED";
                      const isRejected = rev.status === "REJECTED";

                      return (
                        <div
                          key={rev.id}
                          className={`bg-white rounded-3xl border transition-all p-5 sm:p-6 space-y-4 shadow-sm ${
                            isPending
                              ? "border-amber-300 ring-1 ring-amber-300/40 bg-amber-50/10"
                              : "border-[#dbe2bd] hover:border-[#485c36]/40"
                          }`}
                        >
                          {/* Card Header: Author Info, Stars, Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#485c36] to-[#222e18] text-[#f6f9e6] font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                                {rev.authorName ? rev.authorName.charAt(0) : "ع"}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-sm text-gray-900">{rev.authorName}</h4>
                                  {rev.authorRole && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6f9e6] text-[#485c36] border border-[#dbe2bd]">
                                      {rev.authorRole}
                                    </span>
                                  )}
                                  {rev.isVerifiedPurchase && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      <span>{adminLang === "ar" ? "شراء مؤكد" : "Verified"}</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                  <span>{rev.createdAt ? rev.createdAt.substring(0, 10) : "2026-10-24"}</span>
                                  {rev.productName && (
                                    <>
                                      <span>•</span>
                                      <span className="text-[#610b0d] font-semibold">{rev.productName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Stars and Status Badge */}
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                              <div className="flex items-center gap-0.5" title={`${rev.rating} من 5 نجوم`}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= (Number(rev.rating) || 5)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-gray-200"
                                    }`}
                                  />
                                ))}
                                <span className="font-mono text-xs font-bold text-gray-700 ms-1">
                                  {rev.rating}/5
                                </span>
                              </div>

                              <div>
                                {isApproved && (
                                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>{adminLang === "ar" ? "معتمد ومنشور" : "Approved"}</span>
                                  </span>
                                )}
                                {isPending && (
                                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center gap-1 animate-pulse">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>{adminLang === "ar" ? "بانتظار الموافقة" : "Pending"}</span>
                                  </span>
                                )}
                                {isRejected && (
                                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300 flex items-center gap-1">
                                    <X className="w-3 h-3 text-rose-600" />
                                    <span>{adminLang === "ar" ? "مرفوض ومخفي" : "Rejected"}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Review Title & Content Body */}
                          <div className="space-y-1.5 text-start">
                            {rev.title && (
                              <h5 className="font-bold text-xs sm:text-sm text-[#485c36]">
                                «{rev.title}»
                              </h5>
                            )}
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-cairo whitespace-pre-line bg-[#fcfdfa] p-3.5 rounded-2xl border border-gray-100">
                              {rev.comment}
                            </p>
                          </div>

                          {/* Actions Toolbar */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              {/* Pending Review Actions */}
                              {isPending && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveReview(rev.id)}
                                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{adminLang === "ar" ? "اعتماد ونشر بالمتجر ✓" : "Approve & Publish"}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectReview(rev.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>{adminLang === "ar" ? "رفض" : "Reject"}</span>
                                  </button>
                                </>
                              )}

                              {/* Approved Review Actions */}
                              {isApproved && (
                                <button
                                  type="button"
                                  onClick={() => handleUnapproveReview(rev.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                  title="إلغاء النشر وإعادة التقييم إلى قائمة المراجعة"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>{adminLang === "ar" ? "إلغاء الاعتماد (إرجاع للمراجعة)" : "Unpublish"}</span>
                                </button>
                              )}

                              {/* Rejected Review Actions */}
                              {isRejected && (
                                <button
                                  type="button"
                                  onClick={() => handleApproveReview(rev.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>{adminLang === "ar" ? "إعادة الاعتماد والنشر" : "Re-approve"}</span>
                                </button>
                              )}
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev.id)}
                              className="p-2 rounded-xl bg-gray-50 hover:bg-rose-100 text-gray-500 hover:text-rose-700 transition-colors cursor-pointer"
                              title="حذف هذا الرأي نهائياً"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* TAB 4: COUPONS & DISCOUNT ENGINE                          */}
          {/* ========================================================= */}
          {activeTab === "coupons" && (
            couponModalOpen ? (
              /* INLINE COUPON WORKSPACE (NO POPUP) */
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCouponModalOpen(false)}
                      className="px-4 py-2.5 rounded-2xl bg-[#f6f9e6] hover:bg-[#485c36] hover:text-white text-[#3d502d] transition-all flex items-center gap-2 text-xs font-bold border border-[#dbe2bd] cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "← العودة لقائمة الكوبونات" : "← Back to Coupons List"}</span>
                    </button>
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    <div>
                      <h2 className="font-bold text-xl sm:text-2xl text-gray-900">
                        {adminLang === "ar" ? "إنشاء كود خصم جديد وتفعيله" : "Create & Activate Discount Coupon"}
                      </h2>
                      <span className="text-xs text-gray-500 font-mono">
                        {couponForm.code || "SULAF-CODE"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCouponModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    {adminLang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dbe2bd] shadow-sm max-w-2xl">
                  <form onSubmit={handleSaveCoupon} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">كود الخصم (Coupon Code) *</label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        placeholder="مثال: SULAF20 أو VIP100"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono font-bold uppercase focus:border-[#3d502d] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">نوع الخصم</label>
                        <select
                          value={couponForm.discountType}
                          onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                        >
                          <option value="PERCENTAGE">نسبة مئوية (%)</option>
                          <option value="FIXED">مبلغ ثابت (ج.م)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">قيمة الخصم *</label>
                        <input
                          type="number"
                          value={couponForm.discountValue}
                          onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-[#3d502d] focus:border-[#3d502d] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">الحد الأدنى لقيمة الطلب (ج.م)</label>
                      <input
                        type="number"
                        value={couponForm.minOrderAmount}
                        onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">تاريخ انتهاء الصلاحية</label>
                      <input
                        type="date"
                        value={couponForm.expiryDate}
                        onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1.5">ملاحظات الكوبون</label>
                      <input
                        type="text"
                        value={couponForm.notes}
                        onChange={(e) => setCouponForm({ ...couponForm, notes: e.target.value })}
                        placeholder="عرض خاص لحملة إنستغرام أو لعملاء VIP..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setCouponModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs"
                      >
                        {adminLang === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2d3b21] text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>{adminLang === "ar" ? "إنشاء الكوبون وتفعيله فوراً ✓" : "Create & Activate Coupon ✓"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                <div>
                  <h2 className="font-bold text-2xl text-gray-900">محرك كوبونات الخصم والعروض</h2>
                  <p className="text-xs text-gray-600 mt-1 font-semibold">
                    إنشاء وإدارة أكواد الخصم وتفعيلها فورياً لتعمل في سلة الشراء وصفحة الدفع.
                  </p>
                </div>
                <button
                  onClick={() => setCouponModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#3d502d] hover:bg-[#2d3b21] text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء كود خصم جديد</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                      <tr>
                        <th className="py-4 px-6">كود الكوبون</th>
                        <th className="py-4 px-6">نوع وقيمة الخصم</th>
                        <th className="py-4 px-6">الحد الأدنى للطلب</th>
                        <th className="py-4 px-6">مرات الاستخدام</th>
                        <th className="py-4 px-6">تاريخ الانتهاء</th>
                        <th className="py-4 px-6">الحالة</th>
                        <th className="py-4 px-6 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coupons.map((coupon) => (
                        <tr key={coupon.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-4 px-6">
                            <span className="font-mono font-black text-base text-[#3d502d] bg-[#f6f9e6] px-3 py-1 rounded-xl border border-[#dbe2bd]">
                              {coupon.code}
                            </span>
                            {coupon.notes && <div className="text-xs text-gray-500 mt-1">{coupon.notes}</div>}
                          </td>

                          <td className="py-4 px-6 font-bold text-gray-900">
                            {coupon.discountType === "PERCENTAGE" ? (
                              <span className="text-emerald-700 font-black">{coupon.discountValue}% خصم</span>
                            ) : (
                              <span className="text-emerald-700 font-black">{coupon.discountValue} ج.م خصم ثابت</span>
                            )}
                          </td>

                          <td className="py-4 px-6 font-semibold text-gray-800">
                            {coupon.minOrderAmount ? `${coupon.minOrderAmount} ج.م` : "بدون حد أدنى"}
                          </td>

                          <td className="py-4 px-6 font-mono font-bold text-gray-900">
                            {coupon.usedCount || 0} مرات
                          </td>

                          <td className="py-4 px-6 font-mono text-xs text-gray-600">
                            {coupon.expiryDate || "غير محدد"}
                          </td>

                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleCoupon(coupon.id, coupon.isActive)}
                              className={`px-3 py-1 rounded-full text-xs font-black transition-colors ${
                                coupon.isActive
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {coupon.isActive ? "مفعّل ✓" : "معطل"}
                            </button>
                          </td>

                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 transition-colors"
                              title="حذف الكوبون"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            )
          )}

          {/* ========================================================= */}
          {/* TAB 5.5: VIP CUSTOMER PERKS & PERSONALIZED NOTIFICATIONS  */}
          {/* ========================================================= */}

          {/* ========================================================= */}
          {/* TAB 5.5: VIP CUSTOMER PERKS & PERSONALIZED NOTIFICATIONS  */}
          {/* ========================================================= */}
          {activeTab === "customers" && (() => {
            // 1. Calculate matching orders and stats for each registered customer
            const customersWithStats = registeredCustomers.map((c: any) => {
              const normEmail = (c.email || "").toLowerCase().trim();
              const normPhone = (c.phone || "").replace(/\D/g, "");

              const customerOrders = orders.filter((o: any) => {
                const oEmail = (o.customerEmail || "").toLowerCase().trim();
                const oPhone = (o.customerPhone || "").replace(/\D/g, "");
                const matchEmail = normEmail && oEmail && normEmail === oEmail;
                const matchPhone = normPhone && oPhone && (normPhone.endsWith(oPhone) || oPhone.endsWith(normPhone));
                return matchEmail || matchPhone;
              });

              const ordersCount = customerOrders.length;
              const totalSpend = customerOrders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
              const lastOrder = customerOrders.length > 0 ? customerOrders[0] : null;

              return {
                ...c,
                ordersCount,
                totalSpend,
                lastOrder,
                customerOrders,
              };
            });

            // 2. Counts per purchase tier
            const countAll = customersWithStats.length;
            const count1 = customersWithStats.filter((c: any) => c.ordersCount === 1).length;
            const count2 = customersWithStats.filter((c: any) => c.ordersCount === 2).length;
            const count3 = customersWithStats.filter((c: any) => c.ordersCount === 3).length;
            const count4Plus = customersWithStats.filter((c: any) => c.ordersCount >= 4).length;
            const count0 = customersWithStats.filter((c: any) => c.ordersCount === 0).length;

            // 3. Filter customers based on perkOrderFilter and perkCustomerSearch
            const filteredCustomers = customersWithStats.filter((c: any) => {
              // Order Count Dropdown filter
              if (perkOrderFilter === "1" && c.ordersCount !== 1) return false;
              if (perkOrderFilter === "2" && c.ordersCount !== 2) return false;
              if (perkOrderFilter === "3" && c.ordersCount !== 3) return false;
              if (perkOrderFilter === "4+" && c.ordersCount < 4) return false;
              if (perkOrderFilter === "0" && c.ordersCount !== 0) return false;

              // Text Search filter
              if (perkCustomerSearch.trim()) {
                const q = perkCustomerSearch.trim().toLowerCase();
                const matchName = (c.name || "").toLowerCase().includes(q);
                const matchPhone = (c.phone || "").includes(q);
                const matchEmail = (c.email || "").toLowerCase().includes(q);
                const matchCity = (c.city || "").toLowerCase().includes(q);
                const matchGov = (c.governorate || "").toLowerCase().includes(q);
                if (!matchName && !matchPhone && !matchEmail && !matchCity && !matchGov) return false;
              }

              return true;
            });

            const currentSelectedCustomer = customersWithStats.find((c: any) => c.id === selectedPerkCustomerId);
            const displayedCustomers = selectedPerkCustomerId === "ALL"
              ? filteredCustomers
              : filteredCustomers.filter((c: any) => c.id === selectedPerkCustomerId);

            // Collect all custom coupons across displayed customers
            const allAssignedCoupons: any[] = [];
            displayedCustomers.forEach((cust: any) => {
              if (cust.customCoupons) {
                cust.customCoupons.forEach((cp: any) => {
                  allAssignedCoupons.push({ ...cp, customerName: cust.name, customerPhone: cust.phone, customerId: cust.id });
                });
              }
            });

            // Collect all custom notifications across displayed customers
            const allAssignedNotifications: any[] = [];
            displayedCustomers.forEach((cust: any) => {
              if (cust.customNotifications) {
                cust.customNotifications.forEach((nt: any) => {
                  allAssignedNotifications.push({ ...nt, customerName: cust.name, customerPhone: cust.phone, customerId: cust.id });
                });
              }
            });

            return (
              <div className="space-y-6">
                {/* 1. Header Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#2c3821] via-[#3a4d2c] to-[#1c2616] p-6 sm:p-8 rounded-3xl text-white shadow-md border-2 border-[#d4af37]/40">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-amber-300">
                        <Gift className="w-5 h-5" />
                      </div>
                      <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#fbf9f0]">
                        {adminLang === "ar" ? "العملاء ومكافآت VIP" : "Customers & VIP Perks"}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                      {adminLang === "ar"
                        ? "تحكم حصري في تخصيص كوبونات خصم استثنائية لعميل محدد أو لفئة شراء معينة، مع إرسال إشعارات وبنرات ترحيبية تظهر في حسابه فور تسجيل دخوله."
                        : "Assign exclusive discounts and push welcome banners directly visible when the customer logs into their portal."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={exportCustomersCsv}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-300" />
                      <span>{adminLang === "ar" ? "تصدير العملاء CSV" : "Export CSV"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAssignPerkModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f20] hover:from-[#e5c048] hover:to-[#c49f31] text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "تخصيص كوبون جديد" : "Assign VIP Coupon"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendPerkNotifModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Bell className="w-4 h-4 text-amber-300" />
                      <span>{adminLang === "ar" ? "إرسال إشعار وبنر" : "Send VIP Banner"}</span>
                    </button>
                  </div>
                </div>

                {/* INLINE VIP PERK FORMS (NO POPUP) */}
                {assignPerkModalOpen && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-amber-300 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Gift className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-amiri text-xl font-bold text-gray-900">
                            {adminLang === "ar" ? "تخصيص كود خصم لعميل مسجل" : "Assign VIP Discount Code"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {adminLang === "ar" ? "إضافة كوبون خاص بحساب العميل مع إمكانية إشعاره تلقائياً" : "Create a coupon assigned to this customer with auto-notice"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAssignPerkModalOpen(false)}
                        className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-black rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        {adminLang === "ar" ? "إغلاق ✕" : "Close ✕"}
                      </button>
                    </div>

                    <form onSubmit={handleAssignPerkCoupon} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          {adminLang === "ar" ? "العميل المستهدف" : "Target Customer"} *
                        </label>
                        <select
                          value={selectedPerkCustomerId}
                          onChange={(e) => setSelectedPerkCustomerId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#fcfdfa] focus:border-[#3d502d] focus:outline-none"
                        >
                          <option value="ALL">
                            {adminLang === "ar" ? "🌟 جميع العملاء المسجلين (ALL VIP Customers)" : "🌟 All Registered Customers"}
                          </option>
                          {customersWithStats.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              👤 {c.name} ({c.ordersCount === 1 ? (adminLang === "ar" ? "طلب واحد" : "1 order") : c.ordersCount === 2 ? (adminLang === "ar" ? "طلبين" : "2 orders") : `${c.ordersCount} ${adminLang === "ar" ? "طلبات" : "orders"}`} • {c.totalSpend.toLocaleString()} ج.م) - {c.phone}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "كود الخصم (Coupon Code)" : "Coupon Code"} *
                          </label>
                          <input
                            type="text"
                            required
                            value={perkCouponForm.code}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, code: e.target.value.toUpperCase() })}
                            placeholder="VIP-SULAF-20"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold uppercase focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "نوع الخصم" : "Discount Type"}
                          </label>
                          <select
                            value={perkCouponForm.discountType}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, discountType: e.target.value as any })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#fcfdfa] focus:border-[#3d502d] focus:outline-none"
                          >
                            <option value="PERCENTAGE">{adminLang === "ar" ? "نسبة مئوية (%)" : "Percentage (%)"}</option>
                            <option value="FIXED">{adminLang === "ar" ? "مبلغ ثابت (ج.م)" : "Fixed Amount (EGP)"}</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "قيمة الخصم" : "Discount Value"} *
                          </label>
                          <input
                            type="number"
                            required
                            value={perkCouponForm.discountValue}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, discountValue: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "الحد الأدنى للطلب (ج.م)" : "Min Order (EGP)"}
                          </label>
                          <input
                            type="number"
                            value={perkCouponForm.minOrderAmount}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, minOrderAmount: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}
                          </label>
                          <input
                            type="date"
                            value={perkCouponForm.expiryDate}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, expiryDate: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "الوصف بالعربي" : "Description (AR)"}
                          </label>
                          <input
                            type="text"
                            value={perkCouponForm.descAr}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, descAr: e.target.value })}
                            placeholder="هدية خاصة لعميلنا المتميز..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "الوصف بالإنجليزي" : "Description (EN)"}
                          </label>
                          <input
                            type="text"
                            value={perkCouponForm.descEn}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, descEn: e.target.value })}
                            placeholder="Special VIP gift discount..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={perkCouponForm.autoNotify}
                            onChange={(e) => setPerkCouponForm({ ...perkCouponForm, autoNotify: e.target.checked })}
                            className="w-4 h-4 text-amber-600 rounded"
                          />
                          <span className="text-xs font-bold text-amber-950">
                            {adminLang === "ar" ? "إظهار إشعار ترحيبي عاجل في حساب العميل فور تسجيل دخوله بهذا الكوبون" : "Auto-display welcome banner in customer portal with this code"}
                          </span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button
                          type="button"
                          onClick={() => setAssignPerkModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                        >
                          {adminLang === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                          type="submit"
                          disabled={isPerkSubmitting}
                          className="px-6 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2d3b21] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isPerkSubmitting
                            ? (adminLang === "ar" ? "جاري التخصيص..." : "Assigning...")
                            : (adminLang === "ar" ? "تخصيص الكوبون فورياً ✓" : "Assign Coupon Now ✓")}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {sendPerkNotifModalOpen && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-indigo-300 space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-amiri text-xl font-bold text-gray-900">
                            {adminLang === "ar" ? "إرسال إشعار وبنر ترحيبي لعميل" : "Send VIP Welcome Banner"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {adminLang === "ar" ? "يظهر البنر بأعلى لوحة العميل فور تسجيل دخوله مع زر نسخ الكود" : "Renders prominently at top of customer portal upon login"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSendPerkNotifModalOpen(false)}
                        className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-black rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        {adminLang === "ar" ? "إغلاق ✕" : "Close ✕"}
                      </button>
                    </div>

                    <form onSubmit={handleSendPerkNotification} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          {adminLang === "ar" ? "العميل المستهدف" : "Target Customer"} *
                        </label>
                        <select
                          value={selectedPerkCustomerId}
                          onChange={(e) => setSelectedPerkCustomerId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#fcfdfa] focus:border-[#3d502d] focus:outline-none"
                        >
                          <option value="ALL">
                            {adminLang === "ar" ? "🌟 جميع العملاء المسجلين (ALL VIP Customers)" : "🌟 All Registered Customers"}
                          </option>
                          {customersWithStats.map((c: any) => (
                            <option key={c.id} value={c.id}>
                              👤 {c.name} ({c.ordersCount === 1 ? (adminLang === "ar" ? "طلب واحد" : "1 order") : c.ordersCount === 2 ? (adminLang === "ar" ? "طلبين" : "2 orders") : `${c.ordersCount} ${adminLang === "ar" ? "طلبات" : "orders"}`} • {c.totalSpend.toLocaleString()} ج.م) - {c.phone}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "عنوان الإشعار بالعربي" : "Title (AR)"} *
                          </label>
                          <input
                            type="text"
                            required
                            value={perkNotifForm.titleAr}
                            onChange={(e) => setPerkNotifForm({ ...perkNotifForm, titleAr: e.target.value })}
                            placeholder="مرحباً بك مجدداً..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "العنوان بالإنجليزي" : "Title (EN)"}
                          </label>
                          <input
                            type="text"
                            value={perkNotifForm.titleEn}
                            onChange={(e) => setPerkNotifForm({ ...perkNotifForm, titleEn: e.target.value })}
                            placeholder="Welcome back..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "نص الإشعار بالعربي" : "Message (AR)"} *
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={perkNotifForm.messageAr}
                            onChange={(e) => setPerkNotifForm({ ...perkNotifForm, messageAr: e.target.value })}
                            placeholder="تم تخصيص خصم حصري لك بقيمة 15%..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "النص بالإنجليزي" : "Message (EN)"}
                          </label>
                          <textarea
                            rows={3}
                            value={perkNotifForm.messageEn}
                            onChange={(e) => setPerkNotifForm({ ...perkNotifForm, messageEn: e.target.value })}
                            placeholder="An exclusive 15% discount has been assigned..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:border-[#3d502d] focus:outline-none"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "إرفاق كود الخصم (اختياري)" : "Attach Coupon Code"}
                          </label>
                          <input
                            type="text"
                            value={perkNotifForm.couponCode}
                            onChange={(e) => setPerkNotifForm({ ...perkNotifForm, couponCode: e.target.value.toUpperCase() })}
                            placeholder="VIP-SULAF-20"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold uppercase focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            {adminLang === "ar" ? "نوع الإشعار" : "Banner Style"}
                          </label>
                          <select
                            value={perkNotifForm.type}
                            onChange={(e) => setPerkNotifForm({ ...perkNotifForm, type: e.target.value as any })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold bg-[#fcfdfa] focus:border-[#3d502d] focus:outline-none"
                          >
                            <option value="gift">{adminLang === "ar" ? "هدية وترقية (ذهبي)" : "Gift & Upgrade (Gold)"}</option>
                            <option value="discount">{adminLang === "ar" ? "خصم ترويجي (أخضر)" : "Discount (Green)"}</option>
                            <option value="clinical">{adminLang === "ar" ? "توصية سريرية (كحلي)" : "Clinical Advice (Blue)"}</option>
                            <option value="general">{adminLang === "ar" ? "إشعار عام" : "General"}</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button
                          type="button"
                          onClick={() => setSendPerkNotifModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                        >
                          {adminLang === "ar" ? "إلغاء" : "Cancel"}
                        </button>
                        <button
                          type="submit"
                          disabled={isPerkSubmitting}
                          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isPerkSubmitting
                            ? (adminLang === "ar" ? "جاري الإرسال..." : "Sending...")
                            : (adminLang === "ar" ? "إرسال البنر فورياً ✓" : "Send Banner Now ✓")}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 2. VIP CUSTOMERS COHORT & PURCHASE FREQUENCY FILTER */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-6">
                  {/* Top Header & Title */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#dbe2bd]/70 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#3d502d]/10 text-[#3d502d] flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-amiri text-xl font-bold text-gray-900">
                            {adminLang === "ar" ? "تصفية وفلترة عملاء VIP حسب تكرار الشراء" : "VIP Customer Cohorts by Order Count"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {adminLang === "ar"
                              ? "فلترة دقيقة للعملاء الذين اشتروا مرة أو مرتين أو 3 أو أكثر لاستهدافهم بالكوبونات والخصومات الحصرية."
                              : "Filter registered customers by exact order frequency (1, 2, 3, or 4+ purchases) to reward loyal buyers."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <div className="px-3.5 py-1.5 rounded-xl bg-[#f6f9e6] border border-[#dbe2bd] text-xs font-bold text-[#3d502d]">
                        <span>{adminLang === "ar" ? "إجمالي المسجلين:" : "Registered:"}</span>{" "}
                        <strong className="font-mono text-sm">{registeredCustomers.length}</strong>
                      </div>
                      <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                        <span>{adminLang === "ar" ? "المطابق للفلتر:" : "Filtered:"}</span>{" "}
                        <strong className="font-mono text-sm">{filteredCustomers.length}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => loadLiveBackendData(false)}
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors cursor-pointer"
                        title={adminLang === "ar" ? "تحديث البيانات" : "Refresh"}
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Filter Toolbar: Dropdown Menu & Instant Search */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end bg-[#fcfdfa] p-4 sm:p-5 rounded-2xl border border-[#dbe2bd]">
                    {/* The Order Frequency Dropdown Menu (Directly addressing user request) */}
                    <div className="md:col-span-5 space-y-1.5">
                      <label className="block text-xs font-black text-gray-800 flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-[#3d502d]" />
                        <span>{adminLang === "ar" ? "اختر تكرار الشراء من القائمة المنسدلة:" : "Filter by Purchase Frequency (Dropdown):"}</span>
                      </label>
                      <select
                        value={perkOrderFilter}
                        onChange={(e) => {
                          setPerkOrderFilter(e.target.value);
                          setSelectedPerkCustomerId("ALL");
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#d4af37] text-sm font-bold text-gray-900 focus:outline-none focus:border-[#3d502d] shadow-xs cursor-pointer"
                      >
                        <option value="ALL">
                          {adminLang === "ar" ? `🌟 جميع العملاء المسجلين (الكل - ${countAll} عميل)` : `🌟 All Customers (${countAll})`}
                        </option>
                        <option value="1">
                          {adminLang === "ar" ? `🛍️ اشتروا مرة واحدة فقط (1 طلب - ${count1} عميل)` : `🛍️ 1 Order (${count1} customers)`}
                        </option>
                        <option value="2">
                          {adminLang === "ar" ? `🛍️🛍️ اشتروا مرتين (طلبين - ${count2} عملاء)` : `🛍️🛍️ 2 Orders (${count2} customers)`}
                        </option>
                        <option value="3">
                          {adminLang === "ar" ? `💎 اشتروا 3 مرات (3 طلبات - ${count3} عملاء)` : `💎 3 Orders (${count3} customers)`}
                        </option>
                        <option value="4+">
                          {adminLang === "ar" ? `👑 اشتروا 4 مرات أو أكثر (عملاء VIP دائمون - ${count4Plus} عملاء)` : `👑 4+ Orders (${count4Plus} customers)`}
                        </option>
                        <option value="0">
                          {adminLang === "ar" ? `⏳ لم يشتروا بعد (0 طلبات - ${count0} عميل)` : `⏳ 0 Orders (${count0} customers)`}
                        </option>
                      </select>
                    </div>

                    {/* Instant Search input */}
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                        <Search className="w-3.5 h-3.5 text-gray-500" />
                        <span>{adminLang === "ar" ? "بحث بالاسم أو الهاتف أو الإيميل:" : "Search Name, Phone, Email:"}</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={perkCustomerSearch}
                          onChange={(e) => setPerkCustomerSearch(e.target.value)}
                          placeholder={adminLang === "ar" ? "اكتب للبحث السريع..." : "Type to search..."}
                          className="w-full px-3.5 py-2.5 pl-8 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#3d502d]"
                        />
                        {perkCustomerSearch && (
                          <button
                            type="button"
                            onClick={() => setPerkCustomerSearch("")}
                            className="absolute left-2.5 top-2.5 text-gray-400 hover:text-black text-xs font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Target Customer Direct Filter */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="block text-xs font-bold text-gray-700">
                        {adminLang === "ar" ? "تحديد عميل لعرض سجل كوبوناته:" : "Isolate Customer View:"}
                      </label>
                      <select
                        value={selectedPerkCustomerId}
                        onChange={(e) => setSelectedPerkCustomerId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 focus:outline-none focus:border-[#3d502d]"
                      >
                        <option value="ALL">
                          {adminLang === "ar" ? "عرض كوبونات الجميع (ALL)" : "All Filtered Customers"}
                        </option>
                        {filteredCustomers.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            👤 {c.name} ({c.ordersCount} طلب)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick-filter interactive badges (pills) */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-gray-500 ml-1">
                      {adminLang === "ar" ? "تصفية سريعة بنقرة واحدة:" : "Quick Filter:"}
                    </span>

                    <button
                      type="button"
                      onClick={() => { setPerkOrderFilter("ALL"); setSelectedPerkCustomerId("ALL"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        perkOrderFilter === "ALL"
                          ? "bg-[#3d502d] text-white shadow-xs"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {adminLang === "ar" ? "الكل" : "All"} ({countAll})
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPerkOrderFilter("1"); setSelectedPerkCustomerId("ALL"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        perkOrderFilter === "1"
                          ? "bg-sky-700 text-white shadow-xs"
                          : "bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200"
                      }`}
                    >
                      <span>🛍️ {adminLang === "ar" ? "اشتروا مرة (1)" : "1 Order"}</span>
                      <span className="text-[10px] font-mono opacity-80">({count1})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPerkOrderFilter("2"); setSelectedPerkCustomerId("ALL"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        perkOrderFilter === "2"
                          ? "bg-[#3d502d] text-white shadow-xs"
                          : "bg-[#eef4e4] hover:bg-[#e4eccf] text-[#3d502d] border border-[#dbe2bd]"
                      }`}
                    >
                      <span>🛍️🛍️ {adminLang === "ar" ? "اشتروا مرتين (2)" : "2 Orders"}</span>
                      <span className="text-[10px] font-mono opacity-80">({count2})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPerkOrderFilter("3"); setSelectedPerkCustomerId("ALL"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        perkOrderFilter === "3"
                          ? "bg-emerald-800 text-white shadow-xs"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      <span>💎 {adminLang === "ar" ? "اشتروا 3 مرات (3)" : "3 Orders"}</span>
                      <span className="text-[10px] font-mono opacity-80">({count3})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPerkOrderFilter("4+"); setSelectedPerkCustomerId("ALL"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        perkOrderFilter === "4+"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      <span>👑 {adminLang === "ar" ? "اشتروا 4 مرات أو أكثر (4+)" : "4+ Orders"}</span>
                      <span className="text-[10px] font-mono opacity-80">({count4Plus})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPerkOrderFilter("0"); setSelectedPerkCustomerId("ALL"); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        perkOrderFilter === "0"
                          ? "bg-gray-800 text-white shadow-xs"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                      }`}
                    >
                      <span>⏳ {adminLang === "ar" ? "لم يشتروا بعد (0)" : "0 Orders"}</span>
                      <span className="text-[10px] font-mono opacity-80">({count0})</span>
                    </button>
                  </div>

                  {/* DISPLAY FILTERED USERS TABLE / CARDS ("يظهر اليوزرز اللي اشتروا الكميات دي") */}
                  {filteredCustomers.length === 0 ? (
                    <div className="p-10 text-center rounded-2xl bg-gray-50 border border-dashed border-gray-300 space-y-2">
                      <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto" />
                      <h4 className="font-bold text-gray-800 text-sm">
                        {adminLang === "ar"
                          ? "لا يوجد عملاء يطابقون فلتر عدد الطلبات المحدد حالياً"
                          : "No customers match the selected order count filter"}
                      </h4>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        {adminLang === "ar"
                          ? "يمكنك اختيار 'جميع العملاء' أو فلتر آخر لعرض باقي المسجلين."
                          : "Select 'All Customers' or another filter to see registered users."}
                      </p>
                      <button
                        type="button"
                        onClick={() => { setPerkOrderFilter("ALL"); setPerkCustomerSearch(""); }}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-xs cursor-pointer mt-2"
                      >
                        {adminLang === "ar" ? "إعادة ضبط الفلتر للكل" : "Reset Filter to All"}
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[#dbe2bd] shadow-2xs">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                          <tr>
                            <th className="py-3.5 px-4">{adminLang === "ar" ? "العميل" : "Customer"}</th>
                            <th className="py-3.5 px-4">{adminLang === "ar" ? "بيانات التواصل" : "Contact"}</th>
                            <th className="py-3.5 px-4 text-center">{adminLang === "ar" ? "عدد مرات الشراء" : "Order Count"}</th>
                            <th className="py-3.5 px-4 text-center">{adminLang === "ar" ? "إجمالي الإنفاق" : "Total Spent"}</th>
                            <th className="py-3.5 px-4 text-center">{adminLang === "ar" ? "الكوبونات المخصصة" : "Assigned Perks"}</th>
                            <th className="py-3.5 px-4 text-center">{adminLang === "ar" ? "إجراءات وتخصيص" : "Actions"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {filteredCustomers.map((cust: any) => {
                            const isSelected = selectedPerkCustomerId === cust.id;
                            const couponCount = cust.customCoupons?.length || 0;
                            const notifCount = cust.customNotifications?.length || 0;

                            return (
                              <tr
                                key={cust.id}
                                className={`transition-colors ${
                                  isSelected ? "bg-amber-50/70 border-r-4 border-r-amber-500" : "hover:bg-[#fcfdfa]"
                                }`}
                              >
                                {/* Customer Info */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#3d502d] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-[#d4af37]/40 shadow-2xs">
                                      {cust.name?.charAt(0) || "U"}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <strong className="text-gray-900 text-sm font-bold block">{cust.name}</strong>
                                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full border border-amber-200">
                                          VIP
                                        </span>
                                      </div>
                                      <span className="text-[11px] text-gray-500 block">
                                        {cust.city ? `${cust.city} • ` : ""}{cust.governorate || "مصر"}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Contact */}
                                <td className="py-3.5 px-4">
                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-mono text-gray-800 font-bold text-xs">{cust.phone}</span>
                                      <a
                                        href={`https://wa.me/${(cust.phone || "").replace(/[^0-9]/g, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700"
                                        title="WhatsApp"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                      </a>
                                    </div>
                                    <span className="text-[11px] text-gray-500 block">{cust.email}</span>
                                  </div>
                                </td>

                                {/* Order Frequency Badge */}
                                <td className="py-3.5 px-4 text-center">
                                  {cust.ordersCount >= 4 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 shadow-2xs">
                                      👑 {cust.ordersCount} {adminLang === "ar" ? "طلبات VIP" : "Orders VIP"}
                                    </span>
                                  ) : cust.ordersCount === 3 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                                      💎 3 {adminLang === "ar" ? "طلبات" : "Orders"}
                                    </span>
                                  ) : cust.ordersCount === 2 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#eef4e4] text-[#3d502d] border border-[#dbe2bd]">
                                      🛍️🛍️ {adminLang === "ar" ? "طلبين" : "2 Orders"}
                                    </span>
                                  ) : cust.ordersCount === 1 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                                      🛍️ {adminLang === "ar" ? "طلب واحد" : "1 Order"}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                      ⏳ {adminLang === "ar" ? "0 طلبات" : "0 Orders"}
                                    </span>
                                  )}
                                </td>

                                {/* Total Spend */}
                                <td className="py-3.5 px-4 text-center">
                                  <strong className="font-mono text-xs font-black text-[#3d502d] block">
                                    {cust.totalSpend.toLocaleString()} ج.م
                                  </strong>
                                  {cust.ordersCount > 0 && (
                                    <span className="text-[10px] text-gray-400 block font-mono">
                                      ({Math.round(cust.totalSpend / cust.ordersCount).toLocaleString()} ج.م / طلب)
                                    </span>
                                  )}
                                </td>

                                {/* Assigned Perks count */}
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                                      couponCount > 0 ? "bg-amber-50 text-amber-900 border-amber-300" : "bg-gray-50 text-gray-400 border-gray-200"
                                    }`}>
                                      🎁 {couponCount}
                                    </span>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                                      notifCount > 0 ? "bg-indigo-50 text-indigo-900 border-indigo-200" : "bg-gray-50 text-gray-400 border-gray-200"
                                    }`}>
                                      🔔 {notifCount}
                                    </span>
                                  </div>
                                </td>

                                {/* Actions */}
                                <td className="py-3.5 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedPerkCustomerId(cust.id);
                                        setAssignPerkModalOpen(true);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-[#3d502d] hover:bg-[#2d3b21] text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                      title={adminLang === "ar" ? "تخصيص كوبون خصم فوري لهذا العميل" : "Assign VIP Coupon"}
                                    >
                                      <Gift className="w-3 h-3 text-amber-300" />
                                      <span>{adminLang === "ar" ? "تخصيص كود" : "Coupon"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedPerkCustomerId(cust.id);
                                        setSendPerkNotifModalOpen(true);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                      title={adminLang === "ar" ? "إرسال إشعار وبنر ترحيبي" : "Send Banner"}
                                    >
                                      <Bell className="w-3 h-3" />
                                      <span>{adminLang === "ar" ? "بنر" : "Banner"}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setSelectedPerkCustomerId(isSelected ? "ALL" : cust.id)}
                                      className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold transition-colors cursor-pointer ${
                                        isSelected
                                          ? "bg-amber-100 text-amber-900 border-amber-300"
                                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                      }`}
                                      title={adminLang === "ar" ? "تصفية سجل الكوبونات بالأسفل لهذا العميل" : "Filter Coupons Table"}
                                    >
                                      {isSelected ? (adminLang === "ar" ? "إلغاء التحديد" : "Deselect") : (adminLang === "ar" ? "عرض الكوبونات" : "View Perks")}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Selected Customer Highlight Card (if a single customer is selected) */}
                  {currentSelectedCustomer && selectedPerkCustomerId !== "ALL" && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fbfdf7] to-[#f6f9e6] border-2 border-[#3d502d]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-[#3d502d] text-white flex items-center justify-center font-amiri font-bold text-lg border-2 border-[#d4af37]/40 shrink-0 shadow-xs">
                          {currentSelectedCustomer.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base text-gray-900">{currentSelectedCustomer.name}</h4>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                              {currentSelectedCustomer.ordersCount >= 4 ? "Elite VIP (4+)" : currentSelectedCustomer.ordersCount === 3 ? "Diamond VIP (3)" : "VIP Customer"}
                            </span>
                            <span className="text-xs font-black text-[#3d502d] bg-white px-2 py-0.5 rounded-lg border border-[#dbe2bd]">
                              {currentSelectedCustomer.ordersCount} {adminLang === "ar" ? "طلبات" : "orders"} • {currentSelectedCustomer.totalSpend.toLocaleString()} ج.م
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">
                            <span>{currentSelectedCustomer.email}</span> • <span className="font-mono">{currentSelectedCustomer.phone}</span>
                            {currentSelectedCustomer.city && <span> • {currentSelectedCustomer.city}</span>}
                          </p>
                          <span className="text-[10px] text-gray-500 block">
                            {adminLang === "ar" ? "مسجل منذ:" : "Registered:"} {currentSelectedCustomer.registeredAt}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                        <button
                          type="button"
                          onClick={() => setAssignPerkModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#3d502d] hover:bg-[#2d3b21] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Gift className="w-3.5 h-3.5 text-amber-300" />
                          <span>{adminLang === "ar" ? "إضافة كوبون لهذا الحساب" : "Assign Coupon"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSendPerkNotifModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>{adminLang === "ar" ? "إرسال إشعار ترحيبي" : "Send Banner"}</span>
                        </button>
                        <a
                          href={`https://wa.me/${(currentSelectedCustomer.phone || "").replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => setSelectedPerkCustomerId("ALL")}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold cursor-pointer"
                        >
                          {adminLang === "ar" ? "عرض الجميع" : "Show All"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Section 1: Assigned Custom Coupons */}
                <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden space-y-0">
                  <div className="p-6 border-b border-[#dbe2bd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#fcfdfa]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-[#3d502d]" />
                        <h3 className="font-bold text-lg text-gray-900">
                          {adminLang === "ar" ? "سجل الكوبونات والخصومات المخصصة للعملاء" : "Assigned VIP Coupons Directory"}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {adminLang === "ar"
                          ? "أكواد الخصم النشطة المخصصة حصرياً لحسابات العملاء، تظهر في صفحاتهم الشخصية وتعمل تلقائياً عند الدفع."
                          : "Exclusive promo codes assigned to customer accounts, displayed in their portal and validated at checkout."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAssignPerkModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#3d502d] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{adminLang === "ar" ? "تخصيص كود جديد" : "New VIP Code"}</span>
                    </button>
                  </div>

                  {allAssignedCoupons.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 space-y-2">
                      <Gift className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-sm font-bold text-gray-700">
                        {adminLang === "ar" ? "لا توجد كوبونات مخصصة حتى الآن" : "No VIP coupons assigned yet"}
                      </p>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        {adminLang === "ar" ? "انقر على زر 'تخصيص كود جديد' لإضافة خصم استثنائي لعميل مسجل." : "Click 'New VIP Code' to assign an exclusive discount."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-sm">
                        <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                          <tr>
                            <th className="py-4 px-6">{adminLang === "ar" ? "العميل المستهدف" : "Customer"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "كود الخصم" : "Coupon Code"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "قيمة الخصم" : "Discount"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "عنوان ووصف الكوبون" : "Title & Details"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "تاريخ الانتهاء" : "Expiry Date"}</th>
                            <th className="py-4 px-6 text-center">{adminLang === "ar" ? "الحالة" : "Status"}</th>
                            <th className="py-4 px-6 text-center">{adminLang === "ar" ? "حذف" : "Action"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {allAssignedCoupons.map((cp, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-4 px-6">
                                <strong className="text-gray-900 block">{cp.customerName}</strong>
                                <span className="text-xs text-gray-500 font-mono">{cp.customerPhone}</span>
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-300 px-3 py-1 rounded-xl">
                                  {cp.code}
                                </span>
                              </td>
                              <td className="py-4 px-6 font-black text-[#3d502d]">
                                {cp.discountValue}{cp.discountType === "PERCENTAGE" ? "%" : " ج.م"}
                              </td>
                              <td className="py-4 px-6">
                                <div className="text-xs font-bold text-gray-800">{adminLang === "ar" ? cp.titleAr : (cp.titleEn || cp.titleAr)}</div>
                                <div className="text-[11px] text-gray-500 line-clamp-1">{adminLang === "ar" ? cp.descAr : (cp.descEn || cp.descAr)}</div>
                              </td>
                              <td className="py-4 px-6 font-mono text-xs text-gray-600">
                                {cp.expiryDate || "2026-12-31"}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  {adminLang === "ar" ? "مفعل ومتاح" : "Active"}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeletePerkCoupon(cp.customerId, cp.id || cp.code)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title={adminLang === "ar" ? "حذف هذا الكوبون" : "Delete coupon"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 4. Section 2: Sent Notifications & Welcome Banners */}
                <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden space-y-0">
                  <div className="p-6 border-b border-[#dbe2bd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#fcfdfa]">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-600" />
                        <h3 className="font-bold text-lg text-gray-900">
                          {adminLang === "ar" ? "سجل الإشعارات والبنرات الترحيبية للعملاء" : "Sent VIP Notifications & Banners"}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {adminLang === "ar"
                          ? "إشعارات تظهر كبنر ذهبي أعلى لوحة العميل عند دخوله، مع خيار إرفاق كود الخصم وزر النسخ السريع."
                          : "Notifications rendered as a golden banner at the top of the customer dashboard upon login."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSendPerkNotifModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{adminLang === "ar" ? "إرسال إشعار جديد" : "Send VIP Banner"}</span>
                    </button>
                  </div>

                  {allAssignedNotifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 space-y-2">
                      <Bell className="w-10 h-10 text-gray-300 mx-auto" />
                      <p className="text-sm font-bold text-gray-700">
                        {adminLang === "ar" ? "لم يتم إرسال إشعارات بعد" : "No VIP notifications sent yet"}
                      </p>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        {adminLang === "ar" ? "انقر على زر 'إرسال إشعار جديد' لإرسال رسالة ترحيبية أو إعلان خصم لحساب العميل." : "Click 'Send VIP Banner' to push an exclusive notice."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-sm">
                        <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                          <tr>
                            <th className="py-4 px-6">{adminLang === "ar" ? "العميل المستهدف" : "Customer"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "عنوان الإشعار" : "Notice Title"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "نص الرسالة والبنر" : "Banner Message"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "الكود المرفق" : "Attached Code"}</th>
                            <th className="py-4 px-6 text-center">{adminLang === "ar" ? "حالة القراءة" : "Status"}</th>
                            <th className="py-4 px-6">{adminLang === "ar" ? "تاريخ الإرسال" : "Sent Date"}</th>
                            <th className="py-4 px-6 text-center">{adminLang === "ar" ? "حذف" : "Action"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {allAssignedNotifications.map((nt, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-4 px-6">
                                <strong className="text-gray-900 block">{nt.customerName}</strong>
                                <span className="text-xs text-gray-500 font-mono">{nt.customerPhone}</span>
                              </td>
                              <td className="py-4 px-6 font-bold text-gray-800 text-xs">
                                {adminLang === "ar" ? nt.titleAr : (nt.titleEn || nt.titleAr)}
                              </td>
                              <td className="py-4 px-6 text-xs text-gray-600 max-w-xs">
                                <p className="line-clamp-2">{adminLang === "ar" ? nt.messageAr : (nt.messageEn || nt.messageAr)}</p>
                              </td>
                              <td className="py-4 px-6">
                                {nt.couponCode ? (
                                  <span className="font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg">
                                    {nt.couponCode}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs">-</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  nt.isRead
                                    ? "bg-gray-100 text-gray-600 border-gray-200"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-300"
                                }`}>
                                  {nt.isRead
                                    ? (adminLang === "ar" ? "تمت المشاهدة ✓" : "Viewed ✓")
                                    : (adminLang === "ar" ? "بانتظار الدخول ⏳" : "Pending Login ⏳")}
                                </span>
                              </td>
                              <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                {nt.createdAt || "2026-10-24"}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeletePerkNotification(nt.customerId, nt.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title={adminLang === "ar" ? "حذف هذا الإشعار" : "Delete notification"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* TAB 6: DETAILED ANALYTICS & FINANCIAL REPORTS             */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                <h2 className="font-bold text-2xl text-gray-900">لوحة التحليلات والمبيعات السريرية</h2>
                <p className="text-xs text-gray-600 mt-1 font-semibold">
                  تحليلات دقيقة لحركة الشراء، الإيرادات المجمعة، والتوزيع الجغرافي للطلبات في محافظات مصر.
                </p>
              </div>

              {/* 7-Day Trend Chart */}
              <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-base text-gray-900">حجم المبيعات الأسبوعي (7-Day Sales Trend)</h3>
                    <p className="text-xs text-gray-500">قيمة المبيعات اليومية بالجنيه المصري</p>
                  </div>
                </div>

                <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 px-2 border-b border-gray-200">
                  {((analytics?.salesTrend as any[]) || []).map((item: any, idx: number) => {
                    const maxAmount = Math.max(1, ...((analytics?.salesTrend as any[]) || []).map((d: any) => Number(d.amount) || 0));
                    const heightPercent = Math.min(100, Math.max(15, (item.amount / maxAmount) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-10">
                          {item.amount} ج.م ({item.ordersCount} طلبات)
                        </div>
                        <div className="w-full max-w-[48px] bg-[#e8ecd0] hover:bg-[#3d502d] rounded-t-xl transition-all relative flex items-end justify-center" style={{ height: `${heightPercent}%` }}>
                          <span className="text-[10px] font-bold text-[#1c2616] group-hover:text-white mb-1">
                            {item.amount > 0 ? `${item.amount}` : ""}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-700 mt-2">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                  <h3 className="font-bold text-base text-gray-900 mb-4">التوزيع الجغرافي للطلبات (المحافظات)</h3>
                  <div className="space-y-3.5">
                    {((analytics?.governorates as any[]) || []).map((gov: any, idx: number) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-800">{gov.name}</span>
                          <span className="text-[#3d502d]">{gov.count} طلب ({gov.percentage}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3d502d] rounded-full transition-all"
                            style={{ width: `${gov.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                  <h3 className="font-bold text-base text-gray-900 mb-4">توزيع حالات الطلبات الحالية</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                      <div className="text-xs font-bold text-amber-900">قيد المراجعة</div>
                      <div className="text-2xl font-black text-amber-950 mt-1">
                        {orders.filter((o) => o.orderStatus === "PENDING_CONFIRMATION").length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                      <div className="text-xs font-bold text-blue-900">قيد التجهيز بالمختبر</div>
                      <div className="text-2xl font-black text-blue-950 mt-1">
                        {orders.filter((o) => o.orderStatus === "PROCESSING").length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                      <div className="text-xs font-bold text-purple-900">تم الشحن مع المندوب</div>
                      <div className="text-2xl font-black text-purple-950 mt-1">
                        {orders.filter((o) => o.orderStatus === "SHIPPED").length}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="text-xs font-bold text-emerald-900">تم التوصيل والتحصيل</div>
                      <div className="text-2xl font-black text-emerald-950 mt-1">
                        {orders.filter((o) => o.orderStatus === "DELIVERED").length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: SETTINGS & PAYMENT GATEWAY INTEGRATION             */}
          {/* ========================================================= */}
          
          {/* ========================================================= */}
          {/* TAB 6.5: DEDICATED SITE PAGES MANAGEMENT & INLINE EDITOR  */}
          {/* ========================================================= */}
          {activeTab === "pages" && (() => {
            // MODE A: INLINE PAGE EDITOR (NO POPUP - OPENS IN THE SAME PAGE!)
            if (pageEditorModalOpen) {
              return (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Top Inline Header & Return Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPageEditorModalOpen(false)}
                        className="px-4 py-2.5 rounded-2xl bg-[#f6f9e6] hover:bg-[#485c36] hover:text-white text-[#3d502d] transition-all flex items-center gap-2 text-xs font-bold cursor-pointer border border-[#dbe2bd] shadow-2xs"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>{adminLang === "ar" ? "← العودة لدليل صفحات الموقع" : "← Back to Pages Directory"}</span>
                      </button>
                      <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                      <div>
                        <h2 className="font-amiri text-2xl font-bold text-gray-900">
                          {editingPage
                            ? (adminLang === "ar" ? `تعديل محتوى: ${pageEditorForm.titleAr || editingPage.titleAr}` : `Edit: ${pageEditorForm.titleEn || editingPage.titleEn}`)
                            : (adminLang === "ar" ? "إنشاء وإضافة صفحة جديدة للمتجر" : "Create New Store Page")}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                          <span>{pageEditorForm.route || `/p/${pageEditorForm.slug || "page-slug"}`}</span>
                          {pageEditorForm.type === "builtin" && (
                            <span className="text-[10px] font-sans font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              صفحة أساسية بالنظام
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {pageEditorForm.slug && (
                        <Link
                          href={pageEditorForm.route || `/p/${pageEditorForm.slug}`}
                          target="_blank"
                          className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                          <span>{adminLang === "ar" ? "معاينة الرابط" : "Open URL"}</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => setPageEditorModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {adminLang === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="button"
                        disabled={isPageSaving}
                        onClick={handleSaveCustomPage}
                        className="px-6 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2b3a1f] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>
                          {isPageSaving
                            ? (adminLang === "ar" ? "جاري الحفظ..." : "Saving...")
                            : (adminLang === "ar" ? "حفظ وتحديث الصفحة الآن ✓" : "Save Page Now ✓")}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Editor Form Card */}
                  <form onSubmit={handleSaveCustomPage} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dbe2bd] shadow-sm space-y-6">
                    {/* Language & Preview Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
                        <button
                          type="button"
                          onClick={() => { setPageEditorLang("ar"); setPageEditorTab("edit"); }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            pageEditorLang === "ar" && pageEditorTab === "edit"
                              ? "bg-white text-[#3d502d] shadow-xs"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          🇸🇦 المحتوى بالعربية
                        </button>
                        <button
                          type="button"
                          onClick={() => { setPageEditorLang("en"); setPageEditorTab("edit"); }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            pageEditorLang === "en" && pageEditorTab === "edit"
                              ? "bg-white text-[#3d502d] shadow-xs"
                              : "text-gray-600 hover:text-black"
                          }`}
                        >
                          🇬🇧 Content in English
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPageEditorTab("edit")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            pageEditorTab === "edit" ? "bg-[#3d502d] text-white shadow-xs" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          المحرر المرئي
                        </button>
                        <button
                          type="button"
                          onClick={() => setPageEditorTab("preview")}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            pageEditorTab === "preview" ? "bg-amber-500 text-black shadow-xs" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>معاينة حية للمتجر</span>
                        </button>
                      </div>
                    </div>

                    {/* Basic Meta Fields: Title, Slug, Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pageEditorLang === "ar" ? (
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            عنوان الصفحة بالعربية (Page Title - AR) *
                          </label>
                          <input
                            type="text"
                            required
                            value={pageEditorForm.titleAr}
                            onChange={(e) => setPageEditorForm({ ...pageEditorForm, titleAr: e.target.value })}
                            placeholder="مثال: الفلسفة العلاجية أو تقرير الدراسة السريرية"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs font-bold text-gray-800 mb-1">
                            عنوان الصفحة بالإنجليزية (Page Title - EN)
                          </label>
                          <input
                            type="text"
                            value={pageEditorForm.titleEn}
                            onChange={(e) => setPageEditorForm({ ...pageEditorForm, titleEn: e.target.value })}
                            placeholder="e.g. Clinical Study Report or Our Philosophy"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold focus:border-[#3d502d] focus:outline-none"
                            dir="ltr"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          رابط ومسار الصفحة (URL Slug) {pageEditorForm.type === "builtin" && <span className="text-gray-400 font-normal">(صفحة نظام أساسية)</span>}
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-mono">
                            {pageEditorForm.type === "builtin" ? "/" : "/p/"}
                          </span>
                          <input
                            type="text"
                            required
                            disabled={pageEditorForm.type === "builtin"}
                            value={pageEditorForm.slug}
                            onChange={(e) => setPageEditorForm({ ...pageEditorForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                            placeholder="clinical-results"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono font-bold focus:border-[#3d502d] focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subtitle Field */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        {pageEditorLang === "ar" ? "الوصف المختصر / العنوان الفرعي (Subtitle - AR)" : "Subtitle Description (EN)"}
                      </label>
                      <input
                        type="text"
                        value={pageEditorLang === "ar" ? pageEditorForm.subtitleAr : pageEditorForm.subtitleEn}
                        onChange={(e) => {
                          if (pageEditorLang === "ar") {
                            setPageEditorForm({ ...pageEditorForm, subtitleAr: e.target.value });
                          } else {
                            setPageEditorForm({ ...pageEditorForm, subtitleEn: e.target.value });
                          }
                        }}
                        placeholder={pageEditorLang === "ar" ? "مقدمة سريعة توضح فكرة الصفحة ومحتواها..." : "Brief summary introducing the topic..."}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:border-[#3d502d] focus:outline-none"
                        dir={pageEditorLang === "ar" ? "rtl" : "ltr"}
                      />
                    </div>

                    {/* Main Content: Visual Editor vs Live Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-gray-800">
                          {pageEditorLang === "ar" ? "محتوى الصفحة المرئي (عربي 🇸🇦)" : "Visual Page Content (English 🇬🇧)"}
                        </label>
                        <span className="text-[11px] text-gray-500">
                          اكتب ونسق بسهولة دون الحاجة لكتابة أي وسوم HTML
                        </span>
                      </div>

                      {pageEditorTab === "edit" ? (
                        <PageContentEditor
                          value={pageEditorLang === "ar" ? (pageEditorForm.contentAr || "") : (pageEditorForm.contentEn || "")}
                          onChange={(newHtml) => {
                            if (pageEditorLang === "ar") {
                              setPageEditorForm(prev => ({ ...prev, contentAr: newHtml }));
                            } else {
                              setPageEditorForm(prev => ({ ...prev, contentEn: newHtml }));
                            }
                          }}
                          dir={pageEditorLang === "ar" ? "rtl" : "ltr"}
                          placeholder={pageEditorLang === "ar" ? "اكتبي هنا محتوى وتفاصيل الصفحة بحرية، واستخدمي شريط الأدوات بالأعلى لتنسيق العناوين والاقتباسات..." : "Write your page content here, using toolbar buttons to format headings and quotes..."}
                        />
                      ) : (
                        /* Live Store Preview Card */
                        <div className="p-8 sm:p-12 rounded-3xl bg-[#f6f9e6] border border-[#dbe2bd] space-y-6">
                          <div className="max-w-3xl mx-auto space-y-6">
                            <div className="p-8 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm space-y-3">
                              <span className="text-xs font-bold text-[#485c36] bg-[#485c36]/10 px-3 py-1 rounded-full">سُـلاف | معاينة حية</span>
                              <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-gray-900">
                                {pageEditorLang === "ar" ? pageEditorForm.titleAr : (pageEditorForm.titleEn || pageEditorForm.titleAr)}
                              </h1>
                              {(pageEditorLang === "ar" ? pageEditorForm.subtitleAr : pageEditorForm.subtitleEn) && (
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {pageEditorLang === "ar" ? pageEditorForm.subtitleAr : pageEditorForm.subtitleEn}
                                </p>
                              )}
                            </div>

                            <div
                              className="p-8 rounded-3xl bg-white border border-[#e2e8c0] shadow-sm text-gray-800 leading-[2.2] space-y-4
                                [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:border-b [&_h2]:border-gray-100 [&_h2]:pb-2
                                [&_h3]:font-amiri [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#610b0d]
                                [&_p]:text-sm [&_p]:text-gray-700
                                [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5
                                [&_strong]:text-gray-900 [&_strong]:font-bold"
                              dangerouslySetInnerHTML={{
                                __html: (pageEditorLang === "ar" ? pageEditorForm.contentAr : pageEditorForm.contentEn) || "<p class='text-gray-400 italic'>لا يوجد محتوى مكتوب بعد...</p>"
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Publish Checkbox */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <input
                        type="checkbox"
                        id="pagePublishedInline"
                        checked={pageEditorForm.published}
                        onChange={(e) => setPageEditorForm({ ...pageEditorForm, published: e.target.checked })}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="pagePublishedInline" className="text-xs font-bold text-emerald-950 cursor-pointer select-none">
                        {adminLang === "ar"
                          ? "نشر الصفحة وجعلها معروضة فوراً لزوار وعملاء المتجر (Published Live)"
                          : "Publish page live and make it accessible to store visitors"}
                      </label>
                    </div>

                    {/* Bottom Save Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setPageEditorModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {adminLang === "ar" ? "إلغاء والعودة للقائمة" : "Cancel & Return"}
                      </button>

                      <button
                        type="submit"
                        disabled={isPageSaving}
                        className="px-8 py-3 rounded-2xl bg-[#3d502d] hover:bg-[#2b3a1f] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        <span>
                          {isPageSaving
                            ? (adminLang === "ar" ? "جاري الحفظ..." : "Saving...")
                            : (adminLang === "ar" ? "حفظ وتحديث الصفحة الآن ✓" : "Save Page Now ✓")}
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              );
            }

            // MODE B: PAGES DIRECTORY LIST (WHEN NOT EDITING)
            const filteredPages = storePages.filter((p: any) => {
              if (pageFilter === "builtin" && p.type !== "builtin") return false;
              if (pageFilter === "custom" && p.type !== "custom") return false;
              if (pageSearch.trim()) {
                const q = pageSearch.toLowerCase();
                const matchAr = (p.titleAr || "").toLowerCase().includes(q);
                const matchEn = (p.titleEn || "").toLowerCase().includes(q);
                const matchSlug = (p.slug || "").toLowerCase().includes(q);
                return matchAr || matchEn || matchSlug;
              }
              return true;
            });

            return (
              <div className="space-y-6">
                {/* 1. Top Header Banner */}
                <div className="bg-gradient-to-r from-[#2c3821] via-[#3a4d2c] to-[#1c2616] p-6 sm:p-8 rounded-3xl text-white shadow-md border-2 border-[#d4af37]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-amber-300">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#fbf9f0]">
                        {adminLang === "ar" ? "تعديل صفحات الموقع وإدارة المحتوى" : "Site Pages Management & Editor"}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
                      {adminLang === "ar"
                        ? "قسم مخصص ومستقل للتحكم في كافة صفحات سُلاف (الفلسفة، قصتنا، الدليل، السياسات...) مع خاصية إضافة وتعديل الصفحات بمحرر نصوص مرئي متكامل."
                        : "Dedicated section to manage and customize all pages with full visual page creation and editor."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={openCreatePageModal}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#b38f20] hover:from-[#e5c048] hover:to-[#c49f31] text-black font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "إضافة صفحة جديدة للمتجر" : "Add New Page"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadLiveBackendData(false)}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                      title={adminLang === "ar" ? "تحديث القائمة" : "Refresh"}
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* 2. Key Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-[#dbe2bd] shadow-xs">
                    <div className="text-xs font-bold text-gray-500 mb-1">
                      {adminLang === "ar" ? "إجمالي الصفحات" : "Total Pages"}
                    </div>
                    <span className="font-mono text-2xl font-bold text-[#1c2616]">{storePages.length}</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#dbe2bd] shadow-xs">
                    <div className="text-xs font-bold text-[#485c36] mb-1">
                      {adminLang === "ar" ? "صفحات النظام الأساسية" : "Built-in Pages"}
                    </div>
                    <span className="font-mono text-2xl font-bold text-[#485c36]">
                      {storePages.filter((p: any) => p.type === "builtin").length}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#dbe2bd] shadow-xs">
                    <div className="text-xs font-bold text-amber-700 mb-1">
                      {adminLang === "ar" ? "صفحات مخصصة منشأة" : "Custom Pages"}
                    </div>
                    <span className="font-mono text-2xl font-bold text-amber-800">
                      {storePages.filter((p: any) => p.type === "custom").length}
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-[#dbe2bd] shadow-xs">
                    <div className="text-xs font-bold text-emerald-700 mb-1">
                      {adminLang === "ar" ? "الصفحات المنشورة والمعروضة" : "Published Live"}
                    </div>
                    <span className="font-mono text-2xl font-bold text-emerald-800">
                      {storePages.filter((p: any) => p.published).length}
                    </span>
                  </div>
                </div>

                {/* 3. Search and Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#dbe2bd] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-96">
                    <Search className="w-4 h-4 absolute right-3.5 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={pageSearch}
                      onChange={(e) => setPageSearch(e.target.value)}
                      placeholder={adminLang === "ar" ? "بحث بعنوان الصفحة أو المسار..." : "Search by title or slug..."}
                      className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#3d502d]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 self-start md:self-auto">
                    {[
                      { id: "ALL", labelAr: "كافة الصفحات", labelEn: "All Pages" },
                      { id: "builtin", labelAr: "الصفحات الأساسية", labelEn: "Built-in" },
                      { id: "custom", labelAr: "صفحات مخصصة", labelEn: "Custom" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPageFilter(f.id as any)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          pageFilter === f.id
                            ? "bg-[#3d502d] text-white shadow-xs"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {adminLang === "ar" ? f.labelAr : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Pages Table */}
                <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-[#f6f9e6] text-[#3d502d] text-xs font-bold border-b border-[#dbe2bd]">
                        <tr>
                          <th className="py-4 px-6">{adminLang === "ar" ? "عنوان الصفحة" : "Page Title"}</th>
                          <th className="py-4 px-6">{adminLang === "ar" ? "الرابط / المسار" : "Route / Slug"}</th>
                          <th className="py-4 px-6">{adminLang === "ar" ? "نوع الصفحة" : "Type"}</th>
                          <th className="py-4 px-6 text-center">{adminLang === "ar" ? "حالة العرض والنشر" : "Published"}</th>
                          <th className="py-4 px-6">{adminLang === "ar" ? "آخر تحديث" : "Updated"}</th>
                          <th className="py-4 px-6 text-center">{adminLang === "ar" ? "الإجراءات والـ Editor" : "Actions"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredPages.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-gray-500">
                              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                              <p className="font-bold text-gray-700">
                                {adminLang === "ar" ? "لا توجد صفحات مطابقة للبحث" : "No pages found"}
                              </p>
                            </td>
                          </tr>
                        ) : (
                          filteredPages.map((p: any) => (
                            <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-4 px-6">
                                <div className="font-bold text-gray-900">{adminLang === "ar" ? p.titleAr : (p.titleEn || p.titleAr)}</div>
                                <div className="text-[11px] text-gray-500 line-clamp-1">{adminLang === "ar" ? p.subtitleAr : (p.subtitleEn || "")}</div>
                              </td>

                              <td className="py-4 px-6">
                                <div className="flex items-center gap-1.5 font-mono text-xs text-[#3d502d] font-bold">
                                  <span>{p.route || `/p/${p.slug}`}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (typeof navigator !== "undefined") {
                                        navigator.clipboard.writeText(window.location.origin + (p.route || `/p/${p.slug}`));
                                        showToast(adminLang === "ar" ? "تم نسخ رابط الصفحة بنجاح ✓" : "Page URL copied ✓");
                                      }
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-black transition-colors cursor-pointer"
                                    title={adminLang === "ar" ? "نسخ الرابط" : "Copy URL"}
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                              <td className="py-4 px-6">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                  p.type === "builtin"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-purple-50 text-purple-800 border-purple-200"
                                }`}>
                                  {p.type === "builtin"
                                    ? (adminLang === "ar" ? "صفحة أساسية بالنظام" : "Built-in Page")
                                    : (adminLang === "ar" ? "صفحة مخصصة منشأة" : "Custom Page")}
                                </span>
                              </td>

                              <td className="py-4 px-6 text-center">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={p.published !== false}
                                    onChange={() => handleTogglePagePublished(p.id)}
                                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                  />
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    p.published !== false
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-gray-200 text-gray-700"
                                  }`}>
                                    {p.published !== false
                                      ? (adminLang === "ar" ? "معروض ✓" : "Live ✓")
                                      : (adminLang === "ar" ? "مسودة ✕" : "Draft ✕")}
                                  </span>
                                </label>
                              </td>

                              <td className="py-4 px-6 font-mono text-xs text-gray-500">
                                {p.updatedAt || "2026-10-24"}
                              </td>

                              <td className="py-4 px-6 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openEditPageModal(p)}
                                    className="px-3 py-1.5 rounded-xl bg-[#3d502d] hover:bg-[#2b3a1f] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>{adminLang === "ar" ? "تعديل بالـ Editor" : "Edit"}</span>
                                  </button>

                                  <Link
                                    href={p.route || `/p/${p.slug}`}
                                    target="_blank"
                                    className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                    title={adminLang === "ar" ? "معاينة الصفحة" : "Preview"}
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Link>

                                  {p.type === "custom" && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeletePage(p.id)}
                                      className="p-1.5 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                                      title={adminLang === "ar" ? "حذف الصفحة" : "Delete"}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            );
          })()}


          {/* ========================================================= */}
          {/* TAB: VISUAL CMS & SECTION / TEXT VISIBILITY MANAGER        */}
          {/* ========================================================= */}
          {activeTab === "cms" && (
            <div className="space-y-8">
              {/* Header Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dbe2bd] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
                    <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{adminLang === "ar" ? "لوحة التحكم المرئية الحية • Visual Storefront CMS" : "Visual Storefront CMS"}</span>
                  </div>
                  <h2 className="font-bold text-2xl text-gray-900">
                    {adminLang === "ar" ? "التحكم في الأقسام والنصوص (إظهار / إخفاء / تعديل)" : "Storefront Sections & Text Control (Show / Hide / Edit)"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 font-semibold">
                    {adminLang === "ar"
                      ? "يمكنك تفعيل أو إخفاء أي قسم أو أي نص بعلامة الصح [✔]، وتعديل محتوى أي نص مباشرة ليظهر فورياً بالمتجر."
                      : "Check or uncheck [✔] to show or hide any section or text element, and edit any text with instant live update."}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    type="button"
                    onClick={handleResetCmsDefaults}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {adminLang === "ar" ? "إعادة ضبط الافتراضيات" : "Reset Defaults"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCms}
                    disabled={isCmsSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2b3a1f] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{isCmsSaving ? (adminLang === "ar" ? "جاري الحفظ..." : "Saving...") : (adminLang === "ar" ? "حفظ كافة التعديلات الآن ✓" : "Save All Changes ✓")}</span>
                  </button>

                  <Link
                    href="/?live_edit=true"
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#485c36] via-[#3a4d2c] to-[#24301a] hover:from-[#610b0d] hover:to-[#610b0d] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-95 border border-[#d4af37]/50"
                    title="فتح المتجر بوضع التحرير المباشر لتعديل أي نص أو رابط بمجرد النقر عليه"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{adminLang === "ar" ? "⚡ تشغيل المحرر المباشر على المتجر" : "⚡ Launch Live Editor"}</span>
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-[#e8ecd0] hover:bg-[#dbe2bd] text-[#233019] font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{adminLang === "ar" ? "معاينة المتجر" : "Preview Store"}</span>
                  </Link>
                </div>
              </div>

              {/* SECTION 2: HOMEPAGE SECTIONS BUILDER & DEDICATED EDITORS */}
              <HomepageSectionBuilder
                sectionsOrder={cmsSectionsOrder}
                onReorder={setCmsSectionsOrder}
                cmsSections={cmsSections}
                onToggleBuiltinVisibility={(key, visible) => {
                  setCmsSections(prev => ({ ...prev, [key]: visible }));
                }}
                customSections={customSections}
                onUpdateCustomSections={setCustomSections}
                cmsContent={cmsContent}
                cmsContentEn={cmsContentEn}
                cmsElements={cmsElements}
                onUpdateContent={(content, isEn) => {
                  if (isEn) {
                    setCmsContentEn(content);
                  } else {
                    setCmsContent(content);
                  }
                }}
                onUpdateElements={setCmsElements}
                adminLang={adminLang}
                showToast={showToast}
              />

              {/* SECTION 3: SECTION-BY-SECTION TEXT & ELEMENT CMS EDITOR */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-[#233019] flex items-center gap-2">
                    <Edit className="w-5 h-5 text-[#485c36]" />
                    <span>{adminLang === "ar" ? "نصوص الشريط العلوي والفوتر وصفحات الموقع" : "Header, Footer & Site Pages Texts"}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {adminLang === "ar"
                      ? "اختر لغة النصوص التي تود تعديلها (عربي أو إنجليزي)، ثم حدد القسم وتحكم في أي نص داخله أو أظهره/أخفه بعلامة الصح [✔]."
                      : "Choose the storefront language to edit (Arabic or English), select a section, and customize any text or toggle its visibility."}
                  </p>
                </div>

                {/* DEDICATED LANGUAGE SELECTOR FOR STOREFRONT TEXTS */}
                <div className="bg-[#f6f9e6] p-4 rounded-2xl border border-[#dbe2bd] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1c2616]">
                      <Globe className="w-4 h-4 text-[#485c36]" />
                      <span>{adminLang === "ar" ? "اللغة الحالية للنصوص المراد تعديلها بالمتجر:" : "Storefront text language currently being edited:"}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5">
                      {cmsTargetLang === "ar"
                        ? "أنت تقوم الآن بتعديل نصوص النسخة العربية بالمتجر (Arabic Texts)."
                        : "You are currently editing texts for the English storefront (English Texts)."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-[#dbe2bd] shadow-2xs self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCmsTargetLang("ar")}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        cmsTargetLang === "ar"
                          ? "bg-[#3d502d] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span>🇸🇦</span>
                      <span>{adminLang === "ar" ? "النسخة العربية (Arabic)" : "Arabic Texts"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsTargetLang("en")}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        cmsTargetLang === "en"
                          ? "bg-[#3d502d] text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span>🇬🇧</span>
                      <span>{adminLang === "ar" ? "النسخة الإنجليزية (English)" : "English Texts"}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab Navigation Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 scrollbar-none">
                  {[
                    { id: "announcement", labelAr: "الشريط العلوي والفوتر", labelEn: "Top Bar & Footer" },
                    { id: "productPage", labelAr: "صفحة المنتج وخيارات العرض", labelEn: "Product Page & Options" },
                    { id: "pagesInfo", labelAr: "📄 إدارة الصفحات والمحرر المتطور ↗", labelEn: "📄 Site Pages & Rich Editor ↗" },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        if (st.id === "pagesInfo") {
                          setActiveTab("pages");
                        } else {
                          setCmsSubTab(st.id);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        cmsSubTab === st.id
                          ? "bg-[#3d502d] text-white shadow-sm"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {adminLang === "ar" ? st.labelAr : st.labelEn}
                    </button>
                  ))}
                </div>

                {/* Helper Renderer for Clean CMS Fields */}
                {(() => {
                  const renderField = (
                    fieldKey: keyof CustomContentSettings,
                    elementKey: keyof ElementVisibilitySettings | null,
                    titleAr: string,
                    titleEn: string,
                    placeholderAr: string,
                    placeholderEn: string,
                    isTextarea: boolean = false
                  ) => {
                    const isChecked = elementKey ? cmsElements[elementKey] !== false : true;
                    const currentVal = (cmsTargetLang === "ar" ? cmsContent[fieldKey] : cmsContentEn[fieldKey]) ?? "";
                    const placeholder = cmsTargetLang === "ar" ? placeholderAr : placeholderEn;

                    return (
                      <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-2.5 transition-colors hover:border-[#dbe2bd]">
                        <div className="flex items-center justify-between gap-2">
                          {elementKey ? (
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-900 select-none">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => setCmsElements(prev => ({ ...prev, [elementKey]: e.target.checked }))}
                                className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                              />
                              <span>{adminLang === "ar" ? titleAr : titleEn}</span>
                            </label>
                          ) : (
                            <span className="text-xs font-bold text-gray-900">{adminLang === "ar" ? titleAr : titleEn}</span>
                          )}

                          <div className="flex items-center gap-1.5">
                            {currentVal.trim() && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                {cmsTargetLang === "ar" ? "نص عربي مخصص ✓" : "Custom EN ✓"}
                              </span>
                            )}
                            {elementKey && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isChecked ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                                {isChecked ? (adminLang === "ar" ? "معروض ✓" : "Visible ✓") : (adminLang === "ar" ? "مخفي ✕" : "Hidden ✕")}
                              </span>
                            )}
                          </div>
                        </div>

                        {isTextarea ? (
                          <textarea
                            rows={3}
                            value={currentVal}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (cmsTargetLang === "ar") {
                                setCmsContent(prev => ({ ...prev, [fieldKey]: val }));
                              } else {
                                setCmsContentEn(prev => ({ ...prev, [fieldKey]: val }));
                              }
                            }}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            dir={cmsTargetLang === "ar" ? "rtl" : "ltr"}
                          />
                        ) : (
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (cmsTargetLang === "ar") {
                                setCmsContent(prev => ({ ...prev, [fieldKey]: val }));
                              } else {
                                setCmsContentEn(prev => ({ ...prev, [fieldKey]: val }));
                              }
                            }}
                            placeholder={placeholder}
                            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                            dir={cmsTargetLang === "ar" ? "rtl" : "ltr"}
                          />
                        )}
                      </div>
                    );
                  };

                  const renderToggleOnly = (
                    elementKey: keyof ElementVisibilitySettings,
                    titleAr: string,
                    titleEn: string,
                    descAr?: string,
                    descEn?: string
                  ) => {
                    const isChecked = cmsElements[elementKey] !== false;
                    return (
                      <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-center justify-between gap-4 transition-colors hover:border-[#dbe2bd]">
                        <div className="space-y-0.5">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-900 select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => setCmsElements(prev => ({ ...prev, [elementKey]: e.target.checked }))}
                              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                            />
                            <span>{adminLang === "ar" ? titleAr : titleEn}</span>
                          </label>
                          {(descAr || descEn) && (
                            <p className="text-[11px] text-gray-500">{adminLang === "ar" ? descAr : descEn}</p>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isChecked ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                          {isChecked ? (adminLang === "ar" ? "معروض ✓" : "Visible ✓") : (adminLang === "ar" ? "مخفي ✕" : "Hidden ✕")}
                        </span>
                      </div>
                    );
                  };

                  return (
                    <div>
                      {/* SUBTAB: PRODUCT PAGE (Complete Text & Section Control) */}
                      {cmsSubTab === "productPage" && (
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                              {adminLang === "ar" ? "نصوص وعناصر صفحة المستحضر (Product Page)" : "Product Page Texts & Elements"}
                            </h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {adminLang === "ar"
                                ? "تحكم في كافة نصوص ورسائل صفحة المستحضر: شارة المنصة، البيت الشعري، خيارات الدفع، قصة المستحضر، بروتوكول التطبيق، وقائمة المكونات (INCI)."
                                : "Customize all copy on the product story page: podium tag, poetic signature, payment choices, story, protocol, and INCI."}
                            </p>
                          </div>

                          {/* 1. Presentation & Showcase Texts */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                              <Sparkles className="w-4 h-4 text-emerald-700" />
                              <span>{adminLang === "ar" ? "1. واجهة العرض وبطاقة الشراء الأساسية" : "1. Showcase & Main Purchase Card"}</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderField("productPodiumTag", "productPodiumTagVis", "شارة المنصة الرخامية (Podium Badge)", "Marble Podium Tag", "ترميم هيكلي سريري", "Architectural Reset")}
                              {renderField("productReviewsBadge", "productReviewsBadgeVis", "شارة التقييمات السريرية (Reviews Badge)", "Clinical Reviews Badge Text", "(128 تقييم سريري معتمد • تقييم أطباء الجلدية)", "(128 verified clinical reviews • Dermatologist endorsed)")}
                              {renderField("productAddToCartBtn", null, "نص زر الإضافة للحقيبة (Add to Bag Button)", "Add to Bag Button Text", "أضيفي للحقيبة", "Add to Bag")}
                            </div>
                            <div className="w-full">
                              {renderField("productSignaturePoem", "productSignaturePoemVis", "البيت الشعري تحت المستحضر (Poetic Verse)", "Poetic Verse Under Product", "«ما كان في رِفقٍ يُداوينا سُلافُ بهِ.. إلّا تحوّل حُسنًا لا ينهزمُ.»", "Never was Sulaf's gentleness poured into our healing, but that grace triumphed, undefeated.", true)}
                            </div>
                          </div>

                          {/* 2. Dual Payment Options Texts */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                              <CreditCard className="w-4 h-4 text-emerald-700" />
                              <span>{adminLang === "ar" ? "2. نصوص خيارات الدفع (عربون / دفع كامل)" : "2. Payment Options Copy"}</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderField("productPaymentOptionsHeading", "productPaymentOptionsVis", "عنوان اختيار طريقة الدفع", "Payment Options Heading", "اختاري طريقة الدفع التي تناسبك:", "Select your preferred payment structure:")}
                              {renderField("productDepositTitle", "productPaymentOptionsVis", "عنوان خيار العربون", "Deposit Option Title", "عربون 100 ج.م فقط", "100 EGP Deposit Only")}
                              {renderField("productDepositDesc", "productPaymentOptionsVis", "شرح خيار العربون", "Deposit Option Description", "سددي 100 ج.م الآن والباقي عند الاستلام", "Pay 100 EGP now and balance on delivery", true)}
                              {renderField("productFullPayTitle", "productPaymentOptionsVis", "عنوان خيار الدفع بالكامل", "Full Payment Title", "الدفع بالكامل الآن", "Pay in Full Now")}
                              {renderField("productFullPayDesc", "productPaymentOptionsVis", "شرح خيار الدفع بالكامل", "Full Payment Description", "سددي بالكامل عبر البطاقة البنكية أو المحفظة", "Pay in full via credit card or digital wallet", true)}
                            </div>
                          </div>

                          {/* 3. Guarantees */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                              <span>{adminLang === "ar" ? "3. بطاقات الضمانات الثلاثة أسفل الشراء" : "3. Purchase Guarantees"}</span>
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {renderField("productGuarantee1", "productGuaranteesVis", "الضمان 1: الشحن", "Guarantee 1: Shipping", "شحن سريع لكافة المحافظات", "Express Nationwide Delivery")}
                              {renderField("productGuarantee2", "productGuaranteesVis", "الضمان 2: الفعالية", "Guarantee 2: Efficacy", "تحول ملمس الحرير في 7 أيام", "Silk Skin in 7 Days")}
                              {renderField("productGuarantee3", "productGuaranteesVis", "الضمان 3: المعاينة", "Guarantee 3: Inspection", "فحص العبوة قبل الاستلام", "Inspect on Delivery")}
                            </div>
                          </div>

                          {/* 4. The Story Section */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                              <BookOpen className="w-4 h-4 text-emerald-700" />
                              <span>{adminLang === "ar" ? "4. قسم القصة: ترميم هيكلي، بدون احتكاك" : "4. The Story Section"}</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderField("productStoryBadge", "productStorySectionVis", "شارة قسم القصة", "Story Section Badge", "فلسفة الترميم السريري", "Clinical Philosophy & Origin")}
                              {renderField("productStoryTitle", "productStorySectionVis", "عنوان قسم القصة", "Story Section Title", "The Story: Structural Restoration, Not Friction", "The Story: Structural Restoration, Not Friction")}
                            </div>
                            <div className="space-y-3">
                              {renderField("productStoryParagraph1", "productStorySectionVis", "فقرة القصة 1 (الحجر والأندلس)", "Story Paragraph 1", "حين شيد الحرفيون القدامى قصور الأندلس، فهموا قانوناً جوهرياً للتوازن...", "When ancient artisans raised the palaces of Andalusia...", true)}
                              {renderField("productStoryParagraph2", "productStorySectionVis", "فقرة القصة 2 (لغة البشرة وجلد الوزة)", "Story Paragraph 2", "بشرتك تتحدث باللغة ذاتها. تلك الحبيبات الخشنة وجلد الوزة ليست أوساخاً لتُفرك بخشونة...", "Your skin speaks the same language. Those rough, strawberry bumps are not debris...", true)}
                              {renderField("productStoryParagraph3", "productStorySectionVis", "فقرة القصة 3 (المميزة بالحد الأخضر)", "Story Paragraph 3 (Highlighted)", "Absolutes Smoothing Body Cream تحفة سريرية صُممت لإنهاء الحرب بين بشرتك والمقشرات القاسية...", "Absolutes Smoothing Body Cream is a clinical masterpiece formulated to end the war...", true)}
                            </div>
                          </div>

                          {/* 5. Actives Header & Desc */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                              <FlaskConical className="w-4 h-4 text-emerald-700" />
                              <span>{adminLang === "ar" ? "5. نصوص قسم المكونات الفعالة واللآلئ" : "5. Bio-Actives Section"}</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderField("productActivesBadge", "productActivesSectionVis", "شارة قسم المكونات", "Actives Section Badge", "الهندسة الجزيئية والمكونات الفعالة", "Molecular Architecture & Bio-Actives")}
                              {renderField("productActivesTitle", "productActivesSectionVis", "عنوان قسم المكونات الرئيسي", "Actives Section Title", "المركب الثلاثي السريري والمركبات الفعالة الأساسية", "The Triple Clinical Complex & Key Actives")}
                            </div>
                            <div className="w-full">
                              {renderField("productActivesDesc", "productActivesSectionVis", "شرح تفاعل اللآلئ الميكروية", "Actives Pearls Description", "تفاعلي مع لآلئ المكونات بالماوس لفحص الميكانيزم الجزيئي لكل مركب سريري فعال في تركيبة Absolutes Smoothing Body Cream.", "Interact with the 3D pearl orbs to inspect the molecular mechanism of each clinical active in Absolutes Smoothing Body Cream.", true)}
                            </div>
                          </div>

                          {/* 6. Ritual & Phases */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                              <Clock className="w-4 h-4 text-emerald-700" />
                              <span>{adminLang === "ar" ? "6. بروتوكول التطبيق والطقوس (المراحل الثلاث)" : "6. Ritual & Application Protocol"}</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderField("productRitualBadge", "productRitualSectionVis", "شارة قسم البروتوكول", "Ritual Section Badge", "بروتوكول التطبيق والطقوس", "Application Protocol & Phases")}
                              {renderField("productRitualTitle", "productRitualSectionVis", "عنوان قسم البروتوكول", "Ritual Section Title", "Ritual & Architectural Application", "Ritual & Architectural Application")}
                            </div>
                            <div className="w-full">
                              {renderField("productRitualSubtitle", "productRitualSectionVis", "العنوان الفرعي للبروتوكول", "Ritual Section Subtitle", "تسلسل مرقم لتحقيق أعلى استجابة خلوية ونعومة حريرية دائمة.", "Numbered sequence for peak cellular response and lasting epidermal silkiness.")}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderField("productRitualStep1Phase", "productRitualSectionVis", "المرحلة 1: الاسم", "Phase 1: Label", "مرحلة التحضير", "Phase: Preparation")}
                              {renderField("productRitualStep1Text", "productRitualSectionVis", "المرحلة 1: الشرح", "Phase 1: Instructions", "الاستهداف: يُطبق مباشرة على مناطق المشكلة النظيفة والجافة—أعلى الذراعين، الفخذين، الركبتين...", "Target: Apply directly to clean, dry problem areas...", true)}
                              {renderField("productRitualStep2Phase", "productRitualSectionVis", "المرحلة 2: الاسم", "Phase 2: Label", "المرحلة 1: الأسبوع 1 و 2", "Phase 1: Weeks 1 & 2")}
                              {renderField("productRitualStep2Text", "productRitualSectionVis", "المرحلة 2: الشرح", "Phase 2: Instructions", "المرحلة 1 (الصدمة العلاجية - الأسبوع 1 و 2): يُدلك مقدار مناسب 2 إلى 3 أمسيات أسبوعياً...", "Phase 1 (The Shock Reset - Weeks 1 & 2): Massage a dime-sized amount 2 to 3 evenings per week...", true)}
                              {renderField("productRitualStep3Phase", "productRitualSectionVis", "المرحلة 3: الاسم", "Phase 3: Label", "المرحلة 2: بدءاً من الأسبوع 3", "Phase 2: Week 3 Onward")}
                              {renderField("productRitualStep3Text", "productRitualSectionVis", "المرحلة 3: الشرح", "Phase 3: Instructions", "المرحلة 2 (تثبيت الملمس الحريري - بدءاً من الأسبوع 3): الحفاظ على النعومة باستخدام 1 إلى 2 مرة أسبوعياً...", "Phase 2 (Architectural Maintenance - Week 3 onward): Maintain smooth texture with 1 to 2 applications weekly...", true)}
                            </div>
                            <div className="w-full">
                              {renderField("productClinicalNote", "productRitualSectionVis", "الملاحظة السريرية (Clinical Note Callout)", "Clinical Note Callout", "ملاحظة سريرية: تركيبة خالية تماماً من المقشرات الفيزيائية الخشنة، والكبريتات المسببة للجفاف، والشموع التي تسد المسام...", "Clinical Note: Formulated without harsh physical abrasives, drying sulfates, or pore-clogging waxes. Always apply daytime SPF to sun-exposed treated zones.", true)}
                            </div>
                          </div>

                          {/* 7. INCI Section */}
                          <div className="space-y-3">
                            <h5 className="text-xs font-bold text-gray-700 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                              <BadgeCheck className="w-4 h-4 text-emerald-700" />
                              <span>{adminLang === "ar" ? "7. قسم قائمة المكونات (INCI Composition)" : "7. INCI Composition Section"}</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {renderField("productInciTitle", "productInciSectionVis", "عنوان قسم المكونات (INCI Title)", "INCI Section Title", "Full INCI Composition", "Full INCI Composition")}
                              {renderField("productInciIntro", "productInciSectionVis", "مقدمة قائمة المكونات", "INCI Section Intro", "مصمم وفق أعلى معايير النقاء الصيدلاني والكوزميسوتيكال الأوروبي:", "Formulated to strict clinical and cosmetic purity standards:")}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUBTAB: SITE PAGES WITH RICH EDITOR BANNER */}
                      {cmsSubTab === "pagesInfo" && (
                        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#f6f9e6] to-[#ebf1d2] border-2 border-[#dbe2bd] text-center space-y-4 shadow-xs">
                          <div className="w-16 h-16 rounded-3xl bg-[#485c36] text-white flex items-center justify-center mx-auto shadow-md">
                            <FileText className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5 max-w-xl mx-auto">
                            <h4 className="font-amiri text-2xl sm:text-3xl font-black text-gray-900">
                              {adminLang === "ar" ? "محرر الصفحات المتطور متاح في تبويب [الصفحات]" : "Rich Pages Editor Available in [Pages] Tab"}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-cairo">
                              {adminLang === "ar"
                                ? "لتبسيط لوحة التحكم وتفادي التكرار، أصبحت كافة صفحات المتجر (الفلسفة، عن سُلاف، دليل الاستخدام، سياسة الاسترجاع، الشروط والأحكام) تُدار بالكامل من تبويب [الصفحات] باستخدام المحرر المتطور مع إمكانية تكبير وتصغير الخطوط، الألوان، والجداول والصور."
                                : "All store pages (Philosophy, Story, Guide, Refund, Terms) are centrally managed from the Pages tab using the Advanced Rich Editor."}
                            </p>
                          </div>
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setActiveTab("pages")}
                              className="px-6 py-3 rounded-2xl bg-[#485c36] hover:bg-[#3d502d] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
                            >
                              <span>{adminLang === "ar" ? "الانتقال إلى محرر الصفحات الآن ←" : "Open Pages Editor Now →"}</span>
                            </button>
                          </div>
                        </div>
                      )}

{/* SUBTAB 8: ANNOUNCEMENT */}
                      {cmsSubTab === "announcement" && (
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
                            {adminLang === "ar" ? "عناصر ونصوص شريط الإعلانات العلوي" : "Top Announcement Ribbon Texts"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField("announcementBadge", "announcementBadge", "شارة شريط الإعلانات العلوي", "Announcement Ribbon Badge", "عرض حصري", "Exclusive Offer")}
                            <div className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex items-center justify-between gap-4">
                              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-900 select-none">
                                <input
                                  type="checkbox"
                                  checked={cmsSections.announcementBar !== false}
                                  onChange={(e) => setCmsSections((prev: any) => ({ ...prev, announcementBar: e.target.checked }))}
                                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                                />
                                <span>{adminLang === "ar" ? "إظهار الشريط العلوي بالمتجر" : "Show top announcement bar"}</span>
                              </label>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cmsSections.announcementBar !== false ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-600"}`}>
                                {cmsSections.announcementBar !== false ? (adminLang === "ar" ? "معروض ✓" : "Visible ✓") : (adminLang === "ar" ? "مخفي ✕" : "Hidden ✕")}
                              </span>
                            </div>
                          </div>
                          <div className="w-full">
                            {renderField("announcementText", "announcementText", "نص شريط الإعلانات العلوي", "Announcement Ribbon Text", "شحن مجاني لكافة المحافظات عند طلب عبوتين أو أكثر • دفع مريح عند الاستلام", "Free express shipping nationwide on orders of 2 or more jars • Cash on Delivery", true)}
                          </div>
                          <h4 className="text-xs font-bold uppercase text-emerald-800 tracking-wider pt-4">
                            {adminLang === "ar" ? "نصوص الفوتر" : "Footer Texts"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderField("footerTagline", null, "الشعار أسفل اللوجو بالفوتر", "Footer Tagline", "دقة صيدلانية.. وروح أندلسية.", "Clinical Precision. Andalusian Soul.")}
                            {renderField("footerNewsletterTitle", null, "عنوان النشرة البريدية", "Newsletter Title", "النشرة السريرية", "Join Our Newsletter")}
                          </div>
                          <div className="w-full">
                            {renderField("footerNewsletterDesc", null, "وصف النشرة البريدية", "Newsletter Description", "كوني أول من يعلم بالإصدارات الجديدة ونصائح العناية السريرية.", "Be the first to know about new launches, exclusive offers and skincare tips.", true)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm">
                <h2 className="font-bold text-2xl text-gray-900">إعدادات المتجر وبوابة الدفع Paymob</h2>
                <p className="text-xs text-gray-600 mt-1 font-semibold">
                  التحكم في بيانات إنستاباي، فودافون كاش، العربون، مصاريف الشحن، عروض الكميات، مفاتيح Paymob، وحقول الدفع.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 0. Admin Security & Password Change */}
                <div className="bg-gradient-to-br from-white to-[#fcfdf8] p-6 rounded-3xl border-2 border-amber-300/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-amber-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shadow-xs">
                        <Lock className="w-5 h-5 text-amber-800" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                          <span>{adminLang === "ar" ? "أمان الحساب وكلمة مرور المدير" : "Admin Security & Password"}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-full">
                            {adminLang === "ar" ? "محمي" : "Protected"}
                          </span>
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold mt-0.5">
                          {adminLang === "ar"
                            ? "تغيير اسم المستخدم وكلمة المرور الخاصة بالدخول للوحة تحكم سُـلاف"
                            : "Change admin login username and password credentials."}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPasswordError(null);
                        setPasswordSuccess(null);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                          newUsername: settings?.admin?.username || "admin",
                        });
                        setChangePasswordModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{adminLang === "ar" ? "فتح نافذة تغيير كلمة المرور" : "Open Password Modal"}</span>
                    </button>
                  </div>

                  {/* Inline Quick Change Form */}
                  <div className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          {adminLang === "ar" ? "كلمة المرور الحالية *" : "Current Password *"}
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPass ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            placeholder={adminLang === "ar" ? "أدخل كلمة المرور الحالية..." : "Current password..."}
                            className="w-full px-4 py-2.5 pe-10 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          {adminLang === "ar" ? "كلمة المرور الجديدة *" : "New Password *"}
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPass ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder={adminLang === "ar" ? "6 خانات على الأقل..." : "At least 6 characters..."}
                            className="w-full px-4 py-2.5 pe-10 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5">
                          {adminLang === "ar" ? "تأكيد كلمة المرور الجديدة *" : "Confirm New Password *"}
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPass ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            placeholder={adminLang === "ar" ? "أعد كتابة كلمة المرور..." : "Retype new password..."}
                            className="w-full px-4 py-2.5 pe-10 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Alerts */}
                    {passwordError && (
                      <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{passwordError}</span>
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{passwordSuccess}</span>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                      <div className="text-[11px] text-gray-500 font-semibold">
                        {adminLang === "ar" ? "اسم المستخدم الحالي المسجل:" : "Active Admin Username:"} <span className="font-mono font-bold text-gray-800">{settings?.admin?.username || "admin"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChangeAdminPassword()}
                        disabled={isSubmittingPassword || !passwordForm.currentPassword || !passwordForm.newPassword}
                        className="px-6 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2c3a21] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition-all active:scale-95"
                      >
                        <KeyRound className="w-4 h-4 text-amber-300" />
                        <span>{isSubmittingPassword ? (adminLang === "ar" ? "جاري التحديث..." : "Updating...") : (adminLang === "ar" ? "حفظ وتحديث كلمة المرور" : "Save New Password")}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1. Payment Methods Config */}
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
                  <h3 className="font-bold text-base text-[#3d502d] flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span>بيانات التحويل المالي (إنستاباي وفودافون كاش)</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">معرف إنستاباي (InstaPay Handle)</label>
                      <input
                        type="text"
                        value={settingsForm.instapay}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instapay: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">رقم محفظة فودافون كاش</label>
                      <input
                        type="text"
                        value={settingsForm.vodafone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, vodafone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">قيمة العربون المعتمدة (ج.م)</label>
                      <input
                        type="number"
                        value={settingsForm.depositAmount}
                        onChange={(e) => setSettingsForm({ ...settingsForm, depositAmount: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Multi-Product Promotion (خصم وشحن مجاني عند شراء أكثر من منتج) */}
                <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <Percent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#3d502d]">
                          عروض شراء أكثر من منتج (خصم الكمية وإعفاء الشحن)
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          تشجيع العميل على زيادة حجم السلة بالحصول على خصم وشحن مجاني تلقائي
                        </p>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-black px-4 py-2 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200 select-none">
                      <input
                        type="checkbox"
                        checked={settingsForm.multiPromoEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, multiPromoEnabled: e.target.checked })}
                        className="rounded text-[#3d502d] w-4 h-4 cursor-pointer"
                      />
                      <span>تفعيل العرض في المتجر</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">
                        الحد الأدنى لعدد المنتجات لتطبيق العرض
                      </label>
                      <input
                        type="number"
                        min={2}
                        value={settingsForm.multiPromoMinQty}
                        onChange={(e) => setSettingsForm({ ...settingsForm, multiPromoMinQty: Math.max(2, Number(e.target.value)) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                      <span className="text-[11px] text-gray-500 block mt-1 font-semibold">مثال: 2 منتجات أو أكثر</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">
                        نوع الخصم
                      </label>
                      <select
                        value={settingsForm.multiPromoDiscountType}
                        onChange={(e) => setSettingsForm({ ...settingsForm, multiPromoDiscountType: e.target.value as any })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="PERCENTAGE">نسبة مئوية (%)</option>
                        <option value="FIXED">مبلغ خصم ثابت (ج.م)</option>
                      </select>
                      <span className="text-[11px] text-gray-500 block mt-1 font-semibold">تخفيض نسبي أو رقمي مباشر</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">
                        قيمة الخصم ({settingsForm.multiPromoDiscountType === "PERCENTAGE" ? "%" : "ج.م"})
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={settingsForm.multiPromoDiscountValue}
                        onChange={(e) => setSettingsForm({ ...settingsForm, multiPromoDiscountValue: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                      <span className="text-[11px] text-gray-500 block mt-1 font-semibold">
                        {settingsForm.multiPromoDiscountType === "PERCENTAGE" ? "مثال: 10 تعني خصم 10%" : "مثال: 50 تعني خصم 50 ج.م"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">
                        إعفاء مصاريف الشحن
                      </label>
                      <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 cursor-pointer text-xs font-bold text-gray-900 select-none hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={settingsForm.multiPromoFreeShipping}
                          onChange={(e) => setSettingsForm({ ...settingsForm, multiPromoFreeShipping: e.target.checked })}
                          className="rounded text-[#3d502d] w-4 h-4 cursor-pointer"
                        />
                        <span>شحن مجاني للعميل</span>
                      </label>
                      <span className="text-[11px] text-gray-500 block mt-1 font-semibold">إلغاء مصاريف الشحن بالكامل</span>
                    </div>
                  </div>

                  {/* Visual Preview Banner */}
                  <div className="p-4 rounded-2xl bg-[#f6f9e6] border border-[#dbe2bd] text-xs font-semibold text-[#3d502d] flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-black block text-sm mb-0.5">معاينة تأثير هذا الإعداد على سلة العميل:</span>
                      <span>
                        {settingsForm.multiPromoEnabled
                          ? `إذا أضاف العميل ${settingsForm.multiPromoMinQty} منتجات أو أكثر، سيحصل فوراً على خصم ${settingsForm.multiPromoDiscountValue}${settingsForm.multiPromoDiscountType === "PERCENTAGE" ? "%" : " ج.م"}${settingsForm.multiPromoFreeShipping ? " + شحن مجاني تماماً 🎁" : ""}.`
                          : "العرض معطل حالياً ولن يتم تطبيقه في صفحة الدفع."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Egyptian Governorates Shipping Rates Manager */}
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#e8ecd0] flex items-center justify-center text-[#3d502d]">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#3d502d]">
                          إدارة تسعير شحن محافظات مصر (سعر موحد + استثناءات)
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          سعر موحد افتراضي لجميع المحافظات الـ 27 مع إمكانية استثناء محافظات معينة وتحديد سعر خاص لها
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-full bg-gray-100 font-bold text-gray-700">
                        {settingsForm.customGovernorateRates.length} محافظات مستثناة
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 font-bold text-emerald-800">
                        {27 - settingsForm.customGovernorateRates.length} محافظة بالسعر الموحد
                      </span>
                    </div>
                  </div>

                  {/* Unified Default Rate & General Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#fcfdfa] p-4 rounded-2xl border-2 border-[#3d502d]/20">
                      <label className="block text-xs font-black text-gray-900 mb-2">
                        سعر الشحن الموحد لكافة المحافظات (ج.م)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={settingsForm.shippingUnifiedRate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shippingUnifiedRate: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-base font-bold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                      <span className="text-[11px] text-gray-500 block mt-1 font-semibold">
                        السعر الافتراضي العام لأي محافظة لم تُستثن أدناه
                      </span>
                    </div>

                    <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-gray-200">
                      <label className="block text-xs font-bold text-gray-800 mb-2">
                        الحد الأدنى للشحن المجاني العام (ج.م)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={settingsForm.freeThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeThreshold: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                      <span className="text-[11px] text-gray-500 block mt-1 font-semibold">
                        إذا وصل مجموع سلة العميل لهذا المبلغ يُعفى من الشحن
                      </span>
                    </div>

                    <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-gray-200">
                      <label className="block text-xs font-bold text-gray-800 mb-2">
                        واتساب خدمة العملاء
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                      <span className="text-[11px] text-gray-500 block mt-1 font-semibold">
                        الرقم الظاهر للعملاء للتواصل السريع والمساعدة
                      </span>
                    </div>
                  </div>

                  {/* Add Governorate Exclusion Form */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <h4 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span>إضافة محافظة جديدة للاستثناء بتسعير خاص:</span>
                    </h4>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <select
                          value={newGovName}
                          onChange={(e) => setNewGovName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-semibold bg-white text-gray-900 focus:border-[#3d502d] focus:outline-none"
                        >
                          {ALL_EGYPT_GOVERNORATES.filter(
                            (g) => !settingsForm.customGovernorateRates.some((r: any) => r.governorate === g)
                          ).map((gov) => (
                            <option key={gov} value={gov}>
                              {gov}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full sm:w-40 flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={newGovFee}
                          onChange={(e) => setNewGovFee(Number(e.target.value))}
                          placeholder="سعر الشحن ج"
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm font-bold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                        />
                        <span className="text-xs font-bold text-gray-600 shrink-0">ج.م</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCustomGovernorate}
                        className="px-5 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2d3b21] text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>استثناء المحافظة</span>
                      </button>
                    </div>
                  </div>

                  {/* Excluded Governorates List */}
                  <div>
                    <h4 className="font-bold text-xs text-gray-700 mb-3 flex items-center justify-between">
                      <span>قائمة المحافظات المستثناة بتسعير خاص ({settingsForm.customGovernorateRates.length}):</span>
                      <span className="text-[11px] text-gray-500 font-normal">
                        يمكنك تعديل السعر مباشرة أو حذف الاستثناء للعودة للسعر الموحد ({settingsForm.shippingUnifiedRate} ج)
                      </span>
                    </h4>

                    {settingsForm.customGovernorateRates.length === 0 ? (
                      <div className="py-6 text-center text-xs font-bold text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        لا توجد محافظات مستثناة حالياً. جميع محافظات مصر تعمل بالسعر الموحد ({settingsForm.shippingUnifiedRate} ج.م).
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {settingsForm.customGovernorateRates.map((item: any) => (
                          <div
                            key={item.governorate}
                            className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-3 shadow-2xs"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                              <div>
                                <span className="font-black text-xs text-gray-900 block">{item.governorate}</span>
                                <span className="text-[10px] text-emerald-800 font-bold block">مستثناة بتسعير خاص</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-gray-200">
                                <input
                                  type="number"
                                  min={0}
                                  value={item.rate ?? item.shippingFee ?? 0}
                                  onChange={(e) => handleUpdateCustomGovernorateFee(item.governorate, Number(e.target.value))}
                                  className="w-14 text-center font-bold text-xs text-gray-900 focus:outline-none"
                                />
                                <span className="text-[10px] text-gray-500 font-bold">ج.م</span>
                              </div>

                              <button
                                type="button"
                                title="إلغاء الاستثناء وإعادتها للسعر الموحد"
                                onClick={() => handleRemoveCustomGovernorate(item.governorate)}
                                className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 hover:text-rose-800 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3.5 Universal Shipping Companies & Tracking API Manager */}
                <ShippingCarrierSettings
                  adminLang={adminLang}
                  activeProvider={settingsForm.shippingActiveProvider}
                  providers={settingsForm.shippingProviders}
                  onChangeActiveProvider={(p) => setSettingsForm((prev) => ({ ...prev, shippingActiveProvider: p }))}
                  onChangeProviderConfig={(pKey, partial) => {
                    setSettingsForm((prev) => ({
                      ...prev,
                      shippingProviders: {
                        ...prev.shippingProviders,
                        [pKey]: {
                          ...prev.shippingProviders[pKey],
                          ...partial,
                        },
                      },
                    }));
                  }}
                  showToast={showToast}
                />

                {/* 4. Checkout Fields Visibility Control */}
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#3d502d]">
                          التحكم في حقول صفحة إتمام الطلب (Checkout Page Fields)
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          اختر الحقول الاختيارية التي ترغب في إظهارها أو إخفائها للعملاء عند إنهاء الطلب
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Birthdate Field Toggle */}
                    <div className="p-4 rounded-2xl border border-gray-200 bg-[#fcfdfa] flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-black text-sm text-gray-900 block">
                            حقل تاريخ الميلاد (Customer Birthdate)
                          </span>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            يتيح للعميل إدخال تاريخ ميلاده لتقديم هدايا وعروض ترويجية وخصومات خاصة في شهر ميلاده.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={settingsForm.showBirthdateField}
                          onChange={(e) => setSettingsForm({ ...settingsForm, showBirthdateField: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3d502d]"></div>
                      </label>
                    </div>

                    {/* Close Person Name Field Toggle */}
                    <div className="p-4 rounded-2xl border border-gray-200 bg-[#fcfdfa] flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-black text-sm text-gray-900 block">
                            حقل اسم شخص مقرب ليك (Loved One Name)
                          </span>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            يتيح للعميل كتابة اسم شخص مقرب أو عزيز عليه لتخصيص الطلب أو إرفاق بطاقة إهداء لطيفة.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={settingsForm.showClosePersonField}
                          onChange={(e) => setSettingsForm({ ...settingsForm, showClosePersonField: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3d502d]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 3. Gateways Selection Policy (اعتماد بوابات الدفع في المتجر) */}
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#485c36]/10 text-[#485c36] flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-[#3d502d]">
                        اعتماد بوابات الدفع الإلكتروني في المتجر (Payment Gateways Policy)
                      </h3>
                      <p className="text-xs text-gray-500 font-semibold">
                        حددي البوابات المتاحة للعميلات عند الدفع: شحناوي (محافظ إلكترونية)، Paymob (بطاقات بنكية)، أو كلاهما معاً.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Option: Both Gateways */}
                    <div
                      onClick={() => setSettingsForm({ ...settingsForm, gatewaysMode: "both" })}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        settingsForm.gatewaysMode === "both"
                          ? "bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          <span>🌟 كلاهما معاً</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">موصى به</span>
                        </span>
                        <input
                          type="radio"
                          name="gatewaysMode"
                          checked={settingsForm.gatewaysMode === "both"}
                          onChange={() => setSettingsForm({ ...settingsForm, gatewaysMode: "both" })}
                          className="accent-[#3d502d]"
                        />
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        تفعيل <strong>شحناوي</strong> للمحافظ الذكية (فودافون كاش، أورنج، اتصالات) + <strong>Paymob</strong> لبطاقات الفيزا والماستركارد معاً.
                      </p>
                    </div>

                    {/* Option: Sha7nawy Only */}
                    <div
                      onClick={() => setSettingsForm({ ...settingsForm, gatewaysMode: "sha7nawy_only" })}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        settingsForm.gatewaysMode === "sha7nawy_only"
                          ? "bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-gray-900">
                          📱 بوابة شحناوي فقط
                        </span>
                        <input
                          type="radio"
                          name="gatewaysMode"
                          checked={settingsForm.gatewaysMode === "sha7nawy_only"}
                          onChange={() => setSettingsForm({ ...settingsForm, gatewaysMode: "sha7nawy_only" })}
                          className="accent-[#3d502d]"
                        />
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        اعتماد المحافظ الإلكترونية المصرية حصرياً (فودافون كاش، أورنج كاش، اتصالات كاش) عبر شحناوي API v2.0.
                      </p>
                    </div>

                    {/* Option: Paymob Only */}
                    <div
                      onClick={() => setSettingsForm({ ...settingsForm, gatewaysMode: "paymob_only" })}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        settingsForm.gatewaysMode === "paymob_only"
                          ? "bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500"
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-gray-900">
                          💳 بوابة Paymob فقط
                        </span>
                        <input
                          type="radio"
                          name="gatewaysMode"
                          checked={settingsForm.gatewaysMode === "paymob_only"}
                          onChange={() => setSettingsForm({ ...settingsForm, gatewaysMode: "paymob_only" })}
                          className="accent-[#3d502d]"
                        />
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        اعتماد البطاقات البنكية الائتمانية والخصم المباشر (Visa / Mastercard) حصرياً عبر Paymob Accept.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Sha7nawy Gate Integration & Diagnostics (API v2.0) */}
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-[#3d502d] flex items-center gap-2">
                          <span>بوابة دفع المحافظ الإلكترونية - شحناوي (Sha7nawy Gate API v2.0)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">v2.0 معتمد</span>
                        </h3>
                        <p className="text-xs text-gray-500 font-semibold">
                          سحب مباشر فوري من فودافون كاش (*9*1#)، أورنج كاش، واتصالات كاش (*777*11#) مع توقيع مشفر HMAC-SHA256.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                        <input
                          type="checkbox"
                          checked={settingsForm.sha7nawySandbox}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sha7nawySandbox: e.target.checked })}
                          className="rounded text-[#3d502d] w-4 h-4"
                        />
                        <span>وضع الاختبار (Sandbox)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                        <input
                          type="checkbox"
                          checked={settingsForm.sha7nawyEnabled}
                          onChange={(e) => setSettingsForm({ ...settingsForm, sha7nawyEnabled: e.target.checked })}
                          className="rounded text-[#3d502d] w-4 h-4"
                        />
                        <span>تفعيل البوابة</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">رابط الخادم (Base URL)</label>
                      <input
                        type="text"
                        value={settingsForm.sha7nawyBaseUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sha7nawyBaseUrl: e.target.value })}
                        placeholder="https://gate.sha7nawy.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">اسم التطبيق (X-App-Name)</label>
                      <input
                        type="text"
                        value={settingsForm.sha7nawyAppName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sha7nawyAppName: e.target.value })}
                        placeholder="Sulaf-Store"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">المفتاح العام (Public Key - يُستخدم لإنشاء وتأكيد العمليات)</label>
                      <input
                        type="text"
                        value={settingsForm.sha7nawyPublicKey}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sha7nawyPublicKey: e.target.value })}
                        placeholder="أدخلي Public Key من لوحة شحناوي..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">المفتاح السري (Secret Key - للاستعلام ومطابقة توقيع الويب هوك)</label>
                      <input
                        type="password"
                        value={settingsForm.sha7nawySecretKey}
                        onChange={(e) => setSettingsForm({ ...settingsForm, sha7nawySecretKey: e.target.value })}
                        placeholder="أدخلي Secret Key من لوحة شحناوي..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Webhook Endpoint Info Box */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-gray-800 block">رابط الويب هوك لإشعارات السداد (Webhook URL):</span>
                      <code className="text-gray-600 font-mono text-[11px] select-all bg-white px-2 py-0.5 rounded border border-gray-200 inline-block">
                        {typeof window !== "undefined" ? window.location.origin : "https://sulaf.store"}/api/webhooks/sha7nawy
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const url = `${window.location.origin}/api/webhooks/sha7nawy`;
                        navigator.clipboard.writeText(url);
                        showToast("تم نسخ رابط الويب هوك الخاص بـ شحناوي ✓");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 font-bold text-[11px] shrink-0 cursor-pointer"
                    >
                      نسخ الرابط 📋
                    </button>
                  </div>

                  {/* Sha7nawy Live Test Button & Diagnostics Result */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleTestSha7nawyConnection}
                      disabled={sha7nawyTestLoading}
                      className="px-5 py-2.5 rounded-xl bg-[#485c36] hover:bg-[#38492a] text-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer active:scale-95"
                    >
                      <Activity className={`w-4 h-4 ${sha7nawyTestLoading ? "animate-spin text-amber-300" : "text-emerald-300"}`} />
                      <span>{sha7nawyTestLoading ? "جاري فحص الاتصال بالخادم..." : "اختبار الاتصال ببوابة شحناوي"}</span>
                    </button>

                    {sha7nawyTestResult && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        sha7nawyTestResult.success ? "bg-emerald-50 text-emerald-900 border border-emerald-300" : "bg-rose-50 text-rose-900 border border-rose-300"
                      }`}>
                        {sha7nawyTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        <span>{sha7nawyTestResult.message || sha7nawyTestResult.error}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Paymob Gateway Diagnostic & Integration */}
                <div className="bg-white p-6 rounded-3xl border border-[#dbe2bd] shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-bold text-base text-[#3d502d] flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <span>إعدادات بوابة الدفع الإلكتروني Paymob Accept</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
                        <input
                          type="checkbox"
                          checked={settingsForm.paymobSandbox}
                          onChange={(e) => setSettingsForm({ ...settingsForm, paymobSandbox: e.target.checked })}
                          className="rounded text-[#3d502d] w-4 h-4"
                        />
                        <span>وضع الاختبار (Sandbox Mode)</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">Paymob Secret Key / API Key</label>
                      <input
                        type="password"
                        value={settingsForm.paymobSecretKey}
                        onChange={(e) => setSettingsForm({ ...settingsForm, paymobSecretKey: e.target.value })}
                        placeholder="sec_test_..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">HMAC Secret</label>
                      <input
                        type="password"
                        value={settingsForm.paymobHmac}
                        onChange={(e) => setSettingsForm({ ...settingsForm, paymobHmac: e.target.value })}
                        placeholder="hmac_secret_..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">معرف البطاقات البنكية (Card Integration ID)</label>
                      <input
                        type="text"
                        value={settingsForm.paymobCardId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, paymobCardId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-2">معرف محافظ الهاتف (Wallet Integration ID)</label>
                      <input
                        type="text"
                        value={settingsForm.paymobWalletId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, paymobWalletId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-mono text-gray-900 focus:border-[#3d502d] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Paymob Live Test Button & Diagnostics Result */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleTestPaymobConnection}
                      disabled={paymobTestLoading}
                      className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center gap-2 shadow"
                    >
                      <Activity className={`w-4 h-4 ${paymobTestLoading ? "animate-spin text-amber-400" : "text-emerald-400"}`} />
                      <span>{paymobTestLoading ? "جاري فحص الاتصال بالخادم..." : "اختبار الاتصال ببوابة Paymob"}</span>
                    </button>

                    {paymobTestResult && (
                      <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        paymobTestResult.success ? "bg-emerald-50 text-emerald-900 border border-emerald-300" : "bg-rose-50 text-rose-900 border border-rose-300"
                      }`}>
                        {paymobTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        <span>{paymobTestResult.message || paymobTestResult.error}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-2xl bg-[#3d502d] hover:bg-[#2d3b21] text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>حفظ كافة التغييرات على الخادم</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        {/* Modal: Add Review Manually by Admin */}
        {addReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-200 overflow-hidden text-start font-cairo">
              <div className="p-6 bg-[#3d502d] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">
                    {adminLang === "ar" ? "إضافة رأي عميل أو طبيب يدوياً" : "Add Review Manually"}
                  </h3>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    {adminLang === "ar"
                      ? "الرأي المضاف سيُنشر كمعتمد وموثق فوراً بالمتجر والصفحة الرئيسية."
                      : "Manually added reviews are approved and published immediately."}
                  </p>
                </div>
                <button
                  onClick={() => setAddReviewModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddManualReviewSubmit} className="p-6 space-y-4">
                {/* Select Product */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {adminLang === "ar" ? "المستحضر المعني *" : "Target Product *"}
                  </label>
                  <select
                    value={manualReviewForm.productId}
                    onChange={(e) => {
                      const selProd = products.find((p) => p.id === e.target.value);
                      setManualReviewForm({
                        ...manualReviewForm,
                        productId: e.target.value,
                        productName: selProd?.nameAr || selProd?.nameEn || "Absolutes Smoothing Body Cream",
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3d502d]"
                  >
                    <option value="">Absolutes Smoothing Body Cream (الأساسي)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr || p.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Author Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      {adminLang === "ar" ? "اسم العميل أو الطبيب *" : "Customer/Doctor Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={manualReviewForm.authorName}
                      onChange={(e) => setManualReviewForm({ ...manualReviewForm, authorName: e.target.value })}
                      placeholder={adminLang === "ar" ? "مثال: د. مروة الشريف" : "e.g. Dr. Sarah"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3d502d]"
                    />
                  </div>

                  {/* Author Role */}
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      {adminLang === "ar" ? "الصفة / اللقب *" : "Role / Title *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={manualReviewForm.authorRole}
                      onChange={(e) => setManualReviewForm({ ...manualReviewForm, authorRole: e.target.value })}
                      placeholder={adminLang === "ar" ? "مثال: دكتورة جلدية / عميلة موثقة" : "e.g. Dermatologist"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3d502d]"
                    />
                  </div>
                </div>

                {/* Rating (1-5) */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {adminLang === "ar" ? "التقييم بالنجوم:" : "Rating:"}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setManualReviewForm({ ...manualReviewForm, rating: star })}
                        className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            manualReviewForm.rating >= star
                              ? "fill-amber-500 text-amber-500"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ms-2 text-xs font-bold text-amber-600 font-mono">
                      {manualReviewForm.rating} / 5
                    </span>
                  </div>
                </div>

                {/* Optional Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {adminLang === "ar" ? "عنوان التقييم (اختياري)" : "Title (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={manualReviewForm.title}
                    onChange={(e) => setManualReviewForm({ ...manualReviewForm, title: e.target.value })}
                    placeholder={adminLang === "ar" ? "مثال: أفضل تركيبة علاجية كيراتينية استخدمتها" : "e.g. Outstanding results"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3d502d]"
                  />
                </div>

                {/* Comment Body */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {adminLang === "ar" ? "نص وتفاصيل الرأي *" : "Review Comment *"}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={manualReviewForm.comment}
                    onChange={(e) => setManualReviewForm({ ...manualReviewForm, comment: e.target.value })}
                    placeholder={adminLang === "ar" ? "اكتب نص رأي العميل أو التقييم بالتفصيل..." : "Write review comment..."}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3d502d] resize-none"
                  />
                </div>

                {/* Verified Purchase Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isVerified"
                    checked={manualReviewForm.isVerifiedPurchase}
                    onChange={(e) => setManualReviewForm({ ...manualReviewForm, isVerifiedPurchase: e.target.checked })}
                    className="w-4 h-4 rounded text-[#3d502d] accent-[#3d502d]"
                  />
                  <label htmlFor="isVerified" className="text-xs font-bold text-gray-800 cursor-pointer">
                    {adminLang === "ar" ? "تمييز الرأي كـ (شراء موثق Verified Purchase)" : "Mark as Verified Purchase"}
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setAddReviewModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs cursor-pointer"
                  >
                    {adminLang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2e3d22] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{adminLang === "ar" ? "إضافة واعتماد الرأي الآن ✓" : "Add & Publish Now ✓"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Advanced Product Page Sections & Cards Builder Modal */}
        {isBuilderModalOpen && builderModalProduct && (
          <ProductPageBuilderModal
            product={builderModalProduct}
            adminLang={adminLang}
            isOpen={isBuilderModalOpen}
            onClose={() => {
              setIsBuilderModalOpen(false);
              setBuilderModalProduct(null);
            }}
            onSave={async (updatedPageBuilder) => {
              // Update form state if we are adding/editing
              setProductForm((prev) => ({
                ...prev,
                pageBuilder: updatedPageBuilder,
              }));

              // If product exists in database, persist immediately
              if (builderModalProduct.id && builderModalProduct.id !== "new-prod" && builderModalProduct.id !== "temp-new") {
                try {
                  const res = await fetch(`/api/products/${builderModalProduct.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pageBuilder: updatedPageBuilder }),
                  });
                  if (res.ok) {
                    showToast(adminLang === "ar" ? "تم حفظ وتطبيق أقسام صفحة المستحضر بنجاح ✓" : "Product page sections saved ✓");
                    loadLiveBackendData(true);
                  }
                } catch {
                  showToast(adminLang === "ar" ? "فشل حفظ أقسام المستحضر." : "Failed to save sections.", "error");
                }
              } else {
                showToast(adminLang === "ar" ? "تم حفظ أقسام الصفحة في النموذج، اضغط حفظ المستحضر لتأكيد الإضافة ✓" : "Sections saved in form, click Save Product to finalize ✓");
              }
              setIsBuilderModalOpen(false);
              setBuilderModalProduct(null);
            }}
          />
        )}
        {/* Modal: Change Admin Password */}
        {changePasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden text-start font-cairo animate-scale-up">
              <div className="p-5 bg-gradient-to-r from-[#2c3821] via-[#3d502d] to-[#2c3821] text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">
                      {adminLang === "ar" ? "تغيير كلمة مرور المدير" : "Change Admin Password"}
                    </h3>
                    <p className="text-[11px] text-emerald-200 mt-0.5">
                      {adminLang === "ar" ? "تأمين لوحة التحكم وتحديث بيانات الدخول" : "Secure dashboard credentials"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChangePasswordModalOpen(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleChangeAdminPassword} className="p-6 space-y-4">
                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                {/* Optional Username Change */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {adminLang === "ar" ? "اسم المستخدم (Username)" : "Admin Username"}
                  </label>
                  <input
                    type="text"
                    value={passwordForm.newUsername}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newUsername: e.target.value })}
                    placeholder="admin"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:border-[#3d502d] focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {adminLang === "ar" ? "يمكنك الإبقاء عليه كما هو أو تغييره حسب رغبتك" : "Leave as is or update if desired"}
                  </span>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {adminLang === "ar" ? "كلمة المرور الحالية *" : "Current Password *"}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pe-10 rounded-xl border border-gray-300 text-sm text-gray-900 focus:border-[#3d502d] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {adminLang === "ar" ? "كلمة المرور الجديدة *" : "New Password *"}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder={adminLang === "ar" ? "6 خانات على الأقل" : "Min 6 characters"}
                      className="w-full px-4 py-2.5 pe-10 rounded-xl border border-gray-300 text-sm text-gray-900 focus:border-[#3d502d] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    {adminLang === "ar" ? "تأكيد كلمة المرور الجديدة *" : "Confirm New Password *"}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder={adminLang === "ar" ? "أعد كتابة كلمة المرور..." : "Retype new password"}
                      className={`w-full px-4 py-2.5 pe-10 rounded-xl border text-sm text-gray-900 focus:outline-none ${
                        passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
                          ? "border-rose-400 bg-rose-50/20"
                          : passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword
                          ? "border-emerald-400 bg-emerald-50/20"
                          : "border-gray-300 focus:border-[#3d502d]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword && (
                    <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {adminLang === "ar" ? "كلمتا المرور متطابقتان ✓" : "Passwords match ✓"}
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setChangePasswordModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    {adminLang === "ar" ? "إلغاء" : "Cancel"}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingPassword}
                    className="px-6 py-2.5 rounded-xl bg-[#3d502d] hover:bg-[#2d3a22] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                  >
                    {isSubmittingPassword ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{adminLang === "ar" ? "جاري الحفظ..." : "Saving..."}</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-amber-300" />
                        <span>{adminLang === "ar" ? "حفظ كلمة المرور الجديدة" : "Save New Password"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { LiveTextOverride } from "@/lib/settings/store-settings";
import {
  Sparkles,
  Edit3,
  Link as LinkIcon,
  Check,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Type,
  Palette,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Bold,
  Sliders,
  ChevronDown,
} from "lucide-react";

interface ElementTargetData {
  element: HTMLElement;
  key: string;
  isLink: boolean;
  currentText: string;
  currentHref?: string;
  currentTarget?: string;
  currentColor?: string;
  currentFontSize?: string;
  currentFontWeight?: string;
  currentTextAlign?: string;
}

const STORE_PAGES_PRESETS = [
  { label: "الصفحة الرئيسية (Home)", url: "/" },
  { label: "المتجر وكل المنتجات (Shop)", url: "/shop" },
  { label: "كريم سُـلاف لترميم البشرة (Product)", url: "/product/absolutes-smoothing-body-cream" },
  { label: "عن سُـلاف والقصة الأندلسية (Story)", url: "/story" },
  { label: "الفلسفة العلاجية ومفهوم Cosmeceuticals", url: "/philosophy" },
  { label: "دليل طقوس الاستخدام (Guide)", url: "/guide" },
  { label: "تتبع الشحنة والطلب (Track Order)", url: "/track" },
  { label: "تواصل مع فريق سُـلاف (Contact)", url: "/contact" },
  { label: "سياسة الاسترجاع والضمان (Refund)", url: "/refund" },
  { label: "الشروط والأحكام (Terms)", url: "/terms" },
  { label: "سياسة الخصوصية (Privacy)", url: "/privacy" },
  { label: "استشارة فورية عبر واتساب (WhatsApp)", url: "https://wa.me/201099887766" },
];

const BRAND_COLORS = [
  { name: "زيتوني أندلسي (الرئيسي)", hex: "#485c36" },
  { name: "عنابي قرطبي (الثانوي)", hex: "#610b0d" },
  { name: "قرمزي حريري (الأكسنت)", hex: "#ca384a" },
  { name: "ذهب معتق (الأندلس)", hex: "#d4af37" },
  { name: "وردي ناعم", hex: "#f3a5a1" },
  { name: "أخضر داكن غامق", hex: "#18271b" },
  { name: "أسود فحمي ناعم", hex: "#1c2616" },
  { name: "رمادي داكن", hex: "#374151" },
  { name: "أبيض ناصع", hex: "#ffffff" },
];

const FONT_SIZES = [
  { label: "صغير جداً (12px)", value: "12px" },
  { label: "صغير (14px)", value: "14px" },
  { label: "متوسط قياسي (16px)", value: "16px" },
  { label: "نص بارز (18px)", value: "18px" },
  { label: "عنوان فرعي (20px)", value: "20px" },
  { label: "عنوان قسم (24px)", value: "24px" },
  { label: "عنوان كبير (30px)", value: "30px" },
  { label: "عنوان ضخم (38px)", value: "38px" },
  { label: "هيرو وبنر (48px)", value: "48px" },
  { label: "عرض ملكي (60px)", value: "60px" },
];

/**
 * Generate a deterministic selector key for an element
 */
function getElementKey(el: HTMLElement, pathname: string): string {
  if (el.dataset.liveKey) {
    return el.dataset.liveKey;
  }
  if (el.id) {
    return `id::${el.id}`;
  }
  // Tag + index in parent or short fingerprint
  const tag = el.tagName.toLowerCase();
  const parent = el.parentElement;
  let index = 0;
  if (parent) {
    const siblings = Array.from(parent.children).filter((c) => c.tagName.toLowerCase() === tag);
    index = siblings.indexOf(el);
  }
  const cleanSnippet = (el.textContent || "").trim().slice(0, 24).replace(/\s+/g, "_");
  return `${pathname}::${tag}::${index}::${cleanSnippet}`;
}

export function LiveVisualEditor() {
  const pathname = usePathname();
  const { settings, updateSettings } = useStoreSettings();

  // Mode States
  const [isAdminDetected, setIsAdminDetected] = useState(false);
  const [isLiveEdit, setIsLiveEdit] = useState(false);
  const [isVisitorPreview, setIsVisitorPreview] = useState(false);

  // Active Target Popover
  const [activeTarget, setActiveTarget] = useState<ElementTargetData | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Popover Form Fields
  const [editText, setEditText] = useState("");
  const [editHref, setEditHref] = useState("");
  const [editTarget, setEditTarget] = useState("_self");
  const [editColor, setEditColor] = useState("");
  const [editFontSize, setEditFontSize] = useState("");
  const [editFontWeight, setEditFontWeight] = useState("");
  const [editTextAlign, setEditTextAlign] = useState("");

  // Pending Changes Map
  const [pendingOverrides, setPendingOverrides] = useState<Record<string, LiveTextOverride>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hover Outline Target
  const hoveredElementRef = useRef<HTMLElement | null>(null);

  // Check if admin is logged in or URL has ?live_edit=true
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasParam =
      window.location.search.includes("live_edit=1") ||
      window.location.search.includes("live_edit=true") ||
      window.location.search.includes("edit=true");

    const hasAdminSession =
      localStorage.getItem("sulaf_admin_auth") === "true" ||
      sessionStorage.getItem("sulaf_live_edit_mode") === "true";

    if (hasParam || hasAdminSession) {
      setIsAdminDetected(true);
    }

    if (hasParam || sessionStorage.getItem("sulaf_live_edit_mode") === "true") {
      setIsLiveEdit(true);
    }
  }, []);

  // Sync session storage when live edit mode changes
  const toggleLiveEdit = (val: boolean) => {
    setIsLiveEdit(val);
    if (typeof window !== "undefined") {
      if (val) {
        sessionStorage.setItem("sulaf_live_edit_mode", "true");
        showToast("⚡ تم تفعيل وضع التحرير المباشر! انقر على أي نص أو رابط لتعديله.");
      } else {
        sessionStorage.removeItem("sulaf_live_edit_mode");
        setActiveTarget(null);
        showToast("تم إغلاق وضع التحرير المباشر.");
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Apply saved overrides to DOM on load and route change
  const applyOverrides = useCallback(() => {
    if (typeof document === "undefined") return;

    const allOverrides = {
      ...(settings.liveTextOverrides || {}),
      ...pendingOverrides,
    };

    // 1. Apply by registered key (data-live-key or id)
    Object.entries(allOverrides).forEach(([key, override]) => {
      let elements: HTMLElement[] = [];

      if (key.startsWith("id::")) {
        const id = key.replace("id::", "");
        const el = document.getElementById(id);
        if (el) elements.push(el);
      } else if (key.startsWith(`${pathname}::`)) {
        // Tag-based key
        const parts = key.split("::");
        const tag = parts[1];
        const idx = parseInt(parts[2], 10);
        const candidates = document.querySelectorAll(tag);
        if (candidates && candidates[idx]) {
          elements.push(candidates[idx] as HTMLElement);
        }
      } else {
        const byData = document.querySelector(`[data-live-key="${key}"]`);
        if (byData) elements.push(byData as HTMLElement);
      }

      elements.forEach((el) => {
        if (override.text !== undefined && override.text !== null) {
          // If element has a single text child or simple structure
          if (el.children.length === 0) {
            el.textContent = override.text;
          } else {
            // Find deep text node or update element text
            el.innerText = override.text;
          }
        }
        if (override.href !== undefined) {
          if (el.tagName.toLowerCase() === "a") {
            (el as HTMLAnchorElement).href = override.href;
          } else {
            const anchor = el.closest("a");
            if (anchor) anchor.href = override.href;
          }
        }
        if (override.target !== undefined && el.tagName.toLowerCase() === "a") {
          (el as HTMLAnchorElement).target = override.target;
        }
        if (override.color) {
          el.style.color = override.color;
        }
        if (override.fontSize) {
          el.style.fontSize = override.fontSize;
        }
        if (override.fontWeight) {
          el.style.fontWeight = override.fontWeight;
        }
      });
    });
  }, [pathname, settings.liveTextOverrides, pendingOverrides]);

  useEffect(() => {
    applyOverrides();
    // Re-run after short tick for dynamic components
    const timer = setTimeout(applyOverrides, 300);
    return () => clearTimeout(timer);
  }, [applyOverrides]);

  // Click & Hover Event Interception in Live Edit Mode
  useEffect(() => {
    if (!isLiveEdit || isVisitorPreview || typeof document === "undefined") return;

    // Hover Handler
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip live editor UI itself
      if (target.closest("[data-live-editor-ui='true']")) return;

      const isTextOrLink =
        target.tagName.toLowerCase() === "a" ||
        target.closest("a") ||
        ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "button", "blockquote", "label", "li"].includes(
          target.tagName.toLowerCase()
        ) ||
        target.dataset.liveKey;

      if (!isTextOrLink) return;

      if (hoveredElementRef.current && hoveredElementRef.current !== target) {
        hoveredElementRef.current.style.outline = "";
        hoveredElementRef.current.style.outlineOffset = "";
      }

      hoveredElementRef.current = target;
      const isAnchor = target.tagName.toLowerCase() === "a" || target.closest("a");
      target.style.outline = isAnchor ? "2px dashed #ca384a" : "2px dashed #485c36";
      target.style.outlineOffset = "3px";
      target.style.cursor = "pointer";
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === hoveredElementRef.current && target !== activeTarget?.element) {
        target.style.outline = "";
        target.style.outlineOffset = "";
      }
    };

    // Click Interceptor: Intercept click on links and text
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Skip clicks inside the editor popup or floating dock
      if (target.closest("[data-live-editor-ui='true']")) return;

      const anchor = target.tagName.toLowerCase() === "a" ? (target as HTMLAnchorElement) : target.closest("a");
      const isText = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "button", "blockquote", "label", "li"].includes(
        target.tagName.toLowerCase()
      );

      if (!anchor && !isText && !target.dataset.liveKey) return;

      // Prevent navigation on click while in live edit mode!
      e.preventDefault();
      e.stopPropagation();

      const elToEdit = anchor ? anchor : target;
      const key = getElementKey(elToEdit, pathname);
      const isLink = !!anchor;

      const rect = elToEdit.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      // Calculate popover positioning
      const popoverY = Math.max(80, rect.bottom + scrollY + 12);
      const popoverX = Math.min(window.innerWidth - 380, Math.max(16, rect.left + scrollX));

      setPopoverPos({ x: popoverX, y: popoverY });

      const currentText = (elToEdit.textContent || "").trim();
      const currentHref = anchor ? anchor.getAttribute("href") || "" : "";
      const currentTarget = anchor ? anchor.getAttribute("target") || "_self" : "_self";
      const computed = window.getComputedStyle(elToEdit);

      setActiveTarget({
        element: elToEdit,
        key,
        isLink,
        currentText,
        currentHref,
        currentTarget,
        currentColor: computed.color,
        currentFontSize: computed.fontSize,
        currentFontWeight: computed.fontWeight,
        currentTextAlign: computed.textAlign,
      });

      // Populate popover fields
      setEditText(currentText);
      setEditHref(currentHref);
      setEditTarget(currentTarget);
      setEditColor("");
      setEditFontSize("");
      setEditFontWeight("");
      setEditTextAlign("");
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("mouseout", handleMouseOut, true);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
      document.removeEventListener("click", handleClick, true);
      if (hoveredElementRef.current) {
        hoveredElementRef.current.style.outline = "";
        hoveredElementRef.current.style.outlineOffset = "";
      }
    };
  }, [isLiveEdit, isVisitorPreview, pathname, activeTarget]);

  // Apply Changes from Popover
  const handleApplyChanges = () => {
    if (!activeTarget) return;

    const { element, key, isLink } = activeTarget;

    // Direct DOM preview
    if (editText) {
      if (element.children.length === 0) {
        element.textContent = editText;
      } else {
        element.innerText = editText;
      }
    }

    if (isLink && editHref) {
      if (element.tagName.toLowerCase() === "a") {
        (element as HTMLAnchorElement).href = editHref;
        (element as HTMLAnchorElement).target = editTarget;
      }
    }

    if (editColor) element.style.color = editColor;
    if (editFontSize) element.style.fontSize = editFontSize;
    if (editFontWeight) element.style.fontWeight = editFontWeight;
    if (editTextAlign) element.style.textAlign = editTextAlign;

    // Record in pending overrides
    const newOverride: LiveTextOverride = {
      ...(pendingOverrides[key] || {}),
      text: editText,
      ...(isLink ? { href: editHref, target: editTarget } : {}),
      ...(editColor ? { color: editColor } : {}),
      ...(editFontSize ? { fontSize: editFontSize } : {}),
      ...(editFontWeight ? { fontWeight: editFontWeight } : {}),
    };

    setPendingOverrides((prev) => ({
      ...prev,
      [key]: newOverride,
    }));

    showToast(`✓ تم تطبيق التعديل على "${editText.slice(0, 18)}..."`);
    setActiveTarget(null);
  };

  // Save All Changes to Server & Store Settings
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const mergedOverrides = {
        ...(settings.liveTextOverrides || {}),
        ...pendingOverrides,
      };

      // Also sync known links into customLinks
      const updatedCustomLinks: Record<string, string> = {
        ...(settings.customLinks || {}),
      };

      Object.entries(pendingOverrides).forEach(([k, o]) => {
        if (o.href) {
          updatedCustomLinks[k] = o.href;
        }
      });

      // Update store settings context (persists to localStorage + POST /api/settings)
      updateSettings({
        liveTextOverrides: mergedOverrides,
        customLinks: updatedCustomLinks,
      });

      setPendingOverrides({});
      showToast("🎉 تم حفظ كافة التعديلات بنجاح! التغييرات حية الآن لجميع زوار المتجر.");
    } catch {
      showToast("حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  // Discard Unsaved Changes
  const handleResetPending = () => {
    if (confirm("هل تود التراجع عن التعديلات غير المحفوظة في هذه الجلسة؟")) {
      setPendingOverrides({});
      setActiveTarget(null);
      window.location.reload();
    }
  };

  const pendingCount = Object.keys(pendingOverrides).length;

  // If admin is not detected and not in live edit mode, render nothing
  if (!isAdminDetected && !isLiveEdit) {
    return null;
  }

  return (
    <>
      {/* 1. FLOATING LAUNCHER PILL (When Live Edit is OFF) */}
      {!isLiveEdit && (
        <div
          data-live-editor-ui="true"
          className="fixed bottom-6 start-6 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <button
            type="button"
            onClick={() => toggleLiveEdit(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#18271b] via-[#3a4d2c] to-[#18271b] hover:from-[#610b0d] hover:to-[#610b0d] text-[#f6f9e6] text-xs font-bold font-cairo shadow-2xl border-2 border-[#d4af37]/60 hover:border-[#d4af37] transition-all flex items-center gap-2 cursor-pointer group active:scale-95"
            title="تفعيل وضع التحرير المباشر لتعديل نصوص وروابط المتجر بنقرة واحدة"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
            <span>تعديل حي للواجهة (Live Edit)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      )}

      {/* 2. TOP FLOATING CONTROL DOCK (When Live Edit is ON) */}
      {isLiveEdit && (
        <div
          data-live-editor-ui="true"
          className="fixed top-3 inset-x-3 sm:inset-x-8 z-[99999] bg-[#18271b]/95 backdrop-blur-md text-[#f6f9e6] rounded-2xl border-2 border-[#d4af37]/70 shadow-2xl p-2.5 sm:px-5 sm:py-3 font-cairo flex flex-col md:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-[#d4af37] flex items-center justify-center font-bold shrink-0 border border-[#d4af37]/40 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-amiri font-bold text-sm text-white">سُـلاف | المحرر المرئي المباشر</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  {isVisitorPreview ? "معاينة كزائر 👁️" : "وضع التحرير نشط 🟢"}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 hidden sm:block">
                {isVisitorPreview
                  ? "أنت تشاهد الصفحة كما يراها الزائر بدون إطارات التحرير."
                  : "انقر على أي نص لتعديل كلماته وألوانه، أو انقر على أي زر/رابط لتغيير مسار التوجيه."}
              </p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Pending count */}
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                ✏️ {pendingCount} تعديل معلق
              </span>
            )}

            {/* Toggle Visitor Preview */}
            <button
              type="button"
              onClick={() => setIsVisitorPreview(!isVisitorPreview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isVisitorPreview
                  ? "bg-amber-500 text-black font-bold shadow-xs"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isVisitorPreview ? "إعادة إظهار إطارات التحرير" : "إخفاء إطارات التحرير للمعاينة كزائر"}
            >
              {isVisitorPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isVisitorPreview ? "إظهار الإطارات" : "معاينة كزائر"}</span>
            </button>

            {/* Reset / Undo */}
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={handleResetPending}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="إلغاء التعديلات غير المحفوظة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تراجع</span>
              </button>
            )}

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving || pendingCount === 0}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#485c36] to-[#2f3d23] hover:from-[#3a4d2c] hover:to-[#222e18] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-[#d4af37]/40 active:scale-95"
            >
              <Save className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات الآن ✓"}</span>
            </button>

            {/* Exit Mode */}
            <button
              type="button"
              onClick={() => toggleLiveEdit(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="إغلاق وضع التحرير المباشر"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. FLOATING IN-CONTEXT POPOVER EDITOR */}
      {isLiveEdit && !isVisitorPreview && activeTarget && (
        <div
          data-live-editor-ui="true"
          style={{ top: `${popoverPos.y}px`, left: `${popoverPos.x}px` }}
          className="absolute z-[999999] w-[340px] sm:w-[400px] bg-white rounded-3xl border-2 border-[#485c36] shadow-2xl p-5 text-gray-900 font-cairo space-y-4 animate-in fade-in zoom-in-95 duration-150"
          dir="rtl"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                  activeTarget.isLink ? "bg-[#ca384a]" : "bg-[#485c36]"
                }`}
              >
                {activeTarget.isLink ? <LinkIcon className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              </div>
              <h5 className="font-bold text-xs text-gray-900">
                {activeTarget.isLink ? "تعديل الرابط والنص (Link & Text)" : "تعديل النص والمظهر (Live Text Editor)"}
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setActiveTarget(null)}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
              <Type className="w-3 h-3 text-[#485c36]" />
              <span>محتوى النص (Text Content):</span>
            </label>
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="اكتب النص الجديد هنا..."
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36] focus:ring-1 focus:ring-[#485c36] leading-relaxed"
              dir="auto"
            />
          </div>

          {/* Hyperlink Fields (If Element is Link or Button) */}
          {activeTarget.isLink && (
            <div className="space-y-2.5 p-3 rounded-2xl bg-[#f6f9e6] border border-[#dbe2bd]">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#18271b] flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-[#ca384a]" />
                  <span>رابط الوجهة (Hyperlink URL):</span>
                </label>
                <input
                  type="text"
                  value={editHref}
                  onChange={(e) => setEditHref(e.target.value)}
                  placeholder="/shop أو /product/... أو https://..."
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                  dir="ltr"
                />
              </div>

              {/* Quick Preset Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                  <Sliders className="w-2.5 h-2.5 text-[#d4af37]" />
                  <span>أو اختر من صفحات المتجر الجاهزة:</span>
                </label>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setEditHref(e.target.value);
                  }}
                  className="w-full px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                >
                  <option value="">-- اختاري صفحة للتوجيه التلقائي --</option>
                  {STORE_PAGES_PRESETS.map((p) => (
                    <option key={p.url} value={p.url}>
                      {p.label} ({p.url})
                    </option>
                  ))}
                </select>
              </div>

              {/* Open in new tab toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-gray-700 select-none pt-1">
                <input
                  type="checkbox"
                  checked={editTarget === "_blank"}
                  onChange={(e) => setEditTarget(e.target.checked ? "_blank" : "_self")}
                  className="w-3.5 h-3.5 text-[#485c36] rounded cursor-pointer"
                />
                <span>فتح الرابط في نافذة جديدة (target=&quot;_blank&quot;)</span>
              </label>
            </div>
          )}

          {/* Typography Styling Controls */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[11px] font-bold text-gray-700 block">خيارات التنسيق البصري:</span>

            <div className="grid grid-cols-2 gap-2">
              {/* Font Size Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold">حجم الخط (Size):</label>
                <select
                  value={editFontSize}
                  onChange={(e) => setEditFontSize(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                >
                  <option value="">الافتراضي الحالي</option>
                  {FONT_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alignment Controls */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold">المحاذاة والسمك:</label>
                <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-0.5 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setEditTextAlign("right")}
                    className={`p-1 rounded ${
                      editTextAlign === "right" ? "bg-[#485c36] text-white" : "text-gray-600 hover:bg-white"
                    }`}
                    title="محاذاة لليمين"
                  >
                    <AlignRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTextAlign("center")}
                    className={`p-1 rounded ${
                      editTextAlign === "center" ? "bg-[#485c36] text-white" : "text-gray-600 hover:bg-white"
                    }`}
                    title="توسيط"
                  >
                    <AlignCenter className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTextAlign("left")}
                    className={`p-1 rounded ${
                      editTextAlign === "left" ? "bg-[#485c36] text-white" : "text-gray-600 hover:bg-white"
                    }`}
                    title="محاذاة لليسار"
                  >
                    <AlignLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditFontWeight(editFontWeight === "bold" ? "normal" : "bold")}
                    className={`p-1 rounded font-bold text-xs ${
                      editFontWeight === "bold" ? "bg-[#485c36] text-white" : "text-gray-600 hover:bg-white"
                    }`}
                    title="عريض Bold"
                  >
                    <Bold className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-bold flex items-center justify-between">
                <span>لون النص (Brand Palette):</span>
                {editColor && <span className="font-mono text-[9px] text-[#485c36]">{editColor}</span>}
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setEditColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer shadow-2xs ${
                      editColor === c.hex ? "border-[#485c36] ring-2 ring-[#485c36]/40 scale-110" : "border-gray-300"
                    }`}
                    title={c.name}
                  />
                ))}
                {editColor && (
                  <button
                    type="button"
                    onClick={() => setEditColor("")}
                    className="text-[10px] text-rose-500 hover:underline px-1 cursor-pointer"
                  >
                    إلغاء اللون
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {activeTarget.isLink && activeTarget.currentHref ? (
              <a
                href={activeTarget.currentHref}
                target={activeTarget.currentTarget}
                className="text-[11px] font-bold text-gray-500 hover:text-[#485c36] flex items-center gap-1 cursor-pointer"
                title="الانتقال الفعلي للرابط"
              >
                <span>زيارة الرابط</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTarget(null)}
                className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleApplyChanges}
                className="px-5 py-1.5 rounded-xl bg-[#485c36] hover:bg-[#3d502d] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>تطبيق التعديل ✓</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TOAST NOTIFICATION */}
      {toastMessage && (
        <div
          data-live-editor-ui="true"
          className="fixed bottom-6 end-6 z-[9999999] bg-[#18271b] text-[#f6f9e6] px-5 py-3 rounded-2xl border-2 border-[#d4af37] shadow-2xl text-xs font-bold font-cairo flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
          dir="rtl"
        >
          <Sparkles className="w-4 h-4 text-[#d4af37] animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

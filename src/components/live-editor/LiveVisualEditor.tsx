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
  AlignRight,
  AlignCenter,
  AlignLeft,
  Bold,
  Sliders,
  Trash2,
  Layers,
  LayoutGrid,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface ElementTargetData {
  element: HTMLElement;
  key: string;
  isLink: boolean;
  isSection: boolean;
  isContainer: boolean;
  canEditText: boolean;
  sectionName?: string;
  tagName: string;
  currentText: string;
  currentHref?: string;
  currentTarget?: string;
  currentColor?: string;
  currentFontSize?: string;
  currentFontWeight?: string;
  currentTextAlign?: string;
  currentFontFamily?: string;
  currentIsHidden?: boolean;
  currentIsDeleted?: boolean;
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

const FONT_FAMILIES = [
  { label: "عقيق راوندد برو (عربي عادي)", value: "'Aqeeq Rounded Pro', 'Aqeeq', sans-serif" },
  { label: "جلزار (عربي عنوان وشعر)", value: "'Gulzar', 'Amiri', serif" },
  { label: "Cinzel Decorative (إنجليزي عناوين)", value: "'Cinzel Decorative', serif" },
  { label: "Glacial Indifference (إنجليزي حديث)", value: "'Glacial Indifference', sans-serif" },
  { label: "Cormorant Garamond (إنجليزي فاخر)", value: "'Cormorant Garamond', serif" },
];

/**
 * Generate a deterministic, rock-solid selector key for an element.
 * Never relies on unstable global document querySelectorAll indexes.
 */
function getElementKey(el: HTMLElement, pathname: string): string {
  if (el.dataset.liveKey) {
    return `live::${el.dataset.liveKey}`;
  }
  if (el.dataset.liveSection) {
    return `section::${el.dataset.liveSection}`;
  }
  if (el.id) {
    return `id::${el.id}`;
  }

  // Look for the closest section container for scoped selector
  const section = el.closest("[data-live-section]") as HTMLElement | null;
  const sectionId = section?.getAttribute("data-live-section");

  const pathParts: string[] = [];
  let curr: HTMLElement | null = el;
  const stopAt = section || document.body;

  while (curr && curr !== stopAt && curr.parentElement) {
    const parentEl: HTMLElement = curr.parentElement;
    const tag = curr.tagName.toLowerCase();
    const sameTagSiblings = Array.from(parentEl.children).filter((c: Element) => c.tagName.toLowerCase() === tag);
    const index = sameTagSiblings.indexOf(curr);
    pathParts.unshift(`${tag}:nth-of-type(${index + 1})`);
    curr = parentEl;
  }

  const pathStr = pathParts.join(" > ");
  const snippet = (el.textContent || "").trim().slice(0, 16).replace(/[\s\r\n]+/g, "_");

  if (sectionId) {
    return `secPath::${sectionId}::${pathStr}::${snippet}`;
  } else {
    return `pagePath::${pathname}::${pathStr}::${snippet}`;
  }
}

/**
 * Resolve an element by key safely without global tag index ambiguity.
 */
function resolveElementByKey(key: string, pathname: string): HTMLElement | null {
  if (typeof document === "undefined") return null;

  try {
    if (key.startsWith("live::")) {
      const liveKey = key.replace("live::", "");
      return document.querySelector(`[data-live-key="${liveKey}"]`);
    }
    if (key.startsWith("section::")) {
      const secId = key.replace("section::", "");
      return document.querySelector(`[data-live-section="${secId}"]`);
    }
    if (key.startsWith("id::")) {
      const id = key.replace("id::", "");
      return document.getElementById(id);
    }
    if (key.startsWith("secPath::")) {
      const parts = key.split("::");
      const secId = parts[1];
      const path = parts[2];
      const secEl = document.querySelector(`[data-live-section="${secId}"]`);
      if (secEl && path) {
        return (secEl.querySelector(path) as HTMLElement) || null;
      }
      return null;
    }
    if (key.startsWith("pagePath::")) {
      const parts = key.split("::");
      const page = parts[1];
      const path = parts[2];
      if (page === pathname && path) {
        return (document.body.querySelector(path) as HTMLElement) || null;
      }
      return null;
    }

    // Backwards compatibility for legacy keys, but with strict leaf-tag & text-match validation
    if (key.startsWith(`${pathname}::`)) {
      const parts = key.split("::");
      const tag = parts[1];
      const cleanSnippet = parts[3];
      // Only match leaf text tags to avoid touching root containers
      if (
        tag &&
        cleanSnippet &&
        ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "button", "label", "b", "strong"].includes(tag)
      ) {
        const candidates = Array.from(document.querySelectorAll(tag));
        const matched = candidates.find((c) => {
          const s = (c.textContent || "").trim().slice(0, 24).replace(/\s+/g, "_");
          return s === cleanSnippet;
        });
        if (matched) return matched as HTMLElement;
      }
    }
  } catch (err) {
    console.warn("LiveVisualEditor: error resolving key", key, err);
  }

  return null;
}

/**
 * Safely applies text without using innerText which destroys child JSX/HTML elements.
 */
function applyTextSafely(element: HTMLElement, newText: string) {
  // If element has no child elements, textContent is 100% safe
  if (element.children.length === 0) {
    element.textContent = newText;
    return;
  }

  // If element has direct text nodes, update the first non-empty text node
  const childNodes = Array.from(element.childNodes);
  const textNode = childNodes.find(
    (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0
  );
  if (textNode) {
    textNode.textContent = newText;
    return;
  }

  // If there's an inner leaf text element (like a single <span> or <p>), update it
  const leaf = element.querySelector("span, p, strong, b, em, label, h1, h2, h3, h4, h5, h6");
  if (leaf && leaf.children.length === 0) {
    leaf.textContent = newText;
    return;
  }

  // Fallback: only if it contains ONLY text nodes and no child elements
  const hasElementChildren = childNodes.some((n) => n.nodeType === Node.ELEMENT_NODE);
  if (!hasElementChildren) {
    element.textContent = newText;
  }
}

export function LiveVisualEditor() {
  const pathname = usePathname();
  const { settings, updateSettings } = useStoreSettings();

  // Mode States - Default to true if sulaf_admin_auth or param exists, else always allow admin bar
  const [isAdminDetected, setIsAdminDetected] = useState(true);
  const [isLiveEdit, setIsLiveEdit] = useState(false);
  const [isVisitorPreview, setIsVisitorPreview] = useState(false);
  const [sectionsDrawerOpen, setSectionsDrawerOpen] = useState(false);

  // Active Target Popover
  const [activeTarget, setActiveTarget] = useState<ElementTargetData | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Discovered Live Sections on the current rendered DOM
  const [discoveredSections, setDiscoveredSections] = useState<Array<{ id: string; label: string }>>([]);

  // Popover Form Fields
  const [editText, setEditText] = useState("");
  const [editHref, setEditHref] = useState("");
  const [editTarget, setEditTarget] = useState("_self");
  const [editColor, setEditColor] = useState("");
  const [editFontSize, setEditFontSize] = useState("");
  const [editFontWeight, setEditFontWeight] = useState("");
  const [editTextAlign, setEditTextAlign] = useState("");
  const [editFontFamily, setEditFontFamily] = useState("");
  const [editIsHidden, setEditIsHidden] = useState(false);

  // Pending Changes Map
  const [pendingOverrides, setPendingOverrides] = useState<Record<string, LiveTextOverride>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hover Outline Target
  const hoveredElementRef = useRef<HTMLElement | null>(null);

  // Scan and discover rendered sections dynamically on the current page
  useEffect(() => {
    if (typeof document === "undefined") return;

    const scanSections = () => {
      const sectionElements = document.querySelectorAll("[data-live-section]");
      const found: Array<{ id: string; label: string }> = [];

      sectionElements.forEach((el) => {
        const secId = el.getAttribute("data-live-section");
        const secName = el.getAttribute("data-section-name") || secId || "قسم";
        if (secId && !found.some((s) => s.id === secId)) {
          found.push({ id: secId, label: secName });
        }
      });

      setDiscoveredSections(found);
    };

    scanSections();
    const timer = setTimeout(scanSections, 500);
    return () => clearTimeout(timer);
  }, [pathname, isLiveEdit]);

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
        showToast("⚡ تم تفعيل وضع التحرير المباشر! انقر على أي نص، زر، أو قسم لتعديله أو إخفائه.");
      } else {
        sessionStorage.removeItem("sulaf_live_edit_mode");
        setActiveTarget(null);
        setSectionsDrawerOpen(false);
        showToast("تم إغلاق وضع التحرير المباشر.");
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Apply saved overrides to DOM safely
  const applyOverrides = useCallback(() => {
    if (typeof document === "undefined") return;

    const allOverrides = {
      ...(settings.liveTextOverrides || {}),
      ...pendingOverrides,
    };

    Object.entries(allOverrides).forEach(([key, override]) => {
      const el = resolveElementByKey(key, pathname);
      if (!el) return;

      const isSec = key.startsWith("section::") || !!el.getAttribute("data-live-section");
      const isContainer = el.children.length > 1;

      // Handle Hide / Delete
      if (override.isHidden || override.isDeleted) {
        el.style.setProperty("display", "none", "important");
        return;
      } else {
        el.style.removeProperty("display");
      }

      // Never apply text to a whole section or multi-child container!
      if (!isSec && !isContainer && override.text !== undefined && override.text !== null) {
        applyTextSafely(el, override.text);
      } else if (!isSec && override.text !== undefined && override.text !== null) {
        // Safe leaf update for simple wrappers
        applyTextSafely(el, override.text);
      }

      // Handle link destination
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

      // Typography styling: ONLY apply to leaf elements, NEVER to sections or large containers
      if (!isSec && !isContainer) {
        if (override.color) el.style.color = override.color;
        if (override.fontSize) el.style.fontSize = override.fontSize;
        if (override.fontWeight) el.style.fontWeight = override.fontWeight;
        if (override.fontFamily) el.style.fontFamily = override.fontFamily;
      }
    });
  }, [pathname, settings.liveTextOverrides, pendingOverrides]);

  useEffect(() => {
    applyOverrides();
    const timer = setTimeout(applyOverrides, 300);
    return () => clearTimeout(timer);
  }, [applyOverrides]);

  // Open Section Editor Specifically
  const openSectionEditor = (secEl: HTMLElement) => {
    const secId = secEl.getAttribute("data-live-section") || "section";
    const secName = secEl.getAttribute("data-section-name") || secId;
    const key = `section::${secId}`;
    const existingOv = (settings.liveTextOverrides || {})[key] || pendingOverrides[key] || {};

    const rect = secEl.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    const popoverY = Math.max(80, rect.top + scrollY + 40);
    const popoverX = Math.min(window.innerWidth - 440, Math.max(16, rect.left + scrollX + 30));

    setPopoverPos({ x: popoverX, y: popoverY });

    setActiveTarget({
      element: secEl,
      key,
      isLink: false,
      isSection: true,
      isContainer: true,
      canEditText: false,
      sectionName: secName,
      tagName: secEl.tagName.toLowerCase(),
      currentText: "",
      currentIsHidden: existingOv.isHidden || false,
      currentIsDeleted: existingOv.isDeleted || false,
    });

    setEditText("");
    setEditHref("");
    setEditTarget("_self");
    setEditColor("");
    setEditFontSize("");
    setEditFontWeight("");
    setEditTextAlign("");
    setEditFontFamily("");
    setEditIsHidden(existingOv.isHidden || false);
  };

  // Click & Hover Event Interception in Live Edit Mode
  useEffect(() => {
    if (!isLiveEdit || isVisitorPreview || typeof document === "undefined") return;

    // Hover Handler
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-live-editor-ui='true']")) return;

      const tagName = target.tagName.toLowerCase();
      if (["input", "textarea", "select"].includes(tagName)) return;

      const sectionContainer = target.closest("[data-live-section]") as HTMLElement | null;
      const isDirectSection = target.hasAttribute("data-live-section");
      const isAltKey = e.altKey;

      const isTextOrLink =
        target.tagName.toLowerCase() === "a" ||
        target.closest("a") ||
        ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "button", "blockquote", "label", "li", "img", "strong", "b", "em"].includes(
          target.tagName.toLowerCase()
        ) ||
        target.dataset.liveKey ||
        isDirectSection;

      if (!isTextOrLink && !sectionContainer) return;

      const elementToHighlight = (isAltKey || isDirectSection) && sectionContainer ? sectionContainer : target;

      if (hoveredElementRef.current && hoveredElementRef.current !== elementToHighlight) {
        hoveredElementRef.current.style.outline = "";
        hoveredElementRef.current.style.outlineOffset = "";
      }

      hoveredElementRef.current = elementToHighlight;
      const isSec = !!elementToHighlight.dataset.liveSection;
      const isAnchor = elementToHighlight.tagName.toLowerCase() === "a" || elementToHighlight.closest("a");

      if (isSec) {
        elementToHighlight.style.outline = "3px dashed #d4af37";
        elementToHighlight.style.outlineOffset = "-3px";
      } else {
        elementToHighlight.style.outline = isAnchor ? "2px dashed #ca384a" : "2px dashed #485c36";
        elementToHighlight.style.outlineOffset = "2px";
      }
      elementToHighlight.style.cursor = "pointer";
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target === hoveredElementRef.current && target !== activeTarget?.element) {
        target.style.outline = "";
        target.style.outlineOffset = "";
      }
    };

    // Click Interceptor: accurately selects leaf elements and avoids destroying parent layout
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-live-editor-ui='true']")) return;

      const tagName = target.tagName.toLowerCase();
      if (["input", "textarea", "select"].includes(tagName)) return;

      const sectionContainer = target.closest("[data-live-section]") as HTMLElement | null;
      const isDirectSectionClick = target.hasAttribute("data-live-section");
      const wantsSection = e.altKey || isDirectSectionClick;

      // If user Alt+clicks or clicks directly on section border
      if (wantsSection && sectionContainer) {
        e.preventDefault();
        e.stopPropagation();
        openSectionEditor(sectionContainer);
        return;
      }

      // Normal click: pick the exact leaf element that was clicked
      let leafElement: HTMLElement = target;

      // If user clicked inside an SVG or icon, ascend to parent text/button
      if (["svg", "path", "g", "circle"].includes(tagName)) {
        const parentInteractive = target.closest("button, a, span, p, h1, h2, h3, h4, h5, h6, li");
        if (parentInteractive) leafElement = parentInteractive as HTMLElement;
      }

      // Find enclosing link if any
      const enclosingLink =
        leafElement.tagName.toLowerCase() === "a" ? (leafElement as HTMLAnchorElement) : leafElement.closest("a");

      const hasMultipleChildElements = leafElement.children.length > 1;
      const directText = Array.from(leafElement.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0)
        .map((n) => n.textContent?.trim())
        .join(" ");

      const canEditText = (leafElement.children.length === 0 || directText.length > 0) && !hasMultipleChildElements;
      const isContainer = !canEditText && leafElement.children.length > 0;

      // Extract text safely without concatenating child elements destructively
      let currentText = "";
      if (canEditText) {
        if (leafElement.children.length === 0) {
          currentText = (leafElement.textContent || "").trim();
        } else {
          currentText = directText;
          if (!currentText) {
            const firstLeaf = leafElement.querySelector("span, strong, b, em, p, h1, h2, h3, h4, h5, h6");
            currentText = (firstLeaf?.textContent || "").trim();
          }
        }
      }

      e.preventDefault();
      e.stopPropagation();

      const key = getElementKey(leafElement, pathname);
      const rect = leafElement.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      const popoverY = Math.max(80, rect.bottom + scrollY + 12);
      const popoverX = Math.min(window.innerWidth - 440, Math.max(16, rect.left + scrollX));

      setPopoverPos({ x: popoverX, y: popoverY });

      const currentHref = enclosingLink ? enclosingLink.getAttribute("href") || "" : "";
      const currentTarget = enclosingLink ? enclosingLink.getAttribute("target") || "_self" : "_self";
      const computed = window.getComputedStyle(leafElement);
      const existingOv = (settings.liveTextOverrides || {})[key] || pendingOverrides[key] || {};

      setActiveTarget({
        element: leafElement,
        key,
        isLink: !!enclosingLink,
        isSection: false,
        isContainer,
        canEditText,
        sectionName:
          sectionContainer?.getAttribute("data-section-name") ||
          sectionContainer?.getAttribute("data-live-section") ||
          undefined,
        tagName: leafElement.tagName.toLowerCase(),
        currentText,
        currentHref,
        currentTarget,
        currentColor: computed.color,
        currentFontSize: computed.fontSize,
        currentFontWeight: computed.fontWeight,
        currentTextAlign: computed.textAlign,
        currentIsHidden: existingOv.isHidden || false,
        currentIsDeleted: existingOv.isDeleted || false,
      });

      setEditText(existingOv.text !== undefined ? existingOv.text : currentText);
      setEditHref(existingOv.href !== undefined ? existingOv.href : currentHref);
      setEditTarget(existingOv.target || currentTarget);
      setEditColor(existingOv.color || "");
      setEditFontSize(existingOv.fontSize || "");
      setEditFontWeight(existingOv.fontWeight || "");
      setEditTextAlign("");
      setEditFontFamily(existingOv.fontFamily || "");
      setEditIsHidden(existingOv.isHidden || false);
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
  }, [isLiveEdit, isVisitorPreview, pathname, activeTarget, settings.liveTextOverrides, pendingOverrides]);

  // Apply Changes from Popover safely
  const handleApplyChanges = () => {
    if (!activeTarget) return;

    const { element, key, isLink, isSection, isContainer, canEditText } = activeTarget;

    // Direct DOM preview
    if (!editIsHidden) {
      element.style.removeProperty("display");

      // Apply text ONLY if it's a leaf text element and can edit text safely
      if (canEditText && editText && !isSection) {
        applyTextSafely(element, editText);
      }

      // Apply link URL to enclosing link if applicable
      if (isLink && editHref) {
        if (element.tagName.toLowerCase() === "a") {
          (element as HTMLAnchorElement).href = editHref;
          (element as HTMLAnchorElement).target = editTarget;
        } else {
          const anchor = element.closest("a");
          if (anchor) {
            anchor.href = editHref;
            anchor.target = editTarget;
          }
        }
      }

      // Apply typography styles ONLY if it's not a section/container
      if (!isSection && !isContainer) {
        if (editColor) element.style.color = editColor;
        if (editFontSize) element.style.fontSize = editFontSize;
        if (editFontWeight) element.style.fontWeight = editFontWeight;
        if (editTextAlign) element.style.textAlign = editTextAlign;
        if (editFontFamily) element.style.fontFamily = editFontFamily;
      }
    } else {
      element.style.setProperty("display", "none", "important");
    }

    const newOverride: LiveTextOverride = {
      ...(pendingOverrides[key] || {}),
      ...(canEditText && editText && !isSection ? { text: editText } : {}),
      ...(isLink ? { href: editHref, target: editTarget } : {}),
      ...(!isSection && !isContainer && editColor ? { color: editColor } : {}),
      ...(!isSection && !isContainer && editFontSize ? { fontSize: editFontSize } : {}),
      ...(!isSection && !isContainer && editFontWeight ? { fontWeight: editFontWeight } : {}),
      ...(!isSection && !isContainer && editFontFamily ? { fontFamily: editFontFamily } : {}),
      isHidden: editIsHidden,
    };

    setPendingOverrides((prev) => ({
      ...prev,
      [key]: newOverride,
    }));

    showToast(`✓ تم تطبيق التعديل بنجاح`);
    setActiveTarget(null);
  };

  // Immediate Hide Action
  const handleQuickHide = () => {
    if (!activeTarget) return;
    const { element, key } = activeTarget;

    element.style.setProperty("display", "none", "important");

    const newOverride: LiveTextOverride = {
      ...(pendingOverrides[key] || {}),
      isHidden: true,
    };

    setPendingOverrides((prev) => ({
      ...prev,
      [key]: newOverride,
    }));

    showToast(`👁️ تم إخفاء العنصر! يمكنك حفظ التغييرات الآن.`);
    setActiveTarget(null);
  };

  // Immediate Delete Action
  const handleQuickDelete = () => {
    if (!activeTarget) return;
    if (!confirm("هل أنت متأكد من حذف هذا العنصر نهائياً من العرض؟")) return;

    const { element, key } = activeTarget;
    element.style.setProperty("display", "none", "important");

    const newOverride: LiveTextOverride = {
      ...(pendingOverrides[key] || {}),
      isDeleted: true,
      isHidden: true,
    };

    setPendingOverrides((prev) => ({
      ...prev,
      [key]: newOverride,
    }));

    showToast(`🗑️ تم حذف العنصر من الواجهة! اضغط "حفظ التغييرات" لتثبيته.`);
    setActiveTarget(null);
  };

  // Toggle section visibility from Sections Manager
  const handleToggleSectionKey = (secKey: string) => {
    const key = `section::${secKey}`;
    const currentOv = pendingOverrides[key] || (settings.liveTextOverrides || {})[key] || {};
    const willHide = !currentOv.isHidden && !currentOv.isDeleted;

    const secEl = document.querySelector(`[data-live-section="${secKey}"]`) as HTMLElement | null;
    if (secEl) {
      if (willHide) {
        secEl.style.setProperty("display", "none", "important");
      } else {
        secEl.style.removeProperty("display");
      }
    }

    const newOverride: LiveTextOverride = {
      ...currentOv,
      isHidden: willHide,
      isDeleted: false,
    };

    setPendingOverrides((prev) => ({
      ...prev,
      [key]: newOverride,
    }));

    showToast(willHide ? `تم إخفاء القسم "${secKey}"` : `تم إظهار القسم "${secKey}"`);
  };

  // Save All Changes to Server & Store Settings
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const mergedOverrides = {
        ...(settings.liveTextOverrides || {}),
        ...pendingOverrides,
      };

      const updatedCustomLinks: Record<string, string> = {
        ...(settings.customLinks || {}),
      };

      Object.entries(pendingOverrides).forEach(([k, o]) => {
        if (o.href) {
          updatedCustomLinks[k] = o.href;
        }
      });

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

  // Restore All Hidden & Deleted Elements
  const handleRestoreAll = () => {
    if (!confirm("هل تود استعادة وإظهار جميع العناصر والأقسام المخفية؟")) return;

    const cleanOverrides: Record<string, LiveTextOverride> = {};
    Object.entries(settings.liveTextOverrides || {}).forEach(([k, v]) => {
      cleanOverrides[k] = { ...v, isHidden: false, isDeleted: false };
    });

    // Reset DOM styles
    document.querySelectorAll("[data-live-section]").forEach((el) => {
      (el as HTMLElement).style.removeProperty("display");
    });

    updateSettings({
      liveTextOverrides: cleanOverrides,
    });
    setPendingOverrides({});
    setActiveTarget(null);
    showToast("✓ تم إظهار جميع العناصر والأقسام المخفية.");
    setTimeout(() => window.location.reload(), 600);
  };

  // Reset/Fix All Overrides and restore original HTML text formatting
  const handleResetAllOverrides = () => {
    if (!confirm("هل تود مسح كافة تعديلات النصوص وإعادة ضبط الموقع لتنسيقه وتصميمه الأصلي 100%؟")) return;

    updateSettings({
      liveTextOverrides: {},
    });
    setPendingOverrides({});
    setActiveTarget(null);
    showToast("✓ تم إعادة ضبط جميع النصوص للأصل واستعادة التصميم الكامل!");
    setTimeout(() => window.location.reload(), 600);
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
  const pageSections = discoveredSections;

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
            title="تفعيل وضع التحرير المباشر لتعديل نصوص، روابط، وأقسام المتجر"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37] animate-pulse" />
            <span>تعديل حي للموقع (Live Edit)</span>
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
                  : "انقر على أي نص محدد أو زر لتعديله، أو اضغط Alt+نقر على أي قسم لإدارته وإخفائه."}
              </p>
            </div>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Sections Manager Drawer Button */}
            <button
              type="button"
              onClick={() => setSectionsDrawerOpen(!sectionsDrawerOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                sectionsDrawerOpen
                  ? "bg-[#d4af37] text-[#18271b]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title="إدارة أقسام الصفحة وإخفاؤها أو إظهارها"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>إدارة الأقسام ({pageSections.length})</span>
            </button>

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

            {/* Restore Hidden Elements Button */}
            <button
              type="button"
              onClick={handleRestoreAll}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="إلغاء الإخفاء وإظهار جميع العناصر والأقسام المخفية"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إظهار المخفي</span>
            </button>

            {/* Reset All Overrides / Repair Button */}
            <button
              type="button"
              onClick={handleResetAllOverrides}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="إعادة ضبط كافة النصوص للأصل واستعادة التصميم الأولي 100%"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">استعادة الأصل</span>
            </button>

            {/* Reset / Undo Pending */}
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

      {/* SECTIONS MANAGER DRAWER (Floating Modal) */}
      {isLiveEdit && sectionsDrawerOpen && (
        <div
          data-live-editor-ui="true"
          className="fixed top-20 start-6 z-[99999] w-80 bg-[#18271b] border-2 border-[#d4af37] text-white rounded-3xl shadow-2xl p-4 font-cairo space-y-3 animate-in fade-in slide-in-from-top-2"
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#d4af37]" />
              <h4 className="font-bold text-xs text-white">أقسام الصفحة الفعلية</h4>
            </div>
            <button
              type="button"
              onClick={() => setSectionsDrawerOpen(false)}
              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[10px] text-gray-300">
            أقسام الصفحة الحالية المعروضة أمامك الآن، يمكنك إخفاء أو إظهار أي قسم بنقرة:
          </p>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {pageSections.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center">لا توجد أقسام رئيسية محددة في هذه الصفحة.</p>
            ) : (
              pageSections.map((sec) => {
                const secKey = `section::${sec.id}`;
                const isHidden =
                  pendingOverrides[secKey]?.isHidden ||
                  (settings.liveTextOverrides || {})[secKey]?.isHidden ||
                  false;

                return (
                  <div
                    key={sec.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs"
                  >
                    <span className={`font-semibold ${isHidden ? "text-gray-400 line-through" : "text-white"}`}>
                      {sec.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleSectionKey(sec.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        isHidden
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{isHidden ? "مخفي" : "ظاهر"}</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <p className="text-[10px] text-amber-300/80 pt-1 border-t border-white/10">
            * اضغط &quot;حفظ التغييرات&quot; في الشريط العلوي لتثبيت إخفاء الأقسام للزوار.
          </p>
        </div>
      )}

      {/* 3. FLOATING IN-CONTEXT POPOVER EDITOR */}
      {isLiveEdit && !isVisitorPreview && activeTarget && (
        <div
          data-live-editor-ui="true"
          style={{ top: `${popoverPos.y}px`, left: `${popoverPos.x}px` }}
          className="absolute z-[999999] w-[350px] sm:w-[420px] bg-white rounded-3xl border-2 border-[#485c36] shadow-2xl p-5 text-gray-900 font-cairo space-y-4 animate-in fade-in zoom-in-95 duration-150"
          dir="rtl"
        >
          {/* Popover Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                  activeTarget.isSection
                    ? "bg-[#d4af37] text-[#18271b]"
                    : activeTarget.isLink
                    ? "bg-[#ca384a]"
                    : activeTarget.isContainer
                    ? "bg-amber-600"
                    : "bg-[#485c36]"
                }`}
              >
                {activeTarget.isSection ? (
                  <Layers className="w-3.5 h-3.5" />
                ) : activeTarget.isLink ? (
                  <LinkIcon className="w-3.5 h-3.5" />
                ) : activeTarget.isContainer ? (
                  <LayoutGrid className="w-3.5 h-3.5" />
                ) : (
                  <Edit3 className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <h5 className="font-bold text-xs text-gray-900">
                  {activeTarget.isSection
                    ? `إدارة قسم: ${activeTarget.sectionName || "قسم في الصفحة"}`
                    : activeTarget.isLink
                    ? "تعديل الرابط والنص (Link & Text)"
                    : activeTarget.isContainer
                    ? "حاوية عناصر / بطاقة (Item Container)"
                    : "تعديل النص والمظهر (Text Editor)"}
                </h5>
                <span className="text-[10px] text-gray-400 font-mono">
                  {activeTarget.tagName} • {activeTarget.key.slice(0, 32)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTarget(null)}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Visibility & Delete Toolbar */}
          <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setEditIsHidden(!editIsHidden)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  editIsHidden
                    ? "bg-amber-500 text-black shadow-xs"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                title="إخفاء هذا العنصر/القسم من العرض"
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                <span>{editIsHidden ? "محدد للإخفاء" : "إخفاء العنصر"}</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDelete}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
                title="حذف هذا العنصر من الصفحة"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>حذف نهائي</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleQuickHide}
              className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer"
              title="إخفاء سريع الآن"
            >
              إخفاء سريع
            </button>
          </div>

          {/* If Section: Show Section Specific Controls (NO TEXT AREA TO AVOID DESTROYING LAYOUT) */}
          {activeTarget.isSection ? (
            <div className="p-3 rounded-2xl bg-[#f4f1e6] border border-[#dbe2bd] space-y-2">
              <p className="text-xs font-bold text-[#18271b]">
                قسم رئيسي كامل: &quot;{activeTarget.sectionName}&quot;
              </p>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                يمكنك إخفاء هذا القسم بالكامل من الموقع بالضغط على زر &quot;إخفاء العنصر&quot; بالأعلى، أو حذفه بالضغط على &quot;حذف نهائي&quot;، دون التأثير على تنسيق باقي الموقع.
              </p>
            </div>
          ) : activeTarget.isContainer ? (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>حاوية عناصر / بطاقة مجمعة</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                هذا العنصر يضم عدة عناصر فرعية (أيقونات، صور، ونصوص). لحماية التنسيق والتصميم، يمكنك إخفاؤه أو حذفه بالكامل، أو انقر مباشرة على أي نص محدد بداخله لتعديل كلماته بأمان.
              </p>
            </div>
          ) : (
            <>
              {/* Text Input */}
              {activeTarget.canEditText && (
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
              )}

              {/* Hyperlink Fields (If Element is Link or Button) */}
              {activeTarget.isLink && (
                <div className="space-y-2.5 p-3 rounded-2xl bg-[#f4f1e6] border border-[#dbe2bd]">
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

              {/* Typography Styling Controls (For Text Leaf elements only) */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[11px] font-bold text-gray-700 block">خيارات الخط والمظهر البصري:</span>

                {/* Font Family Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold">نوع الخط (Font Family):</label>
                  <select
                    value={editFontFamily}
                    onChange={(e) => setEditFontFamily(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                  >
                    <option value="">الافتراضي الحالي للعنصر</option>
                    {FONT_FAMILIES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

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
            </>
          )}

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

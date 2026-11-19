"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useStoreSettings } from "@/lib/settings/store-settings-context";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  LiveAddedElement,
  LiveEditorLanguage,
  LiveTextOverride,
  getLiveAddedElementsForLang,
  getLiveTextOverridesForLang,
  materializeLegacyLiveEditorState,
} from "@/lib/settings/store-settings";
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
  PlusCircle,
  Globe,
} from "lucide-react";

interface RepeatableContext {
  parentEl: HTMLElement;
  parentKey: string;
  templateEl: HTMLElement;
  itemLabel: string;
  nextOrdinal: number;
}

interface ElementTargetData {
  element: HTMLElement;
  key: string;
  isLink: boolean;
  isSection: boolean;
  isContainer: boolean;
  canEditText: boolean;
  repeatable?: RepeatableContext | null;
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
  if (el.dataset.liveCloneId) {
    return `clone::${el.dataset.liveCloneId}`;
  }
  if (el.dataset.liveKey) {
    return `live::${el.dataset.liveKey}`;
  }
  const closestLiveKeyEl = el.closest("[data-live-key]") as HTMLElement | null;
  if (closestLiveKeyEl && closestLiveKeyEl.dataset.liveKey) {
    return `live::${closestLiveKeyEl.dataset.liveKey}`;
  }
  if (el.dataset.liveList) {
    return `list::${pathname}::${el.dataset.liveList}`;
  }
  if (el.dataset.liveSection) {
    return `section::${el.dataset.liveSection}`;
  }
  if (el.id) {
    return `id::${el.id}`;
  }

  // Look for the closest section container or semantic landmark for scoped selector
  const section = el.closest("[data-live-section]") as HTMLElement | null;
  const sectionId = section?.getAttribute("data-live-section");
  const landmark = !section
    ? (el.closest("main, header, footer, nav") as HTMLElement | null)
    : null;

  const pathParts: string[] = [];
  let curr: HTMLElement | null = el;
  const stopAt = section || landmark || document.body;

  while (curr && curr !== stopAt && curr.parentElement) {
    const parentEl: HTMLElement = curr.parentElement;
    const tag = curr.tagName.toLowerCase();
    // Ignore dynamic LiveVisualEditor UI nodes and added clones when computing sibling indices
    const sameTagSiblings = Array.from(parentEl.children).filter(
      (c: Element) =>
        c.tagName.toLowerCase() === tag &&
        !c.hasAttribute("data-live-editor-ui") &&
        !c.hasAttribute("data-live-clone-id")
    );
    const index = sameTagSiblings.indexOf(curr);
    pathParts.unshift(`${tag}:nth-of-type(${Math.max(1, index + 1)})`);
    curr = parentEl;
  }

  const pathStr = pathParts.join(" > ");
  const snippet = (el.textContent || "").trim().slice(0, 16).replace(/[\s\r\n]+/g, "_");

  if (sectionId) {
    return `secPath::${sectionId}::${pathStr}::${snippet}`;
  } else if (landmark) {
    const landmarkTag = landmark.tagName.toLowerCase();
    return `landmarkPath::${pathname}::${landmarkTag}::${pathStr}::${snippet}`;
  } else {
    return `pagePath::${pathname}::${pathStr}::${snippet}`;
  }
}

function getListContainerKey(parentEl: HTMLElement, pathname: string): string {
  if (parentEl.dataset.liveList) {
    return `list::${pathname}::${parentEl.dataset.liveList}`;
  }
  return getElementKey(parentEl, pathname);
}

/**
 * Helper to query a relative path from a container element, trying :scope > first.
 */
function queryRelativePath(container: Element, path: string): HTMLElement | null {
  if (!path) return null;
  try {
    const direct = container.querySelector(`:scope > ${path}`) as HTMLElement | null;
    if (direct) return direct;
  } catch {}
  try {
    const descendant = container.querySelector(path) as HTMLElement | null;
    if (descendant) return descendant;
  } catch {}
  return null;
}

/**
 * Resolve an element by key safely without global tag index ambiguity.
 */
function resolveElementByKey(key: string, pathname: string): HTMLElement | null {
  if (typeof document === "undefined") return null;

  try {
    if (key.startsWith("clone::")) {
      const cloneId = key.replace("clone::", "");
      return document.querySelector(`[data-live-clone-id="${cloneId}"]`);
    }
    if (key.startsWith("list::")) {
      const rest = key.slice("list::".length);
      const splitIdx = rest.indexOf("::");
      if (splitIdx !== -1) {
        const targetPath = rest.slice(0, splitIdx);
        const listId = rest.slice(splitIdx + 2);
        if (targetPath === pathname && listId) {
          return document.querySelector(`[data-live-list="${listId}"]`);
        }
      }
      return null;
    }
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
        return queryRelativePath(secEl, path);
      }
      return null;
    }
    if (key.startsWith("landmarkPath::")) {
      const parts = key.split("::");
      const page = parts[1];
      const landmarkTag = parts[2];
      const path = parts[3];
      if (page === pathname && landmarkTag && path) {
        const landmarkEl = document.querySelector(landmarkTag);
        if (landmarkEl) {
          return queryRelativePath(landmarkEl, path);
        }
      }
      return null;
    }
    if (key.startsWith("pagePath::")) {
      const parts = key.split("::");
      const page = parts[1];
      const path = parts[2];
      if (page === pathname && path) {
        const fromBody = queryRelativePath(document.body, path);
        if (fromBody && !fromBody.closest("[data-live-editor-ui='true']")) {
          return fromBody;
        }
        // Fallback if top-level div index shifted due to Preloader or LiveEditor UI mount/unmount
        const subPath = path.replace(/^div:nth-of-type\(\d+\)\s*>\s*/, "");
        if (subPath && subPath !== path) {
          const mainEl = document.querySelector("main") || document.body;
          const fallbackEl = queryRelativePath(mainEl, subPath);
          if (fallbackEl && !fallbackEl.closest("[data-live-editor-ui='true']")) {
            return fallbackEl;
          }
        }
      }
      return null;
    }

    // Backwards compatibility for legacy keys, with strict leaf-tag & text-match validation
    if (key.startsWith(`${pathname}::`)) {
      const parts = key.split("::");
      const tag = parts[1];
      const cleanSnippet = parts[3];
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

interface DomAppliedSnapshot {
  lang: LiveEditorLanguage;
  key: string;
  textTarget?: HTMLElement | null;
  appliedText?: string;
  baselineNodeValues?: string[];
  baselineWhiteSpace: string;
  baselineDisplay: string;
  baselineColor: string;
  baselineFontSize: string;
  baselineFontWeight: string;
  baselineFontFamily: string;
  baselineTextAlign: string;
  baselineHref: string | null;
  baselineTarget: string | null;
}

/**
 * Extracts text while preserving explicit <br>, newlines, and spaces between adjacent inline elements.
 */
function extractTextPreservingLines(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent || "").replace(/[^\S\r\n]+/g, " ");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  if (tag === "br") return "\n";
  if (["svg", "path", "g", "circle", "script", "style"].includes(tag)) return "";

  const isBlock = ["p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"].includes(tag);
  const children = Array.from(el.childNodes);
  const parts: string[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const chunk = extractTextPreservingLines(child);
    if (!chunk) continue;
    if (
      parts.length > 0 &&
      child.nodeType === Node.ELEMENT_NODE &&
      children[i - 1]?.nodeType === Node.ELEMENT_NODE &&
      !parts[parts.length - 1].endsWith(" ") &&
      !parts[parts.length - 1].endsWith("\n") &&
      !chunk.startsWith(" ") &&
      !chunk.startsWith("\n")
    ) {
      parts.push(" ");
    }
    parts.push(chunk);
  }
  const inner = parts.join("");
  return isBlock ? `${inner}\n` : inner;
}

function readCleanEditableText(el: HTMLElement): string {
  return extractTextPreservingLines(el)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Resolves the exact leaf DOM container whose Text node(s) hold editable copy.
 */
function getLeafTextTarget(element: HTMLElement): HTMLElement | null {
  if (element.dataset.liveReactManaged === "true") return null;

  if (element.dataset.liveKey || element.children.length === 0) {
    return element;
  }

  const childNodes = Array.from(element.childNodes);
  const hasDirectText = childNodes.some(
    (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0
  );
  if (hasDirectText) return element;

  const liveKeyChild = element.querySelector("[data-live-key]") as HTMLElement | null;
  if (liveKeyChild) {
    return liveKeyChild.dataset.liveReactManaged === "true" ? null : liveKeyChild;
  }

  const leaf = element.querySelector("span, p, strong, b, em, label, h1, h2, h3, h4, h5, h6") as HTMLElement | null;
  if (leaf && leaf.children.length === 0) return leaf;

  const hasElementChildren = childNodes.some((n) => n.nodeType === Node.ELEMENT_NODE);
  return hasElementChildren ? null : element;
}

/**
 * Updates Text nodes in-place (keeping React HostText DOM references intact) so React
 * language switches and state updates continue smoothly without detached DOM nodes.
 */
function writeTextNodesInPlace(target: HTMLElement, newText: string): string {
  const normalizedText = newText.replace(/\r\n/g, "\n");
  target.style.whiteSpace = "pre-line";

  const textNodes = Array.from(target.childNodes).filter(
    (n) => n.nodeType === Node.TEXT_NODE
  ) as Text[];

  if (target.children.length === 0) {
    if (textNodes.length > 0) {
      textNodes[0].nodeValue = normalizedText;
      for (let i = 1; i < textNodes.length; i++) {
        textNodes[i].nodeValue = "";
      }
    } else {
      target.textContent = normalizedText;
    }
    return normalizedText;
  }

  const primaryNode = textNodes.find((n) => (n.nodeValue || "").trim().length > 0) || textNodes[0];
  if (primaryNode) {
    primaryNode.nodeValue = normalizedText;
    for (const node of textNodes) {
      if (node !== primaryNode) node.nodeValue = "";
    }
  }
  return normalizedText;
}

function applyTextSafely(element: HTMLElement, newText: string): HTMLElement | null {
  const target = getLeafTextTarget(element);
  if (!target) return null;
  writeTextNodesInPlace(target, newText);
  return target;
}

function captureSnapshot(el: HTMLElement, lang: LiveEditorLanguage, key: string): DomAppliedSnapshot {
  const textTarget = getLeafTextTarget(el);
  const textNodes = textTarget
    ? (Array.from(textTarget.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE) as Text[])
    : [];
  const anchorEl =
    el.tagName.toLowerCase() === "a" ? (el as HTMLAnchorElement) : (el.closest("a") as HTMLAnchorElement | null);

  return {
    lang,
    key,
    textTarget,
    baselineNodeValues: textNodes.map((n) => n.nodeValue ?? ""),
    baselineWhiteSpace: el.style.whiteSpace || "",
    baselineDisplay: el.style.display || "",
    baselineColor: el.style.color || "",
    baselineFontSize: el.style.fontSize || "",
    baselineFontWeight: el.style.fontWeight || "",
    baselineFontFamily: el.style.fontFamily || "",
    baselineTextAlign: el.style.textAlign || "",
    baselineHref: anchorEl ? anchorEl.getAttribute("href") : null,
    baselineTarget: anchorEl ? anchorEl.getAttribute("target") : null,
  };
}

function restoreInlinePropsFromSnapshot(el: HTMLElement, snap: DomAppliedSnapshot) {
  const setOrClear = (prop: keyof CSSStyleDeclaration, val: string) => {
    if (val) {
      (el.style as any)[prop] = val;
    } else {
      (el.style as any)[prop] = "";
    }
  };

  if (snap.baselineDisplay) {
    el.style.display = snap.baselineDisplay;
  } else {
    el.style.removeProperty("display");
  }
  setOrClear("color", snap.baselineColor);
  setOrClear("fontSize", snap.baselineFontSize);
  setOrClear("fontWeight", snap.baselineFontWeight);
  setOrClear("fontFamily", snap.baselineFontFamily);
  setOrClear("textAlign", snap.baselineTextAlign);
  setOrClear("whiteSpace", snap.baselineWhiteSpace);

  const anchorEl =
    el.tagName.toLowerCase() === "a" ? (el as HTMLAnchorElement) : (el.closest("a") as HTMLAnchorElement | null);
  if (anchorEl) {
    if (snap.baselineHref !== null) anchorEl.setAttribute("href", snap.baselineHref);
    if (snap.baselineTarget !== null) {
      anchorEl.setAttribute("target", snap.baselineTarget);
    } else {
      anchorEl.removeAttribute("target");
    }
  }
}

function restoreTextFromSnapshotIfStale(snap: DomAppliedSnapshot) {
  if (snap.appliedText === undefined || !snap.textTarget || !snap.baselineNodeValues) return;
  const target = snap.textTarget;
  if (!target.isConnected) return;

  const textNodes = Array.from(target.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE) as Text[];
  if (textNodes.length === 0) return;

  if (target.children.length === 0) {
    // Restore original fragments only if React has not already replaced the primary node with new language copy
    const primaryVal = textNodes[0].nodeValue ?? "";
    if (primaryVal === snap.appliedText && snap.baselineNodeValues[0] !== undefined) {
      textNodes[0].nodeValue = snap.baselineNodeValues[0];
    }
    for (let i = 1; i < textNodes.length && i < snap.baselineNodeValues.length; i++) {
      if ((textNodes[i].nodeValue ?? "") === "" && snap.baselineNodeValues[i] !== "") {
        textNodes[i].nodeValue = snap.baselineNodeValues[i];
      }
    }
  } else {
    const currentClean = readCleanEditableText(target);
    if (currentClean === snap.appliedText.trim()) {
      for (let i = 0; i < textNodes.length && i < snap.baselineNodeValues.length; i++) {
        textNodes[i].nodeValue = snap.baselineNodeValues[i];
      }
    }
  }
}

/**
 * Finds the nearest repeatable list item (e.g. Product Ritual Step 01/02/03, card, FAQ item, paragraph)
 * so the Admin can add another element of the exact same type in-place.
 */
function findRepeatableContext(el: HTMLElement, pathname: string): RepeatableContext | null {
  const countVisibleChildren = (parent: HTMLElement) =>
    Array.from(parent.children).filter(
      (c) =>
        !c.hasAttribute("data-live-editor-ui") &&
        (c as HTMLElement).style.display !== "none"
    ).length;

  // 1. Explicit semantic [data-live-item] item wrapper
  const taggedItem = el.closest("[data-live-item]") as HTMLElement | null;
  if (taggedItem) {
    const parentEl =
      (taggedItem.closest("[data-live-list]") as HTMLElement | null) ||
      taggedItem.parentElement;
    if (parentEl && parentEl !== document.body) {
      return {
        parentEl,
        parentKey: getListContainerKey(parentEl, pathname),
        templateEl: taggedItem,
        itemLabel: taggedItem.getAttribute("data-live-item") || "عنصر",
        nextOrdinal: countVisibleChildren(parentEl) + 1,
      };
    }
  }

  // 2. Smart fallback heuristic for any repeating sibling grid/list
  let curr: HTMLElement | null = el;
  for (let depth = 0; depth < 5 && curr; depth++) {
    const tag = curr.tagName.toLowerCase();
    if (
      ["section", "main", "header", "footer", "nav", "body", "html"].includes(tag) ||
      curr.hasAttribute("data-live-section")
    ) {
      break;
    }

    const parent: HTMLElement | null = curr.parentElement;
    if (!parent || parent === document.body || parent.hasAttribute("data-live-key")) {
      curr = parent;
      continue;
    }

    const skipInline = ["span", "strong", "b", "em", "small", "svg", "path", "g", "circle"].includes(tag);
    if (!skipInline || ["ul", "ol"].includes(parent.tagName.toLowerCase())) {
      const sameTagSiblings = Array.from(parent.children).filter(
        (c: Element) =>
          !c.hasAttribute("data-live-editor-ui") &&
          !c.hasAttribute("data-live-clone-id") &&
          c.tagName === curr!.tagName
      );
      const isItemShape =
        curr.children.length > 0 || ["li", "p", "article", "blockquote"].includes(tag);

      if (sameTagSiblings.length >= 2 && isItemShape) {
        let inferredLabel = "عنصر";
        if (tag === "p") inferredLabel = "فقرة";
        else if (/\b0[1-9]\b/.test(curr.textContent || "")) inferredLabel = "خطوة";
        else if (tag === "li") inferredLabel = "بند";
        else inferredLabel = "بطاقة";

        return {
          parentEl: parent,
          parentKey: getListContainerKey(parent, pathname),
          templateEl: curr,
          itemLabel: inferredLabel,
          nextOrdinal: countVisibleChildren(parent) + 1,
        };
      }
    }

    curr = parent;
  }

  return null;
}

/**
 * Clones a template DOM node cleanly, increments any step/card counter (01..03 -> 04),
 * and assigns deterministic `data-live-key` attributes to editable leaves inside the clone.
 */
function hydrateAndInsertClone(entry: LiveAddedElement, pathname: string): HTMLElement | null {
  if (typeof document === "undefined" || entry.pathname !== pathname) return null;

  const existing = document.querySelector(`[data-live-clone-id="${entry.id}"]`) as HTMLElement | null;
  if (existing) return existing;

  const parentEl = resolveElementByKey(entry.parentKey, pathname);
  if (!parentEl) return null;

  let templateEl: HTMLElement | null = null;
  if (entry.sourceCloneId) {
    templateEl = parentEl.querySelector(
      `:scope > [data-live-clone-id="${entry.sourceCloneId}"]`
    ) as HTMLElement | null;
  }

  if (!templateEl) {
    const originalChildren = Array.from(parentEl.children).filter(
      (c) =>
        !c.hasAttribute("data-live-editor-ui") &&
        !c.hasAttribute("data-live-clone-id")
    ) as HTMLElement[];

    if (originalChildren.length === 0) return null;
    const idx =
      typeof entry.sourceIndex === "number" &&
      entry.sourceIndex >= 0 &&
      entry.sourceIndex < originalChildren.length
        ? entry.sourceIndex
        : originalChildren.length - 1;
    templateEl = originalChildren[idx];
  }

  const clone = templateEl.cloneNode(true) as HTMLElement;

  const cleanTransientStyles = (node: HTMLElement) => {
    node.style.outline = "";
    node.style.outlineOffset = "";
    node.style.cursor = "";
    node.style.removeProperty("display");
  };
  cleanTransientStyles(clone);
  clone.removeAttribute("data-live-key");
  clone.removeAttribute("data-live-clone-id");

  Array.from(clone.querySelectorAll("*")).forEach((d) => {
    const el = d as HTMLElement;
    cleanTransientStyles(el);
    el.removeAttribute("data-live-key");
    el.removeAttribute("data-live-clone-id");
  });

  // Compute ordinal based on currently visible items before inserting
  const visibleSiblingsCount = Array.from(parentEl.children).filter(
    (c) =>
      !c.hasAttribute("data-live-editor-ui") &&
      (c as HTMLElement).style.display !== "none"
  ).length;
  const ordinal = visibleSiblingsCount + 1;

  // Auto-increment numeric badges such as 01/02/03 -> 04
  const leafEls = Array.from(clone.querySelectorAll("*")).filter(
    (n) =>
      !["svg", "path", "g", "circle"].includes(n.tagName.toLowerCase()) &&
      n.children.length === 0
  ) as HTMLElement[];

  for (const leaf of leafEls) {
    const raw = (leaf.textContent || "").trim();
    if (!raw) continue;
    if (/^0\d+$/.test(raw)) {
      leaf.textContent = String(ordinal).padStart(Math.max(2, raw.length), "0");
      break;
    } else if (/^\d+$/.test(raw) && Number(raw) > 0 && Number(raw) <= 25) {
      leaf.textContent = String(ordinal);
      break;
    } else if (/^(الخطوة|خطوة|Step)\s*\d+$/i.test(raw)) {
      leaf.textContent = raw.replace(/\d+$/, String(ordinal));
      break;
    }
  }

  clone.setAttribute("data-live-clone-id", entry.id);

  // Assign deterministic data-live-key to editable leaf/link descendants inside the clone
  const descendants = Array.from(clone.querySelectorAll("*")) as HTMLElement[];
  descendants.forEach((desc, idx) => {
    const tag = desc.tagName.toLowerCase();
    if (["svg", "path", "g", "circle", "br"].includes(tag)) return;
    const nonSvgKids = Array.from(desc.children).filter(
      (c) => !["svg", "path", "g", "circle"].includes(c.tagName.toLowerCase())
    );
    const hasDirectText = Array.from(desc.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0
    );
    if (nonSvgKids.length === 0 || (nonSvgKids.length <= 1 && (hasDirectText || tag === "a" || tag === "button"))) {
      desc.setAttribute("data-live-key", `${entry.id}__c${idx}`);
    }
  });

  parentEl.appendChild(clone);
  return clone;
}

export function LiveVisualEditor() {
  const pathname = usePathname();
  const { settings, updateSettings } = useStoreSettings();
  const { language, setLanguage } = useLanguage();
  const activeLang: LiveEditorLanguage = language === "ar" ? "ar" : "en";

  // Mode States - Strictly false by default so non-admin visitors NEVER see the Live Editor UI
  const [isAdminDetected, setIsAdminDetected] = useState(false);
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

  // Pending Changes Map — strictly separated per storefront language
  const [pendingByLang, setPendingByLang] = useState<{
    ar: Record<string, LiveTextOverride>;
    en: Record<string, LiveTextOverride>;
  }>({ ar: {}, en: {} });
  const pendingOverrides = pendingByLang[activeLang];
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hover Outline Target & DOM Snapshot/Key Memory Refs
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const appliedSnapshotsRef = useRef<Map<HTMLElement, DomAppliedSnapshot>>(new Map());
  const resolvedKeyByElRef = useRef<WeakMap<HTMLElement, Partial<Record<LiveEditorLanguage, string>>>>(
    new WeakMap()
  );
  const handledUrlSearchRef = useRef<string | null>(null);

  const rememberElementKey = useCallback(
    (el: HTMLElement, lang: LiveEditorLanguage, key: string) => {
      const prev = resolvedKeyByElRef.current.get(el) || {};
      prev[lang] = key;
      resolvedKeyByElRef.current.set(el, prev);
    },
    []
  );

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
  }, [pathname, isLiveEdit, activeLang]);

  // Clear open popover & hover outline when switching active language
  useEffect(() => {
    setActiveTarget(null);
    if (hoveredElementRef.current) {
      hoveredElementRef.current.style.outline = "";
      hoveredElementRef.current.style.outlineOffset = "";
      hoveredElementRef.current = null;
    }
  }, [activeLang]);

  // Strictly check if admin is logged in (`sulaf_admin_auth === "true"`).
  // Non-admins NEVER see the Live Editor launcher or toolbar, even if URL params are passed.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAdminAccess = () => {
      const isAdmin = localStorage.getItem("sulaf_admin_auth") === "true";
      setIsAdminDetected(isAdmin);

      if (!isAdmin) {
        setIsLiveEdit(false);
        setActiveTarget(null);
        setSectionsDrawerOpen(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const le = params.get("live_edit");
      const ed = params.get("edit");
      const isLangEditorParam = le === "ar" || le === "en";
      const hasParam = isLangEditorParam || le === "1" || le === "true" || ed === "true";

      if (hasParam || sessionStorage.getItem("sulaf_live_edit_mode") === "true") {
        setIsLiveEdit(true);
        sessionStorage.setItem("sulaf_live_edit_mode", "true");
      }

      if (isLangEditorParam && handledUrlSearchRef.current !== window.location.search) {
        handledUrlSearchRef.current = window.location.search;
        if (le !== language) {
          setLanguage(le);
        }
      }
    };

    checkAdminAccess();
    window.addEventListener("storage", checkAdminAccess);
    window.addEventListener("sulaf_admin_auth_changed", checkAdminAccess);
    return () => {
      window.removeEventListener("storage", checkAdminAccess);
      window.removeEventListener("sulaf_admin_auth_changed", checkAdminAccess);
    };
  }, [pathname, language, setLanguage]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Switch between Arabic and English dedicated Live Editors cleanly
  const switchEditorLanguage = useCallback(
    (targetLang: LiveEditorLanguage) => {
      if (!isAdminDetected) return;
      setActiveTarget(null);
      setIsLiveEdit(true);

      if (typeof window !== "undefined") {
        sessionStorage.setItem("sulaf_live_edit_mode", "true");
        const url = new URL(window.location.href);
        if (url.searchParams.has("live_edit")) {
          url.searchParams.set("live_edit", targetLang);
          window.history.replaceState(null, "", url.toString());
          handledUrlSearchRef.current = url.search;
        }
      }

      if (targetLang !== activeLang) {
        setLanguage(targetLang);
      }

      showToast(
        targetLang === "ar"
          ? "🇸🇦 تم فتح محرر النسخة العربية فقط — أي تعديل هنا لن يؤثر على الإنجليزية."
          : "🇬🇧 تم فتح محرر النسخة الإنجليزية فقط — أي تعديل هنا لن يؤثر على العربية."
      );
    },
    [isAdminDetected, activeLang, setLanguage, showToast]
  );

  // Sync session storage when live edit mode changes
  const toggleLiveEdit = (val: boolean, targetLang?: LiveEditorLanguage) => {
    if (!isAdminDetected) return;
    if (val) {
      switchEditorLanguage(targetLang || activeLang);
      return;
    }

    setIsLiveEdit(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("sulaf_live_edit_mode");
      const url = new URL(window.location.href);
      if (url.searchParams.has("live_edit") || url.searchParams.has("edit")) {
        url.searchParams.delete("live_edit");
        url.searchParams.delete("edit");
        window.history.replaceState(null, "", url.toString());
        handledUrlSearchRef.current = url.search;
      }
    }
    setActiveTarget(null);
    setSectionsDrawerOpen(false);
    showToast("تم إغلاق وضع التحرير المباشر.");
  };

  // Update settings strictly inside a single language slice (`*Ar` or `*En`)
  const updateStoreForLang = useCallback(
    (
      targetLang: LiveEditorLanguage,
      mutator: (bucket: {
        overrides: Record<string, LiveTextOverride>;
        added: LiveAddedElement[];
        links: Record<string, string>;
      }) => {
        overrides: Record<string, LiveTextOverride>;
        added: LiveAddedElement[];
        links: Record<string, string>;
      }
    ) => {
      updateSettings((prev) => {
        const base = materializeLegacyLiveEditorState(prev);
        const currentBucket = {
          overrides: {
            ...(targetLang === "ar" ? base.liveTextOverridesAr : base.liveTextOverridesEn),
          },
          added: [
            ...(targetLang === "ar"
              ? base.liveAddedElementsAr || []
              : base.liveAddedElementsEn || []),
          ],
          links: {
            ...(targetLang === "ar" ? base.customLinksAr : base.customLinksEn),
          },
        };
        const nextBucket = mutator(currentBucket);
        if (targetLang === "ar") {
          return {
            ...base,
            liveTextOverridesAr: nextBucket.overrides,
            liveAddedElementsAr: nextBucket.added,
            customLinksAr: nextBucket.links,
          };
        }
        return {
          ...base,
          liveTextOverridesEn: nextBucket.overrides,
          liveAddedElementsEn: nextBucket.added,
          customLinksEn: nextBucket.links,
        };
      });
    },
    [updateSettings]
  );

  // Helper to immediately persist updated overrides to context, localStorage, and /api/settings
  const persistOverridesImmediately = useCallback(
    async (targetLang: LiveEditorLanguage, nextPending: Record<string, LiveTextOverride>) => {
      updateStoreForLang(targetLang, (bucket) => {
        const mergedOverrides: Record<string, LiveTextOverride> = {
          ...bucket.overrides,
          ...nextPending,
        };
        const updatedCustomLinks: Record<string, string> = {
          ...bucket.links,
        };
        Object.entries(mergedOverrides).forEach(([k, o]) => {
          if (o.href) {
            updatedCustomLinks[k] = o.href;
          }
        });
        return {
          ...bucket,
          overrides: mergedOverrides,
          links: updatedCustomLinks,
        };
      });
    },
    [updateStoreForLang]
  );

  // Apply added elements & saved overrides to DOM strictly for the active storefront language
  const applyOverrides = useCallback(() => {
    if (typeof document === "undefined") return;

    // 1. Hydrate any cloned/added elements belonging strictly to activeLang on this route
    const addedList = [...getLiveAddedElementsForLang(settings, activeLang)].sort(
      (a, b) => (a.insertedAt || 0) - (b.insertedAt || 0)
    );
    const activeCloneIdsOnPage = new Set(
      addedList.filter((e) => e.pathname === pathname).map((e) => e.id)
    );

    // Clean up any clones belonging to the other language or inactive route
    document.querySelectorAll("[data-live-clone-id]").forEach((node) => {
      const cid = node.getAttribute("data-live-clone-id");
      if (cid && !activeCloneIdsOnPage.has(cid)) {
        appliedSnapshotsRef.current.delete(node as HTMLElement);
        node.remove();
      }
    });

    for (const entry of addedList) {
      if (entry.pathname === pathname) {
        hydrateAndInsertClone(entry, pathname);
      }
    }

    // 2. Gather language-scoped overrides & resolve elements
    const savedForLang = getLiveTextOverridesForLang(settings, activeLang);
    const allOverrides = {
      ...savedForLang,
      ...(pendingByLang[activeLang] || {}),
    };

    const resolvedTargets: Array<{ el: HTMLElement; key: string; override: LiveTextOverride }> = [];
    const activeElSet = new Set<HTMLElement>();

    Object.entries(allOverrides).forEach(([key, override]) => {
      const el = resolveElementByKey(key, pathname);
      if (!el) return;
      rememberElementKey(el, activeLang, key);
      if (!activeElSet.has(el)) {
        activeElSet.add(el);
        resolvedTargets.push({ el, key, override });
      }
    });

    // 3. Restore any elements previously mutated in the OTHER language (or cleared/reset in current language)
    Array.from(appliedSnapshotsRef.current.entries()).forEach(([el, prevSnap]) => {
      if (!el.isConnected) {
        appliedSnapshotsRef.current.delete(el);
        return;
      }

      const stillActiveInLang = activeElSet.has(el);
      if (!stillActiveInLang || prevSnap.lang !== activeLang) {
        restoreInlinePropsFromSnapshot(el, prevSnap);
        restoreTextFromSnapshotIfStale(prevSnap);
        appliedSnapshotsRef.current.delete(el);
      }
    });

    // 4. Apply overrides belonging solely to activeLang
    resolvedTargets.forEach(({ el, key, override }) => {
      let snap = appliedSnapshotsRef.current.get(el);
      if (!snap || snap.lang !== activeLang) {
        snap = captureSnapshot(el, activeLang, key);
      } else {
        // Always reset inline styles back to clean baseline before applying active override fields
        restoreInlinePropsFromSnapshot(el, snap);
      }

      const isSec = key.startsWith("section::") || !!el.getAttribute("data-live-section");
      const hasLiveKey = !!el.dataset.liveKey;
      const nonSvgChildElements = Array.from(el.children).filter(
        (c) => !["svg", "path", "g", "circle"].includes(c.tagName.toLowerCase())
      );
      const isContainer = !hasLiveKey && nonSvgChildElements.length > 1;

      if (override.isHidden || override.isDeleted) {
        el.style.setProperty("display", "none", "important");
        appliedSnapshotsRef.current.set(el, snap);
        return;
      } else if (!snap.baselineDisplay) {
        el.style.removeProperty("display");
      }

      // Apply text override safely (without clobbering React-managed animations)
      if (!isSec && override.text !== undefined && override.text !== null) {
        const appliedTarget = applyTextSafely(el, override.text);
        if (appliedTarget) {
          snap.textTarget = appliedTarget;
          snap.appliedText = override.text.replace(/\r\n/g, "\n");
        }
      }

      // Handle link destination
      if (override.href !== undefined && override.href !== "") {
        if (el.tagName.toLowerCase() === "a") {
          (el as HTMLAnchorElement).href = override.href;
        } else {
          const anchor = el.closest("a");
          if (anchor) (anchor as HTMLAnchorElement).href = override.href;
        }
      }
      if (override.target !== undefined) {
        if (el.tagName.toLowerCase() === "a") {
          (el as HTMLAnchorElement).target = override.target;
        } else {
          const anchor = el.closest("a");
          if (anchor) (anchor as HTMLAnchorElement).target = override.target;
        }
      }

      // Typography styling: apply to leaf/text elements, never to whole sections
      if (!isSec && !isContainer) {
        if (override.color) el.style.color = override.color;
        if (override.fontSize) el.style.fontSize = override.fontSize;
        if (override.fontWeight) el.style.fontWeight = override.fontWeight;
        if (override.fontFamily) el.style.fontFamily = override.fontFamily;
        if (override.textAlign) el.style.textAlign = override.textAlign;
      }

      appliedSnapshotsRef.current.set(el, snap);
    });
  }, [pathname, activeLang, settings, pendingByLang, rememberElementKey]);

  useEffect(() => {
    applyOverrides();
    const t0 = setTimeout(applyOverrides, 50);
    const t1 = setTimeout(applyOverrides, 150);
    const t2 = setTimeout(applyOverrides, 450);
    const t3 = setTimeout(applyOverrides, 900);
    const t4 = setTimeout(applyOverrides, 1600);
    const handleReady = () => applyOverrides();
    window.addEventListener("sulaf:ready", handleReady);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener("sulaf:ready", handleReady);
    };
  }, [applyOverrides]);

  // Open Section Editor Specifically
  const openSectionEditor = (secEl: HTMLElement) => {
    const secId = secEl.getAttribute("data-live-section") || "section";
    const secName = secEl.getAttribute("data-section-name") || secId;
    const key = `section::${secId}`;
    const langOverrides = getLiveTextOverridesForLang(settings, activeLang);
    const existingOv = pendingOverrides[key] || langOverrides[key] || {};

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
        target.hasAttribute("data-live-item") ||
        target.hasAttribute("data-live-clone-id") ||
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

      // If the clicked target is inside an element with an explicit [data-live-key] (e.g. Hero poem word span),
      // select the [data-live-key] element directly so the whole text line/element is edited cleanly
      const closestLiveKeyEl = leafElement.closest("[data-live-key]") as HTMLElement | null;
      if (closestLiveKeyEl) {
        leafElement = closestLiveKeyEl;
      } else if (["button", "a"].includes(leafElement.tagName.toLowerCase())) {
        // If user clicked a button or anchor that wraps SVG icons + a single [data-live-key] or <span>, select that text element
        const innerLiveKey = leafElement.querySelector("[data-live-key]") as HTMLElement | null;
        if (innerLiveKey) {
          leafElement = innerLiveKey;
        }
      }

      // Find enclosing link if any
      const enclosingLink =
        leafElement.tagName.toLowerCase() === "a" ? (leafElement as HTMLAnchorElement) : leafElement.closest("a");

      const nonSvgChildElements = Array.from(leafElement.children).filter(
        (c) => !["svg", "path", "g", "circle"].includes(c.tagName.toLowerCase())
      );
      const hasLiveKey = !!leafElement.dataset.liveKey;
      const hasMultipleChildElements = !hasLiveKey && nonSvgChildElements.length > 1;
      const directText = Array.from(leafElement.childNodes)
        .filter((n) => n.nodeType === Node.TEXT_NODE && (n.textContent || "").trim().length > 0)
        .map((n) => n.textContent?.trim())
        .join(" ");

      const canEditText =
        hasLiveKey ||
        ((nonSvgChildElements.length <= 1 || directText.length > 0) && !hasMultipleChildElements);
      const isContainer = !canEditText && leafElement.children.length > 0;

      // Extract text safely while preserving Enter line breaks
      let currentText = "";
      if (canEditText) {
        if (hasLiveKey || leafElement.children.length === 0) {
          currentText = readCleanEditableText(leafElement);
        } else {
          currentText = directText ? readCleanEditableText(leafElement) : "";
          if (!currentText) {
            const firstLeaf = leafElement.querySelector("span, strong, b, em, p, h1, h2, h3, h4, h5, h6") as HTMLElement | null;
            currentText = firstLeaf ? readCleanEditableText(firstLeaf) : "";
          }
        }
      }

      const repeatable = findRepeatableContext(leafElement, pathname);

      e.preventDefault();
      e.stopPropagation();

      const rememberedKey = resolvedKeyByElRef.current.get(leafElement)?.[activeLang];
      const key = rememberedKey || getElementKey(leafElement, pathname);
      rememberElementKey(leafElement, activeLang, key);

      const rect = leafElement.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      const popoverY = Math.max(80, rect.bottom + scrollY + 12);
      const popoverX = Math.min(window.innerWidth - 440, Math.max(16, rect.left + scrollX));

      setPopoverPos({ x: popoverX, y: popoverY });

      const currentHref = enclosingLink ? enclosingLink.getAttribute("href") || "" : "";
      const currentTarget = enclosingLink ? enclosingLink.getAttribute("target") || "_self" : "_self";
      const computed = window.getComputedStyle(leafElement);
      const langOverrides = getLiveTextOverridesForLang(settings, activeLang);
      const existingOv = pendingOverrides[key] || langOverrides[key] || {};

      setActiveTarget({
        element: leafElement,
        key,
        isLink: !!enclosingLink,
        isSection: false,
        isContainer,
        canEditText,
        repeatable,
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
      setEditTextAlign(existingOv.textAlign || "");
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
  }, [isLiveEdit, isVisitorPreview, pathname, activeLang, activeTarget, settings, pendingOverrides, rememberElementKey]);

  // Apply Changes from Popover safely and persist strictly for the active language editor
  const handleApplyChanges = () => {
    if (!activeTarget) return;

    const { element, key, isLink, isSection, isContainer, canEditText } = activeTarget;
    const targetLang = activeLang;
    const normalizedEditText = editText.replace(/\r\n/g, "\n");

    // Ensure pristine baseline snapshot exists for this language BEFORE immediate preview mutation
    if (
      !appliedSnapshotsRef.current.has(element) ||
      appliedSnapshotsRef.current.get(element)?.lang !== targetLang
    ) {
      appliedSnapshotsRef.current.set(element, captureSnapshot(element, targetLang, key));
    }
    const snap = appliedSnapshotsRef.current.get(element)!;
    restoreInlinePropsFromSnapshot(element, snap);

    // Direct DOM preview
    if (!editIsHidden) {
      if (!snap.baselineDisplay) element.style.removeProperty("display");

      if (canEditText && normalizedEditText.length > 0 && !isSection) {
        const appliedTarget = applyTextSafely(element, normalizedEditText);
        if (appliedTarget) {
          snap.textTarget = appliedTarget;
          snap.appliedText = normalizedEditText;
        }
      }

      if (isLink && editHref) {
        if (element.tagName.toLowerCase() === "a") {
          (element as HTMLAnchorElement).href = editHref;
          (element as HTMLAnchorElement).target = editTarget;
        } else {
          const anchor = element.closest("a");
          if (anchor) {
            (anchor as HTMLAnchorElement).href = editHref;
            (anchor as HTMLAnchorElement).target = editTarget;
          }
        }
      }

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

    const baseOverride = {
      ...(getLiveTextOverridesForLang(settings, targetLang)[key] || {}),
      ...(pendingByLang[targetLang]?.[key] || {}),
    };
    const newOverride: LiveTextOverride = {
      ...baseOverride,
      isHidden: editIsHidden,
    };

    if (canEditText && normalizedEditText.length > 0 && !isSection) {
      newOverride.text = normalizedEditText;
    }
    if (isLink) {
      newOverride.href = editHref;
      newOverride.target = editTarget;
    }
    if (!isSection && !isContainer) {
      if (editColor) newOverride.color = editColor;
      else delete newOverride.color;
      if (editFontSize) newOverride.fontSize = editFontSize;
      else delete newOverride.fontSize;
      if (editFontWeight) newOverride.fontWeight = editFontWeight;
      else delete newOverride.fontWeight;
      if (editTextAlign) newOverride.textAlign = editTextAlign;
      else delete newOverride.textAlign;
      if (editFontFamily) newOverride.fontFamily = editFontFamily;
      else delete newOverride.fontFamily;
    }

    const nextLangPending = {
      ...(pendingByLang[targetLang] || {}),
      [key]: newOverride,
    };
    setPendingByLang((prev) => ({
      ...prev,
      [targetLang]: nextLangPending,
    }));
    persistOverridesImmediately(targetLang, nextLangPending);

    showToast(
      targetLang === "ar"
        ? "✓ تم حفظ التعديل للنسخة العربية فقط (لن يتأثر الإنجليزي)"
        : "✓ تم حفظ التعديل للنسخة الإنجليزية فقط (لن يتأثر العربي)"
    );
    setActiveTarget(null);
  };

  // Immediate Hide Action (strictly scoped to active language)
  const handleQuickHide = () => {
    if (!activeTarget) return;
    const { element, key } = activeTarget;
    const targetLang = activeLang;

    if (
      !appliedSnapshotsRef.current.has(element) ||
      appliedSnapshotsRef.current.get(element)?.lang !== targetLang
    ) {
      appliedSnapshotsRef.current.set(element, captureSnapshot(element, targetLang, key));
    }
    element.style.setProperty("display", "none", "important");

    const newOverride: LiveTextOverride = {
      ...(getLiveTextOverridesForLang(settings, targetLang)[key] || {}),
      ...(pendingByLang[targetLang]?.[key] || {}),
      isHidden: true,
    };

    const nextLangPending = {
      ...(pendingByLang[targetLang] || {}),
      [key]: newOverride,
    };
    setPendingByLang((prev) => ({
      ...prev,
      [targetLang]: nextLangPending,
    }));
    persistOverridesImmediately(targetLang, nextLangPending);

    showToast(
      `👁️ تم إخفاء العنصر في ${targetLang === "ar" ? "النسخة العربية" : "النسخة الإنجليزية"} فقط.`
    );
    setActiveTarget(null);
  };

  // Duplicate/Add a New Element strictly inside active language
  const handleDuplicateElement = () => {
    if (!activeTarget?.repeatable) return;
    const { parentEl, parentKey, templateEl, itemLabel, nextOrdinal } = activeTarget.repeatable;
    const targetLang = activeLang;

    const sourceCloneId = templateEl.getAttribute("data-live-clone-id") || undefined;
    let sourceIndex: number | undefined;
    if (!sourceCloneId) {
      const originalChildren = Array.from(parentEl.children).filter(
        (c) =>
          !c.hasAttribute("data-live-editor-ui") &&
          !c.hasAttribute("data-live-clone-id")
      );
      const foundIdx = originalChildren.indexOf(templateEl);
      sourceIndex = foundIdx >= 0 ? foundIdx : Math.max(0, originalChildren.length - 1);
    }

    const newEntry: LiveAddedElement = {
      id: `live_dup_${targetLang}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      language: targetLang,
      pathname,
      parentKey,
      sourceIndex,
      sourceCloneId,
      itemLabel,
      insertedAt: Date.now(),
    };

    const insertedClone = hydrateAndInsertClone(newEntry, pathname);

    updateStoreForLang(targetLang, (bucket) => ({
      ...bucket,
      added: [...bucket.added.filter((e) => e.id !== newEntry.id), newEntry],
    }));

    setActiveTarget(null);

    if (insertedClone) {
      insertedClone.scrollIntoView({ behavior: "smooth", block: "center" });
      insertedClone.style.outline = "3px solid #10b981";
      insertedClone.style.outlineOffset = "3px";
      setTimeout(() => {
        insertedClone.style.outline = "";
        insertedClone.style.outlineOffset = "";
      }, 2200);
    }

    const formattedOrdinal = String(nextOrdinal).padStart(2, "0");
    showToast(
      `✨ تمت إضافة ${itemLabel} جديدة (${formattedOrdinal}) في ${
        targetLang === "ar" ? "النسخة العربية فقط" : "النسخة الإنجليزية فقط"
      }!`
    );
  };

  // Immediate Delete Action (strictly scoped to active language)
  const handleQuickDelete = () => {
    if (!activeTarget) return;
    const targetLang = activeLang;
    const langLabel = targetLang === "ar" ? "النسخة العربية" : "النسخة الإنجليزية";
    if (!confirm(`هل أنت متأكد من حذف هذا العنصر من ${langLabel} فقط؟`)) return;

    const { element, key } = activeTarget;

    // If deleting a cloned element root, remove it cleanly from that language's added list & DOM
    if (key.startsWith("clone::") || element.hasAttribute("data-live-clone-id")) {
      const cloneId = element.getAttribute("data-live-clone-id") || key.replace("clone::", "");
      appliedSnapshotsRef.current.delete(element);
      element.remove();

      const nextLangPending = { ...(pendingByLang[targetLang] || {}) };
      Object.keys(nextLangPending).forEach((k) => {
        if (k === key || k.startsWith(`live::${cloneId}__`)) {
          delete nextLangPending[k];
        }
      });
      setPendingByLang((prev) => ({
        ...prev,
        [targetLang]: nextLangPending,
      }));

      updateStoreForLang(targetLang, (bucket) => {
        const cleanedOverrides: Record<string, LiveTextOverride> = {};
        Object.entries(bucket.overrides).forEach(([k, v]) => {
          if (k !== key && !k.startsWith(`live::${cloneId}__`)) {
            cleanedOverrides[k] = v;
          }
        });
        return {
          ...bucket,
          overrides: cleanedOverrides,
          added: bucket.added.filter((e) => e.id !== cloneId),
        };
      });

      showToast(`🗑️ تم حذف العنصر المضاف نهائياً من ${langLabel}.`);
      setActiveTarget(null);
      return;
    }

    if (
      !appliedSnapshotsRef.current.has(element) ||
      appliedSnapshotsRef.current.get(element)?.lang !== targetLang
    ) {
      appliedSnapshotsRef.current.set(element, captureSnapshot(element, targetLang, key));
    }
    element.style.setProperty("display", "none", "important");

    const newOverride: LiveTextOverride = {
      ...(getLiveTextOverridesForLang(settings, targetLang)[key] || {}),
      ...(pendingByLang[targetLang]?.[key] || {}),
      isDeleted: true,
      isHidden: true,
    };

    const nextLangPending = {
      ...(pendingByLang[targetLang] || {}),
      [key]: newOverride,
    };
    setPendingByLang((prev) => ({
      ...prev,
      [targetLang]: nextLangPending,
    }));
    persistOverridesImmediately(targetLang, nextLangPending);

    showToast(`🗑️ تم حذف العنصر من ${langLabel} فقط وحفظ التغيير.`);
    setActiveTarget(null);
  };

  // Toggle section visibility from Sections Manager (strictly for active language)
  const handleToggleSectionKey = (secKey: string) => {
    const key = `section::${secKey}`;
    const targetLang = activeLang;
    const currentOv =
      pendingByLang[targetLang]?.[key] ||
      getLiveTextOverridesForLang(settings, targetLang)[key] ||
      {};
    const willHide = !currentOv.isHidden && !currentOv.isDeleted;

    const secEl = document.querySelector(`[data-live-section="${secKey}"]`) as HTMLElement | null;
    if (secEl) {
      if (
        !appliedSnapshotsRef.current.has(secEl) ||
        appliedSnapshotsRef.current.get(secEl)?.lang !== targetLang
      ) {
        appliedSnapshotsRef.current.set(secEl, captureSnapshot(secEl, targetLang, key));
      }
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

    const nextLangPending = {
      ...(pendingByLang[targetLang] || {}),
      [key]: newOverride,
    };
    setPendingByLang((prev) => ({
      ...prev,
      [targetLang]: nextLangPending,
    }));
    persistOverridesImmediately(targetLang, nextLangPending);

    const langTag = targetLang === "ar" ? "النسخة العربية" : "النسخة الإنجليزية";
    showToast(
      willHide
        ? `تم إخفاء القسم "${secKey}" في ${langTag}`
        : `تم إظهار القسم "${secKey}" في ${langTag}`
    );
  };

  // Save All Changes strictly for active language
  const handleSaveAll = async () => {
    setIsSaving(true);
    const targetLang = activeLang;
    try {
      const langPending = pendingByLang[targetLang] || {};
      persistOverridesImmediately(targetLang, langPending);
      setPendingByLang((prev) => ({
        ...prev,
        [targetLang]: {},
      }));
      showToast(
        targetLang === "ar"
          ? "🎉 تم حفظ كافة تعديلات النسخة العربية بنجاح (منفصلة تماماً عن الإنجليزية)."
          : "🎉 تم حفظ كافة تعديلات النسخة الإنجليزية بنجاح (منفصلة تماماً عن العربية)."
      );
    } catch {
      showToast("حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  // Restore All Hidden & Deleted Elements strictly for active language
  const handleRestoreAll = () => {
    const targetLang = activeLang;
    const langLabel = targetLang === "ar" ? "النسخة العربية" : "النسخة الإنجليزية";
    if (!confirm(`هل تود استعادة وإظهار جميع العناصر والأقسام المخفية في ${langLabel} فقط؟`)) return;

    updateStoreForLang(targetLang, (bucket) => {
      const cleanOverrides: Record<string, LiveTextOverride> = {};
      Object.entries(bucket.overrides).forEach(([k, v]) => {
        cleanOverrides[k] = { ...v, isHidden: false, isDeleted: false };
      });
      return {
        ...bucket,
        overrides: cleanOverrides,
      };
    });

    document.querySelectorAll("[data-live-section]").forEach((el) => {
      (el as HTMLElement).style.removeProperty("display");
    });

    setPendingByLang((prev) => ({
      ...prev,
      [targetLang]: {},
    }));
    setActiveTarget(null);
    showToast(`✓ تم إظهار جميع العناصر والأقسام المخفية في ${langLabel}.`);
  };

  // Reset/Fix All Overrides strictly for active language
  const handleResetAllOverrides = () => {
    const targetLang = activeLang;
    const langLabel = targetLang === "ar" ? "النسخة العربية" : "النسخة الإنجليزية";
    if (
      !confirm(
        `هل تود مسح كافة تعديلات (${langLabel}) فقط وإعادة ضبطها للأصل 100%؟ لن تتأثر تعديلات اللغة الأخرى.`
      )
    ) {
      return;
    }

    document.querySelectorAll("[data-live-clone-id]").forEach((node) => node.remove());

    updateStoreForLang(targetLang, () => ({
      overrides: {},
      added: [],
      links: {},
    }));

    setPendingByLang((prev) => ({
      ...prev,
      [targetLang]: {},
    }));
    setActiveTarget(null);
    showToast(`✓ تم إعادة ضبط تعديلات ${langLabel} للأصل فقط (اللغة الأخرى محفوظة كما هي)!`);
  };

  // Discard Unsaved Changes strictly for active language
  const handleResetPending = () => {
    const targetLang = activeLang;
    const langLabel = targetLang === "ar" ? "النسخة العربية" : "النسخة الإنجليزية";
    if (confirm(`هل تود التراجع عن التعديلات المعلقة في ${langLabel} فقط؟`)) {
      setPendingByLang((prev) => ({
        ...prev,
        [targetLang]: {},
      }));
      setActiveTarget(null);
      window.location.reload();
    }
  };

  const pendingCount = Object.keys(pendingOverrides).length;
  const pageSections = discoveredSections;
  const isArEditor = activeLang === "ar";
  const currentLangOverridesMap = getLiveTextOverridesForLang(settings, activeLang);

  // CRITICAL SECURITY & UX GUARD:
  // Regular visitors (!isAdminDetected) must NEVER see the Live Editor launcher pill, toolbar, or popovers.
  // Note: applyOverrides() useEffect above still runs for all visitors so saved edits apply to everyone cleanly per language.
  if (!isAdminDetected) {
    return null;
  }

  return (
    <>
      {/* 1. FLOATING DEDICATED LANGUAGE LAUNCHER PILLS (When Live Edit is OFF) */}
      {!isLiveEdit && (
        <div
          data-live-editor-ui="true"
          dir="rtl"
          className="fixed bottom-6 start-6 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#18271b]/95 backdrop-blur-md shadow-2xl border-2 border-[#d4af37]/60 font-cairo animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <span className="text-[11px] font-bold text-[#f6f9e6] px-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="hidden sm:inline">المحرر المباشر:</span>
          </span>
          <button
            type="button"
            onClick={() => toggleLiveEdit(true, "ar")}
            className="px-3 py-1.5 rounded-xl bg-[#3a4d2c] hover:bg-[#485c36] text-white text-xs font-bold border border-emerald-300/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="فتح محرر النسخة العربية فقط — تعديلاته منفصلة ولا تؤثر على الإنجليزية"
          >
            <span>🇸🇦</span>
            <span>محرر العربية</span>
          </button>
          <button
            type="button"
            onClick={() => toggleLiveEdit(true, "en")}
            className="px-3 py-1.5 rounded-xl bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-bold border border-blue-300/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="فتح محرر النسخة الإنجليزية فقط — تعديلاته منفصلة ولا تؤثر على العربية"
          >
            <span>🇬🇧</span>
            <span>محرر الإنجليزية</span>
          </button>
        </div>
      )}

      {/* 2. TOP FLOATING CONTROL DOCK (Dedicated Visual Theme per Language Editor) */}
      {isLiveEdit && (
        <div
          data-live-editor-ui="true"
          dir="rtl"
          className={`fixed top-3 inset-x-3 sm:inset-x-8 z-[99999] backdrop-blur-md text-[#f6f9e6] rounded-2xl border-2 shadow-2xl p-2.5 sm:px-5 sm:py-3 font-cairo flex flex-col lg:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200 ${
            isArEditor
              ? "bg-[#18271b]/95 border-[#d4af37]/80"
              : "bg-[#0f172a]/95 border-blue-400/80"
          }`}
        >
          {/* Brand, Active Dedicated Editor Badge & Language Editor Switcher */}
          <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
            <div
              className={`w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-bold shrink-0 border shadow-xs ${
                isArEditor
                  ? "text-[#d4af37] border-[#d4af37]/40"
                  : "text-blue-300 border-blue-400/40"
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-amiri font-bold text-sm text-white">
                  {isArEditor ? "🇸🇦 محرر النسخة العربية فقط" : "🇬🇧 محرر النسخة الإنجليزية فقط"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isVisitorPreview
                      ? "bg-amber-500/20 text-amber-200 border-amber-400/40"
                      : isArEditor
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-blue-500/25 text-blue-200 border-blue-400/40"
                  }`}
                >
                  {isVisitorPreview
                    ? "معاينة كزائر 👁️"
                    : isArEditor
                    ? "عربي منفصل 🟢"
                    : "إنجليزي منفصل 🔵"}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 hidden sm:block">
                {isVisitorPreview
                  ? "أنت تشاهد هذه اللغة كما يراها الزائر بدون إطارات التحرير."
                  : isArEditor
                  ? "التعديلات هنا محفوظة للنسخة العربية فقط ولا تؤثر مطلقاً على النسخة الإنجليزية."
                  : "التعديلات هنا محفوظة للنسخة الإنجليزية فقط ولا تؤثر مطلقاً على النسخة العربية."}
              </p>
            </div>

            {/* Dedicated Language Editor Switcher */}
            <div className="flex items-center gap-1 bg-black/35 p-1 rounded-xl border border-white/15">
              <Globe className="w-3.5 h-3.5 text-white/70 ms-1.5 hidden sm:block" />
              <button
                type="button"
                onClick={() => switchEditorLanguage("ar")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  isArEditor
                    ? "bg-[#485c36] text-white shadow-xs border border-[#d4af37]/50"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>🇸🇦</span>
                <span>محرر العربية</span>
              </button>
              <button
                type="button"
                onClick={() => switchEditorLanguage("en")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  !isArEditor
                    ? "bg-blue-600 text-white shadow-xs border border-blue-300/50"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>🇬🇧</span>
                <span>محرر الإنجليزية</span>
              </button>
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
              title="إدارة أقسام الصفحة للغة الحالية"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>الأقسام ({pageSections.length})</span>
            </button>

            {/* Pending count */}
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                ✏️ {pendingCount} تعديل ({isArEditor ? "عربي" : "إنجليزي"})
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
              <span className="hidden sm:inline">{isVisitorPreview ? "إظهار الإطارات" : "معاينة"}</span>
            </button>

            {/* Restore Hidden Elements Button */}
            <button
              type="button"
              onClick={handleRestoreAll}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-blue-500/20 text-blue-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="إلغاء الإخفاء وإظهار العناصر المخفية لهذه اللغة فقط"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">إظهار المخفي</span>
            </button>

            {/* Reset All Overrides / Repair Button */}
            <button
              type="button"
              onClick={handleResetAllOverrides}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="استعادة النصوص الأصلية لهذه اللغة فقط دون المساس باللغة الأخرى"
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
                title="إلغاء التعديلات غير المحفوظة لهذه اللغة"
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
              className={`px-4 py-1.5 rounded-xl disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer border active:scale-95 ${
                isArEditor
                  ? "bg-gradient-to-r from-[#485c36] to-[#2f3d23] hover:from-[#3a4d2c] hover:to-[#222e18] border-[#d4af37]/40"
                  : "bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 border-blue-300/40"
              }`}
            >
              <Save className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات ✓"}</span>
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

      {/* SECTIONS MANAGER DRAWER (Floating Modal, strictly per active language) */}
      {isLiveEdit && sectionsDrawerOpen && (
        <div
          data-live-editor-ui="true"
          className={`fixed top-20 start-6 z-[99999] w-80 border-2 text-white rounded-3xl shadow-2xl p-4 font-cairo space-y-3 animate-in fade-in slide-in-from-top-2 ${
            isArEditor
              ? "bg-[#18271b] border-[#d4af37]"
              : "bg-[#0f172a] border-blue-400"
          }`}
          dir="rtl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#d4af37]" />
              <h4 className="font-bold text-xs text-white">
                أقسام الصفحة ({isArEditor ? "🇸🇦 العربية فقط" : "🇬🇧 الإنجليزية فقط"})
              </h4>
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
            إخفاء أو إظهار الأقسام هنا يطبّق على {isArEditor ? "النسخة العربية فقط" : "النسخة الإنجليزية فقط"}:
          </p>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {pageSections.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center">لا توجد أقسام رئيسية محددة في هذه الصفحة.</p>
            ) : (
              pageSections.map((sec) => {
                const secKey = `section::${sec.id}`;
                const isHidden =
                  pendingOverrides[secKey]?.isHidden ||
                  currentLangOverridesMap[secKey]?.isHidden ||
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
            * الإعدادات هنا خاصة بالنسخة {isArEditor ? "العربية 🇸🇦" : "الإنجليزية 🇬🇧"} ولن تغيّر النسخة الأخرى.
          </p>
        </div>
      )}

      {/* 3. FLOATING IN-CONTEXT POPOVER EDITOR */}
      {isLiveEdit && !isVisitorPreview && activeTarget && (
        <div
          data-live-editor-ui="true"
          style={{ top: `${popoverPos.y}px`, left: `${popoverPos.x}px` }}
          className={`absolute z-[999999] w-[350px] sm:w-[420px] bg-white rounded-3xl border-2 shadow-2xl p-5 text-gray-900 font-cairo space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
            isArEditor ? "border-[#485c36]" : "border-blue-600"
          }`}
          dir="rtl"
        >
          {/* Dedicated Language Guard Banner inside Popover */}
          <div
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-between ${
              isArEditor
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-blue-50 text-blue-900 border border-blue-200"
            }`}
          >
            <span>
              {isArEditor
                ? "🇸🇦 تعديل النسخة العربية فقط"
                : "🇬🇧 تعديل النسخة الإنجليزية فقط (English Only)"}
            </span>
            <span className="text-[10px] opacity-75">منفصل</span>
          </div>

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
          <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
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

            {activeTarget.repeatable && !activeTarget.isSection && (
              <button
                type="button"
                onClick={handleDuplicateElement}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-600 text-emerald-900 hover:text-white border border-emerald-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                title="إضافة عنصر جديد مطابق في نفس المجموعة"
              >
                <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                <span>
                  إضافة {activeTarget.repeatable.itemLabel} جديدة (
                  {String(activeTarget.repeatable.nextOrdinal).padStart(2, "0")}) من نفس النوع
                </span>
              </button>
            )}
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
                {activeTarget.repeatable
                  ? "يمكنك إضافة عنصر جديد مماثل بالزر الأخضر بالأعلى، أو إخفاء/حذف هذه البطاقة، أو النقر مباشرة على أي عنوان أو فقرة بداخلها لتعديل النص."
                  : "هذا العنصر يضم عدة عناصر فرعية (أيقونات، صور، ونصوص). لحماية التنسيق والتصميم، يمكنك إخفاؤه أو حذفه بالكامل، أو انقر مباشرة على أي نص محدد بداخله لتعديل كلماته بأمان."}
              </p>
            </div>
          ) : (
            <>
              {/* Text Input */}
              {activeTarget.canEditText && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                      <Type className="w-3 h-3 text-[#485c36]" />
                      <span>محتوى النص (Text Content):</span>
                    </label>
                    <span className="text-[10px] text-gray-400">Enter = سطر جديد ↵</span>
                  </div>
                  <textarea
                    rows={4}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    placeholder="اكتب النص الجديد هنا... واضغط Enter للنزول إلى سطر جديد"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36] focus:ring-1 focus:ring-[#485c36] leading-relaxed resize-y"
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

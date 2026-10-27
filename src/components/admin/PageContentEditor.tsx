"use client";

import React, { useEffect, useState } from "react";
import { PenLine, Wand2 } from "lucide-react";
import { VisualRichEditor } from "./VisualRichEditor";
import { AdvancedRichEditor } from "./AdvancedRichEditor";

interface PageContentEditorProps {
  value: string;
  onChange: (html: string) => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
}

type EditorMode = "simple" | "advanced";
const STORAGE_KEY = "sulaf_editor_mode";

/**
 * Wraps both editors behind one switch. Both edit the exact same HTML value,
 * so the admin can move between them at any time without losing content.
 */
export function PageContentEditor({ value, onChange, dir = "rtl", placeholder }: PageContentEditorProps) {
  const [mode, setMode] = useState<EditorMode>("simple");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "advanced" || saved === "simple") setMode(saved);
  }, []);

  function switchMode(next: EditorMode) {
    setMode(next);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, next);
  }

  const tab = (active: boolean) =>
    `px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
      active ? "bg-[#3d502d] text-white shadow-xs" : "text-gray-600 hover:text-black"
    }`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
          <button type="button" onClick={() => switchMode("simple")} className={tab(mode === "simple")}>
            <PenLine className="w-3.5 h-3.5" />
            <span>المحرر البسيط</span>
          </button>
          <button type="button" onClick={() => switchMode("advanced")} className={tab(mode === "advanced")}>
            <Wand2 className="w-3.5 h-3.5" />
            <span>المحرر المتقدم</span>
          </button>
        </div>
        <span className="text-[11px] text-gray-500">
          {mode === "simple"
            ? "أدوات أساسية سريعة: عناوين، عريض، قوائم، اقتباس."
            : "أدوات كاملة: حجم الخط، نوعه، الألوان، المحاذاة، الجداول، الصور، الروابط وكود HTML."}
        </span>
      </div>

      {mode === "simple" ? (
        <VisualRichEditor value={value} onChange={onChange} dir={dir} placeholder={placeholder} />
      ) : (
        <AdvancedRichEditor value={value} onChange={onChange} dir={dir} placeholder={placeholder} />
      )}
    </div>
  );
}

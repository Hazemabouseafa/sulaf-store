"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  AlignRight,
  AlignCenter,
  AlignLeft,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Link2,
  Unlink,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Plus,
  Quote,
  Undo2,
  Redo2,
  Eraser,
  Code2,
  Maximize2,
  Minimize2,
  Highlighter,
  Palette,
  Sparkles,
} from "lucide-react";

interface AdvancedRichEditorProps {
  value: string;
  onChange: (html: string) => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
}

const FONT_FAMILIES = [
  { label: "كايرو (الافتراضي)", value: "Cairo" },
  { label: "أميري (كلاسيكي)", value: "Amiri" },
  { label: "Cormorant Garamond", value: "Cormorant Garamond" },
  { label: "Inter", value: "Inter" },
  { label: "Tahoma", value: "Tahoma" },
  { label: "Georgia", value: "Georgia" },
  { label: "Courier New", value: "Courier New" },
];

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64, 80];

const LINE_HEIGHTS = ["1", "1.2", "1.5", "1.8", "2", "2.4", "3"];

const BRAND_COLORS = [
  { name: "أخضر سُلاف", value: "#485c36" },
  { name: "أخضر داكن", value: "#18271b" },
  { name: "عنابي", value: "#610b0d" },
  { name: "وردي", value: "#ca384a" },
  { name: "ذهبي", value: "#d4af37" },
  { name: "أسود", value: "#111111" },
  { name: "رمادي", value: "#6b7280" },
  { name: "أبيض", value: "#ffffff" },
];

const BLOCK_TAGS = new Set(["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE"]);

export function AdvancedRichEditor({
  value,
  onChange,
  dir = "rtl",
  placeholder = "اكتب هنا بحرية، وحدد أي نص ثم غيّر حجمه ولونه ونوع خطه من الشريط أعلاه...",
}: AdvancedRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [isEmpty, setIsEmpty] = useState(!value || value.trim() === "");
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceValue, setSourceValue] = useState(value || "");
  const [fullscreen, setFullscreen] = useState(false);
  const [currentSize, setCurrentSize] = useState(16);
  const [textColor, setTextColor] = useState("#485c36");
  const [highlightColor, setHighlightColor] = useState("#fff3b0");
  const [stats, setStats] = useState({ words: 0, chars: 0 });

  const updateStats = useCallback(() => {
    const text = editorRef.current?.innerText || "";
    const trimmed = text.trim();
    setStats({ words: trimmed ? trimmed.split(/\s+/).length : 0, chars: trimmed.length });
  }, []);

  // Sync external value → editor DOM
  useEffect(() => {
    if (sourceMode) return;
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value || "";
      setIsEmpty(!value || value.trim() === "");
    }
    updateStats();
  }, [value, sourceMode, updateStats]);

  // Track selection inside the editor (needed because toolbar inputs steal focus)
  useEffect(() => {
    function onSelectionChange() {
      const sel = window.getSelection();
      const el = editorRef.current;
      if (!sel || sel.rangeCount === 0 || !el) return;
      const range = sel.getRangeAt(0);
      if (!el.contains(range.commonAncestorContainer)) return;
      savedRange.current = range.cloneRange();
      const node = range.startContainer;
      const target = node.nodeType === 3 ? node.parentElement : (node as HTMLElement);
      if (target && el.contains(target)) {
        const px = parseFloat(window.getComputedStyle(target).fontSize);
        if (!Number.isNaN(px)) setCurrentSize(Math.round(px));
      }
    }
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, []);

  const emit = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    setIsEmpty(!html || html === "<p><br></p>" || html === "<br>" || html.trim() === "");
    onChange(html);
    updateStats();
  }, [onChange, updateStats]);

  const restoreSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }, []);

  const exec = useCallback(
    (command: string, val?: string) => {
      restoreSelection();
      try {
        document.execCommand("styleWithCSS", false, "true");
      } catch {
        /* ignore */
      }
      document.execCommand(command, false, val);
      emit();
    },
    [emit, restoreSelection]
  );

  // Selected blocks (or the block containing the caret)
  function getSelectedBlocks(): HTMLElement[] {
    const el = editorRef.current;
    const sel = window.getSelection();
    if (!el || !sel || sel.rangeCount === 0) return [];
    const range = sel.getRangeAt(0);
    const blocks: HTMLElement[] = [];
    el.querySelectorAll<HTMLElement>("p,div,h1,h2,h3,h4,h5,h6,li,blockquote").forEach((b) => {
      if (range.intersectsNode(b)) blocks.push(b);
    });
    if (blocks.length === 0) {
      let node: Node | null = range.startContainer;
      while (node && node !== el) {
        if (node.nodeType === 1 && BLOCK_TAGS.has((node as HTMLElement).tagName)) {
          return [node as HTMLElement];
        }
        node = node.parentNode;
      }
    }
    // Prefer innermost blocks only
    return blocks.filter((b) => !blocks.some((o) => o !== b && b.contains(o)));
  }

  function applyBlockStyle(fn: (b: HTMLElement) => void) {
    restoreSelection();
    const blocks = getSelectedBlocks();
    if (blocks.length === 0) {
      document.execCommand("formatBlock", false, "<p>");
      getSelectedBlocks().forEach(fn);
    } else {
      blocks.forEach(fn);
    }
    emit();
  }

  function applyFontSize(px: number) {
    const el = editorRef.current;
    if (!el) return;
    const size = Math.min(200, Math.max(8, Math.round(px)));
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && sel.getRangeAt(0).collapsed) {
      // No selection: size the whole current paragraph
      const blocks = getSelectedBlocks();
      if (blocks[0]) {
        const r = document.createRange();
        r.selectNodeContents(blocks[0]);
        sel.removeAllRanges();
        sel.addRange(r);
      }
    }
    try {
      document.execCommand("styleWithCSS", false, "false");
    } catch {
      /* ignore */
    }
    document.execCommand("fontSize", false, "7");
    // Convert the browser's legacy size-7 markers into exact pixel sizes
    const created: HTMLElement[] = [];
    el.querySelectorAll<HTMLElement>('font[size="7"]').forEach((f) => {
      const span = document.createElement("span");
      span.style.fontSize = `${size}px`;
      while (f.firstChild) span.appendChild(f.firstChild);
      f.parentNode?.replaceChild(span, f);
      created.push(span);
    });
    el.querySelectorAll<HTMLElement>("span[style]").forEach((sp) => {
      if (/xxx-large/.test(sp.style.fontSize)) {
        sp.style.fontSize = `${size}px`;
        created.push(sp);
      }
    });
    created.forEach((sp) => {
      sp.querySelectorAll<HTMLElement>("[style*='font-size']").forEach((inner) => {
        inner.style.fontSize = "";
        if (!inner.getAttribute("style")) inner.removeAttribute("style");
      });
    });
    setCurrentSize(size);
    emit();
  }

  function insertHtml(html: string) {
    exec("insertHTML", html);
  }

  function handleLink() {
    restoreSelection();
    const url = window.prompt("أدخل رابط الوجهة (مثال: https://sulaf.com/shop أو /shop):", "https://");
    if (!url) return;
    exec("createLink", url);
    editorRef.current?.querySelectorAll<HTMLAnchorElement>("a").forEach((a) => {
      if (/^https?:/i.test(a.getAttribute("href") || "")) {
        a.target = "_blank";
        a.rel = "noreferrer";
      }
    });
    emit();
  }

  function handleImage() {
    restoreSelection();
    const url = window.prompt("أدخل رابط الصورة (مثال: /brand/sulaf-logo-official.png أو رابط خارجي):", "");
    if (!url) return;
    insertHtml(`<img src="${url.replace(/"/g, "&quot;")}" alt="" style="max-width:100%;border-radius:16px;margin:12px 0;" />`);
  }

  function handleTable() {
    const cell = 'style="border:1px solid #dbe2bd;padding:8px;"';
    const row = `<tr><td ${cell}>نص</td><td ${cell}>نص</td><td ${cell}>نص</td></tr>`;
    insertHtml(
      `<table style="width:100%;border-collapse:collapse;margin:12px 0;"><tbody>${row}${row}${row}</tbody></table><p><br></p>`
    );
  }

  function toggleDirection(d: "rtl" | "ltr") {
    applyBlockStyle((b) => {
      b.setAttribute("dir", d);
      b.style.textAlign = d === "rtl" ? "right" : "left";
    });
  }

  function switchSourceMode() {
    if (!sourceMode) {
      setSourceValue(editorRef.current?.innerHTML || value || "");
      setSourceMode(true);
    } else {
      setSourceMode(false);
    }
  }

  const btn =
    "p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-black transition-colors cursor-pointer disabled:opacity-40";
  const group = "flex items-center bg-white border border-[#dbe2bd] rounded-xl p-0.5 shadow-2xs";
  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  const wrapperCls = fullscreen
    ? "fixed inset-0 z-[1000] bg-white flex flex-col"
    : "border border-[#dbe2bd] rounded-2xl bg-white overflow-hidden shadow-xs";

  return (
    <div className={wrapperCls} dir={dir}>
      {/* TOOLBAR */}
      <div className="bg-[#fcfdfa] border-b border-[#e2e8c0] p-2 flex flex-wrap items-center gap-1.5">
        {/* Font family */}
        <select
          onChange={(e) => e.target.value && exec("fontName", e.target.value)}
          defaultValue=""
          className="h-8 px-2 text-xs font-bold rounded-xl border border-[#dbe2bd] bg-white text-gray-800 cursor-pointer"
          title="نوع الخط"
        >
          <option value="" disabled>
            نوع الخط
          </option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>

        {/* Font size */}
        <div className={group} title="حجم الخط بالبكسل">
          <button type="button" onMouseDown={keepFocus} onClick={() => applyFontSize(currentSize - 2)} className={btn} title="تصغير الخط">
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min={8}
            max={200}
            value={currentSize}
            onChange={(e) => setCurrentSize(Number(e.target.value) || 16)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyFontSize(currentSize);
              }
            }}
            className="w-12 h-7 text-center text-xs font-mono font-bold border-0 outline-none bg-transparent"
          />
          <button type="button" onMouseDown={keepFocus} onClick={() => applyFontSize(currentSize + 2)} className={btn} title="تكبير الخط">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <select
          onChange={(e) => e.target.value && applyFontSize(Number(e.target.value))}
          value=""
          className="h-8 px-2 text-xs font-bold rounded-xl border border-[#dbe2bd] bg-white text-gray-800 cursor-pointer"
          title="أحجام جاهزة"
        >
          <option value="" disabled>
            حجم جاهز
          </option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>

        {/* Heading style */}
        <select
          onChange={(e) => e.target.value && exec("formatBlock", e.target.value)}
          value=""
          className="h-8 px-2 text-xs font-bold rounded-xl border border-[#dbe2bd] bg-white text-gray-800 cursor-pointer"
          title="نمط الفقرة"
        >
          <option value="" disabled>
            نمط الفقرة
          </option>
          <option value="<p>">نص عادي</option>
          <option value="<h2>">عنوان رئيسي</option>
          <option value="<h3>">عنوان فرعي</option>
          <option value="<h4>">عنوان صغير</option>
        </select>

        {/* Text styles */}
        <div className={group}>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("bold")} className={btn} title="عريض">
            <Bold className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("italic")} className={btn} title="مائل">
            <Italic className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("underline")} className={btn} title="تسطير">
            <Underline className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("strikeThrough")} className={btn} title="يتوسطه خط">
            <Strikethrough className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("subscript")} className={btn} title="نص سفلي">
            <Subscript className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("superscript")} className={btn} title="نص علوي">
            <Superscript className="w-4 h-4" />
          </button>
        </div>

        {/* Colors */}
        <div className={group}>
          <label className="flex items-center gap-1 px-1.5 cursor-pointer" title="لون النص">
            <Palette className="w-4 h-4 text-gray-700" />
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                exec("foreColor", e.target.value);
              }}
              className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>
          <label className="flex items-center gap-1 px-1.5 cursor-pointer" title="لون تظليل النص">
            <Highlighter className="w-4 h-4 text-gray-700" />
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => {
                setHighlightColor(e.target.value);
                exec("hiliteColor", e.target.value);
              }}
              className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>
        </div>
        <div className="flex items-center gap-1">
          {BRAND_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onMouseDown={keepFocus}
              onClick={() => {
                setTextColor(c.value);
                exec("foreColor", c.value);
              }}
              title={c.name}
              className="w-5 h-5 rounded-full border border-gray-300 hover:scale-110 transition-transform cursor-pointer"
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        {/* Alignment */}
        <div className={group}>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("justifyRight")} className={btn} title="محاذاة لليمين">
            <AlignRight className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("justifyCenter")} className={btn} title="توسيط">
            <AlignCenter className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("justifyLeft")} className={btn} title="محاذاة لليسار">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("justifyFull")} className={btn} title="ضبط">
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Direction + line height */}
        <div className={group}>
          <button type="button" onMouseDown={keepFocus} onClick={() => toggleDirection("rtl")} className={`${btn} text-[10px] font-black px-2`} title="اتجاه الفقرة من اليمين لليسار">
            RTL
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => toggleDirection("ltr")} className={`${btn} text-[10px] font-black px-2`} title="اتجاه الفقرة من اليسار لليمين">
            LTR
          </button>
        </div>
        <select
          onChange={(e) => {
            const lh = e.target.value;
            if (lh) applyBlockStyle((b) => (b.style.lineHeight = lh));
          }}
          value=""
          className="h-8 px-2 text-xs font-bold rounded-xl border border-[#dbe2bd] bg-white text-gray-800 cursor-pointer"
          title="تباعد الأسطر"
        >
          <option value="" disabled>
            تباعد الأسطر
          </option>
          {LINE_HEIGHTS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Lists + indent */}
        <div className={group}>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("insertUnorderedList")} className={btn} title="قائمة نقطية">
            <List className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("insertOrderedList")} className={btn} title="قائمة رقمية">
            <ListOrdered className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("outdent")} className={btn} title="تقليل المسافة البادئة">
            <Outdent className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("indent")} className={btn} title="زيادة المسافة البادئة">
            <Indent className="w-4 h-4" />
          </button>
        </div>

        {/* Insert */}
        <div className={group}>
          <button type="button" onMouseDown={keepFocus} onClick={handleLink} className={btn} title="إدراج رابط">
            <Link2 className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("unlink")} className={btn} title="إزالة الرابط">
            <Unlink className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={handleImage} className={btn} title="إدراج صورة">
            <ImageIcon className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={handleTable} className={btn} title="إدراج جدول">
            <TableIcon className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("formatBlock", "<blockquote>")} className={btn} title="اقتباس">
            <Quote className="w-4 h-4 text-[#d4af37]" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => insertHtml("<hr/><p><br></p>")} className={btn} title="خط فاصل">
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onMouseDown={keepFocus}
            onClick={() =>
              insertHtml(
                `<span style="display:inline-block;padding:2px 12px;border-radius:999px;background:#485c3620;color:#485c36;font-weight:700;font-size:13px;">✨ شارة مميزة</span>&nbsp;`
              )
            }
            className={btn}
            title="شارة مميزة"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
          </button>
        </div>

        {/* History + tools */}
        <div className={`${group} ms-auto`}>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("undo")} className={btn} title="تراجع">
            <Undo2 className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("redo")} className={btn} title="إعادة">
            <Redo2 className="w-4 h-4" />
          </button>
          <button type="button" onMouseDown={keepFocus} onClick={() => exec("removeFormat")} className={`${btn} hover:text-red-700`} title="مسح التنسيق">
            <Eraser className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={switchSourceMode}
            className={`${btn} ${sourceMode ? "bg-[#3d502d] text-white hover:bg-[#3d502d] hover:text-white" : ""}`}
            title="عرض كود HTML"
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => setFullscreen((f) => !f)} className={btn} title={fullscreen ? "إغلاق ملء الشاشة" : "ملء الشاشة"}>
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* EDITING AREA */}
      {sourceMode ? (
        <textarea
          value={sourceValue}
          onChange={(e) => {
            setSourceValue(e.target.value);
            onChange(e.target.value);
          }}
          dir="ltr"
          spellCheck={false}
          className={`w-full p-5 font-mono text-xs bg-gray-950 text-emerald-200 outline-none resize-y ${fullscreen ? "flex-1" : "min-h-[420px]"}`}
        />
      ) : (
        <div
          className={`relative p-5 sm:p-7 bg-white cursor-text overflow-y-auto ${fullscreen ? "flex-1" : "min-h-[420px]"}`}
          onClick={() => editorRef.current?.focus()}
        >
          {isEmpty && (
            <div className="absolute top-7 start-7 sm:start-9 pointer-events-none text-gray-400 text-xs sm:text-sm select-none">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={emit}
            onBlur={emit}
            className="outline-none min-h-[380px] text-gray-800 leading-[2] space-y-3
              [&_h2]:font-amiri [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:pt-3 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-gray-100
              [&_h3]:font-amiri [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#610b0d] [&_h3]:pt-2
              [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#18271b]
              [&_p]:text-base [&_p]:text-gray-700
              [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5
              [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-1.5
              [&_li]:text-gray-700
              [&_a]:text-[#610b0d] [&_a]:underline
              [&_img]:max-w-full [&_img]:rounded-2xl
              [&_table]:w-full [&_table]:border-collapse
              [&_blockquote]:border-s-4 [&_blockquote]:border-[#d4af37] [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:bg-[#fbf9f0] [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl"
          />
        </div>
      )}

      {/* FOOTER */}
      <div className="bg-[#fcfdfa] border-t border-[#e2e8c0] px-4 py-2 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          حدد النص ثم غيّر الحجم أو اللون أو الخط. لو ما حددتش نص، التغيير بيتطبق على الفقرة الحالية.
        </span>
        <span className="font-mono text-[10px] text-emerald-800 font-bold shrink-0">
          {stats.words} كلمة · {stats.chars} حرف
        </span>
      </div>
    </div>
  );
}

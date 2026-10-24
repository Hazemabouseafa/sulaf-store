"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Quote,
  Sparkles,
  Minus,
  Undo2,
  Redo2,
  Eraser,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

interface VisualRichEditorProps {
  value: string;
  onChange: (html: string) => void;
  dir?: "rtl" | "ltr";
  placeholder?: string;
  minHeight?: string;
}

export function VisualRichEditor({
  value,
  onChange,
  dir = "rtl",
  placeholder = "اكتب هنا محتوى وتفاصيل الصفحة بحرية، واستخدم الأدوات أعلاه لتنسيق النصوص مباشرة...",
  minHeight = "340px",
}: VisualRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorEmpty, setIsEditorEmpty] = useState(!value || value.trim() === "");

  // Sync value from props only when internal content actually differs
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
      setIsEditorEmpty(!value || value.trim() === "");
    }
  }, [value]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setIsEditorEmpty(!html || html === "<p><br></p>" || html.trim() === "");
    onChange(html);
  };

  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const insertCustomHtml = (htmlSnippet: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const el = document.createElement("div");
      el.innerHTML = htmlSnippet;
      const frag = document.createDocumentFragment();
      let node;
      let lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      if (lastNode) {
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      // Append at end if no active selection
      editorRef.current.innerHTML += htmlSnippet;
    }
    handleInput();
  };

  return (
    <div className="border border-[#dbe2bd] rounded-2xl bg-white overflow-hidden shadow-xs space-y-0" dir={dir}>
      {/* 1. Main Visual Toolbar */}
      <div className="bg-[#fcfdfa] border-b border-[#e2e8c0] p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Style Commands */}
          <div className="flex items-center bg-white border border-[#dbe2bd] rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-black transition-colors"
              title="خط عريض (Bold)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-black transition-colors"
              title="خط مائل (Italic)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("underline")}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-black transition-colors"
              title="تسطير (Underline)"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Heading Formatting */}
          <div className="flex items-center bg-white border border-[#dbe2bd] rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h2>")}
              className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-xs font-bold text-[#485c36] flex items-center gap-1 transition-colors"
              title="عنوان رئيسي (Heading 2)"
            >
              <Heading2 className="w-4 h-4" />
              <span className="hidden sm:inline">عنوان رئيسي</span>
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h3>")}
              className="px-2.5 py-1 rounded-lg hover:bg-gray-100 text-xs font-bold text-[#610b0d] flex items-center gap-1 transition-colors"
              title="عنوان فرعي (Heading 3)"
            >
              <Heading3 className="w-4 h-4" />
              <span className="hidden sm:inline">عنوان فرعي</span>
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<p>")}
              className="px-2 py-1 rounded-lg hover:bg-gray-100 text-xs font-bold text-gray-700 flex items-center gap-1 transition-colors"
              title="نص عادي (Paragraph)"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">نص عادي</span>
            </button>
          </div>

          {/* Lists Formatting */}
          <div className="flex items-center bg-white border border-[#dbe2bd] rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-black transition-colors"
              title="قائمة نقطية (Bullet List)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("insertOrderedList")}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-black transition-colors"
              title="قائمة رقمية (Numbered List)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Luxury Custom Sulaf Blocks */}
          <div className="flex items-center bg-white border border-[#dbe2bd] rounded-xl p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() =>
                insertCustomHtml(
                  `<blockquote class="my-4 border-s-4 border-[#d4af37] ps-4 py-2 italic bg-[#fbf9f0] rounded-r-xl text-gray-800">اكتبي هنا الاقتباس أو القول المأثور...</blockquote><p><br></p>`
                )
              }
              className="px-2.5 py-1 rounded-lg hover:bg-amber-50 text-xs font-bold text-amber-900 flex items-center gap-1 transition-colors"
              title="إدراج اقتباس ذهبي"
            >
              <Quote className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">اقتباس ذهبي</span>
            </button>
            <button
              type="button"
              onClick={() =>
                insertCustomHtml(
                  `<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#485c36]/10 text-[#485c36] text-xs font-bold font-cairo my-2">✨ نص الشارة التوثيقية هنا</div>&nbsp;`
                )
              }
              className="px-2.5 py-1 rounded-lg hover:bg-emerald-50 text-xs font-bold text-[#485c36] flex items-center gap-1 transition-colors"
              title="إدراج شارة سريرية"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">شارة مميزة</span>
            </button>
          </div>

          {/* Divider */}
          <button
            type="button"
            onClick={() => insertCustomHtml("<hr class='my-4 border-gray-200'/><p><br></p>")}
            className="p-1.5 rounded-xl bg-white border border-[#dbe2bd] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            title="إدراج خط فاصل"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Undo / Redo & Clear */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => executeCommand("undo")}
            className="p-1.5 rounded-xl bg-white border border-[#dbe2bd] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            title="تراجع (Undo)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("redo")}
            className="p-1.5 rounded-xl bg-white border border-[#dbe2bd] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
            title="إعادة (Redo)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            className="p-1.5 rounded-xl bg-white border border-[#dbe2bd] text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            title="مسح كافة التنسيقات"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Quick One-Click Section Inserters Bar */}
      <div className="px-3 py-1.5 bg-[#f6f9e6]/50 border-b border-[#e8edd0] flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-bold text-[#485c36] flex items-center gap-1">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>إضافة عناصر سريعة للفقرة:</span>
        </span>
        <button
          type="button"
          onClick={() =>
            insertCustomHtml("<h2>عنوان فقرة جديدة</h2><p>اكتب هنا تفاصيل وشرح هذا القسم بحرية...</p>")
          }
          className="px-2 py-0.5 rounded-md bg-white border border-[#dbe2bd] hover:bg-[#f6f9e6] text-[#485c36] font-bold text-[11px] transition-all cursor-pointer"
        >
          + عنوان وشرح
        </button>
        <button
          type="button"
          onClick={() =>
            insertCustomHtml("<ul><li>نقطة أولى مميزة</li><li>نقطة ثانية للمستحضر</li><li>نقطة ثالثة للنتائج</li></ul><p><br></p>")
          }
          className="px-2 py-0.5 rounded-md bg-white border border-[#dbe2bd] hover:bg-[#f6f9e6] text-gray-700 font-bold text-[11px] transition-all cursor-pointer"
        >
          + قائمة مميزات
        </button>
        <button
          type="button"
          onClick={() =>
            insertCustomHtml(
              '<blockquote class="my-3 border-s-4 border-[#d4af37] ps-4 py-2 italic bg-[#fbf9f0] rounded-r-xl font-amiri text-lg">«اكتب هنا عبارة أو اقتباس ترويجي فاخر»</blockquote><p><br></p>'
            )
          }
          className="px-2 py-0.5 rounded-md bg-white border border-[#dbe2bd] hover:bg-[#fbf9f0] text-amber-900 font-bold text-[11px] transition-all cursor-pointer"
        >
          + اقتباس فخم
        </button>
      </div>

      {/* 3. The Visual ContentEditable Area */}
      <div className="relative p-5 sm:p-7 min-h-[340px] bg-white cursor-text" onClick={() => editorRef.current?.focus()}>
        {isEditorEmpty && (
          <div className="absolute top-7 right-7 sm:right-9 pointer-events-none text-gray-400 text-xs sm:text-sm select-none">
            {placeholder}
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onBlur={handleInput}
          className="outline-none min-h-[300px] text-gray-800 leading-[2.2] space-y-4
            [&_h2]:font-amiri [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-[#485c36] [&_h2]:pt-3 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-gray-100
            [&_h3]:font-amiri [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#610b0d] [&_h3]:pt-2
            [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-gray-700
            [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-1.5
            [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-1.5
            [&_li]:text-xs [&_li]:sm:text-sm [&_li]:text-gray-700
            [&_strong]:text-[#1c2616] [&_strong]:font-bold
            [&_blockquote]:border-s-4 [&_blockquote]:border-[#d4af37] [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:bg-[#fbf9f0] [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl"
        />
      </div>

      {/* 4. Footer Help Tip */}
      <div className="bg-[#fcfdfa] border-t border-[#e2e8c0] px-4 py-2 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#485c36]" />
          <span>المحرر مرئي بالكامل: اكتب النصوص ونسقها كأنك تكتب في ملف Word دون أي أكواد برمجية.</span>
        </span>
        <span className="font-mono text-[10px] text-emerald-800 font-bold">WYSIWYG Visual Canvas ✓</span>
      </div>
    </div>
  );
}

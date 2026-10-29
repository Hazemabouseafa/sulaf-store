"use client";

import React, { useState } from "react";
import {
  ProductData,
  ProductCustomSection,
  ProductCustomCard,
  ProductSectionType,
  ProductPageBuilderData,
} from "@/lib/data/mock-data";
import {
  Layers,
  Sparkles,
  BookOpen,
  Clock,
  Dna,
  Quote,
  HelpCircle,
  FileText,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Globe,
} from "lucide-react";

interface ProductPageBuilderModalProps {
  product: ProductData;
  adminLang: "ar" | "en";
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPageBuilder: ProductPageBuilderData) => void;
}

export function ProductPageBuilderModal({
  product,
  adminLang,
  isOpen,
  onClose,
  onSave,
}: ProductPageBuilderModalProps) {
  const [activeTab, setActiveTab] = useState<
    "story" | "actives" | "ritual" | "inci" | "signature" | "custom_sections"
  >("story");

  // Local state to toggle editing language: Arabic vs English
  const [editorLang, setEditorLang] = useState<"ar" | "en">(adminLang || "ar");

  // Local state initialized from product
  const [pageBuilder, setPageBuilder] = useState<ProductPageBuilderData>(() => {
    return (
      product.pageBuilder || {
        storyEnabled: true,
        storyTitleAr: product.storyTitle || "قصة المستحضر: ترميم هيكلي، بدون احتكاك",
        storyTitleEn: product.storyTitle || "The Story: Structural Restoration, Not Friction",
        storyBadgeAr: "فلسفة الترميم السريري",
        storyBadgeEn: "Clinical Philosophy & Origin",
        storyParagraphs: product.storyParagraphs || [
          "حين شيد الحرفيون القدامى قصور الأندلس، فهموا قانوناً جوهرياً للتوازن: الحجر لا يخضع للقوة الغاشمة، بل للهندسة المتقنة.",
          "بشرتك تتحدث باللغة ذاتها. تلك الحبيبات الخشنة وجلد الوزة ليست أوساخاً لتُفرك بخشونة، بل هي دروع كيراتينية دفاعية بنتها بشرتك لحماية حاجز فقد ترطيبه.",
          "Absolutes Smoothing Body Cream تحفة سريرية صُممت لإنهاء الحرب بين بشرتك والمقشرات القاسية.",
        ],
        storyParagraphsEn: product.storyParagraphsEn || [
          "When ancient artisans raised the palaces of Andalusia, they understood a fundamental law of balance: stone never submits to brute force, only to enduring geometry.",
          "Your skin speaks the same language. Those rough, strawberry bumps are not debris to be scrubbed away—they are fragile ramparts, desperate keratin shields raised by a barrier stripped of moisture.",
          "Absolutes Smoothing Body Cream is a clinical masterpiece formulated to end the war between your skin and coarse exfoliants.",
        ],
        activesEnabled: true,
        activesTitleAr: product.activesTitleAr || "المركب الثلاثي السريري والمركبات الفعالة",
        activesTitleEn: product.activesTitleEn || "The Triple Clinical Complex & Key Actives",
        activesSubtitleAr: "فحص الميكانيزم الجزيئي لكل مركب سريري فعال في تركيبة المستحضر.",
        activesSubtitleEn: "Inspect the molecular mechanism of each clinical active in the formulation.",
        activesCards: ((product.activeIngredients as any[]) || []).map((ing: any, i: number) => ({
          id: `act-${i}`,
          titleAr: ing.nameAr || "مركب سريري",
          titleEn: ing.nameEn || "Clinical Active",
          concentration: ing.concentration || "",
          descAr: ing.scientificDescriptionAr || ing.functionAr || "مركب سريري فعال لدعم حاجز البشرة وترميم ملمسها.",
          descEn: ing.functionEn || "Clinical active strengthening skin barrier.",
        })),
        ritualEnabled: true,
        ritualTitleAr: "بروتوكول الاستخدام والتطبيق الهيكلي",
        ritualTitleEn: "Ritual & Architectural Application",
        ritualSubtitleAr: "تسلسل مرقم لتحقيق أعلى استجابة خلوية ونعومة حريرية دائمة.",
        ritualSubtitleEn: "Numbered sequence for peak cellular response and lasting epidermal silkiness.",
        ritualSteps: [
          {
            stepNum: "01",
            titleAr: "التطبيق على بشرة دافئة ونظيفة",
            titleEn: "Apply to Warm, Clean Skin",
            descAr: "استخدمي المستحضر مباشرة بعد الاستحمام بالماء الدافئ حين تكون المسام مهيأة لامتصاص اليوريا والأمونيوم لاكتات بعمق.",
            descEn: "Apply directly after a warm shower when follicles are receptive to deep urea and ammonium lactate infiltration.",
          },
          {
            stepNum: "02",
            titleAr: "التوزيع الحركي الدائري اللطيف",
            titleEn: "Gentle Circular Kinetic Distribution",
            descAr: "دلكي بحركات دائرية هادئة على مناطق الخشونة وجلد الوزة (الذراعين، الفخذين، الركبتين) دون فرك عنيف حتى يُمتص تماماً.",
            descEn: "Massage in calm circular strokes over targeted rough patches until fully absorbed without aggressive friction.",
          },
          {
            stepNum: "03",
            titleAr: "المواظبة لليوم السابع لترسيخ النعومة الحريرية",
            titleEn: "Maintain Through Day 7 for Silk Lock",
            descAr: "كرري الطقس مساءً كل يوم. من اليوم الثالث تبدأ الروابط الكيراتينية بالذوبان، وبحلول اليوم السابع يستقر ملمس الحرير الدائم.",
            descEn: "Repeat nightly. By day 3 keratin plugs dissolve from the root, reaching lasting touchable silk by day 7.",
          },
        ],
        inciEnabled: true,
        inciTitleAr: "قائمة المكونات التفصيلية الكاملة (Full INCI)",
        inciTitleEn: "Full INCI Composition",
        inciContentAr: product.inci || "Aqua (Purified Water), Medical-grade Urea (30%), Ammonium Lactate (10%), Salicylic Acid (2%), Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Butyrospermum Parkii (Shea Butter), Caprylic/Capric Triglyceride, Glycerin, Dimethicone, Allantoin, Panthenol (Vitamin B5), Tocopheryl Acetate (Vitamin E).",
        inciContentEn: product.inci || "Aqua (Purified Water), Medical-grade Urea (30%), Ammonium Lactate (10%), Salicylic Acid (2%), Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Butyrospermum Parkii (Shea Butter), Caprylic/Capric Triglyceride, Glycerin, Dimethicone, Allantoin, Panthenol (Vitamin B5), Tocopheryl Acetate (Vitamin E).",
        signatureEnabled: true,
        signatureArabic: product.signatureArabic || "وما الحُسنُ في الأجسادِ إلا دلالةٌ • على رقةٍ في الروحِ لا تتكلّفُ",
        signatureTranslation: product.signatureTranslation || "Beauty on the skin is but a quiet reflection of an effortless grace within the soul.",
        signatureAuthor: "Sulaf Cosmeceuticals Laboratories",
        customSections: product.customSections || [],
      }
    );
  });

  if (!isOpen) return null;

  // Helpers for adding items
  const addActiveCard = () => {
    setPageBuilder((prev) => ({
      ...prev,
      activesCards: [
        ...(prev.activesCards || []),
        {
          id: `act-${Date.now()}`,
          titleAr: "مركب سريري جديد",
          titleEn: "New Clinical Active",
          concentration: "5%",
          descAr: "شرح تأثير المركب الصيدلاني وفوائده للبشرة.",
          descEn: "Clinical action and benefits on the skin barrier.",
        },
      ],
    }));
  };

  const removeActiveCard = (index: number) => {
    setPageBuilder((prev) => ({
      ...prev,
      activesCards: (prev.activesCards || []).filter((_, i) => i !== index),
    }));
  };

  const addRitualStep = () => {
    const nextNum = String((pageBuilder.ritualSteps?.length || 0) + 1).padStart(2, "0");
    setPageBuilder((prev) => ({
      ...prev,
      ritualSteps: [
        ...(prev.ritualSteps || []),
        {
          stepNum: nextNum,
          titleAr: "خطوة تطبيق إضافية",
          titleEn: "Additional Ritual Phase",
          descAr: "شرح طريقة الاستخدام وأفضل توقيت للتطبيق.",
          descEn: "Instructions and optimal timing for application.",
        },
      ],
    }));
  };

  const removeRitualStep = (index: number) => {
    setPageBuilder((prev) => ({
      ...prev,
      ritualSteps: (prev.ritualSteps || []).filter((_, i) => i !== index),
    }));
  };

  // Custom Sections Helpers
  const addCustomSection = (type: ProductSectionType) => {
    const newSection: ProductCustomSection = {
      id: `sec-${Date.now()}`,
      type,
      enabled: true,
      order: (pageBuilder.customSections?.length || 0) + 1,
      titleAr:
        type === "cards"
          ? "مميزات ونتائج المستحضر السريرية"
          : type === "faq"
          ? "الأسئلة الشائعة حول المستحضر"
          : type === "mediaText"
          ? "دراسة معملية ونتائج سريرية مثبتة"
          : type === "banner"
          ? "توصية صيدلانية خاصة"
          : "ملاحظات إضافية من خبراء سلاف",
      titleEn:
        type === "cards"
          ? "Clinical Highlights & Features"
          : type === "faq"
          ? "Product Frequently Asked Questions"
          : type === "mediaText"
          ? "Laboratory Study & Proven Results"
          : type === "banner"
          ? "Dermatologist Recommendation"
          : "Additional Clinical Notes",
      badgeAr: type === "cards" ? "مميزات سريرية" : "إرشادات",
      badgeEn: type === "cards" ? "CLINICAL CARDS" : "GUIDE",
      contentAr: "محتوى توضيحي إضافي للمنتج لتعزيز ثقة العميل وتوضيح طريقة الاستخدام والنتائج.",
      contentEn: "Additional detailed clinical content for the product to reinforce customer confidence.",
      imageUrl: "/brand/sulaf-flower-symbol.png",
      cards:
        type === "cards"
          ? [
              {
                id: `card-1`,
                titleAr: "مفعول سريع من اليوم السابع",
                titleEn: "Visible Results by Day 7",
                concentration: "Day 7",
                descAr: "ذوبان تدريجي لجلد الوزة والخشونة بنسبة تصل إلى 94% في الدراسات السريرية.",
                descEn: "Gradual elimination of keratosis pilaris roughness up to 94%.",
              },
              {
                id: `card-2`,
                titleAr: "خالٍ من العطور والبارابين",
                titleEn: "Fragrance & Paraben Free",
                concentration: "0% Perfume",
                descAr: "تركيبة آمنة تماماً على البشرة شديدة الحساسية وحاجز الجلد المتضرر.",
                descEn: "Safe for sensitive skin and compromised barrier.",
              },
            ]
          : type === "faq"
          ? [
              {
                id: `faq-1`,
                titleAr: "هل يناسب المستحضر البشرة شديدة الجفاف والمعرضة للإكزيما؟",
                titleEn: "Is it suitable for extremely dry or eczema-prone skin?",
                descAr: "نعم، التركيبة تحتوي على السيراميدات النباتية واليوريا المرطبة التي تعمل على تعزيز الترطيب العميق دون أي تهيج.",
                descEn: "Yes, formulated with phytoceramides and medical-grade urea providing deep hydration without irritation.",
              },
              {
                id: `faq-2`,
                titleAr: "متى تظهر النتائج الملموسة على ملمس البشرة؟",
                titleEn: "When are visible results noticeable?",
                descAr: "تبدأ النعومة الأولية من أول 48 ساعة، بينما يختفي مظهر جلد الوزة والخشونة المتصلبة تماماً بحلول اليوم السابع إلى العاشر.",
                descEn: "Initial smoothness is felt within 48 hours; strawberry bump texture disappears between day 7 and 10.",
              },
            ]
          : [],
    };

    setPageBuilder((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSection],
    }));
  };

  const removeCustomSection = (id: string) => {
    setPageBuilder((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((s) => s.id !== id),
    }));
  };

  const moveCustomSection = (index: number, direction: "up" | "down") => {
    setPageBuilder((prev) => {
      const list = [...(prev.customSections || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, customSections: list };
    });
  };

  const handleApply = () => {
    onSave(pageBuilder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm font-cairo animate-in fade-in duration-200">
      <div className="bg-[#fcfdfa] w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#18271b] text-[#f6f9e6] flex items-center justify-between border-b border-[#485c36]/40 shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#485c36] text-[#f6f9e6] flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-[#f6f9e6]">
                  {editorLang === "ar"
                    ? `محرر صفحة المستحضر المتقدم: ${product.nameAr}`
                    : `Advanced Product Page Builder: ${product.nameEn || product.nameAr}`}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f3a5a1]/20 text-[#f3a5a1] border border-[#f3a5a1]/30">
                  {editorLang === "ar" ? "كل ما بعد القسم الأول" : "After Hero Section"}
                </span>
              </div>
              <p className="text-[11px] text-[#f6f9e6]/75 mt-0.5">
                {editorLang === "ar"
                  ? "تخصيص وإضافة الأقسام، الكروت، المكونات، الطقوس، والأسئلة الشائعة الخاصة بهذا المستحضر حصرياً."
                  : "Customize sections, cards, bio-actives, ritual phases, and FAQs exclusively for this product."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bilingual Editor Language Switcher */}
            <div className="flex items-center gap-1 bg-[#24341f] p-1 rounded-2xl border border-white/20">
              <button
                type="button"
                onClick={() => setEditorLang("ar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  editorLang === "ar"
                    ? "bg-[#485c36] text-white shadow-md border border-[#f3a5a1]/40"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title="تعديل المحتوى باللغة العربية"
              >
                <span>🇸🇦 العربية</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorLang("en")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  editorLang === "en"
                    ? "bg-[#485c36] text-white shadow-md border border-[#f3a5a1]/40"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
                title="Edit content in English"
              >
                <span>🇬🇧 English</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="px-6 py-2 bg-[#f4f1e6] border-b border-[#e2e8c0] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {[
              { id: "story", labelAr: "قصة المستحضر", labelEn: "Clinical Story", icon: BookOpen },
              { id: "actives", labelAr: "كروت المكونات الفعالة", labelEn: "Bio-Actives Cards", icon: Sparkles },
              { id: "ritual", labelAr: "بروتوكول الاستخدام", labelEn: "Ritual Phases", icon: Clock },
              { id: "inci", labelAr: "المكونات (INCI)", labelEn: "Full INCI", icon: Dna },
              { id: "signature", labelAr: "توقيع سُـلاف", labelEn: "Brand Quote", icon: Quote },
              { id: "custom_sections", labelAr: "أقسام وكروت إضافية", labelEn: "Custom Cards & Sections", icon: Plus },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#485c36] text-[#f6f9e6] shadow-xs"
                      : "text-gray-700 hover:bg-gray-200/70"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{editorLang === "ar" ? tab.labelAr : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#485c36] bg-white px-2.5 py-1 rounded-lg border border-[#e2e8c0]">
            <Globe className="w-3 h-3 text-[#485c36]" />
            <span>
              {editorLang === "ar"
                ? "أنت تقوم بتعديل: النسخة العربية 🇸🇦"
                : "Editing: English Version 🇬🇧"}
            </span>
          </div>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CLINICAL STORY */}
          {activeTab === "story" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-bold text-base text-[#1e2b18] flex items-center gap-2">
                  <span>
                    {editorLang === "ar"
                      ? "قسم قصة المستحضر وفلسفة الصياغة (بالعربية)"
                      : "Clinical Story & Formulation (English)"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {editorLang === "ar" ? "🇸🇦 عربي" : "🇬🇧 EN"}
                  </span>
                </h4>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageBuilder.storyEnabled !== false}
                    onChange={(e) => setPageBuilder({ ...pageBuilder, storyEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#485c36] focus:ring-[#485c36]"
                  />
                  <span>{editorLang === "ar" ? "تفعيل وإظهار هذا القسم" : "Enable Section"}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {editorLang === "ar" ? "شارة القسم العلوية (Badge)" : "Section Badge (English)"}
                  </label>
                  <input
                    type="text"
                    value={
                      editorLang === "ar"
                        ? pageBuilder.storyBadgeAr || ""
                        : pageBuilder.storyBadgeEn || ""
                    }
                    onChange={(e) =>
                      setPageBuilder({
                        ...pageBuilder,
                        [editorLang === "ar" ? "storyBadgeAr" : "storyBadgeEn"]: e.target.value,
                      })
                    }
                    placeholder={
                      editorLang === "ar"
                        ? "فلسفة الترميم السريري"
                        : "Clinical Philosophy & Origin"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {editorLang === "ar" ? "عنوان القصة الرئيسي (Title)" : "Story Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={
                      editorLang === "ar"
                        ? pageBuilder.storyTitleAr || ""
                        : pageBuilder.storyTitleEn || ""
                    }
                    onChange={(e) =>
                      setPageBuilder({
                        ...pageBuilder,
                        [editorLang === "ar" ? "storyTitleAr" : "storyTitleEn"]: e.target.value,
                      })
                    }
                    placeholder={
                      editorLang === "ar"
                        ? "قصة المستحضر: ترميم هيكلي، بدون احتكاك"
                        : "The Story: Structural Restoration, Not Friction"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {editorLang === "ar"
                    ? "فقرات قصة المستحضر السريرية (بالعربية)"
                    : "Story Clinical Paragraphs (English)"}
                </label>
                {(editorLang === "ar"
                  ? pageBuilder.storyParagraphs || []
                  : pageBuilder.storyParagraphsEn || []
                ).map((p, idx) => (
                  <div key={idx} className="mb-3 flex items-start gap-2">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        if (editorLang === "ar") {
                          const updated = [...(pageBuilder.storyParagraphs || [])];
                          updated[idx] = e.target.value;
                          setPageBuilder({ ...pageBuilder, storyParagraphs: updated });
                        } else {
                          const updated = [...(pageBuilder.storyParagraphsEn || [])];
                          updated[idx] = e.target.value;
                          setPageBuilder({ ...pageBuilder, storyParagraphsEn: updated });
                        }
                      }}
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium leading-relaxed focus:outline-none focus:border-[#485c36]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editorLang === "ar") {
                          const updated = (pageBuilder.storyParagraphs || []).filter((_, i) => i !== idx);
                          setPageBuilder({ ...pageBuilder, storyParagraphs: updated });
                        } else {
                          const updated = (pageBuilder.storyParagraphsEn || []).filter((_, i) => i !== idx);
                          setPageBuilder({ ...pageBuilder, storyParagraphsEn: updated });
                        }
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                      title={editorLang === "ar" ? "حذف الفقرة" : "Delete paragraph"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    if (editorLang === "ar") {
                      setPageBuilder({
                        ...pageBuilder,
                        storyParagraphs: [
                          ...(pageBuilder.storyParagraphs || []),
                          "فقرة توضيحية إضافية عن المستحضر.",
                        ],
                      });
                    } else {
                      setPageBuilder({
                        ...pageBuilder,
                        storyParagraphsEn: [
                          ...(pageBuilder.storyParagraphsEn || []),
                          "Additional clinical explanation for this product.",
                        ],
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold text-gray-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editorLang === "ar" ? "إضافة فقرة جديدة" : "Add Paragraph"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BIO-ACTIVES CARDS */}
          {activeTab === "actives" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h4 className="font-bold text-base text-[#1e2b18] flex items-center gap-2">
                    <span>
                      {editorLang === "ar"
                        ? "كروت المكونات الفعالة والهندسة الجزيئية (بالعربية)"
                        : "Bio-Actives Cards & Molecular Architecture (English)"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {editorLang === "ar" ? "🇸🇦 عربي" : "🇬🇧 EN"}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    {editorLang === "ar"
                      ? "يمكنك إضافة كروت مخصصة لكل مركب فعال، وإذا كانت فارغة ستعرض كرات اللؤلؤ التفاعلية الافتراضية."
                      : "Add custom ingredient cards, or leave empty to use 3D interactive pearl orbs."}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageBuilder.activesEnabled !== false}
                    onChange={(e) => setPageBuilder({ ...pageBuilder, activesEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#485c36] focus:ring-[#485c36]"
                  />
                  <span>{editorLang === "ar" ? "تفعيل وإظهار هذا القسم" : "Enable Section"}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {editorLang === "ar" ? "عنوان قسم المكونات" : "Actives Section Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={
                      editorLang === "ar"
                        ? pageBuilder.activesTitleAr || ""
                        : pageBuilder.activesTitleEn || ""
                    }
                    onChange={(e) =>
                      setPageBuilder({
                        ...pageBuilder,
                        [editorLang === "ar" ? "activesTitleAr" : "activesTitleEn"]: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {editorLang === "ar" ? "وصف القسم المختصر" : "Subtitle / Description (English)"}
                  </label>
                  <input
                    type="text"
                    value={
                      editorLang === "ar"
                        ? pageBuilder.activesSubtitleAr || ""
                        : pageBuilder.activesSubtitleEn || ""
                    }
                    onChange={(e) =>
                      setPageBuilder({
                        ...pageBuilder,
                        [editorLang === "ar" ? "activesSubtitleAr" : "activesSubtitleEn"]: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                  />
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">
                    {editorLang === "ar"
                      ? `قائمة كروت المكونات (${pageBuilder.activesCards?.length || 0}):`
                      : `Actives Cards (${pageBuilder.activesCards?.length || 0}):`}
                  </span>
                  <button
                    type="button"
                    onClick={addActiveCard}
                    className="px-3.5 py-1.5 rounded-xl bg-[#485c36] text-[#f6f9e6] text-xs font-bold flex items-center gap-1.5 hover:bg-[#34482f] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{editorLang === "ar" ? "+ إضافة كارت مكون جديد" : "+ Add Active Card"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(pageBuilder.activesCards || []).map((card, idx) => (
                    <div
                      key={card.id || idx}
                      className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center font-mono font-bold text-xs text-gray-700">
                          {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeActiveCard(idx)}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                            {editorLang === "ar" ? "اسم المكون (عربي)" : "Active Name (English)"}
                          </label>
                          <input
                            type="text"
                            value={editorLang === "ar" ? card.titleAr : card.titleEn || ""}
                            onChange={(e) => {
                              const updated = [...(pageBuilder.activesCards || [])];
                              if (editorLang === "ar") {
                                updated[idx].titleAr = e.target.value;
                              } else {
                                updated[idx].titleEn = e.target.value;
                              }
                              setPageBuilder({ ...pageBuilder, activesCards: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                            {editorLang === "ar" ? "التركيز (مثل: 30% Urea)" : "Concentration (e.g. 30% Urea)"}
                          </label>
                          <input
                            type="text"
                            value={card.concentration || ""}
                            onChange={(e) => {
                              const updated = [...(pageBuilder.activesCards || [])];
                              updated[idx].concentration = e.target.value;
                              setPageBuilder({ ...pageBuilder, activesCards: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#485c36]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                          {editorLang === "ar"
                            ? "شرح الميكانيزم والتأثير السريري (عربي)"
                            : "Mechanism & Clinical Effect (English)"}
                        </label>
                        <textarea
                          rows={2}
                          value={editorLang === "ar" ? card.descAr || "" : card.descEn || ""}
                          onChange={(e) => {
                            const updated = [...(pageBuilder.activesCards || [])];
                            if (editorLang === "ar") {
                              updated[idx].descAr = e.target.value;
                            } else {
                              updated[idx].descEn = e.target.value;
                            }
                            setPageBuilder({ ...pageBuilder, activesCards: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#485c36]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RITUAL STEPS */}
          {activeTab === "ritual" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-bold text-base text-[#1e2b18] flex items-center gap-2">
                  <span>
                    {editorLang === "ar"
                      ? "بروتوكول وطقس الاستخدام (بالعربية)"
                      : "Application Protocol & Phases (English)"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {editorLang === "ar" ? "🇸🇦 عربي" : "🇬🇧 EN"}
                  </span>
                </h4>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageBuilder.ritualEnabled !== false}
                    onChange={(e) => setPageBuilder({ ...pageBuilder, ritualEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#485c36] focus:ring-[#485c36]"
                  />
                  <span>{editorLang === "ar" ? "تفعيل وإظهار هذا القسم" : "Enable Section"}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {editorLang === "ar" ? "عنوان البروتوكول" : "Protocol Title (English)"}
                  </label>
                  <input
                    type="text"
                    value={
                      editorLang === "ar"
                        ? pageBuilder.ritualTitleAr || ""
                        : pageBuilder.ritualTitleEn || ""
                    }
                    onChange={(e) =>
                      setPageBuilder({
                        ...pageBuilder,
                        [editorLang === "ar" ? "ritualTitleAr" : "ritualTitleEn"]: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {editorLang === "ar" ? "الوصف المختصر" : "Subtitle (English)"}
                  </label>
                  <input
                    type="text"
                    value={
                      editorLang === "ar"
                        ? pageBuilder.ritualSubtitleAr || ""
                        : pageBuilder.ritualSubtitleEn || ""
                    }
                    onChange={(e) =>
                      setPageBuilder({
                        ...pageBuilder,
                        [editorLang === "ar" ? "ritualSubtitleAr" : "ritualSubtitleEn"]: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                  />
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">
                    {editorLang === "ar"
                      ? `خطوات التطبيق (${pageBuilder.ritualSteps?.length || 0}):`
                      : `Ritual Steps (${pageBuilder.ritualSteps?.length || 0}):`}
                  </span>
                  <button
                    type="button"
                    onClick={addRitualStep}
                    className="px-3.5 py-1.5 rounded-xl bg-[#485c36] text-[#f6f9e6] text-xs font-bold flex items-center gap-1.5 hover:bg-[#34482f] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{editorLang === "ar" ? "+ إضافة خطوة جديدة" : "+ Add Step"}</span>
                  </button>
                </div>

                {pageBuilder.ritualSteps?.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-start gap-4"
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#485c36] text-[#f6f9e6] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-1">
                      {step.stepNum || idx + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder={editorLang === "ar" ? "عنوان الخطوة" : "Step Title (English)"}
                        value={editorLang === "ar" ? step.titleAr : step.titleEn || ""}
                        onChange={(e) => {
                          const updated = [...(pageBuilder.ritualSteps || [])];
                          if (editorLang === "ar") {
                            updated[idx].titleAr = e.target.value;
                          } else {
                            updated[idx].titleEn = e.target.value;
                          }
                          setPageBuilder({ ...pageBuilder, ritualSteps: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#485c36]"
                      />
                      <textarea
                        rows={2}
                        placeholder={
                          editorLang === "ar"
                            ? "شرح الخطوة وطريقة التطبيق"
                            : "Step Instructions & Application (English)"
                        }
                        value={editorLang === "ar" ? step.descAr : step.descEn || ""}
                        onChange={(e) => {
                          const updated = [...(pageBuilder.ritualSteps || [])];
                          if (editorLang === "ar") {
                            updated[idx].descAr = e.target.value;
                          } else {
                            updated[idx].descEn = e.target.value;
                          }
                          setPageBuilder({ ...pageBuilder, ritualSteps: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#485c36]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRitualStep(idx)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 mt-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INCI & COMPOSITION */}
          {activeTab === "inci" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-bold text-base text-[#1e2b18] flex items-center gap-2">
                  <span>
                    {editorLang === "ar"
                      ? "قائمة المكونات التفصيلية الكاملة (Full INCI)"
                      : "Full INCI Composition (English)"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {editorLang === "ar" ? "🇸🇦 عربي" : "🇬🇧 EN"}
                  </span>
                </h4>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageBuilder.inciEnabled !== false}
                    onChange={(e) => setPageBuilder({ ...pageBuilder, inciEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#485c36] focus:ring-[#485c36]"
                  />
                  <span>{editorLang === "ar" ? "تفعيل وإظهار هذا القسم" : "Enable Section"}</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {editorLang === "ar" ? "عنوان القسم" : "Section Title (English)"}
                </label>
                <input
                  type="text"
                  value={
                    editorLang === "ar"
                      ? pageBuilder.inciTitleAr || ""
                      : pageBuilder.inciTitleEn || ""
                  }
                  onChange={(e) =>
                    setPageBuilder({
                      ...pageBuilder,
                      [editorLang === "ar" ? "inciTitleAr" : "inciTitleEn"]: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {editorLang === "ar"
                    ? "نص التركيبة الكيميائية الكاملة (INCI List)"
                    : "Full INCI Ingredients List"}
                </label>
                <textarea
                  rows={6}
                  value={
                    editorLang === "ar"
                      ? pageBuilder.inciContentAr || ""
                      : pageBuilder.inciContentEn || ""
                  }
                  onChange={(e) =>
                    setPageBuilder({
                      ...pageBuilder,
                      [editorLang === "ar" ? "inciContentAr" : "inciContentEn"]: e.target.value,
                    })
                  }
                  className="w-full p-3.5 rounded-xl border border-gray-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#485c36]"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SIGNATURE QUOTE */}
          {activeTab === "signature" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h4 className="font-bold text-base text-[#1e2b18] flex items-center gap-2">
                  <span>
                    {editorLang === "ar"
                      ? "توقيع وهوية سُـلاف (Brand Signature)"
                      : "Brand Signature & Philosophy (English)"}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {editorLang === "ar" ? "🇸🇦 عربي" : "🇬🇧 EN"}
                  </span>
                </h4>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageBuilder.signatureEnabled !== false}
                    onChange={(e) => setPageBuilder({ ...pageBuilder, signatureEnabled: e.target.checked })}
                    className="rounded border-gray-300 text-[#485c36] focus:ring-[#485c36]"
                  />
                  <span>{editorLang === "ar" ? "تفعيل وإظهار هذا القسم" : "Enable Section"}</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {editorLang === "ar"
                    ? "البيت الشعري / المقولة (Arabic Verse)"
                    : "Poetic Verse Calligraphy (Arabic)"}
                </label>
                <input
                  type="text"
                  value={pageBuilder.signatureArabic || ""}
                  onChange={(e) => setPageBuilder({ ...pageBuilder, signatureArabic: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-amiri font-bold focus:outline-none focus:border-[#485c36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {editorLang === "ar"
                    ? "الترجمة الإنجليزية للبيت الشعري"
                    : "English Translation of Verse"}
                </label>
                <input
                  type="text"
                  value={pageBuilder.signatureTranslation || ""}
                  onChange={(e) => setPageBuilder({ ...pageBuilder, signatureTranslation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:outline-none focus:border-[#485c36]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {editorLang === "ar" ? "المصدر / الكاتب" : "Author / Laboratories"}
                </label>
                <input
                  type="text"
                  value={pageBuilder.signatureAuthor || ""}
                  onChange={(e) => setPageBuilder({ ...pageBuilder, signatureAuthor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-none focus:border-[#485c36]"
                />
              </div>
            </div>
          )}

          {/* TAB 6: CUSTOM SECTIONS & CARDS BUILDER */}
          {activeTab === "custom_sections" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 flex-wrap gap-3">
                <div>
                  <h4 className="font-bold text-base text-[#1e2b18] flex items-center gap-2">
                    <span>
                      {editorLang === "ar"
                        ? "إضافة أقسام وكروت وبلوكات مخصصة جديدة"
                        : "Add Custom Cards & Sections"}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {editorLang === "ar" ? "🇸🇦 عربي" : "🇬🇧 EN"}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    {editorLang === "ar"
                      ? "يمكنك إضافة أي عدد من الأقسام المخصصة (كروت مميزات، أسئلة وأجوبة، صورة ونص، أو بانر ترويجي) بعد أول قسم للمنتج."
                      : "Add custom sections (feature cards, FAQs, media/text, banners) specifically for this product."}
                  </p>
                </div>

                {/* Add Section Type Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addCustomSection("cards")}
                    className="px-3 py-1.5 rounded-xl bg-[#485c36] text-[#f6f9e6] text-xs font-bold flex items-center gap-1.5 hover:bg-[#34482f] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{editorLang === "ar" ? "+ شبكة كروت" : "+ Feature Cards"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addCustomSection("faq")}
                    className="px-3 py-1.5 rounded-xl bg-amber-800 text-[#f6f9e6] text-xs font-bold flex items-center gap-1.5 hover:bg-amber-900 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{editorLang === "ar" ? "+ أسئلة وأجوبة" : "+ Product FAQ"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addCustomSection("mediaText")}
                    className="px-3 py-1.5 rounded-xl bg-[#1e2b18] text-[#f6f9e6] text-xs font-bold flex items-center gap-1.5 hover:bg-black cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{editorLang === "ar" ? "+ صورة ونص" : "+ Media Split"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addCustomSection("banner")}
                    className="px-3 py-1.5 rounded-xl bg-[#610b0d] text-[#f6f9e6] text-xs font-bold flex items-center gap-1.5 hover:bg-[#4a080a] cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{editorLang === "ar" ? "+ بانر ترويجي" : "+ Banner"}</span>
                  </button>
                </div>
              </div>

              {/* Custom Sections List */}
              {(!pageBuilder.customSections || pageBuilder.customSections.length === 0) ? (
                <div className="p-8 rounded-3xl bg-white border-2 border-dashed border-gray-200 text-center space-y-2">
                  <Layers className="w-10 h-10 text-gray-400 mx-auto" />
                  <h5 className="font-bold text-sm text-gray-800">
                    {editorLang === "ar" ? "لم تقم بإضافة أقسام أو كروت مخصصة بعد" : "No Custom Sections Added Yet"}
                  </h5>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {editorLang === "ar"
                      ? "اضغط على أحد الأزرار بالأعلى لإضافة شبكة كروت جديدة أو أسئلة شائعة تظهر في صفحة هذا المنتج."
                      : "Click one of the buttons above to append custom cards or FAQs to this product page."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageBuilder.customSections.map((section, sIdx) => (
                    <div
                      key={section.id}
                      className="p-5 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-4"
                    >
                      {/* Section Header Controls */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700">
                            #{sIdx + 1}
                          </span>
                          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-[#485c36]/10 text-[#485c36] uppercase font-mono">
                            {section.type}
                          </span>
                          <span className="font-bold text-sm text-[#1e2b18]">
                            {editorLang === "ar" ? section.titleAr : section.titleEn || section.titleAr}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={sIdx === 0}
                            onClick={() => moveCustomSection(sIdx, "up")}
                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                            title={editorLang === "ar" ? "تحريك لأعلى" : "Move up"}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={sIdx === pageBuilder.customSections!.length - 1}
                            onClick={() => moveCustomSection(sIdx, "down")}
                            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                            title={editorLang === "ar" ? "تحريك لأسفل" : "Move down"}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <label className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold cursor-pointer ms-2">
                            <input
                              type="checkbox"
                              checked={section.enabled !== false}
                              onChange={(e) => {
                                const list = [...(pageBuilder.customSections || [])];
                                list[sIdx].enabled = e.target.checked;
                                setPageBuilder({ ...pageBuilder, customSections: list });
                              }}
                              className="rounded border-gray-300 text-[#485c36]"
                            />
                            <span>{editorLang === "ar" ? "مفعل" : "Active"}</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeCustomSection(section.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer ms-2"
                            title={editorLang === "ar" ? "حذف القسم" : "Delete section"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Section Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            {editorLang === "ar" ? "عنوان القسم" : "Section Title (English)"}
                          </label>
                          <input
                            type="text"
                            value={editorLang === "ar" ? section.titleAr : section.titleEn || ""}
                            onChange={(e) => {
                              const list = [...(pageBuilder.customSections || [])];
                              if (editorLang === "ar") {
                                list[sIdx].titleAr = e.target.value;
                              } else {
                                list[sIdx].titleEn = e.target.value;
                              }
                              setPageBuilder({ ...pageBuilder, customSections: list });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#485c36]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            {editorLang === "ar" ? "الشارة العلوية (Badge)" : "Badge (English)"}
                          </label>
                          <input
                            type="text"
                            value={editorLang === "ar" ? section.badgeAr || "" : section.badgeEn || ""}
                            onChange={(e) => {
                              const list = [...(pageBuilder.customSections || [])];
                              if (editorLang === "ar") {
                                list[sIdx].badgeAr = e.target.value;
                              } else {
                                list[sIdx].badgeEn = e.target.value;
                              }
                              setPageBuilder({ ...pageBuilder, customSections: list });
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#485c36]"
                          />
                        </div>
                      </div>

                      {/* If cards or faq */}
                      {(section.type === "cards" || section.type === "faq") && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-700">
                              {section.type === "cards"
                                ? (editorLang === "ar" ? "الكروت الداخلية:" : "Inner Cards:")
                                : (editorLang === "ar" ? "الأسئلة والأجوبة:" : "Questions & Answers:")}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...(pageBuilder.customSections || [])];
                                const cards = list[sIdx].cards || [];
                                cards.push({
                                  id: `c-${Date.now()}`,
                                  titleAr: section.type === "cards" ? "عنوان الكارت الجديد" : "سؤال جديد حول المستحضر؟",
                                  titleEn: section.type === "cards" ? "New Card Title" : "New Question About Product?",
                                  descAr: section.type === "cards" ? "شرح تفصيلي للميزة أو النتيجة السريرية." : "إجابة طبية واضحة ومباشرة.",
                                  descEn: section.type === "cards" ? "Detailed explanation of clinical benefit." : "Direct clinical response.",
                                  concentration: section.type === "cards" ? "ميزة" : undefined,
                                });
                                list[sIdx].cards = cards;
                                setPageBuilder({ ...pageBuilder, customSections: list });
                              }}
                              className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>
                                {section.type === "cards"
                                  ? (editorLang === "ar" ? "+ كارت جديد" : "+ Add Card")
                                  : (editorLang === "ar" ? "+ سؤال جديد" : "+ Add Question")}
                              </span>
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(section.cards || []).map((cardItem, cIdx) => (
                              <div
                                key={cardItem.id || cIdx}
                                className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-start gap-3"
                              >
                                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                                  {cIdx + 1}
                                </span>
                                <div className="flex-1 space-y-1.5">
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder={
                                        editorLang === "ar"
                                          ? "العنوان أو السؤال (عربي)"
                                          : "Title or Question (English)"
                                      }
                                      value={editorLang === "ar" ? cardItem.titleAr : cardItem.titleEn || ""}
                                      onChange={(e) => {
                                        const list = [...(pageBuilder.customSections || [])];
                                        if (editorLang === "ar") {
                                          list[sIdx].cards![cIdx].titleAr = e.target.value;
                                        } else {
                                          list[sIdx].cards![cIdx].titleEn = e.target.value;
                                        }
                                        setPageBuilder({ ...pageBuilder, customSections: list });
                                      }}
                                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#485c36]"
                                    />
                                    {section.type === "cards" && (
                                      <input
                                        type="text"
                                        placeholder="تركيز / شارة"
                                        value={cardItem.concentration || ""}
                                        onChange={(e) => {
                                          const list = [...(pageBuilder.customSections || [])];
                                          list[sIdx].cards![cIdx].concentration = e.target.value;
                                          setPageBuilder({ ...pageBuilder, customSections: list });
                                        }}
                                        className="w-24 px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#485c36]"
                                      />
                                    )}
                                  </div>
                                  <textarea
                                    rows={2}
                                    placeholder={
                                      editorLang === "ar"
                                        ? "الشرح أو الإجابة (عربي)"
                                        : "Description or Answer (English)"
                                    }
                                    value={editorLang === "ar" ? cardItem.descAr || "" : cardItem.descEn || ""}
                                    onChange={(e) => {
                                      const list = [...(pageBuilder.customSections || [])];
                                      if (editorLang === "ar") {
                                        list[sIdx].cards![cIdx].descAr = e.target.value;
                                      } else {
                                        list[sIdx].cards![cIdx].descEn = e.target.value;
                                      }
                                      setPageBuilder({ ...pageBuilder, customSections: list });
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#485c36]"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = [...(pageBuilder.customSections || [])];
                                    list[sIdx].cards = list[sIdx].cards!.filter((_, i) => i !== cIdx);
                                    setPageBuilder({ ...pageBuilder, customSections: list });
                                  }}
                                  className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* If mediaText or banner */}
                      {(section.type === "mediaText" || section.type === "banner") && (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              {editorLang === "ar" ? "نص المحتوى (عربي)" : "Content Text (English)"}
                            </label>
                            <textarea
                              rows={3}
                              value={editorLang === "ar" ? section.contentAr || "" : section.contentEn || ""}
                              onChange={(e) => {
                                const list = [...(pageBuilder.customSections || [])];
                                if (editorLang === "ar") {
                                  list[sIdx].contentAr = e.target.value;
                                } else {
                                  list[sIdx].contentEn = e.target.value;
                                }
                                setPageBuilder({ ...pageBuilder, customSections: list });
                              }}
                              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#485c36]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                                {editorLang === "ar" ? "نص الزر (اختياري)" : "Button Text (English)"}
                              </label>
                              <input
                                type="text"
                                placeholder={editorLang === "ar" ? "اطلبي الآن" : "Order Now"}
                                value={editorLang === "ar" ? section.buttonTextAr || "" : section.buttonTextEn || ""}
                                onChange={(e) => {
                                  const list = [...(pageBuilder.customSections || [])];
                                  if (editorLang === "ar") {
                                    list[sIdx].buttonTextAr = e.target.value;
                                  } else {
                                    list[sIdx].buttonTextEn = e.target.value;
                                  }
                                  setPageBuilder({ ...pageBuilder, customSections: list });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:outline-none focus:border-[#485c36]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-600 mb-0.5">
                                {editorLang === "ar" ? "رابط الزر" : "Button Link"}
                              </label>
                              <input
                                type="text"
                                placeholder="/shop أو /checkout"
                                value={section.buttonLink || ""}
                                onChange={(e) => {
                                  const list = [...(pageBuilder.customSections || [])];
                                  list[sIdx].buttonLink = e.target.value;
                                  setPageBuilder({ ...pageBuilder, customSections: list });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-mono focus:outline-none focus:border-[#485c36]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500 font-semibold">
            {editorLang === "ar"
              ? "سيتم تطبيق كافة التعديلات والكروت المخصصة على النسختين العربية والإنجليزية فور الضغط على تطبيق."
              : "All edits and custom cards for both Arabic and English will be applied upon saving."}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {editorLang === "ar" ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-[#485c36] hover:bg-[#34482f] text-[#f6f9e6] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editorLang === "ar" ? "تطبيق وحفظ أقسام المستحضر" : "Apply & Save Sections"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
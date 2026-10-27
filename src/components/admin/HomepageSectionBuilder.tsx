"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  CustomHomepageSection,
  CustomSectionType,
  CustomSectionItem,
  HomepageSectionKey,
  SectionVisibilitySettings,
  ElementVisibilitySettings,
  CustomContentSettings,
  DEFAULT_HOMEPAGE_SECTIONS_ORDER,
} from "@/lib/settings/store-settings";
import { PageContentEditor } from "./PageContentEditor";
import {
  Sparkles,
  Layers,
  FileText,
  HelpCircle,
  Award,
  Plus,
  Trash2,
  Copy,
  Edit,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Palette,
  Package,
  Activity,
  MessageCircle,
  Globe,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface HomepageSectionBuilderProps {
  sectionsOrder: string[];
  onReorder: (newOrder: string[]) => void;
  cmsSections: SectionVisibilitySettings;
  onToggleBuiltinVisibility: (key: HomepageSectionKey, visible: boolean) => void;
  customSections: CustomHomepageSection[];
  onUpdateCustomSections: (sections: CustomHomepageSection[]) => void;
  cmsContent: CustomContentSettings;
  cmsContentEn: CustomContentSettings;
  cmsElements: ElementVisibilitySettings;
  onUpdateContent: (content: CustomContentSettings, isEn: boolean) => void;
  onUpdateElements: (elements: ElementVisibilitySettings) => void;
  adminLang: "ar" | "en";
  showToast: (msg: string, type?: "success" | "error") => void;
}

const BUILTIN_META: Partial<
  Record<
    HomepageSectionKey,
    { nameAr: string; nameEn: string; descAr: string; descEn: string; icon: any; color: string }
  >
> = {
  heroSection: {
    nameAr: "قسم الهيرو والبوابة الأندلسية وشريط الـ 4 أقواس",
    nameEn: "Hero Archway & 4 Ritual Arches Band",
    descAr: "البيت الشعري، الوصف، الأزرار، وشريط الطقوس الأخضر الداكن بالأقواس الأربعة",
    descEn: "Main archway hero, poetic verse, CTAs, and dark forest 4-arch ritual band",
    icon: Sparkles,
    color: "bg-emerald-600",
  },
  gallerySection: {
    nameAr: "معرض الـ 5 أقواس والأكثر مبيعاً وميثاق الثقة",
    nameEn: "5-Arch Gallery, Best Seller Showcase & 4 Pillars",
    descAr: "بطاقات الـ 5 أقواس، منصة الأكثر مبيعاً التفاعلية، وأعمدة ميثاق الثقة الأربعة",
    descEn: "5 arched cards, interactive best-seller mandala showcase, and 4 trust pillars",
    icon: Package,
    color: "bg-teal-600",
  },
  reviewsSection: {
    nameAr: "دفتر التجارب وتقييمات العميلات الموثقة",
    nameEn: "Verified Client Notes & Reviews",
    descAr: "عنوان وشارة قسم التقييمات وزر إضافة تجربة جديدة",
    descEn: "Reviews section badge, heading, description, and add note button",
    icon: Award,
    color: "bg-rose-600",
  },
  consultationSection: {
    nameAr: "بنر الاستشارة الصيدلانية والانطلاق",
    nameEn: "Bottom Consultation & Ritual Strip",
    descAr: "شريط ختام الصفحة مع زر التسوق وزر استشارة الصيدلي عبر واتساب",
    descEn: "Bottom call-to-action strip with Shop Now and WhatsApp Pharmacist buttons",
    icon: MessageCircle,
    color: "bg-green-600",
  },
};

const SECTION_TEMPLATES: {
  type: CustomSectionType;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: any;
  defaultBadgeAr: string;
  defaultTitleAr: string;
  defaultDescAr: string;
  hasItems: boolean;
  itemLabelAr: string;
}[] = [
  {
    type: "banner",
    titleAr: "بانر إعلاني / هيرو مخصص",
    titleEn: "Promotional Banner / Hero",
    descAr: "بانر عريض ملفت للأنظار مع صورة خلفية وعنوان جذاب وزر شراء مباشر",
    descEn: "Full-width engaging banner with CTA button and optional background image",
    icon: Sparkles,
    defaultBadgeAr: "عرض خاص ومحدود",
    defaultTitleAr: "اكتشفي سر الترميم العميق مع سُـلاف",
    defaultDescAr: "عناية متكاملة ببشرتك تمتد لأعماق الخلايا بأعلى معايير الصيدلة السريرية.",
    hasItems: false,
    itemLabelAr: "",
  },
  {
    type: "features",
    titleAr: "شبكة مميزات وبطاقات",
    titleEn: "Feature Cards Grid",
    descAr: "عرض 2 إلى 4 بطاقات مميزات أو فوائد سريرية مع أيقونات وعناوين وشرح",
    descEn: "2 to 4 responsive feature cards with icons and descriptions",
    icon: Layers,
    defaultBadgeAr: "لماذا سُـلاف؟",
    defaultTitleAr: "مميزات صيدلانية استثنائية",
    defaultDescAr: "ثلاثية سريرية معتمدة تميز تركيباتنا وتمنحك أماناً ونتائج فورية.",
    hasItems: true,
    itemLabelAr: "بطاقة ميزة",
  },
  {
    type: "mediaText",
    titleAr: "استعراض وسائط وقصة (صورة + نص)",
    titleEn: "Media & Story Showcase",
    descAr: "عمودان: صورة أو فيديو بجانب قصة مقنعة للمستحضر مع زر اتخاذ إجراء",
    descEn: "Two columns: image alongside rich copy and action button",
    icon: FileText,
    defaultBadgeAr: "العلم والابتكار",
    defaultTitleAr: "دقة معملية تلتقي بفن العناية",
    defaultDescAr: "في مختبرات سُلاف، لا نساوم على نقاء المكونات النشطة وفاعليتها.",
    hasItems: false,
    itemLabelAr: "",
  },
  {
    type: "faq",
    titleAr: "أسئلة وأجوبة شائعة (Accordion)",
    titleEn: "FAQ Accordion",
    descAr: "قائمة أسئلة وأجوبة تفاعلية قابلة للطي لتبديد مخاوف العملاء وزيادة المبيعات",
    descEn: "Interactive collapsible FAQ list to address customer inquiries",
    icon: HelpCircle,
    defaultBadgeAr: "الأسئلة الأكثر شيوعاً",
    defaultTitleAr: "كل ما تودين معرفته عن مستحضراتنا",
    defaultDescAr: "إجابات أطباء الجلدية وخبراء العناية على أهم استفساراتكم.",
    hasItems: true,
    itemLabelAr: "سؤال وجواب",
  },
  {
    type: "quote",
    titleAr: "اقتباس أو شهادة راقية",
    titleEn: "Quote & Clinical Endorsement",
    descAr: "بيت شعري فخم أو شهادة سريرية مع علامة تنصيص ذهبية وخلفية ملكية",
    descEn: "Poetic verse or clinical testimonial with luxury quotation styling",
    icon: Award,
    defaultBadgeAr: "شهادة سريرية",
    defaultTitleAr: "الترميم الخلوي ليس مجرد ترطيب مؤقت، بل إعادة بناء كاملة لحاجز البشرة.",
    defaultDescAr: "د. هبة الشافعي — استشارية الأمراض الجلدية والعلاج بالليزر",
    hasItems: false,
    itemLabelAr: "",
  },
  {
    type: "richText",
    titleAr: "مقال ومحتوى حر",
    titleEn: "Rich Text Editorial",
    descAr: "مساحة لكتابة رسالة ترحيبية، إعلان، أو مقال علمي مخصص بفقرات حرة",
    descEn: "Flexible space for laboratory announcements, founder letters, or articles",
    icon: FileText,
    defaultBadgeAr: "رسالة المختبر",
    defaultTitleAr: "من وحي الأندلس إلى أحدث التقنيات",
    defaultDescAr: "نشارككم كواليس ابتكار تركيبة سُلاف والجهد البحثي الممتد لأكثر من عامين.",
    hasItems: false,
    itemLabelAr: "",
  },
];

export function HomepageSectionBuilder({
  sectionsOrder,
  onReorder,
  cmsSections,
  onToggleBuiltinVisibility,
  customSections,
  onUpdateCustomSections,
  cmsContent,
  cmsContentEn,
  cmsElements,
  onUpdateContent,
  onUpdateElements,
  adminLang,
  showToast,
}: HomepageSectionBuilderProps) {
  // State for active expanded inline editor (builtin section or custom section)
  const [activeEditorSectionId, setActiveEditorSectionId] = useState<string | null>(null);

  // State for Add Section Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSectionType, setNewSectionType] = useState<CustomSectionType>("banner");
  const [newTitleAr, setNewTitleAr] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newSubtitleAr, setNewSubtitleAr] = useState("");
  const [newBadgeAr, setNewBadgeAr] = useState("");
  const [newContentAr, setNewContentAr] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCtaTextAr, setNewCtaTextAr] = useState("");
  const [newCtaUrl, setNewCtaUrl] = useState("");
  const [newBgStyle, setNewBgStyle] = useState<"default" | "dark" | "gradient" | "glass" | "primary">("default");
  const [newItems, setNewItems] = useState<{ id: string; titleAr: string; descAr: string }[]>([]);

  // State for language being edited inside built-in inline editors
  const [editorLang, setEditorLang] = useState<"ar" | "en">("ar");

  // Reordering helpers
  function moveUp(index: number) {
    if (index <= 0) return;
    const next = [...sectionsOrder];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onReorder(next);
  }

  function moveDown(index: number) {
    if (index >= sectionsOrder.length - 1) return;
    const next = [...sectionsOrder];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onReorder(next);
  }

  // Custom Section Management
  function handleOpenAddModal(type: CustomSectionType = "banner") {
    setNewSectionType(type);
    const tpl = SECTION_TEMPLATES.find((t) => t.type === type) || SECTION_TEMPLATES[0];
    setNewTitleAr(tpl.defaultTitleAr);
    setNewTitleEn("");
    setNewSubtitleAr("");
    setNewBadgeAr(tpl.defaultBadgeAr);
    setNewContentAr(tpl.defaultDescAr);
    setNewImageUrl("");
    setNewCtaTextAr(type === "banner" || type === "mediaText" ? "اطلبي الآن" : "");
    setNewCtaUrl("/shop");
    setNewBgStyle(type === "banner" ? "primary" : "default");

    if (tpl.hasItems) {
      if (type === "faq") {
        setNewItems([
          { id: "1", titleAr: "متى تظهر نتائج كريم سُـلاف على جلد الوزة؟", descAr: "تبدأ النعومة الفورية من أول تطبيق، وتتحسن الخشونة بنسبة تفوق 90% خلال أول 7 إلى 10 أيام من الاستخدام المنتظم." },
          { id: "2", titleAr: "هل يناسب المستحضر البشرة الحساسة المعرضة للالتهاب؟", descAr: "نعم، التركيبة خالية تماماً من الكورتيزون والبارابين والعطور، ومدعمة بالسيراميدات المرممة لحاجز الجلد." },
        ]);
      } else {
        setNewItems([
          { id: "1", titleAr: "30% يوريا نقية", descAr: "تقشير تناضحي فائق النعومة يذيب التراكمات القرنية دون أي تهيج." },
          { id: "2", titleAr: "ترميم سيراميدي ثلاثي", descAr: "بناء حاجز الحماية الدهني لمنع انتكاس الجفاف مجدداً." },
          { id: "3", titleAr: "نقاء دوائي معتمد", descAr: "معايير صيدلانية أوروبية مطابقة لأعلى متطلبات الأمان." },
        ]);
      }
    } else {
      setNewItems([]);
    }

    setIsAddModalOpen(true);
  }

  function handleSaveNewSection() {
    if (!newTitleAr.trim()) {
      showToast(adminLang === "ar" ? "يرجى كتابة عنوان للقسم الجديد." : "Please enter a section title.", "error");
      return;
    }

    const newSecId = `custom-sec-${Date.now()}`;
    const newSection: CustomHomepageSection = {
      id: newSecId,
      type: newSectionType,
      titleAr: newTitleAr.trim(),
      titleEn: newTitleEn.trim() || undefined,
      subtitleAr: newSubtitleAr.trim() || undefined,
      badgeAr: newBadgeAr.trim() || undefined,
      contentAr: newContentAr.trim() || undefined,
      imageUrl: newImageUrl.trim() || undefined,
      ctaTextAr: newCtaTextAr.trim() || undefined,
      ctaUrl: newCtaUrl.trim() || undefined,
      bgStyle: newBgStyle,
      isVisible: true,
      items: newItems.length > 0 ? newItems.map((item) => ({
        id: item.id || `item-${Date.now()}-${Math.random()}`,
        titleAr: item.titleAr,
        descAr: item.descAr,
      })) : undefined,
      createdAt: Date.now(),
    };

    const updatedCustom = [...customSections, newSection];
    onUpdateCustomSections(updatedCustom);

    // Place section right before consultation section or at end
    const consultationIndex = sectionsOrder.indexOf("consultationSection");
    const updatedOrder = [...sectionsOrder];
    if (consultationIndex !== -1) {
      updatedOrder.splice(consultationIndex, 0, newSecId);
    } else {
      updatedOrder.push(newSecId);
    }
    onReorder(updatedOrder);

    setIsAddModalOpen(false);
    showToast(adminLang === "ar" ? `تمت إضافة قسم "${newTitleAr}" بنجاح للواجهة الرئيسية ✓` : "Section added to homepage successfully ✓");
  }

  function handleDeleteCustomSection(secId: string) {
    if (!confirm(adminLang === "ar" ? "هل أنت متأكد من رغبتك في حذف هذا القسم المخصص نهائياً؟" : "Are you sure you want to delete this custom section?")) return;
    const updatedCustom = customSections.filter((s) => s.id !== secId);
    const updatedOrder = sectionsOrder.filter((id) => id !== secId);
    onUpdateCustomSections(updatedCustom);
    onReorder(updatedOrder);
    if (activeEditorSectionId === secId) setActiveEditorSectionId(null);
    showToast(adminLang === "ar" ? "تم حذف القسم بنجاح." : "Section deleted successfully.");
  }

  function handleDuplicateCustomSection(sec: CustomHomepageSection) {
    const cloneId = `custom-sec-${Date.now()}`;
    const clone: CustomHomepageSection = {
      ...sec,
      id: cloneId,
      titleAr: `${sec.titleAr} (نسخة مكررة)`,
      createdAt: Date.now(),
    };
    const updatedCustom = [...customSections, clone];
    const secIndex = sectionsOrder.indexOf(sec.id);
    const updatedOrder = [...sectionsOrder];
    if (secIndex !== -1) {
      updatedOrder.splice(secIndex + 1, 0, cloneId);
    } else {
      updatedOrder.push(cloneId);
    }
    onUpdateCustomSections(updatedCustom);
    onReorder(updatedOrder);
    showToast(adminLang === "ar" ? "تم تكرار القسم بنجاح ✓" : "Section duplicated successfully ✓");
  }

  function handleToggleCustomVisibility(secId: string) {
    const updated = customSections.map((s) => {
      if (s.id === secId) return { ...s, isVisible: !s.isVisible };
      return s;
    });
    onUpdateCustomSections(updated);
  }

  function handleUpdateCustomField(secId: string, field: keyof CustomHomepageSection, val: any) {
    const updated = customSections.map((s) => {
      if (s.id === secId) return { ...s, [field]: val };
      return s;
    });
    onUpdateCustomSections(updated);
  }

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & ADD SECTION TRIGGER */}
      <div className="bg-gradient-to-r from-[#2f3d23] via-[#3d502d] to-[#25321b] text-[#f6f9e6] p-6 sm:p-8 rounded-3xl shadow-md border border-[#d4af37]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#f3e5ab] text-xs font-bold border border-[#d4af37]/40">
            <Sliders className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{adminLang === "ar" ? "منشئ ومحرر أقسام الواجهة الرئيسية" : "Homepage Sections Builder & Visual Editors"}</span>
          </div>
          <h3 className="font-amiri text-2xl sm:text-3xl font-bold text-white">
            {adminLang === "ar" ? "تحكم كامل بكل قسم وإضافة أقسام جديدة بحرية" : "Full Control & Custom Sections Builder"}
          </h3>
          <p className="font-cairo text-xs sm:text-sm text-white/80 max-w-2xl">
            {adminLang === "ar"
              ? "لكل قسم في الصفحة الرئيسية محرر مخصص ومستقل لتعديل كافة نصوصه وصوره. يمكنك أيضاً إضافة أقسام مخصصة جديدة (بانرات، أسئلة شائعة، بطاقات مميزات، اقتباسات) وترتيبها بنقرة واحدة."
              : "Each section features a dedicated editor for its copy and media. You can also append new custom sections and reorder them effortlessly."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenAddModal("banner")}
            className="px-5 py-3 rounded-2xl bg-[#ca384a] hover:bg-[#a82637] text-white font-bold font-cairo text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{adminLang === "ar" ? "+ إضافة قسم جديد للصفحة الرئيسية" : "+ Add New Section"}</span>
          </button>
        </div>
      </div>

      {/* 2. QUICK TEMPLATE PRESET BUTTONS */}
      <div className="bg-white p-4 rounded-2xl border border-[#dbe2bd] shadow-xs flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-gray-500 whitespace-nowrap px-2">
          {adminLang === "ar" ? "قوالب سريعة للإضافة:" : "Quick Templates:"}
        </span>
        {SECTION_TEMPLATES.map((tpl) => {
          const TplIcon = tpl.icon;
          return (
            <button
              key={tpl.type}
              type="button"
              onClick={() => handleOpenAddModal(tpl.type)}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 hover:border-[#485c36] hover:bg-[#f6f9e6] text-[#2c3821] text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs"
            >
              <TplIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{adminLang === "ar" ? tpl.titleAr : tpl.titleEn}</span>
            </button>
          );
        })}
      </div>

      {/* 3. UNIFIED SECTIONS LIST & DEDICATED EDITORS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#485c36]" />
            <h4 className="font-bold text-base text-[#1c2616]">
              {adminLang === "ar" ? "أقسام الصفحة الرئيسية الحالية وتدرج ظهورها:" : "Current Homepage Sections & Hierarchy:"}
            </h4>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#485c36]/15 text-[#485c36]">
              {sectionsOrder.length} {adminLang === "ar" ? "قسم" : "sections"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm(adminLang === "ar" ? "استعادة تسلسل الأقسام الافتراضي؟" : "Reset default sections sequence?")) {
                onReorder(DEFAULT_HOMEPAGE_SECTIONS_ORDER);
              }
            }}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>{adminLang === "ar" ? "استعادة الترتيب الافتراضي" : "Reset Default Sequence"}</span>
          </button>
        </div>

        {/* SECTIONS LIST */}
        <div className="space-y-3">
          {sectionsOrder.map((secId, index) => {
            const isFirst = index === 0;
            const isLast = index === sectionsOrder.length - 1;
            const isEditorOpen = activeEditorSectionId === secId;

            // A. BUILT-IN SECTION
            if (secId in BUILTIN_META) {
              const key = secId as HomepageSectionKey;
              const meta = BUILTIN_META[key]!;
              const Icon = meta.icon;
              const isVisible = (cmsSections as any)[key] !== false;

              return (
                <div
                  key={secId}
                  className={`rounded-3xl border-2 transition-all overflow-hidden ${
                    isEditorOpen
                      ? "border-[#485c36] shadow-md bg-white ring-2 ring-[#485c36]/15"
                      : isVisible
                      ? "border-[#dbe2bd] bg-white shadow-xs hover:border-[#485c36]/60"
                      : "border-gray-200 bg-gray-50/70 opacity-60"
                  }`}
                >
                  {/* CARD HEADER ROW */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-2xl bg-[#485c36] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                        #{index + 1}
                      </div>

                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-xs ${meta.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate font-cairo">
                            {adminLang === "ar" ? meta.nameAr : meta.nameEn}
                          </h4>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {adminLang === "ar" ? "قسم أساسي" : "Built-in Core"}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isVisible ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-200 text-gray-600"
                          }`}>
                            {isVisible ? (adminLang === "ar" ? "معروض بالمتجر ✓" : "Visible ✓") : (adminLang === "ar" ? "مخفي ✕" : "Hidden ✕")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5 font-cairo">
                          {adminLang === "ar" ? meta.descAr : meta.descEn}
                        </p>
                      </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
                      {/* MOVE UP / DOWN */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => moveUp(index)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-[#485c36] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                          title={adminLang === "ar" ? "تحريك لأعلى" : "Move Up"}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => moveDown(index)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-[#485c36] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                          title={adminLang === "ar" ? "تحريك لأسفل" : "Move Down"}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* TOGGLE VISIBILITY */}
                      <button
                        type="button"
                        onClick={() => onToggleBuiltinVisibility(key, !isVisible)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                          isVisible
                            ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                            : "bg-emerald-600 border-emerald-600 text-white"
                        }`}
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5 text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-white" />}
                        <span className="hidden sm:inline">{isVisible ? (adminLang === "ar" ? "إخفاء" : "Hide") : (adminLang === "ar" ? "إظهار" : "Show")}</span>
                      </button>

                      {/* OPEN DEDICATED EDITOR */}
                      <button
                        type="button"
                        onClick={() => setActiveEditorSectionId(isEditorOpen ? null : secId)}
                        className={`px-4 py-2 rounded-xl font-bold font-cairo text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isEditorOpen
                            ? "bg-[#3d502d] text-white ring-2 ring-[#3d502d]/20"
                            : "bg-[#f6f9e6] hover:bg-[#e8ecd0] text-[#3d502d] border border-[#dbe2bd]"
                        }`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>{isEditorOpen ? (adminLang === "ar" ? "إغلاق المحرر ▲" : "Close Editor ▲") : (adminLang === "ar" ? "محرر القسم المخصص ▼" : "Open Section Editor ▼")}</span>
                      </button>
                    </div>
                  </div>

                  {/* DEDICATED INLINE EDITOR ACCORDION FOR BUILT-IN SECTIONS */}
                  {isEditorOpen && (
                    <div className="border-t border-[#dbe2bd] bg-[#fafcf5] p-5 sm:p-7 space-y-6 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-gray-200 pb-3">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-[#485c36]" />
                          <h5 className="font-bold text-sm text-[#1c2616]">
                            {adminLang === "ar" ? `محرر نصوص وعناصر ${meta.nameAr}` : `Dedicated Editor: ${meta.nameEn}`}
                          </h5>
                        </div>

                        {/* Language switcher for built-in text fields */}
                        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setEditorLang("ar")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              editorLang === "ar" ? "bg-[#3d502d] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            🇸🇦 {adminLang === "ar" ? "العربية" : "Arabic"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditorLang("en")}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              editorLang === "en" ? "bg-[#3d502d] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            🇬🇧 {adminLang === "ar" ? "الإنجليزية" : "English"}
                          </button>
                        </div>
                      </div>

                      {/* EDIT FIELDS ACCORDING TO SECTION KEY */}
                      {renderBuiltinSectionFields(key, editorLang, cmsContent, cmsContentEn, cmsElements, onUpdateContent, onUpdateElements, adminLang)}
                    </div>
                  )}
                </div>
              );
            }

            // B. CUSTOM SECTION
            const customSec = customSections.find((s) => s.id === secId);
            if (!customSec) return null;

            const tpl = SECTION_TEMPLATES.find((t) => t.type === customSec.type) || SECTION_TEMPLATES[0];
            const TplIcon = tpl.icon;
            const isCustomVisible = customSec.isVisible !== false;

            return (
              <div
                key={secId}
                className={`rounded-3xl border-2 transition-all overflow-hidden ${
                  isEditorOpen
                    ? "border-[#d4af37] shadow-md bg-white ring-2 ring-[#d4af37]/20"
                    : isCustomVisible
                    ? "border-[#dbe2bd] bg-white shadow-xs hover:border-[#d4af37]/70"
                    : "border-gray-200 bg-gray-50/70 opacity-60"
                }`}
              >
                {/* CARD HEADER ROW */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-2xl bg-[#d4af37] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                      #{index + 1}
                    </div>

                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-[#d4af37]/20 text-[#aa820a] shadow-xs">
                      <TplIcon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate font-cairo">
                          {customSec.titleAr || (adminLang === "ar" ? "قسم مخصص بدون عنوان" : "Untitled Custom Section")}
                        </h4>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                          {tpl.titleAr}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCustomVisible ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-200 text-gray-600"
                        }`}>
                          {isCustomVisible ? (adminLang === "ar" ? "معروض ✓" : "Visible ✓") : (adminLang === "ar" ? "مخفي ✕" : "Hidden ✕")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5 font-cairo">
                        {customSec.subtitleAr || customSec.contentAr || tpl.descAr}
                      </p>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0 flex-wrap">
                    {/* MOVE UP / DOWN */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => moveUp(index)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-[#485c36] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        title={adminLang === "ar" ? "تحريك لأعلى" : "Move Up"}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => moveDown(index)}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-[#485c36] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        title={adminLang === "ar" ? "تحريك لأسفل" : "Move Down"}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* TOGGLE VISIBILITY */}
                    <button
                      type="button"
                      onClick={() => handleToggleCustomVisibility(secId)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                        isCustomVisible
                          ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                          : "bg-emerald-600 border-emerald-600 text-white"
                      }`}
                    >
                      {isCustomVisible ? <EyeOff className="w-3.5 h-3.5 text-gray-500" /> : <Eye className="w-3.5 h-3.5 text-white" />}
                      <span className="hidden sm:inline">{isCustomVisible ? (adminLang === "ar" ? "إخفاء" : "Hide") : (adminLang === "ar" ? "إظهار" : "Show")}</span>
                    </button>

                    {/* DUPLICATE */}
                    <button
                      type="button"
                      onClick={() => handleDuplicateCustomSection(customSec)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                      title={adminLang === "ar" ? "تكرار القسم" : "Duplicate Section"}
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomSection(secId)}
                      className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                      title={adminLang === "ar" ? "حذف القسم نهائياً" : "Delete Custom Section"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* OPEN DEDICATED EDITOR */}
                    <button
                      type="button"
                      onClick={() => setActiveEditorSectionId(isEditorOpen ? null : secId)}
                      className={`px-4 py-2 rounded-xl font-bold font-cairo text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isEditorOpen
                          ? "bg-[#d4af37] text-white ring-2 ring-[#d4af37]/20"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200"
                      }`}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>{isEditorOpen ? (adminLang === "ar" ? "إغلاق المحرر ▲" : "Close Editor ▲") : (adminLang === "ar" ? "تعديل القسم بالكامل ▼" : "Edit Section ▼")}</span>
                    </button>
                  </div>
                </div>

                {/* DEDICATED INLINE FULL EDITOR FOR CUSTOM SECTIONS */}
                {isEditorOpen && (
                  <div className="border-t border-[#dbe2bd] bg-[#fffdf8] p-5 sm:p-7 space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-2">
                        <TplIcon className="w-5 h-5 text-[#d4af37]" />
                        <h5 className="font-bold text-sm text-[#1c2616]">
                          {adminLang === "ar" ? `محرر القسم المخصص: ${tpl.titleAr}` : `Custom Section Editor: ${tpl.titleEn}`}
                        </h5>
                      </div>
                    </div>

                    {/* MAIN FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">العنوان بالعربية (Title AR) *</label>
                        <input
                          type="text"
                          value={customSec.titleAr || ""}
                          onChange={(e) => handleUpdateCustomField(secId, "titleAr", e.target.value)}
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                          dir="rtl"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">العنوان بالإنجليزية (Title EN)</label>
                        <input
                          type="text"
                          value={customSec.titleEn || ""}
                          onChange={(e) => handleUpdateCustomField(secId, "titleEn", e.target.value)}
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">الشارة العلوية (Badge AR)</label>
                        <input
                          type="text"
                          value={customSec.badgeAr || ""}
                          onChange={(e) => handleUpdateCustomField(secId, "badgeAr", e.target.value)}
                          placeholder="مثال: مميزات حصرية"
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                          dir="rtl"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">العنوان الفرعي (Subtitle AR)</label>
                        <input
                          type="text"
                          value={customSec.subtitleAr || ""}
                          onChange={(e) => handleUpdateCustomField(secId, "subtitleAr", e.target.value)}
                          placeholder="شرح موجز أو نبذة سريعة"
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                          dir="rtl"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{adminLang === "ar" ? "محتوى وتفاصيل القسم (المحرر المتطور • Rich Content)" : "Section Rich Content Editor"}</span>
                          </label>
                          <span className="text-[11px] text-gray-500">
                            {adminLang === "ar" ? "يتيح التبديل بين المحرر البسيط والمتقدم وتكبير/تصغير الخطوط وتغيير الألوان بحرية" : "Simple & Advanced modes with custom font sizes"}
                          </span>
                        </div>
                        <PageContentEditor
                          value={customSec.contentAr || ""}
                          onChange={(newHtml) => handleUpdateCustomField(secId, "contentAr", newHtml)}
                          dir="rtl"
                          placeholder={adminLang === "ar" ? "اكتبي محتوى القسم بحرية، ونسقي الخطوط والألوان بالشكل الذي يناسبك..." : "Write section content freely with rich formatting..."}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">
                            {adminLang === "ar" ? "محتوى القسم بالإنجليزية (English Rich Content - اختياري)" : "English Content (Optional)"}
                          </label>
                        </div>
                        <PageContentEditor
                          value={customSec.contentEn || ""}
                          onChange={(newHtml) => handleUpdateCustomField(secId, "contentEn", newHtml)}
                          dir="ltr"
                          placeholder="Write English section content..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">رابط صورة القسم (Image URL)</label>
                        <input
                          type="text"
                          value={customSec.imageUrl || ""}
                          onChange={(e) => handleUpdateCustomField(secId, "imageUrl", e.target.value)}
                          placeholder="/brand/hero-banner.jpg أو رابط خارجي"
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">أسلوب ولون الخلفية (Background Style)</label>
                        <select
                          value={customSec.bgStyle || "default"}
                          onChange={(e) => handleUpdateCustomField(secId, "bgStyle", e.target.value)}
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                        >
                          <option value="default">الافتراضي (كريمي سُلاف الفاتح #f6f9e6)</option>
                          <option value="dark">داكن أندلسي فاخر (Dark Luxury)</option>
                          <option value="primary">اللون الرئيسي للبراند (Emerald Green)</option>
                          <option value="gradient">تدرج حريري خفيف (Silky Gradient)</option>
                          <option value="glass">زجاجي ناصع مع إطار (Glass Card)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">نص زر الإجراء (CTA Button Text)</label>
                        <input
                          type="text"
                          value={customSec.ctaTextAr || ""}
                          onChange={(e) => handleUpdateCustomField(secId, "ctaTextAr", e.target.value)}
                          placeholder="مثال: اطلبي الآن"
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                          dir="rtl"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">رابط الزر (CTA Button URL)</label>
                        <input
                          type="text"
                          value={customSec.ctaUrl || ""}
                          onChange={(e) => handleUpdateCustomField(secId, "ctaUrl", e.target.value)}
                          placeholder="/shop أو /product/absolutes-smoothing-body-cream"
                          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    {/* ITEMS EDITOR (For FAQ or Features) */}
                    {(customSec.type === "faq" || customSec.type === "features") && (
                      <div className="pt-4 border-t border-gray-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h6 className="font-bold text-xs text-gray-800">
                            {customSec.type === "faq" ? "قائمة الأسئلة والأجوبة (FAQ Items):" : "بطاقات المميزات (Feature Cards):"}
                          </h6>
                          <button
                            type="button"
                            onClick={() => {
                              const items = customSec.items || [];
                              const newItem: CustomSectionItem = {
                                id: `item-${Date.now()}`,
                                titleAr: customSec.type === "faq" ? "سؤال جديد..." : "ميزة جديدة...",
                                descAr: customSec.type === "faq" ? "الإجابة التوضيحية للسؤال..." : "شرح وتفاصيل الميزة...",
                              };
                              handleUpdateCustomField(secId, "items", [...items, newItem]);
                            }}
                            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{customSec.type === "faq" ? "إضافة سؤال" : "إضافة بطاقة"}</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {(customSec.items || []).map((item, itmIdx) => (
                            <div key={item.id || itmIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[10px] font-bold text-gray-400">#{itmIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (customSec.items || []).filter((_, i) => i !== itmIdx);
                                    handleUpdateCustomField(secId, "items", next);
                                  }}
                                  className="text-rose-500 hover:text-rose-700 text-xs cursor-pointer"
                                >
                                  حذف
                                </button>
                              </div>
                              <input
                                type="text"
                                value={item.titleAr}
                                onChange={(e) => {
                                  const next = [...(customSec.items || [])];
                                  next[itmIdx] = { ...next[itmIdx], titleAr: e.target.value };
                                  handleUpdateCustomField(secId, "items", next);
                                }}
                                placeholder={customSec.type === "faq" ? "نص السؤال..." : "عنوان البطاقة..."}
                                className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 focus:outline-none focus:border-[#485c36]"
                                dir="rtl"
                              />
                              <textarea
                                rows={2}
                                value={item.descAr || ""}
                                onChange={(e) => {
                                  const next = [...(customSec.items || [])];
                                  next[itmIdx] = { ...next[itmIdx], descAr: e.target.value };
                                  handleUpdateCustomField(secId, "items", next);
                                }}
                                placeholder={customSec.type === "faq" ? "نص الإجابة..." : "شرح البطاقة..."}
                                className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 focus:outline-none focus:border-[#485c36]"
                                dir="rtl"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MODAL: ADD NEW CUSTOM SECTION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#dbe2bd] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#2f3d23] text-white flex items-center justify-between">
              <div>
                <h4 className="font-amiri text-xl font-bold">
                  {adminLang === "ar" ? "إضافة قسم جديد مخصص للصفحة الرئيسية" : "Add New Custom Homepage Section"}
                </h4>
                <p className="font-cairo text-xs text-white/80 mt-0.5">
                  {adminLang === "ar" ? "اختر قالب القسم وحدد نصوصه وأزراره لإدراجه فورياً بالواجهة" : "Select section template and customize its copy"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Template Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800">1. اختر نوع وقالب القسم:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SECTION_TEMPLATES.map((tpl) => {
                    const TIcon = tpl.icon;
                    const isSelected = newSectionType === tpl.type;
                    return (
                      <button
                        key={tpl.type}
                        type="button"
                        onClick={() => {
                          setNewSectionType(tpl.type);
                          setNewTitleAr(tpl.defaultTitleAr);
                          setNewBadgeAr(tpl.defaultBadgeAr);
                          setNewContentAr(tpl.defaultDescAr);
                          if (tpl.hasItems) {
                            if (tpl.type === "faq") {
                              setNewItems([
                                { id: "1", titleAr: "متى تظهر نتائج كريم سُـلاف على جلد الوزة؟", descAr: "تبدأ النعومة الفورية من أول تطبيق، وتتحسن الخشونة بنسبة تفوق 90% خلال 7 إلى 10 أيام." },
                                { id: "2", titleAr: "هل يناسب البشرة الحساسة؟", descAr: "نعم، التركيبة صيدلانية نقية خالية من الكورتيزون والعطور." },
                              ]);
                            } else {
                              setNewItems([
                                { id: "1", titleAr: "30% يوريا نقية", descAr: "تقشير تناضحي عميق يذيب التراكمات المتصلبة." },
                                { id: "2", titleAr: "ترميم سيراميدي ثلاثي", descAr: "إعادة بناء كاملة لحاجز الجلد الدهني." },
                              ]);
                            }
                          } else {
                            setNewItems([]);
                          }
                        }}
                        className={`p-3 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#485c36] bg-[#f6f9e6] shadow-xs"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <TIcon className={`w-5 h-5 mb-2 ${isSelected ? "text-[#485c36]" : "text-[#d4af37]"}`} />
                        <div>
                          <p className="font-bold font-cairo text-xs text-gray-900">{tpl.titleAr}</p>
                          <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{tpl.descAr}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-800">2. تخصيص النصوص والصور:</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">عنوان القسم الرئيسي (Title AR) *</label>
                    <input
                      type="text"
                      value={newTitleAr}
                      onChange={(e) => setNewTitleAr(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36]"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">الشارة العلوية (Badge AR)</label>
                    <input
                      type="text"
                      value={newBadgeAr}
                      onChange={(e) => setNewBadgeAr(e.target.value)}
                      placeholder="مثال: مميزات حصرية"
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36]"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">العنوان الفرعي (Subtitle AR)</label>
                    <input
                      type="text"
                      value={newSubtitleAr}
                      onChange={(e) => setNewSubtitleAr(e.target.value)}
                      placeholder="شرح موجز أو تعليق"
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36]"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">النص التفصيلي أو الشرح (المحرر المتطور • Rich Content)</label>
                    <PageContentEditor
                      value={newContentAr}
                      onChange={(newHtml) => setNewContentAr(newHtml)}
                      dir="rtl"
                      placeholder="اكتبي نص أو محتوى القسم الجديد بحرية..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">نص زر التوجيه (CTA Text)</label>
                    <input
                      type="text"
                      value={newCtaTextAr}
                      onChange={(e) => setNewCtaTextAr(e.target.value)}
                      placeholder="اطلبي الآن"
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36]"
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">رابط الزر (CTA URL)</label>
                    <input
                      type="text"
                      value={newCtaUrl}
                      onChange={(e) => setNewCtaUrl(e.target.value)}
                      placeholder="/shop"
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36]"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-700">أسلوب الخلفية (Background Style)</label>
                    <select
                      value={newBgStyle}
                      onChange={(e: any) => setNewBgStyle(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 focus:outline-none focus:border-[#485c36]"
                    >
                      <option value="default">الافتراضي (كريمي سُلاف الفاتح #f6f9e6)</option>
                      <option value="dark">داكن أندلسي فاخر (Dark Luxury)</option>
                      <option value="primary">اللون الرئيسي للبراند (Emerald Green)</option>
                      <option value="gradient">تدرج حريري خفيف (Silky Gradient)</option>
                      <option value="glass">زجاجي ناصع مع إطار (Glass Card)</option>
                    </select>
                  </div>
                </div>

                {/* Sub items (for FAQ or Features) */}
                {newItems.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">
                        {newSectionType === "faq" ? "عناصر الأسئلة والأجوبة:" : "بطاقات المميزات:"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewItems([...newItems, { id: `${Date.now()}`, titleAr: "عنصر جديد", descAr: "تفاصيل العنصر..." }])}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة عنصر</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {newItems.map((item, idx) => (
                        <div key={item.id || idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-gray-400">#{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => setNewItems(newItems.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:text-rose-700 text-xs cursor-pointer"
                            >
                              حذف
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.titleAr}
                            onChange={(e) => {
                              const next = [...newItems];
                              next[idx] = { ...next[idx], titleAr: e.target.value };
                              setNewItems(next);
                            }}
                            placeholder="العنوان أو السؤال..."
                            className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-gray-200 bg-white"
                            dir="rtl"
                          />
                          <textarea
                            rows={2}
                            value={item.descAr}
                            onChange={(e) => {
                              const next = [...newItems];
                              next[idx] = { ...next[idx], descAr: e.target.value };
                              setNewItems(next);
                            }}
                            placeholder="الشرح أو الإجابة..."
                            className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white"
                            dir="rtl"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {adminLang === "ar" ? "إلغاء" : "Cancel"}
              </button>

              <button
                type="button"
                onClick={handleSaveNewSection}
                className="px-6 py-2.5 rounded-xl bg-[#485c36] hover:bg-[#3d502d] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{adminLang === "ar" ? "إضافة القسم للواجهة فوراً ✓" : "Add Section to Homepage ✓"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// HELPER: RENDER BUILT-IN SECTION FIELDS ACCORDING TO SPECIFIC SECTION KEY
function renderBuiltinSectionFields(
  key: HomepageSectionKey,
  lang: "ar" | "en",
  content: CustomContentSettings,
  contentEn: CustomContentSettings,
  elements: ElementVisibilitySettings,
  onUpdateContent: (c: CustomContentSettings, isEn: boolean) => void,
  onUpdateElements: (e: ElementVisibilitySettings) => void,
  adminLang: "ar" | "en"
) {
  const isEn = lang === "en";
  const current = isEn ? contentEn : content;

  const updateField = (field: keyof CustomContentSettings, val: string) => {
    onUpdateContent({ ...current, [field]: val }, isEn);
  };

  const toggleElement = (elKey: keyof ElementVisibilitySettings) => {
    onUpdateElements({ ...elements, [elKey]: !elements[elKey] });
  };

  // 1. HERO SECTION + RITUAL 4 ARCHES
  if (key === "heroSection") {
    return (
      <div className="space-y-6">
        <div>
          <h6 className="text-xs font-bold text-[#485c36] mb-3 pb-1.5 border-b border-gray-200">
            {isEn ? "Part 1: Top Sunlit Archway Hero" : "أولاً: الهيرو العلوي (البوابة الأندلسية والقصيدة)"}
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              label={isEn ? "Top Micro Heritage Label" : "السطر التراثي الصغير أعلى الشارة"}
              value={current.heroHeritageText || ""}
              onChange={(v) => updateField("heroHeritageText", v)}
              placeholder={isEn ? "Andalusian Heritage × Pharmaceutical Science" : "أصالة التراث العربي × دقة العلم الصيدلاني"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Hero Badge Tag" : "الشارة السريرية العلوية (Hero Badge)"}
              value={current.heroBadgeText || ""}
              onChange={(v) => updateField("heroBadgeText", v)}
              placeholder={isEn ? "Where Pharmaceutical Science Meets Beauty." : "حيث يلتقي العلم الصيدلاني بالجمال"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Poem Line 1" : "شطر البيت الأول (Hero Poem 1)"}
              value={current.heroPoemLine1 || ""}
              onChange={(v) => updateField("heroPoemLine1", v)}
              placeholder={isEn ? "Whatever gentle care heals us, Sulaf is within it," : "ما كان في رِفقٍ يُداوينا سُلافُ به"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Poem Line 2" : "شطر البيت الثاني (Hero Poem 2)"}
              value={current.heroPoemLine2 || ""}
              onChange={(v) => updateField("heroPoemLine2", v)}
              placeholder={isEn ? "Transforming into beauty that never fades." : "إلّا تحوّل حُسنًا لا ينهزمُ"}
              isEn={isEn}
            />
            <div className="md:col-span-2">
              <FieldInput
                label={isEn ? "Hero Subheading / Clinical Description" : "الوصف السريري المفصل (Hero Subheading)"}
                value={current.heroSubheading || ""}
                onChange={(v) => updateField("heroSubheading", v)}
                placeholder={isEn ? "Born from Arab identity and the poetic soul of Andalusia..." : "من عبق الهوية العربية، وسحر الروح الأندلسية، وُلدت سُلاف..."}
                isRichEditor
                isEn={isEn}
              />
            </div>
            <FieldInput
              label={isEn ? "Primary Order Button Text" : "نص زر الطلب الأساسي (Primary CTA)"}
              value={current.heroPrimaryCtaText || ""}
              onChange={(v) => updateField("heroPrimaryCtaText", v)}
              placeholder={isEn ? "Order Your Jar Now" : "اطلبي عبوتك الآن"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Secondary Explore Button Text" : "نص زر الاستكشاف الثانوي (Secondary CTA)"}
              value={current.heroSecondaryCtaText || ""}
              onChange={(v) => updateField("heroSecondaryCtaText", v)}
              placeholder={isEn ? "Explore Philosophy" : "اكتشفي الفلسفة الصيدلانية"}
              isEn={isEn}
            />
          </div>
        </div>

        <div>
          <h6 className="text-xs font-bold text-[#485c36] mb-3 pb-1.5 border-b border-gray-200">
            {isEn ? "Part 2: Dark Forest Ritual Band & 4 Arches" : "ثانياً: الشريط الأخضر الداكن (طقوس سُلاف والـ 4 أقواس)"}
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              label={isEn ? "Ritual Badge" : "شارة قسم الطقوس"}
              value={current.ritualBadgeText || ""}
              onChange={(v) => updateField("ritualBadgeText", v)}
              placeholder={isEn ? "OUR RITUAL" : "طقوس سُـلاف السريرية"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Ritual Main Heading" : "العنوان الرئيسي للشريط الأخضر"}
              value={current.ritualHeadingText || ""}
              onChange={(v) => updateField("ritualHeadingText", v)}
              placeholder={isEn ? "Andalusian Beauty Meets Clinical Dermatology" : "الجمال الأندلسي يلتقي بالطب السريري"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Ritual Heading Rose Accent" : "السطر الوردي المائل تحت العنوان"}
              value={current.ritualHeadingAccent || ""}
              onChange={(v) => updateField("ritualHeadingAccent", v)}
              placeholder={isEn ? "" : "برفقٍ لا ينهزم."}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Ritual Guide Link Text" : "نص رابط دليل الاستخدام"}
              value={current.ritualLinkText || ""}
              onChange={(v) => updateField("ritualLinkText", v)}
              placeholder={isEn ? "Discover the Ritual" : "دليل الاستخدام السريري"}
              isEn={isEn}
            />
            <div className="md:col-span-2">
              <FieldInput
                label={isEn ? "Ritual Description" : "وصف قسم الطقوس"}
                value={current.ritualDescText || ""}
                onChange={(v) => updateField("ritualDescText", v)}
                placeholder={isEn ? "Carefully crafted formulations..." : "نجمع بين المعرفة الصيدلانية وفهم احتياجات البشرة..."}
                isTextarea
                isEn={isEn}
              />
            </div>

            <FieldInput
              label={isEn ? "Arch 01 Title" : "عنوان القوس 01"}
              value={current.ritualArch1Title || ""}
              onChange={(v) => updateField("ritualArch1Title", v)}
              placeholder={isEn ? "30% PURE UREA" : "جرعة سريرية مركزة"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Arch 01 Description" : "وصف القوس 01"}
              value={current.ritualArch1Desc || ""}
              onChange={(v) => updateField("ritualArch1Desc", v)}
              placeholder={isEn ? "30% Pure Urea + 2% Medical Salicylic Acid" : "30% يوريا نقية + 2% حمض الساليسيليك الطبي"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Arch 02 Title" : "عنوان القوس 02"}
              value={current.ritualArch2Title || ""}
              onChange={(v) => updateField("ritualArch2Title", v)}
              placeholder={isEn ? "BARRIER REPAIR" : "إصلاح الحاجز الجلدي"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Arch 02 Description" : "وصف القوس 02"}
              value={current.ritualArch2Desc || ""}
              onChange={(v) => updateField("ritualArch2Desc", v)}
              placeholder={isEn ? "Phyto-ceramides & ammonium lactate" : "مدعم بالسيراميدات النباتية ولاكتات الأمونيوم"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Arch 03 Title" : "عنوان القوس 03"}
              value={current.ritualArch3Title || ""}
              onChange={(v) => updateField("ritualArch3Title", v)}
              placeholder={isEn ? "SILKY ABSORPTION" : "امتصاص حريري فوري"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Arch 03 Description" : "وصف القوس 03"}
              value={current.ritualArch3Desc || ""}
              onChange={(v) => updateField("ritualArch3Desc", v)}
              placeholder={isEn ? "Non-greasy finish tailored for warm climates" : "قوام غير دهني مصمم خصيصاً للأجواء العربية"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Arch 04 Title" : "عنوان القوس 04"}
              value={current.ritualArch4Title || ""}
              onChange={(v) => updateField("ritualArch4Title", v)}
              placeholder={isEn ? "7-DAY SILK RESET" : "نتائج من اليوم السابع"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Arch 04 Description" : "وصف القوس 04"}
              value={current.ritualArch4Desc || ""}
              onChange={(v) => updateField("ritualArch4Desc", v)}
              placeholder={isEn ? "Eliminate keratosis pilaris & severe roughness" : "القضاء الجذري على مظهر جلد الوزة والخشونة المتصلبة"}
              isEn={isEn}
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. GALLERY SECTION (5 Arches + Best Seller + 4 Trust Pillars)
  if (key === "gallerySection") {
    return (
      <div className="space-y-6">
        <div>
          <h6 className="text-xs font-bold text-[#485c36] mb-3 pb-1.5 border-b border-gray-200">
            {isEn ? "Part 1: 5-Arch Collection Header & Cards" : "أولاً: معرض الـ 5 أقواس وعناوين البطاقات"}
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              label={isEn ? "Gallery Badge" : "شارة المعرض (Gallery Badge)"}
              value={current.galleryBadgeText || ""}
              onChange={(v) => updateField("galleryBadgeText", v)}
              placeholder={isEn ? "Sulaf Clinical Collection" : "مجموعة سُلاف العلاجية"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Gallery Heading" : "عنوان المعرض (Heading)"}
              value={current.galleryHeadingText || ""}
              onChange={(v) => updateField("galleryHeadingText", v)}
              placeholder={isEn ? "Crafted for Skin Perfection" : "تركيبات صيدلانية مصممة بعناية"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Gallery Description" : "نبذة المعرض (Description)"}
              value={current.galleryDescText || ""}
              onChange={(v) => updateField("galleryDescText", v)}
              placeholder={isEn ? "Explore our clinical formulations..." : "نجمع بين المعرفة الصيدلانية، وفهم احتياجات البشرة..."}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "View All Link Text" : "نص رابط تصفح جميع المنتجات"}
              value={current.galleryViewAllText || ""}
              onChange={(v) => updateField("galleryViewAllText", v)}
              placeholder={isEn ? "Browse All Products" : "تصفح جميع المنتجات"}
              isEn={isEn}
            />

            <FieldInput label={isEn ? "Arch 01 Title" : "عنوان القوس 01"} value={current.arch1Title || ""} onChange={(v) => updateField("arch1Title", v)} placeholder={isEn ? "Cleansers" : "بلسم التنظيف"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 01 Subtitle" : "وصف القوس 01"} value={current.arch1Sub || ""} onChange={(v) => updateField("arch1Sub", v)} placeholder={isEn ? "Purify & refresh" : "تنقية وإذابة الشوائب"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 02 Title" : "عنوان القوس 02"} value={current.arch2Title || ""} onChange={(v) => updateField("arch2Title", v)} placeholder={isEn ? "Serums" : "إكسير الحاجز"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 02 Subtitle" : "وصف القوس 02"} value={current.arch2Sub || ""} onChange={(v) => updateField("arch2Sub", v)} placeholder={isEn ? "Targeted solutions" : "ترميم مركز بالسيراميد"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 03 Title" : "عنوان القوس 03"} value={current.arch3Title || ""} onChange={(v) => updateField("arch3Title", v)} placeholder={isEn ? "Moisturizers" : "كريمات اليوريا 30%"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 03 Subtitle" : "وصف القوس 03"} value={current.arch3Sub || ""} onChange={(v) => updateField("arch3Sub", v)} placeholder={isEn ? "Nourish & restore" : "علاج جلد الوزة والخشونة"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 04 Title" : "عنوان القوس 04"} value={current.arch4Title || ""} onChange={(v) => updateField("arch4Title", v)} placeholder={isEn ? "Treatments" : "العلاجات المركزة"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 04 Subtitle" : "وصف القوس 04"} value={current.arch4Sub || ""} onChange={(v) => updateField("arch4Sub", v)} placeholder={isEn ? "Advanced care" : "عناية سريرية متطورة"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 05 Title" : "عنوان القوس 05"} value={current.arch5Title || ""} onChange={(v) => updateField("arch5Title", v)} placeholder={isEn ? "Toners" : "تونر الأحماض"} isEn={isEn} />
            <FieldInput label={isEn ? "Arch 05 Subtitle" : "وصف القوس 05"} value={current.arch5Sub || ""} onChange={(v) => updateField("arch5Sub", v)} placeholder={isEn ? "Balance & prepare" : "توازن وتجديد المسام"} isEn={isEn} />
          </div>
        </div>

        <div>
          <h6 className="text-xs font-bold text-[#485c36] mb-3 pb-1.5 border-b border-gray-200">
            {isEn ? "Part 2: Best Seller Mandala Showcase & 4 Trust Pillars" : "ثانياً: منصة الأكثر مبيعاً وشريط ميثاق الثقة (4 أعمدة)"}
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              label={isEn ? "Best Seller Badge" : "شارة قسم الأكثر مبيعاً"}
              value={current.bestSellerBadgeText || ""}
              onChange={(v) => updateField("bestSellerBadgeText", v)}
              placeholder={isEn ? "BEST SELLER" : "الأكثر مبيعاً واعتماداً"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Best Seller Side Quote" : "البيت الشعري/الاقتباس الجانبي في الأكثر مبيعاً"}
              value={current.bestSellerQuoteText || ""}
              onChange={(v) => updateField("bestSellerQuoteText", v)}
              placeholder={isEn ? "Whatever gentle care heals us..." : "ما كان في رِفقٍ يُداوينا سُلافُ به.. إلّا تحوّل حُسنًا لا ينهزمُ"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Trust Strip Badge" : "شارة ميثاق الثقة"}
              value={current.diffBadgeText || ""}
              onChange={(v) => updateField("diffBadgeText", v)}
              placeholder={isEn ? "THE SULAF DIFFERENCE" : "ميثاق الثقة في سُـلاف"}
              isEn={isEn}
            />
            <FieldInput
              label={isEn ? "Trust Strip Heading" : "عنوان ميثاق الثقة"}
              value={current.diffHeadingText || ""}
              onChange={(v) => updateField("diffHeadingText", v)}
              placeholder={isEn ? "More Than Skincare. A Lasting Ritual." : "حيث يلتقي العلم الصيدلاني بالجمال."}
              isEn={isEn}
            />
            <FieldInput label={isEn ? "Pillar 1 Title" : "عنوان العمود 1"} value={current.diff1Title || ""} onChange={(v) => updateField("diff1Title", v)} placeholder={isEn ? "Premium Ingredients" : "جرعة سريرية مركزة"} isEn={isEn} />
            <FieldInput label={isEn ? "Pillar 1 Desc" : "وصف العمود 1"} value={current.diff1Desc || ""} onChange={(v) => updateField("diff1Desc", v)} placeholder={isEn ? "Naturally sourced, carefully selected." : "30% يوريا نقية + 2% حمض الساليسيليك الطبي"} isEn={isEn} />
            <FieldInput label={isEn ? "Pillar 2 Title" : "عنوان العمود 2"} value={current.diff2Title || ""} onChange={(v) => updateField("diff2Title", v)} placeholder={isEn ? "Dermatologically Tested" : "امتصاص حريري فوري"} isEn={isEn} />
            <FieldInput label={isEn ? "Pillar 2 Desc" : "وصف العمود 2"} value={current.diff2Desc || ""} onChange={(v) => updateField("diff2Desc", v)} placeholder={isEn ? "Safe, effective, and skin-friendly." : "قوام غير دهني مصمم خصيصاً للأجواء العربية"} isEn={isEn} />
            <FieldInput label={isEn ? "Pillar 3 Title" : "عنوان العمود 3"} value={current.diff3Title || ""} onChange={(v) => updateField("diff3Title", v)} placeholder={isEn ? "Heritage Inspired" : "إصلاح الحاجز الجلدي"} isEn={isEn} />
            <FieldInput label={isEn ? "Pillar 3 Desc" : "وصف العمود 3"} value={current.diff3Desc || ""} onChange={(v) => updateField("diff3Desc", v)} placeholder={isEn ? "Centuries of wisdom, modernized." : "مدعم بالسيراميدات النباتية ولاكتات الأمونيوم"} isEn={isEn} />
            <FieldInput label={isEn ? "Pillar 4 Title" : "عنوان العمود 4"} value={current.diff4Title || ""} onChange={(v) => updateField("diff4Title", v)} placeholder={isEn ? "Real Results" : "معاينة العبوة قبل الدفع"} isEn={isEn} />
            <FieldInput label={isEn ? "Pillar 4 Desc" : "وصف العمود 4"} value={current.diff4Desc || ""} onChange={(v) => updateField("diff4Desc", v)} placeholder={isEn ? "Healthier skin, lasting confidence." : "شحن فوري مؤمن لجميع المحافظات مع حق المعاينة."} isEn={isEn} />
          </div>
        </div>
      </div>
    );
  }

  // 3. REVIEWS SECTION
  if (key === "reviewsSection") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput
          label={isEn ? "Reviews Badge" : "شارة قسم الآراء (Badge)"}
          value={current.reviewsBadgeText || ""}
          onChange={(v) => updateField("reviewsBadgeText", v)}
          placeholder={isEn ? "CLINICAL TESTIMONIALS" : "دفتر التجارب الموثقة"}
          isEn={isEn}
        />
        <FieldInput
          label={isEn ? "Reviews Heading" : "عنوان القسم (Heading)"}
          value={current.reviewsHeadingText || ""}
          onChange={(v) => updateField("reviewsHeadingText", v)}
          placeholder={isEn ? "Verified Client Notes" : "شهادات وتجارب عميلات سُـلاف"}
          isEn={isEn}
        />
        <FieldInput
          label={isEn ? "Reviews Subtitle" : "وصف إضافي تحت العنوان (اختياري)"}
          value={current.reviewsDescText || ""}
          onChange={(v) => updateField("reviewsDescText", v)}
          placeholder={isEn ? "Verified purchaser experiences" : "تجارب حقيقية موثقة من عميلات سلاف"}
          isEn={isEn}
        />
        <FieldInput
          label={isEn ? "Write Review Button Text" : "نص زر إضافة تجربة"}
          value={current.reviewsAddBtnText || ""}
          onChange={(v) => updateField("reviewsAddBtnText", v)}
          placeholder={isEn ? "Write a Note +" : "تدوين تجربتكِ +"}
          isEn={isEn}
        />
      </div>
    );
  }

  // 4. CONSULTATION SECTION
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FieldInput
        label={isEn ? "Consultation Heading" : "عنوان شريط الانطلاق والاستشارة (Heading)"}
        value={current.consultationHeadingText || ""}
        onChange={(v) => updateField("consultationHeadingText", v)}
        placeholder={isEn ? "Your Best Skin Journey Starts Here" : "رحلتكِ نحو بشرة حريرية لا تُهزم تبدأ من هنا"}
        isEn={isEn}
      />
      <FieldInput
        label={isEn ? "Shop Now Button Text" : "نص زر التسوق الرئيسي"}
        value={current.consultationShopBtnText || ""}
        onChange={(v) => updateField("consultationShopBtnText", v)}
        placeholder={isEn ? "Shop Now" : "تسوقي الآن"}
        isEn={isEn}
      />
      <FieldInput
        label={isEn ? "WhatsApp Button Text" : "نص زر استشارة الواتساب"}
        value={current.consultationButtonText || ""}
        onChange={(v) => updateField("consultationButtonText", v)}
        placeholder={isEn ? "Chat on WhatsApp" : "تحدثي مع الصيدلي عبر واتساب"}
        isEn={isEn}
      />
      <FieldInput
        label={isEn ? "Side Micro Label 1" : "الكلمة الجانبية الأولى"}
        value={current.consultationSideLabel1 || ""}
        onChange={(v) => updateField("consultationSideLabel1", v)}
        placeholder={isEn ? "DISCOVER" : "اكتشفي"}
        isEn={isEn}
      />
      <FieldInput
        label={isEn ? "Side Micro Label 2" : "الكلمة الجانبية الثانية البارزة"}
        value={current.consultationSideLabel2 || ""}
        onChange={(v) => updateField("consultationSideLabel2", v)}
        placeholder={isEn ? "THE RITUAL" : "بروتوكول سُـلاف"}
        isEn={isEn}
      />
    </div>
  );
}

// ATOMIC HELPER FIELD
function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  isTextarea = false,
  isRichEditor = false,
  isEn = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
  isRichEditor?: boolean;
  isEn?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
        <span>{label}</span>
        {value.trim() && (
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
            معدل ✓
          </span>
        )}
      </label>
      {isRichEditor ? (
        <PageContentEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          dir={isEn ? "ltr" : "rtl"}
        />
      ) : isTextarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
          dir={isEn ? "ltr" : "rtl"}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#485c36]"
          dir={isEn ? "ltr" : "rtl"}
        />
      )}
    </div>
  );
}

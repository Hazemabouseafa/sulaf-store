"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, X, Activity, ShieldCheck, Microscope } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

export interface OrbIngredient {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  actionAr: string;
  actionEn: string;
  svgType: "urea" | "lactate" | "salicylic" | "niacinamide" | "ceramide" | "centella";
  isTrinity: boolean;
  concentration: string;
  accent: string;
}

export const CLINICAL_ACTIVES: OrbIngredient[] = [
  {
    id: "urea-30",
    name: "30% Medical-Grade Pure Urea",
    nameAr: "30% يوريا نقية بدرجة طبية سريرية",
    nameEn: "30% Medical-Grade Pure Urea",
    description: "The ultimate hydro-keratolytic agent. Dissolves hardened cellular mortar and draws hydration deep into the stratum corneum, softening calcified keratin plugs from within.",
    descriptionAr: "العامل الهيدرو-كيراتوليتي الأقوى لترميم سطح الجلد. يذيب الملاط الخلوي المتصلب ويسحب الترطيب إلى عمق الطبقة القرنية، ملينًا سدادات الكيراتين المتصلبة من جذورها دون كشط ميكانيكي.",
    descriptionEn: "The ultimate hydro-keratolytic agent. Dissolves hardened cellular mortar and draws hydration deep into the stratum corneum, softening calcified keratin plugs from within.",
    actionAr: "تليين وتفكيك الروابط الكيراتينية المفرطة وترطيب عميق حتى أعمق طبقات الأدمة.",
    actionEn: "Targeted keratolysis of calcified plugs and deep stratum corneum hydro-retention.",
    svgType: "urea",
    isTrinity: true,
    concentration: "30%",
    accent: "#485c36",
  },
  {
    id: "lactate-10",
    name: "10% Ammonium Lactate",
    nameAr: "10% أمونيوم لاكتات (ملح حمض اللاكتيك)",
    nameEn: "10% Ammonium Lactate (Lactic Acid Salt)",
    description: "A bio-identical alpha-hydroxy derivative that gently loosens micro-scales while replenishing moisture reservoirs, leaving an instantly elastic, pliant finish.",
    descriptionAr: "مشتق ألفا هيدروكسي متطابق بيولوجياً يفكك القشور الدقيقة بلطف فائق ويجدد مخازن الرطوبة الخلوية، ليمنح سطح الجلد مرونة وملمساً انسيابياً فورياً كالحرير.",
    descriptionEn: "A bio-identical alpha-hydroxy derivative that gently loosens micro-scales while replenishing moisture reservoirs, leaving an instantly elastic, pliant finish.",
    actionAr: "تسريع التقشير الفسيولوجي واستعادة مرونة أنسجة الجلد دون أي وخز أو تحسس.",
    actionEn: "Physiological cellular renewal and epidermal elasticity without irritation.",
    svgType: "lactate",
    isTrinity: true,
    concentration: "10%",
    accent: "#d4af37",
  },
  {
    id: "salicylic-2",
    name: "2% Lipophilic Salicylic Acid (BHA)",
    nameAr: "2% حمض الساليسيليك المنشط حيوياً (BHA)",
    nameEn: "2% Bioactive Lipophilic Salicylic Acid (BHA)",
    description: "Penetrates straight into the lipid-dense follicular funnel, dissolving trapped sebum, loosening the stubborn plug at its anchor point, and smoothing out rough bumps.",
    descriptionAr: "حمض بيتا هيدروكسي محب للدهون يتغلغل مباشرة داخل قمع بصيلات الشعر الغنية بالدهون، ليذيب الزهم المحتجز ويفكك السدادة الصلبة من نقطة ارتكازها، مما يقضي على احمرار ونتوءات جلد الوزة.",
    descriptionEn: "Penetrates straight into the lipid-dense follicular funnel, dissolving trapped sebum, loosening the stubborn plug at its anchor point, and smoothing out rough bumps.",
    actionAr: "تنقية عميقة لدهون البصيلات ومضاد سريري للاحمرار والالتهاب حول منابت الشعر.",
    actionEn: "Deep follicular sebum dissolution and anti-inflammatory erythema clearing.",
    svgType: "salicylic",
    isTrinity: true,
    concentration: "2%",
    accent: "#610b0d",
  },
  {
    id: "niacinamide-5",
    name: "5% Pure Niacinamide (Vitamin B3)",
    nameAr: "5% نياسيناميد نقي (فيتامين B3)",
    nameEn: "5% Pure Niacinamide (Vitamin B3)",
    description: "Intercepts post-inflammatory redness, clears follicular shadowing, and fortifies the cellular envelope.",
    descriptionAr: "يمنع الاحمرار والالتهاب ما بعد التقشير، ويوحد لون البشرة عبر تفتيح التصبغات والظلال حول البصيلات، ويعزز بناء الغلاف الخلوي الواقي.",
    descriptionEn: "Intercepts post-inflammatory redness, clears follicular shadowing, and fortifies the cellular envelope.",
    actionAr: "تهدئة الاحمرار وتفتيح التصبغات الناتجة عن التهاب البصيلات وتقوية جدار الخلايا.",
    actionEn: "Calms post-inflammatory redness and clears stubborn follicular pigmentation.",
    svgType: "niacinamide",
    isTrinity: false,
    concentration: "5%",
    accent: "#3a4b2b",
  },
  {
    id: "ceramides-triad",
    name: "Biomimetic Ceramide Triad (NP, AP, EOP) + Phytosphingosine",
    nameAr: "ثلاثية السيراميدات المتطابقة بيولوجياً (NP, AP, EOP) + فيتوسفينجوزين",
    nameEn: "Biomimetic Ceramide Triad (NP, AP, EOP) + Phytosphingosine",
    description: "Restores the physiological lipid mortar, rebuilding the barrier as active exfoliation takes place to prevent rebound keratosis.",
    descriptionAr: "يعيد بناء الملاط الدهني الفسيولوجي للحاجز الواقي أثناء عملية التقشير، لمنع عودة الخشونة (Rebound Keratosis) وحبس الرطوبة لأكثر من 48 ساعة.",
    descriptionEn: "Restores the physiological lipid mortar, rebuilding the barrier as active exfoliation takes place to prevent rebound keratosis.",
    actionAr: "ترميم إسمنت الدهون الطبيعي بين الخلايا وحبس الترطيب ومنع تبخر الماء الفسيولوجي (TEWL).",
    actionEn: "Reconstructs intercellular lipid cement and guarantees long-term TEWL defense.",
    svgType: "ceramide",
    isTrinity: false,
    concentration: "Triad",
    accent: "#aa820a",
  },
  {
    id: "centella-allantoin",
    name: "Centella Asiatica (Madecassoside) & Allantoin",
    nameAr: "خلاصة السنتيللا الآسيوية (ماديكاسوسايد) والألانتوين النقي",
    nameEn: "Centella Asiatica (Madecassoside) & Pure Allantoin",
    description: "Quenches perifollicular heat, calming irritation and cocooning sensitized skin in soothing relief.",
    descriptionAr: "يخمد الحرارة والاحتقان حول بصيلات الجلد، ويهدئ التحسس فورياً ليغلف البشرة في درع حريري من الراحة والشفاء المتأني.",
    descriptionEn: "Quenches perifollicular heat, calming irritation and cocooning sensitized skin in soothing relief.",
    actionAr: "تسكين فوري للبشرة المتهيجة ودعم ترميم الأنسجة الدقيقة وتلطيف الاحمرار والشد.",
    actionEn: "Instant soothing of irritated skin and immediate cellular comfort cocooning.",
    svgType: "centella",
    isTrinity: false,
    concentration: "Bio-Calm",
    accent: "#ca384a",
  },
];

export function MoleculeSvg({ type }: { type: string }) {
  if (type === "urea") {
    return (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-[#485c36]">
        <line x1="40" y1="18" x2="40" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="44" y1="18" x2="44" y2="38" stroke="currentColor" strokeWidth="2" strokeDasharray="3,2" strokeLinecap="round" />
        <circle cx="42" cy="15" r="5" fill="#ca384a" opacity="0.9" />
        <circle cx="42" cy="42" r="5" fill="#485c36" />
        <line x1="42" y1="42" x2="22" y2="58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="42" y1="42" x2="62" y2="58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="60" r="5" fill="#d4af37" />
        <circle cx="64" cy="60" r="5" fill="#d4af37" />
      </svg>
    );
  }

  if (type === "lactate") {
    return (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-[#d4af37]">
        <polyline points="20,55 38,40 56,52 70,35" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="38" y1="40" x2="38" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="38" cy="20" r="4.5" fill="#ca384a" />
        <line x1="56" y1="52" x2="56" y2="68" stroke="currentColor" strokeWidth="2" strokeDasharray="2,2" strokeLinecap="round" />
        <circle cx="56" cy="70" r="4" fill="#485c36" />
        <circle cx="20" cy="55" r="4.5" fill="#d4af37" />
      </svg>
    );
  }

  if (type === "salicylic") {
    return (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-[#610b0d]">
        <polygon
          points="40,16 62,28 62,52 40,64 18,52 18,28"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <circle cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4,2" fill="none" />
        <line x1="62" y1="28" x2="72" y2="22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="72" cy="22" r="4" fill="#d4af37" />
        <line x1="40" y1="64" x2="40" y2="74" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="40" cy="74" r="4" fill="#ca384a" />
      </svg>
    );
  }

  if (type === "niacinamide") {
    return (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-[#3a4b2b]">
        <polygon
          points="40,16 62,28 62,52 40,64 18,52 18,28"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="28" r="4.5" fill="#ca384a" />
        <line x1="62" y1="52" x2="72" y2="58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="72" cy="58" r="4" fill="#d4af37" />
      </svg>
    );
  }

  if (type === "ceramide") {
    return (
      <svg viewBox="0 0 80 80" className="w-12 h-12 text-[#aa820a]">
        <path
          d="M15,60 Q28,25 40,40 T65,20"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M18,68 Q31,33 43,48 T68,28"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4,2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="40" cy="40" r="5" fill="#485c36" />
        <circle cx="15" cy="60" r="4" fill="#ca384a" />
        <circle cx="65" cy="20" r="4.5" fill="#d4af37" />
      </svg>
    );
  }

  // Centella / Allantoin
  return (
    <svg viewBox="0 0 80 80" className="w-12 h-12 text-[#ca384a]">
      <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="3,3" />
      <path
        d="M40,20 C30,32 30,48 40,60 C50,48 50,32 40,20 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="#ca384a"
        fillOpacity="0.2"
      />
      <circle cx="40" cy="40" r="4" fill="#d4af37" />
    </svg>
  );
}

export function PearlOrbs({
  className = "",
  isRtl,
}: {
  className?: string;
  isRtl?: boolean;
}) {
  const { isArabic: langIsArabic, dir } = useLanguage();
  const isArabic = isRtl !== undefined ? isRtl : langIsArabic;

  const [activeOrb, setActiveOrb] = useState<OrbIngredient | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const trinityOrbs = CLINICAL_ACTIVES.filter((o) => o.isTrinity);
  const secondaryOrbs = CLINICAL_ACTIVES.filter((o) => !o.isTrinity);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full py-8 select-none perspective-[1200px] ${className}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#485c36]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main 3D Container */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="max-w-6xl mx-auto px-4 space-y-10"
      >
        {/* Row 1: The Triple Clinical Complex (Large Orbs) */}
        <div>
          <div className="text-center mb-6">
            <span className="text-xs font-bold font-cairo uppercase tracking-widest text-[#610b0d] bg-[#610b0d]/10 px-4 py-1.5 rounded-full border border-[#610b0d]/20 shadow-xs">
              {isArabic
                ? "المركب الثلاثي السريري • The Triple Clinical Complex"
                : "The Triple Clinical Complex (Core Actives)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trinityOrbs.map((orb, index) => (
              <motion.div
                key={orb.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.18 }}
                whileHover={{ scale: 1.04, y: -6 }}
                onClick={() => setActiveOrb(orb)}
                className="group relative cursor-pointer flex flex-col items-center text-center p-5 sm:p-7 rounded-2xl sm:rounded-3xl bg-white/85 backdrop-blur-md border-2 border-[#d4af37]/35 shadow-[0_12px_36px_-6px_rgba(72,92,54,0.15)] hover:shadow-[0_24px_50px_-8px_rgba(72,92,54,0.28)] transition-all duration-500"
              >
                {/* Pearl Orb Sphere Visual */}
                <div className="relative w-32 h-32 mb-5 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#f6f9e6] to-[#e4eac4] p-2 shadow-[inset_0_4px_16px_rgba(255,255,255,0.95),0_14px_30px_rgba(72,92,54,0.18)] ring-2 ring-[#d4af37]/40 group-hover:ring-[#d4af37]/90 transition-all duration-500">
                  <div className="absolute top-2 left-4 w-10 h-5 rounded-full bg-white/95 blur-[1px] transform -rotate-45 pointer-events-none" />
                  <div className="absolute bottom-3 right-5 w-5 h-2.5 rounded-full bg-[#f3a5a1]/50 blur-[1px] pointer-events-none" />

                  <div className="relative z-10 transition-transform duration-500 group-hover:scale-115">
                    <MoleculeSvg type={orb.svgType} />
                  </div>
                </div>

                {/* Concentration Badge */}
                <span className="font-cormorant text-3xl font-bold tracking-tight text-[#485c36] group-hover:text-[#610b0d] transition-colors">
                  {orb.concentration}
                </span>

                {/* Ingredient Name */}
                <h4 className="mt-2 font-cairo text-base font-bold text-[#1c2616]">
                  {isArabic ? orb.nameAr : orb.nameEn}
                </h4>

                {/* Description */}
                <p className="mt-2 text-xs text-gray-700 font-cairo leading-relaxed line-clamp-3">
                  {isArabic ? orb.descriptionAr : orb.descriptionEn}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isArabic ? "فحص الميكانيزم الجزيئي" : "Inspect Mechanism"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Row 2: Secondary Key Actives (Smaller Orbs) */}
        <div>
          <div className="text-center mb-6">
            <span className="text-xs font-bold font-cairo uppercase tracking-widest text-[#485c36] bg-[#485c36]/10 px-4 py-1.5 rounded-full border border-[#485c36]/20 shadow-xs">
              {isArabic
                ? "المركبات السريرية الداعمة لترميم الحاجز • Key Secondary Actives"
                : "Barrier Fortification & Secondary Clinical Actives"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {secondaryOrbs.map((orb, index) => (
              <motion.div
                key={orb.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
                onClick={() => setActiveOrb(orb)}
                className="group relative cursor-pointer flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md border border-[#e2e8c0] shadow-md hover:shadow-xl transition-all duration-400"
              >
                {/* Secondary Orb Sphere */}
                <div className="relative w-20 sm:w-24 h-20 sm:h-24 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#f7f9ee] to-[#dfe5be] p-2 shadow-[inset_0_3px_10px_rgba(255,255,255,0.9),0_10px_20px_rgba(72,92,54,0.12)] ring-1 ring-[#d4af37]/30 group-hover:ring-[#d4af37]/70 transition-all">
                  <div className="absolute top-1.5 left-3 w-7 h-3 rounded-full bg-white/90 blur-[0.5px] transform -rotate-45 pointer-events-none" />
                  <div className="relative z-10 transition-transform duration-400 group-hover:scale-110">
                    <MoleculeSvg type={orb.svgType} />
                  </div>
                </div>

                <span className="font-cormorant text-2xl font-bold text-[#485c36]">
                  {orb.concentration}
                </span>

                <h4 className="mt-1 font-cairo text-sm font-bold text-[#1c2616]">
                  {isArabic ? orb.nameAr : orb.nameEn}
                </h4>

                <p className="mt-1.5 text-[11px] text-gray-700 font-cairo leading-relaxed line-clamp-3">
                  {isArabic ? orb.descriptionAr : orb.descriptionEn}
                </p>

                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#485c36] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Microscope className="w-3 h-3" />
                  <span>{isArabic ? "تفاصيل المركب" : "View Compound"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modal Popup for Selected Orb Mechanism */}
      {activeOrb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-cairo" dir={isArabic ? "rtl" : "ltr"}>
          <div className="relative w-full max-w-lg p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-[#f6f9e6] border-2 border-[#d4af37]/50 shadow-2xl text-[#1c2616] max-h-[90dvh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setActiveOrb(null)}
              className={`absolute top-4 ${isArabic ? "left-4" : "right-4"} p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors cursor-pointer`}
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[#610b0d]" />
            </button>

            <div className="flex items-center gap-4 border-b border-[#e2e8c0] pb-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner border border-[#d4af37]/30 shrink-0">
                <MoleculeSvg type={activeOrb.svgType} />
              </div>
              <div>
                <span className="font-cormorant text-xs tracking-widest uppercase text-[#610b0d] font-bold block mb-1">
                  {isArabic ? "الميكانيزم الجزيئي للمركب السريري" : "Clinical Active Mechanism"}
                </span>
                <h3 className="font-amiri text-2xl font-bold text-[#485c36]">
                  {isArabic ? activeOrb.nameAr : activeOrb.nameEn}
                </h3>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/90 border border-[#e2e8c0]">
                <Activity className="w-5 h-5 text-[#ca384a] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#610b0d] font-bold mb-1">
                    {isArabic ? "التأثير السريري والوظيفة الحيوية:" : "Clinical Action & Purpose:"}
                  </strong>
                  <p className="text-gray-900 leading-relaxed font-medium">
                    {isArabic ? activeOrb.actionAr : activeOrb.actionEn}
                  </p>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed border-t border-gray-100 pt-2">
                    {isArabic ? activeOrb.descriptionAr : activeOrb.descriptionEn}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#485c36]/10 border border-[#485c36]/20">
                <ShieldCheck className="w-5 h-5 text-[#485c36] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#485c36] font-bold mb-1">
                    {isArabic ? "معايير النقاء السريري وتحمل البشرة:" : "Purity & Tolerability Standard:"}
                  </strong>
                  <p className="text-xs text-gray-800 leading-relaxed">
                    {isArabic
                      ? "نقاء صيدلاني علاجي معتمد للقضاء على التصلب الكيراتيني وترميم حاجز الدهون الفسيولوجي دون أي كشط أو تحسس."
                      : "Medical-grade purity formulated to eliminate physical abrasion, prevent rebound keratosis, and preserve physiological epidermal lipids."}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveOrb(null)}
              className="mt-6 w-full py-3.5 rounded-2xl bg-[#485c36] hover:bg-[#3a4a2b] text-[#f6f9e6] font-bold text-sm transition-colors shadow-md cursor-pointer"
            >
              {isArabic ? "إغلاق ملف الميكانيزم" : "Close Mechanism Dossier"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

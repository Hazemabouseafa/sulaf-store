"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, Translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: "rtl" | "ltr";
  isArabic: boolean;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {},
  toggleLanguage: () => {},
  dir: "rtl",
  isArabic: true,
  t: translations.ar,
});

const STORAGE_KEY = "sulaf_selected_language_v1";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "en" || saved === "ar") {
        setLanguageState(saved);
        applyDocumentAttributes(saved);
      } else {
        applyDocumentAttributes("ar");
      }
    } catch {
      applyDocumentAttributes("ar");
    }
  }, []);

  const applyDocumentAttributes = (lang: Language) => {
    if (typeof document !== "undefined") {
      const dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
      document.cookie = `sulaf_lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    applyDocumentAttributes(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      window.dispatchEvent(new Event("sulaf_language_changed"));
    } catch (e) {
      console.error("Failed to save language preference", e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const dir = language === "ar" ? "rtl" : "ltr";
  const isArabic = language === "ar";
  const t = translations[language] || translations.ar;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        dir,
        isArabic,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

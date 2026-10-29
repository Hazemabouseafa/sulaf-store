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
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  dir: "ltr",
  isArabic: false,
  t: translations.en,
});

const STORAGE_KEY = "sulaf_lang_pref_v2";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      // Clear legacy storage keys from previous builds that locked sessions to Arabic
      localStorage.removeItem("sulaf_selected_language_v1");

      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === "ar") {
        setLanguageState("ar");
        applyDocumentAttributes("ar");
      } else {
        // Enforce English as default
        setLanguageState("en");
        applyDocumentAttributes("en");
        if (saved !== "en") {
          localStorage.setItem(STORAGE_KEY, "en");
        }
      }
    } catch {
      applyDocumentAttributes("en");
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
  const t = translations[language] || translations.en;

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

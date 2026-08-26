"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "vi" | "en";

export type TranslationValue = {
  vi: string;
  en: string;
};

export type LanguageContextValue = {
  language: Language;

  setLanguage: (language: Language) => void;

  toggleLanguage: () => void;

  /**
   * Dùng với object:
   * t({ vi: "...", en: "..." })
   */
  t: {
    (value: TranslationValue): string;
    (vi: string, en?: string): string;
  };

  /**
   * Dùng kiểu cũ:
   * tr("Tiếng Việt", "English")
   * hoặc
   * tr({ vi: "...", en: "..." })
   */
  tr: {
    (vi: string, en: string): string;
    (value: TranslationValue): string;
  };
};

const LanguageContext =
  createContext<LanguageContextValue | undefined>(
    undefined,
  );

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("vi");

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem(
        "mosguardx-language",
      );

    if (
      savedLanguage === "vi" ||
      savedLanguage === "en"
    ) {
      setLanguageState(savedLanguage);

      document.documentElement.lang =
        savedLanguage;
    }
  }, []);

  const setLanguage = (
    nextLanguage: Language,
  ) => {
    setLanguageState(nextLanguage);

    localStorage.setItem(
      "mosguardx-language",
      nextLanguage,
    );

    document.documentElement.lang =
      nextLanguage;
  };

  const toggleLanguage = () => {
    setLanguage(
      language === "vi" ? "en" : "vi",
    );
  };

  /**
   * Translation object helper
   */
  function t(value: TranslationValue): string;
  function t(vi: string, en?: string): string;

  function t(
    valueOrVi: TranslationValue | string,
    en?: string,
  ): string {
    if (typeof valueOrVi === "object") {
      return valueOrVi[language];
    }

    return language === "vi"
      ? valueOrVi
      : en ?? valueOrVi;
  }

  /**
   * Compatibility translation helper
   */
  function tr(
    vi: string,
    en: string,
  ): string;

  function tr(
    value: TranslationValue,
  ): string;

  function tr(
    viOrValue:
      | string
      | TranslationValue,
    en?: string,
  ): string {
    if (
      typeof viOrValue === "object"
    ) {
      return viOrValue[language];
    }

    return language === "vi"
      ? viOrValue
      : en ?? viOrValue;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        tr,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return context;
}
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Language = "vi" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (
    language: Language,
  ) => void;
  toggleLanguage: () => void;
  tr: (
    vietnamese: string,
    english: string,
  ) => string;
};

const STORAGE_KEY =
  "mosguardx-language";

const LANGUAGE_EVENT =
  "mosguardx-language-change";

const LanguageContext =
  createContext<
    LanguageContextValue | undefined
  >(undefined);

function subscribe(
  callback: () => void,
) {
  window.addEventListener(
    "storage",
    callback,
  );

  window.addEventListener(
    LANGUAGE_EVENT,
    callback,
  );

  return () => {
    window.removeEventListener(
      "storage",
      callback,
    );

    window.removeEventListener(
      LANGUAGE_EVENT,
      callback,
    );
  };
}

function getLanguageSnapshot(): Language {
  const storedLanguage =
    window.localStorage.getItem(
      STORAGE_KEY,
    );

  return storedLanguage === "en"
    ? "en"
    : "vi";
}

function getServerSnapshot(): Language {
  return "vi";
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const language =
    useSyncExternalStore(
      subscribe,
      getLanguageSnapshot,
      getServerSnapshot,
    );

  const setLanguage = useCallback(
    (newLanguage: Language) => {
      window.localStorage.setItem(
        STORAGE_KEY,
        newLanguage,
      );

      window.dispatchEvent(
        new Event(LANGUAGE_EVENT),
      );
    },
    [],
  );

  const toggleLanguage =
    useCallback(() => {
      setLanguage(
        language === "vi"
          ? "en"
          : "vi",
      );
    }, [language, setLanguage]);

  const tr = useCallback(
    (
      vietnamese: string,
      english: string,
    ) =>
      language === "vi"
        ? vietnamese
        : english,
    [language],
  );

  useEffect(() => {
    document.documentElement.lang =
      language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      tr,
    }),
    [
      language,
      setLanguage,
      toggleLanguage,
      tr,
    ],
  );

  return (
    <LanguageContext.Provider
      value={value}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(
    LanguageContext,
  );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider",
    );
  }

  return context;
}
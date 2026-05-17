"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { defaultLocale, locales, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./index";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
  localizedField: (item: Record<string, any>, base: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = "bp_locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && locales.includes(stored)) {
      setLocaleState(stored);
    } else {
      const navLang = navigator.language.slice(0, 2);
      if (locales.includes(navLang as Locale)) {
        setLocaleState(navLang as Locale);
      }
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = getDictionary(locale);

  const localizedField = useCallback(
    (item: Record<string, any>, base: string) => {
      const suffix =
        locale === "uk" ? "Uk" : locale === "en" ? "En" : "Ru";
      return item[`${base}${suffix}`] ?? item[`${base}Uk`] ?? "";
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, localizedField }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside LocaleProvider");
  return ctx;
}

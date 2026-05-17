export const locales = ["uk", "en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uk";

export const localeLabels: Record<Locale, string> = {
  uk: "Українська",
  en: "English",
  ru: "Русский",
};

export const localeFlags: Record<Locale, string> = {
  uk: "🇺🇦",
  en: "🇬🇧",
  ru: "🇷🇺",
};

"use client";

import { useLocale } from "@/i18n/provider";

interface Localised {
  nameUk?: string;
  nameEn?: string;
  nameRu?: string;
  descUk?: string;
  descEn?: string;
  descRu?: string;
}

export function useProductFields() {
  const { locale } = useLocale();
  const suffix = locale === "uk" ? "Uk" : locale === "en" ? "En" : "Ru";

  return {
    nameOf: <T extends Localised>(item: T): string =>
      (item as unknown as Record<string, string | undefined>)[
        `name${suffix}`
      ] ??
      item.nameUk ??
      "",
    descOf: <T extends Localised>(item: T): string =>
      (item as unknown as Record<string, string | undefined>)[
        `desc${suffix}`
      ] ??
      item.descUk ??
      "",
  };
}

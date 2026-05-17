import { uk } from "./dictionaries/uk";
import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/uk";

export const dictionaries: Record<Locale, Dictionary> = { uk, en, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? uk;
}

export type { Locale, Dictionary };

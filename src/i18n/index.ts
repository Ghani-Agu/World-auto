import fr, { type Dictionary } from "./dictionaries/fr";
import en from "./dictionaries/en";
import ar from "./dictionaries/ar";
import type { Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { fr, en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? fr;
}

export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export type { Dictionary };

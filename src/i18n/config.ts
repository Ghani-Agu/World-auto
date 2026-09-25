export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

/** Text stored per-language in data files */
export type L10n = Record<Locale, string>;

export function t10n(value: L10n, locale: Locale): string {
  return value[locale] ?? value.fr;
}

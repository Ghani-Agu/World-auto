import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/noto-kufi-arabic";
import "../globals.css";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: { default: dict.meta.title, template: "%s · World Auto" },
    description: dict.meta.description,
    icons: { icon: "/icon.svg" },
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={dirOf(locale)}>
      <body className="min-h-dvh">
        <I18nProvider locale={locale} dict={dict}>
          <Header />
          <main>{children}</main>
          <Footer locale={locale} dict={dict} />
        </I18nProvider>
      </body>
    </html>
  );
}

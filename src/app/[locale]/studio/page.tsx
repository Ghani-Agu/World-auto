import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import StudioApp from "@/components/studio/StudioApp";

export async function generateMetadata({ params }: PageProps<"/[locale]/studio">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.studio } : {};
}

export default async function StudioPage({ params, searchParams }: PageProps<"/[locale]/studio">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  const brand = typeof sp.brand === "string" ? sp.brand : undefined;
  const model = typeof sp.model === "string" ? sp.model : undefined;
  return <StudioApp key={`${brand}-${model}`} initialBrand={brand} initialModel={model} />;
}

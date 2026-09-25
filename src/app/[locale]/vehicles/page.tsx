import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { Container, PageHero } from "@/components/ui/primitives";
import BrandExplorer from "@/components/product/BrandExplorer";

export async function generateMetadata({ params }: PageProps<"/[locale]/vehicles">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.vehicles } : {};
}

export default async function VehiclesPage({ params }: PageProps<"/[locale]/vehicles">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={dict.vehicles.eyebrow} title={dict.vehicles.title} text={dict.vehicles.text} />
      <Container className="py-12">
        <BrandExplorer />
      </Container>
    </>
  );
}

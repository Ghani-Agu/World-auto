import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { categoryByKey, type Availability, type CategoryKey } from "@/lib/catalog";
import { Container, PageHero } from "@/components/ui/primitives";
import ProductBrowser from "@/components/product/ProductBrowser";

export async function generateMetadata({ params }: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.products } : {};
}

export default async function ProductsPage({ params, searchParams }: PageProps<"/[locale]/products">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const category = typeof sp.category === "string" && sp.category in categoryByKey ? (sp.category as CategoryKey) : undefined;
  const availability = ["stock", "order", "rare"].includes(String(sp.availability)) ? (sp.availability as Availability) : undefined;

  return (
    <>
      <PageHero eyebrow={dict.products.eyebrow} title={dict.products.title} />
      <Container className="py-10">
        <ProductBrowser key={`${category}-${availability}`} initialCategory={category} initialAvailability={availability} />
      </Container>
    </>
  );
}

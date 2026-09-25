import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { Container, PageHero } from "@/components/ui/primitives";
import QuoteTool from "@/components/quote/QuoteTool";

export async function generateMetadata({ params }: PageProps<"/[locale]/quote">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.quote } : {};
}

export default async function QuotePage({ params, searchParams }: PageProps<"/[locale]/quote">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const url = typeof sp.url === "string" ? sp.url : "";

  return (
    <>
      <PageHero eyebrow={dict.quote.eyebrow} title={dict.quote.title} text={dict.quote.text} />
      <Container className="py-12">
        <QuoteTool initialUrl={url} />
      </Container>
    </>
  );
}

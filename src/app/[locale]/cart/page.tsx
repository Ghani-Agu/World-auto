import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { Container } from "@/components/ui/primitives";
import CartView from "@/components/quote/CartView";

export async function generateMetadata({ params }: PageProps<"/[locale]/cart">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.cart } : {};
}

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <Container className="py-12">
      <h1 className="font-display mb-8 text-4xl font-extrabold md:text-5xl">{dict.cart.title}</h1>
      <CartView />
    </Container>
  );
}

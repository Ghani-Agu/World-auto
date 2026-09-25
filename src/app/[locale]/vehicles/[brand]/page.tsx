import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { brandByKey, brands, productsFor } from "@/lib/catalog";
import { Container, Eyebrow } from "@/components/ui/primitives";
import CarSilhouette from "@/components/product/CarSilhouette";

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.key }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/vehicles/[brand]">): Promise<Metadata> {
  const { brand } = await params;
  const b = brandByKey[brand];
  return b ? { title: b.name } : {};
}

export default async function BrandPage({ params }: PageProps<"/[locale]/vehicles/[brand]">) {
  const { locale, brand } = await params;
  const b = brandByKey[brand];
  if (!isLocale(locale) || !b) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <span className="font-display pointer-events-none absolute -bottom-8 end-0 select-none text-[9rem] font-black leading-none text-white/[0.03] md:text-[14rem]" dir="ltr">
          {b.name.toUpperCase()}
        </span>
        <Container className="relative py-14 md:py-20">
          <Link href={`/${locale}/vehicles`} className="inline-flex items-center gap-2 text-sm text-fog hover:text-paper">
            <ArrowLeft className="rtl-flip h-4 w-4" /> {dict.nav.vehicles}
          </Link>
          <div className="mt-6"><Eyebrow>{dict.common.origin[b.origin]}</Eyebrow></div>
          <h1 className="font-display mt-3 text-5xl font-extrabold md:text-7xl" dir="ltr">{b.name}</h1>
          <p className="mt-4 text-lg text-mist">{dict.vehicles.chooseModel}</p>
        </Container>
      </section>
      <Container className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {b.models.map((m) => (
          <Link key={m.key} href={`/${locale}/vehicles/${b.key}/${m.key}`} className="group relative overflow-hidden rounded-2xl border border-line bg-panel p-6 transition hover:border-signal/50">
            <div className="flex items-center justify-between">
              <span className="tag text-fog">{dict.common.body[m.body]}</span>
              <span className="tag text-fog" dir="ltr">{m.years}</span>
            </div>
            <CarSilhouette body={m.body} className="my-6 w-full text-mist transition group-hover:text-signal" />
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-extrabold" dir="ltr">{b.name} {m.name}</h2>
                <p className="mt-1 text-sm text-fog">{productsFor(b.key, m.key).length} {dict.common.parts}</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-line-2 transition group-hover:border-signal group-hover:bg-signal">
                <ArrowRight className="rtl-flip h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </Container>
    </>
  );
}

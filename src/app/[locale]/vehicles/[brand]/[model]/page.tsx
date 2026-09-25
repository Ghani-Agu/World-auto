import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, Box } from "lucide-react";
import { isLocale, t10n } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { brandByKey, brands, categories, findModel, productsFor, type CategoryKey } from "@/lib/catalog";
import { Container, Eyebrow } from "@/components/ui/primitives";
import ProductCard from "@/components/product/ProductCard";
import CarSilhouette from "@/components/product/CarSilhouette";
import PartArt from "@/components/product/PartArt";

export function generateStaticParams() {
  return brands.flatMap((b) => b.models.map((m) => ({ brand: b.key, model: m.key })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/vehicles/[brand]/[model]">): Promise<Metadata> {
  const { brand, model } = await params;
  const m = findModel(brand, model);
  return m ? { title: `${brandByKey[brand].name} ${m.name}` } : {};
}

export default async function ModelPage({ params, searchParams }: PageProps<"/[locale]/vehicles/[brand]/[model]">) {
  const { locale, brand, model } = await params;
  const b = brandByKey[brand];
  const m = findModel(brand, model);
  if (!isLocale(locale) || !b || !m) notFound();
  const dict = getDictionary(locale);
  const sp = await searchParams;
  const cat = (typeof sp.category === "string" ? sp.category : undefined) as CategoryKey | undefined;

  const all = productsFor(b.key, m.key);
  const list = cat ? all.filter((p) => p.category === cat) : all;
  const base = `/${locale}/vehicles/${b.key}/${m.key}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <Container className="relative grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center md:py-16">
          <div>
            <Link href={`/${locale}/vehicles/${b.key}`} className="inline-flex items-center gap-2 text-sm text-fog hover:text-paper">
              <ArrowLeft className="rtl-flip h-4 w-4" /> {b.name}
            </Link>
            <div className="mt-5"><Eyebrow>{dict.vehicles.partsFor}</Eyebrow></div>
            <h1 className="font-display mt-3 text-4xl font-extrabold md:text-6xl" dir="ltr">{b.name} {m.name}</h1>
            <p className="mt-3 flex flex-wrap gap-3 text-sm text-fog">
              <span className="tag rounded-md border border-line px-2 py-1">{dict.common.body[m.body]}</span>
              <span className="tag rounded-md border border-line px-2 py-1" dir="ltr">{m.years}</span>
              <span className="tag rounded-md border border-signal/40 bg-signal/10 px-2 py-1 text-signal">{all.length} {dict.common.parts}</span>
            </p>
            <Link href={`/${locale}/studio?brand=${b.key}&model=${m.key}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-jade px-5 py-3 text-sm font-bold text-ink hover:brightness-110">
              <Box className="h-4 w-4" /> {dict.vehicles.openStudio}
            </Link>
          </div>
          <CarSilhouette body={m.body} className="w-full max-w-md text-signal/70" />
        </Container>
      </section>

      <Container className="py-10">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <Link href={base} className={clsx("shrink-0 rounded-full border px-4 py-2 text-sm", !cat ? "border-signal bg-signal/10 text-paper" : "border-line text-fog hover:text-paper")}>
            {dict.common.all} · {all.length}
          </Link>
          {categories.map((c) => {
            const n = all.filter((p) => p.category === c.key).length;
            if (!n) return null;
            return (
              <Link key={c.key} href={`${base}?category=${c.key}`} className={clsx("flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm", cat === c.key ? "border-signal bg-signal/10 text-paper" : "border-line text-fog hover:text-paper")}>
                <PartArt category={c.key} className="h-4 w-4" />
                {t10n(c.name, locale)} · {n}
              </Link>
            );
          })}
        </div>

        {list.length ? (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} p={p} locale={locale} dict={dict} />)}
          </div>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center text-fog">{dict.vehicles.none}</p>
        )}
      </Container>
    </>
  );
}

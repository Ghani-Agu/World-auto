import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, Clock, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { isLocale, t10n } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { brandByKey, categoryByKey, productById, products } from "@/lib/catalog";
import { platformByKey } from "@/lib/platforms";
import { PRICING, formatDZD, quote } from "@/lib/pricing";
import { whatsappLink } from "@/lib/site";
import { productImage } from "@/lib/product-images";
import { Container } from "@/components/ui/primitives";
import PartArt from "@/components/product/PartArt";
import AddToCart from "@/components/product/AddToCart";
import ProductCard, { availabilityStyle, categoryTint } from "@/components/product/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const p = productById[id];
  return p && isLocale(locale) ? { title: t10n(p.name, locale) } : {};
}

export default async function ProductPage({ params }: PageProps<"/[locale]/products/[id]">) {
  const { locale, id } = await params;
  const p = productById[id];
  if (!isLocale(locale) || !p) notFound();
  const dict = getDictionary(locale);
  const q = quote(p.priceCNY);
  const src = platformByKey[p.source];
  const img = productImage(p.id, 960);
  const similar = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  const fitRows = p.fits.includes("*")
    ? null
    : p.fits.map((f) => {
        const [bk, mk] = f.split("/");
        const b = brandByKey[bk];
        return { b, models: mk ? b?.models.filter((m) => m.key === mk) : b?.models };
      });

  return (
    <>
      <Container className="py-8">
        <Link href={`/${locale}/products`} className="inline-flex items-center gap-2 text-sm text-fog hover:text-paper">
          <ArrowLeft className="rtl-flip h-4 w-4" /> {dict.nav.products}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* visual */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-panel">
            <div className={clsx("absolute inset-0 bg-gradient-to-br to-transparent", categoryTint[p.category])} />
            {img ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="absolute inset-0 bg-[#eef0f3]" />
                <img src={img} alt={t10n(p.name, locale)} referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-contain p-8 mix-blend-multiply" />
              </>
            ) : (
              <>
                <div className="bg-grid absolute inset-0" />
                <PartArt category={p.category} className="absolute inset-0 m-auto h-1/2 w-1/2 text-paper" />
              </>
            )}
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
              <span className="tag rounded-md bg-ink/70 px-2 py-1 text-mist backdrop-blur" dir="ltr">{dict.common.ref} {p.ref}</span>
            </div>
          </div>

          {/* info */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={clsx("tag rounded-md border px-2 py-1", availabilityStyle[p.availability])}>{dict.common.availability[p.availability]}</span>
              <span className="tag rounded-md border border-line px-2 py-1 text-mist">{t10n(categoryByKey[p.category].name, locale)}</span>
              <span className="rounded-md bg-paper px-2 py-1 text-xs font-bold text-ink">{p.maker}</span>
            </div>
            <h1 className="font-display mt-4 text-3xl font-extrabold leading-tight md:text-4xl">{t10n(p.name, locale)}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-fog">
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber text-amber" /> {p.rating}</span>
              <span>{p.sold} {dict.common.sold}</span>
              {src && <span dir="ltr">{dict.common.source}: <span className="text-mist">{src.name}</span></span>}
            </div>

            {/* price ticket */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-line-2 bg-panel">
              <div className="space-y-2 p-5 font-mono text-sm" dir="ltr">
                <div className="flex justify-between text-fog"><span>¥{p.priceCNY} × {PRICING.rates.CNY}</span><span className="text-paper">{formatDZD(q.base, locale)}</span></div>
                <div className="flex justify-between text-fog"><span>{dict.common.commission} {PRICING.commissionPct}%</span><span className="text-paper">{formatDZD(q.commission, locale)}</span></div>
              </div>
              <div className="perforated" />
              <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="tag text-fog">{dict.common.finalPrice}</div>
                  <div className="font-display text-4xl font-extrabold text-signal" dir="ltr">{formatDZD(q.total, locale)}</div>
                  <div className="mt-1 text-xs text-fog">{dict.common.priceNote}</div>
                </div>
                <AddToCart productId={p.id} size="lg" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-ink/40 p-4 text-sm">
              <Clock className="h-5 w-5 text-amber" />
              <span>{dict.common.lead}: <strong>{p.leadDays[0]}–{p.leadDays[1]} {dict.common.days}</strong></span>
            </div>

            <ul className="mt-6 space-y-2">
              {dict.product.guarantee.map((g) => (
                <li key={g} className="flex items-center gap-3 text-sm text-mist"><ShieldCheck className="h-4 w-4 text-jade" /> {g}</li>
              ))}
            </ul>

            <a href={whatsappLink(`${t10n(p.name, locale)} — ${p.ref}\nVIN: `)} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-jade hover:underline">
              <MessageCircle className="h-4 w-4" /> {dict.product.vinCheck}
            </a>

            {/* specs & fitment */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="tag mb-3 text-fog">{dict.product.specs}</h2>
                <dl className="divide-y divide-line rounded-2xl border border-line text-sm">
                  {[
                    [dict.product.maker, p.maker],
                    [dict.common.ref, p.ref],
                    [dict.product.category, t10n(categoryByKey[p.category].name, locale)],
                    [dict.common.source, src?.name ?? "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 px-4 py-3"><dt className="text-fog">{k}</dt><dd className="text-end font-medium">{v}</dd></div>
                  ))}
                </dl>
              </div>
              <div>
                <h2 className="tag mb-3 text-fog">{dict.product.compatible}</h2>
                {fitRows ? (
                  <div className="space-y-2">
                    {fitRows.map(({ b, models }) =>
                      b ? (
                        <div key={b.key} className="rounded-2xl border border-line p-3">
                          <div className="text-sm font-bold">{b.name}</div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {models?.map((m) => (
                              <Link key={m.key} href={`/${locale}/vehicles/${b.key}/${m.key}`} className="rounded-md bg-ink/60 px-2 py-1 text-xs text-mist hover:text-signal">{m.name}</Link>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-jade/30 bg-jade/5 p-4 text-sm text-jade">{dict.common.universal}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {similar.length > 0 && (
        <Container className="py-16">
          <h2 className="font-display mb-6 text-2xl font-extrabold md:text-3xl">{dict.product.similar}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((x) => <ProductCard key={x.id} p={x} locale={locale} dict={dict} />)}
          </div>
        </Container>
      )}
    </>
  );
}

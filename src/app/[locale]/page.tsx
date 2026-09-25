import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Box, Car, Link2, MessageCircle, PackageCheck, Plane, SearchCheck, ShoppingCart, Store, Truck } from "lucide-react";
import { isLocale, t10n } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { brands, categories, products, productsFor } from "@/lib/catalog";
import { platforms } from "@/lib/platforms";
import { whatsappLink } from "@/lib/site";
import { Container, Eyebrow, SectionHead, btn } from "@/components/ui/primitives";
import HeroPaste from "@/components/home/HeroPaste";
import RouteCard from "@/components/home/RouteCard";
import VehicleFinder from "@/components/home/VehicleFinder";
import PriceSimulator from "@/components/home/PriceSimulator";
import StudioTeaser from "@/components/home/StudioTeaser";
import ProductCard from "@/components/product/ProductCard";
import PartArt from "@/components/product/PartArt";
import { productImage } from "@/lib/product-images";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const L = (p: string) => `/${locale}${p}`;

  const featured = [...products].sort((a, b) => b.sold - a.sold).slice(0, 8);
  const wayIcons = [Link2, Car, Box, Store];
  const wayHrefs = ["/quote", "/vehicles", "/studio", "/products"];
  const stepIcons = [ShoppingCart, SearchCheck, Plane, Truck];

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="bg-grid bg-grid-fade absolute inset-0" />
        <div className="absolute -top-32 start-[-10%] h-[28rem] w-[28rem] rounded-full bg-signal/20 blur-[140px]" />
        <div className="absolute top-40 end-[-5%] h-80 w-80 rounded-full bg-jade/10 blur-[120px]" />
        <Container className="relative grid gap-14 pb-16 pt-12 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-24">
          <div>
            <Eyebrow>{dict.home.heroEyebrow}</Eyebrow>
            <h1 className="font-display mt-6 text-[2.6rem] font-extrabold leading-[0.98] sm:text-6xl lg:text-7xl">
              <span className="block text-mist">{dict.home.heroTitleA}</span>
              <span className="mt-2 block">
                {dict.home.heroTitleB.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="relative inline-block text-signal">
                  {dict.home.heroTitleB.split(" ").slice(-1)}
                  <svg viewBox="0 0 200 12" className="absolute -bottom-2 start-0 h-3 w-full" preserveAspectRatio="none" aria-hidden>
                    <path d="M2 8 C 50 2, 150 2, 198 8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-mist">{dict.home.heroText}</p>
            <div className="mt-8 max-w-2xl">
              <HeroPaste />
            </div>
          </div>
          <RouteCard dict={dict} />
        </Container>
      </section>

      {/* ───────── RARE PARTS MARQUEE ───────── */}
      <div className="relative border-y border-line bg-signal py-4 text-ink">
        <div className="flex overflow-hidden" dir="ltr">
          <div className="flex shrink-0 animate-marquee items-center gap-10 pe-10">
            {[...dict.home.rareItems, ...dict.home.rareItems].map((item, i) => (
              <span key={i} className="font-display flex items-center gap-10 whitespace-nowrap text-lg font-extrabold uppercase">
                {item}
                <span className="text-white">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ───────── 4 WAYS ───────── */}
      <Container className="py-20 md:py-28">
        <SectionHead eyebrow={dict.home.waysEyebrow} title={dict.home.waysTitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.home.ways.map((w, i) => {
            const Icon = wayIcons[i];
            return (
              <Link
                key={w.title}
                href={L(wayHrefs[i])}
                className="group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-panel p-6 transition hover:border-signal/50"
              >
                <span className="font-display absolute -end-2 -top-6 text-[7rem] font-black leading-none text-white/[0.03] transition group-hover:text-signal/10">
                  0{i + 1}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-signal/10 text-signal">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    {w.title}
                    <ArrowUpRight className="rtl-flip h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-fog">{w.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6">
          <VehicleFinder />
        </div>
      </Container>

      {/* ───────── RARE / UNFINDABLE ───────── */}
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] border border-line lg:grid-cols-2">
          <div className="relative bg-panel p-8 md:p-12">
            <Eyebrow>{dict.home.rareEyebrow}</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-extrabold leading-[1.05] md:text-5xl">{dict.home.rareTitle}</h2>
            <p className="mt-5 text-lg text-mist">{dict.home.rareText}</p>
            <Link href={L("/products?availability=rare")} className={`${btn.primary} mt-8`}>
              {dict.home.rareCta}
              <ArrowRight className="rtl-flip h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
            {products.filter((p) => p.availability === "rare").slice(0, 6).map((p) => (
              <Link key={p.id} href={L(`/products/${p.id}`)} className="group relative flex aspect-square flex-col justify-between overflow-hidden bg-night p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="absolute inset-0 bg-[#eef0f3] transition group-hover:bg-white" />
                <img src={productImage(p.id, 350)} alt="" loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 m-auto h-3/5 w-4/5 object-contain mix-blend-multiply transition duration-500 group-hover:scale-110" />
                <span className="tag relative w-fit rounded bg-ink px-1.5 py-0.5 text-signal">{p.maker}</span>
                <span className="relative line-clamp-2 text-xs font-semibold text-ink">{t10n(p.name, locale)}</span>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      {/* ───────── FEATURED ───────── */}
      <Container className="py-20 md:py-28">
        <SectionHead
          eyebrow={dict.home.featuredEyebrow}
          title={dict.home.featuredTitle}
          action={{ href: L("/products"), label: dict.home.viewAll }}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} locale={locale} dict={dict} />
          ))}
        </div>
        <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <Link key={c.key} href={L(`/products?category=${c.key}`)} className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-panel px-4 py-2 text-sm text-mist hover:border-signal/50 hover:text-paper">
              <PartArt category={c.key} className="h-5 w-5" />
              {t10n(c.name, locale)}
            </Link>
          ))}
        </div>
      </Container>

      {/* ───────── STUDIO ───────── */}
      <Container>
        <StudioTeaser locale={locale} dict={dict} />
      </Container>

      {/* ───────── BRANDS ───────── */}
      <Container className="py-20 md:py-28">
        <SectionHead eyebrow={dict.home.brandsEyebrow} title={dict.home.brandsTitle} action={{ href: L("/vehicles"), label: dict.nav.vehicles }} />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => (
            <Link key={b.key} href={L(`/vehicles/${b.key}`)} className="group relative flex h-28 flex-col justify-between bg-night p-4 transition hover:bg-panel">
              <span className="flex items-center justify-between">
                <span className={`tag ${b.origin === "CN" ? "text-signal" : "text-fog"}`}>{b.origin}</span>
                <span className="text-[11px] text-fog">{productsFor(b.key).length} {dict.common.parts}</span>
              </span>
              <span className="font-display text-xl font-extrabold tracking-tight transition group-hover:text-signal" dir="ltr">{b.name}</span>
            </Link>
          ))}
        </div>
      </Container>

      {/* ───────── PLATFORMS ───────── */}
      <section className="border-y border-line bg-night">
        <Container className="grid gap-12 py-20 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <Eyebrow>{dict.home.platformsEyebrow}</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-extrabold leading-[1.05] md:text-5xl">{dict.home.platformsTitle}</h2>
            <p className="mt-5 text-lg text-mist">{dict.home.platformsText}</p>
            <Link href={L("/platforms")} className={`${btn.ghost} mt-8`}>
              {dict.home.platformsCta}
              <ArrowRight className="rtl-flip h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {platforms.map((p) => (
              <a
                key={p.key}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl border border-line bg-panel p-4 transition hover:-translate-y-1"
                style={{ ["--c" as string]: p.color }}
              >
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: p.color }} />
                <span className="flex items-center justify-between">
                  <span className="tag text-fog">{dict.platformsPage.kinds[p.kind]}</span>
                  <ArrowUpRight className="rtl-flip h-4 w-4 text-fog transition group-hover:text-paper" />
                </span>
                <span dir="ltr">
                  <span className="font-display block text-lg font-extrabold">{p.name}</span>
                  {p.native && <span className="block text-xs text-fog">{p.native}</span>}
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* ───────── PRICE ───────── */}
      <Container className="py-20 md:py-28">
        <SectionHead eyebrow={dict.home.priceEyebrow} title={dict.home.priceTitle} text={dict.home.priceText} />
        <PriceSimulator />
      </Container>

      {/* ───────── HOW ───────── */}
      <Container id="how" className="scroll-mt-24">
        <SectionHead eyebrow={dict.home.stepsEyebrow} title={dict.home.stepsTitle} />
        <ol className="relative grid gap-4 md:grid-cols-4">
          <div className="absolute inset-x-8 top-8 hidden h-px border-t border-dashed border-line-2 md:block" />
          {dict.home.steps.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <li key={s.title} className="relative">
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl border border-line-2 bg-ink">
                  <Icon className="h-6 w-6 text-signal" />
                  <span className="absolute -end-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-signal font-mono text-[11px] font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </Container>

      {/* ───────── FAQ + CTA ───────── */}
      <Container id="faq" className="grid scroll-mt-24 gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold md:text-5xl">{dict.home.faqTitle}</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {dict.home.faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line-2 text-fog transition group-open:rotate-45 group-open:border-signal group-open:text-signal">+</span>
                </summary>
                <p className="mt-3 pe-10 text-sm leading-relaxed text-fog">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-signal p-8 text-white md:p-12">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <PackageCheck className="absolute -bottom-10 -end-10 h-64 w-64 text-white/10" />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold leading-[1.05] md:text-5xl">{dict.home.ctaTitle}</h2>
            <p className="mt-5 max-w-md text-lg text-white/85">{dict.home.ctaText}</p>
          </div>
          <a href={whatsappLink(dict.home.ctaTitle)} target="_blank" rel="noreferrer" className="relative mt-10 inline-flex w-fit items-center gap-2 rounded-xl bg-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-night">
            <MessageCircle className="h-5 w-5 text-jade" />
            {dict.home.ctaButton}
          </a>
        </div>
      </Container>
    </>
  );
}

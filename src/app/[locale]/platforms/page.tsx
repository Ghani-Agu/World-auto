import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Lightbulb, Target } from "lucide-react";
import { isLocale, t10n } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { platforms } from "@/lib/platforms";
import { Container, PageHero, btn } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/platforms">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).nav.platforms } : {};
}

export default async function PlatformsPage({ params }: PageProps<"/[locale]/platforms">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.platformsPage;

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} text={t.text}>
        <Link href={`/${locale}/quote`} className={`${btn.primary} mt-8`}>
          {t.pasteCta} <ArrowRight className="rtl-flip h-4 w-4" />
        </Link>
      </PageHero>
      <Container className="grid gap-5 py-14 md:grid-cols-2">
        {platforms.map((p, i) => (
          <article key={p.key} className="group relative overflow-hidden rounded-3xl border border-line bg-panel">
            <div className="absolute inset-y-0 start-0 w-1.5" style={{ background: p.color }} />
            <div className="p-6 ps-8 md:p-8 md:ps-10">
              <div className="flex items-start justify-between gap-4">
                <div dir="ltr" className="text-start">
                  <div className="tag text-fog">#{String(i + 1).padStart(2, "0")} · {t.kinds[p.kind]}</div>
                  <h2 className="font-display mt-2 text-3xl font-extrabold">{p.name}</h2>
                  {p.native && <div className="text-sm text-fog">{p.native}</div>}
                </div>
                <span className="tag rounded-md border border-line px-2 py-1 text-mist">{t.currency} {p.currency}</span>
              </div>
              <p className="mt-5 text-mist">{t10n(p.description, locale)}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-ink/40 p-4">
                  <div className="tag flex items-center gap-2 text-jade"><Target className="h-3.5 w-3.5" /> {t.bestFor}</div>
                  <p className="mt-2 text-sm">{t10n(p.bestFor, locale)}</p>
                </div>
                <div className="rounded-2xl border border-line bg-ink/40 p-4">
                  <div className="tag flex items-center gap-2 text-amber"><Lightbulb className="h-3.5 w-3.5" /> {t.tip}</div>
                  <p className="mt-2 text-sm">{t10n(p.tip, locale)}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:brightness-110" style={{ background: p.color }}>
                  {t.open} {p.name} <ExternalLink className="h-4 w-4" />
                </a>
                <Link href={`/${locale}/quote`} className={btn.ghost}>{dict.nav.quote}</Link>
              </div>
            </div>
          </article>
        ))}
      </Container>
    </>
  );
}

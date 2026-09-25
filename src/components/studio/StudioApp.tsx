"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Check, ChevronDown, Link2, Loader2, MousePointerClick, RotateCcw, ShoppingBag, Star } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { t10n } from "@/i18n/config";
import { brandByKey, brands, categories, productById, productsFor, type CategoryKey } from "@/lib/catalog";
import { finalPrice, formatDZD } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import PartArt from "@/components/product/PartArt";
import { productImage } from "@/lib/product-images";
import { carModelFor } from "./carModels";
import { availabilityStyle } from "@/components/product/ProductCard";

const CarScene = dynamic(() => import("./CarScene"), { ssr: false, loading: () => <SceneLoading /> });

function SceneLoading() {
  const { dict } = useI18n();
  return (
    <div className="grid h-full w-full place-items-center">
      <span className="flex items-center gap-2 text-sm text-fog"><Loader2 className="h-4 w-4 animate-spin" /> {dict.studio.loading}</span>
    </div>
  );
}

const PAINTS = ["#c9ced6", "#f2f3f5", "#1d2129", "#b3261e", "#1f4e8c", "#3f5b4a"];

export default function StudioApp({ initialBrand, initialModel }: { initialBrand?: string; initialModel?: string }) {
  const { locale, dict } = useI18n();
  const t = dict.studio;
  const router = useRouter();
  const addProduct = useCart((s) => s.addProduct);

  const startBrand = initialBrand && brandByKey[initialBrand] ? initialBrand : "chery";
  const startModel = brandByKey[startBrand].models.find((m) => m.key === initialModel)?.key ?? brandByKey[startBrand].models.at(-2)?.key ?? brandByKey[startBrand].models[0].key;

  const [brand, setBrand] = useState(startBrand);
  const [model, setModel] = useState(startModel);
  const [active, setActive] = useState<CategoryKey | null>(null);
  const [picks, setPicks] = useState<Partial<Record<CategoryKey, string[]>>>({});
  const [paint, setPaint] = useState(PAINTS[0]);
  const slotRefs = useRef<Partial<Record<CategoryKey, HTMLLIElement | null>>>({});

  const b = brandByKey[brand];
  const m = b.models.find((x) => x.key === model) ?? b.models[0];

  // reset picks when the vehicle changes
  useEffect(() => {
    setPicks({});
    setActive(null);
  }, [brand, model]);

  const options = useMemo(() => {
    const map = {} as Record<CategoryKey, ReturnType<typeof productsFor>>;
    for (const c of categories) map[c.key] = productsFor(brand, m.key, c.key);
    return map;
  }, [brand, m.key]);

  const filled = useMemo(() => {
    const f: Partial<Record<CategoryKey, number>> = {};
    for (const [k, v] of Object.entries(picks)) if (v?.length) f[k as CategoryKey] = v.length;
    return f;
  }, [picks]);

  const selectedIds = Object.values(picks).flat().filter(Boolean) as string[];
  const total = selectedIds.reduce((s, id) => s + finalPrice(productById[id].priceCNY), 0);
  const asset = carModelFor(brand, m.key);
  const photos = useMemo(() => {
    const out: Partial<Record<CategoryKey, string[]>> = {};
    for (const [k, ids] of Object.entries(picks)) out[k as CategoryKey] = (ids ?? []).map((id) => productImage(id, 220)).filter(Boolean) as string[];
    return out;
  }, [picks]);
  const labels = Object.fromEntries(categories.map((c) => [c.key, t10n(c.name, locale)])) as Record<CategoryKey, string>;

  const pick = (k: CategoryKey) => {
    setActive((cur) => (cur === k ? null : k));
    requestAnimationFrame(() => slotRefs.current[k]?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const toggle = (k: CategoryKey, id: string) =>
    setPicks((p) => {
      const cur = p[k] ?? [];
      return { ...p, [k]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });

  const addAll = () => {
    selectedIds.forEach((id) => addProduct(id));
    router.push(`/${locale}/cart`);
  };

  const selectCls = "h-11 appearance-none rounded-xl border border-line bg-panel ps-3 pe-9 text-sm font-semibold outline-none focus:border-signal";

  return (
    <div className="grid lg:h-[calc(100dvh-4rem)] lg:grid-cols-[1fr_420px]">
      {/* ── 3D viewport ── */}
      <section className="relative h-[58vh] border-b border-line lg:h-full lg:border-b-0 lg:border-e">
        <CarScene body={m.body} paint={paint} active={active} filled={filled} labels={labels} onPick={pick} asset={asset} photos={photos} />

        {/* top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-3 p-4">
          <div className="pointer-events-auto flex flex-wrap gap-2">
            <label className="relative">
              <select value={brand} onChange={(e) => { setBrand(e.target.value); setModel(brandByKey[e.target.value].models[0].key); }} className={selectCls} aria-label={dict.home.finderBrand}>
                {brands.map((x) => <option key={x.key} value={x.key}>{x.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
            </label>
            <label className="relative">
              <select value={m.key} onChange={(e) => setModel(e.target.value)} className={selectCls} aria-label={dict.home.finderModel}>
                {b.models.map((x) => <option key={x.key} value={x.key}>{x.name} · {x.years}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
            </label>
          </div>
          {(!asset || asset.paint) && (
            <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-line bg-panel/80 p-1.5 backdrop-blur">
              {PAINTS.map((c) => (
                <button key={c} onClick={() => setPaint(c)} className={clsx("h-6 w-6 rounded-full border-2 transition", paint === c ? "border-signal scale-110" : "border-transparent")} style={{ background: c }} aria-label={c} />
              ))}
            </div>
          )}
        </div>

        {/* bottom hint + vehicle tag */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="rounded-xl border border-line bg-ink/70 px-3 py-2 backdrop-blur md:px-4 md:py-3">
            <div className="tag text-signal">{t.vehicle}</div>
            <div className="font-display text-base font-extrabold md:text-xl" dir="ltr">{b.name} {m.name}</div>
            <div className="tag text-fog">{dict.common.body[m.body]} · <span dir="ltr">{m.years}</span></div>
            {asset && (
              <a href={asset.credit.url} target="_blank" rel="noreferrer" className="pointer-events-auto mt-1 block text-[10px] text-fog/80 hover:text-paper" dir="ltr">
                3D: “{asset.credit.title}” by {asset.credit.author} · {asset.credit.license}
              </a>
            )}
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-line bg-ink/70 px-3 py-2 text-xs text-fog backdrop-blur md:flex">
            <MousePointerClick className="h-4 w-4 text-signal" /> {t.hint} · {t.rotate}
          </div>
        </div>
      </section>

      {/* ── Slots panel ── */}
      <aside className="flex min-h-0 flex-col bg-night">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <div className="tag text-fog">{t.eyebrow}</div>
            <h1 className="font-display text-xl font-extrabold">{t.title}</h1>
          </div>
          <span className="tag rounded-md border border-line px-2 py-1 text-mist">
            {Object.keys(filled).length}/{categories.length}
          </span>
        </div>

        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
          {categories.map((c) => {
            const opts = options[c.key];
            const chosen = picks[c.key] ?? [];
            const open = active === c.key;
            return (
              <li key={c.key} ref={(el) => { slotRefs.current[c.key] = el; }} className={clsx("overflow-hidden rounded-2xl border transition", open ? "border-signal/60 bg-panel" : chosen.length ? "border-jade/40 bg-panel" : "border-line bg-panel/60")}>
                <button onClick={() => pick(c.key)} className="flex w-full items-center gap-3 p-3 text-start">
                  <span className={clsx("grid h-11 w-11 shrink-0 place-items-center rounded-xl", chosen.length ? "bg-jade/15 text-jade" : open ? "bg-signal/15 text-signal" : "bg-ink/60 text-fog")}>
                    <PartArt category={c.key} className="h-7 w-7" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      {t10n(c.name, locale)}
                      <span className="font-mono text-[10px] font-normal text-fog">{opts.length}</span>
                    </span>
                    <span className="block truncate text-xs text-fog">
                      {chosen.length ? chosen.map((id) => t10n(productById[id].name, locale)).join(" · ") : t10n(c.hint, locale)}
                    </span>
                  </span>
                  {chosen.length ? (
                    <span className="grid h-7 min-w-7 place-items-center rounded-full bg-jade px-1.5 font-mono text-xs font-bold text-ink">{chosen.length}</span>
                  ) : (
                    <span className={clsx("rounded-lg px-2.5 py-1 text-xs font-semibold", open ? "bg-signal text-white" : "border border-line-2 text-mist")}>{t.choose}</span>
                  )}
                </button>

                {open && (
                  <div className="border-t border-line p-2">
                    <div className="tag px-2 py-1 text-fog">{t.compatible}</div>
                    {opts.length ? (
                      <ul className="space-y-1.5">
                        {opts.map((p) => {
                          const on = chosen.includes(p.id);
                          return (
                            <li key={p.id}>
                              <button onClick={() => toggle(c.key, p.id)} className={clsx("flex w-full items-center gap-3 rounded-xl border p-2.5 text-start transition", on ? "border-jade bg-jade/10" : "border-line bg-ink/40 hover:border-line-2")}>
                                <span className={clsx("grid h-5 w-5 shrink-0 place-items-center rounded-md border", on ? "border-jade bg-jade text-ink" : "border-line-2")}>
                                  {on && <Check className="h-3.5 w-3.5" />}
                                </span>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={productImage(p.id, 220)} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-11 w-11 shrink-0 rounded-lg bg-[#eef0f3] object-contain p-0.5" />
                                <span className="min-w-0 flex-1">
                                  <span className="line-clamp-1 text-sm font-semibold">{t10n(p.name, locale)}</span>
                                  <span className="mt-0.5 flex items-center gap-2 text-[11px] text-fog">
                                    <span className="font-bold text-mist">{p.maker}</span>
                                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-amber text-amber" />{p.rating}</span>
                                    <span className={clsx("rounded border px-1", availabilityStyle[p.availability])}>{dict.common.availability[p.availability]}</span>
                                  </span>
                                </span>
                                <span className="shrink-0 font-mono text-sm font-bold" dir="ltr">{formatDZD(finalPrice(p.priceCNY), locale)}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="p-3 text-sm text-fog">
                        {t.noneCompatible}
                        <Link href={`/${locale}/quote`} className="mt-2 flex items-center gap-1.5 font-semibold text-signal"><Link2 className="h-4 w-4" /> {dict.nav.quote}</Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Build summary */}
        <div className="border-t border-line bg-panel p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="tag text-fog">{t.build} · {selectedIds.length} {t.selected}</div>
              <div className="font-display text-3xl font-extrabold text-signal" dir="ltr">{formatDZD(total, locale)}</div>
            </div>
            {selectedIds.length > 0 && (
              <button onClick={() => setPicks({})} className="flex items-center gap-1 text-xs text-fog hover:text-paper">
                <RotateCcw className="h-3.5 w-3.5" /> {t.clear}
              </button>
            )}
          </div>
          <button onClick={addAll} disabled={!selectedIds.length} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-white hover:bg-signal-2 disabled:opacity-40">
            <ShoppingBag className="h-4 w-4" /> {selectedIds.length ? t.addAll : t.buildEmpty}
          </button>
        </div>
      </aside>
    </div>
  );
}

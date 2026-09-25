"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { brands, categories, fitsModel, products, type Availability, type CategoryKey } from "@/lib/catalog";
import { t10n } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n";
import ProductCard from "./ProductCard";
import PartArt from "./PartArt";

type Sort = "popular" | "asc" | "desc";

export default function ProductBrowser({ initialCategory, initialAvailability }: { initialCategory?: CategoryKey; initialAvailability?: Availability }) {
  const { locale, dict } = useI18n();
  const t = dict.products;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoryKey | "">(initialCategory ?? "");
  const [brand, setBrand] = useState("");
  const [avail, setAvail] = useState<Availability | "">(initialAvailability ?? "");
  const [sort, setSort] = useState<Sort>("popular");
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = products.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!avail || p.availability === avail) &&
        (!brand || fitsModel(p, brand)) &&
        (!s ||
          t10n(p.name, locale).toLowerCase().includes(s) ||
          p.ref.toLowerCase().includes(s) ||
          p.maker.toLowerCase().includes(s))
    );
    return r.sort((a, b) => (sort === "asc" ? a.priceCNY - b.priceCNY : sort === "desc" ? b.priceCNY - a.priceCNY : b.sold - a.sold));
  }, [q, cat, avail, brand, sort, locale]);

  const reset = () => {
    setQ("");
    setCat("");
    setBrand("");
    setAvail("");
  };
  const active = Boolean(q || cat || brand || avail);

  const selectCls = "h-11 w-full rounded-xl border border-line bg-ink/60 px-3 text-sm outline-none focus:border-signal";

  const filters = (
    <div className="space-y-6">
      <div>
        <div className="tag mb-3 text-fog">{t.category}</div>
        <div className="space-y-1">
          <button onClick={() => setCat("")} className={clsx("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm", !cat ? "bg-signal/10 text-paper" : "text-fog hover:bg-white/5 hover:text-paper")}>
            {dict.common.all}
          </button>
          {categories.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)} className={clsx("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm", cat === c.key ? "bg-signal/10 text-paper" : "text-fog hover:bg-white/5 hover:text-paper")}>
              <PartArt category={c.key} className={clsx("h-5 w-5", cat === c.key && "text-signal")} />
              {t10n(c.name, locale)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="tag mb-3 text-fog">{t.brand}</div>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectCls}>
          <option value="">{t.anyBrand}</option>
          {brands.map((b) => <option key={b.key} value={b.key}>{b.name}</option>)}
        </select>
      </div>
      <div>
        <div className="tag mb-3 text-fog">{t.availability}</div>
        <div className="flex flex-wrap gap-2">
          {(["stock", "order", "rare"] as Availability[]).map((a) => (
            <button key={a} onClick={() => setAvail(avail === a ? "" : a)} className={clsx("rounded-lg border px-3 py-1.5 text-xs font-medium", avail === a ? "border-signal bg-signal/10 text-paper" : "border-line text-fog hover:text-paper")}>
              {dict.common.availability[a]}
            </button>
          ))}
        </div>
      </div>
      {active && (
        <button onClick={reset} className="flex items-center gap-2 text-sm text-signal hover:underline">
          <X className="h-4 w-4" /> {t.reset}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filters}</div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} className="h-11 w-full rounded-xl border border-line bg-panel ps-11 pe-4 text-sm outline-none focus:border-signal" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowFilters((v) => !v)} className="flex h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm text-mist lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-11 rounded-xl border border-line bg-panel px-3 text-sm outline-none focus:border-signal" aria-label={t.sort}>
              <option value="popular">{t.sortPopular}</option>
              <option value="asc">{t.sortAsc}</option>
              <option value="desc">{t.sortDesc}</option>
            </select>
          </div>
        </div>

        {showFilters && <div className="mt-4 rounded-2xl border border-line bg-panel p-5 lg:hidden">{filters}</div>}

        <div className="tag mt-6 text-fog">{fmt(t.results, { n: list.length })}</div>

        {list.length ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => <ProductCard key={p.id} p={p} locale={locale} dict={dict} />)}
          </div>
        ) : (
          <p className="mt-6 rounded-2xl border border-dashed border-line p-10 text-center text-fog">{t.noResults}</p>
        )}
      </div>
    </div>
  );
}

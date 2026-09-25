import Link from "next/link";
import { Star } from "lucide-react";
import clsx from "clsx";
import PartArt from "./PartArt";
import AddToCart from "./AddToCart";
import { categoryByKey, fitsLabel, type Availability, type Product } from "@/lib/catalog";
import { finalPrice, formatDZD } from "@/lib/pricing";
import { platformByKey } from "@/lib/platforms";
import { productImage } from "@/lib/product-images";
import type { Dictionary } from "@/i18n";
import { t10n, type Locale } from "@/i18n/config";

export const availabilityStyle: Record<Availability, string> = {
  stock: "text-jade border-jade/30 bg-jade/10",
  order: "text-amber border-amber/30 bg-amber/10",
  rare: "text-signal border-signal/40 bg-signal/10",
};

export const categoryTint: Record<string, string> = {
  engine: "from-signal/25",
  brakes: "from-crimson/25",
  suspension: "from-amber/20",
  lighting: "from-amber/25",
  body: "from-mist/15",
  filters: "from-jade/20",
  electrical: "from-jade/25",
  cooling: "from-sky-400/20",
  transmission: "from-violet-400/20",
  interior: "from-sky-400/15",
};

export default function ProductCard({ p, locale, dict }: { p: Product; locale: Locale; dict: Dictionary }) {
  const href = `/${locale}/products/${p.id}`;
  const src = platformByKey[p.source];
  const img = productImage(p.id, 480);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition hover:-translate-y-0.5 hover:border-line-2 hover:shadow-[0_20px_60px_-30px_rgb(255_90_31/0.45)]">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden">
        <div className={clsx("absolute inset-0 bg-gradient-to-br to-transparent", categoryTint[p.category])} />
        {img ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="absolute inset-0 bg-[#eef0f3]" />
            <img src={img} alt={t10n(p.name, locale)} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-contain p-4 pt-10 mix-blend-multiply transition duration-700 group-hover:scale-105" />
          </>
        ) : (
          <>
            <div className="bg-grid absolute inset-0 opacity-60" />
            <PartArt category={p.category} className="absolute inset-0 m-auto h-3/5 w-3/5 text-paper/80 transition duration-500 group-hover:scale-105 group-hover:text-paper" />
          </>
        )}
        <span className="absolute start-3 top-3 rounded-md bg-ink/80 backdrop-blur">
          <span className={clsx("tag block rounded-md border px-2 py-1", availabilityStyle[p.availability])}>
            {dict.common.availability[p.availability]}
          </span>
        </span>
        <span className="absolute end-3 top-3 rounded-md bg-ink/70 px-2 py-1 text-[11px] font-bold tracking-wide text-paper backdrop-blur">
          {p.maker}
        </span>
        {src && (
          <span className={clsx("tag absolute bottom-3 start-3", img ? "rounded bg-ink/80 px-1.5 py-0.5 text-mist" : "text-mist")} dir="ltr">
            via {src.name}
          </span>
        )}
      </Link>
      <div className="perforated -mt-[5px] opacity-100" />
      <div className="flex flex-1 flex-col gap-2 p-4 pt-3">
        <div className="tag flex items-center justify-between text-fog">
          <span>{t10n(categoryByKey[p.category].name, locale)}</span>
          <span dir="ltr">{p.ref}</span>
        </div>
        <Link href={href} className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-paper hover:text-signal">
          {t10n(p.name, locale)}
        </Link>
        <p className="line-clamp-1 text-xs text-fog">
          {dict.common.fits}: <span className="text-mist">{fitsLabel(p, dict.common.universal)}</span>
        </p>
        <div className="flex items-center gap-3 text-xs text-fog">
          <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber text-amber" />{p.rating}</span>
          <span>{p.sold} {dict.common.sold}</span>
          <span>· {p.leadDays[0]}–{p.leadDays[1]} {dict.common.days}</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="text-[11px] text-fog">{dict.common.finalPrice}</div>
            <div className="font-display text-xl font-extrabold text-paper" dir="ltr">{formatDZD(finalPrice(p.priceCNY), locale)}</div>
          </div>
          <AddToCart productId={p.id} />
        </div>
      </div>
    </article>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { AlertCircle, ArrowRight, CheckCircle2, Link2, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n";
import { detectPlatform, platformByKey, type Platform } from "@/lib/platforms";
import { PRICING, formatDZD, quote, type Currency } from "@/lib/pricing";
import { useCart } from "@/store/cart";

type Status = "idle" | "loading" | "fetched" | "manual" | "unknown" | "invalid";

export default function QuoteTool({ initialUrl = "" }: { initialUrl?: string }) {
  const { locale, dict } = useI18n();
  const t = dict.quote;
  const router = useRouter();
  const addLink = useCart((s) => s.addLink);

  const [url, setUrl] = useState(initialUrl);
  const [status, setStatus] = useState<Status>("idle");
  const [platform, setPlatform] = useState<Platform | undefined>();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [price, setPrice] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("CNY");
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState("");

  const analyze = useCallback(
    async (target: string) => {
      const u = target.trim();
      if (!u) return;
      try {
        new URL(u);
      } catch {
        setStatus("invalid");
        return;
      }
      const local = detectPlatform(u);
      setPlatform(local);
      if (local) setCurrency(local.currency);
      setStatus("loading");
      try {
        const res = await fetch("/api/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: u }) });
        const data = await res.json();
        if (data.reason === "invalid") return setStatus("invalid");
        if (data.reason === "unknown") return setStatus("unknown");
        if (data.platform) setPlatform(platformByKey[data.platform]);
        if (data.currency) setCurrency(data.currency);
        if (data.title) setTitle(data.title);
        if (data.image) setImage(data.image);
        if (data.price) setPrice(String(data.price));
        setStatus(data.ok ? "fetched" : "manual");
      } catch {
        setStatus(local ? "manual" : "unknown");
      }
    },
    []
  );

  useEffect(() => {
    if (initialUrl) analyze(initialUrl);
  }, [initialUrl, analyze]);

  const amount = Number(price.replace(",", "."));
  const valid = Number.isFinite(amount) && amount > 0;
  const q = valid ? quote(amount, currency, qty) : { base: 0, commission: 0, total: 0 };
  const belowMin = valid && q.total < PRICING.minOrderDZD;
  const showForm = status !== "idle" && status !== "invalid" && status !== "loading";
  const step = !showForm ? 0 : valid ? 2 : 1;

  const add = () => {
    if (!valid || belowMin) return;
    addLink({
      url: url.trim(),
      platform: platform?.key,
      title: title.trim() || platform?.name || "Produit",
      variant: variant.trim() || undefined,
      image,
      price: amount,
      currency,
      qty,
    });
    router.push(`/${locale}/cart`);
  };

  const field = "h-12 w-full rounded-xl border border-line bg-ink/60 px-4 text-sm text-paper outline-none transition focus:border-signal placeholder:text-fog/60";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div>
        {/* steps */}
        <ol className="mb-6 flex items-center gap-2 text-xs">
          {t.how.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className={clsx("grid h-6 w-6 place-items-center rounded-full font-mono font-bold", i <= step ? "bg-signal text-white" : "border border-line-2 text-fog")}>{i + 1}</span>
              <span className={i <= step ? "text-paper" : "text-fog"}>{s}</span>
              {i < t.how.length - 1 && <span className="mx-1 h-px w-6 bg-line-2" />}
            </li>
          ))}
        </ol>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            analyze(url);
          }}
          className="flex flex-col gap-2 rounded-2xl border border-line-2 bg-panel p-2 focus-within:border-signal/60 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-3 px-3">
            <Link2 className="h-5 w-5 shrink-0 text-signal" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.placeholder} dir="ltr" className="h-12 w-full min-w-0 bg-transparent font-mono text-sm outline-none placeholder:text-fog/70" />
          </div>
          <button type="submit" disabled={status === "loading"} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-signal px-6 text-sm font-semibold text-white hover:bg-signal-2 disabled:opacity-60">
            {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {status === "loading" ? t.analyzing : t.analyze}
          </button>
        </form>

        {status === "invalid" && (
          <p className="mt-4 flex items-center gap-2 text-sm text-crimson"><AlertCircle className="h-4 w-4" /> {t.invalid}</p>
        )}

        {showForm && (
          <div className="mt-6 space-y-5 rounded-2xl border border-line bg-panel p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-3">
              {platform ? (
                <span className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold text-white" style={{ background: platform.color }} dir="ltr">
                  {platform.name} {platform.native && <span className="font-normal opacity-80">{platform.native}</span>}
                </span>
              ) : null}
              <span className={clsx("flex items-center gap-2 text-sm", status === "fetched" ? "text-jade" : "text-amber")}>
                {status === "fetched" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {status === "fetched" ? t.fetched : status === "unknown" ? t.unknown : t.manual}
              </span>
            </div>

            <label className="block">
              <span className="tag mb-2 block text-fog">{t.productTitle}</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.productTitlePh} className={field} />
            </label>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="tag mb-2 block text-fog">{t.price}</span>
                <div className="relative">
                  <span className="absolute start-4 top-1/2 -translate-y-1/2 font-mono text-fog">{currency === "CNY" ? "¥" : "$"}</span>
                  <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="0.00" dir="ltr" className={`${field} ps-10 font-mono text-lg`} autoFocus={status !== "fetched"} />
                </div>
              </label>
              <div>
                <span className="tag mb-2 block text-fog">{t.currency}</span>
                <div className="flex h-12 rounded-xl border border-line bg-ink/60 p-1">
                  {(["CNY", "USD"] as Currency[]).map((c) => (
                    <button key={c} type="button" onClick={() => setCurrency(c)} className={clsx("rounded-lg px-4 font-mono text-sm font-bold transition", currency === c ? "bg-paper text-ink" : "text-fog hover:text-paper")}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
              <div>
                <span className="tag mb-2 block text-fog">{dict.common.qty}</span>
                <div className="flex h-12 items-center rounded-xl border border-line bg-ink/60">
                  <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} className="grid h-full w-11 place-items-center text-fog hover:text-paper"><Minus className="h-4 w-4" /></button>
                  <span className="w-10 text-center font-mono font-bold">{qty}</span>
                  <button type="button" onClick={() => setQty((n) => n + 1)} className="grid h-full w-11 place-items-center text-fog hover:text-paper"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
              <label className="block">
                <span className="tag mb-2 block text-fog">{t.variant}</span>
                <input value={variant} onChange={(e) => setVariant(e.target.value)} placeholder={t.variantPh} className={field} />
              </label>
            </div>
          </div>
        )}

        <Link href={`/${locale}/platforms`} className="mt-6 inline-flex items-center gap-2 text-sm text-fog hover:text-paper">
          {t.openPlatforms} <ArrowRight className="rtl-flip h-4 w-4" />
        </Link>
      </div>

      {/* Receipt */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl border border-line-2 bg-panel">
          <div className="flex items-center justify-between bg-paper px-5 py-3 text-ink">
            <span className="font-display text-sm font-extrabold">{t.summary}</span>
            <span className="font-mono text-[10px] tracking-widest" dir="ltr">WA · QUOTE</span>
          </div>
          <div className="space-y-4 p-5">
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="h-32 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />
            )}
            <div className="line-clamp-2 min-h-10 text-sm font-semibold">{title || platform?.name || "—"}</div>
            <dl className="space-y-3 text-sm" dir="ltr">
              <Row label={`${valid ? `${currency === "CNY" ? "¥" : "$"}${amount} × ${qty} × ${PRICING.rates[currency]}` : dict.common.productPrice}`} value={formatDZD(q.base, locale)} />
              <Row label={`${dict.common.commission} (${PRICING.commissionPct}%)`} value={formatDZD(q.commission, locale)} />
            </dl>
          </div>
          <div className="perforated" />
          <div className="p-5">
            <div className="tag text-fog">{dict.common.finalPrice}</div>
            <div className="font-display mt-1 text-4xl font-extrabold text-signal" dir="ltr">{formatDZD(q.total, locale)}</div>
            {belowMin && <p className="mt-2 text-xs text-amber">{fmt(t.min, { min: formatDZD(PRICING.minOrderDZD, locale) })}</p>}
            <button onClick={add} disabled={!valid || belowMin} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-signal text-sm font-semibold text-white hover:bg-signal-2 disabled:opacity-40">
              <ShoppingBag className="h-4 w-4" /> {t.add}
            </button>
            <p className="mt-4 text-xs leading-relaxed text-fog">{t.disclaimer}</p>
            {/* barcode */}
            <div className="mt-5 flex h-10 items-end gap-[2px] opacity-40" aria-hidden dir="ltr">
              {Array.from({ length: 48 }).map((_, i) => (
                <span key={i} className="bg-paper" style={{ width: (i * 7) % 3 === 0 ? 3 : 1, height: `${60 + ((i * 13) % 40)}%` }} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-mono text-xs text-fog">{label}</dt>
      <dd className="font-mono font-semibold">{value}</dd>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Link2, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { t10n } from "@/i18n/config";
import { useCart, type CartItem } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { productById } from "@/lib/catalog";
import { platformByKey } from "@/lib/platforms";
import { cartTotals, lineQuote } from "@/lib/cart-math";
import { formatDZD } from "@/lib/pricing";
import { WILAYAS, whatsappLink } from "@/lib/site";
import PartArt from "@/components/product/PartArt";
import { productImage } from "@/lib/product-images";
import { btn } from "@/components/ui/primitives";

export default function CartView() {
  const { locale, dict } = useI18n();
  const t = dict.cart;
  const hydrated = useHydrated();
  const { items, setQty, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", address: "", vin: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-3xl bg-panel" />;

  if (!items.length) {
    return (
      <div className="grid place-items-center rounded-3xl border border-dashed border-line py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-fog" />
        <p className="mt-4 text-lg text-mist">{sent ? t.sent : t.empty}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/${locale}/products`} className={btn.primary}>{t.browse}</Link>
          <Link href={`/${locale}/quote`} className={btn.ghost}><Link2 className="h-4 w-4" /> {dict.nav.quote}</Link>
        </div>
      </div>
    );
  }

  const totals = cartTotals(items);

  const label = (i: CartItem) =>
    i.kind === "catalog" ? `${t10n(productById[i.productId]?.name ?? { fr: "?", en: "?", ar: "?" }, locale)} (${productById[i.productId]?.ref})` : `${i.title}${i.variant ? ` — ${i.variant}` : ""}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.wilaya) return setError(t.required);
    setError("");
    const lines = items.map((i, n) => {
      const q = lineQuote(i);
      const link = i.kind === "link" ? `\n   ${i.url}` : "";
      return `${n + 1}. ${label(i)} ×${i.qty} = ${formatDZD(q.total, "fr")}${link}`;
    });
    const msg = [
      "🛒 Nouvelle commande World Auto",
      "",
      ...lines,
      "",
      `Total: ${formatDZD(totals.total, "fr")}`,
      "",
      `Nom: ${form.name}`,
      `Tél: ${form.phone}`,
      `Wilaya: ${form.wilaya}`,
      form.address && `Adresse: ${form.address}`,
      form.vin && `VIN: ${form.vin}`,
    ]
      .filter(Boolean)
      .join("\n");

    // Persist the order server-side (see /api/orders) — non-blocking.
    fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer: form, items, totals, locale }),
    }).catch(() => {});

    window.open(whatsappLink(msg), "_blank");
    setSent(true);
    clear();
  };

  const field = "h-12 w-full rounded-xl border border-line bg-ink/60 px-4 text-sm outline-none focus:border-signal placeholder:text-fog/60";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <ul className="space-y-3">
        {items.map((i) => {
          const q = lineQuote(i);
          const p = i.kind === "catalog" ? productById[i.productId] : undefined;
          const plat = i.kind === "link" && i.platform ? platformByKey[i.platform] : undefined;
          return (
            <li key={i.key} className="flex gap-4 rounded-2xl border border-line bg-panel p-4">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-ink/60">
                {p && productImage(p.id) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={productImage(p.id, 220)} alt="" referrerPolicy="no-referrer" className="h-full w-full bg-[#eef0f3] object-contain p-1" />
                ) : p ? (
                  <PartArt category={p.category} className="h-12 w-12 text-mist" />
                ) : i.kind === "link" && i.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <Link2 className="h-8 w-8 text-signal" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {i.kind === "link" ? (
                      <span className="tag rounded px-1.5 py-0.5 text-white" style={{ background: plat?.color ?? "var(--color-line-2)" }}>{plat?.name ?? t.fromLink}</span>
                    ) : (
                      <span className="tag text-fog">{p?.maker} · {p?.ref}</span>
                    )}
                    <div className="mt-1 line-clamp-2 font-semibold">
                      {p ? <Link href={`/${locale}/products/${p.id}`} className="hover:text-signal">{t10n(p.name, locale)}</Link> : i.kind === "link" ? i.title : null}
                    </div>
                    {i.kind === "link" && (
                      <a href={i.url} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 truncate text-xs text-fog hover:text-paper" dir="ltr">
                        <ExternalLink className="h-3 w-3 shrink-0" /> <span className="truncate">{i.url}</span>
                      </a>
                    )}
                    {i.kind === "link" && i.variant && <div className="mt-1 text-xs text-mist">{i.variant}</div>}
                  </div>
                  <button onClick={() => remove(i.key)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-fog hover:bg-crimson/10 hover:text-crimson" aria-label={dict.common.remove}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex h-9 items-center rounded-lg border border-line">
                    <button onClick={() => setQty(i.key, i.qty - 1)} className="grid h-full w-9 place-items-center text-fog hover:text-paper"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center font-mono text-sm font-bold">{i.qty}</span>
                    <button onClick={() => setQty(i.key, i.qty + 1)} className="grid h-full w-9 place-items-center text-fog hover:text-paper"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="font-display text-lg font-extrabold" dir="ltr">{formatDZD(q.total, locale)}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <form onSubmit={submit} className="overflow-hidden rounded-3xl border border-line-2 bg-panel">
          <div className="space-y-2 p-5 font-mono text-sm" dir="ltr">
            <div className="flex justify-between text-fog"><span>{dict.common.productPrice}</span><span className="text-paper">{formatDZD(totals.base, locale)}</span></div>
            <div className="flex justify-between text-fog"><span>{dict.common.commission}</span><span className="text-paper">{formatDZD(totals.commission, locale)}</span></div>
          </div>
          <div className="perforated" />
          <div className="p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="tag text-fog">{dict.common.total} · {totals.count} {t.items}</div>
                <div className="font-display mt-1 text-4xl font-extrabold text-signal" dir="ltr">{formatDZD(totals.total, locale)}</div>
              </div>
            </div>

            <h2 className="mt-8 font-bold">{t.checkout}</h2>
            <div className="mt-4 space-y-3">
              <input className={field} placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
              <input className={field} placeholder={t.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" autoComplete="tel" dir="ltr" />
              <select className={field} value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })}>
                <option value="">{t.wilayaPh}</option>
                {WILAYAS.map((w, n) => <option key={w} value={w}>{String(n + 1).padStart(2, "0")} — {w}</option>)}
              </select>
              <input className={field} placeholder={t.address} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <input className={`${field} font-mono`} placeholder={t.vin} value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })} maxLength={17} dir="ltr" />
            </div>
            {error && <p className="mt-3 text-sm text-crimson">{error}</p>}
            <button type="submit" className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-jade text-sm font-bold text-ink hover:brightness-110">
              <MessageCircle className="h-5 w-5" /> {t.send}
            </button>
            <p className="mt-3 text-xs text-fog">{t.deposit}</p>
          </div>
        </form>
      </aside>
    </div>
  );
}

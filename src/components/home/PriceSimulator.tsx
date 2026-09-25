"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { PRICING, formatDZD, quote } from "@/lib/pricing";

/** Interactive formula: supplier price → DZD → + fee → final */
export default function PriceSimulator() {
  const { locale, dict } = useI18n();
  const [cny, setCny] = useState(450);
  const q = quote(cny, "CNY");

  const Cell = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
    <div className={`rounded-2xl border p-5 ${accent ? "border-signal/50 bg-signal/10" : "border-line bg-ink/50"}`}>
      <div className="tag text-fog">{label}</div>
      <div className={`font-display mt-2 text-2xl font-extrabold md:text-3xl ${accent ? "text-signal" : ""}`} dir="ltr">{value}</div>
    </div>
  );

  return (
    <div className="rounded-3xl border border-line bg-panel p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="sim" className="tag text-mist">{dict.home.priceSupplier}</label>
        <span className="font-mono text-lg font-bold text-paper" dir="ltr">¥ {cny.toLocaleString("en-US")}</span>
      </div>
      <input
        id="sim"
        type="range"
        min={20}
        max={3000}
        step={10}
        value={cny}
        onChange={(e) => setCny(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--color-signal)]"
        dir="ltr"
      />
      <div className="mt-8 grid items-center gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Cell label={`${dict.home.priceRate} · 1¥ = ${PRICING.rates.CNY} DA`} value={formatDZD(q.base, locale)} />
        <span className="text-center font-mono text-2xl text-fog">+</span>
        <Cell label={`${dict.home.priceFee} · ${PRICING.commissionPct}%`} value={formatDZD(q.commission, locale)} />
        <span className="text-center font-mono text-2xl text-fog">=</span>
        <Cell label={dict.home.priceFinal} value={formatDZD(q.total, locale)} accent />
      </div>
    </div>
  );
}

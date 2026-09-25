"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, ChevronDown, Search } from "lucide-react";
import { brands } from "@/lib/catalog";
import { useI18n } from "@/i18n/provider";

export default function VehicleFinder() {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const models = brands.find((b) => b.key === brand)?.models ?? [];

  const go = () => {
    if (!brand) return;
    router.push(`/${locale}/vehicles/${brand}${model ? `/${model}` : ""}`);
  };

  const select =
    "h-14 w-full appearance-none rounded-xl border border-line bg-ink/60 ps-4 pe-10 text-sm font-medium text-paper outline-none transition focus:border-signal disabled:opacity-40";

  return (
    <div className="rounded-2xl border border-line bg-panel p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Car className="h-5 w-5 text-signal" />
        <h3 className="font-semibold">{dict.home.finderTitle}</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="relative">
          <span className="tag absolute -top-2 start-3 bg-panel px-1 text-fog">{dict.home.finderBrand}</span>
          <select value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); }} className={select}>
            <option value="">{dict.home.finderPick}</option>
            {(["CN", "EU", "KR", "JP"] as const).map((o) => (
              <optgroup key={o} label={dict.common.origin[o]}>
                {brands.filter((b) => b.origin === o).map((b) => (
                  <option key={b.key} value={b.key}>{b.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
        </label>
        <label className="relative">
          <span className="tag absolute -top-2 start-3 bg-panel px-1 text-fog">{dict.home.finderModel}</span>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!brand} className={select}>
            <option value="">{dict.home.finderPick}</option>
            {models.map((m) => (
              <option key={m.key} value={m.key}>{m.name} · {m.years}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
        </label>
        <button onClick={go} disabled={!brand} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-paper px-6 text-sm font-bold text-ink transition hover:bg-white disabled:opacity-40">
          <Search className="h-4 w-4" />
          {dict.home.finderGo}
        </button>
      </div>
    </div>
  );
}

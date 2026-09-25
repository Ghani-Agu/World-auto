"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Search } from "lucide-react";
import { brands, productsFor, type Brand } from "@/lib/catalog";
import { useI18n } from "@/i18n/provider";

const origins: Brand["origin"][] = ["CN", "EU", "KR", "JP"];

export default function BrandExplorer() {
  const { locale, dict } = useI18n();
  const [q, setQ] = useState("");
  const [origin, setOrigin] = useState<Brand["origin"] | "all">("all");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return brands.filter(
      (b) =>
        (origin === "all" || b.origin === origin) &&
        (!s || b.name.toLowerCase().includes(s) || b.models.some((m) => m.name.toLowerCase().includes(s)))
    );
  }, [q, origin]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={dict.vehicles.search} className="h-12 w-full rounded-xl border border-line bg-panel ps-11 pe-4 text-sm outline-none focus:border-signal" />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {(["all", ...origins] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrigin(o)}
              className={clsx(
                "h-12 shrink-0 rounded-xl border px-4 text-sm font-medium transition",
                origin === o ? "border-signal bg-signal/10 text-paper" : "border-line text-fog hover:text-paper"
              )}
            >
              {o === "all" ? dict.common.all : dict.common.origin[o]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((b) => (
          <div key={b.key} className="group overflow-hidden rounded-2xl border border-line bg-panel transition hover:border-line-2">
            <Link href={`/${locale}/vehicles/${b.key}`} className="flex items-center justify-between p-5">
              <div>
                <span className={clsx("tag", b.origin === "CN" ? "text-signal" : "text-fog")}>{dict.common.origin[b.origin]}</span>
                <h3 className="font-display mt-1 text-2xl font-extrabold group-hover:text-signal" dir="ltr">{b.name}</h3>
              </div>
              <div className="text-end text-xs text-fog">
                <div><span className="font-mono text-base font-bold text-paper">{b.models.length}</span> {dict.common.models}</div>
                <div><span className="font-mono text-base font-bold text-paper">{productsFor(b.key).length}</span> {dict.common.parts}</div>
              </div>
            </Link>
            <div className="flex flex-wrap gap-2 border-t border-line p-4">
              {b.models.map((m) => (
                <Link key={m.key} href={`/${locale}/vehicles/${b.key}/${m.key}`} className="rounded-lg border border-line bg-ink/40 px-3 py-1.5 text-xs font-medium text-mist transition hover:border-signal/60 hover:text-paper" dir="ltr">
                  {m.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

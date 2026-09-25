import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Dictionary } from "@/i18n";
import { t10n, type Locale } from "@/i18n/config";
import { categoryByKey, type CategoryKey } from "@/lib/catalog";
import { Eyebrow } from "@/components/ui/primitives";

const spots: { key: CategoryKey; x: number; y: number; filled?: boolean }[] = [
  { key: "engine", x: 84, y: 40, filled: true },
  { key: "lighting", x: 94, y: 51, filled: true },
  { key: "brakes", x: 76, y: 71 },
  { key: "suspension", x: 26, y: 58, filled: true },
  { key: "interior", x: 55, y: 32 },
  { key: "body", x: 10, y: 55 },
];

export default function StudioTeaser({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-line bg-night">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="absolute -bottom-40 start-1/3 h-80 w-[36rem] rounded-full bg-jade/10 blur-[120px]" />
      <div className="relative grid gap-10 p-6 md:p-12 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <div>
          <Eyebrow className="!text-jade">{dict.home.studioEyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-3xl font-extrabold leading-[1.05] md:text-5xl">{dict.home.studioTitle}</h2>
          <p className="mt-5 text-lg text-mist">{dict.home.studioText}</p>
          <div className="mt-8 space-y-2">
            {spots.slice(0, 4).map((s) => (
              <div key={s.key} className="flex items-center justify-between rounded-xl border border-line bg-panel/70 px-4 py-3 text-sm">
                <span className="flex items-center gap-3">
                  <span className={`grid h-6 w-6 place-items-center rounded-md ${s.filled ? "bg-jade text-ink" : "border border-dashed border-line-2"}`}>
                    {s.filled && <Check className="h-4 w-4" />}
                  </span>
                  {t10n(categoryByKey[s.key].name, locale)}
                </span>
                <span className={`tag ${s.filled ? "text-jade" : "text-fog"}`}>{s.filled ? "✓" : dict.studio.choose}</span>
              </div>
            ))}
          </div>
          <Link href={`/${locale}/studio`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-jade px-6 py-3 text-sm font-bold text-ink transition hover:brightness-110">
            {dict.home.studioCta}
            <ArrowRight className="rtl-flip h-4 w-4" />
          </Link>
        </div>

        <div className="relative aspect-[16/10]" dir="ltr">
          <svg viewBox="0 0 500 300" className="absolute inset-0 h-full w-full" fill="none">
            <ellipse cx="250" cy="250" rx="220" ry="18" fill="black" opacity=".5" />
            {/* body */}
            <path
              d="M30 200 L34 160 Q40 140 70 134 L150 120 L200 78 Q214 66 236 66 L330 66 Q352 66 368 80 L410 118 L452 130 Q472 136 474 158 L476 200 Q476 214 462 214 L40 214 Q30 214 30 200 Z"
              fill="var(--color-panel-2)"
              stroke="var(--color-line-2)"
              strokeWidth="2"
            />
            <path d="M160 122 L206 84 Q216 76 232 76 L276 76 L276 122 Z" fill="var(--color-ink)" stroke="var(--color-line-2)" />
            <path d="M286 76 L328 76 Q346 76 358 88 L392 122 L286 122 Z" fill="var(--color-ink)" stroke="var(--color-line-2)" />
            <path d="M40 170 L470 170" stroke="var(--color-line-2)" strokeDasharray="4 6" />
            <rect x="32" y="146" width="16" height="14" rx="4" fill="var(--color-crimson)" opacity=".8" />
            <rect x="446" y="140" width="28" height="12" rx="4" fill="var(--color-amber)" opacity=".9" />
            {/* wheels */}
            {[130, 380].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="212" r="40" fill="var(--color-ink)" stroke="var(--color-line-2)" strokeWidth="3" />
                <circle cx={cx} cy="212" r="22" fill="var(--color-panel)" stroke="var(--color-fog)" strokeOpacity=".5" />
                <circle cx={cx} cy="212" r="6" fill="var(--color-fog)" />
              </g>
            ))}
          </svg>
          {spots.map((s) => (
            <span key={s.key} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <span className={`absolute inset-0 animate-pulse-ring rounded-full ${s.filled ? "bg-jade" : "bg-signal"}`} />
              <span className={`relative grid h-7 w-7 place-items-center rounded-full border-2 border-ink text-[10px] font-bold ${s.filled ? "bg-jade text-ink" : "bg-signal text-white"}`}>
                {s.filled ? "✓" : "+"}
              </span>
            </span>
          ))}
          <div className="tag absolute bottom-0 end-0 rounded-md border border-line bg-ink/80 px-3 py-2 text-mist">
            Chery Tiggo 7 Pro · 3 / 10
          </div>
        </div>
      </div>
    </section>
  );
}

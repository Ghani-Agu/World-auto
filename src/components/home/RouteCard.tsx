import { Package, Plane, Ship } from "lucide-react";
import type { Dictionary } from "@/i18n";

/** Animated shipping-route "ticket" shown in the hero */
export default function RouteCard({ dict }: { dict: Dictionary }) {
  return (
    <div className="relative animate-float">
      <div className="absolute -inset-6 rounded-[2rem] bg-signal/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-line-2 bg-panel/90 backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="tag text-fog">AWB · WA-2026-0917</span>
          <span className="tag flex items-center gap-2 text-jade">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-jade" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-jade" />
            </span>
            {dict.home.routeStatus}
          </span>
        </div>

        {/* Map */}
        <div className="relative h-56" dir="ltr">
          <div className="bg-grid absolute inset-0 opacity-70" />
          <svg viewBox="0 0 400 220" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="route" x1="0" x2="1">
                <stop offset="0" stopColor="var(--color-jade)" />
                <stop offset="1" stopColor="var(--color-signal)" />
              </linearGradient>
            </defs>
            {/* stylised dotted landmass */}
            {Array.from({ length: 110 }).map((_, i) => {
              const x = (i * 37) % 400;
              const y = 30 + ((i * 53) % 170);
              const land = (x < 150 && y > 60 && y < 190) || (x > 250 && y > 40 && y < 160);
              return land ? <circle key={i} cx={x} cy={y} r="1.6" fill="white" opacity="0.14" /> : null;
            })}
            <path d="M340 90 C 280 10, 120 20, 70 130" fill="none" stroke="url(#route)" strokeWidth="2.5" strokeDasharray="6 8" className="animate-dash" />
            <circle cx="340" cy="90" r="6" fill="var(--color-signal)" />
            <circle cx="340" cy="90" r="14" fill="none" stroke="var(--color-signal)" opacity=".4" />
            <circle cx="70" cy="130" r="6" fill="var(--color-jade)" />
            <circle cx="70" cy="130" r="14" fill="none" stroke="var(--color-jade)" opacity=".4" />
          </svg>
          <div className="absolute end-5 top-5 text-end">
            <div className="tag text-signal">CN · CAN</div>
            <div className="text-sm font-semibold">{dict.home.routeFrom}</div>
          </div>
          <div className="absolute bottom-5 start-5">
            <div className="tag text-jade">DZ · ALG</div>
            <div className="text-sm font-semibold">{dict.home.routeTo}</div>
          </div>
          <div className="absolute left-[46%] top-[18%] grid h-10 w-10 place-items-center rounded-full border border-line-2 bg-ink/80">
            <Plane className="h-4 w-4 -rotate-12 text-paper" />
          </div>
        </div>

        <div className="perforated" />

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-line rtl:divide-x-reverse">
          {[
            { v: "58", l: dict.home.stat1, icon: Package },
            { v: "12–35", l: dict.home.stat2, icon: Ship },
            { v: "100%", l: dict.home.stat3, icon: Plane },
          ].map((s) => (
            <div key={s.l} className="px-4 py-4">
              <div className="font-display text-2xl font-extrabold" dir="ltr">{s.v}</div>
              <div className="mt-1 text-[11px] leading-tight text-fog">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

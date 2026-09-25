import type { Model } from "@/lib/catalog";

const bodies: Record<Model["body"], string> = {
  suv: "M10 62 L12 44 Q14 38 24 36 L50 32 L66 16 Q70 12 78 12 L128 12 Q136 12 142 18 L158 32 L178 36 Q188 38 188 48 L190 62 Z",
  sedan: "M8 62 L10 48 Q12 42 22 40 L54 36 L76 20 Q82 16 92 16 L124 16 Q132 16 138 22 L154 36 L180 40 Q190 42 190 52 L190 62 Z",
  hatch: "M12 62 L14 46 Q16 40 26 38 L56 34 L74 18 Q80 14 88 14 L140 14 Q150 14 156 22 L170 40 Q182 44 184 52 L184 62 Z",
  pickup: "M8 62 L10 44 Q12 38 22 36 L46 32 L60 14 Q64 10 72 10 L108 10 Q114 10 116 16 L118 34 L186 34 Q192 34 192 42 L192 62 Z",
};

export default function CarSilhouette({ body, className }: { body: Model["body"]; className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} fill="none" aria-hidden>
      <path d={bodies[body]} fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="50" cy="62" r="12" fill="var(--color-ink)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="150" cy="62" r="12" fill="var(--color-ink)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="62" r="4" fill="currentColor" />
      <circle cx="150" cy="62" r="4" fill="currentColor" />
    </svg>
  );
}

import type { CategoryKey } from "@/lib/catalog";

/**
 * Hand-drawn technical line illustrations for each part category.
 * Replace with real product photos once the catalog is connected to a DB.
 */
const paths: Record<CategoryKey, React.ReactNode> = {
  engine: (
    <g>
      <rect x="26" y="40" width="56" height="42" rx="4" />
      <path d="M36 40v-10h36v10M44 30v-6h20v6" />
      <path d="M82 50h10v22H82M26 54H16v16h10" />
      <circle cx="54" cy="61" r="10" />
      <path d="M54 51v20M44 61h20" />
      <path d="M34 82v8M74 82v8M30 90h48" />
    </g>
  ),
  brakes: (
    <g>
      <circle cx="58" cy="60" r="34" />
      <circle cx="58" cy="60" r="12" />
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i * 72 * Math.PI) / 180;
        return <circle key={i} cx={58 + Math.cos(a) * 20} cy={60 + Math.sin(a) * 20} r="2.5" />;
      })}
      <path d="M84 28c10 6 16 18 16 32s-6 26-16 32l-8-8c6-6 10-14 10-24s-4-18-10-24z" />
    </g>
  ),
  suspension: (
    <g>
      <rect x="52" y="14" width="16" height="14" rx="3" />
      <path d="M60 28v12" />
      <path d="M44 40h32M44 46l32 6M44 56l32 6M44 66l32 6M44 76l32 6M44 86h32" />
      <rect x="54" y="86" width="12" height="18" rx="2" />
      <circle cx="60" cy="108" r="4" />
    </g>
  ),
  lighting: (
    <g>
      <path d="M18 38c22-10 58-12 84 2l-6 40c-26 8-52 8-74 0z" />
      <circle cx="44" cy="60" r="12" />
      <circle cx="44" cy="60" r="5" />
      <path d="M66 54h26M66 62h24M66 70h20" />
      <path d="M22 86c20 6 50 6 72 0" strokeDasharray="3 5" />
    </g>
  ),
  body: (
    <g>
      <path d="M14 76v-10c0-6 4-10 10-12l14-4 14-14c4-4 8-6 14-6h18c6 0 10 2 14 6l10 14c6 2 10 6 10 12v14" />
      <path d="M14 76h92" />
      <circle cx="36" cy="80" r="10" />
      <circle cx="86" cy="80" r="10" />
      <path d="M54 36v14M40 50h66" />
    </g>
  ),
  filters: (
    <g>
      <ellipse cx="60" cy="30" rx="30" ry="9" />
      <path d="M30 30v56c0 5 13 9 30 9s30-4 30-9V30" />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M${38 + i * 7.5} 40v44`} />
      ))}
      <ellipse cx="60" cy="30" rx="10" ry="3" />
    </g>
  ),
  electrical: (
    <g>
      <rect x="22" y="30" width="76" height="56" rx="6" />
      <rect x="34" y="42" width="52" height="32" rx="3" />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M${38 + i * 9} 30v-8M${38 + i * 9} 86v8`} />
      ))}
      <path d="M58 48l-6 12h10l-6 12" />
    </g>
  ),
  cooling: (
    <g>
      <rect x="18" y="26" width="84" height="66" rx="4" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${28 + i * 8} 32v54`} />
      ))}
      <path d="M18 40h-6M18 78h-6M102 44h8" />
    </g>
  ),
  transmission: (
    <g>
      <circle cx="46" cy="60" r="24" />
      <circle cx="46" cy="60" r="8" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i * 36 * Math.PI) / 180;
        return <path key={i} d={`M${46 + Math.cos(a) * 24} ${60 + Math.sin(a) * 24}L${46 + Math.cos(a) * 31} ${60 + Math.sin(a) * 31}`} />;
      })}
      <circle cx="86" cy="44" r="12" />
      <circle cx="86" cy="44" r="4" />
      <path d="M86 56v40M78 96h16" />
    </g>
  ),
  interior: (
    <g>
      <rect x="16" y="34" width="88" height="52" rx="6" />
      <rect x="24" y="42" width="52" height="36" rx="2" />
      <circle cx="90" cy="52" r="6" />
      <circle cx="90" cy="70" r="6" />
      <path d="M32 70l10-12 8 8 8-10 10 14" />
      <path d="M50 86v8M70 86v8M44 94h32" />
    </g>
  ),
};

export default function PartArt({ category, className }: { category: CategoryKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[category]}
    </svg>
  );
}

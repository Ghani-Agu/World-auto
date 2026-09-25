export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="10" fill="var(--color-signal)" />
      <circle cx="20" cy="20" r="11" fill="none" stroke="white" strokeOpacity=".35" strokeWidth="1.5" />
      <path d="M8 27 C14 9, 26 9, 32 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
      <circle cx="8" cy="27" r="2.6" fill="white" />
      <path d="M29 12l4 4-5 1z" fill="white" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5" dir="ltr">
      <LogoMark />
      <span className="leading-none">
        <span className="font-display block text-[17px] font-extrabold tracking-tight [font-stretch:125%]">WORLD AUTO</span>
        <span className="block font-mono text-[9px] tracking-[0.22em] text-fog">GLOBAL MOBILITY</span>
      </span>
    </span>
  );
}

import clsx from "clsx";
import Link from "next/link";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-signal px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgb(255_90_31/0.6)] transition hover:bg-signal-2 active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-line-2 bg-white/[0.02] px-5 py-3 text-sm font-semibold text-paper transition hover:border-fog hover:bg-white/[0.05]",
  subtle:
    "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-mist transition hover:bg-white/5 hover:text-paper",
};

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("tag inline-flex items-center gap-2 text-signal", className)}>
      <span className="h-px w-6 bg-signal" />
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  text,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={clsx("mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="font-display mt-3 text-3xl font-extrabold leading-[1.05] md:text-5xl">{title}</h2>
        {text && <p className="mt-4 text-base leading-relaxed text-mist md:text-lg">{text}</p>}
      </div>
      {action && (
        <Link href={action.href} className={btn.ghost}>
          {action.label}
          <span className="rtl-flip">→</span>
        </Link>
      )}
    </div>
  );
}

export function Container({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={clsx("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, children }: { eyebrow: string; title: string; text?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="bg-grid bg-grid-fade absolute inset-0" />
      <div className="absolute -top-40 end-[-10%] h-96 w-96 rounded-full bg-signal/15 blur-[120px]" />
      <Container className="relative py-14 md:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-extrabold leading-[1.02] md:text-6xl">{title}</h1>
        {text && <p className="mt-5 max-w-2xl text-lg text-mist">{text}</p>}
        {children}
      </Container>
    </section>
  );
}

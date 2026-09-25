"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Box, Car, Globe, Link2, Menu, ShoppingBag, Store, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useI18n } from "@/i18n/provider";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";

export default function Header() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
  }, [pathname]);

  const nav = [
    { href: `/${locale}/quote`, label: dict.nav.quote, icon: Link2 },
    { href: `/${locale}/vehicles`, label: dict.nav.vehicles, icon: Car },
    { href: `/${locale}/studio`, label: dict.nav.studio, icon: Box, badge: "3D" },
    { href: `/${locale}/products`, label: dict.nav.products, icon: Store },
    { href: `/${locale}/platforms`, label: dict.nav.platforms, icon: Globe },
  ];

  const switchTo = (l: Locale) => {
    document.cookie = `wa_locale=${l}; path=/; max-age=31536000`;
    const rest = pathname.split("/").slice(2).join("/");
    return `/${l}${rest ? `/${rest}` : ""}`;
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-colors",
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} aria-label="World Auto">
          <Logo />
        </Link>

        <nav className="ms-6 hidden items-center gap-1 lg:flex">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active ? "text-paper" : "text-fog hover:text-paper"
                )}
              >
                {n.label}
                {n.badge && <span className="rounded bg-jade/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-jade">{n.badge}</span>}
                {active && <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded bg-signal" />}
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-mist hover:bg-white/5 hover:text-paper"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale}</span>
            </button>
            {langOpen && (
              <div className="absolute end-0 top-12 w-40 overflow-hidden rounded-xl border border-line bg-panel shadow-2xl">
                {locales.map((l) => (
                  <a
                    key={l}
                    href={switchTo(l)}
                    className={clsx(
                      "flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5",
                      l === locale ? "text-signal" : "text-mist"
                    )}
                  >
                    {localeLabels[l]}
                    <span className="font-mono text-[10px] uppercase text-fog">{l}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/cart`}
            className="relative flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-mist hover:bg-white/5 hover:text-paper"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden sm:inline">{dict.nav.cart}</span>
            {hydrated && count > 0 && (
              <span className="absolute -top-0.5 start-6 grid h-5 min-w-5 place-items-center rounded-full bg-signal px-1 font-mono text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link href={`/${locale}/quote`} className="ms-2 hidden items-center gap-2 rounded-xl bg-signal px-4 py-2.5 text-sm font-semibold text-white hover:bg-signal-2 md:flex">
            <Link2 className="h-4 w-4" />
            {dict.nav.quote}
          </Link>

          <button onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-lg text-mist hover:bg-white/5 lg:hidden" aria-label={dict.nav.menu}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-mist hover:bg-white/5 hover:text-paper">
                <n.icon className="h-5 w-5 text-signal" />
                {n.label}
                {n.badge && <span className="rounded bg-jade/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-jade">{n.badge}</span>}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

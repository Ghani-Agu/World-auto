import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/primitives";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { SITE, whatsappLink } from "@/lib/site";
import { PRICING } from "@/lib/pricing";

export default function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const L = (p: string) => `/${locale}${p}`;
  return (
    <footer className="relative mt-24 border-t border-line bg-night">
      <div className="hazard h-1.5 opacity-80" />
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-fog">{dict.footer.tagline}</p>
          <div className="tag mt-6 inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-fog" dir="ltr">
            CN · GZ <span className="text-signal">━━━✈━━━</span> DZ · ALG
          </div>
        </div>
        <div>
          <h3 className="tag mb-4 text-mist">{dict.footer.explore}</h3>
          <ul className="space-y-2.5 text-sm text-fog">
            <li><Link className="hover:text-paper" href={L("/quote")}>{dict.nav.quote}</Link></li>
            <li><Link className="hover:text-paper" href={L("/vehicles")}>{dict.nav.vehicles}</Link></li>
            <li><Link className="hover:text-paper" href={L("/studio")}>{dict.nav.studio}</Link></li>
            <li><Link className="hover:text-paper" href={L("/products")}>{dict.nav.products}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="tag mb-4 text-mist">{dict.footer.help}</h3>
          <ul className="space-y-2.5 text-sm text-fog">
            <li><Link className="hover:text-paper" href={L("/#how")}>{dict.footer.howItWorks}</Link></li>
            <li><Link className="hover:text-paper" href={L("/#faq")}>{dict.footer.faq}</Link></li>
            <li><Link className="hover:text-paper" href={L("/platforms")}>{dict.nav.platforms}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="tag mb-4 text-mist">{dict.footer.contact}</h3>
          <ul className="space-y-3 text-sm text-fog">
            <li>
              <a className="flex items-center gap-2 hover:text-paper" href={whatsappLink("Salam World Auto")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4 text-jade" /> WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2" dir="ltr"><Phone className="h-4 w-4 text-signal" /> {SITE.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-signal" /> {SITE.email}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-signal" /> {SITE.address}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-fog md:flex-row">
          <span>© {new Date().getFullYear()} {SITE.name}. {dict.footer.rights}</span>
          <span className="font-mono" dir="ltr">1 CNY = {PRICING.rates.CNY} DZD · 1 USD = {PRICING.rates.USD} DZD</span>
        </Container>
      </div>
    </footer>
  );
}

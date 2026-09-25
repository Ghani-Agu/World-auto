import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("wa_locale")?.value;
  if (cookie && (locales as readonly string[]).includes(cookie)) return cookie as Locale;
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  for (const part of header.split(",")) {
    const code = part.trim().slice(0, 2);
    if ((locales as readonly string[]).includes(code)) return code as Locale;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;
  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|icon.svg|.*\\..*).*)"],
};

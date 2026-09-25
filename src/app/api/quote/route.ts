import { NextResponse } from "next/server";
import { detectPlatform } from "@/lib/platforms";

export const runtime = "nodejs";

type QuoteLookup = {
  ok: boolean;
  platform?: string;
  title?: string;
  image?: string;
  price?: number;
  currency?: "CNY" | "USD";
  reason?: string;
};

const pick = (html: string, re: RegExp) => html.match(re)?.[1]?.trim();

function meta(html: string, prop: string) {
  return (
    pick(html, new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i")) ??
    pick(html, new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i"))
  );
}

function decode(s?: string) {
  return s
    ?.replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function findPrice(html: string): number | undefined {
  const candidates = [
    meta(html, "product:price:amount"),
    meta(html, "og:price:amount"),
    pick(html, /"price"\s*:\s*"?(\d+(?:\.\d+)?)"?/i),
    pick(html, /"salePrice"\s*:\s*"?(\d+(?:\.\d+)?)"?/i),
    pick(html, /"minPrice"\s*:\s*"?(\d+(?:\.\d+)?)"?/i),
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n) && n > 0 && n < 1_000_000) return n;
  }
  return undefined;
}

/**
 * Best-effort product lookup. Chinese marketplaces often block bots or require
 * login, so the client always falls back to manual price entry.
 * Only whitelisted marketplace hosts are fetched (prevents SSRF).
 * For production reliability, plug a sourcing-agent API (e.g. a 1688/Taobao
 * data provider) into this handler.
 */
export async function POST(req: Request) {
  let url: string;
  try {
    ({ url } = await req.json());
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) throw new Error("protocol");
  } catch {
    return NextResponse.json<QuoteLookup>({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const platform = detectPlatform(url);
  if (!platform) return NextResponse.json<QuoteLookup>({ ok: false, reason: "unknown" });

  const base: QuoteLookup = { ok: false, platform: platform.key, currency: platform.currency };

  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      },
    });
    if (!res.ok) return NextResponse.json<QuoteLookup>({ ...base, reason: `http_${res.status}` });
    const html = (await res.text()).slice(0, 800_000);

    const title = decode(meta(html, "og:title") ?? pick(html, /<title[^>]*>([^<]+)<\/title>/i));
    const image = decode(meta(html, "og:image"));
    const price = findPrice(html);

    return NextResponse.json<QuoteLookup>({ ...base, ok: Boolean(title || price), title, image, price });
  } catch {
    return NextResponse.json<QuoteLookup>({ ...base, reason: "fetch_failed" });
  }
}

/**
 * Pricing rules — the single place to tune how World Auto prices an import.
 * final = supplier price × quantity × exchange rate × (1 + commission)
 * Values can be overridden with NEXT_PUBLIC_* env vars (see .env.example).
 */

export type Currency = "CNY" | "USD";

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const PRICING = {
  rates: {
    CNY: num(process.env.NEXT_PUBLIC_RATE_CNY_DZD, 32),
    USD: num(process.env.NEXT_PUBLIC_RATE_USD_DZD, 235),
  } satisfies Record<Currency, number>,
  commissionPct: num(process.env.NEXT_PUBLIC_COMMISSION_PCT, 15),
  /** Orders under this total (DZD) are refused by the quote tool */
  minOrderDZD: 3000,
};

export function toDZD(amount: number, currency: Currency = "CNY") {
  return amount * PRICING.rates[currency];
}

export function quote(amount: number, currency: Currency = "CNY", qty = 1) {
  const base = Math.round(toDZD(amount, currency) * qty);
  const commission = Math.round((base * PRICING.commissionPct) / 100);
  return { base, commission, total: base + commission };
}

/** Final price shown on catalog cards (CNY supplier price → DZD incl. commission) */
export function finalPrice(priceCNY: number) {
  return quote(priceCNY, "CNY", 1).total;
}

export function formatDZD(value: number, locale: string) {
  const loc = locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-DZ";
  const n = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 }).format(value);
  return locale === "ar" ? `${n} د.ج` : `${n} DA`;
}

import { site } from "@/config/site";

const numberFormat = new Intl.NumberFormat(site.locale, { maximumFractionDigits: 0 });
const decimalFormat = new Intl.NumberFormat(site.locale, { maximumFractionDigits: 1 });

/** 1499 → "1.499 kr" (DK, pricePattern "{amount} kr"); the pattern comes from config/site.ts. */
export function formatPrice(amount: number): string {
  return site.pricePattern.replace("{amount}", numberFormat.format(amount));
}

/** 4.7 → "4,7" (DK) — at most one decimal, in the market locale (Trustpilot score). */
export function formatDecimal(value: number): string {
  return decimalFormat.format(value);
}

/** 1234 → "1.234" (DK): a whole number in the market locale (review counts). */
export function formatInteger(value: number): string {
  return numberFormat.format(value);
}

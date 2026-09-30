import { site } from "@/config/site";

const numberFormat = new Intl.NumberFormat(site.locale, { maximumFractionDigits: 0 });

/** 1499 → "1.499 kr" (DK) / "1 499 kr" (NO). */
export function formatPrice(amount: number): string {
  return `${numberFormat.format(amount)} ${site.currencyLabel}`;
}

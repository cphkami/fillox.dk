/**
 * /priser page copy (design 6b desktop, mp mobile).
 *
 * The page copy (meta, hero, trust band, financing box) and the six price cards
 * live in content/prices.ts, next to the price data they describe. This module is
 * the page's single import point and adds the few strings only the page needs.
 */
import { priceCards, pricesPage as pricesPageBase } from "@/content/prices";

export { priceCards };

export const pricesPage = {
  ...pricesPageBase,
  /** Mobile accordion subtitle: "9 behandlinger" / "1 behandling". */
  count: (n: number) => `${n} ${n === 1 ? "behandling" : pricesPageBase.countSuffix}`,
};

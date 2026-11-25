import type { Metadata } from "next";
import { FinancingBox } from "@/components/prices/FinancingBox";
import { PriceCategories, type PriceCategoryView } from "@/components/prices/PriceCategories";
import { PricesHero } from "@/components/prices/PricesHero";
import { TrustBand } from "@/components/prices/TrustBand";
import { priceCards, pricesPage } from "@/content/pages/prices";
import { routes } from "@/content/routes";
import { getTreatment, treatmentHref } from "@/content/treatments";
import { formatPriceValue } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const PATH = routes.prices;
const { meta } = pricesPage;

export const metadata: Metadata = pageMetadata(meta, PATH);

/**
 * Treatment page for a price row, when the row names one that has a page; with the row's
 * `treatmentAnchor`, its section there (check:market verifies the id exists).
 */
const rowHref = (slug: string | undefined, anchor: string | undefined) =>
  slug && getTreatment(slug) ? `${treatmentHref(slug)}${anchor ? `#${anchor}` : ""}` : undefined;

/**
 * Row labels that link to more than one page ("Hage": the filler page and laser hårfjerning). Their
 * links get the card's name as hidden text, so a screen reader's link list tells them apart.
 */
const ambiguousLabels = (() => {
  const targets = new Map<string, Set<string>>();
  for (const card of priceCards) {
    for (const row of card.rows) {
      const href = rowHref(row.treatmentSlug, row.treatmentAnchor);
      if (href) targets.set(row.label, (targets.get(row.label) ?? new Set()).add(href));
    }
  }
  return new Set([...targets].filter(([, hrefs]) => hrefs.size > 1).map(([label]) => label));
})();

/** Price cards with prices formatted on the server (lib/format), ready for the client component. */
const categories: PriceCategoryView[] = priceCards.map((card) => ({
  id: card.id,
  title: card.title,
  eyebrow: card.eyebrow,
  chipLabel: card.chipLabel,
  rows: card.rows.map((row) => ({
    label: row.label,
    note: row.note,
    price: formatPriceValue(row.price),
    href: rowHref(row.treatmentSlug, row.treatmentAnchor),
    linkContext: ambiguousLabels.has(row.label) ? pricesPage.rowLinkContext(card.title) : undefined,
  })),
}));

/** /priser — design 6b (desktop) / mp (mobile). */
export default function PricesPage() {
  return (
    <>
      <PricesHero
        titleId="prices-title"
        eyebrow={pricesPage.eyebrow}
        title={pricesPage.title}
        titleAccent={pricesPage.titleAccent}
        intro={pricesPage.intro}
        introShort={pricesPage.introShort}
      />
      <TrustBand items={pricesPage.trustChips} />
      <PriceCategories categories={categories} chipsLabel={pricesPage.chipsLabel} />
      <FinancingBox {...pricesPage.financing} />
    </>
  );
}

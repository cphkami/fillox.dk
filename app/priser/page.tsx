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

/** Treatment page for a price row, when the row names one that has a page. */
const rowHref = (slug: string | undefined) => (slug && getTreatment(slug) ? treatmentHref(slug) : undefined);

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
    href: rowHref(row.treatmentSlug),
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

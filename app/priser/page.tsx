import type { Metadata } from "next";
import { FinancingBox } from "@/components/prices/FinancingBox";
import { PriceCategories, type PriceCategoryView } from "@/components/prices/PriceCategories";
import { PricesHero } from "@/components/prices/PricesHero";
import { TrustBand } from "@/components/prices/TrustBand";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { priceCards, pricesPage } from "@/content/pages/prices";
import { getTreatment, treatmentHref } from "@/content/treatments";
import { formatPriceValue } from "@/lib/content";

const PATH = "/priser";
const { meta } = pricesPage;
const { ogImage, titleTemplate } = layoutCopy.meta;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: PATH },
  // Nested objects replace the root layout's, so repeat the shared Open Graph fields.
  // Twitter title/description/image fall back to these (the layout sets the card type).
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    url: PATH,
    title: titleTemplate.replace("%s", meta.title),
    description: meta.description,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
};

/** Treatment page for a price row, when the row names one that has a page. */
const rowHref = (slug: string | undefined) => (slug && getTreatment(slug) ? treatmentHref(slug) : undefined);

/** Price cards with prices formatted on the server (lib/format), ready for the client accordion. */
const categories: PriceCategoryView[] = priceCards.map((card) => ({
  id: card.id,
  title: card.title,
  eyebrow: card.eyebrow,
  chipLabel: card.chipLabel,
  countLabel: `${card.rows.length} ${card.rows.length === 1 ? pricesPage.countSuffixOne : pricesPage.countSuffix}`,
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

/**
 * Resolves the "Ny hos Fillox?" copy (content/pages/new-here.ts) against /content: each need's
 * treatments become links with their name and "fra" price. Pure functions, no React.
 */
import type { NewHereNeed, NewHerePage } from "@/content/pages/new-here";
import { getTreatment, treatmentHref } from "@/content/treatments";
import type { Link } from "@/content/types";
import { formatPriceFrom } from "@/lib/content";

export type NeedTreatmentRow = {
  slug: string;
  /**
   * The treatment page's own short name (`detail.title`: "Lip Filler", "Andre
   * behandlingsmuligheder"), as the /behandlinger cards (TreatmentCard), the blog's booking card
   * and the treatment page's H1 / book bar show it. Not `name`: that is the menus' name, shortened
   * for the mega menu's narrow columns ("Andre behandlinger", content/treatments.ts).
   */
  name: string;
  href: string;
  /** "fra 999 kr": from the treatment's priceFrom (the price list), when it has one and shows it. */
  price?: string;
};

export type NeedView = Omit<NewHereNeed, "treatments" | "bookCta"> & {
  treatments: NeedTreatmentRow[];
  bookCta: Link;
};

/**
 * The six need cards with their treatments resolved. Throws on an unknown treatment slug, so a
 * card never links a page the site does not have (the build fails instead).
 */
export function needViews(copy: Pick<NewHerePage, "needs" | "pricesHiddenFor">): NeedView[] {
  const hidden = new Set(copy.pricesHiddenFor);
  return copy.needs.items.map((need: NewHereNeed) => ({
    ...need,
    bookCta: need.bookCta ?? copy.needs.bookCta,
    treatments: need.treatments.map((slug) => {
      const treatment = getTreatment(slug);
      if (!treatment) throw new Error(`new-here: unknown treatment "${slug}" in need "${need.id}"`);
      const amount = hidden.has(slug) ? undefined : treatment.priceFrom;
      return {
        slug,
        name: treatment.detail?.title ?? treatment.name,
        href: treatmentHref(slug),
        price: amount !== undefined ? formatPriceFrom(amount) : undefined,
      };
    }),
  }));
}

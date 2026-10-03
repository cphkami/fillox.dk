/**
 * Resolves the men's page copy (content/pages/men.ts) against /content: treatment links and
 * "fra" prices, the price rows, the practitioners in "Dine behandlere". Pure functions, no React.
 */
import type { MenPage } from "@/content/pages/men";
import { treatmentPage } from "@/content/pages/treatments";
import { priceCards, type PriceListRow } from "@/content/prices";
import { getTeamMember, teamMemberHref } from "@/content/team";
import { getTreatment, treatmentHref } from "@/content/treatments";
import type { TeamMember } from "@/content/types";
import { formatPriceFrom, formatPriceValue } from "@/lib/content";

export type MenTreatmentRow = {
  slug: string;
  /** Short name on the page ("Botox"). */
  name: string;
  /** The treatment page's own name ("Botox for mænd"): structured data. */
  treatmentName: string;
  text: string;
  href: string;
  /** "fra 799 kr", when the treatment has a price. */
  price?: string;
  /** After the price: "op til 1 ml", "pr. område". */
  priceNote?: string;
};

export type MenPriceRow = { label: string; note?: string; price: string };

export type MenCarePerson = {
  member: TeamMember;
  /** The practitioner's profile, /behandlere/<slug>. */
  profileHref: string;
  /** Portrait crop (object-position) in the 4:5 slot. */
  position: string;
};

/**
 * Note of the price-list row that sets a treatment's "fra" price: the cheapest row tagged with
 * the treatment (or the treatment it is a variant of, treatmentPage.priceAliases), e.g.
 * "Kæbelinjer · op til 1 ml" for kaebelinje-for-maend.
 */
function priceListNote(slug: string, amount: number): string | undefined {
  const source = treatmentPage.priceAliases[slug] ?? slug;
  return priceCards
    .flatMap((card) => card.rows)
    .find((r) => r.treatmentSlug === source && r.price.kind === "amount" && r.price.amount === amount)?.note;
}

/** The short treatment list: copy + link + "fra" price and its note. Throws on an unknown slug. */
export function menTreatmentRows(items: MenPage["treatments"]["items"]): MenTreatmentRow[] {
  return items.map(({ priceNote, ...item }) => {
    const treatment = getTreatment(item.slug);
    if (!treatment) throw new Error(`men: unknown treatment "${item.slug}"`);
    const amount = treatment.priceFrom;
    return {
      ...item,
      treatmentName: treatment.name,
      href: treatmentHref(item.slug),
      price: amount != null ? formatPriceFrom(amount) : undefined,
      priceNote: amount != null ? (priceNote ?? priceListNote(item.slug, amount)) : undefined,
    };
  });
}

/** Price rows, cheapest first (the price list keeps the live site's order). */
export function menPriceRows(rows: readonly PriceListRow[]): MenPriceRow[] {
  const amount = (r: PriceListRow) => (r.price.kind === "amount" ? r.price.amount : Number.POSITIVE_INFINITY);
  return [...rows]
    .sort((a, b) => amount(a) - amount(b))
    .map((r) => ({ label: r.label, note: r.note, price: formatPriceValue(r.price) }));
}

/** The practitioners in "Dine behandlere", in the copy's order. Throws on an unknown slug. */
export function menCarePeople(people: MenPage["care"]["people"]): MenCarePerson[] {
  return people.map(({ slug, position }) => {
    const member = getTeamMember(slug);
    if (!member) throw new Error(`men: unknown team member "${slug}"`);
    return { member, profileHref: teamMemberHref(slug), position };
  });
}

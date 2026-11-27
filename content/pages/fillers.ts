import type { ImageRef, Link, Treatment, TreatmentSection } from "../types";
import { site } from "@/config/site";
import { mainNav, treatmentCategories } from "../navigation";
import { priceCards } from "../prices";
import { routes } from "../routes";
import { getTreatment } from "../treatments";
import { treatmentPage } from "./treatments";

/**
 * /behandlinger/fillers — "Filler hos Fillox", the fillers category's own page (no design: built
 * from the treatment page's hero, a long-form "plain" section, the /behandlinger cards and the
 * closing rose band).
 *
 * Source: Alberte (kosmetisk sygeplejerske at Fillox), 2026-11-26, forwarded by the owner:
 * "Opret Filler som underside under Behandlinger. Vis en kort introduktion øverst og de ni
 * behandlingskort nedenunder. Hvert kort får en pris og en Læs mere-knap. Afslut oversigten med
 * Book en konsultation." Her texts are used verbatim: "Filler hos Fillox" (the H1), "Vi forbedrer,
 * vi forandrer ikke" (the H1's second line, lower-case after the dash as on the treatment pages)
 * and its paragraph (the lead), "Hvad er filler?" (two paragraphs) and "Behandlingsområder" (nine
 * cards: her names and card texts, in her order). The site added (each `TODO: copy review`): the
 * meta title and description, the breadcrumb, the hero's link to the cards, "Se alle priser" and
 * the closing band's heading and line (the treatment pages' own).
 *
 * Prices: each card's "fra" price is its treatment's `priceFrom`, the lowest price-list row tagged
 * with it (content/prices.ts), never typed here. Every card links to its treatment page ("Læs
 * mere"). Three areas got a page for this (content/treatments.ts): "Tindinger", "Linjer og folder"
 * (marionet- and nasolabiale linjer) and "Fillox Signatur" (ansigtskonturering).
 *
 * Fillers are medical devices: the brand (Revanesse®) may be named, but no claim the source does
 * not document; no results are promised (the cards say what a treatment aims at). No before/after
 * photo and no rynkebehandling photo on this page: the hero is the fillers category photo, the
 * cards have none.
 */

/** Slug of the fillers category (content/navigation.ts) and of its price card's category. */
const FILLERS = "fillers";

/** A treatment of the fillers category, by slug. Throws on an unknown slug or a missing price. */
function fillerTreatment(slug: string): Treatment & { priceFrom: number } {
  const treatment = getTreatment(slug);
  if (!treatment) throw new Error(`fillers page: no treatment "${slug}"`);
  if (treatment.categorySlug !== FILLERS) throw new Error(`fillers page: "${slug}" is not in the fillers category`);
  if (treatment.priceFrom === undefined) throw new Error(`fillers page: no "fra" price for "${slug}"`);
  return treatment as Treatment & { priceFrom: number };
}

const category = treatmentCategories.find((c) => c.slug === FILLERS);
if (!category) throw new Error(`fillers page: no treatment category "${FILLERS}"`);

const priceCard = priceCards.find((c) => c.categorySlug === FILLERS);
if (!priceCard) throw new Error(`fillers page: no price card for "${FILLERS}"`);

const overviewLabel = mainNav.find((item) => item.kind === "treatments")?.label;
if (!overviewLabel) throw new Error("fillers page: no treatments item in mainNav");

const heroImage: ImageRef | undefined = treatmentPage.categoryImages[FILLERS];
if (!heroImage) throw new Error(`fillers page: no category image "${FILLERS}"`);

/** Alberte's nine cards: her name for the area, her text, and the treatment page it opens. */
const areaCards: { slug: string; title: string; text: string }[] = [
  {
    slug: "lip-filler",
    title: "Læber",
    text: "Lidt mere fylde, en tydeligere læbekontur eller bedre balance mellem over- og underlæben.",
  },
  {
    slug: "kindben",
    title: "Kindben og kinder",
    text: "Genskab tabt fylde, eller fremhæv kindbenenes naturlige kontur med et diskret løft i kindområdet.",
  },
  {
    slug: "tear-trough",
    title: "Under øjnene (tear trough)",
    text: "Filler kan blødgøre overgangen mellem det nedre øjenlåg og kinden, når en fordybning bidrager til skyggen under øjet.",
  },
  {
    slug: "hage",
    title: "Hage",
    text: "Tilfør volumen for at fremhæve hagens kontur og skabe balance mellem hage, kæbelinje og profil.",
  },
  {
    slug: "kaebelinje",
    title: "Kæbelinje",
    text: "Fremhæv kæbelinjen med bløde overgange eller en tydeligere kæbevinkel og en mere markeret kontur.",
  },
  {
    slug: "naesekorrektion",
    title: "Næsekorrektion med filler",
    text: "Små justeringer kan i udvalgte tilfælde få næsens profil til at fremstå mere jævn.",
  },
  {
    slug: "tindinger",
    title: "Tindinger",
    text: "Genskab fylde ved tindingerne, og blødgør overgangen mellem pande og kindben.",
  },
  {
    slug: "linjer-og-folder",
    title: "Linjer og folder",
    text: "Blødgør nasolabiale folder fra næsen til mundvigene eller marionetlinjer fra mundvigene ned mod hagen.",
  },
  {
    slug: "ansigtskonturering",
    title: "Fillox Signatur",
    text: "Ansigtskonturering med en individuel plan, hvor vi ser på flere områder i sammenhæng og diskret genskaber volumen og fremhæver konturer.",
  },
];

// The page lists every page of the category once (the menus list the same, content/navigation.ts):
// a new filler page needs its card here.
{
  const onPage = areaCards.map((card) => card.slug);
  const missing = category.treatments.filter((slug) => !onPage.includes(slug));
  const twice = onPage.filter((slug, i) => onPage.indexOf(slug) !== i);
  if (missing.length || twice.length) {
    throw new Error(`fillers page: cards missing for ${missing.join(", ") || "none"}; listed twice: ${twice.join(", ") || "none"}`);
  }
}

// TODO: copy review (2026-11-26, Alberte) — the page is new; her texts verbatim, the site's
// additions listed in the header.
export const fillersPage = {
  path: routes.fillers,

  meta: {
    // The H1 and its second line; it names the brand, so no " · Fillox" after it (absoluteTitle).
    title: "Filler hos Fillox – vi forbedrer, vi forandrer ikke",
    absoluteTitle: true,
    // ≤ 160 characters. TODO: copy review (2026-11-26, Alberte)
    description:
      "Filler hos Fillox: diskrete forbedringer, der fremhæver dine naturlige træk. Se behandlingsområderne, fra læber og kindben til kæbelinje, med priser.",
  },

  /** Share image: the hero photo (its link-preview crop, content/photos.ts → sproejte). */
  shareImage: heroImage,

  /** The category's name: the breadcrumb's last crumb (this page), as on the filler pages. */
  name: category.name,
  /** The breadcrumb's first crumb (the overview), as on the treatment pages. */
  overviewLink: { label: overviewLabel, href: routes.treatments } satisfies Link,
  /** Breadcrumb for the BreadcrumbList structured data (the hero shows the same crumbs). */
  breadcrumb: [
    { label: overviewLabel, href: routes.treatments },
    { label: category.name, href: routes.fillers },
  ] satisfies Link[],

  hero: {
    title: "Filler hos Fillox",
    titleAccent: "vi forbedrer, vi forandrer ikke",
    lead: "Hos Fillox arbejder vi med diskrete forbedringer, der fremhæver dine naturlige træk. Måske ønsker du at genskabe lidt fylde, fremhæve en kontur eller skabe mere balance mellem ansigtets forskellige områder. Vi tager udgangspunkt i dit ansigt og det, du ønsker at opnå.",
    /**
     * The fillers category photo, as on the filler pages (a practitioner with a syringe: fine on
     * filler pages, never on a rynkebehandling page; no practitioner is named here).
     */
    image: heroImage,
    // Alberte's CTA ("Book en konsultation") and a link to the cards. TODO: copy review
    primaryCta: { label: "Book en konsultation", href: site.booking.href } satisfies Link,
    secondaryCta: { label: "Se behandlingsområder", href: "#behandlingsomraader" } satisfies Link,
  },

  /** "Hvad er filler?": a long-form plain section (components/treatment/LongformSections). */
  sections: [
    {
      id: "hvad-er-filler",
      title: "Hvad er filler?",
      paragraphs: [
        "Hos Fillox bruger vi Revanesse®, en serie af ikke-permanente fillers baseret på hyaluronsyre. Filleren er en gel, der injiceres i udvalgte områder for at tilføre volumen eller fremhæve konturer.",
        "Når vi møder dig første gang, tager vi os tid til at lytte til dine ønsker og svare på dine spørgsmål. Din behandler vurderer, om filler er egnet til dig, og tilpasser teknik, placering og mængde til din anatomi og det udtryk, du ønsker.",
      ],
    },
  ] satisfies TreatmentSection[],

  areas: {
    id: "behandlingsomraader",
    title: "Behandlingsområder",
    /** To the fillers card on /priser (every row of the nine pages). */
    pricesLink: { label: treatmentPage.prices.allPricesLink.label, href: `${routes.prices}#${priceCard.id}` } satisfies Link,
    cards: areaCards.map((card) => ({ ...card, treatment: fillerTreatment(card.slug) })),
  },

  /** Closing band: the treatment pages' heading and line, with Alberte's "Book en konsultation". */
  cta: {
    id: "book",
    title: treatmentPage.booking.title,
    text: treatmentPage.booking.fallbackText,
    cta: { label: "Book en konsultation", href: site.booking.href } satisfies Link,
  },
};

export type FillersPage = typeof fillersPage;

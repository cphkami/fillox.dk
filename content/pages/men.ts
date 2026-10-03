import type { FaqItem, ImageRef, Link } from "../types";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { priceCards } from "../prices";
import { routes } from "../routes";
import { getTreatment } from "../treatments";
import { treatmentPage } from "./treatments";

/**
 * /behandlinger/for-maend — the landing page for men (the owner, round 3: "fewer treatments,
 * cleaner, a more masculine look"; it replaces the "For mænd" section at the bottom of
 * /behandlinger, which the menus linked to as /behandlinger#for-maend and so opened at the
 * bottom of that page). No design: built from the site's tokens in the darker neutrals
 * (espresso, sand, krem, bronze rules), no rose bands.
 *
 * No reviews on this page: it lists Botox for mænd, and the Botox pages show none
 * (content/reviews.ts → treatmentsWithoutReviews).
 *
 * Not about choosing a male practitioner (the owner, round 4: it is rather the opposite, men are
 * glad that e.g. Alberte takes good care of them). The page says nothing about a practitioner's
 * gender and offers no choice of practitioner; the "Dine behandlere" section is about care.
 *
 * Prices are read from the price list through the treatments (Treatment.priceFrom) and the
 * "Laserpakker for mænd" card (content/prices.ts → id "laser-maend"), never typed here. The
 * prices sit on the treatment rows (with the price list's note, e.g. "op til 1 ml"); the laser
 * packages fold out under the list, so one treatment does not outweigh the other three.
 *
 * Tone (the owner, round 5: "more personal, maybe some humour; men want laser hair removal"):
 * warm, direct, "du", short sentences, a wink at most a few times (the hero, the laser row, the
 * first FAQ question). The hero's joke is about reach and the shaver (nobody shaves his own
 * back with ease), not about hairy backs: no line judges a body trait or implies that anyone
 * needs a treatment. The humour stays on the laser / everyday side. Facts are only the site's
 * own (prices from the price list, durations, laser course 6–8 treatments, PRF as a course, the
 * jawline's 3–8 ml, kontrol after ~14 days, vagtlæge 24/7, gratis konsultation, læger og
 * sygeplejersker); no promised results, no reviews, no claim about what men "most often" want
 * (the order of the treatments is the owner's: laser, hair loss, jawline, wrinkle treatment).
 *
 * Botox is a prescription medicine (lægemiddellovens § 66): the page calls it "rynkebehandling"
 * and never names the product, keeps it out of the promotional lines (meta description, teaser,
 * hero) and describes it soberly beside a factual price (no hype, no jokes, no offer or
 * financing wording). The row still links to the Botox for mænd page, and the ItemList in
 * components/men/MenJsonLd.tsx keeps the treatment pages' own names; both wait for the owner's
 * legal decision (README checklist).
 *
 * Headings have no full stop (house style), except the H1: its two lines are a tagline
 * ("Behandlinger til mænd. / Uden dikkedarer."), and the stops keep the lines apart when the
 * heading is read as one string (the lines are block spans with no space between).
 */

/** Slug of the "For mænd" category (content/navigation.ts); the overview's teaser keeps it as its id. */
export const menCategorySlug = "for-maend";

/** Id of the price card shown on the page (content/prices.ts). */
const LASER_CARD = "laser-maend";

/** A treatment's "fra" amount. Throws when the treatment or its price is gone. */
function priceFrom(slug: string): number {
  const amount = getTreatment(slug)?.priceFrom;
  if (amount === undefined) throw new Error(`men: no priceFrom for treatment "${slug}"`);
  return amount;
}

/** "fra 799 kr" */
const from = (amount: number) => `fra ${formatPrice(amount)}`;

const laserCard = priceCards.find((c) => c.id === LASER_CARD);
if (!laserCard) throw new Error(`men: no price card "${LASER_CARD}"`);

const menShareImage: ImageRef | undefined = treatmentPage.categoryImages[menCategorySlug];
if (!menShareImage) throw new Error(`men: no category image "${menCategorySlug}"`);

// TODO: copy review — the whole page (round 5 rewrite: personal, lightly humorous; not from the
// live site). Open for Fillox: (1) are the laser prices per area per session? If so, the laser
// row's note becomes "pr. område pr. behandling" and the price answer can say so; until then it
// says that a course is 6–8 treatments and that the consultation gives the course's price.
// (2) "Rynkebehandling" in place of "Botox" on this page, pending the legal review (see above).
export const menPage = {
  path: routes.men,

  meta: {
    title: "Behandlinger til mænd",
    description:
      "Laser hårfjerning, behandling af hårtab og kæbelinje til mænd hos Fillox. Uden dikkedarer: konsultation og kontrol er gratis, og der er vagtlæge døgnet rundt.",
  },

  /**
   * Share image: the men's treatment pages' hero photo, the Fillox logo on the clinic wall
   * (content/pages/treatments.ts → categoryImages["for-maend"], 800 × 533). Neutral: no person,
   * so the card does not pick a practitioner for the page.
   */
  shareImage: menShareImage,

  /** Accessible name of the breadcrumb <nav>. */
  breadcrumbLabel: "Brødkrumme",
  /** Breadcrumb (also the BreadcrumbList structured data). The last crumb is this page. */
  breadcrumb: [
    { label: "Behandlinger", href: routes.treatments },
    { label: "For mænd", href: routes.men },
  ] satisfies Link[],

  hero: {
    /** H1, in two lines: the second in bronze. Full stops on purpose (a tagline, see the header). */
    title: "Behandlinger til mænd.",
    titleAccent: "Uden dikkedarer.",
    /** The lead's opening wink, one line per sentence (heading font, full krem), above the lead. */
    // The owner's own line (2026-10-03), approved for the hero.
    leadHook: ["Ingen har nogensinde savnet en behåret ryg.", "Laseren når hele vejen rundt."] as string[],
    lead: "Først en konsultation, så en plan. Vi behandler kun, når det giver mening for dig.",
    primaryCta: { label: "Book gratis konsultation", href: site.booking.href } satisfies Link,
    secondaryCta: { label: "Se behandlingerne", href: "#behandlinger" } satisfies Link,
    /** Label of the fact row under the H1 and buttons. */
    factsLabel: "Det kan du regne med",
    facts: [
      { title: "Gratis konsultation", text: "Vi lytter, før vi behandler." },
      // Wrinkle treatment and fillers only: live, laser is done by staff trained in Fillox Academy
      // (as the /behandlinger intro, content/pages/treatments.ts → treatmentsOverview.intro).
      { title: "Læger og sygeplejersker", text: "Står for rynkebehandling og fillers hos os." },
      { title: "Vagtlæge 24/7", text: "Også når du er kommet hjem." },
    ],
  },

  /**
   * The short list, in the owner's order (laser first). `slug` is the treatment page the row
   * links to (and its "fra" price); `name` drops "for mænd", which the page already says, and the
   * Botox for mænd row is "Rynkebehandling" (see the header). The one-liners are this page's own
   * (content/treatments.ts → `short` is used by the menus and the overview); the laser line names
   * areas from the cheapest (lænd, hals: the "fra" price) up. `priceNote` is shown after the "fra"
   * price; without it the note of the price-list row that sets the price is used (kæbelinje:
   * "op til 1 ml").
   */
  treatments: {
    id: "behandlinger",
    eyebrow: "Behandlinger",
    title: "Det kan vi hjælpe dig med",
    intro: "Vi planlægger efter mænds hud, hår og anatomi, men først og fremmest efter dig. Målet er, at du stadig ligner dig selv.",
    items: [
      {
        slug: "laser-for-maend",
        name: "Laser hårfjerning",
        text: "Fra mindre områder som lænd og hals til ryg, skuldre og bryst. Til dig, der er træt af skraberen.",
        priceNote: "pr. område",
      },
      {
        slug: "hartab-for-maend",
        name: "Hårtab (PRF)",
        text: "Er håret begyndt at blive tyndere? Vi behandler hovedbunden med PRF fra dit eget blod og mesoterapi for at styrke det hår, du har.",
        priceNote: "1 behandling",
      },
      {
        slug: "kaebelinje-for-maend",
        name: "Kæbelinje",
        text: "Filler, der giver en skarpere kæbelinje og en mere markant profil. Formet efter dit ansigt, ikke efter en skabelon.",
      },
      {
        slug: "botox-for-maend",
        name: "Rynkebehandling",
        text: "Vi doserer efter mænds mimik og muskulatur. Før din første behandling har du altid en konsultation hos en læge.",
        priceNote: "pr. område",
      },
    ] as { slug: string; name: string; text: string; priceNote?: string }[],
    /**
     * The real men's price list, "Laserpakker for mænd" (live: the "Mænd" list under laser),
     * folded out under the list. Same facts as the laser-for-maend page's price intro, plus the
     * course length.
     */
    laserPackages: {
      id: "priser",
      title: laserCard.title,
      /** After the title in the closed row: "8 pakker · fra 1.000 kr". */
      summary: (count: number, fromAmount: string) => `${count} pakker · fra ${fromAmount}`,
      intro: `Faste priser på kombinerede områder. Enkeltområder koster ${from(priceFrom("laser-for-maend"))} og står på prislisten. Et forløb er typisk 6–8 behandlinger.`,
      rows: laserCard.rows,
    },
    pricesLink: { label: "Se alle priser", href: routes.prices } satisfies Link,
  },

  process: {
    id: "forloeb",
    eyebrow: "Forløbet",
    title: "Sådan foregår det",
    /**
     * Beside the heading from 1024px (under it below): sums up the steps, no new claims (the
     * price is set in the plan, step 2; the follow-up is the free check, step 4).
     */
    intro: "Ingen overraskelser: du kender planen og prisen, før vi går i gang, og vi følger op bagefter.",
    steps: [
      {
        title: "Konsultation",
        // "vi fraråder lige så gerne, som vi anbefaler": the om-os line (content/pages/about.ts).
        text: "Gratis og uforpligtende. Du fortæller, hvad du gerne vil, og vi fraråder lige så gerne, som vi anbefaler.",
      },
      {
        title: "Plan",
        text: "Du får en plan med behandling, omfang og pris. Vi behandler først, når du har sagt ja.",
      },
      {
        title: "Behandling",
        text: "I en af vores klinikker. Selve behandlingen tager typisk 20–40 minutter, og bagefter kan du som regel tage direkte tilbage på arbejde.",
      },
      {
        title: "Kontrol",
        text: "Cirka 14 dage efter kan du booke en gratis kontrol, og du kan ringe til vores vagtlæge døgnet rundt.",
      },
    ],
  },

  /**
   * "Dine behandlere": care, not gender (see the header). Three practitioners from
   * content/team.ts with their own quotes from fillox.dk/om-os: Alberte (the owner's example),
   * Annika (the Botox page's practitioner) and Maria (fillers & Botox, the lip filler page's
   * practitioner), so the people match the treatments on the list. Each card links to the
   * practitioner's profile; no "Book tid hos …": the booking calendar cannot preselect a
   * practitioner (lib/booking.ts → practitionerBookingHref). `position` is the portrait crop in
   * the 4:5 slot (object-position: the faces sit at different heights in the photos).
   */
  care: {
    id: "behandlere",
    eyebrow: "Dine behandlere",
    title: "Du er i gode hænder",
    intro: "Lidt skeptisk? Fair nok. Vi forklarer, hvad vi gør og hvorfor, svarer på alt, du spørger om, og tager os godt af dig hele vejen.",
    people: [
      { slug: "alberte", position: "50% 30%" },
      { slug: "annika", position: "50% 42%" },
      { slug: "maria", position: "50% 18%" },
    ] as { slug: string; position: string }[],
    teamLink: { label: "Mød hele teamet", href: routes.aboutTeam } satisfies Link,
  },

  /**
   * Answers are conservative summaries of the site's facts (laser: content/treatments.ts →
   * laserAbout; Botox: botoxFaq; fillers: fillerFaq and the jawline's 3–8 ml; PRF as a course:
   * content/pages/treatments.ts). The first question is the page's honest line about discretion:
   * who is told is up to the reader, but redness, swelling or bruises can show (after fillers for
   * up to a week). The price answer gives the whole picture (course lengths, the jawline's usual
   * amount) and no financing next to the wrinkle treatment's price: that stays on /priser.
   */
  faq: {
    id: "faq",
    title: "Ofte stillede spørgsmål",
    items: [
      {
        question: "Opdager kollegerne det?",
        answer:
          "Det er op til dig, hvem du fortæller det til, og vi behandler dine oplysninger fortroligt. Efter de fleste behandlinger kan du gå direkte tilbage til hverdagen, men der kan komme rødme, hævelse eller blå mærker: efter laser typisk i nogle timer, efter fillers op til en uge. Står der et bryllup eller et vigtigt møde i kalenderen? Sig det ved konsultationen, så planlægger vi efter det.",
      },
      {
        question: "Gør det ondt?",
        answer:
          "Det er forskelligt fra person til person, men vi gør det så behageligt som muligt. Laseren har indbygget køling, vores fillers er tilsat et bedøvelsesmiddel, og ved rynkebehandling bruger vi en meget tynd nål.",
      },
      {
        question: "Hvor mange laserbehandlinger skal jeg have?",
        answer:
          "Typisk 6–8 behandlinger med 4–8 ugers mellemrum. Laseren virker bedst på hår i vækstfasen, og ikke alle hår er i den fase på samme tid. Det kan ikke garanteres, at alle hår forsvinder, men hår, der vokser tilbage, er ofte tyndere og lysere.",
      },
      {
        question: "Hvor lang tid tager det?",
        answer:
          "Selve behandlingen tager typisk 20–40 minutter. Rynkebehandling sker med et receptpligtigt lægemiddel, så før den første behandling har du en lovpligtig lægekonsultation på cirka 15 minutter. Den er gratis.",
      },
      {
        question: "Hvad koster det?",
        answer: `Laser hårfjerning koster ${from(priceFrom("laser-for-maend"))} pr. område, og et forløb er typisk 6–8 behandlinger. Til mænd er der også faste pakkepriser på kombinerede områder som ryg, skuldre og bryst. PRF mod hårtab koster ${from(priceFrom("hartab-for-maend"))} for én behandling og gives typisk som en kur over flere behandlinger. Kæbelinje koster ${formatPrice(priceFrom("kaebelinje-for-maend"))} for op til 1 ml, men ofte skal der mere filler til, og 3–8 ml kan være nødvendigt. Rynkebehandling koster ${from(priceFrom("botox-for-maend"))} pr. område. Ved konsultationen får du den endelige pris, også på et helt forløb.`,
      },
    ] satisfies FaqItem[],
  },

  cta: {
    id: "book",
    title: "Det starter med en snak",
    text: "Første konsultation er altid gratis. Du får en ærlig vurdering og bestemmer selv, om du vil gå videre.",
    primaryCta: { label: "Book gratis konsultation", href: site.booking.href } satisfies Link,
    /** Before the phone number: "Eller ring på 35 10 00 50". */
    phonePrefix: "Eller ring på",
  },

  /**
   * Teaser on /behandlinger, in place of the old "For mænd" section; it keeps id="for-maend"
   * (menCategorySlug), so old /behandlinger#for-maend links still land on it.
   */
  teaser: {
    eyebrow: "For mænd",
    title: "Behandlinger til mænd",
    text: "Laser hårfjerning, behandling af hårtab, kæbelinje og rynkebehandling, planlagt efter mænds anatomi og dine ønsker.",
    cta: { label: "Se behandlinger til mænd", href: routes.men } satisfies Link,
  },
};

export type MenPage = typeof menPage;

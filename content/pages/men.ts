import type { FaqItem, ImageRef, Link } from "../types";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { priceCards } from "../prices";
import { routes } from "../routes";
import { getTreatment } from "../treatments";

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
 * Prices are read from the price list through the treatments (Treatment.priceFrom) and the
 * "Laserpakker for mænd" card (content/prices.ts → id "laser-maend"), never typed here. The
 * prices sit on the treatment rows (with the price list's note, e.g. "op til 1 ml"); the laser
 * packages fold out under the list, so one treatment does not outweigh the other three.
 * Copy marked `// TODO: copy review` is not from the live site and needs Fillox's review.
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

export const menPage = {
  path: routes.men,

  // TODO: copy review
  meta: {
    title: "Behandlinger til mænd",
    description:
      "Botox, kæbelinje, hårtab og laser hårfjerning til mænd hos Fillox. Diskret og naturligt, med gratis konsultation og mulighed for en mandlig behandler.",
  },

  /**
   * Share image: Dr. Tom in the clinic (the wide team photo, 1320 × 880; a 1.91 : 1 crop keeps
   * his face). The default share image shows two women.
   */
  shareImage: {
    src: "/images/team/tom-wide.jpg",
    alt: "Dr. Tom Haugland, æstetisk læge og daglig leder hos Fillox",
    width: 1320,
    height: 880,
  } satisfies ImageRef,

  /** Accessible name of the breadcrumb <nav>. */
  breadcrumbLabel: "Brødkrumme",
  /** Breadcrumb (also the BreadcrumbList structured data). The last crumb is this page. */
  breadcrumb: [
    { label: "Behandlinger", href: routes.treatments },
    { label: "For mænd", href: routes.men },
  ] satisfies Link[],

  // TODO: copy review (hero, facts)
  hero: {
    /** H1, in two lines: the second in bronze. */
    title: "Behandlinger til mænd.",
    titleAccent: "Diskret og naturligt.",
    lead: "Udvalgte behandlinger, planlagt efter mænds ansigt, hud og hår. Du starter altid med en gratis konsultation, og vi behandler kun, når det giver mening.",
    primaryCta: { label: "Book gratis konsultation", href: site.booking.href } satisfies Link,
    secondaryCta: { label: "Se behandlingerne", href: "#behandlinger" } satisfies Link,
    /** Label of the fact row under the H1 and buttons. */
    factsLabel: "Det kan du regne med",
    facts: [
      { title: "Gratis konsultation", text: "Vi vurderer dine ønsker, før vi behandler." },
      // Not "book directly with": the booking calendar cannot preselect a practitioner yet
      // (lib/booking.ts → practitionerBookingHref).
      { title: "Mandlige behandlere", text: "Du kan bede om Dr. Tom eller Mike." },
      { title: "Vagtlæge 24/7", text: "Også når du er kommet hjem." },
    ],
  },

  /**
   * The short list. `slug` is the treatment page the row links to (and its "fra" price);
   * `name` drops "for mænd", which the page already says. Botox, kæbelinje and hårtab keep their
   * one-liners from content/treatments.ts; the laser line is shorter than the treatment's.
   * `priceNote` is shown after the "fra" price; without it the note of the price-list row that
   * sets the price is used (kæbelinje: "op til 1 ml").
   */
  // TODO: copy review (titles, intro, laser line, price notes)
  treatments: {
    id: "behandlinger",
    eyebrow: "Behandlinger",
    title: "Fire behandlinger. Planlagt til mænd.",
    intro: "Det, mænd oftest kommer for. Vi doserer og planlægger efter mænds anatomi, så resultatet passer til dit udtryk.",
    items: [
      { slug: "botox-for-maend", name: "Botox", text: "Rynkebehandling doseret efter mænds mimik og muskulatur.", priceNote: "pr. område" },
      { slug: "kaebelinje-for-maend", name: "Kæbelinje", text: "Filler, der giver en mere markant kæbelinje og en skarpere profil." },
      { slug: "hartab-for-maend", name: "Hårtab (PRF)", text: "PRF og mesoterapi i hovedbunden ved hårtab og tyndere hår.", priceNote: "1 behandling" },
      { slug: "laser-for-maend", name: "Laser hårfjerning", text: "Diodelaser på ryg, skuldre, bryst, nakke og skæglinje.", priceNote: "pr. område" },
    ] as { slug: string; name: string; text: string; priceNote?: string }[],
    /**
     * The real men's price list, "Laserpakker for mænd" (live: the "Mænd" list under laser),
     * folded out under the list. Same facts as the laser-for-maend page's price intro.
     */
    laserPackages: {
      id: "priser",
      title: laserCard.title,
      /** After the title in the closed row: "8 pakker · fra 1.000 kr". */
      summary: (count: number, fromAmount: string) => `${count} pakker · fra ${fromAmount}`,
      intro: `Faste priser på kombinerede områder. Enkelte områder koster ${from(priceFrom("laser-for-maend"))} og står på prislisten.`,
      rows: laserCard.rows,
    },
    pricesLink: { label: "Se alle priser", href: routes.prices } satisfies Link,
  },

  // TODO: copy review (step texts)
  process: {
    id: "forloeb",
    eyebrow: "Forløbet",
    title: "Sådan foregår det",
    steps: [
      {
        title: "Konsultation",
        text: "Gratis og uforpligtende. Vi taler om, hvad du ønsker, og vurderer, om behandlingen giver mening for dig.",
      },
      {
        title: "Plan",
        text: "Du får en plan med behandling, mængde og pris, inden vi går i gang. Den endelige pris aftales her.",
      },
      {
        title: "Behandling",
        text: "I en af vores klinikker. Selve behandlingen tager typisk 20–40 minutter.",
      },
      {
        title: "Kontrol",
        text: "Cirka 14 dage efter kan du booke en gratis kontrol, og vores vagtlæge kan kontaktes døgnet rundt.",
      },
    ],
  },

  /**
   * Practitioners (content/team.ts): the male members of the team, as practitioners. Their
   * booking links (/booking?behandler=<slug>, lib/booking.ts) do NOT preselect them: neither
   * Gecko nor TIMMA reads the parameter, so the copy says "ask for", not "book directly with".
   * The live site does not say who performs which treatment, so the copy only offers a male
   * practitioner, it does not assign treatments.
   */
  // TODO: copy review
  practitioners: {
    id: "behandlere",
    eyebrow: "Dine behandlere",
    title: "Foretrækker du en mandlig behandler?",
    intro: "Så kan du bede om Dr. Tom eller Mike, når du booker, eller ringe til os. Du kan også vælge en af vores andre behandlere.",
    slugs: ["tom", "mike"],
    bookLabel: (name: string) => `Book tid hos ${name}`,
    profileLabel: (name: string) => `Læs mere om ${name}`,
    teamLink: { label: "Mød hele teamet", href: routes.aboutTeam } satisfies Link,
  },

  // TODO: copy review (answers are conservative summaries of the treatment pages' facts)
  faq: {
    id: "faq",
    title: "Ofte stillede spørgsmål",
    items: [
      {
        question: "Er det diskret?",
        answer:
          "Ja. Du booker online, og vi behandler dine oplysninger fortroligt. Efter de fleste behandlinger kan du gå direkte tilbage til hverdagen, men der kan komme lidt rødme, hævelse eller små blå mærker de første dage.",
      },
      {
        question: "Hvor lang tid tager det?",
        answer:
          "Selve behandlingen tager typisk 20–40 minutter. Før din første botoxbehandling har du en lovpligtig lægekonsultation på cirka 15 minutter, som er gratis.",
      },
      {
        question: "Gør det ondt?",
        answer:
          "Det er forskelligt fra person til person, men vi gør det så behageligt som muligt: vores fillers er tilsat et bedøvelsesmiddel, botox gives med en meget tynd nål, og laseren har indbygget køling.",
      },
      {
        question: "Hvad koster det?",
        answer: `Botox koster ${from(priceFrom("botox-for-maend"))}, kæbelinje ${from(priceFrom("kaebelinje-for-maend"))} (op til 1 ml), PRF mod hårtab ${from(priceFrom("hartab-for-maend"))} og laser hårfjerning ${from(priceFrom("laser-for-maend"))} pr. område. Den endelige pris aftales ved den gratis konsultation, og du kan dele betalingen op i rater.`,
      },
    ] satisfies FaqItem[],
  },

  // TODO: copy review
  cta: {
    id: "book",
    title: "Klar til en uforpligtende snak?",
    text: "Første konsultation er altid gratis, og du bestemmer selv, om du vil gå videre.",
    primaryCta: { label: "Book gratis konsultation", href: site.booking.href } satisfies Link,
    /** Before the phone number: "Eller ring på 35 10 00 50". */
    phonePrefix: "Eller ring på",
  },

  /**
   * Teaser on /behandlinger, in place of the old "For mænd" section; it keeps id="for-maend"
   * (menCategorySlug), so old /behandlinger#for-maend links still land on it.
   */
  // TODO: copy review
  teaser: {
    eyebrow: "For mænd",
    title: "Behandlinger til mænd",
    text: "Botox, kæbelinje, hårtab og laser hårfjerning, planlagt efter mænds anatomi. Diskret og naturligt.",
    cta: { label: "Se behandlinger for mænd", href: routes.men } satisfies Link,
  },
};

export type MenPage = typeof menPage;

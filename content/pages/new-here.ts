// Translated from the agency's Norwegian draft (Drive, 2026-10-08) — TODO: copy review by Fillox
import type { FaqItem, ImageRef, Link } from "../types";
import { site } from "@/config/site";
import { treatmentCategories, treatmentCategoryHref } from "../navigation";
import { routes } from "../routes";
import { getTreatment, treatmentHref } from "../treatments";
import { ui } from "../ui";

/**
 * /ny-hos-fillox — "Ny hos Fillox?", the guide for first-time visitors. No design: built from the
 * site's hero panel, cards, sand panels, the treatment pages' FAQ accordion and mobile book bar.
 *
 * Source: Google Drive › Fillox › Fillox.dk › "Om Fillox og klinikker", tab "Ny hos Fillox"
 * (anette@rent.no, 2026-10-08). The draft is written in Norwegian; this is a faithful Danish
 * translation (same meaning, nothing added), in the site's words ("du", "konsultation",
 * "behandler", "book", "rødme", "hævelse", "blå mærker", "betænkningstid"). The author's
 * [button placeholders] are the links and buttons below; "Skinboostere" / "Fillere" are the
 * site's "Skinboosters" / "Fillers".
 *
 * The author's five recommendations for the page, and how they are met:
 * 1. Max two clicks to booking: every need card has "Book tid" (the booking calendar) next to
 *    its "Læs mere" link. The calendar cannot preselect a treatment (lib/booking.ts), so it is
 *    the same booking page everywhere.
 * 2. Two or three relevant treatments per need, all real pages (`treatments`, by slug; resolved
 *    and checked by components/new-here/view.ts); more behind the "Læs mere" link (`more`). The
 *    draft names "lys- og laserbehandling" for pigment, redness, pores and scars; Fillox has no
 *    such page (only laser hair removal), so that sentence is translated but nothing is linked
 *    for it. PRF hud stands in as the third treatment there (its page: pores, acne scars,
 *    pigmentation).
 * 3. "Book konsultation" as a safety net in every section (hero, the lines-and-wrinkles and
 *    "not sure" cards, the differences, the first visit, the consultation steps, the FAQ, the
 *    closing band).
 * 4. "fra" prices from each treatment's `priceFrom` (the price list), never typed here, and only
 *    where the treatment has one; see `pricesHiddenFor` for the exception.
 * 5. Mobile first: tap targets ≥ 44px, full-width buttons, and the treatment pages' fixed book
 *    bar ("Book tid") below 768px until the closing band.
 *
 * Compliance (prescription medicine, lægemiddellovens § 66): the draft names no prescription
 * medicine and this page names none (product names appear only as treatment page names, e.g.
 * Profhilo, a medical device). Lines and wrinkles link to the "Rynkebehandling" and "Andre
 * behandlingsmuligheder" pages without a price, and the card says "Book konsultation" instead of
 * "Book tid" (`pricesHiddenFor`, `bookCta` on that need); its Microneedling row keeps its price.
 *
 * Copy NOT in the draft (marked `// TODO: copy review`): meta title and description, the
 * "Mulige behandlinger" label, the link labels in "Hvad er forskellen på behandlingerne?", the
 * "Se alle behandlinger", "Se alle priser" and "Kontakt os" links, image choice and alt texts.
 * The hero's in-page link reuses the needs heading; "Book tid" is ui.bookCta.
 */

/** The H1 (also the mobile book bar's label). */
const title = "Ny hos Fillox?";

/** Anchor id of "Hvad ønsker du hjælp til?" (the hero's in-page link goes there). */
const needsId = "hjaelp";

/** Book a consultation: the draft's "Bestill konsultasjon" (the booking calendar). */
const consultationCta: Link = { label: "Book konsultation", href: site.booking.href };

/** A treatment page link. Throws when the treatment is gone (never link a page we do not have). */
function treatmentLink(label: string, slug: string): Link {
  if (!getTreatment(slug)) throw new Error(`new-here: unknown treatment "${slug}"`);
  return { label, href: treatmentHref(slug) };
}

/** A treatment category link (its section on /behandlinger or its own page). Throws when it is gone. */
function categoryLink(label: string, slug: string): Link {
  if (!treatmentCategories.some((c) => c.slug === slug)) throw new Error(`new-here: unknown category "${slug}"`);
  return { label, href: treatmentCategoryHref(slug) };
}

export type NewHereNeed = {
  /** Anchor id of the card. */
  id: string;
  /** H3: the visitor's wish, in the first person. */
  title: string;
  /** Paragraphs. */
  text: string[];
  /** Treatment slugs shown under the text (2–3), each with its "fra" price. */
  treatments: string[];
  /** The draft's link for the need ("Læs mere"). */
  more: Link;
  /** Booking button of the card; defaults to `needs.bookCta`. */
  bookCta?: Link;
};

/** Hero photo, also the share image. */
// TODO: copy review (image choice + alt text)
const heroImage: ImageRef = {
  src: "/images/results/duo-color.jpg",
  alt: "To smilende kvinder foran en beige og rosa baggrund",
  position: "62% 40%",
  width: 1600,
  height: 1096,
};

export const newHerePage = {
  path: routes.newHere,

  // TODO: copy review (not in the draft: built from its subtitle and intro)
  meta: {
    title: "Ny hos Fillox? Find en behandling, der passer til dig",
    description:
      "Usikker på, hvor du skal begynde? Fortæl os, hvad du ønsker hjælp til, så vurderer vi mulighederne sammen. Se, hvad der sker på en konsultation.",
  },

  hero: {
    title,
    /** The draft's H2 under the H1, shown as the hero's subtitle (heading font). */
    subtitle: "Vi hjælper dig med at finde en behandling, der passer til dig",
    intro: [
      "Er du nysgerrig på kosmetiske behandlinger, men usikker på, hvor du skal begynde? Måske ønsker du friskere hud, mindre synlige linjer eller hjælp til noget, du har tænkt på længe.",
      "Du behøver ikke at kende navnene på behandlingerne eller vide, hvad du skal vælge, før du kommer til os. Fortæl os, hvad du ønsker hjælp til, så vurderer vi mulighederne sammen.",
    ],
    image: heroImage,
    primaryCta: consultationCta,
    /** In-page link to the needs (its label is that section's heading). */
    secondaryCta: { label: "Hvad ønsker du hjælp til?", href: `#${needsId}` } satisfies Link,
  },

  needs: {
    id: needsId,
    title: "Hvad ønsker du hjælp til?",
    intro:
      "Det er ofte nemmere at begynde med dit ønske end med navnet på en behandling. Her finder du nogle almindelige udgangspunkter.",
    /** Label above each card's treatments. */
    // TODO: copy review
    treatmentsLabel: "Mulige behandlinger",
    /** Each card's booking button (recommendation 1: straight to the booking calendar). */
    bookCta: { label: ui.bookCta, href: site.booking.href } satisfies Link,
    items: [
      {
        id: "frisk-hud",
        title: "Jeg ønsker friskere hud og mere glød",
        text: [
          "Føles huden tør, gusten eller mindre jævn end før? Hudplejebehandlinger, peelinger, microneedling og visse injektionsbehandlinger kan være relevante, afhængigt af, hvad din hud har brug for.",
          "Vi hjælper dig med at finde en behandling og en hudplejerutine, der passer til dig.",
        ],
        // Signatur ansigtsbehandling: peeling, maske og LED (the hudpleje / peeling treatment);
        // Skinbooster: an injection treatment for "fugt, glød".
        treatments: ["signatur-ansigtsbehandling", "microneedling", "skinbooster"],
        more: categoryLink("Udforsk behandlinger for hudkvalitet og glød", "hudforbedring"),
      },
      {
        id: "linjer-rynker",
        title: "Jeg ønsker at reducere linjer og rynker",
        text: [
          "Linjer kan have forskellige årsager. Nogle bliver tydeligere, når du smiler eller bevæger ansigtet, mens andre også er synlige, når ansigtet er afslappet.",
          "Derfor findes der flere behandlingsmuligheder. Under en konsultation vurderer vi din hud og dine ansigtsbevægelser og forklarer, hvad der kan være relevant for det område, du ønsker hjælp til.",
        ],
        // Rynkebehandling: the hub page on lines and wrinkles (types of lines, approaches);
        // Microneedling: "Fine linjer og rynker" on its page, with a "fra" price (the draft's
        // differences: lines can also come from the skin's quality); Andre behandlingsmuligheder:
        // the hub's other options (lips, sweating, jaw tension), as the brief asked.
        treatments: ["rynkebehandling", "microneedling", "andre-behandlingsmuligheder"],
        // The hub page itself: the category section on /behandlinger only repeats the rows above.
        more: treatmentLink("Læs om behandling af linjer og rynker", "rynkebehandling"),
        // A prescription medicine needs a consultation first: no "Book tid" here (see the header).
        bookCta: consultationCta,
      },
      {
        id: "spaendstighed",
        title: "Jeg oplever, at huden er blevet slappere",
        text: [
          "Med tiden kan huden miste noget af sin spændstighed og fasthed. Måske mærker du det i ansigtet, på halsen eller på kroppen.",
          "Hvad der passer, afhænger blandt andet af hudens kvalitet, det område, du ønsker at behandle, og hvor stor en forandring du ønsker. Vi vurderer, hvilke muligheder der findes, og er tydelige om, hvad du kan forvente.",
        ],
        // Profhilo: løs hud i ansigtet og på halsen; Skinbooster (Ejal 40): strammer slap hud op;
        // Microneedling: tynd og løs hud, also on the body (arms, legs, belly).
        treatments: ["profhilo", "skinbooster", "microneedling"],
        more: categoryLink("Udforsk behandlinger for spændstighed og fasthed", "hudforbedring"),
      },
      {
        id: "hudtone",
        title: "Jeg ønsker hjælp til pigmentpletter, rødme, porer eller ar",
        text: [
          "Ujævn hudtone og hudstruktur kan skyldes forskellige ting, og den samme behandling passer ikke til alle.",
          "Peeling, microneedling eller lys- og laserbehandling kan være relevante alternativer. Vi vurderer din hud, før vi anbefaler en behandling.",
        ],
        // No light / laser skin page exists (see the header); PRF hud: pores, acne scars, pigmentation.
        treatments: ["signatur-ansigtsbehandling", "microneedling", "prf-hud"],
        more: categoryLink("Udforsk behandlinger for jævnere hudtone og struktur", "hudforbedring"),
      },
      {
        id: "volumen",
        title: "Jeg ønsker mere volumen eller tydeligere konturer",
        text: [
          "Måske ønsker du at fremhæve læberne, få mere definerede konturer eller få vurderet områder, der har mistet fylde.",
          "Filler kan være én af mulighederne. Vi ser på ansigtet som en helhed og tager hensyn til dine naturlige træk, proportioner og ønsker, før vi giver en anbefaling.",
        ],
        treatments: ["lip-filler", "kindben", "kaebelinje"],
        more: categoryLink("Læs om filler og ansigtskonturering", "fillers"),
      },
      {
        id: "haarfjerning",
        title: "Jeg ønsker at fjerne uønsket hår",
        text: [
          "Hårfjerning med laser kan reducere uønsket hårvækst. Om behandlingen passer til dig, afhænger blandt andet af hudtype, hårfarve og det område, du ønsker at behandle.",
          "Vi hjælper dig med at forstå behandlingsforløbet, og hvad du kan forvente, før du starter.",
        ],
        treatments: ["laser-harfjerning", "laser-for-maend"],
        // The category has one page: link it, not a section with a single card.
        more: treatmentLink("Læs om hårfjerning med laser", "laser-harfjerning"),
      },
    ] satisfies NewHereNeed[],
    /** The seventh need: no treatments, a consultation (a rose band card after the six). */
    unsure: {
      id: "ved-ikke",
      title: "Jeg ved ikke helt, hvad jeg har brug for",
      text: [
        "Det er et godt udgangspunkt for en konsultation. Du kan fortælle, hvad du ønsker at forbedre, eller bare bede om en vurdering af din hud.",
        "Sammen finder vi ud af, hvilke muligheder der er relevante, hvad du eventuelt bør prioritere, og om behandling er det rigtige for dig.",
      ],
      cta: consultationCta,
    },
  },

  /**
   * Treatments in the needs that show no "fra" price. Rynkebehandling uses a prescription
   * medicine: a price next to "book" on a page that guides new customers reads as an offer.
   * Its page and /priser keep the price. Open for Fillox (legal review).
   */
  pricesHiddenFor: ["rynkebehandling", "andre-behandlingsmuligheder"] as string[],

  differences: {
    id: "forskel",
    title: "Hvad er forskellen på behandlingerne?",
    intro: "Mange behandlinger kan bruges til at forbedre huden, men de virker på forskellige måder.",
    // TODO: copy review (the link labels; the draft has none here). Each links the page that
    // exists for it; "Lys- og laserbehandlinger" links laser hair removal, the only one we offer.
    items: [
      {
        title: "Hudplejebehandlinger og peelinger",
        text: "Bruges blandt andet til at forbedre hudens overflade, glød og jævnhed. Behandlingen tilpasses hudens behov og kan kombineres med produkter til hjemmebrug.",
        link: treatmentLink("Læs om Signatur ansigtsbehandling", "signatur-ansigtsbehandling"),
      },
      {
        title: "Microneedling",
        text: "En behandling med små nåle, der bruges til at stimulere hudens fornyelse og forbedre hudstrukturen.",
        link: treatmentLink("Læs om microneedling", "microneedling"),
      },
      {
        title: "Lys- og laserbehandlinger",
        text: "Forskellige teknologier bruges til forskellige formål, som hårreduktion, pigmentering, rødme eller forbedring af hudkvaliteten. Vi forklarer, hvilken teknologi der eventuelt passer til dig.",
        link: treatmentLink("Læs om laser hårfjerning", "laser-harfjerning"),
      },
      {
        title: "Skinboosters",
        text: "Injektionsbehandlinger, der bruges til at forbedre hudkvaliteten. Forskellige produkter har forskellige egenskaber og anvendelsesområder.",
        link: treatmentLink("Læs om skinboosters", "skinbooster"),
      },
      {
        title: "Fillers",
        text: "Bruges til at tilføre volumen eller forme konturer i udvalgte områder. Produkt og mængde tilpasses området og det ønskede resultat.",
        link: categoryLink("Læs om fillers", "fillers"),
      },
      {
        title: "Rynkebehandling",
        text: "Der findes forskellige tilgange til behandling af rynker. Valget afhænger blandt andet af, om linjerne skyldes ansigtsbevægelser, hudkvalitet eller tab af volumen.",
        link: treatmentLink("Læs om rynkebehandling", "rynkebehandling"),
      },
    ] as { title: string; text: string; link: Link }[],
    outro: "Du behøver ikke at vælge mellem dem på egen hånd. Det er en del af den vejledning, du får hos os.",
    cta: consultationCta,
  },

  firstVisit: {
    id: "foerste-gang",
    title: "Hvad skal jeg booke første gang?",
    blocks: [
      {
        title: "Er du usikker? Vælg konsultation",
        text: [
          // TODO: copy review (one "hvis du …" clause with the draft's list of three: rådgivning før du
          // beslutter dig, sammenligne behandlingsmuligheder, hjælp til flere områder)
          "En konsultation passer til dig, hvis du ønsker rådgivning, før du beslutter dig, vil sammenligne behandlingsmuligheder eller ønsker hjælp til flere områder.",
          "Du behøver ikke at forberede en liste med behandlinger. Det er nok at fortælle, hvad du ønsker hjælp til.",
        ],
        cta: consultationCta,
      },
      {
        title: "Har du allerede fundet en behandling, du er interesseret i?",
        text: [
          "Læs informationen på behandlingssiden, før du booker. Der finder du mere om behandlingen, og hvad du skal vælge ved første besøg.",
          "Nogle behandlinger kræver en separat konsultation eller andre forberedelser, før de kan udføres. Er du i tvivl om, hvilket bookingvalg der er det rigtige, hjælper vi dig gerne.",
        ],
        cta: { label: "Få hjælp til at booke", href: routes.contact } satisfies Link,
        /** To the treatment pages the text refers to. */
        // TODO: copy review (not in the draft)
        secondary: { label: ui.seeAllTreatments, href: routes.treatments } satisfies Link,
      },
    ] as { title: string; text: string[]; cta: Link; secondary?: Link }[],
  },

  consultation: {
    id: "konsultation",
    title: "Hvad sker der på en konsultation?",
    steps: [
      {
        title: "Vi lytter til det, du ønsker",
        text: "Vi begynder med en samtale om, hvad du ønsker hjælp til, og hvad der er vigtigt for dig. Vi spørger også om tidligere behandlinger og relevante helbredsoplysninger.",
      },
      {
        title: "Vi vurderer dit udgangspunkt",
        text: "Behandleren undersøger det pågældende område og vurderer, hvilke alternativer der kan passe. Du får en forklaring på, hvorfor en behandling anbefales – eller hvorfor vi mener, at du bør vælge noget andet eller afstå fra behandling.",
      },
      {
        title: "Du får at vide, hvad du kan forvente",
        text: "Vi gennemgår mulige resultater, begrænsninger, risici, pris og eventuel opfølgning. Du får også at vide, om behandlingen kræver flere besøg, og om du bør planlægge tid til restitution.",
      },
      {
        title: "Du bestemmer vejen videre",
        text: "En konsultation er ikke en forpligtelse til at få behandling. Du kan stille spørgsmål, tænke alternativerne igennem og beslutte dig, når du føler dig klar.",
      },
    ] as { title: string; text: string }[],
    cta: consultationCta,
  },

  faq: {
    id: "faq",
    title: "Ofte stillede spørgsmål",
    items: [
      {
        question: "Skal jeg vide, hvilken behandling jeg ønsker, før jeg kommer?",
        answer:
          "Nej. Du kan booke en konsultation uden at have valgt behandling. Fortæl os, hvad du ønsker hjælp til, så forklarer vi, hvilke muligheder der kan være relevante.",
      },
      {
        question: "Kan jeg få behandling samme dag som konsultationen?",
        answer:
          "Det afhænger af behandlingen og den vurdering, der foretages. Nogle behandlinger kan udføres samme dag, mens andre kræver en separat konsultation, betænkningstid eller forberedelser. Kontakt os, før du booker, hvis du ønsker at afklare det.",
      },
      {
        question: "Hvad koster det at komme i gang?",
        answer:
          "Du finder priserne på konsultationer og behandlinger i vores prisliste. Før en eventuel behandling får du at vide, hvad den vil koste, og om vi anbefaler ét besøg eller et behandlingsforløb.",
      },
      {
        question: "Jeg ønsker et naturligt resultat. Hvordan tager I hensyn til det?",
        answer:
          "Fortæl os, hvad “naturligt” betyder for dig, og hvad du ønsker at bevare. Vi vurderer dine ønsker sammen med dit udgangspunkt og taler om, hvor stor en forandring der er realistisk. Resultater varierer fra person til person.",
      },
      {
        question: "Skal jeg afsætte tid hjemme efter behandlingen?",
        answer:
          "Det kommer an på behandlingen. Nogle giver kun svagt synlige reaktioner, mens andre blandt andet kan give rødme, hævelse eller blå mærker. Fortæl os, hvis du har en vigtig begivenhed eller bestemte planer, så kan vi rådgive dig om tidspunktet.",
      },
    ] satisfies FaqItem[],
    /** The price list the third answer refers to. */
    // TODO: copy review (not in the draft)
    pricesLink: { label: ui.seeAllPrices, href: routes.prices } satisfies Link,
    /** The contact the second answer refers to. */
    // TODO: copy review (not in the draft)
    contactLink: { label: "Kontakt os", href: routes.contact } satisfies Link,
    /** Recommendation 3: "Book konsultation" in this section too (the first answer's consultation). */
    cta: consultationCta,
  },

  closing: {
    /** Also where the mobile book bar slides away. */
    id: "book",
    title: "Begynd med en samtale",
    text: "Du behøver ikke at have alle svarene, før du booker. Hos Fillox får du hjælp til at forstå alternativerne og finde en vej videre, der passer til dig.",
    primaryCta: consultationCta,
    secondaryCta: { label: "Kontakt os for hjælp til at vælge tid", href: routes.contact } satisfies Link,
    /**
     * The draft's [image] at the end of the page: a portrait (1200 × 1500), because from 1024px it
     * fills the band's right column (about square); below 1024px it is a banner, cropped from the
     * brows to the chin (position y 62%). The clinic's logo wall (behandling-3.jpg, 800 × 533)
     * was tried here and lost letters in every crop of that column.
     */
    // TODO: copy review (image choice; alt text as on /behandlinger and the blog)
    image: {
      src: "/images/hero/hero-1.jpg",
      alt: "Kvinde med opsat hår foran en rosa baggrund",
      position: "50% 62%",
      width: 1200,
      height: 1500,
    } satisfies ImageRef,
  },

  /** Fixed book bar below 768px (components/treatment/MobileBookBar): the page title + "Book tid". */
  bookBar: {
    name: title,
    cta: { label: ui.bookCta, href: site.booking.href } satisfies Link,
  },
};

export type NewHerePage = typeof newHerePage;

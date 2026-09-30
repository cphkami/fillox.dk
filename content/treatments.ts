import type { Bestseller, ImageRef, PriceRow, Treatment } from "./types";
import { routes } from "./routes";
import { blogPage } from "./pages/blog";
import { practitionerBookingHref } from "@/lib/booking";
import { formatPrice } from "@/lib/format";
import { site } from "@/config/site";

/**
 * Every treatment. Slugs match content/navigation.ts categories.
 * `priceFrom` comes from the Priser page (design 6b) and the menus (6menu/mm3).
 * `detail` is filled for treatments designed in full (Botox 6bx, Lip filler 6c/mb);
 * the rest render the generic template from name/short/priceFrom.
 *
 * One-liners marked `// TODO: copy review` are not in the design and were written
 * to match its tone; they need a review by Fillox before launch.
 */

/* ------------------------------------------------------------------ helpers */

const from = (amount: number) => `fra ${formatPrice(amount)}`;

const row = (label: string, amount: number, extra: Omit<PriceRow, "label" | "price" | "amount"> = {}): PriceRow => ({
  label,
  price: formatPrice(amount),
  amount,
  ...extra,
});

/** Booking link that preselects a practitioner: /booking?behandler=<slug> (lib/booking.ts). */
const bookWith = practitionerBookingHref;

/** Photos with their intrinsic size (the results section sizes each half from its aspect). */
type Img = Required<Pick<ImageRef, "src" | "width" | "height">>;

const IMG = {
  duoPink: { src: "/images/results/duo-pink.jpg", width: 2000, height: 1228 },
  duoColor: { src: "/images/results/duo-color.jpg", width: 1600, height: 1096 },
  lipsA: { src: "/images/results/before-after-2.jpg", width: 900, height: 1125 }, // design: ba-1654374504608.jpg
  lipsB: { src: "/images/results/before-after-1.jpg", width: 900, height: 638 }, // design: ba-1643630661247.jpg
} satisfies Record<string, Img>;

/** What each placeholder photo actually shows (same wording as its other uses in /content). */
const placeholderAlt: Record<string, string> = {
  [IMG.duoPink.src]: "To smilende kvinder foran en rosa baggrund",
  [IMG.duoColor.src]: "To smilende kvinder foran en beige og rosa baggrund",
  [IMG.lipsA.src]: "Nærbillede af læber",
  [IMG.lipsB.src]: "Nærbillede af læber og hage",
};

/**
 * The design's before/after pairs are placeholders: both halves crop the same stock photo.
 * Their alt text describes that photo, not a treatment result it does not show.
 * TODO: real before/after photos (shared with the patient's consent) from Fillox; then give
 * each half its own alt, e.g. "Læber før behandling med lip filler, 0,5 ml".
 */
const pair = (img: Img): { before: ImageRef; after: ImageRef } => ({
  before: { ...img, alt: placeholderAlt[img.src] ?? "", position: "50% 50%" },
  after: { ...img, alt: placeholderAlt[img.src] ?? "", position: "50% 50%" },
});

const resultsIntro =
  "Rigtige kunder, samme lys og samme vinkel før og efter. Alle billeder er delt med samtykke og uden filtre.";
const relatedPostsIntro =
  "Alt det, du gerne vil vide før din første behandling, skrevet af vores behandlere.";

/* --------------------------------------------------------------- treatments */

export const treatments: Treatment[] = [
  // Fillers
  {
    slug: "lip-filler",
    name: "Lip filler",
    categorySlug: "fillers",
    priceFrom: 999,
    short: "Naturlig volumen og symmetri, formet efter din læbeform og anatomi.",
    detail: {
      title: "Lip Filler",
      lead: "Naturlig volumen og symmetri, formet efter din læbeform og anatomi. Vi doserer konservativt, du kan altid bygge på senere.",
      heroImage: {
        src: IMG.duoPink.src,
        alt: "To smilende kvinder foran en rosa baggrund",
        position: "50% 50%",
        width: 2000,
        height: 1228,
      },
      facts: [
        { label: "Pris", value: from(999) },
        { label: "Varighed", value: "ca. 45 min" },
        { label: "Holdbarhed", value: "9–12 mdr" },
        { label: "Udføres af", value: "Læge / sygeplejerske" },
      ],
      secondaryCta: { label: "Gratis konsultation", href: site.booking.href },
      about: [
        "Lip filler er lavet af hyaluronsyre, det samme fugt- og volumengivende stof, som naturligt findes i huden. Behandlingen kan give diskret volumen, forbedre symmetri og definere læbekanten.",
        "Vi starter altid med en konsultation, hvor din behandler vurderer din anatomi og lægger en plan sammen med dig. Resultatet ses med det samme og sætter sig helt i løbet af 1–2 uger.",
      ],
      goodFor: [
        "Diskret, naturlig volumen",
        "Symmetri og balance",
        "Definition af læbekant",
        "Fugt og friskhed",
      ],
      practitionerSlug: "maria",
      practitionerHeading: "Maria, sygeplejerske, ekspert i fillers & Botox",
      practitionerText:
        "Lip filler hos Fillox udføres af Maria, en detaljeorienteret og holistisk sygeplejerske med flere års erfaring inden for æstetiske behandlinger. Hendes øje for kvalitet og sans for det naturlige resultat skinner igennem i alle behandlinger.",
      practitionerQuote:
        "Det vigtigste for mig er, at mine kunder føler sig trygge, og at deres naturlige skønhed fremhæves.",
      resultsTitle: "Resultater med lip filler",
      resultsIntro,
      results: [
        {
          ...pair(IMG.lipsA),
          caption: "Lip filler · 0,5 ml · 2026",
          mobileCaption: "0,5 ml · 2026",
        },
        {
          ...pair(IMG.lipsB),
          caption: "Lip filler · 1,0 ml · 2026",
          // The mobile design (mb) labels this pair "0,5 ml · 2026"; kept consistent with desktop.
          mobileCaption: "1,0 ml · 2026",
        },
        {
          ...pair(IMG.lipsA),
          caption: "Lip filler · 0,7 ml · 2025",
          mobileCaption: "0,7 ml · 2025",
        },
      ],
      pricesTitle: "Vælg din mængde",
      pricesIntro:
        "Din behandler anbefaler mængden ved konsultationen. Mange starter med 0,5 ml og bygger på senere.",
      prices: [
        row("Revanesse 0,3 ml", 999),
        row("Revanesse 0,5 ml", 1199),
        row("Revanesse 0,7 ml", 1399),
        row("Revanesse 1,0 ml", 1599),
        row("Opløsning af filler (Hyalase)", 899, { mobileLabel: "Opløsning af filler" }),
      ],
      faq: [
        {
          question: "Gør behandlingen ondt?",
          answer:
            "De fleste oplever det som et lille prik. Vi kan bruge bedøvende creme, og filleren indeholder lokalbedøvelse.",
        },
        {
          question: "Hvor længe holder resultatet?",
          // TODO: copy review
          answer:
            "Typisk 9–12 måneder, men det varierer fra person til person. Kroppen nedbryder hyaluronsyren gradvist, så resultatet aftager langsomt, og du kan vælge at bygge på igen.",
        },
        {
          question: "Er der bivirkninger?",
          // TODO: copy review
          answer:
            "Hævelse, ømhed, rødme og blå mærker er almindelige de første dage og forsvinder som regel inden for en uge. Din behandler gennemgår de mulige bivirkninger ved konsultationen, og du kan altid kontakte os, hvis du er i tvivl bagefter.",
        },
        {
          question: "Kan filler opløses igen?",
          // TODO: copy review
          answer: `Ja. Filler af hyaluronsyre kan opløses med enzymet hyaluronidase (Hyalase), hvis du ikke er tilfreds med resultatet, eller hvis der er et medicinsk behov. Opløsning koster ${formatPrice(899)} pr. område.`,
        },
      ],
      relatedPostsTitle: "Læs mere om lip filler",
      relatedPostsIntro,
      relatedPostsLink: { label: "Alle artikler om lip filler", href: blogPage.filterHref("filler") },
      relatedPostSlugs: [
        "lip-filler-for-foerste-gang",
        "lip-filler-0-5-eller-1-ml",
        "haevelse-og-blaa-maerker",
      ],
      bookingText: "Eller book en gratis konsultation, hvis du er i tvivl.",
      mobile: {
        lead: "Naturlig volumen og symmetri, formet efter din læbeform. Vi doserer konservativt, så du altid kan bygge på senere.",
        about: [
          "Lip filler er lavet af hyaluronsyre, et stof der findes naturligt i huden. Behandlingen giver diskret volumen, bedre symmetri og en tydeligere læbekant. Resultatet ses med det samme og sætter sig helt på 1–2 uger.",
        ],
        practitionerTitle: "Sygeplejerske · Fillers & botox",
        practitionerText:
          "Maria er en detaljeorienteret sygeplejerske med flere års erfaring og ekspert i både fillers og botox.",
        practitionerCta: { label: "Book hos Maria", href: bookWith("maria") },
        pricesIntro: "Mange starter med 0,5 ml. Din behandler anbefaler mængden ved konsultationen.",
      },
    },
  },
  {
    slug: "kindben",
    name: "Kindben",
    categorySlug: "fillers",
    priceFrom: 1699,
    short: "Filler, der kan give kindbenene mere definition og fylde.", // TODO: copy review
  },
  {
    slug: "kaebelinje",
    name: "Kæbelinje",
    categorySlug: "fillers",
    priceFrom: 1699,
    short: "Filler, der kan tydeliggøre kæbelinjen og give ansigtet en skarpere kontur.", // TODO: copy review
  },
  {
    slug: "hage",
    name: "Hage",
    categorySlug: "fillers",
    priceFrom: 1699,
    short: "Filler, der kan give hagen mere form og balance i profilen.", // TODO: copy review
  },
  {
    slug: "tear-trough",
    name: "Tear trough",
    categorySlug: "fillers",
    priceFrom: 1999,
    short: "Filler under øjnene, der kan mindske skygger og et træt udtryk.", // TODO: copy review
  },
  {
    slug: "naesekorrektion",
    name: "Næsekorrektion",
    categorySlug: "fillers",
    priceFrom: 3999,
    short: "Næsekorrektion uden kirurgi med filler, udført af Dr. Tom.", // TODO: copy review
  },
  // Rynkebehandling
  {
    slug: "botox",
    name: "Botox",
    categorySlug: "rynkebehandling",
    priceFrom: 799,
    short: "Mimiklinjer og udvalgte kosmetiske behandlingsområder.",
    detail: {
      lead: "Blødere linjer i panden, mellem brynene og omkring øjnene, uden at du mister din mimik. Du ser udhvilet ud, ikke behandlet.",
      heroImage: {
        src: IMG.duoColor.src,
        alt: "To smilende kvinder foran en beige og rosa baggrund",
        position: "50% 50%",
        width: 1600,
        height: 1096,
      },
      facts: [
        { label: "Pris", value: from(799) },
        { label: "Varighed", value: "ca. 20 min" },
        { label: "Holdbarhed", value: "3–4 mdr" },
        { label: "Udføres af", value: "Læge / sygeplejerske" },
      ],
      secondaryCta: { label: "Gratis lægekonsultation", href: site.booking.href },
      about: [
        "Botox afslapper de små muskler, der skaber mimiske rynker. Huden glattes ud, og nye linjer forebygges. Effekten begynder efter 3–5 dage og er fuldt synlig efter to uger.",
        "Før din første behandling har du en lovpligtig lægekonsultation, som altid er gratis. Vi doserer præcist, så dit udtryk bevares, og du får en gratis kontrol efter to uger.",
      ],
      goodFor: ["Panderynker", "Bekymringsrynke", "Kragetæer", "Svedige armhuler"],
      practitionerSlug: "annika",
      practitionerHeading: "Annika, kosmetisk sygeplejerske",
      practitionerText:
        "Annika er uddannet i Fillox af Dr. Tom og har stor viden om rynkebehandling og de forskellige muligheder. Hun tager sig god tid til at forstå dit udtryk, før hun doserer.",
      practitionerQuote: "Jeg er først tilfreds, når du er glad og tilfreds.",
      resultsTitle: "Resultater med botox",
      resultsIntro,
      results: [
        {
          ...pair(IMG.duoPink),
          caption: "Pande · 2026",
        },
        {
          ...pair(IMG.duoColor),
          caption: "Kragetæer · 2026",
        },
        {
          ...pair(IMG.duoPink),
          caption: "Bekymringsrynke · 2025",
        },
      ],
      pricesTitle: "Betal pr. område",
      pricesIntro:
        "Jo flere områder, jo lavere pris pr. område. Lægekonsultation og kontrol er altid inkluderet.",
      prices: [
        row("Lip flip / Gummy smile / Bunny lines", 799),
        row("Pande / Bekymringsrynke / Kragetæer", 999),
        row("2 områder", 1499),
        row("3 områder", 1999),
        row("4 områder", 2499),
        row("Hyperhidrose (svedige armhuler)", 2499, { treatmentSlug: "hyperhidrose" }),
      ],
      faq: [
        {
          question: "Gør det ondt?",
          // TODO: copy review
          answer:
            "De fleste beskriver det som et kort prik. Vi bruger en meget tynd nål, og selve injektionerne tager kun få minutter.",
        },
        {
          question: "Hvornår kan jeg se resultatet?",
          // TODO: copy review
          answer:
            "Effekten begynder efter 3–5 dage og er fuldt synlig efter omkring to uger. Derfor ligger din gratis kontrol to uger efter behandlingen.",
        },
        {
          question: "Kan jeg gå på arbejde bagefter?",
          // TODO: copy review
          answer:
            "Ja, du kan gå direkte tilbage til hverdagen. Undgå at ligge ned de første fire timer, og spring træning, sauna og alkohol over resten af dagen.",
        },
        {
          question: "Hvorfor skal jeg til lægekonsultation først?",
          // TODO: copy review
          answer:
            "Botox er et receptpligtigt lægemiddel, så en læge skal vurdere dig, før du bliver behandlet første gang. Konsultationen er lovpligtig, tager ca. 15 minutter og er altid gratis hos os.",
        },
      ],
      relatedPostsTitle: "Læs mere om botox",
      relatedPostsIntro,
      relatedPostsLink: { label: "Alle artikler om botox", href: blogPage.filterHref("botox") },
      relatedPostSlugs: [
        "botox-for-foerste-gang",
        "hvornaar-giver-det-mening-at-starte-med-botox",
        "de-foerste-24-timer-efter-botox",
      ],
      bookingText: "Din første lægekonsultation er gratis.",
    },
  },
  {
    slug: "lip-flip",
    name: "Lip flip",
    categorySlug: "rynkebehandling",
    priceFrom: 799,
    short: "En lille dosis i musklen langs overlæben, så læben ruller let udad.", // TODO: copy review
  },
  {
    slug: "gummy-smile",
    name: "Gummy smile",
    categorySlug: "rynkebehandling",
    priceFrom: 799,
    short: "Behandling, der kan mindske, hvor meget tandkød der vises, når du smiler.", // TODO: copy review
  },
  {
    slug: "hyperhidrose",
    name: "Hyperhidrose",
    categorySlug: "rynkebehandling",
    priceFrom: 2499,
    short: "Behandling af overdreven sved, fx i armhulerne.", // TODO: copy review
  },
  {
    slug: "traptox",
    name: "Traptox",
    categorySlug: "rynkebehandling",
    priceFrom: 2999,
    short: "Behandling af trapezmusklen, der kan give en blødere nakke- og skulderlinje.", // TODO: copy review
  },
  // Hudforbedring
  {
    slug: "skinbooster",
    name: "Skinbooster",
    categorySlug: "hudforbedring",
    // 6b (Ejal 40 1.499 kr) and Alberte's profile both say "fra 1.499 kr"; the home
    // bestseller row (6a) shows "FRA 999 KR" but reads this value (see `bestsellers`).
    priceFrom: 1499,
    short: "Fugt, glød og forbedring af hudens kvalitet.",
  },
  {
    slug: "profhilo",
    name: "Profhilo",
    categorySlug: "hudforbedring",
    priceFrom: 2499,
    short: "Skinbooster med hyaluronsyre, der giver dyb fugt og kan gøre huden mere spændstig.", // TODO: copy review
  },
  {
    slug: "microneedling",
    name: "Microneedling",
    categorySlug: "hudforbedring",
    priceFrom: 999,
    short: "Stimulerer hudens egen kollagen for jævnere tekstur og glød.",
  },
  {
    slug: "prf-hud",
    name: "PRF hud",
    categorySlug: "hudforbedring",
    priceFrom: 2499,
    short: "Kroppens egne vækstfaktorer til naturlig hudforbedring.",
  },
  {
    slug: "signatur-ansigtsbehandling",
    name: "Signatur ansigtsbehandling",
    categorySlug: "hudforbedring",
    priceFrom: 999,
    short: "Peeling, maske og LED med Dr. Dennis Gross.",
  },
  // Laser hårfjerning
  {
    slug: "laser-harfjerning",
    name: "Laser hårfjerning",
    categorySlug: "laser-harfjerning",
    priceFrom: 500,
    short: "Permanent hårfjerning til alle hudtyper, fra overlæbe til hel krop.",
  },
  // Hårtab & hovedbund
  {
    slug: "prf-har",
    name: "PRF hår",
    categorySlug: "hartab",
    priceFrom: 2499,
    short: "Behandling af hovedbunden med PRF udvundet af dit eget blod.", // TODO: copy review
  },
  {
    slug: "polyphil-hair",
    name: "PolyPhil Hair",
    categorySlug: "hartab",
    priceFrom: 1800,
    short: "Behandlingskur med polynukleotider til hovedbunden ved tyndt hår.", // TODO: copy review
  },
  // For mænd
  {
    slug: "botox-for-maend",
    name: "Botox for mænd",
    categorySlug: "for-maend",
    priceFrom: 799,
    short: "Rynkebehandling doseret efter mænds mimik og muskulatur.", // TODO: copy review
  },
  {
    slug: "kaebelinje-for-maend",
    name: "Kæbelinje for mænd",
    categorySlug: "for-maend",
    priceFrom: 1699,
    short: "Filler, der kan give en mere markeret og kantet kæbelinje.", // TODO: copy review
  },
  {
    slug: "hartab-for-maend",
    name: "Hårtab for mænd",
    categorySlug: "for-maend",
    priceFrom: 2499,
    mobileMenuName: "Hårtab for mænd (PRF)",
    short: "PRF-behandling af hovedbunden ved begyndende hårtab.", // TODO: copy review
  },
  {
    slug: "laser-for-maend",
    name: "Laser for mænd",
    categorySlug: "for-maend",
    priceFrom: 500,
    mobileMenuName: "Laser hårfjerning",
    short: "Laser hårfjerning til alle hudtyper, fra ansigt til hel krop.", // TODO: copy review
  },
];

/* -------------------------------------------------------------- bestsellers */

/**
 * Price + link of a bestseller row, read from the treatment itself so the home page can
 * never show a different "fra" price than the treatment page it links to.
 */
function bestsellerTreatment(slug: string): Pick<Bestseller, "priceFrom" | "href"> {
  const priceFrom = treatments.find((t) => t.slug === slug)?.priceFrom;
  if (priceFrom === undefined) throw new Error(`bestsellers: no priceFrom for treatment "${slug}"`);
  return { priceFrom, href: treatmentHref(slug) };
}

/** Same for a row that links to a whole category: its lowest "fra" price. */
function bestsellerCategory(categorySlug: string): Pick<Bestseller, "priceFrom" | "href"> {
  const prices = treatments
    .filter((t) => t.categorySlug === categorySlug)
    .flatMap((t) => (t.priceFrom === undefined ? [] : [t.priceFrom]));
  if (!prices.length) throw new Error(`bestsellers: empty category "${categorySlug}"`);
  return { priceFrom: Math.min(...prices), href: `${routes.treatments}#${categorySlug}` };
}

/** Home page "Vores bestsellers" (design 6a desktop, mf mobile). */
export const bestsellers: Bestseller[] = [
  {
    number: "01",
    name: "Botox",
    description: "Mimiklinjer og udvalgte kosmetiske behandlingsområder.",
    mobileDescription: "Mimiklinjer og udvalgte behandlingsområder.",
    ...bestsellerTreatment("botox"),
  },
  {
    number: "02",
    name: "Filler",
    description: "Kontur, volumen og harmonisering af ansigtets proportioner.",
    mobileDescription: "Kontur, volumen og harmonisering.",
    ...bestsellerCategory("fillers"),
  },
  {
    number: "03",
    name: "Skinbooster",
    description: "Fugt, glød og forbedring af hudens kvalitet.",
    mobileDescription: "Fugt, glød og bedre hudkvalitet.",
    // 6a/mf show "fra 999 kr" here, but 6b, 6alb and ma all price Skinbooster from 1.499 kr.
    // TODO: price review (Fillox to confirm; the treatment's priceFrom is used everywhere).
    ...bestsellerTreatment("skinbooster"),
    highlighted: true,
  },
  {
    number: "04",
    name: "Laser",
    description: "Målrettede behandlinger til hudens struktur og udtryk.",
    mobileDescription: "Hudens struktur og udtryk.",
    ...bestsellerTreatment("laser-harfjerning"),
  },
  {
    number: "05",
    name: "PRF",
    description: "En regenerativ behandling baseret på kroppens egne ressourcer.",
    mobileDescription: "Kroppens egne ressourcer.",
    ...bestsellerTreatment("prf-hud"),
  },
];

/* ------------------------------------------------------------------ lookups */

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export function treatmentHref(slug: string): string {
  return `${routes.treatments}/${slug}`;
}

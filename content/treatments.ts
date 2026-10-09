import type { Bestseller, FaqItem, ImageRef, PriceRow, Treatment } from "./types";
import { routes } from "./routes";
import { blogPage } from "./pages/blog";
import { treatmentPage } from "./pages/treatments";
import { priceCards } from "./prices";
import { practitionerBookingHref } from "@/lib/booking";
import { formatPrice } from "@/lib/format";
import { site } from "@/config/site";

/**
 * Every treatment. Slugs match content/navigation.ts categories.
 *
 * Prices: `priceFrom` and every price on a treatment page are read from the price list
 * (content/prices.ts, the live fillox.dk/priser), never typed here: `priceFrom` is the lowest
 * amount among the rows tagged with the treatment's slug.
 *
 * `detail`: Lip filler (6c/mb) is designed in full. The other treatments with a page on the live
 * fillox.dk get a `detail` on the generic template (6c) with that page's facts (behandlingstid,
 * holdbarhed, restitution), "om behandlingen" and FAQ, adapted to the new tone.
 * Sources (fetched 2026-10-01): fillox.dk/fillers/<kindben|kaebelinje|tear-trough|naesekorrektion|
 * lip-filler|ansigtskonturering>, /fillers/faq-om-fillers-behandling, /skinbooster/<profhilo|ejal-40|
 * sunekos>, /hudforbedring/<infini-microneedling|infini-microneedling-copy (Signatur)>,
 * /prf-hudbehandling, /harfjerning, /prf-mod-hartab, /om-os/kontrol-eftertjek.
 *
 * Rynkebehandling (the hub; it replaces the Botox page and the live /rynkebehandling) and Andre
 * behandlingsmuligheder (it replaces the live /ovrige-botox-behandlinger and the lip flip, gummy
 * smile, hyperhidrose, Traptox and Botox for mænd pages) are long-form pages (`detail.sections`,
 * content/types.ts) with the owner's new copy, VERBATIM: Google Drive › Fillox › Fillox.dk ›
 * "Botox og rynkebehandling" (the agency's Google Doc, tabs 1 and 2, 2026-10-09). The text is
 * written not to advertise a prescription medicine (Botox / botulinumtoksin, lægemiddellovens
 * § 66): the product is named only where the source does (one FAQ answer), and there are no
 * prices, results, reviews or blog posts on these pages; the CTAs are the author's ("Book en
 * konsultation", "Kontakt os"). Keep it that way when editing them.
 *
 * Without a live page (minimal content, generic fallbacks): hage, polyphil-hair. Copy marked
 * `// TODO: copy review` is not from the design, the live site or the owner's documents and needs
 * a review by Fillox before launch.
 */

/* ------------------------------------------------------------------ helpers */

type Detail = NonNullable<Treatment["detail"]>;

const from = (amount: number) => `fra ${formatPrice(amount)}`;

const row = (label: string, amount: number, extra: Omit<PriceRow, "label" | "price" | "amount"> = {}): PriceRow => ({
  label,
  price: formatPrice(amount),
  amount,
  ...extra,
});

/** Amount of a row on the price list (content/prices.ts). Throws when the row is gone or has no amount. */
function listPrice(cardId: string, label: string): number {
  const price = priceCards.find((c) => c.id === cardId)?.rows.find((r) => r.label === label)?.price;
  if (price?.kind !== "amount") throw new Error(`treatments: no price for "${label}" in price card "${cardId}"`);
  return price.amount;
}

/** Lowest amount among the price-list rows tagged with a treatment: its "fra" price. */
function lowestListPrice(treatmentSlug: string): number {
  const amounts = priceCards.flatMap((card) =>
    card.rows.flatMap((r) => (r.treatmentSlug === treatmentSlug && r.price.kind === "amount" ? [r.price.amount] : [])),
  );
  if (!amounts.length) throw new Error(`treatments: no price-list row tagged "${treatmentSlug}"`);
  return Math.min(...amounts);
}

/** Every numeric row of a price card as treatment-page rows (label, note and amount as on /priser). */
function cardRows(cardId: string): PriceRow[] {
  const card = priceCards.find((c) => c.id === cardId);
  if (!card) throw new Error(`treatments: no price card "${cardId}"`);
  return card.rows.flatMap((r) =>
    r.price.kind === "amount" ? [row(r.label, r.price.amount, r.note ? { note: r.note } : {})] : [],
  );
}

/** Hero photo of a page on the generic template: its category's photo (content/pages/treatments.ts). */
const categoryImage = (categorySlug: string): ImageRef =>
  treatmentPage.categoryImages[categorySlug] ?? treatmentPage.defaultImage;

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

/* ------------------------------------------------- facts and FAQ shared by pages */

/** Price card ids in content/prices.ts. */
const FILLERS = "fillers";
const WRINKLES = "rynkebehandling";

/** Fillers: fillox.dk/fillers/* and /fillers/faq-om-fillers-behandling. */
const fillerFaq = {
  pain: {
    question: "Gør det ondt?",
    answer:
      "Vores fillers er tilsat lidocain, et bedøvelsesmiddel, der virker under behandlingen og i den første tid bagefter. Har du brug for det, kan du også få bedøvende creme før behandlingen.",
  },
  /** "Hvornår kan jeg se resultatet?" with the page's own timing. */
  results: (finalResult: string): FaqItem => ({
    question: "Hvornår kan jeg se resultatet?",
    answer: `Resultatet ses med det samme, men der vil være lidt hævelse. ${finalResult}`,
  }),
  sideEffects: {
    question: "Er der bivirkninger?",
    answer:
      "Rødme, hævelse, kløe, ømhed, ujævnheder og blå mærker er almindelige reaktioner, hvor filleren er sprøjtet ind. De kan komme med det samme eller lidt senere og varer op til en uge. Som ved alle injektioner er der en lille risiko for infektion, så kontakt en læge hurtigst muligt, hvis en betændelsesreaktion varer mere end en uge.",
  },
  aftercare: {
    question: "Hvad skal jeg undgå bagefter?",
    answer:
      "Rør ikke ved området de første 6 timer, derefter kan du vaske det forsigtigt med vand og sæbe. Hold området væk fra sol og solarium, til hævelse og rødme er væk, begræns alkohol 24 timer før og efter, og undgå Aspirin, Ibux og Voltaren, som kan give mere blødning og blå mærker.",
  },
  // TODO: copy review — the live site names these brands on every filler page except lip filler
  // (Revanesse, as on the price list). Fillox to confirm the brands still in use.
  products: {
    question: "Hvilke fillers bruger I?",
    answer: "Vi bruger de velrenommerede filler-mærker Infini, Belotero og Juvéderm.",
  },
} satisfies Record<string, FaqItem | ((text: string) => FaqItem)>;

/** PRF (skin and hair): fillox.dk/prf-hudbehandling and /prf-mod-hartab. */
const prfFaq = {
  how: {
    question: "Hvordan foregår behandlingen?",
    answer:
      "Vi tager en lille mængde blod (15 ml) fra en vene i armen og adskiller plasmaet fra resten af blodet i en centrifuge. Plasmaet beriges og sprøjtes derefter ind i området med en meget tynd nål eller med mikroinjektioner.",
  },
  before: {
    question: "Hvordan forbereder jeg mig?",
    answer:
      "Drik rigeligt med vand i dagene op til behandlingen. Undgå smertestillende medicin som Aspirin og Ibuprofen to dage før og to dage efter, da det kan påvirke blodpladerne.",
  },
  after: {
    question: "Hvad skal jeg undgå bagefter?",
    answer:
      "Undgå hård træning og kosmetiske produkter i 24–48 timer, varme bade og sauna de første dage og direkte sollys. Rygning og alkohol bør du også undgå i tiden efter behandlingen.",
  },
  sideEffects: {
    question: "Er der bivirkninger?",
    answer:
      "PRF er generelt en sikker behandling, og bivirkninger er sjældne. Der kan komme blå mærker, hævelse, rødme eller let ømhed, som normalt forsvinder af sig selv. Kontakt os, hvis du er i tvivl.",
  },
} satisfies Record<string, FaqItem>;

/* ---------------------------------------------------- template pages (6c) */

const kaebelinjeAbout: Pick<Detail, "facts" | "about" | "goodFor" | "faq"> = {
  facts: [
    { label: "Pris", value: from(lowestListPrice("kaebelinje")) },
    { label: "Varighed", value: "ca. 30 min" },
    { label: "Holdbarhed", value: "ca. 12–18 mdr" },
    { label: "Restitution", value: "Ingen reel" },
  ],
  about: [
    "Kæbelinjen definerer maskulinitet hos mænd og giver mere karakter hos kvinder. Med hyaluronsyre konturerer vi kæben, så ansigtstrækkene bliver skarpere, både forfra og i profil, og huden i den nederste del af ansigtet strammes op med det samme.",
    "Vi tilpasser behandlingen efter dine ønsker, hvad enten du ønsker mere maskuline eller feminine træk. Behandlingen kan også give en mere lige kæbelinje, hvis huden er blevet ujævn eller slap med alderen.",
  ],
  goodFor: ["En mere markant kæbelinje", "En skarpere profil", "En mere lige kæbelinje", "Slap hud langs kæben"],
  faq: [
    {
      question: "Hvor meget filler skal der til?",
      answer:
        "Kæbelinjen kræver ofte mere filler end andre områder, og 3–8 ml kan være nødvendigt. Én behandling er normalt nok, men nogle gange er der brug for to, og nogle gange giver det mening også at behandle kinder og hage. Prisen pr. område gælder op til 1 ml, så skal du bruge mere, er ansigtskonturering med 4 ml ofte det bedste valg.",
    },
    fillerFaq.results("Det endelige resultat ses efter cirka en uge, når hævelsen har lagt sig."),
    fillerFaq.pain,
    fillerFaq.sideEffects,
    fillerFaq.products,
  ],
};

const prfHarAbout: Pick<Detail, "facts" | "about" | "goodFor" | "faq"> = {
  facts: [
    { label: "Pris", value: from(lowestListPrice("prf-har")) },
    { label: "Varighed", value: "30–40 min" },
    { label: "Holdbarhed", value: "ca. 6–12 mdr" },
    { label: "Restitution", value: "Ingen reel" },
  ],
  about: [
    "Vi kombinerer PRF (platelet-rich fibrin) fra dit eget blod med mesoterapi, hvor næringsstoffer, vitaminer og mineraler sprøjtes direkte ind i hovedbunden. Det nærer hårsækkene, øger blodcirkulationen og styrker det hår, du har.",
    "Målet er både at stimulere ny hårvækst og at give håret mere glans og styrke. Behandlingen bruger kroppens egne ressourcer, kræver ingen kirurgi og tilpasses dine behov, og du kan gå direkte tilbage til hverdagen.",
  ],
  goodFor: ["Hårtab", "Tyndere hår", "Mere glans og styrke", "Både mænd og kvinder"],
  faq: [
    {
      question: "Hvornår kan jeg se resultatet?",
      answer:
        "Det er forskelligt. Nogle oplever mindre hårtab inden for de første måneder, men for mange går der 3–6 måneder, før håret bliver tydeligt fyldigere, og de største resultater kan tage 6 måneder eller mere. Vedligeholdelse er ofte nødvendig for at bevare resultatet.",
    },
    prfFaq.how,
    prfFaq.before,
    prfFaq.after,
    prfFaq.sideEffects,
  ],
};

const laserAbout: Pick<Detail, "about" | "goodFor" | "faq"> = {
  about: [
    "Vores diodelaser behandler hårsækkene målrettet. Et forløb består typisk af 6–8 behandlinger med 4–8 ugers mellemrum, så vi rammer hårene i den aktive vækstfase. AI-genkendelse hjælper os med at tilpasse indstillingerne til din hudtype og hårstruktur, og den indbyggede køling beskytter huden og gør behandlingen behagelig.",
    "Alle laserbehandlinger udføres af personale, der er særligt uddannet gennem Fillox Academy. Behandlingen kan udføres på hele kroppen, også i ansigtet og på halsen.",
  ],
  goodFor: ["Ansigt og hals", "Armhuler, arme og ben", "Bikini og brasil", "Ryg, skuldre og bryst"],
  faq: [
    {
      question: "Er resultatet permanent?",
      answer:
        "Laseren beskadiger hårsækkene, så hårvæksten reduceres eller stopper. Det kan ikke garanteres, at alle hår forsvinder: resultatet afhænger blandt andet af hårfarve, hårtæthed, område og hormoner. Hår, der vokser tilbage, er ofte tyndere og lysere, og nogle har brug for en vedligeholdelsesbehandling med tiden.",
    },
    {
      question: "Hvor mange behandlinger skal jeg have?",
      answer:
        "Typisk 6–8 behandlinger med 4–8 ugers mellemrum. Laseren virker bedst på hår i vækstfasen, og ikke alle hår er i den fase på samme tid.",
    },
    {
      question: "Er der bivirkninger?",
      answer:
        "Området kan føles let ujævnt og følsomt og være lyserødt i nogle timer, lidt som en mild solskoldning. Forbrændinger og blærer kan forekomme, men er sjældne. Beskyt huden med solcreme efter behandlingen.",
    },
    {
      question: "Kan mænd også få laser hårfjerning?",
      answer:
        "Ja. Behandlingen tilbydes både til kvinder og mænd. Til mænd har vi også faste priser på kombinerede områder som ryg, skuldre og bryst.",
    },
  ],
};

const laserFacts = (price: number) => [
  { label: "Pris", value: from(price) },
  { label: "Varighed", value: "20–30 min" },
  { label: "Behandlinger", value: "6–8" },
  { label: "Restitution", value: "Ingen, men husk solcreme" },
];

/* --------------------------------------------------------------- treatments */

export const treatments: Treatment[] = [
  // Fillers
  {
    slug: "lip-filler",
    name: "Lip filler",
    categorySlug: "fillers",
    priceFrom: lowestListPrice("lip-filler"),
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
      // fillox.dk/fillers/lip-filler: behandlingstid ca. 20 min, varighed cirka 6–9 måneder.
      facts: [
        { label: "Pris", value: from(lowestListPrice("lip-filler")) },
        { label: "Varighed", value: "ca. 20 min" },
        { label: "Holdbarhed", value: "ca. 6–9 mdr" },
        { label: "Udføres af", value: "Læge / sygeplejerske" },
      ],
      secondaryCta: { label: "Gratis konsultation", href: site.booking.href },
      about: [
        "Lip filler er lavet af hyaluronsyre, det samme fugt- og volumengivende stof, som naturligt findes i huden. Behandlingen kan give diskret volumen, forbedre symmetri og definere læbekanten.",
        "Vi starter altid med en konsultation, hvor din behandler vurderer din anatomi og lægger en plan sammen med dig. Resultatet ses med det samme, og det endelige resultat ses efter cirka en uge, når hævelsen har lagt sig.",
      ],
      goodFor: [
        "Diskret, naturlig volumen",
        "Symmetri og balance",
        "Definition af læbekant",
        "Fugt og friskhed",
      ],
      practitionerSlug: "maria",
      // TODO: copy review — "rynkebehandling" in place of "Botox" (a prescription medicine; 2026-10),
      // here and in practitionerText / mobile below, as on her team card (content/team.ts).
      practitionerHeading: "Maria, sygeplejerske, ekspert i fillers & rynkebehandling",
      // fillox.dk/om-os (Maria). The live site does not say who performs lip filler, so no "udføres af".
      practitionerText:
        "Maria er en detaljeorienteret og holistisk sygeplejerske med flere års erfaring inden for æstetiske behandlinger og ekspert i både fillers og rynkebehandling. Hendes øje for kvalitet og sans for det naturlige resultat skinner igennem i alle behandlinger.",
      practitionerQuote: "At se mine tilfredse kunder smile er en af de største glæder, jeg har.",
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
        row("Revanesse 0,3 ml", listPrice(FILLERS, "Lip filler · Revanesse 0,3 ml")),
        row("Revanesse 0,5 ml", listPrice(FILLERS, "Lip filler · Revanesse 0,5 ml")),
        row("Revanesse 0,7 ml", listPrice(FILLERS, "Lip filler · Revanesse 0,7 ml")),
        row("Revanesse 1,0 ml", listPrice(FILLERS, "Lip filler · Revanesse 1,0 ml")),
        row("Opløsning af filler (Hyalase)", listPrice(FILLERS, "Opløsning af filler (Hyalase)"), {
          mobileLabel: "Opløsning af filler",
        }),
      ],
      faq: [
        {
          question: "Gør behandlingen ondt?",
          answer:
            "Læberne er følsomme, så de fleste mærker noget ubehag, men tåler det godt. Filleren er tilsat lidocain, et bedøvelsesmiddel, og du kan også få bedøvende creme før behandlingen.",
        },
        {
          question: "Hvor længe holder resultatet?",
          answer:
            "Typisk 6–9 måneder, men det varierer fra person til person. Kroppen nedbryder hyaluronsyren gradvist, så resultatet aftager langsomt, og du kan vælge at bygge på igen.",
        },
        {
          question: "Er der bivirkninger?",
          answer:
            "Hævelse, ømhed, rødme, kløe og blå mærker er almindelige og varer op til en uge. Læberne hæver ofte lidt mere end andre områder, typisk 1–3 dage. Kontakt en læge hurtigst muligt, hvis en betændelsesreaktion varer mere end en uge.",
        },
        fillerFaq.aftercare,
        {
          question: "Kan filler opløses igen?",
          answer: `Ja. Filler af hyaluronsyre kan opløses med Hyalase. Opløsning koster ${formatPrice(listPrice(FILLERS, "Opløsning af filler (Hyalase)"))} pr. område pr. gang.`,
        },
        {
          question: "Hvilken filler bruger I?",
          answer: "Til læber bruger vi Revanesse.",
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
          "Lip filler er lavet af hyaluronsyre, et stof der findes naturligt i huden. Behandlingen giver diskret volumen, bedre symmetri og en tydeligere læbekant. Resultatet ses med det samme, og det endelige resultat efter cirka en uge.",
        ],
        practitionerTitle: "Sygeplejerske · Fillers & rynkebehandling",
        practitionerText:
          "Maria er en detaljeorienteret sygeplejerske med flere års erfaring og ekspert i både fillers og rynkebehandling.",
        practitionerCta: { label: "Book hos Maria", href: bookWith("maria") },
        pricesIntro: "Mange starter med 0,5 ml. Din behandler anbefaler mængden ved konsultationen.",
      },
    },
  },
  {
    slug: "kindben",
    name: "Kindben",
    categorySlug: "fillers",
    priceFrom: lowestListPrice("kindben"),
    short: "Filler, der giver markerede kindben og genopretter tabt volumen.",
    detail: {
      lead: "Markerede kindben giver en flot profil og løfter ansigtet. Filler i kindbenene genopretter også tabt volumen og strammer huden op.",
      heroImage: categoryImage("fillers"),
      facts: [
        { label: "Pris", value: from(lowestListPrice("kindben")) },
        { label: "Varighed", value: "ca. 20 min" },
        { label: "Holdbarhed", value: "ca. 6–12 mdr" },
        { label: "Restitution", value: "Ingen reel" },
      ],
      about: [
        "Med hyaluronsyre genskaber vi volumen og blødhed i ansigtet. Du ser effekten med det samme, og fylden strammer huden op, så du fremstår slankere i ansigtet og med en klarere karakter.",
        "Behandlingen passer både til dig, der har mistet volumen i kinderne med alderen, og til dig, der ønsker mere fylde og et konturet look. Skal du bruge mere end 1 ml, fx til kindben og kæbelinje, er ansigtskonturering med 4 ml ofte et godt valg.",
      ],
      goodFor: ["Tabt volumen i kinderne", "Mere markerede kindben", "Et slankere ansigt", "Opstramning af huden"],
      faq: [
        {
          question: "Hvordan foregår behandlingen?",
          answer:
            "Vi starter med en analyse af dit ansigt, og sammen aftaler I det ønskede resultat. Filleren sprøjtes ind med en meget tynd nål, og i kinderne placeres den normalt dybere i huden end i andre områder.",
        },
        fillerFaq.results("Det endelige resultat ses efter cirka en uge, når hævelsen har lagt sig."),
        fillerFaq.pain,
        fillerFaq.sideEffects,
        fillerFaq.aftercare,
        fillerFaq.products,
      ],
    },
  },
  {
    slug: "kaebelinje",
    name: "Kæbelinje",
    categorySlug: "fillers",
    priceFrom: lowestListPrice("kaebelinje"),
    short: "Filler, der giver en tydeligere kæbelinje og en mere markant profil.",
    detail: {
      lead: "Filler i kæbelinjen giver en tydeligere overgang mellem hoved og hals og en mere markant profil, og du fremstår slankere i ansigtet.",
      heroImage: categoryImage("fillers"),
      ...kaebelinjeAbout,
    },
  },
  {
    slug: "hage",
    name: "Hage",
    categorySlug: "fillers",
    priceFrom: lowestListPrice("hage"),
    short: "Filler, der kan give hagen mere form og balance i profilen.", // TODO: copy review (no live page)
  },
  {
    slug: "tear-trough",
    name: "Tear trough",
    categorySlug: "fillers",
    priceFrom: lowestListPrice("tear-trough"),
    short: "Filler under øjnene, der mindsker hulhed og mørke rande.",
    detail: {
      lead: "Filler under øjnene, der giver volumen, mindsker mørke rande og udglatter overgangen til kinden. En af de bedste ikke-kirurgiske løsninger på trætte øjne.",
      heroImage: categoryImage("fillers"),
      facts: [
        { label: "Pris", value: from(lowestListPrice("tear-trough")) },
        { label: "Varighed", value: "ca. 20 min" },
        { label: "Holdbarhed", value: "ca. 6–12 mdr" },
        { label: "Restitution", value: "Ingen reel" },
      ],
      about: [
        "Med alderen mister ansigtet volumen, og det kan give hulhed og mørke rande mellem det nedre øjenlåg og kinden, de såkaldte trætte øjne. Det er en almindelig gene hos mange over 25 år.",
        "Vi fylder de hule områder ud med en blød filler med hyaluronsyre, kroppens egen fugtgiver. Vi bruger meget fine nåle, placerer filleren dybt i vævet og masserer området bagefter, så den fordeles jævnt.",
      ],
      goodFor: ["Mørke rande under øjnene", "Hulhed under øjnene", "Et træt udtryk"],
      faq: [
        {
          question: "Hvorfor er placeringen så vigtig?",
          answer:
            "Placeres filleren for overfladisk, giver det et flot resultat med det samme, men problemer efter få uger: ujævnheder bliver synlige, området kan hæve, fordi lymfedrænagen blokeres, og huden kan få et hvidligt skær (Tyndall-effekt). Vores behandlere er grundigt uddannet i at placere filleren rigtigt, så du undgår det.",
        },
        fillerFaq.results("Det bedste resultat ses efter 2–4 uger."),
        fillerFaq.pain,
        fillerFaq.sideEffects,
        fillerFaq.products,
      ],
    },
  },
  {
    slug: "naesekorrektion",
    name: "Næsekorrektion",
    categorySlug: "fillers",
    priceFrom: lowestListPrice("naesekorrektion"),
    short: "Næsekorrektion uden kirurgi med filler, udført af Dr. Tom.",
    detail: {
      lead: "Næsekorrektion med filler, et ikke-kirurgisk næsejob, retter ujævnheder langs næseryggen og kan ændre formen på næsespidsen. Udføres af Dr. Tom.",
      heroImage: categoryImage("fillers"),
      facts: [
        { label: "Pris", value: from(lowestListPrice("naesekorrektion")) },
        { label: "Varighed", value: "ca. 20 min" },
        { label: "Holdbarhed", value: "ca. 6–12 mdr" },
        { label: "Udføres af", value: "Dr. Tom (læge)" },
      ],
      about: [
        "Filler kan rette ujævnheder langs næseryggen, så næsen ser mindre og mere strømlinet ud. Den kan også bruges til at ændre formen på næsespidsen, så en bred næse ser smallere ud, eller en flad næse løftes.",
        "Der skal kun en lille mængde filler til for at gøre en markant forskel, og vi stræber altid efter et naturligt og medicinsk sikkert resultat. Næsekorrektion med filler kan være et godt alternativ til en kirurgisk operation.",
      ],
      goodFor: ["Ujævnheder på næseryggen", "Formen på næsespidsen", "Et alternativ til kirurgi"],
      faq: [
        {
          question: "Hvordan foregår behandlingen?",
          answer:
            "Vi starter med en analyse af din næse, og sammen med lægen aftaler du det ønskede resultat. Filleren sprøjtes ind med en tynd nål under huden og over næsebenet.",
        },
        fillerFaq.results("Det endelige resultat ses efter cirka 2 uger, når hævelsen har lagt sig."),
        {
          question: "Gør det ondt?",
          answer:
            "Vores fillers er tilsat lidocain, et bedøvelsesmiddel, der virker under behandlingen og i den første tid bagefter, så de fleste oplever ikke behandlingen som særlig smertefuld.",
        },
        fillerFaq.sideEffects,
        fillerFaq.products,
      ],
    },
  },
  // Rynkebehandling: long-form pages, the owner's copy verbatim (see the header).
  {
    slug: "rynkebehandling",
    name: "Rynkebehandling",
    categorySlug: "rynkebehandling",
    // The lowest row of the price list's Rynkebehandling card: menus, the /behandlinger card and
    // the home bestseller show it; the page itself shows none (its "Priser" section links to /priser).
    priceFrom: lowestListPrice("rynkebehandling"),
    short: "Mimiklinjer og udvalgte kosmetiske behandlingsområder.",
    // TODO: copy review — search/share title: the H1 without "hos Fillox" (the title template
    // already adds " · Fillox").
    metaTitle: "Rynkebehandling – find den rette behandling",
    detail: {
      // The source's H1, "Rynkebehandling – find den rette behandling hos Fillox", in two lines.
      headingAccent: "find den rette behandling hos Fillox",
      lead: "Rynker og fine linjer er en naturlig del af livet. Nogle opstår, når vi smiler eller rynker panden, mens andre bliver mere synlige i takt med, at huden ændrer sig.",
      intro: [
        "Der findes forskellige muligheder for at behandle rynker, men hvilken behandling der er relevant, afhænger af både årsagen til rynkerne, hudens tilstand og dine ønsker.",
        "Hos Fillox møder du behandlere med sundhedsfaglig baggrund, som arbejder efter fælles faglige standarder og får løbende undervisning gennem Fillox Academy. Vi hjælper dig med at forstå mulighederne og finde frem til, hvad der giver mening for dig.",
      ],
      // The source's second paragraph (it says what the page is about).
      metaDescription:
        "Der findes forskellige muligheder for at behandle rynker, men hvilken behandling der er relevant, afhænger af både årsagen til rynkerne, hudens tilstand og dine ønsker.",
      primaryCta: { label: "Book en konsultation", href: site.booking.href },
      sections: [
        {
          id: "typer-af-rynker",
          title: "Hvilke typer rynker kan behandles?",
          paragraphs: [
            "Det er ikke alle rynker, der opstår på samme måde. Derfor findes der heller ikke én behandling, som passer til alle.",
          ],
          items: [
            {
              id: "rynker-i-panden",
              title: "Rynker i panden",
              paragraphs: [
                "Vandrette linjer i panden opstår ofte, når vi løfter øjenbrynene. Med tiden kan linjerne også være synlige, når ansigtet er afslappet.",
              ],
            },
            {
              id: "bekymringsrynken",
              title: "Bekymringsrynken",
              paragraphs: [
                "De lodrette linjer mellem øjenbrynene opstår gennem musklernes bevægelser, blandt andet når vi koncentrerer os eller kniber øjnene sammen.",
              ],
            },
            {
              id: "smilerynker",
              title: "Smilerynker omkring øjnene",
              paragraphs: [
                "Smilerynker, også kaldet kragetæer, viser sig typisk, når vi smiler. De kan med tiden blive mere fremtrædende.",
              ],
            },
            {
              id: "andre-linjer-og-rynker",
              title: "Andre linjer og rynker",
              paragraphs: [
                "Linjer omkring munden, nedadvendte mundvige og forandringer i hudens struktur kan have andre årsager og kræve en anden tilgang.",
              ],
            },
          ],
          closing: [
            "Ved en konsultation vurderer vi, hvilke muligheder der er relevante for netop det område, du ønsker rådgivning om.",
          ],
          // TODO: copy review — not in the source: the hub's only link to its sister page (mundvige,
          // lip flip, svedtendens …), labelled with that page's name. Remove it if Fillox prefers the
          // source as written.
          cta: { label: "Andre behandlingsmuligheder", href: treatmentHref("andre-behandlingsmuligheder") },
        },
        {
          id: "vaelg-behandling",
          title: "Hvilken behandling passer til dine rynker?",
          surface: "band",
          paragraphs: [
            "Valget afhænger først og fremmest af, hvorfor rynkerne er opstået.",
            [
              { text: "Mimiske rynker", strong: true },
              " skyldes gentagne bevægelser i ansigtets muskler. Her kan en læge vurdere, om muskelafslappende injektionsbehandling er relevant.",
            ],
            [
              { text: "Linjer, der skyldes tab af volumen", strong: true },
              ", kan i nogle tilfælde vurderes med henblik på fillerbehandling.",
            ],
            [
              { text: "Fine linjer og ændringer i hudens kvalitet", strong: true },
              " kan også være relevante at vurdere i forhold til hudforbedrende behandlinger som microneedling eller peeling.",
            ],
            "Behandlingerne har forskellige formål, effekter og risici. Det er derfor vigtigt at vælge ud fra en individuel vurdering frem for blot at vælge en behandling ud fra navnet.",
          ],
        },
        {
          id: "konsultation",
          title: "Hvad sker der ved en konsultation?",
          paragraphs: [
            "Du behøver ikke at vide på forhånd, hvilken behandling du ønsker.",
            "Under konsultationen gennemgår vi dine ønsker, relevante helbredsoplysninger og de muligheder, der kan være aktuelle for dig.",
            "Du får information om forventet resultat, begrænsninger, mulige bivirkninger og eventuelle alternativer.",
            "Hvis der er tale om en behandling med botulinumtoksin, foretages den nødvendige lægefaglige forundersøgelse, og de gældende regler om information, samtykke og betænkningstid følges.",
            "Du kan også vælge ikke at gå videre med behandling.",
          ],
        },
        {
          id: "faglig-kompetence",
          title: "Faglig kompetence hos Fillox",
          paragraphs: [
            "Hos Fillox er kompetence ikke kun noget, vi taler om. Det er en del af den måde, vi arbejder på.",
            "Gennem Fillox Academy sørger vi for løbende faglig udvikling, fælles behandlingsstandarder og opfølgning af vores behandlere.",
            "Vores ansvarlige læge er en aktiv del af det faglige arbejde og den løbende opfølgning.",
            "Det betyder, at du skal kunne forvente en grundig og professionel vurdering, uanset hvilken af vores klinikker du besøger.",
          ],
          cta: { label: "Læs mere om Fillox og vores faglige arbejde", href: routes.about },
        },
        {
          id: "priser",
          title: "Priser på rynkebehandling",
          surface: "card",
          paragraphs: [
            "Prisen afhænger af den konkrete behandling og det område, der skal vurderes.",
            "Du kan se vores aktuelle priser i prisoversigten. Det endelige behandlingsvalg afhænger af den faglige vurdering.",
          ],
          // The price list's Rynkebehandling card.
          cta: { label: "Se priser", href: `${routes.prices}#${WRINKLES}` },
        },
        {
          id: "find-klinik",
          title: "Find din Fillox-klinik",
          surface: "card",
          paragraphs: [
            "Du kan besøge Fillox på Amager, Frederiksberg, Østerbro og i City2 Taastrup.",
            "Se den enkelte kliniks behandlere, behandlingstilbud og muligheder for konsultation.",
          ],
          cta: { label: "Find din klinik", href: routes.clinics },
        },
      ],
      faq: [
        {
          question: "Kan jeg få hjælp, hvis jeg aldrig har fået rynkebehandling før?",
          answer:
            "Ja. Du kan bestille en konsultation, selv om du ikke ved, hvilken behandling der kan være relevant. Vi gennemgår dine ønsker og muligheder sammen med dig.",
        },
        {
          question: "Hvad er forskellen på Botox og filler?",
          answer:
            "Botox er et handelsnavn for et lægemiddel med botulinumtoksin, der påvirker aktiviteten i bestemte muskler. Fillers anvendes blandt andet til at tilføre volumen eller korrigere konturer. Det er forskellige behandlingsformer med forskellige risici og anvendelsesområder.",
        },
        {
          question: "Hvor længe holder en rynkebehandling?",
          answer:
            "Det afhænger af behandlingsformen og individuelle forhold. Ved konsultationen kan du få en mere præcis forventning til den behandling, der vurderes relevant.",
        },
        {
          question: "Er der risici ved rynkebehandling?",
          answer:
            "Ja. Alle kosmetiske injektionsbehandlinger indebærer risici. Det kan blandt andet være lokale reaktioner, asymmetri eller andre komplikationer afhængigt af behandlingen. Du får information om de relevante risici, før du beslutter dig.",
        },
        {
          question: "Skal jeg til konsultation, før jeg kan blive behandlet?",
          answer:
            "Ved kosmetisk behandling med botulinumtoksin kræves en lægefaglig forundersøgelse. Ved første behandling gælder som udgangspunkt mindst to dages betænkningstid, før der kan gives samtykke.",
        },
      ],
      closing: {
        title: "Er du i tvivl om, hvor du skal begynde?",
        paragraphs: [
          "Du behøver ikke selv finde alle svarene.",
          "Vi hjælper dig med at forstå dine muligheder, så du kan tage stilling på et oplyst grundlag.",
        ],
        cta: { label: "Book en konsultation", href: site.booking.href },
      },
    },
  },
  {
    slug: "andre-behandlingsmuligheder",
    // TODO: copy review — the desktop mega menu's name: its columns are ≈ 132px wide at 1024px and
    // set on one line, so "Andre behandlingsmuligheder" (≈ 187px) ran into the next column. The
    // page's own short name (`detail.title`) is used everywhere else; the mobile menu has room.
    name: "Andre behandlinger",
    mobileMenuName: "Andre behandlingsmuligheder",
    categorySlug: "rynkebehandling",
    // No "fra" price: the page has none, and the price list's rows for these areas link to it.
    // TODO: copy review — one-liner for cards (/behandlinger), from the page's intro wording.
    short: "Vurdering af fx læbernes form, kraftig svedtendens eller spændinger i kæbemusklerne.",
    // The source's own title, the H1. With " · Fillox" it is 61 characters, one over the ≤ 60 rule
    // (`metaTitle`, content/types.ts): kept, as search results cut titles by width rather than by
    // count. TODO: copy review — or shorten to "Andre kosmetiske og medicinske behandlinger".
    metaTitle: "Andre kosmetiske og medicinske behandlingsmuligheder",
    detail: {
      // Breadcrumb, book bar, /behandlinger card; the H1 is the source's full title.
      title: "Andre behandlingsmuligheder",
      // The source's title with a soft hyphen (invisible; it reads the same): at the page H1 size
      // "behandlingsmuligheder" alone filled the column, so the hero shrank the whole H1 below the
      // page's H2s. It may now break as "behandlings-/muligheder", at the compact H1 size.
      heading: "Andre kosmetiske og medicinske behandlings­muligheder",
      headingSize: "compact",
      // Under the rynkebehandling hub in the breadcrumb (Behandlinger → Rynkebehandling → …).
      parentSlug: "rynkebehandling",
      lead: "Ikke alle problemstillinger handler om rynker i panden eller omkring øjnene.",
      intro: [
        "Nogle ønsker en vurdering af læbernes form eller ansigtets konturer. Andre søger hjælp til gener som kraftig svedtendens eller spændinger i kæbemusklerne.",
        "Hos Fillox tager vi udgangspunkt i den konkrete problemstilling. Der kan være forskellige årsager til det, du oplever, og det er ikke alle behandlinger, der er relevante for alle.",
      ],
      metaDescription:
        "Nogle ønsker en vurdering af læbernes form eller ansigtets konturer. Andre søger hjælp til gener som kraftig svedtendens eller spændinger i kæbemusklerne.",
      // TODO: copy review (image choice + alt text; the design has no photo for this page)
      heroImage: {
        src: "/images/hero/hero-3.jpg",
        alt: "Kvinde med langt brunt hår i aftenlys",
        position: "50% 35%",
        width: 1200,
        height: 1500,
      },
      // TODO: copy review — accessible name of the hero's jump links, and their short labels
      // (`navLabel`, the items' own words).
      jumpLabel: "Problemstillinger på siden",
      // Item ids are linked from the price list (content/prices.ts → treatmentAnchor) and the legacy
      // redirects (content/redirects.ts): keep them stable.
      sections: [
        {
          id: "kosmetiske-problemstillinger",
          title: "Kosmetiske problemstillinger",
          items: [
            {
              id: "lip-flip",
              title: "Lip flip – overlæbens form",
              navLabel: "Lip flip",
              paragraphs: [
                "En lip flip er betegnelsen for en behandling, der har til formål at påvirke overlæbens stilling.",
                "Den adskiller sig fra en fillerbehandling, hvor der tilføres volumen.",
                "Hvilken løsning der eventuelt er relevant, afhænger blandt andet af læbernes anatomi og dine ønsker.",
              ],
            },
            {
              id: "gummy-smile",
              title: "Gummy smile – synligt tandkød",
              navLabel: "Gummy smile",
              paragraphs: [
                "Når en stor del af tandkødet bliver synligt ved smil, kaldes det ofte gummy smile.",
                "Det kan skyldes flere forskellige forhold, blandt andet læbens bevægelse og placering, tandstilling eller tandkødets udformning.",
                "En faglig vurdering er nødvendig for at afgøre årsagen og mulige behandlingsformer.",
              ],
            },
            {
              id: "nedadgaaende-mundvige",
              title: "Nedadgående mundvige",
              navLabel: "Mundvige",
              paragraphs: [
                "Mundvigenes placering påvirkes blandt andet af musklernes aktivitet, ansigtets anatomi og ændringer i huden over tid.",
                "Der findes forskellige muligheder afhængigt af årsagen, men ikke alle er egnede til injektionsbehandling.",
              ],
            },
            {
              id: "tyggemuskler",
              title: "Kraftige tyggemuskler og ansigtskontur",
              navLabel: "Tyggemuskler",
              paragraphs: [
                "Tyggemusklernes størrelse kan påvirke ansigtets form og kæbens kontur.",
                "Hvis du ønsker en vurdering af dette område, ser vi på både anatomi, muskelfunktion og eventuelle gener, før der tages stilling til relevante muligheder.",
              ],
            },
            {
              id: "platysma",
              title: "Platysma – synlige halsbånd",
              navLabel: "Platysma",
              paragraphs: [
                "Platysma er en overfladisk muskel på halsen, som hos nogle bliver tydeligere ved bevægelse eller med alderen.",
                "Synlige halsbånd kan have forskellige årsager, og valg af behandling kræver en individuel vurdering.",
              ],
            },
          ],
        },
        {
          id: "medicinske-problemstillinger",
          title: "Medicinske problemstillinger",
          items: [
            {
              id: "svedtendens",
              title: "Overdreven svedtendens",
              navLabel: "Svedtendens",
              paragraphs: [
                "Kraftig svedtendens, også kaldet hyperhidrose, kan påvirke hverdagen betydeligt.",
                "Svedtendens kan have forskellige årsager, og det er vigtigt at vurdere, om der er behov for yderligere undersøgelse eller behandling.",
                "Vi kan vejlede om, hvilke muligheder der eventuelt er relevante, og om der er behov for en lægelig vurdering.",
              ],
            },
            {
              id: "taenderskaeren",
              title: "Tænderskæren og spændinger i kæben",
              navLabel: "Tænderskæren",
              paragraphs: [
                "Tænderskæren, også kaldet bruksisme, kan være forbundet med slid på tænderne, spændinger eller ubehag i kæben.",
                "Der findes forskellige mulige årsager og behandlingsformer. Ved symptomer fra tænder eller kæbeled kan en tandlægelig vurdering være nødvendig.",
              ],
            },
          ],
        },
        {
          id: "individuel-vurdering",
          title: "En individuel vurdering kommer først",
          surface: "band",
          paragraphs: [
            "Det er ikke altid den behandling, man på forhånd har hørt om, der er den rette.",
            "Hos Fillox lægger vi vægt på at forstå problemet, gennemgå mulighederne og afklare, hvad der er fagligt relevant.",
            "Vi fortæller også, når en anden behandlingsform, yderligere undersøgelse eller henvisning er mere hensigtsmæssig.",
          ],
          cta: { label: "Kontakt os om konsultation", href: routes.contact, style: "button" },
        },
        {
          id: "faglighed-og-ansvar",
          title: "Faglighed og ansvar",
          paragraphs: [
            "Vores behandlere arbejder efter fælles faglige standarder med løbende undervisning og opfølgning gennem Fillox Academy.",
            "Undersøgelse, behandlingsvalg og eventuel udførelse sker inden for de enkelte behandleres kompetencer og registreringer.",
          ],
        },
      ],
      faq: [
        {
          question: "Er lip flip det samme som lip filler?",
          answer:
            "Nej. Det er to forskellige behandlingsprincipper. Lip filler tilfører volumen, mens lip flip har et andet formål og kræver en særskilt faglig vurdering.",
        },
        {
          question: "Kan kraftige tyggemuskler behandles?",
          answer:
            "Det afhænger af årsagen, muskelaktiviteten og eventuelle gener. En vurdering skal afklare, om behandling er relevant.",
        },
        {
          question: "Hvornår bør jeg søge læge ved overdreven svedtendens?",
          answer:
            "Hvis svedtendensen er nyopstået, uforklarlig eller ledsages af andre symptomer, bør du kontakte din læge for at undersøge mulige årsager.",
        },
        {
          question: "Kan jeg bestille en konsultation, hvis jeg er usikker på behandlingen?",
          answer: "Ja. Du kan kontakte os for at få afklaret, hvilke muligheder for vurdering der findes hos Fillox.",
        },
      ],
      closing: {
        title: "Kontakt Fillox",
        paragraphs: [
          "Har du spørgsmål om en af problemstillingerne, hjælper vi dig gerne videre med information om relevante konsultationsmuligheder.",
        ],
        cta: { label: "Kontakt os", href: routes.contact },
      },
    },
  },
  // Hudforbedring
  {
    slug: "skinbooster",
    name: "Skinbooster",
    categorySlug: "hudforbedring",
    // Ejal 40, 1 behandling (the live price list; also "fra 1.499 kr" on Alberte's profile). The
    // design's home bestseller row (6a/mf) said "fra 999 kr"; the live list confirms 1.499 kr.
    priceFrom: lowestListPrice("skinbooster"),
    short: "Fugt, glød og forbedring af hudens kvalitet.",
    detail: {
      lead: "Skinboosters med hyaluronsyre, der fugter, strammer slap hud op og forbedrer hudens kvalitet. Vi bruger Ejal 40 og Sunekos.",
      heroImage: categoryImage("hudforbedring"),
      // Ejal 40: ca. 20 min, omtrent 12 mdr, 12–24 timer; Sunekos: ca. 30 min, cirka 6 mdr, ingen.
      facts: [
        { label: "Pris", value: from(lowestListPrice("skinbooster")) },
        { label: "Varighed", value: "ca. 20–30 min" },
        { label: "Holdbarhed", value: "ca. 6–12 mdr" },
        { label: "Restitution", value: "Op til 24 timer" },
      ],
      about: [
        "Ejal 40 er en biorevitaliserende gel med 40 mg hyaluronsyre, der stimulerer dannelsen af nyt kollagen og elastin. Den strammer slap hud op, mindsker rynker og forbedrer hudtone og elasticitet.",
        "Sunekos kombinerer hyaluronsyre og aminosyrer og er særligt god til svære områder som mørke rande og poser under øjnene, linjer på overlæben og hudkvaliteten på panden. Sunekos er ikke en filler, så resultatet ser naturligt ud.",
      ],
      goodFor: ["Slap hud og rynker", "Mørke rande og poser under øjnene", "Hudtone og elasticitet", "Fugt og spændstighed"],
      faq: [
        {
          question: "Hvor mange behandlinger skal jeg have?",
          answer:
            "Med Ejal 40 gentager du behandlingen 2–3 uger efter den første og vedligeholder derefter 1–2 gange om året. Sunekos gives som et forløb på 3–4 behandlinger med 1–2 ugers mellemrum og derefter en opfølgning cirka hver 6. måned.",
        },
        {
          question: "Hvornår kan jeg se resultatet?",
          answer:
            "Resultatet af Ejal 40 viser sig efter cirka 1–2 uger og holder omtrent 12 måneder. Sunekos holder cirka 6 måneder. Effekten aftager gradvist, fordi hyaluronsyre nedbrydes med tiden.",
        },
        {
          question: "Gør det ondt?",
          answer:
            "Ikke meget. Ejal 40 ligger på cirka 2 ud af 10 på smerteskalaen, så bedøvelse er ikke nødvendig. Vil du have bedøvende creme, så sig det til klinikken, da cremen skal virke i cirka 30 minutter.",
        },
        {
          question: "Kan jeg gå på arbejde dagen efter?",
          answer:
            "Ja. Stikkene kan ligne myggestik, men de forsvinder som regel inden for 12–24 timer, og der kan komme et par blå mærker. Gnid og massér ikke området de første 12 timer, og spring makeup, sauna og træning over. Efter Sunekos omkring øjnene kan der være hævelse i 24–72 timer.",
        },
      ],
    },
  },
  {
    slug: "profhilo",
    name: "Profhilo",
    categorySlug: "hudforbedring",
    priceFrom: lowestListPrice("profhilo"),
    short: "Hyaluronsyre, der stimulerer kollagen og elastin, til løs hud i ansigtet og på halsen.",
    detail: {
      lead: "Profhilo er en ny type hyaluronsyre til løs hud i ansigtet og på halsen. Den stimulerer hudens eget kollagen og elastin for et naturligt resultat.",
      heroImage: categoryImage("hudforbedring"),
      facts: [
        { label: "Pris", value: from(lowestListPrice("profhilo")) },
        { label: "Varighed", value: "ca. 20 min" },
        { label: "Holdbarhed", value: "ca. 12 mdr" },
        { label: "Restitution", value: "12–24 timer" },
      ],
      about: [
        "Profhilo er fremstillet i Schweiz med en patenteret teknologi. Takket være termisk tværbinding er hyaluronsyren modstandsdygtig over for det enzym, der naturligt nedbryder den, så effekten holder længe.",
        "Profhilo stimulerer produktionen af flere typer kollagen og elastin, en effekt du ikke får med traditionelle fillers. Vi sprøjter produktet ind i 5 punkter på hver side af ansigtet, 1 ml på hver side.",
      ],
      goodFor: ["Løs hud i ansigtet", "Løs hud på halsen", "Naturlige anti-age-resultater"],
      faq: [
        {
          question: "Hvor mange behandlinger skal jeg have?",
          answer:
            "Gentag behandlingen 4–6 uger efter den første for det bedste resultat, selvom mange ser en tydelig forbedring efter én. Derefter er det en fordel at vedligeholde 1–2 gange om året.",
        },
        {
          question: "Hvornår kan jeg se resultatet?",
          answer:
            "Resultatet ses med det samme og holder cirka 12 måneder. Effekten aftager gradvist over de sidste måneder.",
        },
        {
          question: "Gør det ondt?",
          answer:
            "Ikke meget. Profhilo ligger på cirka 2 ud af 10 på smerteskalaen, så bedøvelse er ikke nødvendig. Vil du have bedøvende creme, så sig det til klinikken, da cremen skal virke i cirka 30 minutter.",
        },
        {
          question: "Kan jeg gå på arbejde dagen efter?",
          answer:
            "Ja. Stikkene kan ligne myggestik, men de forsvinder normalt inden for 12–24 timer, og der kan komme et par blå mærker. Gnid og massér ikke området de første 12 timer, og spring makeup, sauna og træning over.",
        },
      ],
    },
  },
  {
    slug: "microneedling",
    name: "Microneedling",
    categorySlug: "hudforbedring",
    priceFrom: lowestListPrice("microneedling"),
    short: "Stimulerer hudens egen kollagen for jævnere tekstur og glød.",
    detail: {
      lead: "Microneedling med Infini giver en sund hudkvalitet med naturlige ingredienser. Huden strammes op, fugtes og beroliges.",
      heroImage: categoryImage("hudforbedring"),
      facts: [
        { label: "Pris", value: from(lowestListPrice("microneedling")) },
        { label: "Varighed", value: "ca. 30 min" },
        { label: "Holdbarhed", value: "ca. 12 mdr" },
        { label: "Restitution", value: "1–3 dage" },
      ],
      about: [
        "En pen føres forsigtigt hen over huden og skaber tusindvis af mikroskopiske kanaler. Samtidig tilfører vi Infini-mesoterapi med hyaluronsyre, vitaminer, co-enzymer, mineraler, antioxidanter og peptider. Du kan også vælge microneedling med NCTF 135 HA.",
        "Vi behandler oftest ansigt og nakke, men også bagsiden af hænderne, indersiden af armene, ben og mave.",
      ],
      goodFor: ["Fine linjer og rynker", "Dehydreret hud", "Grå og blød hud", "Tynd og løs hud"],
      faq: [
        {
          question: "Gør det ondt?",
          answer:
            "Vi lægger bedøvende creme på området før behandlingen, så de fleste beskriver det som ubehag snarere end smerte.",
        },
        {
          question: "Hvornår kan jeg se resultatet?",
          answer:
            "Du ser en effekt med det samme, men den bedste effekt ses 1–2 uger senere. Vi anbefaler mindst tre behandlinger for et langtidsholdbart resultat.",
        },
        {
          question: "Er der bivirkninger?",
          answer: "Rødme og ømhed i området er normalt i 24–72 timer efter behandlingen.",
        },
        {
          question: "Hvad skal jeg undgå bagefter?",
          answer:
            "Undgå makeup i 24 timer, fordi huden er åben. Brug meget rene produkter de næste 2 dage og en høj solfaktor de første dage.",
        },
      ],
    },
  },
  {
    slug: "prf-hud",
    name: "PRF hud",
    categorySlug: "hudforbedring",
    priceFrom: lowestListPrice("prf-hud"),
    short: "Kroppens egne vækstfaktorer til naturlig hudforbedring.",
    detail: {
      lead: "PRF bruger kroppens egne ressourcer til at forny huden og øge kollagenproduktionen, for bedre tekstur, færre fine linjer og et friskere udseende.",
      heroImage: categoryImage("hudforbedring"),
      facts: [
        { label: "Pris", value: from(lowestListPrice("prf-hud")) },
        { label: "Varighed", value: "30–40 min" },
        { label: "Holdbarhed", value: "ca. 6–12 mdr" },
        { label: "Restitution", value: "Ingen reel" },
      ],
      about: [
        "PRF (platelet-rich fibrin) er plasma fra dit eget blod. Det indeholder vækstfaktorer, der stimulerer hudens fornyelse, og giver en naturlig hudforbedring uden kunstige fyldstoffer.",
        "PRF bruges især mod fine linjer og rynker, dårlig hudtekstur, akne-ar og pigmentering. For den bedste hudkvalitet anbefaler vi tre behandlinger med en måneds mellemrum.",
      ],
      goodFor: ["Fine linjer og rynker", "Hudtekstur og store porer", "Akne-ar og pigmentering", "Tør eller solskadet hud"],
      faq: [
        prfFaq.how,
        {
          question: "Hvornår kan jeg se resultatet?",
          answer:
            "Det er forskelligt. Nogle ser en bedre hudtekstur og færre synlige rynker efter en uge eller to, for andre tager det 3–5 uger eller mere at se det fulde resultat.",
        },
        prfFaq.before,
        prfFaq.after,
        prfFaq.sideEffects,
      ],
    },
  },
  {
    slug: "signatur-ansigtsbehandling",
    name: "Signatur ansigtsbehandling",
    categorySlug: "hudforbedring",
    priceFrom: lowestListPrice("signatur-ansigtsbehandling"),
    short: "Peeling, maske og LED med Dr. Dennis Gross.",
    detail: {
      lead: "Klinisk ansigtsbehandling med Dr. Dennis Gross: peeling, gel-maske og LED-lys for glød, bedre hudstruktur og fugt. Synlige resultater fra første gang.",
      heroImage: categoryImage("hudforbedring"),
      // fillox.dk/hudforbedring/infini-microneedling-copy: ca. 60 min, restitution 1–3 dage, no
      // stated longevity. Its FAQ is the microneedling page's (pen, numbing cream), so it is not used.
      facts: [
        { label: "Pris", value: from(lowestListPrice("signatur-ansigtsbehandling")) },
        { label: "Varighed", value: "ca. 60 min" },
        { label: "Restitution", value: "1–3 dage" },
        { label: "Produkter", value: "Dr. Dennis Gross" },
      ],
      about: [
        "Vi starter med en professionel peeling med Dr. Dennis Gross' AHA/BHA-formulering, der eksfolierer døde hudceller og forbereder huden. Derefter følger en intensiv gel-maske, der genopbygger hudbarrieren og tilfører fugt.",
        "Mens masken virker, får du LED-lysterapi med DRx SpectraLite FaceWare Pro, en LED-maske med rødt og blåt lys. Som afslutning kan du tilkøbe et finish-produkt fra serien, fx et serum til hjemmebrug.",
      ],
      goodFor: ["Glød og udstråling", "Rødme og irritation", "Urenheder", "En jævnere hudstruktur"],
      faq: [
        {
          question: "Hvornår kan jeg se resultatet?",
          answer: "Du ser resultater allerede efter første behandling: mere glød, en jævnere hud og intens fugt.",
        },
        {
          question: "Kan jeg fortsætte behandlingen derhjemme?",
          answer:
            "Ja. Vi forhandler hele hudplejeserien fra Dr. Dennis Gross, og din behandler kan sammensætte et personligt program til hjemmebrug ud fra din hudtype, dine mål og dine behandlinger i klinikken.",
        },
      ],
    },
  },
  // Laser hårfjerning
  {
    slug: "laser-harfjerning",
    name: "Laser hårfjerning",
    categorySlug: "laser-harfjerning",
    priceFrom: lowestListPrice("laser-harfjerning"),
    short: "Permanent hårfjerning til alle hudtyper, fra overlæbe til hel krop.",
    detail: {
      lead: "Effektiv og langvarig hårfjerning med diodelaser. Indbygget køling gør behandlingen behagelig, og den kan udføres på hele kroppen, for både kvinder og mænd.",
      heroImage: categoryImage("laser-harfjerning"),
      facts: laserFacts(lowestListPrice("laser-harfjerning")),
      ...laserAbout,
    },
  },
  // Hårtab & hovedbund
  {
    slug: "prf-har",
    name: "PRF hår",
    categorySlug: "hartab",
    priceFrom: lowestListPrice("prf-har"),
    short: "PRF fra dit eget blod og mesoterapi i hovedbunden, der styrker håret.",
    detail: {
      lead: "PRF fra dit eget blodplasma kombineret med mesoterapi i hovedbunden. En skræddersyet behandling, der skal styrke og genoplive dit hår.",
      heroImage: categoryImage("hartab"),
      ...prfHarAbout,
    },
  },
  {
    slug: "polyphil-hair",
    name: "PolyPhil Hair",
    categorySlug: "hartab",
    priceFrom: lowestListPrice("polyphil-hair"),
    short: "Behandlingskur med polynukleotider til hovedbunden ved tyndt hår.", // TODO: copy review (no live page)
  },
  // For mænd: the live site has no pages of their own; facts from the treatment they are a variant of.
  // (The men's wrinkle treatment is the rynkebehandling hub: content/navigation.ts, content/pages/men.ts.)
  {
    slug: "kaebelinje-for-maend",
    name: "Kæbelinje for mænd",
    categorySlug: "for-maend",
    priceFrom: lowestListPrice("kaebelinje"),
    short: "Filler, der giver en mere markant kæbelinje og en skarpere profil.",
    detail: {
      lead: "Kæbelinjen definerer maskulinitet. Filler giver en tydeligere overgang mellem hoved og hals, en mere markant profil og et slankere ansigt.",
      heroImage: categoryImage("for-maend"),
      ...kaebelinjeAbout,
    },
  },
  {
    slug: "hartab-for-maend",
    name: "Hårtab for mænd",
    categorySlug: "for-maend",
    priceFrom: lowestListPrice("prf-har"),
    mobileMenuName: "Hårtab for mænd (PRF)",
    short: "PRF og mesoterapi i hovedbunden ved hårtab og tyndere hår.",
    detail: {
      lead: "PRF fra dit eget blodplasma og mesoterapi i hovedbunden, til dig med hårtab eller tyndere hår. Behandlingen passer til både mænd og kvinder.",
      heroImage: categoryImage("for-maend"),
      ...prfHarAbout,
    },
  },
  {
    slug: "laser-for-maend",
    name: "Laser for mænd",
    categorySlug: "for-maend",
    priceFrom: lowestListPrice("laser-harfjerning"),
    mobileMenuName: "Laser hårfjerning",
    short: "Laser hårfjerning på ryg, skuldre, bryst og resten af kroppen, med faste priser på kombinerede områder.", // TODO: copy review
    detail: {
      lead: "Hårfjerning med diodelaser på ryg, skuldre, bryst og resten af kroppen. Indstillingerne tilpasses din hudtype og hårstruktur.", // TODO: copy review
      heroImage: categoryImage("for-maend"),
      facts: laserFacts(lowestListPrice("laser-harfjerning")),
      ...laserAbout,
      pricesTitle: "Priser for mænd",
      pricesIntro: `Faste priser på kombinerede områder. Enkelte områder koster ${from(lowestListPrice("laser-harfjerning"))} og står på prislisten.`,
      prices: cardRows("laser-maend"),
    },
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
    // The hub's name, not the product's (the design said "Botox", a prescription medicine). Its
    // "fra" price is the hub's: the lowest row of the price list's Rynkebehandling card.
    name: "Rynkebehandling",
    description: "Mimiklinjer og udvalgte kosmetiske behandlingsområder.",
    mobileDescription: "Mimiklinjer og udvalgte behandlingsområder.",
    ...bestsellerTreatment("rynkebehandling"),
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
    // 6a/mf show "fra 999 kr" here; the live price list starts skinboosters at 1.499 kr (Ejal 40).
    ...bestsellerTreatment("skinbooster"),
  },
  {
    number: "04",
    name: "Laser",
    // The design's text ("Målrettede behandlinger til hudens struktur og udtryk") described a skin
    // laser; Fillox's laser is hair removal (fillox.dk/harfjerning).
    description: "Hårfjerning med diodelaser, fra ansigtet til hele kroppen.",
    mobileDescription: "Hårfjerning med diodelaser.",
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

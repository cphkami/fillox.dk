import { routes } from "./routes";
import type { BlogFilter, BlogPost, Link } from "./types";
import { photos } from "./photos";
import { priceCards } from "./prices";
import { blogPage } from "./pages/blog";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";

/**
 * Blog posts (design 6blog / mbl overview, 6art / mar article).
 *
 * Published (owner, 2026-11-25: "lave bloggen. skriv et par artikler", signed "Fillox-holdet";
 * "lad os lave simpelt tekster til blogs så vi har noget som kan bruges"): seven articles dated
 * 2026-11-25, their real publication date. They have no `authorSlug`, so they are signed by the
 * team (content/pages/blog.ts → blogArticle.teamAuthor). Every fact in them comes from the site's
 * own content or the live fillox.dk; the `// source:` comment above each block says where. Copy
 * marked "fagligt tjek (læge)" must be read by a doctor before launch.
 *
 * Rynkebehandling (owner, 2026-11-25): the three former Botox posts are rewritten as articles about
 * the TREATMENT (consultation, the doctor's assessment, course, aftercare) without the product name
 * or the active substance anywhere in them: Botox is a prescription medicine, and advertising it to
 * the public is prohibited, also on the clinic's own website (lægemiddelloven § 66, VEJ 9400/2022
 * pkt. 8.1). They follow the rynkebehandling pages' line (content/treatments.ts header): the hub's
 * own words for the treatment ("muskelafslappende injektionsbehandling", "rynkebehandling med et
 * receptpligtigt lægemiddel"), no prices, no booking card (it shows a "fra" price), no results,
 * no named practitioner, only product-free photos. check:market (rule 14) guards the product name
 * and the booking card.
 *
 * `published: false` puts a post on hold (content/types.ts → BlogPost.published); none is on hold
 * now. check:market then makes sure nothing links it.
 *
 * Images: the clinic's own mood photos (content/photos.ts; the design's were stock), one per post,
 * all different. Never the team portraits (public/images/team/, content/team.ts; owner 2026-11-25:
 * their mood copies are deleted) and never a person who is named on the same page; syringe photos
 * (`sproejte`, `behandlerSproejte`) only on filler and skin posts. `position` keeps the face in the
 * wide crops (the article header is 2.32 : 1). Only `spejl` (1548px) fills the article header's
 * 1440px at 1x; the other files are 782–1135px wide and are drawn up to 1.84× there on the 1600
 * canvas (README: larger originals requested).
 * TODO: copy review (image choice + alt).
 */

/**
 * Every filter chip, in the design's order (desktop 6blog; mobile mbl hides "Guides"). /blog
 * shows `blogFilters` below: only chips with at least one published post. The design's "Botox"
 * chip is "Rynkebehandling" (a prescription medicine is never named; owner, 2026-11-25).
 */
export const allBlogFilters: BlogFilter[] = [
  { slug: blogPage.allFilter, label: "Alle" },
  // TODO: copy review
  { slug: "rynkebehandling", label: "Rynkebehandling" },
  { slug: "filler", label: "Filler" },
  { slug: "hudpleje", label: "Hudpleje" },
  { slug: "efterpleje", label: "Efterpleje" },
  { slug: "guides", label: "Guides", desktopOnly: true },
];

/* ----------------------------------------------------------- facts used in the posts */

/** A row's amount on the price list (content/prices.ts), formatted ("1.199 kr"). Throws when the row is gone. */
function listPrice(cardId: string, label: string): string {
  const price = priceCards.find((c) => c.id === cardId)?.rows.find((r) => r.label === label)?.price;
  if (price?.kind !== "amount") throw new Error(`blog: no price for "${label}" in price card "${cardId}"`);
  return formatPrice(price.amount);
}

/** Lip filler amounts as sold (content/prices.ts → fillers), in ml with the market's decimal comma. */
const LIP_AMOUNTS = ["0,3", "0,5", "0,7", "1,0"] as const;
const lipFillerPrice = (ml: (typeof LIP_AMOUNTS)[number]) => listPrice("fillers", `Lip filler · Revanesse ${ml} ml`);
const hyalasePrice = listPrice("fillers", "Opløsning af filler (Hyalase)");
const ejalPrice = listPrice("hudforbedring", "Ejal 40 · 1 behandling");
const sunekosPrice = listPrice("hudforbedring", "Sunekos Performa · 1 behandling");
const profhiloPrice = listPrice("hudforbedring", "Profhilo · 1 behandling");

/** The 24/7 on-call line (content/pages/contact.ts → "Vagtlæge 24/7", "Akuttelefon …"). */
const ON_CALL_PHONE = site.contact.phone;

/* ------------------------------------------------------- closing links (copy review) */

const treatmentLink = (label: string, slug: string): Link => ({ label, href: `${routes.treatments}/${slug}` });
// TODO: copy review (link labels)
const links = {
  lipFiller: treatmentLink("Læs om lip filler", "lip-filler"),
  skinbooster: treatmentLink("Læs om skinbooster", "skinbooster"),
  profhilo: treatmentLink("Læs om Profhilo", "profhilo"),
  prices: { label: "Se alle priser", href: `${routes.prices}#fillers` },
  skinPrices: { label: "Se priser på hudforbedring", href: `${routes.prices}#hudforbedring` },
  contact: { label: "Kontakt os", href: routes.contact },
  consultation: { label: "Book en gratis konsultation", href: site.booking.href },
  // Rynkebehandling posts: the hub's own CTA ("Book en konsultation"), with no price word.
  wrinkles: treatmentLink("Læs om rynkebehandling", "rynkebehandling"),
  otherOptions: treatmentLink("Læs om andre behandlingsmuligheder", "andre-behandlingsmuligheder"),
  wrinkleConsultation: { label: "Book en konsultation", href: site.booking.href },
} satisfies Record<string, Link>;

/** Eyebrow of the inline booking card (design 6art). */
const BOOKING_EYEBROW = "Behandlingen i artiklen";

export const allPosts: BlogPost[] = [
  /* ----------------------------------------------------------------- published */
  {
    slug: "lip-filler-for-foerste-gang",
    title: "Lip filler for første gang: sådan foregår det",
    category: "Filler",
    categorySlug: "filler",
    kind: "Guide",
    tags: ["filler", "guides"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-11-25",
    featured: true,
    // TODO: copy review
    excerpt:
      "Fra konsultationen til den gratis kontrol: sådan foregår en behandling med lip filler hos Fillox, og hvad du kan forvente de første dage.",
    excerptShort: "Fra konsultationen til den gratis kontrol, og hvad du kan forvente de første dage.",
    image: photos.behandlerFolder,
    treatmentSlugs: ["lip-filler"],
    relatedPostSlugs: ["lip-filler-0-5-eller-1-ml", "haevelse-og-blaa-maerker", "skinbooster-eller-profhilo"],
    // TODO: fagligt tjek (læge) + copy review
    body: [
      {
        type: "lead",
        text: "Overvejer du lip filler for første gang? Her gennemgår vi, hvordan en behandling hos Fillox foregår, fra konsultationen til kontrollen bagefter, så du ved, hvad du kan forvente.",
      },
      { type: "h2", id: "konsultationen", text: "Først en konsultation" },
      // source: content/treatments.ts → lip-filler about[1] ("Vi starter altid med en konsultation, hvor
      // din behandler vurderer din anatomi og lægger en plan sammen med dig"); fillox.dk/fillers/lip-filler
      // (intro: "ønsker vil variere ud fra blandt andet alder og personlige præferencer"; FAQ "Hvordan
      // foregår behandlingen?": analyse, rådgivning, "sammen aftaler I det ønskede resultat")
      {
        type: "paragraph",
        text: "Vi starter altid med en konsultation. Din behandler ser på dine læber, taler med dig om dine ønsker og lægger en plan sammen med dig. Hvad der er smukke læber, er personligt og afhænger blandt andet af alder og smag, så det vigtigste er, at planen passer til dig og din anatomi.",
      },
      // source: content/prices.ts → konsultation ("Fillers konsultation", "30 min, v. kosmetisk
      // sygeplejerske", gratis); content/treatments.ts → lip-filler bookingText ("Eller book en gratis
      // konsultation, hvis du er i tvivl"); content/navigation.ts ("Helt uforpligtende")
      // TODO: copy review ("Konsultationen er gratis" first, so a newcomer reads the consultation above
      // and the free one as the same thing)
      {
        type: "paragraph",
        text: "Konsultationen er gratis. Er du i tvivl, om lip filler er noget for dig, kan du booke den som en tid for sig, før du beslutter dig. Den tager 30 minutter hos en kosmetisk sygeplejerske og er helt uforpligtende.",
      },
      // source: fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 4 (forkølelsessår/herpes kan blusse
      // op efter injektionerne, især ved læbefillers; tal med lægen før behandlingen)
      {
        type: "paragraph",
        text: "Har du tidligere haft forkølelsessår (herpes), så sig det, før du bliver behandlet. Injektioner i læberne kan få det til at blusse op, og det skal du tale med en læge om inden behandlingen.",
      },
      { type: "h2", id: "selve-behandlingen", text: "Selve behandlingen" },
      // source: content/treatments.ts → lip-filler facts ("ca. 20 min"), about[0] (hyaluronsyre, findes
      // naturligt i huden); fillox.dk/fillers/lip-filler FAQ ("Læberne vil derefter blive renset, inden
      // filleren injiceres med en meget tynd nål")
      {
        type: "paragraph",
        text: "Behandlingen tager cirka 20 minutter. Læberne bliver renset, og derefter sprøjter din behandler filleren ind med en meget tynd nål. Filleren er lavet af hyaluronsyre, et stof, der findes naturligt i huden.",
      },
      // source: content/treatments.ts → lip-filler FAQ "Gør behandlingen ondt?", fillerFaq.pain (lidocain
      // virker under behandlingen og i den første tid bagefter; bedøvende creme)
      {
        type: "paragraph",
        text: "Læberne er følsomme, så de fleste mærker noget ubehag, men tåler det godt. Filleren er tilsat lidocain, et bedøvelsesmiddel, der virker under behandlingen og i den første tid bagefter. Vil du have bedøvende creme først, kan du også få det.",
      },
      // source: content/treatments.ts → lip-filler lead ("Vi doserer konservativt, du kan altid bygge på senere")
      { type: "paragraph", text: "Vi doserer konservativt, så du altid kan bygge på senere." },
      // source: content/prices.ts → pricesPage.intro ("Konsultation og kontrol er altid gratis")
      {
        type: "booking",
        treatmentSlug: "lip-filler",
        eyebrow: BOOKING_EYEBROW,
        note: "Konsultation og kontrol er altid gratis",
        hideNoteOnMobile: true,
      },
      { type: "h2", id: "de-foerste-dage", text: "De første dage" },
      // source: content/treatments.ts → lip-filler about[1] (resultatet ses med det samme, det endelige
      // efter cirka en uge), FAQ "Er der bivirkninger?" ("Læberne hæver ofte lidt mere end andre områder,
      // typisk 1–3 dage"); fillox.dk/fillers/lip-filler ("hævelse er almindelig i 1-3 dage")
      {
        type: "paragraph",
        text: "Du kan se resultatet med det samme, men læberne vil være hævede. Læber hæver ofte lidt mere end andre områder, typisk i 1–3 dage. Det endelige resultat ser du efter cirka en uge, når hævelsen har lagt sig.",
      },
      // source: content/treatments.ts → lip-filler FAQ "Er der bivirkninger?" (hævelse, ømhed, rødme, kløe
      // og blå mærker, op til en uge; "Kontakt en læge hurtigst muligt, hvis en betændelsesreaktion varer
      // mere end en uge"); fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 7 og 8
      {
        type: "paragraph",
        text: "Det er også almindeligt at være lidt rød, øm eller kløende og at få et blåt mærke, hvor nålen har været. Den slags reaktioner varer op til en uge. Varer en betændelsesreaktion længere, eller får du andre gener, skal du hurtigst muligt kontakte en læge, for eksempel vores vagtlæge.",
      },
      // source: the urgent signs and the 112 list of "haevelse-og-blaa-maerker" below (general advice
      // after hyaluronic-acid filler, not on fillox.dk); content/pages/contact.ts → on-call
      // ("Akuttelefon" = site.contact.phone). TODO: fagligt tjek (læge): keep in step with
      // "haevelse-og-blaa-maerker" (the doctor is asked to word the skin-colour sign there).
      {
        type: "paragraph",
        text: `Bliver smerterne stærkere i stedet for at aftage, eller bliver huden i eller omkring læberne hvid, bleg, plettet eller blålig, så ring med det samme til vores akuttelefon, ${ON_CALL_PHONE}. Får du synsforstyrrelser eller svært ved at trække vejret eller synke, så ring 112.`,
      },
      // Tap to call on a phone, first (as under the warning signs of "haevelse-og-blaa-maerker" and
      // "de-foerste-24-timer-efter-rynkebehandling"). TODO: copy review (link labels)
      {
        type: "links",
        items: [
          { label: `Ring til akuttelefonen, ${ON_CALL_PHONE}`, href: site.contact.phoneHref },
          { label: "Hvad er normalt, og hvornår skal du ringe?", href: `${routes.blog}/haevelse-og-blaa-maerker#kontakt-os` },
        ],
      },
      { type: "h2", id: "efterpleje", text: "Sådan passer du på læberne" },
      // One of the tips (alcohol) is about the day before, too. TODO: copy review
      { type: "paragraph", text: "Et par enkle råd til tiden før og efter behandlingen:" },
      // source: content/treatments.ts → fillerFaq.aftercare; fillox.dk/fillers/faq-om-fillers-behandling,
      // spørgsmål 2, 3, 5 og 6 (6 also names Paracet: left out on purpose, as in fillerFaq.aftercare.
      // TODO: fagligt tjek (læge): may the article say what to take for pain, e.g. paracetamol?)
      {
        type: "list",
        style: "bullet",
        items: [
          "Rør ikke ved læberne de første 6 timer. Derefter kan du vaske området forsigtigt med vand og sæbe.",
          "Undgå sol og solarium, indtil hævelse og rødme er forsvundet.",
          "Begræns alkohol 24 timer før og efter behandlingen.",
          "Undgå Aspirin, Ibux og Voltaren, som kan give mere blødning og flere blå mærker.",
        ],
      },
      // source: general patient-safety advice, not on fillox.dk (as in "haevelse-og-blaa-maerker": never
      // stop prescribed medicine on your own). TODO: fagligt tjek (læge)
      {
        type: "paragraph",
        text: "Tager du medicin, som en læge har ordineret, så stop ikke selv med den. Tal med os eller din egen læge først.",
      },
      { type: "h2", id: "holdbarhed", text: "Hvor længe holder det?" },
      // source: content/treatments.ts → lip-filler FAQ "Hvor længe holder resultatet?" (typisk 6–9
      // måneder, varierer, nedbrydes gradvist, du kan vælge at bygge på igen) and "Kan filler opløses
      // igen?" (Hyalase)
      {
        type: "paragraph",
        text: "Typisk 6–9 måneder, men det varierer fra person til person. Kroppen nedbryder hyaluronsyren gradvist, så resultatet aftager langsomt, og du bestemmer selv, om du vil bygge på igen. Filler af hyaluronsyre kan også opløses med Hyalase, hvis der bliver brug for det.",
      },
      { type: "h2", id: "kontrol", text: "Kontrol og spørgsmål bagefter" },
      // source: content/prices.ts → konsultation ("Kontrol efter behandling", "valgfri, ca. 14 dage efter",
      // gratis); fillox.dk/om-os/kontrol-eftertjek (evaluere resultatet og sikre, at alt forløber som
      // forventet; "Denne skal du selv booke"; "tilbydes kun én gang per behandling"; "Hvis der går mere
      // end 21 dage efter din behandling, bortfalder retten til kontroltiden")
      {
        type: "paragraph",
        text: "Cirka 14 dage efter behandlingen kan du komme til en gratis kontrol. Den er valgfri, og du booker den selv. Her ser I på resultatet sammen og sikrer, at alt forløber, som det skal. Kontrollen tilbydes én gang pr. behandling og skal ligge inden for 21 dage efter behandlingen.",
      },
      // source: content/pages/contact.ts → on-call ("Vagtlæge 24/7", "Akuttelefon" = site.contact.phone;
      // fillox.dk/kontakt "AKUT ASSISTANCE 24/7")
      {
        type: "paragraph",
        text: `Har du spørgsmål i mellemtiden, er du altid velkommen til at kontakte os. Vi har vagtlæge døgnet rundt på akuttelefonen, ${ON_CALL_PHONE}.`,
      },
      { type: "h2", id: "vil-du-vide-mere", text: "Vil du vide mere?" },
      {
        type: "paragraph",
        text: "På siden om lip filler kan du læse mere om behandlingen og se priserne for de forskellige mængder. Og er du i tvivl, er du velkommen til at booke en gratis konsultation.",
      },
      { type: "links", items: [links.lipFiller, links.consultation] },
    ],
  },
  {
    slug: "lip-filler-0-5-eller-1-ml",
    // A no-break space between the amount and "ml" (never "1 / ml" on a wrapped line).
    title: "0,5 eller 1 ml? Sådan vælger du den rette mængde",
    category: "Filler",
    categorySlug: "filler",
    // The design's "Resultat": the article is about choosing an amount and makes no result claims.
    // TODO: copy review
    kind: "Guide",
    tags: ["filler", "guides"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-11-25",
    // TODO: copy review
    excerpt:
      "Mængden afhænger af dine læber og dine ønsker. Her er, hvad der afgør valget, hvad mængderne koster, og hvorfor mange starter med 0,5 ml.",
    // The whole head (12% cut the crown) and the syringe in the 2.32 : 1 article header; at 4% the
    // crown has a little air at 1024–1600 and the syringe runs from the glove to the bottom edge.
    image: { ...photos.sproejte, position: "55% 4%" },
    treatmentSlugs: ["lip-filler"],
    relatedPostSlugs: ["lip-filler-for-foerste-gang", "haevelse-og-blaa-maerker", "skinbooster-eller-profhilo"],
    // TODO: fagligt tjek (læge) + copy review
    body: [
      // source: content/prices.ts → fillers ("Lip filler · Revanesse 0,3 / 0,5 / 0,7 / 1,0 ml")
      {
        type: "lead",
        text: "Når du får lip filler, skal der vælges en mængde: 0,3, 0,5, 0,7 eller 1 ml. Men hvordan ved du, hvad der passer til dig? Her er, hvad der afgør valget, og hvorfor du ikke skal beslutte det alene.",
      },
      { type: "h2", id: "dine-laeber-og-dine-oensker", text: "Det afhænger af dine læber og dine ønsker" },
      // source: fillox.dk/fillers/lip-filler (intro: hvad der er smukke læber, er et spørgsmål om
      // definition og ønsker, som varierer med alder og personlige præferencer); content/treatments.ts →
      // lip-filler goodFor (volumen, symmetri, læbekant)
      {
        type: "paragraph",
        text: "Der findes ikke én rigtig mængde. Hvad der er smukke læber, er personligt, og ønskerne varierer blandt andet med alder og smag. Nogle ønsker lidt mere volumen, andre en bedre symmetri eller en tydeligere læbekant.",
      },
      // source: content/treatments.ts → lip-filler about[1] (konsultation, anatomi, plan) and pricesIntro
      // ("Din behandler anbefaler mængden ved konsultationen")
      {
        type: "paragraph",
        text: "Derfor starter vi altid med en konsultation, hvor din behandler ser på din anatomi og lægger en plan sammen med dig. Det er også her, du får en anbefaling af, hvor meget der skal til.",
      },
      { type: "h2", id: "start-med-0-5-ml", text: "Hvorfor mange starter med 0,5 ml" },
      // source: content/treatments.ts → lip-filler pricesIntro ("Mange starter med 0,5 ml og bygger på
      // senere") and lead ("Vi doserer konservativt, du kan altid bygge på senere")
      {
        type: "paragraph",
        text: "Mange starter med 0,5 ml og bygger på senere. Vi doserer konservativt, så du altid kan bygge på. På den måde kan du se, hvordan resultatet bliver, før du tager stilling til, om du vil have mere.",
      },
      // source: content/treatments.ts → lip-filler about[1] (det endelige resultat efter cirka en uge, når
      // hævelsen har lagt sig), FAQ "Er der bivirkninger?" (læberne hæver typisk 1–3 dage)
      {
        type: "paragraph",
        text: "Husk, at læberne er hævede de første dage. Det endelige resultat ser du efter cirka en uge, når hævelsen har lagt sig, så vent med at vurdere mængden til da.",
      },
      // source: content/treatments.ts → lip-filler pricesIntro
      {
        type: "booking",
        treatmentSlug: "lip-filler",
        eyebrow: BOOKING_EYEBROW,
        note: "Din behandler anbefaler mængden ved konsultationen",
        hideNoteOnMobile: true,
      },
      { type: "h2", id: "behandlingen", text: "Sådan foregår behandlingen" },
      // source: content/treatments.ts → lip-filler facts ("ca. 20 min"), FAQ "Gør behandlingen ondt?"
      // (lidocain, bedøvende creme); fillox.dk/fillers/lip-filler FAQ ("Læberne vil derefter blive
      // renset, inden filleren injiceres med en meget tynd nål")
      {
        type: "paragraph",
        text: "Selve behandlingen tager cirka 20 minutter. Læberne bliver renset, og filleren sprøjtes ind med en meget tynd nål. Filleren er tilsat lidocain, et bedøvelsesmiddel, og vil du have bedøvende creme før behandlingen, kan du også få det.",
      },
      { type: "h2", id: "hvis-du-oensker-mere", text: "Hvis du ønsker mere" },
      // source: content/prices.ts → fillers (0,7 and 1,0 ml); content/treatments.ts → lip-filler pricesIntro
      {
        type: "paragraph",
        text: "Din behandler kan også anbefale 0,7 eller 1 ml, hvis det passer bedre til dine læber og den plan, I har lagt. Det er en faglig vurdering, og du er altid velkommen til at spørge, hvorfor en bestemt mængde bliver anbefalet.",
      },
      // source: content/treatments.ts → lip-filler FAQ "Hvor længe holder resultatet?"
      {
        type: "paragraph",
        text: "Du kan også bygge op over flere gange. Resultatet holder typisk 6–9 måneder, men det varierer fra person til person, og kroppen nedbryder hyaluronsyren gradvist.",
      },
      { type: "h2", id: "kontrollen", text: "Brug kontrollen til at tage stilling" },
      // source: content/prices.ts → konsultation ("Kontrol efter behandling", "valgfri, ca. 14 dage efter",
      // gratis); fillox.dk/om-os/kontrol-eftertjek (selv booke; evaluere resultatet; "Eventuelle justeringer
      // vil altid være baseret på en faglig vurdering … med udgangspunkt i dine ønsker"; flere behandlinger
      // "kan kræve en ny behandling med tilhørende pris"; "tilbydes kun én gang per behandling"; "Hvis der
      // går mere end 21 dage efter din behandling, bortfalder retten til kontroltiden")
      {
        type: "paragraph",
        text: "Cirka 14 dage efter behandlingen kan du komme til en gratis kontrol, som er valgfri, og som du selv booker. Her vurderer I resultatet sammen, og eventuelle justeringer bygger altid på en faglig vurdering og på dine ønsker. Bliver I enige om, at mere filler giver mening, er det en ny behandling med sin egen pris. Kontrollen tilbydes én gang pr. behandling og skal ligge inden for 21 dage efter behandlingen.",
      },
      // source: content/treatments.ts → lip-filler FAQ "Kan filler opløses igen?"; content/prices.ts →
      // fillers ("Opløsning af filler (Hyalase)", "pr. område")
      {
        type: "paragraph",
        text: `Skulle du fortryde, kan filler af hyaluronsyre opløses med Hyalase. Det koster ${hyalasePrice} pr. område pr. gang.`,
      },
      { type: "h2", id: "priser", text: "Hvad koster det?" },
      { type: "paragraph", text: "Prisen afhænger af mængden:" },
      // source: content/prices.ts → fillers (read from the price list, never typed here)
      {
        type: "list",
        style: "bullet",
        items: LIP_AMOUNTS.map((ml) => `${ml} ml: ${lipFillerPrice(ml)}`),
      },
      // source: content/prices.ts → pricesPage.intro ("Alle priser er vejledende. Den endelige pris
      // fastlægges altid ved din konsultation … Konsultation og kontrol er altid gratis.")
      {
        type: "paragraph",
        text: "Priserne er vejledende, og den endelige pris fastlægges ved din konsultation. Konsultation og kontrol er altid gratis.",
      },
      { type: "h2", id: "vil-du-vide-mere", text: "Vil du vide mere?" },
      {
        type: "paragraph",
        text: "På siden om lip filler kan du læse mere om behandlingen, og på prislisten finder du alle vores priser. Er du i tvivl om mængden, så book en gratis konsultation, så finder I ud af det sammen.",
      },
      { type: "links", items: [links.lipFiller, links.prices, links.consultation] },
    ],
  },
  {
    slug: "haevelse-og-blaa-maerker",
    title: "Hævelse og blå mærker: hvad er normalt?",
    category: "Efterpleje",
    categorySlug: "efterpleje",
    kind: "Efterpleje",
    tags: ["efterpleje", "filler"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-11-25",
    // TODO: copy review
    // ≤ 160 characters: also the meta description, the share text and the JSON-LD description.
    excerpt:
      "Lidt hævelse og et par blå mærker er almindeligt efter filler. Her er, hvad du kan forvente, hvordan du passer på området, og hvornår du skal kontakte os.",
    image: photos.behandlingKlient,
    // Every filler page with a page of its own shows it under "Fra bloggen": the site's only text with
    // the warning signs and the on-call line after a filler (the treatment pages' FAQ only says "kontakt
    // en læge" after a week). Not the skin pages (skinbooster, Profhilo): they name Alberte as "Din
    // behandler", and the woman in the white coat on this post's photo is not identified (README).
    treatmentSlugs: ["lip-filler", "kindben", "kaebelinje", "hage", "tear-trough", "naesekorrektion", "kaebelinje-for-maend"],
    relatedPostSlugs: ["lip-filler-for-foerste-gang", "lip-filler-0-5-eller-1-ml", "skinbooster-eller-profhilo"],
    // No booking card in the text: an article about warning signs sells nothing (the closing links
    // point to the treatment page, contact and booking).
    // TODO: fagligt tjek (læge) + copy review
    body: [
      {
        type: "lead",
        text: "Lidt hævelse og et par blå mærker er almindeligt efter en behandling med filler. Her er, hvad du kan forvente de første dage, hvordan du passer på området, og hvornår du skal kontakte os.",
      },
      { type: "h2", id: "det-er-normalt", text: "Det er normalt" },
      // source: fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 1 ("Du kan være rød, hævet og øm …
      // Dette er normalt og indikerer ikke nogen alvorlige symptomer")
      {
        type: "paragraph",
        text: "Efter en behandling med filler kan du være rød, hævet og øm i det område, der er behandlet. Det er normalt og som regel ikke et tegn på, at noget er galt. Almindelige reaktioner der, hvor filleren er sprøjtet ind, er:",
      },
      // source: fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 7 (rødme, hævelse, kløe, smerte,
      // stikkende/tappe, fasthed/ujævnheder, blå mærker, misfarvning); content/treatments.ts →
      // fillerFaq.sideEffects. TODO: fagligt tjek (læge): "misfarvning" (normal) next to "plettet eller
      // blålig" (call at once, below) is hard to tell apart. Proposed for the doctor: "Blå mærker der, hvor
      // nålen har været" here, and below "Huden i eller omkring området bliver hvid eller bleg, får et
      // plettet, netagtigt blåligt eller lilla mønster (ikke et almindeligt blåt mærke), eller føles kold."
      // (also in "lip-filler-for-foerste-gang"). Not changed until the doctor words it.
      {
        type: "list",
        style: "bullet",
        items: [
          "Rødme og hævelse",
          "Kløe og ømhed",
          "En stikkende eller bankende fornemmelse",
          "Fasthed eller små ujævnheder",
          "Blå mærker eller misfarvning",
        ],
      },
      // source: content/treatments.ts → fillerFaq.sideEffects ("De kan komme med det samme eller lidt
      // senere og varer op til en uge")
      {
        type: "paragraph",
        text: "Reaktionerne kan komme med det samme eller lidt senere og varer op til en uge.",
      },
      { type: "h2", id: "laeberne", text: "Læberne hæver mere" },
      // source: content/treatments.ts → lip-filler FAQ "Er der bivirkninger?" (typisk 1–3 dage) and
      // about[1] (det endelige resultat efter cirka en uge); fillox.dk/fillers/faq-om-fillers-behandling,
      // spørgsmål 7 ("Injektioner i læberne kan forårsage mere hævelse og blå mærker")
      {
        type: "paragraph",
        text: "Læberne hæver ofte lidt mere end andre områder og får lettere blå mærker. Hævelsen varer typisk 1–3 dage, og det endelige resultat ser du efter cirka en uge, når den har lagt sig. Vent derfor med at vurdere resultatet til da.",
      },
      // source: fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 4 (herpes kan blusse op; tal med
      // lægen før behandlingen)
      {
        type: "paragraph",
        text: "Har du tidligere haft forkølelsessår (herpes), kan det blusse op efter injektioner i læberne. Sig det ved konsultationen, så du kan tale med en læge om det før behandlingen.",
      },
      { type: "h2", id: "skinbooster", text: "Efter en skinbooster eller Profhilo" },
      // source: content/treatments.ts → skinbooster FAQ "Kan jeg gå på arbejde dagen efter?" (myggestik,
      // 12–24 timer, blå mærker; Sunekos omkring øjnene 24–72 timer), profhilo FAQ (samme)
      {
        type: "paragraph",
        text: "Efter Ejal 40 og Profhilo kan stikkene ligne myggestik. De forsvinder normalt inden for 12–24 timer, og der kan komme et par blå mærker. Efter Sunekos omkring øjnene kan der være hævelse i 24–72 timer.",
      },
      { type: "h2", id: "pas-paa-omraadet", text: "Sådan passer du på området" },
      { type: "paragraph", text: "Et par råd til tiden omkring en behandling med filler:" },
      // source: fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 5 (alkohol 24 timer før og efter,
      // "alkohol kan fortynde blodet"), 6 (smertestillende, øget blødning og blå mærker), 2 (6 timer,
      // infektion, vand og sæbe), 3 (sol og solarium); content/treatments.ts → fillerFaq.aftercare
      // (Aspirin, Ibux og Voltaren). Spørgsmål 6 also names Paracet: left out on purpose, as in
      // fillerFaq.aftercare. TODO: fagligt tjek (læge): may the article say what to take for pain?
      {
        type: "list",
        style: "bullet",
        items: [
          "Begræns alkohol 24 timer før og efter behandlingen. Alkohol kan fortynde blodet og give flere blå mærker.",
          "Undgå Aspirin, Ibux og Voltaren efter behandlingen. De kan give mere blødning og dermed flere blå mærker.",
          "Rør ikke ved området de første 6 timer for at mindske risikoen for infektion. Derefter kan du vaske det forsigtigt med vand og sæbe.",
          "Undgå sol og solarium, indtil hævelse og rødme er forsvundet.",
        ],
      },
      // source: general patient-safety advice, not on fillox.dk (never stop prescribed medicine on your
      // own). TODO: fagligt tjek (læge)
      {
        type: "paragraph",
        text: "Tager du medicin, som en læge har ordineret, så stop ikke selv med den. Tal med os eller din egen læge først.",
      },
      { type: "h2", id: "kontakt-os", text: "Hvornår skal du kontakte os?" },
      // source: content/pages/contact.ts → on-call ("Vagtlæge 24/7", "Akuttelefon" = site.contact.phone)
      {
        type: "paragraph",
        text: `Er du i tvivl om, hvorvidt det, du oplever, er normalt, så kontakt os hellere én gang for meget. Vi har vagtlæge døgnet rundt på akuttelefonen, ${ON_CALL_PHONE}. Ring med det samme, hvis:`,
      },
      // source: items 1–4: general warning signs after injections with hyaluronic-acid filler (circulation
      // or infection), not on fillox.dk; item 5: content/treatments.ts → fillerFaq.sideEffects ("kontakt en
      // læge hurtigst muligt, hvis en betændelsesreaktion varer mere end en uge") and
      // fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 8 ("andre symptomer på bivirkninger").
      // TODO: fagligt tjek (læge)
      {
        type: "list",
        style: "bullet",
        items: [
          "Smerterne bliver stærkere i stedet for at aftage.",
          "Huden i eller omkring området bliver hvid, bleg, plettet eller blålig, eller føles kold.",
          "Området bliver mere rødt, varmt og ømt, der kommer pus, eller du får feber.",
          "Hævelsen tager til efter de første dage i stedet for at lægge sig.",
          "En reaktion varer mere end en uge, eller du får andre gener end dem, der er nævnt her.",
        ],
      },
      // Tap to call on a phone (the same line as the footer's contact card). TODO: copy review (label)
      { type: "links", items: [{ label: `Ring til akuttelefonen, ${ON_CALL_PHONE}`, href: site.contact.phoneHref }] },
      { type: "h2", id: "ring-112", text: "Hvornår skal du ringe 112?" },
      // source: general emergency advice, not on fillox.dk (sight problems after a filler, signs of a
      // severe allergic reaction). TODO: fagligt tjek (læge)
      { type: "paragraph", text: "Ring 112, hvis du efter en behandling får:" },
      {
        type: "list",
        style: "bullet",
        items: [
          "Synsforstyrrelser, sløret syn eller nedsat syn.",
          "Svært ved at trække vejret eller synke.",
          "Hævelse i tungen eller svælget.",
        ],
      },
      // The article also covers skinbooster and Profhilo. TODO: copy review
      { type: "paragraph", text: "Fortæl, hvilken behandling du har fået, og hvornår." },
      { type: "h2", id: "kontrol", text: "Gratis kontrol" },
      // source: content/prices.ts → konsultation ("Kontrol efter behandling", "valgfri, ca. 14 dage efter",
      // gratis); fillox.dk/om-os/kontrol-eftertjek ("Denne skal du selv booke"; "tilbydes kun én gang per
      // behandling"; "Hvis der går mere end 21 dage efter din behandling, bortfalder retten til kontroltiden")
      {
        type: "paragraph",
        text: "Cirka 14 dage efter behandlingen kan du komme til en gratis kontrol. Den er valgfri, og du booker den selv. Her kan I tale om, hvordan de første dage er gået, og se på resultatet sammen. Kontrollen tilbydes én gang pr. behandling og skal ligge inden for 21 dage efter behandlingen.",
      },
      { type: "h2", id: "vil-du-vide-mere", text: "Vil du vide mere?" },
      {
        type: "paragraph",
        text: "På behandlingssiderne kan du læse mere om den enkelte behandling og om efterplejen. Har du spørgsmål før en behandling, kan du skrive til os eller booke en gratis konsultation.",
      },
      { type: "links", items: [links.lipFiller, links.contact, links.consultation] },
    ],
  },
  {
    slug: "skinbooster-eller-profhilo",
    title: "Skinbooster eller Profhilo: hvad er forskellen?",
    category: "Hudpleje",
    categorySlug: "hudpleje",
    kind: "Guide",
    tags: ["hudpleje", "guides"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-11-25",
    // TODO: copy review
    // ≤ 160 characters: also the meta description, the share text and the JSON-LD description.
    excerpt:
      "Begge er behandlinger med hyaluronsyre, men de bruges til forskellige ting. Her er forskellen, og hvordan din behandler vurderer, hvad der passer til din hud.",
    // A practitioner holding a syringe (fine on a skin post; nobody is named on the page). Not a
    // team portrait (content/team.ts, owner 2026-11-25). 22%: the face in the wide header; the
    // syringe and the gloves sit at the bottom of the photo and are cut off there from 1024px, so the
    // header reads as a portrait (README asks the owner about this photo here).
    image: { ...photos.behandlerSproejte, position: "50% 22%" },
    treatmentSlugs: ["skinbooster", "profhilo"],
    relatedPostSlugs: ["haevelse-og-blaa-maerker", "lip-filler-for-foerste-gang", "lip-filler-0-5-eller-1-ml"],
    // No booking card in the text: the article compares two treatments (the closing links point to
    // both pages and to booking).
    // TODO: fagligt tjek (læge) + copy review
    body: [
      {
        type: "lead",
        text: "Skinboosters og Profhilo minder om hinanden: begge er behandlinger med hyaluronsyre, der er rettet mod hudens kvalitet. Men de bruges til lidt forskellige ting, og forløbene er forskellige. Her er forskellen.",
      },
      { type: "h2", id: "til-faelles", text: "Det har de til fælles" },
      // source: content/treatments.ts → lip-filler about[0] (hyaluronsyre findes naturligt i huden),
      // skinbooster FAQ ("Effekten aftager gradvist, fordi hyaluronsyre nedbrydes med tiden"), profhilo
      // FAQ; fillox.dk/skinbooster/profhilo and /ejal-40 ("ikke-permanente type … fordel at vedligeholde")
      {
        type: "paragraph",
        text: "Hyaluronsyre er et stof, der findes naturligt i huden. Ved både skinboosters og Profhilo sprøjtes det ind i huden, og ingen af dem er permanente: kroppen nedbryder hyaluronsyren over tid, så effekten aftager gradvist, og det er en fordel at vedligeholde behandlingen.",
      },
      // source: content/treatments.ts → skinbooster lead ("Vi bruger Ejal 40 og Sunekos"), profhilo
      {
        type: "paragraph",
        text: "Hos Fillox bruger vi Ejal 40 og Sunekos som skinboosters, mens Profhilo er en behandling for sig.",
      },
      { type: "h2", id: "skinbooster", text: "Skinbooster: Ejal 40 og Sunekos" },
      // source: content/treatments.ts → skinbooster about[0]; fillox.dk/skinbooster/ejal-40 (the "40 mg" on
      // the treatment page has no source on fillox.dk, so the article leaves it out)
      {
        type: "paragraph",
        text: "Ejal 40 er en biorevitaliserende gel med hyaluronsyre, der stimulerer dannelsen af nyt kollagen og elastin. Den bruges til slap hud og rynker og til at forbedre hudtone og elasticitet.",
      },
      // source: content/treatments.ts → skinbooster about[1]; fillox.dk/skinbooster/sunekos
      {
        type: "paragraph",
        text: "Sunekos kombinerer hyaluronsyre og aminosyrer og bruges særligt til svære områder som mørke rande og poser under øjnene, linjer på overlæben og hudkvaliteten på panden. Sunekos er ikke en filler.",
      },
      // source: content/treatments.ts → skinbooster facts (ca. 20–30 min, ca. 6–12 mdr) and FAQ "Hvor
      // mange behandlinger skal jeg have?", "Hvornår kan jeg se resultatet?"; fillox.dk/skinbooster/ejal-40
      // (ca. 20 minutter), /sunekos (ca. 30 minutter)
      {
        type: "list",
        style: "bullet",
        items: [
          "Ejal 40 tager cirka 20 minutter. Behandlingen gentages 2–3 uger efter den første og vedligeholdes derefter 1–2 gange om året. Resultatet viser sig efter cirka 1–2 uger og holder omtrent 12 måneder.",
          "Sunekos tager cirka 30 minutter og gives som et forløb på 3–4 behandlinger med 1–2 ugers mellemrum, derefter en opfølgning cirka hver 6. måned. Resultatet holder cirka 6 måneder.",
        ],
      },
      { type: "h2", id: "profhilo", text: "Profhilo" },
      // source: content/treatments.ts → profhilo lead and about; fillox.dk/skinbooster/profhilo (termisk
      // tværbinding, modstandsdygtig over for hyaluronidase; kollagen og elastin)
      {
        type: "paragraph",
        text: "Profhilo er en type hyaluronsyre til løs hud i ansigtet og på halsen. Hyaluronsyren er gjort modstandsdygtig over for det enzym, der naturligt nedbryder den (termisk tværbinding), og den stimulerer hudens egen produktion af kollagen og elastin.",
      },
      // source: content/treatments.ts → profhilo facts (ca. 20 min, ca. 12 mdr), about[1] (5 punkter, 1 ml
      // på hver side), FAQ "Hvor mange behandlinger skal jeg have?", "Hvornår kan jeg se resultatet?"
      {
        type: "paragraph",
        text: "Behandlingen tager cirka 20 minutter. Produktet sprøjtes ind i 5 punkter på hver side af ansigtet, 1 ml på hver side. Resultatet ses med det samme og holder cirka 12 måneder. Behandlingen gentages 4–6 uger efter den første, og derefter er det en fordel at vedligeholde 1–2 gange om året.",
      },
      { type: "h2", id: "efter-behandlingen", text: "Under og efter behandlingen" },
      // source: content/treatments.ts → skinbooster and profhilo FAQ "Gør det ondt?"
      {
        type: "paragraph",
        text: "Ejal 40 og Profhilo ligger på cirka 2 ud af 10 på smerteskalaen, så bedøvelse er ikke nødvendig. Vil du have bedøvende creme, så sig det til klinikken, da cremen skal virke i cirka 30 minutter.",
      },
      // source: content/treatments.ts → skinbooster and profhilo FAQ "Kan jeg gå på arbejde dagen efter?";
      // fillox.dk/skinbooster/ejal-40 and /profhilo ("De første 12 timer efter behandlingen bør man ikke
      // gnide eller massere området … Man bør også undgå at belaste området ved at påføre
      // makeup/hudcreme, tage sauna, træne samt udsætte området for ekstra kolde eller varme
      // temperaturer"); fillox.dk/skinbooster/sunekos ("Ingen reel restitutionstid"; omkring øjnene
      // 24-72 timer). TODO: fagligt tjek (læge): do the 12 hours cover the second sentence too?
      {
        type: "paragraph",
        text: "Bagefter kan stikkene ligne myggestik. De forsvinder normalt inden for 12–24 timer, og der kan komme et par blå mærker, men du kan som udgangspunkt gå på arbejde dagen efter. De første 12 timer skal du lade være med at gnide eller massere området og undgå makeup og hudcreme, sauna, træning og stærk kulde eller varme. Efter Sunekos er der ingen egentlig restitutionstid, men omkring øjnene kan der være hævelse i 24–72 timer.",
      },
      // source: content/pages/contact.ts → on-call ("Vagtlæge 24/7", "Akuttelefon" = site.contact.phone),
      // as in the filler articles. TODO: copy review
      {
        type: "paragraph",
        text: `Er du i tvivl om noget efter behandlingen, så kontakt os. Vi har vagtlæge døgnet rundt på akuttelefonen, ${ON_CALL_PHONE}.`,
      },
      // TODO: copy review (link label)
      {
        type: "links",
        items: [{ label: "Hvad er normalt, og hvornår skal du ringe?", href: `${routes.blog}/haevelse-og-blaa-maerker#kontakt-os` }],
      },
      { type: "h2", id: "hvad-passer-til-dig", text: "Hvad passer til din hud?" },
      // source: fillox.dk/skinbooster/sunekos ("Behandleren tager derfor stilling til, om behandlingen er
      // egnet, samt hvilket resultat der kan forventes. Det er dog ikke muligt at fastslå præcist, hvor mange
      // behandlinger der skal til"); content/pages/treatments.ts → fallbackAbout.categoryText.hudforbedring
      // ("Mange får det bedste resultat med et forløb over flere behandlinger, og din behandler anbefaler,
      // hvad der passer til netop din hud")
      {
        type: "paragraph",
        text: "Det afhænger af, hvad du gerne vil have hjælp til, og af din hud. Ved konsultationen vurderer din behandler, om en behandling er egnet til dig, og hvad du kan forvente. Mange får det bedste resultat med et forløb over flere behandlinger, men hvor mange der skal til, kan ikke siges præcist på forhånd.",
      },
      // source: content/prices.ts → hudforbedring ("Ejal 40 · 1 behandling", "Sunekos Performa · 1
      // behandling", "Profhilo · 1 behandling"; packages of 2–3 treatments) and pricesPage.intro
      // ("Konsultation og kontrol er altid gratis")
      {
        type: "paragraph",
        text: `Én behandling koster fra ${ejalPrice} med Ejal 40, fra ${sunekosPrice} med Sunekos og fra ${profhiloPrice} med Profhilo, og der er pakkepriser, når du køber flere behandlinger. Konsultationen er altid gratis.`,
      },
      { type: "h2", id: "vil-du-vide-mere", text: "Vil du vide mere?" },
      {
        type: "paragraph",
        text: "Læs mere om behandlingerne på siderne om skinbooster og Profhilo. Og vil du have en vurdering af din hud, kan du booke en gratis konsultation.",
      },
      { type: "links", items: [links.skinbooster, links.profhilo, links.skinPrices, links.consultation] },
    ],
  },

  /* ---------------------------------------------------------- rynkebehandling */
  // The former Botox posts, rewritten as articles about the treatment (owner, 2026-11-25; see the
  // header). No product name or active substance anywhere, no price, no booking card (it shows a
  // "fra" price), no results; the hub's own words for the treatment. Facts: the rynkebehandling hub
  // (content/treatments.ts, the agency's copy), content/pages/men.ts, content/pages/new-here.ts,
  // content/prices.ts, content/pages/contact.ts and the live fillox.dk/rynkebehandling,
  // /om-os/kontrol-eftertjek and /kontakt (fetched 2026-11-25).
  {
    slug: "rynkebehandling-for-foerste-gang",
    title: "Rynkebehandling for første gang: sådan foregår det",
    category: "Rynkebehandling",
    categorySlug: "rynkebehandling",
    kind: "Guide",
    tags: ["rynkebehandling", "guides"],
    readingTime: "2 min læsning",
    readingMinutes: 2,
    date: "2026-11-25",
    // TODO: copy review
    excerpt:
      "Fra den første konsultation til kontrollen bagefter: sådan foregår en rynkebehandling hos Fillox, når du er ny.",
    excerptShort: "Fra den første konsultation til kontrollen bagefter.",
    // The empty treatment room: no person, product, syringe or treatment.
    image: photos.behandlingsrum,
    treatmentSlugs: ["rynkebehandling"],
    relatedPostSlugs: [
      "hvornaar-giver-rynkebehandling-mening",
      "de-foerste-24-timer-efter-rynkebehandling",
      "lip-filler-for-foerste-gang",
    ],
    // TODO: fagligt tjek (læge) + copy review
    body: [
      {
        type: "lead",
        text: "Overvejer du rynkebehandling for første gang? Her gennemgår vi, hvordan et forløb hos Fillox foregår, fra den første konsultation til kontrollen bagefter, så du ved, hvad du kan forvente.",
      },
      { type: "h2", id: "du-behoever-ikke-vide-det", text: "Du behøver ikke vide, hvad du skal have" },
      // source: content/treatments.ts → rynkebehandling sections "typer-af-rynker" ("Det er ikke alle
      // rynker, der opstår på samme måde. Derfor findes der heller ikke én behandling, som passer til
      // alle") and "vaelg-behandling" (muskler, tab af volumen, hudens kvalitet); FAQ "Kan jeg få hjælp,
      // hvis jeg aldrig har fået rynkebehandling før?" (konsultation uden at vide, hvilken behandling)
      {
        type: "paragraph",
        text: "Ikke alle rynker opstår på samme måde. Nogle skyldes ansigtets bevægelser, andre tab af volumen eller ændringer i hudens kvalitet. Derfor findes der ikke én behandling, der passer til alle, og du kan sagtens bestille en konsultation uden at vide, hvilken behandling der er relevant for dig.",
      },
      { type: "h2", id: "konsultationen", text: "Først en konsultation" },
      // source: content/treatments.ts → rynkebehandling section "konsultation" (ønsker, relevante
      // helbredsoplysninger, muligheder; "forventet resultat, begrænsninger, mulige bivirkninger og
      // eventuelle alternativer"; "Du kan også vælge ikke at gå videre med behandling");
      // fillox.dk/rynkebehandling ("nogle gange kan en fillerbehandling faktisk gavne dig mere";
      // "sammen aftaler I derefter et eventuelt behandlingsforløb")
      {
        type: "paragraph",
        text: "Ved konsultationen gennemgår vi dine ønsker, relevante helbredsoplysninger og de muligheder, der kan være aktuelle for dig. Du får information om det forventede resultat, begrænsninger, mulige bivirkninger og eventuelle alternativer. Nogle gange er en anden behandling mere relevant end den, du havde tænkt dig.",
      },
      {
        type: "paragraph",
        text: "Derefter aftaler du og din behandler et eventuelt forløb. Du kan også vælge ikke at gå videre med behandling.",
      },
      { type: "h2", id: "laegens-vurdering", text: "Lægens vurdering og betænkningstid" },
      // source: content/treatments.ts → rynkebehandling section "konsultation" (den nødvendige
      // lægefaglige forundersøgelse) and FAQ "Skal jeg til konsultation, før jeg kan blive behandlet?"
      // ("kræves en lægefaglig forundersøgelse. Ved første behandling gælder som udgangspunkt mindst to
      // dages betænkningstid, før der kan gives samtykke"); content/pages/men.ts → FAQ "Hvor lang tid
      // tager det?" ("rynkebehandling med et receptpligtigt lægemiddel"); content/prices.ts →
      // konsultation ("lovpligtig")
      {
        type: "paragraph",
        text: "Er der tale om rynkebehandling med et receptpligtigt lægemiddel, kræver loven, at der først foretages en lægefaglig forundersøgelse. Ved den første behandling gælder som udgangspunkt mindst to dages betænkningstid, før du kan give dit samtykke. Så har du ro til at tænke det igennem, før du beslutter dig.",
      },
      { type: "h2", id: "selve-behandlingen", text: "Selve behandlingen" },
      // source: content/pages/men.ts → FAQ "Hvor lang tid tager det?" ("Selve behandlingen tager typisk
      // 20–40 minutter"); fillox.dk/rynkebehandling ("Ca. 20-40 minutter"); content/treatments.ts →
      // rynkebehandling intro (sundhedsfaglig baggrund, fælles faglige standarder, Fillox Academy)
      {
        type: "paragraph",
        text: "Selve behandlingen tager typisk 20–40 minutter. Hos Fillox møder du behandlere med sundhedsfaglig baggrund, som arbejder efter fælles faglige standarder og får løbende undervisning gennem Fillox Academy.",
      },
      { type: "h2", id: "efter-behandlingen", text: "Efter behandlingen" },
      // source: fillox.dk/rynkebehandling ("RESTITUTIONSTID Let træning: 2t / Hård træning: 24t");
      // content/treatments.ts → rynkebehandling FAQ "Hvor længe holder en rynkebehandling?" ("afhænger
      // af behandlingsformen og individuelle forhold. Ved konsultationen kan du få en mere præcis
      // forventning")
      {
        type: "paragraph",
        text: "Vent 2 timer med let træning og 24 timer med hård træning. Hvornår du kan se en virkning, og hvor længe den holder, afhænger af behandlingsformen og af individuelle forhold. Det får du at vide ved konsultationen.",
      },
      // source: content/pages/contact.ts → on-call ("Efter en behandling", "Vagtlæge 24/7", "Akuttelefon"
      // = site.contact.phone); fillox.dk/kontakt ("AKUT ASSISTANCE 24/7", "Vi har altid en vagtlæge")
      {
        type: "paragraph",
        text: `Har du spørgsmål i tiden efter, er du altid velkommen til at kontakte os. Vi har vagtlæge døgnet rundt på akuttelefonen, ${ON_CALL_PHONE}.`,
      },
      { type: "h2", id: "kontrol", text: "Kontrol efter cirka 14 dage" },
      // source: content/prices.ts → konsultation ("Kontrol efter behandling", "valgfri, ca. 14 dage
      // efter"); fillox.dk/om-os/kontrol-eftertjek ("evaluere resultatet og sikre, at alt forløber som
      // forventet"; "Denne skal du selv booke"; "tilbydes kun én gang per behandling"; "Hvis der går mere
      // end 21 dage efter din behandling, bortfalder retten til kontroltiden")
      {
        type: "paragraph",
        text: "Cirka 14 dage efter behandlingen kan du komme til en kontrol. Den er valgfri, og du booker den selv. Her ser I på resultatet sammen og sikrer, at alt forløber som forventet. Kontrollen tilbydes én gang pr. behandling og skal ligge inden for 21 dage efter behandlingen.",
      },
      { type: "h2", id: "vil-du-vide-mere", text: "Vil du vide mere?" },
      {
        type: "paragraph",
        text: "På siden om rynkebehandling kan du læse om de forskellige typer rynker og om, hvad der sker ved en konsultation. Er du i tvivl om, hvor du skal begynde, kan du bestille en konsultation eller skrive til os.",
      },
      { type: "links", items: [links.wrinkles, links.wrinkleConsultation, links.contact] },
    ],
  },
  {
    slug: "hvornaar-giver-rynkebehandling-mening",
    title: "Hvornår giver rynkebehandling mening?",
    category: "Rynkebehandling",
    categorySlug: "rynkebehandling",
    // The design's "Forebyggelse": the article does not present treatment as prevention.
    kind: "Guide",
    tags: ["rynkebehandling", "guides"],
    readingTime: "2 min læsning",
    readingMinutes: 2,
    date: "2026-11-25",
    // TODO: copy review
    // ≤ 160 characters: also the meta description, the share text and the JSON-LD description.
    excerpt:
      "Rynker har forskellige årsager og behandles ikke ens. Her er, hvad der afgør, om en behandling er relevant for dig, og hvorfor det starter med en vurdering.",
    excerptShort: "Rynker har forskellige årsager. Her er, hvad der afgør, om en behandling er relevant for dig.",
    // A woman seen from behind with a hand mirror: no product, syringe, treatment or "result".
    image: photos.spejl,
    treatmentSlugs: ["rynkebehandling"],
    // "Læs også" shows each post's photo: on a rynkebehandling post only posts whose photo has no
    // product, syringe or treatment (content/photos.ts; the lip filler post's is the leaflet).
    relatedPostSlugs: [
      "rynkebehandling-for-foerste-gang",
      "de-foerste-24-timer-efter-rynkebehandling",
      "lip-filler-for-foerste-gang",
    ],
    // TODO: fagligt tjek (læge) + copy review
    body: [
      // source: content/treatments.ts → rynkebehandling lead ("Rynker og fine linjer er en naturlig del
      // af livet") and intro ("afhænger af både årsagen til rynkerne, hudens tilstand og dine ønsker");
      // fillox.dk/rynkebehandling ("oplevelsen af disse ældningstegn er blandet og varierer meget fra
      // person til person")
      {
        type: "lead",
        text: "Rynker og fine linjer er en naturlig del af livet, og hvordan du har det med dem, er personligt. Om en behandling giver mening for dig, afhænger af, hvorfor linjerne er der, og af, hvad du selv ønsker.",
      },
      { type: "h2", id: "forskellige-aarsager", text: "Rynker har forskellige årsager" },
      // source: content/treatments.ts → rynkebehandling lead and section "typer-af-rynker" (items
      // "Rynker i panden", "Bekymringsrynken", "Smilerynker omkring øjnene", "Andre linjer og rynker")
      {
        type: "paragraph",
        text: "Nogle linjer opstår, når vi smiler eller rynker panden. Andre bliver mere synlige i takt med, at huden ændrer sig. Typiske eksempler er:",
      },
      {
        type: "list",
        style: "bullet",
        items: [
          "Vandrette linjer i panden, som ofte opstår, når vi løfter øjenbrynene.",
          "Bekymringsrynken, de lodrette linjer mellem øjenbrynene, som blandt andet opstår, når vi koncentrerer os.",
          "Smilerynker omkring øjnene, også kaldet kragetæer, som typisk viser sig, når vi smiler.",
          "Linjer omkring munden og nedadvendte mundvige, som kan have andre årsager og kræve en anden tilgang.",
        ],
      },
      { type: "h2", id: "aarsagen-afgoer-behandlingen", text: "Årsagen afgør behandlingen" },
      // source: content/treatments.ts → rynkebehandling section "vaelg-behandling" (the agency's copy:
      // mimiske rynker → "en læge vurdere, om muskelafslappende injektionsbehandling er relevant";
      // volumen → filler; fine linjer og hudens kvalitet → microneedling eller peeling; "forskellige
      // formål, effekter og risici … individuel vurdering frem for blot at vælge en behandling ud fra
      // navnet")
      { type: "paragraph", text: "Valget afhænger først og fremmest af, hvorfor rynkerne er opstået:" },
      {
        type: "list",
        style: "bullet",
        items: [
          "Mimiske rynker skyldes gentagne bevægelser i ansigtets muskler. Her kan en læge vurdere, om muskelafslappende injektionsbehandling er relevant.",
          "Linjer, der skyldes tab af volumen, kan i nogle tilfælde vurderes med henblik på behandling med filler.",
          "Fine linjer og ændringer i hudens kvalitet kan være relevante at vurdere i forhold til hudforbedrende behandlinger som microneedling eller peeling.",
        ],
      },
      {
        type: "paragraph",
        text: "Behandlingerne har forskellige formål, effekter og risici. Derfor er det vigtigt at vælge ud fra en individuel vurdering frem for ud fra navnet på en behandling.",
      },
      { type: "h2", id: "dine-oensker", text: "Dine ønsker er udgangspunktet" },
      // source: fillox.dk/rynkebehandling ("De kan være charmerende og give liv til ansigtet – men for
      // mange kan de give et tungt indtryk, der ikke matcher det udtryk, man ønsker at udstråle");
      // content/treatments.ts → rynkebehandling section "konsultation" ("Du kan også vælge ikke at gå
      // videre med behandling")
      {
        type: "paragraph",
        text: "Nogle synes, at linjerne giver liv til ansigtet. Andre oplever, at de giver et udtryk, der ikke passer til dem. Begge dele er helt i orden, og det er dig, der bestemmer, om du vil gå videre med en behandling.",
      },
      // source: content/treatments.ts → andre-behandlingsmuligheder section "individuel-vurdering" ("Vi
      // fortæller også, når en anden behandlingsform, yderligere undersøgelse eller henvisning er mere
      // hensigtsmæssig")
      {
        type: "paragraph",
        text: "Vi fortæller dig også, hvis en anden behandlingsform, en yderligere undersøgelse eller en henvisning er mere hensigtsmæssig.",
      },
      { type: "h2", id: "risici", text: "Kend risiciene" },
      // source: content/treatments.ts → rynkebehandling FAQ "Er der risici ved rynkebehandling?" and
      // "Hvor længe holder en rynkebehandling?"
      {
        type: "paragraph",
        text: "Alle kosmetiske injektionsbehandlinger indebærer risici, for eksempel lokale reaktioner, asymmetri eller andre komplikationer afhængigt af behandlingen. Du får information om de relevante risici, før du beslutter dig. Hvor længe en behandling holder, afhænger af behandlingsformen og af individuelle forhold.",
      },
      { type: "h2", id: "start-med-en-konsultation", text: "Start med en konsultation" },
      // source: content/treatments.ts → rynkebehandling section "konsultation" ("Du behøver ikke at vide
      // på forhånd, hvilken behandling du ønsker") and FAQ "Skal jeg til konsultation, før jeg kan blive
      // behandlet?"; content/pages/men.ts → FAQ "Hvor lang tid tager det?" (the same sentence)
      {
        type: "paragraph",
        text: "Du behøver ikke at vide på forhånd, hvilken behandling du ønsker. Ved konsultationen gennemgår vi dine ønsker og de muligheder, der kan være aktuelle for dig. Er der tale om rynkebehandling med et receptpligtigt lægemiddel, foretages først en lægefaglig forundersøgelse, og ved første behandling gælder som udgangspunkt mindst to dages betænkningstid.",
      },
      { type: "h2", id: "vil-du-vide-mere", text: "Vil du vide mere?" },
      // source: content/treatments.ts → andre-behandlingsmuligheder (mundvige, tyggemuskler, svedtendens)
      {
        type: "paragraph",
        text: "På siden om rynkebehandling kan du læse mere om de forskellige typer rynker. Handler dit ønske om for eksempel mundvigene, tyggemusklerne eller svedtendens, finder du det under andre behandlingsmuligheder.",
      },
      { type: "links", items: [links.wrinkles, links.otherOptions, links.wrinkleConsultation] },
    ],
  },
  {
    slug: "de-foerste-24-timer-efter-rynkebehandling",
    title: "De første 24 timer efter en rynkebehandling",
    category: "Rynkebehandling",
    categorySlug: "rynkebehandling",
    kind: "Efterpleje",
    tags: ["rynkebehandling", "efterpleje"],
    readingTime: "2 min læsning",
    readingMinutes: 2,
    date: "2026-11-25",
    // TODO: copy review
    excerpt:
      "Hvad du skal være opmærksom på efter en rynkebehandling: hvornår du kan træne igen, hvilke reaktioner du kan få, og hvornår du skal kontakte os.",
    excerptShort: "Hvornår du kan træne igen, og hvornår du skal kontakte os.",
    // A practitioner by a bright window in a light wrap top: no product, syringe or treatment. Not
    // named anywhere on this page (no practitioner section, the post is signed by the team). 38%: hair
    // to neck in the 2.32 : 1 article header (the default 30% cut the chin).
    image: { ...photos.behandlerVindue, position: "45% 38%" },
    treatmentSlugs: ["rynkebehandling"],
    // "Læs også": only posts whose photo has no product, syringe or treatment (see "hvornaar-…" above);
    // the filler aftercare article is linked at the end instead.
    relatedPostSlugs: [
      "rynkebehandling-for-foerste-gang",
      "hvornaar-giver-rynkebehandling-mening",
      "lip-filler-for-foerste-gang",
    ],
    // No booking card: an aftercare article sells nothing.
    // TODO: fagligt tjek (læge) + copy review
    body: [
      {
        type: "lead",
        text: "Her er, hvad du skal være opmærksom på i timerne efter en rynkebehandling, hvornår du kan træne igen, og hvornår du skal kontakte os.",
      },
      { type: "h2", id: "spoerg-foer-du-gaar", text: "Spørg, før du går hjem" },
      // source: content/treatments.ts → rynkebehandling section "konsultation" ("Du får information om
      // forventet resultat, begrænsninger, mulige bivirkninger og eventuelle alternativer")
      {
        type: "paragraph",
        text: "Allerede ved konsultationen får du information om det forventede resultat, begrænsninger og mulige bivirkninger. Har du spørgsmål til tiden efter behandlingen, så stil dem gerne, inden du går hjem.",
      },
      // source: content/pages/new-here.ts → FAQ "Skal jeg afsætte tid hjemme efter behandlingen?"
      // ("Fortæl os, hvis du har en vigtig begivenhed eller bestemte planer, så kan vi rådgive dig om
      // tidspunktet"). Before the treatment, so under "Spørg, før du går hjem", not under training.
      {
        type: "paragraph",
        text: "Har du en vigtig begivenhed eller bestemte planer, så fortæl os det før behandlingen. Så kan vi rådgive dig om tidspunktet.",
      },
      { type: "h2", id: "traening", text: "Vent med at træne" },
      // source: fillox.dk/rynkebehandling ("RESTITUTIONSTID Let træning: 2t / Hård træning: 24t")
      { type: "paragraph", text: "Vent 2 timer med let træning og 24 timer med hård træning." },
      // source: content/treatments.ts → rynkebehandling section "vaelg-behandling" (filler is one of the
      // wrinkle treatments); the aftercare in "haevelse-og-blaa-maerker" (linked right here).
      // TODO: copy review
      { type: "paragraph", text: "Har du fået filler, gælder også rådene i artiklen om hævelse og blå mærker." },
      // TODO: copy review (link label)
      {
        type: "links",
        items: [{ label: "Læs om hævelse og blå mærker", href: `${routes.blog}/haevelse-og-blaa-maerker` }],
      },
      { type: "h2", id: "reaktioner", text: "Reaktioner efter behandlingen" },
      // source: content/pages/new-here.ts → FAQ "Skal jeg afsætte tid hjemme efter behandlingen?" ("Det
      // kommer an på behandlingen. Nogle giver kun svagt synlige reaktioner, mens andre blandt andet kan
      // give rødme, hævelse eller blå mærker"); content/treatments.ts → rynkebehandling FAQ "Er der
      // risici ved rynkebehandling?" (lokale reaktioner, asymmetri, andre komplikationer)
      {
        type: "paragraph",
        text: "Hvilke reaktioner du kan få, afhænger af behandlingen. Nogle behandlinger giver kun svagt synlige reaktioner, mens andre blandt andet kan give rødme, hævelse eller blå mærker. Som ved alle kosmetiske injektionsbehandlinger kan der også opstå asymmetri eller andre komplikationer.",
      },
      // The heading of the same section in "rynkebehandling-for-foerste-gang" (no "I" without a "you
      // and your practitioner" before it). TODO: copy review
      { type: "h2", id: "kontrol", text: "Kontrol efter cirka 14 dage" },
      // source: content/treatments.ts → rynkebehandling FAQ "Hvor længe holder en rynkebehandling?";
      // content/prices.ts → konsultation ("Kontrol efter behandling", "valgfri, ca. 14 dage efter");
      // fillox.dk/om-os/kontrol-eftertjek ("evaluere resultatet og sikre, at alt forløber som forventet";
      // "Denne skal du selv booke"; "tilbydes kun én gang per behandling"; "Hvis der går mere end 21 dage
      // efter din behandling, bortfalder retten til kontroltiden")
      {
        type: "paragraph",
        text: "Hvornår du kan se en virkning, og hvor længe den holder, afhænger af behandlingsformen og af individuelle forhold. Cirka 14 dage efter behandlingen kan du komme til en kontrol, som er valgfri, og som du selv booker. Her ser du og din behandler på resultatet og sikrer, at alt forløber som forventet. Kontrollen tilbydes én gang pr. behandling og skal ligge inden for 21 dage efter behandlingen.",
      },
      { type: "h2", id: "kontakt-os", text: "Hvornår skal du kontakte os?" },
      // source: content/pages/contact.ts → on-call ("Efter en behandling", "Vagtlæge 24/7", "Akuttelefon"
      // = site.contact.phone); fillox.dk/kontakt ("AKUT ASSISTANCE 24/7"); the wording of
      // "haevelse-og-blaa-maerker" above ("kontakt os hellere én gang for meget")
      {
        type: "paragraph",
        text: `Er du i tvivl om, hvorvidt det, du oplever, er normalt, så kontakt os hellere én gang for meget. Vi har vagtlæge døgnet rundt på akuttelefonen, ${ON_CALL_PHONE}. Ring, hvis:`,
      },
      // source: item 1: the site's own warning signs ("haevelse-og-blaa-maerker": stronger instead of
      // easing); item 2: content/treatments.ts → fillerFaq.sideEffects ("Som ved alle injektioner er der
      // en lille risiko for infektion") with the infection signs of "haevelse-og-blaa-maerker" (general,
      // not on fillox.dk); item 3: content/treatments.ts → rynkebehandling FAQ "Er der risici ved
      // rynkebehandling?" ("Du får information om de relevante risici"). TODO: fagligt tjek (læge):
      // should the doctor add warning signs specific to the muscle-relaxing treatment?
      {
        type: "list",
        style: "bullet",
        items: [
          "En reaktion bliver værre i stedet for at aftage.",
          "Området bliver rødt, varmt og ømt, eller du får feber. Som ved alle injektioner er der en lille risiko for infektion.",
          "Du får gener, som ikke blev nævnt, da du fik information før behandlingen.",
        ],
      },
      // Tap to call on a phone (the same line as the footer's contact card). TODO: copy review (label)
      { type: "links", items: [{ label: `Ring til akuttelefonen, ${ON_CALL_PHONE}`, href: site.contact.phoneHref }] },
      // source: general emergency advice, not on fillox.dk: the 112 list of "haevelse-og-blaa-maerker",
      // in its words. TODO: fagligt tjek (læge) (see the question above about signs specific to the
      // muscle-relaxing treatment)
      {
        type: "paragraph",
        text: "Ring 112, hvis du efter behandlingen får synsforstyrrelser, sløret syn eller nedsat syn, svært ved at trække vejret eller synke, eller hævelse i tungen eller svælget. Fortæl, at du har fået en rynkebehandling, og hvornår.",
      },
      { type: "h2", id: "vil-du-vide-mere", text: "Vil du vide mere?" },
      {
        type: "paragraph",
        text: "På siden om rynkebehandling kan du læse mere om behandlingerne og om, hvad der sker ved en konsultation. Har du spørgsmål før eller efter en behandling, er du altid velkommen til at kontakte os.",
      },
      { type: "links", items: [links.wrinkles, links.contact] },
    ],
  },
];

/** True unless the post is on hold (`published: false`). */
export function isPublished(post: BlogPost): boolean {
  return post.published !== false;
}

/**
 * The posts the site shows: every page, list, link, the sitemap and the structured data read
 * these (or the helpers below), never `allPosts`, so a post on hold appears nowhere.
 */
export const posts: BlogPost[] = allPosts.filter(isPublished);

/** Every filter chip a post matches (besides "alle"): its category plus its tags. */
export function postFilterSlugs(post: BlogPost): string[] {
  return Array.from(new Set([post.categorySlug, ...(post.tags ?? [])].filter((s): s is string => Boolean(s))));
}

/** The chips on /blog: "Alle" and every chip with at least one published post (no empty chip). */
export const blogFilters: BlogFilter[] = allBlogFilters.filter(
  (filter) => filter.slug === blogPage.allFilter || posts.some((post) => postFilterSlugs(post).includes(filter.slug)),
);

/** A published post by slug (a post on hold is undefined, so its page 404s). */
export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/**
 * True when the post has its written article (`body`). An excerpt-only post still gets a
 * page (excerpt + booking card), but it is noindex, left out of the sitemap and claims no
 * reading time until the text exists (app/blog/[slug]/page.tsx, app/sitemap.ts).
 */
export function hasArticleBody(post: BlogPost): boolean {
  return Boolean(post.body?.length);
}

/** Published posts newest first (same date: the order of `allPosts`). */
export function sortedPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

/** The featured article on /blog (falls back to the newest post). */
export function getFeaturedPost(): BlogPost {
  return posts.find((p) => p.featured) ?? sortedPosts()[0];
}

export function blogPostHref(slug: string): string {
  return `${routes.blog}/${slug}`;
}

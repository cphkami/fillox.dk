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
 * Published (owner, 2026-11-25: "lave bloggen. skriv et par artikler", signed "Fillox-holdet"):
 * four articles dated 2026-11-25, their real publication date. They have no `authorSlug`, so they
 * are signed by the team (content/pages/blog.ts → blogArticle.teamAuthor). Every fact in them comes
 * from the site's own content or the live fillox.dk; the `// source:` comment above each block says
 * where. Copy marked "fagligt tjek (læge)" must be read by a doctor before launch.
 *
 * On hold (`published: false`): the three posts about Botox, a prescription medicine (advertising
 * it to the public is prohibited, lægemiddelloven § 66), until the owner's jurist has answered
 * (README → "Før lancering" → Botox og markedsføring). Their data is kept below; removing the flag
 * re-enables a post, and check:market then applies the rules for published posts (no named
 * practitioner as author, related posts published).
 *
 * Images: the clinic's own mood photos (content/photos.ts; the design's were stock), one per post,
 * all different. `position` keeps the face in the wide crops (the article header is 2.32 : 1).
 * Only `spejl` (1548px) fills the article header's 1440px at 1x; the other files are 782–1105px
 * wide and are drawn up to 1.84× there on the 1600 canvas (README: larger originals requested).
 * TODO: copy review (image choice + alt).
 */

/**
 * Every filter chip, in the design's order (desktop 6blog; mobile mbl hides "Guides"). /blog
 * shows `blogFilters` below: only chips with at least one published post.
 */
export const allBlogFilters: BlogFilter[] = [
  { slug: blogPage.allFilter, label: "Alle" },
  { slug: "botox", label: "Botox" },
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
  contact: { label: "Kontakt os", href: routes.contact },
  consultation: { label: "Book en gratis konsultation", href: site.booking.href },
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
      {
        type: "paragraph",
        text: "Er du i tvivl, om lip filler er noget for dig, kan du også booke en gratis konsultation for sig. Den tager 30 minutter hos en kosmetisk sygeplejerske og er helt uforpligtende.",
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
        text: "Behandlingen tager cirka 20 minutter. Læberne bliver renset, og derefter sprøjter din behandler filleren ind med en meget tynd nål. Filleren er lavet af hyaluronsyre, et stof der findes naturligt i huden.",
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
      { type: "h2", id: "efterpleje", text: "Sådan passer du på læberne" },
      { type: "paragraph", text: "Et par enkle råd til tiden efter behandlingen:" },
      // source: content/treatments.ts → fillerFaq.aftercare; fillox.dk/fillers/faq-om-fillers-behandling,
      // spørgsmål 2, 3, 5 og 6
      {
        type: "list",
        style: "bullet",
        items: [
          "Rør ikke ved læberne de første 6 timer. Derefter kan du vaske området forsigtigt med vand og sæbe.",
          "Hold læberne væk fra sol og solarium, til hævelse og rødme er væk.",
          "Begræns alkohol 24 timer før og efter behandlingen.",
          "Undgå Aspirin, Ibux og Voltaren, som kan give mere blødning og flere blå mærker.",
        ],
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
      // forventet; "Denne skal du selv booke")
      {
        type: "paragraph",
        text: "Cirka 14 dage efter behandlingen kan du komme til en gratis kontrol. Den er valgfri, og du booker den selv. Her ser I på resultatet sammen og sikrer, at alt forløber, som det skal.",
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
    title: "0,5 eller 1 ml? Sådan vælger du den rette mængde",
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
    // Forehead to neck and the syringe in the 2.32 : 1 article header (rows ≈ 66–403 at 1600).
    image: { ...photos.sproejte, position: "55% 12%" },
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
      // lip-filler about[0] (hyaluronsyre, findes naturligt i huden) / goodFor (volumen, symmetri, læbekant)
      {
        type: "paragraph",
        text: "Der findes ikke én rigtig mængde. Hvad der er smukke læber, er personligt, og ønskerne varierer blandt andet med alder og smag. Lip filler er lavet af hyaluronsyre, et stof der findes naturligt i huden, og nogle ønsker lidt mere volumen, andre en bedre symmetri eller en tydeligere læbekant.",
      },
      // source: content/treatments.ts → lip-filler about[1] (konsultation, anatomi, plan) and pricesIntro
      // ("Din behandler anbefaler mængden ved konsultationen")
      {
        type: "paragraph",
        text: "Derfor starter vi altid med en konsultation, hvor din behandler ser på din anatomi og lægger en plan sammen med dig. Det er også her, du får en anbefaling af, hvor meget der skal til.",
      },
      { type: "h2", id: "start-med-0-5-ml", text: "Hvorfor mange starter med 0,5 ml" },
      // source: content/treatments.ts → lip-filler pricesIntro ("Mange starter med 0,5 ml og bygger på
      // senere") and lead ("Vi doserer konservativt, du kan altid bygge på senere")
      {
        type: "paragraph",
        text: "Mange starter med 0,5 ml og bygger på senere. Vi doserer konservativt, så du altid kan bygge på. På den måde kan du se resultatet an, før du tager stilling til, om du vil have mere.",
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
      // "kan kræve en ny behandling med tilhørende pris")
      {
        type: "paragraph",
        text: "Cirka 14 dage efter behandlingen kan du komme til en gratis kontrol, som er valgfri, og som du selv booker. Her vurderer I resultatet sammen, og eventuelle justeringer bygger altid på en faglig vurdering og på dine ønsker. Bliver I enige om, at mere filler giver mening, er det en ny behandling med sin egen pris.",
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
    excerpt:
      "Lidt hævelse og et par blå mærker er almindeligt efter en behandling med filler. Her er, hvad du kan forvente, hvordan du passer på området, og hvornår du skal kontakte os.",
    image: photos.behandlingKlient,
    treatmentSlugs: ["lip-filler"],
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
        text: "Efter en behandling med filler kan du være rød, hævet og øm i det område, der er behandlet. Det er normalt og ikke et tegn på, at noget er galt. Almindelige reaktioner der, hvor filleren er sprøjtet ind, er:",
      },
      // source: fillox.dk/fillers/faq-om-fillers-behandling, spørgsmål 7 (rødme, hævelse, kløe, smerte,
      // stikkende/tappe, fasthed/ujævnheder, blå mærker, misfarvning); content/treatments.ts →
      // fillerFaq.sideEffects
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
      // (Aspirin, Ibux og Voltaren)
      {
        type: "list",
        style: "bullet",
        items: [
          "Begræns alkohol 24 timer før og efter behandlingen. Alkohol kan fortynde blodet og give flere blå mærker.",
          "Undgå Aspirin, Ibux og Voltaren efter behandlingen. De kan give mere blødning og dermed flere blå mærker.",
          "Rør ikke ved området de første 6 timer, så du undgår infektion. Derefter kan du vaske det forsigtigt med vand og sæbe.",
          "Hold området væk fra sol og solarium, til hævelse og rødme er væk.",
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
      { type: "paragraph", text: "Fortæl, at du har fået en behandling med filler, og hvornår." },
      { type: "h2", id: "kontrol", text: "Gratis kontrol" },
      // source: content/prices.ts → konsultation ("Kontrol efter behandling", "valgfri, ca. 14 dage efter",
      // gratis); fillox.dk/om-os/kontrol-eftertjek ("Denne skal du selv booke")
      {
        type: "paragraph",
        text: "Cirka 14 dage efter behandlingen kan du komme til en gratis kontrol. Den er valgfri, og du booker den selv. Her kan I tale om, hvordan de første dage er gået, og se på resultatet sammen.",
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
    excerpt:
      "Begge er behandlinger med hyaluronsyre, men de bruges til forskellige ting og gives i forskellige forløb. Her er forskellen, og hvordan din behandler vurderer, hvad der passer til din hud.",
    image: { ...photos.behandlerPortraet1, position: "45% 22%" },
    treatmentSlugs: ["skinbooster", "profhilo"],
    relatedPostSlugs: ["haevelse-og-blaa-maerker", "lip-filler-for-foerste-gang", "lip-filler-0-5-eller-1-ml"],
    // No booking card in the text: the article compares two treatments (the closing links point to
    // both pages and to booking).
    // TODO: fagligt tjek (læge) + copy review
    body: [
      {
        type: "lead",
        text: "Skinboosters og Profhilo minder om hinanden: begge er behandlinger med hyaluronsyre, der arbejder med hudens kvalitet. Men de bruges til lidt forskellige ting, og forløbene er forskellige. Her er forskellen.",
      },
      { type: "h2", id: "til-faelles", text: "Det har de til fælles" },
      // source: content/treatments.ts → lip-filler about[0] (hyaluronsyre findes naturligt i huden),
      // skinbooster FAQ ("Effekten aftager gradvist, fordi hyaluronsyre nedbrydes med tiden"), profhilo
      // FAQ; fillox.dk/skinbooster/profhilo and /ejal-40 ("ikke-permanente type … fordel at vedligeholde")
      {
        type: "paragraph",
        text: "Hyaluronsyre er et stof, der findes naturligt i huden. Ved både skinboosters og Profhilo sprøjtes det ind i huden, og ingen af dem er permanente: kroppen nedbryder hyaluronsyren over tid, så effekten aftager gradvist, og behandlingen skal vedligeholdes.",
      },
      // source: content/treatments.ts → skinbooster lead ("Vi bruger Ejal 40 og Sunekos"), profhilo
      {
        type: "paragraph",
        text: "På vores behandlingssider hører Ejal 40 og Sunekos under Skinbooster, mens Profhilo har sin egen side.",
      },
      { type: "h2", id: "skinbooster", text: "Skinbooster: Ejal 40 og Sunekos" },
      // source: content/treatments.ts → skinbooster about[0]; fillox.dk/skinbooster/ejal-40
      {
        type: "paragraph",
        text: "Ejal 40 er en biorevitaliserende gel med 40 mg hyaluronsyre, der stimulerer dannelsen af nyt kollagen og elastin. Den bruges til slap hud og rynker og til at forbedre hudtone og elasticitet.",
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
      // fillox.dk/skinbooster/sunekos ("Ingen reel restitutionstid"; omkring øjnene 24-72 timer)
      {
        type: "paragraph",
        text: "Bagefter kan stikkene ligne myggestik. De forsvinder normalt inden for 12–24 timer, og der kan komme et par blå mærker, men du kan som udgangspunkt gå på arbejde dagen efter. Gnid og massér ikke området de første 12 timer, og spring makeup, sauna og træning over. Efter Sunekos er der ingen egentlig restitutionstid, men omkring øjnene kan der være hævelse i 24–72 timer.",
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
      { type: "links", items: [links.skinbooster, links.profhilo, links.consultation] },
    ],
  },

  /* ------------------------------------------------------------------- on hold */
  // ON HOLD (all three Botox posts): Botox is a prescription medicine, and advertising it to the
  // public is prohibited (lægemiddelloven § 66). Not published until the owner's jurist has answered
  // (README → "Før lancering" → Botox og markedsføring). Before removing `published: false`: legal
  // sign-off on the text, a real publication date, and the author (a published post names no
  // practitioner: BEK 253/2025 § 10, stk. 1, nr. 7; check:market fails otherwise).
  {
    slug: "botox-for-foerste-gang",
    published: false, // on hold: Botox (see above)
    title: "Botox for første gang: sådan foregår det",
    category: "Botox",
    categorySlug: "botox",
    kind: "Guide",
    tags: ["botox", "guides"],
    readingTime: "4 min læsning",
    readingMinutes: 4,
    date: "2026-09-12",
    excerpt:
      "Fra den første lægekonsultation til den gratis kontrol to uger efter. Annika gennemgår hele forløbet, så du ved præcis, hvad du kan forvente.",
    excerptShort: "Annika gennemgår hele forløbet, fra lægekonsultation til gratis kontrol.",
    // No practitioner's face next to the author's name (Annika) and no product: the mirror photo.
    image: photos.spejl,
    // TODO: fact check (owner): the design's example article, written in Annika's voice; fillox.dk
    // has no article by her. Facts (time, training, longevity) match fillox.dk/rynkebehandling.
    authorSlug: "annika",
    // The rynkebehandling hub replaced the Botox page (2026-10).
    treatmentSlugs: ["rynkebehandling"],
    relatedPostSlugs: [
      "hvornaar-giver-det-mening-at-starte-med-botox",
      "de-foerste-24-timer-efter-botox",
      "lip-filler-for-foerste-gang",
    ],
    relatedPostSlugsMobile: ["hvornaar-giver-det-mening-at-starte-med-botox", "haevelse-og-blaa-maerker"],
    body: [
      {
        type: "lead",
        text: "Overvejer du botox for første gang? Her gennemgår jeg, hvordan en behandling hos Fillox foregår fra start til slut, så du ved præcis, hvad du kan forvente.",
      },
      { type: "h2", id: "foer-behandlingen", text: "Før behandlingen" },
      {
        type: "paragraph",
        text: "Før din første behandling taler du med en læge. Det er lovpligtigt og gratis hos os. Vi gennemgår dit helbred, dine ønsker og de områder, du gerne vil behandle, og vi siger ærligt til, hvis vi ikke mener, behandlingen er det rigtige for dig.",
        mobileText:
          "Før din første behandling taler du med en læge. Det er lovpligtigt og gratis hos os. Vi gennemgår dit helbred og dine ønsker, og vi siger ærligt til, hvis behandlingen ikke er det rigtige for dig.",
      },
      { type: "h2", id: "selve-behandlingen", text: "Selve behandlingen" },
      {
        type: "paragraph",
        text: "Behandlingen tager cirka 20 til 40 minutter. Vi renser huden og markerer punkterne, og derefter injicerer vi små mængder med en meget tynd nål. De fleste beskriver det som et kort prik.",
        mobileText:
          "Behandlingen tager cirka 20 til 40 minutter. Vi injicerer små mængder med en meget tynd nål. De fleste beskriver det som et kort prik.",
      },
      {
        type: "booking",
        treatmentSlug: "rynkebehandling",
        eyebrow: BOOKING_EYEBROW,
        note: "Gratis lægekonsultation før første behandling",
        hideNoteOnMobile: true,
      },
      { type: "h2", id: "efter-behandlingen", text: "Efter behandlingen" },
      {
        type: "paragraph",
        text: "Du kan gå direkte tilbage til hverdagen. De første timer er der et par ting, du skal huske:",
        hideOnMobile: true,
      },
      {
        type: "list",
        style: "bullet",
        // "Vent 2 timer …" is fillox.dk/rynkebehandling ("Let træning: 2t / Hård træning: 24t").
        // TODO: fact check (owner): the other two points are not on fillox.dk.
        items: [
          "Undgå at ligge ned de første fire timer",
          "Vent 2 timer med let træning og 24 timer med hård træning",
          "Undgå at massere de behandlede områder",
        ],
      },
      { type: "h2", id: "hvor-laenge-holder-det", text: "Hvor længe holder det?" },
      {
        type: "paragraph",
        text: "Resultatet holder typisk 3 til 5 måneder. Effekten begynder efter 3 til 5 dage og er fuldt udviklet efter omkring to uger. Du er altid velkommen til en gratis kontrol.",
        mobileText:
          "Resultatet holder typisk 3 til 5 måneder. Effekten er fuldt udviklet efter omkring to uger, og kontrollen er altid gratis.",
      },
    ],
  },
  {
    slug: "hvornaar-giver-det-mening-at-starte-med-botox",
    published: false, // on hold: Botox (see above)
    title: "Hvornår giver det mening at starte med botox?",
    category: "Botox",
    categorySlug: "botox",
    kind: "Forebyggelse",
    tags: ["botox"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-08-22", // placeholder (design order)
    excerpt:
      "Der findes ingen rigtig alder for den første behandling. Det handler om dine linjer, dit udtryk og dine ønsker, og om en ærlig vurdering.",
    // A practitioner's portrait: no product, syringe or treatment (a post about Botox; no author,
    // so no named person next to the unnamed one). 15%: the forehead stays in the wide header.
    image: { ...photos.behandlerPortraet2, position: "50% 15%" },
    treatmentSlugs: ["rynkebehandling"],
  },
  {
    slug: "de-foerste-24-timer-efter-botox",
    published: false, // on hold: Botox (see above)
    title: "Gør og undgå de første 24 timer efter botox",
    category: "Efterpleje",
    categorySlug: "efterpleje",
    kind: "Efterpleje",
    tags: ["efterpleje", "botox"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-08-08", // placeholder (design order)
    excerpt:
      "Et par enkle råd til de første timer efter behandlingen, så du får mest ud af den: træning, sauna, makeup og søvn.",
    // The empty treatment room: no person, no product (a post about Botox).
    image: photos.behandlingsrum,
    treatmentSlugs: ["rynkebehandling"],
    // Not in the mobile list (design mbl shows 5 of the 6 posts).
    hideInMobileList: true,
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

/** The chips on /blog: "Alle" and every chip with at least one published post (no empty "Botox"). */
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

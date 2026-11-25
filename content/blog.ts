import { routes } from "./routes";
import type { BlogFilter, BlogPost } from "./types";
import { photos } from "./photos";

/**
 * Blog posts (design 6blog / mbl overview, 6art / mar article).
 *
 * Only "Botox for første gang" has a full article in the design; the others are
 * excerpt-only until Fillox delivers the text (the article page should render
 * excerpt + booking CTA when `body` is missing).
 *
 * Images: the clinic's own mood photos (content/photos.ts; the design's were stock), one per post,
 * all different. `position` keeps the face in the wide crops (the article header is 2.32 : 1).
 * Only `spejl` (1548px) fills the article header's 1440px at 1x; the other files are 782–1105px
 * wide and are drawn up to 1.84× there on the 1600 canvas (README: larger originals requested).
 * TODO: copy review (image choice + alt).
 *
 * Dates other than the featured article's (12. september 2026) are placeholders
 * in the design's list order, newest first. // TODO: copy review
 */

/** Filter chips on /blog (desktop 6blog; mobile mbl hides "Guides"). */
export const blogFilters: BlogFilter[] = [
  { slug: "alle", label: "Alle" },
  { slug: "botox", label: "Botox" },
  { slug: "filler", label: "Filler" },
  { slug: "hudpleje", label: "Hudpleje" },
  { slug: "efterpleje", label: "Efterpleje" },
  { slug: "guides", label: "Guides", desktopOnly: true },
];

export const posts: BlogPost[] = [
  {
    slug: "botox-for-foerste-gang",
    title: "Botox for første gang: sådan foregår det",
    category: "Botox",
    categorySlug: "botox",
    kind: "Guide",
    tags: ["botox", "guides"],
    readingTime: "4 min læsning",
    readingMinutes: 4,
    date: "2026-09-12",
    featured: true,
    excerpt:
      "Fra den første lægekonsultation til den gratis kontrol to uger efter. Annika gennemgår hele forløbet, så du ved præcis, hvad du kan forvente.",
    excerptShort: "Annika gennemgår hele forløbet, fra lægekonsultation til gratis kontrol.",
    // No practitioner's face next to the author's name (Annika) and no product: the mirror photo.
    image: photos.spejl,
    // TODO: fact check (owner): the design's example article, written in Annika's voice; fillox.dk
    // has no article by her. Facts (time, training, longevity) match fillox.dk/rynkebehandling.
    authorSlug: "annika",
    // The rynkebehandling hub replaced the Botox page (2026-10). This article and the two other
    // "botox" posts still name Botox as a product: open question for the owner (legal review).
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
        eyebrow: "Behandlingen i artiklen",
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
    slug: "lip-filler-for-foerste-gang",
    title: "Lip filler for første gang: sådan foregår det",
    category: "Filler",
    categorySlug: "filler",
    kind: "Guide",
    tags: ["filler", "guides"],
    readingTime: "4 min læsning",
    readingMinutes: 4,
    date: "2026-09-05", // TODO: copy review
    // TODO: copy review
    excerpt:
      "Fra konsultationen til den gratis kontrol: sådan foregår en behandling med lip filler hos Fillox, og hvad du kan forvente de første dage.",
    image: photos.behandlerFolder,
    treatmentSlugs: ["lip-filler"],
  },
  {
    slug: "lip-filler-0-5-eller-1-ml",
    title: "0,5 eller 1 ml? Sådan vælger du den rette mængde",
    category: "Filler",
    categorySlug: "filler",
    kind: "Resultat",
    tags: ["filler"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-08-29", // TODO: copy review
    // TODO: copy review
    excerpt:
      "Mængden afhænger af din læbeform og det udtryk, du ønsker. Her er forskellen på 0,5 og 1 ml, og hvorfor mange vælger at starte småt.",
    // Forehead to neck and the syringe in the 2.32 : 1 article header (rows ≈ 66–403 at 1600).
    image: { ...photos.sproejte, position: "55% 12%" },
    treatmentSlugs: ["lip-filler"],
  },
  {
    slug: "hvornaar-giver-det-mening-at-starte-med-botox",
    title: "Hvornår giver det mening at starte med botox?",
    category: "Botox",
    categorySlug: "botox",
    kind: "Forebyggelse",
    tags: ["botox"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-08-22", // TODO: copy review
    // TODO: copy review
    excerpt:
      "Der findes ingen rigtig alder for den første behandling. Det handler om dine linjer, dit udtryk og dine ønsker, og om en ærlig vurdering.",
    // A practitioner's portrait: no product, syringe or treatment (a post about Botox; no author,
    // so no named person next to the unnamed one). 15%: the forehead stays in the wide header.
    image: { ...photos.behandlerPortraet2, position: "50% 15%" },
    treatmentSlugs: ["rynkebehandling"],
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
    date: "2026-08-15", // TODO: copy review
    // TODO: copy review
    excerpt:
      "Lidt hævelse og et par blå mærker er almindeligt efter en behandling med filler. Her er, hvad du kan forvente, og hvornår du skal kontakte os.",
    image: photos.behandlingKlient,
    treatmentSlugs: ["lip-filler"],
  },
  {
    slug: "de-foerste-24-timer-efter-botox",
    title: "Gør og undgå de første 24 timer efter botox",
    category: "Efterpleje",
    categorySlug: "efterpleje",
    kind: "Efterpleje",
    tags: ["efterpleje", "botox"],
    readingTime: "3 min læsning",
    readingMinutes: 3,
    date: "2026-08-08", // TODO: copy review
    // TODO: copy review
    excerpt:
      "Et par enkle råd til de første timer efter behandlingen, så du får mest ud af den: træning, sauna, makeup og søvn.",
    // The empty treatment room: no person, no product (a post about Botox).
    image: photos.behandlingsrum,
    treatmentSlugs: ["rynkebehandling"],
    // Not in the mobile list (design mbl shows 5 of the 6 posts).
    hideInMobileList: true,
  },
  {
    slug: "skinbooster-eller-profhilo",
    title: "Skinbooster eller Profhilo: hvad er forskellen?",
    category: "Hudpleje",
    categorySlug: "hudpleje",
    tags: ["hudpleje"],
    readingTime: "5 min læsning",
    readingMinutes: 5,
    date: "2026-08-01", // TODO: copy review
    // TODO: copy review
    excerpt:
      "Begge giver huden fugt, men de virker forskelligt. Vi forklarer forskellen, og hvordan din behandler vurderer, hvad der passer til din hud.",
    image: { ...photos.behandlerPortraet1, position: "45% 22%" },
    treatmentSlugs: ["skinbooster", "profhilo"],
  },
];

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

/** Posts newest first. */
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

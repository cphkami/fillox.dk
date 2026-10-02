import type { FaqItem, ImageRef, Link } from "../types";
import { site } from "@/config/site";
import { pricesPage } from "../prices";
import { routes } from "../routes";
import { ui } from "../ui";
import { blogPage } from "./blog";

/**
 * Page copy for the treatment pages:
 * - /behandlinger/[slug] (design 6c template, 6bx Botox, mb mobile Lip filler)
 * - /behandlinger overview (no dedicated design; built from the same visual language)
 *
 * Per-treatment copy lives in content/treatments.ts (`detail`). Everything here is
 * shared by every treatment page, plus the fallbacks that give treatments WITHOUT
 * `detail` a complete page. Strings marked `// TODO: copy review` are not in the design.
 */

/** Section titles that include the treatment name, e.g. "Læs mere om Profhilo". */
const withName = (prefix: string) => (name: string) => `${prefix} ${name}`;

/** A group of rows in a treatment's price list (treatmentPage.prices.groups). */
export type PriceGroupCopy = { title: string; note?: string; labels: string[] };

export const treatmentPage = {
  /**
   * Ids of the section headings (aria-labelledby targets; linkable as /behandlinger/botox#priser).
   * Market words, so they live here with the copy.
   */
  sectionIds: {
    about: "om-behandlingen",
    practitioner: "din-behandler",
    results: "resultater",
    prices: "priser",
    posts: "fra-bloggen",
    reviews: "anmeldelser",
  },

  /** Accessible name of the breadcrumb <nav>. */
  breadcrumbLabel: "Brødkrumme", // TODO: copy review (accessible name, not in the design)

  hero: {
    /** Hero secondary CTA when the treatment has no `detail.secondaryCta`. */
    secondaryCta: { label: "Gratis konsultation", href: site.booking.href } satisfies Link,
  },

  about: {
    title: "Om behandlingen",
    goodForLabel: "Godt til",
  },

  practitioner: {
    eyebrow: "Din behandler",
    teamLink: { label: "Mød hele teamet", href: routes.aboutTeam } satisfies Link,
    /** Mobile CTA when `detail.mobile.practitionerCta` is missing, e.g. "Book hos Alberte". */
    bookWith: withName("Book hos"),
    /** Wraps the practitioner quote, e.g. “Jeg er først tilfreds …”. */
    quote: (text: string) => `“${text}”`,
    /**
     * Section heading when `detail.practitionerHeading` is missing, built from the team
     * member's name and title: "Alberte, kosmetisk behandler".
     */
    heading: (name: string, title: string) => `${name}, ${title.charAt(0).toLocaleLowerCase(site.locale)}${title.slice(1)}`,
  },

  results: {
    /** Heading when `detail.resultsTitle` is missing. */
    title: withName("Resultater med"),
    before: "Før",
    after: "Efter",
    /** Accessible name of the before/after row while it scrolls sideways (mobile). */
    // TODO: copy review (accessible name, not in the design)
    scrollLabel: "Resultater, rul vandret for at se flere",
  },

  /**
   * Rotating customer reviews (content/reviews.ts → reviewsFor({ treatment })), after the
   * results. The heading names the treatment only when every review shown is about it; when
   * general reviews fill the section up (fewer than 5 of its own), it says `generalTitle`.
   * The Botox pages have no reviews section (content/reviews.ts → treatmentsWithoutReviews).
   */
  // TODO: copy review (section not in the design)
  reviews: {
    eyebrow: "Anmeldelser",
    title: withName("Det siger kunderne om"),
    generalTitle: "Det siger vores kunder",
    intro: "Udvalgte anmeldelser fra vores kunder på Trustpilot.",
    /**
     * The Trustpilot score card next to the reviews (components/treatment/TrustpilotScore). Score,
     * count and profile link come from config/site.ts → trustpilot, the label ("Fremragende")
     * from ui.trustpilotLabel: update them together from the profile.
     */
    score: {
      /** Under the big score: "ud af 5". */
      outOf: `${ui.outOf} 5`,
      /** Next to the stars: "Fremragende på Trustpilot". */
      label: (label: string) => `${label} på ${ui.trustpilot}`,
      /** "Baseret på 172 anmeldelser". */
      count: (count: string) => `Baseret på ${count} anmeldelser`,
      /** Read by screen readers instead of the visual block: one sentence. */
      accessible: (label: string, score: string, count: string) =>
        `${label} på ${ui.trustpilot}: ${score} ${ui.outOf} 5, baseret på ${count} anmeldelser.`,
    },
  },

  prices: {
    eyebrow: "Priser",
    // TODO: copy review — title + intro for treatments without their own price section.
    fallbackTitle: "Vejledende priser",
    // The price card states `note` under the "fra" price, so the intro no longer repeats it.
    fallbackIntro: "Den endelige pris fastlægges altid ved din konsultation.",
    /**
     * Link under every price list: to the /priser card its rows come from, else the card of the
     * treatment's category (components/treatment/treatmentView.ts).
     */
    allPricesLink: { label: "Se alle priser", href: routes.prices } satisfies Link,
    /**
     * Under the "fra" price in the price card (components/treatment/PriceSection), next to a check
     * mark. Fact from content/prices.ts: the "Konsultation & kontrol" card is "ALTID GRATIS" (as on
     * fillox.dk/priser). Left out when the price intro already mentions kontrol (`noteCoveredBy`)
     * or the list has the free konsultation / kontrol rows (`extraRows`): never said twice.
     */
    // TODO: copy review (not in the design)
    note: "Konsultation og kontrol er altid gratis.",
    /** True when a text already tells that konsultation and kontrol are included / free. */
    noteCoveredBy: (text: string) => /\bkontrol\b/i.test(text),
    /**
     * Rows from the /priser "Konsultation & kontrol" card shown under the fallback price list
     * (full width, after both columns of a long list), by category slug (`default` for the rest).
     * Labels must match content/prices.ts.
     */
    extraRowsCardId: "konsultation",
    extraRows: {
      fillers: ["Fillers konsultation", "Kontrol efter behandling"],
      rynkebehandling: ["Lægekonsultation før første botox", "Kontrol efter behandling"],
      default: ["Kontrol efter behandling"],
    } as Record<string, string[]>,
    /**
     * Groups in a treatment's own price list, by the slug of the treatment whose `detail.prices`
     * it is (Botox for mænd shows Botox's list). `labels` are row labels of that list
     * (content/treatments.ts), in display order; rows in no group come first, without a heading.
     * `title` is a small heading over the group; `note` is said once under it and replaces the
     * rows' own notes. Long lists (> 6 rows) run in two columns, split between two groups, never
     * inside one (components/treatment/PriceSection). A label missing from the list fails the build.
     */
    // TODO: copy review (group headings not in the design; /priser has them as one list)
    groups: {
      // /priser lists single areas, the area packages ("gælder områderne ovenfor"), then the other
      // Botox treatments. In two columns "ovenfor" pointed at nothing, so the packages are a group
      // that names the areas it applies to. Hyperhidrose is not one of them (live: "Øvrige Botox
      // behandlinger"); placed before the packages so the two columns are even (6 | 6 rows).
      botox: [
        {
          title: "Enkelte områder",
          labels: [
            "Lip flip / Gummy smile / Bunny lines",
            "Brynløft / Nose slimming / Rygerynker",
            "Nedadgående mundvige",
            "Pande / Bekymringsrynke / Kragetæer",
            "Platysmabånd / Nefertiti lift",
          ],
        },
        { title: "Øvrige behandlinger", labels: ["Hyperhidrose (svedige armhuler)"] },
        {
          title: "Flere områder",
          note: "Frit valg blandt de enkelte områder",
          labels: ["2 områder", "3 områder", "4 områder", "5 områder", "6 områder", "7 områder"],
        },
      ],
      // Hyalase dissolves filler: a service of its own, not an amount of lip filler (and cheaper
      // than the "fra" price, which is the 0,3 ml row).
      "lip-filler": [{ title: "Andre ydelser", labels: ["Opløsning af filler (Hyalase)"] }],
    } as Record<string, PriceGroupCopy[]>,
  },

  posts: {
    eyebrow: "Fra bloggen",
    /** Heading when `detail.relatedPostsTitle` is missing. */
    title: withName("Læs mere om"),
    intro: "Alt det, du gerne vil vide før din første behandling, skrevet af vores behandlere.",
    readArticle: "Læs artiklen",
    /** Short reading time on mobile cards: "Guide · 4 min". */
    minutes: "min",
    // TODO: copy review — links for treatments without `detail.relatedPostsLink`.
    allPostsLink: { label: "Alle artikler", href: blogPage.path } satisfies Link,
    /**
     * Used instead of `allPostsLink` when every related post shares a blog category:
     * "Alle artikler om hudpleje" → /blog?kategori=hudpleje.
     */
    categoryPostsLink: (categoryName: string, filterSlug: string): Link => ({
      label: `Alle artikler om ${categoryName.toLocaleLowerCase(site.locale)}`,
      href: blogPage.filterHref(filterSlug),
    }),
  },

  /**
   * Treatments whose name keeps its capital letter inside a sentence (brand names).
   * Other names are lower-cased there: "Læs mere om skinbooster", as in the design
   * ("Læs mere om lip filler", "Læs mere om botox"). Acronyms (PRF) are never lower-cased.
   */
  brandNames: ["profhilo", "polyphil-hair"] as string[],

  faq: {
    title: "Ofte stillede spørgsmål",
    /**
     * FAQ for treatments without their own. Facts from the live fillox.dk: free consultation,
     * financing, the optional free check-up ~14 days after (fillox.dk/om-os/kontrol-eftertjek),
     * the doctor on call 24/7 (fillox.dk front page).
     */
    fallback: [
      {
        question: "Er konsultationen gratis?",
        answer:
          "Ja. Konsultation og kontrol er altid gratis hos Fillox. Vi gennemgår dine ønsker og behandler kun, når det giver mening for dig.",
      },
      {
        question: "Kan jeg dele betalingen op?",
        answer: `Ja, du kan dele betalingen op i rater. ${pricesPage.financing.textShort}`,
      },
      {
        question: "Hvad hvis jeg har spørgsmål efter behandlingen?",
        answer:
          "Du kan booke en gratis kontrol cirka 14 dage efter behandlingen, og vi har altid en vagtlæge, hvis du er i tvivl om noget.",
      },
    ] satisfies FaqItem[],
  },

  booking: {
    title: "Klar til at booke?",
    /** Text when `detail.bookingText` is missing. */
    fallbackText: "Første konsultation er altid gratis.",
    /** "Book Lip Filler · fra 999 kr" (price part omitted when unknown). */
    cta: (name: string, price?: string) => (price ? `Book ${name} · ${price}` : `Book ${name}`),
  },

  /**
   * Meta description for treatments without `detail`: one-liner + price + consultation note.
   */
  // TODO: copy review
  metaDescription: (text: string, price?: string) =>
    price ? `${text} Pris ${price}. Konsultation og kontrol er altid gratis.` : `${text} Konsultation og kontrol er altid gratis.`,

  /**
   * Fact cards for treatments without `detail.facts`. `price` is "fra 999 kr".
   * Values are the design's trust chips (6b), also stated on the live fillox.dk: gratis
   * konsultation, vagtlæge 24/7, finansiering.
   */
  fallbackFacts: (price?: string) => [
    ...(price ? [{ label: "Pris", value: price }] : []),
    { label: "Konsultation", value: "Gratis" },
    { label: "Vagtlæge", value: "24/7" },
    { label: "Finansiering", value: "Mulig" },
  ],

  /**
   * "Om behandlingen" band for treatments without `detail.about`. The first paragraph is
   * the treatment's one-liner followed by `categoryText` for its category (for a variant
   * in `priceAliases`: the category of the treatment it is a variant of); `paragraphs` follow.
   */
  // TODO: copy review
  fallbackAbout: {
    categoryText: {
      fillers:
        "Filleren er lavet af hyaluronsyre, et stof der findes naturligt i huden, og er tilsat lidocain, et bedøvelsesmiddel. Resultatet ses med det samme, og det endelige resultat ses, når hævelsen har lagt sig. Filleren kan opløses igen, hvis der er behov for det.",
      rynkebehandling:
        "Vi bruger botox, et receptpligtigt lægemiddel, som doseres præcist til det område, der skal behandles. Før din første behandling har du en lovpligtig lægekonsultation, som altid er gratis.",
      hudforbedring:
        "Mange får det bedste resultat med et forløb over flere behandlinger, og din behandler anbefaler, hvad der passer til netop din hud.",
      "laser-harfjerning":
        "Laseren virker på hårsækkene og giver en varig reduktion af hårvæksten. Du betaler pr. område eller en samlet pris for hele kroppen.",
      hartab:
        "Behandlingen virker direkte i hovedbunden og gives typisk som en kur over flere behandlinger, som du kan købe samlet til en lavere pris.",
      "for-maend":
        "Mænds hud, muskulatur og ansigtsform er anderledes end kvinders, så vi doserer og planlægger behandlingen efter det. Målet er et naturligt resultat, der passer til dit udtryk.",
    } as Record<string, string>,
    paragraphs: [
      "Vi starter altid med en gratis konsultation, hvor din behandler vurderer dine ønsker og lægger en plan sammen med dig. Cirka 14 dage efter behandlingen kan du booke en gratis kontrol, og vores vagtlæge kan kontaktes døgnet rundt, hvis du er i tvivl om noget.",
    ],
    listLabel: "Sådan foregår det",
    items: ["Gratis konsultation", "En plan tilpasset dig", "Behandling i en af vores klinikker", "Gratis kontrol bagefter"],
  },

  /**
   * Hero photo for treatments without `detail.heroImage`, by category slug
   * (content/navigation.ts). The design has no photos for these treatments.
   */
  // TODO: copy review (image choice + alt texts)
  categoryImages: {
    fillers: {
      src: "/images/hero/hero-1.jpg",
      alt: "Kvinde med opsat hår foran en rosa baggrund",
      position: "50% 35%",
      width: 1200,
      height: 1500,
    },
    rynkebehandling: {
      src: "/images/results/duo-color.jpg",
      alt: "To smilende kvinder foran en beige og rosa baggrund",
      position: "50% 50%",
      width: 1600,
      height: 1096,
    },
    hudforbedring: {
      src: "/images/hero/hero-2.jpg",
      alt: "Kvinde i blåt lys",
      position: "50% 35%",
      width: 1200,
      height: 1500,
    },
    "laser-harfjerning": {
      src: "/images/results/duo-pink.jpg",
      alt: "To smilende kvinder foran en rosa baggrund",
      position: "50% 50%",
      width: 2000,
      height: 1228,
    },
    hartab: {
      src: "/images/hero/hero-3.jpg",
      alt: "Kvinde med langt brunt hår i aftenlys",
      position: "50% 35%",
      width: 1200,
      height: 1500,
    },
    // Neutral clinic photo: the "for mænd" pages have no practitioner of their own.
    "for-maend": {
      src: "/images/results/behandling-3.jpg",
      alt: "Fillox-logoet på væggen i klinikken",
      position: "90% 50%",
      width: 800,
      height: 533,
    },
  } as Record<string, ImageRef>,

  /** Used when a category has no image above. */
  defaultImage: {
    src: "/images/results/duo-pink.jpg",
    alt: "To smilende kvinder foran en rosa baggrund",
    position: "50% 50%",
    width: 2000,
    height: 1228,
  } satisfies ImageRef,

  /**
   * Practitioner shown on pages without `detail.practitionerSlug`, by treatment slug.
   * Treatments listed in a team member's `profile.offers` pick that member automatically.
   * Næsekorrektion is done by Dr. Tom (6b: "Næsekorrektion v. Dr. Tom").
   */
  practitionerBySlug: {
    naesekorrektion: "tom",
  } as Record<string, string>,

  /**
   * Price-list rows for treatments without `detail.prices` come from content/prices.ts:
   * rows tagged with the treatment's slug, or untagged rows in the treatment's category
   * card whose label names the treatment. "For mænd" treatments borrow the rows of the
   * treatment they are a variant of.
   */
  priceAliases: {
    "botox-for-maend": "botox",
    "kaebelinje-for-maend": "kaebelinje",
    "hartab-for-maend": "prf-har",
    "laser-for-maend": "laser-harfjerning",
  } as Record<string, string>,

  /**
   * Optional explicit list of price-list rows (labels in content/prices.ts, searched in the cards
   * of the treatment's category) for a treatment, when not every matched row applies to it. The
   * "Se alle priser" link under the list leads to the full card.
   */
  priceRowLabels: {
    // A filler area costs the "op til 1 ml" price; larger amounts are the 4 ml package
    // (fillox.dk/fillers/ansigtskonturering: kindben, hage, kæbelinje …). Listed in the order
    // to show: the treatment's own row (its "fra" price) first.
    kindben: ["Kindben", "Ansigtskonturering · 4 ml"],
    kaebelinje: ["Kæbelinjer", "Ansigtskonturering · 4 ml"],
    "kaebelinje-for-maend": ["Kæbelinjer", "Ansigtskonturering · 4 ml"],
    hage: ["Hage", "Ansigtskonturering · 4 ml"],
    // The most booked areas; the full list (25 areas, men's areas, packages) is on /priser.
    "laser-harfjerning": [
      "Helt ansigt",
      "Overlæbe",
      "Armhuler",
      "Hele arme (inkl. hænder)",
      "Hele ben (inkl. fødder)",
      "Ryg (inkl. lænd)",
      "Bikinilinje",
      "Brasil",
    ],
  } as Record<string, string[]>,
};

/** /behandlinger overview. */
export const treatmentsOverview = {
  // TODO: copy review (meta, intro and category intros are not in the design)
  meta: {
    title: "Behandlinger",
    description:
      "Se alle behandlinger hos Fillox: fillers, botox, hudforbedring, laser hårfjerning og behandling af hårtab. Konsultation og kontrol er altid gratis.",
  },
  title: "Behandlinger",
  intro:
    // Not "… og laser, udført af læger og sygeplejersker": live, laser is done by staff trained in
    // Fillox Academy (fillox.dk/harfjerning). Fillers and botox: fillox.dk/priser (konsultation
    // v. kosmetisk sygeplejerske, specialist-tillæg v. læge) and /rynkebehandling (sygeplejerske/læge).
    "Fillers, rynkebehandling, hudforbedring og laser. Fillers og botox udføres af læger og sygeplejersker, og vi starter altid med en gratis konsultation.",
  /** Accessible name of the category jump links. */
  jumpLabel: "Hop til kategori",
  heroImage: {
    src: "/images/hero/hero-1.jpg",
    alt: "Kvinde med opsat hår foran en rosa baggrund",
    position: "50% 30%",
  } satisfies ImageRef,
  /** One-line intro per category (by slug). */
  categoryIntros: {
    fillers: "Kontur, volumen og harmonisering af ansigtets proportioner.",
    rynkebehandling: "Botox til rynker og mimiklinjer, og til lip flip, gummy smile, sved og en blødere skulderlinje.",
    hudforbedring: "Skinboosters, microneedling, PRF og ansigtsbehandlinger, der styrker huden.",
    "laser-harfjerning": "Laser til kvinder og mænd, pr. område eller med en samlet pris for hele kroppen.",
    hartab: "Behandlinger af hovedbunden ved tyndt hår og begyndende hårtab.",
    "for-maend": "Behandlinger doseret efter mænds anatomi, mimik og udtryk.",
  } as Record<string, string>,
  /** Link from a category to its card on /priser. */
  seePrices: "Se priser",
  /** Closing band. */
  cta: {
    title: "Usikker på, hvad du skal vælge?",
    text: "Book en gratis konsultation.",
  },
};

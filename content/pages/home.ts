import type { ImageRef, Link } from "../types";
import { site } from "@/config/site";
import { formatDecimal } from "@/lib/format";
import { ui } from "../ui";
import { routes } from "../routes";
import { treatmentHref } from "../treatments";

/**
 * Front page copy (design 6a desktop, mf mobile). Copy is verbatim from the design.
 * `*Short` fields are the mobile (mf) wording, shown below the md breakpoint.
 *
 * Data shown on the page but owned elsewhere:
 * - bestseller rows → content/treatments.ts `bestsellers`
 * - practitioners   → content/team.ts `team`
 * - clinic cards    → content/clinics.ts `clinics` (`hoursSummary`, `openingNote`)
 */

type Stat = { value: string; label: string };
type Usp = { title: string; text: string };
type ResultPhoto = { image: ImageRef; caption: string; href: string };

export const homePage = {
  meta: {
    // TODO: copy review (the design has no SEO title for the front page)
    title: "Fillox · Æstetisk medicin i København og omegn",
    description:
      "Hos Fillox får du trygge, professionelle behandlinger, udført af læger og sygeplejersker og tilpasset din egen anatomi.",
  },

  hero: {
    eyebrow: "Æstetisk medicin",
    /** H1 part 1 (ink). Desktop keeps it on one line. */
    title: "Fremhæv din",
    /** H1 part 2 (plum). Desktop puts each entry on its own line; mobile runs them together. */
    titleAccent: ["naturlige", "skønhed"],
    lead: "Hos Fillox får du trygge, professionelle behandlinger, udført af læger og sygeplejersker og tilpasset din egen anatomi.",
    leadShort: "Trygge, professionelle behandlinger, udført af læger og sygeplejersker og tilpasset din egen anatomi.",
    primaryCta: { label: ui.bookCta, href: site.booking.href } satisfies Link,
    secondaryCta: { label: ui.seePrices, href: routes.prices } satisfies Link,
    image: {
      src: "/images/hero/hero-1.jpg",
      // TODO: copy review (alt text)
      alt: "Kvinde med mørkt, opsat hår foran en rosa baggrund",
      position: "50% 50%",
    } satisfies ImageRef,
    stats: [
      { value: "10.000+", label: "Behandlinger" },
      { value: "4", label: "Klinikker" },
      { value: `${formatDecimal(site.trustpilot.score)} ★`, label: "Trustpilot" },
    ] satisfies Stat[],
  },

  /** Plum band under the hero. Mobile (mf) shows the titles only. */
  usps: [
    { title: "Erfarne behandlere", text: "Kun læger og sygeplejersker" },
    { title: "Naturlige resultater", text: "Din egen anatomi som udgangspunkt" },
    { title: "Vagtlæge 24/7", text: "Du er altid i trygge hænder" },
    { title: "4 klinikker", text: "København og omegn" },
  ] satisfies Usp[],

  bestsellers: {
    title: "Vores bestsellers",
    intro:
      "Du starter altid med en konsultation. Din behandler vurderer din anatomi og lægger en plan sammen med dig, og vi behandler kun, når det giver mening.",
    introShort: "Du starter altid med en konsultation, og vi behandler kun, når det giver mening.",
    cta: { label: ui.seeAllTreatments, href: routes.treatments } satisfies Link,
  },

  results: {
    title: "Vi fremkalder, vi forandrer ikke",
    intro:
      "Det bedste resultat er det, ingen bemærker, kun at du ser veludhvilet ud, som på de gamle billeder. Derfor starter enhver behandling med en ærlig konsultation, hvor vi lige så gerne fraråder som anbefaler.",
    introShort:
      "Det bedste resultat er det, ingen bemærker, kun at du ser veludhvilet ud. Derfor starter enhver behandling med en ærlig konsultation, hvor vi lige så gerne fraråder som anbefaler.",
    // TODO: copy review (accessible name of the mobile scroll row, not in the design)
    listLabel: "Resultater",
    items: [
      {
        image: {
          src: "/images/results/duo-pink.jpg",
          alt: "To smilende kvinder foran en rosa baggrund",
          position: "50% 50%",
        },
        caption: "lip filler, 2026",
        href: treatmentHref("lip-filler"),
      },
      {
        image: {
          src: "/images/results/duo-color.jpg",
          alt: "To smilende kvinder foran en beige og rosa baggrund",
          position: "50% 50%",
        },
        caption: "botox, 2026",
        href: treatmentHref("botox"),
      },
      {
        image: {
          src: "/images/results/behandling-3.jpg",
          alt: "Fillox-logoet på væggen i klinikken",
          position: "50% 50%",
        },
        caption: "skinbooster, 2025",
        href: treatmentHref("skinbooster"),
      },
    ] satisfies ResultPhoto[],
  },

  team: {
    title: "Mød dem, der behandler dig",
    link: { label: "Mød hele teamet", href: routes.aboutTeam } satisfies Link,
    // TODO: copy review (accessible name of the mobile scroll row, not in the design)
    listLabel: "Vores behandlere",
  },

  testimonial: {
    // TODO: copy review (accessible names, not in the design)
    label: "Kundeanmeldelse",
    ratingLabel: "5 ud af 5 stjerner",
    rating: 5,
    quote: "“Professionelle, rolige og ærlige. Jeg blev frarådet mere, end jeg blev anbefalet, dét er tillid.”",
    author: "Maria",
    source: "Trustpilot",
    /** Desktop only (the mobile card has no photo). Decorative next to the quote. */
    image: {
      src: "/images/results/duo-pink.jpg",
      alt: "",
      position: "50% 50%",
    } satisfies ImageRef,
  },

  clinics: {
    title: "Her finder du Fillox",
  },
};

export type HomePage = typeof homePage;

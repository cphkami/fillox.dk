import type { ImageRef, Link } from "../types";
import { site } from "@/config/site";
import { formatDecimal } from "@/lib/format";
import { reviewsFor } from "../reviews";
import { ui } from "../ui";
import { routes } from "../routes";
import { getTreatment, treatmentHref } from "../treatments";
import { photos } from "../photos";

/**
 * Front page copy (design 6a desktop, mf mobile). Copy is verbatim from the design.
 * `*Short` fields are the mobile (mf) wording, shown below the md breakpoint.
 *
 * Data shown on the page but owned elsewhere:
 * - bestseller rows → content/treatments.ts `bestsellers`
 * - practitioners   → content/team.ts `team`
 * - clinic cards    → content/clinics.ts `clinics` (`hoursSummary`, `openingNote`)
 * - testimonial     → content/reviews.ts (verified Trustpilot reviews, set "home")
 */

type Stat = { value: string; label: string };
type Usp = { title: string; text: string };
type TreatmentPhoto = { image: ImageRef; caption: string; href: string };

/** A treatment's name for a caption (content/treatments.ts), e.g. "Lip filler". */
function treatmentName(slug: string): string {
  const treatment = getTreatment(slug);
  if (!treatment) throw new Error(`home: no treatment "${slug}"`);
  return treatment.name;
}

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
    /** H1 part 2 (the emphasis colour). Desktop puts each entry on its own line; mobile runs them together. */
    titleAccent: ["naturlige", "skønhed"],
    lead: "Hos Fillox får du trygge, professionelle behandlinger, udført af læger og sygeplejersker og tilpasset din egen anatomi.",
    leadShort: "Trygge, professionelle behandlinger, udført af læger og sygeplejersker og tilpasset din egen anatomi.",
    primaryCta: { label: ui.bookCta, href: site.booking.href } satisfies Link,
    secondaryCta: { label: ui.seePrices, href: routes.prices } satisfies Link,
    // The clinic's own photo (content/photos.ts). The practitioner's face sits at ≈ 45% × 58%; 62%
    // keeps it in the landscape crops below 1024px, and her hands and the client's face in the
    // portrait column from 1024px. TODO: copy review (alt text)
    image: photos.behandlingKlient satisfies ImageRef,
    stats: [
      // Owner, 2026-11-25: "10.000+ behandlinger er det vi har lavet indtil videre" (treatments done so far).
      { value: "10.000+", label: "Behandlinger" },
      { value: "4", label: "Klinikker" },
      { value: `${formatDecimal(site.trustpilot.score)} ★`, label: "Trustpilot" },
    ] satisfies Stat[],
  },

  /** Rose band under the hero. Mobile (mf) shows the titles only. */
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
    /**
     * Mood photos of the clinic, each linking to a treatment; the caption is the treatment's name.
     * Not results: no client's result and no before/after here, no year or amount in the caption.
     * The clinic's before/after pairs are on the treatment pages (content/treatments.ts →
     * `results`; Kæbelinje so far). No rynkebehandling card: Botox is a prescription medicine.
     * `alt: ""`: the visible caption names the link, so the photo is decorative there (as on the
     * team cards and blog cards); its description would only lengthen the link's name.
     */
    // TODO: copy review (accessible name of the mobile scroll row, not in the design; the cards
    // were "Resultater" while they showed stock photos captioned as results)
    listLabel: "Behandlinger",
    items: [
      {
        // Alberte with a syringe, arms crossed (content/photos.ts). The owner, 2026-11-25, on the
        // former photo here (`sproejte`, her head at the card's top edge): "for højt oppe vs de
        // andre … zoom den ind … ellers prøv at se om der er andet billede". This one has room above
        // her head: zoomed 1.35 from the top centre, her eyes sit at ≈ 38% of the card, the line of
        // the other two (≈ 39%), and the syringe stays in the lower right corner.
        image: { ...photos.behandlerSproejte, alt: "", position: "50% 0%", zoom: 1.35 },
        caption: treatmentName("lip-filler"),
        href: treatmentHref("lip-filler"),
      },
      {
        // A practitioner in profile, smiling at a leaflet (the jawline in view). No client, no
        // injection, no product. Not Mike's photo any more: it became his team portrait, which the
        // team row further down shows (the owner, 2026-11-25). 75%: her face nearer the middle of
        // the 5 : 6 card, the leaflet still in it.
        image: { ...photos.behandlerFolder, alt: "", position: "75% 40%" },
        caption: treatmentName("kaebelinje"),
        href: treatmentHref("kaebelinje"),
      },
      {
        image: { ...photos.behandlerVindue, alt: "" },
        caption: treatmentName("skinbooster"),
        href: treatmentHref("skinbooster"),
      },
    ] satisfies TreatmentPhoto[],
  },

  team: {
    title: "Mød dem, der behandler dig",
    link: { label: "Mød hele teamet", href: routes.aboutTeam } satisfies Link,
    // TODO: copy review (accessible name of the mobile scroll row, not in the design)
    listLabel: "Vores behandlere",
  },

  testimonial: {
    // TODO: copy review (accessible name, not in the design)
    /** Accessible name of the review carousel (the section has no visible heading). */
    label: "Kundeanmeldelser",
    /** Verified Trustpilot reviews, rotated (content/reviews.ts → reviewSets.home). */
    reviews: reviewsFor({ set: "home" }).reviews,
    /**
     * Desktop only (the mobile card has no photo). Decorative next to the quote (alt=""): the
     * empty treatment room, no person (content/photos.ts). Not the mirror photo: a woman looking
     * at her face next to a client's review reads as that reviewer's result.
     */
    image: { ...photos.behandlingsrum, alt: "" } satisfies ImageRef,
  },

  clinics: {
    title: "Her finder du Fillox",
  },
};

export type HomePage = typeof homePage;

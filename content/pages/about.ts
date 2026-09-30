import type { ImageRef, Link } from "../types";
import { site } from "@/config/site";

/**
 * Anchor id of the team section on /om-os. The hero's "Mød teamet" link is derived
 * from it; other pages can link to `/om-os#${aboutTeamAnchor}`.
 */
export const aboutTeamAnchor = "behandlere";

/**
 * Copy for /om-os (design 6om desktop, mo mobile). The practitioners themselves
 * (names, titles, bios, portraits, links) come from content/team.ts.
 *
 * Where the mobile design shortens a text, the short version is in `*Short`.
 * Link labels are stored without arrows; components add the glyph.
 */
export const aboutPage = {
  meta: {
    title: "Om os",
    // TODO: copy review (meta description is not in the design; built from the hero text).
    // Keep it at 155 characters or fewer so search results don't truncate it.
    description:
      "Hos Fillox behandler kun læger og sygeplejersker – med en ærlig vurdering før hver behandling. Mød Dr. Tom og vores behandlere.",
  },

  hero: {
    eyebrow: "Om Fillox",
    title: "Vi vil højne kvaliteten i branchen",
    intro:
      "Branchen har længe haft en lav tærskel for, hvem der må udføre medicinske injektioner. Hos Fillox behandler kun læger og sygeplejersker, og vi lægger lige så meget vægt på den ærlige vurdering som på selve behandlingen.",
    introShort:
      "Hos Fillox behandler kun læger og sygeplejersker, og vi lægger lige så meget vægt på den ærlige vurdering som på selve behandlingen.",
    image: {
      // TODO: asset (owner): replace with a larger original of this photo, at least 2200×1470
      // (ideally 2400px wide). This file is 800×533; on wide screens it covers a ≈ 1080×720 cell,
      // so it is upscaled ≈ 1.35× (≈ 2.7× on retina) and the letters look soft.
      src: "/images/results/behandling-3.jpg",
      // TODO: copy review (alt text)
      alt: "Fillox-logoet i spejlblanke bogstaver på væggen i klinikken",
      position: "50% 50%",
    } satisfies ImageRef,
    primaryCta: { label: "Book konsultation", href: site.booking.href } satisfies Link,
    /** In-page link to the team section (desktop only in the design). */
    teamLink: { label: "Mød teamet", href: `#${aboutTeamAnchor}` } satisfies Link,
  },

  why: {
    title: "Hvorfor vælge Fillox",
    paragraphs: [
      "Et godt æstetisk resultat kræver en behandler med stærk faglig kompetence og sans for det æstetiske. Vi tilfører branchen sans for detaljer, teknisk finesse og erfaring.",
      "Du møder altid en behandler med medicinsk baggrund og dyb forståelse for ansigtets anatomi. Og du får en ærlig vurdering, før vi behandler: vi fraråder lige så gerne, som vi anbefaler.",
    ],
    /** Mobile (mo) merges the two paragraphs into one shorter text. */
    textShort:
      "Et godt resultat kræver en behandler med stærk faglig kompetence og sans for det æstetiske. Du møder altid en behandler med medicinsk baggrund, og du får en ærlig vurdering, før vi behandler.",
  },

  team: {
    /** Anchor id of the team section (nav "Vores behandlere" → /om-os#behandlere). */
    id: aboutTeamAnchor,
    eyebrow: "Teamet",
    title: "Mød vores behandlere",
  },

  /** Desktop band under the team grid (not in the mobile design). */
  responsible: {
    eyebrow: "Fagligt ansvarlig",
    name: "Æstetisk læge Tom Haugland",
    cta: { label: "Book konsultation", href: site.booking.href } satisfies Link,
  },
};

export type AboutPageCopy = typeof aboutPage;

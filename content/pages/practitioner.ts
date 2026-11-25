import type { Link } from "../types";
import { routes } from "../routes";

/**
 * Page copy for the practitioner profile /behandlere/[slug] (design 6alb desktop,
 * ma mobile) and the practitioner index /behandlere.
 *
 * The practitioner's own content (name, title, intro, facts, approach, offers,
 * experience, booking band) lives in content/team.ts → TeamMember.profile; their customer
 * reviews in content/reviews.ts (reviewSets.practitioners).
 * This file only holds the page-level strings around it, plus the fallbacks used
 * for a profile that is incomplete. A member without a `profile` has no page at all
 * (content/types.ts → TeamCardOnlyMember).
 *
 * Link labels are stored without arrows; components add the glyph.
 */
export const practitionerPage = {
  meta: {
    /** <title> of a profile page (the layout appends " · Fillox"). */
    // TODO: copy review (not in the design)
    title: (name: string, title: string) => `${name} – ${title}`,
  },

  /** "Om os → Behandlere → Alberte" (mobile shows the first two only). */
  breadcrumb: {
    // TODO: copy review (accessible name, not in the design)
    label: "Brødkrumme",
    items: [
      { label: "Om os", href: routes.about },
      { label: "Behandlere", href: routes.practitioners },
    ] satisfies Link[],
  },

  /** Anchor id of the offers section ("Se behandlinger ↓" links to it). */
  offersId: "behandlinger",

  /**
   * Between an offer's "Book" button label and the (visually hidden) treatment name that
   * makes each button's accessible name unique: "Book hos Alberte: Microneedling".
   */
  offerLabelSeparator: ": ",

  /**
   * Customer reviews section (rotating; the reviews are content/reviews.ts). The heading names
   * the practitioner only when every review shown names them; when the profile is filled up with
   * general reviews (fewer than 3 of their own), it says `generalTitle`.
   */
  // TODO: copy review (headings not in the design)
  review: {
    title: (name: string) => `Det siger kunderne om ${name}`,
    generalTitle: "Det siger vores kunder",
  },

  /**
   * Fallbacks for a profile that leaves a part out (same template as Alberte's page).
   * Wording follows Alberte's profile in content/team.ts.
   */
  fallback: {
    /** Closing booking band for a profile without `profile.booking` (its button is the hero's). */
    // TODO: copy review (confirm the band sentence per practitioner)
    booking: {
      title: (name: string) => `Book tid hos ${name}`,
      text: "Vælg behandling og klinik. Første konsultation er altid gratis.",
    },
  },

  /**
   * Row before the booking band on a profile without content sections of its own (only an intro
   * and facts): the other practitioners with a profile page, in the 6a team-row style.
   */
  // TODO: copy review (not in the design)
  otherTeam: {
    title: "Mød resten af teamet",
    /** Accessible name of the list of practitioners. */
    listLabel: "Andre behandlere",
    link: { label: "Se alle behandlere", href: routes.practitioners } satisfies Link,
  },

  /** /behandlere — every practitioner as a card (same card as on /om-os). */
  index: {
    meta: {
      title: "Vores behandlere",
      // Not in the design. One doctor ("Fagligt ansvarlig er æstetisk læge Tom Haugland",
      // https://fillox.dk/om-os/) and, since the owner's titles of 2026-11-25, kosmetiske
      // sygeplejersker only (it said "sygeplejersker og behandlere" while Alberte had no title).
      // TODO: copy review
      description:
        "Mød æstetisk læge Tom Haugland og vores kosmetiske sygeplejersker hos Fillox. Se, hvem de er, og book tid hos den behandler, du foretrækker.",
    },
    eyebrow: "Teamet",
    title: "Mød vores behandlere",
    /**
     * Card link to the profile when TeamMember.link is missing or points elsewhere (no member at
     * the moment: every card with a profile says "Se hvad X tilbyder"). Neutral, for a profile
     * that lists no treatments ("Se hvad X tilbyder" is only for a profile with offers). A member
     * without a profile page gets no link at all.
     */
    cardLinkLabel: (name: string) => `Læs mere om ${name}`,
  },
};

export type PractitionerPageCopy = typeof practitionerPage;

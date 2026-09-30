import type { Link } from "../types";
import { routes } from "../routes";

/**
 * Page copy for the practitioner profile /behandlere/[slug] (design 6alb desktop,
 * ma mobile) and the practitioner index /behandlere.
 *
 * The practitioner's own content (name, title, intro, facts, approach, offers,
 * experience, reviews, booking band) lives in content/team.ts → TeamMember.profile.
 * This file only holds the page-level strings around it, plus the fallbacks used
 * for members whose profile is missing or incomplete.
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

  review: {
    /** Typographic quote marks around the review quote. */
    quoteOpen: "“",
    quoteClose: "”",
    /** Between author and source: "Camilla · Trustpilot". */
    separator: " · ",
  },

  /**
   * Fallbacks for members without a full profile (same template as Alberte's page).
   * Wording follows Alberte's profile in content/team.ts.
   */
  fallback: {
    /** Hero + booking band button, e.g. "Book tid hos Dr. Tom". */
    bookCta: (name: string) => `Book tid hos ${name}`,
    /**
     * Closing booking band for a member with content sections but no `profile.booking`
     * (members without sections close with `otherTeam` instead of repeating the hero CTA).
     */
    // TODO: copy review (confirm the band sentence per practitioner)
    booking: {
      title: (name: string) => `Book tid hos ${name}`,
      text: "Vælg behandling og klinik. Første konsultation er altid gratis.",
    },
  },

  /**
   * Closing row on a profile without content sections of its own (the booking band would
   * only repeat the hero's button): the other practitioners, in the 6a team-row style.
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
      // TODO: copy review (not in the design)
      description:
        "Mød læger, sygeplejersker og behandlere hos Fillox. Se hvem de er, hvad de tilbyder, og book tid hos den behandler, du foretrækker.",
    },
    eyebrow: "Teamet",
    title: "Mød vores behandlere",
    /**
     * Card link to the profile when TeamMember.link points elsewhere (Dr. Tom's links to
     * booking). Same wording as the other members' links in content/team.ts.
     */
    cardLinkLabel: (name: string) => `Se hvad ${name} tilbyder`,
  },
};

export type PractitionerPageCopy = typeof practitionerPage;

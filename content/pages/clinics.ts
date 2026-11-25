import type { ImageRef } from "../types";
import { ui } from "../ui";
import { photos as clinicPhotos } from "../photos";

/**
 * Copy for /klinikker — "Find klinik" (design 6kl desktop, mk mobile). The clinics
 * themselves (names, addresses, hours, transport notes, booking + directions links)
 * come from content/clinics.ts.
 *
 * Where the mobile design words a text differently, the mobile version is in `*Short`.
 */

/** A pin on the mobile clinic map. x/y are percentages of the map artwork (350 × 220). */
export type ClinicMapPin = {
  slug: string;
  x: number;
  y: number;
  /** Which side of the pin the name label sits on. */
  labelSide: "left" | "right";
};

export const clinicsPage = {
  meta: {
    title: "Find klinik",
    // TODO: copy review (meta description is not in the design; built from the hero text).
    // Present tense since 25/11-2026: the owner says Østerbro is open.
    description:
      "Find din Fillox-klinik i City2, Amager Centret, på Frederiksberg eller på Østerbro. Se adresser og åbningstider, og book tid i klinikken.",
  },

  hero: {
    eyebrow: "Find klinik",
    title: "Her finder du Fillox",
    // 6kl / mk say "Samme behandlere, …", but each practitioner works at one or two given clinics
    // (the owner's list of 2026-11-25, content/team.ts → clinicSlugs), so the line only promises
    // prices and standard.
    intro: "Fire klinikker i og omkring København. Samme priser og samme standard, uanset hvor du booker.",
    introShort: "Fire klinikker i København og omegn. Samme priser, samme kvalitet.",
  },

  /** Mobile map above the clinic cards (mk: "Kort øverst"). Hidden on desktop (6kl has none). */
  map: {
    // TODO: copy review (accessible name; not in the design)
    label: "Kort over vores klinikker",
    /** Stylised map artwork (decorative; the pins carry the information). */
    image: { src: "/images/clinics/kort.svg", alt: "" } satisfies ImageRef,
    // Østerbro and Amager Centret sit ~46px (at 350px wide) from Frederiksberg, whose label
    // they overlap horizontally, so the pins' 44px tap areas don't overlap. Each pin stays
    // on its road in the artwork.
    pins: [
      { slug: "city2", x: 13.1, y: 53.6, labelSide: "right" },
      { slug: "frederiksberg", x: 56, y: 46.4, labelSide: "right" },
      { slug: "osterbro", x: 70.6, y: 25.4, labelSide: "right" },
      { slug: "amager-centret", x: 77.2, y: 68.6, labelSide: "left" },
    ] satisfies ClinicMapPin[],
  },

  /** Accessible name of the clinic list. */
  // TODO: copy review (accessible name; not in the design)
  listLabel: "Vores klinikker",

  card: {
    /**
     * Desktop card photo for every clinic without its own entry in `photos`: one of the clinic's
     * treatment rooms (content/photos.ts; which clinic is not known, so it stands for all four).
     * The same photo on all four cards adds nothing for screen readers, so it is decorative
     * (alt="").
     *
     * The file is a portrait (1086 × 1448); the card shows a 7:3 strip of it (up to 752 × 322 CSS
     * px on the 1600 canvas), the plant and the chair at 60% × 60%. 1086px covers the slot at 1x,
     * not at 2x: real landscape photos per clinic (see `photos`) will look sharper.
     */
    // TODO: copy review (image choice)
    photo: { ...clinicPhotos.behandlingsrum, alt: "" } satisfies ImageRef,
    /**
     * One photo per clinic, keyed by clinic slug (content/clinics.ts); replaces the
     * placeholder on that clinic's card. Needs, per clinic:
     *  - a landscape photo at least 1600px wide (the card slot is up to 752 CSS px),
     *    ideally framed for a 7:3 strip (e.g. 1600 × 686 or larger): the card crops it to
     *    7:3 from 1280px and to about 1.75:1–2.4:1 on tablets and small laptops;
     *  - its own alt text describing that clinic (e.g. "Venteværelset i Fillox City2");
     *  - `position` (CSS object-position) when the subject isn't centred, so it survives
     *    the 7:3 crop.
     * Also point that clinic's `seoImage` (content/clinics.ts) at the same file.
     */
    // TODO: real photo + alt text per clinic (city2, amager-centret, frederiksberg, osterbro).
    photos: {} as Partial<Record<string, ImageRef>>,
    /** Desktop booking button: "Book i City2". */
    bookLabel: (clinicName: string) => `${ui.bookAt} ${clinicName}`,
    /** Mobile booking button (mk). */
    bookShort: "Book her",
    /** Visually hidden context after "Book her", so the link names the clinic. */
    bookShortContext: (clinicName: string) => ` i ${clinicName}`,
    directions: ui.directions,
    // TODO: copy review (screen-reader-only text; not in the design)
    directionsContext: (clinicName: string) => ` til ${clinicName} (åbner Google Maps i en ny fane)`,
    // TODO: copy review (screen-reader-only heading; not in the design)
    hoursLabel: "Åbningstider",
    /** Mobile writes the days out in full (mk). Keyed by `Clinic.hours[].days`. */
    daysLong: {
      "Man–fre": "Mandag–fredag",
      "Lør–søn": "Lørdag–søndag",
      "Man–tir": "Mandag–tirsdag",
      "Ons–fre": "Onsdag–fredag",
      "Lør": "Lørdag",
      "Søn": "Søndag",
    } as Record<string, string>,
  },

  /**
   * Mobile wording for coming-soon clinics (mk), keyed by clinic slug: the badge next to the name
   * (desktop shows `Clinic.openingNote` on the photo) and a shorter note. Every clinic is open
   * since 25/11-2026 (Østerbro), so it is empty; a new clinic that is announced before it opens
   * gets an entry here and `status: "coming-soon"` in content/clinics.ts.
   */
  comingSoon: {} as Record<string, { openingNoteShort?: string; noteShort?: string }>,

  /** Plum USP strip under the cards (6kl; not in the mobile design). */
  usps: [
    { title: "Samme priser", text: "Du betaler det samme i alle klinikker." },
    { title: "Vagtlæge 24/7", text: "Du kan altid ringe, også efter lukketid." },
    { title: "Gratis konsultation", text: "I alle klinikker, uden forpligtelse." },
  ],
  // TODO: copy review (accessible name; not in the design)
  uspsLabel: "Det får du i alle klinikker",
};

export type ClinicsPageCopy = typeof clinicsPage;

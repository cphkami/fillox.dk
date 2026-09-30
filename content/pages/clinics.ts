import type { ImageRef, Link } from "../types";
import { site } from "@/config/site";
import { legalNav } from "../navigation";
import { ui } from "../ui";
import type { FormName } from "@/lib/forms";

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

/** Copy for the "Få besked" signup on a coming-soon clinic card. */
export type NotifyCopy = {
  /** Toggle button that reveals the form (design: "Få besked"). */
  toggle: string;
  /** Accessible name of the form. */
  formLabel: string;
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    phone: { label: string; optional: string; placeholder: string };
  };
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    /** Submit failed: lead text, then the phone number as a tel: link, then `end`. */
    submit: { text: string; phone: Link; end: string };
  };
  privacy: { text: string; link: Link };
  submit: string;
  sending: string;
  cancel: string;
  success: { title: string; text: string };
};

const privacyLink = legalNav.find((l) => l.href.includes("privat")) ?? legalNav[legalNav.length - 1];

export const clinicsPage = {
  meta: {
    title: "Find klinik",
    // TODO: copy review (meta description is not in the design; built from the hero text)
    description:
      "Find din Fillox-klinik i City2, Amager Centret, på Frederiksberg og snart på Østerbro. Se adresser, åbningstider og transport, og book tid i klinikken.",
  },

  hero: {
    eyebrow: "Find klinik",
    title: "Her finder du Fillox",
    intro:
      "Fire klinikker i og omkring København. Samme behandlere, samme priser og samme standard, uanset hvor du booker.",
    introShort: "Fire klinikker i København og omegn. Samme behandlere, samme kvalitet.",
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
     * Desktop card photo for every clinic without its own entry in `photos` (design
     * placeholder until real clinic photos exist). The same generic photo on all four cards
     * adds nothing for screen readers, so it is decorative (alt="").
     *
     * The placeholder file is only 800 × 533 (so is the design's upload), while the card
     * photo is up to 752 CSS px wide (1504 device px on a retina MacBook): it looks soft on
     * wide screens. Don't upscale it; replace it with real clinic photos (see `photos`).
     */
    photo: {
      src: "/images/results/behandling-3.jpg",
      alt: "",
      position: "50% 50%",
    } satisfies ImageRef,
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
    } as Record<string, string>,
  },

  /** Mobile wording for coming-soon clinics (mk), keyed by clinic slug. */
  comingSoon: {
    osterbro: {
      /** Badge next to the name on mobile. Desktop shows `Clinic.openingNote` on the photo. */
      openingNoteShort: "Åbner 1. nov",
      noteShort: "Vi åbner på Østerbro 1. november. Skriv dig op, så får du besked.",
      /** Netlify form the "Få besked" signup posts to (see public/__forms.html). */
      formName: "osterbro-besked",
    },
  } as Record<string, { openingNoteShort?: string; noteShort?: string; formName?: FormName }>,

  // TODO: copy review — only the toggle ("Få besked") is in the design; the form
  // itself is not designed. Labels/placeholders follow the 6ko contact form.
  notify: {
    toggle: ui.notifyMe,
    formLabel: "Få besked, når Østerbro åbner",
    fields: {
      name: { label: "Navn", placeholder: "Dit navn" },
      email: { label: "E-mail", placeholder: "din@email.dk" },
      phone: { label: "Telefon", optional: "(valgfri)", placeholder: "+45" },
    },
    errors: {
      nameRequired: "Skriv dit navn.",
      emailRequired: "Skriv din e-mail.",
      emailInvalid: "Tjek, at e-mailen er skrevet rigtigt.",
      /** Rendered as `{text} <a href={phone.href}>{phone.label}</a>{end}`, so the number is tappable. */
      submit: {
        text: "Vi kunne ikke sende din tilmelding. Prøv igen, eller ring til os på",
        phone: { label: site.contact.phone, href: site.contact.phoneHref },
        end: ".",
      },
    },
    privacy: {
      text: "Vi bruger kun dine oplysninger til at give dig besked, når vi åbner.",
      link: privacyLink,
    },
    submit: "Skriv mig op",
    sending: "Sender …",
    cancel: "Annuller",
    success: {
      title: "Tak, du er skrevet op",
      text: "Vi giver dig besked, så snart du kan booke tid på Østerbro.",
    },
  } satisfies NotifyCopy,

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

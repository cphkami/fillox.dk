/**
 * Copy for the site chrome: default SEO metadata, skip link, header, mobile
 * menu, footer, 404 and the /booking page. Components import from here and
 * never hard-code these strings.
 */
import { routes } from "./routes";

export const layoutCopy = {
  meta: {
    /** Used when a page sets no title of its own. */
    // TODO: copy review (not in the design)
    defaultTitle: "Fillox · Æstetiske behandlinger udført af læger og sygeplejersker",
    /** `%s` is replaced by the page title. */
    titleTemplate: "%s · Fillox",
    // TODO: copy review (expanded from the mf hero lead; not in the design)
    description:
      "Trygge behandlinger med botox, fillers og hudforbedring – udført af læger og sygeplejersker og tilpasset din anatomi. Klinikker i København og omegn.",
    /** Default social sharing image (1200×630 crop is taken from the centre). */
    // TODO: copy review (alt text)
    ogImage: {
      src: "/images/results/duo-pink.jpg",
      alt: "To smilende kvinder foran en rosa baggrund",
      width: 2000,
      height: 1228,
    },
  },

  /** Visually hidden link that jumps past the header. */
  // TODO: copy review (accessible names below are not in the design)
  skipLink: "Gå til indhold",
  /** Id of <main> (the skip link's target, shown in the address bar as #indhold). */
  mainId: "indhold",

  header: {
    /** Accessible name of the desktop header navigation. */
    navLabel: "Hovedmenu",
    /** Accessible name of the logo link. */
    homeLabel: "Fillox – til forsiden",
    /**
     * Extra route prefixes that mark a top-level nav item as active
     * (keyed by the nav item's href). E.g. practitioner profiles live under "Om os".
     */
    activePrefixes: {
      [routes.treatments]: [routes.treatments],
      [routes.clinics]: [routes.clinics],
      [routes.about]: [routes.about, routes.practitioners, routes.contact, routes.jobs, routes.creator],
    } as Record<string, string[]>,
    /** Desktop "Priser" dropdown (categories, trust points and financing copy come from content/prices.ts). */
    pricesMenu: {
      // TODO: copy review (not in the design)
      financingCta: "Læs om finansiering",
    },
  },

  mobileMenu: {
    /**
     * "Se alle …" link at the bottom of a category (mobile menu level 2).
     * Keyed by category slug; falls back to ui.seeAllTreatments.
     */
    categoryAllLabels: {
      // TODO: copy review — only "for-maend" is in the design (mm3); the other five are invented.
      fillers: "Se alle fillers",
      rynkebehandling: "Se alle rynkebehandlinger",
      hudforbedring: "Se alle hudbehandlinger",
      "laser-harfjerning": "Se alt om laser hårfjerning",
      hartab: "Se alle hårbehandlinger",
      "for-maend": "Se alle behandlinger for mænd",
    } as Record<string, string>,
  },

  footer: {
    tagline: "Æstetiske behandlinger udført af læger og sygeplejersker.",
    /** Accessible names for the footer landmarks / lists. */
    navLabel: "Sidefod",
    legalLabel: "Juridisk",
    clinicsLabel: "Vores klinikker",
  },

  // TODO: copy review (404 page has no design; all copy invented)
  notFound: {
    metaTitle: "Siden blev ikke fundet",
    eyebrow: "Fejl 404",
    title: "Siden findes ikke",
    text: "Vi kan desværre ikke finde den side, du leder efter. Den kan være flyttet eller slettet. Prøv at gå til forsiden, eller book en tid direkte.",
    homeCta: "Til forsiden",
  },

  // TODO: copy review (/booking has no design; all copy invented)
  booking: {
    metaTitle: "Book tid",
    metaDescription:
      "Book din behandling hos Fillox online. Vælg klinik, behandling og tidspunkt – du starter altid med en konsultation.",
    eyebrow: "Online booking",
    title: "Book tid",
    intro:
      "Vælg klinik, behandling og tidspunkt i kalenderen herunder. Du starter altid med en konsultation, hvor din behandler gennemgår dine ønsker og lægger en plan sammen med dig.",
    helpTitle: "Brug for hjælp til at booke?",
    helpText: "Ring eller skriv til os, så finder vi den rigtige tid sammen.",
    /**
     * Query parameters of booking links: /booking?klinik=city2 (clinic cards, menus) and
     * /booking?behandler=alberte (practitioner CTAs). Built by lib/booking.ts.
     */
    params: { clinic: "klinik", practitioner: "behandler" },
    /**
     * Clinic picker above the calendar. Only used with a per-clinic booking provider
     * (config/site.ts → booking.provider "timma", as on fillox.no); the Gecko calendar
     * (fillox.dk) has its own clinic selector.
     */
    // TODO: copy review (not in the design; unused while fillox.dk books through Gecko)
    clinicPicker: {
      label: "Vælg klinik",
      hint: "Vælg den klinik, du vil booke i, så åbner kalenderen herunder.",
      /** Accessible name of the booking iframe, e.g. "Book tid i Fillox City2". */
      iframeTitle: (clinicName: string) => `Book tid i ${clinicName}`,
      /** Link under the calendar that opens the provider's booking page directly. */
      openDirect: "Åbn bookingen i et nyt vindue",
    },
  },
};

export type LayoutCopy = typeof layoutCopy;

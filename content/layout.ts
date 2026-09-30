/**
 * Copy for the site chrome: default SEO metadata, skip link, header, mobile
 * menu, footer, 404 and the /booking page. Components import from here and
 * never hard-code these strings.
 */
export const layoutCopy = {
  meta: {
    /** Used when a page sets no title of its own. */
    // TODO: copy review (not in the design)
    defaultTitle: "Fillox · Æstetiske behandlinger udført af læger og sygeplejersker",
    /** `%s` is replaced by the page title. */
    titleTemplate: "%s · Fillox",
    // TODO: copy review (expanded from the mf hero lead; not in the design)
    description:
      "Trygge, professionelle behandlinger med botox, fillers og hudforbedring – udført af læger og sygeplejersker og tilpasset din egen anatomi. Klinikker i København og omegn.",
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
      "/behandlinger": ["/behandlinger"],
      "/klinikker": ["/klinikker"],
      "/om-os": ["/om-os", "/behandlere", "/kontakt", "/ledige-stillinger", "/content-creator"],
    } as Record<string, string[]>,
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
  },
};

export type LayoutCopy = typeof layoutCopy;

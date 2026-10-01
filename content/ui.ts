/**
 * Shared UI strings — short labels reused by many components (buttons, links,
 * aria-labels). Page-specific copy lives in content/pages/<page>.ts.
 *
 * Keep this a FLAT object. Page agents may append keys at the end of the
 * matching group; never rename or remove existing keys.
 */
export const ui = {
  /* ------------------------------------------------------------ Calls to action */
  /** Primary booking CTA ("Book tid"). */
  bookCta: "Book tid",
  /** Short booking link in lists, e.g. mobile menu clinic rows ("Book →"). */
  book: "Book",
  /** Prefix for clinic-specific booking links, e.g. "Book i City2" (aria-label). */
  bookAt: "Book i",
  seePrices: "Se priser",
  readMore: "Læs mere",
  seeAllTreatments: "Se alle behandlinger",
  seeAllClinics: "Se alle klinikker",
  /** Link at the bottom of the desktop "Priser" dropdown ("Se alle priser →"). */
  seeAllPrices: "Se alle priser",
  notifyMe: "Få besked",
  directions: "Rutevejledning",

  /* ------------------------------------------------------------------ Prices */
  /** Price prefix: "fra 799 kr". */
  from: "fra",
  free: "Gratis",

  /* ----------------------------------------------------------------- Contact */
  callUs: "Ring til os",
  writeUs: "Skriv til os",

  /* ------------------------------------------------------------- Navigation */
  openMenu: "Åbn menu",
  closeMenu: "Luk menu",
  back: "Tilbage",
  /** aria-label of the fullscreen mobile menu dialog. */
  menu: "Menu",

  /* -------------------------------------------------------------- Trustpilot */
  /** "4,7 ud af 5" — used in the rating's accessible label. */
  outOf: "ud af",
  trustpilot: "Trustpilot",
  /** Rating label before the stars ("Fremragende ★★★★½"). */
  trustpilotLabel: "Fremragende",
  /** Aggregate rating, e.g. "4,7 ud af 5 · 172 anmeldelser" ({score}, {count} from config/site.ts). */
  trustpilotSummary: "{score} ud af 5 · {count} anmeldelser",
  /** Link to the Trustpilot profile next to every review rotator (arrow added by the component). */
  seeAllReviews: "Se alle anmeldelser på Trustpilot",

  /* ----------------------------------------------------------------- Reviews */
  /** Accessible name of a review carousel that has no visible heading. */
  reviewsLabel: "Kundeanmeldelser",
  /** aria-roledescription of the review carousel and of each review in it (read by screen readers). */
  carouselRole: "karrusel",
  slideRole: "slide",
  /** Each review's label and its dot button: "Anmeldelse 2 af 5". */
  reviewPosition: "Anmeldelse {n} af {total}",
  /** Accessible name of the group of dot buttons. */
  reviewPicker: "Vælg anmeldelse",
  reviewPrevious: "Forrige anmeldelse",
  reviewNext: "Næste anmeldelse",
  /** Pause / play button of the automatic rotation. */
  reviewsPause: "Stop automatisk skift af anmeldelser",
  reviewsPlay: "Start automatisk skift af anmeldelser",
  /** Star rating of one review: "5 ud af 5 stjerner". */
  reviewRating: "{rating} ud af 5 stjerner",
  /** Typographic quote marks around a review quote. */
  quoteOpen: "“",
  quoteClose: "”",
  /** Between author, date and source under a review: "Sarah · 23. sep. 2026 · Trustpilot". */
  separator: " · ",
  /** Screen-reader note after a link that opens in a new tab (shown in brackets). */
  opensInNewTab: "åbner i en ny fane",
} as const;

export type UiStrings = typeof ui;

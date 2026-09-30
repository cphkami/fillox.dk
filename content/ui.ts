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
  seeAll: "Se alle",
  seeAllTreatments: "Se alle behandlinger",
  seeAllClinics: "Se alle klinikker",
  /** Link at the bottom of the desktop "Priser" dropdown ("Se alle priser →"). */
  seeAllPrices: "Se alle priser",
  notifyMe: "Få besked",
  directions: "Rutevejledning",

  /* ------------------------------------------------------------------ Prices */
  /** Price prefix: "fra 799 kr". */
  from: "fra",
  /** Uppercase-ready variant used in price pills, e.g. "FRA 799 KR". */
  fromUpper: "Fra",
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
} as const;

export type UiStrings = typeof ui;

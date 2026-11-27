import type { Link, MegaMenuContent, NavItem, TreatmentCategory } from "./types";
import { routes } from "./routes";
import { site } from "@/config/site";

/** Main navigation (desktop header + mobile fullscreen menu). */
export const mainNav: NavItem[] = [
  { kind: "treatments", label: "Behandlinger", href: routes.treatments },
  /** Desktop dropdown built from content/prices.ts (categories, trust points); a plain link in the mobile menu. */
  { kind: "prices", label: "Priser", href: routes.prices },
  { kind: "clinics", label: "Find klinik", href: routes.clinics },
  {
    kind: "menu",
    label: "Om os",
    href: routes.about,
    items: [
      { label: "Om Fillox", href: routes.about },
      // The guide for first-time visitors (content/pages/new-here.ts); its H1 is the label.
      { label: "Ny hos Fillox?", href: routes.newHere },
      { label: "Vores behandlere", href: routes.aboutTeam },
      { label: "Ledige stillinger", href: routes.jobs },
      { label: "Kontakt", href: routes.contact },
    ],
  },
  /** Mobile menu shows Blog as a top-level row; desktop keeps it in the footer. */
  { kind: "link", label: "Blog", href: routes.blog },
];

/** Items hidden from the desktop header (still shown in the mobile menu). */
export const desktopHiddenNav: string[] = [routes.blog];

/**
 * Treatment categories: the sections of /behandlinger (in this order) and the mobile menu's
 * level 2. The desktop mega menu picks its own short columns (megaMenu below).
 */
export const treatmentCategories: TreatmentCategory[] = [
  {
    slug: "fillers",
    name: "Fillers",
    // The nine areas of the fillers page, in its order (content/pages/fillers.ts → areas). Alberte
    // 2026-11-26 (forwarded by the owner): "Gør de manglende områder synlige i oversigten … så
    // oversigten fortsat har ni kort": tindinger, linjer og folder (marionet + nasolabial) and Fillox
    // Signatur (ansigtskonturering) are new pages. Was: lip filler, kindben, kæbelinje, hage, tear
    // trough, næsekorrektion.
    treatments: [
      "lip-filler",
      "kindben",
      "tear-trough",
      "hage",
      "kaebelinje",
      "naesekorrektion",
      "tindinger",
      "linjer-og-folder",
      "ansigtskonturering",
    ],
  },
  {
    // The hub and the page for the other areas (lip flip, gummy smile, mundvige, tyggemuskler,
    // platysma, svedtendens, tænderskæren), the owner's two pages. `name` ("Rynkebehandling") is the
    // /behandlinger section heading, its chip and the treatment pages' breadcrumb; `mobileName` is
    // the mobile menu's label and level-2 heading, "Botox", as the mega menu's column (megaMenu
    // below). Alberte 2026-11-26 (forwarded by the owner): "Brug botox som menupunkt i stedet for
    // Rynker"; the owner, told first that lægemiddelloven § 66 forbids advertising a prescription
    // medicine to the public, also on the clinic's own site: "gør hvad hun skriver og det samme
    // gælder botox". An accepted § 66 risk (README "Før lancering" → "Botox og markedsføring");
    // check:market rule 19 allows exactly these menu labels. TODO: copy review (2026-11-27, Alberte)
    slug: "rynkebehandling",
    name: "Rynkebehandling",
    mobileName: "Botox",
    treatments: ["rynkebehandling", "andre-behandlingsmuligheder"],
  },
  {
    slug: "hudforbedring",
    name: "Hudforbedring",
    treatments: ["skinbooster", "profhilo", "microneedling", "prf-hud", "signatur-ansigtsbehandling"],
  },
  {
    slug: "laser-harfjerning",
    name: "Laser hårfjerning",
    treatments: ["laser-harfjerning"],
  },
  {
    slug: "hartab",
    name: "Hårtab & hovedbund",
    treatments: ["prf-har", "polyphil-hair"],
  },
  {
    slug: "for-maend",
    name: "For mænd",
    // The men's wrinkle treatment is the rynkebehandling hub (there is no page of its own).
    treatments: ["rynkebehandling", "kaebelinje-for-maend", "hartab-for-maend", "laser-for-maend"],
  },
];

/**
 * Categories with a landing page of their own. Every link to such a category (the mega menu's
 * "For mænd" tag and "Alle fillers", the mobile menu's "Se alle …", a treatment page's breadcrumb)
 * goes to the page, which opens at the top. On /behandlinger a category listed in
 * content/pages/treatments.ts → treatmentsOverview.categoryPageLinks (fillers) keeps its section and
 * jump chip, with a link to its page; the others (For mænd) get a teaser with id="<slug>" instead,
 * so old /behandlinger#<slug> links still land somewhere sensible, and their chip opens the page.
 */
export const categoryPages: Partial<Record<TreatmentCategory["slug"], string>> = {
  // "Filler hos Fillox" (Alberte 2026-11-26): the mega menu's "Alle fillers", the mobile menu's "Se
  // alle fillers", the treatment pages' breadcrumb and the home bestseller row go there. The overview
  // keeps its fillers section (with a link to the page): content/pages/treatments.ts →
  // treatmentsOverview.categoryPageLinks.
  fillers: routes.fillers,
  "for-maend": routes.men,
};

/**
 * Link to a treatment category: its own page (categoryPages), else its section on the
 * /behandlinger overview (each category section has id="<slug>").
 */
export function treatmentCategoryHref(slug: TreatmentCategory["slug"]): string {
  return categoryPages[slug] ?? `${routes.treatments}#${slug}`;
}

const categoryHref = treatmentCategoryHref;

/**
 * Desktop "Behandlinger" mega menu (the owner's design v2, design-reference/mega-menu-v2.webp):
 * four short columns with the most booked treatments of a category, "For mænd" as a tag under
 * them, and a rose band panel for visitors who are unsure what to choose. The mobile menu lists every
 * category instead (treatmentCategories).
 */
export const megaMenu: MegaMenuContent = {
  columns: [
    {
      eyebrow: "Fillers",
      treatmentSlugs: ["lip-filler", "kindben", "kaebelinje", "tear-trough"],
      allLink: { label: "Alle fillers", href: categoryHref("fillers") },
    },
    {
      // The category's two pages. Links to the other page's sections (…#lip-flip) would need the
      // menu to take hrefs as well as treatment slugs (components/layout/menuData.ts).
      // "Botox" (was "Rynker", then "Rynkebehandling"). Alberte 2026-11-26 (forwarded by the owner):
      // "Brug botox som menupunkt i stedet for Rynker"; the owner: "gør hvad hun skriver og det
      // samme gælder botox", after being told that lægemiddelloven § 66 forbids advertising a
      // prescription medicine to the public, also on the clinic's own site. An accepted § 66 risk
      // (README "Før lancering"); check:market rule 19 allows this eyebrow and "Alle …" label and
      // the mobile menu's (treatmentCategories, content/layout.ts), and nothing else. The pages keep
      // their names ("Rynkebehandling", "Andre behandlinger"). TODO: copy review (2026-11-27, Alberte)
      eyebrow: "Botox",
      treatmentSlugs: ["rynkebehandling", "andre-behandlingsmuligheder"],
      allLink: { label: "Alle botoxbehandlinger", href: categoryHref("rynkebehandling") },
    },
    {
      eyebrow: "Hud",
      treatmentSlugs: ["skinbooster", "profhilo", "microneedling", "prf-hud"],
      allLink: { label: "Alle hud", href: categoryHref("hudforbedring") },
    },
    {
      eyebrow: "Laser & hår",
      treatmentSlugs: ["laser-harfjerning", "prf-har", "polyphil-hair"],
    },
  ],
  tag: {
    label: "For mænd",
    href: categoryHref("for-maend"),
    // TODO: copy review — "Rynkebehandling" in place of "Botox" (a prescription medicine).
    text: "Rynkebehandling, kæbelinje, hårtab og laser, tilpasset mænd",
  },
  promo: {
    eyebrow: "Gratis konsultation",
    title: "I tvivl om, hvad du skal vælge?",
    text: "Vores behandlere hjælper dig med at finde den rigtige behandling. Helt uforpligtende.",
    cta: { label: "Book konsultation", href: site.booking.href },
  },
};

/** Footer link rows (design 6a footer). */
export const footerNav: Link[] = [
  { label: "Behandlinger", href: routes.treatments },
  { label: "Priser", href: routes.prices },
  { label: "Om os", href: routes.about },
  { label: "Ny hos Fillox?", href: routes.newHere },
  { label: "Blog", href: routes.blog },
  { label: "Content creator", href: routes.creator },
  { label: "Ledige stillinger", href: routes.jobs },
];

export const legalNav: Link[] = [
  { label: "Handelsbetingelser", href: routes.terms },
  { label: "Privatlivspolitik", href: routes.privacy },
];

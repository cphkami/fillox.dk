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
    treatments: ["lip-filler", "kindben", "kaebelinje", "hage", "tear-trough", "naesekorrektion"],
  },
  {
    slug: "rynkebehandling",
    name: "Rynkebehandling",
    mobileName: "Rynkebehandling (botox)",
    treatments: ["botox", "lip-flip", "gummy-smile", "hyperhidrose", "traptox"],
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
    treatments: ["botox-for-maend", "kaebelinje-for-maend", "hartab-for-maend", "laser-for-maend"],
  },
];

/** A treatment category on the /behandlinger overview (each category section has id="<slug>"). */
const categoryHref = (slug: TreatmentCategory["slug"]) => `${routes.treatments}#${slug}`;

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
      eyebrow: "Rynker",
      treatmentSlugs: ["botox", "lip-flip", "hyperhidrose", "traptox"],
      allLink: { label: "Alle rynker", href: categoryHref("rynkebehandling") },
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
    text: "Botox, kæbelinje, hårtab og laser, tilpasset mænd",
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
  { label: "Blog", href: routes.blog },
  { label: "Content creator", href: routes.creator },
  { label: "Ledige stillinger", href: routes.jobs },
];

export const legalNav: Link[] = [
  { label: "Handelsbetingelser", href: routes.terms },
  { label: "Privatlivspolitik", href: routes.privacy },
];

import type { Link, NavItem, TreatmentCategory } from "./types";
import { routes } from "./routes";

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
 * Treatment categories. Order = mega-menu column order.
 * Desktop mega menu merges "laser-harfjerning" + "hartab" into one "Laser & hår"
 * column (see megaMenuColumns); the mobile menu lists all six categories.
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

/** Desktop mega-menu columns (design 6menu). */
export const megaMenuColumns: { title: string; categorySlugs: string[] }[] = [
  { title: "Fillers", categorySlugs: ["fillers"] },
  { title: "Rynkebehandling", categorySlugs: ["rynkebehandling"] },
  { title: "Hudforbedring", categorySlugs: ["hudforbedring"] },
  { title: "Laser & hår", categorySlugs: ["laser-harfjerning", "hartab"] },
  { title: "For mænd", categorySlugs: ["for-maend"] },
];

export const megaMenuPromo = {
  title: "Usikker på, hvad du skal vælge?",
  text: "Book en gratis konsultation.",
  link: { label: "Se alle behandlinger", href: routes.treatments } satisfies Link,
  // Shown as a wide, short crop (228 × 112px): eyes to lips.
  image: { src: "/images/hero/hero-1.jpg", alt: "", position: "50% 60%" },
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

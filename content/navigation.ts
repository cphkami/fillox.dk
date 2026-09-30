import type { Link, NavItem, TreatmentCategory } from "./types";

/** Main navigation (desktop header + mobile fullscreen menu). */
export const mainNav: NavItem[] = [
  { kind: "treatments", label: "Behandlinger", href: "/behandlinger" },
  { kind: "link", label: "Priser", href: "/priser" },
  { kind: "clinics", label: "Find klinik", href: "/klinikker" },
  {
    kind: "menu",
    label: "Om os",
    href: "/om-os",
    items: [
      { label: "Om Fillox", href: "/om-os" },
      { label: "Vores behandlere", href: "/om-os#behandlere" },
      { label: "Ledige stillinger", href: "/ledige-stillinger" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  /** Mobile menu shows Blog as a top-level row; desktop keeps it in the footer. */
  { kind: "link", label: "Blog", href: "/blog" },
];

/** Items hidden from the desktop header (still shown in the mobile menu). */
export const desktopHiddenNav = ["/blog"];

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
  link: { label: "Se alle behandlinger", href: "/behandlinger" } satisfies Link,
  image: { src: "/images/hero/hero-1.jpg", alt: "" },
};

/** Footer link rows (design 6a footer). */
export const footerNav: Link[] = [
  { label: "Behandlinger", href: "/behandlinger" },
  { label: "Priser", href: "/priser" },
  { label: "Om os", href: "/om-os" },
  { label: "Blog", href: "/blog" },
  { label: "Content creator", href: "/content-creator" },
  { label: "Ledige stillinger", href: "/ledige-stillinger" },
];

export const legalNav: Link[] = [
  { label: "Handelsbetingelser", href: "/handelsbetingelser" },
  { label: "Privatlivspolitik", href: "/privatlivspolitik" },
];

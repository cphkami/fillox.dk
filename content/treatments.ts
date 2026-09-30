import type { Treatment } from "./types";
import { treatmentCategories } from "./navigation";

/**
 * Every treatment. Slugs match content/navigation.ts categories.
 * `priceFrom` comes from the Priser page (design 6b) and the menus (6menu/mm3).
 * `detail` is filled for treatments designed in full (Botox 6bx, Lip filler 6c/mb);
 * the rest render the generic template from name/short/priceFrom.
 */
export const treatments: Treatment[] = [
  // Fillers
  { slug: "lip-filler", name: "Lip filler", categorySlug: "fillers", priceFrom: 999, short: "" },
  { slug: "kindben", name: "Kindben", categorySlug: "fillers", priceFrom: 1699, short: "" },
  { slug: "kaebelinje", name: "Kæbelinje", categorySlug: "fillers", priceFrom: 1699, short: "" },
  { slug: "hage", name: "Hage", categorySlug: "fillers", priceFrom: 1699, short: "" },
  { slug: "tear-trough", name: "Tear trough", categorySlug: "fillers", priceFrom: 1999, short: "" },
  { slug: "naesekorrektion", name: "Næsekorrektion", categorySlug: "fillers", priceFrom: 3999, short: "" },
  // Rynkebehandling
  { slug: "botox", name: "Botox", categorySlug: "rynkebehandling", priceFrom: 799, short: "" },
  { slug: "lip-flip", name: "Lip flip", categorySlug: "rynkebehandling", priceFrom: 799, short: "" },
  { slug: "gummy-smile", name: "Gummy smile", categorySlug: "rynkebehandling", priceFrom: 799, short: "" },
  { slug: "hyperhidrose", name: "Hyperhidrose", categorySlug: "rynkebehandling", priceFrom: 2499, short: "" },
  { slug: "traptox", name: "Traptox", categorySlug: "rynkebehandling", priceFrom: 2999, short: "" },
  // Hudforbedring
  { slug: "skinbooster", name: "Skinbooster", categorySlug: "hudforbedring", priceFrom: 999, short: "" },
  { slug: "profhilo", name: "Profhilo", categorySlug: "hudforbedring", priceFrom: 2499, short: "" },
  { slug: "microneedling", name: "Microneedling", categorySlug: "hudforbedring", priceFrom: 999, short: "" },
  { slug: "prf-hud", name: "PRF hud", categorySlug: "hudforbedring", priceFrom: 2499, short: "" },
  { slug: "signatur-ansigtsbehandling", name: "Signatur ansigtsbehandling", categorySlug: "hudforbedring", priceFrom: 999, short: "" },
  // Laser hårfjerning
  { slug: "laser-harfjerning", name: "Laser hårfjerning", categorySlug: "laser-harfjerning", priceFrom: 500, short: "" },
  // Hårtab & hovedbund
  { slug: "prf-har", name: "PRF hår", categorySlug: "hartab", priceFrom: 2499, short: "" },
  { slug: "polyphil-hair", name: "PolyPhil Hair", categorySlug: "hartab", priceFrom: 1800, short: "" },
  // For mænd
  { slug: "botox-for-maend", name: "Botox for mænd", categorySlug: "for-maend", priceFrom: 799, short: "" },
  { slug: "kaebelinje-for-maend", name: "Kæbelinje for mænd", categorySlug: "for-maend", priceFrom: 1699, short: "" },
  { slug: "hartab-for-maend", name: "Hårtab for mænd", categorySlug: "for-maend", priceFrom: 2499, short: "" },
  { slug: "laser-for-maend", name: "Laser for mænd", categorySlug: "for-maend", priceFrom: 500, short: "" },
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export function getCategory(slug: string) {
  return treatmentCategories.find((c) => c.slug === slug);
}

export function treatmentHref(slug: string): string {
  return `/behandlinger/${slug}`;
}

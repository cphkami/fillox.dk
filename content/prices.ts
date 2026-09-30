import type { ImageRef, Link, PriceValue } from "./types";
import { site } from "@/config/site";

/**
 * Priser page (design 6b desktop, mp mobile).
 *
 * Prices are numbers (render with formatPriceValue / formatPrice from lib).
 * The desktop cards render prices uppercase via CSS ("999 KR", "GRATIS"); the
 * data stores the natural case.
 */

export type PriceListRow = {
  label: string;
  /** Small secondary text after the label, e.g. "pr. område". */
  note?: string;
  price: PriceValue;
  /** Treatment the row belongs to (optional link target). */
  treatmentSlug?: string;
};

export type PriceCard = {
  /** Anchor id on /priser (#fillers) and chip target on mobile. */
  id: string;
  title: string; // "Fillers"
  /** Right-aligned card label (desktop), e.g. "HYALURONSYRE" (stored as shown; already uppercase). */
  eyebrow: string;
  /** Mobile jump-chip label, e.g. "Botox". */
  chipLabel: string;
  /** Treatment category this card maps to (content/navigation.ts), if any. */
  categorySlug?: string;
  rows: PriceListRow[];
};

const kr = (amount: number, treatmentSlug?: string): Pick<PriceListRow, "price" | "treatmentSlug"> => ({
  price: { kind: "amount", amount },
  ...(treatmentSlug ? { treatmentSlug } : {}),
});

const FREE: PriceValue = { kind: "free", label: "gratis" };

export const priceCards: PriceCard[] = [
  {
    id: "fillers",
    title: "Fillers",
    eyebrow: "HYALURONSYRE",
    chipLabel: "Fillers",
    categorySlug: "fillers",
    rows: [
      { label: "Lip filler · Revanesse 0,3 ml", ...kr(999, "lip-filler") },
      { label: "Lip filler · Revanesse 0,5 ml", ...kr(1199, "lip-filler") },
      { label: "Lip filler · Revanesse 0,7 ml", ...kr(1399, "lip-filler") },
      { label: "Lip filler · Revanesse 1,0 ml", ...kr(1599, "lip-filler") },
      { label: "Kindben / Kæbelinjer / Hage", note: "op til 1 ml", ...kr(1699) },
      { label: "Marionette / Nasolabiale linjer", note: "op til 1 ml", ...kr(1699) },
      { label: "Tear Trough", ...kr(1999, "tear-trough") },
      { label: "Tindinger", ...kr(2499) },
      { label: "Ansigtskonturering · 4 ml", ...kr(3999) },
      { label: "Næsekorrektion", note: "v. Dr. Tom", ...kr(3999, "naesekorrektion") },
      { label: "Opløsning af filler (Hyalase)", note: "pr. område", ...kr(899) },
    ],
  },
  {
    id: "rynkebehandling",
    title: "Rynkebehandling",
    eyebrow: "BOTOX",
    chipLabel: "Botox",
    categorySlug: "rynkebehandling",
    rows: [
      { label: "Pande / Bekymringsrynke / Kragetæer", note: "pr. område", ...kr(999, "botox") },
      { label: "Lip flip / Gummy smile / Bunny lines", note: "pr. område", ...kr(799) },
      { label: "Brynløft / Nose slimming / Rygerynker", note: "pr. område", ...kr(799, "botox") },
      { label: "2 områder", ...kr(1499, "botox") },
      { label: "3 områder", ...kr(1999, "botox") },
      { label: "4 områder", ...kr(2499, "botox") },
      { label: "Reduktion af kraftige tyggemuskler", ...kr(1699) },
      { label: "Hyperhidrose (overdreven sved)", ...kr(2499, "hyperhidrose") },
      { label: "Traptox", ...kr(2999, "traptox") },
    ],
  },
  {
    id: "hudforbedring",
    title: "Hudforbedring",
    eyebrow: "SKINBOOSTER M.M.",
    chipLabel: "Hud",
    categorySlug: "hudforbedring",
    rows: [
      { label: "Microneedling", ...kr(999, "microneedling") },
      { label: "Microneedling med NCTF 135 HA", ...kr(1699, "microneedling") },
      { label: "Ejal 40", ...kr(1499, "skinbooster") },
      { label: "Sunekos Performa", ...kr(1599, "skinbooster") },
      { label: "PolyPhil (classic / eye / med HA)", ...kr(1800) },
      { label: "Profhilo", ...kr(2499, "profhilo") },
      { label: "Profhilo Structura 2 ml", ...kr(3250, "profhilo") },
      { label: "PRF Hud", ...kr(2499, "prf-hud") },
      { label: "Signatur · Dr. Dennis Gross", note: "peeling, maske & LED", ...kr(999, "signatur-ansigtsbehandling") },
    ],
  },
  {
    id: "laser-harfjerning",
    title: "Laser hårfjerning",
    eyebrow: "ALLE HUDTYPER",
    chipLabel: "Laser",
    categorySlug: "laser-harfjerning",
    rows: [
      { label: "Overlæbe / Hage / Hals", ...kr(500, "laser-harfjerning") },
      { label: "Helt ansigt", ...kr(1000, "laser-harfjerning") },
      { label: "Armhuler", ...kr(600, "laser-harfjerning") },
      { label: "Hele arme (inkl. hænder)", ...kr(1200, "laser-harfjerning") },
      { label: "Bikinilinje", ...kr(700, "laser-harfjerning") },
      { label: "Brasil", ...kr(1100, "laser-harfjerning") },
      { label: "Hele ben (inkl. fødder)", ...kr(3000, "laser-harfjerning") },
      { label: "Hel krop (pakkepris)", ...kr(6000, "laser-harfjerning") },
    ],
  },
  {
    id: "hartab",
    title: "Hårtab & hovedbund",
    eyebrow: "PRF & POLYNUKLEOTIDER",
    chipLabel: "Hår",
    categorySlug: "hartab",
    rows: [
      { label: "PRF Hår · 1 behandling", ...kr(2499, "prf-har") },
      { label: "PRF Hår · 3 behandlinger", ...kr(5499, "prf-har") },
      { label: "PolyPhil Hair · 1 behandling", ...kr(1800, "polyphil-hair") },
      { label: "PolyPhil Hair · 4 behandlinger", ...kr(6299, "polyphil-hair") },
    ],
  },
  {
    id: "konsultation",
    title: "Konsultation & kontrol",
    eyebrow: "ALTID GRATIS",
    chipLabel: "Konsultation",
    rows: [
      { label: "Fillers konsultation", note: "30 min, v. sygeplejerske", price: FREE },
      { label: "Lægekonsultation før første botox", note: "lovpligtig, 15 min", price: FREE },
      { label: "Kontrol efter behandling", price: FREE },
      { label: "Specialist-tillæg (behandling v.\u00a0læge)", price: { kind: "on-request", label: "efter aftale" } },
    ],
  },
];

/** Page copy for /priser. */
export const pricesPage = {
  meta: {
    title: "Priser",
    description:
      "Se alle priser på fillers, botox, hudforbedring, laser hårfjerning og hårtab. Konsultation og kontrol er altid gratis.",
  },
  eyebrow: "Priser",
  /** H1: desktop breaks the line before `titleAccent` and colours it plum; mobile runs it on one line. */
  title: "Gennemsigtige",
  titleAccent: "priser",
  intro:
    "Alle priser er vejledende. Den endelige pris fastlægges altid ved din konsultation, og vi behandler kun, når det giver mening. Konsultation og kontrol er altid gratis.",
  introShort: "Alle priser er vejledende. Konsultation og kontrol er altid gratis.",
  /** Plum trust band under the hero (desktop). */
  trustChips: ["Gratis konsultation", "Kun læger & sygeplejersker", "Vagtlæge 24/7", "Finansiering mulig"],
  /** Accessible name of the mobile jump-chip row. */
  chipsLabel: "Hop til kategori",
  financing: {
    /** Anchor id (legacy /finansiering redirects to /priser#finansiering). */
    id: "finansiering",
    eyebrow: "Finansiering",
    title: "Del betalingen op i rater",
    text: "Spørg i klinikken eller ved booking, vi hjælper dig med en løsning, der passer.",
    textShort: "Spørg i klinikken eller vælg det ved booking.",
    cta: { label: "Book tid", href: site.booking.href } satisfies Link,
    image: {
      src: "/images/results/behandling-3.jpg",
      alt: "Fillox-logoet på væggen i klinikken",
      position: "50% 50%",
    } satisfies ImageRef,
  },
};

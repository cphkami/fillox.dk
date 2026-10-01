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

/**
 * Live: the Botox area packages are "Gældende for områderne: Pande, bekymringsrynke, kragetæer,
 * platysma bånd, nefertiti lift, gummy smile, lip flip, rygerynker, nedgående mundvige, nose
 * slimming, bunny lines & brynløft", i.e. the single areas listed above them, not the "Øvrige
 * Botox behandlinger" (tyggemuskler, hyperhidrose, Traptox) below. Also used on /behandlinger/botox.
 * Notes never wrap: keep them short enough for a 320px screen.
 */
export const BOTOX_PACKAGE_NOTE = "gælder områderne ovenfor";

/** Live: "Vælg mellem; Kindben, Hage, pre-jowl, nasolabial linjer & kæbelinjer". */
const AREAS_4ML = "kindben, hage, kæbelinjer m.fl.";

/**
 * The price list of the live fillox.dk/priser (fetched 2026-10-01): every priced row, in the
 * live order, in the design's card structure. The live sub-headings ("Andre fillerpriser (op til
 * 1 ml)", "Øvrige Botox behandlinger", "Ansigt", "Arme" …) have no place in a card, so their
 * rows follow each other in the same order, with the sub-heading's condition as a note where it
 * changes the price ("op til 1 ml", the area packages). The live "Mænd" and "Pakkepriser" laser
 * lists are cards of their own (a single laser card would be ~50 rows).
 *
 * Counts and their unit are joined by a no-break space ("1 behandling") so a long label
 * never ends a line on the bare number.
 *
 * Not shown, needs Fillox: Sunekos 1200, Sunekos Body and Sunekos Cell are listed live
 * without a price. The cancellation fees are not a price card: they are on /handelsbetingelser
 * (content/pages/legal.ts: 500 kr for a treatment, 250 kr for a consultation, cancelled less
 * than 24 hours before). Open question for Fillox: the live sources disagree on a no-show
 * (/priser: a flat 500 kr; handelsbetingelser: 100% of the booking, also for a cancellation
 * later than 6 hours before), and the /priser rule that only weekdays count (a Monday
 * appointment must be cancelled by the Friday before) is on neither new page.
 *
 * `treatmentSlug` links a row to its treatment page and gives that treatment its "fra" price
 * (content/treatments.ts reads the lowest tagged amount), so tag every row of a treatment.
 */
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
      { label: "Ansigtskonturering · 4 ml", note: AREAS_4ML, ...kr(3999) },
      { label: "Opløsning af filler (Hyalase)", note: "pr. område", ...kr(899) },
      { label: "Marionettelinjer", note: "op til 1 ml", ...kr(1699) },
      { label: "Nasolabiale linjer", note: "op til 1 ml", ...kr(1699) },
      { label: "Hage", note: "op til 1 ml", ...kr(1699, "hage") },
      { label: "Pre-jowls", note: "op til 1 ml", ...kr(1699) },
      { label: "Kæbelinjer", note: "op til 1 ml", ...kr(1699, "kaebelinje") },
      { label: "Kindben", note: "op til 1 ml", ...kr(1699, "kindben") },
      { label: "Tear Trough", note: "op til 1 ml", ...kr(1999, "tear-trough") },
      { label: "Tindinger", note: "op til 1 ml", ...kr(2499) },
      { label: "Næsekorrektion", note: "op til 1 ml, v. Dr. Tom", ...kr(3999, "naesekorrektion") },
    ],
  },
  {
    id: "rynkebehandling",
    title: "Rynkebehandling",
    eyebrow: "BOTOX",
    chipLabel: "Botox",
    categorySlug: "rynkebehandling",
    rows: [
      { label: "Pande", ...kr(999, "botox") },
      { label: "Bekymringsrynke", ...kr(999, "botox") },
      { label: "Kragetæer", ...kr(999, "botox") },
      { label: "Platysmabånd", ...kr(999, "botox") },
      { label: "Nefertiti lift", ...kr(999, "botox") },
      { label: "Gummy smile", ...kr(799, "gummy-smile") },
      { label: "Lip flip", ...kr(799, "lip-flip") },
      { label: "Rygerynker", ...kr(799, "botox") },
      { label: "Nedadgående mundvige", ...kr(799, "botox") },
      { label: "Nose slimming", ...kr(799, "botox") },
      { label: "Bunny lines", ...kr(799, "botox") },
      { label: "Brynløft", ...kr(799, "botox") },
      { label: "2 områder", note: BOTOX_PACKAGE_NOTE, ...kr(1499, "botox") },
      { label: "3 områder", note: BOTOX_PACKAGE_NOTE, ...kr(1999, "botox") },
      { label: "4 områder", note: BOTOX_PACKAGE_NOTE, ...kr(2499, "botox") },
      { label: "5 områder", note: BOTOX_PACKAGE_NOTE, ...kr(2999, "botox") },
      { label: "6 områder", note: BOTOX_PACKAGE_NOTE, ...kr(3499, "botox") },
      { label: "7 områder", note: BOTOX_PACKAGE_NOTE, ...kr(3999, "botox") },
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
      { label: "Profhilo · 1\u00a0behandling", ...kr(2499, "profhilo") },
      { label: "Profhilo · 2\u00a0behandlinger", note: "pakkepris", ...kr(4499, "profhilo") },
      { label: "Profhilo Structura 2\u00a0ml · 1\u00a0behandling", ...kr(3250, "profhilo") },
      { label: "Profhilo Structura 2\u00a0ml · 2\u00a0behandlinger", ...kr(5250, "profhilo") },
      { label: "Ejal 40 · 1\u00a0behandling", ...kr(1499, "skinbooster") },
      { label: "Ejal 40 · 3\u00a0behandlinger", ...kr(3199, "skinbooster") },
      { label: "Sunekos Performa · 1\u00a0behandling", ...kr(1599, "skinbooster") },
      { label: "Sunekos Performa · 3\u00a0behandlinger", ...kr(3999, "skinbooster") },
      {
        label: "Signatur · Dr. Dennis Gross",
        note: "peeling, maske & LED",
        ...kr(999, "signatur-ansigtsbehandling"),
      },
      { label: "PolyPhil eye · 1\u00a0behandling", ...kr(1800) },
      { label: "PolyPhil eye · 3\u00a0behandlinger", ...kr(4500) },
      { label: "PolyPhil classic · 1\u00a0behandling", ...kr(1800) },
      { label: "PolyPhil classic · 3\u00a0behandlinger", ...kr(4500) },
      { label: "PolyPhil med HA · 1\u00a0behandling", ...kr(1800) },
      { label: "PolyPhil med HA · 3\u00a0behandlinger", ...kr(4500) },
      { label: "Microneedling · 1\u00a0behandling", ...kr(999, "microneedling") },
      { label: "Microneedling · 3\u00a0behandlinger", ...kr(2499, "microneedling") },
      { label: "Microneedling med NCTF 135 HA · 1\u00a0behandling", ...kr(1699, "microneedling") },
      { label: "Microneedling med NCTF 135 HA · 3\u00a0behandlinger", ...kr(4249, "microneedling") },
      { label: "NCTF 135 HA injektion · 1\u00a0behandling", ...kr(1699) },
      { label: "NCTF 135 HA injektion · 3\u00a0behandlinger", ...kr(4249) },
      { label: "PRF Hud · 1\u00a0behandling", ...kr(2499, "prf-hud") },
      { label: "PRF Hud · 3\u00a0behandlinger", ...kr(5499, "prf-hud") },
    ],
  },
  {
    id: "laser-harfjerning",
    title: "Laser hårfjerning",
    eyebrow: "ALLE HUDTYPER",
    chipLabel: "Laser",
    categorySlug: "laser-harfjerning",
    rows: [
      // Ansigt
      { label: "Helt ansigt", ...kr(1000, "laser-harfjerning") },
      { label: "Overlæbe", ...kr(500, "laser-harfjerning") },
      { label: "Bakkenbarter", ...kr(500, "laser-harfjerning") },
      { label: "Kinder & kæbe", ...kr(500, "laser-harfjerning") },
      { label: "Hage", ...kr(500, "laser-harfjerning") },
      { label: "Hals", ...kr(500, "laser-harfjerning") },
      // Arme
      { label: "Armhuler", ...kr(600, "laser-harfjerning") },
      { label: "Hænder", ...kr(500, "laser-harfjerning") },
      { label: "Halve arme (inkl. hænder)", ...kr(750, "laser-harfjerning") },
      { label: "Hele arme (inkl. hænder)", ...kr(1200, "laser-harfjerning") },
      // Ben
      { label: "Fødder", ...kr(500, "laser-harfjerning") },
      { label: "Underben (inkl. knæ + fødder)", ...kr(2000, "laser-harfjerning") },
      { label: "Hele ben (inkl. fødder)", ...kr(3000, "laser-harfjerning") },
      // Ryg
      { label: "Lænd", ...kr(500, "laser-harfjerning") },
      { label: "Nakke (inkl. barbering)", ...kr(600, "laser-harfjerning") },
      { label: "Skuldre", ...kr(850, "laser-harfjerning") },
      { label: "Ryg (inkl. lænd)", ...kr(1200, "laser-harfjerning") },
      // Bikini
      { label: "Bikinilinje", ...kr(700, "laser-harfjerning") },
      { label: "Baller", ...kr(1000, "laser-harfjerning") },
      { label: "Brasil", ...kr(1100, "laser-harfjerning") },
      // Overkrop
      { label: "Navle og ned", ...kr(500, "laser-harfjerning") },
      { label: "Mellem bryster", ...kr(500, "laser-harfjerning") },
      { label: "Brystvorter", ...kr(500, "laser-harfjerning") },
      { label: "Bryst", ...kr(900, "laser-harfjerning") },
      { label: "Mave", ...kr(800, "laser-harfjerning") },
    ],
  },
  {
    // Live: the "Mænd" list under laser hårfjerning. No categorySlug: the Priser dropdown then shows
    // this card's own lowest row ("fra 1.000 kr"), not the lowest laser price. Titled as the
    // combined-areas list it is, so it does not read as "Laser for mænd fra 1.000 kr" next to the
    // laser-for-maend page's "fra 500 kr" (single areas). The rows are that page's price list.
    id: "laser-maend",
    title: "Laserpakker for mænd",
    eyebrow: "KOMBINEREDE OMRÅDER",
    chipLabel: "Laser mænd",
    rows: [
      { label: "Ryg / skuldre / arme", ...kr(3400, "laser-for-maend") },
      { label: "Mave / bryst", ...kr(1500, "laser-for-maend") },
      { label: "Ryg / skuldre", ...kr(2000, "laser-for-maend") },
      { label: "Nakke / skæglinje", ...kr(1000, "laser-for-maend") },
      { label: "Ryg / nakke", ...kr(1800, "laser-for-maend") },
      { label: "Ryg / skulder / nakke", ...kr(2700, "laser-for-maend") },
      { label: "Ryg / skuldre / bryst", ...kr(3100, "laser-for-maend") },
      { label: "Ryg / skuldre / mave / bryst", ...kr(3500, "laser-for-maend") },
    ],
  },
  {
    // Live: "Pakkepriser på permanent hårfjerning". No categorySlug, as "laser-maend" ("fra 1.300 kr" in the dropdown).
    id: "laser-pakker",
    title: "Laserpakker",
    eyebrow: "FLERE OMRÅDER",
    chipLabel: "Laserpakker",
    rows: [
      { label: "Bikinilinje + armhuler", ...kr(1300, "laser-harfjerning") },
      { label: "Brazilian + armhuler", ...kr(1700, "laser-harfjerning") },
      { label: "Underben + armhuler", ...kr(2500, "laser-harfjerning") },
      { label: "Underben + Brazilian", ...kr(3100, "laser-harfjerning") },
      { label: "Underben + armhuler + Brazilian", ...kr(3700, "laser-harfjerning") },
      { label: "Underben + bikinilinje", ...kr(2600, "laser-harfjerning") },
      { label: "Hele ben + bikinilinje", ...kr(3500, "laser-harfjerning") },
      { label: "Hele ben + armhuler", ...kr(3600, "laser-harfjerning") },
      { label: "Hele ben + Brazilian", ...kr(4100, "laser-harfjerning") },
      { label: "Hele ben + armhuler + Brazilian", ...kr(4700, "laser-harfjerning") },
      { label: "Hele ben + bikinilinje + armhuler", ...kr(4100, "laser-harfjerning") },
      { label: "Mave + bryst", ...kr(1700, "laser-harfjerning") },
      { label: "Ryg + skuldre", ...kr(2750, "laser-harfjerning") },
      { label: "Ryg + skuldre + mave + bryst", ...kr(3900, "laser-harfjerning") },
      { label: "Hel krop", ...kr(6000, "laser-harfjerning") },
    ],
  },
  {
    id: "hartab",
    title: "Hårtab & hovedbund",
    eyebrow: "PRF & POLYNUKLEOTIDER",
    chipLabel: "Hår",
    categorySlug: "hartab",
    rows: [
      { label: "PRF Hår · 1\u00a0behandling", ...kr(2499, "prf-har") },
      { label: "PRF Hår · 3\u00a0behandlinger", ...kr(5499, "prf-har") },
      { label: "PolyPhil Hair · 1\u00a0behandling", ...kr(1800, "polyphil-hair") },
      { label: "PolyPhil Hair · 4\u00a0behandlinger", ...kr(6299, "polyphil-hair") },
    ],
  },
  {
    // Labels are referenced by content/pages/treatments.ts (prices.extraRows).
    id: "konsultation",
    title: "Konsultation & kontrol",
    eyebrow: "ALTID GRATIS",
    chipLabel: "Konsultation",
    rows: [
      { label: "Fillers konsultation", note: "30 min, v. kosmetisk sygeplejerske", price: FREE },
      {
        label: "Specialist-tillæg (behandling v.\u00a0læge)",
        note: "valgfrit",
        price: { kind: "on-request", label: "efter aftale" },
      },
      { label: "Lægekonsultation før første botox", note: "lovpligtig, 15 min", price: FREE },
      { label: "Kontrol efter behandling", note: "valgfri, ca. 14 dage efter", price: FREE },
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

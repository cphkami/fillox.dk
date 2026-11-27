import type { ImageRef, Link, PriceValue } from "./types";
import { site } from "@/config/site";
import { photos } from "./photos";

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
  /**
   * Section or item id on that treatment's page when the row is about one part of it, e.g. "lip-flip"
   * → /behandlinger/andre-behandlingsmuligheder#lip-flip (npm run check:market checks it exists).
   */
  treatmentAnchor?: string;
};

export type PriceCard = {
  /** Anchor id on /priser (#fillers) and chip target on mobile. */
  id: string;
  title: string; // "Fillers"
  /** Right-aligned card label (desktop), e.g. "HYALURONSYRE" (stored as shown; already uppercase). */
  eyebrow: string;
  /** Mobile jump-chip label, e.g. "Fillers". */
  chipLabel: string;
  /** Treatment category this card maps to (content/navigation.ts), if any. */
  categorySlug?: string;
  rows: PriceListRow[];
};

const kr = (
  amount: number,
  treatmentSlug?: string,
  treatmentAnchor?: string,
): Pick<PriceListRow, "price" | "treatmentSlug" | "treatmentAnchor"> => ({
  price: { kind: "amount", amount },
  ...(treatmentSlug ? { treatmentSlug } : {}),
  ...(treatmentAnchor ? { treatmentAnchor } : {}),
});

/**
 * The two pages of the Rynkebehandling card (content/treatments.ts): the hub, and the page for the
 * other areas, whose sections the rows point to (lip flip, gummy smile, mundvige, tyggemuskler,
 * platysma, svedtendens). The hub's "fra" price is the lowest row tagged with it.
 */
const WRINKLES = "rynkebehandling";
const OTHER = "andre-behandlingsmuligheder";

const FREE: PriceValue = { kind: "free", label: "gratis" };

/**
 * Live: the Botox area packages are "Gældende for områderne: Pande, bekymringsrynke, kragetæer,
 * platysma bånd, nefertiti lift, gummy smile, lip flip, rygerynker, nedgående mundvige, nose
 * slimming, bunny lines & brynløft", i.e. the single areas listed above them, not the "Øvrige
 * Botox behandlinger" (tyggemuskler, hyperhidrose, Traptox) below.
 * Notes never wrap next to their label (from 768px); on phones a note has its own line, so keep it
 * short enough for a 320px screen (it wraps there only when the user enlarges text spacing).
 */
export const BOTOX_PACKAGE_NOTE = "gælder områderne ovenfor";

/** Live: "Vælg mellem; Kindben, Hage, pre-jowl, nasolabial linjer & kæbelinjer". */
const AREAS_4ML = "kindben, hage, kæbelinjer m.fl.";

/**
 * The price list of the live fillox.dk/priser (fetched 2026-10-01; every amount re-checked
 * against the live list on 2026-11-24, after it changed on 2026-11-17: Opløsning af filler 899 → 999,
 * Microneedling 999 / 2.499 → 1.200 / 3.000): every priced row, in the live order, in the
 * design's card structure. The live sub-headings ("Andre fillerpriser (op til
 * 1 ml)", "Øvrige Botox behandlinger", "Ansigt", "Arme" …) have no place in a card, so their
 * rows follow each other in the same order, with the sub-heading's condition as a note where it
 * changes the price ("op til 1 ml", the area packages). The live "Mænd" and "Pakkepriser" laser
 * lists are cards of their own (a single laser card would be ~50 rows); since 2026-11-26 the "Mænd"
 * list is "Laserpakker, overkrop", for everyone, and "Laserpakker" has three rows less (see there).
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
      // "Revanesse®" with the mark, as in Alberte's texts (2026-11-27; live "Revanesse"). Looked up by
      // these labels in content/treatments.ts (lip filler's price list) and content/blog.ts
      // (lipFillerPrice). TODO: copy review (2026-11-27, Alberte)
      { label: "Lip filler · Revanesse® 0,3 ml", ...kr(999, "lip-filler") },
      { label: "Lip filler · Revanesse® 0,5 ml", ...kr(1199, "lip-filler") },
      { label: "Lip filler · Revanesse® 0,7 ml", ...kr(1399, "lip-filler") },
      { label: "Lip filler · Revanesse® 1,0 ml", ...kr(1599, "lip-filler") },
      // Tagged 2026-11-26 with the new filler pages (Alberte, forwarded by the owner: tindinger,
      // "Linjer og folder" for marionet- and nasolabiale linjer, "Fillox Signatur" for
      // ansigtskonturering), which take their "fra" price and price list from these rows. No amount
      // changed. Kindben, kæbelinje and hage still list the 4 ml row by its label
      // (content/pages/treatments.ts → priceRowLabels).
      { label: "Ansigtskonturering · 4 ml", note: AREAS_4ML, ...kr(3999, "ansigtskonturering") },
      // Without the product name (live: "Opløsning af filler (Hyalase)"): Hyalase is a prescription
      // medicine (hyaluronidase), and the owner's rule for Botox applies (owner 2026-11-26: "ret det
      // hele som du har skrevet til mig. alt fra punkt 1-9"; lægemiddelloven § 66,
      // https://www.retsinformation.dk/eli/lta/2023/339). Looked up by this label in
      // content/treatments.ts, content/blog.ts and content/pages/treatments.ts. TODO: copy review
      { label: "Opløsning af filler", note: "pr. område", ...kr(999) },
      // Alberte's spelling (2026-11-26: "marionetlinjer og nasolabiale folder"; live "Marionettelinjer",
      // "Nasolabiale linjer"; Retskrivningsordbogen: marionet). Labels only, the amounts are unchanged;
      // Gecko's treatment names may need the same change. TODO: copy review (2026-11-27, Alberte)
      { label: "Marionetlinjer", note: "op til 1 ml", ...kr(1699, "linjer-og-folder") },
      { label: "Nasolabiale folder", note: "op til 1 ml", ...kr(1699, "linjer-og-folder") },
      { label: "Hage", note: "op til 1 ml", ...kr(1699, "hage") },
      { label: "Pre-jowls", note: "op til 1 ml", ...kr(1699) },
      { label: "Kæbelinjer", note: "op til 1 ml", ...kr(1699, "kaebelinje") },
      { label: "Kindben", note: "op til 1 ml", ...kr(1699, "kindben") },
      { label: "Tear Trough", note: "op til 1 ml", ...kr(1999, "tear-trough") },
      { label: "Tindinger", note: "op til 1 ml", ...kr(2499, "tindinger") },
      { label: "Næsekorrektion", note: "op til 1 ml, v. Dr. Tom", ...kr(3999, "naesekorrektion") },
    ],
  },
  {
    id: "rynkebehandling",
    title: "Rynkebehandling",
    // TODO: copy review — no product name (Botox is a prescription medicine; 2026-10). The eyebrow
    // is the agency's term from the hub ("Mimiske rynker"), not "RYNKEBEHANDLING", which would
    // repeat the title right next to it; the chip is the card's title.
    eyebrow: "MIMISKE RYNKER M.M.",
    chipLabel: "Rynkebehandling",
    categorySlug: "rynkebehandling",
    rows: [
      // Links (2026-10, the owner's new pages): wrinkle areas and the area packages → the hub; the
      // areas the other page covers → its section. Traptox has no link: neither page mentions it
      // (TODO: Fillox decides whether it belongs on a page; the old /behandlinger/traptox URL
      // redirects to the other page, content/redirects.ts).
      // Nefertiti lift treats the platysma along the jaw, so it points to "Platysma".
      { label: "Pande", ...kr(999, WRINKLES) },
      { label: "Bekymringsrynke", ...kr(999, WRINKLES) },
      { label: "Kragetæer", ...kr(999, WRINKLES) },
      { label: "Platysmabånd", ...kr(999, OTHER, "platysma") },
      { label: "Nefertiti lift", ...kr(999, OTHER, "platysma") },
      { label: "Gummy smile", ...kr(799, OTHER, "gummy-smile") },
      { label: "Lip flip", ...kr(799, OTHER, "lip-flip") },
      { label: "Rygerynker", ...kr(799, WRINKLES) },
      { label: "Nedadgående mundvige", ...kr(799, OTHER, "nedadgaaende-mundvige") },
      { label: "Nose slimming", ...kr(799, WRINKLES) },
      { label: "Bunny lines", ...kr(799, WRINKLES) },
      { label: "Brynløft", ...kr(799, WRINKLES) },
      { label: "2 områder", note: BOTOX_PACKAGE_NOTE, ...kr(1499, WRINKLES) },
      { label: "3 områder", note: BOTOX_PACKAGE_NOTE, ...kr(1999, WRINKLES) },
      { label: "4 områder", note: BOTOX_PACKAGE_NOTE, ...kr(2499, WRINKLES) },
      { label: "5 områder", note: BOTOX_PACKAGE_NOTE, ...kr(2999, WRINKLES) },
      { label: "6 områder", note: BOTOX_PACKAGE_NOTE, ...kr(3499, WRINKLES) },
      { label: "7 områder", note: BOTOX_PACKAGE_NOTE, ...kr(3999, WRINKLES) },
      { label: "Reduktion af kraftige tyggemuskler", ...kr(1699, OTHER, "tyggemuskler") },
      { label: "Hyperhidrose (overdreven sved)", ...kr(2499, OTHER, "svedtendens") },
      { label: "Traptox", ...kr(2999) },
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
      { label: "Ejal40 · 1\u00a0behandling", ...kr(1499, "skinbooster") },
      { label: "Ejal40 · 3\u00a0behandlinger", ...kr(3199, "skinbooster") },
      { label: "Sunekos Performa · 1\u00a0behandling", ...kr(1599, "skinbooster") },
      { label: "Sunekos Performa · 3\u00a0behandlinger", ...kr(3999, "skinbooster") },
      {
        label: "Signatur · Dr. Dennis Gross",
        note: "peeling, maske & LED",
        ...kr(999, "signatur-ansigtsbehandling"),
      },
      // The polynukleotider of the skinbooster page (Alberte 2026-11-26, forwarded by the owner:
      // "Ejal40, Sunekos og polynukleotider" … "Tilbyder til ansigt, urner øjnen og hår"; the scalp
      // is PolyPhil Hair, on the "Hårtab & hovedbund" card): tagged 2026-11-26, so the page lists
      // their prices and /priser links them there. The skinbooster "fra" price stays Ejal40's
      // (1.499 kr < 1.800 kr). No amount changed. TODO: copy review (2026-11-26, Alberte): confirm
      // that these rows are the polynukleotider she means.
      { label: "PolyPhil eye · 1\u00a0behandling", ...kr(1800, "skinbooster") },
      { label: "PolyPhil eye · 3\u00a0behandlinger", ...kr(4500, "skinbooster") },
      { label: "PolyPhil classic · 1\u00a0behandling", ...kr(1800, "skinbooster") },
      { label: "PolyPhil classic · 3\u00a0behandlinger", ...kr(4500, "skinbooster") },
      { label: "PolyPhil med HA · 1\u00a0behandling", ...kr(1800, "skinbooster") },
      { label: "PolyPhil med HA · 3\u00a0behandlinger", ...kr(4500, "skinbooster") },
      { label: "Microneedling · 1\u00a0behandling", ...kr(1200, "microneedling") },
      { label: "Microneedling · 3\u00a0behandlinger", ...kr(3000, "microneedling") },
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
    // Live: the "Mænd" list under laser hårfjerning (same rows and amounts). Since 2026-11-26 a
    // package card for everyone: the live "Mænd" packages were cheaper than the general packages for
    // the same areas (Mave / bryst 1.500 vs 1.700 kr, Ryg / skuldre 2.000 vs 2.750, Ryg / skuldre /
    // mave / bryst 3.500 vs 3.900), and the general ones cost more than their single areas added
    // up (Ryg inkl. lænd 1.200 + Skuldre 850 = 2.050 kr). The owner (2026-11-26, on that point: "ret
    // det med priser osv osv.. det ikke mening"). Done as: one price per combination for everyone
    // (the lower one, which is also below its single areas added up), no amount changed or invented,
    // no price tied to gender. Open for Fillox (README): three rows here still cost more than their
    // single areas added up, if "Ryg" is "Ryg (inkl. lænd)" and "arme" "Hele arme": Ryg / skuldre /
    // arme 3.400 (1.200 + 850 + 1.200 = 3.250), Ryg / skulder / nakke 2.700 (1.200 + 850 + 600 =
    // 2.650), Ryg / skuldre / bryst 3.100 (1.200 + 850 + 900 = 2.950). Ligestillingsloven (LBK nr. 5 af
    // 06/01/2025, https://www.retsinformation.dk/eli/lta/2025/5) § 1 a, nr. 2 (anyone who provides
    // services available to the public) and § 2 (no direct or indirect discrimination on grounds
    // of sex); it implements Council Directive 2004/113/EC (https://eur-lex.europa.eu/eli/dir/2004/113/oj).
    // So: no "mænd" in the title, chip or id (was "Laserpakker for mænd", "Laser mænd",
    // "laser-maend"), and the rows link to laser hårfjerning (was laser-for-maend), as the
    // "Laserpakker" rows do. The laser-for-maend page and /behandlinger/for-maend show this card's
    // rows (content/treatments.ts, content/pages/men.ts), never as prices for men.
    // No categorySlug: the Priser dropdown then shows this card's own lowest row ("fra 1.000 kr"),
    // not the lowest laser price. TODO: copy review (title and chip)
    id: "laser-overkrop",
    title: "Laserpakker, overkrop",
    eyebrow: "KOMBINEREDE OMRÅDER",
    chipLabel: "Laser overkrop",
    rows: [
      { label: "Ryg / skuldre / arme", ...kr(3400, "laser-harfjerning") },
      { label: "Mave / bryst", ...kr(1500, "laser-harfjerning") },
      { label: "Ryg / skuldre", ...kr(2000, "laser-harfjerning") },
      { label: "Nakke / skæglinje", ...kr(1000, "laser-harfjerning") },
      { label: "Ryg / nakke", ...kr(1800, "laser-harfjerning") },
      { label: "Ryg / skulder / nakke", ...kr(2700, "laser-harfjerning") },
      { label: "Ryg / skuldre / bryst", ...kr(3100, "laser-harfjerning") },
      { label: "Ryg / skuldre / mave / bryst", ...kr(3500, "laser-harfjerning") },
    ],
  },
  {
    // Live: "Pakkepriser på permanent hårfjerning". No categorySlug, as "laser-overkrop" ("fra 1.300 kr" in the dropdown).
    // Without the live "Mave + bryst" 1.700, "Ryg + skuldre" 2.750 and "Ryg + skuldre + mave + bryst"
    // 3.900 kr (2026-11-26): the same combinations are on "Laserpakker, overkrop" at 1.500, 2.000
    // and 3.500 kr, one price for everyone (see that card).
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
      // Live: "Lægekonsultation før første botox". "rynkebehandling" in place of the product name, as on
      // the rest of the site (owner 2026-11-26: "ret det hele … alt fra punkt 1-9"; lægemiddelloven
      // § 66, https://www.retsinformation.dk/eli/lta/2023/339). TODO: copy review
      { label: "Lægekonsultation før første rynkebehandling", note: "lovpligtig, 15 min", price: FREE },
      { label: "Kontrol efter behandling", note: "valgfri, ca. 14 dage efter", price: FREE },
    ],
  },
];

/** Page copy for /priser. */
export const pricesPage = {
  meta: {
    title: "Priser",
    // TODO: copy review — "rynkebehandling" in place of "botox" (a prescription medicine; 2026-10).
    description:
      "Se alle priser på fillers, rynkebehandling, hudforbedring, laser hårfjerning og hårtab. Konsultation og kontrol er altid gratis.",
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
  /**
   * Hidden text after a row's link when another card has a link with the same label ("Hage" on
   * Fillers and on Laser hårfjerning), so the two read "Hage (fillers)" and "Hage (laser
   * hårfjerning)" in a screen reader's link list. TODO: copy review (not visible)
   */
  rowLinkContext: (cardTitle: string) => ` (${cardTitle.toLocaleLowerCase(site.locale)})`,
  financing: {
    /** Anchor id (legacy /finansiering redirects to /priser#finansiering). */
    id: "finansiering",
    eyebrow: "Finansiering",
    title: "Del betalingen op i rater",
    text: "Spørg i klinikken eller ved booking, vi hjælper dig med en løsning, der passer.",
    textShort: "Spørg i klinikken eller vælg det ved booking.",
    cta: { label: "Book tid", href: site.booking.href } satisfies Link,
    // A practitioner reading a leaflet (content/photos.ts; hidden below 768px).
    // TODO: copy review (image choice + alt text)
    image: photos.behandlerFolder satisfies ImageRef,
  },
};

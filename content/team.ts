import type { ImageRef, PriceValue, TeamCardOnlyMember, TeamMember, TeamOffer, TeamRosterMember } from "./types";
import { openClinics } from "./clinics";
import { routes } from "./routes";
import { priceCards } from "./prices";
import { getTreatment } from "./treatments";
import { practitionerBookingHref } from "@/lib/booking";
import { formatList } from "@/lib/format";

/**
 * The team in display order (home team grid, /om-os, /behandlere): Dr. Tom first (fagligt
 * ansvarlig læge), then the others. Every grid shows them as equal cards (the owner, 2026-10-03:
 * "alle ved siden af hinanden i 2 rækker, 3 i hver række"). They are six, so the 3-column grids
 * are two full rows and the 2-column ones three (a short last row would be centred,
 * components/practitioner/teamGrid.ts); no member is `featured` any more.
 *
 * Who is on the team (the owner, 2026-11-25):
 * - Maria and Kubra have left Fillox ("Maria er ikke længere i Fillox … hun er ude", "Kubra er
 *   også ude"): their entries, photos and profiles are gone, /behandlere/maria and
 *   /behandlere/kubra redirect to the team section (content/redirects.ts), and the reviews that
 *   named Maria are left out (content/reviews.ts; no review named Kubra).
 * - Simone and Frederikke are new ("vi har fået nye profiler, Simone & Frederikke & Tommy-
 *   afventer deres billeder. men så ved du at der skal være placeholders"; "Tommy = Tom", who is
 *   already here). All that is known about them is the first name, the title and the clinics, and
 *   that is all their entries say: no surname, bio, quote, education, treatments or reviews — do
 *   NOT invent any. They are card-only members (content/types.ts → TeamCardOnlyMember): a card in
 *   the three team grids with the placeholder in the photo's slot, no profile page, no link. See
 *   "A new member" at the end of this comment for what to add when photos and texts arrive.
 * - Titles ("tom er self læge mm men de andre skriver vi bare kosmetiske sygeplejerske"): Dr. Tom
 *   is the doctor, and more than that ("tror også hans titel er lidt mere end bare læge": æstetisk
 *   læge, grundlægger, daglig leder, fagligt ansvarlig; sources at his entry); everyone else is `nurse` below (title "Kosmetisk sygeplejerske", role
 *   "Sygeplejerske"). That also answered Alberte's profession, which the live site never gave.
 * - Clinics ("Frederikke = Østerbro / Simone = city2 og Amager / Mike = frb og Amager / Annika =
 *   Østerbro og city2 / Alberte = FRB"): `worksAt` below → `clinicSlugs`, in the owner's order.
 *   It is the ONLY source of where someone works: every text that names a practitioner's clinic
 *   is built from it, never written by hand (clinicNames, full names: the booking band and the new
 *   members' card sentence; clinicShortList, short names as in the design: the "Arbejder i"
 *   fact). Dr. Tom works in every clinic ("Tom er på alle klinikker"): the texts say "alle vores
 *   klinikker" / "Alle klinikker" for him.
 *
 * Only Alberte has a full profile design (6alb / ma); the other profiles follow her template
 * (intro, facts, "Sådan arbejder jeg", offers, reviews, booking band) with their own facts.
 * Credentials that are not documented are left out on purpose — do not invent them.
 *
 * Sources (fetched 2026-10-03): the "Ansatte" pop-ups on https://fillox.dk/om-os/ (bio and a
 * personal quote per practitioner; "Fagansvarlig kompetence": Tom Haugland), the price list
 * (https://fillox.dk/priser/: "Næsekorrektion — Udføres af Dr. Tom", "Specialist tillæg —
 * Behandling udført af læge — Efter aftale"), the verified Trustpilot reviews in
 * content/reviews.ts and, for titles and clinics, the owner (above). No live treatment page says
 * who performs it (only the price list does, for næsekorrektion).
 * - Bios are lightly adapted; `quote` is a verbatim excerpt of the practitioner's own quote
 *   (whole sentences). "Sådan arbejder jeg" cards (first person) only rephrase that quote
 *   lightly. Where a card says more than the quote, the profile speaks in the third person
 *   ("Sådan arbejder Tom"): Tom has no quote, so his cards rephrase Fillox's own "Hvorfor vælge
 *   Fillox" on /om-os, which he answers for as fagligt ansvarlig læge.
 * - Offers are what each one is documented to perform: Tom his specialty on /om-os
 *   ("ansigtskonturering samt næse- og hagekorrektioner"; /om-os adds "og trådløft", which is not
 *   offered any more (content/redirects.ts), so his texts leave it out too); Annika and Mike their
 *   reviews (Annika: lip filler, Botox, fillers, skinbooster/Sunekos; Mike: lip filler, Botox,
 *   fillers incl. hage); Alberte her profile's skin treatments, kept on the owner's answer (asked
 *   about the treatments on her profile: "ved ikke tjek hvad vi har skrevet tidligere, nok det
 *   hele", 2026-11-25), the injectables her reviews name (lip filler: Qlr, Lisette Nielsen,
 *   Jessica; filler: Jh, who names no area) and rynkebehandling (the owner, 2026-11-25: "ja hun
 *   laver også rynkebehandling"). Names, short texts and prices come
 *   from content/treatments.ts and the price list (content/prices.ts), so they never drift from
 *   /priser; the wrinkle card is `wrinkleOffer` on all three profiles (never the product name).
 * - An offer's `treatmentSlug` also makes treatment pages without a practitioner of their own
 *   pick the first member who offers it as "Din behandler" (components/treatment/treatmentView.ts;
 *   a treatment nobody offers shows no practitioner block). So only treatments whose page already
 *   has its practitioner (lip filler → Annika, set on the page itself (content/treatments.ts →
 *   practitionerSlug; the owner, 2026-11-25: "ok"), so Alberte's lip filler offer, the first in
 *   team order, does not take it over; næsekorrektion → Tom; skinbooster and Alberte's skin offers →
 *   Alberte, who comes first; the rynkebehandling hub is a long-form page and shows no
 *   practitioner, content/types.ts, so the nurses' wrinkle offers pick nobody) carry one; Tom's
 *   chin and contouring offers and the nurses' "Fillers i ansigtet" are unlinked, so kindben,
 *   kæbelinje and hage keep their pages as they are. A card-only member has no offers, so no
 *   treatment page can pick one.
 * - `experience` only where it is documented: Tom (education and roles on /om-os, and "Annika
 *   er uddannet … i Fillox af Dr. Tom"). The others have no dated education on the live site.
 *
 * Customer reviews are not kept here: every profile shows the verified Trustpilot reviews that
 * name the practitioner (content/reviews.ts → reviewSets.practitioners), filled up with general
 * reviews; a profile without a review of its own would show none. `profile.reviews` is
 * deprecated and ignored.
 *
 * Card links: every member with a profile has `profile.offers`, so their cards say "Se hvad X
 * tilbyder". A card-only member's card is not a link.
 *
 * Photos (the owner, 2026-11-25: new portraits of Tom, Alberte, Annika and Mike, "fjern de
 * nuværende billeder"): public/images/team/<slug>-2026.jpg, re-encoded from the clinic's Drive
 * originals (sRGB, no metadata, never upscaled; new names so no CDN serves the old files; the
 * originals are no larger). They replaced their mood copies (public/images/fillox/
 * behandler-portraet-1.jpg = Alberte, -2.jpg = Annika, tom-klinik.jpg, mike-klinik.jpg), so each
 * photo is now only a portrait (content/photos.ts → People).
 * Each has a link-preview crop (`share`, og-<file>.jpg, ≈ 1.91 : 1 cut at the face) for the
 * profile's og:image. Nobody else in the clinic's photos is identified (content/photos.ts): a
 * photo of someone else is never a stand-in for a member whose photo has not arrived.
 *
 * Image crops: every slot frames the face from the face table at the bottom (framedPortrait), so
 * faces sit on one eye line and at one size: `image` (the default crop: avatars, the men's page
 * cards) and `crops.about` are the 4:5 team-card crop (teamSlots.portrait); the components ask for
 * the squarer one (teamSlots.square), the profile row (teamSlots.row), the "Din behandler" crops on
 * treatment pages and the profile hero's own. The design's stored crops (s6alb-hero, s6bx-annika)
 * were for the old photos and are gone.
 *
 * A new member (README → "Før lancering" → "Nye behandlere" has the same steps in Danish):
 * 1. Photo: put the file in public/images/team/ (a portrait, about 4:5 or squarer, sRGB, metadata
 *    stripped, at least 1000px wide; crop a landscape original first).
 * 2. Set `image` (src, alt "<Navn>, kosmetisk sygeplejerske hos Fillox", width, height) and add a
 *    row to `faces` (how to measure is described there). The cards then show the photo in place
 *    of the placeholder; the member is still card-only (no page, no link).
 * 3. When the texts arrive: add `profile` (intro, facts with worksInFact, offers, booking band),
 *    `link`, `bookingHref`, `bio` / `bioShort` / `quote` and `image.share` (og-<file>.jpg), as on
 *    the entries above. That creates /behandlere/<slug>, puts it in the sitemap and turns the
 *    cards into links. `npm run check:market` (rule 16) fails on a half-finished entry.
 */

const profileHref = (slug: string) => `${routes.practitioners}/${slug}`;
/** Booking link that preselects a practitioner: /booking?behandler=<slug> (lib/booking.ts). */
const bookWith = practitionerBookingHref;

/**
 * Where each practitioner works: content/clinics.ts slugs in the owner's order (2026-11-25:
 * "Frederikke = Østerbro / Simone = city2 og Amager / Mike = frb og Amager / Annika = Østerbro og
 * city2 / Alberte = FRB"). Each member's `clinicSlugs` is its row, and every text that names a
 * practitioner's clinic is built from `clinicSlugs` (clinicNames, clinicShortList), so a change
 * here changes them all.
 */
const worksAt = {
  // The owner, 2026-11-25: "Tom er på alle klinikker" — every open clinic, so a new clinic includes
  // him too.
  tom: openClinics.map((clinic) => clinic.slug),
  alberte: ["frederiksberg"],
  annika: ["osterbro", "city2"],
  mike: ["frederiksberg", "amager-centret"],
  simone: ["city2", "amager-centret"],
  frederikke: ["osterbro"],
} satisfies Record<string, string[]>;

/**
 * Members whose clinics are not known, so they have no `clinicSlugs` and no text about where they
 * work. Everyone else must have at least one clinic (npm run check:market, rule 17).
 */
// Empty since the owner answered for Dr. Tom (2026-11-25: "Tom er på alle klinikker").
export const clinicsUnknown: readonly string[] = [];

/** An open clinic (content/clinics.ts). Throws on an unknown or closed clinic. */
function openClinic(slug: string) {
  const clinic = openClinics.find((c) => c.slug === slug);
  if (!clinic) throw new Error(`team: no open clinic "${slug}" (content/clinics.ts)`);
  return clinic;
}

/** Whether `clinicSlugs` is every open clinic (Dr. Tom): the texts then say so instead of a list. */
const worksEverywhere = (clinicSlugs: readonly string[]) =>
  openClinics.length > 1 && openClinics.every((clinic) => clinicSlugs.includes(clinic.slug));

/** Wording for a practitioner who works in every open clinic. */
// TODO: copy review
const everyClinic = { sentence: "alle vores klinikker", fact: "Alle klinikker" };

/**
 * Where a practitioner works, as a sentence's text, from `clinicSlugs`: "Fillox Østerbro og Fillox
 * City2" (the clinics' full names in the given order, joined the Danish way; "alle vores klinikker"
 * for someone in every open clinic). Every sentence that
 * states a practitioner's clinic goes through it (the booking band, the new members' card
 * sentence); the "Arbejder i" fact uses clinicShortList. Throws on an empty list or an unknown clinic.
 */
export function clinicNames(clinicSlugs: readonly string[]): string {
  if (!clinicSlugs.length) throw new Error("team: clinicNames() needs at least one clinic");
  clinicSlugs.forEach(openClinic);
  if (worksEverywhere(clinicSlugs)) return everyClinic.sentence;
  return formatList(clinicSlugs.map((slug) => openClinic(slug).fullName));
}

/**
 * The "Arbejder i" fact's value, from `clinicSlugs`: the clinics' short names joined with "&", as
 * in the design (6alb / ma: "City2 & Amager") and the other fact values ("Dine ønsker & behov"),
 * e.g. "Frederiksberg & Amager Centret" ("Alle klinikker" for someone in every open clinic). A name never breaks inside (no-break spaces), so a value
 * on two lines breaks between clinics. Throws on an empty list or an unknown clinic.
 */
export function clinicShortList(clinicSlugs: readonly string[]): string {
  if (!clinicSlugs.length) throw new Error("team: clinicShortList() needs at least one clinic");
  clinicSlugs.forEach(openClinic);
  if (worksEverywhere(clinicSlugs)) return everyClinic.fact;
  const names = clinicSlugs.map((slug) => openClinic(slug).name.replace(/ /g, " "));
  return names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

/** The profile's "Arbejder i" fact card (6alb's first fact), e.g. "Frederiksberg & Amager Centret". */
const worksInFact = (clinicSlugs: readonly string[]) => ({ label: "Arbejder i", value: clinicShortList(clinicSlugs) });

/**
 * "Du møder Annika i Fillox Østerbro og Fillox City2.": the one sentence that says where to find
 * a practitioner. It opens the booking band of a profile and is the whole card text of a new
 * member (nothing but the name and the clinics, both from the owner).
 */
// TODO: copy review (the wording; the clinics are the owner's)
const meetAt = (name: string, clinicSlugs: readonly string[]) => `Du møder ${name} i ${clinicNames(clinicSlugs)}.`;

/** Booking band text of a profile: where the practitioner works, then the free consultation. */
// TODO: copy review
const bookingText = (name: string, clinicSlugs: readonly string[]) =>
  `${meetAt(name, clinicSlugs)} Første konsultation er altid gratis.`;

/**
 * Title of everyone but Dr. Tom (the owner, 2026-11-25: "de andre skriver vi bare kosmetiske
 * sygeplejerske"): `title` on /om-os, /behandlere and the profile (also the structured data's
 * jobTitle), `role` on the home cards.
 */
const nurse = { role: "Sygeplejerske", title: "Kosmetisk sygeplejerske" } as const;

/** Amounts of the price-list rows (content/prices.ts) tagged with any of `slugs`. */
function listAmounts(slugs: string[]): number[] {
  const amounts = priceCards.flatMap((card) =>
    card.rows.flatMap((r) =>
      r.treatmentSlug && slugs.includes(r.treatmentSlug) && r.price.kind === "amount" ? [r.price.amount] : [],
    ),
  );
  if (!amounts.length) throw new Error(`team: no price-list row tagged ${slugs.join(", ")}`);
  return amounts;
}

/** "fra" the lowest list price of `slugs` (an area price, or a treatment with a surcharge on top). */
function fromPrice(...slugs: string[]): PriceValue {
  return { kind: "amount", amount: Math.min(...listAmounts(slugs)), from: true };
}

/**
 * An offer for a treatment with a page: its name and short text (content/treatments.ts) and its
 * list price, "fra" when the price list has more than one price for it. `name` and `description`
 * replace the treatment's own.
 */
function treatmentOffer(slug: string, overrides: Partial<Pick<TeamOffer, "name" | "description" | "price">> = {}): TeamOffer {
  const treatment = getTreatment(slug);
  if (!treatment?.priceFrom) throw new Error(`team: treatment "${slug}" has no "fra" price`);
  const amounts = listAmounts([slug]);
  return {
    name: treatment.name,
    description: treatment.short,
    price: { kind: "amount", amount: treatment.priceFrom, from: new Set(amounts).size > 1 },
    treatmentSlug: slug,
    ...overrides,
  };
}

/** Price of a "gratis" / "efter aftale" row of the price list's konsultation card. */
function consultationPrice(label: string): PriceValue {
  const row = priceCards.find((c) => c.id === "konsultation")?.rows.find((r) => r.label === label);
  if (!row) throw new Error(`team: no price-list row "${label}"`);
  return row.price;
}

/**
 * Filler areas other than lips (kindben, kæbelinje, hage …), from the "op til 1 ml" price. No
 * `treatmentSlug`: see "Offers" above.
 */
const facialFillers: TeamOffer = {
  name: "Fillers i ansigtet",
  description: "Kindben, kæbelinje og hage formet med hyaluronsyre, pr. område op til 1\u00a0ml.",
  price: fromPrice("kindben", "kaebelinje", "hage"),
};

/**
 * Wrinkle treatment as a priced offer, under the hub's name ("Rynkebehandling"), not the brand
 * name. Botox is a prescription medicine, and a priced "Botox" card right above customer
 * testimonials can count as advertising it to the public (content/reviews.ts header,
 * `treatmentsWithoutReviews`). The card links to the rynkebehandling hub. Open legal question for
 * the owner: README → "Før lancering" → "Anmeldelser og Botox".
 */
const wrinkleOffer: TeamOffer = treatmentOffer("rynkebehandling");

/** "Gratis konsultation" card (price list: "Fillers konsultation, 30 min, v. kosmetisk sygeplejerske"). */
const consultationOffer = (name: string): TeamOffer => ({
  name: "Gratis konsultation",
  description: `Usikker på, hvad du har brug for? ${name} hjælper dig med en plan.`,
  price: consultationPrice("Fillers konsultation"),
});

/** "Gratis kontrol" card (price list: "Kontrol efter behandling, valgfri, ca. 14 dage efter"). */
const followUpOffer: TeamOffer = {
  name: "Gratis kontrol",
  description: "Valgfri kontrol cirka 14 dage efter din behandling.",
  price: consultationPrice("Kontrol efter behandling"),
};

/** Offers section heading and buttons, e.g. "Det tilbyder Annika dig" / "Book hos Annika". */
const offersCopy = (name: string) => ({
  eyebrow: "Behandlinger",
  title: `Det tilbyder ${name} dig`,
  ctaLabel: `Book hos ${name}`,
  ctaLabelShort: "Book",
});

/** In-page link from the hero to the offers section (practitionerPage.offersId). */
const seeTreatments = { label: "Se behandlinger", href: "#behandlinger" };

/**
 * Where the face sits in a photo, as fractions of the photo's width / height, measured on the
 * file: `x` the nose line, `eyes` and `mouth` the eye and mouth lines.
 */
type Face = { x: number; eyes: number; mouth: number };

/**
 * A photo slot to frame a face in: its shape (`aspect`, width / height), the eye line (`eyes`)
 * and, optionally, the eye-to-mouth distance (`face`), both as fractions of the slot height. With
 * `face` the photo is zoomed (never below 1) so every face in that slot is one size.
 */
export type FaceSlot = { aspect: number; eyes: number; face?: number };

/**
 * The same headroom and face size, relative to the slot's WIDTH, in a slot of another shape: the
 * eye line sits as far below the top edge and the face is as wide as in `slot`.
 */
const reshape = (slot: Required<FaceSlot>, aspect: number): Required<FaceSlot> => ({
  aspect,
  eyes: (slot.eyes * aspect) / slot.aspect,
  face: (slot.face * aspect) / slot.aspect,
});

/**
 * Team-card slots. Every card in a grid uses one of them for every member, so faces sit on one
 * line and at one size.
 * - `portrait` (4:5): the /om-os and /behandlere cards from 768px and the home scroll row below
 *   768px. Eye-to-mouth 10.9% of the height: the face size of a half-length 4:5 portrait drawn at
 *   zoom 1 (the smallest face the slot has held); the photos are zoomed to that size.
 * - `square` (33:34, the mo cards' 330 × 340): the home grid from 768px (a shorter section, see
 *   components/home/Team.tsx) and the /om-os and /behandlere cards below 768px. Same headroom and
 *   face width as `portrait`.
 * - `row` (190:268): the profile page's "Mød resten af teamet" row from 768px
 *   (components/practitioner/TeamRow.tsx). Same headroom and face width as `portrait`.
 * The components draw the slots with `aspect-[4/5]` / `aspect-[33/34]` / `aspect-[190/268]`; keep
 * them in step. A member without a photo gets the placeholder in the same slots
 * (components/practitioner/PortraitPlaceholder), so nothing moves when the photo arrives.
 */
const PORTRAIT_SLOT: Required<FaceSlot> = { aspect: 4 / 5, eyes: 0.28, face: 0.109 };
export const teamSlots = {
  portrait: PORTRAIT_SLOT,
  square: reshape(PORTRAIT_SLOT, 33 / 34),
  row: reshape(PORTRAIT_SLOT, 190 / 268),
} as const;

const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * How many times wider than its slot `image` is drawn (object-fit: cover × zoom): 1 for a photo
 * narrower than the slot, more for a wider one. `sizes` multiplies the slot width by it, so a
 * cropped photo is still downloaded sharp.
 */
export function drawnWidthScale(image: ImageRef, aspect: number): number {
  const cover = image.width && image.height ? Math.max(1, image.width / image.height / aspect) : 1;
  return cover * (image.zoom ?? 1);
}

/**
 * The crop of `image` (object-position, and zoom when the slot sets a face size) that frames
 * `face` in `slot`: nose line at 50%, eye line at `slot.eyes`, whatever the photo's shape.
 *
 * object-fit: cover fits the photo to the slot along one axis (the "fitted" one: its width when
 * the photo is narrower than the slot, else its height) and overflows along the other by D (the
 * photo's size there, in slot units). object-position p is also the transform-origin of the zoom
 * z, so a point at fraction u of the photo lands at
 *   fitted axis:   z·u + p·(1 − z)
 *   other axis:    z·u·D + p·(1 − z·D)
 * of the slot. Solving for p places the nose and eye lines (clamped to the photo's edges).
 *
 * In a slot with a face size, the zoom also grows (a little past that size) when the photo's
 * edge keeps the eye line more than 1% off `slot.eyes` at p = 0 or 1: Annika's photo is cut just
 * above her hair, so her eyes sit high in it, and her portrait is drawn ≈ 15% larger than the
 * others to bring them down to the common eye line.
 */
function faceCrop(image: ImageRef & { width: number; height: number }, face: Face, slot: FaceSlot): ImageRef {
  const ratio = image.width / image.height;
  const byWidth = ratio < slot.aspect;
  const overflow = byWidth ? slot.aspect / ratio : ratio / slot.aspect;
  const photoHeight = byWidth ? overflow : 1; // the photo's height in slot heights, before zoom
  const ceil2 = (n: number) => Math.ceil(n * 100 - 1e-9) / 100;
  let zoom = slot.face ? Math.max(1, Math.round((slot.face / ((face.mouth - face.eyes) * photoHeight)) * 100) / 100) : 1;
  if (slot.face) {
    const tolerance = 0.01;
    // The eye line's lowest place (p = 0: the photo's top edge on the slot's) and highest (p = 1).
    if (zoom * face.eyes * photoHeight < slot.eyes - tolerance) {
      zoom = ceil2((slot.eyes - tolerance) / (face.eyes * photoHeight));
    }
    if (1 - zoom * photoHeight * (1 - face.eyes) > slot.eyes + tolerance) {
      zoom = ceil2((1 - slot.eyes - tolerance) / (photoHeight * (1 - face.eyes)));
    }
  }
  const place = (target: number, u: number, fitted: boolean, exact: number) => {
    const d = fitted ? 1 : overflow;
    const k = 1 - zoom * d;
    // Zoom 1 on an axis the photo fills exactly: the position doesn't matter in this slot (within
    // 1%, the photo can only move by that much). It does in a frame of another shape that draws
    // the same crop (the profile hero below 640px gets wider than tall): `exact` is the centre
    // horizontally and the photo's top vertically, so the head is never cut there.
    return Math.abs(k) < 0.01 ? exact : clamp01((target - zoom * u * d) / k);
  };
  const x = place(0.5, face.x, byWidth, 0.5);
  const y = place(slot.eyes, face.eyes, !byWidth, 0);
  return { ...image, position: `${pct(x)} ${pct(y)}`, zoom: zoom === 1 ? undefined : zoom };
}

const members: TeamRosterMember[] = [
  {
    slug: "tom",
    name: "Dr. Tom",
    fullName: "Dr. Tom Haugland",
    // More than "læge" (the owner, 2026-11-25: "tror også hans titel er lidt mere end bare læge"):
    // "grundlægger af Fillox" (the owner's new Om Fillox text, content/pages/about.ts), "daglig
    // leder i Fillox-kæden" and "Fagligt ansvarlig er æstetisk læge Tom Haugland" (fillox.dk/om-os,
    // also fillox.no/om-oss). The cards show `role`; /om-os, /behandlere and his profile `title`.
    // TODO: copy review (owner: the exact title wording)
    role: "Æstetisk læge & grundlægger",
    title: "Æstetisk læge · Grundlægger & daglig leder",
    // Below 768px (profile eyebrow, /om-os and /behandlere cards): the title on one line at 390px.
    titleShort: "Æstetisk læge & grundlægger",
    clinicSlugs: worksAt.tom,
    // In the clinic, grey-beige uniform (the owner, 2026-11-25). Also the /om-os doctor section's
    // photo, there in a wider crop (content/pages/about.ts).
    image: {
      src: "/images/team/tom-2026.jpg",
      alt: "Dr. Tom Haugland, æstetisk læge hos Fillox",
      width: 1223,
      height: 1286,
      share: { src: "/images/team/og-tom-2026.jpg", width: 1200, height: 628 },
    },
    // Also the "Din behandler" text on /behandlinger/naesekorrektion (no practitionerText there).
    bio: "Tom er uddannet læge i Oslo, grundlægger af Fillox og daglig leder i Fillox-kæden. Hans specialområde er ansigtskonturering samt næse- og hagekorrektioner med hyaluronsyrefillere. Han er fagligt ansvarlig læge i Fillox, og næsekorrektioner udføres af ham.",
    bioShort:
      "Uddannet læge i Oslo, grundlægger af Fillox og fagligt ansvarlig læge. Specialområde: ansigtskonturering samt næse- og hagekorrektioner.",
    link: { label: "Se hvad Dr. Tom tilbyder", href: profileHref("tom") },
    bookingHref: bookWith("tom"),
    profile: {
      intro:
        "Tom er uddannet læge i Oslo, grundlægger af Fillox og daglig leder i Fillox-kæden. Hans specialområde er ansigtskonturering samt næse- og hagekorrektioner med hyaluronsyrefillere, og han er fagligt ansvarlig læge i Fillox.",
      introShort:
        "Tom er uddannet læge i Oslo, grundlægger og daglig leder af Fillox. Specialområde: ansigtskonturering samt næse- og hagekorrektioner.",
      primaryCta: { label: "Book tid hos Dr. Tom", href: bookWith("tom") },
      secondaryCta: seeTreatments,
      // "Arbejder i" first, as on the other profiles; "Uddannet: Læge i Oslo" gave it its place
      // (the intro and "Uddannelse & ansvar" still say it).
      facts: [
        worksInFact(worksAt.tom),
        { label: "Specialområde", value: "Ansigtskonturering, næse & hage" },
        { label: "Rolle", value: "Fagligt ansvarlig læge" },
      ],
      // TODO: copy review (owner): Tom has no quote of his own on the live site. These rephrase
      // "Hvorfor vælge Fillox" on /om-os: "en kombination af stærk faglig kompetence og en evne til
      // at udtrykke sig både kunstnerisk og æstetisk", "personligt tilpasset din ansigtsanatomi og
      // dine forventninger til et smukt resultat", "en solid vurdering forud for behandlingen".
      approach: {
        eyebrow: "Sådan arbejder Tom",
        title: "Det kan du regne med hos Tom",
        items: [
          {
            title: "Faglighed og æstetik",
            text: "Et godt æstetisk resultat kræver både stærk faglig kompetence og sans for det kunstneriske og æstetiske.",
            textShort: "Stærk faglig kompetence og sans for det æstetiske.",
          },
          {
            title: "Tilpasset dit ansigt",
            text: "Den bedste behandling er personligt tilpasset din ansigtsanatomi og dine forventninger til et smukt resultat.",
            textShort: "Behandlingen tilpasses din ansigtsanatomi og dine ønsker.",
          },
          {
            title: "En solid vurdering",
            text: "Du får altid en solid vurdering, før du bliver behandlet, så du ved, hvad der giver mening for dig.",
            textShort: "Du får altid en solid vurdering før behandlingen.",
          },
        ],
      },
      // His specialty on /om-os. Prices are "fra": a doctor's treatment has the price list's
      // specialist-tillæg on top ("efter aftale"; the booking band says so). Hage and the
      // contouring areas are unlinked (see "Offers" in the header).
      offers: {
        ...offersCopy("Dr. Tom"),
        items: [
          treatmentOffer("naesekorrektion", {
            description: "Ujævnheder på næseryggen og formen på næsespidsen, rettet med filler uden kirurgi.",
            price: fromPrice("naesekorrektion"),
          }),
          {
            name: "Hagekorrektion",
            description: "Mere form og balance i profilen med hyaluronsyrefiller.",
            price: fromPrice("hage"),
          },
          {
            name: "Ansigtskonturering",
            description: "Kindben og kæbelinje formet med hyaluronsyrefiller, pr. område eller 4 ml samlet.",
            price: fromPrice("kindben", "kaebelinje"),
          },
        ],
      },
      // /om-os: "uddannet læge i Oslo og … daglig leder i Fillox-kæden", "Fagligt ansvarlig er
      // æstetisk læge Tom Haugland", "Annika er uddannet kosmetisk sygeplejske i Fillox af Dr.
      // Tom"; /priser: "Næsekorrektion — Udføres af Dr. Tom"; the owner's new Om Fillox text
      // (content/pages/about.ts): "grundlægger af Fillox", "står for intern undervisning",
      // "international underviser". No years are documented.
      experience: {
        title: "Uddannelse & ansvar",
        items: [
          { period: "Uddannelse", text: "Uddannet læge i Oslo." },
          { period: "Ledelse", text: "Grundlægger af Fillox og daglig leder i Fillox-kæden." },
          {
            period: "Fagligt ansvar",
            periodShort: "Ansvar",
            text: "Fagligt ansvarlig læge i Fillox. Næsekorrektioner udføres af Tom.",
          },
          {
            period: "Undervisning",
            text: "Står for den interne undervisning i Fillox og underviser også internationalt. Har blandt andet uddannet Annika som kosmetisk sygeplejerske.",
          },
        ],
      },
      booking: {
        title: "Book tid hos Dr. Tom",
        // TODO: copy review
        text: `${meetAt("Dr. Tom", worksAt.tom)} Behandling hos læge har et specialist-tillæg efter aftale.`,
        cta: { label: "Book tid hos Dr. Tom", href: bookWith("tom") },
      },
    },
  },
  {
    slug: "alberte",
    name: "Alberte",
    // The owner (2026-11-25): Alberte is a kosmetisk sygeplejerske and works at Frederiksberg
    // (the live site gave her no title and no clinic).
    ...nurse,
    // In black, arms crossed (the owner, 2026-11-25: "alberte har også i hvid man brug den i sort
    // det bedre"; the white one by the window is a mood photo, content/photos.ts → behandlerVindue).
    image: {
      src: "/images/team/alberte-2026.jpg",
      alt: "Alberte, kosmetisk sygeplejerske hos Fillox",
      width: 1105,
      height: 1118,
      share: { src: "/images/team/og-alberte-2026.jpg", width: 1105, height: 579 },
    },
    clinicSlugs: worksAt.alberte,
    // What she performs (the offers below): the design's skin treatments (laser, microneedling,
    // skinbooster, ansigtsbehandling, PRF hud), kept on the owner's answer (asked about the
    // treatments on her profile: "ved ikke tjek hvad vi har skrevet tidligere, nok det hele",
    // 2026-11-25); the injectables her own Trustpilot reviews name
    // (content/reviews.ts): lip filler (Qlr "Jeg har fået lavet læber hos Alberte", Lisette Nielsen
    // "et perfekt resultat af mine læber", Jessica "Fik lavet læber hos Alberte") and filler (Jh,
    // about her visits to Alberte: "Jeg har aldrig prøvet hverken filler eller microneedeling
    // før"; no area named); and rynkebehandling (the owner, 2026-11-25: "ja hun laver også
    // rynkebehandling").
    // TODO: fact check (owner), still open: her education, and whether she does the areas the
    // shared "Fillers i ansigtet" card names (kindben, kæbelinje, hage; Jh names none). Until then
    // the design's unsourced claims stay out: the specialty "Laser & hudforbedring", the "Erfaring & uddannelse" timeline (2021
    // kosmetolog, 2022 laser/IPL, 2023 Fillox, løbende kurser), the design's title ("Kosmetisk
    // behandler") and clinics (City2 & Amager), which the owner has answered differently, and the
    // design's sample review (her real Trustpilot reviews are in content/reviews.ts). bio, bioShort,
    // intro and the two facts about her approach come from her "Ansatte" pop-up and quote on
    // https://fillox.dk/om-os/.
    bio: "Alberte holder sig konstant orienteret inden for den nyeste viden og de seneste fremskridt i den kosmetiske verden.",
    bioShort: "Holder sig konstant orienteret i den nyeste viden inden for den kosmetiske verden.",
    quote: "“Min tilgang er at forbedre og ikke forandre.”",
    link: { label: "Se hvad Alberte tilbyder", href: profileHref("alberte") },
    bookingHref: bookWith("alberte"),
    profile: {
      intro:
        "Alberte holder sig konstant orienteret inden for den nyeste viden og de seneste fremskridt i den kosmetiske verden. Hendes drivkraft er at hjælpe mennesker med at blive den bedste version af sig selv, med resultater der forbedrer frem for at forandre.",
      introShort:
        "Alberte holder sig altid orienteret i den nyeste viden. Hendes drivkraft er resultater, der forbedrer frem for at forandre.",
      // No `heroImage`: the design's s6alb-hero crop was for her old photo; the hero frames the new
      // one from the face table, as on the other profiles.
      primaryCta: { label: "Book tid hos Alberte", href: bookWith("alberte") },
      secondaryCta: { label: "Se behandlinger", href: "#behandlinger" },
      // Three cards, as in 6alb ("Arbejder i" first). Her clinic (the owner), then her quote on
      // /om-os ("Min tilgang er at forbedre og ikke forandre", "fremhæve hver kundes naturlige
      // skønhed og skabe eller bevare harmoni"). The card it replaced was Fillox's overall
      // Trustpilot score ("Fillox på Trustpilot · 4,7 ★"), the one fact that was not about her; her
      // own reviews are further down the page.
      facts: [
        worksInFact(worksAt.alberte),
        { label: "Tilgang", value: "Forbedre, ikke forandre" },
        { label: "Fokus", value: "Naturlig skønhed & harmoni" },
      ],
      approach: {
        eyebrow: "Sådan arbejder jeg",
        title: "Tre ting, du altid kan regne med",
        items: [
          {
            title: "Jeg lytter først",
            text: "Vi starter altid med en samtale om, hvad du ønsker, og hvad der giver mening for dig.",
            textShort: "Vi starter med en samtale om, hvad du ønsker, og hvad der giver mening.",
          },
          {
            title: "Ærlige råd",
            text: "Jeg fraråder lige så gerne, som jeg anbefaler. Mindre er ofte mere.",
            textShort: "Jeg fraråder lige så gerne, som jeg anbefaler.",
          },
          {
            title: "Jeg følger op",
            text: "Du får altid en gratis kontrol, og du kan skrive til mig, hvis du har spørgsmål bagefter.",
            textShort: "Du får altid en gratis kontrol bagefter.",
          },
        ],
      },
      offers: {
        ...offersCopy("Alberte"),
        // Prices from the price list (https://fillox.dk/priser/): laser from 500 (Overlæbe, Hage …),
        // Microneedling 1 behandling 1.200 (999 until the live list changed, 2026-11-17),
        // skinboosters from 1.499 (Ejal 40), Signatur behandling 999, PRF Hud 1 behandling 2.499;
        // lip filler, "Fillers i ansigtet" and rynkebehandling as on Annika's and Mike's profiles
        // (the same helpers and `wrinkleOffer`, never the product name); the fillers consultation
        // (v. kosmetisk sygeplejerske) is free.
        // Order: her skin treatments first (the profile's focus, as designed), then lip filler,
        // fillers and rynkebehandling, the consultation last. Nine cards: three full rows of thirds
        // from 72rem, rows of two from 768px with the consultation full width (offerSpan).
        items: [
          // Live (/harfjerning): diode laser, settings adapted to the skin type and hair.
          treatmentOffer("laser-harfjerning", {
            description: "Diodelaser tilpasset din hudtype og hårstruktur, fra overlæbe til hel krop.",
          }),
          treatmentOffer("microneedling"),
          // "fra 1.499" is Ejal 40 (Profhilo from 2.499, Sunekos Performa from 1.599).
          treatmentOffer("skinbooster", {
            description: "Dybdegående fugt med Profhilo, Sunekos eller Ejal 40 for frisk, strammere hud.",
          }),
          treatmentOffer("signatur-ansigtsbehandling", { description: "Peeling, maske og LED med Dr. Dennis\u00a0Gross." }),
          treatmentOffer("prf-hud"),
          // Lip filler and fillers: her reviews; rynkebehandling: the owner (see the comment at
          // `clinicSlugs`). Lip filler links to its page, whose "Din behandler" stays Annika (set on
          // the page, content/treatments.ts); "Fillers i ansigtet" is unlinked, as for the other
          // nurses (header, "Offers"); rynkebehandling links to the hub, a long-form page that shows
          // no practitioner.
          treatmentOffer("lip-filler"),
          facialFillers,
          wrinkleOffer,
          consultationOffer("Alberte"),
        ],
      },
      // No `experience` until the owner supplies a sourced one (see the TODO above): add it once
      // her education is confirmed. Her reviews: content/reviews.ts (Trustpilot reviews that
      // name her).
      booking: {
        title: "Book tid hos Alberte",
        text: bookingText("Alberte", worksAt.alberte),
        cta: { label: "Book tid hos Alberte", href: bookWith("alberte") },
      },
    },
  },
  {
    slug: "annika",
    name: "Annika",
    ...nurse,
    // Straight blonde hair, black Fillox uniform (the owner, 2026-11-25). The design's s6bx-annika
    // crop was for her old photo; "Din behandler" frames this one from the face table.
    image: {
      src: "/images/team/annika-2026.jpg",
      alt: "Annika, kosmetisk sygeplejerske hos Fillox",
      width: 976,
      height: 1027,
      share: { src: "/images/team/og-annika-2026.jpg", width: 976, height: 511 },
    },
    clinicSlugs: worksAt.annika,
    bio: "Annika er uddannet kosmetisk sygeplejerske i Fillox af Dr. Tom og har stor viden om det æstetiske felt og de forskellige behandlinger og muligheder.",
    bioShort: "Uddannet i Fillox af Dr. Tom, med stor viden om behandlinger og muligheder.",
    quote: "“Jeg er først tilfreds, når du er glad og tilfreds.”",
    authorBio: "Kosmetisk sygeplejerske, uddannet i Fillox af Dr. Tom.",
    link: { label: "Se hvad Annika tilbyder", href: profileHref("annika") },
    bookingHref: bookWith("annika"),
    profile: {
      intro:
        "Annika er uddannet kosmetisk sygeplejerske i Fillox af Dr. Tom og har stor viden inden for det æstetiske felt. Hun brænder for et naturligt resultat, og hendes behandlinger bygger på solid viden, kvalitet og professionalisme.",
      introShort:
        "Annika er kosmetisk sygeplejerske, uddannet i Fillox af Dr. Tom. Hun brænder for et naturligt resultat.",
      primaryCta: { label: "Book tid hos Annika", href: bookWith("annika") },
      secondaryCta: seeTreatments,
      // Three cards, as in 6alb ("Arbejder i" first). Her clinics (the owner), /om-os ("uddannet
      // kosmetisk sygeplejske i Fillox af Dr. Tom") and her quote ("Jeg brænder for et naturligt
      // resultat"). The card "Prioritet · Kundetilfredshed" made room for the clinics: the same
      // quote is the third "Sådan arbejder jeg" card below ("Din tilfredshed først"). The title
      // above already says "Kosmetisk sygeplejerske".
      facts: [
        worksInFact(worksAt.annika),
        { label: "Uddannet af", value: "Dr. Tom i Fillox" },
        { label: "Fokus", value: "Naturlige resultater" },
      ],
      // Her quote on /om-os, lightly rephrased: "Jeg brænder for et naturligt resultat, og mine
      // behandlinger er baseret på solid viden, kvalitet og professionalisme. Jeg brænder for
      // æstetisk medicin og ønsker, at mine klienter føler sig trygge og hørte. Kundetilfredshed er
      // min højeste prioritet – jeg er først tilfreds, når du er glad og tilfreds."
      approach: {
        eyebrow: "Sådan arbejder jeg",
        title: "Det brænder jeg for",
        items: [
          {
            title: "Et naturligt resultat",
            text: "Jeg brænder for et naturligt resultat, og mine behandlinger bygger på solid viden, kvalitet og professionalisme.",
            textShort: "Mine behandlinger bygger på solid viden, kvalitet og professionalisme.",
          },
          {
            title: "Tryg og hørt",
            text: "Jeg brænder for æstetisk medicin, og jeg ønsker, at du føler dig tryg og hørt hele vejen igennem.",
            textShort: "Du skal føle dig tryg og hørt hele vejen igennem.",
          },
          {
            title: "Din tilfredshed først",
            text: "Kundetilfredshed er min højeste prioritet. Jeg er først tilfreds, når du er glad og tilfreds.",
            textShort: "Jeg er først tilfreds, når du er glad og tilfreds.",
          },
        ],
      },
      // Her Trustpilot reviews (content/reviews.ts): lip filler, Botox, fillers and skinboosters
      // (Sunekos). The former Botox page had her as "Din behandler"; the rynkebehandling hub that
      // replaced it shows no practitioner, so this offer only links to it.
      offers: {
        ...offersCopy("Annika"),
        items: [
          treatmentOffer("lip-filler"),
          wrinkleOffer,
          treatmentOffer("skinbooster"),
          facialFillers,
          consultationOffer("Annika"),
          followUpOffer,
        ],
      },
      booking: {
        title: "Book tid hos Annika",
        text: bookingText("Annika", worksAt.annika),
        cta: { label: "Book tid hos Annika", href: bookWith("annika") },
      },
    },
  },
  {
    slug: "mike",
    name: "Mike",
    ...nurse,
    // Black uniform, arms crossed (the owner, 2026-11-25).
    image: {
      src: "/images/team/mike-2026.jpg",
      alt: "Mike, kosmetisk sygeplejerske hos Fillox",
      width: 1290,
      height: 1219,
      share: { src: "/images/team/og-mike-2026.jpg", width: 1200, height: 628 },
    },
    clinicSlugs: worksAt.mike,
    bio: "Mike er kvalificeret kosmetisk sygeplejerske og har udvidet sin ekspertise gennem løbende uddannelse. Han tilpasser behandlingen til dine ønsker og behov.",
    bioShort: "Tilpasser behandlingen til dine ønsker og behov, med et naturligt resultat som mål.",
    quote: "“Det vigtigste for mig er, at klienten føler sig tryg og tilfreds.”",
    link: { label: "Se hvad Mike tilbyder", href: profileHref("mike") },
    bookingHref: bookWith("mike"),
    profile: {
      intro:
        "Mike er kvalificeret kosmetisk sygeplejerske og har udvidet sin ekspertise gennem løbende uddannelse. Han tilpasser behandlingen til dine ønsker og behov, og hans mål er et naturligt smukt resultat, der fremhæver din naturlige skønhed.",
      introShort:
        "Mike er kosmetisk sygeplejerske og tilpasser behandlingen til dine ønsker og behov, med et naturligt resultat som mål.",
      primaryCta: { label: "Book tid hos Mike", href: bookWith("mike") },
      secondaryCta: seeTreatments,
      // Three cards, as in 6alb ("Arbejder i" first). His clinics (the owner) and his quote
      // ("tilpasse mine behandlinger til klientens ønsker og behov … at klienten føler sig tryg og
      // tilfreds"). The card "Udvikling · Løbende uddannelse" (/om-os) made room for the clinics:
      // the intro right above says it ("udvidet sin ekspertise gennem løbende uddannelse").
      facts: [
        worksInFact(worksAt.mike),
        { label: "Tilgang", value: "Dine ønsker & behov" },
        { label: "Fokus", value: "Tryghed & tilfredshed" },
      ],
      // His quote on /om-os, lightly rephrased: "Jeg ønsker at tilpasse mine behandlinger til
      // klientens ønsker og behov. Mit mål er at skabe et naturligt smukt æstetisk resultat, som
      // fremhæver den naturlige skønhed og dermed øger selvtilliden. Det vigtigste for mig er, at
      // klienten føler sig tryg og tilfreds."
      approach: {
        eyebrow: "Sådan arbejder jeg",
        title: "Tre ting, jeg altid går efter",
        items: [
          {
            title: "Tilpasset dig",
            text: "Jeg tilpasser mine behandlinger til dine ønsker og behov.",
          },
          {
            title: "Naturligt smukt",
            text: "Mit mål er et naturligt smukt resultat, der fremhæver din naturlige skønhed og giver mere selvtillid.",
            textShort: "Et naturligt smukt resultat, der fremhæver din skønhed.",
          },
          {
            title: "Tryg og tilfreds",
            text: "Det vigtigste for mig er, at du føler dig tryg og tilfreds.",
          },
        ],
      },
      // His Trustpilot reviews: lip filler (most of them), Botox and fillers (incl. hage).
      offers: {
        ...offersCopy("Mike"),
        items: [treatmentOffer("lip-filler"), wrinkleOffer, facialFillers, consultationOffer("Mike"), followUpOffer],
      },
      booking: {
        title: "Book tid hos Mike",
        text: bookingText("Mike", worksAt.mike),
        cta: { label: "Book tid hos Mike", href: bookWith("mike") },
      },
    },
  },
  // New practitioners (the owner, 2026-11-25). Card-only members (content/types.ts →
  // TeamCardOnlyMember): only the first name, the title and the clinics are known, and their
  // photos have not arrived, so the team grids draw the placeholder (chosen by the missing
  // `image`). NOTHING else may be written about them until the owner supplies it: no surname,
  // bio, quote, education, treatments, experience or reviews. `bio` is the one sentence the cards
  // show under the title, built from the name and the clinics.
  // TODO (owner): photos, a few lines about each and their treatments ("A new member" in the
  // header has the three steps).
  {
    slug: "simone",
    name: "Simone",
    ...nurse,
    clinicSlugs: worksAt.simone,
    // TODO: copy review ("Du møder Simone i Fillox City2 og Fillox Amager Centret.")
    bio: meetAt("Simone", worksAt.simone),
  } satisfies TeamCardOnlyMember,
  {
    slug: "frederikke",
    name: "Frederikke",
    ...nurse,
    clinicSlugs: worksAt.frederikke,
    // TODO: copy review ("Du møder Frederikke i Fillox Østerbro.")
    bio: meetAt("Frederikke", worksAt.frederikke),
  } satisfies TeamCardOnlyMember,
];

/**
 * Faces in each member's `image` (see faceCrop), measured on the files with a 1% grid
 * (2026-11-25). `x` is the middle of the face (between the nose line and the middle of the head:
 * Alberte, Annika and Mike turn their heads a little); `eyes` the line through both pupils,
 * `mouth` the line between the lips. A member without one keeps `image`'s own crop.
 * Hair tops, for the headroom they leave in the 4:5 card: Tom 8%, Alberte 7.5%, Annika 1.7%,
 * Mike 5.3% of the photo's height.
 *
 * Measuring a new photo: open the file in an image editor that shows the pointer's position, read
 * the pixel column of the middle of the face and the pixel rows of the pupils and of the line
 * between the lips, and divide by the photo's width (x) or height (eyes, mouth): e.g. pupils at
 * row 268 of a 1118px high photo → eyes 0.24. Two decimals are enough (three if the face is
 * small). Then look at the three team grids at 390 and 1440: the eyes should sit on the others'
 * line. `npm run check:market` (rule 16) fails when a member with a profile page has no row.
 */
const faces: Record<string, Face> = {
  tom: { x: 0.58, eyes: 0.225, mouth: 0.295 },
  alberte: { x: 0.475, eyes: 0.233, mouth: 0.325 },
  annika: { x: 0.535, eyes: 0.19, mouth: 0.278 },
  mike: { x: 0.48, eyes: 0.24, mouth: 0.33 },
};

/** True when `slug` has a row in the face table (npm run check:market, rule 16). */
export function hasMeasuredFace(slug: string): boolean {
  return Object.hasOwn(faces, slug);
}

/**
 * `member.image` framed for `slot` from the face table (team cards, the profile hero), or
 * `fallback` (default: the image's own crop) for a member whose face is not measured.
 */
export function framedPortrait(
  member: { slug: string; image: ImageRef },
  slot: FaceSlot,
  fallback: ImageRef = member.image,
): ImageRef {
  const face = faces[member.slug];
  const { width, height } = member.image;
  if (!face || !width || !height) return fallback;
  return faceCrop({ ...member.image, width, height }, face, slot);
}

/** `member` with `image` and `crops.about` set to the 4:5 team-card crop. */
function withCardCrop<M extends { slug: string; image: ImageRef; crops?: { about?: ImageRef } }>(member: M): M {
  const portrait = framedPortrait(member, teamSlots.portrait);
  return { ...member, image: portrait, crops: { ...member.crops, about: portrait } };
}

/** A member with a profile page (`profile`), as opposed to a card-only member (content/types.ts). */
export function hasProfilePage(member: TeamRosterMember): member is TeamMember {
  return member.profile !== undefined;
}

/**
 * EVERYONE on the team, in display order: the cards of the three team grids (home, /om-os,
 * /behandlere), and nothing else. It includes card-only members (no profile page, maybe no photo:
 * content/types.ts → TeamCardOnlyMember), so a grid must branch on `hasProfilePage(member)` before
 * it links to a profile and on `member.image` before it draws a photo. Members with a photo have
 * `image` and `crops.about` set to the 4:5 team-card crop, as in `team`.
 */
export const teamRoster: TeamRosterMember[] = members.map((member) =>
  // Framed whenever there is a photo, whatever the kind of member. A member with a profile page but
  // no photo (tsc rejects it) passes through as it is, so `npm run check:market` gets to rule 16
  // and says what is missing instead of crashing here.
  member.image ? withCardCrop({ ...member, image: member.image }) : member,
);

/**
 * The practitioners with a profile page (/behandlere/<slug>), in display order: the list for
 * everything that is not a team grid (profile pages and their "other practitioners" row, the
 * sitemap, "Din behandler" on treatment pages, the men's page, blog authors, structured data).
 * Each has a portrait: `image` and `crops.about` are the 4:5 team-card crop, so a slot that draws
 * `image` as it is (the men's page cards, avatars) frames the face like the team cards.
 */
export const team: TeamMember[] = teamRoster.filter(hasProfilePage);

/** A practitioner with a profile page; undefined for an unknown slug AND for a card-only member. */
export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

/** /behandlere/<slug>. Only for members of `team`: a card-only member has no page (404). */
export function teamMemberHref(slug: string): string {
  return profileHref(slug);
}

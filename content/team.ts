import type { ImageRef, PriceValue, TeamMember, TeamOffer } from "./types";
import { clinics } from "./clinics";
import { routes } from "./routes";
import { priceCards } from "./prices";
import { getTreatment } from "./treatments";
import { site } from "@/config/site";
import { practitionerBookingHref } from "@/lib/booking";
import { formatDecimal } from "@/lib/format";

/**
 * Practitioners in display order (home team grid, /om-os, /behandlere): Dr. Tom first (fagligt
 * ansvarlig læge), then the others. Every grid shows them as equal cards (the owner, 2026-10-03:
 * "alle ved siden af hinanden i 2 rækker, 3 i hver række"), so no member is `featured` any more.
 * Only Alberte has a full profile design (6alb / ma); the other profiles follow her template
 * (intro, facts, "Sådan arbejder jeg", offers, reviews, booking band) with their own facts.
 * Credentials that are not documented are left out on purpose — do not invent them.
 *
 * Sources (fetched 2026-10-03): the "Ansatte" pop-ups on https://fillox.dk/om-os/ (bio and a
 * personal quote per practitioner; "Fagansvarlig kompetence": Tom Haugland), the price list
 * (https://fillox.dk/priser/: "Næsekorrektion — Udføres af Dr. Tom", "Specialist tillæg —
 * Behandling udført af læge — Efter aftale"), the verified Trustpilot reviews in
 * content/reviews.ts and, for Kubra, the owner. No live treatment page says who performs it
 * (only the price list does, for næsekorrektion).
 * - Bios are lightly adapted; `quote` is a verbatim excerpt of the practitioner's own quote
 *   (whole sentences). "Sådan arbejder jeg" cards (first person) only rephrase that quote
 *   lightly. Where a card says more than the quote, the profile speaks in the third person
 *   ("Sådan arbejder Maria"): Maria (her quote plus what /om-os says about her), Tom (no quote:
 *   his cards rephrase Fillox's own "Hvorfor vælge Fillox" on /om-os, which he answers for as
 *   fagligt ansvarlig læge) and Kubra (no quote: Fillox's shared standards).
 * - Offers are what each one is documented to perform: Tom his specialty on /om-os
 *   ("ansigtskonturering samt næse- og hagekorrektioner"; /om-os adds "og trådløft", which is not
 *   offered any more (content/redirects.ts), so his texts leave it out too); Maria "Fillers & Botox" (/om-os) plus her reviews (lip filler,
 *   Botox, filler, skinbooster); Annika and Mike their reviews (Annika: lip filler, Botox,
 *   fillers, skinbooster/Sunekos; Mike: lip filler, Botox, fillers incl. hage); Kubra the three
 *   areas the owner confirmed (fillers, rynkebehandling, hudforbedring). Names, short texts and
 *   prices come from content/treatments.ts and the price list (content/prices.ts), so they
 *   never drift from /priser.
 * - An offer's `treatmentSlug` also makes treatment pages without a practitioner of their own
 *   pick the first member who offers it as "Din behandler" (components/treatment/treatmentView.ts).
 *   So only treatments whose page already has its practitioner (lip filler → Maria, botox →
 *   Annika, næsekorrektion → Tom, skinbooster and Alberte's offers → Alberte, who comes first)
 *   carry one; Tom's chin and contouring offers, the nurses' "Fillers i ansigtet" and Kubra's
 *   Profhilo are unlinked, so kindben, kæbelinje, hage and Profhilo keep their pages as they are.
 * - `experience` only where it is documented: Tom (education and roles on /om-os, and "Annika
 *   er uddannet … i Fillox af Dr. Tom"). The others have no dated education on the live site.
 *
 * Customer reviews are not kept here: every profile shows the verified Trustpilot reviews that
 * name the practitioner (content/reviews.ts → reviewSets.practitioners), filled up with general
 * reviews; a member without reviews of their own (Kubra) shows none. `profile.reviews` is
 * deprecated and ignored.
 *
 * Card links: every member has `profile.offers`, so every card says "Se hvad X tilbyder".
 *
 * Image crops: `image` is the photo with its default crop (avatars). The team grids and the
 * profile hero frame it from the face table at the bottom (framedPortrait): `crops.about` is the
 * 4:5 team-card crop (teamSlots.portrait); the components ask for the squarer one
 * (teamSlots.square) and the hero crops themselves. `crops.practitioner` reproduces a zoomed
 * image-slot crop from design-reference/.image-slots.state.json (s6bx-annika).
 */

const profileHref = (slug: string) => `${routes.practitioners}/${slug}`;
/** Booking link that preselects a practitioner: /booking?behandler=<slug> (lib/booking.ts). */
const bookWith = practitionerBookingHref;

/** A clinic's full name (content/clinics.ts), e.g. "Fillox City2". */
function clinicName(slug: string): string {
  const clinic = clinics.find((c) => c.slug === slug);
  if (!clinic) throw new Error(`team: no clinic "${slug}"`);
  return clinic.fullName;
}

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
  description: "Kindben, kæbelinje og hage formet med hyaluronsyre, pr. område op til 1 ml.",
  price: fromPrice("kindben", "kaebelinje", "hage"),
};

/**
 * Botox as a priced offer, under its category's name ("Rynkebehandling", as the live page
 * fillox.dk/rynkebehandling and the menus), not the brand name. Botox is a prescription medicine,
 * and a priced "Botox" card right above customer testimonials can count as advertising it to the
 * public (content/reviews.ts header, `treatmentsWithoutReviews`). The card still links to the
 * Botox page. Open legal question for the owner: README → "Før lancering" → "Anmeldelser og Botox".
 */
const wrinkleOffer: TeamOffer = treatmentOffer("botox", { name: "Rynkebehandling" });

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
 *   768px. Eye-to-mouth 10.9% of the height: Kubra's portrait fills the slot at zoom 1 with exactly
 *   that (her face is the smallest in its photo), so her photo is never enlarged; the others are
 *   zoomed to match.
 * - `square` (33:34, the mo cards' 330 × 340): the home grid from 768px (a shorter section, see
 *   components/home/Team.tsx) and the /om-os and /behandlere cards below 768px. Same headroom and
 *   face width as `portrait`.
 * The components draw the slots with `aspect-[4/5]` / `aspect-[33/34]`; keep them in step.
 */
const PORTRAIT_SLOT: Required<FaceSlot> = { aspect: 4 / 5, eyes: 0.28, face: 0.109 };
export const teamSlots = {
  portrait: PORTRAIT_SLOT,
  square: reshape(PORTRAIT_SLOT, 33 / 34),
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
 * edge keeps the eye line more than 1% off `slot.eyes` at p = 0 or 1: Annika's photo has a
 * mirror and the ceiling above her, Dr. Tom's head is close to the top edge.
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
  const place = (target: number, u: number, fitted: boolean) => {
    const d = fitted ? 1 : overflow;
    const k = 1 - zoom * d;
    // Zoom 1 on an axis the photo fills exactly: the position doesn't matter there.
    // (Within 1%: the photo can only move by that much, so centre it.)
    return Math.abs(k) < 0.01 ? 0.5 : clamp01((target - zoom * u * d) / k);
  };
  const x = place(0.5, face.x, byWidth);
  const y = place(slot.eyes, face.eyes, !byWidth);
  return { ...image, position: `${pct(x)} ${pct(y)}`, zoom: zoom === 1 ? undefined : zoom };
}

const members: TeamMember[] = [
  {
    slug: "tom",
    name: "Dr. Tom",
    fullName: "Dr. Tom Haugland",
    role: "Æstetisk læge",
    title: "Æstetisk læge · Daglig leder",
    image: {
      src: "/images/team/tom.jpg",
      alt: "Dr. Tom Haugland, æstetisk læge hos Fillox",
      position: "50% 50%",
      width: 509,
      height: 800,
    },
    // Also the "Din behandler" text on /behandlinger/naesekorrektion (no practitionerText there).
    bio: "Tom er uddannet læge i Oslo og daglig leder i Fillox-kæden. Hans specialområde er ansigtskonturering samt næse- og hagekorrektioner med hyaluronsyrefillere. Han er fagligt ansvarlig læge i Fillox, og næsekorrektioner udføres af ham.",
    bioShort:
      "Uddannet læge i Oslo og fagligt ansvarlig i Fillox. Specialområde: ansigtskonturering samt næse- og hagekorrektioner.",
    link: { label: "Se hvad Dr. Tom tilbyder", href: profileHref("tom") },
    bookingHref: bookWith("tom"),
    profile: {
      intro:
        "Tom er uddannet læge i Oslo og daglig leder i Fillox-kæden. Hans specialområde er ansigtskonturering samt næse- og hagekorrektioner med hyaluronsyrefillere, og han er fagligt ansvarlig læge i Fillox.",
      introShort:
        "Tom er uddannet læge i Oslo og daglig leder i Fillox. Specialområde: ansigtskonturering samt næse- og hagekorrektioner.",
      primaryCta: { label: "Book tid hos Dr. Tom", href: bookWith("tom") },
      secondaryCta: seeTreatments,
      facts: [
        { label: "Uddannet", value: "Læge i Oslo" },
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
      // Tom"; /priser: "Næsekorrektion — Udføres af Dr. Tom". No years are documented.
      experience: {
        title: "Uddannelse & ansvar",
        items: [
          { period: "Uddannelse", text: "Uddannet læge i Oslo." },
          { period: "Ledelse", text: "Daglig leder i Fillox-kæden." },
          {
            period: "Fagligt ansvar",
            periodShort: "Ansvar",
            text: "Fagligt ansvarlig læge i Fillox. Næsekorrektioner udføres af Tom.",
          },
          { period: "Undervisning", text: "Har uddannet Annika som kosmetisk sygeplejerske i Fillox." },
        ],
      },
      booking: {
        title: "Book tid hos Dr. Tom",
        text: "Vælg behandling og klinik. Behandling hos læge har et specialist-tillæg efter aftale.",
        cta: { label: "Book tid hos Dr. Tom", href: bookWith("tom") },
      },
    },
  },
  {
    slug: "alberte",
    name: "Alberte",
    // No `title`: the live site gives Alberte none, so cards and her profile show the role.
    role: "Behandler",
    image: {
      src: "/images/team/alberte.jpg",
      alt: "Alberte, behandler hos Fillox",
      position: "50% 50%",
      width: 1728,
      height: 2304,
    },
    // TODO: fact check (owner): the live site gives Alberte no title, education or clinic, and
    // nothing places her at a clinic (the homepage puts Annika at City2). Her profession, her
    // clinics and what she performs are unconfirmed: the offers below are the design's, and they
    // include injections (Skinbooster, PRF) while the live site says all treatments are done by
    // doctors and nurses. Until confirmed, the design's unsourced claims are left out: the title
    // "Kosmetisk behandler", the clinics (City2 & Amager), the specialty "Laser &
    // hudforbedring", the "Erfaring & uddannelse" timeline (2021 kosmetolog, 2022 laser/IPL,
    // 2023 Fillox, løbende kurser) and the design's sample review (her real Trustpilot reviews are
    // in content/reviews.ts). bio, bioShort, intro and the
    // facts come from her "Ansatte" pop-up and quote on https://fillox.dk/om-os/.
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
      // s6alb-hero
      heroImage: {
        src: "/images/team/alberte.jpg",
        alt: "Alberte, behandler hos Fillox",
        position: "42% 62%",
        zoom: 1.19,
        width: 1728,
        height: 2304,
      },
      primaryCta: { label: "Book tid hos Alberte", href: bookWith("alberte") },
      secondaryCta: { label: "Se behandlinger", href: "#behandlinger" },
      // From her quote on /om-os ("Min tilgang er at forbedre og ikke forandre", "fremhæve hver
      // kundes naturlige skønhed og skabe eller bevare harmoni"); the Trustpilot score is
      // Fillox's overall score (site.trustpilot), so it says so.
      facts: [
        { label: "Tilgang", value: "Forbedre, ikke forandre" },
        { label: "Fokus", value: "Naturlig skønhed & harmoni" },
        { label: "Fillox på Trustpilot", value: `${formatDecimal(site.trustpilot.score)} ★` },
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
        // Microneedling 1 behandling 999, skinboosters from 1.499 (Ejal 40), Signatur behandling
        // 999, PRF Hud 1 behandling 2.499; the fillers consultation (v. kosmetisk sygeplejerske)
        // is free.
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
          consultationOffer("Alberte"),
        ],
      },
      // No `experience` until the owner supplies a sourced one (see the TODO above): add it once
      // her education is confirmed. Her reviews: content/reviews.ts (Trustpilot reviews that
      // name her).
      booking: {
        title: "Book tid hos Alberte",
        text: "Vælg behandling og klinik. Første konsultation er altid gratis.",
        cta: { label: "Book tid hos Alberte", href: bookWith("alberte") },
      },
    },
  },
  {
    slug: "annika",
    name: "Annika",
    role: "Sygeplejerske",
    title: "Kosmetisk sygeplejerske",
    image: {
      src: "/images/team/annika.jpg",
      alt: "Annika, kosmetisk sygeplejerske hos Fillox",
      position: "50% 50%",
      width: 1440,
      height: 1920,
    },
    crops: {
      // s6bx-annika (Botox page, "Din behandler")
      practitioner: {
        src: "/images/team/annika.jpg",
        alt: "Annika, kosmetisk sygeplejerske hos Fillox",
        position: "48% 69%",
        zoom: 1.36,
        width: 1440,
        height: 1920,
      },
    },
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
      // Her quote on /om-os: "Jeg brænder for et naturligt resultat … Kundetilfredshed er min
      // højeste prioritet". The title above already says "Kosmetisk sygeplejerske".
      facts: [
        { label: "Uddannet af", value: "Dr. Tom i Fillox" },
        { label: "Fokus", value: "Naturlige resultater" },
        { label: "Prioritet", value: "Kundetilfredshed" },
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
      // (Sunekos). The Botox page already has her as "Din behandler" (treatments.ts).
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
        text: "Vælg behandling og klinik. Første konsultation er altid gratis.",
        cta: { label: "Book tid hos Annika", href: bookWith("annika") },
      },
    },
  },
  {
    slug: "maria",
    name: "Maria",
    role: "Sygeplejerske",
    // mo / mb spell it "Fillers & botox"; the brand name is capitalised everywhere instead (live:
    // "Fillers & Botox-behandlinger"), so the title matches the bio under it on the same card.
    title: "Sygeplejerske · Fillers & Botox",
    image: {
      src: "/images/team/maria.jpg",
      alt: "Maria, sygeplejerske hos Fillox",
      position: "50% 50%",
      width: 533,
      height: 800,
    },
    crops: {
      // s6c-maria (Lip filler page) has no stored crop: centred.
      practitioner: {
        src: "/images/team/maria.jpg",
        alt: "Maria, sygeplejerske hos Fillox",
        position: "50% 50%",
        width: 533,
        height: 800,
      },
    },
    bio: "Maria er en detaljeorienteret og holistisk sygeplejerske med flere års erfaring. Hun er ekspert i både fillers og Botox, med sans for det naturlige resultat.",
    bioShort: "Detaljeorienteret og holistisk, med flere års erfaring og ekspert i fillers og Botox.",
    quote: "“At se mine tilfredse kunder smile er en af de største glæder, jeg har, både professionelt og personligt.”",
    link: { label: "Se hvad Maria tilbyder", href: profileHref("maria") },
    bookingHref: bookWith("maria"),
    profile: {
      intro:
        "Maria er en detaljeorienteret og holistisk sygeplejerske med flere års erfaring inden for æstetiske behandlinger. Hun er ekspert i både fillers og Botox og kombinerer behandlinger til skræddersyede løsninger, med sans for det naturlige resultat.",
      introShort:
        "Maria er sygeplejerske med flere års erfaring og ekspert i både fillers og Botox, med sans for det naturlige resultat.",
      primaryCta: { label: "Book tid hos Maria", href: bookWith("maria") },
      secondaryCta: seeTreatments,
      facts: [
        { label: "Specialer", value: "Fillers & Botox" },
        { label: "Tilgang", value: "Holistisk & detaljeorienteret" },
        { label: "Fokus", value: "Skræddersyede løsninger" },
      ],
      // In the third person, as on Tom's profile: only the first card is her own words (her quote
      // on /om-os: "Det vigtigste for mig er, at mine kunder føler sig trygge ved, at deres behov
      // bliver mødt, og at deres naturlige skønhed fremhæves"); the other two are what the clinic
      // says about her there ("Hun kan med sin erfaring og kompetencer kombinere og tilbyde
      // skræddersyet løsninger", "hendes øje for kvalitet og sans for det naturlige resultat").
      approach: {
        eyebrow: "Sådan arbejder Maria",
        title: "Det kan du regne med hos Maria",
        items: [
          {
            title: "Dine behov i centrum",
            text: "Det vigtigste for Maria er, at du føler dig tryg ved, at dine behov bliver mødt, og at din naturlige skønhed fremhæves.",
            textShort: "Du skal føle dig tryg ved, at dine behov bliver mødt.",
          },
          {
            title: "Skræddersyet til dig",
            text: "Med sin erfaring kombinerer Maria behandlinger og skræddersyr en løsning, der passer til dig.",
            textShort: "Maria kombinerer behandlinger til en løsning, der passer til dig.",
          },
          {
            title: "Øje for kvalitet",
            text: "Maria har øje for kvalitet og sans for det naturlige resultat.",
            textShort: "Med sans for det naturlige resultat.",
          },
        ],
      },
      // /om-os: "ekspert i både Fillers & Botox-behandlinger"; her Trustpilot reviews: lip filler,
      // Botox, filler and skinbooster. The lip filler page already has her as "Din behandler".
      offers: {
        ...offersCopy("Maria"),
        items: [
          treatmentOffer("lip-filler"),
          wrinkleOffer,
          facialFillers,
          treatmentOffer("skinbooster"),
          consultationOffer("Maria"),
          followUpOffer,
        ],
      },
      booking: {
        title: "Book tid hos Maria",
        text: "Vælg behandling og klinik. Første konsultation er altid gratis.",
        cta: { label: "Book tid hos Maria", href: bookWith("maria") },
      },
    },
  },
  {
    slug: "mike",
    name: "Mike",
    role: "Sygeplejerske",
    title: "Kosmetisk sygeplejerske",
    image: {
      src: "/images/team/mike.jpg",
      alt: "Mike, kosmetisk sygeplejerske hos Fillox",
      position: "50% 50%",
      width: 1602,
      height: 1920,
    },
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
      // /om-os: "udvidet sin ekspertise … gennem løbende uddannelse"; his quote: "tilpasse mine
      // behandlinger til klientens ønsker og behov … at klienten føler sig tryg og tilfreds".
      facts: [
        { label: "Udvikling", value: "Løbende uddannelse" },
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
        text: "Vælg behandling og klinik. Første konsultation er altid gratis.",
        cta: { label: "Book tid hos Mike", href: bookWith("mike") },
      },
    },
  },
  {
    slug: "kubra",
    name: "Kubra",
    // Confirmed by the owner (2026-10-03): kosmetisk sygeplejerske, works at City2, performs
    // fillers, rynkebehandling (botox) and hudforbedring (skinbooster, Profhilo, microneedling,
    // PRF hud); photo public/images/team/kubra.jpg. Nothing else is known yet, so her texts only
    // say that: no education, years, specialities or quote of her own, and no experience block.
    // The owner also called her part of "the Copenhagen team"; her texts don't say so, because
    // City2 is in Taastrup (content/clinics.ts), not København. No Trustpilot review names her,
    // so her profile shows no reviews (components/practitioner/profile.ts → ownReviews).
    // TODO: copy review — KUBRA MUST APPROVE before launch: the intro, the "Sådan arbejder Kubra"
    // cards and especially the QUOTE are the owner's request ("skriv noget fedt, hun er mega cool")
    // written by us, not her own words. Replace or confirm them with her (2026-10-03).
    role: "Sygeplejerske",
    title: "Kosmetisk sygeplejerske",
    image: {
      // A 4:5 crop of the owner's landscape photo (1600 × 898, kept as
      // design-reference/uploads/kubra-original.jpg), full height and centred on her face, cut
      // losslessly (jpegtran). The landscape file was drawn up to 2.2× its size in the portrait
      // slots; this one fills them as the other portraits do.
      src: "/images/team/kubra.jpg",
      alt: "Kubra, kosmetisk sygeplejerske hos Fillox",
      position: "50% 30%",
      width: 716,
      height: 895,
    },
    clinicSlugs: ["city2"],
    bio: `Kosmetisk sygeplejerske i ${clinicName("city2")} med en rolig hånd, et skarpt øje og et humør, der smitter. Hun udfører fillers, rynkebehandling og hudforbedring.`,
    quote: "“Det bedste resultat er, når dine venner siger, at du ser udhvilet ud, og ingen kan regne ud hvorfor.”",
    bioShort: `Kosmetisk sygeplejerske i ${clinicName("city2")} med en rolig hånd og et humør, der smitter.`,
    link: { label: "Se hvad Kubra tilbyder", href: profileHref("kubra") },
    bookingHref: bookWith("kubra"),
    profile: {
      intro: `Kubra er kosmetisk sygeplejerske i ${clinicName("city2")}, og hun er svær ikke at kunne lide. Hun har en rolig hånd, et skarpt øje for ansigtets proportioner og et humør, der gør, at du næsten glemmer, at du sidder i en behandlerstol. Hos Kubra får du et ærligt råd, også når svaret er, at du ikke har brug for mere.`,
      introShort: `Kosmetisk sygeplejerske i ${clinicName("city2")} med en rolig hånd, et skarpt øje og et humør, der smitter.`,
      primaryCta: { label: "Book tid hos Kubra", href: bookWith("kubra") },
      secondaryCta: seeTreatments,
      // Her clinic and treatment areas (the owner); the Trustpilot score is Fillox's overall
      // score (site.trustpilot), so it says so, as on Alberte's profile.
      facts: [
        { label: "Arbejder i", value: clinicName("city2") },
        // The owner's three areas, by category: the brand name stays off the fact cards.
        { label: "Behandlinger", value: "Fillers, rynkebehandling & hudforbedring" },
        { label: "Fillox på Trustpilot", value: `${formatDecimal(site.trustpilot.score)} ★` },
      ],
      // Fillox's shared standards, not her words (see the TODO above): "Hos Fillox udføres alle
      // behandlinger af læger og sygeplejersker", "en solid vurdering forud for behandlingen",
      // "personligt tilpasset din ansigtsanatomi og dine forventninger" (/om-os), and the free
      // konsultation and kontrol of the price list.
      approach: {
        eyebrow: "Sådan arbejder Kubra",
        title: "Frisk, ærligt og med et smil",
        items: [
          {
            title: "Naturligt først",
            text: "Målet er, at folk siger, du ser frisk ud, ikke at du har fået lavet noget.",
            textShort: "Du skal se frisk ud, ikke behandlet.",
          },
          {
            title: "Ærlige svar",
            text: "Du får at vide, hvad der giver mening for dig, og hvad der ikke gør. Også når det betyder mindre behandling.",
            textShort: "Også når svaret er mindre behandling.",
          },
          {
            title: "God stemning",
            text: "Nervøs? Helt normalt. Kubra forklarer hvert trin, så du ved, hvad der sker, og du må gerne grine undervejs.",
            textShort: "Hun forklarer hvert trin, og du må gerne grine.",
          },
        ],
      },
      // Her three areas: fillers, rynkebehandling and hudforbedring (the owner), with every
      // treatment of them that has a page; 9 cards fill three rows of three. Profhilo is unlinked
      // (see "Offers" in the header): no one else offers it, so a link would make her the
      // Profhilo page's "Din behandler".
      offers: {
        ...offersCopy("Kubra"),
        items: [
          treatmentOffer("lip-filler"),
          facialFillers,
          wrinkleOffer,
          treatmentOffer("skinbooster"),
          { ...treatmentOffer("profhilo"), treatmentSlug: undefined },
          treatmentOffer("microneedling"),
          treatmentOffer("prf-hud"),
          consultationOffer("Kubra"),
          followUpOffer,
        ],
      },
      booking: {
        title: "Book tid hos Kubra",
        text: `Første konsultation er altid gratis, og Kubra glæder sig til at møde dig i ${clinicName("city2")}.`,
        cta: { label: "Book tid hos Kubra", href: bookWith("kubra") },
      },
    },
  },
];

/**
 * Faces in each member's `image` (see faceCrop), measured on the files. A member without one
 * keeps `image`'s own crop in the team grids and the profile hero.
 */
const faces: Record<string, Face> = {
  tom: { x: 0.505, eyes: 0.21, mouth: 0.296 },
  alberte: { x: 0.52, eyes: 0.365, mouth: 0.435 },
  annika: { x: 0.5, eyes: 0.41, mouth: 0.505 },
  maria: { x: 0.45, eyes: 0.23, mouth: 0.315 },
  mike: { x: 0.495, eyes: 0.31, mouth: 0.385 },
  kubra: { x: 0.5, eyes: 0.278, mouth: 0.387 },
};

/**
 * `member.image` framed for `slot` from the face table (team cards, the profile hero), or
 * `fallback` (default: the image's own crop) for a member whose face is not measured.
 */
export function framedPortrait(member: TeamMember, slot: FaceSlot, fallback: ImageRef = member.image): ImageRef {
  const face = faces[member.slug];
  const { width, height } = member.image;
  if (!face || !width || !height) return fallback;
  return faceCrop({ ...member.image, width, height }, face, slot);
}

export const team: TeamMember[] = members.map((member) => ({
  ...member,
  crops: { ...member.crops, about: framedPortrait(member, teamSlots.portrait) },
}));

export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

export function teamMemberHref(slug: string): string {
  return profileHref(slug);
}

import type { TeamMember } from "./types";
import { routes } from "./routes";
import { site } from "@/config/site";
import { practitionerBookingHref } from "@/lib/booking";
import { formatDecimal } from "@/lib/format";

/**
 * Practitioners in display order (design 6a team row, 6om / mo Om os).
 * Only Alberte has a full profile design (6alb / ma); the same template renders
 * the others from name/title/bio. Credentials that are not in the design are
 * left out on purpose — do not invent them.
 *
 * Facts, bios and quotes come from the live fillox.dk: the "Ansatte" pop-ups on
 * https://fillox.dk/om-os/ (one per practitioner, with a personal quote), "Fagansvarlig
 * kompetence" on the same page, and the price list (https://fillox.dk/priser/:
 * "Næsekorrektion — Udføres af Dr. Tom"). Bios are lightly adapted; `quote` is a verbatim
 * excerpt of the practitioner's own quote. The other members' `profile` holds only the
 * hero intro and fact cards (no offers: the live site does not say who performs what,
 * and offers would also make treatment pages pick that member as "Din behandler").
 *
 * Customer reviews are not kept here: every profile shows the verified Trustpilot reviews that
 * name the practitioner (content/reviews.ts → reviewSets.practitioners), filled up with general
 * reviews. `profile.reviews` is deprecated and ignored.
 *
 * Card links: only a member with `profile.offers` gets "Se hvad X tilbyder"; the others link
 * with "Læs mere om X" (their profile has no list of treatments).
 *
 * Image crops: `image` is the default card crop (6a/mf/mo use the photos uncropped,
 * centred). `crops.*` reproduce the zoomed image-slot crops from
 * design-reference/.image-slots.state.json (s6om-*, s6bx-annika, s6alb-hero).
 */

const profileHref = (slug: string) => `${routes.practitioners}/${slug}`;
/** Booking link that preselects a practitioner: /booking?behandler=<slug> (lib/booking.ts). */
const bookWith = practitionerBookingHref;

export const team: TeamMember[] = [
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
    crops: {
      // s6om-tom: wide photo, zoom 1.63 on the face.
      about: {
        src: "/images/team/tom-wide.jpg",
        alt: "Dr. Tom Haugland, æstetisk læge og daglig leder hos Fillox",
        position: "50% 11%",
        zoom: 1.63,
      },
    },
    // Also the "Din behandler" text on /behandlinger/naesekorrektion (no practitionerText there).
    bio: "Tom er uddannet læge i Oslo og daglig leder i Fillox-kæden. Hans specialområde er ansigtskonturering samt næse- og hagekorrektioner med hyaluronsyrefillere og trådløft. Han er fagligt ansvarlig læge i Fillox, og næsekorrektioner udføres af ham.",
    bioShort:
      "Uddannet læge i Oslo og fagligt ansvarlig i Fillox. Specialområde: ansigtskonturering samt næse- og hagekorrektioner.",
    featured: true,
    link: { label: "Book tid hos Dr. Tom", href: bookWith("tom") },
    bookingHref: bookWith("tom"),
    profile: {
      intro:
        "Tom er uddannet læge i Oslo og daglig leder i Fillox-kæden. Hans specialområde er ansigtskonturering samt næse- og hagekorrektioner med hyaluronsyrefillere og trådløft, og han er fagligt ansvarlig læge i Fillox.",
      introShort:
        "Tom er uddannet læge i Oslo og daglig leder i Fillox. Specialområde: ansigtskonturering samt næse- og hagekorrektioner.",
      primaryCta: { label: "Book tid hos Dr. Tom", href: bookWith("tom") },
      facts: [
        { label: "Uddannet", value: "Læge i Oslo" },
        { label: "Specialområde", value: "Ansigtskonturering, næse & hage" },
        { label: "Rolle", value: "Fagligt ansvarlig læge" },
      ],
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
    crops: {
      // s6om-alb
      about: {
        src: "/images/team/alberte.jpg",
        alt: "Alberte, behandler hos Fillox",
        position: "38% 80%",
        zoom: 1.33,
        width: 1728,
        height: 2304,
      },
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
        eyebrow: "Behandlinger",
        title: "Det tilbyder Alberte dig",
        ctaLabel: "Book hos Alberte",
        ctaLabelShort: "Book",
        // Prices as on https://fillox.dk/priser/: laser from 500 (Overlæbe, Hage …), Microneedling
        // 1 behandling 999, skinboosters from 1.499 (Ejal 40), Signatur behandling 999, PRF Hud
        // 1 behandling 2.499; the fillers consultation (v. kosmetisk sygeplejerske) is free.
        items: [
          {
            name: "Laser hårfjerning",
            // Live (/harfjerning): diode laser, settings adapted to the skin type and hair.
            description: "Diodelaser tilpasset din hudtype og hårstruktur, fra overlæbe til hel krop.",
            price: { kind: "amount", amount: 500, from: true },
            treatmentSlug: "laser-harfjerning",
          },
          {
            name: "Microneedling",
            description: "Stimulerer hudens egen kollagen for jævnere tekstur og glød.",
            price: { kind: "amount", amount: 999, from: true },
            treatmentSlug: "microneedling",
          },
          {
            name: "Skinbooster",
            // "fra 1.499" is Ejal 40 (Profhilo from 2.499, Sunekos Performa from 1.599).
            description: "Dybdegående fugt med Profhilo, Sunekos eller Ejal 40 for frisk, strammere hud.",
            price: { kind: "amount", amount: 1499, from: true },
            treatmentSlug: "skinbooster",
          },
          {
            name: "Signatur ansigtsbehandling",
            description: "Peeling, maske og LED med Dr. Dennis\u00a0Gross.",
            price: { kind: "amount", amount: 999 },
            treatmentSlug: "signatur-ansigtsbehandling",
          },
          {
            name: "PRF hud",
            description: "Kroppens egne vækstfaktorer til naturlig hudforbedring.",
            price: { kind: "amount", amount: 2499 },
            treatmentSlug: "prf-hud",
          },
          {
            name: "Gratis konsultation",
            description: "Usikker på, hvad du har brug for? Alberte hjælper dig med en plan.",
            price: { kind: "free", label: "gratis" },
          },
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
      // s6om-ann
      about: {
        src: "/images/team/annika.jpg",
        alt: "Annika, kosmetisk sygeplejerske hos Fillox",
        position: "42% 76%",
        zoom: 1.37,
        width: 1440,
        height: 1920,
      },
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
    link: { label: "Læs mere om Annika", href: profileHref("annika") },
    bookingHref: bookWith("annika"),
    profile: {
      intro:
        "Annika er uddannet kosmetisk sygeplejerske i Fillox af Dr. Tom og har stor viden inden for det æstetiske felt. Hun brænder for et naturligt resultat, og hendes behandlinger bygger på solid viden, kvalitet og professionalisme.",
      introShort:
        "Annika er kosmetisk sygeplejerske, uddannet i Fillox af Dr. Tom. Hun brænder for et naturligt resultat.",
      primaryCta: { label: "Book tid hos Annika", href: bookWith("annika") },
      // Her quote on /om-os: "Jeg brænder for et naturligt resultat … Kundetilfredshed er min
      // højeste prioritet". The title above already says "Kosmetisk sygeplejerske".
      facts: [
        { label: "Uddannet af", value: "Dr. Tom i Fillox" },
        { label: "Fokus", value: "Naturlige resultater" },
        { label: "Prioritet", value: "Kundetilfredshed" },
      ],
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
      // s6om-mar
      about: {
        src: "/images/team/maria.jpg",
        alt: "Maria, sygeplejerske hos Fillox",
        position: "54% 15%",
        zoom: 1.24,
        width: 533,
        height: 800,
      },
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
    quote: "“At se mine tilfredse kunder smile er en af de største glæder, jeg har.”",
    link: { label: "Læs mere om Maria", href: profileHref("maria") },
    bookingHref: bookWith("maria"),
    profile: {
      intro:
        "Maria er en detaljeorienteret og holistisk sygeplejerske med flere års erfaring inden for æstetiske behandlinger. Hun er ekspert i både fillers og Botox og kombinerer behandlinger til skræddersyede løsninger, med sans for det naturlige resultat.",
      introShort:
        "Maria er sygeplejerske med flere års erfaring og ekspert i både fillers og Botox, med sans for det naturlige resultat.",
      primaryCta: { label: "Book tid hos Maria", href: bookWith("maria") },
      facts: [
        { label: "Specialer", value: "Fillers & Botox" },
        { label: "Tilgang", value: "Holistisk & detaljeorienteret" },
        { label: "Fokus", value: "Skræddersyede løsninger" },
      ],
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
    crops: {
      // s6om-mik
      about: {
        src: "/images/team/mike.jpg",
        alt: "Mike, kosmetisk sygeplejerske hos Fillox",
        position: "43% 51%",
        zoom: 1.19,
        width: 1602,
        height: 1920,
      },
    },
    bio: "Mike er kvalificeret kosmetisk sygeplejerske og har udvidet sin ekspertise gennem løbende uddannelse. Han tilpasser behandlingen til dine ønsker og behov.",
    bioShort: "Tilpasser behandlingen til dine ønsker og behov, med et naturligt resultat som mål.",
    quote: "“Det vigtigste for mig er, at klienten føler sig tryg og tilfreds.”",
    link: { label: "Læs mere om Mike", href: profileHref("mike") },
    bookingHref: bookWith("mike"),
    profile: {
      intro:
        "Mike er kvalificeret kosmetisk sygeplejerske og har udvidet sin ekspertise gennem løbende uddannelse. Han tilpasser behandlingen til dine ønsker og behov, og hans mål er et naturligt smukt resultat, der fremhæver din naturlige skønhed.",
      introShort:
        "Mike er kosmetisk sygeplejerske og tilpasser behandlingen til dine ønsker og behov, med et naturligt resultat som mål.",
      primaryCta: { label: "Book tid hos Mike", href: bookWith("mike") },
      // /om-os: "udvidet sin ekspertise … gennem løbende uddannelse"; his quote: "tilpasse mine
      // behandlinger til klientens ønsker og behov … at klienten føler sig tryg og tilfreds".
      facts: [
        { label: "Udvikling", value: "Løbende uddannelse" },
        { label: "Tilgang", value: "Dine ønsker & behov" },
        { label: "Fokus", value: "Tryghed & tilfredshed" },
      ],
    },
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

export function teamMemberHref(slug: string): string {
  return profileHref(slug);
}

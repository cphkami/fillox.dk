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
    bio: "Tom er uddannet læge i Oslo og daglig leder i Fillox. Hans specialområde er ansigtskonturering samt næse- og hagekorrektioner med hyaluronsyrefillere og trådløft. Han er fagligt ansvarlig for alle behandlinger og har selv uddannet flere af klinikkens sygeplejersker.",
    bioShort:
      "Specialist i ansigtskonturering samt næse- og hagekorrektioner. Fagligt ansvarlig for alle behandlinger.",
    featured: true,
    link: { label: "Book tid hos Dr. Tom", href: bookWith("tom") },
    bookingHref: bookWith("tom"),
  },
  {
    slug: "alberte",
    name: "Alberte",
    role: "Behandler",
    title: "Kosmetisk behandler",
    image: {
      src: "/images/team/alberte.jpg",
      alt: "Alberte, kosmetisk behandler hos Fillox",
      position: "50% 50%",
      width: 1728,
      height: 2304,
    },
    crops: {
      // s6om-alb
      about: {
        src: "/images/team/alberte.jpg",
        alt: "Alberte, kosmetisk behandler hos Fillox",
        position: "38% 80%",
        zoom: 1.33,
        width: 1728,
        height: 2304,
      },
    },
    bio: "Alberte holder sig konstant orienteret inden for den nyeste viden og de seneste fremskridt i den kosmetiske verden.",
    bioShort: "Holder sig altid opdateret med den nyeste viden inden for laser og hudforbedring.",
    link: { label: "Se hvad Alberte tilbyder", href: profileHref("alberte") },
    bookingHref: bookWith("alberte"),
    clinicSlugs: ["city2", "amager-centret"],
    profile: {
      intro:
        "Alberte holder sig konstant orienteret inden for den nyeste viden og de seneste fremskridt i den kosmetiske verden. Hendes drivkraft er at hjælpe mennesker med at blive den bedste version af sig selv, med resultater der forbedrer frem for at forandre.",
      introShort:
        "Alberte holder sig altid orienteret i den nyeste viden. Hendes drivkraft er resultater, der forbedrer frem for at forandre.",
      // s6alb-hero
      heroImage: {
        src: "/images/team/alberte.jpg",
        alt: "Alberte, kosmetisk behandler hos Fillox",
        position: "42% 62%",
        zoom: 1.19,
        width: 1728,
        height: 2304,
      },
      primaryCta: { label: "Book tid hos Alberte", href: bookWith("alberte") },
      secondaryCta: { label: "Se behandlinger", href: "#behandlinger" },
      facts: [
        { label: "Arbejder i", value: "City2 & Amager" },
        { label: "Specialer", value: "Laser & hudforbedring" },
        { label: "Trustpilot", value: `${formatDecimal(site.trustpilot.score)} ★ fra sine kunder` },
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
        items: [
          {
            name: "Laser hårfjerning",
            description: "Permanent hårfjerning til alle hudtyper, fra overlæbe til hel krop.",
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
            description: "Dybdegående fugt med Profhilo eller Sunekos for frisk, strammere hud.",
            price: { kind: "amount", amount: 1499, from: true },
            treatmentSlug: "skinbooster",
          },
          {
            name: "Signatur ansigtsbehandling",
            description: "Peeling, maske og LED med Dr. Dennis Gross.",
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
      experience: {
        title: "Erfaring & uddannelse",
        items: [
          { period: "2023 –", periodShort: "2023", text: "Kosmetisk behandler hos Fillox" },
          { period: "2022", text: "Certificeret i laser og IPL" },
          { period: "2021", text: "Uddannet kosmetolog" },
          {
            period: "Løbende",
            text: "Kurser i hudforbedring og nye teknikker",
            textShort: "Kurser i hudforbedring",
          },
        ],
      },
      reviews: [
        {
          quote:
            "Alberte er så grundig og rolig. Hun forklarede alt undervejs, og resultatet er præcis, hvad jeg håbede på.",
          quoteShort: "Alberte er så grundig og rolig. Resultatet er præcis, hvad jeg håbede på.",
          author: "Camilla",
          source: "Trustpilot",
          rating: 5,
        },
      ],
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
    bio: "Annika er uddannet kosmetisk sygeplejerske i Fillox af Dr. Tom og har stor viden om de forskellige behandlinger og muligheder.",
    bioShort: "Uddannet i Fillox af Dr. Tom, med stor viden om behandlinger og muligheder.",
    authorBio: "Kosmetisk sygeplejerske, uddannet i Fillox af Dr. Tom.",
    link: { label: "Se hvad Annika tilbyder", href: profileHref("annika") },
    bookingHref: bookWith("annika"),
  },
  {
    slug: "maria",
    name: "Maria",
    role: "Sygeplejerske",
    title: "Sygeplejerske · Fillers & Botox",
    // mo / mb spell it with a lowercase "botox".
    titleShort: "Sygeplejerske · Fillers & botox",
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
    bio: "Maria er en detaljeorienteret og holistisk sygeplejerske med flere års erfaring og ekspert i både fillers og botox.",
    bioShort: "Detaljeorienteret og holistisk, med flere års erfaring med fillers og botox.",
    link: { label: "Se hvad Maria tilbyder", href: profileHref("maria") },
    bookingHref: bookWith("maria"),
  },
  {
    slug: "mike",
    name: "Mike",
    role: "Behandler",
    title: "Kosmetisk behandler",
    image: {
      src: "/images/team/mike.jpg",
      alt: "Mike, kosmetisk behandler hos Fillox",
      position: "50% 50%",
      width: 1602,
      height: 1920,
    },
    crops: {
      // s6om-mik
      about: {
        src: "/images/team/mike.jpg",
        alt: "Mike, kosmetisk behandler hos Fillox",
        position: "43% 51%",
        zoom: 1.19,
        width: 1602,
        height: 1920,
      },
    },
    bio: "Mike har mange års erfaring i den kosmetiske branche og er kendt for sin rolige tilgang og skarpe øje for detaljer.",
    bioShort: "Kendt for sin rolige tilgang og sit skarpe øje for detaljer.",
    link: { label: "Se hvad Mike tilbyder", href: profileHref("mike") },
    bookingHref: bookWith("mike"),
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

export function teamMemberHref(slug: string): string {
  return profileHref(slug);
}

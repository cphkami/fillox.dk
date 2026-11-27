import type { Clinic, OpeningHours } from "./types";
import { withBookingLinks } from "@/lib/booking";

/*
 * Facts (addresses, opening hours, notes) are from the live site, fillox.dk/kontakt
 * (checked 1 October 2026). Day labels must be listed in content/seo.ts `openingDays` so the
 * structured data (JSON-LD) can read them; mobile spells them out via content/pages/clinics.ts
 * `card.daysLong`. Sunday is shown as closed at every clinic (`closedSunday`); the structured data
 * leaves closed days out (schema.org: a day without hours is closed).
 */

/**
 * Sunday, closed, at all four clinics. Alberte 2026-11-26 (forwarded by the owner): "City2 og Amager
 * skal begge stå som lukket om søndagen"; Frederiksberg and Østerbro are closed on Sundays too
 * (fillox.dk/kontakt: "Søndag: Lukket"; the owner on 25 November: "søndag er der lukket"), so every
 * clinic says it the same way. Until 2026-11-27 the closed day was simply not listed. `closed`: the
 * structured data skips it (components/seo/OrganizationJsonLd.tsx), check:market rule 8 too.
 */
// TODO: copy review (2026-11-27, Alberte)
const closedSunday: OpeningHours = { days: "Søn", hours: "lukket", closed: true };

/**
 * City2 and Amager Centret (shopping centres) share their hours. fillox.dk/kontakt:
 * "Hverdage: 10 – 19", "Weekend: 10 – 17". (The live site's mobile-only City2 block says
 * "Weekend: 10 – 19"; the desktop block, kept here, says 10 – 17 like Amager Centret.)
 * Closed on Sundays since Alberte 2026-11-26 (forwarded by the owner): "City2 og Amager skal begge
 * stå som lukket om søndagen" (was "Lør–søn 10–17"), shown as "Søn lukket" (`closedSunday`).
 */
// City2 confirmed by the owner, 2026-11-27: "City2: Hverdage: 10 – 19, Weekend: 10 – 17" (so Saturday
// is 10–17, not the mobile block's 10–19).
// TODO: owner to confirm Sunday at City2: that answer says "Weekend 10–17", Alberte (2026-11-26) says
// closed on Sundays. Shown as closed until they say which (README). Amager Centret's Saturday hours
// are not confirmed either (it shares City2's).
// TODO: copy review (2026-11-26, Alberte)
const centreHours: OpeningHours[] = [
  { days: "Man–fre", hours: "10–19" },
  { days: "Lør", hours: "10–17" },
  closedSunday,
];

/**
 * Home page (6a / mf) line of the same hours, in the other clinics' words ("Man–tir 8–20 · Ons–fre
 * 8–16 · Lør 9–17"). Was fillox.dk/kontakt's "Hverdage 10–19 · Weekend 10–17": with Sunday closed,
 * the weekend is Saturday only.
 */
const centreHoursSummary = "Man–fre 10–19 · Lør 10–17 · Søn lukket";

/**
 * Frederiksberg and Østerbro share their hours. Alberte 2026-11-26 (forwarded by the owner):
 * "Østerbro og Frederiksberg skal vise samme åbningstider"; the owner answered the same evening
 * that Frederiksberg's hours are the right ones and Østerbro gets the same. Frederiksberg's are
 * fillox.dk/kontakt's: "Man – Tir: 08:00 – 20:00", "Ons – Fre: 08:00 – 16:00", "Lørdag: 09:00 –
 * 17:00", "Søndag: Lukket". Østerbro had the owner's 25 November hours ("9-18 i hverdagene og
 * 10-17 lørdag, søndag er der lukket"). The owner confirmed on 2026-11-27: "de tider frb har er de
 * rigtige tider".
 */
// TODO: copy review (2026-11-26, Alberte)
const streetHours: OpeningHours[] = [
  { days: "Man–tir", hours: "8–20" },
  { days: "Ons–fre", hours: "8–16" },
  { days: "Lør", hours: "9–17" },
  closedSunday,
];
const streetHoursSummary = "Man–tir 8–20 · Ons–fre 8–16 · Lør 9–17 · Søn lukket";

/**
 * Clinics in display order (design 6kl / footer).
 *
 * Booking (design mm2: "each clinic has its own booking link"): `booking` holds the clinic's
 * id at the booking provider, and withBookingLinks() (lib/booking.ts) derives `bookingHref`
 * from it: "/booking?geckoCalendarId=12" with a Gecko calendar id (Gecko's iframe.js then
 * preselects the clinic), otherwise "/booking?klinik=city2".
 *
 * `geo` and `directionsHref` ("Rutevejledning", JSON-LD hasMap): the live site's footer map links
 * (maps.app.goo.gl), resolved to their Google Maps place (tracking parameters removed), so they
 * open the exact listing / pin rather than a search.
 */
export const clinics: Clinic[] = withBookingLinks([
  {
    slug: "city2",
    name: "City2",
    fullName: "Fillox City2",
    // fillox.dk/kontakt (mobile block + its map): "Cityringen 2, Plan 3, 2630 Taastrup".
    // TODO: owner to confirm the street number: the desktop block on fillox.dk/kontakt says
    // "Cityringen 4, 2630 Taastrup" (also City2's own centre address on city2.dk), so
    // "Cityringen 2" rests only on the mobile block and the map embed. Use whatever the Fillox
    // City2 Google Business Profile lists, so name / address / phone match it (local SEO).
    address: ["Cityringen 2, Plan 3", "2630 Taastrup"],
    hours: centreHours,
    hoursSummary: centreHoursSummary,
    // TODO: add the clinic's Gecko calendar id (Gecko admin), e.g. { geckoCalendarId: "12" }, to preselect it.
    booking: {},
    // fillox.dk/kontakt: "Fillox Ligger på Plan 3 i City2."
    note: "Fillox ligger på plan 3 i City2.",
    // maps.app.goo.gl/Ts9kwrDak9RrQWwd6 → Google place "Fillox".
    directionsHref:
      "https://www.google.com/maps/place/Fillox/@55.6436784,12.2722807,17z/data=!3m1!4b1!4m6!3m5!1s0x4652590063d08e05:0x10229566d931aa06!8m2!3d55.6436755!4d12.2771516!16s%2Fg%2F11vzbxq_rc",
    status: "open",
    geo: { latitude: 55.6436755, longitude: 12.2771516 },
  },
  {
    slug: "amager-centret",
    name: "Amager Centret",
    fullName: "Fillox Amager Centret",
    address: ["Reberbanegade 3", "2300 København S"],
    hours: centreHours,
    hoursSummary: centreHoursSummary,
    // TODO: add the clinic's Gecko calendar id (Gecko admin), e.g. { geckoCalendarId: "12" }, to preselect it.
    booking: {},
    // fillox.dk/kontakt: "Fillox ligger på 1. sal i Amager Centret".
    note: "Fillox ligger på 1. sal i Amager Centret.",
    // maps.app.goo.gl/Vc9TuQmDyehKFvrr7 → a pin at these coordinates (no Google place).
    directionsHref: "https://www.google.com/maps/search/?api=1&query=55.663018%2C12.604579",
    status: "open",
    geo: { latitude: 55.663018, longitude: 12.604579 },
  },
  {
    slug: "frederiksberg",
    name: "Frederiksberg",
    fullName: "Fillox Frederiksberg",
    address: ["Rathsacksvej 1", "1852 Frederiksberg"],
    // The same hours as Østerbro (streetHours above).
    hours: streetHours,
    hoursSummary: streetHoursSummary,
    // TODO: add the clinic's Gecko calendar id (Gecko admin), e.g. { geckoCalendarId: "12" }, to preselect it.
    booking: {},
    // No transport / parking note: fillox.dk has none for Frederiksberg.
    // maps.app.goo.gl/ChCW4xzJXGcjcr2h6 → Google place "Fillox Frederiksberg".
    directionsHref:
      "https://www.google.com/maps/place/Fillox+Frederiksberg/@55.6781581,12.5325816,17z/data=!3m1!4b1!4m6!3m5!1s0x465253a932969421:0xf3dc4449c9f4484!8m2!3d55.6781581!4d12.5351565!16s%2Fg%2F11zfbdtpg2",
    status: "open",
    geo: { latitude: 55.6781581, longitude: 12.5351565 },
  },
  {
    slug: "osterbro",
    name: "Østerbro",
    fullName: "Fillox Østerbro",
    // From the owner, 25 November 2026: "Nordre Frihavnsgade 13A", "2100 København Ø" (postcode and
    // the map position below checked against OpenStreetMap: Indre Østerbro).
    address: ["Nordre Frihavnsgade 13A", "2100 København Ø"],
    // The same hours as Frederiksberg (streetHours above; owner 2026-11-26, after Alberte).
    hours: streetHours,
    hoursSummary: streetHoursSummary,
    // TODO: add the clinic's Gecko calendar id (Gecko admin), e.g. { geckoCalendarId: "12" }, to
    // preselect it. Gecko's public booking page lists the clinic as "Fillox - Østerbro"
    // (behandlingssted id 14667).
    booking: {},
    // TODO (owner): the clinic's Google Maps place link (as for City2 and Frederiksberg). Until
    // then "Rutevejledning" searches Google Maps for the address.
    directionsHref:
      "https://www.google.com/maps/search/?api=1&query=Fillox%20%C3%98sterbro%2C%20Nordre%20Frihavnsgade%2013A%2C%202100%20K%C3%B8benhavn%20%C3%98",
    status: "open",
    // OpenStreetMap (Nominatim) for Nordre Frihavnsgade 13A, 2100 København Ø.
    geo: { latitude: 55.700637, longitude: 12.579201 },
  },
]);

export const openClinics = clinics.filter((c) => c.status === "open");

import type { Clinic } from "./types";
import { withBookingLinks } from "@/lib/booking";

const standardHours = [
  { days: "Man–fre", hours: "10–20" },
  { days: "Lør–søn", hours: "10–18" },
];

/** Home page (6a / mf) wording of the same hours. */
const standardHoursSummary = "Hverdage 10–20 · Weekend 10–18";

/**
 * Clinics in display order (design 6kl / footer).
 *
 * Booking (design mm2: "each clinic has its own booking link"): `booking` holds the clinic's
 * id at the booking provider, and withBookingLinks() (lib/booking.ts) derives `bookingHref`
 * from it: "/booking?geckoCalendarId=12" with a Gecko calendar id (Gecko's iframe.js then
 * preselects the clinic), otherwise "/booking?klinik=city2".
 */
export const clinics: Clinic[] = withBookingLinks([
  {
    slug: "city2",
    name: "City2",
    fullName: "Fillox City2",
    address: ["Cityringen 2, Plan 3", "2630 Høje Taastrup"],
    hours: standardHours,
    hoursSummary: standardHoursSummary,
    // TODO: add the clinic's Gecko calendar id (Gecko admin), e.g. { geckoCalendarId: "12" }, to preselect it.
    booking: {},
    note: "Gratis parkering i centret. 2 min. fra Taastrup St.",
    directionsHref: "https://www.google.com/maps/search/?api=1&query=Fillox+City2+Cityringen+2+2630+H%C3%B8je+Taastrup",
    status: "open",
  },
  {
    slug: "amager-centret",
    name: "Amager Centret",
    fullName: "Fillox Amager Centret",
    address: ["Reberbanegade 3", "2300 København S"],
    hours: standardHours,
    hoursSummary: standardHoursSummary,
    // TODO: add the clinic's Gecko calendar id (Gecko admin), e.g. { geckoCalendarId: "12" }, to preselect it.
    booking: {},
    note: "Metro: Amagerbro St. Parkering i centret.",
    directionsHref: "https://www.google.com/maps/search/?api=1&query=Fillox+Amager+Centret+Reberbanegade+3+2300+K%C3%B8benhavn+S",
    status: "open",
  },
  {
    slug: "frederiksberg",
    name: "Frederiksberg",
    fullName: "Fillox Frederiksberg",
    address: ["Rathsacksvej 1", "1852 Frederiksberg"],
    hours: standardHours,
    hoursSummary: standardHoursSummary,
    // TODO: add the clinic's Gecko calendar id (Gecko admin), e.g. { geckoCalendarId: "12" }, to preselect it.
    booking: {},
    note: "Nyåbnet. 5 min. fra Forum og Frederiksberg Metro.",
    directionsHref: "https://www.google.com/maps/search/?api=1&query=Fillox+Rathsacksvej+1+1852+Frederiksberg",
    status: "open",
  },
  {
    slug: "osterbro",
    name: "Østerbro",
    fullName: "Fillox Østerbro",
    address: [],
    hours: [],
    status: "coming-soon",
    openingNote: "Åbner 1. november",
    note: "Vi åbner 1. november. Skriv dig op, så får du besked, når vi åbner for booking.",
  },
]);

export const openClinics = clinics.filter((c) => c.status === "open");

import type { Clinic } from "./types";
import { site } from "@/config/site";

const standardHours = [
  { days: "Man–fre", hours: "10–20" },
  { days: "Lør–søn", hours: "10–18" },
];

/** Home page (6a / mf) wording of the same hours. */
const standardHoursSummary = "Hverdage 10–20 · Weekend 10–18";

/**
 * Per-clinic booking link (design mm2: "each clinic has its own booking link").
 * With a Gecko calendar id ("12" or "12.13"), Gecko's iframe.js preselects the clinic
 * from the page URL (?geckoCalendarId=); without one, `?klinik=` keeps the link
 * clinic-specific (analytics) and the calendar opens unfiltered.
 */
const clinicBooking = (slug: string, geckoCalendarId?: string) =>
  geckoCalendarId
    ? `${site.booking.href}?geckoCalendarId=${geckoCalendarId}`
    : `${site.booking.href}?klinik=${slug}`;

/** Clinics in display order (design 6kl / footer). */
export const clinics: Clinic[] = [
  {
    slug: "city2",
    name: "City2",
    fullName: "Fillox City2",
    address: ["Cityringen 2, Plan 3", "2630 Høje Taastrup"],
    hours: standardHours,
    hoursSummary: standardHoursSummary,
    // TODO: pass the clinic's Gecko calendar id (Gecko admin) as 2nd argument to preselect it.
    bookingHref: clinicBooking("city2"),
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
    // TODO: pass the clinic's Gecko calendar id (Gecko admin) as 2nd argument to preselect it.
    bookingHref: clinicBooking("amager-centret"),
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
    // TODO: pass the clinic's Gecko calendar id (Gecko admin) as 2nd argument to preselect it.
    bookingHref: clinicBooking("frederiksberg"),
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
];

export const openClinics = clinics.filter((c) => c.status === "open");

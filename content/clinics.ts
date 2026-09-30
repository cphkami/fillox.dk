import type { Clinic } from "./types";

const standardHours = [
  { days: "Man–fre", hours: "10–20" },
  { days: "Lør–søn", hours: "10–18" },
];

/** Clinics in display order (design 6kl / footer). */
export const clinics: Clinic[] = [
  {
    slug: "city2",
    name: "City2",
    fullName: "Fillox City2",
    address: ["Cityringen 2, Plan 3", "2630 Høje Taastrup"],
    hours: standardHours,
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

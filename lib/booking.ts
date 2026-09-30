/**
 * Booking links for the configured provider (config/site.ts → booking). Content builds its
 * clinic and practitioner booking links through these helpers, so the same content works
 * with Gecko (fillox.dk) and TIMMA (fillox.no).
 */
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import type { Clinic, ClinicBookingIds } from "@/content/types";

const { params } = layoutCopy.booking;

const withParam = (name: string, value: string) =>
  `${site.booking.href}?${name}=${encodeURIComponent(value)}`;

/**
 * Booking link for a clinic (design mm2: "each clinic has its own booking link").
 * - gecko with a calendar id ("12" or "12.13"): /booking?geckoCalendarId=12 — Gecko's iframe.js
 *   reads it from the page URL and preselects the clinic.
 * - otherwise: /booking?klinik=<slug>. The TIMMA picker preselects that clinic; with Gecko the
 *   link stays clinic-specific (analytics) and the calendar opens unfiltered.
 */
export function clinicBookingHref(slug: string, ids?: ClinicBookingIds): string {
  if (site.booking.provider === "gecko" && ids?.geckoCalendarId) {
    return withParam("geckoCalendarId", ids.geckoCalendarId);
  }
  return withParam(params.clinic, slug);
}

/**
 * Booking link for a practitioner: /booking?behandler=<slug>. Neither Gecko nor TIMMA reads
 * the parameter today (it keeps the link practitioner-specific for analytics).
 */
export function practitionerBookingHref(slug: string): string {
  return withParam(params.practitioner, slug);
}

/** TIMMA reservation page of a clinic, e.g. https://bestill.timma.no/reservation/filloxstortingsgata. */
export function timmaReservationUrl(baseUrl: string, timmaId: string): string {
  return `${baseUrl.replace(/\/?$/, "/")}${encodeURIComponent(timmaId)}`;
}

/**
 * Adds each open clinic's booking link (clinicBookingHref from its `booking` ids) unless the
 * clinic sets its own `bookingHref`. content/clinics.ts wraps its clinic list in this.
 */
export function withBookingLinks(clinics: Clinic[]): Clinic[] {
  return clinics.map((c) =>
    c.status === "open" && !c.bookingHref ? { ...c, bookingHref: clinicBookingHref(c.slug, c.booking) } : c,
  );
}

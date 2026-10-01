import { routes } from "@/content/routes";
import type { SiteConfig } from "./types";

/**
 * Market configuration — the ONLY place for market-level facts (domain, country, locale,
 * currency, price format, contact details, booking provider). Components read from here;
 * they never hard-code any of these values. The shape is config/types.ts (SiteConfig).
 *
 * fillox.no is a separate repo built from this one: swap this file + /content
 * (see README.md → "Rebranding til fillox.no").
 */
export const site: SiteConfig = {
  market: "dk",
  country: "DK",
  name: "Fillox",
  legalName: "Fillox Danmark ApS",
  domain: "fillox.dk",
  url: "https://fillox.dk",
  /** BCP 47 locale, used for Intl formatting. */
  locale: "da-DK",
  /** <html lang>. */
  lang: "da",
  currency: "DKK",
  /** "{amount} kr" → "1.499 kr". */
  pricePattern: "{amount} kr",

  contact: {
    phone: "35 10 00 50",
    phoneHref: "tel:+4535100050",
    email: "kontakt@fillox.dk",
    emailHref: "mailto:kontakt@fillox.dk",
  },

  company: {
    /** Registration number label + value, e.g. "CVR 43944207" (NO: "Org.nr."). */
    registrationLabel: "CVR",
    registrationNumber: "43944207",
  },

  social: {
    instagram: "https://www.instagram.com/fillox_dk/",
  },

  // As shown on https://dk.trustpilot.com/review/fillox.dk (checked 2026-10-01): TrustScore 4,7
  // "Fremragende" (content/ui.ts → trustpilotLabel), 172 anmeldelser. Update all three together.
  trustpilot: {
    score: 4.7,
    reviewCount: 172,
    url: "https://dk.trustpilot.com/review/fillox.dk",
  },

  /**
   * Online booking provider (config/types.ts → BookingConfig; /booking renders it through
   * components/booking/BookingEmbed.tsx).
   *
   * fillox.dk — Gecko Booking: one calendar for every clinic, embedded on /booking. Per-clinic
   * Gecko calendar ids live on the clinics (content/clinics.ts → booking.geckoCalendarId).
   *
   * fillox.no — TIMMA: one reservation page per clinic; /booking shows a clinic picker. Set the
   * TIMMA id on every open clinic (content/clinics.ts → booking.timmaId, e.g. "filloxstortingsgata"):
   *   booking: {
   *     provider: "timma",
   *     href: routes.booking,
   *     timmaBaseUrl: "https://bestill.timma.no/reservation/",
   *   },
   */
  booking: {
    provider: "gecko",
    href: routes.booking,
    geckoHost: "filloxdanmark.app4.geckobooking.dk",
    geckoIcCode: "8e00766ca8cc633be72131fc48608e4bb8796",
  },

  brand: {
    logoDark: "/brand/fillox-logo-black.png",
    logoLight: "/brand/fillox-logo-sand.png",
    /** Intrinsic size of the logo PNGs (both variants share it). */
    logoWidth: 603,
    logoHeight: 155,
  },
};

export type Site = SiteConfig;

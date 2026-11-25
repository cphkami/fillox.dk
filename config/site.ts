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
    // The clinic's account since 2026-11 (owner, 2026-11-25: "fillox.dk", formerly "fillox_dk").
    instagram: "https://www.instagram.com/fillox.dk/",
  },

  // As shown on https://dk.trustpilot.com/review/fillox.dk: TrustScore 4,7 "Fremragende"
  // (content/ui.ts → trustpilotLabel), 172 anmeldelser. Update all three together, and `checked`
  // with them (check:market notes when it is more than 60 days old).
  // TODO (owner): or embed Trustpilot's official TrustBox, which updates itself and uses their own
  // star assets (the home hero and the footer strip redraw the stars).
  trustpilot: {
    score: 4.7,
    reviewCount: 172,
    url: "https://dk.trustpilot.com/review/fillox.dk",
    checked: "2026-10-01",
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

  /**
   * Statistics and marketing behind the cookie banner (config/types.ts → AnalyticsConfig).
   * GTM-KDBJMVF2 is the container the live WordPress site loads (inventory 2026-11-25): GA4
   * G-TE9JGYM0GM (+ Google signals, Ads link), the Google Ads Conversion Linker and Meta Pixel
   * 342699568558593. The two WordPress plugins (Site Kit: GA4 G-QMXBXHY79B; PixelYourSite: Meta
   * Pixel 155084197640287) are NOT in it and stop with the old site.
   * TODO (owner): confirm this container for the new site and have its owner make the changes in
   * README → "Før lancering" → "Cookiebanner og måling" (consent checks, triggers).
   * fillox.no: its own container id, or null until it has one.
   */
  analytics: {
    gtmId: "GTM-KDBJMVF2",
    consentVersion: "2026-11-25",
    consentMaxAgeDays: 365,
    consentStorageKey: "fillox-consent",
    cookies: {
      // GA4: _ga, _ga_<container id> (2 years).
      statistics: ["_ga", "_ga_*"],
      // Google Ads Conversion Linker: _gcl_au/_aw/_dc/_gb/_gs/_ag (90 days); Meta Pixel: _fbp, _fbc (90 days).
      // "pys*", "last_pys*", "pbid": the old WordPress site's PixelYourSite cookies (first visit,
      // landing page, traffic source, session, advanced form data; set on .fillox.dk without
      // consent). Deleted only, never set by this site. Names from PixelYourSite's cookie list and the
      // live site's PYS options (2026-11-25). TODO: confirm them in a browser that visited the old site.
      marketing: ["_gcl_*", "_fbp", "_fbc", "pys*", "last_pys*", "pbid"],
    },
    blockCustomHtmlWithoutMarketing: true,
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

/**
 * Market configuration — the ONLY place for market-level facts (domain, locale,
 * currency, contact details, booking provider). Components read from here; they
 * never hard-code any of these values.
 *
 * fillox.no is a separate repo built from this one: swap this file + /content.
 */
export const site = {
  market: "dk" as const,
  name: "Fillox",
  legalName: "Fillox ApS",
  domain: "fillox.dk",
  url: "https://fillox.dk",
  /** BCP 47 locale, used for Intl formatting and <html lang>. */
  locale: "da-DK",
  lang: "da",
  currency: "DKK",
  /** Short currency label shown after prices, e.g. "799 kr". */
  currencyLabel: "kr",

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
    instagram: "https://www.instagram.com/fillox.dk/",
  },

  trustpilot: {
    label: "Fremragende",
    score: 4.7,
    /** Displayed score string, locale-formatted. */
    scoreText: "4,7",
    url: "https://dk.trustpilot.com/review/fillox.dk",
  },

  /** Gecko Booking embed (rendered on /booking). */
  booking: {
    href: "/booking",
    provider: "gecko" as const,
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

export type Site = typeof site;

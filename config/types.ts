/**
 * The contract every market config (config/site.ts) must satisfy. This file is shared
 * by fillox.dk and fillox.no: the NO repo swaps config/site.ts, never this file, so the
 * compiler checks the Norwegian config against the same shape the components use.
 */

/**
 * Online booking provider. Components switch on `provider` (components/booking/BookingEmbed.tsx),
 * so adding a provider means adding a variant here and a case there.
 *
 * - gecko: ONE Gecko Booking calendar for every clinic (fillox.dk). Gecko's iframe.js
 *   preselects a clinic from `?geckoCalendarId=` in the page URL (Clinic.booking.geckoCalendarId).
 * - timma: one TIMMA reservation page PER CLINIC (fillox.no). /booking shows a clinic picker and
 *   embeds `${timmaBaseUrl}${clinic.booking.timmaId}` for the chosen clinic (preselected by
 *   `?klinik=<slug>`). The iframe grows to the page's height through the iframe-resizer
 *   postMessage protocol that TIMMA's page speaks (components/booking/TimmaEmbed.tsx), so no
 *   third-party script is loaded on our side.
 */
export type BookingConfig =
  | {
      provider: "gecko";
      /** Route of the booking page, e.g. "/booking" (content/routes.ts → routes.booking). */
      href: string;
      /** Gecko Booking host, e.g. "filloxdanmark.app4.geckobooking.dk". */
      geckoHost: string;
      /** Gecko "icCode" of the booking calendar. */
      geckoIcCode: string;
    }
  | {
      provider: "timma";
      /** Route of the booking page, e.g. "/booking". */
      href: string;
      /** TIMMA reservation base URL, "https://bestill.timma.no/reservation/". */
      timmaBaseUrl: string;
    };

export type BookingProvider = BookingConfig["provider"];

export type SiteConfig = {
  /** Market code, e.g. "dk" / "no". */
  market: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "DK" / "NO" (structured data addressCountry). */
  country: string;
  name: string;
  legalName: string;
  domain: string;
  /** Absolute origin without a trailing slash, e.g. "https://fillox.dk". */
  url: string;
  /** BCP 47 locale, used for every Intl / toLocale* call, e.g. "da-DK" / "nb-NO". */
  locale: string;
  /** <html lang> and structured-data language, e.g. "da" / "nb". */
  lang: string;
  /** ISO 4217 currency code, e.g. "DKK" / "NOK". */
  currency: string;
  /**
   * How a price is written. `{amount}` is replaced by the number formatted in `locale`,
   * e.g. "{amount} kr" → "1.499 kr" (DK), "kr {amount},-" → "kr 1 499,-".
   */
  pricePattern: string;

  contact: {
    /** Display phone number, e.g. "35 10 00 50". */
    phone: string;
    /** tel: link in international format, e.g. "tel:+4535100050". */
    phoneHref: string;
    email: string;
    emailHref: string;
  };

  company: {
    /** Registration number label, e.g. "CVR" (NO: "Org.nr."). */
    registrationLabel: string;
    registrationNumber: string;
  };

  social: {
    instagram: string;
  };

  /** The visible label ("Fremragende") is copy: content/ui.ts → ui.trustpilotLabel. */
  trustpilot: {
    /** Score 0–5, formatted in `locale` where shown ("4,7"). */
    score: number;
    url: string;
  };

  booking: BookingConfig;

  brand: {
    logoDark: string;
    logoLight: string;
    /** Intrinsic size of the logo PNGs (both variants share it). */
    logoWidth: number;
    logoHeight: number;
  };
};

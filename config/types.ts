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

/**
 * Statistics and marketing tags, loaded ONLY after cookie consent (components/consent,
 * lib/analytics.ts). Nothing third-party loads before a choice: the Google Tag Manager container
 * is injected once the visitor grants "Statistik" or "Marketing", after a Google Consent Mode v2
 * `default` (everything denied) and an `update` from the choice. The banner copy and the cookie
 * list for the privacy policy are content (content/consent.ts).
 */
export type AnalyticsConfig = {
  /**
   * Google Tag Manager container id, e.g. "GTM-KDBJMVF2". `null` switches everything off: no
   * banner, no "Cookieindstillinger" button, no tags.
   */
  gtmId: string | null;
  /**
   * Version of the consent text / cookie list, e.g. "2026-11-25". Change it whenever a category,
   * a vendor or a purpose changes: every visitor is asked again.
   */
  consentVersion: string;
  /** A stored choice expires after this many days and the banner asks again (365 = 12 months). */
  consentMaxAgeDays: number;
  /** localStorage key of the stored choice (first-party, never sent to a server). */
  consentStorageKey: string;
  /**
   * First-party cookies (on this site's domain) that belong to each category. They are deleted
   * whenever the category is not granted: on "Afvis alle", on withdrawal, and on every page load
   * without consent (the old WordPress site set them without asking). A trailing `*` is a prefix.
   */
  cookies: {
    statistics: string[];
    marketing: string[];
  };
  /**
   * Block the container's Custom HTML tags (GTM `gtm.blocklist: ["customScripts"]`) unless
   * "Marketing" is granted. GTM-KDBJMVF2's Meta Pixel is a Custom HTML tag WITHOUT a consent
   * check: Consent Mode cannot stop it, so with "Statistik" only it would still fire. Set to
   * false once the container gates its Custom HTML tags on consent (README → "Før lancering").
   */
  blockCustomHtmlWithoutMarketing: boolean;
};

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
    /** TrustScore 0–5 as Trustpilot shows it, formatted in `locale` where shown ("4,7"). */
    score: number;
    /** Total number of reviews behind the score, as Trustpilot shows it ("172 anmeldelser"). */
    reviewCount?: number;
    /** Profile page ("Se alle anmeldelser"). */
    url: string;
    /**
     * ISO day the score, review count and label were last copied from the profile
     * ("2026-10-01"). They are static on every page (home hero, footer strip), so
     * `npm run check:market` prints a note when this is more than 60 days old.
     */
    checked?: string;
  };

  booking: BookingConfig;

  /** Statistics / marketing tags behind the cookie banner (see AnalyticsConfig). */
  analytics: AnalyticsConfig;

  brand: {
    logoDark: string;
    logoLight: string;
    /** Intrinsic size of the logo PNGs (both variants share it). */
    logoWidth: number;
    logoHeight: number;
  };
};

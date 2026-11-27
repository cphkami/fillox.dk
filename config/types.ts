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

/**
 * Where each form's submissions go: ONE backend per form. lib/forms.ts switches on `provider`
 * (submitForm, formPost), so the components never know which provider is in use; adding a
 * provider means a variant here and a case there (the `never` default lists what is missing).
 * The providers' own facts (hosts, field names, API revision) are config/formProviders.ts.
 *
 * - netlify: Netlify Forms. The form is declared in public/__forms.html; submissions are stored
 *   at Netlify, Inc. (USA). Owner 2026-11-27: "nej vi kommer ikke til at opbevare data hos
 *   netlify. det finder vi en løsning på.. vi skal intet have i USA". Later the same day, about
 *   getting the site started: "glem alt det med data mm og bare sat formspree op", so a form
 *   that is still here (the newsletter) no longer fails the build that goes live: check:market
 *   prints a note on every build while a form uses it.
 * - formward: Formward (formward.eu; EGF Group AB, Sweden; submissions stored in Sweden). The
 *   form POSTs straight to `endpoint`, with and without JavaScript.
 * - formspree: Formspree (formspree.io; Formspree, Inc., San Antonio, Texas, USA; submissions
 *   stored on Amazon Web Services in the USA, each one until somebody deletes it in the
 *   dashboard). The owner's TEMPORARY choice for the contact form, 2026-11-27: they sent the
 *   form's endpoint, were told that Formspree is a US company with its data in the USA, chose
 *   "Formspree alligevel", and added "det bare lige nu så vi kan starte, senere rykker vi til det
 *   svenske" (= Formward). So it does not fail any build; check:market prints a note on every
 *   build while a form is here. The form is sent with fetch only, to `endpoint`. Needs
 *   JavaScript: a plain HTML POST would leave the visitor on a page at formspree.io that loads
 *   Google's tag and a Cloudflare beacon and sets a cookie (a redirect back is a paid dashboard
 *   setting), so the site never makes one (config/formProviders.ts → formspree).
 * - klaviyo (newsletter only): Klaviyo's "Create Client Subscription" API, called from the
 *   browser with the account's PUBLIC key. Needs JavaScript (Klaviyo's developer docs describe
 *   no plain HTML form POST). Klaviyo, Inc. stores its accounts in the USA unless the account
 *   was created in its EU (Germany) environment; which host such an account's browser calls
 *   must use is not documented (config/formProviders.ts → klaviyo, UNCONFIRMED; README →
 *   "Formularerne væk fra Netlify").
 */
export type NetlifyFormBackend = { provider: "netlify" };

export type FormwardFormBackend = {
  provider: "formward";
  /**
   * The form's endpoint, copied from the Formward dashboard:
   * "https://forms.formward.eu/f/<form id>". One Formward form (and id) per form. The id is
   * public by design (no API key); Formward's allowed-origins list is what limits who may post.
   */
  endpoint: string;
};

export type FormspreeFormBackend = {
  provider: "formspree";
  /**
   * The form's endpoint, copied from the form's "Integration" tab in the Formspree dashboard:
   * "https://formspree.io/f/<form id>" (not the dashboard page ".../forms/<form id>"). One
   * Formspree form (and id) per form. The id is public by design: the endpoint checks no key;
   * "Restrict to Domain" in the Formspree project's settings is what limits where posts may
   * come from (README → "Formularerne væk fra Netlify").
   */
  endpoint: string;
};

export type KlaviyoFormBackend = {
  provider: "klaviyo";
  /**
   * The account's PUBLIC API key / "Site ID" (6 characters; Klaviyo → Settings → API keys).
   * Never a private key ("pk_…"): this value is sent from the browser.
   */
  companyId: string;
  /** Id of the list the signups are added to (Klaviyo → Lists & segments → the list → Settings). */
  listId: string;
  /**
   * The list's own "Opt-in process" in Klaviyo (the list → Settings → Consent), stated here
   * because the site cannot read it: Klaviyo answers 202 either way. With "double" the visitor
   * is not subscribed until they confirm in the mail Klaviyo sends, so the receipt on the page
   * asks for that (lib/forms.ts → formNeedsConfirmation; `successConfirm` in the newsletter
   * copy); with "single" it says they are signed up. Change the list's setting and this value
   * together. "double" is the one to choose: the endpoint is public (public key + list id), so
   * with "single" anyone can sign up somebody else's address.
   */
  optIn: "single" | "double";
};

export type FormsConfig = {
  /** The contact form on /kontakt (components/contact/ContactForm.tsx). */
  contact: NetlifyFormBackend | FormwardFormBackend | FormspreeFormBackend;
  /** The newsletter signup in the footer and on /blog (components/ui/NewsletterForm.tsx). */
  newsletter: NetlifyFormBackend | FormwardFormBackend | FormspreeFormBackend | KlaviyoFormBackend;
};

/** "contact" | "newsletter": what components pass to lib/forms.ts. */
export type FormKind = keyof FormsConfig;

export type FormBackend = FormsConfig[FormKind];

export type FormProvider = FormBackend["provider"];

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

  /** Where the contact form and the newsletter signup send their submissions (see FormsConfig). */
  forms: FormsConfig;

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

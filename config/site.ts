import { routes } from "@/content/routes";
import type { SiteConfig } from "./types";

/**
 * Market configuration — the ONLY place for market-level facts (domain, country, locale,
 * currency, price format, contact details, booking provider, form providers). Components read
 * from here; they never hard-code any of these values. The shape is config/types.ts (SiteConfig).
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
   * Where the two forms send their submissions (config/types.ts → FormsConfig; lib/forms.ts does
   * the sending; ARCHITECTURE.md → "Forms providers").
   *
   * CONTACT: Formspree for now, Formward later. The owner, 2026-11-27, sent
   * "https://formspree.io/f/mbgoerad — Fillox kontaktformular". Told that Formspree, Inc. is a US
   * company that stores on Amazon Web Services in the USA, they chose "Formspree alligevel" and
   * added: "det bare lige nu så vi kan starte, senere rykker vi til det svenske" (= Formward).
   * The endpoint is public by design (no key). Nothing was ever posted to it from this repo: the
   * owner sends the one test message themselves, from the preview (README → "Formularerne væk
   * fra Netlify" has their steps in the Formspree dashboard, and what is still open: no data
   * processing agreement is published). The form is sent with fetch only; without JavaScript it
   * shows the phone number and the e-mail address instead (config/formProviders.ts → formspree).
   * `npm run check:market` prints a note about Formspree on every build and never fails for it:
   * the owner chose it knowingly. Moving to Formward = this ONE line (+ what check:market then
   * names):
   *   contact: { provider: "formward", endpoint: "https://forms.formward.eu/f/<form id>" },
   *
   * NEWSLETTER: still at Netlify Forms, which stores every signup at Netlify, Inc. in the USA.
   * The owner, 2026-11-27, about the privacy policy's "tilmeldinger modtages og opbevares hos
   * vores hostingudbyder, Netlify": "nej vi kommer ikke til at opbevare data hos netlify. det
   * finder vi en løsning på.. vi skal intet have i USA" and "måske bruger vi https://formward.eu
   * hvis vi skal være helt sikkert. men tanken er at emails registerees måske direkte i klaviyo
   * via nyhedsbrev". Nothing is chosen for it yet. NOT a launch blocker any more: later the same
   * day the owner chose to start with what works ("glem alt det med data mm og bare sat formspree
   * op. det jo lige til..?"), so check:market prints a NOTE on every build while the line below
   * says "netlify", also on the build that goes live (it failed that build before; a failed
   * go-live build would leave the previous one, the noindex preview, on the domain). The privacy
   * policy's "12. Nyhedsbrev" names Netlify and the transfer to the USA meanwhile. When the
   * owner has decided, replace the line with ONE of:
   *   newsletter: { provider: "klaviyo", companyId: "<6-character public key>", listId: "<list id>", optIn: "double" },
   *   newsletter: { provider: "formward", endpoint: "https://forms.formward.eu/f/<its own form id>" },
   *   newsletter: { provider: "formspree", endpoint: "https://formspree.io/f/<its own form id>" },
   * then run `npm run check:market`: it names the CSP sources to add (config/securityHeaders.ts
   * and the copy in netlify.toml) and the form to take out of public/__forms.html.
   *
   * The privacy policy's "Databehandler" / "Modtager" texts follow the provider by themselves
   * (content/pages/legal.ts → formProcessorTexts; each is marked "TODO: copy review
   * (2026-11-27)"). Klaviyo: `optIn` is the list's own "Opt-in process" in Klaviyo ("double" or
   * "single"; the receipt on the page follows it, config/types.ts → KlaviyoFormBackend). Klaviyo
   * stores its accounts in the USA unless the account was created in its EU environment, which
   * conflicts with "intet i USA" (README names the EU alternatives). Before a switch, read what
   * config/formProviders.ts lists as UNCONFIRMED for the provider: the first real submission
   * from the preview settles it.
   */
  forms: {
    contact: { provider: "formspree", endpoint: "https://formspree.io/f/mbgoerad" },
    newsletter: { provider: "netlify" },
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
    // Bordeaux #6A242F, the logo colour the clinic uses on social media. Alberte 2026-11-26
    // (forwarded by the owner): "Skift det sorte Fillox-logo til den rødlige farve fra
    // referencebilledet"; #6A242F is the colour sampled from her reference image. The file is the
    // former espresso logo (#3B2A28, the headings' colour, 2026-11-25) with every pixel's colour set
    // to #6A242F and its alpha kept, so the anti-aliasing is unchanged. 10.5:1 on the offwhite
    // header, mobile menu and footer (#FAFAF8); 11.0:1 on white (the Organization JSON-LD logo).
    // Why #6A242F and not a sampled ≈ #622930 (an earlier note): #6A242F is the mode, the most
    // frequent colour among the reference screenshot's dark reddish pixels (2,378 pixels; the next
    // are #6A2431 and #69262F, one step away). An average or a single sample is pulled off by the
    // anti-aliased edges and the JPEG-like noise around the letters (the mean of the same pixels is
    // #682932), so the mode is the logo's flat fill colour. Checked again 2026-11-27. If the brand
    // files give another hex, re-colour the file the same way (colour set, alpha kept).
    logoDark: "/brand/fillox-logo-bordeaux.png",
    logoLight: "/brand/fillox-logo-sand.png",
    /** Intrinsic size of the logo PNGs (both variants share it). */
    logoWidth: 603,
    logoHeight: 155,
  },
};

export type Site = SiteConfig;

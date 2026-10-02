/**
 * Netlify Forms of this market. The names are what Netlify shows in its dashboard (and in
 * notification e-mails), so they are market content.
 *
 * Every name here must be declared in public/__forms.html with the same field names —
 * Netlify only accepts submissions to forms it detected at deploy time.
 * `npm run check:market` (also run before every build) checks that they match.
 *
 * Keep this file free of imports: scripts/check-market.mjs reads it.
 */
export const forms = {
  /** /kontakt contact form. */
  contact: "kontakt",
  /**
   * Newsletter signup: in the footer of every page and the band at the bottom of /blog
   * (components/ui/NewsletterForm). Fields: email, source ("footer:/behandlinger/lip-filler",
   * "blog:/blog": where the visitor signed up, as a record of the consent).
   */
  newsletter: "nyhedsbrev",
  /** "Få besked" signup on the coming-soon Østerbro clinic card (/klinikker). */
  notifyOsterbro: "osterbro-besked",
} as const;

export type FormName = (typeof forms)[keyof typeof forms];

/**
 * No-JavaScript target of the newsletter signup. Without JavaScript (or before the page has
 * hydrated) the form POSTs straight to Netlify with this static file as its action, so the
 * e-mail address never ends up in the page URL. Netlify stores the submission and serves the
 * file: public/__nyhedsbrev-tilmeldt.html, a short thank-you page linking back to the site.
 */
export const newsletterNoJsAction = "/__nyhedsbrev-tilmeldt.html";

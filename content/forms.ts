/**
 * The forms of this market: their names, and the static files a form at Netlify Forms posts to
 * without JavaScript. WHERE a form's submissions go (Netlify Forms, Formward, Formspree, Klaviyo)
 * is market config: config/site.ts → forms; lib/forms.ts does the sending.
 *
 * The names are the `<form name>` in the page and, while a form is at Netlify Forms, what
 * Netlify shows in its dashboard (and in notification e-mails), so they are market content.
 * A form whose provider is "netlify" must be declared in public/__forms.html with the same
 * field names — Netlify only accepts submissions to forms it detected at deploy time — and a
 * form that has left Netlify must NOT be declared there. `npm run check:market` (also run
 * before every build) checks both.
 *
 * Keep this file free of imports: scripts/check-market.mjs reads it.
 */
export const forms = {
  /** /kontakt contact form. Fields: name, email, phone, clinic, message. */
  contact: "kontakt",
  /**
   * Newsletter signup: in the footer of every page and the band at the bottom of /blog
   * (components/ui/NewsletterForm). Fields: email, source ("footer:/behandlinger/lip-filler",
   * "blog:/blog": where the visitor signed up, as a record of the consent).
   */
  newsletter: "nyhedsbrev",
} as const;

/**
 * No-JavaScript targets of the forms while they are at Netlify Forms. Without JavaScript (or
 * before the page has hydrated) the form POSTs straight to Netlify with one of these static
 * files as its action, so nothing the visitor typed ends up in the page URL. Netlify stores the
 * submission and serves the file, which forwards to the thank-you page:
 * public/__kontakt-sendt.html → routes.contactThanks, public/__nyhedsbrev-tilmeldt.html →
 * routes.newsletterThanks (`npm run check:market` rule 5 checks the forward). Not used by the
 * other providers: Formward redirects to the thank-you route itself, Formspree and Klaviyo need
 * JavaScript. The files stay in public/ while a form is elsewhere: lib/forms.ts → formPost
 * points here for the provider "netlify" (fillox.no, or a move back).
 */
export const netlifyNoJsActions = {
  contact: "/__kontakt-sendt.html",
  newsletter: "/__nyhedsbrev-tilmeldt.html",
} as const;

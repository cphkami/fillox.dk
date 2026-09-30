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
  /** Newsletter signup on /blog. */
  newsletter: "nyhedsbrev",
  /** "Få besked" signup on the coming-soon Østerbro clinic card (/klinikker). */
  notifyOsterbro: "osterbro-besked",
} as const;

export type FormName = (typeof forms)[keyof typeof forms];

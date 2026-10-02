/**
 * Every route of the site, in ONE place. Code and content link through this map and never
 * write a path literal, so a market with other URL slugs (fillox.no: /om-oss, /personvern …)
 * edits this file and renames the matching app/ folders.
 *
 * The app/ folder names are the real routes: `npm run check:market` (also run before every
 * build) fails when a value here has no app/<path>/page.tsx.
 *
 * Keep this file free of imports: config/site.ts and scripts/check-market.mjs read it.
 */

/** Id of the team section on the about page (linked as `${routes.about}#${aboutTeamAnchor}`). */
export const aboutTeamAnchor = "behandlere";

/**
 * Id of the newsletter section of the privacy policy (content/pages/legal.ts), linked from every
 * newsletter signup as `${routes.privacy}#${privacyNewsletterAnchor}`.
 */
export const privacyNewsletterAnchor = "nyhedsbrev";

const about = "/om-os";
const contact = "/kontakt";
const privacy = "/privatlivspolitik";

export const routes = {
  home: "/",
  treatments: "/behandlinger",
  /**
   * Landing page for men (the "For mænd" category). A static folder, app/behandlinger/for-maend,
   * which wins over app/behandlinger/[slug]; no treatment may take the slug "for-maend"
   * (npm run check:market fails when a static page shadows a collection slug).
   */
  men: "/behandlinger/for-maend",
  practitioners: "/behandlere",
  prices: "/priser",
  clinics: "/klinikker",
  about,
  /** Team section on the about page. */
  aboutTeam: `${about}#${aboutTeamAnchor}`,
  contact,
  /** Thank-you page after the contact form (also the no-JS target in public/__kontakt-sendt.html). */
  contactThanks: `${contact}/tak`,
  blog: "/blog",
  booking: "/booking",
  terms: "/handelsbetingelser",
  privacy,
  /** Newsletter section of the privacy policy (what the signups link to). */
  privacyNewsletter: `${privacy}#${privacyNewsletterAnchor}`,
  /**
   * Thank-you page after the newsletter signup WITHOUT JavaScript (the no-JS target
   * public/__nyhedsbrev-tilmeldt.html forwards here). noindex, not in the sitemap.
   */
  newsletterThanks: "/nyhedsbrev/tak",
  jobs: "/ledige-stillinger",
  creator: "/content-creator",
} as const;

export type RouteKey = keyof typeof routes;

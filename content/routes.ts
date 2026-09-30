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

const about = "/om-os";
const contact = "/kontakt";

export const routes = {
  home: "/",
  treatments: "/behandlinger",
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
  privacy: "/privatlivspolitik",
  jobs: "/ledige-stillinger",
  creator: "/content-creator",
} as const;

export type RouteKey = keyof typeof routes;

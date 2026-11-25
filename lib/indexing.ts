import { site } from "@/config/site";

/** `https://fillox.dk/` → `https://fillox.dk`. */
const origin = (url: string | undefined) => (url ?? "").trim().replace(/\/+$/, "");

/**
 * Whether search engines may index this build.
 *
 * On Netlify every build knows its context (`CONTEXT`) and the project's primary URL (`URL`).
 * Only a production build whose primary domain is the market's own domain (`site.url`) is
 * indexable. Until the domain moves, the site runs on `<project>.netlify.app`, and that copy (and
 * every deploy preview and branch deploy) must stay out of search, or Google would find a duplicate
 * of the live site: robots.txt then disallows everything (app/robots.ts) and every page carries
 * `noindex, nofollow` (app/layout.tsx).
 *
 * Go-live: after the domain is set as the project's primary domain, trigger a new production
 * deploy (README → "Domæneskiftet"); the build then sees `URL = site.url` and is indexable.
 *
 * Outside Netlify (local `npm run build`, `next start`) nothing changes: indexable.
 */
export const isIndexable: boolean = process.env.NETLIFY
  ? process.env.CONTEXT === "production" && origin(process.env.URL) === origin(site.url)
  : true;

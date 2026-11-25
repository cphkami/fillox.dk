/**
 * Security headers on every response: the ONE list of names and values.
 *
 * Two places send them, because on Netlify neither reaches every response:
 * - next.config.ts → headers() sends them on everything the Next.js server answers: pages,
 *   robots.txt, sitemap.xml, the manifest and 404s (on Netlify: the server handler). Not on the
 *   308s of next.config.ts → redirects(): Next.js deliberately drops config headers on its own
 *   redirects (next/dist/server/lib/router-utils/resolve-routes.js returns `resHeaders: null`).
 *   Harmless: a redirect renders no document, and without a Referrer-Policy on it the browser
 *   keeps the policy of the page that linked; on Netlify the redirect still gets Netlify's own
 *   HSTS and nosniff.
 * - netlify.toml → [[headers]] for "/*" sends them on what Netlify's CDN serves without the
 *   server: public/ files (/images/*, /brand/*), /_next/static/* and /_next/image (Image CDN).
 *   netlify.toml cannot import this file, so it repeats the values; `npm run check:market` (rule
 *   15, also before every build) fails when the two differ in any name or value.
 * Change a value here AND in netlify.toml, then run `npm run check:market`.
 *
 * No imports: next.config.ts imports this file by relative path, and check:market reads it
 * without a build step.
 *
 * - HSTS as the old WordPress site sent it (fillox.dk is on the preload list).
 * - X-Frame-Options / frame-ancestors: only fillox.dk may frame its own pages.
 * - Permissions-Policy turns off what no page uses. Leave `payment` and
 *   `publickey-credentials-get` alone: the Gecko booking iframe (and its card payment) may need them.
 * - The CSP ships as Report-Only first (violations appear in the browser console, nothing is
 *   blocked). The site loads nothing from other hosts except Gecko on /booking: Gecko's iframe.js
 *   (script), its calendar iframe (with an inline onload handler, hence 'unsafe-inline' next to
 *   Next's own inline scripts) and, in the booking flow, the payment pages Gecko may open inside
 *   that iframe (Nets Easy / OnPay). After a full test booking incl. the payment step in Safari,
 *   Chrome and Firefox without violations, change `cspHeaderName` below to
 *   "Content-Security-Policy" and rename the key in netlify.toml the same way (README → "Efter
 *   lancering"). fillox.no (TIMMA): frame-src https://bestill.timma.no instead of Gecko's hosts,
 *   and no Gecko script host (check:market compares the hosts with config/site.ts → booking).
 * - Measurement, only after cookie consent (config/site.ts → analytics, components/consent): the
 *   hosts of the tags in GTM-KDBJMVF2 (inventory 2026-11-25), nothing else.
 *   · Google Tag Manager + GA4 (Google signals and Ads link on) + Conversion Linker, as Google's CSP
 *     guide lists them for "Google tag / GA4": script www.googletagmanager.com; img and connect
 *     *.google-analytics.com, *.g.doubleclick.net, *.google.com, *.google.dk (Google lists each
 *     ccTLD; the audience is Denmark), www.googletagmanager.com; connect also
 *     pagead2.googlesyndication.com; frame www.googletagmanager.com. Plus, in img and connect,
 *     ad.doubleclick.net and www.googleadservices.com: the GA4 tag's own endpoint table (gtag.js of
 *     G-TE9JGYM0GM, inventory 2026-11-25) calls them with the Ads link on ("/ccm/s/collect",
 *     "/ccm/conversion"); "*.g.doubleclick.net" does not match ad.doubleclick.net.
 *   · Meta Pixel (a Custom HTML tag, hence 'unsafe-inline'): script connect.facebook.net (fbevents.js,
 *     /signals/config), connect connect.facebook.net (telemetry) and www.facebook.com, img
 *     www.facebook.com (/tr), form-action www.facebook.com (fbevents' form POST fallback to /tr).
 *   A new tag in the container (Hotjar, TikTok, Google Ads remarketing …) needs its hosts here (and
 *   in netlify.toml) AND a line in the cookie list (content/consent.ts) with a new consentVersion.
 */

export type SecurityHeader = { key: string; value: string };

/** Report-only until the launch-week test booking is clean (see above). */
export const cspHeaderName = "Content-Security-Policy-Report-Only";

/** CSP directives in the order they are sent; each value is the directive's source list. */
export const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://filloxdanmark.app4.geckobooking.dk", // Gecko's iframe.js (config/site.ts → booking.geckoHost)
    "https://www.googletagmanager.com",
    "https://connect.facebook.net",
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://*.g.doubleclick.net",
    "https://*.google.com",
    "https://*.google.dk",
    "https://ad.doubleclick.net",
    "https://www.googleadservices.com",
    "https://www.facebook.com",
  ],
  "font-src": ["'self'"],
  "connect-src": [
    "'self'",
    "https://www.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://*.g.doubleclick.net",
    "https://*.google.com",
    "https://*.google.dk",
    "https://ad.doubleclick.net",
    "https://www.googleadservices.com",
    "https://pagead2.googlesyndication.com",
    "https://connect.facebook.net",
    "https://www.facebook.com",
  ],
  "frame-src": [
    "https://*.geckobooking.dk", // the Gecko calendar
    "https://checkout.dibspayment.eu", // Nets Easy, inside the Gecko iframe
    "https://onpay.io",
    "https://*.onpay.io",
    "https://www.googletagmanager.com",
  ],
  "form-action": ["'self'", "https://www.facebook.com"],
  "frame-ancestors": ["'self'"],
  "base-uri": ["'self'"],
  "object-src": ["'none'"],
};

/** "default-src 'self'; script-src 'self' …" */
export const contentSecurityPolicy = Object.entries(cspDirectives)
  .map(([directive, sources]) => [directive, ...sources].join(" "))
  .join("; ");

/** Every header, in the order netlify.toml lists them. */
export const securityHeaders: SecurityHeader[] = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: cspHeaderName, value: contentSecurityPolicy },
];

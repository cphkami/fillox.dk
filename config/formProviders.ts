/**
 * Form providers: what the site relies on at each provider (hosts, field names, API revision).
 * These are the providers' facts, the same for fillox.dk and fillox.no. WHICH provider a form
 * uses is market config: config/site.ts → forms (config/types.ts → FormsConfig).
 *
 * Read by lib/forms.ts (sending, the no-JavaScript form attributes) and by
 * scripts/check-market.mjs (rule 21: endpoint / ids well-formed, the CSP allows exactly the
 * hosts in use). A detail the providers' documentation does not confirm is marked UNCONFIRMED
 * here and nowhere else (research 2026-11-27; no account of ours existed, and nothing was ever
 * sent to any provider: not to the owner's Formspree form either).
 */
import type { FormBackend, FormProvider } from "./types";

/**
 * Netlify Forms (Next.js runtime v5 pattern): every form is declared once in
 * public/__forms.html, so Netlify detects it at deploy time, and the page POSTs url-encoded
 * data with a `form-name` field to that static file. Submissions are stored at Netlify, Inc.
 */
export const netlifyForms = {
  /** The detection file, also the fetch target with JavaScript. */
  action: "/__forms.html",
  /** Hidden field that tells Netlify which declared form a POST belongs to. */
  formNameField: "form-name",
  /** `netlify-honeypot="bot-field"` on every form in public/__forms.html. */
  honeypotField: "bot-field",
} as const;

/**
 * Formward (https://formward.eu; EGF Group AB, Sweden).
 * Ingest contract: https://formward.eu/docs/ingest, /docs/ajax, /docs/responses, /docs/fields.
 * - `POST https://forms.formward.eu/f/<formId>`, no API key; url-encoded bodies are accepted.
 * - With `Accept: application/json` the answer is JSON: 200 `{ ok: true, id, files }`, or
 *   `{ ok: false, error }` with 400 / 402 / 403 / 404 / 413 / 415 (file uploads only) / 422 /
 *   429 / 500, and 405 for a GET. A url-encoded body with only that header is a CORS-simple
 *   request (no preflight). Do not retry a 500 by itself: "a retry creates a second submission".
 *   The site treats every non-2xx alike (one submit error). Formward suggests a "wait" branch
 *   for 429, but its docs do not say that `Retry-After` is exposed to a script on another
 *   origin: never rely on reading it in the browser.
 * - `{ ok: true }` means stored, not notified: over the plan's allowance a submission "gets the
 *   usual success response" and waits in the "Over limit" folder without a notification.
 * - Without that header (a plain form POST) the answer is a 302 to the hidden `_redirect` field.
 *   "A relative path (starting with a single /, e.g. /thank-you) is always accepted" and is
 *   resolved against the submitting page's origin; an absolute URL only when its origin is in
 *   the form's allowed-origins list (otherwise it is silently ignored). So the site sends the
 *   relative thank-you route. When `_redirect` cannot be used, Formward falls back to the
 *   redirect URL in the form's dashboard settings and then to its own /thanks page: set the
 *   dashboard's redirect URL to the absolute thank-you URL too (README, option A), so that page
 *   is never shown. On an error (rate limit, origin not allowed, form paused …) a plain POST
 *   gets "a minimal HTML error page" on forms.formward.eu with the same status code: there is
 *   no redirect back to the site.
 * - Fields whose names start with "_" are control fields, stripped before the submission is
 *   stored. `_gotcha` is the honeypot: any non-whitespace value files the submission as spam
 *   and still answers like a success. The field reference: "hide it with CSS (not display:none,
 *   which some bots detect)", with an off-screen input as its example (the quickstart uses
 *   display: none). So for Formward the site renders the field off-screen (lib/forms.ts →
 *   FormPost.honeypotOffscreen; components/ui/HoneypotField).
 * - Per-form settings in the dashboard that REJECT what the site sends; leave them off (README,
 *   option A): "require consent" (the site sends no `_consent`: 422 consent_required); required
 *   or validated fields beyond name, email and message (`phone` and `clinic` are sent as empty
 *   strings when not filled in: 422); Formward's own captcha and Cloudflare Turnstile (no
 *   token: 403).
 * - Allowed origins (per form, in the dashboard): with entries, the request's Origin must match
 *   one exactly, else 403. The site's Referrer-Policy (config/securityHeaders.ts) must stay
 *   "strict-origin-when-cross-origin": under "no-referrer" or "same-origin" a browser sends
 *   `Origin: null` with the plain form POST to another origin (Fetch standard; an inference,
 *   not from Formward's docs), which an exact-match list would refuse; check:market (rule 21)
 *   fails on those two values while a form is at Formward. The fetch with JavaScript is a CORS
 *   request and always carries the page's origin.
 * UNCONFIRMED: the form id's alphabet and length (check:market only requires one path segment
 * without "%"); the numeric limits (fields, field length, body size: only the 413 / 422 errors
 * are documented); whether the honeypot can be renamed; whether allowed origins take wildcards
 * (docs: exact match, so the netlify.app preview and localhost each need an entry, or a test
 * form with an empty list); whether the page's origin for the relative `_redirect` is read
 * from the Origin or the Referer header, and what happens when a browser sends neither (then
 * the dashboard's redirect URL applies); whether Formward's own thank-you and error pages exist
 * in Danish: its interface is "available in nine languages: English, German, Swedish, Spanish,
 * French, Italian, Dutch, Polish and Portuguese" (changelog, 2026-10-27), so most likely not.
 * The first real test on the preview includes one submission without JavaScript in Chrome,
 * Firefox and Safari.
 */
export const formward = {
  origin: "https://forms.formward.eu",
  /** An endpoint's path: "/f/<formId>" (one segment, nothing percent-encoded). */
  endpointPath: /^\/f\/[^/%]+$/,
  honeypotField: "_gotcha",
  redirectField: "_redirect",
} as const;

/**
 * Formspree (https://formspree.io; Formspree, Inc., San Antonio, Texas, USA; hosted "with Amazon
 * Web Services in the United States", https://formspree.io/security/). The owner's temporary
 * choice for the contact form, 2026-11-27 (config/types.ts → FormsConfig has the quotes).
 * Sources, read 2026-11-27 with GET only: the help centre (help.formspree.io/articles/…), the
 * plans page, Formspree's fetch recipe (https://formspree.io/blog/formspree-ajax/, 2026-04-07; the
 * same in …/form-and-project-settings/protecting-your-forms-with-cloudflare-turnstile) and its
 * own client (github.com/formspree/formspree-js → packages/formspree-core/src/core.ts and
 * submission.ts).
 * - `POST https://formspree.io/f/<form id>`: the id is the "hashid" on the form's Integration
 *   tab (…/the-forms-api/getting-your-form-s-hashid: "an alphabetical shortcode"). It is public
 *   by design: the endpoint checks no key. NOT https://formspree.io/forms/<id>, which is the
 *   form's page in the dashboard (…/api-errors/form-not-found).
 * - The request (lib/forms.ts → send): a FormData body (multipart; no Content-Type set by the
 *   site) and exactly one header, `Accept: application/json`. That is a CORS-simple request, so
 *   the browser sends no preflight; cross-origin posting is a feature of every plan ("Ajax
 *   Forms", https://formspree.io/plans). `credentials: "omit"`: formspree.io sets a cookie
 *   (fs_ab1) on its answers, which the browser then neither stores nor sends.
 * - The answer: success is a 2xx with a JSON object (`{ next: "<url>" }` in the client's types);
 *   an error is `{ error: string, errors?: [{ message, code?, field? }] }`. The site counts a
 *   submission as sent only when the status is 2xx AND the body is a JSON object WITHOUT an
 *   `errors` array or an `error` string (the fetch recipe looks at `response.ok`, the client at
 *   the body: both must agree). Everything else is the form's one submit error, in the site's
 *   own Danish: `message` is an English fragment and is never shown. Documented statuses: 404
 *   (unknown or deleted form, code FORM_NOT_FOUND) and 429 (rate limit: 20 posts a minute per
 *   form, …/form-and-project-settings/system-limits). Codes: INACTIVE, BLOCKED, EMPTY,
 *   FORM_NOT_FOUND, PROJECT_NOT_FOUND; per field REQUIRED_FIELD_MISSING, REQUIRED_FIELD_EMPTY,
 *   TYPE_EMAIL, TYPE_NUMERIC, TYPE_TEXT. Never retried by the site.
 * - Fields: every named field is stored and e-mailed as submitted, so the site sends its own
 *   five (name, email, phone, clinic, message) and the honeypot, never Netlify's `form-name`. A
 *   field named `email` sets the notification's Reply-To and must be a valid address
 *   (…/building-your-form/email-reply-to-address). `_gotcha` is the honeypot: "if the `_gotcha`
 *   field is filled in … we silently ignore the submission"
 *   (…/building-your-form/honeypot-spam-filtering, which shows an inline `display:none` and adds
 *   "it's best to hide the input with a CSS class"). The site renders it off-screen, as for
 *   Formward (lib/forms.ts → FormPost.honeypotOffscreen). Not used: `_replyto`, `_subject`,
 *   `_next`, `_cc`, `_format` (in no current Formspree document) and `subject` / `_language`.
 * - NO plain HTML POST. Without JavaScript a form posted to this endpoint leaves the site for
 *   Formspree's own "Thank You" page (…/form-and-project-settings/thank-you-redirect; a redirect
 *   to the site's own page is a setting of the paid plans). That page (GET, 2026-11-27) loads
 *   Google's tag with an Analytics and an Ads id from www.googletagmanager.com and a Cloudflare
 *   beacon from static.cloudflareinsights.com, and sets a cookie. So for this provider the form
 *   has no `action`, its submit button is disabled until React runs, and a line gives the phone
 *   number and the e-mail address instead (components/contact/ContactForm; the newsletter's
 *   line: components/ui/NewsletterForm). The only host the site ever contacts is formspree.io.
 * - Formspree's own reCAPTCHA is a page the visitor is redirected to: it "should only be used
 *   with HTML forms" and "isn't appropriate for JavaScript forms that use AJAX"
 *   (https://formspree.io/blog/recaptcha-methods/), and it brings in Google. It must be OFF for
 *   the form (form → Settings → "Spam protection"; all plans): README has the owner's
 *   dashboard steps.
 * - "Restrict to Domain" (project → Settings; all plans) compares the Referer header with the
 *   domain entered; a post from elsewhere "will be sent to your spam inbox", it is not refused.
 *   "If your web server sends a `referrer-policy` header the strictest setting it can use is
 *   `strict-origin-when-cross-origin`"; with `no-referrer` or `same-origin` "submissions will be
 *   marked as spam" (…/form-and-project-settings/restrict-to-domain). The site's Referrer-Policy
 *   (config/securityHeaders.ts) is that strictest value: check:market (rule 21) fails on the
 *   other two while a form is at Formspree.
 * - Over the plan's monthly allowance (Free: 50) "your forms keep working for visitors", but the
 *   submission waits in the "Over Limit" folder "without sending notification emails"
 *   (…/form-and-project-settings/over-limit-submissions): the visitor sees the site's receipt,
 *   the clinic hears nothing until somebody reprocesses it.
 * UNCONFIRMED (none of it can be read without posting to a form, which we never did; the one
 * test message the OWNER sends from the preview shows whether the success answer and the
 * reCAPTCHA setting are what the site expects: README):
 * - the exact success answer of a real submission (the status number; keys besides `next`), and
 *   what a POST without the Accept header gets (so the header is always sent);
 * - the HTTP statuses of the validation errors and of INACTIVE / BLOCKED / EMPTY, the body of a
 *   429 and whether it carries Retry-After (the site reads none of them: one submit error);
 * - what a post with a filled `_gotcha` gets back, and whether it is stored or counted;
 * - whether a new form has Formspree's reCAPTCHA on by default, and what a fetch gets while it
 *   is on (not the documented JSON: the site would show its submit error for every message);
 * - what an over-limit post gets back ("keep working for visitors" suggests the success answer);
 * - the form id's length and alphabet (https://formspree.io/guides/nextjs/ speaks of "the 8
 *   character" hashid; check:market takes one path segment of letters and digits);
 * - whether "Restrict to Domain" takes more than one domain (fillox.dk and the netlify.app
 *   preview), and what the visitor's request gets when the domain does not match;
 * - whether an auto-delete period exists (none is documented: "Every submission is stored until
 *   you delete it", https://formspree.io/plans) and what the form setting "Submission Archive"
 *   (store submissions or not; seen in the dashboard's code, in no help article) still keeps;
 * - the legal points: content/pages/legal.ts → formProcessorTexts (no published data processing
 *   agreement; processor or independent controller; which sub-processors see a message).
 * A redirect as the answer is documented nowhere for a fetch; the browser would follow it, as
 * Formspree's own client does, and the page it ends on is not the JSON object above: a failure.
 */
export const formspree = {
  origin: "https://formspree.io",
  /** An endpoint's path: "/f/<form id>" (one segment of letters and digits). */
  endpointPath: /^\/f\/[A-Za-z0-9]+$/,
  /** The dashboard page of a form, "/forms/<form id>…": the URL people copy by mistake. */
  dashboardPath: /^\/forms(\/|$)/,
  honeypotField: "_gotcha",
} as const;

/**
 * Klaviyo "Create Client Subscription", the endpoint Klaviyo documents for sign-up forms that do
 * not load Klaviyo's own script. Spec: https://developers.klaviyo.com/en/reference/create_client_subscription
 * (OpenAPI: https://github.com/klaviyo/openapi → openapi/stable/apis/create_client_subscription.json).
 * - `POST https://a.klaviyo.com/client/subscriptions?company_id=<public key>`, browser only
 *   ("Do not use this endpoint from server-side applications"), no Authorization header ("Never
 *   use a private API key with our client-side endpoints"). No trailing slash, as in the
 *   reference and the OpenAPI document (Klaviyo's forms guide writes
 *   "/client/subscriptions/?company_id=…").
 * - Headers `revision` (required: "Without it you'll get a 400", forms guide) and
 *   `content-type: application/vnd.api+json`; a JSON:API body (lib/forms.ts →
 *   klaviyoSubscription). Not a CORS-simple request: the browser sends a preflight.
 * - 202 with no body = accepted and processed later, not "subscribed"; errors are 4xx / 5xx
 *   with `{ errors: [{ status, code, title, detail }] }`; 429 (rate limit: 350/s, 750/min per
 *   account) carries `Retry-After`.
 * - Double opt-in follows the list's own setting in Klaviyo (Consent → "Opt-in process"): on a
 *   double opt-in list the profile is not marked as consented "until the subscriber has
 *   finished opting in". The site cannot read that setting, so config/site.ts states it
 *   (`optIn`) and the form's receipt follows it (lib/forms.ts → formNeedsConfirmation).
 * - The developer docs describe no plain HTML form POST (only this endpoint and a server-side
 *   one with a private key), so without JavaScript the signup cannot be sent
 *   (components/ui/NewsletterForm.tsx says so). Klaviyo does give every list a hosted subscribe
 *   page (help centre: the list → Sign-up forms → "Copy Subscribe Page URL"): a possible link
 *   for the no-JavaScript line, the owner's call (it leaves the site for a page at Klaviyo;
 *   where that page is hosted is not stated).
 * UNCONFIRMED, to settle with the first real signup from the preview (README, option B):
 * - CORS. No Klaviyo page documents the preflight's answer (the allowed origin, and the
 *   `revision` and `content-type` headers); there is only "designed to be called from
 *   publicly-browseable, client-side environments" and a community thread that reports 202
 *   from Chrome, Firefox and Safari. If the preflight fails, every signup fails: watch the
 *   OPTIONS and the POST (2xx, no 3xx) in those three browsers, from each origin in use.
 * - The host for an account in Klaviyo's EU (Germany) environment: every developer page names
 *   a.klaviyo.com only. Ask Klaviyo in writing; `origin` below is the one place to change,
 *   together with the CSP's connect-src (config/securityHeaders.ts and netlify.toml).
 * - Content blockers: a.klaviyo.com is Klaviyo's tracking host and is likely on blocklists
 *   (uBlock Origin, Brave, Firefox strict mode, DNS filters). Not verified. A blocked request
 *   gets no answer, so those visitors would see the form's submit error (with the e-mail
 *   address as the way out). Try one signup with a content blocker on.
 * - The answer for an unknown list id (202 or 4xx): a wrong `listId` could show the receipt
 *   while nothing is added. After the first signup, find the profile on the list in Klaviyo,
 *   with its `custom_source`.
 * - The list id's alphabet (check:market only rejects empty ids, spaces and placeholders).
 */
export const klaviyo = {
  origin: "https://a.klaviyo.com",
  subscriptionsPath: "/client/subscriptions",
  /**
   * API revision, sent as the `revision` header: the ONE place it is set. A revision is stable
   * for one year, deprecated for the next ("Starts 1 year after release. Lasts for 1 year.") and
   * retired after two, when Klaviyo answers "with the same behavior as the next oldest
   * revision" (https://developers.klaviyo.com/en/docs/api_versioning_and_deprecation_policy).
   * So 2026-10-15 is deprecated from October 2027 and retired about October 2028: move to the
   * current revision by about April 2028 (Klaviyo: "every 12-18 months") and re-read the
   * endpoint's spec first: https://developers.klaviyo.com/en/reference/create_client_subscription
   */
  revision: "2026-10-15",
  mediaType: "application/vnd.api+json",
  /** "Your public API key is your 6-character company ID, also known as a site ID." */
  companyIdPattern: /^[A-Za-z0-9]{6}$/,
} as const;

/** Every origin a form provider is reached at (check:market: none of them in the CSP unless in use). */
export const formProviderOrigins: Record<Exclude<FormProvider, "netlify">, string> = {
  formward: formward.origin,
  formspree: formspree.origin,
  klaviyo: klaviyo.origin,
};

export type FormCspSource = {
  directive: "connect-src" | "form-action";
  /** A URL the page calls at the provider (the CSP must allow its origin). */
  url: string;
};

/**
 * What the Content-Security-Policy must allow for one form's backend (config/securityHeaders.ts →
 * cspDirectives, and the copy in netlify.toml): `connect-src` for the fetch with JavaScript,
 * `form-action` for the plain POST without it. Netlify Forms needs nothing: both go to 'self'.
 * Formspree and Klaviyo are only ever reached with fetch, so they are never in `form-action`.
 */
export function formCspSources(backend: FormBackend): FormCspSource[] {
  switch (backend.provider) {
    case "netlify":
      return [];
    case "formward":
      return [
        { directive: "connect-src", url: backend.endpoint },
        { directive: "form-action", url: backend.endpoint },
      ];
    case "formspree":
      return [{ directive: "connect-src", url: backend.endpoint }];
    case "klaviyo":
      return [{ directive: "connect-src", url: `${klaviyo.origin}${klaviyo.subscriptionsPath}` }];
    default:
      return unknownFormProvider(backend);
  }
}

/** The `never` default of every provider switch: TypeScript lists the case that is missing. */
export function unknownFormProvider(backend: never): never {
  throw new Error(`Unknown form provider: ${JSON.stringify(backend)}`);
}

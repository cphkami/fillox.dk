#!/usr/bin/env node
/**
 * npm run check:market (also runs before every build as "prebuild").
 *
 * The app/ folder names are the real routes, content/routes.ts is the map every page, link,
 * canonical URL and the sitemap is built from. A market with other slugs (fillox.no:
 * /om-oss, /personvern …) edits routes.ts AND renames the app/ folders; this script fails
 * the build when the two drift apart:
 *
 * 1. every route in content/routes.ts has an app/<path>/page.tsx;
 * 2. every static page in app/ is a route in content/routes.ts (no page is reachable only
 *    through a path literal);
 * 3. the collections linked as `${route}/<slug>` (treatments, practitioners, blog) have an
 *    app/<path>/[slug]/page.tsx;
 * 4. every redirect in content/redirects.ts lands on a route (or on a page of a collection, or on
 *    a file the site serves: the generated /sitemap.xml, a metadata file in app/ such as
 *    /apple-icon.png, or a file in public/ such as /legacy-sitemap.xml); one
 *    to a treatment page (not a static route inside it, such as /behandlinger/fillers) names an
 *    existing treatment, and its #anchor (if any) is a section or
 *    item id of that page's long-form content (content/types.ts → TreatmentSection); the same for
 *    the price list's links (content/prices.ts → treatmentSlug / treatmentAnchor);
 * 5. every form has its thank-you route (routes.contactThanks, routes.newsletterThanks), and the
 *    no-JavaScript targets of the forms that are at Netlify Forms (content/forms.ts →
 *    netlifyNoJsActions: public/__kontakt-sendt.html, public/__nyhedsbrev-tilmeldt.html) forward
 *    to it; the copy lives on those routes, never in public/. (Formward redirects to the route
 *    itself; Formspree and Klaviyo are sent with JavaScript only: lib/forms.ts → formPost.)
 *
 * And the other market data that lives outside content/ or is only checked at runtime:
 *
 * 6. every form of content/forms.ts whose provider is "netlify" (config/site.ts → forms) is
 *    declared in public/__forms.html, and that file declares no other form: not an unknown one,
 *    and not one that has left Netlify (Netlify would keep accepting and storing posts to it);
 * 7. the booking provider has what it needs: with "timma" every open clinic has
 *    booking.timmaId (content/clinics.ts); with "gecko" clinics without a calendar id are listed;
 * 8. every open clinic's address and opening hours parse into the structured data
 *    (components/seo/OrganizationJsonLd.tsx), which otherwise silently drops them; a closed day
 *    (`closed: true`, "Søn lukket") is left out of it, has a known day label and no hours too;
 * 9. no string in app/, components/ or lib/ contains æ, ø or å (copy belongs in content/); the
 *    dev-only tools in components/dev/ (never in a production build) keep their labels inline;
 * 10. customer reviews (content/reviews.ts) are quoted verbatim: every excerpt (`short`) is whole
 *     sentences of its review's text, in order, with "…" wherever text is left out; every set
 *     lists existing reviews, and a practitioner / treatment set only reviews that name it;
 *     treatmentsWithoutReviews lists existing treatments that have no review set;
 * 12. no static page shadows a collection page: a folder like app/behandlinger/for-maend wins
 *     over app/behandlinger/[slug], so no treatment, team member or blog post may take its slug;
 * 13. components/dev/ (the colour tuner) stays dev-only: rule 9 and Tailwind's scan skip it, so
 *     only app/layout.tsx may import it, and only as a dynamic import() under
 *     `process.env.NODE_ENV === "development"` (which a production build drops).
 * 14. the blog (content/blog.ts): `published` is a boolean when set; a post on hold
 *     (`published: false`) is linked from nowhere (no published post's "Læs også", no treatment
 *     page, no article link, no redirect, no `/blog/<slug>` literal in the code or content); the
 *     featured post is published; a published post names no practitioner as its author (it is
 *     signed by the team), lists known filters, treatments and published related posts, has unique
 *     heading ids, links that land on pages (a "/blog/<slug>#id" link: on a heading of that post;
 *     tel: links pass), and a reading time that matches its text (≈ 200
 *     words a minute); "Alle artikler om …" links on treatment pages open a chip that /blog shows;
 *     no filter chip and no published post names a prescription medicine (Botox, its active
 *     substance or another brand of it; hyaluronidase / Hyalase; lidocaine / Xylocain) in its slug,
 *     title, excerpts, category, kind, tags, image, headings, booking card or links, and no published
 *     post shows a booking card (with its "fra" price) for a page in content/reviews.ts →
 *     treatmentsWithoutReviews (the rynkebehandling pages).
 * 15. security headers: netlify.toml's [[headers]] for "/*" (files the CDN serves) lists exactly
 *     the names and values of config/securityHeaders.ts, and no other [[headers]] block sets one of
 *     them; next.config.ts → headers() (evaluated) returns exactly one rule on "/:path*" with exactly
 *     that list (everything the Next.js server answers) and no other rule that sets one of them; the
 *     CSP lets in the booking provider (Gecko's script and calendar, or the TIMMA page) and, with a
 *     GTM container, www.googletagmanager.com.
 * 16. the team (content/team.ts → teamRoster): slugs are unique; a member without a portrait photo
 *     (`image`) has no profile page (`profile`), no share image, no offers, no link and no booking
 *     link (the team grids draw the placeholder and the card is not a link); a member with a
 *     profile page has a portrait whose file is in public/ with its pixel size, a share image
 *     whose file is in public/, and a row in the face table (`faces`); a photo in `image` is a
 *     file in public/.
 * 17. where practitioners work (`clinicSlugs`, the only source): every slug is an open clinic in
 *     content/clinics.ts, listed once; every member has at least one, except those listed in
 *     content/team.ts → clinicsUnknown, which lists existing members that have none; no text about
 *     a practitioner (their content/team.ts entry, their "Din behandler" block on treatment pages)
 *     names a clinic outside their clinicSlugs, in any case or spacing ("city 2") or by an alias
 *     ("Frb", "Taastrup"; reviews are verbatim and not checked); a profile with clinics has the
 *     fact clinicShortList(clinicSlugs) ("Arbejder i").
 * 18. the other prescription medicines of rule 14 (hyaluronidase / Hyalase, which dissolves filler;
 *     lidocaine / Xylocain, the anaesthetic in fillers) are named in no text a visitor reads: every
 *     row of the price list (labels, notes), every text of content/treatments.ts (FAQ answers
 *     included), of the team (content/team.ts: cards, bios, offers) and of every page's copy
 *     (each export of content/pages/*.ts), and every text of a published post, its body included.
 *     A treatment another module embeds (the fillers page's cards) is checked once, as itself.
 *     One exception (`HYALURONIDASE_SENTENCE`): Alberte's last sentence of the lip filler FAQ "Hvorfor
 *     vælger nogle at få opløst læbefiller?", which names hyaluronidase, in that answer of the lip
 *     filler treatment only (the owner: "gør hvad hun skriver og det samme gælder botox", an
 *     accepted § 66 risk, README).
 *     Botox is not checked here: the rynkebehandling hub keeps the agency's FAQ "Hvad er forskellen
 *     på Botox og filler?" (an open legal question, README).
 * 19. Botox (or another botulinum toxin brand) is named in no menu or category (content/navigation.ts,
 *     the mobile menu's copy in content/layout.ts), no price card, no treatment's slug, name, mobile
 *     menu name, meta title, one-liner, title, heading, lead, meta description or photo alt text,
 *     and nowhere on the fillers page (content/pages/fillers.ts; its cards' treatments are checked
 *     as treatments, above): those say "rynkebehandling"
 *     (owner 2026-11-25). Exceptions, exactly these menu labels (`BOTOX_MENU_LABELS`): the mega menu
 *     column of the rynkebehandling pages (eyebrow "Botox", its "Alle …" link), the category's
 *     mobile menu label (`mobileName`) and its "Se alle …" link. Alberte 2026-11-26: "Brug botox som
 *     menupunkt i stedet for Rynker"; the owner, told about § 66 first: "gør hvad hun skriver og det
 *     samme gælder botox" (an accepted risk, README "Før lancering").
 * 20. no text of content/ (every export of every module but content/redirects.ts, whose legacy
 *     addresses and notes no visitor reads) or config/site.ts names the FDA (the owner 2026-11-27:
 *     "ja ikke fda godkendt det dropper vi.. skal du ikke skrive") or the filler brands Fillox does
 *     not use, Juvéderm and Belotero (Alberte 2026-11-26: "Brug Revanesse® som det eneste
 *     fillermærke"). Code comments are not texts, so they may quote the decisions.
 * 21. form providers (config/site.ts → forms, one backend per form of content/forms.ts;
 *     config/formProviders.ts has each provider's facts): a "formward" endpoint is exactly
 *     https://forms.formward.eu/f/<form id> (as `new URL()` writes it: no credentials, port,
 *     query or placeholder), and no two forms share one; a "formspree" endpoint is exactly
 *     https://formspree.io/f/<form id> by the same rules (https, that host, letters and digits;
 *     the dashboard address /forms/<id> is named in the error), one per form; "klaviyo" (newsletter only) has the
 *     account's 6-character PUBLIC key as companyId, never a private key, a list id, and
 *     optIn "single" or "double" (the list's own setting, which decides the receipt's text); and
 *     (checked with rule 15) the CSP's connect-src and form-action allow what the providers in
 *     use need, no directive lists a form provider that no form uses, and, while a form is at
 *     Formward or Formspree, Referrer-Policy is not "no-referrer" or "same-origin" (Formward's
 *     plain POST without JavaScript would then carry `Origin: null`; Formspree's "Restrict to
 *     Domain" reads the Referer header and would file every message as spam).
 *     NOT a launch blocker any more: a form that is still at Netlify Forms (today the
 *     newsletter) is a NOTE on every build, the one that goes live included. Until 27/11-2026
 *     that build failed (the owner: "vi skal intet have i USA"). Later that day the owner chose
 *     to start with what works: "glem alt det med data mm og bare sat formspree op. det jo lige
 *     til..?". A failed go-live build would also be worse than the note: Netlify keeps serving
 *     the previous build, the noindex preview, on the domain.
 *
 * Notes (never fail the build): clinics without a Gecko calendar id (7), Trustpilot numbers
 * in config/site.ts last checked more than 60 days ago (11), a form that is still at Netlify
 * Forms (21, above), a form at Formspree (21: Formspree, Inc., USA; no published data processing
 * agreement; the owner's temporary choice, 27/11-2026), the newsletter at Klaviyo (21:
 * stored in the USA unless the account is in Klaviyo's EU environment; the opt-in stated in
 * the config), and, once the newsletter has left Netlify, a privacy policy whose "12.
 * Nyhedsbrev" still names no sender of the newsletter (21).
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import nodeModule from "node:module";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import * as tsHooks from "./ts-hooks.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const appDir = join(root, "app");

/** Imports a dependency-free TypeScript module (content/routes.ts, content/redirects.ts). */
async function importTs(file) {
  const source = readFileSync(join(root, file), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: file,
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

/** "/om-os#behandlere" → "/om-os", "/booking?klinik=x" → "/booking". */
const pathOf = (href) => href.split(/[?#]/)[0] || "/";

/** app/ page file of a route path ("/" → app/page.tsx). */
const pageFile = (path) => join(appDir, ...path.split("/").filter(Boolean), "page.tsx");

/** Static pages in app/: every page.tsx outside route groups' dynamic segments, as "/a/b". */
function staticAppRoutes(dir = appDir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // [slug] segments are collections; _private folders and @slots are not routes.
      if (/^[[_@]/.test(entry.name)) continue;
      found.push(...staticAppRoutes(full));
    } else if (entry.name === "page.tsx") {
      const segments = relative(appDir, dir)
        .split(sep)
        .filter(Boolean)
        // (group) folders do not appear in the URL.
        .filter((s) => !/^\(.*\)$/.test(s));
      found.push(`/${segments.join("/")}`);
    }
  }
  return found;
}

const { routes } = await importTs("content/routes.ts");
const { legacyRedirects } = await importTs("content/redirects.ts");

/** Route keys whose pages are `${route}/<slug>` (content/treatments.ts, team.ts, blog.ts). */
const collections = ["treatments", "practitioners", "blog"];

const errors = [];
const routePaths = new Set(Object.values(routes).map(pathOf));

// 1. Every route has a page.
for (const [key, href] of Object.entries(routes)) {
  const path = pathOf(href);
  if (!existsSync(pageFile(path))) {
    errors.push(`routes.${key} = "${href}" has no ${relative(root, pageFile(path))}`);
  }
}

// 2. Every static page is a route.
for (const path of staticAppRoutes()) {
  if (!routePaths.has(path)) {
    errors.push(`app${path === "/" ? "" : path}/page.tsx ("${path}") is not a route in content/routes.ts`);
  }
}

// 3. Collections have a [slug] page.
for (const key of collections) {
  const base = routes[key];
  if (!base) {
    errors.push(`routes.${key} is missing (collection route)`);
    continue;
  }
  const file = join(appDir, ...base.split("/").filter(Boolean), "[slug]", "page.tsx");
  if (!existsSync(file)) errors.push(`routes.${key} = "${base}" has no ${relative(root, file)}`);
}

// 4. Redirects land on a route or a collection page.
const collectionBases = collections.map((key) => routes[key]).filter(Boolean);
for (const { source, destination } of legacyRedirects) {
  const path = pathOf(destination);
  const onRoute = routePaths.has(path);
  const onCollection = collectionBases.some((base) => new RegExp(`^${base}/[^/]+$`).test(path));
  // Non-page targets the site serves: the generated sitemap, metadata images in app/
  // (apple-icon.png, icon.png) and static files in public/ (legacy-sitemap.xml).
  const isServedFile = (dir) => {
    const file = join(dir, ...path.split("/").filter(Boolean));
    return existsSync(file) && statSync(file).isFile();
  };
  const isFile =
    path === "/sitemap.xml" ||
    (/\.(png|ico|jpe?g|svg)$/i.test(path) && isServedFile(appDir)) ||
    (/\.[a-z0-9]+$/i.test(path) && isServedFile(join(root, "public")));
  if (!onRoute && !onCollection && !isFile) {
    errors.push(`redirect ${source} → ${destination}: "${path}" is not a route in content/routes.ts`);
  }
}

/* ------------------------------------------------------------------------------------------
 * 5–8 and 21 import the site's modules with their imports (config/site.ts, content/clinics.ts …)
 * through scripts/ts-hooks.mjs.
 */
if (typeof nodeModule.registerHooks === "function") {
  nodeModule.registerHooks({ resolve: tsHooks.resolve, load: tsHooks.load });
} else {
  nodeModule.register("./ts-hooks.mjs", import.meta.url);
}
const importSite = (file) => import(pathToFileURL(join(root, file)).href);
const notes = [];
const { site } = await importSite("config/site.ts");

// 21. Form providers: one well-formed backend per form (placed here: rules 5, 6 and 15 use it).
const { forms, netlifyNoJsActions } = await importTs("content/forms.ts");
const formProviders = await importSite("config/formProviders.ts");
/** [directive, url, what] of every well-formed backend: what the CSP must allow (rule 15). */
const formCspNeeds = [];
/**
 * Providers a form names with a backend that failed the checks below: what the CSP needs for it
 * is unknown until the config is right, so rule 15 does not call its sources unused (following
 * that advice would remove a source the form needs the moment its id is fixed).
 */
const formProvidersUnchecked = new Set();
/** A form without a provider the site knows for it: the content modules cannot be loaded (they throw). */
let formsConfigUnusable = false;
{
  const { formward, formspree, klaviyo, formCspSources } = formProviders;
  // "<form id>", "YOUR_FORM_ID", "…": a value copied from the comment or a provider's docs, not an id.
  const placeholder = /[<>\s…]|your[_-]|\.\.\./i;
  for (const kind of Object.keys(site.forms ?? {})) {
    if (!forms[kind]) errors.push(`config/site.ts forms.${kind}: content/forms.ts has no form "${kind}"`);
  }
  for (const [kind, name] of Object.entries(forms)) {
    const where = `config/site.ts forms.${kind}`;
    const backend = site.forms?.[kind];
    if (!backend) {
      errors.push(`${where} is missing: the form "${name}" (content/forms.ts) has no provider`);
      formsConfigUnusable = true;
      continue;
    }
    let ok = true;
    const fail = (message) => void ((ok = false), errors.push(message));
    if (backend.provider === "netlify") {
      // Declared in public/__forms.html: rule 6.
    } else if (backend.provider === "formward") {
      const endpoint = String(backend.endpoint ?? "");
      let url = null;
      try {
        url = new URL(endpoint);
      } catch {}
      // `url.href === endpoint`: the canonical spelling only (lower-case host, no ":443", nothing to
      // encode), so two spellings of one form cannot pass as two. No credentials: fetch() rejects such a URL.
      if (
        !url ||
        url.href !== endpoint ||
        url.username ||
        url.password ||
        url.origin !== formward.origin ||
        !formward.endpointPath.test(url.pathname) ||
        url.search ||
        url.hash ||
        placeholder.test(endpoint)
      ) {
        fail(`${where}.endpoint must be "${formward.origin}/f/<form id>", as the Formward dashboard shows it for this form (got "${endpoint}")`);
      }
    } else if (backend.provider === "formspree") {
      const endpoint = String(backend.endpoint ?? "");
      let url = null;
      try {
        url = new URL(endpoint);
      } catch {}
      // As for Formward: https, exactly that host, the canonical spelling, nothing but /f/<form id>.
      if (
        !url ||
        url.href !== endpoint ||
        url.username ||
        url.password ||
        url.origin !== formspree.origin ||
        !formspree.endpointPath.test(url.pathname) ||
        url.search ||
        url.hash ||
        placeholder.test(endpoint)
      ) {
        // The address people copy by mistake: the form's page in the dashboard.
        const dashboard = url?.origin === formspree.origin && formspree.dashboardPath.test(url.pathname);
        fail(
          `${where}.endpoint must be "${formspree.origin}/f/<form id>", as the form's Integration tab in the Formspree dashboard shows it` +
            `${dashboard ? ` ("${formspree.origin}/forms/<form id>" is the form's page in the dashboard, not its endpoint)` : ""} (got "${endpoint}")`,
        );
      }
    } else if (backend.provider === "klaviyo") {
      if (kind !== "newsletter") {
        fail(`${where}: Klaviyo takes newsletter signups only (config/types.ts → FormsConfig)`);
        formsConfigUnusable = true;
      }
      const companyId = String(backend.companyId ?? "");
      const listId = String(backend.listId ?? "");
      if (!klaviyo.companyIdPattern.test(companyId)) {
        fail(
          `${where}.companyId must be the Klaviyo account's 6-character PUBLIC API key ("Site ID"; it is sent from the browser, ` +
            `so never a private "pk_…" key) (got "${companyId}")`,
        );
      }
      // The list id's alphabet is not in Klaviyo's spec: only empty ids, spaces and placeholders are rejected.
      if (!/^[A-Za-z0-9_-]+$/.test(listId) || placeholder.test(listId)) {
        fail(`${where}.listId must be the id of the Klaviyo list the signups go to (Lists & segments → the list → Settings) (got "${listId}")`);
      }
      // The site cannot read the list's setting (Klaviyo answers 202 either way), so the config states it.
      if (backend.optIn !== "single" && backend.optIn !== "double") {
        fail(
          `${where}.optIn must be "double" or "single": the list's own "Opt-in process" in Klaviyo (the list → Settings → Consent). ` +
            `It decides the receipt on the page: with "double" the visitor is asked to confirm via the mail (got ${JSON.stringify(backend.optIn)})`,
        );
      }
    } else {
      fail(`${where}.provider "${backend.provider}" is unknown (config/types.ts → FormsConfig: netlify, formward, formspree, klaviyo)`);
      formsConfigUnusable = true;
    }
    if (ok) {
      for (const { directive, url } of formCspSources(backend)) formCspNeeds.push([directive, url, `the ${kind} form at ${backend.provider}`]);
    } else {
      formProvidersUnchecked.add(backend.provider);
    }
  }

  // One Formward / Formspree form (endpoint) per site form: a shared one would mix contact
  // messages and newsletter signups in one inbox, with one retention period and one notification setting.
  const formwardEndpoints = new Map();
  for (const kind of Object.keys(forms)) {
    const backend = site.forms?.[kind];
    if ((backend?.provider !== "formward" && backend?.provider !== "formspree") || !backend.endpoint) continue;
    // Compared as parsed URLs, so another spelling of the same endpoint is still the same form.
    let endpoint = String(backend.endpoint);
    try {
      endpoint = new URL(endpoint).href;
    } catch {}
    const other = formwardEndpoints.get(endpoint);
    if (other) {
      errors.push(
        `config/site.ts forms.${kind}.endpoint is the same ${backend.provider === "formspree" ? "Formspree" : "Formward"} form as forms.${other}: ` +
          `each form needs its own form there (its own retention, notifications and allowed origins)`,
      );
    }
    formwardEndpoints.set(endpoint, kind);
  }

  // A form still at Netlify Forms: a NOTE on every build, also the one that goes live. Until
  // 27/11-2026 it was an error on that build (the Netlify production build on the market's own
  // domain), after the owner's "vi skal intet have i USA". Later the same day the owner chose to
  // start with what works: "glem alt det med data mm og bare sat formspree op. det jo lige
  // til..? du har jo det info du skal bruge.. kræver jo ikke meget at sat det op med forrmspree."
  // So the newsletter may go live at Netlify Forms. An error there would also do more harm than
  // the note: Netlify keeps serving the previous build when one fails, and the previous build
  // is the noindex preview (README → "Domæneskiftet"). The privacy policy's "12. Nyhedsbrev"
  // names Netlify and the transfer to the USA while the newsletter is there.
  const atNetlifyForms = Object.keys(forms).filter((kind) => site.forms?.[kind]?.provider === "netlify");
  if (atNetlifyForms.length) {
    notes.push(
      `forms still at Netlify Forms: ${atNetlifyForms.join(", ")} — stored at Netlify, Inc. in the USA, on the live site too ` +
        `(a note only since 27/11-2026, owner: "glem alt det med data mm og bare sat formspree op"). ` +
        `To move a form: config/site.ts → forms; README → "Formularerne væk fra Netlify"`,
    );
  }
  // A form at Formspree: the owner's knowing, temporary choice (27/11-2026: "Formspree alligevel",
  // "det bare lige nu så vi kan starte, senere rykker vi til det svenske"), so never an error.
  const atFormspree = Object.keys(forms).filter((kind) => site.forms?.[kind]?.provider === "formspree");
  if (atFormspree.length) {
    notes.push(
      `${atFormspree.join(", ")} form at Formspree, Inc. (USA; no published data processing agreement; owner 27/11-2026: temporary, ` +
        `Formward later). Sent with JavaScript only; Formspree's own reCAPTCHA must be OFF for the form (README → "Formularerne væk fra Netlify")`,
    );
  }
  const klaviyoBackend = Object.values(site.forms ?? {}).find((backend) => backend?.provider === "klaviyo");
  if (klaviyoBackend) {
    notes.push(
      `the newsletter is at Klaviyo: Klaviyo, Inc. stores its accounts in the USA unless the account was created in its EU ` +
        `environment (owner 27/11-2026: "vi skal intet have i USA"). The privacy policy's "12. Nyhedsbrev" names the transfer and the ` +
        `EU-U.S. Data Privacy Framework: check that Klaviyo, Inc. is "Active" on dataprivacyframework.gov/list (content/pages/legal.ts). ` +
        `Opt-in: "${klaviyoBackend.optIn}" in config/site.ts; the list's "Opt-in process" in Klaviyo must say the same (the receipt on the page follows the config)`,
    );
  }
}
if (formsConfigUnusable) {
  // The checks below import content modules that read the forms' providers (the privacy policy's
  // "Databehandler" texts) and throw without one, so stop here with the reason.
  console.error(
    `check:market failed (${errors.length}; stopped at config/site.ts → forms, which the other checks need):\n` +
      errors.map((e) => `  - ${e}`).join("\n"),
  );
  process.exit(1);
}
/** Is this form (a key of content/forms.ts) at Netlify Forms? */
const atNetlify = (kind) => site.forms?.[kind]?.provider === "netlify";

// 21 (continued). Once the newsletter has left Netlify, the note above no longer speaks of it, but
// "12. Nyhedsbrev" may still say "vores e-mailudbyder" for the tool that sends the newsletter: an
// unnamed processor, and, were it a US service, an unnamed transfer (owner 27/11-2026: "vi skal
// intet have i USA").
if (!atNetlify("newsletter")) {
  const { newsletterSenderIsUnnamed } = await importSite("content/pages/legal.ts");
  if (newsletterSenderIsUnnamed) {
    notes.push(
      `the privacy policy's "12. Nyhedsbrev" names no sender of the newsletter ("vores e-mailudbyder"): name the tool, and its transfer ` +
        `basis if it is outside the EU, before the first newsletter is sent (content/pages/legal.ts → formProcessorTexts)`,
    );
  }
}

// 5. Every form has its thank-you route; the Netlify no-JS targets forward to it (static files in
//    public/ hold no copy). Formward redirects to the route itself; Formspree and Klaviyo are
//    sent with JavaScript only (no plain POST).
const thanksRouteKeys = { contact: "contactThanks", newsletter: "newsletterThanks" };
for (const kind of Object.keys(forms)) {
  const key = thanksRouteKeys[kind];
  if (!key || !routes[key]) {
    errors.push(`the ${kind} form has no thank-you route (${key ? `routes.${key} is missing` : "scripts/check-market.mjs thanksRouteKeys and lib/forms.ts thanksRoutes"})`);
    continue;
  }
  if (!atNetlify(kind)) continue;
  const file = String(netlifyNoJsActions[kind] ?? "").replace(/^\//, "");
  const noJs = join(root, "public", file);
  if (!file) {
    errors.push(`content/forms.ts netlifyNoJsActions.${kind} is missing (no-JavaScript target of the form at Netlify Forms)`);
  } else if (!existsSync(noJs)) {
    errors.push(`public/${file} is missing (no-JavaScript form target)`);
  } else if (!readFileSync(noJs, "utf8").includes(`url=${routes[key]}"`)) {
    errors.push(`public/${file} does not forward to routes.${key} ("${routes[key]}")`);
  }
}

// 6. Netlify Forms: the forms whose provider is "netlify" ↔ public/__forms.html.
const formsHtmlFile = join(root, "public", "__forms.html");
const formsHtml = existsSync(formsHtmlFile) ? readFileSync(formsHtmlFile, "utf8") : "";
const declaredForms = [...formsHtml.matchAll(/<form\b[^>]*\bname="([^"]+)"/g)].map((m) => m[1]);
for (const [key, name] of Object.entries(forms)) {
  if (!atNetlify(key)) {
    if (declaredForms.includes(name) && site.forms?.[key]) {
      errors.push(
        `public/__forms.html still declares form "${name}", but config/site.ts forms.${key} is at ${site.forms[key].provider}: ` +
          `delete its <form> there (Netlify would keep accepting and storing whatever is posted to it)`,
      );
    }
  } else if (!declaredForms.includes(name)) {
    errors.push(`forms.${key} = "${name}" is not declared in public/__forms.html (Netlify rejects its submissions)`);
  } else if (!formsHtml.includes(`name="form-name" value="${name}"`)) {
    errors.push(`public/__forms.html: form "${name}" has no hidden form-name input with value "${name}"`);
  }
}
for (const name of declaredForms) {
  if (!Object.values(forms).includes(name)) {
    errors.push(`public/__forms.html declares form "${name}", which is not in content/forms.ts`);
  }
}

// 7. Booking provider ids.
const { openClinics } = await importSite("content/clinics.ts");
if (site.booking.provider === "timma") {
  if (!/^https:\/\//.test(site.booking.timmaBaseUrl ?? "")) {
    errors.push(`config/site.ts booking.timmaBaseUrl must be an https URL (got "${site.booking.timmaBaseUrl}")`);
  }
  for (const clinic of openClinics) {
    if (!clinic.booking?.timmaId) {
      errors.push(`content/clinics.ts: open clinic "${clinic.slug}" has no booking.timmaId (TIMMA booking)`);
    }
  }
} else if (site.booking.provider === "gecko") {
  const missing = openClinics.filter((c) => !c.booking?.geckoCalendarId).map((c) => c.slug);
  if (missing.length) {
    notes.push(`no Gecko calendar id yet (booking links open the calendar unfiltered): ${missing.join(", ")}`);
  }
}

// 8. Structured data: every open clinic's address and hours parse.
const { organizationGraph } = await importSite("components/seo/OrganizationJsonLd.tsx");
const { seoContent } = await importSite("content/seo.ts");
const nodes = organizationGraph();
for (const clinic of openClinics) {
  const node = nodes.find((n) => n.name === clinic.fullName && n.address);
  if (!node) {
    errors.push(`structured data: no node for open clinic "${clinic.slug}"`);
    continue;
  }
  if (!node.address.postalCode) {
    errors.push(`content/clinics.ts "${clinic.slug}": last address line "${clinic.address.at(-1)}" is not "<postal code> <city>"`);
  }
  // A closed day ({ days: "Søn", hours: "lukket", closed: true }) is shown but left out of the
  // structured data; its day label must still be known, and it must not also have opening hours.
  const open = clinic.hours.filter((h) => !h.closed);
  if (node.openingHoursSpecification.length !== open.length) {
    errors.push(
      `content/clinics.ts "${clinic.slug}": opening hours ${JSON.stringify(open)} do not all parse ` +
        `(hours as "10–20" / "9.30–18", day labels listed in content/seo.ts openingDays)`,
    );
  }
  const openDays = new Set(node.openingHoursSpecification.flatMap((spec) => spec.dayOfWeek));
  for (const h of clinic.hours.filter((h) => h.closed)) {
    const days = seoContent.openingDays[h.days];
    if (!days) {
      errors.push(`content/clinics.ts "${clinic.slug}": closed day "${h.days}" is not listed in content/seo.ts openingDays`);
    } else if (days.some((day) => openDays.has(day))) {
      errors.push(`content/clinics.ts "${clinic.slug}": "${h.days}" is closed and has opening hours`);
    }
  }
}

// 9. No market copy in code: string literals, template text and JSX text with æ/ø/å.
const MARKET_LETTERS = /[æøåÆØÅ]/;
function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(tsx?|mjs)$/.test(entry.name) ? [full] : [];
  });
}
// components/dev/ (the colour tuner) is only mounted by `next dev`: its Danish labels are not market copy.
const devOnlyDir = join(root, "components", "dev") + sep;
for (const file of ["app", "components", "lib"]
  .flatMap((dir) => sourceFiles(join(root, dir)))
  .filter((file) => !file.startsWith(devOnlyDir))) {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isJsxText(node) ||
      ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      if (MARKET_LETTERS.test(node.text)) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart());
        errors.push(`${relative(root, file)}:${line + 1}: market copy in code ("${node.text.trim().slice(0, 40)}"), move it to content/`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

// 10. Reviews: verbatim excerpts and consistent sets.
const { reviews, reviewSets, treatmentsWithoutReviews } = await importSite("content/reviews.ts");
// `team`: the practitioners with a profile page (review sets, blog authors); `teamRoster`: everyone.
const { team, teamRoster, clinicsUnknown, hasMeasuredFace } = await importSite("content/team.ts");
const { treatments } = await importSite("content/treatments.ts");
const ELLIPSIS = "…";
const squash = (text) => text.replace(/\s+/g, " ").trim();
// A sentence ends with . ! ? … or an emoji (reviews often end a sentence with one).
const SENTENCE_END = /(?:[.!?…]|\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}\uFE0F])$/u;
const reviewIds = new Set();
for (const review of reviews) {
  const where = `content/reviews.ts "${review.id}"`;
  if (reviewIds.has(review.id)) errors.push(`${where}: duplicate id`);
  reviewIds.add(review.id);
  if (!review.text?.trim() || !review.author?.trim()) errors.push(`${where}: text and author are required`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.date) || Number.isNaN(Date.parse(review.date))) {
    errors.push(`${where}: date must be an ISO date (got "${review.date}")`);
  }
  if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) errors.push(`${where}: rating must be 1–5`);
  if (!/^https:\/\//.test(review.url)) errors.push(`${where}: url must be the review's https page`);
  if (review.short === undefined) continue;
  const text = squash(review.text);
  const short = squash(review.short);
  const parts = short.split(ELLIPSIS).map((part) => part.trim()).filter(Boolean);
  let position = 0;
  for (const [i, part] of parts.entries()) {
    const at = text.indexOf(part, position);
    if (at < 0) {
      errors.push(`${where}: short is not verbatim from the text ("${part.slice(0, 50)}")`);
      break;
    }
    if (i === 0 && at > 0 && !short.startsWith(ELLIPSIS)) errors.push(`${where}: short leaves out the start without "…"`);
    if (at > 0 && !SENTENCE_END.test(text.slice(0, at).trimEnd())) {
      errors.push(`${where}: short starts mid-sentence ("${part.slice(0, 30)}")`);
    }
    if (!SENTENCE_END.test(part) && at + part.length < text.length) {
      errors.push(`${where}: short cuts a sentence ("…${part.slice(-30)}")`);
    }
    position = at + part.length;
  }
  if (position < text.length && !short.endsWith(ELLIPSIS)) errors.push(`${where}: short leaves out the end without "…"`);
}
const teamSlugs = new Set(team.map((member) => member.slug));
const treatmentSlugs = new Set(treatments.map((treatment) => treatment.slug));
const checkSet = (name, ids, belongs) => {
  if (new Set(ids).size !== ids.length) errors.push(`content/reviews.ts reviewSets.${name}: a review is listed twice`);
  for (const id of ids) {
    const review = reviews.find((r) => r.id === id);
    if (!review) errors.push(`content/reviews.ts reviewSets.${name}: unknown review "${id}"`);
    else if (belongs && !belongs(review)) errors.push(`content/reviews.ts reviewSets.${name}: "${id}" ${belongs.reason}`);
  }
};
checkSet("home", reviewSets.home);
const isGeneral = (review) => !review.practitioners?.length && !review.treatments?.length;
isGeneral.reason = "names a practitioner or treatment (general reviews must fit every page)";
checkSet("general", reviewSets.general, isGeneral);
for (const [slug, ids] of Object.entries(reviewSets.practitioners)) {
  if (!teamSlugs.has(slug)) {
    errors.push(`content/reviews.ts reviewSets.practitioners: "${slug}" is not a practitioner with a profile page in content/team.ts`);
  }
  const names = (review) => review.practitioners?.includes(slug);
  names.reason = `does not name ${slug} (practitioners)`;
  checkSet(`practitioners.${slug}`, ids, names);
}
for (const [slug, ids] of Object.entries(reviewSets.treatments)) {
  if (!treatmentSlugs.has(slug)) errors.push(`content/reviews.ts reviewSets.treatments: "${slug}" is not in content/treatments.ts`);
  const about = (review) => review.treatments?.includes(slug);
  about.reason = `is not about ${slug} (treatments)`;
  checkSet(`treatments.${slug}`, ids, about);
}
for (const slug of treatmentsWithoutReviews) {
  if (!treatmentSlugs.has(slug)) errors.push(`content/reviews.ts treatmentsWithoutReviews: "${slug}" is not in content/treatments.ts`);
  if (reviewSets.treatments[slug]?.length) {
    errors.push(`content/reviews.ts reviewSets.treatments.${slug}: the page shows no reviews (treatmentsWithoutReviews)`);
  }
}

// 4 (continued). Links into treatment pages name a treatment that exists, and an anchor its page has.
{
  /** Section and item ids of a treatment's long-form content (detail.sections). */
  const anchorsOf = (treatment) =>
    new Set(
      (treatment.detail?.sections ?? []).flatMap((section) => [
        section.id,
        ...(section.items ?? []).flatMap((item) => (item.id ? [item.id] : [])),
      ]),
    );
  const checkTreatmentLink = (where, slug, anchor) => {
    const treatment = treatments.find((t) => t.slug === slug);
    if (!treatment) errors.push(`${where}: "${slug}" is not a treatment in content/treatments.ts`);
    else if (anchor && !anchorsOf(treatment).has(anchor)) {
      errors.push(`${where}: "#${anchor}" is not a section or item id of the "${slug}" page (detail.sections)`);
    }
  };
  const treatmentsBase = routes.treatments;
  for (const { source, destination } of legacyRedirects) {
    const [path, anchor] = destination.split("#");
    // A static page inside the collection (app/behandlinger/fillers, …/for-maend) is a route, not a
    // treatment (rule 12 keeps the two apart).
    if (routePaths.has(path)) continue;
    const match = path.match(new RegExp(`^${treatmentsBase}/([^/?]+)$`));
    if (match) checkTreatmentLink(`redirect ${source} → ${destination}`, match[1], anchor);
  }
  const { priceCards } = await importSite("content/prices.ts");
  for (const card of priceCards) {
    for (const row of card.rows) {
      if (row.treatmentAnchor && !row.treatmentSlug) {
        errors.push(`content/prices.ts "${row.label}": treatmentAnchor without a treatmentSlug`);
      } else if (row.treatmentSlug) {
        checkTreatmentLink(`content/prices.ts "${row.label}"`, row.treatmentSlug, row.treatmentAnchor);
      }
    }
  }
}

// 11. Trustpilot numbers (static on every page) are recent: a note, not an error.
{
  const { checked, url } = site.trustpilot;
  const maxAgeDays = 60;
  const age = checked ? Math.floor((Date.now() - Date.parse(`${checked}T00:00:00Z`)) / 86_400_000) : NaN;
  if (!checked || Number.isNaN(age)) {
    notes.push(`config/site.ts trustpilot.checked is not an ISO day: set it when you copy score and reviewCount from ${url}`);
  } else if (age > maxAgeDays) {
    notes.push(
      `Trustpilot numbers in config/site.ts were checked ${checked} (${age} days ago): update score, reviewCount, ` +
        `content/ui.ts → trustpilotLabel and checked from ${url}`,
    );
  }
}

// 12. Static pages inside a collection (app/behandlinger/for-maend) never take a collection slug.
{
  // Every post, also those on hold: re-enabling one must not collide with a static page.
  const { allPosts } = await importSite("content/blog.ts");
  const collectionSlugs = {
    treatments: treatmentSlugs,
    // Everyone, also a member without a profile page yet: its slug becomes a page later.
    practitioners: new Set(teamRoster.map((member) => member.slug)),
    blog: new Set(allPosts.map((post) => post.slug)),
  };
  for (const path of staticAppRoutes()) {
    for (const key of collections) {
      const base = routes[key];
      if (!base || !path.startsWith(`${base}/`)) continue;
      const slug = path.slice(base.length + 1);
      if (!slug.includes("/") && collectionSlugs[key].has(slug)) {
        errors.push(`app${path}/page.tsx shadows the ${key} page "${slug}" (${base}/[slug]): rename one of them`);
      }
    }
  }
}

// 13. components/dev/ is only reachable from app/layout.tsx, behind the NODE_ENV guard.
{
  const devDir = join(root, "components", "dev");
  const inDevDir = (path) => path === devDir || path.startsWith(devDir + sep);
  const layoutFile = join(appDir, "layout.tsx");
  const DEV_GUARD = /^process\.env\.NODE_ENV\s*===\s*["']development["']$/;
  /** The import() sits in the true branch of `NODE_ENV === "development" ? … : …` (or if / &&). */
  const guarded = (node) => {
    for (let child = node, parent = node.parent; parent; child = parent, parent = parent.parent) {
      if (ts.isConditionalExpression(parent) && parent.whenTrue === child) return DEV_GUARD.test(parent.condition.getText().trim());
      if (ts.isIfStatement(parent) && parent.thenStatement === child) return DEV_GUARD.test(parent.expression.getText().trim());
      if (ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && parent.right === child) {
        return DEV_GUARD.test(parent.left.getText().trim());
      }
    }
    return false;
  };
  const rootFiles = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(tsx?|mjs)$/.test(entry.name))
    .map((entry) => join(root, entry.name));
  const files = [...rootFiles, ...["app", "components", "lib", "content", "config"].flatMap((dir) => sourceFiles(join(root, dir)))];
  for (const file of files.filter((f) => !inDevDir(f))) {
    const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
    const where = (node) => `${relative(root, file)}:${source.getLineAndCharacterOfPosition(node.getStart()).line + 1}`;
    const check = (node, specifier, dynamic) => {
      if (!ts.isStringLiteralLike(specifier)) return;
      const spec = specifier.text;
      const target = spec.startsWith("@/") ? join(root, spec.slice(2)) : spec.startsWith(".") ? join(dirname(file), spec) : null;
      if (!target || !inDevDir(target)) return;
      if (file !== layoutFile) {
        errors.push(`${where(node)}: imports the dev-only "${spec}"; only app/layout.tsx may (components/dev never ships)`);
      } else if (!dynamic || !guarded(node)) {
        errors.push(
          `${where(node)}: "${spec}" must be a dynamic import() under process.env.NODE_ENV === "development" ` +
            `(a static import would ship the dev-only tuner)`,
        );
      }
    };
    const visit = (node) => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
        check(node, node.moduleSpecifier, false);
      } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
        check(node, node.moduleReference.expression, false);
      } else if (ts.isCallExpression(node) && node.arguments.length) {
        const dynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
        const required = ts.isIdentifier(node.expression) && node.expression.text === "require";
        if (dynamicImport || required) check(node, node.arguments[0], dynamicImport);
      } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
        check(node, node.argument.literal, false);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
}

// Prescription medicines other than Botox that the site never names (owner 2026-11-26, the same rule as
// for Botox): hyaluronidase, which dissolves filler (Hyalase), and the local anaesthetic lidocaine
// (Xylocain). Rule 14 (posts) and rule 18 (price list, treatment pages, post bodies).
const OTHER_PRESCRIPTION_NAME = /hyalase|hyaluronidase|lidocain|lidokain|xylocain/i;
// Botox: the product, its active substance and the other brands of botulinum toxin (rules 14 and 19).
const BOTULINUM_NAME =
  /botox|botulin|vistabel|bocouture|xeomin|azzalure|dysport|alluzience|letybo|nuceiva|jeuveau|relfydess|daxxify/i;

// 14. Blog: posts on hold are linked from nowhere; published posts are signed by the team, consistent and
//     name no prescription medicine.
const blog = await importSite("content/blog.ts");
{
  const { allPosts, posts, allBlogFilters, blogFilters, postFilterSlugs } = blog;
  const { blogPage } = await importSite("content/pages/blog.ts");
  const where = (post) => `content/blog.ts "${post.slug}"`;
  const published = new Set(posts.map((post) => post.slug));
  const held = allPosts.filter((post) => !published.has(post.slug));
  const knownFilters = new Set(allBlogFilters.map((filter) => filter.slug));
  const shownFilters = new Set(blogFilters.map((filter) => filter.slug));
  const SLUG = /^[a-z0-9-]+$/;
  const WORDS_PER_MINUTE = 200;
  // Botox is a prescription medicine: never advertised to the public, also not on the clinic's own
  // site (lægemiddelloven § 66; owner 2026-11-25). The brands of botulinum toxin and its name, and the
  // other prescription medicines above (owner 2026-11-26).
  const PRESCRIPTION_NAME = new RegExp(`${BOTULINUM_NAME.source}|${OTHER_PRESCRIPTION_NAME.source}`, "i");
  /** The pages about a prescription medicine (no reviews, no price): no booking card points there. */
  const prescriptionPages = new Set(treatmentsWithoutReviews);
  for (const filter of allBlogFilters) {
    if (PRESCRIPTION_NAME.test(`${filter.slug} ${filter.label}`)) {
      errors.push(`content/blog.ts allBlogFilters: the chip "${filter.label}" names a prescription medicine`);
    }
  }
  const words = (text = "") => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  /**
   * A site href lands on a page: a route, a treatment or practitioner page, or a published post.
   * A tel: link (the on-call line) is not a page and always passes.
   */
  const pagesOf = { treatments: treatmentSlugs, practitioners: teamSlugs, blog: published };
  const landsOnPage = (href) => {
    if (href.startsWith("tel:")) return true;
    const path = pathOf(href);
    if (routePaths.has(path)) return true;
    return Object.entries(pagesOf).some(([key, slugs]) => {
      const base = routes[key];
      return Boolean(base) && path.startsWith(`${base}/`) && slugs.has(path.slice(base.length + 1));
    });
  };

  const slugs = new Set();
  for (const post of allPosts) {
    if (slugs.has(post.slug)) errors.push(`${where(post)}: duplicate slug`);
    slugs.add(post.slug);
    if (!SLUG.test(post.slug)) errors.push(`${where(post)}: slug must be lowercase a–z, 0–9 and "-"`);
    if (post.published !== undefined && typeof post.published !== "boolean") {
      errors.push(`${where(post)}: published must be true or false (got ${JSON.stringify(post.published)})`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || Number.isNaN(Date.parse(post.date))) {
      errors.push(`${where(post)}: date must be an ISO day (got "${post.date}")`);
    }
    if (post.authorSlug && !teamSlugs.has(post.authorSlug)) {
      errors.push(`${where(post)}: authorSlug "${post.authorSlug}" is not in content/team.ts`);
    }
    for (const slug of postFilterSlugs(post)) {
      if (!knownFilters.has(slug)) errors.push(`${where(post)}: "${slug}" is not a filter in allBlogFilters`);
    }
    for (const slug of post.treatmentSlugs ?? []) {
      if (!treatmentSlugs.has(slug)) errors.push(`${where(post)}: treatmentSlugs "${slug}" is not in content/treatments.ts`);
    }
  }

  if (!posts.length) errors.push("content/blog.ts: no published post (/blog would be empty)");
  const featured = allPosts.filter((post) => post.featured);
  if (featured.length > 1) errors.push(`content/blog.ts: more than one featured post (${featured.map((p) => p.slug).join(", ")})`);
  for (const post of featured) {
    if (!published.has(post.slug)) errors.push(`${where(post)}: featured, but on hold (published: false)`);
  }

  for (const post of posts) {
    // BEK 253/2025 § 10: no health professional endorsing a product in an ad; owner 2026-11-25: "Fillox-holdet".
    if (post.authorSlug) {
      errors.push(
        `${where(post)}: published with a practitioner ("${post.authorSlug}") as author; published posts are ` +
          `signed by the team (remove authorSlug)`,
      );
    }
    // Everything a post shows of itself (its page, card, meta and share image) names no prescription
    // medicine; the body text may use the rynkebehandling pages' own words.
    const shown = [
      post.slug, post.title, post.excerpt, post.excerptShort, post.category, post.categorySlug, post.kind,
      ...(post.tags ?? []), post.image?.src, post.image?.alt, post.image?.share?.src,
      ...(post.body ?? []).flatMap((block) => {
        if (block.type === "h2" || block.type === "h3") return [block.id, block.text];
        if (block.type === "booking") return [block.eyebrow, block.note];
        if (block.type === "links") return block.items.flatMap((link) => [link.label, link.href]);
        if (block.type === "image") return [block.image.src, block.image.alt, block.caption];
        return [];
      }),
    ];
    const named = shown.find((text) => typeof text === "string" && PRESCRIPTION_NAME.test(text));
    if (named) errors.push(`${where(post)}: names a prescription medicine ("${named}"); write about the treatment (rynkebehandling)`);
    // An excerpt-only post gets a booking card for its first treatment (components/blog/articleView.ts).
    const firstTreatment = post.treatmentSlugs?.[0];
    if (!post.body?.length && firstTreatment && prescriptionPages.has(firstTreatment)) {
      errors.push(`${where(post)}: excerpt-only post about "${firstTreatment}" would show a booking card with its price (write the body)`);
    }
    for (const key of ["relatedPostSlugs", "relatedPostSlugsMobile"]) {
      for (const slug of post[key] ?? []) {
        if (!slugs.has(slug)) errors.push(`${where(post)}: ${key} names an unknown post "${slug}"`);
        else if (!published.has(slug)) errors.push(`${where(post)}: ${key} names "${slug}", which is on hold`);
      }
    }
    if (!post.body?.length) continue;
    const ids = new Set();
    let count = 0;
    for (const block of post.body) {
      if (block.type === "h2" || block.type === "h3") {
        if (!SLUG.test(block.id)) errors.push(`${where(post)}: heading id "${block.id}" must be lowercase a–z, 0–9 and "-"`);
        if (ids.has(block.id)) errors.push(`${where(post)}: heading id "${block.id}" is used twice`);
        ids.add(block.id);
      }
      if (["lead", "paragraph", "h2", "h3", "quote", "tip"].includes(block.type)) count += words(block.text) + words(block.title);
      if (block.type === "list") count += block.items.reduce((sum, item) => sum + words(item), 0);
      if (block.type === "booking" && !treatmentSlugs.has(block.treatmentSlug)) {
        errors.push(`${where(post)}: booking card for "${block.treatmentSlug}", which is not in content/treatments.ts`);
      }
      if (block.type === "booking" && prescriptionPages.has(block.treatmentSlug)) {
        errors.push(
          `${where(post)}: booking card for "${block.treatmentSlug}" shows its "fra" price, which the rynkebehandling ` +
            `pages leave out (link to the page and to booking instead)`,
        );
      }
      if (block.type === "links") {
        for (const link of block.items) {
          if (!landsOnPage(link.href)) errors.push(`${where(post)}: link "${link.label}" → ${link.href} lands on no page (or on a post on hold)`);
          // "/blog/<slug>#<id>": the post has that heading.
          const [path, hash] = link.href.split("#");
          const target = hash && path.startsWith(`${routes.blog}/`) ? posts.find((p) => `${routes.blog}/${p.slug}` === path) : null;
          if (target && !target.body?.some((b) => (b.type === "h2" || b.type === "h3") && b.id === hash)) {
            errors.push(`${where(post)}: link "${link.label}" → ${link.href}: "${target.slug}" has no heading #${hash}`);
          }
        }
      }
    }
    const minutes = count / WORDS_PER_MINUTE;
    if (!post.readingMinutes || Math.abs(post.readingMinutes - minutes) > 1) {
      errors.push(
        `${where(post)}: readingMinutes ${post.readingMinutes} does not match the text ` +
          `(${count} words ≈ ${minutes.toFixed(1)} min at ${WORDS_PER_MINUTE} words a minute)`,
      );
    } else if (!post.readingTime.includes(String(post.readingMinutes))) {
      errors.push(`${where(post)}: readingTime "${post.readingTime}" does not say ${post.readingMinutes} minutes`);
    }
  }

  // Treatment pages: "Fra bloggen" lists published posts only, and "Alle artikler om …" opens a chip /blog shows.
  for (const treatment of treatments) {
    for (const slug of treatment.detail?.relatedPostSlugs ?? []) {
      if (!slugs.has(slug)) errors.push(`content/treatments.ts "${treatment.slug}": relatedPostSlugs names an unknown post "${slug}"`);
      else if (!published.has(slug)) errors.push(`content/treatments.ts "${treatment.slug}": relatedPostSlugs names "${slug}", which is on hold`);
    }
    const href = treatment.detail?.relatedPostsLink?.href;
    const filter = href ? new URL(href, "https://x.invalid").searchParams.get(blogPage.filterParam) : null;
    if (filter && !shownFilters.has(filter)) {
      errors.push(`content/treatments.ts "${treatment.slug}": relatedPostsLink opens the blog filter "${filter}", which has no published post`);
    }
  }

  // Nothing links a post on hold: redirects, and `/blog/<slug>` literals in the code, content and Netlify config.
  if (held.length) {
    const heldPaths = held.map((post) => `${routes.blog}/${post.slug}`);
    for (const { source, destination } of legacyRedirects) {
      if (heldPaths.includes(pathOf(destination))) errors.push(`redirect ${source} → ${destination}: the post is on hold (published: false)`);
    }
    const files = [
      ...["app", "components", "lib", "content", "config"].flatMap((dir) => sourceFiles(join(root, dir))),
      join(root, "netlify.toml"),
    ].filter((file) => existsSync(file));
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const path of heldPaths) {
        // A whole path: "/blog/x" but not "/blog/x-y".
        if (new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z0-9-])`).test(text)) {
          errors.push(`${relative(root, file)}: links ${path}, which is on hold (published: false)`);
        }
      }
    }
  }
}

// 15. Security headers: one set in config/securityHeaders.ts, copied into netlify.toml.
const { securityHeaders, cspDirectives, cspHeaderName } = await importTs("config/securityHeaders.ts");
{
  const name = (key) => key.toLowerCase();
  const isSecurityHeader = (key) => securityHeaders.some((h) => name(h.key) === name(key));
  // next.config.ts → headers(), evaluated (not searched for a word): exactly one rule on "/:path*"
  // with exactly the list of config/securityHeaders.ts, and no other rule that sets one of them.
  {
    const { default: nextConfig } = await importSite("next.config.ts");
    const rules = (await nextConfig.headers?.()) ?? [];
    const everywhere = rules.filter((r) => r.source === "/:path*");
    if (everywhere.length !== 1 || JSON.stringify(everywhere[0].headers) !== JSON.stringify(securityHeaders)) {
      errors.push('next.config.ts: headers() must return { source: "/:path*", headers: securityHeaders } exactly once');
    }
    for (const rule of rules) {
      if (rule !== everywhere[0] && rule.headers?.some((h) => isSecurityHeader(h.key))) {
        errors.push(`next.config.ts: headers() rule "${rule.source}" also sets a security header (config/securityHeaders.ts is the one list)`);
      }
    }
  }
  // netlify.toml's [[headers]] tables: `for` and the `Name = "value"` lines of [headers.values].
  const blocks = [];
  let block = null;
  readFileSync(join(root, "netlify.toml"), "utf8")
    .split("\n")
    .forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      if (/^\[\[headers\]\]$/.test(line)) return blocks.push((block = { line: i + 1, for: null, values: [], inValues: false }));
      if (line === "[headers.values]" && block) return void (block.inValues = true);
      if (line.startsWith("[")) return void (block = null);
      if (!block) return;
      const pair = /^([A-Za-z0-9-]+)\s*=\s*"([^"\\]*)"$/.exec(line);
      if (!pair) return errors.push(`netlify.toml:${i + 1}: write each header as Name = "value" on one line (no escapes)`);
      if (block.inValues) block.values.push({ key: pair[1], value: pair[2], line: i + 1 });
      else if (pair[1] === "for") block.for = pair[2];
    });
  const all = blocks.filter((b) => b.for === "/*");
  if (all.length !== 1) errors.push(`netlify.toml: needs exactly one [[headers]] for = "/*" (found ${all.length})`);
  const toml = all[0]?.values ?? [];
  for (const other of blocks.filter((b) => b.for !== "/*")) {
    for (const { key, line } of other.values) {
      if (isSecurityHeader(key)) {
        errors.push(`netlify.toml:${line}: [[headers]] "${other.for}" sets ${key}; security headers are set once, on "/*"`);
      }
    }
  }
  for (const [list, where] of [[securityHeaders, "config/securityHeaders.ts"], [toml, "netlify.toml"]]) {
    const seen = new Set();
    for (const { key } of list) {
      if (seen.has(name(key))) errors.push(`${where}: header ${key} is listed twice`);
      seen.add(name(key));
    }
  }
  for (const { key, value } of all.length === 1 ? securityHeaders : []) {
    const copy = toml.find((h) => name(h.key) === name(key));
    if (!copy) errors.push(`netlify.toml [[headers]] "/*": ${key} is missing (config/securityHeaders.ts sends it on pages)`);
    else if (copy.key !== key || copy.value !== value) {
      errors.push(`netlify.toml:${copy.line}: ${copy.key} differs from config/securityHeaders.ts (copy the value from there)`);
    }
  }
  for (const { key, line } of toml) {
    if (!isSecurityHeader(key)) {
      errors.push(`netlify.toml:${line}: ${key} is not in config/securityHeaders.ts (pages would not send it)`);
    }
  }
  // The CSP lets in what the site loads from other hosts (scheme + host; "*.x.dk" matches subdomains).
  const sourceAllows = (source, url) => {
    const { protocol, hostname } = new URL(url);
    const m = /^(https?:)\/\/(\*\.)?([^/:]+)/.exec(source);
    if (!m || m[1] !== protocol) return false;
    return m[2] ? hostname.endsWith(`.${m[3]}`) : hostname === m[3];
  };
  const allows = (directive, url) =>
    (cspDirectives[directive] ?? cspDirectives["default-src"] ?? []).some((source) => sourceAllows(source, url));
  const needs = [];
  if (site.booking.provider === "gecko") {
    needs.push(["script-src", `https://${site.booking.geckoHost}/site/iframe.js`, "Gecko's iframe.js"]);
    needs.push(["frame-src", `https://${site.booking.geckoHost}/`, "the Gecko calendar"]);
  } else if (site.booking.provider === "timma") {
    needs.push(["frame-src", site.booking.timmaBaseUrl, "the TIMMA reservation page"]);
  }
  if (site.analytics.gtmId) needs.push(["script-src", "https://www.googletagmanager.com/gtm.js", "the GTM container"]);
  for (const [directive, url, what] of needs) {
    if (!allows(directive, url)) {
      errors.push(`config/securityHeaders.ts: ${cspHeaderName} ${directive} does not allow ${new URL(url).origin} (${what})`);
    }
  }
  // Form providers (rule 21): the fetch needs connect-src, the plain POST without JavaScript
  // form-action. Exactly the providers in use: a provider no form uses is listed nowhere.
  for (const [directive, url, what] of formCspNeeds) {
    if (!allows(directive, url)) {
      const { origin } = new URL(url);
      errors.push(
        `config/securityHeaders.ts: ${cspHeaderName} ${directive} does not allow ${origin} (${what}): ` +
          `add "${origin}" to cspDirectives["${directive}"] and to the same directive in netlify.toml`,
      );
    }
  }
  for (const [provider, origin] of Object.entries(formProviders.formProviderOrigins)) {
    // A form names this provider, but its endpoint / ids failed rule 21: say nothing about its sources yet.
    if (formProvidersUnchecked.has(provider)) continue;
    for (const [directive, sources] of Object.entries(cspDirectives)) {
      const needed = formCspNeeds.some(([d, url]) => d === directive && new URL(url).origin === origin);
      const listed = sources.find((source) => sourceAllows(source, `${origin}/`));
      if (listed && !needed) {
        errors.push(
          `config/securityHeaders.ts: ${cspHeaderName} ${directive} lists ${listed} (${provider}), which no form needs there ` +
            `(config/site.ts → forms): remove it, also from netlify.toml`,
        );
      }
    }
  }
  // Formward's plain POST (no JavaScript) is a navigation to another origin. Under these two
  // policies the browser sends it with `Origin: null` (Fetch standard), which Formward's
  // exact-match allowed-origins list refuses and which leaves the relative `_redirect` without
  // an origin to resolve against (config/formProviders.ts → formward).
  // Formspree's "Restrict to Domain" compares the Referer header with the site's domain: under the
  // same two policies the browser sends none, and Formspree files every message as spam
  // (config/formProviders.ts → formspree).
  const referrerProviders = ["formward", "formspree"].filter((provider) =>
    Object.values(site.forms).some((backend) => backend?.provider === provider),
  );
  if (referrerProviders.length) {
    // A comma-separated value is a fallback list: the browser uses the last policy it knows.
    const known = [
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url",
    ];
    const policy = securityHeaders.find((h) => name(h.key) === "referrer-policy")?.value ?? "";
    const inUse = policy
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter((value) => known.includes(value))
      .at(-1);
    const breaking = inUse === "no-referrer" || inUse === "same-origin" ? inUse : null;
    if (breaking) {
      const why = {
        formward: "breaks the form at Formward without JavaScript (the browser then sends Origin: null with the plain POST)",
        formspree: `makes Formspree's "Restrict to Domain" file the form's messages as spam (the browser then sends no Referer)`,
      };
      for (const provider of referrerProviders) {
        errors.push(
          `config/securityHeaders.ts: Referrer-Policy "${breaking}" ${why[provider]}: keep "strict-origin-when-cross-origin", also in netlify.toml`,
        );
      }
    }
  }
}

// 16. The team: a member without a photo is a card only; a member with a profile page has a photo.
{
  const inPublic = (src) => {
    const file = join(root, "public", ...String(src).split("/").filter(Boolean));
    return existsSync(file) && statSync(file).isFile();
  };
  const seen = new Set();
  for (const member of teamRoster) {
    const where = `content/team.ts "${member.slug}"`;
    if (seen.has(member.slug)) errors.push(`${where}: the slug is used twice`);
    seen.add(member.slug);
    const { image, profile } = member;
    if (image && !inPublic(image.src)) errors.push(`${where}: image "${image.src}" is not a file in public/`);
    if (image?.share && !inPublic(image.share.src)) {
      errors.push(`${where}: share image "${image.share.src}" is not a file in public/`);
    }
    if (!image) {
      // No portrait: the grids draw the placeholder, and nothing else may show or link to the member.
      if (profile) errors.push(`${where}: has a profile page but no portrait (image); add the photo first`);
      if (profile?.offers?.items?.length) errors.push(`${where}: has offers but no portrait (image)`);
      if (member.crops) errors.push(`${where}: has crops but no portrait (image)`);
    }
    if (!profile) {
      // No profile page (/behandlere/<slug> is a 404): nothing may link to it or preselect the member.
      if (member.link) errors.push(`${where}: has a card link but no profile page (profile)`);
      if (member.bookingHref) errors.push(`${where}: has a booking link but no profile page (profile)`);
      if (member.authorBio) errors.push(`${where}: has an authorBio but no profile page (a blog author links to the profile)`);
      if (image?.share) errors.push(`${where}: has a share image but no profile page (og:image of the profile)`);
    } else if (image) {
      if (!image.width || !image.height) errors.push(`${where}: image needs its pixel width and height (the crops are computed from them)`);
      if (!image.share) errors.push(`${where}: a profile page needs image.share (og-<file>.jpg, the link-preview crop)`);
      if (!hasMeasuredFace(member.slug)) {
        errors.push(`${where}: a profile page needs a row in the face table (content/team.ts → faces), so the portrait is framed like the others`);
      }
    }
  }
  // `team` is exactly the members with a profile page (pages, sitemap, links are built from it).
  const withProfile = teamRoster.filter((member) => member.profile).map((member) => member.slug);
  if (withProfile.join() !== team.map((member) => member.slug).join()) {
    errors.push(`content/team.ts: \`team\` (${team.map((m) => m.slug).join(", ")}) is not the members with a profile (${withProfile.join(", ")})`);
  }
}

// 17. Where practitioners work: clinicSlugs are open clinics; everyone has one unless listed as unknown.
{
  const openSlugs = new Set(openClinics.map((clinic) => clinic.slug));
  const { clinics } = await importSite("content/clinics.ts");
  const allSlugs = new Set(clinics.map((clinic) => clinic.slug));
  const rosterSlugs = new Set(teamRoster.map((member) => member.slug));
  for (const slug of clinicsUnknown) {
    if (!rosterSlugs.has(slug)) errors.push(`content/team.ts clinicsUnknown: "${slug}" is not a team member`);
  }
  if (new Set(clinicsUnknown).size !== clinicsUnknown.length) errors.push(`content/team.ts clinicsUnknown: a member is listed twice`);
  for (const member of teamRoster) {
    const where = `content/team.ts "${member.slug}"`;
    const slugs = member.clinicSlugs ?? [];
    const unknown = clinicsUnknown.includes(member.slug);
    if (!Array.isArray(slugs)) {
      errors.push(`${where}: clinicSlugs must be a list of clinic slugs`);
      continue;
    }
    if (unknown && slugs.length) {
      errors.push(`${where}: has clinicSlugs and is listed in clinicsUnknown; remove it from that list`);
    } else if (!unknown && !slugs.length) {
      errors.push(`${where}: no clinicSlugs (where does the practitioner work?); add them, or list the member in clinicsUnknown with a TODO`);
    }
    if (new Set(slugs).size !== slugs.length) errors.push(`${where}: a clinic is listed twice in clinicSlugs`);
    for (const slug of slugs) {
      if (!allSlugs.has(slug)) errors.push(`${where}: clinicSlugs "${slug}" is not a clinic in content/clinics.ts`);
      else if (!openSlugs.has(slug)) errors.push(`${where}: clinicSlugs "${slug}" is not an open clinic (content/clinics.ts → status)`);
    }
  }

  // Every text about a practitioner agrees with `clinicSlugs`: a clinic it names (its short name,
  // the first word of a two-word one: "Amager", or an alias below) must be one of them, in any
  // case and with or without a space inside ("city 2", "AMAGER CENTRET", "Frb."). Texts are the
  // member's own (bio, quote, alt, profile: intro, facts, booking band …) and their "Din
  // behandler" block on treatment pages. Reviews are verbatim and not checked. A profile with
  // clinics also states them: one fact is clinicShortList(clinicSlugs) (the "Arbejder i" card).
  // Other names for a clinic (content/clinics.ts slugs): the owner writes "frb"; City2 is in
  // Taastrup. Another market's slugs differ: an alias for a slug that is not a clinic is a note.
  const CLINIC_ALIASES = { frederiksberg: ["Frb"], city2: ["Taastrup"] };
  for (const slug of Object.keys(CLINIC_ALIASES)) {
    if (!allSlugs.has(slug)) notes.push(`scripts/check-market.mjs CLINIC_ALIASES: "${slug}" is not a clinic in content/clinics.ts (update the aliases)`);
  }
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Any whitespace between words ("Amager Centret", also with a no-break space), an optional one
  // between letters and digits ("City2" / "City 2").
  const loose = (term) =>
    term.split(/\s+/).map((word) => escape(word).replace(/(\p{L})(\p{N})/gu, "$1\\s?$2")).join("\\s*");
  const clinicTerms = clinics.map((clinic) => {
    const words = clinic.name.split(/\s+/);
    const terms = [
      ...new Set([clinic.name, words.length > 1 ? words[0] : null, ...(CLINIC_ALIASES[clinic.slug] ?? [])].filter(Boolean)),
    ];
    return { clinic, pattern: new RegExp(`(?<![\\p{L}\\p{N}])(${terms.map(loose).join("|")})(?![\\p{L}\\p{N}])`, "iu") };
  });
  /** Every string in `value`, skipping links, paths and slugs (not prose). */
  const SKIP = new Set(["src", "href", "slug", "clinicSlugs", "treatmentSlug", "position"]);
  const strings = (value, key = "") => {
    if (SKIP.has(key)) return [];
    if (typeof value === "string") return [value];
    if (Array.isArray(value)) return value.flatMap((v) => strings(v));
    if (value && typeof value === "object") return Object.entries(value).flatMap(([k, v]) => strings(v, k));
    return [];
  };
  const checkMentions = (member, texts, where) => {
    const own = new Set(member.clinicSlugs ?? []);
    for (const text of texts) {
      for (const { clinic, pattern } of clinicTerms) {
        if (own.has(clinic.slug) || !pattern.test(text)) continue;
        errors.push(
          `${where}: names ${clinic.fullName} ("${text.slice(0, 60)}…"), which is not in "${member.slug}"'s clinicSlugs ` +
            `(${[...own].join(", ") || "none"}); build the text from clinicSlugs (content/team.ts → clinicNames / clinicShortList)`,
        );
      }
    }
  };
  const { clinicShortList } = await importSite("content/team.ts");
  for (const member of teamRoster) {
    const where = `content/team.ts "${member.slug}"`;
    checkMentions(member, strings(member), where);
    const slugs = member.clinicSlugs ?? [];
    if (member.profile && slugs.length && slugs.every((slug) => openSlugs.has(slug))) {
      const value = clinicShortList(slugs);
      if (!(member.profile.facts ?? []).some((fact) => fact.value === value)) {
        errors.push(
          `${where}: the profile's facts do not say where the practitioner works (a fact with the value "${value}", built with clinicShortList)`,
        );
      }
    }
  }
  const { buildTreatmentView } = await importSite("components/treatment/treatmentView.ts");
  const rosterBySlug = new Map(teamRoster.map((member) => [member.slug, member]));
  for (const treatment of treatments) {
    const block = buildTreatmentView(treatment).practitioner;
    if (!block) continue;
    const { heading, mobileTitle, text, mobileText, quote } = block;
    const member = rosterBySlug.get(block.member.slug) ?? block.member;
    checkMentions(member, [heading, mobileTitle, text, mobileText, quote].filter(Boolean), `/behandlinger/${treatment.slug} "Din behandler"`);
  }
}

// 18. Hyaluronidase and lidocaine are named nowhere a visitor reads: price list, treatment pages, posts,
//     the team's cards and profiles, and every page's copy (content/pages/*.ts).
{
  const { priceCards } = await importSite("content/prices.ts");
  const pageDir = join(root, "content", "pages");
  const pageModules = await Promise.all(
    readdirSync(pageDir)
      .filter((file) => file.endsWith(".ts"))
      .sort()
      .map(async (file) => [`content/pages/${file}`, await importSite(`content/pages/${file}`)]),
  );
  /**
   * Every string in `value`, with the path to it ("detail.faq.4.answer"); functions are skipped, and
   * so is a treatment below the top (the fillers page's cards, the `treatments` array): rules 18–20
   * check each treatment as a source of its own, once, under its slug.
   */
  const treatmentObjects = new Set(treatments);
  const textsOf = (value, path = "") => {
    if (path && treatmentObjects.has(value)) return [];
    if (typeof value === "string") return [[path, value]];
    if (Array.isArray(value)) return value.flatMap((v, i) => textsOf(v, path ? `${path}.${i}` : String(i)));
    if (value && typeof value === "object") {
      return Object.entries(value).flatMap(([k, v]) => textsOf(v, path ? `${path}.${k}` : k));
    }
    return [];
  };
  const sources = [
    ...priceCards.map((card) => [`content/prices.ts "${card.id}"`, card.rows]),
    ...treatments.map((treatment) => [`content/treatments.ts "${treatment.slug}"`, treatment]),
    ...blog.posts.map((post) => [`content/blog.ts "${post.slug}"`, post]),
    ...teamRoster.map((member) => [`content/team.ts "${member.slug}"`, member]),
    ...pageModules.flatMap(([file, mod]) => Object.entries(mod).map(([name, value]) => [`${file} ${name}`, value])),
  ];
  // The one place that names hyaluronidase: Alberte's sentence (2026-11-26, forwarded by the owner)
  // at the end of lip filler's FAQ answer "Hvorfor vælger nogle at få opløst læbefiller?". The owner,
  // told first that lægemiddelloven § 66 forbids advertising a prescription medicine to the public:
  // "gør hvad hun skriver og det samme gælder botox" (README "Før lancering", an accepted risk). Only
  // that answer of the lip filler treatment (where another module embeds the treatment, textsOf
  // skips it), only with her sentence verbatim at its end, and no other name of the rule before it.
  const HYALURONIDASE_SENTENCE =
    "Efter en faglig vurdering kan hyaluronidase bruges til at nedbryde filleren hurtigere ved ønske om opløsning.";
  const lipFaq = treatments.find((t) => t.slug === "lip-filler")?.detail?.faq ?? [];
  const dissolveAnswer = lipFaq.find((item) => item.question === "Hvorfor vælger nogle at få opløst læbefiller?")?.answer;
  const LIP_FILLER_SOURCE = 'content/treatments.ts "lip-filler"';
  const allowedPrescriptionText = (where, path, text) =>
    where === LIP_FILLER_SOURCE &&
    text === dissolveAnswer &&
    /^detail\.faq\.\d+\.answer$/.test(path) &&
    text.endsWith(HYALURONIDASE_SENTENCE) &&
    !OTHER_PRESCRIPTION_NAME.test(text.slice(0, -HYALURONIDASE_SENTENCE.length));
  for (const [where, value] of sources) {
    for (const [path, text] of textsOf(value)) {
      const name = OTHER_PRESCRIPTION_NAME.exec(text)?.[0];
      if (name && !allowedPrescriptionText(where, path, text)) {
        errors.push(
          `${where} ${path}: names a prescription medicine ("${name}"); describe it without the name ` +
            `(e.g. "Opløsning af filler", "et lokalbedøvende middel")`,
        );
      }
    }
  }

  // 19. Botox (or another botulinum toxin) is named in no menu, category or price card, in no
  //     treatment's slug, name, title, heading, lead, one-liner, meta text or photo alt text, and
  //     nowhere on the fillers page (owner 2026-11-25: "Rynkebehandling", never the product, in
  //     titles, headings, menus, slugs, cards, meta and alt texts). The hub's body (the agency's FAQ
  //     and consultation paragraph, Alberte's "Hvad er Botox?") is not checked here.
  //     Exception, exactly these menu labels (`BOTOX_MENU_LABELS`): Alberte 2026-11-26 (forwarded by
  //     the owner), "Brug botox som menupunkt i stedet for Rynker"; the owner, told first that
  //     lægemiddelloven § 66 forbids advertising a prescription medicine to the public, also on the
  //     clinic's own site: "gør hvad hun skriver og det samme gælder botox" (README "Før lancering",
  //     an accepted risk). Located by the category slug, not by position, and nothing else in those
  //     objects is exempt (the column's treatment names, the category's name and slug stay checked).
  const navigation = await importSite("content/navigation.ts");
  const { layoutCopy } = await importSite("content/layout.ts");
  const { fillersPage } = await importSite("content/pages/fillers.ts");
  const WRINKLE_CATEGORY = "rynkebehandling";
  const botoxColumn = navigation.megaMenu.columns.findIndex((column) => column.treatmentSlugs.includes(WRINKLE_CATEGORY));
  const botoxCategory = navigation.treatmentCategories.findIndex((category) => category.slug === WRINKLE_CATEGORY);
  const BOTOX_MENU_LABELS = new Set([
    `content/navigation.ts megaMenu columns.${botoxColumn}.eyebrow`,
    `content/navigation.ts megaMenu columns.${botoxColumn}.allLink.label`,
    `content/navigation.ts treatmentCategories ${botoxCategory}.mobileName`,
    `content/layout.ts layoutCopy.mobileMenu categoryAllLabels.${WRINKLE_CATEGORY}`,
  ]);
  const titleTexts = (treatment) => {
    const d = treatment.detail ?? {};
    return {
      slug: treatment.slug,
      name: treatment.name,
      mobileMenuName: treatment.mobileMenuName,
      metaTitle: treatment.metaTitle,
      short: treatment.short,
      detail: {
        title: d.title,
        heading: d.heading,
        headingAccent: d.headingAccent,
        lead: d.lead,
        metaDescription: d.metaDescription,
        heroImage: d.heroImage?.alt,
        results: (d.results ?? []).map((pair) => [pair.before.alt, pair.after.alt, pair.caption]),
      },
    };
  };
  const titleSources = [
    ...Object.entries(navigation).map(([name, value]) => [`content/navigation.ts ${name}`, value]),
    ["content/layout.ts layoutCopy.mobileMenu", layoutCopy.mobileMenu],
    ...priceCards.map((card) => [`content/prices.ts "${card.id}"`, card]),
    ...treatments.map((treatment) => [`content/treatments.ts "${treatment.slug}"`, titleTexts(treatment)]),
    ["content/pages/fillers.ts fillersPage", fillersPage],
  ];
  for (const [where, value] of titleSources) {
    for (const [path, text] of textsOf(value)) {
      const name = BOTULINUM_NAME.exec(text)?.[0];
      if (name && !BOTOX_MENU_LABELS.has(`${where} ${path}`)) {
        errors.push(`${where} ${path}: names a prescription medicine ("${name}"); say "rynkebehandling"`);
      }
    }
  }

  // 20. No FDA (the owner 2026-11-27: "ja ikke fda godkendt det dropper vi.. skal du ikke skrive. det
  //     noget usa noget") and no filler brand but Revanesse® (Alberte 2026-11-26, forwarded by the
  //     owner: "Fjern henvisninger til Infini, Juvéderm og Belotero … Brug Revanesse® som det eneste
  //     fillermærke"; Infini is still on the microneedling page, an open question, README). Every
  //     export of every content/ module (content/redirects.ts aside: legacy addresses such as
  //     /hudforbedring/belotero-revive and their notes, never shown) and config/site.ts. Values, not
  //     source text: comments may quote the decisions. Each treatment is checked once, by its slug
  //     (textsOf skips it where it is embedded, the `treatments` array included).
  const FORBIDDEN_NAME = /\bFDA\b|juv[eé]derm|belotero/i;
  const contentModules = readdirSync(join(root, "content"), { recursive: true })
    .map((file) => String(file).split(sep).join("/"))
    .filter((file) => file.endsWith(".ts") && file !== "redirects.ts")
    .sort()
    .map((file) => `content/${file}`);
  const allTexts = treatments.map((treatment) => [`content/treatments.ts "${treatment.slug}"`, treatment]);
  for (const file of [...contentModules, "config/site.ts"]) {
    const mod = await importSite(file);
    allTexts.push(...Object.entries(mod).map(([name, value]) => [`${file} ${name}`, value]));
  }
  for (const [where, value] of allTexts) {
    for (const [path, text] of textsOf(value)) {
      const found = FORBIDDEN_NAME.exec(text)?.[0];
      if (found) {
        errors.push(
          `${where}${path ? ` ${path}` : ""}: names "${found}"; Fillox names no FDA approval and no filler ` +
            `brand but Revanesse® (owner 2026-11-27, Alberte 2026-11-26)`,
        );
      }
    }
  }
}

for (const note of notes) console.log(`check:market note: ${note}`);

if (errors.length) {
  console.error(`check:market failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `check:market ok: ${routePaths.size} routes, ${collections.length} collections, ${legacyRedirects.length} redirects, ` +
    `${Object.keys(forms).length} forms (${Object.keys(forms).map((kind) => `${kind}: ${site.forms[kind].provider}`).join(", ")}), ` +
    `${openClinics.length} open clinics (booking: ${site.booking.provider}), ` +
    `${reviews.length} reviews, ${blog.posts.length} published posts (${blog.allPosts.length - blog.posts.length} on hold)`,
);

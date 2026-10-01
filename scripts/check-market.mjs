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
 * 4. every redirect in content/redirects.ts lands on a route (or on a page of a collection);
 * 5. the no-JavaScript contact form target (public/__kontakt-sendt.html) forwards to
 *    routes.contactThanks.
 *
 * And the other market data that lives outside content/ or is only checked at runtime:
 *
 * 6. every Netlify form in content/forms.ts is declared in public/__forms.html (and back);
 * 7. the booking provider has what it needs: with "timma" every open clinic has
 *    booking.timmaId (content/clinics.ts); with "gecko" clinics without a calendar id are listed;
 * 8. every open clinic's address and opening hours parse into the structured data
 *    (components/seo/OrganizationJsonLd.tsx), which otherwise silently drops them;
 * 9. no string in app/, components/ or lib/ contains æ, ø or å (copy belongs in content/);
 * 10. customer reviews (content/reviews.ts) are quoted verbatim: every excerpt (`short`) is whole
 *     sentences of its review's text, in order, with "…" wherever text is left out; every set
 *     lists existing reviews, and a practitioner / treatment set only reviews that name it;
 *     treatmentsWithoutReviews lists existing treatments that have no review set.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
  // Non-page targets served by the app itself (the generated sitemap).
  const isFile = path === "/sitemap.xml";
  if (!onRoute && !onCollection && !isFile) {
    errors.push(`redirect ${source} → ${destination}: "${path}" is not a route in content/routes.ts`);
  }
}

// 5. The no-JS contact form target forwards to the thank-you route.
const noJs = join(root, "public", "__kontakt-sendt.html");
if (existsSync(noJs)) {
  const html = readFileSync(noJs, "utf8");
  if (!html.includes(`url=${routes.contactThanks}"`)) {
    errors.push(`public/__kontakt-sendt.html does not forward to routes.contactThanks ("${routes.contactThanks}")`);
  }
}

/* ------------------------------------------------------------------------------------------
 * 6–8 import the site's modules with their imports (config/site.ts, content/clinics.ts …)
 * through scripts/ts-hooks.mjs.
 */
if (typeof nodeModule.registerHooks === "function") {
  nodeModule.registerHooks({ resolve: tsHooks.resolve, load: tsHooks.load });
} else {
  nodeModule.register("./ts-hooks.mjs", import.meta.url);
}
const importSite = (file) => import(pathToFileURL(join(root, file)).href);
const notes = [];

// 6. Netlify forms: content/forms.ts ↔ public/__forms.html.
const { forms } = await importSite("content/forms.ts");
const formsHtml = readFileSync(join(root, "public", "__forms.html"), "utf8");
const declaredForms = [...formsHtml.matchAll(/<form\b[^>]*\bname="([^"]+)"/g)].map((m) => m[1]);
for (const [key, name] of Object.entries(forms)) {
  if (!declaredForms.includes(name)) {
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
const { site } = await importSite("config/site.ts");
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
  if (node.openingHoursSpecification.length !== clinic.hours.length) {
    errors.push(
      `content/clinics.ts "${clinic.slug}": opening hours ${JSON.stringify(clinic.hours)} do not all parse ` +
        `(hours as "10–20" / "9.30–18", day labels listed in content/seo.ts openingDays)`,
    );
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
for (const file of ["app", "components", "lib"].flatMap((dir) => sourceFiles(join(root, dir)))) {
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
const { team } = await importSite("content/team.ts");
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
  if (!teamSlugs.has(slug)) errors.push(`content/reviews.ts reviewSets.practitioners: "${slug}" is not in content/team.ts`);
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

for (const note of notes) console.log(`check:market note: ${note}`);

if (errors.length) {
  console.error(`check:market failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `check:market ok: ${routePaths.size} routes, ${collections.length} collections, ${legacyRedirects.length} redirects, ` +
    `${declaredForms.length} forms, ${openClinics.length} open clinics (booking: ${site.booking.provider}), ` +
    `${reviews.length} reviews`,
);

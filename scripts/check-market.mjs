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
 * 9. no string in app/, components/ or lib/ contains æ, ø or å (copy belongs in content/).
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

for (const note of notes) console.log(`check:market note: ${note}`);

if (errors.length) {
  console.error(`check:market failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `check:market ok: ${routePaths.size} routes, ${collections.length} collections, ${legacyRedirects.length} redirects, ` +
    `${declaredForms.length} forms, ${openClinics.length} open clinics (booking: ${site.booking.provider})`,
);

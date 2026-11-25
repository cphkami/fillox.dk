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
 *    to a treatment page names an existing treatment, and its #anchor (if any) is a section or
 *    item id of that page's long-form content (content/types.ts → TreatmentSection); the same for
 *    the price list's links (content/prices.ts → treatmentSlug / treatmentAnchor);
 * 5. the no-JavaScript form targets forward to their thank-you routes:
 *    public/__kontakt-sendt.html → routes.contactThanks, and the newsletter's
 *    (content/forms.ts → newsletterNoJsAction, public/__nyhedsbrev-tilmeldt.html) →
 *    routes.newsletterThanks; the copy lives on those routes, never in public/.
 *
 * And the other market data that lives outside content/ or is only checked at runtime:
 *
 * 6. every Netlify form in content/forms.ts is declared in public/__forms.html (and back);
 * 7. the booking provider has what it needs: with "timma" every open clinic has
 *    booking.timmaId (content/clinics.ts); with "gecko" clinics without a calendar id are listed;
 * 8. every open clinic's address and opening hours parse into the structured data
 *    (components/seo/OrganizationJsonLd.tsx), which otherwise silently drops them;
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
 *     heading ids, links that land on pages, and a reading time that matches its text (≈ 200
 *     words a minute); "Alle artikler om …" links on treatment pages open a chip that /blog shows.
 *
 * Notes (never fail the build): clinics without a Gecko calendar id (7), and Trustpilot numbers
 * in config/site.ts last checked more than 60 days ago (11).
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

// 5. The no-JS form targets forward to their thank-you routes (static files in public/ hold no copy).
const { newsletterNoJsAction } = await importTs("content/forms.ts");
const noJsTargets = [
  ["__kontakt-sendt.html", "contactThanks"],
  [newsletterNoJsAction.replace(/^\//, ""), "newsletterThanks"],
];
for (const [file, key] of noJsTargets) {
  const noJs = join(root, "public", file);
  if (!routes[key]) {
    errors.push(`routes.${key} is missing (thank-you route of public/${file})`);
  } else if (!existsSync(noJs)) {
    errors.push(`public/${file} is missing (no-JavaScript form target)`);
  } else if (!readFileSync(noJs, "utf8").includes(`url=${routes[key]}"`)) {
    errors.push(`public/${file} does not forward to routes.${key} ("${routes[key]}")`);
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
    practitioners: teamSlugs,
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

// 14. Blog: posts on hold are linked from nowhere; published posts are signed by the team and consistent.
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
  const words = (text = "") => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  /** A site href lands on a page: a route, a treatment or practitioner page, or a published post. */
  const pagesOf = { treatments: treatmentSlugs, practitioners: teamSlugs, blog: published };
  const landsOnPage = (href) => {
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
      if (block.type === "links") {
        for (const link of block.items) {
          if (!landsOnPage(link.href)) errors.push(`${where(post)}: link "${link.label}" → ${link.href} lands on no page (or on a post on hold)`);
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

for (const note of notes) console.log(`check:market note: ${note}`);

if (errors.length) {
  console.error(`check:market failed (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `check:market ok: ${routePaths.size} routes, ${collections.length} collections, ${legacyRedirects.length} redirects, ` +
    `${declaredForms.length} forms, ${openClinics.length} open clinics (booking: ${site.booking.provider}), ` +
    `${reviews.length} reviews, ${blog.posts.length} published posts (${blog.allPosts.length - blog.posts.length} on hold)`,
);

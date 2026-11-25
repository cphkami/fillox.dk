# Fillox.dk — architecture

Marketing site for Fillox Denmark, built from the Claude Design file
**"Fillox Signature v2" (Bold & Bordeaux, designmanual 2026)**. A sister repo,
`fillox-no`, is created from this one for fillox.no. So everything market-specific
lives in two places:

| What | Where |
|---|---|
| Domain, locale, currency, phone, email, CVR, booking provider, GTM container + consent settings (`analytics`), logos | `config/site.ts` |
| All visible copy and data (nav, clinics, treatments, prices, team, blog, page copy, UI strings) | `content/**` |

**Rule: components and pages never contain market copy.** No Danish strings, prices,
phone numbers or addresses in `components/` or `app/`. They import from `content/`
and `config/`. Rebranding to NO = swap `config/site.ts` + `content/**` (+ images); the
step-by-step list (route folders, `public/` form files, TIMMA ids, what to watch out for) is
in `README.md` → "Rebranding til fillox.no".

## Stack

- Next.js 16 (App Router, TypeScript, React 19). Read `node_modules/next/dist/docs/`
  before using an API you're unsure of: this version has breaking changes
  (for example, `params` is a Promise in pages and `generateMetadata`).
- Tailwind CSS v4 (`@theme` tokens in `app/globals.css`).
- Fonts via `next/font/google` (`app/layout.tsx`): Figtree (variable) for running text and UI,
  Poppins 500 for headings only (see "Design tokens" → "Typography").
- `next/image` for all photos; `next.config.ts` asks for AVIF, then WebP (`images.formats`; on
  Netlify the Image CDN negotiates the format itself). No `X-Powered-By` header.
- Static generation for every route (`generateStaticParams` for dynamic routes).
- Metadata: `lib/metadata.ts` → `pageMetadata` (title through the root template "… · Fillox",
  unless the copy sets `absoluteTitle` because the title already names the brand, as
  `/ny-hos-fillox`). The root layout sends `robots: max-image-preview:large` (a route's own
  `robots`, e.g. noindex, replaces it). Icons: `app/favicon.ico`, `app/icon.png`,
  `app/apple-icon.png`; `app/manifest.ts` serves `/manifest.webmanifest` (name from
  `config/site.ts`, colours = `pageColor` in `lib/metadata.ts`).
- Deploy target: Netlify (`netlify.toml`: Node 22; README → "Deploy til Netlify").
- Security headers (HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy and a
  report-only CSP that allows only Gecko's hosts and the hosts of the GTM container's tags, which
  load only after consent) live in ONE module, `config/securityHeaders.ts` (no imports;
  `cspDirectives` holds one source list per directive, `cspHeaderName` is
  `Content-Security-Policy-Report-Only` until the launch-week test booking is clean).
  `next.config.ts` → `headers()` sends them on `/:path*`, which covers every response of the
  Next.js server (pages, robots.txt, sitemap.xml, manifest, 404s); on Netlify that is the server
  handler, which netlify.toml `[[headers]]` do not reach. `netlify.toml` keeps a copy for the files
  the CDN serves itself (public/, /_next/static, /_next/image); check:market rule 15 fails when
  the copy differs in any name or value, when another `[[headers]]` block sets one of them, when
  `next.config.ts` → `headers()` (evaluated through scripts/ts-hooks.mjs) does not return exactly
  one `/:path*` rule with exactly that list (or sets one of them on another path), or when the CSP
  does not allow the booking provider (and www.googletagmanager.com with a GTM container). The
  CSP's Google hosts include ad.doubleclick.net and www.googleadservices.com, which the GA4 tag's
  Ads link calls. Next.js drops config headers on its own config
  redirects (resolve-routes returns `resHeaders: null`), so the legacy 308s carry none; Netlify
  adds HSTS and nosniff there.

## Directory layout

```
config/site.ts                 market config (see above)
config/securityHeaders.ts      security headers + CSP directives (one source; next.config.ts sends
                               them, netlify.toml copies them; see "Stack")
content/
  types.ts                     shared content types
  navigation.ts                main nav, mega menu, footer + legal links
  clinics.ts                   clinics
  treatments.ts                every treatment (slug, name, category, priceFrom, short, detail?)
  team.ts                      practitioners
  reviews.ts                   verified Trustpilot reviews (verbatim) + where each is shown (see "Reviews")
  photos.ts                    the clinic's own mood photos: file, size, alt, default crop (see "Photos")
  blog.ts                      blog posts (`published: false` = on hold; see "Blog")
  consent.ts                   cookie banner copy + the privacy policy's cookie section (see "Cookie consent")
  prices.ts                    price list (Priser page)
  ui.ts                        shared UI strings ("Book tid", "Se priser", "Læs mere" …)
  pages/<page>.ts              page-specific copy (home, about, prices, clinics, contact, blog, men,
                               new-here …)
  redirects.ts                 legacy fillox.dk URLs → new routes
  routes.ts                    every route path; code, canonicals and the sitemap link through it
lib/                           helpers (formatPrice, cn, …); metadata.ts builds every route's
                               metadata + Open Graph (pageMetadata), forms.ts posts to Netlify Forms,
                               analytics.ts: Consent Mode, stored choice, GTM loader, cookie deletion
scripts/check-market.mjs       `npm run check:market` (runs as prebuild): routes.ts ↔ app/ folders,
                               redirect targets (and the price list's treatment links: the treatment
                               exists, an #anchor is a section / item id of its long-form page),
                               no-JS form targets (contact, newsletter), Netlify form names,
                               booking provider ids, clinic address/hours parse for JSON-LD,
                               no æ/ø/å strings in app/, components/ (except components/dev/), lib/, review excerpts
                               verbatim + review sets consistent (content/reviews.ts), components/dev/
                               imported only by app/layout.tsx behind the NODE_ENV guard; note when
                               the Trustpilot numbers (config/site.ts) are > 60 days old; the blog
                               (posts on hold linked from nowhere, published posts signed by the team,
                               their links, filters, related posts and reading times, no
                               prescription-medicine name, no price card on wrinkle posts); security
                               headers (netlify.toml = config/securityHeaders.ts, the CSP allows the
                               booking provider + GTM)
scripts/ts-hooks.mjs           lets check-market import the site's .ts modules (no build step)
components/
  layout/                      Header (DesktopNav, MegaMenu, DropdownMenu, MobileMenu), Footer
  booking/                     BookingEmbed (switches on the booking provider), GeckoEmbed, TimmaEmbed
  consent/                     ConsentManager (the cookie banner, client), ConsentSettingsButton (footer),
                               consentStore
  ui/                          primitives: Button, Eyebrow, SectionHeading, Photo, ScrollRow,
                               ResponsiveText (mobile/desktop copy), JoinedLines, HoneypotField,
                               ReviewRotator (client), AllReviewsLink, TrustpilotRating, …
  seo/                         OrganizationJsonLd (root layout); JsonLd, absoluteUrl, breadcrumbList
  dev/                         dev-only tools, never in a production build: ColorTuner ("Farver",
                               see "Design tokens" → "Colour tuner")
  practitioner/teamGrid.ts     centres a team grid's short last row (home, /om-os, /behandlere;
                               see "Team" → "Grids")
  <page>/                      page-local components (owned by that page)
app/                           routes (see below)
design-reference/              the source design: screens/*.png, sections/*.html, uploads/
public/images/                 fillox/ (the clinic's mood photos), resultater/ (before/after halves),
                               team/ (portraits), clinics/kort.svg (the mobile clinic map)
```

## Routes

| Route | Design section (desktop / mobile) |
|---|---|
| `/` | `6a` / `mf` |
| (header mega menu, mobile menu) | `mega-menu-v2.webp` (replaces `6menu`) / `mm1`, `mm2`, `mm3` |
| (header "Priser" dropdown) | no design: dropdown like "Find klinik", built from `content/prices.ts` (nav item kind `"prices"`); a plain link in the mobile menu |
| `/om-os` | `6om` / `mo` for the hero and the team grid; the rest follows the owner's new "Om Fillox" text (agency, 2026-10, verbatim in `content/pages/about.ts`): hero (sand panel; "Mød vores team" jumps to `#behandlere`) · Fillox Academy (`SplitSection`) · the doctor (`DoctorSection`, sand panel with his portrait) · "Samme kompetence" (`CenteredSection`) · "mere end ét værktøj" (`MethodsBand`, rose band) · quality and price (`SplitSection`) · the team (`TeamSection`, anchor `behandlere`) · "Velkommen til Fillox" (`WelcomeBand`, rose band with "Find din klinik" + "Book en konsultation"). The hero photo is the clinic's group photo (four practitioners, unnamed), with a desktop crop in content (`hero.imagePositionDesktop`, 50% 30% from 1024px); the doctor section shows `doctor.image` (`DoctorSection` → `OwnPhoto`): Dr. Tom's team photo uncropped at full height (head to hands, the plant, the panelled wall), where his team card further down is a head-and-shoulders close-up (it is the only photo of him, 2026-11-25). The sand "Fagligt ansvarlig" band (`ResponsibleBand`) now closes `/behandlere` only |
| `/behandlere/[slug]` | `6alb` / `ma` (Alberte is the example). Anette's palette: the name (H1) takes `text-emphasis` (plum); the closing "Book tid hos …" band (the design's powder) is the Lys Rosa `band`, because a beige panel reads as one block with the Sandbeige footer right under it |
| `/priser` | `6b` / `mp` (mobile unfolded at the owner's request: open cards with the label under the title, no chip current at rest; the mobile menu is unchanged) |
| `/behandlinger` | overview built from existing components (no dedicated design) |
| `/behandlinger/[slug]` | template `6c` / Lip filler `mb`. The Botox design (`6bx`) is retired: that page became the rynkebehandling hub (next row). The design's before/after section (`ResultsSection`, "Før og efter") shows the clinic's own pairs on Kæbelinje only (see "Photos" → "Before/after"); the design's lip filler pairs were one stock photo with invented captions and are gone |
| `/behandlinger/rynkebehandling` | no design: a long-form page (`detail.sections`, see "Long-form treatment pages") with the owner's agency text, verbatim. Replaces the Botox page: `/behandlinger/botox`, `/behandlinger/botox-for-maend` and the live `/rynkebehandling` redirect here |
| `/behandlinger/andre-behandlingsmuligheder` | no design: long-form page under the hub (breadcrumb via `detail.parentSlug`, compact H1). Replaces the live `/ovrige-botox-behandlinger` and the lip flip, gummy smile, hyperhidrose and Traptox pages, which redirect here (the first three to their sections `#lip-flip`, `#gummy-smile`, `#svedtendens`; Traptox has no section) |
| `/behandlinger/for-maend` | no design (owner, round 3: fewer treatments, cleaner, more masculine). Static route (`routes.men`, wins over `[slug]`); copy `content/pages/men.ts`, components `components/men/`. Darker neutrals only: espresso (`bg-heading`) hero + closing band with offwhite text, Sandbeige accents, offwhite pills (sand on hover) and an offwhite focus ring (`components/men/surface.ts`); cream sections on straight hairlines; one sand panel; no rose bands, no reviews (its wrinkle row is "Rynkebehandling", linking to the hub). Every "For mænd" link goes here (`content/navigation.ts` → `categoryPages` / `treatmentCategoryHref`); /behandlinger shows a teaser with `id="for-maend"` instead of the category section |
| `/ny-hos-fillox` | no design: "Ny hos Fillox?", the guide for first-time visitors (`routes.newHere`; see "Ny hos Fillox?") |
| `/klinikker` | `6kl` / `mk` |
| `/kontakt` | `6ko` / `mc` |
| `/blog`, `/blog/[slug]` | `6blog`, `6art` / `mbl`, `mar` (see "Blog"). A post without its written article (`content/blog.ts` → `hasArticleBody`) gets an excerpt page (noindex, not in the sitemap) and shows no reading time anywhere: article header, blog cards, "Læs også" and the treatment pages' article cards (`components/blog/postView.ts` → `readingTime`, `shortReadingTime`) |
| `/booking` | no design: intro band + the booking provider's embed (`components/booking/BookingEmbed.tsx`, see "Booking providers") |
| `/handelsbetingelser`, `/privatlivspolitik`, `/ledige-stillinger`, `/content-creator` | simple text pages in the same style |

## The owner's agency texts (2026-10)

The owner's content agency writes new page texts in Google Drive (Fillox › Fillox.dk). Finished
texts are used **verbatim** (Danish); the only edits are splitting them into the site's fields,
turning the author's `[button placeholders]` into links / buttons, and typography (quotes, dashes,
a no-break space before " – ", an invisible soft hyphen). Copy the site had to add (meta
descriptions, accessible names, alt texts, link labels) is marked `// TODO: copy review`. Each
content file's header names its source document and lists every deviation.

| Page | Source | Content |
|---|---|---|
| `/behandlinger/rynkebehandling` | "Botox og rynkebehandling", tab 1 | `content/treatments.ts` (slug `rynkebehandling`) |
| `/behandlinger/andre-behandlingsmuligheder` | "Botox og rynkebehandling", tab 2 | `content/treatments.ts` (slug `andre-behandlingsmuligheder`) |
| `/om-os` | "Om Fillox" | `content/pages/about.ts` |
| `/ny-hos-fillox` | "Om Fillox og klinikker", tab "Ny hos Fillox" (**Norwegian**) | `content/pages/new-here.ts`: a faithful Danish translation, pending the agency's review |

Not published yet (not ready in the Drive): polynukleotider (the author asks for the product
documentation to be checked first), the four clinic pages, hårtab & hårvækst, and the headings-only
skinbooster / microneedling / laser sub-pages.

### Prescription medicine (Botox)

Botox (botulinumtoksin) is a prescription medicine and must not be advertised to the public
(lægemiddellovens § 66). The site follows the agency's approach:

- **The treatment, not the product.** Titles, menus, cards, CTAs, meta descriptions, alt texts and
  structured data say "Rynkebehandling" / "rynkebehandling" (the hub's name), never "Botox". The
  product or its active substance is named only where an agency text names it: four places on the
  hub — the FAQ question "Hvad er forskellen på Botox og filler?" (a visible h3 and the FAQPage
  JSON-LD question name) and its answer, the FAQ answer "Ved kosmetisk behandling med
  botulinumtoksin …" and the "konsultation" section's paragraph "Hvis der er tale om en
  behandling med botulinumtoksin …" — and one sentence in the Om os Academy paragraph. The FAQ
  heading and its JSON-LD are an open owner / legal question (README → "Juridisk gennemlæsning").
- **Changed for this (2026-10, each `// TODO: copy review`)**: the price card's eyebrow ("MIMISKE
  RYNKER M.M.", the hub's term; "RYNKEBEHANDLING" would repeat the card title next to it) and
  /priser's mobile chip ("Rynkebehandling") in `content/prices.ts` (the header "Priser" dropdown shows
  the eyebrow on every page); the /priser meta description; `content/layout.ts` → `meta.description` (the
  default description and the Organization JSON-LD); the mega menu's "For mænd" note; the
  men's page; the home page's results caption (the bestseller #01 already said "Rynkebehandling").
- **Unchanged on purpose**: every price-list row label and amount (the area rows, the area
  packages, "Lægekonsultation før første botox" in the consultation card), the verbatim agency
  sentences above.
- **Rynkebehandling blog posts** (owner, 2026-11-25): the three former Botox posts were rewritten
  about the treatment and published (`rynkebehandling-for-foerste-gang`,
  `hvornaar-giver-rynkebehandling-mening`, `de-foerste-24-timer-efter-rynkebehandling`; category
  and /blog chip `rynkebehandling`). No product or active-substance name anywhere (the body uses
  the hub's own words, "muskelafslappende injektionsbehandling"), no price or booking card, no
  results, signed by the team. check:market rule 14 rejects a published post or filter chip that
  names Botox or another botulinum toxin brand in anything it shows (slug, title, excerpts,
  category, kind, tags, image, headings, booking text, links). It also rejects a booking card, or
  an excerpt-only post, for a `treatmentsWithoutReviews` page. The old `/blog/botox-…` preview URLs
  404 on purpose (no redirect keeps the product name alive in a URL).
- **Photos without product or syringe, and no before/after** on the two wrinkle pages and the
  rynkebehandling blog posts (see "Photos"): a before/after of a Botox result would advertise the
  medicine. Their "Læs også" cards show each post's photo, so they list only posts whose photo
  is product-free too: the other rynkebehandling posts and "lip-filler-for-foerste-gang" (the
  leaflet photo). "De første 24 timer" links the filler aftercare article ("Hævelse og blå
  mærker", a treatment photo) as a closing text link instead.
- **No reviews, results or "fra" price** on the two wrinkle pages (long-form pages show only
  what their content gives; `treatmentsWithoutReviews` is a second guard). The hub lists the three
  rynkebehandling posts through `detail.relatedPostSlugs` (a long-form page shows only the posts
  its content names); "andre behandlingsmuligheder" names none. Menus, cards and the home page
  still show the hub's `priceFrom` (lowest row on the price card).

### Long-form treatment pages

A treatment whose `detail` has `sections` (`content/types.ts` → `TreatmentSection`) is a long-form
page: `app/behandlinger/[slug]/page.tsx` renders the hero, `components/treatment/LongformSections`,
the FAQ, the blog posts its `detail.relatedPostSlugs` names (none without it) and a closing band,
and **nothing else** — no fallback facts, "Om behandlingen" band, practitioner, results, price
list or reviews (`components/treatment/treatmentView.ts` → `longform`). Today: `rynkebehandling`
(with the three rynkebehandling posts) and `andre-behandlingsmuligheder`.

- **Hero** (`TreatmentHero`): `detail.heading` (the H1 when it says more than `title`),
  `headingAccent` (a second line, smaller, accent colour; the H1 reads "<heading> – <accent>"),
  `headingSize: "compact"` (the article H1 size `text-h1-xs` from 768px, for a long H1 that would
  otherwise be no larger than the H2s), `intro` (paragraphs after the lead), `primaryCta` /
  `secondaryCta` only when set, and jump links (`jumpLabel`) to every section item with an `id`.
  A very long word in the H1 may carry a soft hyphen: the hero sizes the H1 to the word's longest
  part.
- **Sections**: an H2 with `paragraphs`, optional `items` (H3 cards; an `id` makes one linkable and
  outlined while it is the URL's `:target`), `closing` paragraphs and a `cta` (`style: "button"` =
  a primary pill, the author's bold placeholders; default an arrow link). `surface`: `plain`
  (heading left, text right from 1024px; consecutive plain sections divided by a hairline), `band`
  (rose band, as "Om behandlingen"), `card` (sand card; consecutive cards side by side from 1024px).
  Rich text runs (`RichText`) carry bold and links.
- **Closing**: `detail.closing` replaces "Klar til at booke?"; its CTA is also the mobile book
  bar's button. `parentSlug` puts the parent treatment in the breadcrumb instead of the category;
  `metaDescription` when the lead is not a good description.
- **Links into a page**: section and item ids are stable anchors. `content/redirects.ts` and the
  price list (`content/prices.ts` → `treatmentSlug` + `treatmentAnchor`, e.g. "Lip flip" →
  `/behandlinger/andre-behandlingsmuligheder#lip-flip` on /priser) point to them, and
  `npm run check:market` fails when an anchor is not a section or item id of that page.
- **Menus and cards**: the "Rynkebehandling" category (`content/navigation.ts`) lists the two pages;
  the mega menu's "Rynker" column shows two links. The second page's `name` is "Andre
  behandlinger" (the mega menu: its columns are ≈ 132px wide at 1024px and set on one line); the
  mobile menu (`mobileMenuName`), cards, breadcrumb and book bar say "Andre behandlingsmuligheder"
  (`detail.title`), and the H1 is the source's full title. On
  /behandlinger a card without a price keeps an empty eyebrow line from 768px, so titles in a row
  line up.

### Ny hos Fillox?

`/ny-hos-fillox` (`routes.newHere`; copy `content/pages/new-here.ts`, components
`components/new-here/`, page `app/ny-hos-fillox/page.tsx`): hero (sand panel; in-page link to
"Hvad ønsker du hjælp til?") → six need cards plus "Jeg ved ikke helt …" (each with 2–3 treatment
rows and their "fra" price from `priceFrom`, a "Læs mere" link and "Book tid"; the lines-and-wrinkles
card shows no prices — `pricesHiddenFor` — and says "Book konsultation") → the differences between
the treatments → what to book the first time → what happens at a consultation → FAQ (FAQPage
JSON-LD, `NewHereJsonLd`) → the rose closing band. Below 768px the treatment pages' book bar follows
the page until the closing band. The author's five recommendations and how they are met are listed
in the content file's header.

Navigation: "Ny hos Fillox?" is the second item of the "Om os" menu (`content/navigation.ts` →
`mainNav`: the header dropdown and the mobile menu's "Om os" accordion; on that page the "Om os"
trigger is marked current) and a footer link (`footerNav`, after "Om os").

## Photos

The clinic's own photos (Google Drive, the owner's approval of 2026-11-24: "the clients gave consent
and the clinic may use all its content on its own website") replaced every stock photo. No stock is
left in `public/images/`.

- **Mood photos** — `public/images/fillox/`, registered in `content/photos.ts` (file, intrinsic
  `width` / `height`, a default Danish `alt`, a default crop `position` on the face or subject). A
  placement spreads an entry and overrides `position` (or `alt: ""` where the photo is decorative):
  `{ ...photos.sproejte, position: "55% 12%" }`. Placements: home hero, home treatment cards,
  home testimonial (`behandlingsrum`, decorative), /behandlinger hero, `categoryImages` /
  `defaultImage` and the lip filler (`spejl`), næsekorrektion (`behandlingsrum`), "andre
  behandlingsmuligheder" and laser for mænd heroes
  (`content/pages/treatments.ts`, `content/treatments.ts`), the /om-os hero (the group photo; the
  doctor section shows Dr. Tom's team photo, see "People"), /ny-hos-fillox hero (`behandlerVindue`)
  and closing band, the /klinikker cards and the clinics' JSON-LD image (`content/seo.ts`),
  /priser's financing box, /ledige-stillinger (the group photo), /content-creator (`spejl`: the
  page names Annika, so no practitioner's face), every blog post, and the default share image
  (`og-spejl.jpg`, 1200 × 630, `content/layout.ts` → `meta.ogImage`). `categoryImages`:
  rynkebehandling = `behandlerFolder` (60% 40%; its "Læs mere" cards show the room, the mirror and
  the window), `"for-maend"` = `behandlingsrum` (also the men's page share image). A photo is
  shown once per page, except on /klinikker (the room on every card) and Dr. Tom on /om-os.
- **Share images** — link previews centre-crop og:image to 1.91 : 1, which cut the faces off the
  portrait photos. Every photo that is a page's share image has a `share` crop
  (`og-<file>.jpg`, ≈ 1.91 : 1, cut at the subject, at the file's own width up to 1200px: no
  upscaling); `shareImage()` (lib/metadata.ts) publishes it. `pageShareImage()` (used by
  `pageMetadata` and the blog posts) falls back to the site's default for a page photo narrower
  than 1.5 : 1 without a `share` crop. A new share photo needs its crop (the alt text must still
  hold for it).
- **People** (owner, 2026-11-25; the rule is in `content/photos.ts`) — the photos of Dr. Tom,
  Alberte, Annika and Mike are their team portraits only (`public/images/team/<slug>-2026.jpg`, see
  "Team"); their mood copies (`tom-klinik`, `mike-klinik`, `behandler-portraet-1/2` and their
  `og-` crops) are deleted. `behandlerVindue` is Alberte too: unnamed, and only beside her own
  name or no practitioner's (the hudforbedring pages show Alberte or no "Din behandler"). A photo
  of a team member never sits right above or beside a different named practitioner, and no
  unnamed practitioner's face sits next to a named author. The syringe photos (`behandlerSproejte`
  clearly, `sproejte` likely) are from Alberte's shoot (same pose, gloves and backdrop as her
  portrait; owner asked): so the lip filler page ("Din behandler: Annika") and næsekorrektion
  ("Din behandler: Dr. Tom") have heroes with no team member in them. Nobody else is identified: the other
  mood photos, the group photo and every client stay unnamed (alt texts, captions, file names).
- **Prescription medicine** — the rynkebehandling pages, the rynkebehandling blog posts and
  /ny-hos-fillox (it leads to them) use photos without product, syringe, needle or vial and with no
  treatment in progress (`spejl`, `behandlingsrum`, `behandlerVindue`, `behandlerFolder`: checked
  2026-11-25, no product shown, the leaflet's print unreadable), never as a
  result; the syringe photos (`sproejte`, `behandlerSproejte`) are for filler pages and posts.
  Judge the image itself, not its description: Drive 382DC544, first described as a
  consultation, is an injection at the client's brow (a typical Botox site) and is used nowhere.
  Not used either: both Academy training photos (the "croma" filler brand on the safety glasses,
  next to the face), the practitioner with a Profhilo box (device advertising with a health
  professional's endorsement) and the single "after" shots of clients (they read as results; one
  shows a filler brand). README → "Før lancering" → "Fotos fra Drive" has the reasons and the
  owner's checks.
- **Home treatment cards** ("Vi fremkalder, vi forandrer ikke", `content/pages/home.ts` → `results`):
  mood photos captioned with the treatment's name (from `content/treatments.ts`) and linking to it —
  Lip filler (`sproejte`), Kæbelinje (`behandlerFolder`, 75% 40%), Skinbooster (`behandlerVindue`). Not results:
  no client, no year, no amount, no rynkebehandling. `alt: ""` on all three, as on the team and blog
  cards: the caption names the link. `components/home/Results.tsx` → `photoSizes` asks for the
  card width, or card height × aspect for a photo wider than the 5 : 6 card, × the 3% hover zoom.
- **Resolution** — the files are 782–1548px wide. Every slot gets at least its CSS width at 1x
  (`sizes` measured at 390 / 768 / 1024 / 1280 / 1440 / 1600), except the blog article header
  (1440 × 620 on the 1600 canvas): only `spejl` (1548px) fills it; the others are drawn up to
  1.84× there (`sproejte`, 782px; `behandlerFolder`, 854px, 1.69×). None is sharp at 2x in the
  widest slots: larger originals of the same photos need no code change (README asks for them).
- **`sizes` that follow the photo** — portrait photos replaced landscape stock in several slots, so
  these now compute `sizes` from the image's aspect and the slot's measured height: `TreatmentHero`
  (`heroSizes`: 860px slot height on template pages, 980 / 920px on long-form pages, whose hero is
  taller), `TextPageHero`, `FeaturedPost`, `DoctorSection` → `OwnPhoto`; fixed values (for the
  current photo; recompute when it changes) in `AboutHero`, `NewHereHero`, the home testimonial
  (hidden below 1024px: ends in `1px`).

### Before/after

`content/treatments.ts` → "Before/after results" (the rules) and `chinResults`; files in
`public/images/resultater/<pair>-foer.jpg` / `-efter.jpg`. Today one chin-and-lips profile pair on
`/behandlinger/kaebelinje` (a second, IMG_5189, is held back: different head pose, light and
sharpness on the two halves), heading "Før og efter", an intro that says it is the same person,
shown with consent, and "Resultater varierer fra person til person" (shown at every width: the design
hid the intro below 768px), captions with the treated area only. Each half has its own alt ("… før
behandling med filler" / "Samme klients … efter …"). Both halves of a pair share one crop
(`position`), and both need `width` / `height` (`BeforeAfter` requires them: the layout below is
computed from them). Never: Botox pairs, amounts, time since treatment, "uden filter", "samme lys".

`components/treatment/ResultsSection` picks a layout from the halves' aspect (`width` / `height`):

| Layout | When | Card |
|---|---|---|
| `side` | any half is portrait | the design: before and after side by side in a 300 → 400 → 520px tall box |
| `stacked` | all halves landscape, 2–3 pairs | before over after, each half in a slot of the section's common aspect (the geometric mean of all halves' aspects), so every card has the same shape |
| `wide` | all halves landscape, 1 pair (Kæbelinje today) | before and after side by side across the row from 768px, in the same common-aspect slots |

Columns from 768px = the number of pairs, up to 3, so one or two pairs fill the row. Below 768px the
design's white 300px cards in a scroll row (stacked halves 280px wide). `sizes`: `sideSizes` (box
height × aspect, or half a column) and `landscapeSizes` (the column, or half of it, × the photo's
aspect over the slot's when it is wider), from the measured column widths (content width − gaps).

## Blog

- **Published posts** (`content/blog.ts` → `allPosts`; `posts` is the published ones): seven
  articles of 2026-11-25 (owner: "lave bloggen. skriv et par artikler"): four on lip filler,
  swelling and skin, and three in the category `rynkebehandling` (see "Prescription medicine"; the
  design's "Botox" chip is the "Rynkebehandling" chip). /blog's heading is "Viden fra
  Fillox-holdet". Each post has its own photo, never a team portrait. Every fact comes from the site's
  own content (prices through `listPrice()` from `content/prices.ts`, so a price change follows) or
  the live fillox.dk, with a `// source:` comment per block; blocks marked `TODO: fagligt tjek
  (læge)` need a doctor's review. A `links` block puts arrow links under the closing paragraph, or
  mid-article: the aftercare articles put the on-call line as a `tel:` link (`site.contact.phoneHref`,
  tap to call) under their warning signs, and "Lip filler for første gang" links
  `/blog/haevelse-og-blaa-maerker#kontakt-os`. check:market lets `tel:` links pass and checks
  that a `/blog/<slug>#id` link lands on a heading of that post. Every article that mentions the
  follow-up check states the live policy's conditions (once per treatment, within 21 days).
- **Author**: a post without `authorSlug` is signed by the team, "Fillox-holdet"
  (`content/pages/blog.ts` → `blogArticle.teamAuthor`), with the Fillox mark
  (`components/blog/TeamMark`, via `AuthorAvatar`) in place of a portrait; the article's JSON-LD
  names the organisation. A published post never names a practitioner (`check:market`; BEK
  253/2025 § 10: no health professional endorsing a product in an ad).
- **On hold**: `published: false` keeps a post's data but gives it no page (404) and leaves it out
  of /blog (list, featured card, chips with no published post), "Læs også", the treatment pages,
  the sitemap and the structured data; `check:market` fails if anything still links it. No post is
  on hold today.

## Cookie consent

Statistics and marketing load **only after consent** (owner 2026-11-25: "cookiebanner ja"). Config:
`config/site.ts` → `analytics` (`config/types.ts` → `AnalyticsConfig`): `gtmId` (null = no banner,
no footer button, no tags), `consentVersion` (a change asks everyone again), `consentMaxAgeDays`
(365), `consentStorageKey`, the first-party cookie names per category, and
`blockCustomHtmlWithoutMarketing`. Copy and the privacy policy's "13. Cookies" list:
`content/consent.ts`.

- **Order on every page load** (`lib/analytics.ts`, run by `components/consent/ConsentManager`,
  rendered in the root layout right after the skip link): Google Consent Mode v2 `default` with all
  four signals denied (+ `wait_for_update`, `ads_data_redaction`); the cookies of every category
  not granted are deleted (also the old WordPress site's, PixelYourSite's `pys*`, `last_pys*` and
  `pbid` included); with a stored choice that grants
  Statistik or Marketing, the Consent Mode `update`, then the GTM container (`gtm.js`). No choice,
  or "Afvis alle": GTM is never requested. Statistik → `analytics_storage`; Marketing → `ad_storage`,
  `ad_user_data`, `ad_personalization`.
- **Stored choice**: localStorage (first party, never sent), with `consentVersion` and a
  timestamp; an unreadable, older-version or > 12-month-old choice counts as none. Storage blocked:
  the banner asks on every page and nothing loads.
- **Custom HTML guard**: GTM-KDBJMVF2's Meta Pixel is a Custom HTML tag without a consent check,
  which Consent Mode cannot stop. While `blockCustomHtmlWithoutMarketing` is true, the loader
  pushes `gtm.blocklist: ["customScripts"]` before `gtm.js` unless Marketing is granted. Set it to
  false once the container gates those tags (README → "Før lancering" → "Cookiebanner og måling").
- **Withdrawal**: "Cookieindstillinger" in the footer reopens the banner on "Tilpas" with the
  current choice; withdrawing a category while GTM runs deletes its cookies and reloads the page
  (tags that ran cannot be unloaded). Other open tabs follow: `consentStore.init()` listens for the
  `storage` event on the consent key (`lib/analytics.ts` → `isConsentStorageEvent`) and applies the
  new choice there too (Consent Mode update, cookie deletion, a reload while GTM runs; the banner
  opens when the choice was cleared).
- **Banner UI**: a non-modal labelled `<section>` fixed at the bottom (no cookie wall: the page
  stays usable); "Accepter alle" and "Afvis alle" are the same component, variant, size and row;
  "Tilpas" shows one switch per optional category, none on in advance; every control ≥ 44px. It
  reserves its height at the end of the page (spacer + scroll padding; `--consent-reserve` also
  raises `<body>`'s min-height in app/layout.tsx, so a short page's footer does not move) and
  stacks above the mobile book bar on treatment pages: z-45, above the book bar (z-40) and below
  the sticky header (z-50), so the mobile menu and the dropdown panels cover it while open.
  After a choice, focus returns to the footer button that reopened it, or goes to `<main>` when
  it was in the banner (a first-visit choice). Rendered on the client only (not in the server HTML).
- **A new tag in the container** needs a consent setting in GTM, its hosts in the CSP
  (`config/securityHeaders.ts` → `cspDirectives`, plus the copy in `netlify.toml`), a line in the
  cookie list and a new `consentVersion`.
- **Gecko**: `/booking`'s calendar iframe is necessary for booking and loads regardless of the
  choice; Gecko's own page loads Google Tag Manager inside it (outside our control, README).

## Booking providers

`config/site.ts` → `booking` is a discriminated union (`config/types.ts` → `BookingConfig`);
each clinic carries its own ids at the provider (`content/clinics.ts` → `Clinic.booking`,
type `ClinicBookingIds`).

| Provider | Market | Config | Per clinic | /booking |
|---|---|---|---|---|
| `gecko` | fillox.dk | `href`, `geckoHost`, `geckoIcCode` | `geckoCalendarId` (optional) | Gecko's `iframe.js` injects ONE calendar for every clinic (`GeckoEmbed`, which also preconnects to `geckoHost`), capped at 1184px and centred in the white card (min-height 640px) |
| `timma` | fillox.no | `href`, `timmaBaseUrl` (`https://bestill.timma.no/reservation/`) | `timmaId` (required on open clinics) | clinic picker (a button per open clinic with a `timmaId`) + that clinic's TIMMA page in an iframe at full width (`TimmaEmbed`) |

- `components/booking/BookingEmbed.tsx` (server) switches on `site.booking.provider` and
  renders the white card around the embed; `app/booking/page.tsx` only renders the intro band
  and `<BookingEmbed />`. Adding a provider = a variant in `BookingConfig` + a case there
  (the `never` default makes TypeScript list the missing case).
- Links are provider-neutral and built by `lib/booking.ts`: `clinicBookingHref()` →
  `/booking?geckoCalendarId=12` (Gecko preselects the clinic) or `/booking?klinik=<slug>`;
  `practitionerBookingHref()` → `/booking?behandler=<slug>`. `withBookingLinks()` sets every
  open clinic's `bookingHref` (menus, clinic cards). The query parameter names are copy
  (`content/layout.ts` → `booking.params`).
- TIMMA picker (`TimmaEmbed`, client): the selected clinic lives in `?klinik=` (read with
  `useSearchParams` inside `<Suspense>`, so `/booking` stays static; written with
  `history.replaceState`, which syncs with `useSearchParams`). No selection = picker only;
  a single clinic is always selected. Copy: `content/layout.ts` → `booking.clinicPicker`
  (label, hint, iframe title per clinic, "open in a new window" link).
- TIMMA iframe height: TIMMA's page includes iframe-resizer's child script, so `TimmaFrame`
  speaks its v2 postMessage protocol itself (sends the init message on load, applies the
  `[iFrameSizer]<id>:<height>:…` answers from TIMMA's origin only). No third-party script is
  loaded; without answers the iframe stays 1400px high (min 640px) and scrolls inside.
- `npm run check:market` fails when the provider is `timma` and an open clinic has no
  `timmaId`, and lists clinics without a Gecko calendar id as a note.

## Reviews

Every customer quote on the site is a real Trustpilot review, quoted verbatim, and they rotate
(owner's request: at least 3–5 reviews wherever reviews are shown).

- **Data** — `content/reviews.ts`: `reviews` (text, reviewer name as Trustpilot shows it, date,
  rating, the review's URL, the practitioners / treatments it names) and `reviewSets` (`home`,
  `general`, per practitioner slug, per treatment slug). The only shortened form is `short`:
  whole sentences of the text with "…" where text is left out; `npm run check:market` verifies
  every excerpt against its text and every set against the reviews (a practitioner set only
  takes reviews that name that person, `general` only reviews that name nobody and fit every
  page — nothing about needles, anaesthesia or a "sygeplejerske", which a laser page or a
  doctor's profile would contradict). The file's header lists what is left out on purpose
  (reviews naming Botox, former staff, Fillox Oslo …).
- **Wrinkle pages** — `treatmentsWithoutReviews` (`rynkebehandling`, `andre-behandlingsmuligheder`,
  which replaced the Botox, lip flip, gummy smile, hyperhidrose, Traptox and Botox for mænd pages)
  show no reviews section at all: Botox is a prescription medicine, and even general reviews would
  read as testimonials for it there. Both are long-form pages, which show no reviews anyway; the
  list keeps it that way if one becomes a template page. Remove a slug only after a legal check
  (README checklist); `check:market` validates the list.
- **Selection** — `reviewsFor({ practitioner | treatment | set, min = 3, max = 6, seed })`: the
  own reviews (≤ max), filled up to `min` with `general` ones (never twice; `seed` = page slug
  varies which). Treatment pages pass `min: 5`; practitioner profiles keep 3, so a profile
  with few reviews of its own is not mostly general ones. `allSpecific` tells the section whether its heading may name the
  practitioner / treatment; otherwise it says "Det siger vores kunder", so a general review is
  never presented as being about that person or treatment.
  Practitioner profiles (`components/practitioner/profile.ts` → `ownReviews`): one rule for
  everyone — at least one review that names the practitioner, filled up to 3 with general ones
  (Dr. Tom: 1 + 2); none of their own, no reviews section at all (Kubra), because a section of
  general reviews only would read as testimonials about a person no review names. The fill-up
  on a profile also skips `generalNotOnProfiles` (general reviews that praise one unnamed
  "behandler", which would read as being about that practitioner).
- **Aggregate** — `config/site.ts` → `trustpilot` (`score`, `reviewCount`, `url`) and
  `ui.trustpilotLabel`; update them together from the profile. `TrustpilotRating` is linked
  (new tab, 44px hit area) in the home hero; `showSummary` adds "4,7 ud af 5 · 172 anmeldelser".
- **Rotator** — `components/ui/ReviewRotator.tsx` (client, no libraries; WAI-ARIA carousel):
  all reviews rendered in one grid cell (height of the tallest, no layout shift; the first one
  in the server HTML), crossfade + 16px slide every 7s; pauses on hover, focus inside, hidden
  tab and while mostly off screen; no rotation or animation with prefers-reduced-motion. Pause
  / play, previous / next and (box ≥ 28rem) dot buttons (each its own tab stop; inactive dots
  ≥ 3:1), all 44px; swipe on touch. Any step stops the rotation; `aria-live` is "off" while it
  actually rotates and "polite" whenever it is paused (hover, focus, button, reduced motion),
  so the review a user moves to is announced. Each slide is a `div role="group"
  aria-roledescription="slide"` around a plain `<figure>`. Without JavaScript the controls
  keep their space but stay `invisible` until hydration. Tab order is slide link → pause →
  previous → dots → next (controls below the quote, as designed); focus inside pauses the
  rotation, so the review never changes before a keyboard user reaches pause (WCAG 2.2.2).
  Props: `surface` (`light`, `band` = a rose band, `band-lg` = white card below 1024px, rose
  band from 1024px; the home column carries `data-surface="band-lg"` so the link under the
  rotator gets the band's text selection too),
  `size` (`large` pull quote in the heading font, `compact` card text in Figtree), `align`, `valign`
  (`start` on practitioner profiles: shorter reviews sit under the heading). Dates are
  formatted on the server (`lib/reviews.ts` → `toReviewSlides`, site.locale).
- **Placements** — home testimonial (set `home`, rose split panel), practitioner profiles
  with a review of their own (`components/practitioner/ReviewSection`; their offers say
  "Rynkebehandling", not "Botox", next to the testimonials — the same open legal question),
  treatment pages after the results except the
  wrinkle pages (`components/treatment/ReviewsSection`, copy in `content/pages/treatments.ts` →
  `reviews`).
  Each has "Se alle anmeldelser på Trustpilot →" (`AllReviewsLink`). No review structured data:
  reviews a business shows about itself are not eligible for review rich results.
- **Treatment-page sections (October 2026, owner: "Trustpilot og priser … gør lidt bedre")** —
  reviews: a sand band, heading + `components/treatment/TrustpilotScore` (white card: big 4,7,
  Trustpilot squares, "Fremragende på Trustpilot", "Baseret på 172 anmeldelser", the
  `AllReviewsLink`; one sr-only sentence for screen readers) left, the rotator `size="large"`
  right (stacked below 1024px). Prices (`components/treatment/PriceSection`): one card on the
  surface margin, a rose panel (heading, intro, "fra 999 kr", "Konsultation og kontrol er altid
  gratis", "Book tid") beside white rows (from 1024px; lists of > 6 rows from 1536px, in two
  columns from a 42rem rows panel) or above them; "Se alle priser →" to the /priser card the rows
  come from. Copy: `content/pages/treatments.ts` → `reviews.score`, `prices.note`.
  Rules (fix round): the big "fra" price only when a row has that amount (Laser for mænd lists
  combined areas from 1.000 kr, so it shows none); the note is left out when the intro mentions
  kontrol or the list has the free konsultation / kontrol rows, which fallback lists show full
  width under the rows; "Book tid" in the card from 768px (below, the book bar). Row groups with a
  small heading (`prices.groups`: lip filler's "Andre ydelser"; the Botox page's groups went with
  that page) — two columns split between groups, never inside one. Every Trustpilot rating
  in the reviews band is `components/ui/TrustpilotStars` (score card + each quote, rotator
  `stars="trustpilot"`).

## Team (practitioners)

- **Data** — `content/team.ts` (order = display order: Dr. Tom, the fagligt ansvarlig læge,
  first): Dr. Tom, Alberte, Annika, Mike, Kubra. Profiles (/behandlere/<slug>) follow Alberte's
  design (6alb / ma) with each practitioner's own documented facts; the file's header lists the
  sources and what is left out. Maria left Fillox (owner, 2026-11-25): her entry, photo and
  profile are gone, `/behandlere/maria` redirects (308) to `/om-os#behandlere`
  (`content/redirects.ts`), the reviews that name her are left out (`content/reviews.ts`), the
  lip filler page's "Din behandler" is Annika and the men's page shows Mike in her place.
- **Grids** — home ("Mød dem, der behandler dig"), /om-os and /behandlere show every member as
  an equal card in rows of 3 (the owner, October 2026). With five members the short last row is
  centred (`components/practitioner/teamGrid.ts`): the grid has twice the tracks, every card spans
  two, and `teamGridStart` moves the first card of a short row half a card in. Home: 3 + 2 from
  768px (below, the scroll row); /om-os and /behandlere: 2 + 2 + 1 at 560–1023px, 3 + 2 from
  1024px. No member is featured any more: `TeamMember.featured` (content/types.ts) is unused, and
  6om's wide Dr. Tom photo was deleted before launch (2026-11).
- **Portraits** — the owner's new photos of 2026-11-25: `public/images/team/<slug>-2026.jpg`
  (Tom, Alberte, Annika, Mike: re-encoded from the Drive originals, sRGB, no metadata, never
  upscaled; new file names so no CDN serves the old ones), Kubra keeps `kubra.jpg`. Each member
  has a `share` crop (`og-<file>.jpg`, ≈ 1.91 : 1 at the face) for the profile's og:image.
  Framed from a face table in `content/team.ts` (`faces`: nose line, eye and mouth lines measured
  per file on a 1% grid; `framedPortrait(member, slot)`), so every face in a grid sits on one
  line and at one size: `teamSlots.portrait` (4:5) for the /om-os and /behandlere cards from
  768px and the home scroll row, `teamSlots.square` (33:34, mo's cards) for the home grid and the
  cards below 768px, `teamSlots.row` (190:268) for the profile's "Mød resten af teamet" row
  (`TeamRow`). The exported `team[].image` and `crops.about` are the 4:5 card crop (avatars, the
  men's page cards). The treatment pages' "Din behandler" uses `CropPhoto`: the card crop, plus
  `smCrop` (660:400, eyes at 33%) at 640–767px, where the slot is landscape. The profile hero
  crops come from the same table (`components/practitioner/profile.ts` → `HERO_SLOTS`; the sm
  eye line is 31%, so Kubra's hair is not cut; the desktop crop takes its horizontal position from
  the narrowest frame, 360 × 636 at 768px, and its vertical one from the 1280 frame; the mobile
  crop's vertical position also keeps the head whole in the widest mobile frame, 615 × 440 at
  639px, where Kubra's 4:5 photo is drawn much taller); no designed
  crop is left. On an axis a photo fills exactly in its slot, `faceCrop` puts the photo's top (not
  its middle) at the top, so a frame of another shape that draws the same crop (the profile hero
  below 640px gets wider than tall) never cuts the head. Annika's photo is cut
  just above her hair, so the zoom rule draws her ≈ 15% larger to reach the common eye line.
  `sizes` describes the width the photo is drawn at (cover × zoom): `drawnWidthScale` on the team
  cards and the men's page cards (`MenCare`), and per breakpoint from the measured slots in `PractitionerHero` and the treatment
  pages' `PractitionerSection`. A new photo needs its
  `faces` entry, and should be a portrait (crop a landscape photo to 4:5 first: Kubra's
  original is `design-reference/uploads/kubra-original.jpg`).

## Design tokens (Anette's palette, 2026-10-10)

The design was drawn in plum (`#6B3840`) with Poppins everywhere. In October 2026 the owner chose,
from the /lab experiment, **Figtree** as the site font with **Poppins only for headings** ("not as
thick, not as black"). On **2026-10-10** Anette (Fillox) sent the team's palette, which replaced the
interim "Støvet rosa & beige": **Offwhite `#FAFAF8`, Lys Rosa `#E7D3CE`, Plum `#6B393F`, Sandbeige
≈ `#C9BFA7`** ("I like best: Lys Rosa and Plum. Can the background (krem) be a little cooler? And
should we include some of the beige…?"). So: a cooler offwhite page, Lys Rosa as the brand surface
(bands, panels), plum as the accent only (buttons, links, eyebrows, numbers, the H1's accent words;
never a large surface: the team found plum too hard as a surface, and the earlier dusty rose
`#D9A192` too orange), and a touch of Sandbeige (the footer, and lightened as hero panels, cards and
dividers). Layout, components and copy are unchanged. Every value lives in `app/globals.css`
(`@theme`); components use the semantic names below and never a hex value. All text pairs are WCAG
AA (ratios in the tables; "offwhite" = `cream`).

**Light surfaces and text**

| Token | Value | Use |
|---|---|---|
| `cream` | `#FAFAF8` | page base (Offwhite; the former krem was `#F7F2EA`) |
| `sand` | `#EBE8DF` | surfaces: hero panel, cards, icon circles (Sandbeige 30 % on offwhite) |
| `secondary` | `#E1DCCF` | secondary surface: team panel, hovered arrow circles (Sandbeige 50 %) |
| `line` | `#E1DCCF` | hairlines on light; the edge of `shadow-card` |
| `field` | `#857B69` | form field borders (Sandbeige deepened): 4.17:1 on white, 3.99 on offwhite, 3.40 on sand (WCAG 1.4.11) |
| `rule` | `#CDBEA7` | Sandbeige dividers (hero stats, the 2px step rules). Decorative only (1.75:1 on offwhite), never text on light; text on the For mænd espresso (7.4:1) |
| `rule-strong` | `#6B393F` | plum: active nav underline, text-link underlines (`textLink`): 8.8:1 on offwhite |
| `ink` | `#242724` | body text |
| `heading` | `#3B2A28` | headings (espresso): 13.0:1 on offwhite, 11.1 on sand |
| `muted` | `#5E4F4D` | secondary text: 7.4:1 on offwhite, 6.3 on sand, 5.7 on secondary |
| `taupe` | `#7A624F` | prices and price notes on /priser and /ny-hos-fillox, the /priser hero eyebrow (design `#B39C89`, darkened to pass WCAG AA: 4.65:1 on sand, 5.45 on offwhite, 5.69 on white; never on secondary or the band, where it would fail) |
| `placeholder` | `#746A67` | input placeholders, the only placeholder colour (design `#8A7F7C`, darkened: 5.0:1 on offwhite, 5.25 on white) |
| `emphasis` | `#6B393F` | the H1's accent words (plum): 8.8:1 on offwhite, 7.5 on sand |
| `selection` | `#E7D3CE` | text selection on light: Lys Rosa (ink on it 10.5:1) |

Sandbeige is used as `#CDBEA7`, not Anette's approximate `#C9BFA7`: the same lightness and the same
contrast for every text on it, with its slight green cast removed (Lab a* −0.5 → +1.5), so the footer
doesn't read olive right under a Lys Rosa band.

**White cards on the page.** White is only 1.05:1 (ΔE 2) on the offwhite page, so a white card there
carries `shadow-card` (`--shadow-card`: a 1px ring of `line` at 70 % plus a faint 1px drop). Use
`max-md:` / `max-lg:` where a card is white only at that size (mobile bestsellers, the mobile
testimonial, team cards in mobile rows). White cards on sand or on the band need no ring. A scroll
row (`overflow-x-auto`) clips the ring: pad it 4px and cancel the padding with negative margins
(`ResultsSection`, like the team rows). Light hover fills on white use `bg-band/40` (`#F5EDEB`, the
header dropdown rows), never `bg-cream` (invisible on white).

**Accent** (Plum): buttons, links, eyebrows, numbers, checkmarks, the focus ring, on light surfaces
AND on the rosa bands and the footer.

| Token | Value | Use |
|---|---|---|
| `accent` | `#6B393F` | 8.8:1 on offwhite, 9.2 on white, 7.5 on sand, 6.4 on the band, 5.0 on the footer |
| `accent-deep` | `#50292E` | hover of accent buttons / links |
| `on-accent` | `#FAFAF8` | text on accent (offwhite, 8.8:1; 11.8 on accent-deep) |

**Band** (Lys Rosa; every surface that was a plum band in the design: USP band, bestseller list,
review panels, the mega menu's panel, "Om behandlingen" / "Klar til at booke?" bands, price boxes,
clinics USP strip …)

| Token | Value | Use |
|---|---|---|
| `band` | `#E7D3CE` | the surface |
| `on-band` | `#33211D` | headings, names, the quote, links: 10.6:1 |
| `band-body` | `#3A2622` | running text: 9.9:1 |
| `band-accent` | `#6B393F` | eyebrows, prices, stars, hours, link hover (plum): 6.4:1 |
| `band-fine` | `#3F2824` | fine print: 9.5:1 |
| `band-line` | `rgb(107 57 63 / .18)` | dividers (plum, decorative) |
| `band-highlight` | `#FFFFFF` | hovered / focused bestseller row, text selection on bands |
| `band-card` / `band-card-hover` | white 45% / 65% | translucent cards on the band |

**Footer** (Sandbeige; tune it with `--color-footer` alone, its text stays ≥ 5:1)

| Token | Value | Use |
|---|---|---|
| `footer` | `#CDBEA7` | the footer block (1.27:1 against the band, 1.49 against sand, 1.33 against secondary). Don't go lighter than `#D5CEBB` (Sandbeige 75 %, the tuner's "Lys footer"): lighter, it merges with the secondary / sand panels that close some pages right above it |
| `on-footer` | `#33211D` | clinic names, contact values, links: 8.4:1 |
| `footer-body` | `#3A2622` | running text, legal: 7.8:1 |
| `footer-accent` | `#6B393F` | uppercase labels, hours, link hover (plum): 5.0:1 (6.3 on footer cards) |
| `footer-line` | `rgb(51 33 29 / .18)` | dividers (decorative) |
| `footer-card` / `footer-card-hover` | white 35% / 50% | phone / e-mail / booking cards |

**Not changed by the palette (yet).** The stock photos with salmon backdrops are gone (November
2026: the clinic's own photos, see "Photos"; their rose-beige walls sit well with Lys Rosa). The
Gecko booking theme follows the palette in `integrations/gecko/` (its own light fill `#F4F3EE`,
because Gecko sits on the white card, not on the offwhite page); the live booking keeps the old
theme until the new CSS is pasted into Gecko.

The footer shows the black logo (`site.brand.logoDark`, as the header). Its only button is the
newsletter's "Tilmeld" (owner, round 4: two CTAs in the footer made no sense); booking is the
third contact card ("Book online / Find en tid →", `content/layout.ts` → `footer.bookingCard`,
links to `/booking`) next to phone and e-mail. The sticky header keeps "Book tid".

**Footer newsletter and Trustpilot strip** (owner, 2026-10; copy in `content/layout.ts` →
`footer.newsletter` / `footer.trust`). The footer block opens with a newsletter signup
(`components/layout/FooterNewsletter`: eyebrow, heading, one line left; e-mail + "Tilmeld" and
"Vi bruger kun din e-mail til nyhedsbrevet, og du kan altid afmelde dig. Læs vores
privatlivspolitik." right from 1024px; stacked below, after the logo) and ends with a Trustpilot strip (`components/layout/FooterTrust`: "Fremragende", the hero's
green squares, "4,7 ud af 5 · 172 anmeldelser på Trustpilot" from `config/site.ts` → `trustpilot`,
one link to the profile in a new tab, a `footer-card` pill ≥ 44px, a full-width card below 768px).
- The form is `components/ui/NewsletterForm` (client), shared with the /blog band
  (`components/blog/NewsletterSignup`, `tone="band"`): inline validation, focus to the field on an
  error, `role="alert"` on a failed POST, a focused `role="status"` on success. It posts `email`,
  `source` (`footer:/path` or `blog:/blog`, where the visitor consented) and the honeypot to the
  Netlify form `nyhedsbrev` (`public/__forms.html` declares all three). Without JavaScript (or before
  hydration) the browser validates the field (`noValidate={useHydrated()}`, as in ContactForm) and
  the form POSTs to `content/forms.ts` → `newsletterNoJsAction` (`public/__nyhedsbrev-tilmeldt.html`,
  a meta-refresh to `routes.newsletterThanks`, `/nyhedsbrev/tak`, noindex, copy in
  `content/layout.ts` → `newsletterThanks`; `check:market` rule 5 checks the forward), so the address
  never lands in the URL.
- Consent: no checkbox (nothing pre-ticked); the visitor's own signup after the text that says what
  they get ("tilbud, nyheder og tips om vores behandlinger"), and the line under the field (same
  wording on /blog) linking to the privacy policy's newsletter section (`routes.privacyNewsletter`,
  `content/pages/legal.ts` → "12. Nyhedsbrev": purpose, legal basis, retention, processors,
  unsubscribing; pending the owner's legal review). Newsletter offers must never promote Botox or
  other prescription medicines.
- The white field has a 1px border ≥ 3:1 against its surface (footer-accent 90% → 3.8:1, band-accent
  85% → 4.2:1).
- /blog: its band sits right above the footer, so it carries `data-newsletter-band` and the footer
  signup hides itself on that page (`[body:has([data-newsletter-band])_&]:hidden`, CSS only); so
  does `/nyhedsbrev/tak` (`data-newsletter-thanks`).
- Trustpilot numbers are static: `config/site.ts` → `trustpilot.checked` is the day they were copied
  from the profile; `check:market` prints a note after 60 days (owner option: Trustpilot's TrustBox).

**Removed names.** The production names `plum`, `plum-deep`, `powder` and `blush`, the `light` /
`lightInk` button variants, `tone="light"` / `"powder"` / `"plum"` on the primitives,
`surface="plum" | "plum-lg"` on the rotator and `data-surface="plum" | "plum-lg"` no longer exist:
every use was converted (recipe below), so a leftover fails the type check or renders no colour.

**Surfaces and focus.** The focus ring is the accent on every surface (8.8:1 on offwhite, 7.5 on sand,
6.4 on the band, 5.0 on the footer), so no surface needs a ring of its own (the For mænd espresso
surface switches to an offwhite ring, 13.0:1). `data-surface` now only marks where text selection switches to the
band's highlight: `data-surface="band"` on a band, `"band-lg"` on an element that is a band from
1024px only, `"band-md"` on a sand card that turns into a band from 768px (the band highlight is
only 1.23:1 on sand, so the card keeps the light Lys Rosa selection), `"footer"` on the footer block.

**Colour tuner (dev only).** In `next dev` every page has a round "Farver" button bottom-right
(`components/dev/ColorTuner`, mounted by `app/layout.tsx` only when `NODE_ENV` is `"development"`;
a production build drops the import, so no code, script or CSS of it ships; `check:market` rule 13
fails if anything else imports `components/dev`, or if the layout's import loses its guard). The
panel lists the tokens above in Danish groups (Side & flader, Tekst, Knapper & links, Rosa bånd,
Footer), plus Tailwind's `white` ("Hvid": white cards, menus, form fields; also the white stars in
the Trustpilot boxes). Left out: a token Tailwind did not emit (no runtime value, e.g. the unused
`band-card` / `band-card-hover`) and, on purpose, `trustpilot` / `trustpilot-empty` (Trustpilot's
brand colours). Each row has a live swatch, a colour picker, a hex field (applied live once the
code is complete, `#rrggbb` or `#rrggbbaa`; a short `#rgb` on Enter or leaving the field; a code
without alpha keeps a translucent token's opacity), an opacity slider for the translucent tokens,
"Nulstil" per row and the WCAG AA ratio of the text that sits on or in that colour: every surface
row checks its weakest text (cream: taupe and placeholder too), and `heading` / `rule` / `cream`
also check the For mænd page, where `heading` is the dark fill (`components/men/surface.ts`) with
Sandbeige `rule` and offwhite 75 % text on it; `field` checks 3:1 on white, offwhite and sand. A line
at the top counts every pair below AA and lists them. "Nulstil alle" asks first; the "Forslag" only
set their own token (Varm krem: `cream` back to the former `#F7F2EA`; Lys footer: `footer` `#D5CEBB`)
and keep the other changes, asking before they replace a value the owner set; "Nuværende" is
"Nulstil alle". A change writes `html:root { --color-<token>: … }` into one
`<style>` in `<head>`, so every utility updates live (`shadow-photo` follows the accent too);
overrides persist in localStorage (`fillox-color-tuner`) across navigation and reloads, applied
before paint by an inline script. "Kopiér farver" copies the changes (Danish names, before → after,
the AA summary and the contrast of every pair a change touches, the CSS lines for `@theme`) for the
owner to paste to us; tokens change in `app/globals.css`, never in the tuner. Automated browsers
(`navigator.webdriver`: screenshot scripts) get neither the button nor the overrides unless the
URL has `?farver`; `?farver=0` turns it off in any browser (both stick for the tab). Its labels
are inline (a dev tool, not copy: `check:market` rule 9 skips `components/dev/`), its styles are
plain CSS in fixed neutral colours (`app/globals.css` keeps the folder out of Tailwind's scan).

**Typography**

- Figtree (`font-sans`, the body default): running text, nav, buttons, eyebrows, labels, prices,
  forms, menus (dropdowns, mega-menu links, mobile menu rows), footer — everything that is not a
  heading. Weights 400 / 500 / 600 / 700 as before (one variable file). Body text stays `ink` /
  `muted`.
- Poppins 500 (`font-heading`: family + weight 500, weight synthesis off, so a leftover
  `font-semibold` still renders 500): H1, H2, H3, hero stat numbers, card / column titles
  (bestsellers, team names, clinic names, price-card titles, blog card titles), the mega menu's
  heading, the big review quote. Colour `text-heading` on light, `text-on-band` on a band. Only
  weight 500 of Poppins is loaded.
- Tracking: `tracking-hero` -0.025em (H1), `tracking-display` -0.02em (H2, H3, card titles)
  (production -0.035 / -0.03em).
- Sizes: desktop H1 64/1.02, H2 40/1.1; mobile H1 36/1.08, H2 28/1.15, body 16/1.7 (articles
  17), eyebrow 12 Bold uppercase +2px. From 1280px these grow with the type scale ("Wide layout"
  → "Type scale").
- Default line height: `body` sets `line-height: 1.5` (`app/globals.css`). The design leaves most
  line heights at "normal", which in Poppins is 1.5; Figtree's "normal" is only 1.2, so without
  it every nav item, menu row, price row and band would be shorter than designed. Text that sets
  its own `leading-*` is unaffected. (Some sections still carry an explicit `leading-[1.5]` from
  before this default: redundant, harmless.)
- Arrows (→ ←) come from the system's Lucida Grande in both stacks ("Fillox Arrows").

**Recipe (pages and components)**: how production's classes were converted (use it for a
component ported from an older branch or from fillox-no).

| Production | Now |
|---|---|
| heading `font-semibold text-ink` (+ `tracking-display` / `tracking-hero`) | `font-heading text-heading` (keep the tracking token; drop `font-semibold`) |
| heading on a band `font-semibold text-cream` | `font-heading text-on-band` |
| `SectionHeading tone="light"` | `tone="band"` |
| `bg-plum` band + `data-surface="plum"` | `bg-band` + `data-surface="band"` |
| `text-cream` on a band (names, links, the quote) | `text-on-band` |
| `text-blush` on a band | `text-band-body` |
| `text-powder` on a band (eyebrows, prices, stars, hours) | `text-band-accent` (`Eyebrow tone="band"`) |
| `text-rule` on a band | `text-band-fine` |
| `border-cream/18`, `border-[rgba(243,237,228,.16)]` on a band | `border-band-line` |
| `bg-cream/8`, `bg-cream/12` cards on a band | `bg-band-card`, `hover:bg-band-card-hover` |
| `hover:bg-powder` row on a band | `hover:bg-band-highlight` |
| `variant="light"` / `"lightInk"` button on a band | `variant="primary"` (the default) |
| `ArrowLink` / `AllReviewsLink tone="powder"` | `tone="band"` |
| `TrustpilotRating tone="light"` | `tone="band"` |
| `ReviewRotator surface="plum"` / `"plum-lg"` | `surface="band"` / `"band-lg"` |
| `text-plum`, `border-plum`, `bg-plum` (buttons, links, numbers on light) | `text-accent`, `border-accent`, `bg-accent` |
| `hover:bg-plum-deep`, `text-plum-deep` | `hover:bg-accent-deep`, `text-accent-deep` |
| `text-cream` on an accent fill | `text-on-accent` |
| `bg-powder` (secondary surface) | `bg-secondary` |
| a powder block directly above the footer (/blog newsletter, practitioner "Book tid hos …") | `bg-band` + `data-surface="band"`, so it stays distinct from the beige footer |
| the H1's accent words `text-plum` | `text-emphasis` |
| `focus-visible:outline-powder` and other ring overrides | remove (the accent ring fits every surface) |
| `border-[rgba(243,237,228,.16)]` / `bg-[rgba(243,237,228,.16)]` / `border-[#f3ede4]` on a band | `border-band-line` / `bg-band-line` |
| `border-[rgba(243,237,228,.45)]` (arrow circle on a band) | `border-on-band/40` |
| `shadow-[0_10px_30px_rgba(107,56,64,.10)]` | `shadow-photo` (the accent at 10%, a `color-mix` of `--color-accent`) |

- Shape: pill buttons (radius 100px; 52px high on mobile, secondary taps ≥ 44px),
  cards 18–24px radius, 12px margin on surfaces, 20px side margin on text (mobile).
- Behaviour: sticky header, fullscreen mobile menu with accordions, horizontal scroll
  for practitioners/results/chips on mobile, fixed book bar on mobile treatment pages.
- Desktop design canvas is 1180px wide; mobile is 390px. The 1180px canvas is the
  *reference* for proportions; the **site** canvas is fluid up to `--canvas-max` (see
  "Wide layout" below).

## Wide layout

The design was drawn on a 1180px canvas, which looks like a tablet view on a 1710px
MacBook screen. The site therefore uses a fluid canvas **and one fluid type scale**. Every
value lives in `app/globals.css`; to change the whole site's width, edit **one** value,
`--canvas-max` (1440 / 1600 / 1920px).

| Viewport | Behaviour |
|---|---|
| < 1024px (mobile 390, tablet 768) | the design, except the best-practice fixes listed under "Type and UI rules" |
| 1024–1279px | as the design (the canvas is the viewport; gutters 56px); nav and buttons 15px |
| ≥ 1280px (`xl`) | canvas, gutters, type, button paddings and section spacing grow linearly up to 1600px |
| > `--canvas-max` | canvas is centred; nothing grows further |

### Layout tokens

| Token (globals.css) | Value | Utility |
|---|---|---|
| `--canvas-max` | `1600px` | `max-w-canvas` (also `w-canvas`) |
| `--gutter-content` | 20 · 40 (md) · 56 (lg) · 64 (xl) · 80px (2xl) | `px-gutter`, `-mx-gutter`, `scroll-px-gutter`, `pl-gutter` … |
| `--gutter-surface` | 12 · 24 (md) · 32px (2xl) | `px-surface`, `p-surface`, `inset-x-surface` … |
| — | N px ≤ 1280 → N × 1.2 at 1600 | `p-fluid-N`, `px-`, `py-`, `pt-`, `pb-`, `mt-`, `mb-`, `gap-`, `h-`, `min-h-fluid-N` |
| — | N px ≤ 1280 → M px at 1600 | the same utilities with a modifier: `min-h-fluid-720/800`, `xl:px-fluid-30/34` |

### Type scale

Every size of the design maps to **one** token. A token is exactly the design size up to
1280px, grows linearly to its 1600px value, then stops. Font size only: leading and
tracking stay as they are. All tokens follow one formula, a → b:
`clamp(a, calc((a − 4(b − a))px + ((b − a) / 3.2)vw), b)`.

| Design size | Utility | 1600px | Role |
|---|---|---|---|
| 11, 12 | `text-micro` | 13 | eyebrows (`Eyebrow`), uppercase labels, badges, price notes (11 is raised to 12; the /priser card notes grow 12 → 14 instead, to keep the design's note / row ratio next to the 14 → 16 rows) |
| 13 | `text-fine` | 14 | fine print: consent, form help / errors, newsletter note |
| 14, passive | `text-small` | 15 | addresses, captions, meta, footer text, legal, breadcrumbs, Trustpilot label |
| 14, actionable | `text-ui-sm` | 16 | text you act on: `ArrowLink`, price rows, form labels, footer nav links |
| 13 / 14, pill or nav | `text-ui` | 17 | nav triggers, every `Button` size, chips, the textLink button (15px below 1280, 16 at 1280) |
| 15 | `text-body-sm` | 16 | the design's 15px copy, desktop newsletter input |
| 16 | `text-body` | 18 | body, intros (`SectionHeading`), card text, captions, FAQ answers, inputs |
| 17 | `text-body-lg` | 19 | article and text-page body |
| 18 | `text-lead` | 20 | hero lead / intro, FAQ questions, fact values, author / booking-card names |
| 19 | `text-title` | 21 | blog card titles, article intro, text-page lead |
| 20 | `text-h4` | 22 | small card / column titles |
| 21 | `text-title-lg` | 23 | article H3, article blockquote |
| 22 | `text-h3` | 25 | card titles |
| 24 | `text-h3-md` | 28 | band / card titles |
| 26 | `text-stat` | 30 | hero stat numbers |
| 28 | `text-h3-lg` / `text-quote` | 32 | large card titles, article H2 / pull quotes, testimonials |
| 32 | `text-h2-sm` | 38 | compact section H2 (blog lists, newsletter, booking bands) |
| 36 | `text-h2-md` | 42 | blog featured-post title |
| 40 | `text-h2` | 48 | section H2 (`SectionHeading`) |
| 48 | `text-h1-xs` | 56 | article H1 |
| 52 | `text-h1-sm` | 60 | smaller desktop H1 (blog, booking) |
| 64 | `text-h1` | 76 | page H1 |

`text-ui` is the variable `--font-ui`, not a clamp: 15px below 1280px, then
`clamp(16px, 12px + 0.3125vw, 17px)`. The main ladder at 1600px is 18 → 22 → 28 → 38 → 48 →
76 (steps of 1.22–1.36×); body at 18px keeps the design's H1 / body and H2 / body ratios.

**Recipe (pages and components):**

- Replace the class at the breakpoint where the design size applies:
  `lg:text-[16px]` → `lg:text-body`, `md:text-[52px] lg:text-[64px]` → `md:text-[52px] lg:text-h1`.
  Because the tokens equal the design size below 1280, `md:text-[20px] xl:text-h4` and
  `md:text-h4` render the same.
- Mobile-only sizes (`text-[28px]` below `md`) are not changed.
- No `2xl:` steps: `text-[14px] 2xl:text-[15px]` → `text-small` (or `text-ui-sm`).
- Don't give a `Button` a font size: all sizes use `text-ui`. A one-off horizontal padding
  needs its fluid twin: `px-8!` → `px-8! xl:px-fluid-32/36!`.
- Token utilities are emitted **after** arbitrary ones (`text-micro` beats `text-[11px]`
  on the same element without a variant). Override a primitive's size with a breakpoint
  variant (`md:text-small`) or `!`, never an unprefixed arbitrary size.
- Headings the design sets with `line-height: normal` use `leading-[1.1] py-[.2em]` (single
  line identical, a wrapped heading keeps a 1.1 gap); `SectionHeading leading="normal"` does
  this.
- Line length: body copy stays ≤ ~75 characters. `ch` max widths scale with the font
  (`max-w-[52ch]`, the `SectionHeading` intro default); article prose sets its own measure (`components/blog/ArticleBody`), text-page
  prose uses `md:max-w-[52ch]` (see below). Figtree sets ≈ 1.42 characters per `ch` (Poppins
  ≈ 1.29), so a Poppins-era `ch` width holds ≈ 10% more characters in Figtree (58ch ≈ 82). Re-derived so far: text pages
  (`components/text-page`) `md:max-w-[52ch]` (≈ 74 characters, all widths ≥ 768), the /booking
  intro `max-w-[50ch]` (≈ 71), the article body (`components/blog/ArticleBody`) paragraphs and
  lists `md:max-w-[48ch]`, its lead `md:max-w-[43ch]` (same right edge at 19 vs 17px; ≤ 72
  characters, all widths ≥ 768), the /blog featured excerpt `md:max-w-[50ch]` + `text-pretty`.
- Card paddings grow at `xl` with `xl:p-fluid-N` / `xl:px-fluid-N`.

### Site chrome (components/layout)

| Element | < 1024 | 1024–1279 | 1280 → 1600 |
|---|---|---|---|
| Header height | 72px | 93px | 95 → 98px |
| Header logo | 22px | 30px | 30 → 32px (link ≥ 44px high) |
| Nav triggers | — | `text-ui` 15px, gap 32px | 16 → 17px, gap 36 → 40px (`xl:gap-fluid-36/40`) |
| "Book tid" (Button `sm`) | compact 44px, 15px | 119 × 49px | 123 × 51 → 135 × 54px |
| Mobile-menu logo | 22px | — | — |
| Footer logo | 24px | 28px | 28 → 30px |
| `scroll-padding-top` | 88px | 106px | 108 → 113px |

- Nav triggers have an invisible `before:` hit area (≥ 44px high) that leaves the underline
  in place; the underline marks the current section / open menu, not hover.
- **The dropdowns do not scale.** From 1024px the Priser, Find klinik and Om os panels use
  fixed sizes: titles 16px/600, links 15px, secondary text 14px, uppercase micro
  labels 12px, "Se alle →" 15px/600 (`ArrowLink size="menu"`). Frame: white, 20px radius,
  12px inset (`p-3`), `shadow-menu`; footer row `border-t` + `pt-3.5 pb-1.5`. Every panel
  sits 2px under the header (dropdowns: `pt-[34px] xl:pt-fluid-35/36`).
- Mega menu (the owner's design v2, `design-reference/mega-menu-v2.webp`, drawn on the 1180px
  canvas; copy in `content/navigation.ts` → `megaMenu`): four columns (uppercase eyebrow,
  up to 4 treatments — "Rynker" has the two wrinkle pages — "Alle … →"), a hairline, the "For mænd" pill tag + note, and a rose band panel
  (`bg-band`, the design's plum panel; 26.5% of the width, ≥ 272px; eyebrow, heading, text,
  accent button pinned to the bottom)
  flush right. It follows the type scale like the page text: links + "Alle" `text-ui-sm`
  (always smaller than the nav), eyebrows `text-micro` +.2em, heading `text-h3` (Poppins,
  `font-heading`), band text `text-body-sm`, note `text-small`; links on a 2.35em pitch (the line height). Paddings
  40 / 32px, 36px top and bottom, columns 32px apart (×1.2 at 1600, `*-fluid-*`). Width: the
  surface band (as in the design) up to 1280px, centred on the canvas (a full 1536px band at
  1600 left the columns half empty). Panel height: 343px at 1024–1280, 368 at 1440, 393 at 1600.
- Dropdowns: Priser 760px, Find klinik 360px, Om os ≥ 240px (Om Fillox, Ny hos Fillox?, Vores
  behandlere, Ledige stillinger, Kontakt; the mobile menu's "Om os" accordion lists the same).

### Buttons (components/ui/Button.tsx)

All sizes use `text-ui` (15px below 1280). Heights below 1280 → at 1600 (without border):
xs 44.5 → 47.5, sm 48.5 → 53.5, mdTight 50.5 → 55.5, md / xl 54.5 → 59.5, chip 44.5 → 47.5;
lg 52 and compact 44 are fixed. Paddings grow with `xl:px-fluid-* xl:py-fluid-*`.
Every size sets `leading-[1.5]` (Poppins' "normal" line height, which these heights were measured
in; Figtree's is 1.2 and made every padded pill 4–6px shorter and the header 5–6px lower). With it
the header measures 92.5px at 1024–1279 and 94 → 97.5px from 1280 (`scroll-padding-top` clears it
by 13.5–15.5px).

Hover, keyboard focus (`focus-visible`) and press (`active`) share one look per variant, always the
brown accent, never black (owner, 2026-10: "Se alle behandlinger" turned black, it should turn brown
like "Alle artikler om lip filler"): `primary` → `accent-deep`; `outline` / `outlineInk` → accent fill
+ offwhite text; `white` → accent border + text (not filled: the white chips are filters whose selected
state is the accent fill); `textLink` → accent. The home "Se alle behandlinger" is now the accent
`outline` at every width (the design's ink outline on desktop is gone). A page that recolours a pill
at rest keeps the brown hover (hover / focus classes outrank a breakpoint class); never add
`hover:bg-ink`.

### Type and UI rules (best practice; the only changes allowed below 1280)

- Body text ≥ 16px (18 at 1600), line-height 1.5–1.75; headings 1.05–1.2.
- Small text ≥ 14px where possible, never < 12px (uppercase eyebrows 12px with tracking).
  Figtree's x-height is ≈ 9% smaller than Poppins' (0.50 vs 0.548em), so a size kept from the
  design reads smaller than it did: the 13px mobile team titles (`about/TeamMemberCard`,
  `practitioner/PractitionerCard`, `home/Team`, `practitioner/TeamRow`) look like ≈ 12px Poppins.
  They stay 13px for now (site-wide decision; raise all four together to 14px if changed).
- Nav 15–17px; button text ≥ 15px; buttons and chips ≥ 44px high (mobile primary 52px).
- Form inputs 16px on mobile (no iOS zoom on focus).
- Touch targets ≥ 44 × 44px: use `min-h-11` rows, or an invisible `after:` / `before:` hit
  area where the text must not move (`ArrowLink` has one built in: 12px above and below).
- Contrast WCAG AA: 4.5:1 for text (3:1 from 24px, or 18.66px bold). `taupe` and
  `placeholder` were darkened for this.
- Hover states are hover states: an element the design shows highlighted once in a list (the
  Skinbooster bestseller row, an underlined nav item) is a hover / current state, never a
  permanent highlight. Tailwind's `hover:` only applies on devices that can hover.

### Rules for pages and components

- **Never** write `max-w-[1180px]`. Use `<Container>` (content gutter) /
  `<Container gutter="surface">` (rounded bands), or `containerClasses("content" |
  "surface")` from `components/ui` on elements that can't be a Container. Hand-rolled
  gutters (`px-5 md:px-10 lg:px-14`, `px-3 md:px-6`) become `px-gutter` / `px-surface`.
- The header logo, page text and footer align: text sits on the content gutter, rounded
  bands (hero panels, rose bands, footer) on the surface margin.
- Grids **fill** the canvas: `fr` columns / `flex-1`, never fixed-width items floating
  in the middle. Photos keep their proportions as they grow (`aspect-*`, or
  `h-fluid-N`), so they never turn into letterboxes. Hero split panels keep the column
  ratio and grow modestly (`lg:min-h-fluid-720/800`).
  Exception: the home team grid ("Mød dem, der behandler dig", `components/home/Team.tsx`)
  stops at 64rem from 1280px, centred under its centred heading, with squarer 33:34
  portraits: five members are two rows (3 + 2, the short row centred), and filling the panel
  with 4:5 portraits made the section ≈ 1.7 screens tall at 1710px. The full team grids (/om-os,
  /behandlere) fill.
- Centred headings + intros stay centred at their `ch` width; single-line rows (USP band,
  stats) spread across the width (`justify-between` / `justify-evenly`).
- Section paddings use `*-fluid-N` in place of the design number (`lg:py-[84px]` →
  `lg:py-fluid-84`).
- `next/image` `sizes` must describe the widest rendered slot on the 1600px canvas:
  content width there is 1600 − 2 × 80 = **1440px**, a surface band is 1600 − 2 × 32 =
  **1536px** wide. Example: half of a surface band → `"(min-width: 1600px) 768px,
  (min-width: 1024px) 50vw, 100vw"`; a 3-column content grid with 24px gaps →
  `(1440 − 48) / 3 = 464px` → `"(min-width: 1600px) 464px, (min-width: 1024px) 30vw, …"`.
  Source files are limited (the clinic's photos are 782–1548px wide, see "Photos"): don't upscale
  files. A photo whose aspect is wider than its cover slot is drawn at slot height × aspect: ask for
  that width (the "Photos" section lists the components that compute it).
  A photo hidden below a breakpoint (`max-lg:hidden`) ends its `sizes` with `1px`, so phones
  fetch the tiniest variant (an eager / high-priority photo is still fetched and preloaded while
  hidden). Its `vw` values then go in `calc()` (`calc(44vw)`): a bare `44vw` makes next/image drop
  every width below 44 % of 640px from the srcset, and the 1px slot gets the 384px file.
- Breakpoints are Tailwind's defaults: `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

## Verifying against the design

- Design screenshots: `design-reference/screens/<id>.png` (desktop 1182px wide, mobile 392px wide
  — both include a 1px frame border and a spec note on top).
- Design source per screen: `design-reference/sections/<id>.html`. Exact CSS values live
  there; prefer them over eyeballing screenshots.
- The original design renders at `design-reference/Fillox Signature v2.dc.html`
  (serve the folder over HTTP to view).

# Fillox.dk — architecture

Marketing site for Fillox Denmark, built from the Claude Design file
**"Fillox Signature v2" (Bold & Bordeaux, designmanual 2026)**. A sister repo,
`fillox-no`, is created from this one for fillox.no. So everything market-specific
lives in two places:

| What | Where |
|---|---|
| Domain, locale, currency, phone, email, CVR, booking provider, logos | `config/site.ts` |
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
- Poppins via `next/font/google`.
- `next/image` for all photos.
- Static generation for every route (`generateStaticParams` for dynamic routes).
- Deploy target: Netlify (`netlify.toml`).

## Directory layout

```
config/site.ts                 market config (see above)
content/
  types.ts                     shared content types
  navigation.ts                main nav, mega menu, footer + legal links
  clinics.ts                   clinics
  treatments.ts                every treatment (slug, name, category, priceFrom, short, detail?)
  team.ts                      practitioners
  blog.ts                      blog posts
  prices.ts                    price list (Priser page)
  ui.ts                        shared UI strings ("Book tid", "Se priser", "Læs mere" …)
  pages/<page>.ts              page-specific copy (home, about, prices, clinics, contact, blog …)
  redirects.ts                 legacy fillox.dk URLs → new routes
  routes.ts                    every route path; code, canonicals and the sitemap link through it
lib/                           helpers (formatPrice, cn, …); metadata.ts builds every route's
                               metadata + Open Graph (pageMetadata), forms.ts posts to Netlify Forms
scripts/check-market.mjs       `npm run check:market` (runs as prebuild): routes.ts ↔ app/ folders,
                               redirect targets, no-JS contact form target, Netlify form names,
                               booking provider ids, clinic address/hours parse for JSON-LD,
                               no æ/ø/å strings in app/, components/, lib/
scripts/ts-hooks.mjs           lets check-market import the site's .ts modules (no build step)
components/
  layout/                      Header (DesktopNav, MegaMenu, DropdownMenu, MobileMenu), Footer
  booking/                     BookingEmbed (switches on the booking provider), GeckoEmbed, TimmaEmbed
  ui/                          primitives: Button, Eyebrow, SectionHeading, Photo, ScrollRow,
                               ResponsiveText (mobile/desktop copy), JoinedLines, HoneypotField, …
  seo/                         OrganizationJsonLd (root layout); JsonLd, absoluteUrl, breadcrumbList
  <page>/                      page-local components (owned by that page)
app/                           routes (see below)
design-reference/              the source design: screens/*.png, sections/*.html, uploads/
```

## Routes

| Route | Design section (desktop / mobile) |
|---|---|
| `/` | `6a` / `mf` |
| (header mega menu, mobile menu) | `mega-menu-v2.webp` (replaces `6menu`) / `mm1`, `mm2`, `mm3` |
| (header "Priser" dropdown) | no design: dropdown like "Find klinik", built from `content/prices.ts` (nav item kind `"prices"`); a plain link in the mobile menu |
| `/om-os` | `6om` / `mo` |
| `/behandlere/[slug]` | `6alb` / `ma` (Alberte is the example) |
| `/priser` | `6b` / `mp` (mobile unfolded at the owner's request: open cards with the label under the title, no chip current at rest; the mobile menu is unchanged) |
| `/behandlinger` | overview built from existing components (no dedicated design) |
| `/behandlinger/[slug]` | template `6c`, Botox `6bx` / Lip filler `mb` |
| `/klinikker` | `6kl` / `mk` |
| `/kontakt` | `6ko` / `mc` |
| `/blog`, `/blog/[slug]` | `6blog`, `6art` / `mbl`, `mar` |
| `/booking` | no design: intro band + the booking provider's embed (`components/booking/BookingEmbed.tsx`, see "Booking providers") |
| `/handelsbetingelser`, `/privatlivspolitik`, `/ledige-stillinger`, `/content-creator` | simple text pages in the same style |

## Booking providers

`config/site.ts` → `booking` is a discriminated union (`config/types.ts` → `BookingConfig`);
each clinic carries its own ids at the provider (`content/clinics.ts` → `Clinic.booking`,
type `ClinicBookingIds`).

| Provider | Market | Config | Per clinic | /booking |
|---|---|---|---|---|
| `gecko` | fillox.dk | `href`, `geckoHost`, `geckoIcCode` | `geckoCalendarId` (optional) | Gecko's `iframe.js` injects ONE calendar for every clinic (`GeckoEmbed`), capped at 1184px and centred in the white card (min-height 640px) |
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

## Design tokens (from the design's mobile spec + brand kit)

| Token | Value | Use |
|---|---|---|
| `plum` | `#6B3840` | primary: buttons, links, names, dark bands |
| `cream` | `#F7F2EA` | page base |
| `sand` | `#EFE6DC` | surfaces (hero panel, cards) |
| `powder` | `#E8D3CE` | secondary surface, buttons on plum |
| `blush` | `#EFE2DE` | body text on plum |
| `ink` | `#242724` | headings / body text |
| `muted` | `#5E4F4D` | secondary text |
| `line` | `#E3D6CC` | hairlines on light |
| `rule` | `#D9BFB8` | dividers in hero stats |
| `taupe` | `#7A624F` | prices and price notes, the /priser hero eyebrow (design `#B39C89`, darkened to pass WCAG AA: 4.62:1 on sand) |
| `placeholder` | `#746A67` | input placeholders, the only placeholder colour (design `#8A7F7C`, darkened: 4.71:1 on cream) |

- Typography (Poppins): desktop H1 64/1.02 SemiBold, -0.035em; H2 40/1.1 SemiBold, -0.03em;
  mobile H1 36/1.08, H2 28/1.15, body 16/1.7 (articles 17), eyebrow 12 Bold uppercase +2px.
  From 1280px these grow with the type scale ("Wide layout" → "Type scale").
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
  (`max-w-[56ch]`); article and text-page prose uses `md:max-w-[58ch]`.
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
  4 treatments, "Alle … →"), a hairline, the "For mænd" pill tag + note, and a plum panel
  (26.5% of the width, ≥ 272px; eyebrow, heading, text, powder button pinned to the bottom)
  flush right. It follows the type scale like the page text: links + "Alle" `text-ui-sm`
  (always smaller than the nav), eyebrows `text-micro` +.2em, heading `text-h3`, plum text
  `text-body-sm`, note `text-small`; links on a 2.35em pitch (the line height). Paddings
  40 / 32px, 36px top and bottom, columns 32px apart (×1.2 at 1600, `*-fluid-*`). Width: the
  surface band (as in the design) up to 1280px, centred on the canvas (a full 1536px band at
  1600 left the columns half empty). Panel height: 343px at 1024–1280, 368 at 1440, 393 at 1600.
- Dropdowns: Priser 760px, Find klinik 360px, Om os ≥ 240px.

### Buttons (components/ui/Button.tsx)

All sizes use `text-ui` (15px below 1280). Heights below 1280 → at 1600 (without border):
xs 44.5 → 47.5, sm 48.5 → 53.5, mdTight 50.5 → 55.5, md / xl 54.5 → 59.5, chip 44.5 → 47.5;
lg 52 and compact 44 are fixed. Paddings grow with `xl:px-fluid-* xl:py-fluid-*`.

### Type and UI rules (best practice; the only changes allowed below 1280)

- Body text ≥ 16px (18 at 1600), line-height 1.5–1.75; headings 1.05–1.2.
- Small text ≥ 14px where possible, never < 12px (uppercase eyebrows 12px with tracking).
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
  bands (hero panels, plum bands, footer) on the surface margin.
- Grids **fill** the canvas: `fr` columns / `flex-1`, never fixed-width items floating
  in the middle. Photos keep their proportions as they grow (`aspect-*`, or
  `h-fluid-N`), so they never turn into letterboxes. Hero split panels keep the column
  ratio and grow modestly (`lg:min-h-fluid-720/800`).
- Centred headings + intros stay centred at their `ch` width; single-line rows (USP band,
  stats) spread across the width (`justify-between` / `justify-evenly`).
- Section paddings use `*-fluid-N` in place of the design number (`lg:py-[84px]` →
  `lg:py-fluid-84`).
- `next/image` `sizes` must describe the widest rendered slot on the 1600px canvas:
  content width there is 1600 − 2 × 80 = **1440px**, a surface band is 1600 − 2 × 32 =
  **1536px** wide. Example: half of a surface band → `"(min-width: 1600px) 768px,
  (min-width: 1024px) 50vw, 100vw"`; a 3-column content grid with 24px gaps →
  `(1440 − 48) / 3 = 464px` → `"(min-width: 1600px) 464px, (min-width: 1024px) 30vw, …"`.
  Source files are limited (hero JPGs are 1200 × 1500): don't upscale files.
- Breakpoints are Tailwind's defaults: `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

## Verifying against the design

- Design screenshots: `design-reference/screens/<id>.png` (desktop 1182px wide, mobile 392px wide
  — both include a 1px frame border and a spec note on top).
- Design source per screen: `design-reference/sections/<id>.html`. Exact CSS values live
  there; prefer them over eyeballing screenshots.
- The original design renders at `design-reference/Fillox Signature v2.dc.html`
  (serve the folder over HTTP to view).

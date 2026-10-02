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
- Fonts via `next/font/google` (`app/layout.tsx`): Figtree (variable) for running text and UI,
  Poppins 500 for headings only (see "Design tokens" → "Typography").
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
  reviews.ts                   verified Trustpilot reviews (verbatim) + where each is shown (see "Reviews")
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
                               no æ/ø/å strings in app/, components/, lib/, review excerpts
                               verbatim + review sets consistent (content/reviews.ts)
scripts/ts-hooks.mjs           lets check-market import the site's .ts modules (no build step)
components/
  layout/                      Header (DesktopNav, MegaMenu, DropdownMenu, MobileMenu), Footer
  booking/                     BookingEmbed (switches on the booking provider), GeckoEmbed, TimmaEmbed
  ui/                          primitives: Button, Eyebrow, SectionHeading, Photo, ScrollRow,
                               ResponsiveText (mobile/desktop copy), JoinedLines, HoneypotField,
                               ReviewRotator (client), AllReviewsLink, TrustpilotRating, …
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
| `/om-os` | `6om` / `mo`. "Støvet rosa & beige": the closing "Fagligt ansvarlig" band (the design's powder, desktop only) is `sand` like the hero panel, because the secondary beige read as one block with the footer right under it (the page already has a rose band higher up). The practitioner pages solve the same case with the rose `band`; open for the owner to pick one (README → "Før lancering") |
| `/behandlere/[slug]` | `6alb` / `ma` (Alberte is the example). "Støvet rosa & beige": the name (H1) takes `text-emphasis`; the closing "Book tid hos …" band (the design's powder) is the rose `band`, because the secondary beige read as one block with the footer right under it |
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
- **Botox pages** — `treatmentsWithoutReviews` (Botox, Lip flip, Gummy smile, Hyperhidrose,
  Traptox, Botox for mænd) show no reviews section at all: Botox is a prescription medicine,
  and even general reviews read as Botox testimonials on those pages. Open legal question for
  the owner (README checklist); `check:market` validates the list.
- **Selection** — `reviewsFor({ practitioner | treatment | set, min = 3, max = 6, seed })`: the
  own reviews (≤ max), filled up to `min` with `general` ones (never twice; `seed` = page slug
  varies which). Treatment pages pass `min: 5`; practitioner profiles keep 3, so a profile
  with few reviews of its own is not mostly general ones. `allSpecific` tells the section whether its heading may name the
  practitioner / treatment; otherwise it says "Det siger vores kunder", so a general review is
  never presented as being about that person or treatment.
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
  (`components/practitioner/ReviewSection`), treatment pages after the results except the
  Botox pages (`components/treatment/ReviewsSection`, copy in `content/pages/treatments.ts` →
  `reviews`).
  Each has "Se alle anmeldelser på Trustpilot →" (`AllReviewsLink`). No review structured data:
  reviews a business shows about itself are not eligible for review rich results.

## Design tokens ("Støvet rosa & beige", 2026-10)

The design was drawn in plum (`#6B3840`) with Poppins everywhere. In October 2026 the owner chose,
from the /lab experiment, **Figtree** as the site font with **Poppins only for headings** ("not as
thick, not as black") and the palette **"Støvet rosa & beige"** (lab palette `stoevet-rosa`, with a
lighter footer beige than the lab's Senses `#B19784`). Layout, components and copy are unchanged.
Every value lives in `app/globals.css` (`@theme`); components use the semantic names below and
never a hex value. All text pairs are WCAG AA (ratios in the table).

**Light surfaces and text**

| Token | Value | Use |
|---|---|---|
| `cream` | `#F7F2EA` | page base (krem) |
| `sand` | `#EFE6DC` | surfaces (hero panel, cards, icon circles) |
| `secondary` | `#E4D6CB` | secondary surface (team panel, hovered arrow circles); was powder `#E8D3CE` |
| `line` | `#E2D5C5` | hairlines on light |
| `rule` | `#BAA586` | bronze dividers (hero stats). Decorative only (2.1:1), never text |
| `rule-strong` | `#8A7455` | deep bronze: active nav underline, text-link underlines (`textLink`): 4.0:1 on cream |
| `ink` | `#242724` | body text |
| `heading` | `#3B2A28` | headings (espresso): 12.2:1 on cream, 11.0 on sand |
| `muted` | `#5E4F4D` | secondary text |
| `taupe` | `#7A624F` | prices and price notes, the /priser hero eyebrow (design `#B39C89`, darkened to pass WCAG AA: 4.62:1 on sand) |
| `placeholder` | `#746A67` | input placeholders, the only placeholder colour (design `#8A7F7C`, darkened: 4.71:1 on cream) |
| `emphasis` | `#94544A` | the H1's accent words (large text: 4.7:1 on sand, 5.2 on cream) |
| `selection` | `#E2C2B9` | text selection on light (ink on it 9.1:1) |

**Accent** (the Fillox Academy plum-brown; was plum): buttons, links, eyebrows, numbers, checkmarks,
the focus ring, on light surfaces AND on the rose bands and the footer.

| Token | Value | Use |
|---|---|---|
| `accent` | `#543232` | 10.0:1 on cream, 9.1 on sand, 5.0 on the band, 7.1 on the footer |
| `accent-deep` | `#422424` | hover of accent buttons / links |
| `on-accent` | `#F7F2EA` | text on accent (10.0:1; 12.5 on accent-deep) |

**Band** (dusty rose; every surface that was a plum band: USP band, bestseller list, review panels,
the mega menu's panel, "Om behandlingen" / "Klar til at booke?" bands, price boxes, clinics USP strip …)

| Token | Value | Use |
|---|---|---|
| `band` | `#D9A192` | the surface |
| `on-band` | `#33211D` | headings, names, the quote, links: 6.9:1 |
| `band-body` | `#3A2622` | running text: 6.4:1 |
| `band-accent` | `#4F2A27` | eyebrows, prices, stars, hours, link hover: 5.6:1 |
| `band-fine` | `#3F2824` | fine print: 6.1:1 |
| `band-line` | `rgb(51 33 29 / .2)` | dividers (decorative) |
| `band-highlight` | `#FBF8F4` | hovered / focused bestseller row, text selection on bands |
| `band-card` / `band-card-hover` | white 30% / 45% | translucent cards on the band |

**Footer** (a light warm beige; tune it with `--color-footer` alone, its text stays ≥ 7:1)

| Token | Value | Use |
|---|---|---|
| `footer` | `#DCCBBB` | the footer block (chosen over `#D4C2B1` and `#E4D6CA`: clearly lighter than Senses `#B19784`, still a distinct beige next to cream / sand) |
| `on-footer` | `#33211D` | clinic names, contact values, links: 9.7:1 |
| `footer-body` | `#3A2622` | running text, legal: 9.0:1 |
| `footer-accent` | `#4F2A27` | uppercase labels, hours, link hover: 7.9:1 |
| `footer-line` | `rgb(51 33 29 / .18)` | dividers (decorative) |
| `footer-card` / `footer-card-hover` | white 35% / 50% | phone / e-mail cards |

The footer shows the black logo (`site.brand.logoDark`, as the header) and the `primary` button.

**Removed names.** The production names `plum`, `plum-deep`, `powder` and `blush`, the `light` /
`lightInk` button variants, `tone="light"` / `"powder"` / `"plum"` on the primitives,
`surface="plum" | "plum-lg"` on the rotator and `data-surface="plum" | "plum-lg"` no longer exist:
every use was converted (recipe below), so a leftover fails the type check or renders no colour.

**Surfaces and focus.** The focus ring is the accent on every surface (≥ 5:1 everywhere), so no
surface needs a ring of its own. `data-surface` now only marks where text selection switches to the
band's highlight: `data-surface="band"` on a band, `"band-lg"` on an element that is a band from
1024px only, `"band-md"` on a sand card that turns into a band from 768px (the band highlight is
only 1.17:1 on sand, so the card keeps the light rose selection), `"footer"` on the footer block.

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
| `shadow-[0_10px_30px_rgba(107,56,64,.10)]` | `shadow-photo` |

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
  4 treatments, "Alle … →"), a hairline, the "For mænd" pill tag + note, and a rose band panel
  (`bg-band`, the design's plum panel; 26.5% of the width, ≥ 272px; eyebrow, heading, text,
  accent button pinned to the bottom)
  flush right. It follows the type scale like the page text: links + "Alle" `text-ui-sm`
  (always smaller than the nav), eyebrows `text-micro` +.2em, heading `text-h3` (Poppins,
  `font-heading`), band text `text-body-sm`, note `text-small`; links on a 2.35em pitch (the line height). Paddings
  40 / 32px, 36px top and bottom, columns 32px apart (×1.2 at 1600, `*-fluid-*`). Width: the
  surface band (as in the design) up to 1280px, centred on the canvas (a full 1536px band at
  1600 left the columns half empty). Panel height: 343px at 1024–1280, 368 at 1440, 393 at 1600.
- Dropdowns: Priser 760px, Find klinik 360px, Om os ≥ 240px.

### Buttons (components/ui/Button.tsx)

All sizes use `text-ui` (15px below 1280). Heights below 1280 → at 1600 (without border):
xs 44.5 → 47.5, sm 48.5 → 53.5, mdTight 50.5 → 55.5, md / xl 54.5 → 59.5, chip 44.5 → 47.5;
lg 52 and compact 44 are fixed. Paddings grow with `xl:px-fluid-* xl:py-fluid-*`.
Every size sets `leading-[1.5]` (Poppins' "normal" line height, which these heights were measured
in; Figtree's is 1.2 and made every padded pill 4–6px shorter and the header 5–6px lower). With it
the header measures 92.5px at 1024–1279 and 94 → 97.5px from 1280 (`scroll-padding-top` clears it
by 13.5–15.5px).

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

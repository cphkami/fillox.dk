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
and `config/`. Rebranding to NO = swap `config/site.ts` + `content/**` (+ images).

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
lib/                           helpers (formatPrice, cn, …)
components/
  layout/                      Header, MegaMenu, MobileMenu, Footer, ContactBand
  ui/                          primitives: Button, Eyebrow, SectionHeading, Stars, Photo, …
  <page>/                      page-local components (owned by that page)
app/                           routes (see below)
design-reference/              the source design: screens/*.png, sections/*.html, uploads/
```

## Routes

| Route | Design section (desktop / mobile) |
|---|---|
| `/` | `6a` / `mf` |
| (header mega menu, mobile menu) | `6menu` / `mm1`, `mm2`, `mm3` |
| (header "Priser" dropdown) | no design: dropdown like "Find klinik", built from `content/prices.ts` (nav item kind `"prices"`); a plain link in the mobile menu |
| `/om-os` | `6om` / `mo` |
| `/behandlere/[slug]` | `6alb` / `ma` (Alberte is the example) |
| `/priser` | `6b` / `mp` |
| `/behandlinger` | overview built from existing components (no dedicated design) |
| `/behandlinger/[slug]` | template `6c`, Botox `6bx` / Lip filler `mb` |
| `/klinikker` | `6kl` / `mk` |
| `/kontakt` | `6ko` / `mc` |
| `/blog`, `/blog/[slug]` | `6blog`, `6art` / `mbl`, `mar` |
| `/booking` | Gecko Booking embed (`config/site.ts` → booking) |
| `/handelsbetingelser`, `/privatlivspolitik`, `/ledige-stillinger`, `/content-creator` | simple text pages in the same style |

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

- Typography (Poppins): desktop H1 64/1.02 SemiBold, -0.035em; H2 40/1.1 SemiBold, -0.03em;
  mobile H1 36/1.08, H2 28/1.15, body 16/1.7 (articles 17), eyebrow 12 Bold uppercase +2px.
- Shape: pill buttons (radius 100px; 52px high on mobile, secondary taps ≥ 44px),
  cards 18–24px radius, 12px margin on surfaces, 20px side margin on text (mobile).
- Behaviour: sticky header, fullscreen mobile menu with accordions, horizontal scroll
  for practitioners/results/chips on mobile, fixed book bar on mobile treatment pages.
- Desktop design canvas is 1180px wide; mobile is 390px. The 1180px canvas is the
  *reference* for proportions; the **site** canvas is fluid up to `--canvas-max` (see
  "Wide layout" below).

## Wide layout

The design was drawn on a 1180px canvas, which looks like a tablet view on a 1710px
MacBook screen. The site therefore uses a fluid canvas. Every value lives in
`app/globals.css`; to change the whole site's width, edit **one** value, `--canvas-max`
(1440 / 1600 / 1920px).

| Viewport | Behaviour |
|---|---|
| < 1024px (mobile 390, tablet 768) | exactly the design, nothing changes |
| 1024–1280px | as the design (the canvas is the viewport; gutters 56px) |
| ≥ 1280px (`xl`) | canvas grows with the viewport up to `--canvas-max`; gutters, display type and section spacing grow gently |
| > `--canvas-max` | canvas is centred; nothing grows further |

Tokens and utilities:

| Token (globals.css) | Value | Utility |
|---|---|---|
| `--canvas-max` | `1600px` | `max-w-canvas` (also `w-canvas`) |
| `--gutter-content` | 20 · 40 (md) · 56 (lg) · 64 (xl) · 80px (2xl) | `px-gutter`, `-mx-gutter`, `scroll-px-gutter`, `pl-gutter` … |
| `--gutter-surface` | 12 · 24 (md) · 32px (2xl) | `px-surface`, `p-surface`, `inset-x-surface` … |
| `--text-h1` | `clamp(64px, 16px + 3.75vw, 76px)` | `text-h1` (page H1, 64 → 76) |
| `--text-h1-sm` | `clamp(52px, 20px + 2.5vw, 60px)` | `text-h1-sm` (52px desktop H1s: blog, booking) |
| `--text-h2` | `clamp(40px, 8px + 2.5vw, 48px)` | `text-h2` (section H2, 40 → 48; `SectionHeading` uses it) |
| `--text-h3` | `clamp(22px, 14px + 0.625vw, 24px)` | `text-h3` (card titles, 22 → 24) |
| `--text-lead` | `clamp(18px, 10px + 0.625vw, 20px)` | `text-lead` (hero lead / intro, 18 → 20) |
| `--text-quote` | `clamp(28px, 12px + 1.25vw, 32px)` | `text-quote` (pull quote / testimonial, 28 → 32) |
| `--text-h1-xs` | `clamp(48px, 16px + 2.5vw, 56px)` | `text-h1-xs` (blog article H1, 48 → 56) |
| `--text-h2-md` | `clamp(36px, 12px + 1.875vw, 42px)` | `text-h2-md` (blog featured-post title, 36 → 42) |
| `--text-h2-sm` | `clamp(32px, 8px + 1.875vw, 38px)` | `text-h2-sm` (compact section H2: blog lists, newsletter, booking bands, 32 → 38) |
| `--text-h3-lg` | `clamp(28px, 12px + 1.25vw, 32px)` | `text-h3-lg` (large card title: clinic cards, 28 → 32) |
| `--text-h3-md` | `clamp(24px, 8px + 1.25vw, 28px)` | `text-h3-md` (band / card title, 24 → 28) |
| `--text-h4` | `clamp(20px, 12px + 0.625vw, 22px)` | `text-h4` (small column title, 20 → 22) |
| `--text-small` | `clamp(14px, 10px + 0.3125vw, 15px)` | `text-small` (small print beside large type, 14 → 15) |
| — | N px ≤ 1280 → N × 1.2 at 1600 | `py-fluid-N`, `pt-`, `pb-`, `mt-`, `mb-`, `gap-`, `h-`, `min-h-fluid-N` |
| — | N px ≤ 1280 → M px at 1600 | same utilities with a modifier: `min-h-fluid-720/800` |

The type tokens are font-size only and equal the design size up to 1280px, so they
replace the design number at the same breakpoint (`md:text-[52px] lg:text-h1`). Body
copy stays 16px; keep long text readable with a `ch` max width (`max-w-[56ch]`).
Breakpoints are Tailwind's defaults: `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

Rules for pages and components:

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

## Verifying against the design

- Design screenshots: `design-reference/screens/<id>.png` (desktop 1182px wide, mobile 392px wide
  — both include a 1px frame border and a spec note on top).
- Design source per screen: `design-reference/sections/<id>.html`. Exact CSS values live
  there; prefer them over eyeballing screenshots.
- The original design renders at `design-reference/Fillox Signature v2.dc.html`
  (serve the folder over HTTP to view).

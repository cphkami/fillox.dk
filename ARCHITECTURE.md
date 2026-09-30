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
- Desktop design canvas is 1180px wide; mobile is 390px.

## Verifying against the design

- Design screenshots: `design-reference/screens/<id>.png` (desktop 1182px wide, mobile 392px wide
  — both include a 1px frame border and a spec note on top).
- Design source per screen: `design-reference/sections/<id>.html`. Exact CSS values live
  there; prefer them over eyeballing screenshots.
- The original design renders at `design-reference/Fillox Signature v2.dc.html`
  (serve the folder over HTTP to view).

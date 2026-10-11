/*
 * Dev-only colour tuner: the token list, presets and the early init script.
 *
 * This is a development tool, not site copy: its Danish labels live here (and in ColorTuner.tsx)
 * on purpose, not in content/. scripts/check-market.mjs skips components/dev/ for that reason.
 * Nothing in this folder ships: app/layout.tsx only imports it when NODE_ENV is "development".
 *
 * Every id below is a colour token in app/globals.css (`--color-<id>`), plus Tailwind's own
 * `white` (cards, menus, fields). A token Tailwind did not emit (no utility uses it, e.g.
 * `band-card`) has no value at runtime and is left out of the panel. Left out on purpose:
 * `trustpilot` / `trustpilot-empty` (Trustpilot's brand colours, not ours to tune).
 */

/** localStorage: `{ v: 1, overrides: { band: "#e3b3a6", … } }` (only tokens that differ). */
export const STORAGE_KEY = "fillox-color-tuner";
/** localStorage: "1" while the panel is open (survives reloads). */
export const OPEN_KEY = "fillox-color-tuner-open";
/** sessionStorage: "1" / "0" from `?farver` / `?farver=0` (this tab only). */
export const ENABLED_KEY = "fillox-color-tuner-enabled";
/** The <style> in <head> that holds the overrides as `html:root { --color-…: … }`. */
export const STYLE_ID = "fillox-color-tuner-overrides";
/** Set by the init script: "on" or "off" (see initScript). */
export const WINDOW_FLAG = "__filloxColorTuner";

export type TokenId =
  | "cream"
  | "sand"
  | "white"
  | "secondary"
  | "line"
  | "field"
  | "rule"
  | "rule-strong"
  | "selection"
  | "heading"
  | "ink"
  | "muted"
  | "taupe"
  | "placeholder"
  | "emphasis"
  | "accent"
  | "accent-deep"
  | "on-accent"
  | "band"
  | "on-band"
  | "band-body"
  | "band-accent"
  | "band-fine"
  | "band-line"
  | "band-highlight"
  | "band-card"
  | "band-card-hover"
  | "footer"
  | "on-footer"
  | "footer-body"
  | "footer-accent"
  | "footer-line"
  | "footer-card"
  | "footer-card-hover";

/** A background: a token, or a translucent token laid over a token. */
export type Backdrop = TokenId | { over: TokenId; base: TokenId };

/**
 * A text (or graphic) colour on a background. `min` is the WCAG AA ratio: 4.5 for normal text,
 * 3 for large text and for graphics such as underlines. `alpha` is the opacity the site gives the
 * text (`text-cream/75` → 0.75); the ratio is taken with the text laid over the background.
 */
export type ContrastPair = { fg: TokenId; bg: Backdrop; label: string; min: 4.5 | 3; what: string; alpha?: number };

/** How the row's swatch previews the token (always with the live CSS variables). */
export type Preview =
  | { kind: "surface"; text: TokenId }
  | { kind: "text"; on: TokenId }
  | { kind: "line"; on: TokenId }
  | { kind: "overlay"; on: TokenId; text: TokenId };

export type TokenDef = {
  id: TokenId;
  name: string;
  hint: string;
  /** Translucent token: the value keeps an alpha channel (#rrggbbaa) and gets an opacity slider. */
  alpha?: boolean;
  preview: Preview;
  pairs: ContrastPair[];
};

export type TokenGroup = { id: string; title: string; tokens: TokenDef[] };

const text = (fg: TokenId, bg: Backdrop, label: string, what: string, min: 4.5 | 3 = 4.5, alpha?: number): ContrastPair => ({
  fg,
  bg,
  label,
  min,
  what,
  ...(alpha === undefined ? {} : { alpha }),
});

/**
 * The For mænd page's dark surface is the `heading` colour used as a fill (components/men/surface.ts:
 * hero, closing booking band, the teaser on /behandlinger), with Sandbeige (`rule`) and offwhite
 * ("krem") text on it.
 */
const menSandbeige = text("rule", "heading", "For mænd: sandbeige", "Sandbeige-tekst på den mørke For mænd-flade");
const menCream = text("cream", "heading", "For mænd: krem 75 %", "Krem-tekst (75 %) på den mørke For mænd-flade", 4.5, 0.75);

export const groups: TokenGroup[] = [
  {
    id: "flader",
    title: "Side & flader",
    tokens: [
      {
        id: "cream",
        name: "Krem (sidens baggrund)",
        hint: "Sidens bund, header; også tekst og knapper på den mørke For mænd-flade",
        preview: { kind: "surface", text: "heading" },
        pairs: [
          text("heading", "cream", "overskrift", "Overskrifter på krem"),
          text("muted", "cream", "dæmpet", "Dæmpet tekst på krem"),
          text("taupe", "cream", "pris", "Pris-taupe på krem"),
          text("placeholder", "cream", "pladsholder", "Pladsholder på krem"),
          text("accent", "cream", "accent", "Accent (links, knapper) på krem"),
          menCream,
        ],
      },
      {
        id: "sand",
        name: "Sand (flader)",
        hint: "Hero-panel, kort, ikon-cirkler",
        preview: { kind: "surface", text: "heading" },
        pairs: [
          text("heading", "sand", "overskrift", "Overskrifter på sand"),
          text("muted", "sand", "dæmpet", "Dæmpet tekst på sand"),
          text("taupe", "sand", "pris", "Pris-taupe på sand"),
          text("accent", "sand", "accent", "Accent på sand"),
        ],
      },
      {
        id: "white",
        name: "Hvid (kort, menuer, felter)",
        hint: "Hvide kort, dropdown- og mega-menu, formularfelter, mobilmenu (og stjernerne i Trustpilot-felterne)",
        preview: { kind: "surface", text: "heading" },
        pairs: [
          text("heading", "white", "overskrift", "Overskrifter på hvid"),
          text("muted", "white", "dæmpet", "Dæmpet tekst på hvid"),
          text("taupe", "white", "pris", "Pris-taupe på hvid"),
          text("placeholder", "white", "pladsholder", "Pladsholder på hvidt felt"),
          text("accent", "white", "accent", "Accent på hvid"),
        ],
      },
      {
        id: "secondary",
        name: "Sekundær flade",
        hint: "Team-panel, FAQ-panel, pile-cirkler ved hover",
        preview: { kind: "surface", text: "heading" },
        pairs: [
          text("heading", "secondary", "overskrift", "Overskrifter på sekundær flade"),
          text("ink", "secondary", "tekst", "Brødtekst på sekundær flade"),
          text("muted", "secondary", "dæmpet", "Dæmpet tekst på sekundær flade (FAQ-svar)"),
          text("accent", "secondary", "accent", "Accent på sekundær flade"),
        ],
      },
      {
        id: "line",
        name: "Linjer (hårstreger)",
        hint: "Tynde skillelinjer og kanter på lyse flader (kun pynt); kanten om hvide kort på krem",
        preview: { kind: "line", on: "cream" },
        pairs: [],
      },
      {
        id: "field",
        name: "Feltkanter",
        hint: "Kanten om formularfelterne (kontakt, Få besked); skal kunne ses: 3:1",
        preview: { kind: "line", on: "white" },
        pairs: [
          text("field", "white", "på hvid", "Feltkant på hvidt felt (grafik: 3:1)", 3),
          text("field", "cream", "på krem", "Feltkant på krem (grafik: 3:1)", 3),
          text("field", "sand", "på sand", "Feltkant på sand (grafik: 3:1)", 3),
        ],
      },
      {
        id: "rule",
        name: "Sandbeige-streger",
        hint: "Skillelinjer på lyse flader (pynt); tekst på den mørke For mænd-flade (H1-linje 2, eyebrows, tal)",
        preview: { kind: "line", on: "sand" },
        pairs: [text("rule", "heading", "tekst på For mænd", "Sandbeige-tekst på den mørke For mænd-flade")],
      },
      {
        id: "rule-strong",
        name: "Plum-streg",
        hint: "Aktiv menu-streg, understregning af tekst-links",
        preview: { kind: "line", on: "cream" },
        pairs: [text("rule-strong", "cream", "på krem", "Plum-streg på krem (grafik: 3:1)", 3)],
      },
      {
        id: "selection",
        name: "Tekstmarkering",
        hint: "Baggrund når man markerer tekst på lyse flader",
        preview: { kind: "surface", text: "ink" },
        pairs: [text("ink", "selection", "tekst", "Markeret tekst")],
      },
    ],
  },
  {
    id: "tekst",
    title: "Tekst",
    tokens: [
      {
        id: "heading",
        name: "Overskrifter",
        hint: "H1–H3, korttitler (espresso). Også fladen på For mænd-siden (hero, booking-bånd, teaser på /behandlinger)",
        preview: { kind: "text", on: "cream" },
        pairs: [
          text("heading", "cream", "på krem", "Overskrifter på krem"),
          text("heading", "sand", "på sand", "Overskrifter på sand"),
          menSandbeige,
          menCream,
        ],
      },
      {
        id: "ink",
        name: "Brødtekst (ink)",
        hint: "Al almindelig tekst",
        preview: { kind: "text", on: "cream" },
        pairs: [
          text("ink", "cream", "på krem", "Brødtekst på krem"),
          text("ink", "sand", "på sand", "Brødtekst på sand"),
        ],
      },
      {
        id: "muted",
        name: "Dæmpet tekst",
        hint: "Sekundær tekst, meta, adresser",
        preview: { kind: "text", on: "cream" },
        pairs: [
          text("muted", "cream", "på krem", "Dæmpet tekst på krem"),
          text("muted", "sand", "på sand", "Dæmpet tekst på sand"),
        ],
      },
      {
        id: "taupe",
        name: "Pris-taupe",
        hint: "Priser og prisnoter, eyebrow i /priser-hero",
        preview: { kind: "text", on: "sand" },
        pairs: [
          text("taupe", "sand", "på sand", "Pris-taupe på sand"),
          text("taupe", "cream", "på krem", "Pris-taupe på krem"),
        ],
      },
      {
        id: "placeholder",
        name: "Pladsholder i felter",
        hint: "Grå hjælpetekst i tomme formularfelter",
        preview: { kind: "text", on: "cream" },
        pairs: [
          text("placeholder", "cream", "på krem", "Pladsholder på krem"),
          text("placeholder", "white", "på hvid", "Pladsholder på hvidt felt"),
        ],
      },
      {
        id: "emphasis",
        name: "H1-fremhævning",
        hint: "Accentordene i de store overskrifter (kun stor tekst)",
        preview: { kind: "text", on: "sand" },
        pairs: [
          text("emphasis", "sand", "på sand", "H1-fremhævning på sand (stor tekst: 3:1)", 3),
          text("emphasis", "cream", "på krem", "H1-fremhævning på krem (stor tekst: 3:1)", 3),
        ],
      },
    ],
  },
  {
    id: "knapper",
    title: "Knapper & links",
    tokens: [
      {
        id: "accent",
        name: "Accent",
        hint: "Knapper, links, eyebrows, tal, fokusring – også på bånd og footer",
        preview: { kind: "surface", text: "on-accent" },
        pairs: [
          text("accent", "cream", "på krem", "Accent (links, knapper) på krem"),
          text("accent", "band", "på bånd", "Accent (knapper, links) på rosa bånd"),
          text("accent", "footer", "i footer", "Accent (Tilmeld-knap, links) i footer"),
        ],
      },
      {
        id: "accent-deep",
        name: "Accent hover",
        hint: "Knapper og links når musen er over",
        preview: { kind: "surface", text: "on-accent" },
        pairs: [
          text("on-accent", "accent-deep", "knaptekst", "Knaptekst på accent hover"),
          text("accent-deep", "cream", "på krem", "Accent hover på krem"),
        ],
      },
      {
        id: "on-accent",
        name: "Tekst på knap",
        hint: "Teksten på de mørke knapper",
        preview: { kind: "text", on: "accent" },
        pairs: [
          text("on-accent", "accent", "på accent", "Knaptekst på accent"),
          text("on-accent", "accent-deep", "på hover", "Knaptekst på accent hover"),
        ],
      },
    ],
  },
  {
    id: "baand",
    title: "Rosa bånd",
    tokens: [
      {
        id: "band",
        name: "Rosa bånd",
        hint: "USP-bånd, bestseller-liste, anmeldelser, prisbokse, mega-menuens panel, CTA-bånd",
        preview: { kind: "surface", text: "on-band" },
        pairs: [
          text("on-band", "band", "tekst", "Tekst på rosa bånd"),
          text("band-body", "band", "brødtekst", "Brødtekst på rosa bånd"),
          text("band-fine", "band", "småtekst", "Småtekst på rosa bånd"),
          text("band-accent", "band", "accent", "Bånd-accent på rosa bånd (eyebrows, priser)"),
          text("accent", "band", "knap", "Accent (knapper, links) på rosa bånd"),
        ],
      },
      {
        id: "on-band",
        name: "Tekst på bånd",
        hint: "Overskrifter, navne, citatet, links",
        preview: { kind: "text", on: "band" },
        pairs: [text("on-band", "band", "på bånd", "Tekst på rosa bånd")],
      },
      {
        id: "band-body",
        name: "Brødtekst på bånd",
        hint: "Løbende tekst på båndene",
        preview: { kind: "text", on: "band" },
        pairs: [text("band-body", "band", "på bånd", "Brødtekst på rosa bånd")],
      },
      {
        id: "band-accent",
        name: "Accent på bånd",
        hint: "Eyebrows, priser, stjerner, åbningstider, link-hover",
        preview: { kind: "text", on: "band" },
        pairs: [text("band-accent", "band", "på bånd", "Bånd-accent på rosa bånd (eyebrows, priser)")],
      },
      {
        id: "band-fine",
        name: "Småtekst på bånd",
        hint: "Fine print på båndene",
        preview: { kind: "text", on: "band" },
        pairs: [text("band-fine", "band", "på bånd", "Småtekst på rosa bånd")],
      },
      {
        id: "band-line",
        name: "Skillelinjer på bånd",
        hint: "Gennemsigtige linjer på båndet (kun pynt)",
        alpha: true,
        preview: { kind: "line", on: "band" },
        pairs: [],
      },
      {
        id: "band-highlight",
        name: "Fremhævet række på bånd",
        hint: "Bestseller-række ved hover / fokus, tekstmarkering på bånd",
        preview: { kind: "surface", text: "on-band" },
        pairs: [text("on-band", "band-highlight", "tekst", "Tekst på fremhævet række")],
      },
      {
        id: "band-card",
        name: "Kort på bånd",
        hint: "Gennemsigtige kort oven på båndet",
        alpha: true,
        preview: { kind: "overlay", on: "band", text: "on-band" },
        pairs: [text("on-band", { over: "band-card", base: "band" }, "tekst", "Tekst på kort på bånd")],
      },
      {
        id: "band-card-hover",
        name: "Kort på bånd, hover",
        hint: "Samme kort når musen er over",
        alpha: true,
        preview: { kind: "overlay", on: "band", text: "on-band" },
        pairs: [text("on-band", { over: "band-card-hover", base: "band" }, "tekst", "Tekst på kort (hover)")],
      },
    ],
  },
  {
    id: "footer",
    title: "Footer",
    tokens: [
      {
        id: "footer",
        name: "Footer",
        hint: "Hele footer-blokken (nyhedsbrev, klinikker, kontakt, Trustpilot)",
        preview: { kind: "surface", text: "on-footer" },
        pairs: [
          text("on-footer", "footer", "tekst", "Tekst i footer"),
          text("footer-body", "footer", "brødtekst", "Brødtekst i footer"),
          text("footer-accent", "footer", "etiketter", "Footer-accent i footer (etiketter, åbningstider)"),
          text("accent", "footer", "knap", "Accent (Tilmeld-knap, links) i footer"),
        ],
      },
      {
        id: "on-footer",
        name: "Tekst i footer",
        hint: "Kliniknavne, kontaktoplysninger, links",
        preview: { kind: "text", on: "footer" },
        pairs: [text("on-footer", "footer", "på footer", "Tekst i footer")],
      },
      {
        id: "footer-body",
        name: "Brødtekst i footer",
        hint: "Løbende tekst, juridisk tekst",
        preview: { kind: "text", on: "footer" },
        pairs: [text("footer-body", "footer", "på footer", "Brødtekst i footer")],
      },
      {
        id: "footer-accent",
        name: "Accent i footer",
        hint: "Små overskrifter med versaler, åbningstider, link-hover",
        preview: { kind: "text", on: "footer" },
        pairs: [text("footer-accent", "footer", "på footer", "Footer-accent i footer (etiketter, åbningstider)")],
      },
      {
        id: "footer-line",
        name: "Skillelinjer i footer",
        hint: "Gennemsigtige linjer (kun pynt)",
        alpha: true,
        preview: { kind: "line", on: "footer" },
        pairs: [],
      },
      {
        id: "footer-card",
        name: "Kort i footer",
        hint: "Telefon-, e-mail- og booking-kort, Trustpilot-pillen",
        alpha: true,
        preview: { kind: "overlay", on: "footer", text: "on-footer" },
        pairs: [text("on-footer", { over: "footer-card", base: "footer" }, "tekst", "Tekst på kort i footer")],
      },
      {
        id: "footer-card-hover",
        name: "Kort i footer, hover",
        hint: "Samme kort når musen er over",
        alpha: true,
        preview: { kind: "overlay", on: "footer", text: "on-footer" },
        pairs: [
          text("on-footer", { over: "footer-card-hover", base: "footer" }, "tekst", "Tekst på kort i footer (hover)"),
        ],
      },
    ],
  },
];

export const tokens: TokenDef[] = groups.flatMap((group) => group.tokens);
export const tokenIds = new Set<string>(tokens.map((token) => token.id));

/**
 * One-click suggestions. A suggestion only sets its own tokens and keeps the owner's other changes
 * (it asks before it replaces a value the owner set on one of its tokens); every text pair stays AA
 * (Varm krem: the page before 2026-10-10, heading 12.2:1, muted 7.0:1; Lys footer: Sandbeige 75 %
 * #D5CEBB, tekst 9.7:1, accent 5.9:1, still 1.28:1 against sand; not the secondary #E1DCCF, which
 * would merge with the secondary / sand panels right above the footer).
 * "Nuværende" (`resetAll`) is the site's colours: it clears every change and asks first, as
 * "Nulstil alle" does.
 */
export type Preset = {
  id: string;
  label: string;
  /** Tooltip: what the click changes. */
  hint: string;
  overrides: Partial<Record<TokenId, string>>;
  resetAll?: true;
};

export const presets: Preset[] = [
  { id: "current", label: "Nuværende", hint: "Sitets farver: nulstiller alle dine ændringer", overrides: {}, resetAll: true },
  { id: "warm-cream", label: "Varm krem", hint: "Kun sidens baggrund: den tidligere krem (#F7F2EA)", overrides: { cream: "#f7f2ea" } },
  { id: "light-footer", label: "Lys footer", hint: "Kun footeren: lysere sandbeige (#D5CEBB)", overrides: { footer: "#d5cebb" } },
];

/**
 * Runs inline at the top of <body>, before the page paints: decides whether the tuner is on for
 * this tab and, if so, applies the saved overrides (no flash of the default colours on a reload).
 * Off in automated browsers (navigator.webdriver: screenshot scripts) unless the URL has
 * `?farver`; `?farver=0` turns it off in any browser. Both stick for the tab (sessionStorage).
 */
export const initScript = `(function(){var on=!navigator.webdriver;try{var s=sessionStorage,m=/[?&]farver(?:=([^&]*))?(?:&|$)/.exec(location.search);if(m)s.setItem(${JSON.stringify(ENABLED_KEY)},m[1]==="0"?"0":"1");var f=s.getItem(${JSON.stringify(ENABLED_KEY)});if(f)on=f==="1"}catch(e){}window[${JSON.stringify(WINDOW_FLAG)}]=on?"on":"off";if(!on)return;try{var d=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"null"),o=d&&d.overrides,c="";for(var k in o||{}){var v=o[k];if(/^[a-z-]+$/.test(k)&&/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/.test(v))c+="--color-"+k+":"+v+";"}if(!c)return;var e=document.createElement("style");e.id=${JSON.stringify(STYLE_ID)};e.textContent="html:root{"+c+"}";document.head.appendChild(e)}catch(e){}})();`;

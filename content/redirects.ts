/**
 * Permanent (308) redirects from the legacy WordPress fillox.dk URLs to the new
 * routes, so rankings and inbound links survive the switch. Used by
 * next.config.ts → redirects().
 *
 * Source list: https://fillox.dk/wp-sitemap.xml (pages + users sitemaps, fetched
 * 2026-09-30) plus links found in the live menus and a few known old slugs.
 * Paths that exist unchanged in the new site are NOT redirected:
 * /, /priser, /booking, /om-os, /kontakt, /handelsbetingelser, /privatlivspolitik.
 *
 * Trailing slashes: sources are written without one. next.config.ts registers
 * each rule both with and without the trailing slash (and turns off Next's own
 * slash-stripping redirect), so /fillers/lip-filler/ → /behandlinger/lip-filler
 * is a single 308 hop.
 *
 * Keep this file dependency-free: next.config.ts imports it directly.
 */

export type LegacyRedirect = {
  /** Legacy path (Next.js path-to-regexp syntax), no trailing slash. */
  source: string;
  /** New route. May include a #fragment for category anchors on /behandlinger. */
  destination: string;
  /** Legacy page title / reason, for reviewers. */
  note?: string;
};

export const legacyRedirects: LegacyRedirect[] = [
  /* ------------------------------------------------------------- Fillers */
  { source: "/fillers", destination: "/behandlinger#fillers", note: "Fillers (oversigt)" },
  { source: "/fillers/lip-filler", destination: "/behandlinger/lip-filler", note: "Lip Filler" },
  { source: "/fillers/kindben", destination: "/behandlinger/kindben", note: "Kindben" },
  { source: "/fillers/kaebelinje", destination: "/behandlinger/kaebelinje", note: "Kæbelinje" },
  { source: "/fillers/tear-trough", destination: "/behandlinger/tear-trough", note: "Tear Trough" },
  { source: "/fillers/naesekorrektion", destination: "/behandlinger/naesekorrektion", note: "Næsekorrektion" },
  { source: "/fillers/ansigtskonturering", destination: "/behandlinger#fillers", note: "Ansigtskonturering (ingen egen side)" },
  { source: "/fillers/ansiktskulpturering", destination: "/behandlinger#fillers", note: "Gammel slug for ansigtskonturering" },
  { source: "/fillers/nasolabiale-linjer", destination: "/behandlinger#fillers", note: "Nasolabiale linjer (ingen egen side)" },
  { source: "/fillers/marionettelinjer", destination: "/behandlinger#fillers", note: "Marionettelinjer (ingen egen side)" },
  { source: "/fillers/marionette-linjer", destination: "/behandlinger#fillers", note: "Gammel slug for marionettelinjer" },
  { source: "/fillers/haender", destination: "/behandlinger#fillers", note: "Hænder (ikke i nyt udbud)" },
  { source: "/fillers/faq-om-fillers-behandling", destination: "/behandlinger#fillers", note: "FAQ om fillers" },

  /* ----------------------------------------------------- Rynkebehandling */
  { source: "/rynkebehandling", destination: "/behandlinger/botox", note: "Rynkebehandling med Botox" },
  { source: "/ovrige-botox-behandlinger", destination: "/behandlinger/botox", note: "Øvrige Botox behandlinger" },

  /* ------------------------------------------------------- Hudforbedring */
  { source: "/hudforbedring", destination: "/behandlinger#hudforbedring", note: "Hudforbedring (oversigt)" },
  { source: "/hudforbedring/infini-microneedling", destination: "/behandlinger/microneedling", note: "Infini Microneedling" },
  { source: "/hudforbedring/infini-microneedling-copy", destination: "/behandlinger/signatur-ansigtsbehandling", note: "Signatur behandling" },
  { source: "/hudforbedring/prf-behandling", destination: "/behandlinger/prf-hud", note: "PRF-behandling" },
  { source: "/hudforbedring/belotero-revive", destination: "/behandlinger/skinbooster", note: "Belotero Revive (skinbooster)" },
  { source: "/hudforbedring/hyalual-electri", destination: "/behandlinger/skinbooster", note: "Hyalual Electri (skinbooster)" },
  { source: "/hudforbedring/xela-rederm", destination: "/behandlinger/skinbooster", note: "Xela Rederm (skinbooster)" },
  { source: "/hudforbedring/kemisk-peeling", destination: "/behandlinger/signatur-ansigtsbehandling", note: "Peeling (del af Signatur)" },
  { source: "/prf-hudbehandling", destination: "/behandlinger/prf-hud", note: "PRF hudbehandling" },
  { source: "/prp-hudbehandling", destination: "/behandlinger/prf-hud", note: "Gammel slug (PRP)" },
  { source: "/morpheus8", destination: "/behandlinger/microneedling", note: "Morpheus8 (ikke i nyt udbud; nærmeste er microneedling)" },
  { source: "/hudpleje", destination: "/behandlinger/signatur-ansigtsbehandling", note: "Dr. Dennis Gross hudpleje" },

  /* --------------------------------------------------------- Skinbooster */
  { source: "/skinbooster", destination: "/behandlinger/skinbooster", note: "Skinbooster" },
  { source: "/skinbooster/profhilo", destination: "/behandlinger/profhilo", note: "Profhilo" },
  { source: "/skinbooster/ejal-40", destination: "/behandlinger/skinbooster", note: "Ejal 40" },
  { source: "/skinbooster/sunekos", destination: "/behandlinger/skinbooster", note: "Sunekos" },
  { source: "/skinbooster/v20", destination: "/behandlinger/skinbooster", note: "V20" },
  { source: "/skinbooster/v5", destination: "/behandlinger/skinbooster", note: "V5" },

  /* ---------------------------------------------------- Hår & hårfjerning */
  { source: "/harfjerning", destination: "/behandlinger/laser-harfjerning", note: "Hårfjerning" },
  { source: "/prf-mod-hartab", destination: "/behandlinger/prf-har", note: "PRF mod hårtab" },
  { source: "/prp-mod-hartab", destination: "/behandlinger/prf-har", note: "Gammel slug (PRP)" },

  /* --------------------------------------------------------------- Øvrige */
  { source: "/tradloft", destination: "/behandlinger", note: "Trådløft (ikke i nyt udbud)" },
  { source: "/medlem", destination: "/priser", note: "Medlemskab (ikke i nyt site)" },
  { source: "/finansiering", destination: "/priser#finansiering", note: "Finansiering → finansieringsboksen på Priser" },
  { source: "/om-os/kontrol-eftertjek", destination: "/priser#konsultation", note: "Kontrol – eftertjek → kortet Konsultation & kontrol" },
  { source: "/om-oss", destination: "/om-os", note: "Norsk stavemåde" },
  { source: "/author/:slug", destination: "/blog", note: "WordPress forfatterarkiver" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml", note: "WordPress sitemap" },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml", note: "Yoast sitemap-sti" },
  { source: "/feed", destination: "/blog", note: "WordPress RSS-feed (standard-sti)" },
  { source: "/comments/feed", destination: "/blog", note: "WordPress kommentar-feed" },
  { source: "/blog/feed", destination: "/blog", note: "RSS-feed under /blog" },

  /* ------------------ Norske stier, som det gamle danske site linkede til */
  { source: "/filler/leppefiller", destination: "/behandlinger/lip-filler" },
  { source: "/filler/kinnben", destination: "/behandlinger/kindben" },
  { source: "/filler/kjevelinje", destination: "/behandlinger/kaebelinje" },
  { source: "/filler/tear-trough", destination: "/behandlinger/tear-trough" },
  { source: "/filler/nesekorreksjon", destination: "/behandlinger/naesekorrektion" },
  { source: "/filler/nasolabiale-linjer", destination: "/behandlinger#fillers" },
  { source: "/filler/ansiktskulpturering", destination: "/behandlinger#fillers" },
  { source: "/filler-oslo/hender", destination: "/behandlinger#fillers" },
];

import type { ImageRef } from "./types";

/**
 * The clinic's own photos (Google Drive › Fillox.dk › "Profesionelle billeder"), used as mood
 * images in place of stock photos. The owner approved this on 2026-11-24: the people shown gave
 * consent, and the clinic may use all its content on its own website.
 *
 * Every entry is one file in public/images/fillox/ with its intrinsic size, a default alt text and
 * a default crop (`position`, the face or subject). A placement spreads the entry and changes
 * `position` (or `alt`) where its slot needs it: `{ ...photos.sproejte, position: "55% 12%" }`.
 * `share` is the photo's link-preview crop (og-<file>.jpg, ≈ 1.91 : 1 at the file's own width, at
 * most 1200px), for every photo that is a page's share image (lib/metadata.ts → `shareImage`).
 *
 * Rules (README → "Før lancering" → photos):
 * - Only Dr. Tom (`tomKlinik`) and Mike (`mikeKlinik`) are identified. Every other practitioner,
 *   the group photo and every client stay UNNAMED: no name, title or clinic in alt texts,
 *   captions, file names or comments, and no unnamed practitioner next to a named author.
 * - Rynkebehandling pages and Botox posts (Botox is a prescription medicine): only photos without
 *   a product, syringe, needle or vial, and no treatment in progress — `behandlingsrum`, `spejl`,
 *   `behandlerVindue`, `behandlerPortraet2` — never as a "result". `sproejte` and
 *   `behandlerSproejte` show a syringe: fillers and skin pages only. Check the image itself, not a
 *   description of it, before a photo goes on a Botox page.
 * - Not used on purpose: Drive 382DC544 (a practitioner injecting a client at the brow, a typical
 *   Botox site: it reads as a Botox treatment wherever it is shown); both Academy training photos
 *   (the safety glasses carry the "croma" filler brand, next to the face: no crop removes it); the
 *   photo with a Profhilo box (device advertising with a practitioner's endorsement); the single
 *   "after" shots of clients right after treatment (they read as results, and one shows a filler
 *   brand on a mirror). The before/after pairs are in content/treatments.ts.
 * - Files are 782–1548px wide: none is wide enough for a full-bleed slot (see `sizes` notes in
 *   the components and the README).
 */
type Photo = Required<Pick<ImageRef, "src" | "alt" | "position" | "width" | "height">> &
  Pick<ImageRef, "share">;

// TODO: copy review (alt texts): written from what each photo shows.
export const photos = {
  /** A practitioner in a white coat treating a client who lies in the chair (no product shown). */
  behandlingKlient: {
    src: "/images/fillox/behandling-klient.jpg",
    alt: "Behandler i hvid kittel og handsker behandler en klient, der ligger i behandlingsstolen",
    position: "45% 62%",
    width: 972,
    height: 1183,
    share: { src: "/images/fillox/og-behandling-klient.jpg", width: 972, height: 510 },
  },
  /** An empty treatment room: white chair, plant, round mirror, rose-beige walls. */
  behandlingsrum: {
    src: "/images/fillox/behandlingsrum.jpg",
    alt: "Behandlingsrum med hvid behandlingsstol, en grøn plante og et rundt spejl på en rosabeige væg",
    position: "60% 60%",
    width: 1086,
    height: 1448,
    share: { src: "/images/fillox/og-behandlingsrum.jpg", width: 1086, height: 570 },
  },
  /** Dr. Tom Haugland in the clinic (identified). */
  tomKlinik: {
    src: "/images/fillox/tom-klinik.jpg",
    alt: "Dr. Tom Haugland i beige uniform i klinikken",
    position: "50% 25%",
    width: 1223,
    height: 1286,
  },
  /** A woman, seen from behind, looking at herself in a white hand mirror. */
  spejl: {
    src: "/images/fillox/spejl.jpg",
    alt: "Kvinde ser sig selv i et hvidt håndspejl foran en rosabeige væg",
    // The mirror spans ≈ 60–84% of the width: keep all of it in the narrow crops.
    position: "75% 45%",
    width: 1548,
    height: 1016,
    share: { src: "/images/fillox/og-spejl.jpg", width: 1200, height: 630 },
  },
  /** Share crop (1200 × 630) of `spejl`. */
  ogSpejl: {
    src: "/images/fillox/og-spejl.jpg",
    alt: "Kvinde ser sig selv i et hvidt håndspejl foran en rosabeige væg",
    position: "50% 50%",
    width: 1200,
    height: 630,
  },
  /**
   * A practitioner preparing a syringe (fillers only). Small file (782px): soft where it is drawn
   * wider, as in the blog article header (up to 1.84× on the 1600 canvas; README asks for a larger
   * original).
   */
  sproejte: {
    src: "/images/fillox/sproejte.jpg",
    alt: "Behandler i sort trøje og sorte handsker gør en sprøjte klar foran et rundt spejl",
    position: "55% 25%",
    width: 782,
    height: 998,
    share: { src: "/images/fillox/og-sproejte.jpg", width: 782, height: 410 },
  },
  /** A practitioner holding a syringe, arms crossed (fillers only). */
  behandlerSproejte: {
    src: "/images/fillox/behandler-sproejte.jpg",
    alt: "Behandler med langt lyst hår i sort Fillox-trøje og sorte handsker holder en sprøjte",
    position: "50% 25%",
    width: 1135,
    height: 1080,
    share: { src: "/images/fillox/og-behandler-sproejte.jpg", width: 1135, height: 596 },
  },
  /**
   * A practitioner seated in profile, smiling at a leaflet. Small file (854px): drawn up to 1.69×
   * in the blog article header (README asks for a larger original).
   */
  behandlerFolder: {
    src: "/images/fillox/behandler-folder.jpg",
    alt: "Smilende behandler i sort Fillox-trøje sidder og kigger på en folder",
    position: "55% 40%",
    width: 854,
    height: 782,
    share: { src: "/images/fillox/og-behandler-folder.jpg", width: 854, height: 448 },
  },
  /** A practitioner with arms crossed (gloves, no product). */
  behandlerPortraet1: {
    src: "/images/fillox/behandler-portraet-1.jpg",
    alt: "Behandler med langt lyst hår i sort Fillox-trøje og sorte handsker med korslagte arme",
    position: "45% 25%",
    width: 1105,
    height: 1118,
    share: { src: "/images/fillox/og-behandler-portraet-1.jpg", width: 1105, height: 580 },
  },
  /** A smiling practitioner (no gloves, no product). */
  behandlerPortraet2: {
    src: "/images/fillox/behandler-portraet-2.jpg",
    alt: "Smilende behandler med langt lyst hår i sort Fillox-uniform",
    position: "50% 25%",
    width: 976,
    height: 1027,
    share: { src: "/images/fillox/og-behandler-portraet-2.jpg", width: 976, height: 512 },
  },
  /** A practitioner by a bright window (no product). Small file (830px): no wide slots. */
  behandlerVindue: {
    src: "/images/fillox/behandler-vindue.jpg",
    alt: "Behandler med langt lyst hår i en lys slå-om-trøje ved et vindue",
    position: "45% 30%",
    width: 830,
    height: 1010,
    share: { src: "/images/fillox/og-behandler-vindue.jpg", width: 830, height: 436 },
  },
  /** Mike (identified), the same man as public/images/team/mike.jpg. */
  mikeKlinik: {
    src: "/images/fillox/mike-klinik.jpg",
    alt: "Mike, sygeplejerske hos Fillox, i sort uniform med korslagte arme",
    position: "55% 25%",
    width: 1290,
    height: 1219,
    share: { src: "/images/fillox/og-mike-klinik.jpg", width: 1200, height: 630 },
  },
  /**
   * Four practitioners on and around a white sofa (unnamed). 15%: the wide phone and tablet crops
   * (≈ 1.3–1.9 : 1) keep all four faces, the two standing ones clear of the top edge.
   */
  team: {
    src: "/images/fillox/team.jpg",
    alt: "Fire behandlere i sort Fillox-uniform i og omkring en hvid sofa",
    position: "50% 15%",
    width: 1206,
    height: 1468,
  },
} satisfies Record<string, Photo>;

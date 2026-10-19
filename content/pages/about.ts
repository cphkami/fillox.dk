import type { ImageRef, Link, RichText } from "../types";
import { site } from "@/config/site";
import { aboutTeamAnchor, routes } from "../routes";
import { teamMemberHref } from "../team";

/**
 * Anchor id of the team section on /om-os (content/routes.ts): the hero's "Mød vores team" link
 * is derived from it; other pages link to `routes.aboutTeam`.
 */
export { aboutTeamAnchor };

/** Slug of the medically responsible doctor (content/team.ts): his portrait and profile link. */
const doctorSlug = "tom";

/**
 * Copy for /om-os.
 *
 * Source (October 2026): the owner's new "Om Fillox" text from their content agency (Google Drive
 * › Fillox › Fillox.dk › "Om Fillox og klinikker", tab "Om Fillox"). Every visible text below is
 * that text VERBATIM, in its order, split into the page's fields:
 * - `title` = the source's headings; `statement` = the sentences the source sets in bold (shown as
 *   pull statements); `lead` = a section's opening paragraph where the page sets it larger;
 * - inline bold in a paragraph is a `{ strong: true }` run ("Fillox Academy", "Dr. Tom Haugland",
 *   the latter also linked to his profile);
 * - the author's button placeholders ("[Mød vores team]", "[Find din klinik]",
 *   "[Book en konsultation]") are the links and buttons.
 * - typography only: "\u00A0– " is the source's " – " with a no-break space before the dash, so
 *   a line never starts with a dash.
 * Copy that is not in the source is marked "TODO: copy review".
 *
 * The practitioners themselves (names, titles, bios, portraits, links) come from content/team.ts.
 * Link labels are stored without arrows; components add the glyph.
 */
export const aboutPage = {
  meta: {
    title: "Om os",
    // TODO: copy review (not in the source as one sentence): the hero's H1 and first paragraph,
    // joined. Keep it at 155 characters or fewer so search results don't truncate it.
    description:
      "Ekspertbehandling skal være for alle: avancerede æstetiske behandlinger med høj medicinsk kvalitet, kompetente behandlere og priser, der er til at betale.",
  },

  hero: {
    /** The source's page title ("# Om Fillox"). */
    eyebrow: "Om Fillox",
    /**
     * The source's bold opening line. "­" is an invisible soft hyphen: the visible text is
     * unchanged, but if "Ekspertbehandling" ever outgrows the hero column (fallback font before
     * Poppins loads, a narrower layout, a copy change) it breaks as "Ekspert-" / "behandling"
     * instead of overflowing into the photo.
     */
    title: "Ekspert­behandling skal være for alle.",
    /** First paragraph, set as the hero's lead. */
    lead: "Det var en af tankerne bag Fillox fra begyndelsen. At gøre avancerede æstetiske behandlinger tilgængelige for flere\u00A0– med høj medicinsk kvalitet, kompetente behandlere og priser, der er til at betale.",
    paragraphs: [
      "Vi mener ikke, at en professionel æstetisk klinik behøver at være eksklusiv eller dyr for at være blandt de bedste. Til gengæld mener vi, at du skal kunne stille høje krav til den faglige kvalitet.",
      "Hos Fillox skal du møde dygtige mennesker, få ærlig rådgivning og føle dig velkommen. Uanset hvem du er, og hvilken behandling du overvejer.",
    ],
    image: {
      // TODO: asset (owner): replace with a larger original of this photo, at least 2200×1470
      // (ideally 2400px wide). This file is 800×533; on wide screens it covers a ≈ 700×850
      // cell, so it is upscaled (≈ 2× on retina) and the letters look soft.
      src: "/images/results/behandling-3.jpg",
      // TODO: copy review (alt text)
      alt: "Fillox-logoet i spejlblanke bogstaver på væggen i klinikken",
      /** Phones and tablets: the wide cell shows the whole word "FILLOX" centred. */
      position: "50% 50%",
    } satisfies ImageRef,
    /**
     * Crop from 1024px (`lg`), where the photo is a portrait cell next to the text (≈ 0.4–0.57 of
     * the photo's width, 1024 → 1710px): anchored near the left edge, so the cell shows the plant
     * leaf and the word's beginning ("FIL…", "FILL…") instead of "ILL" from its middle. Vertical
     * position is unused there (the photo's height fits the cell).
     */
    imagePositionDesktop: "15% 50%",
    /** The source's closing "[Book en konsultation]". */
    primaryCta: { label: "Book en konsultation", href: site.booking.href } satisfies Link,
    /**
     * The source's "[Mød vores team]" (after the team intro there): an in-page link to the team
     * section, in the hero next to the button (under it on phones), where it saves the scroll.
     */
    teamLink: { label: "Mød vores team", href: `#${aboutTeamAnchor}` } satisfies Link,
  },

  /** "Vi uddanner vores egne specialister" (Fillox Academy). */
  academy: {
    id: "fillox-academy",
    title: "Vi uddanner vores egne specialister",
    // Updated in the agency's Drive doc on 2026-10-15.
    statement:
      "Et godt resultat kræver den rette behandling. Men endnu vigtigere er behandlerens kompetence til at vælge og udføre den korrekt.",
    paragraphs: [
      "Det er let at finde en klinik, der tilbyder botox, filler, laser eller hudforbedrende behandlinger. Men det kræver erfaring og faglig forståelse at vide, hvilken behandling der er den rigtige\u00A0– og hvornår en anden løsning vil give et bedre resultat.",
      "Derfor investerer vi målrettet i vores behandleres kompetencer.",
      [
        "Gennem vores eget uddannelsesprogram, ",
        { text: "Fillox Academy", strong: true },
        ", arbejder vi systematisk med faglig udvikling, anatomi, behandlingsmetoder, produktforståelse, risikovurdering og praktiske færdigheder.",
      ],
      "Vi uddanner ikke kun vores behandlere i at udføre behandlinger. Vi lærer dem også at vurdere, sammenligne og vælge mellem forskellige muligheder.",
      "For når du kommer til Fillox, skal du ikke være nødt til selv at vide, hvilken behandling du har brug for.",
      "Det skal vi kunne hjælpe dig med.",
    ] satisfies RichText[],
  },

  /**
   * "En læge, der er en del af hverdagen": the medically responsible doctor. On /om-os this takes
   * the place of the old "Fagligt ansvarlig" band (`responsible` below stays for /behandlere).
   * Portrait and profile link come from content/team.ts (`slug`).
   */
  doctor: {
    id: "laegen",
    // TODO: asset (owner): a second photo of Dr. Tom (teaching / at work, ≥ 1300px wide) for this
    // section. It now shows his team-card portrait (team/tom.jpg, 509 × 800, enlarged here), which
    // repeats as the first card of the team grid further down the page.
    slug: doctorSlug,
    title: "En læge, der er en del af hverdagen",
    lead: "Hos Fillox er den medicinsk ansvarlige læge ikke blot et navn på hjemmesiden.",
    paragraphs: [
      [
        { text: "Dr. Tom Haugland", strong: true, href: teamMemberHref(doctorSlug) },
        " er grundlægger af Fillox og har en central rolle i den faglige udvikling af vores behandlere og klinikker.",
      ],
      "Han arbejder tæt sammen med vores behandlere, står for intern undervisning og bidrager med medicinsk sparring, vurderinger og udvikling af behandlingsmetoder.",
      "Tom har omfattende erfaring med medicinsk æstetik, både som behandler og international underviser.",
      "Det betyder, at vores medarbejdere har adgang til medicinsk ekspertise som en integreret del af deres arbejde\u00A0– ikke kun når de deltager i eksterne kurser.",
    ] satisfies RichText[],
  },

  /** "Samme kompetence. Uanset hvilken Fillox du besøger." */
  consistency: {
    id: "samme-kompetence",
    title: "Samme kompetence. Uanset hvilken Fillox du besøger.",
    paragraphs: [
      "Fillox er en klinikkæde med klinikker i både Norge og Danmark.",
      "For os er det afgørende, at kvaliteten ikke afhænger af, hvilken klinik du vælger.",
      "Derfor arbejder vi med fælles faglige standarder, struktureret oplæring og løbende kompetenceudvikling på tværs af vores klinikker.",
      "Vores behandlere lærer af hinanden, deler erfaringer og udvikler deres faglige færdigheder som en del af et større fællesskab.",
    ],
    statement:
      "Du skal kunne forvente den samme høje faglige standard, uanset hvilken Fillox-klinik du besøger.",
    /** The paragraph after the bold sentence. */
    closing: "Det er ambitionen bag Fillox Academy og måden, vi bygger vores klinikker på.",
  },

  /** "Den rigtige behandling kræver mere end ét værktøj" (a rose band). */
  methods: {
    id: "mere-end-et-vaerktoej",
    title: "Den rigtige behandling kræver mere end ét værktøj",
    paragraphs: [
      "Forestil dig, at du ønsker at forbedre din hudkvalitet.",
      "Måske er en professionel peeling den bedste løsning. Måske vil en laserbehandling, microneedling eller en injektionsbehandling være mere relevant. Og måske vil en kombination af behandlinger give det bedste resultat over tid.",
      "Det afhænger af din hud, dine ønsker og en faglig vurdering.",
      "Vi arbejder derfor med et bredt udvalg af dokumenterede behandlingsmetoder og moderne teknologi. Ikke fordi alle skal tilbydes det hele, men fordi vores behandlere skal have forskellige muligheder at vælge imellem.",
    ],
    statement:
      "Vi vil hellere være eksperter i at vælge den rigtige behandling end eksperter i at sælge én bestemt behandling.",
  },

  /** "Høj kvalitet behøver ikke komme med en høj pris". */
  value: {
    id: "kvalitet-og-pris",
    title: "Høj kvalitet behøver ikke komme med en høj pris",
    paragraphs: [
      "Hos Fillox bruger vi vores ressourcer på det, vi mener har størst betydning for resultatet: dygtige behandlere, uddannelse, medicinsk udstyr og gode produkter.",
      "Vi ønsker at tilbyde avancerede behandlinger i en prisklasse, hvor flere har mulighed for at være med.",
      "Det betyder ikke, at vi går på kompromis med kvaliteten. Tværtimod.",
      "Vores ambition er at kombinere høj faglig standard med fornuftige priser og en god kundeoplevelse.",
      "Og du behøver ikke føle dig hjemme i en eksklusiv luksusklinik for at føle dig hjemme hos os.",
      "Vi ønsker en afslappet, venlig og imødekommende atmosfære, hvor både nye og erfarne kunder føler sig velkomne.",
    ],
  },

  /** "Mød menneskene bag Fillox": the team section's heading and intro, above the grid. */
  team: {
    /** Anchor id of the team section (nav "Vores behandlere" → /om-os#behandlere). */
    id: aboutTeamAnchor,
    title: "Mød menneskene bag Fillox",
    paragraphs: [
      "Bag hver behandling står et menneske med sin egen erfaring, faglige interesse og personlighed.",
      "Mød vores behandlere, lær dem lidt bedre at kende, og find den, du gerne vil booke tid hos.",
    ],
  },

  /** Closing band "Velkommen til Fillox" with the source's two buttons. */
  welcome: {
    id: "velkommen",
    title: "Velkommen til Fillox",
    text: "Vi glæder os til at vise dig, hvad vi kan\u00A0– og hjælpe dig med at finde den behandling, der passer til dig.",
    clinicsCta: { label: "Find din klinik", href: routes.clinics } satisfies Link,
    bookingCta: { label: "Book en konsultation", href: site.booking.href } satisfies Link,
  },

  /**
   * The "Fagligt ansvarlig" band under the grid on /behandlere (app/behandlere/page.tsx renders
   * components/about/ResponsibleBand with it). Not on /om-os any more: the `doctor` section
   * introduces Dr. Tom there.
   */
  responsible: {
    eyebrow: "Fagligt ansvarlig",
    name: "Æstetisk læge Tom Haugland",
    cta: { label: "Book konsultation", href: site.booking.href } satisfies Link,
  },
};

export type AboutPageCopy = typeof aboutPage;

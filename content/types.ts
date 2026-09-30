/**
 * Content types shared by every page. All visible copy lives in /content and is
 * typed here, so the NO repo can swap the content without touching components.
 *
 * Owners may ADD optional fields when a page needs more data; never rename or
 * remove fields other pages rely on.
 */

export type ImageRef = {
  src: string; // path under /public, e.g. "/images/team/annika.jpg"
  alt: string;
  /** CSS object-position, e.g. "50% 30%" — reproduces the crop from the design. */
  position?: string;
};

export type Link = { label: string; href: string };

/* ------------------------------------------------------------------ Clinics */

export type OpeningHours = { days: string; hours: string };

export type Clinic = {
  slug: string;
  /** Short name used in menus and footer, e.g. "City2". */
  name: string;
  /** Full name used on the Find klinik page, e.g. "Fillox City2". */
  fullName: string;
  /** Address lines, e.g. ["Cityringen 2, Plan 3", "2630 Høje Taastrup"]. */
  address: string[];
  hours: OpeningHours[];
  /** Transport / parking note. */
  note?: string;
  /** Booking link for this clinic (defaults to site.booking.href). */
  bookingHref?: string;
  /** Google Maps / directions URL. */
  directionsHref?: string;
  status: "open" | "coming-soon";
  /** Shown when status is "coming-soon", e.g. "Åbner 1. november". */
  openingNote?: string;
};

/* --------------------------------------------------------------- Treatments */

export type TreatmentCategory = {
  slug: string; // used as anchor on /behandlinger (#slug)
  name: string; // "Fillers"
  /** Label used in the mobile menu when it differs, e.g. "Rynkebehandling (botox)". */
  mobileName?: string;
  /** Treatment slugs, in menu order. */
  treatments: string[];
};

export type PriceRow = { label: string; price: string };

export type FaqItem = { question: string; answer: string };

export type BeforeAfter = {
  before: ImageRef;
  after: ImageRef;
  caption: string; // "Pande · 2026"
};

export type Treatment = {
  slug: string; // route: /behandlinger/[slug]
  name: string; // "Botox"
  categorySlug: string;
  /** Lowest price as a number in the market currency, used for "fra 799 kr". */
  priceFrom?: number;
  /** One-line description (menus, lists, cards). */
  short: string;
  /** Detail-page content. Optional: treatments without it render the generic template with `short`. */
  detail?: {
    lead: string;
    heroImage: ImageRef;
    facts: { label: string; value: string }[]; // Pris, Varighed, Holdbarhed, Udføres af
    about: string[]; // paragraphs
    goodFor: string[];
    practitionerSlug?: string; // team member featured on the page
    practitionerQuote?: string;
    practitionerText?: string;
    results?: BeforeAfter[];
    prices?: PriceRow[];
    pricesIntro?: string;
    faq?: FaqItem[];
    relatedPostSlugs?: string[];
  };
};

/* --------------------------------------------------------------------- Team */

export type TeamMember = {
  slug: string; // route: /behandlere/[slug]
  name: string;
  role: string; // "Sygeplejerske"
  image: ImageRef;
  /** Extended profile content for /behandlere/[slug]. */
  profile?: Record<string, unknown>;
};

/* --------------------------------------------------------------------- Blog */

export type BlogPost = {
  slug: string; // route: /blog/[slug]
  title: string;
  category: string; // "Guide"
  readingTime: string; // "4 min læsning"
  date: string; // ISO date
  excerpt: string;
  image: ImageRef;
  authorSlug?: string;
  /** Article body as structured blocks (rendered by the blog article page). */
  body?: unknown[];
};

/* --------------------------------------------------------------- Navigation */

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "treatments"; label: string; href: string }
  | { kind: "clinics"; label: string; href: string }
  | { kind: "menu"; label: string; href: string; items: Link[] };

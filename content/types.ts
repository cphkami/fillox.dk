/**
 * Content types shared by every page. All visible copy lives in /content and is
 * typed here, so the NO repo can swap the content without touching components.
 *
 * Owners may ADD optional fields when a page needs more data; never rename or
 * remove fields other pages rely on.
 *
 * Convention: link labels are stored WITHOUT trailing arrows ("Se hvad Alberte
 * tilbyder", not "… →"); components add the arrow glyph.
 */

export type ImageRef = {
  src: string; // path under /public, e.g. "/images/team/annika.jpg"
  alt: string;
  /** CSS object-position, e.g. "50% 30%" — reproduces the crop from the design. */
  position?: string;
  /**
   * Optional zoom (>= 1) from the design's image-slot crop. `position` is already
   * computed for the zoomed size, so rendering `object-position: position` alone is
   * a good approximation; for an exact crop also apply
   * `transform: scale(zoom); transform-origin: position` on the <img>.
   */
  zoom?: number;
  /**
   * Intrinsic pixel size of the file. Optional: only needed where the size is
   * published, e.g. og:image:width / og:image:height for a blog post's share image.
   */
  width?: number;
  height?: number;
};

export type Link = { label: string; href: string };

/**
 * A price in the market currency, or a special non-numeric value.
 * Render with `formatPriceValue()` from lib/content.ts (numbers go through formatPrice).
 */
export type PriceValue =
  /** A number in the market currency. `from: true` renders "fra 999 kr". */
  | { kind: "amount"; amount: number; from?: boolean }
  /** Free of charge. `label` is the lowercase display text ("gratis"); uppercase via CSS where the design does. */
  | { kind: "free"; label: string }
  /** Price agreed individually. `label` e.g. "efter aftale". */
  | { kind: "on-request"; label: string };

/* ------------------------------------------------------------------ Clinics */

export type OpeningHours = { days: string; hours: string };

/**
 * A clinic's ids at the booking provider (config/site.ts → booking.provider). Set the one
 * for the market's provider; lib/booking.ts builds the links from it.
 */
export type ClinicBookingIds = {
  /** Gecko calendar id, "12" or "12.13" (Gecko admin). Preselects the clinic in the Gecko calendar. */
  geckoCalendarId?: string;
  /** TIMMA reservation id, e.g. "filloxstortingsgata" (→ https://bestill.timma.no/reservation/filloxstortingsgata). */
  timmaId?: string;
};

export type Clinic = {
  slug: string;
  /** Short name used in menus and footer, e.g. "City2". */
  name: string;
  /** Full name used on the Find klinik page, e.g. "Fillox City2". */
  fullName: string;
  /** Address lines, e.g. ["Cityringen 2, Plan 3", "2630 Høje Taastrup"]. */
  address: string[];
  hours: OpeningHours[];
  /**
   * One-line hours summary on the home page clinic cards (6a / mf), e.g.
   * "Hverdage 10–20 · Weekend 10–18". Other places join `hours`.
   */
  hoursSummary?: string;
  /** Transport / parking note. */
  note?: string;
  /** Ids at the booking provider (Gecko calendar id / TIMMA reservation id). */
  booking?: ClinicBookingIds;
  /**
   * Booking link for this clinic (defaults to site.booking.href). Build it with
   * clinicBookingHref() from lib/booking.ts: "/booking?klinik=city2", or
   * "/booking?geckoCalendarId=12" once the Gecko calendar id is known.
   */
  bookingHref?: string;
  /** Google Maps / directions URL. */
  directionsHref?: string;
  status: "open" | "coming-soon";
  /** Shown when status is "coming-soon", e.g. "Åbner 1. november". */
  openingNote?: string;
  /**
   * Structured data (JSON-LD) only: a photo of this clinic (path under /public) and its
   * coordinates. Without a photo the clinic node uses content/seo.ts `clinicImage`.
   */
  seoImage?: string;
  geo?: { latitude: number; longitude: number };
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

export type PriceRow = {
  label: string;
  /** Display price, already formatted, e.g. "1.199 kr". */
  price: string;
  /** Numeric price in the market currency (when numeric), e.g. 1199. */
  amount?: number;
  /** Small secondary text after the label, e.g. "pr. område". */
  note?: string;
  /** Shorter label used on mobile when the design differs, e.g. "Opløsning af filler". */
  mobileLabel?: string;
  /** Treatment this row belongs to (for linking). */
  treatmentSlug?: string;
};

export type FaqItem = { question: string; answer: string };

export type BeforeAfter = {
  before: ImageRef;
  after: ImageRef;
  caption: string; // "Pande · 2026"
  /** Shorter caption on mobile when the design differs, e.g. "0,5 ml · 2026". */
  mobileCaption?: string;
};

/** Mobile (390px) copy that differs from desktop on a treatment page (design `mb`). */
export type TreatmentDetailMobile = {
  lead?: string;
  about?: string[];
  /** Practitioner card: title line, e.g. "Sygeplejerske · Fillers & botox". */
  practitionerTitle?: string;
  practitionerText?: string;
  /** Practitioner card CTA, e.g. { label: "Book hos Maria", href: "/booking?behandler=maria" }. */
  practitionerCta?: Link;
  pricesIntro?: string;
};

export type Treatment = {
  slug: string; // route: /behandlinger/[slug]
  name: string; // "Botox"
  categorySlug: string;
  /** Lowest price as a number in the market currency, used for "fra 799 kr". */
  priceFrom?: number;
  /** One-line description (menus, lists, cards). */
  short: string;
  /** Name in the mobile menu level 2 when it differs (design mm3), e.g. "Hårtab for mænd (PRF)". */
  mobileMenuName?: string;
  /**
   * Search/share title (before " · Fillox") when it should say more than the page title,
   * e.g. "Botox i København – pris og behandling". Keep the full title ≤ 60 characters.
   */
  metaTitle?: string;
  /** Detail-page content. Optional: treatments without it render the generic template with `short`. */
  detail?: {
    /** Page title (H1, breadcrumb, book bar) when it differs from `name`, e.g. "Lip Filler". */
    title?: string;
    lead: string;
    heroImage: ImageRef;
    facts: { label: string; value: string }[]; // Pris, Varighed, Holdbarhed, Udføres af
    /** Secondary hero CTA next to "Book tid", e.g. "Gratis konsultation". */
    secondaryCta?: Link;
    about: string[]; // paragraphs
    goodFor: string[];
    practitionerSlug?: string; // team member featured on the page
    /** Practitioner section heading, e.g. "Annika, kosmetisk sygeplejerske". */
    practitionerHeading?: string;
    practitionerQuote?: string;
    practitionerText?: string;
    /** Results section heading + intro, e.g. "Resultater med botox". */
    resultsTitle?: string;
    resultsIntro?: string;
    results?: BeforeAfter[];
    /** Price section heading, e.g. "Betal pr. område". */
    pricesTitle?: string;
    prices?: PriceRow[];
    pricesIntro?: string;
    faq?: FaqItem[];
    /** "Fra bloggen" section heading + intro + "Alle artikler om …" link. */
    relatedPostsTitle?: string;
    relatedPostsIntro?: string;
    relatedPostsLink?: Link;
    relatedPostSlugs?: string[];
    /** Text under "Klar til at booke?" in the closing booking band. */
    bookingText?: string;
    /** Mobile copy overrides (design `mb`). */
    mobile?: TreatmentDetailMobile;
  };
};

/** Home page "Vores bestsellers" row (design 6a / mf). */
export type Bestseller = {
  number: string; // "01"
  name: string;
  description: string;
  /** Shorter description on mobile (design mf). */
  mobileDescription?: string;
  priceFrom: number;
  href: string;
};

/* --------------------------------------------------------------------- Team */

export type Review = {
  quote: string;
  /** Shorter quote on mobile when the design differs. */
  quoteShort?: string;
  author: string; // "Camilla"
  source: string; // "Trustpilot"
  rating: number; // 1–5
};

/** One treatment a practitioner offers, shown as a card with price + booking. */
export type TeamOffer = {
  name: string;
  description: string;
  price: PriceValue;
  /** Linked treatment (omit for e.g. "Gratis konsultation"). */
  treatmentSlug?: string;
};

/** Full practitioner profile for /behandlere/[slug] (design 6alb / ma). */
export type TeamProfile = {
  /** Hero intro paragraph (desktop). */
  intro: string;
  /** Shorter hero intro on mobile. */
  introShort?: string;
  /** Hero image crop (falls back to member.image). */
  heroImage?: ImageRef;
  primaryCta: Link; // "Book tid hos Alberte"
  secondaryCta?: Link; // "Se behandlinger" → "#behandlinger"
  /** Fact cards under the hero, e.g. Arbejder i / Specialer / Trustpilot. */
  facts: { label: string; value: string }[];
  approach?: {
    eyebrow: string; // "Sådan arbejder jeg"
    title: string;
    items: { title: string; text: string; textShort?: string }[];
  };
  offers?: {
    eyebrow: string; // "Behandlinger"
    title: string; // "Det tilbyder Alberte dig"
    /** Button label on each offer card (desktop), e.g. "Book hos Alberte". */
    ctaLabel: string;
    /** Button label on mobile, e.g. "Book". */
    ctaLabelShort?: string;
    items: TeamOffer[];
  };
  experience?: {
    title: string; // "Erfaring & uddannelse"
    items: { period: string; periodShort?: string; text: string; textShort?: string }[];
  };
  reviews?: Review[];
  /** Closing booking band. */
  booking?: { title: string; text: string; cta: Link };
};

export type TeamMember = {
  slug: string; // route: /behandlere/[slug]
  name: string; // "Dr. Tom"
  role: string; // short role on cards, e.g. "Sygeplejerske"
  /** Portrait used on cards (home, mobile Om os, avatars). */
  image: ImageRef;
  /** Full name when it differs, e.g. "Dr. Tom Haugland" (Om os, profile). */
  fullName?: string;
  /** Longer title on Om os / profile, e.g. "Æstetisk læge · Daglig leder". */
  title?: string;
  /** Title on mobile when the design differs (mo, mb), e.g. "Sygeplejerske · Fillers & botox". */
  titleShort?: string;
  /** Bio paragraph on Om os (desktop). */
  bio?: string;
  /** Shorter bio on Om os (mobile). */
  bioShort?: string;
  /**
   * Personal quote on the Om os card (6om spec note: "et personligt citat"). Not in the
   * mockups and no copy yet; rendered only when set. Include the market's quotation marks.
   */
  quote?: string;
  /** One-liner in the blog article author box, e.g. "Kosmetisk sygeplejerske, uddannet i Fillox af Dr. Tom." */
  authorBio?: string;
  /** Shown first / wide on Om os (fagligt ansvarlig). */
  featured?: boolean;
  /** Link on the Om os card, e.g. { label: "Se hvad Alberte tilbyder", href: "/behandlere/alberte" }. */
  link?: Link;
  /** Booking link that preselects this practitioner. */
  bookingHref?: string;
  /** Clinics the practitioner works in (content/clinics.ts slugs). */
  clinicSlugs?: string[];
  /** Page-specific crops from the design (fall back to `image`). */
  crops?: {
    /** Om os card (6om). Dr. Tom uses the wide photo here. */
    about?: ImageRef;
    /** Practitioner block on a treatment page (6c / 6bx). */
    practitioner?: ImageRef;
  };
  /** Extended profile content for /behandlere/[slug]. Only Alberte has a full design. */
  profile?: TeamProfile;
};

/* --------------------------------------------------------------------- Blog */

/** Filter chip on /blog. `slug` "alle" shows every post. */
export type BlogFilter = {
  slug: string;
  label: string;
  /** Hidden on mobile (the mobile design shows fewer chips). */
  desktopOnly?: boolean;
};

/** Structured article body. Headings carry an `id` so a table of contents can be derived. */
export type BlogBlock =
  /** Intro paragraph set larger (19px) under the hero image. */
  | { type: "lead"; text: string }
  | {
      type: "paragraph";
      text: string;
      /** Shorter text on mobile (design `mar`). */
      mobileText?: string;
      hideOnMobile?: boolean;
    }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "list"; style: "bullet" | "number"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "tip"; title?: string; text: string }
  | { type: "image"; image: ImageRef; caption?: string }
  /** Inline booking card for the treatment the article is about. */
  | {
      type: "booking";
      treatmentSlug: string;
      eyebrow: string; // "Behandlingen i artiklen"
      note?: string; // "Gratis lægekonsultation før første behandling"
      hideNoteOnMobile?: boolean;
    };

export type BlogPost = {
  slug: string; // route: /blog/[slug]
  title: string;
  /** Primary category label shown on cards and in the breadcrumb, e.g. "Botox". */
  category: string;
  readingTime: string; // "4 min læsning"
  date: string; // ISO date
  excerpt: string;
  image: ImageRef;
  authorSlug?: string;
  /** Article body as structured blocks (rendered by the blog article page). */
  body?: BlogBlock[];
  /** Filter slug of `category` (see blogFilters), e.g. "botox". */
  categorySlug?: string;
  /** Article type shown on treatment-page cards and the article eyebrow, e.g. "Guide", "Efterpleje". */
  kind?: string;
  /** Every filter the post matches (besides "alle"), e.g. ["botox", "guides"]. */
  tags?: string[];
  /** Reading time in minutes (mobile shows "4 min"). */
  readingMinutes?: number;
  /** Shorter excerpt on mobile. */
  excerptShort?: string;
  /** Shown as the featured article on /blog. */
  featured?: boolean;
  /** Left out of the mobile /blog list (design mbl shows 5 posts; 6blog shows all). */
  hideInMobileList?: boolean;
  /** Treatments the article is about (content/treatments.ts slugs). */
  treatmentSlugs?: string[];
  /** "Læs også" (desktop shows 3). */
  relatedPostSlugs?: string[];
  /** "Læs også" on mobile when the design differs (shows 2). */
  relatedPostSlugsMobile?: string[];
  /**
   * CSS object-position of `image` on the blog pages (6blog/mbl cards and thumbnails,
   * 6art/mar article hero and "Læs også") when it differs from `image.position`,
   * e.g. "50% 50%" (the design crops these photos centred).
   */
  blogImagePosition?: string;
};

/* --------------------------------------------------------------- Navigation */

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "treatments"; label: string; href: string }
  | { kind: "clinics"; label: string; href: string }
  /** Desktop: dropdown with the price categories (content/prices.ts). Mobile menu: a plain link. */
  | { kind: "prices"; label: string; href: string }
  | { kind: "menu"; label: string; href: string; items: Link[] };

/* --------------------------------------------------------------- Text pages */

/**
 * Inline rich text: a plain string, or a list of runs. A run is a string, or a
 * `{ text, href?, strong? }` object for a link and/or bold text.
 */
export type RichSpan = string | { text: string; href?: string; strong?: boolean };
export type RichText = string | RichSpan[];

/**
 * Body block of a simple text page (/handelsbetingelser, /privatlivspolitik,
 * /ledige-stillinger, /content-creator), rendered by components/text-page.
 */
export type TextBlock =
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "paragraph"; text: RichText }
  | { type: "list"; style?: "bullet" | "number"; items: RichText[] }
  /** Short lines kept on separate rows (addresses, contact details). `card` sets them on a white card. */
  | { type: "lines"; lines: RichText[]; card?: boolean };

/** Copy for a text page: hero, body blocks and an optional CTA card beside the text. */
export type TextPageContent = {
  meta: { title: string; description: string };
  hero: { eyebrow?: string; title: string; intro?: string; image?: ImageRef };
  body: TextBlock[];
  /** CTA card (desktop: sticky beside the text; mobile: after it). The first action is the primary button. */
  aside?: { eyebrow?: string; title: string; text?: string; actions: Link[] };
};

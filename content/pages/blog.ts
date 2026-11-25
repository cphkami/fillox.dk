import type { Link } from "../types";
import { site } from "@/config/site";
import type { FormName } from "@/lib/forms";
import { forms } from "../forms";
import { routes } from "../routes";

/**
 * Copy for the blog:
 * - /blog overview (design 6blog desktop, mbl mobile)
 * - /blog/[slug] article (design 6art desktop, mar mobile)
 *
 * The posts themselves (titles, excerpts, bodies, categories, authors) live in
 * content/blog.ts; the filter chips are `blogFilters` there. Where the mobile design
 * shortens a text, the short version is in `*Short`. Link labels are stored without
 * arrows; components add the glyph. Strings marked `// TODO: copy review` are not in
 * the design.
 */

/** Route of the blog overview (the article route is `blogPostHref()` in content/blog.ts). */
const BLOG_PATH = routes.blog;

/** Query parameter that preselects a filter chip, e.g. /blog?kategori=filler. */
const FILTER_PARAM = "kategori";

/** Filter slug that shows every post (see `blogFilters`). */
const ALL_FILTER = "alle";

/** Netlify form of the newsletter signup (declared in public/__forms.html). */
const NEWSLETTER_FORM: FormName = forms.newsletter;

/** The newsletter note links to the privacy policy's newsletter section. */
const privacyHref = routes.privacyNewsletter;

/** Dates are ISO days ("2026-09-12"); format them as UTC so the day never shifts. */
const longDate = new Intl.DateTimeFormat(site.locale, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const shortDate = new Intl.DateTimeFormat(site.locale, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export const blogPage = {
  path: BLOG_PATH,
  filterParam: FILTER_PARAM,
  allFilter: ALL_FILTER,
  /** Overview link filtered to one category: "/blog?kategori=filler" ("alle" = the plain overview). */
  filterHref: (filterSlug: string) =>
    filterSlug === ALL_FILTER ? BLOG_PATH : `${BLOG_PATH}?${FILTER_PARAM}=${encodeURIComponent(filterSlug)}`,

  // TODO: copy review (not in the design). The title says what the blog is about ("Blog · Fillox"
  // said nothing); the description is the hero intro with the team, 70–160 characters.
  meta: {
    title: "Blog om behandlinger og efterpleje",
    description: "Ærlige svar om behandlinger, forløb og efterpleje fra Fillox-holdet, så du ved, hvad du kan forvente.",
  },

  hero: {
    eyebrow: "Blog",
    // TODO: copy review. The design's title ("Viden fra vores behandlere") and intro ("… skrevet af
    // de læger og sygeplejersker, der behandler dig") said practitioners wrote the posts; they are
    // signed "Fillox-holdet" (owner, 2026-11-25; `blogArticle.teamAuthor` below), so the title names
    // the team and the intro no longer says who wrote them. "resultater" is left out (the posts make
    // no result claims).
    title: "Viden fra Fillox-holdet",
    intro: "Ærlige svar om behandlinger, forløb og efterpleje, så du ved, hvad du kan forvente.",
    introShort: "Ærlige svar om behandlinger, forløb og efterpleje.",
  },

  filters: {
    // TODO: copy review (accessible name of the chip row; not in the design)
    label: "Filtrér artikler efter kategori",
  },

  featured: {
    cta: "Læs artiklen",
  },

  list: {
    title: "Seneste artikler",
    /** "7 artikler" / "1 artikel". */
    count: (n: number) => `${n} ${n === 1 ? "artikel" : "artikler"}`,
    readArticle: "Læs artiklen",
    showMore: "Vis flere artikler",
    /** Cards per "page" before "Vis flere artikler" (the 6blog grid shows 6). */
    pageSize: 6,
    // TODO: copy review (empty filter result; not in the design)
    empty: "Der er ingen artikler i denne kategori endnu.",
  },

  /** Short reading time on mobile and in compact lists: "4 min". */
  minutes: (n: number) => `${n} min`,

  /** Separator between meta parts: "Filler · Guide · 3 min læsning". */
  separator: " · ",

  newsletter: {
    formName: NEWSLETTER_FORM,
    title: "Få tips og tilbud i din indbakke",
    titleShort: "Få tips og tilbud",
    text: "Én mail om måneden med nye artikler og månedens tilbud. Ingen spam.",
    textShort: "Én mail om måneden. Ingen spam.",
    placeholder: "Din e-mail",
    submit: "Tilmeld",
    // TODO: copy review (field label, states and messages below are not in the design)
    emailLabel: "Din e-mail",
    formLabel: "Tilmeld nyhedsbrevet",
    sending: "Sender …",
    errors: {
      emailRequired: "Skriv din e-mail.",
      emailInvalid: "Tjek, at e-mailen er skrevet rigtigt.",
      submit: `Vi kunne ikke gennemføre din tilmelding. Prøv igen, eller skriv til os på ${site.contact.email}.`,
    },
    success: {
      title: "Tak for din tilmelding",
      text: "Du får den første mail, når næste nummer udkommer.",
    },
    /** One line under the form (13px, muted): "… afmelde dig. Læs vores privatlivspolitik". */
    // TODO: copy review (not in the design; added so the signup links to the privacy policy)
    privacy: {
      text: "Vi bruger kun din e-mail til nyhedsbrevet, og du kan altid afmelde dig.",
      link: { label: "Læs vores privatlivspolitik", href: privacyHref } satisfies Link,
      end: ".",
    },
  },
};

export const blogArticle = {
  /** Desktop breadcrumb "Blog → Filler" (the category crumb links to the filtered overview). */
  blogCrumb: { label: "Blog", href: BLOG_PATH } satisfies Link,
  // TODO: copy review (accessible name of the breadcrumb; not in the design)
  breadcrumbLabel: "Brødkrumme",
  /** Mobile back link "‹ Alle artikler". */
  backLink: { label: "Alle artikler", href: BLOG_PATH } satisfies Link,

  /** "12. september 2026" (desktop byline, JSON-LD uses the ISO date). */
  formatDate: (iso: string) => longDate.format(new Date(iso)),
  /** "12. sep 2026" (mobile byline; the design writes the month without a period). */
  formatDateShort: (iso: string) =>
    shortDate
      .formatToParts(new Date(iso))
      .map((part) => (part.type === "month" ? part.value.replace(/\.$/, "") : part.value))
      .join(""),

  /**
   * Inline booking card for posts that have no `body` yet (excerpt-only posts). Posts
   * with a body place their own `booking` block.
   */
  bookingEyebrow: "Behandlingen i artiklen",

  author: {
    writtenBy: "Skrevet af",
  },

  /**
   * The team as author: every post without an `authorSlug` (content/blog.ts) is signed
   * "Fillox-holdet" (owner, 2026-11-25). No person's portrait: the bylines and the author box show
   * the Fillox mark (components/blog/TeamMark.tsx). Structured data names the organisation
   * (site.name) as the author.
   */
  teamAuthor: {
    name: "Fillox-holdet",
    // TODO: copy review (one line in the author box, desktop only; not in the design)
    bio: "Vi skriver om behandlinger, forløb og efterpleje, så du ved, hvad du kan forvente.",
    // TODO: copy review
    link: { label: "Mød vores behandlere", href: routes.aboutTeam } satisfies Link,
  },

  related: {
    title: "Læs også",
    /** Cards on desktop (6art) and rows on mobile (mar) when a post has no curated list. */
    count: 3,
    countMobile: 2,
  },
};

export type BlogPageCopy = typeof blogPage;
export type BlogArticleCopy = typeof blogArticle;

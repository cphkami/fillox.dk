/**
 * Resolves a Treatment from /content into everything the treatment page renders,
 * applying the fallbacks from content/pages/treatments.ts for treatments that have
 * no `detail`. A long-form page (`detail.sections`, content/types.ts) gets no fallbacks: it
 * shows only what its content gives. Pure data — no React, no copy of its own.
 */
import { site } from "@/config/site";
import { treatmentCategories, treatmentCategoryHref, mainNav } from "@/content/navigation";
import { treatmentPage as copy } from "@/content/pages/treatments";
import { priceCards, type PriceListRow } from "@/content/prices";
import { reviewsFor } from "@/content/reviews";
import { routes } from "@/content/routes";
import { team } from "@/content/team";
import { getTreatment, treatmentHref } from "@/content/treatments";
import type {
  BeforeAfter,
  BlogPost,
  CustomerReview,
  FaqItem,
  ImageRef,
  Link,
  TeamMember,
  Treatment,
  TreatmentSection,
} from "@/content/types";
import { ui } from "@/content/ui";
import { formatPrice } from "@/lib/format";
import { formatPriceFrom, formatPriceValue, postsBySlugs, relatedPostsForTreatment } from "@/lib/content";

export type Fact = { label: string; value: string };

export type PriceItem = {
  label: string;
  /** Shorter label below 768px. */
  mobileLabel?: string;
  /** Small muted text after the label ("pr. område"). */
  note?: string;
  price: string;
  /** The price as a number, when it is one (not "gratis"). */
  amount?: number;
};

/** Rows of a price list under an optional small heading (content/pages/treatments.ts → prices.groups). */
export type PriceGroup = {
  title?: string;
  /** Said once under the heading (the rows' own notes are left out). */
  note?: string;
  items: PriceItem[];
};

export type TreatmentView = {
  slug: string;
  /** Display name: breadcrumb, book band, book bar ("Lip Filler"); the H1 unless `heading` says more. */
  title: string;
  /** The H1 (detail.heading, else `title`). */
  heading: string;
  /** The H1's second part, on its own line (detail.headingAccent). */
  headingAccent?: string;
  /** "compact": the article H1 size from 768px (detail.headingSize). */
  headingSize?: "compact";
  /** True for a long-form page (detail.sections): no fallbacks, only its own content. */
  longform: boolean;
  /** "fra 999 kr" when the page shows the treatment's price (never on a long-form page). */
  priceFromText?: string;
  /** The "fra" amount the page shows (the structured data's Offer), same rule as `priceFromText`. */
  priceFrom?: number;
  /**
   * Category crumb (its section on /behandlinger, or its own page); the parent treatment page
   * instead when the content names one (detail.parentSlug). Omitted when it has the page's name.
   */
  category?: { name: string; href: string };
  overviewLink: Link;
  hero: {
    lead: string;
    mobileLead?: string;
    /** Paragraphs after the lead (long-form pages). */
    intro?: string[];
    image: ImageRef;
    facts: Fact[];
    /** Always on template pages ("Book tid"); on a long-form page only when the content sets one. */
    primaryCta?: Link;
    secondaryCta?: Link;
    /** In-page links to the sections' items (long-form pages with `detail.jumpLabel`). */
    jump?: { label: string; links: Link[] };
  };
  /** Long-form body (detail.sections). */
  sections?: TreatmentSection[];
  /** "Om behandlingen" band; always on template pages, on a long-form page only with `detail.about`. */
  about?: {
    paragraphs: string[];
    mobileParagraphs?: string[];
    listLabel: string;
    items: string[];
  };
  practitioner?: {
    member: TeamMember;
    image: ImageRef;
    heading: string;
    mobileTitle?: string;
    text: string;
    mobileText?: string;
    quote?: string;
    link: Link;
    mobileCta: Link;
  };
  results?: { title: string; intro?: string; items: BeforeAfter[] };
  /** Verified reviews about the treatment, filled up with general ones (content/reviews.ts). */
  reviews?: { eyebrow: string; title: string; intro: string; items: CustomerReview[] };
  prices?: {
    eyebrow: string;
    title: string;
    intro?: string;
    mobileIntro?: string;
    /**
     * The treatment's "fra" price without the prefix ("999 kr"), shown large in the price card;
     * only when a row of the list carries that amount (no big number the list does not back).
     */
    fromPrice?: string;
    /**
     * Line under the "fra" price (copy.prices.note); omitted when the intro mentions kontrol or
     * `extras` lists the free konsultation / kontrol rows.
     */
    note?: string;
    /** "Book tid" in the price card. */
    cta: Link;
    /** The list: one untitled group, or the groups of copy.prices.groups. */
    groups: PriceGroup[];
    /** The free konsultation / kontrol rows (fallback lists), full width under the list. */
    extras: PriceItem[];
    /** "Se alle priser" → the treatment's card on /priser. */
    link?: Link;
  };
  posts?: { eyebrow: string; title: string; intro?: string; link?: Link; items: BlogPost[] };
  faq?: FaqItem[];
  /** False when `faq` is the shared fallback (no FAQPage structured data for it). */
  faqIsOwn: boolean;
  /** Closing band: "Klar til at booke?" or a long-form page's own (detail.closing). */
  booking: { title: string; text: string | string[]; cta: Link };
  /** The mobile book bar's button: "Book tid", or the closing band's CTA on a long-form page. */
  bookBarCta: Link;
  /** Canonical path of the page. */
  path: string;
  /** Meta description. */
  description: string;
  /** <title> / og:title text (the treatment's `metaTitle`, else `title`). */
  metaTitle: string;
};

const overviewHref = routes.treatments;
const overviewLabel = mainNav.find((n) => n.kind === "treatments")?.label ?? "";

/** The treatment a "for mænd" variant borrows prices and practitioner from (see priceAliases). */
function aliasTarget(treatment: Treatment): Treatment | undefined {
  const slug = copy.priceAliases[treatment.slug];
  return slug ? getTreatment(slug) : undefined;
}

/**
 * Team member featured on a page: explicit slug, override map, the member who offers it,
 * or else the practitioner of the treatment it is a variant of.
 */
function findPractitioner(treatment: Treatment, followAlias = true): TeamMember | undefined {
  const slug = treatment.detail?.practitionerSlug ?? copy.practitionerBySlug[treatment.slug];
  const member = slug
    ? team.find((m) => m.slug === slug)
    : team.find((m) => m.profile?.offers?.items.some((o) => o.treatmentSlug === treatment.slug));
  if (member || !followAlias) return member;
  const target = aliasTarget(treatment);
  return target ? findPractitioner(target, false) : undefined;
}

/** Name inside a sentence: "skinbooster", "kæbelinje for mænd"; brand names and acronyms unchanged. */
function nameInSentence(treatment: Treatment, name: string): string {
  if (copy.brandNames.includes(treatment.slug)) return name;
  const [first, second] = name;
  if (!first || (second && second !== second.toLocaleLowerCase(site.locale))) return name;
  return first.toLocaleLowerCase(site.locale) + name.slice(1);
}

/** A /priser row as a price-card row. */
function toPriceItem(row: PriceListRow): PriceItem {
  return {
    label: row.label,
    note: row.note,
    price: formatPriceValue(row.price),
    amount: row.price.kind === "amount" ? row.price.amount : undefined,
  };
}

/**
 * Price rows from content/prices.ts for a treatment without its own list: rows tagged with
 * its slug (or its alias's), or untagged rows in its category card that name it, narrowed
 * to `priceRowLabels` when set. `extras`: the konsultation rows from `extraRows`.
 */
function priceRowsFromPriceList(treatment: Treatment): { items: PriceItem[]; extras: PriceItem[]; cardId?: string } {
  const slug = copy.priceAliases[treatment.slug] ?? treatment.slug;
  const target = getTreatment(slug) ?? treatment;
  const name = target.name.toLocaleLowerCase(site.locale);
  const only = copy.priceRowLabels[treatment.slug];
  const cards = priceCards.filter((c) => c.categorySlug === target.categorySlug);
  const items: PriceItem[] = [];
  let cardId: string | undefined;
  for (const card of cards) {
    for (const row of card.rows) {
      const matches = only
        ? only.includes(row.label)
        : row.treatmentSlug
          ? row.treatmentSlug === slug
          : row.label.toLocaleLowerCase(site.locale).includes(name);
      if (!matches) continue;
      cardId ??= card.id;
      items.push(toPriceItem(row));
    }
  }
  if (!items.length) return { items, extras: [] };
  // `priceRowLabels` also sets the order (the treatment's own row first), not the price list's.
  if (only) items.sort((a, b) => only.indexOf(a.label) - only.indexOf(b.label));

  const extraCard = priceCards.find((c) => c.id === copy.prices.extraRowsCardId);
  const extraLabels = copy.prices.extraRows[target.categorySlug] ?? copy.prices.extraRows.default ?? [];
  const extras = extraLabels.flatMap((label) => {
    const row = extraCard?.rows.find((r) => r.label === label);
    return row ? [toPriceItem(row)] : [];
  });
  return { items, extras, cardId };
}

/**
 * `items` in the groups of copy.prices.groups[key]: the rows in no group first (untitled), then
 * each group in its own order. A grouped label missing from `items` is a content error.
 */
function groupPriceItems(items: PriceItem[], key: string | undefined): PriceGroup[] {
  const groups = key ? copy.prices.groups[key] : undefined;
  if (!groups?.length) return [{ items }];
  const byLabel = new Map(items.map((item) => [item.label, item]));
  const grouped = new Set(groups.flatMap((g) => g.labels));
  const rest = items.filter((item) => !grouped.has(item.label));
  const titled = groups.map((g) => ({
    title: g.title,
    note: g.note,
    items: g.labels.map((label) => {
      const item = byLabel.get(label);
      if (!item) throw new Error(`treatmentPage.prices.groups["${key}"]: no price row "${label}"`);
      // The group's note replaces the rows' own ("gælder områderne ovenfor").
      return g.note ? { ...item, note: undefined } : item;
    }),
  }));
  return rest.length ? [{ items: rest }, ...titled] : titled;
}

/** Everything /behandlinger/[slug] renders for `treatment`, with the fallbacks applied. */
export function buildTreatmentView(treatment: Treatment): TreatmentView {
  const d = treatment.detail;
  const longform = Boolean(d?.sections?.length);
  const title = d?.title ?? treatment.name;
  const category = treatmentCategories.find((c) => c.slug === treatment.categorySlug);
  const parent = d?.parentSlug ? getTreatment(d.parentSlug) : undefined;
  if (d?.parentSlug && !parent) throw new Error(`treatments: "${treatment.slug}" has an unknown parentSlug "${d.parentSlug}"`);
  // A long-form page says what a price depends on instead of a "fra" price (menus and cards keep it).
  const shownPrice = longform ? undefined : treatment.priceFrom;
  const priceFromText = shownPrice !== undefined ? formatPriceFrom(shownPrice) : undefined;
  const bookHref = site.booking.href;

  /* Practitioner: on a long-form page only the one its content names */
  const member = longform
    ? d?.practitionerSlug
      ? team.find((m) => m.slug === d.practitionerSlug)
      : undefined
    : findPractitioner(treatment);
  const practitioner: TreatmentView["practitioner"] = member
    ? {
        member,
        image: member.crops?.practitioner ?? member.image,
        heading:
          d?.practitionerHeading ?? copy.practitioner.heading(member.name, member.title?.split(" · ")[0] ?? member.role),
        mobileTitle: d?.mobile?.practitionerTitle ?? member.titleShort ?? member.title ?? member.role,
        text: d?.practitionerText ?? member.bio ?? member.bioShort ?? "",
        mobileText: d?.mobile?.practitionerText ?? (d?.practitionerText ? undefined : member.bioShort),
        quote: d?.practitionerQuote,
        link: copy.practitioner.teamLink,
        mobileCta: d?.mobile?.practitionerCta ?? {
          label: copy.practitioner.bookWith(member.name),
          href: member.bookingHref ?? bookHref,
        },
      }
    : undefined;

  /* Prices: its own list, else the list of the treatment it is a variant of, else /priser rows
     (a long-form page: its own list only) */
  const alias = longform ? undefined : aliasTarget(treatment);
  const listSource = d?.prices?.length ? d : alias?.detail?.prices?.length ? alias.detail : undefined;
  const allPricesLink = (cardId?: string): Link => ({
    label: copy.prices.allPricesLink.label,
    href: cardId ? `${copy.prices.allPricesLink.href}#${cardId}` : copy.prices.allPricesLink.href,
  });
  // Shared by both kinds of list: the "fra" price (only when a row has that amount), the note
  // under it (unless the intro or the free rows already say it) and "Book tid" in the card.
  const priceCard = (intro: string | undefined, groups: PriceGroup[], extras: PriceItem[]) => {
    const backed = groups.some((g) => g.items.some((item) => item.amount === treatment.priceFrom));
    const noteSaid = extras.length > 0 || (intro !== undefined && copy.prices.noteCoveredBy(intro));
    return {
      eyebrow: copy.prices.eyebrow,
      fromPrice: treatment.priceFrom !== undefined && backed ? formatPrice(treatment.priceFrom) : undefined,
      note: noteSaid ? undefined : copy.prices.note,
      cta: { label: ui.bookCta, href: bookHref },
      groups,
      extras,
    };
  };
  let prices: TreatmentView["prices"];
  if (listSource?.prices?.length) {
    // "Se alle priser" → the /priser card the list was taken from (a row label in common, e.g.
    // Laser for mænd), else the card of its category (or its alias's).
    const ownLabels = new Set(listSource.prices.map((r) => r.label));
    const categorySlug = (alias ?? treatment).categorySlug;
    const sourceCard =
      priceCards.find((c) => c.rows.some((r) => ownLabels.has(r.label))) ??
      priceCards.find((c) => c.categorySlug === categorySlug);
    const items: PriceItem[] = listSource.prices.map((r) => ({
      label: r.label,
      mobileLabel: r.mobileLabel,
      note: r.note,
      price: r.amount !== undefined ? formatPrice(r.amount) : r.price,
      amount: r.amount,
    }));
    const groupsKey = listSource === d ? treatment.slug : alias?.slug;
    prices = {
      ...priceCard(listSource.pricesIntro, groupPriceItems(items, groupsKey), []),
      title: listSource.pricesTitle ?? copy.prices.fallbackTitle,
      intro: listSource.pricesIntro,
      mobileIntro: listSource.mobile?.pricesIntro,
      link: allPricesLink(sourceCard?.id),
    };
  } else if (!longform) {
    const { items, extras, cardId } = priceRowsFromPriceList(treatment);
    if (items.length) {
      const intro = d?.pricesIntro ?? copy.prices.fallbackIntro;
      prices = {
        ...priceCard(intro, [{ items }], extras),
        title: d?.pricesTitle ?? copy.prices.fallbackTitle,
        intro,
        link: allPricesLink(cardId),
      };
    }
  }

  /* Blog (a long-form page: only the posts its content names) */
  const postItems = longform ? postsBySlugs(d?.relatedPostSlugs).slice(0, 3) : relatedPostsForTreatment(treatment);
  const [firstPost] = postItems;
  const sharedCategory = firstPost?.categorySlug
    ? postItems.every((p) => p.categorySlug === firstPost.categorySlug)
    : false;
  const posts: TreatmentView["posts"] = firstPost
    ? {
        eyebrow: copy.posts.eyebrow,
        title: d?.relatedPostsTitle ?? copy.posts.title(nameInSentence(treatment, title)),
        intro: d?.relatedPostsIntro ?? copy.posts.intro,
        link:
          d?.relatedPostsLink ??
          (sharedCategory && firstPost.categorySlug
            ? copy.posts.categoryPostsLink(firstPost.category, firstPost.categorySlug)
            : copy.posts.allPostsLink),
        items: postItems,
      }
    : undefined;

  /* Reviews: its own, filled up to 5 with general ones (the heading only names it when all are
     its own); none on the rynkebehandling pages (content/reviews.ts → treatmentsWithoutReviews). */
  const reviewSelection = reviewsFor({ treatment: treatment.slug, seed: treatment.slug, min: 5 });
  const reviews: TreatmentView["reviews"] = reviewSelection.reviews.length
    ? {
        eyebrow: copy.reviews.eyebrow,
        title: reviewSelection.allSpecific
          ? copy.reviews.title(nameInSentence(treatment, treatment.name))
          : copy.reviews.generalTitle,
        intro: copy.reviews.intro,
        items: reviewSelection.reviews,
      }
    : undefined;

  const faqIsOwn = Boolean(d?.faq?.length);
  const faq = d?.faq?.length ? d.faq : longform ? undefined : copy.faq.fallback;

  /* Fallback "Om behandlingen": one-liner + a sentence about its category (or its alias's). */
  const categoryText =
    (alias && copy.fallbackAbout.categoryText[alias.categorySlug]) ??
    copy.fallbackAbout.categoryText[treatment.categorySlug];
  const sameName = (a: string, b: string) => a.toLocaleLowerCase(site.locale) === b.toLocaleLowerCase(site.locale);
  const crumb = parent
    ? { name: parent.detail?.title ?? parent.name, href: treatmentHref(parent.slug) }
    : category
      ? // Its own page when it has one (For mænd), else its section on the overview.
        { name: category.name, href: treatmentCategoryHref(category.slug) }
      : undefined;

  /* Jump links to the sections' items with an id ("Lip flip" → #lip-flip) */
  const jumpLinks: Link[] = (d?.sections ?? []).flatMap((s) =>
    (s.items ?? []).flatMap((item) => (item.id ? [{ label: item.navLabel ?? item.title, href: `#${item.id}` }] : [])),
  );
  const closing = longform ? d?.closing : undefined;
  const bookingCta = { label: copy.booking.cta(title, priceFromText), href: bookHref };

  return {
    slug: treatment.slug,
    title,
    heading: d?.heading ?? title,
    headingAccent: d?.headingAccent,
    headingSize: d?.headingSize,
    longform,
    priceFromText,
    priceFrom: shownPrice,
    category: crumb && !sameName(crumb.name, title) ? crumb : undefined,
    overviewLink: { label: overviewLabel, href: overviewHref },
    hero: {
      lead: d?.lead ?? treatment.short,
      mobileLead: d?.mobile?.lead,
      intro: d?.intro,
      image: d?.heroImage ?? copy.categoryImages[treatment.categorySlug] ?? copy.defaultImage,
      facts: d?.facts?.length ? d.facts : longform ? [] : copy.fallbackFacts(priceFromText),
      primaryCta: d?.primaryCta ?? (longform ? undefined : { label: ui.bookCta, href: bookHref }),
      secondaryCta: d?.secondaryCta ?? (longform ? undefined : copy.hero.secondaryCta),
      jump: d?.jumpLabel && jumpLinks.length ? { label: d.jumpLabel, links: jumpLinks } : undefined,
    },
    sections: longform ? d?.sections : undefined,
    about: d?.about?.length
      ? {
          paragraphs: d.about,
          mobileParagraphs: d.mobile?.about,
          listLabel: copy.about.goodForLabel,
          items: d.goodFor ?? [],
        }
      : longform
        ? undefined
        : {
            paragraphs: [
              categoryText ? `${treatment.short} ${categoryText}` : treatment.short,
              ...copy.fallbackAbout.paragraphs,
            ],
            listLabel: copy.fallbackAbout.listLabel,
            items: copy.fallbackAbout.items,
          },
    practitioner,
    results: d?.results?.length
      ? { title: d.resultsTitle ?? copy.results.title(title), intro: d.resultsIntro, items: d.results }
      : undefined,
    reviews,
    prices,
    posts,
    faq,
    faqIsOwn,
    booking: closing
      ? { title: closing.title, text: closing.paragraphs, cta: closing.cta }
      : {
          title: copy.booking.title,
          text: d?.bookingText ?? copy.booking.fallbackText,
          cta: bookingCta,
        },
    bookBarCta: closing?.cta ?? { label: ui.bookCta, href: bookingCta.href },
    path: treatmentHref(treatment.slug),
    description: d?.metaDescription ?? d?.lead ?? copy.metaDescription(treatment.short, priceFromText),
    metaTitle: treatment.metaTitle ?? title,
  };
}

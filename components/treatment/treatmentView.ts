/**
 * Resolves a Treatment from /content into everything the treatment page renders,
 * applying the fallbacks from content/pages/treatments.ts for treatments that have
 * no `detail`. Pure data — no React, no copy of its own.
 */
import { site } from "@/config/site";
import { treatmentCategories, mainNav } from "@/content/navigation";
import { treatmentPage as copy } from "@/content/pages/treatments";
import { priceCards } from "@/content/prices";
import { routes } from "@/content/routes";
import { team } from "@/content/team";
import { getTreatment } from "@/content/treatments";
import type { BeforeAfter, BlogPost, FaqItem, ImageRef, Link, TeamMember, Treatment } from "@/content/types";
import { ui } from "@/content/ui";
import { formatPrice } from "@/lib/format";
import { formatPriceFrom, formatPriceValue, relatedPostsForTreatment } from "@/lib/content";

export type Fact = { label: string; value: string };

export type PriceItem = {
  label: string;
  /** Shorter label below 768px. */
  mobileLabel?: string;
  /** Small muted text after the label ("pr. område"). */
  note?: string;
  price: string;
};

export type TreatmentView = {
  slug: string;
  /** Display name: H1, breadcrumb, book band, book bar ("Lip Filler"). */
  title: string;
  /** "fra 999 kr" when the treatment has a price. */
  priceFromText?: string;
  /** Category crumb; omitted when the category has the same name as the treatment. */
  category?: { name: string; href: string };
  overviewLink: Link;
  hero: {
    lead: string;
    mobileLead?: string;
    image: ImageRef;
    facts: Fact[];
    primaryCta: Link;
    secondaryCta: Link;
  };
  about: {
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
  prices?: {
    eyebrow: string;
    title: string;
    intro?: string;
    mobileIntro?: string;
    items: PriceItem[];
    link?: Link;
  };
  posts?: { eyebrow: string; title: string; intro?: string; link?: Link; items: BlogPost[] };
  faq?: FaqItem[];
  /** False when `faq` is the shared fallback (no FAQPage structured data for it). */
  faqIsOwn: boolean;
  booking: { title: string; text: string; cta: Link };
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

/** Name inside a sentence: "skinbooster", "botox for mænd"; brand names and acronyms unchanged. */
function nameInSentence(treatment: Treatment, name: string): string {
  if (copy.brandNames.includes(treatment.slug)) return name;
  const [first, second] = name;
  if (!first || (second && second !== second.toLocaleLowerCase(site.locale))) return name;
  return first.toLocaleLowerCase(site.locale) + name.slice(1);
}

/**
 * Price rows from content/prices.ts for a treatment without its own list: rows tagged with
 * its slug (or its alias's), or untagged rows in its category card that name it, narrowed
 * to `priceRowLabels` when set. The konsultation rows from `extraRows` are appended.
 */
function priceRowsFromPriceList(treatment: Treatment): { items: PriceItem[]; cardId?: string } {
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
      items.push({ label: row.label, note: row.note, price: formatPriceValue(row.price) });
    }
  }
  if (!items.length) return { items };

  const extraCard = priceCards.find((c) => c.id === copy.prices.extraRowsCardId);
  const extraLabels = copy.prices.extraRows[target.categorySlug] ?? copy.prices.extraRows.default ?? [];
  for (const label of extraLabels) {
    const row = extraCard?.rows.find((r) => r.label === label);
    if (row) items.push({ label: row.label, note: row.note, price: formatPriceValue(row.price) });
  }
  return { items, cardId };
}

/** Everything /behandlinger/[slug] renders for `treatment`, with the fallbacks applied. */
export function buildTreatmentView(treatment: Treatment): TreatmentView {
  const d = treatment.detail;
  const title = d?.title ?? treatment.name;
  const category = treatmentCategories.find((c) => c.slug === treatment.categorySlug);
  const priceFromText = treatment.priceFrom !== undefined ? formatPriceFrom(treatment.priceFrom) : undefined;
  const bookHref = site.booking.href;

  /* Practitioner */
  const member = findPractitioner(treatment);
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

  /* Prices: its own list, else the list of the treatment it is a variant of, else /priser rows */
  const alias = aliasTarget(treatment);
  const listSource = d?.prices?.length ? d : alias?.detail?.prices?.length ? alias.detail : undefined;
  let prices: TreatmentView["prices"];
  if (listSource?.prices?.length) {
    prices = {
      eyebrow: copy.prices.eyebrow,
      title: listSource.pricesTitle ?? copy.prices.fallbackTitle,
      intro: listSource.pricesIntro,
      mobileIntro: listSource.mobile?.pricesIntro,
      items: listSource.prices.map((r) => ({
        label: r.label,
        mobileLabel: r.mobileLabel,
        note: r.note,
        price: r.amount !== undefined ? formatPrice(r.amount) : r.price,
      })),
    };
  } else {
    const { items, cardId } = priceRowsFromPriceList(treatment);
    if (items.length) {
      prices = {
        eyebrow: copy.prices.eyebrow,
        title: d?.pricesTitle ?? copy.prices.fallbackTitle,
        intro: d?.pricesIntro ?? copy.prices.fallbackIntro,
        items,
        link: {
          label: copy.prices.allPricesLink.label,
          href: cardId ? `${copy.prices.allPricesLink.href}#${cardId}` : copy.prices.allPricesLink.href,
        },
      };
    }
  }

  /* Blog */
  const postItems = relatedPostsForTreatment(treatment);
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

  const faqIsOwn = Boolean(d?.faq?.length);
  const faq = d?.faq?.length ? d.faq : copy.faq.fallback;

  /* Fallback "Om behandlingen": one-liner + a sentence about its category (or its alias's). */
  const categoryText =
    (alias && copy.fallbackAbout.categoryText[alias.categorySlug]) ??
    copy.fallbackAbout.categoryText[treatment.categorySlug];
  const sameName = (a: string, b: string) => a.toLocaleLowerCase(site.locale) === b.toLocaleLowerCase(site.locale);

  return {
    slug: treatment.slug,
    title,
    priceFromText,
    category:
      category && !sameName(category.name, title)
        ? { name: category.name, href: `${overviewHref}#${category.slug}` }
        : undefined,
    overviewLink: { label: overviewLabel, href: overviewHref },
    hero: {
      lead: d?.lead ?? treatment.short,
      mobileLead: d?.mobile?.lead,
      image: d?.heroImage ?? copy.categoryImages[treatment.categorySlug] ?? copy.defaultImage,
      facts: d?.facts?.length ? d.facts : copy.fallbackFacts(priceFromText),
      primaryCta: { label: ui.bookCta, href: bookHref },
      secondaryCta: d?.secondaryCta ?? copy.hero.secondaryCta,
    },
    about: d?.about?.length
      ? {
          paragraphs: d.about,
          mobileParagraphs: d.mobile?.about,
          listLabel: copy.about.goodForLabel,
          items: d.goodFor,
        }
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
    prices,
    posts,
    faq,
    faqIsOwn,
    booking: {
      title: copy.booking.title,
      text: d?.bookingText ?? copy.booking.fallbackText,
      cta: { label: copy.booking.cta(title, priceFromText), href: bookHref },
    },
    path: `${overviewHref}/${treatment.slug}`,
    description: d?.lead ?? copy.metaDescription(treatment.short, priceFromText),
    metaTitle: treatment.metaTitle ?? title,
  };
}

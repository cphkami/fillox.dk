/**
 * Builds the serialisable data the (client) header menus need from /content.
 * Runs on the server inside <Header/>, so the client bundle only receives the
 * resolved labels, links and formatted prices.
 */
import { clinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { mainNav, megaMenu, treatmentCategories, treatmentCategoryHref } from "@/content/navigation";
import { priceCards, pricesPage, type PriceCard } from "@/content/prices";
import { routes } from "@/content/routes";
import { getTreatment, treatmentHref } from "@/content/treatments";
import type { Clinic, Link, MegaMenuContent, NavItem } from "@/content/types";
import { ui } from "@/content/ui";
import { site } from "@/config/site";
import { formatPriceFrom } from "@/lib/content";

export type MenuTreatment = {
  slug: string;
  /** Name in the desktop mega menu. */
  name: string;
  /** Name in the mobile menu level 2 (design mm3): Treatment.mobileMenuName ?? name. */
  mobileName: string;
  href: string;
  price?: string;
};

/** Desktop "Behandlinger" mega menu: content/navigation.ts → megaMenu with the treatments resolved. */
export type MegaMenuData = {
  columns: { eyebrow: string; items: MenuTreatment[]; allLink?: Link }[];
  tag: MegaMenuContent["tag"];
  promo: MegaMenuContent["promo"];
};

export type MenuCategory = {
  slug: string;
  /** Category title (level-2 heading), e.g. "For mænd". */
  name: string;
  /** Row label in the mobile menu (mobileName || name). */
  label: string;
  /** "Se alle …" link at the bottom of level 2. */
  allLabel: string;
  href: string;
  treatments: MenuTreatment[];
};

export type MenuClinic = {
  slug: string;
  name: string;
  address: string[];
  /** Pre-formatted opening hours, e.g. ["Man–fre 10–19", "Lør–søn 10–17"]. */
  hours: string[];
  /** Anchor on the clinics page. */
  href: string;
  bookingHref: string;
  comingSoon: boolean;
  openingNote?: string;
};

/** One price category in the desktop "Priser" dropdown. */
export type MenuPriceCategory = {
  id: string;
  title: string;
  /** Card label from the price list, e.g. "HYALURONSYRE". */
  eyebrow: string;
  /** Lowest price in the category, e.g. "fra 799 kr", or "Gratis" for a free category. */
  price?: string;
  /** Anchor on the prices page, e.g. "/priser#fillers". */
  href: string;
};

export type MenuPrices = {
  categories: MenuPriceCategory[];
  /** The prices page ("Se alle priser →"). */
  href: string;
  /** Trust points in the side card ("Gratis konsultation", "Finansiering mulig" …). */
  trust: string[];
  /** Financing teaser in the side card, linking to the financing box on the prices page. */
  financing: { title: string; text: string; cta: string; href: string };
};

export type HeaderData = {
  nav: NavItem[];
  megaMenu: MegaMenuData;
  categories: MenuCategory[];
  clinics: MenuClinic[];
  clinicsHref: string;
  prices: MenuPrices;
};

function toMenuTreatment(slug: string): MenuTreatment | undefined {
  const t = getTreatment(slug);
  if (!t) return undefined;
  return {
    slug: t.slug,
    name: t.name,
    mobileName: t.mobileMenuName ?? t.name,
    href: treatmentHref(t.slug),
    price: t.priceFrom != null ? formatPriceFrom(t.priceFrom) : undefined,
  };
}

function resolveTreatments(slugs: string[]): MenuTreatment[] {
  return slugs.map(toMenuTreatment).filter((t): t is MenuTreatment => Boolean(t));
}

/**
 * "fra 799 kr" for a price card: the lowest Treatment.priceFrom in the card's category (the same
 * "fra" price the front page, /behandlinger and the treatment pages show; add-on rows such as
 * "Opløsning af filler" are not a filler treatment), else the lowest amount in the card's rows;
 * "Gratis" when the card only has free rows.
 */
function lowestPrice(card: PriceCard): string | undefined {
  const category = treatmentCategories.find((c) => c.slug === card.categorySlug);
  const fromPrices = (category?.treatments ?? []).flatMap((slug) => {
    const from = getTreatment(slug)?.priceFrom;
    return from == null ? [] : [from];
  });
  if (fromPrices.length) return formatPriceFrom(Math.min(...fromPrices));
  const amounts = card.rows.flatMap((r) => (r.price.kind === "amount" ? [r.price.amount] : []));
  if (amounts.length) return formatPriceFrom(Math.min(...amounts));
  if (card.rows.some((r) => r.price.kind === "free")) return ui.free;
  return undefined;
}

/** Link to a clinic on the clinics page, e.g. "/klinikker#city2". */
function clinicAnchor(clinic: Clinic, clinicsHref: string): string {
  return `${clinicsHref}#${clinic.slug}`;
}

/** Nav items, mega menu, mobile menu categories, clinics and prices for <Header/>. */
export function buildHeaderData(): HeaderData {
  const clinicsHref = routes.clinics;
  const pricesHref = routes.prices;

  return {
    nav: mainNav,
    megaMenu: {
      columns: megaMenu.columns.map((col) => ({
        eyebrow: col.eyebrow,
        items: resolveTreatments(col.treatmentSlugs),
        allLink: col.allLink,
      })),
      tag: megaMenu.tag,
      promo: megaMenu.promo,
    },
    categories: treatmentCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
      label: c.mobileName ?? c.name,
      allLabel: layoutCopy.mobileMenu.categoryAllLabels[c.slug] ?? ui.seeAllTreatments,
      // The category's own page when it has one ("For mænd" → /behandlinger/for-maend), else its
      // section on /behandlinger (content/navigation.ts → treatmentCategoryHref).
      href: treatmentCategoryHref(c.slug),
      treatments: resolveTreatments(c.treatments),
    })),
    clinics: clinics.map((c) => ({
      slug: c.slug,
      name: c.name,
      address: c.address,
      hours: c.hours.map((h) => `${h.days} ${h.hours}`),
      href: clinicAnchor(c, clinicsHref),
      bookingHref: c.bookingHref ?? site.booking.href,
      comingSoon: c.status === "coming-soon",
      openingNote: c.openingNote,
    })),
    clinicsHref,
    prices: {
      categories: priceCards.map((card) => ({
        id: card.id,
        title: card.title,
        eyebrow: card.eyebrow,
        price: lowestPrice(card),
        href: `${pricesHref}#${card.id}`,
      })),
      href: pricesHref,
      trust: [...pricesPage.trustChips],
      financing: {
        title: pricesPage.financing.title,
        text: pricesPage.financing.textShort,
        cta: layoutCopy.header.pricesMenu.financingCta,
        href: `${pricesHref}#${pricesPage.financing.id}`,
      },
    },
  };
}

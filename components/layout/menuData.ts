/**
 * Builds the serialisable data the (client) header menus need from /content.
 * Runs on the server inside <Header/>, so the client bundle only receives the
 * resolved labels, links and formatted prices.
 */
import { clinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { mainNav, megaMenuColumns, megaMenuPromo, treatmentCategories } from "@/content/navigation";
import { getTreatment, treatmentHref } from "@/content/treatments";
import type { Clinic, ImageRef, NavItem } from "@/content/types";
import { ui } from "@/content/ui";
import { site } from "@/config/site";
import { formatPrice } from "@/lib/format";

export type MenuTreatment = {
  slug: string;
  /** Name in the desktop mega menu (design 6menu). */
  name: string;
  /** Name in the mobile menu level 2 (design mm3): Treatment.mobileMenuName ?? name. */
  mobileName: string;
  href: string;
  price?: string;
};

export type MegaColumn = { title: string; items: MenuTreatment[] };

export type MegaPromo = { title: string; text: string; link: { label: string; href: string }; image: ImageRef };

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
  /** Pre-formatted opening hours, e.g. ["Man–fre 10–20", "Lør–søn 10–18"]. */
  hours: string[];
  /** Anchor on the clinics page. */
  href: string;
  bookingHref: string;
  comingSoon: boolean;
  openingNote?: string;
};

export type HeaderData = {
  nav: NavItem[];
  megaColumns: MegaColumn[];
  megaPromo: MegaPromo;
  categories: MenuCategory[];
  clinics: MenuClinic[];
  clinicsHref: string;
};

function toMenuTreatment(slug: string): MenuTreatment | undefined {
  const t = getTreatment(slug);
  if (!t) return undefined;
  return {
    slug: t.slug,
    name: t.name,
    mobileName: t.mobileMenuName ?? t.name,
    href: treatmentHref(t.slug),
    price: t.priceFrom != null ? `${ui.from} ${formatPrice(t.priceFrom)}` : undefined,
  };
}

function resolveTreatments(slugs: string[]): MenuTreatment[] {
  return slugs.map(toMenuTreatment).filter((t): t is MenuTreatment => Boolean(t));
}

/** Link to a clinic on the clinics page, e.g. "/klinikker#city2". */
export function clinicAnchor(clinic: Clinic, clinicsHref: string): string {
  return `${clinicsHref}#${clinic.slug}`;
}

export function buildHeaderData(): HeaderData {
  const clinicsHref = mainNav.find((n) => n.kind === "clinics")?.href ?? "/klinikker";
  const treatmentsHref = mainNav.find((n) => n.kind === "treatments")?.href ?? "/behandlinger";

  return {
    nav: mainNav,
    megaColumns: megaMenuColumns.map((col) => ({
      title: col.title,
      items: resolveTreatments(
        col.categorySlugs.flatMap((slug) => treatmentCategories.find((c) => c.slug === slug)?.treatments ?? []),
      ),
    })),
    megaPromo: megaMenuPromo,
    categories: treatmentCategories.map((c) => ({
      slug: c.slug,
      name: c.name,
      label: c.mobileName ?? c.name,
      allLabel: layoutCopy.mobileMenu.categoryAllLabels[c.slug] ?? ui.seeAllTreatments,
      href: `${treatmentsHref}#${c.slug}`,
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
  };
}

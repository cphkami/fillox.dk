import { site } from "@/config/site";
import { openClinics } from "@/content/clinics";
import { routes } from "@/content/routes";
import { layoutCopy } from "@/content/layout";
import { priceCards } from "@/content/prices";
import { seoContent } from "@/content/seo";
import type { Clinic, OpeningHours } from "@/content/types";
import { formatPrice } from "@/lib/format";
import { JsonLd, absoluteUrl } from "./JsonLd";

/** @id of the organisation node; other structured data references it (publisher, provider …). */
export const ORGANIZATION_ID = `${site.url}/#organization`;
/** @id of the website node (WebPage `isPartOf`). */
export const WEBSITE_ID = `${site.url}/#website`;

/** "tel:+4535100050" → "+4535100050". */
const telephone = site.contact.phoneHref.replace(/^tel:/, "");

/** ["Cityringen 2, Plan 3", "2630 Taastrup"] → schema.org PostalAddress. */
function postalAddress(lines: string[]) {
  const last = lines.at(-1) ?? "";
  const match = last.match(/^(\d+)\s+(.+)$/);
  return {
    "@type": "PostalAddress",
    streetAddress: lines.slice(0, -1).join(", ") || undefined,
    postalCode: match?.[1],
    addressLocality: match ? match[2] : last,
    addressCountry: site.country,
  };
}

/** "10" / "9.30" / "9:30" → "10:00" / "09:30". */
const toTime = (hours: string, minutes?: string) => `${hours.padStart(2, "0")}:${minutes ?? "00"}`;

/** [{ days: "Man–fre", hours: "10–19" }] → schema.org OpeningHoursSpecification[]. */
function openingHours(hours: OpeningHours[]) {
  return hours.flatMap(({ days, hours: range }) => {
    const dayOfWeek = seoContent.openingDays[days];
    const match = range.match(/^(\d{1,2})(?:[.:](\d{2}))?\s*[–-]\s*(\d{1,2})(?:[.:](\d{2}))?$/);
    if (!dayOfWeek || !match) return [];
    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek,
        opens: toTime(match[1], match[2]),
        closes: toTime(match[3], match[4]),
      },
    ];
  });
}

/**
 * "299 kr – 5.999 kr": the lowest and highest numeric price on the price list
 * (content/prices.ts), the same at every clinic.
 */
function priceRange(): string | undefined {
  const amounts = priceCards.flatMap((card) =>
    card.rows.flatMap((row) => (row.price.kind === "amount" ? [row.price.amount] : [])),
  );
  if (!amounts.length) return undefined;
  return `${formatPrice(Math.min(...amounts))} – ${formatPrice(Math.max(...amounts))}`;
}

/** The clinic's anchor on the clinics page, e.g. https://fillox.dk/klinikker#city2. */
function clinicUrl(clinic: Clinic) {
  return `${absoluteUrl(routes.clinics)}#${clinic.slug}`;
}

/** Builds the JSON-LD graph: the organisation, the website and one node per open clinic. */
export function organizationGraph() {
  const { meta } = layoutCopy;
  const range = priceRange();
  const clinicNodes = openClinics.map((clinic) => ({
    "@type": ["MedicalBusiness", "BeautySalon"],
    "@id": clinicUrl(clinic),
    name: clinic.fullName,
    url: clinicUrl(clinic),
    image: absoluteUrl(clinic.seoImage ?? seoContent.clinicImage),
    telephone,
    email: site.contact.email,
    address: postalAddress(clinic.address),
    ...(clinic.geo ? { geo: { "@type": "GeoCoordinates", ...clinic.geo } } : {}),
    openingHoursSpecification: openingHours(clinic.hours),
    hasMap: clinic.directionsHref,
    currenciesAccepted: site.currency,
    ...(range ? { priceRange: range } : {}),
    parentOrganization: { "@id": ORGANIZATION_ID },
  }));

  return [
    {
      // An organisation with several addresses: the brand is the MedicalOrganization; each
      // clinic is its own local business (MedicalBusiness + BeautySalon) with address and hours.
      "@type": "MedicalOrganization",
      "@id": ORGANIZATION_ID,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      logo: absoluteUrl(site.brand.logoDark),
      image: absoluteUrl(meta.ogImage.src),
      description: meta.description,
      email: site.contact.email,
      telephone,
      identifier: {
        "@type": "PropertyValue",
        propertyID: site.company.registrationLabel,
        value: site.company.registrationNumber,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone,
        email: site.contact.email,
        availableLanguage: site.lang,
      },
      sameAs: [site.social.instagram, site.trustpilot.url],
      location: clinicNodes.map((node) => ({ "@id": node["@id"] })),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: site.name,
      url: site.url,
      inLanguage: site.lang,
      publisher: { "@id": ORGANIZATION_ID },
    },
    ...clinicNodes,
  ];
}

/**
 * schema.org structured data for Fillox (organisation, website and open clinics), all
 * from config/site.ts + content/clinics.ts. Rendered once, in the root layout.
 */
export function OrganizationJsonLd() {
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": organizationGraph() }} />;
}

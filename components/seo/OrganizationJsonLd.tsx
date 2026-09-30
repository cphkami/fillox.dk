import { site } from "@/config/site";
import { openClinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { mainNav } from "@/content/navigation";
import { seoContent } from "@/content/seo";
import type { Clinic, OpeningHours } from "@/content/types";

const abs = (path: string) => new URL(path, site.url).toString();

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/** "tel:+4535100050" → "+4535100050". */
const telephone = site.contact.phoneHref.replace(/^tel:/, "");

/** ["Cityringen 2, Plan 3", "2630 Høje Taastrup"] → schema.org PostalAddress. */
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

/** [{ days: "Man–fre", hours: "10–20" }] → schema.org OpeningHoursSpecification[]. */
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

/** The clinic's anchor on the clinics page, e.g. https://fillox.dk/klinikker#city2. */
function clinicUrl(clinic: Clinic) {
  const clinicsHref = mainNav.find((item) => item.kind === "clinics")?.href ?? "/";
  return `${abs(clinicsHref)}#${clinic.slug}`;
}

/** Builds the JSON-LD graph: the organisation, the website and one node per open clinic. */
export function organizationGraph() {
  const { meta } = layoutCopy;
  const clinicNodes = openClinics.map((clinic) => ({
    "@type": ["MedicalBusiness", "BeautySalon"],
    "@id": clinicUrl(clinic),
    name: clinic.fullName,
    url: clinicUrl(clinic),
    image: abs(clinic.seoImage ?? seoContent.clinicImage),
    telephone,
    email: site.contact.email,
    address: postalAddress(clinic.address),
    ...(clinic.geo ? { geo: { "@type": "GeoCoordinates", ...clinic.geo } } : {}),
    openingHoursSpecification: openingHours(clinic.hours),
    hasMap: clinic.directionsHref,
    currenciesAccepted: site.currency,
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
      logo: abs(site.brand.logoDark),
      image: abs(meta.ogImage.src),
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
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": organizationGraph() }).replace(
    /</g,
    "\\u003c",
  );
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

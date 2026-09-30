import { ORGANIZATION_ID, WEBSITE_ID } from "@/components/seo";
import { site } from "@/config/site";

/**
 * schema.org ContactPage. The organisation (phone, e-mail, contact point) is the
 * MedicalOrganization the root layout emits, so this page only references it by @id.
 */
export function ContactJsonLd({ path, title }: { path: string; title: string }) {
  const url = new URL(path, site.url).toString();
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#webpage`,
    name: title,
    url,
    inLanguage: site.lang,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": ORGANIZATION_ID },
  };
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

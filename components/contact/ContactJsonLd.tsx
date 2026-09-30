import { JsonLd, ORGANIZATION_ID, WEBSITE_ID, absoluteUrl } from "@/components/seo";
import { site } from "@/config/site";

/**
 * schema.org ContactPage. The organisation (phone, e-mail, contact point) is the
 * MedicalOrganization the root layout emits, so this page only references it by @id.
 */
export function ContactJsonLd({ path, title }: { path: string; title: string }) {
  const url = absoluteUrl(path);
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
  return <JsonLd data={data} />;
}

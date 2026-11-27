import { JsonLd, ORGANIZATION_ID, absoluteUrl, breadcrumbList } from "@/components/seo";
import type { Link } from "@/content/types";

/**
 * schema.org for a category page that lists treatment pages (/behandlinger/fillers): a
 * CollectionPage whose ItemList links the treatment pages (each carries its own Service and
 * Offer), and the BreadcrumbList (Behandlinger → the category, as on its treatment pages). No
 * reviews and no FAQ (the page has none), as /behandlinger/for-maend minus its FAQ.
 */
export function TreatmentCollectionJsonLd({
  path,
  name,
  description,
  breadcrumb,
  items,
}: {
  path: string;
  name: string;
  description: string;
  breadcrumb: Link[];
  /** The listed pages: their names (the treatment's page title) and paths. */
  items: Link[];
}) {
  const url = absoluteUrl(path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      url,
      name,
      description,
      publisher: { "@id": ORGANIZATION_ID },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.label,
          url: absoluteUrl(item.href),
        })),
      },
    },
    breadcrumbList(breadcrumb),
  ];
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

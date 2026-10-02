import { JsonLd, ORGANIZATION_ID, absoluteUrl, breadcrumbList } from "@/components/seo";
import type { MenPage } from "@/content/pages/men";
import type { MenTreatmentRow } from "./menView";

/**
 * schema.org for /behandlinger/for-maend: a CollectionPage whose ItemList links the four
 * treatment pages (each carries its own Service), the BreadcrumbList (Behandlinger → For mænd,
 * as the treatment pages) and the page's own FAQ as FAQPage. No reviews (see content/pages/men.ts).
 */
export function MenJsonLd({ copy, rows }: { copy: Pick<MenPage, "path" | "meta" | "breadcrumb" | "faq">; rows: MenTreatmentRow[] }) {
  const url = absoluteUrl(copy.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      url,
      name: copy.meta.title,
      description: copy.meta.description,
      publisher: { "@id": ORGANIZATION_ID },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: rows.map((row, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: row.treatmentName,
          url: absoluteUrl(row.href),
        })),
      },
    },
    breadcrumbList(copy.breadcrumb),
  ];
  if (copy.faq.items.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: copy.faq.items.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

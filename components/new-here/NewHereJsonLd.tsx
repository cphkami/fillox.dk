import { JsonLd, ORGANIZATION_ID, absoluteUrl } from "@/components/seo";
import type { NewHerePage } from "@/content/pages/new-here";

/**
 * schema.org for /ny-hos-fillox: the WebPage (published by the organisation in the root layout's
 * graph) and the page's own FAQ as FAQPage. No reviews, no offers.
 */
export function NewHereJsonLd({ copy }: { copy: Pick<NewHerePage, "path" | "meta" | "faq"> }) {
  const url = absoluteUrl(copy.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#page`,
      url,
      name: copy.meta.title,
      description: copy.meta.description,
      publisher: { "@id": ORGANIZATION_ID },
    },
  ];
  if (copy.faq.items.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: copy.faq.items.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

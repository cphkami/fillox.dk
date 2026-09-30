import { site } from "@/config/site";
import type { TreatmentView } from "./treatmentView";

/**
 * schema.org BreadcrumbList + FAQPage for a treatment page.
 * The category crumb is left out: it is an anchor on the overview (/behandlinger#fillers),
 * which search engines treat as the overview URL itself. The shared fallback FAQ is not
 * marked up (it would be the same FAQPage on every page without its own FAQ).
 */
export function TreatmentJsonLd({ view }: { view: TreatmentView }) {
  const abs = (path: string) => new URL(path, site.url).toString();
  const crumbs = [view.overviewLink, { label: view.title, href: view.path }];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        item: abs(c.href),
      })),
    },
  ];
  if (view.faqIsOwn && view.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: view.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

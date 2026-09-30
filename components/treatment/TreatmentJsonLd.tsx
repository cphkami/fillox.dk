import { JsonLd, ORGANIZATION_ID, absoluteUrl, breadcrumbList } from "@/components/seo";
import { site } from "@/config/site";
import { getTreatment } from "@/content/treatments";
import type { TreatmentView } from "./treatmentView";

/**
 * schema.org Service + BreadcrumbList + FAQPage for a treatment page.
 * The Service is provided by the site-wide organisation node (root layout), whose clinics
 * carry the addresses; its Offer is the treatment's "fra" price (a minimum, not a fixed price).
 * The category crumb is left out: it is an anchor on the overview (/behandlinger#fillers),
 * which search engines treat as the overview URL itself. The shared fallback FAQ is not
 * marked up (it would be the same FAQPage on every page without its own FAQ).
 */
export function TreatmentJsonLd({ view }: { view: TreatmentView }) {
  const url = absoluteUrl(view.path);
  const priceFrom = getTreatment(view.slug)?.priceFrom;
  const crumbs = [view.overviewLink, { label: view.title, href: view.path }];
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: view.title,
      description: view.description,
      url,
      image: absoluteUrl(view.hero.image.src),
      provider: { "@id": ORGANIZATION_ID },
      ...(priceFrom !== undefined
        ? {
            offers: {
              "@type": "Offer",
              url,
              price: priceFrom,
              priceCurrency: site.currency,
              priceSpecification: { "@type": "PriceSpecification", minPrice: priceFrom, priceCurrency: site.currency },
            },
          }
        : {}),
    },
    breadcrumbList(crumbs),
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
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

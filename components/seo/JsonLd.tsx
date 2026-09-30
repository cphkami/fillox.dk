import { site } from "@/config/site";

/** Absolute URL on the market's domain (config/site.ts → url) for a site path. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}

/** schema.org BreadcrumbList for a page's crumbs, in order (hrefs are made absolute). */
export function breadcrumbList(crumbs: { label: string; href: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  };
}

/**
 * Structured data as a `<script type="application/ld+json">`. "<" is escaped, so no string in
 * the data can close the script element.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

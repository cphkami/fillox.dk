import type { Metadata } from "next";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import type { TextPageContent } from "@/content/types";

/** Route metadata for a text page: title, description, canonical and Open Graph. */
export function textPageMetadata(content: TextPageContent, path: string): Metadata {
  const { meta } = content;
  const { ogImage, titleTemplate } = layoutCopy.meta;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    // Nested objects replace the root layout's, so repeat the shared Open Graph fields.
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale.replace("-", "_"),
      url: path,
      title: titleTemplate.replace("%s", meta.title),
      description: meta.description,
      images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
  };
}

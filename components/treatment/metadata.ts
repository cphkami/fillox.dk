import type { Metadata } from "next";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import type { ImageRef } from "@/content/types";

type OgImage = ImageRef & { width?: number; height?: number };

/**
 * Route metadata for /behandlinger and /behandlinger/[slug]: title, description,
 * canonical and Open Graph (same shape as the other routes, e.g. /priser).
 */
export function treatmentsMetadata({
  title,
  description,
  path,
  image = layoutCopy.meta.ogImage,
}: {
  title: string;
  description: string;
  path: string;
  /** Sharing image; defaults to the site-wide one. */
  image?: OgImage;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    // Nested objects replace the root layout's, so repeat the shared Open Graph fields.
    // Twitter title/description/image fall back to these (the layout sets the card type).
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale.replace("-", "_"),
      url: path,
      title: layoutCopy.meta.titleTemplate.replace("%s", title),
      description,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
  };
}

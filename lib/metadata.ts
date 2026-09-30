/**
 * Route metadata (title, description, canonical, Open Graph) from config/site.ts and /content.
 *
 * A route's `openGraph` object replaces the root layout's as a whole, so every route repeats
 * the shared fields (site name, locale, image). Twitter title / description / image fall back
 * to the Open Graph ones (the root layout sets the card type).
 */
import type { Metadata } from "next";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import type { ImageRef } from "@/content/types";

/** Site name + Open Graph locale ("da-DK" → "da_DK"), shared by every route's openGraph. */
export const sharedOpenGraph = {
  siteName: site.name,
  locale: site.locale.replace("-", "_"),
};

/** A title as it reads in <title>, e.g. "Blog · Fillox" (the root layout's title template). */
export function shareTitle(title: string): string {
  return layoutCopy.meta.titleTemplate.replace("%s", title);
}

/** Open Graph image for a content image; the size is added when the content knows it. */
export function shareImage(image: ImageRef) {
  return {
    url: image.src,
    alt: image.alt,
    ...(image.width && image.height ? { width: image.width, height: image.height } : {}),
  };
}

/**
 * Metadata of an ordinary route: title (through the root layout's template), description,
 * canonical `path` and a "website" Open Graph block. The share image defaults to the site's
 * (content/layout.ts → meta.ogImage).
 */
export function pageMetadata(
  meta: { title: string; description: string },
  path: string,
  image: ImageRef = layoutCopy.meta.ogImage,
): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      ...sharedOpenGraph,
      url: path,
      title: shareTitle(meta.title),
      description: meta.description,
      images: [shareImage(image)],
    },
  };
}

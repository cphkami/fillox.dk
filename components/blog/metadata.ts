/**
 * Open Graph helpers for the blog routes. A route's `openGraph` object replaces the
 * root layout's as a whole, so the shared fields (site name, locale, image) are
 * repeated here; Twitter title/description/image fall back to them (the root layout
 * sets the card type).
 */
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import type { ImageRef } from "@/content/types";

/** Site name + locale from the root layout's Open Graph block. */
export const sharedOpenGraph = {
  siteName: site.name,
  locale: site.locale.replace("-", "_"),
};

/** Title as it reads in <title>: "Blog · Fillox" (root layout template). */
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

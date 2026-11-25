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

/**
 * The page base colour (`--color-cream` in app/globals.css): the browser UI tint (root layout
 * `viewport.themeColor`) and the web app manifest's theme / background colour (app/manifest.ts).
 * Change it together with the token.
 */
export const pageColor = "#fafaf8";

/** Site name + Open Graph locale ("da-DK" → "da_DK"), shared by every route's openGraph. */
export const sharedOpenGraph = {
  siteName: site.name,
  locale: site.locale.replace("-", "_"),
};

/** A title as it reads in <title>, e.g. "Blog · Fillox" (the root layout's title template). */
export function shareTitle(title: string): string {
  return layoutCopy.meta.titleTemplate.replace("%s", title);
}

/**
 * Open Graph image for a content image: its link-preview crop (`share`) when it has one, else the
 * file itself. The size is added when the content knows it.
 */
export function shareImage(image: ImageRef) {
  const file = image.share ?? image;
  return {
    url: file.src,
    alt: image.alt,
    ...(file.width && file.height ? { width: file.width, height: file.height } : {}),
  };
}

/**
 * Narrowest width : height a page's own share image may have. Link previews (Facebook, LinkedIn,
 * X's large card) centre-crop og:image to 1.91 : 1, so a portrait photo loses its face there.
 */
const MIN_SHARE_ASPECT = 1.5;

/**
 * A page's share image: its own photo when that has a link-preview crop (`share`, content/
 * photos.ts) or is landscape enough, else the site's default (content/layout.ts →
 * meta.ogImage). A photo of unknown size is used as it is.
 */
export function pageShareImage(image: ImageRef): ImageRef {
  const file = image.share ?? image;
  if (!file.width || !file.height || file.width / file.height >= MIN_SHARE_ASPECT) return image;
  return layoutCopy.meta.ogImage;
}

/**
 * Metadata of an ordinary route: title (through the root layout's template), description,
 * canonical `path` and a "website" Open Graph block. The share image defaults to the site's
 * (content/layout.ts → meta.ogImage); a page's own photo goes through `pageShareImage`.
 *
 * `absoluteTitle`: the title already names the brand ("Ny hos Fillox? …"), so it is used as it
 * is, without the template's " · Fillox" (no brand twice, and it stays within ~60 characters).
 */
export function pageMetadata(
  meta: { title: string; description: string; absoluteTitle?: boolean },
  path: string,
  image: ImageRef = layoutCopy.meta.ogImage,
): Metadata {
  return {
    title: meta.absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      ...sharedOpenGraph,
      url: path,
      title: meta.absoluteTitle ? meta.title : shareTitle(meta.title),
      description: meta.description,
      images: [shareImage(pageShareImage(image))],
    },
  };
}

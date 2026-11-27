import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { isIndexable } from "@/lib/indexing";

/**
 * /robots.txt — everything is crawlable except the Netlify Forms detection file
 * (public/__forms.html, never linked; it declares the forms that are still at Netlify Forms,
 * config/site.ts → forms); points to the generated sitemap. A build that is not
 * indexable (the netlify.app copy, previews: lib/indexing.ts) disallows everything.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/__forms.html" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * /robots.txt — everything is crawlable except the Netlify Forms detection file
 * (public/__forms.html, never linked); points to the generated sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/__forms.html" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

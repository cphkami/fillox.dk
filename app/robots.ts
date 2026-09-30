import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/** /robots.txt — everything is crawlable; points to the generated sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

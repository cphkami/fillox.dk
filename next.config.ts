import type { NextConfig } from "next";
import { legacyRedirects } from "./content/redirects";

const nextConfig: NextConfig = {
  /**
   * The built-in "/foo/ → /foo" redirect is replaced by the last rule in redirects() below,
   * so legacy URLs with a trailing slash (every URL in the old WordPress sitemap) reach
   * their new route in ONE 308 hop instead of two.
   */
  skipTrailingSlashRedirect: true,

  /** Legacy fillox.dk URLs → new routes (308). Data lives in content/redirects.ts. */
  async redirects() {
    return [
      // Each legacy path with and without its trailing slash.
      ...legacyRedirects.flatMap(({ source, destination }) => [
        { source, destination, permanent: true },
        { source: `${source}/`, destination, permanent: true },
      ]),
      // Same behaviour as Next's default trailingSlash: false redirect (must stay last).
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
};

export default nextConfig;

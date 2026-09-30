import type { NextConfig } from "next";
import { legacyRedirects } from "./content/redirects";

const nextConfig: NextConfig = {
  /**
   * The built-in "/foo/ → /foo" redirect is replaced by the last rule in redirects() below,
   * so legacy URLs with a trailing slash (every URL in the old WordPress sitemap) reach
   * their new route in ONE 308 hop instead of two.
   */
  skipTrailingSlashRedirect: true,

  images: {
    /**
     * Next's defaults plus 1440 and 1600, the content width and the canvas of the wide layout
     * (ARCHITECTURE.md → Wide layout). Without them every need between 1200 and 1920px (wide
     * heroes at 1x, portraits on retina) is served from the 1920px bucket.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1600, 1920, 2048, 3840],
  },

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

import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { routes } from "@/content/routes";
import { pageColor } from "@/lib/metadata";

/**
 * /manifest.webmanifest — the web app manifest (name, icons, colours) for "Add to home screen"
 * and browsers that look for one. No copy of its own: the name is config/site.ts → `name`.
 * `display: "browser"`: a home-screen shortcut opens the site in the browser (a marketing site,
 * not an installable app). The icons are the app/icon.png (512) and app/apple-icon.png (180) files.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    lang: site.lang,
    start_url: routes.home,
    display: "browser",
    background_color: pageColor,
    theme_color: pageColor,
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

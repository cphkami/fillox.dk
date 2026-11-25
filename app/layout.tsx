import type { Metadata, Viewport } from "next";
import { Figtree, Poppins } from "next/font/google";
import { ConsentManager } from "@/components/consent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OrganizationJsonLd } from "@/components/seo";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { isIndexable } from "@/lib/indexing";
import { pageColor, sharedOpenGraph, shareImage } from "@/lib/metadata";
import "./globals.css";

/*
 * Figtree is the site font (body, UI); Poppins 500 is for headings only (app/globals.css →
 * font-sans / font-heading). `subsets` only picks the files that are PRELOADED: "latin" holds
 * æ ø å (Latin-1); next/font still declares the latin-ext files (unicode-range), which a browser
 * downloads only for a page that uses one of their characters.
 */
const figtree = Figtree({
  subsets: ["latin"],
  // No weight: the variable font, one file per subset for 400 (body), 500, 600 (semibold UI) and
  // 700 (eyebrows). (A "400 700" range is rejected by Turbopack's next/font.)
  variable: "--font-figtree",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-poppins",
  display: "swap",
});

const { meta } = layoutCopy;

/*
 * Dev only: the live colour tuner ("Farver", components/dev). `next dev` runs with NODE_ENV
 * "development"; a production build sees a constant false here, drops the import and ships none of
 * the tuner (no server or client code, no CSS).
 */
const DevColorTuner =
  process.env.NODE_ENV === "development" ? (await import("@/components/dev/ColorTunerMount")).ColorTunerMount : null;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: meta.defaultTitle, template: meta.titleTemplate },
  description: meta.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    ...sharedOpenGraph,
    title: meta.defaultTitle,
    description: meta.description,
    images: [shareImage(meta.ogImage)],
  },
  twitter: { card: "summary_large_image" },
  // Large image previews in Google Search and Discover (the old WordPress site sent the same).
  // index / follow are the default and stay unset, so the noindex routes' own `robots` (which
  // replaces this one as a whole) and the 404's noindex never meet an "index" here. A build that
  // is not indexable (the netlify.app copy before the domain moves: lib/indexing.ts) is noindex.
  robots: isIndexable ? { "max-image-preview": "large" } : { index: false, follow: false },
  // Favicons come from the app/favicon.ico (16/32/48, made from icon.png), app/icon.png and
  // app/apple-icon.png file conventions; app/manifest.ts links the web app manifest.
};

export const viewport: Viewport = {
  themeColor: pageColor,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${figtree.variable} ${poppins.variable} h-full`}>
      {/* min-height: the viewport plus the open cookie banner's reserve (--consent-reserve, set by
          ConsentManager), so on a short page its spacer after the footer extends the page instead
          of shrinking <main> and moving the footer up (no layout shift when the banner appears). */}
      <body className="flex min-h-[calc(100%_+_var(--consent-reserve,0px))] flex-col">
        {DevColorTuner ? <DevColorTuner /> : null}
        <a
          href={`#${layoutCopy.mainId}`}
          className="fixed top-3 left-3 z-[100] -translate-y-[200%] rounded-full bg-accent px-5 py-3 text-[14px] text-on-accent transition-transform focus:translate-y-0"
        >
          {layoutCopy.skipLink}
        </a>
        {/* Cookie banner + consent-gated GTM (config/site.ts → analytics). Right after the skip link,
            so while it is open it is the next tab stop; fixed at the bottom, rendered on the client only. */}
        {site.analytics.gtmId ? <ConsentManager /> : null}
        <Header />
        <main id={layoutCopy.mainId} tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}

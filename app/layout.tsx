import type { Metadata, Viewport } from "next";
import { Figtree, Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { OrganizationJsonLd } from "@/components/seo";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { sharedOpenGraph, shareImage } from "@/lib/metadata";
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
  // Favicons come from the app/favicon.ico (16/32/48, made from icon.png), app/icon.png and
  // app/apple-icon.png file conventions.
};

export const viewport: Viewport = {
  themeColor: "#f7f2ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${figtree.variable} ${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href={`#${layoutCopy.mainId}`}
          className="fixed top-3 left-3 z-[100] -translate-y-[200%] rounded-full bg-accent px-5 py-3 text-[14px] text-on-accent transition-transform focus:translate-y-0"
        >
          {layoutCopy.skipLink}
        </a>
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

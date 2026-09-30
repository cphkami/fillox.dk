import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    title: meta.defaultTitle,
    description: meta.description,
    images: [
      {
        url: meta.ogImage.src,
        width: meta.ogImage.width,
        height: meta.ogImage.height,
        alt: meta.ogImage.alt,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  // Favicons come from the app/icon.png + app/apple-icon.png file conventions.
};

export const viewport: Viewport = {
  themeColor: "#f7f2ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#indhold"
          className="fixed top-3 left-3 z-[100] -translate-y-[200%] rounded-full bg-plum px-5 py-3 text-[14px] text-cream transition-transform focus:translate-y-0"
        >
          {layoutCopy.skipLink}
        </a>
        <Header />
        <main id="indhold" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

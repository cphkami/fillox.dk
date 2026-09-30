import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { ResponsibleBand } from "@/components/about/ResponsibleBand";
import { TeamSection } from "@/components/about/TeamSection";
import { WhyFillox } from "@/components/about/WhyFillox";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { aboutPage } from "@/content/pages/about";
import { team } from "@/content/team";

const PATH = "/om-os";
const { meta } = aboutPage;
const { ogImage, titleTemplate } = layoutCopy.meta;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: PATH },
  // Nested objects replace the root layout's, so repeat the shared Open Graph fields.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    url: PATH,
    title: titleTemplate.replace("%s", meta.title),
    description: meta.description,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
};

/** /om-os — Om os (design 6om desktop, mo mobile). */
export default function AboutPage() {
  return (
    <>
      <AboutHero hero={aboutPage.hero} titleId="about-title" />
      <WhyFillox why={aboutPage.why} titleId="about-why-title" />
      <TeamSection copy={aboutPage.team} members={team} titleId="about-team-title" />
      <ResponsibleBand copy={aboutPage.responsible} />
    </>
  );
}

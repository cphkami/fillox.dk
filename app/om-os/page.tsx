import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { ResponsibleBand } from "@/components/about/ResponsibleBand";
import { TeamSection } from "@/components/about/TeamSection";
import { WhyFillox } from "@/components/about/WhyFillox";
import { aboutPage } from "@/content/pages/about";
import { routes } from "@/content/routes";
import { team } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";

const PATH = routes.about;
const { meta } = aboutPage;

export const metadata: Metadata = pageMetadata(meta, PATH);

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

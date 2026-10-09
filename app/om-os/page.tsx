import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { CenteredSection } from "@/components/about/CenteredSection";
import { DoctorSection } from "@/components/about/DoctorSection";
import { MethodsBand } from "@/components/about/MethodsBand";
import { SplitSection } from "@/components/about/SplitSection";
import { TeamSection } from "@/components/about/TeamSection";
import { WelcomeBand } from "@/components/about/WelcomeBand";
import { aboutPage } from "@/content/pages/about";
import { routes } from "@/content/routes";
import { getTeamMember, team } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";

const PATH = routes.about;
const { meta, academy, doctor, consistency, methods, value } = aboutPage;

export const metadata: Metadata = pageMetadata(meta, PATH);

const doctorMember = getTeamMember(doctor.slug);

/**
 * /om-os — Om os (design 6om desktop, mo mobile; the owner's new "Om Fillox" text, October
 * 2026, content/pages/about.ts). The sections follow the source's order and alternate their
 * layout, so the long text reads in steps: hero (sand panel) · Fillox Academy (two columns) ·
 * the doctor (sand panel with his portrait) · "Samme kompetence" (one centred column) · "mere end
 * ét værktøj" (rose band) · quality and price (two columns) · the team (heading, intro, grid;
 * anchor `behandlere`) · "Velkommen til Fillox" (rose band with the two buttons).
 */
export default function AboutPage() {
  if (!doctorMember) throw new Error(`/om-os: no team member "${doctor.slug}" (content/team.ts)`);
  return (
    <>
      <AboutHero hero={aboutPage.hero} titleId="about-title" />
      <SplitSection id={academy.id} title={academy.title} statement={academy.statement} paragraphs={academy.paragraphs} />
      <DoctorSection copy={doctor} member={doctorMember} />
      <CenteredSection copy={consistency} />
      <MethodsBand copy={methods} />
      {/* Followed by the team section on the same cream: its top padding is the gap. */}
      <SplitSection
        id={value.id}
        title={value.title}
        paragraphs={value.paragraphs}
        className="pb-2 md:pb-6 lg:pb-fluid-24"
      />
      <TeamSection copy={aboutPage.team} members={team} titleId="about-team-title" />
      <WelcomeBand copy={aboutPage.welcome} />
    </>
  );
}

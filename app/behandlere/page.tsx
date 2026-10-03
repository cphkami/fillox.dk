import type { Metadata } from "next";
import { ResponsibleBand } from "@/components/about/ResponsibleBand";
import { PractitionerCard } from "@/components/practitioner/PractitionerCard";
import { Container, Eyebrow } from "@/components/ui";
import { aboutPage } from "@/content/pages/about";
import { practitionerPage } from "@/content/pages/practitioner";
import { routes } from "@/content/routes";
import { team } from "@/content/team";
import { pageMetadata } from "@/lib/metadata";

const PATH = routes.practitioners;
const copy = practitionerPage.index;

export const metadata: Metadata = pageMetadata(copy.meta, PATH);

/**
 * /behandlere — every practitioner as an equal card linking to /behandlere/<slug>, laid out like
 * "Mød vores behandlere" on /om-os: 3 columns from 1024px (six members = 2 rows of 3), 2 from
 * 560px, 1 below (at most 26rem wide, centred with the heading, so the 4:5 portraits stay
 * ≈ 500px high at most on large phones). Team order, so Dr. Tom (fagligt ansvarlig læge) comes first. Gaps: 16px between
 * the white mobile cards; from 768px 28px between columns (32 from 1536px) and 48px between rows,
 * growing to 56px at 1600.
 * Closes with the "Fagligt ansvarlig" band from /om-os (desktop only, as there).
 */
export default function PractitionersIndexPage() {
  return (
    <>
      <Container as="section" aria-labelledby="behandlere-title" className="pt-8 pb-14 md:pt-fluid-64 md:pb-10 lg:pb-fluid-40">
        <div className="mb-5 max-[560px]:mx-auto max-[560px]:max-w-[26rem] md:mb-fluid-56 md:text-center">
          <Eyebrow className="mb-3 md:mb-3.5">{copy.eyebrow}</Eyebrow>
          <h1
            id="behandlere-title"
            className="font-heading text-[36px] leading-[1.08] tracking-display text-heading md:text-[52px] md:leading-[1.02] md:tracking-hero lg:text-h1"
          >
            {copy.title}
          </h1>
        </div>

        <ul className="grid grid-cols-1 gap-4 max-[560px]:mx-auto max-[560px]:max-w-[26rem] min-[560px]:grid-cols-2 md:gap-x-7 md:gap-y-12 lg:grid-cols-3 xl:gap-y-[clamp(48px,calc(16px+2.5vw),56px)] 2xl:gap-x-8">
          {team.map((member, i) => (
            <li key={member.slug} className="flex">
              <PractitionerCard member={member} priority={i === 0} />
            </li>
          ))}
        </ul>
      </Container>
      <ResponsibleBand copy={aboutPage.responsible} />
    </>
  );
}

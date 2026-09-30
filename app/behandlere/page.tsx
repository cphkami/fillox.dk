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
 * /behandlere — every practitioner as a card linking to /behandlere/<slug>, laid out like
 * "Mød vores behandlere" on /om-os (6om / mo): the featured member (fagligt ansvarlig) as a
 * wide block, the others in a 4-column grid (2 on tablets). Below 768px every member is a
 * white card: one column, two from 640px. The grid's column gap lives in --team-gap-x
 * (28px, 32 from 1536px) so the featured block can use it from 1280px (see PractitionerCard).
 * Closes with the "Fagligt ansvarlig" band from /om-os (desktop only, as there).
 */
export default function PractitionersIndexPage() {
  const featured = team.filter((m) => m.featured);
  const others = team.filter((m) => !m.featured);

  return (
    <>
      <Container as="section" aria-labelledby="behandlere-title" className="pt-8 pb-14 md:pt-fluid-64 md:pb-10 lg:pb-fluid-40">
        <div className="mb-5 md:mb-fluid-56 md:text-center">
          <Eyebrow className="mb-3 md:mb-3.5">{copy.eyebrow}</Eyebrow>
          <h1
            id="behandlere-title"
            className="text-[36px] leading-[1.08] font-semibold tracking-display md:text-[52px] md:leading-[1.02] lg:text-h1"
          >
            {copy.title}
          </h1>
        </div>

        <ul className="grid grid-cols-1 gap-4 [--team-gap-x:28px] sm:grid-cols-2 md:gap-x-(--team-gap-x) md:gap-y-12 lg:grid-cols-4 2xl:[--team-gap-x:32px]">
          {featured.map((member, i) => (
            <li key={member.slug} className="flex md:col-span-2 md:mb-6 lg:col-span-4">
              <PractitionerCard member={member} featured priority={i === 0} />
            </li>
          ))}
          {others.map((member, i) => (
            <li key={member.slug} className="flex">
              {/* Without a featured member the first grid card is the top of the page. */}
              <PractitionerCard member={member} priority={featured.length === 0 && i === 0} />
            </li>
          ))}
        </ul>
      </Container>
      <ResponsibleBand copy={aboutPage.responsible} />
    </>
  );
}

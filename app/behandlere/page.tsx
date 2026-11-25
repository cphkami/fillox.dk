import type { Metadata } from "next";
import { ResponsibleBand } from "@/components/about/ResponsibleBand";
import { PractitionerCard } from "@/components/practitioner/PractitionerCard";
import { teamGridStart } from "@/components/practitioner/teamGrid";
import { Container, Eyebrow } from "@/components/ui";
import { aboutPage } from "@/content/pages/about";
import { practitionerPage } from "@/content/pages/practitioner";
import { routes } from "@/content/routes";
import { teamRoster } from "@/content/team";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/metadata";

const PATH = routes.practitioners;
const copy = practitionerPage.index;

export const metadata: Metadata = pageMetadata(copy.meta, PATH);

/**
 * /behandlere — everyone on the team as an equal card (content/team.ts → teamRoster), laid out
 * like "Mød vores behandlere" on /om-os: 3 columns from 1024px, 2 from 560px, 1 below (at most
 * 26rem wide, centred with the heading, so the portraits stay ≈ 400px high at most on large
 * phones). Six members fill the rows (3 + 3 from 1024px, 2 + 2 + 2 at 560–1023px); a short last
 * row would be centred as there (components/practitioner/teamGrid.ts: twice the tracks, every
 * card spans two). A card links to /behandlere/<slug> when the member has a profile page; a member
 * without one (no texts or photo yet) is the same card without a link, with the portrait
 * placeholder while the photo is missing (PractitionerCard).
 * Team order, so Dr. Tom (fagligt ansvarlig læge) comes first. Gaps: 16px between
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

        <ul className="grid grid-cols-1 gap-4 max-[560px]:mx-auto max-[560px]:max-w-[26rem] min-[560px]:grid-cols-4 md:gap-x-7 md:gap-y-12 lg:grid-cols-6 xl:gap-y-[clamp(48px,calc(16px+2.5vw),56px)] 2xl:gap-x-8">
          {teamRoster.map((member, i) => {
            const twoColumns = teamGridStart(i, teamRoster.length, 2, "min-[560px]");
            return (
              <li
                key={member.slug}
                className={cn(
                  "flex min-[560px]:col-span-2",
                  twoColumns,
                  teamGridStart(i, teamRoster.length, 3, "lg", Boolean(twoColumns)),
                )}
              >
                <PractitionerCard member={member} priority={i === 0} />
              </li>
            );
          })}
        </ul>
      </Container>
      <ResponsibleBand copy={aboutPage.responsible} />
    </>
  );
}

import { Container, Eyebrow } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import type { TeamMember } from "@/content/types";
import { TeamMemberCard } from "./TeamMemberCard";

type TeamSectionProps = { copy: AboutPageCopy["team"]; members: TeamMember[]; titleId: string };

/**
 * "Mød vores behandlere" (6om / mo). Every member as an equal card, in team order (Dr. Tom, the
 * fagligt ansvarlig læge, first): 3 columns from 1024px, so six members are 2 rows of 3 (the
 * owner, replacing 6om's wide Dr. Tom block above a row of four). 2 columns from 560px (3 rows of
 * 2; three columns at 768px would leave the bios ≈ 25 characters wide), 1 below, as in mo. The
 * single column is at most 26rem wide (centred), so the portraits (33:34 below 768px, 4:5 from
 * there, TeamMemberCard) stay ≈ 400px high at most on large phones.
 * Dr. Tom's role as fagligt ansvarlig stays in his bio and in the ResponsibleBand under the grid.
 *
 * Gaps: 16px between the white mobile cards; from 768px 28px between columns (32 xl, 40 2xl) and
 * 48px between rows (56 xl).
 */
export function TeamSection({ copy, members, titleId }: TeamSectionProps) {
  return (
    <Container
      as="section"
      id={copy.id}
      aria-labelledby={titleId}
      className="py-14 md:pt-24 md:pb-10 lg:pt-fluid-96 lg:pb-fluid-40"
    >
      <div className="mb-4 text-center md:mb-14 lg:mb-fluid-56">
        <Eyebrow className="mb-2.5 md:mb-3.5">{copy.eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:py-[.2em] md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>
      </div>

      {/* role="list": Safari drops list semantics from lists styled with list-style: none. */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-4 max-[560px]:mx-auto max-[560px]:max-w-[26rem] min-[560px]:grid-cols-2 md:gap-x-7 md:gap-y-12 lg:grid-cols-3 xl:gap-x-8 xl:gap-y-14 2xl:gap-x-10"
      >
        {members.map((member) => (
          <li key={member.slug} className="flex">
            <TeamMemberCard member={member} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

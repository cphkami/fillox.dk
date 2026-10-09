import { Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import type { TeamMember } from "@/content/types";
import { TeamMemberCard } from "./TeamMemberCard";

type TeamSectionProps = { copy: AboutPageCopy["team"]; members: TeamMember[]; titleId: string };

/**
 * "Mød menneskene bag Fillox" (6om / mo "Mød vores behandlere", with the owner's new heading and
 * intro, October 2026): the centred heading and its two short paragraphs (`text-body`, 52ch),
 * then the grid. The source's "[Mød vores team]" button is the hero's in-page link to this
 * section (its id is the `behandlere` anchor that the nav and other pages link to).
 * Every member as an equal card, in team order (Dr. Tom, the
 * fagligt ansvarlig læge, first): 3 columns from 1024px, so six members are 2 rows of 3 (the
 * owner, replacing 6om's wide Dr. Tom block above a row of four). 2 columns from 560px (3 rows of
 * 2; three columns at 768px would leave the bios ≈ 25 characters wide), 1 below, as in mo. The
 * single column is at most 26rem wide (centred), so the portraits (33:34 below 768px, 4:5 from
 * there, TeamMemberCard) stay ≈ 400px high at most on large phones.
 * Dr. Tom's role is introduced above the grid on /om-os (DoctorSection) and stays in his bio.
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
      className="py-14 md:pt-20 md:pb-10 lg:pt-fluid-96 lg:pb-fluid-40"
    >
      <div className="mb-6 max-[560px]:mx-auto max-[560px]:max-w-[26rem] md:mb-14 md:text-center lg:mb-fluid-56">
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] tracking-display text-balance text-heading md:py-[.2em] md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>
        <div className="mt-3 grid gap-3 text-body leading-[1.7] text-pretty text-muted md:mx-auto md:mt-4 md:max-w-[52ch] md:gap-3.5 md:leading-[1.75]">
          {copy.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
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

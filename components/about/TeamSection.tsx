import { Container, Eyebrow } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import type { TeamMember } from "@/content/types";
import { TeamMemberCard } from "./TeamMemberCard";

type TeamSectionProps = { copy: AboutPageCopy["team"]; members: TeamMember[]; titleId: string };

/**
 * "Mød vores behandlere" (6om / mo). The featured member (fagligt ansvarlig) comes
 * first and spans the full width; the rest sit in a 4-column grid on desktop and
 * a 2×2 grid on tablets. Below 768px every member is a white card: one column,
 * two from 560px (the featured card then runs horizontally across both).
 *
 * The column gap lives in --team-gap-x (28px, 32 xl, 40 2xl) so the featured block can
 * reuse it from 1280px: its photo then spans exactly the first two grid columns.
 */
export function TeamSection({ copy, members, titleId }: TeamSectionProps) {
  const featured = members.filter((m) => m.featured);
  const others = members.filter((m) => !m.featured);

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
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:py-[.2em] md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>
      </div>

      {/* role="list": Safari drops list semantics from lists styled with list-style: none. */}
      <ul
        role="list"
        className="grid grid-cols-1 gap-4 [--team-gap-x:28px] min-[560px]:grid-cols-2 md:gap-x-(--team-gap-x) md:gap-y-12 lg:grid-cols-4 xl:gap-y-14 xl:[--team-gap-x:32px] 2xl:[--team-gap-x:40px]"
      >
        {featured.map((member) => (
          <li key={member.slug} className="flex min-[560px]:col-span-2 md:mb-6 lg:col-span-4">
            <TeamMemberCard member={member} featured />
          </li>
        ))}
        {others.map((member) => (
          <li key={member.slug} className="flex">
            <TeamMemberCard member={member} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

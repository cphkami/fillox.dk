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
 */
export function TeamSection({ copy, members, titleId }: TeamSectionProps) {
  const featured = members.filter((m) => m.featured);
  const others = members.filter((m) => !m.featured);

  return (
    <Container
      as="section"
      id={copy.id}
      aria-labelledby={titleId}
      className="py-14 md:pt-24 md:pb-10"
    >
      <div className="mb-4 text-center md:mb-14">
        <Eyebrow className="mb-2.5 md:mb-3.5">{copy.eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:text-[40px] md:leading-normal"
        >
          {copy.title}
        </h2>
      </div>

      {/* role="list": Safari drops list semantics from lists styled with list-style: none. */}
      <ul role="list" className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 md:gap-x-7 md:gap-y-12 lg:grid-cols-4">
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

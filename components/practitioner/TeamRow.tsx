import Link from "next/link";
import { ArrowLink, Container, Photo } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import { teamMemberHref } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { PORTRAIT_TOP_POSITION } from "./profile";

type TeamRowProps = { members: TeamMember[]; titleId: string };

/**
 * "Mød resten af teamet" — closes a profile that has no content sections of its own.
 * Styled like the home page team row (6a / mf): from 768px a powder panel with the
 * portraits in a 4-column row; below 768px a horizontal scroll-snap row on the page
 * background. Every portrait links to that practitioner's profile.
 */
export function TeamRow({ members, titleId }: TeamRowProps) {
  const copy = practitionerPage.otherTeam;

  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div className="flex flex-col gap-4 px-2 pt-4 pb-14 md:gap-0 md:rounded-[24px] md:bg-powder md:px-10 md:py-16 lg:px-14 lg:py-[84px]">
        <h2
          id={titleId}
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-12 md:text-center md:text-[40px] md:leading-[1.1]"
        >
          {copy.title}
        </h2>

        {/* Below 768px: scroll row bleeding to the right edge; the 6px padding keeps focus rings unclipped. */}
        <ul
          aria-label={copy.listLabel}
          className="-my-1.5 -mr-5 -ml-1.5 flex snap-x snap-mandatory scroll-pl-1.5 gap-3 overflow-x-auto overscroll-x-contain py-1.5 pr-5 pl-1.5 [scrollbar-width:none] md:m-0 md:grid md:snap-none md:grid-cols-4 md:gap-5 md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
        >
          {members.map((member) => (
            <li key={member.slug} className="w-[150px] flex-none snap-start md:w-auto">
              <Link href={teamMemberHref(member.slug)} className="group block rounded-[18px] md:rounded-[20px]">
                <Photo
                  image={{ ...member.image, position: PORTRAIT_TOP_POSITION, zoom: undefined }}
                  sizes="(min-width: 1180px) 240px, (min-width: 768px) 22vw, 150px"
                  radius="var(--photo-radius)"
                  className="h-[190px] [--photo-radius:18px] md:aspect-[190/268] md:h-auto md:[--photo-radius:20px]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <h3 className="mt-2.5 text-[16px] font-semibold text-plum md:mt-[18px] md:border-t md:border-plum md:pt-3.5 md:text-[20px] md:tracking-display md:text-ink md:group-hover:text-plum">
                  {member.name}
                </h3>
                <p className="text-[13px] text-muted md:mt-1 md:text-[12px] md:tracking-[2px] md:text-plum md:uppercase">
                  {member.role}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-[15px] leading-[44px] md:mt-12 md:text-center md:text-[14px] md:leading-normal">
          <ArrowLink href={copy.link.href} className="max-md:text-[15px]">
            {copy.link.label}
          </ArrowLink>
        </p>
      </div>
    </Container>
  );
}

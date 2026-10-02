import Link from "next/link";
import { ArrowLink, Container, Photo, ScrollRow } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import { teamMemberHref } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { PORTRAIT_TOP_POSITION } from "./profile";

type TeamRowProps = { members: TeamMember[]; titleId: string };

/**
 * "Mød resten af teamet" — closes a profile that has no content sections of its own.
 * Styled like the home page team row (6a / mf): from 768px a panel with the portraits in a
 * 4-column row; below 768px a horizontal scroll-snap row on the page background. Every
 * portrait links to that practitioner's profile.
 *
 * The panel is sand, not the home row's secondary beige: it sits right on top of the footer, and
 * secondary (#E4D6CB) next to the footer's #DCCBBB (1.11:1) reads as one muddy block (see BookingBand).
 *
 * Names: the home row's 20px up to 1280px, then 20 → 25px at 1600 (the portraits here are
 * much taller than the home row's, ≈ 326×460 at 1600); no token runs 20 → 25, hence the clamp
 * (same formula as the type scale).
 */
export function TeamRow({ members, titleId }: TeamRowProps) {
  const copy = practitionerPage.otherTeam;

  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div className="flex flex-col gap-4 px-2 pt-4 pb-14 md:gap-0 md:rounded-[24px] md:bg-sand md:px-10 md:py-16 lg:px-14 lg:py-fluid-84 xl:px-16 2xl:px-20">
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mb-fluid-48 md:text-center md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>

        {/* Below 768px: scroll row bleeding to the right edge; the 6px padding keeps focus rings
            unclipped, and ScrollRow brings a keyboard-focused card fully into view. */}
        <ScrollRow
          unstyled
          aria-label={copy.listLabel}
          className="-my-1.5 -mr-5 -ml-1.5 flex snap-x snap-mandatory scroll-pr-5 scroll-pl-1.5 gap-3 overflow-x-auto overscroll-x-contain py-1.5 pr-5 pl-1.5 [scrollbar-width:none] md:m-0 md:grid md:snap-none md:grid-cols-4 md:gap-5 md:overflow-visible 2xl:gap-6 md:p-0 [&::-webkit-scrollbar]:hidden"
        >
          {members.map((member) => (
            <li key={member.slug} className="w-[150px] flex-none snap-start md:w-auto">
              <Link href={teamMemberHref(member.slug)} className="group block rounded-[18px] md:rounded-[20px]">
                <Photo
                  image={{ ...member.image, position: PORTRAIT_TOP_POSITION, zoom: undefined }}
                  // 4 columns in the sand panel: (1536 − 2 × 80 − 3 × 24) / 4 ≈ 326px on the 1600px canvas.
                  sizes="(min-width: 1600px) 330px, (min-width: 768px) 22vw, 150px"
                  radius="var(--photo-radius)"
                  className="h-[190px] [--photo-radius:18px] md:aspect-[190/268] md:h-auto md:[--photo-radius:20px]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <h3 className="mt-2.5 font-heading text-[16px] text-accent md:mt-[18px] md:border-t md:border-accent md:pt-3.5 md:text-h4 md:tracking-display xl:text-[length:clamp(20px,1.5625vw,25px)] md:text-heading md:group-hover:text-accent">
                  {member.name}
                </h3>
                <p className="text-[13px] text-muted md:mt-1 md:text-micro md:tracking-[2px] md:text-accent md:uppercase">
                  {member.role}
                </p>
              </Link>
            </li>
          ))}
        </ScrollRow>

        <p className="text-[15px] leading-[44px] md:mt-fluid-48 md:text-center md:text-ui-sm md:leading-normal">
          <ArrowLink href={copy.link.href} className="max-md:text-[15px]">
            {copy.link.label}
          </ArrowLink>
        </p>
      </div>
    </Container>
  );
}

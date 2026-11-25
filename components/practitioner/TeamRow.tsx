import Link from "next/link";
import { ArrowLink, Container, ScrollRow } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import { drawnWidthScale, framedPortrait, teamMemberHref, teamSlots } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { CropPhoto } from "./CropPhoto";

type TeamRowProps = { members: TeamMember[]; titleId: string };

/**
 * "Mød resten af teamet" — closes a profile that has no content sections of its own.
 * Styled like the home page team row (6a / mf): from 768px a panel with the portraits in a
 * 4-column row; below 768px a horizontal scroll-snap row on the page background. Every
 * portrait links to that practitioner's profile.
 *
 * Portraits: framed from the face table (content/team.ts → framedPortrait), as on the other team
 * rows: the 4:5 team-card crop in the 150 × 190 mobile cards, the taller `teamSlots.row` crop
 * (190:268) from 768px.
 *
 * The panel is sand, not the home row's secondary beige: it sits right on top of the footer, and
 * sand (#EBE8DF) is 1.49:1 against the Sandbeige footer (#CDBEA7) where secondary (#E1DCCF) is
 * only 1.33:1, so the two read as separate blocks (see BookingBand).
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
          {members.map((member) => {
            const card = member.crops?.about ?? member.image;
            const tall = framedPortrait(member, teamSlots.row);
            const cardScale = drawnWidthScale(card, teamSlots.portrait.aspect);
            const tallScale = drawnWidthScale(tall, teamSlots.row.aspect);
            return (
            <li key={member.slug} className="w-[150px] flex-none snap-start md:w-auto">
              <Link href={teamMemberHref(member.slug)} className="group block rounded-[18px] md:rounded-[20px]">
                {/* The visible name and role label the link, so the portrait is decorative here.
                    4 columns in the sand panel: (1536 − 2 × 80 − 3 × 24) / 4 ≈ 326px on the
                    1600px canvas, ≈ 22vw from 768px, 150px cards below; × the crop's zoom. */}
                <CropPhoto
                  mobile={{ ...card, alt: "" }}
                  desktop={{ ...tall, alt: "" }}
                  sizes={[
                    `(min-width: 1600px) ${Math.ceil(330 * tallScale)}px`,
                    `(min-width: 768px) ${Math.ceil(22 * tallScale)}vw`,
                    `${Math.ceil(150 * cardScale)}px`,
                  ].join(", ")}
                  className="h-[190px] rounded-[18px] md:aspect-[190/268] md:h-auto md:rounded-[20px]"
                  imgClassName="transition-transform duration-500 group-hover:[transform:scale(1.03)]"
                />
                <h3 className="mt-2.5 font-heading text-[16px] text-accent md:mt-[18px] md:border-t md:border-accent md:pt-3.5 md:text-h4 md:tracking-display xl:text-[length:clamp(20px,1.5625vw,25px)] md:text-heading md:group-hover:text-accent">
                  {member.name}
                </h3>
                <p className="text-[13px] text-muted md:mt-1 md:text-micro md:tracking-[2px] md:text-accent md:uppercase">
                  {member.role}
                </p>
              </Link>
            </li>
            );
          })}
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

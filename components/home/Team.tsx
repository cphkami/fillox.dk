import Link from "next/link";
import { CropPhoto } from "@/components/practitioner/CropPhoto";
import { ArrowLink, Container, ScrollRow, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/cn";
import { drawnWidthScale, framedPortrait, teamMemberHref, teamSlots } from "@/content/team";

/**
 * "Mød hele teamet →". It sits under the heading on desktop and under the row on
 * mobile, so it is rendered in both places (one hidden) to keep the focus order equal
 * to the visual order.
 */
function TeamLink({ link, className }: { link: HomePage["team"]["link"]; className: string }) {
  return (
    <p className={className}>
      <ArrowLink href={link.href} className="max-lg:text-[15px] lg:font-normal">
        {link.label}
      </ArrowLink>
    </p>
  );
}

/**
 * "Mød dem, der behandler dig". Every practitioner as an equal card (the owner: all six side by
 * side, 2 rows of 3, as on /om-os), in team order (Dr. Tom first).
 *
 * - Mobile (mf, < 768px): the design's horizontal scroll row on the page background, 150px cards,
 *   link under the row. Kept rather than a 2-column grid: six cards in three rows would add
 *   ≈ 550px to an already long front page, while the row shows two and a half portraits (so it
 *   reads as scrollable) and "Mød hele teamet" leads to the full grid on /om-os.
 * - From 768px: a 3-column grid, so six members are 2 rows of 3 (cards are only a portrait, name
 *   and role, so three fit at 768px too). From 1024px (6a) it sits in the secondary beige panel,
 *   with "Mød hele teamet →" under the heading.
 * - Height: 6a showed five 188 × 268 cards in ONE row; two rows of 4:5 portraits filling the panel
 *   made the section 1,413px tall at 1280 and 1,708px at 1710 (≈ 1.7 screens for photo, name and
 *   role, with the full team one click away). So from 768px the portraits are the squarer 33:34
 *   slot (the mo cards' shape), and from 1280px the grid stops growing at 64rem, centred under the
 *   centred heading (cards ≈ 325px): ≈ 1,200px at 1280 and ≈ 1,250px at 1710. An exception to
 *   "Grids fill the canvas" (ARCHITECTURE.md → Wide layout).
 * - Portraits: framed from the face table (content/team.ts → framedPortrait), the same for every
 *   member: the 4:5 team-card crop in the mobile row (150 × 188, as on /om-os and /behandlere),
 *   the square crop (teamSlots.square) from 768px.
 * - Names are Poppins (font-heading): accent on mobile, heading colour from 768px under a 1px
 *   accent rule. On hover the name is underlined (and turns accent): heading and accent are both
 *   dark browns (1.2:1 apart), so the colour change alone was barely visible.
 *
 * Line height 1.5 on the section: the design's "normal" in Poppins (Figtree's is 1.2). The card
 * link has 6px of padding under the role label, so the focus ring's rounded corner (radius 18 /
 * 20px + 3px offset) clears its first letter instead of crossing it.
 */
export function Team({ copy, members }: { copy: HomePage["team"]; members: TeamMember[] }) {
  return (
    <Container as="section" gutter="surface" aria-labelledby="home-team-title" className="leading-[1.5]">
      <div className="flex flex-col gap-4 px-2 py-14 md:px-4 lg:gap-0 lg:rounded-[24px] lg:bg-secondary lg:px-14 lg:py-fluid-84 xl:px-16 2xl:px-20">
        <SectionHeading
          id="home-team-title"
          title={copy.title}
          align="left"
          leading="normal"
          className="md:mb-4 lg:mb-3.5 lg:text-center"
        />

        <TeamLink link={copy.link} className="mb-fluid-48 text-center text-ui-sm leading-[1.5] max-lg:hidden" />

        {/* Below 768px: scroll row bleeding to the right edge; the 6px padding keeps focus rings
            unclipped, and ScrollRow brings a keyboard-focused card fully into view. */}
        <ScrollRow
          unstyled
          aria-label={copy.listLabel}
          className={cn(
            "-my-1.5 -mr-5 -ml-1.5 flex snap-x snap-mandatory scroll-pr-5 scroll-pl-1.5 gap-3 overflow-x-auto overscroll-x-contain py-1.5 pr-5 pl-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "md:m-0 md:grid md:snap-none md:grid-cols-3 md:gap-x-5 md:gap-y-9 md:overflow-visible md:p-0 lg:gap-x-6 lg:gap-y-10 xl:mx-auto xl:w-full xl:max-w-[64rem] 2xl:gap-x-7 2xl:gap-y-12",
          )}
        >
          {members.map((member) => {
            const row = member.crops?.about ?? member.image;
            const grid = framedPortrait(member, teamSlots.square);
            const rowScale = drawnWidthScale(row, teamSlots.portrait.aspect);
            const gridScale = drawnWidthScale(grid, teamSlots.square.aspect);
            return (
              <li key={member.slug} className="w-[150px] flex-none snap-start md:w-auto">
                <Link href={teamMemberHref(member.slug)} className="group block rounded-[18px] pb-1.5 md:rounded-[20px]">
                  {/* The visible name and role label the link, so the portrait is decorative here.
                      `sizes`: 3 columns, at most (64rem − 2 × 28) / 3 ≈ 323px from 1280px, ≈ 29vw
                      from 768px, 150px cards below; × how much wider than its slot the crop is
                      drawn (zoom), so it stays sharp. */}
                  <CropPhoto
                    mobile={{ ...row, alt: "" }}
                    desktop={{ ...grid, alt: "" }}
                    sizes={[
                      `(min-width: 1280px) ${Math.ceil(330 * gridScale)}px`,
                      `(min-width: 768px) ${Math.ceil(29 * gridScale)}vw`,
                      `${Math.ceil(150 * rowScale)}px`,
                    ].join(", ")}
                    className="aspect-[4/5] rounded-[18px] md:aspect-[33/34] md:rounded-[20px]"
                    imgClassName="transition-transform duration-500 group-hover:[transform:scale(1.03)]"
                  />
                  <h3
                    className={cn(
                      "mt-2.5 font-heading text-[16px] text-accent decoration-1 underline-offset-4 group-hover:underline",
                      "md:mt-[18px] md:border-t md:border-accent md:pt-3.5 md:text-h4 md:tracking-display md:text-heading md:group-hover:text-accent",
                    )}
                  >
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

        <TeamLink link={copy.link} className="text-[15px] leading-[44px] md:mt-4 lg:hidden" />
      </div>
    </Container>
  );
}

import Link from "next/link";
import { CropPhoto } from "@/components/practitioner/CropPhoto";
import { ResponsiveText } from "@/components/ui";
import { drawnWidthScale, framedPortrait, teamMemberHref, teamSlots } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * One practitioner on /om-os. Every member gets the same card (the owner: all six side by side,
 * 2 rows of 3, Dr. Tom no longer a wide block on top), so the grid reads as one team.
 *
 * - Portrait: framed from the face table (content/team.ts → framedPortrait), so faces sit on one
 *   line and at one size in every card: the 4:5 team-card crop (`crops.about`) from 768px, the
 *   squarer 33:34 crop below (mo's 330 × 340 cards; 4:5 there made the six-card column ≈ 460px
 *   taller). Radius 18 below 768px, 24 from there.
 * - Mobile (mo): a white card (10px padding) with name, short title, short bio, quote and a 44px
 *   arrow link. From 768px the card is borderless on the page, as the 6om grid cards were.
 * - Type follows the fluid scale from 1280px (name 24 → 28, bio 16 → 18, title 14 → 15, link
 *   14 → 16 at 1600). Names are the heading font in the accent; titles, bios, quotes and links are
 *   Figtree. The quote rule and the link use the accent; the link's underline (from 768px) is the
 *   deep bronze of the text links.
 * - `quote` (6om spec note: "et personligt citat") renders as a small blockquote when set; a member
 *   without one (Kubra) simply has a shorter text block, and the links still line up at the
 *   bottom of each row (`mt-auto`).
 * - Bio and quote use `text-pretty`, so Figtree's narrow glyphs don't leave one-word last lines.
 *
 * The whole card links to the practitioner's profile (/behandlere/<slug>). When the card's link
 * goes elsewhere, the name carries the profile link and the CTA stays a separate link on top.
 */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  const profileHref = teamMemberHref(member.slug);
  const cta = member.link ?? { label: member.name, href: profileHref };
  const ctaIsProfile = cta.href === profileHref;
  const name = member.fullName ?? member.name;
  const portrait = member.crops?.about ?? member.image;
  const square = framedPortrait(member, teamSlots.square);
  // How much wider than its slot each crop is drawn (zoom), so `sizes` keeps it sharp.
  const zoom = drawnWidthScale(portrait, teamSlots.portrait.aspect);
  const squareZoom = drawnWidthScale(square, teamSlots.square.aspect);

  // Stretched link: its ::after covers the whole card (the <article> is the positioned box).
  const stretched = "after:absolute after:inset-0 after:rounded-[24px]";

  return (
    <article className="relative flex w-full flex-col rounded-[24px] bg-white px-2.5 pt-2.5 pb-5 md:rounded-none md:bg-transparent md:p-0">
      <CropPhoto
        mobile={square}
        desktop={portrait}
        // Card widths on the 1600px canvas: (1440 − 2 × 40) / 3 ≈ 454px; 3 columns from 1024px
        // (≈ 30vw), 2 from 560px, 1 below (at most 26rem = 416px). × the crop's zoom.
        sizes={[
          `(min-width: 1600px) ${Math.ceil(454 * zoom)}px`,
          `(min-width: 1024px) ${Math.ceil(30 * zoom)}vw`,
          `(min-width: 768px) ${Math.ceil(48 * zoom)}vw`,
          `(min-width: 560px) ${Math.ceil(48 * squareZoom)}vw`,
          `${Math.ceil(400 * squareZoom)}px`,
        ].join(", ")}
        className="aspect-[33/34] rounded-[18px] md:aspect-[4/5] md:rounded-[24px]"
      />

      <div className="flex flex-1 flex-col gap-1.5 px-2.5 pt-4 md:gap-0 md:p-0">
        <h3 className="font-heading text-[22px] tracking-display text-accent md:mt-[22px] md:mb-1 md:text-[24px] xl:text-h3-md">
          {ctaIsProfile ? (
            name
          ) : (
            <Link href={profileHref} className={cn(stretched, "decoration-1 underline-offset-4 hover:underline")}>
              {name}
            </Link>
          )}
        </h3>
        <p className="text-[13px] text-muted md:mb-3.5 md:text-small">
          <ResponsiveText mobile={member.titleShort} desktop={member.title ?? member.role} />
        </p>
        {member.bio ? (
          <p className="text-[15px] leading-[1.65] text-pretty text-muted md:text-body md:leading-[1.75]">
            <ResponsiveText mobile={member.bioShort} desktop={member.bio} />
          </p>
        ) : null}
        {member.quote ? (
          <blockquote className="mt-1.5 border-l-2 border-accent pl-3 text-[15px] leading-[1.6] font-medium text-pretty text-ink md:mt-3.5 md:text-body">
            <p>{member.quote}</p>
          </blockquote>
        ) : null}
        <div className="mt-auto md:pt-4 md:text-ui-sm">
          <Link
            href={cta.href}
            className={cn(
              "inline-flex h-11 items-center text-[15px] font-semibold whitespace-nowrap text-accent transition-colors hover:text-accent-deep",
              "md:inline md:h-auto md:border-b md:border-rule-strong md:pb-[3px] md:text-ui-sm md:font-normal md:hover:border-accent-deep",
              // A separate CTA gets an invisible 44px hit area from 768px, where the link itself is
              // only as tall as its text.
              ctaIsProfile ? stretched : "relative z-10 md:after:absolute md:after:-inset-x-1 md:after:-inset-y-3",
            )}
          >
            {cta.label}
            <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

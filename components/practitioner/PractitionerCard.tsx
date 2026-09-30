import Link from "next/link";
import { practitionerPage } from "@/content/pages/practitioner";
import { teamMemberHref } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/cn";
import { CropPhoto } from "./CropPhoto";
import { PORTRAIT_TOP_POSITION } from "./profile";
import { Responsive } from "./Responsive";

type PractitionerCardProps = {
  member: TeamMember;
  /**
   * The featured member (fagligt ansvarlig, 6om): a wide two-column block from 768px with
   * the member's 6om crop. Other cards sit in the 4-column grid.
   */
  featured?: boolean;
  /** Heading level of the name (h2 on /behandlere). */
  headingLevel?: "h2" | "h3";
  /** Above the fold: load the portrait eagerly with high priority. */
  priority?: boolean;
};

/** Photo `sizes` below 768px: one white card per row, two from 640px (card padding 10px). */
const MOBILE_SIZES = "(min-width: 640px) calc(50vw - 38px), calc(100vw - 60px)";

/**
 * Practitioner card linking to /behandlere/<slug>, styled like the /om-os team cards (6om / mo):
 *
 * - Mobile (mo): a white card with the portrait (top of the photo kept), name, short title,
 *   short bio and a 44px arrow link.
 * - Desktop (6om): borderless grid cards whose photo slot keeps the 6om shape (246×340), so
 *   the stored `crops.about` crops land exactly as designed at every width; the featured
 *   member is a wide two-column block with its (wide) 6om crop.
 *
 * One image per card (see CropPhoto), and the whole card is clickable (stretched link).
 */
export function PractitionerCard({
  member,
  featured = false,
  headingLevel: Heading = "h2",
  priority,
}: PractitionerCardProps) {
  const href = teamMemberHref(member.slug);
  const label = member.link?.href === href ? member.link.label : practitionerPage.index.cardLinkLabel(member.name);
  const name = member.fullName ?? member.name;

  const portrait = { ...member.image, position: PORTRAIT_TOP_POSITION, zoom: undefined };
  const about = member.crops?.about;
  // A grid card only uses a 6om crop of its own portrait; a crop of another photo (Dr. Tom's
  // wide portrait) is made for the featured block.
  const desktop = about && (featured || about.src === member.image.src) ? about : portrait;

  const zoom = desktop.zoom ?? 1;
  const desktopSizes = featured
    ? desktop.src !== member.image.src
      ? // A landscape photo fills the ~530×520 slot by height (≈1.5× the slot width), then zooms.
        "(min-width: 1024px) 1280px, (min-width: 768px) 1030px"
      : `(min-width: 1180px) ${Math.ceil(530 * zoom)}px, (min-width: 768px) ${Math.ceil(52 * zoom)}vw`
    : // Grid slot 246px at 1180px (4 columns), ~half the width on tablets; × the crop's zoom.
      "(min-width: 1180px) 340px, (min-width: 1024px) 30vw, (min-width: 768px) 60vw";

  return (
    <article
      className={cn(
        "relative flex w-full flex-col rounded-[24px] bg-white px-2.5 pt-2.5 pb-5 md:bg-transparent md:p-0",
        featured && "md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-10 lg:gap-14",
      )}
    >
      <CropPhoto
        mobile={portrait}
        desktop={desktop}
        sizes={`${desktopSizes}, ${MOBILE_SIZES}`}
        priority={priority}
        className={cn(
          "aspect-[33/34] rounded-[18px] md:rounded-[24px]",
          featured ? "md:aspect-auto md:h-[420px] lg:h-[520px]" : "md:aspect-[246/340]",
        )}
      />

      <div className={cn("flex flex-1 flex-col gap-1.5 px-2.5 pt-4 md:p-0", featured ? "md:block" : "md:gap-0")}>
        <Heading
          className={cn(
            "text-[22px] font-semibold tracking-display text-plum",
            featured
              ? "md:mb-1.5 md:text-[32px] md:leading-[1.1] lg:text-[40px]"
              : "md:mt-[22px] md:mb-1 md:text-[24px]",
          )}
        >
          {name}
        </Heading>
        <p className={cn("text-[13px] text-muted md:text-[14px]", featured ? "md:mb-5" : "md:mb-3.5")}>
          <Responsive mobile={member.titleShort} desktop={member.title ?? member.role} />
        </p>
        {member.bio ? (
          <p
            className={cn(
              "text-[15px] leading-[1.65] text-muted md:text-[16px] md:leading-[1.75]",
              featured && "md:mb-[18px] md:max-w-[50ch]",
            )}
          >
            <Responsive mobile={member.bioShort} desktop={member.bio} />
          </p>
        ) : null}
        <div className={cn("mt-auto", !featured && "md:pt-4")}>
          <Link
            href={href}
            className={cn(
              "inline-flex h-11 items-center text-[15px] font-semibold whitespace-nowrap text-plum transition-colors hover:text-plum-deep",
              "after:absolute after:inset-0 after:rounded-[24px]",
              "md:h-auto md:border-b md:pb-[3px] md:text-[14px] md:font-normal",
              // 6om: the featured link is an ink inline-block; the grid cards use an inline plum link.
              featured ? "md:inline-block md:border-ink md:text-ink md:hover:text-plum" : "md:inline md:border-plum",
            )}
          >
            {label}
            <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

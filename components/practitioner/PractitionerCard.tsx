import Link from "next/link";
import { ResponsiveText } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import { teamMemberHref } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/cn";
import { CropPhoto } from "./CropPhoto";
import { PORTRAIT_TOP_POSITION } from "./profile";

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
 * Featured photo slot: 420px high on tablets, then the 6om shape (530×520 at 1180px), at
 * least 520px high, so it grows with its column on wide screens (≈704×691 on the 1600px
 * canvas). The ratio matters: Dr. Tom's wide photo has blurred side bars outside its
 * central ~42%, which a slot wider than ~1.03:1 would bring into view at the 6om zoom.
 * w-full: a grid item with a ratio is not stretched, so without it the 520px min-height
 * would set a 530px width through the ratio (wider than the column below 1180px).
 */
const FEATURED_PHOTO = "md:aspect-auto md:h-[420px] lg:h-auto lg:min-h-[520px] lg:w-full lg:aspect-[530/520]";

/**
 * Practitioner card linking to /behandlere/<slug>, styled like the /om-os team cards (6om / mo):
 *
 * - Mobile (mo): a white card with the portrait (top of the photo kept), name, short title,
 *   short bio and a 44px arrow link.
 * - Desktop (6om): borderless grid cards whose photo slot keeps the 6om shape (246×340), so
 *   the stored `crops.about` crops land exactly as designed at every width; the featured
 *   member is a wide two-column block with its (wide) 6om crop. On wide screens the columns
 *   grow with the canvas and every photo keeps its 6om proportions (see FEATURED_PHOTO).
 *   From 1280px the featured block splits 1:1 with the grid's column gap (--team-gap-x, set
 *   on the /behandlere list), so the photo lines up with the first two grid cards and the
 *   text with the last two, like the same block on /om-os. The bio keeps its 50ch measure
 *   (≈ 60 characters per line, 5 lines at 18px), never narrower than its 538px cell at 1280
 *   (so 1280 stays as it is), and the gaps grow (name 6 → 10, title 24 → 32, bio 18 → 28px at
 *   1600), so the text block keeps up with the photo (704×691 at 1600).
 * - Type follows the fluid scale ("Wide layout" in ARCHITECTURE.md): the design sizes up to
 *   1280px, then name 24 → 28 (featured 40 → 48), title 14 → 15, bio 16 → 18, link 14 → 16 at
 *   1600px. ch measures grow with the font, so the bio keeps its characters per line.
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
  // Slot widths on the 1600px canvas (content 1440px): featured photo column
  // (1440 − 32) / 2 = 704px (under 52vw below); grid card (1440 − 3 × 32) / 4 = 336px
  // (about 21vw from 1024px). Each × the crop's zoom.
  const desktopSizes = featured
    ? desktop.src !== member.image.src
      ? // A landscape photo fills the slot by height (≈1.5× the slot height wide), then zooms:
        // ≈1270px wide at 520px high, ≈1690px at 691px (the source is the limit).
        "(min-width: 1280px) 1700px, (min-width: 1024px) 1280px, (min-width: 768px) 1030px"
      : `(min-width: 1600px) ${Math.ceil(704 * zoom)}px, (min-width: 768px) ${Math.ceil(52 * zoom)}vw`
    : `(min-width: 1600px) ${Math.ceil(340 * zoom)}px, (min-width: 1024px) ${Math.ceil(22 * zoom)}vw, (min-width: 768px) 60vw`;

  return (
    <article
      className={cn(
        "relative flex w-full flex-col rounded-[24px] bg-white px-2.5 pt-2.5 pb-5 md:bg-transparent md:p-0",
        featured &&
          "md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center md:gap-10 lg:gap-14 xl:grid-cols-2 xl:gap-x-[var(--team-gap-x,56px)]",
      )}
    >
      <CropPhoto
        mobile={portrait}
        desktop={desktop}
        sizes={`${desktopSizes}, ${MOBILE_SIZES}`}
        priority={priority}
        className={cn(
          "aspect-[33/34] rounded-[18px] md:rounded-[24px]",
          featured ? FEATURED_PHOTO : "md:aspect-[246/340]",
        )}
      />

      <div className={cn("flex flex-1 flex-col gap-1.5 px-2.5 pt-4 md:p-0", featured ? "md:block xl:pl-6" : "md:gap-0")}>
        <Heading
          className={cn(
            "text-[22px] font-semibold tracking-display text-plum",
            featured
              ? "md:mb-1.5 md:text-[32px] md:leading-[1.1] lg:text-[40px] xl:mb-fluid-6/10 xl:text-h2"
              : "md:mt-[22px] md:mb-1 md:text-[24px] xl:text-h3-md",
          )}
        >
          {name}
        </Heading>
        <p className={cn("text-[13px] text-muted md:text-small", featured ? "md:mb-5 xl:mb-fluid-24/32" : "md:mb-3.5")}>
          <ResponsiveText mobile={member.titleShort} desktop={member.title ?? member.role} />
        </p>
        {member.bio ? (
          <p
            className={cn(
              "text-[15px] leading-[1.65] text-muted md:text-body md:leading-[1.75]",
              featured && "md:mb-[18px] md:max-w-[50ch] xl:mb-fluid-18/28 xl:max-w-[max(50ch,538px)]",
            )}
          >
            <ResponsiveText mobile={member.bioShort} desktop={member.bio} />
          </p>
        ) : null}
        <div className={cn("mt-auto", !featured && "md:pt-4")}>
          <Link
            href={href}
            className={cn(
              "inline-flex h-11 items-center text-[15px] font-semibold whitespace-nowrap text-plum transition-colors hover:text-plum-deep",
              "after:absolute after:inset-0 after:rounded-[24px]",
              "md:h-auto md:border-b md:pb-[3px] md:text-ui-sm md:font-normal",
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

import { site } from "@/config/site";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";

type PortraitPlaceholderProps = {
  /** The member's name: its first letter is the monogram. */
  name: string;
  /**
   * The photo slot, exactly as the photos beside it are given theirs (CropPhoto's `className`):
   * aspect ratio or height, radius. The placeholder brings the surface and the type.
   */
  className?: string;
};

/**
 * The portrait of a team member whose photo has not arrived (content/types.ts →
 * TeamCardOnlyMember without an `image`): the photo's slot, in the same shape and size as the
 * photos beside it, with the member's initial as a monogram and a small caption. Used by every
 * team grid (home, /om-os, /behandlere), chosen by the data (no `image`), never by slug.
 *
 * - Markup and CSS only: no image request, crisp at every size, and the slot has its final size
 *   in the server HTML, so nothing moves when the real photo replaces it.
 * - Surface: the Lys Rosa band colour, the brand's surface, which sits next to the rose-beige
 *   walls of the portraits (sand, the photo slots' loading colour, read as a missing image, and
 *   disappears on the home page's beige team panel).
 * - Monogram: the heading font (font-heading: Poppins 500) in the band's accent (plum, 6.4:1 on
 *   the band and more on the lighter disc; a large glyph needs 3:1), in a lighter disc with a
 *   hairline ring, centred where the faces sit in the photos (≈ 41% from the top: between the eye
 *   lines of the 4:5 and the 33:34 crops, content/team.ts → teamSlots). Sized in container units
 *   (cqw), so it is the same share of the slot from a 150px card up to a ≈ 350px one (the slots at
 *   1280px); there it stops growing (disc 10rem, letter 5.25rem, gap 0.875rem), so in the 450px
 *   slots at 1600px the letter does not dwarf the caption.
 * - Caption: right under the disc, so monogram and caption read as one deliberate mark (at the
 *   slot's bottom edge it looked like a photo caption, ≈ 160px from the disc in the 1440 grids).
 *   The band's body colour (9.9:1 on the band), `text-small` (the scale's caption size: 14px, 15px
 *   at 1600); one line in every slot ("Billede på vej" is ≈ 83px wide at 14px; the narrowest slot,
 *   the 150px home card, leaves 134px).
 * - Decorative: `aria-hidden`, and no `role="img"` or alt text that would claim a portrait. The
 *   card's own text carries the name and the title.
 */
export function PortraitPlaceholder({ name, className }: PortraitPlaceholderProps) {
  const initial = (Array.from(name.trim())[0] ?? "").toLocaleUpperCase(site.locale);
  return (
    <div
      aria-hidden="true"
      data-portrait-placeholder=""
      data-surface="band"
      className={cn("relative overflow-hidden bg-band select-none [container-type:inline-size]", className)}
    >
      {/* The disc's centre at 41%: the column starts half a disc (23cqw, at most 5rem) above it. */}
      <span className="absolute inset-x-0 top-[calc(41%_-_min(23cqw,5rem))] flex flex-col items-center gap-[min(4cqw,0.875rem)] px-2">
        <span className="grid size-[min(46cqw,10rem)] place-items-center rounded-full bg-band-card ring-1 ring-band-line">
          <span className="font-heading text-[min(24cqw,5.25rem)] leading-none text-band-accent">{initial}</span>
        </span>
        <span className="text-center text-small leading-[1.3] font-medium text-band-body">
          {ui.portraitPending}
        </span>
      </span>
    </div>
  );
}

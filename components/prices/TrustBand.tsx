import { containerClasses } from "@/components/ui";
import { cn } from "@/lib/cn";

type TrustBandProps = {
  items: readonly string[];
};

/**
 * Rose band (`bg-band`) of trust points under the Priser hero (6b; the design's plum band).
 * Hidden on mobile (mp).
 * The "·" separators are decorative and only shown from 1024px, where the row
 * always fits on one line. They are list items of their own (hidden from assistive
 * tech), so the dots stay centred between the points when the row spreads out.
 *
 * Below 1280px the row is a centred cluster, as in the design. From 1280px it
 * spreads across the band, its ends on the hero panel's text inset; there the "·"
 * glyph (a 3px speck in the wide gaps) becomes a 6px dot. Points `text-on-band`, dots
 * `band-accent` (decorative). `leading-[1.5]` keeps the design's band height in Figtree
 * (whose "normal" line height is 1.2, Poppins' was 1.5).
 *
 * Text is 14px up to 1280px and grows to 16px at 1600px (the `text-ui-sm` step, as the
 * price rows below): a 1536px band under the 76px H1 needs more than the 15px of
 * `text-small`, or the four points read as small islands.
 *
 * The gap above the band is the surface margin, like the other stacked bands
 * (24px from 768px, 32px from 1536px).
 */
export function TrustBand({ items }: TrustBandProps) {
  return (
    <div className={cn(containerClasses("surface"), "pt-surface max-md:hidden")}>
      <ul
        data-surface="band"
        className="flex flex-wrap justify-center gap-x-8 gap-y-2 rounded-[24px] bg-band px-7 py-fluid-26 text-ui-sm leading-[1.5] text-on-band lg:gap-x-10 xl:justify-between xl:px-16 2xl:px-20"
      >
        {items.flatMap((item, i) => [
          i > 0 ? (
            <li
              key={`sep-${item}`}
              aria-hidden="true"
              className="text-band-accent max-lg:hidden xl:size-1.5 xl:self-center xl:rounded-full xl:bg-band-accent"
            >
              <span className="xl:hidden">·</span>
            </li>
          ) : null,
          <li key={item}>{item}</li>,
        ])}
      </ul>
    </div>
  );
}

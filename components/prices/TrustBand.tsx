import { containerClasses } from "@/components/ui";
import { cn } from "@/lib/cn";

type TrustBandProps = {
  items: readonly string[];
};

/**
 * Plum band of trust points under the Priser hero (6b). Hidden on mobile (mp).
 * The "·" separators are decorative and only shown from 1024px, where the row
 * always fits on one line. They are list items of their own (hidden from assistive
 * tech), so the dots stay centred between the points when the row spreads out.
 *
 * Up to 1280px the row is a centred cluster, as in the design. On wider screens it
 * spreads across the band, its ends on the hero panel's text inset; there the "·"
 * glyph (a 3px speck in the wide gaps) becomes a 6px powder dot.
 *
 * The gap above the band is the surface margin, like the other stacked bands
 * (24px from 768px, 32px from 1536px).
 */
export function TrustBand({ items }: TrustBandProps) {
  return (
    <div className={cn(containerClasses("surface"), "pt-surface max-md:hidden")}>
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 rounded-[24px] bg-plum px-7 py-fluid-26 text-[14px] text-cream lg:gap-x-10 xl:justify-between xl:px-16 2xl:px-20">
        {items.flatMap((item, i) => [
          i > 0 ? (
            <li
              key={`sep-${item}`}
              aria-hidden="true"
              className="text-powder max-lg:hidden xl:size-1.5 xl:self-center xl:rounded-full xl:bg-powder"
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

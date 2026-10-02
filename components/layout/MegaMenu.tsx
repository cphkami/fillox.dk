import Link from "next/link";
import { useId } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ButtonLink } from "@/components/ui/Button";
import type { MegaMenuData } from "./menuData";
import { useAriaCurrent } from "./NavLink";

type MegaMenuProps = {
  menu: MegaMenuData;
  /**
   * Whether the panel is open. The closed panel stays in the layout (invisible), so its links
   * are prefetched only while it is open, not on every page view.
   */
  open?: boolean;
  /** Called when a link is chosen (closes the menu). */
  onNavigate?: () => void;
};

/** Uppercase column / panel label: 12px bold (`text-micro`, 13 at 1600), +.2em. */
const eyebrowClasses = "text-micro leading-[1.25] font-bold tracking-[.2em] uppercase";

/**
 * Desktop "Behandlinger" panel (the owner's design v2, design-reference/mega-menu-v2.webp, drawn
 * on the 1180px design canvas): four treatment columns with an "Alle … →" link, a hairline and
 * the "For mænd" tag with its note on the white side; a rose band panel (≈ 26.5% of the width,
 * at least 272px so its text and button fit at 1024; the design's plum panel in the owner's
 * "Støvet rosa & beige") flush right, with the button pinned to the bottom, level with the tag.
 *
 * Width (DesktopNav): the canvas's surface band, as in the design, up to 1280px (from 1328px
 * viewport), centred. Type follows the site's type scale like the page text: links and "Alle"
 * links `text-ui-sm` (14 → 16px, always smaller than the 15 → 17px nav), eyebrows `text-micro`,
 * the heading `text-h3` (Poppins, `font-heading`), the panel text `text-body-sm`, the tag note
 * `text-small`. Everything but the heading is Figtree. Links sit on a
 * pitch of 2.35 × their size (33 → 38px; the line height, so each row is a full-width target
 * with no gaps). Paddings and gaps are the design's at ≤ 1280 and grow ×1.2 to 1600.
 */
export function MegaMenu({ menu, open = true, onNavigate }: MegaMenuProps) {
  const prefetch = open ? null : false;
  const ariaCurrent = useAriaCurrent();
  const id = useId();
  const { columns, tag, promo } = menu;
  return (
    <div className="flex overflow-hidden rounded-[20px] bg-white shadow-menu">
      <div className="flex min-w-0 flex-1 flex-col px-10 py-9 xl:px-fluid-40/48 xl:py-fluid-36/42">
        <div className="grid grid-cols-4 gap-8 xl:gap-fluid-32/38">
          {columns.map((col, i) => (
            <div key={col.eyebrow}>
              <p id={`${id}-${i}`} className={`${eyebrowClasses} mb-[11px] text-accent xl:mb-fluid-11/13`}>
                {col.eyebrow}
              </p>
              <ul aria-labelledby={`${id}-${i}`} className="text-ui-sm leading-[2.35] text-ink">
                {col.items.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={t.href}
                      prefetch={prefetch}
                      onClick={onNavigate}
                      aria-current={ariaCurrent(t.href)}
                      className="block whitespace-nowrap transition-colors hover:text-accent"
                    >
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {col.allLink ? (
                // Same pitch as the rows above; the row is the target, so ArrowLink's extra hit area
                // (which would cover the last treatment) is switched off.
                <p className="text-ui-sm leading-[2.35]">
                  <ArrowLink
                    href={col.allLink.href}
                    prefetch={prefetch}
                    onClick={onNavigate}
                    aria-current={ariaCurrent(col.allLink.href)}
                    className="whitespace-nowrap after:hidden"
                  >
                    {col.allLink.label}
                  </ArrowLink>
                </p>
              ) : null}
            </div>
          ))}
        </div>
        {/* Pinned to the bottom: level with the band panel's button when that side is the taller one. */}
        <div className="mt-auto pt-6 xl:pt-fluid-24">
          <div className="flex items-center gap-3.5 border-t border-line pt-5 xl:pt-fluid-20">
            {/* A 36px pill; the invisible `after:` box (6px above and below the padding box) makes it a
                ≥ 44px target without moving it. */}
            <Link
              href={tag.href}
              prefetch={prefetch}
              onClick={onNavigate}
              aria-current={ariaCurrent(tag.href)}
              aria-describedby={`${id}-tag`}
              className="relative shrink-0 rounded-full border-[1.5px] border-accent px-4 py-2 text-ui-sm leading-[1.25] font-semibold whitespace-nowrap text-accent transition-colors after:absolute after:inset-x-0 after:-inset-y-1.5 hover:bg-accent hover:text-on-accent focus-visible:bg-accent focus-visible:text-on-accent active:bg-accent active:text-on-accent xl:px-fluid-16/18"
            >
              {tag.label}
            </Link>
            <p id={`${id}-tag`} className="text-small leading-[1.5] text-muted">
              {tag.text}
            </p>
          </div>
        </div>
      </div>

      <div
        data-surface="band"
        className="flex w-[26.5%] min-w-68 shrink-0 flex-col bg-band px-8 py-9 xl:px-fluid-32/40 xl:py-fluid-36/42"
      >
        <p className={`${eyebrowClasses} mb-3.5 text-band-accent xl:mb-fluid-14/16`}>{promo.eyebrow}</p>
        <p className="font-heading text-h3 leading-[1.2] tracking-[-0.01em] text-balance text-on-band">{promo.title}</p>
        <p className="mt-3 text-body-sm leading-[1.6] text-band-body xl:mt-fluid-12/14">{promo.text}</p>
        <div className="mt-auto pt-6 xl:pt-fluid-24">
          <ButtonLink
            href={promo.cta.href}
            prefetch={prefetch}
            onClick={onNavigate}
            aria-current={ariaCurrent(promo.cta.href)}
            size="sm"
            fullWidth
          >
            {promo.cta.label}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

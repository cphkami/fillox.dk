import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Photo } from "@/components/ui/Photo";
import type { MegaColumn, MegaPromo } from "./menuData";
import { useAriaCurrent } from "./NavLink";

type MegaMenuProps = {
  columns: MegaColumn[];
  promo: MegaPromo;
  /**
   * Whether the panel is open. The closed panel stays in the layout (invisible), so its links
   * are prefetched only while it is open, not on every page view.
   */
  open?: boolean;
  /** Mount the promo photo (DesktopNav: once the menu has been opened), else only its sand box. */
  showPromoPhoto?: boolean;
  /** Called when a link is chosen (closes the menu). */
  onNavigate?: () => void;
};

/**
 * Desktop "Behandlinger" panel (design 6menu): five treatment columns + promo card.
 *
 * Sized to its content, not to the canvas: the "Priser" dropdown's sibling (white, 20px radius,
 * 12px inset, a 220px sand card with a 20px text inset). The columns are as wide as their
 * longest link and sit 24px apart. From 1280px the promo is a card beside the columns (panel
 * 1133px wide) whose photo fills the height the text leaves, so card and columns end on the same
 * line; below that (1024–1279) it is a sand strip without photo under the columns, so the panel
 * stays ~900px wide and fits the narrowest canvas.
 *
 * Menu type is fixed from 1024px up (title 16px/600, links 15px, promo text 14px, "→" link 15px),
 * like the other dropdowns. Vertical rhythm: 28px above the titles (28 → 32px from 1280), 6px
 * title → list, links on a 32px pitch (32 → 34px from 1280), 16px under the last link
 * (20 → 24px from 1280): the panel is 291px high at 1280 and 310px at 1600.
 */
export function MegaMenu({ columns, promo, open = true, showPromoPhoto = true, onNavigate }: MegaMenuProps) {
  const prefetch = open ? null : false;
  const ariaCurrent = useAriaCurrent();
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-white p-3 shadow-menu xl:flex-row">
      {/* `auto` columns = their max-content width while the panel is `w-max`; they would wrap
          rather than overflow if the panel ever hit its max width (DesktopNav). */}
      <div className="grid grid-cols-[repeat(5,auto)] gap-x-6 px-4 pt-7 pb-4 xl:pt-fluid-28/32 xl:pb-fluid-20/24">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-1.5 text-[16px] leading-[1.25] font-semibold text-plum">{col.title}</p>
            {/* The line height is the pitch: each link is a full-row target with no gaps between them. */}
            <ul className="flex flex-col text-[15px] leading-8 text-ink xl:leading-[clamp(32px,calc(24px+0.625vw),34px)]">
              {col.items.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    prefetch={prefetch}
                    onClick={onNavigate}
                    aria-current={ariaCurrent(t.href)}
                    className="block whitespace-nowrap transition-colors hover:text-plum"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-[16px] bg-sand xl:flex xl:w-[220px] xl:shrink-0 xl:flex-col">
        {/* Photo only on the card layout (≥1280px): a wide crop of the face that fills the height left
            by the text (at least 112px), so the card ends level with the columns. */}
        {showPromoPhoto ? (
          <Photo image={promo.image} sizes="220px" className="hidden xl:block xl:min-h-[112px] xl:flex-1" />
        ) : (
          <div className="hidden xl:block xl:min-h-[112px] xl:flex-1" />
        )}
        <div className="flex items-center justify-between gap-6 px-4 py-4 xl:block xl:px-5 xl:pt-4 xl:pb-[18px]">
          <p className="text-[14px] leading-[1.45] text-muted xl:mb-2.5">
            <span className="text-[16px] leading-[1.3] font-semibold text-ink xl:mb-1 xl:block xl:text-balance">
              {promo.title}
            </span>{" "}
            {promo.text}
          </p>
          <ArrowLink
            href={promo.link.href}
            prefetch={prefetch}
            onClick={onNavigate}
            aria-current={ariaCurrent(promo.link.href)}
            size="menu"
            className="shrink-0 leading-[1.35]"
          >
            {promo.link.label}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

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
 * 12px inset, a 228px sand card with a 20px text inset). The columns are as wide as their
 * longest link and sit 28px apart. From 1280px the promo is a card with a photo beside the
 * columns (panel ~1110px wide); below that (1024–1279) it is a sand strip without photo under
 * the columns, so the panel stays ~870px wide and fits the narrowest canvas.
 */
export function MegaMenu({ columns, promo, open = true, showPromoPhoto = true, onNavigate }: MegaMenuProps) {
  const prefetch = open ? null : false;
  const ariaCurrent = useAriaCurrent();
  return (
    <div className="flex flex-col gap-3 rounded-[20px] bg-white p-3 shadow-menu xl:flex-row">
      {/* `auto` columns = their max-content width while the panel is `w-max`; they would wrap
          rather than overflow if the panel ever hit its max width (DesktopNav). */}
      <div className="grid grid-cols-[repeat(5,auto)] gap-x-7 px-4 pt-4 pb-1 xl:py-4">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-[15px] leading-5 font-semibold text-plum">{col.title}</p>
            <ul className="flex flex-col gap-2 text-[14px] leading-5 text-ink">
              {col.items.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    prefetch={prefetch}
                    onClick={onNavigate}
                    aria-current={ariaCurrent(t.href)}
                    className="transition-colors hover:text-plum"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-[16px] bg-sand xl:w-[228px] xl:shrink-0">
        {/* Photo only on the card layout (≥1280px); a wide, short crop of the face. */}
        {showPromoPhoto ? (
          <Photo image={promo.image} sizes="228px" className="hidden h-[112px] xl:block" />
        ) : (
          <div className="hidden h-[112px] xl:block" />
        )}
        <div className="flex items-center justify-between gap-6 px-4 py-4 xl:block xl:px-5 xl:pt-3.5 xl:pb-4">
          <p className="text-[14px] leading-5 text-muted xl:mb-2.5 xl:text-[13px]">
            <span className="text-[15px] font-semibold text-ink xl:mb-0.5 xl:block xl:text-balance">{promo.title}</span> {promo.text}
          </p>
          <ArrowLink
            href={promo.link.href}
            prefetch={prefetch}
            onClick={onNavigate}
            aria-current={ariaCurrent(promo.link.href)}
            className="shrink-0 leading-5"
          >
            {promo.link.label}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

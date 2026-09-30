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

/** Desktop "Behandlinger" panel (design 6menu): five treatment columns + promo card. */
export function MegaMenu({ columns, promo, open = true, showPromoPhoto = true, onNavigate }: MegaMenuProps) {
  const prefetch = open ? null : false;
  const ariaCurrent = useAriaCurrent();
  return (
    // Side padding + the panel's surface inset = the content gutter (56 · 64 · 80px), so the
    // first column lines up with the logo at every width. The design's grid (wider promo,
    // 32px gaps) from its 1180px canvas up; narrower, it would make the column labels wrap.
    <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1fr)] gap-6 rounded-[24px] bg-white px-8 py-10 shadow-menu min-[73.75rem]:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.3fr)] min-[73.75rem]:gap-8 xl:px-10 2xl:px-12">
      {columns.map((col) => (
        <div key={col.title}>
          <p className="mb-3.5 text-[15px] font-semibold text-plum">{col.title}</p>
          <ul className="flex flex-col gap-[11px] text-[14px] text-ink">
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
      <div className="flex flex-col overflow-hidden rounded-[20px] bg-sand">
        {/* Promo column is ≤ 270px wide on the 1600px canvas; the photo grows modestly with it. */}
        {showPromoPhoto ? (
          <Photo image={promo.image} sizes="(min-width: 1280px) 270px, 220px" className="h-[170px] shrink-0 xl:h-fluid-170" />
        ) : (
          <div className="h-[170px] shrink-0 bg-sand xl:h-fluid-170" />
        )}
        <div className="px-4 py-5 min-[73.75rem]:px-[22px]">
          <p className="mb-1 text-[15px] font-semibold">{promo.title}</p>
          <p className="mb-3.5 text-[14px] text-muted">{promo.text}</p>
          <ArrowLink href={promo.link.href} prefetch={prefetch} onClick={onNavigate} aria-current={ariaCurrent(promo.link.href)}>
            {promo.link.label}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

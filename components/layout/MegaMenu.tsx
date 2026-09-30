import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Photo } from "@/components/ui/Photo";
import type { MegaColumn, MegaPromo } from "./menuData";

type MegaMenuProps = {
  columns: MegaColumn[];
  promo: MegaPromo;
  /** Called when a link is chosen (closes the menu). */
  onNavigate?: () => void;
};

/** Desktop "Behandlinger" panel (design 6menu): five treatment columns + promo card. */
export function MegaMenu({ columns, promo, onNavigate }: MegaMenuProps) {
  return (
    // Side padding + the panel's surface inset = the content gutter (56 · 64 · 80px), so the
    // first column lines up with the logo at every width.
    <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1fr)] gap-6 rounded-[24px] bg-white px-8 py-10 shadow-menu xl:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.3fr)] xl:gap-8 xl:px-10 2xl:px-12">
      {columns.map((col) => (
        <div key={col.title}>
          <p className="mb-3.5 text-[15px] font-semibold text-plum">{col.title}</p>
          <ul className="flex flex-col gap-[11px] text-[14px] text-ink">
            {col.items.map((t) => (
              <li key={t.slug}>
                <Link href={t.href} onClick={onNavigate} className="transition-colors hover:text-plum">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="flex flex-col overflow-hidden rounded-[20px] bg-sand">
        {/* Promo column is ≤ 270px wide on the 1600px canvas; the photo grows modestly with it. */}
        <Photo image={promo.image} sizes="(min-width: 1280px) 270px, 220px" className="h-[170px] shrink-0 xl:h-fluid-170" />
        <div className="px-4 py-5 xl:px-[22px]">
          <p className="mb-1 text-[15px] font-semibold">{promo.title}</p>
          <p className="mb-3.5 text-[14px] text-muted">{promo.text}</p>
          <ArrowLink href={promo.link.href} onClick={onNavigate}>
            {promo.link.label}
          </ArrowLink>
        </div>
      </div>
    </div>
  );
}

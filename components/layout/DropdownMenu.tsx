import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { HoursSummary } from "@/components/ui/HoursSummary";
import type { Link as LinkItem } from "@/content/types";
import { ui } from "@/content/ui";
import type { MenuClinic, MenuPrices } from "./menuData";
import { useAriaCurrent } from "./NavLink";

/**
 * `prefetch` of a dropdown's links. Closed dropdowns stay in the layout (invisible), so the
 * viewport prefetch would fetch every linked route on every page view; they are prefetched
 * only while their dropdown is open (still before the click).
 */
const panelPrefetch = (open: boolean) => (open ? null : false);

/*
 * Menu type is fixed from 1024px up and shared by every header panel (MegaMenu too): titles
 * 16px/600, links 15px, secondary text 14px, uppercase micro labels 12px, "Se alle →" 15px/600
 * (ArrowLink size "menu"). Frame: white, 20px radius, 12px inset, 28px text inset.
 */

/** Desktop "Find klinik" dropdown: open clinics with address + hours, coming-soon clinics with their note. */
export function ClinicsDropdown({
  clinics,
  allHref,
  open = true,
  onNavigate,
}: {
  clinics: MenuClinic[];
  allHref: string;
  open?: boolean;
  onNavigate?: () => void;
}) {
  const prefetch = panelPrefetch(open);
  const ariaCurrent = useAriaCurrent();
  return (
    <div className="w-[360px] rounded-[20px] bg-white p-3 shadow-menu">
      <ul className="flex flex-col">
        {clinics.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.href}
              prefetch={prefetch}
              onClick={onNavigate}
              aria-current={ariaCurrent(c.href)}
              className="group block rounded-[14px] px-4 py-3 transition-colors hover:bg-cream"
            >
              <span className="block text-[16px] font-semibold text-ink transition-colors group-hover:text-plum">
                {c.name}
              </span>
              {c.comingSoon ? (
                <span className="mt-1 block text-[12px] tracking-[2px] text-plum uppercase">{c.openingNote}</span>
              ) : (
                <>
                  <span className="mt-0.5 block text-[14px] leading-[1.6] text-muted">{c.address.join(", ")}</span>
                  <HoursSummary as="span" parts={c.hours} className="text-[14px] leading-[1.6] text-plum" />
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-1 mt-2 border-t border-line px-3 pt-3.5 pb-1.5">
        <ArrowLink
          href={allHref}
          prefetch={prefetch}
          onClick={onNavigate}
          aria-current={ariaCurrent(allHref)}
          size="menu"
        >
          {ui.seeAllClinics}
        </ArrowLink>
      </div>
    </div>
  );
}

/** Small desktop dropdown with a list of links (e.g. "Om os"). */
export function LinksDropdown({
  items,
  open = true,
  onNavigate,
}: {
  items: LinkItem[];
  open?: boolean;
  onNavigate?: () => void;
}) {
  const prefetch = panelPrefetch(open);
  const ariaCurrent = useAriaCurrent();
  return (
    <div className="min-w-[240px] rounded-[20px] bg-white p-3 shadow-menu">
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              prefetch={prefetch}
              onClick={onNavigate}
              aria-current={ariaCurrent(item.href)}
              className="block rounded-[12px] px-4 py-2.5 text-[15px] whitespace-nowrap text-ink transition-colors hover:bg-cream hover:text-plum"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Desktop "Priser" dropdown: the price categories (eyebrow, title, lowest price) linking to
 * their card on the prices page, "Se alle priser →", and a sand side card (the mega menu's
 * promo-card style) with the trust points and a financing teaser linking to the financing box.
 */
export function PricesDropdown({
  prices,
  open = true,
  onNavigate,
}: {
  prices: MenuPrices;
  open?: boolean;
  onNavigate?: () => void;
}) {
  const prefetch = panelPrefetch(open);
  const ariaCurrent = useAriaCurrent();
  return (
    <div className="flex w-[760px] gap-3 rounded-[20px] bg-white p-3 shadow-menu">
      <div className="min-w-0 flex-1">
        <ul className="grid grid-cols-2">
          {prices.categories.map((c) => (
            <li key={c.id}>
              <Link
                href={c.href}
                prefetch={prefetch}
                onClick={onNavigate}
                className="group flex h-full flex-col rounded-[14px] px-4 py-3 transition-colors hover:bg-cream"
              >
                {/* Title first in the DOM so the link's name starts with it; the eyebrow is shown on top. */}
                <span className="mt-1 text-[16px] font-semibold text-ink transition-colors group-hover:text-plum">
                  {c.title}
                </span>{" "}
                {c.price ? <span className="mt-0.5 text-[14px] text-plum">{c.price}</span> : null}{" "}
                <span className="order-first text-[12px] font-semibold tracking-[.12em] text-muted uppercase">
                  {c.eyebrow}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mx-1 mt-2 border-t border-line px-3 pt-3.5 pb-1.5">
          <ArrowLink
            href={prices.href}
            prefetch={prefetch}
            onClick={onNavigate}
            aria-current={ariaCurrent(prices.href)}
            size="menu"
          >
            {ui.seeAllPrices}
          </ArrowLink>
        </div>
      </div>
      <div className="flex w-[228px] shrink-0 flex-col rounded-[16px] bg-sand p-5">
        <ul className="flex flex-col gap-3 text-[14px] leading-[1.45] text-ink">
          {prices.trust.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0 text-plum">
                <path
                  d="M3.5 8.5l3 3 6-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <div className="border-t border-line pt-4">
            <p className="mb-1 text-[16px] leading-[1.3] font-semibold text-balance text-ink">{prices.financing.title}</p>
            <p className="mb-3 text-[14px] leading-[1.5] text-muted">{prices.financing.text}</p>
            <ArrowLink href={prices.financing.href} prefetch={prefetch} onClick={onNavigate} size="menu">
              {prices.financing.cta}
            </ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}

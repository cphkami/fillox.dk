import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { desktopHiddenNav } from "@/content/navigation";
import { ui } from "@/content/ui";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { buildHeaderData } from "./menuData";

/**
 * Sticky site header (design 6a / mf top). Desktop ≥1024px: logo · centered nav
 * with mega menu + dropdowns · "Book tid". Mobile: logo · "Book tid" · burger.
 * Heights: 72px below 1024px, 93px at 1024–1279, 95 → 98px from 1280 to 1600 (the nav and
 * "Book tid" use `text-ui`; the logo is 30 → 32px, smaller than the design's 40px).
 * Spans the fluid site canvas (max-w-canvas) with the content gutter, so the logo lines
 * up with the text of every page section.
 */
export function Header() {
  const data = buildHeaderData();
  const desktopItems = data.nav.filter((item) => !desktopHiddenNav.includes(item.href));

  return (
    <header className="sticky top-0 z-50 bg-cream">
      <div className="relative mx-auto flex w-full max-w-canvas items-center justify-between gap-4 px-gutter py-3.5 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-8 lg:py-[22px]">
        {/* The dark logo would vanish on a dark Windows high-contrast canvas: keep a white plate behind it there. */}
        <Link
          href="/"
          aria-label={layoutCopy.header.homeLabel}
          className="flex min-h-11 shrink-0 items-center rounded-sm forced-colors:bg-white forced-colors:outline-[color:CanvasText] forced-colors:forced-color-adjust-none"
        >
          <Image
            src={site.brand.logoDark}
            alt=""
            width={site.brand.logoWidth}
            height={site.brand.logoHeight}
            // Eager + low priority, not `preload`: the logo is never the LCP. React emits a preload link for
            // every eager <img> unless its fetchPriority is "low", and that link would compete with the hero's.
            loading="eager"
            fetchPriority="low"
            // 22px mobile · 30px desktop · 30 → 32px from 1280 (the link is 44px high for touch).
            className="h-[22px] w-auto lg:h-[30px] xl:h-[clamp(30px,calc(22px+0.625vw),32px)]"
          />
        </Link>

        <div className="hidden lg:block">
          <DesktopNav
            items={desktopItems}
            label={layoutCopy.header.navLabel}
            megaMenu={data.megaMenu}
            clinics={data.clinics}
            clinicsHref={data.clinicsHref}
            prices={data.prices}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <ButtonLink href={site.booking.href} size="compact" className="lg:hidden">
            {ui.bookCta}
          </ButtonLink>
          <ButtonLink href={site.booking.href} size="sm" className="max-lg:hidden">
            {ui.bookCta}
          </ButtonLink>
          <div className="lg:hidden">
            <MobileMenu
              items={data.nav}
              categories={data.categories}
              clinics={data.clinics}
              navLabel={layoutCopy.header.navLabel}
              homeLabel={layoutCopy.header.homeLabel}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

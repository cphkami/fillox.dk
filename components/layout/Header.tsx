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
 * Spans the fluid site canvas (max-w-canvas) with the content gutter, so the logo lines
 * up with the text of every page section.
 */
export function Header() {
  const data = buildHeaderData();
  const desktopItems = data.nav.filter((item) => !desktopHiddenNav.includes(item.href));

  return (
    <header className="sticky top-0 z-50 bg-cream">
      <div className="relative mx-auto flex w-full max-w-canvas items-center justify-between gap-4 px-gutter py-3.5 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-8 lg:py-[22px]">
        <Link href="/" aria-label={layoutCopy.header.homeLabel} className="shrink-0 rounded-sm">
          <Image
            src={site.brand.logoDark}
            alt=""
            width={site.brand.logoWidth}
            height={site.brand.logoHeight}
            preload
            className="h-[26px] w-auto lg:h-10"
          />
        </Link>

        <div className="hidden lg:block">
          <DesktopNav
            items={desktopItems}
            label={layoutCopy.header.navLabel}
            megaColumns={data.megaColumns}
            megaPromo={data.megaPromo}
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

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { HoursSummary } from "@/components/ui/HoursSummary";
import { JoinedLines } from "@/components/ui/JoinedLines";
import { site } from "@/config/site";
import { clinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { footerNav, legalNav } from "@/content/navigation";
import { routes } from "@/content/routes";
import { ui } from "@/content/ui";
import { NavLink } from "./NavLink";

const contactCards = [
  { label: ui.callUs, value: site.contact.phone, href: site.contact.phoneHref },
  { label: ui.writeUs, value: site.contact.email, href: site.contact.emailHref },
];

/**
 * Plum footer block (design 6a bottom / mf bottom): contact band with phone,
 * e-mail and "Book tid"; logo + tagline; one column per clinic; footer links;
 * copyright + legal links. Spans the fluid site canvas with the surface margin (like
 * every rounded band), its fr-based grids spread with the width.
 */
export function Footer() {
  const clinicsHref = routes.clinics;
  const copyright = `© ${site.name} · ${site.company.registrationLabel} ${site.company.registrationNumber}`;

  return (
    <footer className="mx-auto w-full max-w-canvas p-surface">
      <div
        data-surface="plum"
        className="flex flex-col gap-[22px] rounded-[24px] bg-plum px-[22px] pt-9 pb-7 text-blush md:px-10 lg:block lg:px-14 lg:pt-fluid-64 lg:pb-8 xl:px-16 2xl:px-20"
      >
        {/* Contact band */}
        <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 lg:mb-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center lg:gap-6 lg:border-b lg:border-cream/18 lg:pb-10">
          {contactCards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="block rounded-[18px] bg-cream/8 px-5 py-4 transition-colors hover:bg-cream/12 lg:rounded-[20px] lg:px-7 lg:py-[22px]"
            >
              <span className="mb-1 block text-micro font-semibold tracking-[.12em] text-powder uppercase lg:mb-1.5">
                {card.label}
              </span>
              <span className="block text-[19px] font-semibold break-words text-cream lg:text-h3 lg:tracking-[-.01em]">
                {card.value}
              </span>
            </a>
          ))}
          <ButtonLink
            href={site.booking.href}
            variant="light"
            size="lg"
            className="w-full md:col-span-2 lg:col-span-1 lg:h-auto lg:w-auto lg:px-9 lg:py-4 xl:px-fluid-36/40 xl:py-fluid-16/17"
          >
            {ui.bookCta}
          </ButtonLink>
        </div>

        {/* Brand + clinics. Below lg the wrapper dissolves so the brand can move above the contact band. */}
        <div className="contents lg:grid lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] lg:gap-10 lg:border-b lg:border-cream/18 lg:pb-10">
          <div className="order-first flex flex-col gap-[22px] text-small leading-[1.6] lg:order-none lg:gap-5 lg:leading-[1.7]">
            <Image
              src={site.brand.logoLight}
              alt={site.name}
              width={site.brand.logoWidth}
              height={site.brand.logoHeight}
              // 24px mobile · 28px desktop · 28 → 30px from 1280 (in proportion to the 22 / 30 → 32px header logo).
              className="h-6 w-auto self-start lg:h-7 xl:h-[clamp(28px,calc(20px+0.625vw),30px)]"
            />
            <p className="max-w-[30ch] max-lg:max-w-none">{layoutCopy.footer.tagline}</p>
          </div>

          <ul
            aria-label={layoutCopy.footer.clinicsLabel}
            className="flex flex-col md:grid md:grid-cols-2 md:gap-x-10 lg:col-span-4 lg:grid-cols-4"
          >
            {clinics.map((c) => (
              <li
                key={c.slug}
                className="border-t border-cream/18 py-4 text-small leading-[1.6] lg:border-0 lg:py-0 lg:leading-[1.7]"
              >
                <Link
                  href={`${clinicsHref}#${c.slug}`}
                  // The invisible after: box makes the name a 44px touch target without moving it.
                  className="relative mb-1 block text-body font-semibold text-cream after:absolute after:inset-x-0 after:-inset-y-2.5 hover:text-powder lg:mb-2"
                >
                  {c.name}
                </Link>
                {c.status === "coming-soon" ? (
                  <p className="text-powder lg:mt-2.5">{c.openingNote}</p>
                ) : (
                  <>
                    <p>
                      <JoinedLines parts={c.address} separator=", " />
                    </p>
                    <HoursSummary
                      parts={c.hours.map((h) => `${h.days} ${h.hours}`)}
                      className="text-powder lg:mt-2.5 lg:flex-col"
                    />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer links + legal. Not prefetched (still client-side navigation): they are on every
            page, and prefetching them all on scroll costs more mobile data than the rare click saves. */}
        <div className="flex flex-col gap-[22px] lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-4 lg:pt-7">
          {/* Below lg the links are 44px rows (touch targets) with no gap; the padding above and the
              negative margin below keep the first and last line where the design has them. From lg
              (one row) an invisible after: box enlarges each link's hit area by 8px on every side. */}
          <nav aria-label={layoutCopy.footer.navLabel} className="max-lg:-mb-[11px]">
            <ul className="grid grid-cols-2 gap-x-4 border-t border-cream/18 pt-[7px] text-ui-sm text-cream md:grid-cols-3 lg:flex lg:flex-wrap lg:gap-7 lg:border-0 lg:pt-0">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <NavLink
                    href={l.href}
                    prefetch={false}
                    className="hover:text-powder max-lg:inline-flex max-lg:min-h-11 max-lg:items-center lg:relative lg:after:absolute lg:after:-inset-x-2 lg:after:-inset-y-2"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-[12px] leading-[1.8] text-rule lg:flex lg:flex-wrap lg:gap-6 lg:text-small lg:leading-normal">
            <p>{copyright}</p>
            <nav aria-label={layoutCopy.footer.legalLabel}>
              {/* 44px touch targets below lg; the negative margin keeps the line where it was. */}
              <ul className="flex flex-wrap max-lg:-my-[11px] lg:gap-6">
                {legalNav.map((l, i) => (
                  <li key={l.href} className="max-lg:flex max-lg:items-center">
                    {i > 0 ? (
                      <span aria-hidden="true" className="lg:hidden">
                        &nbsp;·&nbsp;
                      </span>
                    ) : null}
                    <NavLink
                      href={l.href}
                      prefetch={false}
                      className="hover:text-cream max-lg:inline-flex max-lg:min-h-11 max-lg:items-center lg:relative lg:after:absolute lg:after:-inset-x-2 lg:after:-inset-y-2"
                    >
                      {l.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

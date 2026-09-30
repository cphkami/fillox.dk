import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { clinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { footerNav, legalNav, mainNav } from "@/content/navigation";
import { ui } from "@/content/ui";

const contactCards = [
  { label: ui.callUs, value: site.contact.phone, href: site.contact.phoneHref },
  { label: ui.writeUs, value: site.contact.email, href: site.contact.emailHref },
];

/** Joins inline items with a separator that only shows below lg (desktop stacks them as lines). */
function MobileJoined({ parts, separator }: { parts: string[]; separator: string }) {
  return parts.map((part, i) => (
    <span key={i} className="lg:block">
      {i > 0 ? <span className="lg:hidden">{separator}</span> : null}
      {part}
    </span>
  ));
}

/**
 * Plum footer block (design 6a bottom / mf bottom): contact band with phone,
 * e-mail and "Book tid"; logo + tagline; one column per clinic; footer links;
 * copyright + legal links. Spans the fluid site canvas with the surface margin (like
 * every rounded band), its fr-based grids spread with the width.
 */
export function Footer() {
  const clinicsHref = mainNav.find((n) => n.kind === "clinics")?.href ?? "/klinikker";
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
              <span className="mb-1 block text-[11px] font-semibold tracking-[.12em] text-powder uppercase lg:mb-1.5 lg:text-[12px]">
                {card.label}
              </span>
              <span className="block text-[19px] font-semibold break-words text-cream lg:text-[22px] lg:tracking-[-.01em]">
                {card.value}
              </span>
            </a>
          ))}
          <ButtonLink
            href={site.booking.href}
            variant="light"
            size="lg"
            className="w-full md:col-span-2 lg:col-span-1 lg:h-auto lg:w-auto lg:px-9 lg:py-4 lg:text-[14px]"
          >
            {ui.bookCta}
          </ButtonLink>
        </div>

        {/* Brand + clinics. Below lg the wrapper dissolves so the brand can move above the contact band. */}
        <div className="contents lg:grid lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] lg:gap-10 lg:border-b lg:border-cream/18 lg:pb-10">
          <div className="order-first flex flex-col gap-[22px] text-[14px] leading-[1.6] lg:order-none lg:gap-5 lg:leading-[1.7]">
            <Image
              src={site.brand.logoLight}
              alt={site.name}
              width={site.brand.logoWidth}
              height={site.brand.logoHeight}
              className="h-7 w-auto self-start lg:h-[34px]"
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
                className="border-t border-cream/18 py-4 text-[14px] leading-[1.6] lg:border-0 lg:py-0 lg:leading-[1.7]"
              >
                <Link
                  href={`${clinicsHref}#${c.slug}`}
                  className="mb-1 block text-[16px] font-semibold text-cream hover:text-powder lg:mb-2"
                >
                  {c.name}
                </Link>
                {c.status === "coming-soon" ? (
                  <p className="text-powder lg:mt-2.5">{c.openingNote}</p>
                ) : (
                  <>
                    <p>
                      <MobileJoined parts={c.address} separator=", " />
                    </p>
                    <p className="text-powder lg:mt-2.5">
                      <MobileJoined parts={c.hours.map((h) => `${h.days} ${h.hours}`)} separator=" · " />
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer links + legal */}
        <div className="flex flex-col gap-[22px] lg:flex-row lg:flex-wrap lg:justify-between lg:gap-4 lg:pt-7">
          <nav aria-label={layoutCopy.footer.navLabel}>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-cream/18 pt-[18px] text-[14px] text-cream md:grid-cols-3 lg:flex lg:flex-wrap lg:gap-7 lg:border-0 lg:pt-0">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-powder">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-[12px] leading-[1.8] text-rule lg:flex lg:flex-wrap lg:gap-6 lg:text-[14px] lg:leading-normal">
            <p>{copyright}</p>
            <nav aria-label={layoutCopy.footer.legalLabel}>
              <ul className="flex flex-wrap lg:gap-6">
                {legalNav.map((l, i) => (
                  <li key={l.href}>
                    {i > 0 ? (
                      <span aria-hidden="true" className="lg:hidden">
                        &nbsp;·&nbsp;
                      </span>
                    ) : null}
                    <Link href={l.href} className="hover:text-cream">
                      {l.label}
                    </Link>
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

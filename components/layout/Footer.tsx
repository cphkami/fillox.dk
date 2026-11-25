import Image from "next/image";
import Link from "next/link";
import { ConsentSettingsButton } from "@/components/consent";
import { HoursSummary } from "@/components/ui/HoursSummary";
import { JoinedLines } from "@/components/ui/JoinedLines";
import { site } from "@/config/site";
import { clinics } from "@/content/clinics";
import { consentCopy } from "@/content/consent";
import { layoutCopy } from "@/content/layout";
import { footerNav, legalNav } from "@/content/navigation";
import { routes } from "@/content/routes";
import { ui } from "@/content/ui";
import { containerClasses } from "@/components/ui/Container";
import { FooterNewsletter } from "./FooterNewsletter";
import { FooterTrust } from "./FooterTrust";
import { logoSizes } from "./logoSizes";
import { NavLink } from "./NavLink";

type ContactCard = {
  label: string;
  value: string;
  href: string;
  /** A page on the site: rendered with next/link and a trailing arrow ("Find en tid →"). */
  internal?: boolean;
};

/** The contact band: three equal ways to reach Fillox (phone, e-mail, online booking). */
const contactCards: ContactCard[] = [
  { label: ui.callUs, value: site.contact.phone, href: site.contact.phoneHref },
  { label: ui.writeUs, value: site.contact.email, href: site.contact.emailHref },
  {
    label: layoutCopy.footer.bookingCard.label,
    value: layoutCopy.footer.bookingCard.value,
    href: site.booking.href,
    internal: true,
  },
];

/**
 * The legal links and the "Cookieindstillinger" button: 44px rows below lg; from lg an invisible
 * hit area 8px wider on each side and 44px high, centred on the text (the text does not move).
 */
const legalLinkClasses =
  "hover:text-on-footer hover:underline hover:decoration-1 hover:underline-offset-[3px] max-lg:inline-flex max-lg:min-h-11 max-lg:items-center lg:relative lg:after:absolute lg:after:-inset-x-2 lg:after:inset-y-[calc(50%-22px)]";

const cardClasses =
  "group block rounded-[18px] bg-footer-card px-5 py-4 transition-colors hover:bg-footer-card-hover focus-visible:bg-footer-card-hover lg:rounded-[20px] lg:px-7 lg:py-[22px]";

function ContactCardLink({ card }: { card: ContactCard }) {
  const content = (
    <>
      <span className="mb-1 block text-micro font-semibold tracking-[.12em] text-footer-accent uppercase lg:mb-1.5">
        {card.label}
      </span>
      <span className="block text-[19px] font-semibold break-words text-on-footer lg:text-h3 lg:tracking-[-.01em]">
        {card.value}
        {card.internal ? (
          <>
            {" "}
            <span
              aria-hidden="true"
              className="inline-block leading-none transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1"
            >
              →
            </span>
          </>
        ) : null}
      </span>
    </>
  );

  // Not prefetched, like the footer links: the header's "Book tid" already leads to the page.
  return card.internal ? (
    <Link href={card.href} prefetch={false} className={cardClasses}>
      {content}
    </Link>
  ) : (
    <a href={card.href} className={cardClasses}>
      {content}
    </a>
  );
}

/**
 * Footer block (design 6a bottom / mf bottom) in the header's colour (the owner, 2026-11-25:
 * "footer har den samme farve som header, lidt lysere beige"; it was a Sandbeige band): offwhite
 * like the page, opened by a hairline and set on the content gutter like the header, so its text
 * lines up with every section's; the beige is in its cards (`footer-card` = sand). Tokens in
 * app/globals.css (`--color-footer*`), espresso text, the dark logo and the accent button: newsletter signup (owner, 2026-10; `FooterNewsletter`, whose
 * "Tilmeld" is the footer's only button); contact band with three equal cards: phone, e-mail and
 * online booking ("Book online · Find en tid →", owner 2026-10: two buttons in the footer made no
 * sense, the header keeps its sticky "Book tid"); logo + tagline; one column per clinic; footer
 * links; copyright + legal links + the "Cookieindstillinger" button (reopens the cookie banner,
 * components/consent); the Trustpilot strip (owner, 2026-10; `FooterTrust`). Spans the
 * fluid site canvas with the content gutter (like the header), its fr-based grids spread with the
 * width.
 *
 * Below 1024px the block is one column: logo + tagline, newsletter, the three contact cards
 * (stacked below 768px, one row from 768px), clinics, links, legal, Trustpilot.
 */
export function Footer() {
  const clinicsHref = routes.clinics;
  const copyright = `© ${site.name} · ${site.company.registrationLabel} ${site.company.registrationNumber}`;

  return (
    <footer className={`${containerClasses("content")} mt-surface bg-footer`}>
      <div
        data-surface="footer"
        className="flex flex-col gap-[22px] border-t border-footer-line pt-9 pb-7 text-footer-body lg:block lg:pt-fluid-64 lg:pb-8"
      >
        {/* Newsletter (hidden on /blog, which has its own band right above the footer). Below lg
            the dividers above and below set it apart from the logo and the contact cards. */}
        <FooterNewsletter className="border-y border-footer-line py-7 lg:mb-10 lg:border-t-0 lg:pt-0 lg:pb-10" />

        {/* Contact band: three equal cards (phone, e-mail, online booking), stacked below 768px. */}
        <ul className="flex flex-col gap-2.5 md:grid md:grid-cols-3 lg:mb-10 lg:gap-6 lg:border-b lg:border-footer-line lg:pb-10">
          {contactCards.map((card) => (
            <li key={card.href} className="flex flex-col *:flex-1">
              <ContactCardLink card={card} />
            </li>
          ))}
        </ul>

        {/* Brand + clinics. Below lg the wrapper dissolves so the brand can move above the contact band. */}
        <div className="contents lg:grid lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))] lg:gap-10 lg:border-b lg:border-footer-line lg:pb-10">
          <div className="order-first flex flex-col gap-[22px] text-small leading-[1.6] lg:order-none lg:gap-5 lg:leading-[1.7]">
            {/* The dark logo (the header's). In Windows high contrast it keeps a white plate (a dark
                canvas would swallow it), as in the header. */}
            <Image
              src={site.brand.logoDark}
              alt={site.name}
              width={site.brand.logoWidth}
              height={site.brand.logoHeight}
              sizes={logoSizes(24, 28, 30)}
              // 24px mobile · 28px desktop · 28 → 30px from 1280 (in proportion to the 22 / 30 → 32px header logo).
              className="h-6 w-auto self-start forced-colors:bg-white forced-colors:forced-color-adjust-none lg:h-7 xl:h-[clamp(28px,calc(20px+0.625vw),30px)]"
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
                className="border-t border-footer-line py-4 text-small leading-[1.6] lg:border-0 lg:py-0 lg:leading-[1.7]"
              >
                <Link
                  href={`${clinicsHref}#${c.slug}`}
                  // The invisible after: box makes the name a 44px touch target without moving it.
                  className="relative mb-1 block text-body font-semibold text-on-footer after:absolute after:inset-x-0 after:-inset-y-2.5 hover:text-footer-accent hover:underline hover:decoration-1 hover:underline-offset-[3px] lg:mb-2"
                >
                  {c.name}
                </Link>
                {c.status === "coming-soon" ? (
                  <p className="text-footer-accent lg:mt-2.5">{c.openingNote}</p>
                ) : (
                  <>
                    <p>
                      <JoinedLines parts={c.address} separator=", " />
                    </p>
                    <HoursSummary
                      parts={c.hours.map((h) => `${h.days} ${h.hours}`)}
                      className="text-footer-accent lg:mt-2.5 lg:flex-col"
                    />
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer links + legal. Not prefetched (still client-side navigation): they are on every
            page, and prefetching them all on scroll costs more mobile data than the rare click saves. */}
        {/* When the links and the legal line wrap onto two rows (1024–1279px), 28px between the rows
            keeps their 44px hit areas from overlapping. */}
        <div className="flex flex-col gap-[22px] lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-4 lg:gap-y-7 lg:pt-7">
          {/* Below lg the links are 44px rows (touch targets) with no gap; the padding above and the
              negative margin below keep the first and last line where the design has them. From lg
              (one row) an invisible after: box enlarges each link's hit area to 44px high and 8px wider on each side. */}
          <nav aria-label={layoutCopy.footer.navLabel} className="max-lg:-mb-[11px]">
            <ul className="grid grid-cols-2 gap-x-4 border-t border-footer-line pt-[7px] text-ui-sm text-on-footer md:grid-cols-3 lg:flex lg:flex-wrap lg:gap-7 lg:border-0 lg:pt-0">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <NavLink
                    href={l.href}
                    prefetch={false}
                    className="hover:text-footer-accent hover:underline hover:decoration-1 hover:underline-offset-[3px] max-lg:inline-flex max-lg:min-h-11 max-lg:items-center lg:relative lg:after:absolute lg:after:-inset-x-2 lg:after:inset-y-[calc(50%-22px)]"
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-[12px] leading-[1.8] text-footer-body lg:flex lg:flex-wrap lg:gap-6 lg:text-small lg:leading-normal">
            <p>{copyright}</p>
            <nav aria-label={layoutCopy.footer.legalLabel}>
              {/* 44px touch targets below lg; the negative margin keeps the line where it was. Below
                  360px the three do not fit one line: one per row, without the separator dots (a
                  wrapped "· Cookieindstillinger" would start its line with a dot). */}
              <ul className="flex flex-wrap max-lg:-my-[11px] max-[359px]:flex-col max-[359px]:items-start lg:gap-6">
                {legalNav.map((l, i) => (
                  <li key={l.href} className="max-lg:flex max-lg:items-center">
                    {i > 0 ? (
                      <span aria-hidden="true" className="max-[359px]:hidden lg:hidden">
                        &nbsp;·&nbsp;
                      </span>
                    ) : null}
                    <NavLink href={l.href} prefetch={false} className={legalLinkClasses}>
                      {l.label}
                    </NavLink>
                  </li>
                ))}
                {/* Reopens the cookie banner (components/consent); only when the market has tags. */}
                {site.analytics.gtmId ? (
                  <li className="max-lg:flex max-lg:items-center">
                    <span aria-hidden="true" className="max-[359px]:hidden lg:hidden">
                      &nbsp;·&nbsp;
                    </span>
                    <ConsentSettingsButton label={consentCopy.footerButton} className={legalLinkClasses} />
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </div>

        {/* Trustpilot, the last line of the footer on every page. */}
        <FooterTrust className="border-t border-footer-line pt-6 lg:mt-7 lg:pt-7" />
      </div>
    </footer>
  );
}

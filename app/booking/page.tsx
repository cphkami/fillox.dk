import type { Metadata } from "next";
import { BookingEmbed } from "@/components/booking/BookingEmbed";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { pageMetadata } from "@/lib/metadata";

const copy = layoutCopy.booking;

/**
 * The help block's phone / e-mail pills: Button `compact` (44px, 0 20px) up to 1280px, then
 * growing with their 16 → 17px label to 48px high, 0 22px on the 1600 canvas.
 */
const contactPill = "xl:h-fluid-44/48 xl:px-fluid-20/22";

export const metadata: Metadata = pageMetadata(
  { title: copy.metaTitle, description: copy.metaDescription },
  site.booking.href,
);

/**
 * /booking — intro + the online booking of the market's provider (components/booking/BookingEmbed:
 * the Gecko Booking calendar on fillox.dk, mirroring the live fillox.dk/booking; a clinic picker +
 * TIMMA reservation page on fillox.no).
 * Wide (≥1280px): the intro band spans the surface band with the help block beside the
 * intro (hairline on its left) instead of under it; type and padding grow with the viewport.
 * The band's side padding matches the other heroes (64px at 1280, 80px from 1536px), so its
 * text lines up with the footer. The help block reads as a secondary call to action: from
 * 1280 its title grows 15 → 18px, above its 16 → 17px pills (44 → 48px high); its text keeps
 * `text-small` (14 → 15px, one line). The help block is capped at 440px (480px at 1600,
 * growing with its text), so longer help copy (other markets) wraps instead of squeezing the
 * intro.
 * The white booking card spans the band too; BookingEmbed sizes it and the embed inside it
 * per provider. Card and Gecko calendar are both white, so no edge shows.
 */
export default function BookingPage() {
  return (
    <>
      <Container as="section" gutter="surface" aria-labelledby="booking-title">
        <div className="rounded-[24px] bg-sand px-[22px] pt-9 pb-8 md:px-14 md:pt-16 md:pb-14 lg:px-[72px] lg:pt-fluid-64 lg:pb-fluid-56 xl:grid xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end xl:gap-fluid-64/96 xl:px-16 2xl:px-20">
          <div>
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h1
              id="booking-title"
              className="mt-4 text-[36px] leading-[1.08] font-semibold tracking-display md:mt-5 md:text-h1-sm"
            >
              {copy.title}
            </h1>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.7] text-muted md:mt-5 md:text-lead md:leading-[1.75]">
              {copy.intro}
            </p>
          </div>
          <div className="mt-7 border-t border-line pt-6 md:mt-9 xl:mt-0 xl:max-w-[clamp(440px,calc(280px+12.5vw),480px)] xl:border-t-0 xl:border-l xl:pt-0 xl:pb-1 xl:pl-[clamp(40px,calc(8px+2.5vw),48px)]">
            <p className="text-body-sm font-semibold xl:text-[length:clamp(15px,calc(3px+0.9375vw),18px)]">
              {copy.helpTitle}
            </p>
            <p className="mt-1 text-small leading-[1.6] text-muted">{copy.helpText}</p>
            <div className="mt-4 flex flex-wrap gap-2.5 xl:mt-fluid-16/20">
              <ButtonLink href={site.contact.phoneHref} variant="white" size="compact" className={contactPill}>
                {site.contact.phone}
              </ButtonLink>
              <ButtonLink href={site.contact.emailHref} variant="white" size="compact" className={contactPill}>
                {site.contact.email}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>

      <Container gutter="surface" className="mt-surface">
        <BookingEmbed className="overflow-hidden rounded-[24px] bg-white p-2 md:p-6 xl:p-fluid-24/32" />
      </Container>
    </>
  );
}

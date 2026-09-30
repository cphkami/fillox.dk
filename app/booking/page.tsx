import type { Metadata } from "next";
import { GeckoEmbed } from "@/components/booking/GeckoEmbed";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";

const copy = layoutCopy.booking;

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: site.booking.href },
};

/** /booking — intro + Gecko Booking calendar (mirrors the live fillox.dk/booking). */
export default function BookingPage() {
  return (
    <>
      <Container as="section" gutter="surface" aria-labelledby="booking-title">
        <div className="rounded-[24px] bg-sand px-[22px] pt-9 pb-8 md:px-14 md:pt-16 md:pb-14 lg:px-[72px]">
          <Eyebrow>{copy.eyebrow}</Eyebrow>
          <h1
            id="booking-title"
            className="mt-4 text-[36px] leading-[1.08] font-semibold tracking-display md:mt-5 md:text-[52px]"
          >
            {copy.title}
          </h1>
          <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.7] text-muted md:mt-5 md:text-[18px] md:leading-[1.75]">
            {copy.intro}
          </p>
          <div className="mt-7 border-t border-line pt-6 md:mt-9">
            <p className="text-[15px] font-semibold">{copy.helpTitle}</p>
            <p className="mt-1 text-[14px] leading-[1.6] text-muted">{copy.helpText}</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <ButtonLink href={site.contact.phoneHref} variant="white" size="compact">
                {site.contact.phone}
              </ButtonLink>
              <ButtonLink href={site.contact.emailHref} variant="white" size="compact">
                {site.contact.email}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>

      <Container gutter="surface" className="mt-3 md:mt-6">
        <div className="min-h-[640px] overflow-hidden rounded-[24px] bg-white p-2 md:p-6">
          <GeckoEmbed host={site.booking.geckoHost} icCode={site.booking.geckoIcCode} />
        </div>
      </Container>
    </>
  );
}

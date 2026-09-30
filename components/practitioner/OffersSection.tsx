import Link from "next/link";
import { Container, Eyebrow, ResponsiveText, buttonClasses } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import { getTreatment, treatmentHref } from "@/content/treatments";
import type { TeamProfile } from "@/content/types";
import { formatPriceValue } from "@/lib/content";
import { cn } from "@/lib/cn";

type OffersSectionProps = {
  offers: NonNullable<TeamProfile["offers"]>;
  /** Booking link that preselects the practitioner. */
  bookingHref: string;
  /** Anchor id ("Se behandlinger ↓" target). */
  id: string;
  titleId: string;
};

/**
 * "Det tilbyder Alberte dig" (6alb / ma).
 * Desktop: 3-column white cards (name, description, price + "Book hos Alberte").
 * Mobile: compact rows (name, price, outlined "Book" pill).
 */
export function OffersSection({ offers, bookingHref, id, titleId }: OffersSectionProps) {
  return (
    <Container as="section" id={id} aria-labelledby={titleId} className="py-11 md:py-fluid-72">
      <div className="mb-4 md:mb-fluid-48 md:text-center">
        <Eyebrow className="mb-3.5 max-md:hidden">{offers.eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {offers.title}
        </h2>
      </div>

      {/* 3 columns only where a card fits price + "Book hos …" on one row (68.75rem = 1100px; rem so it sorts after md:). */}
      <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 min-[68.75rem]:grid-cols-3">
        {offers.items.map((offer) => {
          const price = formatPriceValue(offer.price);
          const treatment = offer.treatmentSlug ? getTreatment(offer.treatmentSlug) : undefined;
          return (
            <li
              key={offer.name}
              className="flex items-center justify-between gap-2.5 rounded-[18px] bg-white py-3.5 pr-3.5 pl-[18px] md:flex-col md:items-stretch md:justify-start md:gap-0 md:rounded-[24px] md:px-[30px] md:pt-[30px] md:pb-7 2xl:px-9 2xl:pt-9 2xl:pb-8"
            >
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold md:mb-2 md:text-h3 md:tracking-display">
                  {treatment ? (
                    <Link href={treatmentHref(treatment.slug)} className="transition-colors hover:text-plum">
                      {offer.name}
                    </Link>
                  ) : (
                    offer.name
                  )}
                </h3>
                <p className="text-[14px] text-muted md:hidden">{price}</p>
              </div>
              <p className="mb-[22px] text-[16px] leading-[1.75] text-muted max-md:hidden">{offer.description}</p>
              <div className="shrink-0 md:mt-auto md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
                <span className="font-semibold whitespace-nowrap max-md:hidden">{price}</span>
                <Link
                  href={bookingHref}
                  className={cn(
                    buttonClasses({ variant: "outline", size: "xs", mobileSize: "chip" }),
                    "md:border-0 md:bg-plum md:text-cream md:hover:bg-plum-deep",
                  )}
                >
                  <ResponsiveText mobile={offers.ctaLabelShort} desktop={offers.ctaLabel} />
                  {/* Unique accessible name per button ("Book hos Alberte: Microneedling"). */}
                  <span className="sr-only">
                    {practitionerPage.offerLabelSeparator}
                    {offer.name}
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

import { ButtonLink, Container } from "@/components/ui";
import type { TeamProfile } from "@/content/types";

type BookingBandProps = { booking: NonNullable<TeamProfile["booking"]>; titleId: string };

/**
 * Closing "Book tid hos Alberte" band (desktop 6alb). The mobile design (ma) has no band — the
 * hero already carries a full-width book button — so it is hidden below 768px.
 *
 * The design's light pink (powder) band is the dusty rose band in "Støvet rosa & beige", like the
 * treatment pages' closing "Klar til at booke?" band: it sits right on top of the beige footer, and
 * the secondary beige (#E4D6CB) next to the footer's #DCCBBB read as one muddy block.
 */
export function BookingBand({ booking, titleId }: BookingBandProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId} className="max-md:hidden">
      <div
        data-surface="band"
        className="flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-band px-10 py-fluid-48 lg:px-14 xl:px-16 2xl:px-20"
      >
        <div>
          <h2 id={titleId} className="mb-1.5 font-heading text-[32px] leading-[1.15] tracking-display text-on-band xl:text-h2-sm">
            {booking.title}
          </h2>
          <p className="text-body leading-[1.75] text-band-body">{booking.text}</p>
        </div>
        <ButtonLink href={booking.cta.href} size="md">
          {booking.cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}

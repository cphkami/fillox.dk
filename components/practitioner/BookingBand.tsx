import { ButtonLink, Container } from "@/components/ui";
import type { TeamProfile } from "@/content/types";

type BookingBandProps = { booking: NonNullable<TeamProfile["booking"]>; titleId: string };

/**
 * Closing "Book tid hos Alberte" band (powder, desktop 6alb). The mobile design (ma)
 * has no band — the hero already carries a full-width book button — so it is hidden
 * below 768px.
 */
export function BookingBand({ booking, titleId }: BookingBandProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId} className="max-md:hidden">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-powder px-10 py-fluid-48 lg:px-14 xl:px-16 2xl:px-20">
        <div>
          <h2 id={titleId} className="mb-1.5 text-[32px] leading-[1.15] font-semibold tracking-display xl:text-h2-sm">
            {booking.title}
          </h2>
          <p className="text-body leading-[1.75] text-muted">{booking.text}</p>
        </div>
        <ButtonLink href={booking.cta.href} size="md">
          {booking.cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}

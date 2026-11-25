import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";

/**
 * Shown in the booking card instead of the calendar when it cannot load (no JavaScript, the
 * provider's script blocked or failing, or no calendar after a few seconds; GeckoEmbed decides):
 * one line and the two ways to book by hand, the phone and the e-mail, as in the help block above
 * the card. No hooks, so a server component can pass it to the client embed.
 */
export function BookingUnavailable() {
  const copy = layoutCopy.booking.unavailable;
  return (
    <div className="mx-auto flex max-w-[40rem] flex-col items-center px-3 py-12 text-center md:py-20">
      <p className="font-heading text-[22px] leading-[1.2] tracking-display text-balance text-heading md:text-h3">
        {copy.title}
      </p>
      <p className="mt-3 text-body leading-[1.7] text-muted">{copy.text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <ButtonLink href={site.contact.phoneHref} size="compact">
          {site.contact.phone}
        </ButtonLink>
        <ButtonLink href={site.contact.emailHref} variant="outline" size="compact">
          {site.contact.email}
        </ButtonLink>
      </div>
    </div>
  );
}

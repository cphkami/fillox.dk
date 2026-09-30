import { site } from "@/config/site";
import { openClinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { timmaReservationUrl } from "@/lib/booking";
import { cn } from "@/lib/cn";
import { GeckoEmbed } from "./GeckoEmbed";
import { TimmaEmbed, type TimmaClinic } from "./TimmaEmbed";

/**
 * The online booking on /booking for the market's provider (config/site.ts → booking):
 * - gecko (fillox.dk): Gecko Booking's calendar for every clinic. Gecko's fluid calendar keeps
 *   its 1280px width (1184px) and is centred in the card: wider, its rows (service ↔ price) and
 *   progress bar spread too far apart to read. Its text (11–14px) is set by Gecko and can't be
 *   restyled from here. Scaling the iframe up on wide screens was tried and rejected: CSS
 *   `zoom: 1.125` works in Chrome (content zoomed, Gecko's auto height still fits) but WebKit
 *   (Safari 26) zooms the content without growing its viewport, so the prices, the chevrons
 *   and the "Videre" button are cut off; a `transform: scale()` would need its own height
 *   bookkeeping around Gecko's height script and its scroll-into-view (`geckoCalcScrollTo`) on load.
 * - timma (fillox.no): a clinic picker + that clinic's TIMMA reservation page at full width.
 *   Only open clinics with a TIMMA id are offered (`npm run check:market` fails without one).
 * Adding a provider = a variant in config/types.ts (BookingConfig) + a case here.
 *
 * `className` styles the card around the embed (app/booking/page.tsx). Gecko's card keeps a
 * 640px minimum height, so the page does not jump while the calendar loads; the TIMMA card wraps
 * the picker, and its iframe reserves its own height once a clinic is chosen.
 */
export function BookingEmbed({ className }: { className?: string }) {
  const booking = site.booking;
  switch (booking.provider) {
    case "gecko":
      return (
        <div className={cn("min-h-[640px]", className)}>
          <GeckoEmbed
            host={booking.geckoHost}
            icCode={booking.geckoIcCode}
            title={layoutCopy.booking.iframeTitle}
            className="mx-auto xl:max-w-[1184px]"
          />
        </div>
      );

    case "timma": {
      const { clinicPicker, params } = layoutCopy.booking;
      const clinics = openClinics.flatMap((clinic): TimmaClinic[] => {
        const timmaId = clinic.booking?.timmaId;
        if (!timmaId) return [];
        return [
          {
            slug: clinic.slug,
            name: clinic.name,
            src: timmaReservationUrl(booking.timmaBaseUrl, timmaId),
            title: clinicPicker.iframeTitle(clinic.name),
          },
        ];
      });
      return (
        <div className={className}>
          <TimmaEmbed
            clinics={clinics}
            param={params.clinic}
            copy={{ label: clinicPicker.label, hint: clinicPicker.hint, openDirect: clinicPicker.openDirect }}
          />
        </div>
      );
    }

    default: {
      const unknown: never = booking;
      throw new Error(`BookingEmbed: unknown booking provider ${JSON.stringify(unknown)}`);
    }
  }
}

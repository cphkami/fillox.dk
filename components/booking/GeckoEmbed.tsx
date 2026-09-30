"use client";

import Script from "next/script";

type GeckoEmbedProps = {
  /** Gecko Booking host, e.g. "filloxdanmark.app4.geckobooking.dk" (site.booking.geckoHost). */
  host: string;
  /** Gecko "icCode" of the booking calendar (site.booking.geckoIcCode). */
  icCode: string;
  className?: string;
};

/**
 * Gecko Booking iframe embed, as on the live fillox.dk/booking page: a
 * `gecko_<icCode>` container + Gecko's iframe.js, which injects the booking iframe.
 */
export function GeckoEmbed({ host, icCode, className }: GeckoEmbedProps) {
  const src = `https://${host}/site/iframe.js?icCode=${icCode}`;
  const containerId = `gecko_${icCode}`;

  return (
    <>
      <div id={containerId} className={className} />
      <Script
        id={`gecko-booking-${icCode}`}
        src={src}
        strategy="afterInteractive"
        onReady={() => {
          // iframe.js injects its iframe only when it executes. next/script loads it once per
          // session, so after a client-side navigation back to /booking we re-run it.
          if (document.getElementById(`iframe_${icCode}`)) return;
          const container = document.getElementById(containerId);
          if (!container) return;
          const script = document.createElement("script");
          script.src = `${src}&t=${Date.now()}`;
          script.async = true;
          container.after(script);
        }}
      />
    </>
  );
}

"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

type GeckoEmbedProps = {
  /** Gecko Booking host, e.g. "filloxdanmark.app4.geckobooking.dk" (site.booking.geckoHost). */
  host: string;
  /** Gecko "icCode" of the booking calendar (site.booking.geckoIcCode). */
  icCode: string;
  /** Accessible name for the injected iframe (content/layout.ts → booking.iframeTitle). */
  title: string;
  className?: string;
};

/**
 * Gecko Booking iframe embed, as on the live fillox.dk/booking page: a
 * `gecko_<icCode>` container + Gecko's iframe.js, which injects the booking iframe.
 * The iframe arrives with Gecko's own marketing title, so it is renamed to `title` as
 * soon as it appears (screen readers announce a frame by its title).
 */
export function GeckoEmbed({ host, icCode, title, className }: GeckoEmbedProps) {
  const src = `https://${host}/site/iframe.js?icCode=${icCode}`;
  const containerId = `gecko_${icCode}`;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const frameId = `iframe_${icCode}`;
    const rename = () => {
      const frame = document.getElementById(frameId);
      if (!(frame instanceof HTMLIFrameElement) || !container.contains(frame)) return false;
      frame.title = title;
      return true;
    };
    if (rename()) return;
    const observer = new MutationObserver(() => {
      if (rename()) observer.disconnect();
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [icCode, title]);

  return (
    <>
      <div ref={containerRef} id={containerId} className={className} />
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

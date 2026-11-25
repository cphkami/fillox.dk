"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { preconnect } from "react-dom";

/** How long the calendar may take to appear before the fallback shows (it hides again when the calendar arrives). */
const FALLBACK_DELAY_MS = 8000;

type GeckoEmbedProps = {
  /** Gecko Booking host, e.g. "filloxdanmark.app4.geckobooking.dk" (site.booking.geckoHost). */
  host: string;
  /** Gecko "icCode" of the booking calendar (site.booking.geckoIcCode). */
  icCode: string;
  /** Accessible name for the injected iframe (content/layout.ts → booking.iframeTitle). */
  title: string;
  /**
   * Shown instead of the calendar when it cannot load: in a <noscript> (no JavaScript), at once when
   * iframe.js fails (blocked by an ad blocker or the CSP, Gecko down), and after FALLBACK_DELAY_MS
   * without the iframe; removed as soon as the iframe appears (a slow mobile connection).
   */
  fallback?: ReactNode;
  className?: string;
};

/**
 * Gecko Booking iframe embed, as on the live fillox.dk/booking page: a
 * `gecko_<icCode>` container + Gecko's iframe.js, which injects the booking iframe.
 * The iframe arrives with Gecko's own marketing title, so it is renamed to `title` as
 * soon as it appears (screen readers announce a frame by its title).
 *
 * The calendar loads as a chain from Gecko's host (iframe.js → the iframe document → its JS and
 * CSS), so the page opens the connection to that host up front (`<link rel="preconnect">` in the
 * server HTML's <head>): DNS and TLS are done before iframe.js is requested.
 *
 * Without the calendar the card would be an empty white box under an intro that says "i kalenderen
 * herunder", so `fallback` (the phone and the e-mail) takes its place (see the prop).
 */
export function GeckoEmbed({ host, icCode, title, fallback, className }: GeckoEmbedProps) {
  preconnect(`https://${host}`);
  const src = `https://${host}/site/iframe.js?icCode=${icCode}`;
  const containerId = `gecko_${icCode}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

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
    const timer = window.setTimeout(() => setFailed(true), FALLBACK_DELAY_MS);
    const observer = new MutationObserver(() => {
      if (!rename()) return;
      observer.disconnect();
      window.clearTimeout(timer);
      setFailed(false);
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [icCode, title]);

  return (
    <>
      {fallback ? (
        <>
          <noscript>{fallback}</noscript>
          {/* A live region that exists from the start, so the message is announced when it appears. */}
          <div role="status">{failed ? fallback : null}</div>
        </>
      ) : null}
      <div ref={containerRef} id={containerId} className={className} />
      <Script
        id={`gecko-booking-${icCode}`}
        src={src}
        strategy="afterInteractive"
        onError={() => setFailed(true)}
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

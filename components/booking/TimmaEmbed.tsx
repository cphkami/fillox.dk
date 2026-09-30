"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useId, useRef, useState } from "react";
import { buttonClasses } from "@/components/ui";
import { cn } from "@/lib/cn";

/** A clinic that can be booked through TIMMA, prepared on the server (BookingEmbed). */
export type TimmaClinic = {
  slug: string;
  name: string;
  /** TIMMA reservation page, e.g. https://bestill.timma.no/reservation/filloxstortingsgata. */
  src: string;
  /** Accessible name of the iframe (content/layout.ts → booking.clinicPicker.iframeTitle). */
  title: string;
};

type TimmaEmbedProps = {
  clinics: TimmaClinic[];
  /** Query parameter that preselects a clinic, e.g. "klinik" (/booking?klinik=majorstuen). */
  param: string;
  copy: { label: string; hint: string; openDirect: string };
};

/**
 * TIMMA booking (fillox.no): one reservation page per clinic. A row of clinic buttons picks the
 * clinic; its TIMMA page is embedded below at full width. The chosen clinic lives in the URL
 * (`?klinik=<slug>`), so clinic booking links (lib/booking.ts → clinicBookingHref) preselect it.
 * The page stays static: the initial HTML is the picker without a selection (Suspense fallback),
 * and the URL applies after hydration. With a single clinic it is always selected.
 */
export function TimmaEmbed(props: TimmaEmbedProps) {
  return (
    <Suspense fallback={<TimmaView {...props} selected={props.clinics.length === 1 ? props.clinics[0] : undefined} />}>
      <TimmaEmbedFromUrl {...props} />
    </Suspense>
  );
}

function TimmaEmbedFromUrl(props: TimmaEmbedProps) {
  const params = useSearchParams();
  const requested = params.get(props.param);
  const selected =
    props.clinics.find((c) => c.slug === requested) ?? (props.clinics.length === 1 ? props.clinics[0] : undefined);

  function select(slug: string) {
    // The native History API syncs with useSearchParams (no navigation, no scroll jump).
    const url = new URL(window.location.href);
    url.searchParams.set(props.param, slug);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return <TimmaView {...props} selected={selected} onSelect={select} />;
}

type ViewProps = TimmaEmbedProps & {
  selected?: TimmaClinic;
  onSelect?: (slug: string) => void;
};

function TimmaView({ clinics, copy, selected, onSelect }: ViewProps) {
  const labelId = useId();
  return (
    <div>
      <div className="px-3 pt-4 md:px-2 md:pt-2">
        <h2 id={labelId} className="text-h4 leading-[1.2] font-semibold tracking-display">
          {copy.label}
        </h2>
        <p className="mt-1.5 text-small leading-[1.6] text-muted">{copy.hint}</p>
        <div role="group" aria-labelledby={labelId} className="mt-4 flex flex-wrap gap-2 md:gap-2.5">
          {clinics.map((clinic) => {
            const isActive = clinic.slug === selected?.slug;
            return (
              <button
                key={clinic.slug}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelect?.(clinic.slug)}
                className={cn(
                  buttonClasses({ variant: isActive ? "primary" : "white", size: "chip" }),
                  // Same 1px border as the inactive buttons, so switching clinics never shifts the row.
                  isActive && "border border-plum hover:border-plum-deep",
                )}
              >
                {clinic.name}
              </button>
            );
          })}
        </div>
      </div>

      {selected ? (
        <>
          <TimmaFrame key={selected.slug} clinic={selected} />
          <p className="px-3 pt-4 pb-2 md:px-2 md:pb-0">
            {/* An invisible hit area (12px above and below) makes the link a 44px touch target. */}
            <a
              href={selected.src}
              target="_blank"
              rel="noopener"
              className="relative text-ui-sm font-medium text-plum underline decoration-plum/35 underline-offset-[3px] transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:decoration-plum"
            >
              {copy.openDirect}
            </a>
          </p>
        </>
      ) : null}
    </div>
  );
}

/** Message prefix of the iframe-resizer protocol (v2), which TIMMA's reservation page speaks. */
const RESIZER_PREFIX = "[iFrameSizer]";
/** iframe-resizer message types that carry no new height. */
const NON_SIZE_TYPES = new Set(["message", "scrollTo", "scrollToOffset", "inPageLink", "close", "pageInfo", "pageInfoStop"]);

/**
 * The TIMMA reservation iframe at full width. TIMMA's page includes iframe-resizer's child script
 * (iframeResizer.contentWindow), so instead of loading the parent library from a CDN, this speaks
 * its (v2) postMessage protocol directly: on load it sends the init message, and the page answers
 * with its content height whenever it changes. Until then (or if TIMMA drops the script) the
 * iframe keeps a fixed height and scrolls inside.
 */
function TimmaFrame({ clinic }: { clinic: TimmaClinic }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();
  const frameId = `timma-${clinic.slug}`;
  const origin = new URL(clinic.src).origin;

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== origin || event.source !== ref.current?.contentWindow) return;
      if (typeof event.data !== "string" || !event.data.startsWith(RESIZER_PREFIX)) return;
      const [id, rawHeight, , type] = event.data.slice(RESIZER_PREFIX.length).split(":");
      const next = Number(rawHeight);
      if (id !== frameId || NON_SIZE_TYPES.has(type) || !Number.isFinite(next) || next <= 0) return;
      setHeight(Math.ceil(next));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [origin, frameId]);

  /** Sends iframe-resizer's init message (its v2 defaults); the page then reports its height. */
  const init = useCallback(() => {
    // id : bodyMarginV1 : sizeWidth : log : interval : publicMethods : autoResize : bodyMargin :
    // heightCalculationMethod : bodyBackground : bodyPadding : tolerance : inPageLinks : resizeFrom
    const settings = [frameId, 8, false, false, 32, false, true, null, "offset", null, null, 0, false, "parent"];
    ref.current?.contentWindow?.postMessage(RESIZER_PREFIX + settings.map(String).join(":"), origin);
  }, [frameId, origin]);

  // Also on mount, for an iframe that finished loading before hydration (its load event is gone).
  useEffect(init, [init]);

  return (
    <iframe
      ref={ref}
      id={frameId}
      src={clinic.src}
      title={clinic.title}
      onLoad={init}
      style={height ? { height } : undefined}
      className="mt-6 block h-[1400px] min-h-[640px] w-full border-0"
    />
  );
}

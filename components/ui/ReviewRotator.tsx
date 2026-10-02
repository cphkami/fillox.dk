"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type TouchEvent } from "react";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import type { ReviewSlide } from "@/lib/reviews";
import { fillTemplate } from "@/lib/template";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { TrustpilotStars } from "./TrustpilotStars";

/**
 * Surface the rotator sits on: "light" (cream, sand, white), "band" (a rose band), "band-lg" (a
 * white card below 1024px, a rose band from 1024px: the home testimonial).
 */
type Surface = "light" | "band" | "band-lg";

type ReviewRotatorProps = {
  /** 1–6 reviews (lib/reviews.ts → toReviewSlides). The first one is the server-rendered one. */
  reviews: ReviewSlide[];
  /** Accessible name of the carousel; ignored when `labelledBy` is set. Default ui.reviewsLabel. */
  label?: string;
  /** id of a visible heading that names the carousel. */
  labelledBy?: string;
  /** "region" (default) makes the carousel a landmark; use "group" inside a section that already is one. */
  role?: "region" | "group";
  surface?: Surface;
  /** "large": pull quote (home testimonial, practitioner profile). "compact": card text (treatment pages). */
  size?: "large" | "compact";
  /** Text and controls alignment; "center-lg-start" centres below 1024px and aligns left from there. */
  align?: "center" | "start" | "center-lg-start";
  /**
   * Where a review shorter than the tallest one sits in the box: "center" (default for
   * "large") or "start" (default for "compact"; use it under a heading, so the free space
   * collects above the controls instead of between the heading and the stars).
   */
  valign?: "center" | "start";
  /** Milliseconds per review while rotating. */
  interval?: number;
  /**
   * How a review's rating is drawn: "glyphs" (default, ★ in the surface's accent) or "trustpilot"
   * (Trustpilot's green squares, next to a Trustpilot score card: one star style per section).
   */
  stars?: "glyphs" | "trustpilot";
  className?: string;
};

const DEFAULT_INTERVAL = 7000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Horizontal finger travel (px) that counts as a swipe to the next / previous review. */
const SWIPE_DISTANCE = 40;

// Inactive dots are the only visual of a control: ≥ 3:1 against the surface (WCAG 1.4.11).
// accent/65 = 4.0 : 1 on white, 3.8 : 1 on cream; band-accent/75 = 3.5 : 1 on the rose band.
// The large quote is a heading (Poppins, text-heading / text-on-band); the compact one is card
// text (Figtree, ink): `quote` is the large quote's colour, `compactQuote` the compact one's.
const surfaces = {
  light: {
    stars: "text-accent",
    quote: "text-heading",
    compactQuote: "text-ink",
    caption: "text-muted",
    button: "border-accent/30 text-accent hover:border-accent hover:bg-accent hover:text-on-accent",
    dot: "bg-accent/65 group-hover:bg-accent/85",
    dotActive: "bg-accent",
  },
  band: {
    stars: "text-band-accent",
    quote: "text-on-band",
    compactQuote: "text-on-band",
    caption: "text-band-body uppercase tracking-[2px]",
    button: "border-band-accent/40 text-band-accent hover:border-accent hover:bg-accent hover:text-on-accent",
    dot: "bg-band-accent/75 group-hover:bg-band-accent/90",
    dotActive: "bg-band-accent",
  },
  "band-lg": {
    stars: "text-accent lg:text-band-accent",
    quote: "text-heading lg:text-on-band",
    compactQuote: "text-ink lg:text-on-band",
    caption: "text-muted lg:tracking-[2px] lg:text-band-body lg:uppercase",
    button:
      "border-accent/30 text-accent hover:border-accent hover:bg-accent hover:text-on-accent lg:border-band-accent/40 lg:text-band-accent",
    dot: "bg-accent/65 group-hover:bg-accent/85 lg:bg-band-accent/75 lg:group-hover:bg-band-accent/90",
    dotActive: "bg-accent lg:bg-band-accent",
  },
} as const;

const sizes = {
  large: {
    valign: "center",
    stars: "mb-2.5 gap-1 text-[16px] md:mb-[18px] md:text-lead lg:gap-1.5",
    // Poppins 500 at every size (the big review quote is a heading role).
    quote:
      "font-heading text-[18px] leading-[1.55] md:text-h3-md md:leading-[1.4] md:tracking-display lg:text-quote lg:leading-[1.35]",
    // leading 1.5 = the design's "normal" in Poppins; Figtree's is 1.2 (a wrapped caption was cramped).
    caption: "mt-2.5 text-[13px] leading-[1.5] md:mt-4 md:text-small",
    controls: "mt-6 md:mt-8",
  },
  compact: {
    valign: "start",
    stars: "mb-3 gap-0.5 text-[15px]",
    quote: "text-body leading-[1.65] font-medium md:text-lead md:leading-[1.6]",
    caption: "mt-3 text-small leading-[1.5]",
    controls: "mt-6",
  },
} as const;

const aligns = {
  center: { text: "text-center", quote: "mx-auto max-w-[30em]", row: "justify-center" },
  start: { text: "text-left", quote: "", row: "justify-start" },
  "center-lg-start": {
    text: "text-center lg:text-left",
    quote: "mx-auto max-w-[30em] lg:mx-0",
    row: "justify-center lg:justify-start",
  },
} as const;

// The separator's leading space stays outside the no-wrap spans in the caption, so a line
// breaks before "·" and the date or the source link is never left alone on the next line.
const separatorSpace = ui.separator.match(/^\s*/)?.[0] ?? "";
const separatorMark = ui.separator.slice(separatorSpace.length);

const subscribeToNothing = () => () => {};

/** False on the server and during hydration, true once React runs in the browser. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** Whether the browser tab is in the background (false on the server and during hydration). */
function usePageHidden(): boolean {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.hidden,
    () => false,
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" className="size-3.5" fill="currentColor">
      <rect x="2.5" y="1.5" width="3" height="11" rx="1" />
      <rect x="8.5" y="1.5" width="3" height="11" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" className="size-3.5" fill="currentColor">
      <path d="M3.5 1.8v10.4a.8.8 0 0 0 1.2.7l8.3-5.2a.8.8 0 0 0 0-1.4L4.7 1.1a.8.8 0 0 0-1.2.7Z" />
    </svg>
  );
}

/**
 * Customer reviews, one at a time (WAI-ARIA APG carousel pattern).
 *
 * - Every review is rendered (server HTML included) in one grid cell, so the box keeps the
 *   height of the tallest review and nothing below it moves; only the current one is visible,
 *   the others are `invisible` + `inert`. Without JavaScript the first review shows and the
 *   controls keep their space but stay hidden (they would do nothing).
 * - Rotates every `interval` ms with a short crossfade and slide. It pauses while the pointer
 *   is over it, while focus is inside it, while the tab is hidden and while it is mostly off
 *   screen. With prefers-reduced-motion it neither rotates nor animates (no pause button).
 * - Controls (below the review): pause / play, previous / next and, when the box is ≥ 28rem,
 *   one dot button per review ("Anmeldelse 2 af 5", each its own tab stop). Below 28rem the
 *   dots are a decorative position indicator. All buttons are 44 × 44px. Using previous,
 *   next, a dot or a swipe stops the rotation; play starts it again. The caption's source
 *   link comes before the controls in tab order; focus inside the carousel pauses it, so the
 *   review never changes under a keyboard user on the way to the pause button.
 * - The slides container is aria-live="off" while it rotates and "polite" whenever it is
 *   paused (hover, focus, pause button, reduced motion …), so it is already polite when the
 *   user presses a control: a screen reader announces the review the user moved to, never
 *   the automatic changes.
 */
export function ReviewRotator({
  reviews,
  label = ui.reviewsLabel,
  labelledBy,
  role = "region",
  surface = "light",
  size = "large",
  align = "center",
  valign,
  interval = DEFAULT_INTERVAL,
  stars = "glyphs",
  className,
}: ReviewRotatorProps) {
  const count = reviews.length;
  const [index, setIndex] = useState(0);
  /** The review that is fading out (it slides out on the opposite side). */
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  /** Automatic rotation is on (until the user steps through the reviews or presses pause). */
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useMediaQuery(REDUCED_MOTION);
  const pageHidden = usePageHidden();
  const hydrated = useHydrated();
  const rootRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const autoRotate = count > 1 && playing && !reducedMotion;
  const rotating = autoRotate && !hovered && !focused && !pageHidden && inView;

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => {
      setPrevious(index);
      setDirection(1);
      setIndex((index + 1) % count);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [rotating, index, count, interval]);

  if (count === 0) return null;

  const s = surfaces[surface];
  const z = sizes[size];
  const a = aligns[align];
  const slideAlign = (valign ?? z.valign) === "start" ? "self-start" : "self-center";
  const position = (i: number) => fillTemplate(ui.reviewPosition, { n: i + 1, total: count });

  /** A user step: stops the rotation and shows review `target` (wraps around). */
  const goTo = (target: number, dir: 1 | -1) => {
    const next = ((target % count) + count) % count;
    setPlaying(false);
    if (next === index) return;
    setPrevious(index);
    setDirection(dir);
    setIndex(next);
  };

  const togglePlaying = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    // An explicit "play" overrides the pause of the pointer / focus that pressed it.
    setPlaying(true);
    setHovered(false);
    setFocused(false);
  };

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch || count < 2) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goTo(index + 1, 1);
    else goTo(index - 1, -1);
  };

  const button = cn(
    "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border leading-none transition-colors duration-200",
    s.button,
  );

  return (
    <div
      ref={rootRef}
      role={role}
      aria-roledescription={ui.carouselRole}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      data-surface={surface === "light" ? undefined : surface}
      className={cn("@container", a.text, className)}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="grid" aria-live={rotating ? "off" : "polite"} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {reviews.map((review, i) => {
          const current = i === index;
          const leaving = i === previous && !current;
          // The current review sits in place; the one leaving slides out on one side, the
          // others wait (invisible) on the side the next one comes in from.
          const offset = leaving === (direction === 1) ? "-translate-x-4" : "translate-x-4";
          return (
            // The slide role sits on a wrapper: a <figure> with a <figcaption> may not take role="group".
            <div
              key={review.id}
              role="group"
              aria-roledescription={ui.slideRole}
              aria-label={position(i)}
              inert={!current}
              className={cn(
                "col-start-1 row-start-1 transition-[opacity,translate,visibility] duration-500 ease-out",
                slideAlign,
                current ? "visible translate-x-0 opacity-100" : cn("invisible opacity-0", offset),
              )}
            >
              <figure>
                <p
                  role="img"
                  aria-label={fillTemplate(ui.reviewRating, { rating: review.rating })}
                  className={cn("flex leading-none", a.row, z.stars, s.stars)}
                >
                  {stars === "trustpilot" ? (
                    <TrustpilotStars rating={review.rating} boxClassName="size-[18px] text-[13px] md:size-5 md:text-[14px]" />
                  ) : (
                    [0, 1, 2, 3, 4].map((star) => (
                      <span key={star} className={star < review.rating ? undefined : "opacity-30"}>
                        ★
                      </span>
                    ))
                  )}
                </p>
                <blockquote
                  cite={review.url}
                  className={cn("text-pretty", z.quote, a.quote, size === "compact" ? s.compactQuote : s.quote)}
                >
                  <p>
                    {ui.quoteOpen}
                    {review.quote}
                    {ui.quoteClose}
                  </p>
                </blockquote>
                <figcaption className={cn(z.caption, s.caption)}>
                  {review.author}
                  {separatorSpace}
                  <span className="whitespace-nowrap">
                    {separatorMark}
                    <time dateTime={review.date}>{review.dateLabel}</time>
                  </span>
                  {separatorSpace}
                  <span className="whitespace-nowrap">
                    {separatorMark}
                    {/* Hit area 16px above and below the text: ≥ 44px tall at the 13px mobile
                        caption (Figtree's text box is 15px high there, Poppins' was 19). */}
                    <a
                      href={review.url}
                      target="_blank"
                      rel="noopener"
                      className="relative underline decoration-1 underline-offset-[3px] after:absolute after:-inset-x-1 after:-inset-y-4 hover:decoration-2"
                    >
                      {review.source}
                      <span className="sr-only">{` (${ui.opensInNewTab})`}</span>
                    </a>
                  </span>
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>

      {count > 1 ? (
        // Hidden until hydrated (its space kept, so nothing moves): without JavaScript they do nothing.
        <div className={cn("flex items-center gap-2", z.controls, a.row, !hydrated && "invisible")}>
          <button
            type="button"
            onClick={togglePlaying}
            aria-label={playing ? ui.reviewsPause : ui.reviewsPlay}
            className={cn(button, "motion-reduce:hidden")}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" onClick={() => goTo(index - 1, -1)} aria-label={ui.reviewPrevious} className={cn(button, "text-[17px]")}>
            <span aria-hidden="true">←</span>
          </button>

          <div role="group" aria-label={ui.reviewPicker} className="hidden @md:flex">
            {reviews.map((review, i) => (
              <button
                key={review.id}
                type="button"
                aria-label={position(i)}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className="group flex size-11 cursor-pointer items-center justify-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2 rounded-full transition-[width,background-color] duration-300",
                    i === index ? cn("w-6", s.dotActive) : cn("w-2", s.dot),
                  )}
                />
              </button>
            ))}
          </div>
          <div aria-hidden="true" className="flex items-center gap-1.5 px-1.5 @md:hidden">
            {reviews.map((review, i) => (
              <span
                key={review.id}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-300",
                  i === index ? cn("w-4", s.dotActive) : cn("w-1.5", s.dot),
                )}
              />
            ))}
          </div>

          <button type="button" onClick={() => goTo(index + 1, 1)} aria-label={ui.reviewNext} className={cn(button, "text-[17px]")}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

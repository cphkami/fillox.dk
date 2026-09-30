"use client";

import type { ComponentPropsWithoutRef, FocusEvent } from "react";
import { cn } from "@/lib/cn";

/**
 * Horizontal scroll row used below 1024px (practitioners, results): CSS scroll-snap,
 * no visible scrollbar. From lg the caller switches the row to a grid / wrapping flex.
 *
 * The 6px padding (cancelled by a negative margin) keeps the links' focus rings from
 * being clipped by the scroll container; `scroll-pl` keeps the snap position unchanged.
 * Callers add the right-hand bleed (e.g. "-mr-5 pr-5 scroll-pr-5").
 */
const rowClasses =
  "flex snap-x snap-mandatory scroll-pl-1.5 gap-3 overflow-x-auto overscroll-x-contain -my-1.5 -ml-1.5 py-1.5 pl-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:m-0 lg:snap-none lg:overflow-visible lg:p-0";

/**
 * Browsers skip the focus scroll for an element that is already partly visible, so a
 * keyboard user can tab onto a card that is mostly off-screen. Bring the focused card
 * fully into view while the row scrolls (below lg).
 */
function revealFocusedItem(event: FocusEvent<HTMLUListElement>) {
  const row = event.currentTarget;
  const target = event.target;
  if (row.scrollWidth <= row.clientWidth || !target.matches(":focus-visible")) return;
  const item = target.closest("li");
  if (!item || !row.contains(item)) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  item.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
}

/** A <ul> scroll row. Children are the <li> cards. */
export function ScrollRow({ className, onFocus, ...props }: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      {...props}
      onFocus={(event) => {
        onFocus?.(event);
        revealFocusedItem(event);
      }}
      className={cn(rowClasses, className)}
    />
  );
}

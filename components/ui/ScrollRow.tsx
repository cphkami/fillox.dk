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
 * keyboard user can tab onto a card or chip that is mostly off-screen. Bring the focused
 * item (its <li>, or the element itself in a row without list items) fully into view while
 * the row scrolls. Use as `onFocus` on any horizontally scrolling row.
 *
 * The item is aligned to the row's start (its own snap position): with scroll-snap, a
 * minimal "nearest" scroll can snap straight back to where it started and leave the item
 * cut off.
 */
export function revealFocusedItem(event: FocusEvent<HTMLElement>) {
  const row = event.currentTarget;
  const target = event.target;
  if (row.scrollWidth <= row.clientWidth || !target.matches(":focus-visible")) return;
  const listItem = target.closest("li");
  const item = listItem && row.contains(listItem) ? listItem : target;
  if (item === row) return;
  const style = getComputedStyle(row);
  const rowBox = row.getBoundingClientRect();
  const itemBox = item.getBoundingClientRect();
  const start = rowBox.left + (parseFloat(style.scrollPaddingLeft) || 0);
  const end = rowBox.right - (parseFloat(style.scrollPaddingRight) || 0);
  if (itemBox.left >= start - 1 && itemBox.right <= end + 1) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  item.scrollIntoView({ block: "nearest", inline: "start", behavior: reduceMotion ? "auto" : "smooth" });
}

type ScrollRowProps = ComponentPropsWithoutRef<"ul"> & {
  /** Skip the default row classes above: the caller styles the row (other breakpoints, gaps). */
  unstyled?: boolean;
};

/** A <ul> scroll row that keeps the keyboard-focused item in view. Children are the <li> cards. */
export function ScrollRow({ className, onFocus, unstyled, ...props }: ScrollRowProps) {
  return (
    <ul
      {...props}
      onFocus={(event) => {
        onFocus?.(event);
        revealFocusedItem(event);
      }}
      className={cn(!unstyled && rowClasses, className)}
    />
  );
}

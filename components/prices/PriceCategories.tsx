"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { buttonClasses, forcedColorsSelected } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { revealFocusedItem } from "@/components/ui/ScrollRow";
import { cn } from "@/lib/cn";

/** A price row with its price already formatted on the server ("1.199 kr", "gratis"). */
export type PriceRowView = {
  label: string;
  note?: string;
  price: string;
  /** Treatment page the label links to, when the row has one. */
  href?: string;
};

export type PriceCategoryView = {
  /** Anchor id (#fillers); also the jump-chip target. */
  id: string;
  title: string;
  /** Card label, e.g. "HYALURONSYRE". */
  eyebrow: string;
  /** Mobile jump-chip label, e.g. "Botox". */
  chipLabel: string;
  rows: PriceRowView[];
};

type PriceCategoriesProps = {
  categories: PriceCategoryView[];
  /** Accessible name of the mobile jump-chip row. */
  chipsLabel: string;
};

/**
 * The price cards (content/prices.ts), always open: every price is visible (and server-rendered) at
 * every width.
 *
 * - Desktop/tablet (≥768px, 6b): white cards, two columns from 1024px (below 1180px a
 *   few long labels put their note on a second line, as on mobile; one ~900px-wide
 *   column left the prices far from their labels). On wide screens the grid fills the
 *   fluid canvas on the content gutter and the cards grow with it: rows 14 → 16px
 *   (`text-ui-sm`), notes 12 → 14px (the design's note / row ratio), card label 12 → 13px
 *   (`text-micro`), paddings 36/32 → 48/40px between 1280 and 1600px. A third column only appears when the grid itself
 *   is ≥106rem (1696px) wide, i.e. when --canvas-max is raised to ~1860px or more: below
 *   that a third of the grid can't hold the longest card header on one line.
 * - Mobile (mp, unfolded at the owner's request): a row of jump chips, then the same
 *   cards stacked, header (20px title, label under it) over the rows. No chip is current at
 *   rest; a tapped chip, or a URL hash (/priser#konsultation), marks its chip plum.
 */
export function PriceCategories({ categories, chipsLabel }: PriceCategoriesProps) {
  /** Category picked by a chip or the URL hash; undefined until the visitor picks one. */
  const [selected, setSelected] = useState<string | undefined>();
  const chipRow = useRef<HTMLUListElement>(null);
  const idKey = categories.map((c) => c.id).join(" ");

  // Mark the chip of the card the URL hash points at, on load and on in-page hash changes.
  useEffect(() => {
    const ids = idKey.split(" ");
    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (ids.includes(id)) setSelected(id);
    };
    const frame = requestAnimationFrame(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, [idKey]);

  // Keep the picked chip visible in the horizontally scrolling chip row.
  useEffect(() => {
    const row = chipRow.current;
    if (!row || !selected) return;
    const chip = row.querySelector<HTMLElement>(`a[href="#${CSS.escape(selected)}"]`);
    if (!chip) return;
    const padding = parseFloat(getComputedStyle(row).paddingLeft) || 0;
    const rowBox = row.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    if (chipBox.left < rowBox.left + padding || chipBox.right > rowBox.right - padding) {
      row.scrollTo({ left: chipBox.left - rowBox.left + row.scrollLeft - padding });
    }
  }, [selected]);

  /** Chip jump: scroll to the card (smoothly unless reduced motion), move focus there. */
  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setSelected(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, "", `#${id}`);
  };

  return (
    <>
      <nav aria-label={chipsLabel} className="mx-auto mt-4 mb-[22px] flow-root w-full max-w-canvas md:hidden">
        {/* Centred while the chips fit; scrolls (left-aligned) once they overflow. */}
        <ul
          ref={chipRow}
          // Brings a keyboard-focused chip fully into view once the row scrolls.
          onFocus={revealFocusedItem}
          className="-my-[5px] mx-auto flex w-fit max-w-full snap-x snap-mandatory scroll-px-gutter gap-2 overflow-x-auto px-gutter py-[5px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c) => {
            const current = selected === c.id;
            return (
              <li key={c.id} className="shrink-0 snap-start">
                <a
                  href={`#${c.id}`}
                  onClick={(e) => jumpTo(e, c.id)}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    buttonClasses({ variant: current ? "primary" : "white", size: "chip" }),
                    current && forcedColorsSelected,
                  )}
                >
                  {c.chipLabel}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="@container mx-auto w-full max-w-canvas px-surface md:px-gutter md:pt-fluid-64 md:pb-fluid-48">
        <div className="flex flex-col gap-3 md:grid md:gap-fluid-24 lg:grid-cols-2 @min-[106rem]:grid-cols-3">
          {categories.map((c) => {
            const titleId = `${c.id}-title`;
            return (
              <section
                key={c.id}
                id={c.id}
                aria-labelledby={titleId}
                // Focus target of the chip jumps (not in the tab order).
                tabIndex={-1}
                className="rounded-[22px] bg-white px-5 pt-[22px] pb-1.5 focus:outline-none md:rounded-[20px] md:px-9 md:py-8 xl:px-fluid-36/48 xl:py-fluid-32/40"
              >
                {/* Mobile: label always under the title (mp's header shape), so every card header
                    has the same form whatever the title length; from 768px a baseline row (6b). */}
                <div className="mb-0.5 flex flex-wrap items-baseline justify-between gap-x-4 border-b border-ink pb-3 max-md:flex-col max-md:items-start max-md:gap-y-1 md:mb-1.5 md:pb-3.5">
                  <h2 id={titleId} className="text-[20px] font-semibold tracking-display md:text-h3">
                    {c.title}
                  </h2>
                  <Eyebrow>{c.eyebrow}</Eyebrow>
                </div>

                <dl>
                  {c.rows.map((row) => (
                    <div
                      key={`${row.label} ${row.note ?? ""}`}
                      className="relative flex justify-between gap-3 border-b border-powder py-[13px] text-ui-sm last:border-b-0"
                    >
                      <dt>
                        {row.href ? (
                          // On touch screens the whole 48px row is the tap target (a 21px text line alone is too small).
                          <Link
                            href={row.href}
                            className="decoration-1 underline-offset-[3px] hover:underline pointer-coarse:after:absolute pointer-coarse:after:inset-0"
                          >
                            {row.label}
                          </Link>
                        ) : (
                          row.label
                        )}
                        {row.note ? (
                          <>
                            {" "}
                            {/* Never split a note; on mobile it gets its own line under the label. */}
                            {/* 12px up to 1280, then 12 → 14px at 1600 so the note keeps the design's
                                note / row ratio (12 / 14) next to the 14 → 16px row (no token has this step). */}
                            <span className="text-micro whitespace-nowrap text-taupe max-md:mt-0.5 max-md:block xl:text-[clamp(12px,calc(4px+0.625vw),14px)]">
                              {row.note}
                            </span>
                          </>
                        ) : null}
                      </dt>
                      <dd className="font-bold whitespace-nowrap text-taupe uppercase">{row.price}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

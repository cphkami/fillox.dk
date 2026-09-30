"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { buttonClasses, forcedColorsSelected } from "@/components/ui/Button";
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
  /** Desktop card label, e.g. "HYALURONSYRE". */
  eyebrow: string;
  /** Mobile jump-chip label, e.g. "Botox". */
  chipLabel: string;
  /** Mobile accordion subtitle, e.g. "9 behandlinger". */
  countLabel: string;
  rows: PriceRowView[];
};

type PriceCategoriesProps = {
  categories: PriceCategoryView[];
  /** Accessible name of the mobile jump-chip row. */
  chipsLabel: string;
};

/**
 * The six price cards.
 *
 * - Desktop/tablet (≥768px, 6b): static white cards, two columns from 1024px (below
 *   1180px a few long labels put their note on a second line, as on mobile; one
 *   ~900px-wide column left the prices far from their labels). On wide
 *   screens the grid fills the fluid canvas on the content gutter and the cards grow
 *   with it. A third column only appears when the grid itself is ≥106rem (1696px)
 *   wide, i.e. when --canvas-max is raised to ~1860px or more: below that a third of
 *   the grid can't hold the longest card header on one line. From 1536px the rows
 *   go up a pixel (15px, notes 13px) so they don't look sparse in the wider cards.
 * - Mobile (mp): a row of jump chips, then each card is an accordion (closed by
 *   default) so the list doesn't get endless. A chip opens its card and scrolls to it.
 *
 * The rows are always in the DOM (hidden only by CSS on mobile), so every price is
 * server-rendered and crawlable. A URL hash (/priser#konsultation) opens its card.
 * Without JavaScript every list is shown, and before hydration a followed chip or
 * deep link opens its card through `:target`.
 */
export function PriceCategories({ categories, chipsLabel }: PriceCategoriesProps) {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  /** Category picked by a chip or the URL hash; undefined until the visitor picks one. */
  const [selected, setSelected] = useState<string | undefined>();
  /** False until the URL hash has been read; until then CSS `:target` opens the linked card. */
  const [hashSynced, setHashSynced] = useState(false);
  const toggles = useRef(new Map<string, HTMLButtonElement>());
  const chipRow = useRef<HTMLUListElement>(null);
  const idKey = categories.map((c) => c.id).join(" ");
  /** The design (mp) shows the first chip in plum before anything is picked. */
  const highlighted = selected ?? categories[0]?.id;

  /** Opens a card and marks its chip current (chip jumps and URL hashes). */
  const openCategory = (id: string) => {
    setOpen((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
    setSelected(id);
  };

  // Open the card the URL hash points at, on load and on in-page hash changes.
  useEffect(() => {
    const ids = idKey.split(" ");
    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!ids.includes(id)) return;
      setOpen((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
      setSelected(id);
    };
    const frame = requestAnimationFrame(() => {
      syncFromHash();
      setHashSynced(true);
    });
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

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    openCategory(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    toggles.current.get(id)?.focus({ preventScroll: true });
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
          {categories.map((c) => (
            <li key={c.id} className="shrink-0 snap-start">
              <a
                href={`#${c.id}`}
                onClick={(e) => jumpTo(e, c.id)}
                aria-current={selected === c.id ? "true" : undefined}
                className={cn(
                  buttonClasses({ variant: highlighted === c.id ? "primary" : "white", size: "chip" }),
                  highlighted === c.id && forcedColorsSelected,
                )}
              >
                {c.chipLabel}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="@container mx-auto w-full max-w-canvas px-surface md:px-gutter md:pt-fluid-64 md:pb-fluid-48">
        <div className="flex flex-col gap-2.5 md:grid md:gap-fluid-24 lg:grid-cols-2 @min-[106rem]:grid-cols-3">
          {categories.map((c) => {
            const isOpen = open.has(c.id);
            const titleId = `${c.id}-title`;
            const rowsId = `${c.id}-rows`;
            return (
              <section
                key={c.id}
                id={c.id}
                aria-labelledby={titleId}
                className="rounded-[22px] bg-white md:rounded-[20px] md:px-9 md:py-8 2xl:px-12 2xl:py-10"
              >
                <div className="md:mb-1.5 md:flex md:flex-wrap md:items-baseline md:justify-between md:gap-x-4 md:border-b md:border-ink md:pb-3.5">
                  <h2 id={titleId} className="font-semibold">
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) toggles.current.set(c.id, el);
                        else toggles.current.delete(c.id);
                      }}
                      aria-expanded={isOpen}
                      aria-controls={rowsId}
                      onClick={() => toggle(c.id)}
                      className="flex min-h-[68px] w-full items-center justify-between gap-4 rounded-[22px] px-5 text-left md:hidden"
                    >
                      <span>
                        <span className="block text-[18px]">{c.title}</span>
                        <span className="block text-[13px] font-normal text-muted">{c.countLabel}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-4 shrink-0 text-center text-[22px] font-normal text-muted [@media(scripting:none)]:hidden"
                      >
                        {isOpen ? "–" : "+"}
                      </span>
                    </button>
                    <span className="text-h3 tracking-display max-md:hidden">{c.title}</span>
                  </h2>
                  <p className="text-[12px] font-bold tracking-[2px] text-plum uppercase max-md:hidden">{c.eyebrow}</p>
                </div>

                <dl
                  id={rowsId}
                  className={cn(
                    "mx-5 mb-1.5 border-t border-powder md:mx-0 md:mb-0 md:block md:border-t-0",
                    !isOpen && "max-md:hidden",
                    // No JS (or not hydrated yet): the accordion can't toggle, so don't hide prices.
                    "[@media(scripting:none)]:block!",
                    !hashSynced && "[:target>&]:block",
                  )}
                >
                  {c.rows.map((row) => (
                    <div
                      key={`${row.label} ${row.note ?? ""}`}
                      className="flex justify-between gap-3 border-b border-powder py-[13px] text-[14px] last:border-b-0 2xl:text-[15px]"
                    >
                      <dt>
                        {row.href ? (
                          <Link href={row.href} className="decoration-1 underline-offset-[3px] hover:underline">
                            {row.label}
                          </Link>
                        ) : (
                          row.label
                        )}
                        {row.note ? (
                          <>
                            {" "}
                            {/* Never split a note; on mobile it gets its own line under the label. */}
                            <span className="text-[12px] whitespace-nowrap text-taupe max-md:mt-0.5 max-md:block 2xl:text-[13px]">{row.note}</span>
                          </>
                        ) : null}
                      </dt>
                      {/* Taupe (#b39c89) is the design's price colour; its contrast on white
                          (2.6:1) is below WCAG AA and awaits a design decision. */}
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

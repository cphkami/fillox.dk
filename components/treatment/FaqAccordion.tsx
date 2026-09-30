"use client";

import { useId, useState, useSyncExternalStore } from "react";
import type { FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";

const MOBILE_QUERY = "(max-width: 767.98px)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * FAQ accordion. Desktop (6c/6bx) starts with every item closed; mobile (mb) shows the
 * first answer open until the visitor toggles something. The server cannot know the
 * viewport, so until hydration (or without JS) the mobile default comes from CSS.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const isMobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
  // `undefined` = untouched: follow the per-breakpoint default.
  const [openState, setOpenState] = useState<Set<number> | undefined>(undefined);
  const open = openState ?? new Set(isMobile ? [0] : []);

  function toggle(index: number) {
    const next = new Set(open);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setOpenState(next);
  }

  return (
    <div className="mt-4 md:mt-0">
      {items.map((item, i) => {
        const isOpen = open.has(i);
        // Untouched first item that JS has not (yet) opened: open it below md with CSS.
        const cssOpenOnMobile = openState === undefined && i === 0 && !isOpen;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.question} className="border-t border-rule md:border-[#d9c9bf] md:last:border-b">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-3 pt-4 text-left text-[16px] font-semibold md:pt-[22px] md:text-[18px] md:tracking-display",
                  isOpen ? "pb-2 md:pb-3" : "pb-4 md:pb-[22px]",
                  cssOpenOnMobile && "max-md:pb-2",
                )}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="flex shrink-0 items-center justify-center font-semibold text-plum md:size-[38px] md:rounded-full md:border md:border-ink md:text-[18px] md:font-normal md:tracking-normal md:text-ink"
                >
                  {cssOpenOnMobile ? (
                    <>
                      <span className="md:hidden">–</span>
                      <span className="max-md:hidden">+</span>
                    </>
                  ) : isOpen ? (
                    "–"
                  ) : (
                    "+"
                  )}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid",
                // Animate only after the visitor has toggled, not when the default changes with the viewport.
                openState && "transition-[grid-template-rows,visibility] duration-200 ease-out",
                isOpen ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
                cssOpenOnMobile && "max-md:visible max-md:grid-rows-[1fr]",
              )}
            >
              <div className="overflow-hidden">
                {/* 70ch (incl. the 56px right padding) = the design's measure, ≈ 82 Poppins
                    characters; from 2xl, beside the heading, 62ch ≈ 570px of text ≈ 72 characters,
                    the measure of the other intros. */}
                <p className="pb-4 text-[15px] leading-[1.65] text-muted md:max-w-[70ch] md:pr-14 md:pb-[22px] md:text-[16px] md:leading-[1.75] 2xl:max-w-[62ch]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

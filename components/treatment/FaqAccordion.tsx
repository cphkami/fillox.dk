"use client";

import { useId, useState } from "react";
import type { FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/useMediaQuery";

const MOBILE_QUERY = "(max-width: 767.98px)";

/**
 * FAQ accordion. Desktop (6c/6bx) starts with every item closed; mobile (mb) shows the
 * first answer open until the visitor toggles something. Questions: the heading face at
 * every width (Poppins 500, espresso; 16px below 768 as in production, `text-lead` from 768);
 * answers Figtree. The server cannot know the
 * viewport, so until hydration (or without JS) the mobile default comes from CSS.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const isMobile = useMediaQuery(MOBILE_QUERY);
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
          <div key={item.question} className="border-t border-rule/70 md:last:border-b">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-3 pt-4 text-left font-heading text-[16px] text-heading md:pt-[22px] md:text-lead md:tracking-display",
                  isOpen ? "pb-2 md:pb-3" : "pb-4 md:pb-[22px]",
                  cssOpenOnMobile && "max-md:pb-2",
                )}
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="flex shrink-0 items-center justify-center font-semibold text-accent md:size-[38px] md:rounded-full md:border md:border-accent md:text-[18px] md:font-normal md:tracking-normal"
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
                {/* 52ch ≈ 73 Figtree characters at any font size (1ch = 0.64em, an average
                    letter 0.46em; the design's 70ch column ran ≈ 82 in Poppins, over the
                    75-character best practice); it also keeps the text clear of the 38px toggle. Body size on mobile too (16px: the design's 15 raised to the
                    body-text minimum). */}
                <p className="pb-4 text-body leading-[1.65] text-muted md:max-w-[52ch] md:pb-[22px] md:leading-[1.75]">
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

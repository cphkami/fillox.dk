"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui";
import type { Link } from "@/content/types";
import { cn } from "@/lib/cn";

type MobileBookBarProps = {
  name: string;
  /** "fra 999 kr" */
  price?: string;
  cta: Link;
  /** id of the closing booking band: the bar hides once that band scrolls into view. */
  hideAtId: string;
};

/**
 * Fixed book bar at the bottom of treatment pages below 768px (design mb). It follows
 * the page down and slides away when the closing booking band (and the footer after it)
 * is reached, so it never covers the footer.
 */
export function MobileBookBar({ name, price, cta, hideAtId }: MobileBookBarProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById(hideAtId);
    if (!target) return;
    let frame = 0;
    // Hidden once the band's top edge has entered the viewport (also after jumping past it).
    const update = () => {
      frame = 0;
      setHidden(target.getBoundingClientRect().top < window.innerHeight);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [hideAtId]);

  return (
    <div
      // Marker for app/globals.css: while the bar is shown (not inert), the page reserves its
      // height as scroll padding so a focused element never ends up hidden under it.
      data-mobile-book-bar=""
      inert={hidden}
      className={cn(
        "fixed inset-x-3 bottom-[max(10px,env(safe-area-inset-bottom))] z-40 transition-[translate,opacity] duration-300 md:hidden",
        hidden && "pointer-events-none translate-y-[calc(100%+20px)] opacity-0",
      )}
    >
      <div className="flex items-center justify-between gap-3 rounded-full bg-white py-2 pr-2 pl-[22px] shadow-float">
        <p className="min-w-0 text-[14px]">
          <span className="block truncate font-semibold">{name}</span>
          {/* 14px (the design's 13, raised to the small-text minimum); the 48px button still sets the bar's height. */}
          {price ? <span className="block text-[14px] text-muted">{price}</span> : null}
        </p>
        <ButtonLink href={cta.href} size="compact" className="h-12! px-6!">
          {cta.label}
        </ButtonLink>
      </div>
    </div>
  );
}

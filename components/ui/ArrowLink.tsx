import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ArrowLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  /**
   * - "accent" (default) on light surfaces: accent text (10:1 on cream), accent-deep on hover.
   * - "band" on a rose band: on-band text, band-accent on hover.
   * - "ink": ink text, accent on hover.
   */
  tone?: "accent" | "band" | "ink";
  /**
   * - "md" (default) `text-ui-sm`: the design's 14px, growing to 16px at 1600px (page links:
   *   "Se priser →", "Mød hele teamet →").
   * - "menu" 15px at every width: links inside the header menus ("Se alle klinikker →"), which
   *   keep one fixed size from 1024px up.
   */
  size?: "md" | "menu";
};

const sizes = { md: "text-ui-sm", menu: "text-[15px]" } as const;

/**
 * Semibold text link with a trailing arrow, e.g. "Se alle behandlinger →" (Figtree 600, accent).
 * An invisible hit area (12px above and below, 4px to the sides) makes it a 44px touch target
 * without moving the text; keep 12px free around it for other links.
 */
export function ArrowLink({ tone = "accent", size = "md", className, children, ...props }: ArrowLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group relative inline-block font-semibold transition-colors after:absolute after:-inset-x-1 after:-inset-y-3",
        sizes[size],
        tone === "accent" && "text-accent hover:text-accent-deep",
        tone === "band" && "text-on-band hover:text-band-accent",
        tone === "ink" && "text-ink hover:text-accent",
        className,
      )}
    >
      {children}{" "}
      <span aria-hidden="true" className="inline-block leading-none transition-transform duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

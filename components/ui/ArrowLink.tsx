import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ArrowLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  /** "plum" (default) on light surfaces, "powder" on plum surfaces. */
  tone?: "plum" | "powder" | "ink";
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
 * Semibold text link with a trailing arrow, e.g. "Se alle behandlinger →" (600/plum).
 * An invisible hit area (12px above and below, 4px to the sides) makes it a 44px touch target
 * without moving the text; keep 12px free around it for other links.
 */
export function ArrowLink({ tone = "plum", size = "md", className, children, ...props }: ArrowLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group relative inline-block font-semibold transition-colors after:absolute after:-inset-x-1 after:-inset-y-3",
        sizes[size],
        tone === "plum" && "text-plum hover:text-plum-deep",
        tone === "powder" && "text-powder hover:text-cream",
        tone === "ink" && "text-ink hover:text-plum",
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

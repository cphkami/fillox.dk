import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ArrowLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  /** "plum" (default) on light surfaces, "powder" on plum surfaces. */
  tone?: "plum" | "powder" | "ink";
};

/** Semibold text link with a trailing arrow, e.g. "Se alle behandlinger →" (14px/600/plum). */
export function ArrowLink({ tone = "plum", className, children, ...props }: ArrowLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group inline-block text-[14px] font-semibold transition-colors",
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

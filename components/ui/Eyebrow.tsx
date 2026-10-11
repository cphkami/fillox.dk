import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  /** The default on light surfaces (plum: 8.8:1 on offwhite, 7.5:1 on sand). */
  accent: "text-accent",
  muted: "text-muted",
  /** On a rosa band (6.4:1). */
  band: "text-band-accent",
  /** In the footer (5.0:1). */
  footer: "text-footer-accent",
  taupe: "text-taupe",
} as const;

const sizes = {
  /** 12px (`text-micro`, 13 at 1600) · 700 · +2px — the default eyebrow on every page. */
  sm: "text-micro font-bold tracking-[2px]",
  /** 14px (`text-small`, 15 at 1600) · 600 · +.2em — the desktop hero eyebrow ("Æstetisk medicin"). */
  lg: "text-small font-semibold tracking-[.2em]",
} as const;

type EyebrowProps = {
  children: ReactNode;
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  /** Element to render; defaults to <p>. */
  as?: "p" | "div" | "span";
  className?: string;
};

/** Small uppercase label above headings (e.g. "ÆSTETISK MEDICIN"). */
export function Eyebrow({ children, tone = "accent", size = "sm", as: Tag = "p", className }: EyebrowProps) {
  return <Tag className={cn("uppercase", sizes[size], tones[tone], className)}>{children}</Tag>;
}

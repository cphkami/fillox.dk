import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  plum: "text-plum",
  muted: "text-muted",
  /** On plum surfaces. */
  powder: "text-powder",
  blush: "text-blush",
  taupe: "text-taupe",
} as const;

const sizes = {
  /** 12px · 700 · +2px — the default eyebrow on every page. */
  sm: "text-[12px] font-bold tracking-[2px]",
  /** 14px · 600 · +.2em — the desktop hero eyebrow ("Æstetisk medicin"). */
  lg: "text-[14px] font-semibold tracking-[.2em]",
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
export function Eyebrow({ children, tone = "plum", size = "sm", as: Tag = "p", className }: EyebrowProps) {
  return <Tag className={cn("uppercase", sizes[size], tones[tone], className)}>{children}</Tag>;
}

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  title: ReactNode;
  /** Optional paragraph under the title (16px/1.75 → 18px at 1600 via `text-body`, max 56ch). */
  intro?: ReactNode;
  /** Optional eyebrow above the title. */
  eyebrow?: ReactNode;
  align?: "center" | "left";
  /** Heading level; defaults to h2. */
  as?: "h1" | "h2" | "h3";
  /** "light" = cream title + blush intro, for plum surfaces. */
  tone?: "ink" | "light";
  /**
   * Desktop (≥768px) line-height of the 40px title. Mobile is always 28px/1.15.
   * - "tight" (default) 1.1 — 6a "Vores bestsellers"; 6alb all three H2s; 6b "Del betalingen op i
   *   rater"; 6c/6bx practitioner H2, "Vælg din mængde" / "Betal pr. område", "Læs mere om …";
   *   6om "Hvorfor vælge Fillox".
   * - "normal" (the design's line-height: normal, one line = 60px instead of 44px; built as 1.1 plus
   *   .2em padding above and below, so a single line is identical and a wrapped title keeps a
   *   1.1 line gap instead of 1.5) — 6a "Vi fremkalder, vi
   *   forandrer ikke", "Mød dem, der behandler dig", "Her finder du Fillox"; 6om "Mød vores
   *   behandlere"; 6c/6bx "Om behandlingen", "Resultater med …", "Ofte stillede spørgsmål",
   *   "Klar til at booke?"; 6ko "Besøg os".
   */
  leading?: "tight" | "normal";
  /**
   * Gap between title and intro in px: 16 (default; 6a, "Resultater med …") or 12
   * (6c/6bx "Læs mere om …").
   */
  introGap?: 12 | 16;
  /** id on the heading, for aria-labelledby on the section. */
  id?: string;
  /** Layout classes on the wrapper <div> (margins, max-width). */
  className?: string;
  /** Extra classes on the heading, e.g. a max-width. Arbitrary values win over the defaults. */
  titleClassName?: string;
  /** Extra classes on the intro <p>, e.g. "max-w-[52ch]". */
  introClassName?: string;
};

const leadings = {
  tight: "leading-[1.15] md:leading-[1.1]",
  normal: "leading-[1.15] md:py-[.2em] md:leading-[1.1]",
} as const;

const introGaps = { 12: "mt-3", 16: "mt-4" } as const;

/**
 * Section title: Poppins 600, -0.03em, 28px mobile / 40px desktop (768–1280px), then the
 * fluid --text-h2 token (40 → 48px at 1600px) on wide screens; with optional intro.
 */
export function SectionHeading({
  title,
  intro,
  eyebrow,
  align = "center",
  as: Tag = "h2",
  tone = "ink",
  leading = "tight",
  introGap = 16,
  id,
  className,
  titleClassName,
  introClassName,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow ? (
        <Eyebrow tone={tone === "light" ? "powder" : "plum"} className="mb-3.5">
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Tag
        id={id}
        className={cn(
          "text-[28px] font-semibold tracking-display md:text-[40px] xl:text-h2",
          leadings[leading],
          tone === "light" ? "text-cream" : "text-ink",
          titleClassName,
        )}
      >
        {title}
      </Tag>
      {intro ? (
        <p
          className={cn(
            "max-w-[56ch] text-body leading-[1.75]",
            introGaps[introGap],
            centered && "mx-auto",
            tone === "light" ? "text-blush" : "text-muted",
            introClassName,
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}

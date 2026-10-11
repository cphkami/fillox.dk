import Link from "next/link";
import type { ReactNode } from "react";
import type { RichSpan, RichText } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Text building blocks of /om-os: the owner's long text in readable paragraphs, its bold
 * sentences as pull statements, its inline bold and links.
 *
 * - `tone`: "ink" on cream and sand (muted text, 7.4:1 on offwhite; bold runs in ink), "band" on
 *   a rosa band (band-body text 9.9:1, bold runs in on-band).
 */
type Tone = "ink" | "band";

const runTones = {
  ink: { strong: "text-ink", link: "text-accent decoration-rule-strong hover:decoration-accent" },
  band: { strong: "text-on-band", link: "text-on-band decoration-on-band/50 hover:decoration-on-band" },
} as const;

function Run({ span, tone }: { span: RichSpan; tone: Tone }) {
  if (typeof span === "string") return <>{span}</>;
  const t = runTones[tone];
  const text = span.strong ? <strong className={cn("font-semibold", t.strong)}>{span.text}</strong> : span.text;
  if (!span.href) return <>{text}</>;
  const linkClasses = cn("underline decoration-1 underline-offset-[3px] transition-colors", t.link);
  // Internal routes use next/link; anything else is a plain anchor.
  return span.href.startsWith("/") ? (
    <Link href={span.href} className={linkClasses}>
      {text}
    </Link>
  ) : (
    <a href={span.href} className={linkClasses}>
      {text}
    </a>
  );
}

/** Inline rich text from /content: a string, or runs with bold and links. */
export function Rich({ value, tone = "ink" }: { value: RichText; tone?: Tone }) {
  if (typeof value === "string") return <>{value}</>;
  return value.map((span, i) => <Run key={i} span={span} tone={tone} />);
}

const proseTones = { ink: "text-muted", band: "text-band-body" } as const;

/**
 * Paragraphs at the reading measure: `text-body-lg` (17 → 19px at 1600, as the text pages and
 * articles), line height 1.7 / 1.75, 16–20px between paragraphs. `max-w-[52ch]` from 768px keeps
 * lines at ≈ 74 characters of Figtree (ARCHITECTURE.md → "Type scale"); `ch` resolves against
 * this element's own font, so the measure holds at every size. Paragraphs wrap "pretty", so no
 * word is left alone on a last line.
 */
export function Prose({
  paragraphs,
  tone = "ink",
  className,
}: {
  paragraphs: readonly RichText[];
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 text-body-lg leading-[1.7] text-pretty md:max-w-[52ch] md:gap-[18px] md:leading-[1.75] xl:gap-fluid-18/20",
        proseTones[tone],
        className,
      )}
    >
      {paragraphs.map((text, i) => (
        <p key={i}>
          <Rich value={text} tone={tone} />
        </p>
      ))}
    </div>
  );
}

const statementTones = {
  /** The H1 accent colour (plum: 8.8:1 on offwhite, 7.5 on sand). */
  ink: "text-emphasis",
  band: "text-on-band",
} as const;

/**
 * A sentence the source sets in bold, as a pull statement: the heading font (Poppins 500) at
 * 22px on phones, 28px from 768px (`text-quote`, 32px at 1600), balanced lines. It is part of the
 * text (not a repeated excerpt), so it is a plain paragraph. Placement and rules come from the
 * section (`className`).
 */
export function Statement({
  children,
  tone = "ink",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-heading text-[22px] leading-[1.3] tracking-display text-balance md:text-quote md:leading-[1.25]",
        statementTones[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Section H2 on /om-os: 28px / 40px (768–1280) / `text-h2` (48px at 1600), balanced lines. */
export function AboutHeading({
  id,
  tone = "ink",
  className,
  children,
}: {
  id: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "font-heading text-[28px] leading-[1.15] tracking-display text-balance md:text-[40px] md:leading-[1.1] xl:text-h2",
        tone === "band" ? "text-on-band" : "text-heading",
        className,
      )}
    >
      {children}
    </h2>
  );
}

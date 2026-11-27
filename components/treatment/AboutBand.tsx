import type { ReactNode } from "react";
import { ArrowLink, Container, Eyebrow } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { AboutBlock } from "@/content/types";
import { cn } from "@/lib/cn";
import type { TreatmentView } from "./treatmentView";

function Paragraphs({ items, className }: { items: string[]; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={className}>
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

// Body copy 16px (`text-body`, 18 at 1600); the ch cap keeps lines readable on the wide canvas:
// 52ch ≈ 73 characters of Figtree (1ch = the "0" glyph, 0.64em; an average letter is 0.46em) at
// any font size, under the ~75-character best practice. From 768: the single-column tablet band
// would otherwise run ≈ 90 characters; from 1024 it has no effect up to the 1180 design width
// (545px column).
const text = "grid gap-3.5 text-body leading-[1.7] text-muted md:max-w-[52ch] md:leading-[1.8] md:text-band-body";

/** Heading sizes: an h3 block at the card-title size; an h4 (in a group) one step down. */
const headingClasses = {
  3: "mb-2 font-heading text-[19px] leading-[1.3] tracking-display text-balance text-heading md:mb-2.5 md:text-h4 md:text-on-band",
  4: "mb-1.5 font-heading text-[17px] leading-[1.35] tracking-display text-balance text-heading md:mb-2 md:text-lead md:text-on-band",
} as const;

/**
 * One titled block: its heading, paragraphs and optional arrow link. `id`: an anchor other pages
 * link to (Profhilo → /behandlinger/skinbooster#polynukleotider); the global scroll-padding-top
 * keeps it clear of the sticky header.
 */
function Block({ block, level, children }: { block: AboutBlock; level: 3 | 4; children?: ReactNode }) {
  const Heading = level === 3 ? "h3" : "h4";
  return (
    <div id={block.id}>
      <Heading className={headingClasses[level]}>{block.title}</Heading>
      <Paragraphs items={block.paragraphs} className={text} />
      {block.link ? (
        // Accent on the sand card and on the rose band, as the long-form band sections' links.
        <p className="mt-4 md:mt-5">
          <ArrowLink href={block.link.href}>{block.link.label}</ArrowLink>
        </p>
      ) : null}
      {children}
    </div>
  );
}

/**
 * "Om behandlingen" (6c/6bx: a rosa band with a bordered "Godt til" box, the design's dark band
 * in Anette's palette, Lys Rosa; mb: sand card with a white "Godt til" box). Titled blocks
 * (detail.aboutBlocks, e.g. lip filler's "Hvad er filler?") follow the paragraphs as h3s in the
 * same column, at the card-title size (19 / 20px → 22); a block may carry an anchor `id` and an
 * arrow link under its text (Profhilo's link to the skinbooster page's polynukleotider block). A
 * group block (`blocks`, the skinbooster page's "Vores skinboostere") is an h3 with its blocks as
 * h4s under it, one size down (17 / 18px → 20) and set off by a hairline on the left, so the
 * outline stays h2 → h3 → h4.
 */
export function AboutBand({ about }: { about: NonNullable<TreatmentView["about"]> }) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={copy.sectionIds.about} className="leading-[1.5] md:mt-surface">
      <div
        data-surface="band-md"
        className="flex flex-col gap-3.5 rounded-[24px] bg-sand px-5 py-9 md:gap-8 md:bg-band md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-fluid-56 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20"
      >
        <div className="contents md:block">
          <h2
            id={copy.sectionIds.about}
            className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mb-5 md:py-[.2em] md:text-[40px] md:leading-[1.1] md:text-on-band xl:text-h2"
          >
            {copy.about.title}
          </h2>
          {about.mobileParagraphs?.length ? (
            <>
              <Paragraphs items={about.mobileParagraphs} className={`${text} md:hidden`} />
              <Paragraphs items={about.paragraphs} className={`${text} max-md:hidden`} />
            </>
          ) : about.paragraphs.length ? (
            <Paragraphs items={about.paragraphs} className={text} />
          ) : null}
          {about.blocks?.length ? (
            // Below 768px a flex item of the card (gap 14px above); from 768 under the paragraphs, or
            // right under the heading when there are none.
            <div className={cn("grid gap-6 md:gap-7 xl:gap-fluid-28", about.paragraphs.length > 0 && "md:mt-7 xl:mt-fluid-28")}>
              {about.blocks.map((block) => (
                <Block key={block.title} block={block} level={3}>
                  {block.blocks?.length ? (
                    // A hairline on the left groups the h4 blocks under their h3 (the sizes alone, 20
                    // and 18px, are close).
                    <div
                      className={cn(
                        "grid gap-5 border-l border-rule pl-4 md:gap-6 md:border-band-line md:pl-6 xl:gap-fluid-24",
                        block.paragraphs.length > 0 || block.link ? "mt-5 md:mt-6" : "mt-3 md:mt-4",
                      )}
                    >
                      {block.blocks.map((sub) => (
                        <Block key={sub.title} block={sub} level={4} />
                      ))}
                    </div>
                  ) : null}
                </Block>
              ))}
            </div>
          ) : null}
        </div>

        {/* "Godt til" list: body size at every width (mobile 16px, the design's 15 raised to the minimum). */}
        <div className="flex flex-col gap-2 rounded-[18px] bg-white px-5 py-[18px] text-body md:block md:rounded-[20px] md:border md:border-band-line md:bg-transparent md:px-9 md:py-8 md:text-on-band lg:self-start xl:px-fluid-36 xl:py-fluid-32">
          <Eyebrow className="md:mb-[18px] md:text-band-accent">
            {about.listLabel}
          </Eyebrow>
          <ul className="flex flex-col gap-2 md:gap-3">
            {about.items.map((item) => (
              <li key={item}>
                <span aria-hidden="true" className="md:hidden">
                  ·{" "}
                </span>
                <span aria-hidden="true" className="max-md:hidden">
                  -{" "}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}

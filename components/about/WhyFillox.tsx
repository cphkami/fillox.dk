import { Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type WhyFilloxProps = { why: AboutPageCopy["why"]; titleId: string };

/**
 * "Hvorfor vælge Fillox".
 * - Desktop (6om): rose band (`bg-band`, from 768px), title left (Poppins 500, `text-on-band`),
 *   two stacked paragraphs right (Figtree, `text-band-body`; 1fr / 1.4fr).
 *   Line length: the paragraphs are capped at 48ch of their own font (`text-body`,
 *   16 → 18px), ≈ 65–70 characters per line like the design's measure. (Figtree is narrower
 *   than the design's Poppins: the old 56ch cap gave 76–82 characters and left a one-word
 *   last line.) Up to 1180px the 1.4fr column is about as wide; above it the text sits at the
 *   column's right edge (like 6om) and from 1280px the column is `auto`, i.e. the text's own
 *   width, and the title takes the rest. Tablet (one column) gets the same cap instead of the
 *   full 640px.
 *   The gap to the hero is the surface margin (24px, 32px from 1536), like the side inset.
 * - Mobile (mo): sand card with one shorter paragraph (title `text-heading`, text `text-muted`).
 *   data-surface="band-md" switches the text selection to the band highlight from 768px only
 *   (app/globals.css); the sand card keeps the light rose selection (the band highlight would be
 *   only 1.17:1 on sand).
 */
export function WhyFillox({ why, titleId }: WhyFilloxProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId} className="lg:mt-surface">
      <div
        data-surface="band-md"
        className="flex flex-col gap-3 rounded-[24px] bg-sand px-5 py-8 md:grid md:gap-6 md:bg-band md:px-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14 lg:px-14 lg:py-fluid-72 xl:grid-cols-[minmax(0,1fr)_auto] xl:px-16 2xl:px-20"
      >
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:text-[40px] md:leading-[1.1] md:text-on-band xl:text-h2"
        >
          {why.title}
        </h2>
        <p className="text-[16px] leading-[1.7] text-muted md:hidden">{why.textShort}</p>
        <div className="grid gap-3.5 text-body leading-[1.8] text-band-body max-md:hidden md:max-w-[48ch] lg:justify-self-end">
          {why.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </Container>
  );
}

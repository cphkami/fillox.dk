import { Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type WhyFilloxProps = { why: AboutPageCopy["why"]; titleId: string };

/**
 * "Hvorfor vælge Fillox".
 * - Desktop (6om): plum band, title left, two stacked paragraphs right (1fr / 1.4fr).
 *   Line length: the paragraphs are capped at 56ch of their own font (`text-body`,
 *   16 → 18px): 562px at 16px, exactly the design's 1180px measure (≈ 70 characters per
 *   line), ≈ 630px at 18px. Up to 1180px the 1.4fr column is no wider than that, so the
 *   design is unchanged; above it the text sits at the column's right edge (like 6om) and
 *   from 1280px the column is `auto`, i.e. the text's own width, and the title takes the
 *   rest. Tablet (one column) gets the same cap instead of the full 640px (≈ 82 per line).
 *   The gap to the hero is the surface margin (24px, 32px from 1536), like the side inset.
 * - Mobile (mo): sand card with one shorter paragraph.
 */
export function WhyFillox({ why, titleId }: WhyFilloxProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId} className="lg:mt-surface">
      <div className="flex flex-col gap-3 rounded-[24px] bg-sand px-5 py-8 md:grid md:gap-6 md:bg-plum md:px-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14 lg:px-14 lg:py-fluid-72 xl:grid-cols-[minmax(0,1fr)_auto] xl:px-16 2xl:px-20">
        <h2
          id={titleId}
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:text-[40px] md:leading-[1.1] md:text-cream xl:text-h2"
        >
          {why.title}
        </h2>
        <p className="text-[16px] leading-[1.7] text-muted md:hidden">{why.textShort}</p>
        <div className="grid gap-3.5 text-body leading-[1.8] text-blush max-md:hidden md:max-w-[56ch] lg:justify-self-end">
          {why.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </Container>
  );
}

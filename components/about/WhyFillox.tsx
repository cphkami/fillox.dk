import { Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type WhyFilloxProps = { why: AboutPageCopy["why"]; titleId: string };

/**
 * "Hvorfor vælge Fillox".
 * - Desktop (6om): plum band, title left, two paragraphs right (1fr / 1.4fr).
 *   Wide screens keep that ratio (text wider than title). From 1280px the paragraphs
 *   would outgrow a readable 16px measure, so from 1440px they sit side by side in two
 *   columns (330–365px, ≈ 40–50 characters per line) instead of one long 1.4fr column.
 *   1280–1439 caps the text column at 62ch (≈ its 1.4fr width at 1280).
 *   The gap to the hero is the surface margin (24px, 32px from 1536), like the side inset.
 * - Mobile (mo): sand card with one shorter paragraph.
 */
export function WhyFillox({ why, titleId }: WhyFilloxProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId} className="lg:mt-surface">
      <div className="flex flex-col gap-3 rounded-[24px] bg-sand px-5 py-8 md:grid md:gap-6 md:bg-plum md:px-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14 lg:px-14 lg:py-fluid-72 xl:px-16 xl:max-[1440px]:grid-cols-[minmax(0,1fr)_minmax(0,62ch)] 2xl:px-20">
        <h2
          id={titleId}
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:text-[40px] md:leading-[1.1] md:text-cream xl:text-h2"
        >
          {why.title}
        </h2>
        <p className="text-[16px] leading-[1.7] text-muted md:hidden">{why.textShort}</p>
        <div className="grid gap-3.5 text-[16px] leading-[1.8] text-blush max-md:hidden min-[1440px]:grid-cols-2 min-[1440px]:gap-x-10">
          {why.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </Container>
  );
}

import { Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type WhyFilloxProps = { why: AboutPageCopy["why"]; titleId: string };

/**
 * "Hvorfor vælge Fillox".
 * - Desktop (6om): plum band, title left, two paragraphs right (1fr / 1.4fr).
 * - Mobile (mo): sand card with one shorter paragraph.
 */
export function WhyFillox({ why, titleId }: WhyFilloxProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId} className="lg:mt-6">
      <div className="flex flex-col gap-3 rounded-[24px] bg-sand px-5 py-8 md:grid md:gap-6 md:bg-plum md:px-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14 lg:px-14 lg:py-[72px]">
        <h2
          id={titleId}
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:text-[40px] md:leading-[1.1] md:text-cream"
        >
          {why.title}
        </h2>
        <p className="text-[16px] leading-[1.7] text-muted md:hidden">{why.textShort}</p>
        <div className="grid gap-3.5 text-[16px] leading-[1.8] text-blush max-md:hidden">
          {why.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </Container>
  );
}

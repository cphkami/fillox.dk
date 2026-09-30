import { Eyebrow } from "@/components/ui";

type PricesHeroProps = {
  eyebrow: string;
  /** H1 text before the line break (desktop). */
  title: string;
  /** Last word of the H1: its own line in plum from 768px; inline and ink on mobile. */
  titleAccent: string;
  /** Desktop intro (≥768px). */
  intro: string;
  /** Mobile intro (<768px). */
  introShort: string;
  titleId: string;
};

/**
 * Priser hero. Desktop (6b): sand panel, eyebrow + two-line H1 left, intro right,
 * bottom-aligned. The two columns start at the 1180px design canvas, where the 64px
 * H1 fits its column; below that (tablet, small desktop) they stack at 56px.
 * Mobile (mp): centred text, no panel.
 */
export function PricesHero({ eyebrow, title, titleAccent, intro, introShort, titleId }: PricesHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="mx-auto w-full max-w-[1180px] px-5 pt-6 text-center md:px-6 md:pt-0 md:text-left"
    >
      <div className="flex flex-col gap-3 md:gap-6 md:rounded-[24px] md:bg-sand md:px-10 md:pt-16 md:pb-12 lg:px-14 lg:pt-[84px] lg:pb-16 min-[73.75rem]:grid min-[73.75rem]:grid-cols-2 min-[73.75rem]:items-end min-[73.75rem]:gap-12">
        <div className="max-md:contents">
          <Eyebrow className="md:mb-[18px] md:text-taupe">{eyebrow}</Eyebrow>
          <h1
            id={titleId}
            className="text-[36px] leading-[1.08] font-semibold tracking-display md:text-[56px] md:leading-[1.05] min-[73.75rem]:text-[64px]"
          >
            {title} <br className="max-md:hidden" />
            <span className="md:text-plum">{titleAccent}</span>
          </h1>
        </div>
        <p className="text-[16px] leading-[1.7] text-muted md:max-w-[48ch] md:text-[18px] md:leading-[1.8]">
          <span className="md:hidden">{introShort}</span>
          <span className="max-md:hidden">{intro}</span>
        </p>
      </div>
    </section>
  );
}

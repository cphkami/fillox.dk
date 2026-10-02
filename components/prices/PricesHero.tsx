import { Eyebrow, ResponsiveText } from "@/components/ui";

type PricesHeroProps = {
  eyebrow: string;
  /** H1 text before the line break (desktop). */
  title: string;
  /** Last word of the H1: its own line in the emphasis colour from 768px; inline, heading colour on mobile. */
  titleAccent: string;
  /** Desktop intro (≥768px). */
  intro: string;
  /** Mobile intro (<768px). */
  introShort: string;
  titleId: string;
};

/**
 * Priser hero. Desktop (6b): sand panel, eyebrow + two-line H1 left, intro right,
 * bottom-aligned. The two columns start at 1180px (the design canvas), where the 64px
 * H1 fits its column; below that (tablet, small desktop) they stack at 56px.
 * Mobile (mp): centred text, no panel.
 * Type: the H1 is the heading face (Poppins 500, espresso `text-heading`, H1 tracking from 768px),
 * its accent word `text-emphasis`; eyebrow and intro are Figtree.
 *
 * Wide screens (≥1280px): the panel spans the fluid canvas on the surface margin, its
 * padding follows the footer's top block, and H1, intro and paddings use the fluid
 * tokens (app/globals.css → "Wide layout").
 */
export function PricesHero({ eyebrow, title, titleAccent, intro, introShort, titleId }: PricesHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="mx-auto w-full max-w-canvas px-gutter pt-6 text-center md:px-surface md:pt-0 md:text-left"
    >
      <div className="flex flex-col gap-3 md:gap-6 md:rounded-[24px] md:bg-sand md:px-10 md:pt-16 md:pb-12 lg:px-14 lg:pt-fluid-84 lg:pb-fluid-64 xl:px-16 2xl:px-20 min-[73.75rem]:grid min-[73.75rem]:grid-cols-2 min-[73.75rem]:items-end min-[73.75rem]:gap-fluid-48">
        <div className="max-md:contents">
          <Eyebrow className="md:mb-[18px] md:text-taupe">{eyebrow}</Eyebrow>
          <h1
            id={titleId}
            className="font-heading text-[36px] leading-[1.08] tracking-display text-heading md:text-[56px] md:leading-[1.05] md:tracking-hero min-[73.75rem]:text-h1"
          >
            {title} <br className="max-md:hidden" />
            <span className="md:text-emphasis">{titleAccent}</span>
          </h1>
        </div>
        <p className="text-[16px] leading-[1.7] text-muted md:max-w-[48ch] md:text-lead md:leading-[1.8]">
          <ResponsiveText mobile={introShort} desktop={intro} />
        </p>
      </div>
    </section>
  );
}

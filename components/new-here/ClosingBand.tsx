import { ArrowLink, ButtonLink, Container, Photo } from "@/components/ui";
import type { NewHerePage } from "@/content/pages/new-here";

/**
 * Closing band "Begynd med en samtale": a rose band (like the treatment pages' "Klar til at
 * booke?", so it also stays distinct from the beige footer under it) with the draft's [image]:
 * the photo as a banner on top below 1024px; from 1024px text and buttons left and the photo flush
 * right (not from 768px: the right column of a tablet is portrait and too narrow for a split).
 * Its id is where the mobile book bar slides away.
 *
 * Photo `sizes`: below 1024px the banner spans the band (100vw minus the surface margins); from
 * 1024px the portrait photo (4 : 5) covers the right column, 1 of 2.2 fr of the surface band
 * (measured: 444px at 1024, 633 at 1440, 698 from 1600), at the band's height (465–520px), so it
 * paints at the column's width.
 */
export function ClosingBand({ copy }: { copy: NewHerePage["closing"] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div
        data-surface="band"
        className="overflow-hidden rounded-[24px] bg-band lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <Photo
          image={copy.image}
          sizes="(min-width: 1600px) 700px, (min-width: 1024px) 44vw, 100vw"
          className="h-[200px] md:h-[300px] lg:order-last lg:h-auto lg:min-h-fluid-440/520"
        />
        <div className="flex flex-col px-[22px] pt-8 pb-9 md:px-10 md:pt-10 md:pb-12 lg:justify-center lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          <h2
            id={titleId}
            className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-on-band md:text-[40px] md:leading-[1.1] xl:text-h2"
          >
            {copy.title}
          </h2>
          <p className="mt-3 max-w-[46ch] text-body leading-[1.7] text-pretty text-band-body md:mt-4">{copy.text}</p>
          <div className="mt-7 flex flex-col gap-6 md:mt-9 md:flex-row md:flex-wrap md:items-center md:gap-x-8 xl:mt-fluid-36">
            <ButtonLink href={copy.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
              {copy.primaryCta.label}
            </ButtonLink>
            <ArrowLink href={copy.secondaryCta.href} tone="band" className="self-start text-pretty md:self-auto">
              {copy.secondaryCta.label}
            </ArrowLink>
          </div>
        </div>
      </div>
    </Container>
  );
}

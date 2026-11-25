import Link from "next/link";
import { Container, Photo, ResponsiveText, ScrollRow, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import type { ImageRef } from "@/content/types";

/** Card shape from 1024px (`aspect-[5/6]`) and the mobile card (230 × 280). */
const CARD_ASPECT = 5 / 6;
const MOBILE_CARD = { w: 230, h: 280 };
/** The 3% hover zoom. */
const HOVER_ZOOM = 1.03;

/**
 * `sizes` of a card photo: the card's width, or more when the photo is wider than the card
 * (cover paints it card-height × aspect wide), × the photo's own zoom (`image.zoom`) × the hover
 * zoom. Card widths: mobile 230px;
 * 1024–1179 ≤ 300px; 1180–1279 ≤ 333px; from 1280 a third of the content width minus the gaps
 * (≈ 28.4vw; 454px on the 1600 canvas).
 */
function photoSizes(image: ImageRef): string {
  const aspect = image.width && image.height ? image.width / image.height : CARD_ASPECT;
  const zoom = Math.max(1, image.zoom ?? 1);
  const k = Math.max(1, aspect / CARD_ASPECT) * zoom * HOVER_ZOOM;
  const mobile = Math.max(MOBILE_CARD.w, MOBILE_CARD.h * aspect) * zoom * HOVER_ZOOM;
  return [
    `(min-width: 1600px) ${Math.ceil(454 * k)}px`,
    `(min-width: 1280px) ${(28.4 * k).toFixed(1)}vw`,
    `(min-width: 1180px) ${Math.ceil(333 * k)}px`,
    `(min-width: 1024px) ${Math.ceil(300 * k)}px`,
    `${Math.ceil(mobile)}px`,
  ].join(", ");
}

/**
 * "Vi fremkalder, vi forandrer ikke". Desktop (6a): three centred photos with italic
 * captions on the page background. The photos are the clinic's own mood photos, each captioned
 * with and linking to a treatment (content/pages/home.ts → `results`); they are not results.
 * 1024–1279: as the design, a centred row of three photos ≤ 300px wide (3 × 300 + 2 × 32 = 964px
 * on the design's 1180 canvas); past 1180 the photos grow with the viewport instead, keeping the
 * design's 52px inset from the content edge ((100% − 2 × 52 − 64) / 3). From xl they fill the
 * content width in three columns.
 * Mobile (mf): sand panel with a horizontal scroll row.
 *
 * Below lg the sand panel sits on the surface margin; from lg the panel is transparent
 * and the content sits on the content gutter.
 *
 * Line height 1.5 on the section (the captions): the design's "normal" in Poppins; Figtree's is 1.2.
 */
export function Results({ copy }: { copy: HomePage["results"] }) {
  return (
    <Container
      as="section"
      gutter="none"
      aria-labelledby="home-results-title"
      className="px-surface leading-[1.5] lg:px-gutter"
    >
      <div className="rounded-[24px] bg-sand px-5 py-10 md:px-10 md:py-14 lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-fluid-96">
        <SectionHeading
          id="home-results-title"
          title={copy.title}
          intro={<ResponsiveText mobile={copy.introShort} desktop={copy.intro} />}
          align="left"
          leading="normal"
          className="mb-4 lg:mb-fluid-50 lg:text-center"
          // 48ch, not SectionHeading's 52ch (≤ 70 characters a line in Figtree; see Bestsellers).
          introClassName="max-md:leading-[1.7] md:max-w-[48ch] lg:mx-auto"
        />

        <ScrollRow
          aria-label={copy.listLabel}
          className="-mr-5 scroll-pr-5 pr-5 md:-mr-10 md:scroll-pr-10 md:pr-10 lg:mr-0 lg:flex-wrap lg:justify-center lg:gap-8 lg:pr-0 xl:grid xl:grid-cols-3 xl:gap-fluid-32"
        >
          {copy.items.map((item) => (
            <li
              key={item.caption}
              className="w-[230px] flex-none snap-start lg:w-[calc((100%-64px)/3)] lg:max-w-[max(300px,calc((100%-168px)/3))] xl:w-auto xl:max-w-none"
            >
              <Link href={item.href} className="group block rounded-[20px] lg:rounded-[24px]">
                <Photo
                  image={item.image}
                  sizes={photoSizes(item.image)}
                  radius="var(--photo-radius)"
                  className="h-[280px] [--photo-radius:20px] lg:aspect-[5/6] lg:h-auto lg:shadow-photo lg:[--photo-radius:24px]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="mt-2 block text-[14px] text-muted lg:mt-3.5 lg:px-1.5 lg:text-body lg:italic">
                  {item.caption}
                </span>
              </Link>
            </li>
          ))}
        </ScrollRow>
      </div>
    </Container>
  );
}

import Link from "next/link";
import { Container, Photo, ResponsiveText, ScrollRow, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";

/**
 * Rendered width of the result photos. The landscape photos are cover-cropped into
 * portrait 5:6 boxes, so they display at box height × aspect ratio (up to 1.63, plus the
 * 3% hover zoom), not at box width: mobile 230 × 280 → ~470px; 1024–1179 ≤ 300 × 360 →
 * ~600px; 1180–1279 ≤ 333 × 400 → ~670px; from xl the boxes fill a third of the content
 * width (~454 × 545 on the 1600 canvas → ~915px; 58vw between 1280 and 1600).
 */
const RESULT_PHOTO_SIZES =
  "(min-width: 1600px) 920px, (min-width: 1280px) 58vw, (min-width: 1180px) 680px, (min-width: 1024px) 600px, 470px";

/**
 * "Vi fremkalder, vi forandrer ikke". Desktop (6a): three centred photos with italic
 * captions on the page background. 1024–1279: as the design, a centred row of three
 * photos ≤ 300px wide (3 × 300 + 2 × 32 = 964px on the design's 1180 canvas); past 1180 the
 * photos grow with the viewport instead, keeping the design's 52px inset from the content
 * edge ((100% − 2 × 52 − 64) / 3). From xl they fill the content width in three columns.
 * Mobile (mf): sand panel with a horizontal scroll row.
 *
 * Below lg the sand panel sits on the surface margin; from lg the panel is transparent
 * and the content sits on the content gutter.
 */
export function Results({ copy }: { copy: HomePage["results"] }) {
  return (
    <Container
      as="section"
      gutter="none"
      aria-labelledby="home-results-title"
      className="px-surface lg:px-gutter"
    >
      <div className="rounded-[24px] bg-sand px-5 py-10 md:px-10 md:py-14 lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-fluid-96">
        <SectionHeading
          id="home-results-title"
          title={copy.title}
          intro={<ResponsiveText mobile={copy.introShort} desktop={copy.intro} />}
          align="left"
          leading="normal"
          className="mb-4 lg:mb-fluid-50 lg:text-center"
          introClassName="max-md:leading-[1.7] lg:mx-auto"
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
                  sizes={RESULT_PHOTO_SIZES}
                  radius="var(--photo-radius)"
                  className="h-[280px] [--photo-radius:20px] lg:aspect-[5/6] lg:h-auto lg:shadow-[0_10px_30px_rgba(107,56,64,.10)] lg:[--photo-radius:24px]"
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

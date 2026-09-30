import Link from "next/link";
import { Container, Photo, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import { ResponsiveText } from "./ResponsiveText";
import { ScrollRow } from "./ScrollRow";

/**
 * Rendered width of the result photos. The landscape photos are cover-cropped into
 * portrait boxes (lg 300 × 360, mobile 230 × 280), so they display at box height ×
 * aspect ratio (up to 1.63 → 586px / 456px, plus the 3% hover zoom), not at box width.
 */
const RESULT_PHOTO_SIZES = "(min-width: 1024px) 600px, 470px";

/**
 * "Vi fremkalder, vi forandrer ikke". Desktop (6a): three centred photos with italic
 * captions on the page background. Mobile (mf): sand panel with a horizontal scroll row.
 */
export function Results({ copy }: { copy: HomePage["results"] }) {
  return (
    <Container as="section" gutter="surface" aria-labelledby="home-results-title">
      <div className="rounded-[24px] bg-sand px-5 py-10 md:px-10 md:py-14 lg:bg-transparent lg:px-8 lg:pt-0 lg:pb-24">
        <SectionHeading
          id="home-results-title"
          title={copy.title}
          intro={<ResponsiveText short={copy.introShort} long={copy.intro} />}
          align="left"
          leading="normal"
          className="mb-4 lg:mb-[50px] lg:text-center"
          introClassName="max-md:leading-[1.7] lg:mx-auto"
        />

        <ScrollRow
          aria-label={copy.listLabel}
          className="-mr-5 scroll-pr-5 pr-5 md:-mr-10 md:scroll-pr-10 md:pr-10 lg:mr-0 lg:flex-wrap lg:justify-center lg:gap-8 lg:pr-0"
        >
          {copy.items.map((item) => (
            <li
              key={item.caption}
              className="w-[230px] flex-none snap-start lg:w-[calc((100%-64px)/3)] lg:max-w-[300px]"
            >
              <Link href={item.href} className="group block rounded-[20px] lg:rounded-[24px]">
                <Photo
                  image={item.image}
                  sizes={RESULT_PHOTO_SIZES}
                  radius="var(--photo-radius)"
                  className="h-[280px] [--photo-radius:20px] lg:aspect-[5/6] lg:h-auto lg:shadow-[0_10px_30px_rgba(107,56,64,.10)] lg:[--photo-radius:24px]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="mt-2 block text-[14px] text-muted lg:mt-3.5 lg:px-1.5 lg:text-[16px] lg:italic">
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

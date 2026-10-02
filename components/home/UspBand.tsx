import { Container } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import { cn } from "@/lib/cn";

/**
 * Rose USP band under the hero (design 6a's plum band, in the band colours). Desktop (6a): four
 * columns with title + text. Mobile (mf): 2 × 2 grid of centred titles; the text returns from 768px.
 *
 * The band sits one surface margin below the hero (12 · 24 · 32px). Band padding + item
 * padding put the text on the same edge as the team panel, testimonial and footer text
 * (surface margin + 56 · 64 · 80px): 28 + 28 at lg, 36 + 28 at xl, 40 + 40 at 2xl.
 * From xl the items keep only 20px on the right (the text is left-aligned, so that side is
 * ragged anyway): the text grows with the type scale (16 → 18 / 14 → 15px) and the longest
 * line, "Din egen anatomi som udgangspunkt", stays on one line (in Figtree from 1280px; the
 * design's Poppins needed ~1400px).
 *
 * Line height 1.5: the design's "normal" in Poppins. Figtree's own "normal" is 1.2, too tight for
 * the text where it wraps (two lines at 1024–1279px).
 */
export function UspBand({ usps }: { usps: HomePage["usps"] }) {
  return (
    <Container gutter="surface" className="my-3 md:mt-surface md:mb-0">
      <ul data-surface="band" className="grid grid-cols-2 rounded-[24px] bg-band leading-[1.5] lg:grid-cols-4 lg:px-7 lg:py-fluid-30 xl:px-9 2xl:px-10">
        {usps.map((usp, i) => (
          <li
            key={usp.title}
            className={cn(
              "flex flex-col justify-center border-band-line px-[18px] py-5 text-center",
              i % 2 === 0 && "border-r",
              i < 2 && "border-b",
              "lg:justify-start lg:border-b-0 lg:px-7 lg:py-0 lg:text-left xl:pr-5 2xl:pl-10",
              i < usps.length - 1 ? "lg:border-r" : "lg:border-r-0",
            )}
          >
            <p className="text-[15px] font-semibold text-on-band lg:text-body lg:font-medium">{usp.title}</p>
            <p className="mt-[3px] text-small text-band-body max-md:hidden">{usp.text}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}

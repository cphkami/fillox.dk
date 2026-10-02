import { AllReviewsLink, Container, Photo, ReviewRotator } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import { toReviewSlides } from "@/lib/reviews";

/**
 * Customer reviews, rotating (content/reviews.ts, set "home"). Desktop (6a): split panel, the
 * quote left-aligned on the rose band half (the design's plum) and a photo on the right. Mobile
 * (mf): centred white card without the photo. Under the rotator's controls: "Se alle anmeldelser på
 * Trustpilot →".
 *
 * The band half's padding is the team panel's and the footer's (56 → 64 → 80px), so the quote
 * lines up with their text edges; at 1024–1279 the extra 16px of measure keeps the longest
 * review on 6 lines with the relaxed heading tracking.
 *
 * Line height 1.5 on the section: the design's "normal" in Poppins, for the rotator's stars and
 * caption and the link under it (Figtree's own "normal" is 1.2: the caption wrapped cramped at
 * 1024px and the link's hit area fell under 44px).
 */
export function Testimonial({ testimonial }: { testimonial: HomePage["testimonial"] }) {
  return (
    <Container as="section" gutter="surface" className="leading-[1.5] lg:mt-surface">
      <div className="grid overflow-hidden rounded-[24px] bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:bg-band">
        {/* data-surface: the band's text selection from 1024px for the rotator AND the link under it
            (the accent focus ring needs no override: 5:1 on the band). */}
        <div data-surface="band-lg" className="flex flex-col justify-center px-[22px] py-8 lg:px-14 lg:py-fluid-84 xl:px-16 2xl:px-20">
          <ReviewRotator
            reviews={toReviewSlides(testimonial.reviews)}
            label={testimonial.label}
            surface="band-lg"
            size="large"
            align="center-lg-start"
          />
          {/* 20px under the controls (the link's hit area reaches 12px up), centred like the card
              on mobile; the band tone (on-band, band-accent on hover) on the band half from 1024px. */}
          <AllReviewsLink className="mt-5 self-center lg:mt-7 lg:self-start lg:text-on-band lg:hover:text-band-accent" />
        </div>

        {/* Desktop only. The landscape photo (1.63) is cover-cropped into the right half
            (~488–616 × 420 at 1024–1280, ~768 × 504 on the 1600 canvas), so it renders at box
            height × aspect ratio (~685px, ~820px on the 1600 canvas), wider than the box. */}
        <Photo
          image={testimonial.image}
          sizes="(min-width: 1600px) 830px, (min-width: 1280px) 54vw, 700px"
          className="min-h-fluid-420 max-lg:hidden"
        />
      </div>
    </Container>
  );
}

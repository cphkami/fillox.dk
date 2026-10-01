import { AllReviewsLink, Container, Photo, ReviewRotator } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import { toReviewSlides } from "@/lib/reviews";

/**
 * Customer reviews, rotating (content/reviews.ts, set "home"). Desktop (6a): plum split panel
 * with a photo on the right, the quote left-aligned on the plum half. Mobile (mf): centred
 * white card without the photo. Under the rotator's controls: "Se alle anmeldelser på
 * Trustpilot →".
 */
export function Testimonial({ testimonial }: { testimonial: HomePage["testimonial"] }) {
  return (
    <Container as="section" gutter="surface" className="lg:mt-surface">
      <div className="grid overflow-hidden rounded-[24px] bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:bg-plum">
        {/* data-surface: powder focus rings from 1024px for the rotator AND the link under it. */}
        <div data-surface="plum-lg" className="flex flex-col justify-center px-[22px] py-8 lg:px-16 lg:py-fluid-84 2xl:px-20">
          <ReviewRotator
            reviews={toReviewSlides(testimonial.reviews)}
            label={testimonial.label}
            surface="plum-lg"
            size="large"
            align="center-lg-start"
          />
          {/* 20px under the controls (the link's hit area reaches 12px up), centred like the card
              on mobile; powder on the plum half from 1024px. */}
          <AllReviewsLink className="mt-5 self-center lg:mt-7 lg:self-start lg:text-powder lg:hover:text-cream" />
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

import { Container, Photo } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";

/**
 * Customer quote. Desktop (6a): plum split panel with a photo on the right.
 * Mobile (mf): centred white card without the photo.
 */
export function Testimonial({ testimonial }: { testimonial: HomePage["testimonial"] }) {
  const stars = Array.from({ length: testimonial.rating }, () => "★");
  return (
    <Container as="section" gutter="surface" aria-label={testimonial.label} className="lg:mt-6">
      <div className="grid overflow-hidden rounded-[24px] bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:bg-plum">
        <figure className="flex flex-col justify-center gap-3 px-[22px] py-8 text-center lg:gap-0 lg:px-16 lg:py-[84px] lg:text-left">
          <p className="text-plum lg:mb-[22px] lg:text-[16px] lg:text-powder">
            <span className="sr-only">{testimonial.ratingLabel}</span>
            <span aria-hidden="true" className="tracking-[4px] lg:hidden">
              {stars.join("")}
            </span>
            <span aria-hidden="true" className="tracking-[6px] max-lg:hidden">
              {stars.join(" ")}
            </span>
          </p>
          <blockquote className="text-[18px] leading-[1.55] font-medium lg:mb-[18px] lg:text-[28px] lg:leading-[1.35] lg:font-semibold lg:tracking-display lg:text-cream">
            <p>{testimonial.quote}</p>
          </blockquote>
          <figcaption className="text-[13px] text-muted lg:text-[14px] lg:tracking-[2px] lg:text-blush lg:uppercase">
            {testimonial.author} · {testimonial.source}
          </figcaption>
        </figure>

        {/* Desktop only. The landscape photo is cover-cropped into a ~566 × 420 box, so it
            renders at box height × aspect ratio (~685px), wider than the box. */}
        <Photo
          image={testimonial.image}
          sizes="700px"
          className="min-h-[420px] max-lg:hidden"
        />
      </div>
    </Container>
  );
}

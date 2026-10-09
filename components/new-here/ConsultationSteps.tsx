import { ButtonLink, Container } from "@/components/ui";
import type { NewHerePage } from "@/content/pages/new-here";

/** "01", "02" … (decorative: the <ol> carries the order). */
const number = (i: number) => String(i + 1).padStart(2, "0");

/**
 * "Hvad sker der på en konsultation?": the four steps on a sand panel, as the For mænd page's
 * "Sådan foregår det" (components/men/MenProcess): each step hangs from a 2px bronze rule with a
 * taupe number, a heading-font title and its text; 1 column below 768px, 2 up to 1279px, 4 from
 * 1280px (the steps are about twice as long as MenProcess's: four columns at 1024 wrapped them
 * into ≈ 25-character lines). "Book konsultation" sits beside the heading from 1024px and under
 * the steps below.
 */
export function ConsultationSteps({ copy }: { copy: NewHerePage["consultation"] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div className="rounded-[24px] bg-sand px-5 py-10 md:px-10 md:py-14 lg:px-14 lg:py-fluid-80 xl:px-16 2xl:px-20">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
          <h2
            id={titleId}
            className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-heading md:text-[40px] md:leading-[1.1] xl:text-h2"
          >
            {copy.title}
          </h2>
          <ButtonLink href={copy.cta.href} size="md" className="shrink-0 max-lg:hidden">
            {copy.cta.label}
          </ButtonLink>
        </div>
        <ol className="mt-8 grid gap-8 md:mt-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 xl:mt-fluid-48 xl:grid-cols-4">
          {copy.steps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-rule pt-5 xl:pt-fluid-20">
              <span aria-hidden="true" className="text-micro font-bold tracking-[2px] text-taupe">
                {number(i)}
              </span>
              <h3 className="mt-2 font-heading text-[20px] leading-[1.25] text-balance tracking-display text-heading md:text-h4">
                {step.title}
              </h3>
              <p className="mt-2 text-body leading-[1.7] text-pretty text-muted md:max-w-[40ch] lg:max-w-none">{step.text}</p>
            </li>
          ))}
        </ol>
        <ButtonLink href={copy.cta.href} size="md" mobileSize="lg" fullWidth="mobile" className="mt-9 md:mt-12 lg:hidden">
          {copy.cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}

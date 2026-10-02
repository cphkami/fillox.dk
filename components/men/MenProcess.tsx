import { Container, Eyebrow } from "@/components/ui";
import type { MenPage } from "@/content/pages/men";

/** "01", "02" … (decorative: the <ol> carries the order). */
const number = (i: number) => String(i + 1).padStart(2, "0");

/**
 * "Sådan foregår det": four steps on a sand panel (the surface margin, rounded like every
 * panel). Each step hangs from a 2px bronze rule (decorative), with a taupe number, a heading-
 * font title and a short text. 1 column below 768px, 2 on tablets, 4 from 1024px.
 */
export function MenProcess({ copy }: { copy: MenPage["process"] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div className="rounded-[24px] bg-sand px-5 py-10 md:px-10 md:py-14 lg:px-14 lg:py-fluid-80 xl:px-16 2xl:px-20">
        <Eyebrow className="mb-3.5">{copy.eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-heading md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>
        <ol className="mt-8 grid gap-8 md:mt-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-4 lg:gap-x-fluid-32 xl:mt-fluid-48">
          {copy.steps.map((step, i) => (
            <li key={step.title} className="border-t-2 border-rule pt-5 xl:pt-fluid-20">
              <span aria-hidden="true" className="text-micro font-bold tracking-[2px] text-taupe">
                {number(i)}
              </span>
              <h3 className="mt-2 font-heading text-[20px] leading-[1.25] tracking-display text-heading md:text-h4">{step.title}</h3>
              <p className="mt-2 text-body leading-[1.7] text-muted md:max-w-[34ch] lg:max-w-none">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

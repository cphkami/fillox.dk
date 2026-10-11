import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import type { NewHerePage } from "@/content/pages/new-here";

/**
 * "Hvad er forskellen på behandlingerne?": a sand panel on the surface margin (like the For mænd
 * steps). Heading left and the intro beside it from 1024px; the six kinds of treatment hang from
 * 2px Sandbeige rules (decorative) in 1 / 2 / 3 columns, each with a link to the page that exists for
 * it. Under them, on a hairline, the draft's closing line and "Book konsultation".
 */
export function DifferencesSection({ copy }: { copy: NewHerePage["differences"] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div className="rounded-[24px] bg-sand px-5 py-10 md:px-10 md:py-14 lg:px-14 lg:py-fluid-80 xl:px-16 2xl:px-20">
        <div className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-x-10">
          <h2
            id={titleId}
            className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-heading md:text-[40px] md:leading-[1.1] xl:text-h2"
          >
            {copy.title}
          </h2>
          <p className="mt-4 max-w-[44ch] text-body leading-[1.7] text-pretty text-muted md:leading-[1.75] lg:mt-0">
            {copy.intro}
          </p>
        </div>

        <ul className="mt-8 grid gap-9 md:mt-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-3 xl:mt-fluid-48">
          {copy.items.map((item) => (
            <li key={item.title} className="flex flex-col border-t-2 border-rule pt-5 xl:pt-fluid-20">
              <h3 className="font-heading text-[20px] leading-[1.25] tracking-display text-heading md:text-h4">{item.title}</h3>
              <p className="mt-2 mb-5 text-body leading-[1.7] text-pretty text-muted">{item.text}</p>
              <ArrowLink href={item.link.href} className="mt-auto self-start">
                {item.link.label}
              </ArrowLink>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-6 border-t border-rule/60 pt-8 md:mt-12 md:flex-row md:items-center md:justify-between md:gap-10 xl:mt-fluid-56 xl:pt-fluid-32">
          <p className="max-w-[56ch] font-heading text-[18px] leading-[1.4] text-pretty tracking-display text-heading md:text-h4">
            {copy.outro}
          </p>
          <ButtonLink href={copy.cta.href} size="md" mobileSize="lg" fullWidth="mobile" className="md:shrink-0">
            {copy.cta.label}
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}

import { ArrowLink, Container, Eyebrow, ResponsiveText } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { TreatmentView } from "./treatmentView";

/** "Vælg din mængde" / "Betal pr. område" price list (6c/6bx, mb). */
export function PriceSection({ prices }: { prices: NonNullable<TreatmentView["prices"]> }) {
  return (
    <Container
      as="section"
      aria-labelledby={copy.sectionIds.prices}
      className="flex flex-col gap-4 pt-2 pb-12 leading-[1.5] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:gap-10 md:pt-0 md:pb-fluid-96 lg:gap-fluid-64"
    >
      <div className="flex flex-col gap-4 md:block">
        <Eyebrow className="md:mb-3.5">{prices.eyebrow}</Eyebrow>
        <h2
          id={copy.sectionIds.prices}
          className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mb-4 md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {prices.title}
        </h2>
        {prices.intro ? (
          <p className="text-body leading-[1.7] text-muted md:max-w-[52ch] md:leading-[1.75]">
            <ResponsiveText mobile={prices.mobileIntro} desktop={prices.intro} />
          </p>
        ) : null}
      </div>
      <div>
        <dl>
          {prices.items.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              // 16px rows and a 14px note on mobile too (the design's 15 / 13, raised to the
              // body / small-text minimums). Line height 1.5 from the section (Poppins' "normal"):
              // 55 / 57px rows, a wrapped label 24px per line, as the /priser rows.
              className="flex justify-between gap-3 border-t border-line py-[15px] text-body last:border-b md:py-4"
            >
              <dt>
                <ResponsiveText mobile={item.mobileLabel} desktop={item.label} />
                {item.note ? <span className="text-small text-muted"> · {item.note}</span> : null}
              </dt>
              <dd className="font-semibold whitespace-nowrap">{item.price}</dd>
            </div>
          ))}
        </dl>
        {prices.link ? (
          <ArrowLink href={prices.link.href} className="mt-5">
            {prices.link.label}
          </ArrowLink>
        ) : null}
      </div>
    </Container>
  );
}

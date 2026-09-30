import { ArrowLink, Container, Eyebrow } from "@/components/ui";
import type { TreatmentView } from "./treatmentView";
import { Swap } from "./Swap";

/** "Vælg din mængde" / "Betal pr. område" price list (6c/6bx, mb). */
export function PriceSection({ prices }: { prices: NonNullable<TreatmentView["prices"]> }) {
  return (
    <Container
      as="section"
      aria-labelledby="priser"
      className="flex flex-col gap-4 pt-2 pb-12 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-start md:gap-10 md:pt-0 md:pb-24 lg:gap-16"
    >
      <div className="flex flex-col gap-4 md:block">
        <Eyebrow className="md:mb-3.5">{prices.eyebrow}</Eyebrow>
        <h2
          id="priser"
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-4 md:text-[40px] md:leading-[1.1]"
        >
          {prices.title}
        </h2>
        {prices.intro ? (
          <p className="text-[16px] leading-[1.7] text-muted md:leading-[1.75]">
            <Swap mobile={prices.mobileIntro} desktop={prices.intro} />
          </p>
        ) : null}
      </div>
      <div>
        <dl>
          {prices.items.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className="flex justify-between gap-3 border-t border-line py-[15px] text-[15px] last:border-b md:py-4 md:text-[16px]"
            >
              <dt>
                <Swap mobile={item.mobileLabel} desktop={item.label} />
                {item.note ? <span className="text-[13px] text-muted md:text-[14px]"> · {item.note}</span> : null}
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

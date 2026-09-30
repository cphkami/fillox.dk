import { Container } from "@/components/ui";
import type { TeamProfile } from "@/content/types";
import { Responsive } from "./Responsive";

type ExperienceSectionProps = { experience: NonNullable<TeamProfile["experience"]>; titleId: string };

/** "Erfaring & uddannelse" — plum band with a period/text timeline (6alb / ma). */
export function ExperienceSection({ experience, titleId }: ExperienceSectionProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div
        data-surface="plum"
        className="flex flex-col gap-3.5 rounded-[24px] bg-plum px-[22px] py-8 md:gap-8 md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-14 lg:px-14 lg:py-[72px]"
      >
        <h2
          id={titleId}
          className="text-[28px] leading-[1.15] font-semibold tracking-display text-cream md:text-[40px] md:leading-[1.1]"
        >
          {experience.title}
        </h2>
        <dl className="flex flex-col gap-3.5 md:gap-0">
          {experience.items.map((item) => (
            <div
              key={`${item.period}-${item.text}`}
              className="flex gap-4 border-t border-cream/18 pt-3 text-[15px] md:grid md:grid-cols-[120px_minmax(0,1fr)] md:gap-6 md:border-cream/20 md:py-[18px] md:text-[16px] md:last:border-b"
            >
              <dt className="w-[70px] flex-none font-semibold text-powder md:w-auto md:text-cream">
                <Responsive mobile={item.periodShort} desktop={item.period} />
              </dt>
              <dd className="text-cream md:text-blush">
                <Responsive mobile={item.textShort} desktop={item.text} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  );
}

import { Container, ResponsiveText } from "@/components/ui";
import type { TeamProfile } from "@/content/types";

type ExperienceSectionProps = { experience: NonNullable<TeamProfile["experience"]>; titleId: string };

/**
 * "Erfaring & uddannelse" — a band with a period/text timeline (6alb / ma; plum in the design,
 * the dusty rose band now: on-band heading and periods, band-body text, band-line dividers).
 */
export function ExperienceSection({ experience, titleId }: ExperienceSectionProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div
        data-surface="band"
        className="flex flex-col gap-3.5 rounded-[24px] bg-band px-[22px] py-8 md:gap-8 md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-fluid-56 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20"
      >
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] tracking-display text-on-band md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {experience.title}
        </h2>
        <dl className="flex flex-col gap-3.5 md:gap-0">
          {experience.items.map((item) => (
            <div
              key={`${item.period}-${item.text}`}
              className="flex gap-4 border-t border-band-line pt-3 text-[15px] md:grid md:grid-cols-[7.5em_minmax(0,1fr)] md:gap-6 md:py-[18px] md:text-body md:last:border-b"
            >
              <dt className="w-[70px] flex-none font-semibold text-band-accent md:w-auto md:text-on-band">
                <ResponsiveText mobile={item.periodShort} desktop={item.period} />
              </dt>
              <dd className="text-on-band md:text-band-body">
                <ResponsiveText mobile={item.textShort} desktop={item.text} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  );
}

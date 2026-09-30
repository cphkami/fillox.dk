import { Container, Eyebrow } from "@/components/ui";
import type { TeamProfile } from "@/content/types";
import { Responsive } from "./Responsive";

type ApproachSectionProps = { approach: NonNullable<TeamProfile["approach"]>; titleId: string };

/** "Sådan arbejder jeg" — sand band with three white cards (6alb / ma). */
export function ApproachSection({ approach, titleId }: ApproachSectionProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div className="rounded-[24px] bg-sand px-5 py-8 md:px-10 md:py-16 lg:px-14 lg:py-20">
        <div className="mb-3 md:mb-12 md:text-center lg:mb-[52px]">
          <Eyebrow className="mb-3 md:mb-3.5">{approach.eyebrow}</Eyebrow>
          <h2
            id={titleId}
            className="text-[28px] leading-[1.15] font-semibold tracking-display md:text-[40px] md:leading-[1.1]"
          >
            {approach.title}
          </h2>
        </div>

        <ul className="flex flex-col gap-3 md:gap-4 lg:grid lg:grid-cols-3 lg:gap-6">
          {approach.items.map((item) => (
            <li key={item.title} className="rounded-[18px] bg-white px-5 py-[18px] md:rounded-[24px] md:p-[34px]">
              <h3 className="mb-1 text-[17px] font-semibold text-plum md:mb-2.5 md:text-[22px] md:tracking-display">
                {item.title}
              </h3>
              <p className="text-[15px] leading-[1.6] text-muted md:text-[16px] md:leading-[1.75]">
                <Responsive mobile={item.textShort} desktop={item.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

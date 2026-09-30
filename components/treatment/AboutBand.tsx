import { Container, Eyebrow } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { TreatmentView } from "./treatmentView";

function Paragraphs({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  );
}

/**
 * "Om behandlingen" (6c/6bx: plum band with a bordered "Godt til" box; mb: sand card with
 * a white "Godt til" box).
 */
export function AboutBand({ about }: { about: TreatmentView["about"] }) {
  const text = "grid gap-3.5 text-[16px] leading-[1.7] text-muted md:leading-[1.8] md:text-blush";
  return (
    <Container as="section" gutter="surface" aria-labelledby="om-behandlingen" className="md:mt-6">
      <div
        data-surface="plum"
        className="flex flex-col gap-3.5 rounded-[24px] bg-sand px-5 py-9 md:gap-8 md:bg-plum md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-14 lg:px-14 lg:py-[72px]"
      >
        <div className="contents md:block">
          <h2
            id="om-behandlingen"
            className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-5 md:text-[40px] md:leading-normal md:text-cream"
          >
            {copy.about.title}
          </h2>
          {about.mobileParagraphs?.length ? (
            <>
              <Paragraphs items={about.mobileParagraphs} className={`${text} md:hidden`} />
              <Paragraphs items={about.paragraphs} className={`${text} max-md:hidden`} />
            </>
          ) : (
            <Paragraphs items={about.paragraphs} className={text} />
          )}
        </div>

        <div className="flex flex-col gap-2 rounded-[18px] bg-white px-5 py-[18px] text-[15px] md:block md:rounded-[20px] md:border md:border-[#f3ede4]/30 md:bg-transparent md:px-9 md:py-8 md:text-[16px] md:text-cream lg:self-start">
          <Eyebrow className="md:mb-[18px] md:text-powder">
            {about.listLabel}
          </Eyebrow>
          <ul className="flex flex-col gap-2 md:gap-3">
            {about.items.map((item) => (
              <li key={item}>
                <span aria-hidden="true" className="md:hidden">
                  ·{" "}
                </span>
                <span aria-hidden="true" className="max-md:hidden">
                  -{" "}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}

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
 * "Om behandlingen" (6c/6bx: a rose band with a bordered "Godt til" box, the design's dark band
 * in the "Støvet rosa & beige" palette; mb: sand card with a white "Godt til" box).
 */
export function AboutBand({ about }: { about: TreatmentView["about"] }) {
  // Body copy 16px (`text-body`, 18 at 1600); the ch cap keeps lines readable on the wide canvas:
  // 52ch ≈ 73 characters of Figtree (1ch = the "0" glyph, 0.64em; an average letter is 0.46em) at
  // any font size, under the ~75-character best practice. From 768: the single-column tablet band
  // would otherwise run ≈ 90 characters; from 1024 it has no effect up to the 1180 design width
  // (545px column).
  const text = "grid gap-3.5 text-body leading-[1.7] text-muted md:max-w-[52ch] md:leading-[1.8] md:text-band-body";
  return (
    <Container as="section" gutter="surface" aria-labelledby={copy.sectionIds.about} className="leading-[1.5] md:mt-surface">
      <div
        data-surface="band-md"
        className="flex flex-col gap-3.5 rounded-[24px] bg-sand px-5 py-9 md:gap-8 md:bg-band md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-fluid-56 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20"
      >
        <div className="contents md:block">
          <h2
            id={copy.sectionIds.about}
            className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mb-5 md:py-[.2em] md:text-[40px] md:leading-[1.1] md:text-on-band xl:text-h2"
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

        {/* "Godt til" list: body size at every width (mobile 16px, the design's 15 raised to the minimum). */}
        <div className="flex flex-col gap-2 rounded-[18px] bg-white px-5 py-[18px] text-body md:block md:rounded-[20px] md:border md:border-band-line md:bg-transparent md:px-9 md:py-8 md:text-on-band lg:self-start xl:px-fluid-36 xl:py-fluid-32">
          <Eyebrow className="md:mb-[18px] md:text-band-accent">
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

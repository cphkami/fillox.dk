import { Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import { AboutHeading, Prose, Statement } from "./Prose";

type MethodsBandProps = { copy: AboutPageCopy["methods"] };

/**
 * "Den rigtige behandling kræver mere end ét værktøj": the page's rose band (`bg-band`), at every
 * width. Heading left and paragraphs right from 1024px (1 : 1.15, as the cream sections); the bold
 * sentence closes the band as a pull statement under a full-width hairline (`band-line`).
 * Colours: heading and statement `on-band` (10.6:1), text `band-body` (9.9:1).
 * `data-surface="band"` switches the text selection to the band highlight (app/globals.css).
 */
export function MethodsBand({ copy }: MethodsBandProps) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div
        data-surface="band"
        className="rounded-[24px] bg-band px-5 py-10 md:px-10 md:py-14 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20"
      >
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-fluid-64">
          <AboutHeading id={titleId} tone="band" className="lg:max-w-[14em]">
            {copy.title}
          </AboutHeading>
          <Prose paragraphs={copy.paragraphs} tone="band" className="mt-5 md:mt-8 lg:mt-0 lg:pt-2" />
        </div>
        <div className="mt-9 border-t border-band-line pt-8 md:mt-12 md:pt-10 lg:mt-fluid-56 lg:pt-fluid-48">
          <Statement tone="band" className="max-w-[30em]">
            {copy.statement}
          </Statement>
        </div>
      </div>
    </Container>
  );
}

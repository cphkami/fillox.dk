import { Container } from "@/components/ui";
import type { RichText } from "@/content/types";
import { cn } from "@/lib/cn";
import { AboutHeading, Prose, Statement } from "./Prose";

type SplitSectionProps = {
  id: string;
  title: string;
  /** The section's bold sentence, when it opens the section: set under the heading. */
  statement?: string;
  paragraphs: readonly RichText[];
  className?: string;
};

/**
 * A text section on cream ("Vi uddanner vores egne specialister", "Høj kvalitet behøver ikke …").
 * - From 1024px two columns (1 : 1.15): the heading, and under it the bold sentence as a pull
 *   statement with an accent rule, left; the paragraphs right, at the reading measure (52ch,
 *   ≈ 74 characters), from the heading's first line.
 *   The left column is sticky (144px from the top, under the 94–98px header), so the heading and
 *   statement stay beside the paragraphs they introduce.
 * - Below 1024px one column: heading, statement, paragraphs.
 * Spacing: 56px above and below on phones, 80px on tablets, 96 → 115px from 1024px.
 */
export function SplitSection({ id, title, statement, paragraphs, className }: SplitSectionProps) {
  const titleId = `${id}-title`;
  return (
    <Container
      as="section"
      id={id}
      aria-labelledby={titleId}
      className={cn(
        "py-14 leading-[1.5] md:py-20 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-fluid-64 lg:py-fluid-96",
        className,
      )}
    >
      {/* From 1024px the heading column stays in view while the longer text column scrolls by. */}
      <div className="lg:sticky lg:top-36">
        <AboutHeading id={titleId} className="lg:max-w-[14em]">
          {title}
        </AboutHeading>
        {statement ? (
          <Statement className="mt-6 max-w-[24em] border-l-2 border-accent pl-5 md:mt-8 md:pl-6 lg:mt-fluid-40 lg:max-w-[18em]">
            {statement}
          </Statement>
        ) : null}
      </div>
      <Prose paragraphs={paragraphs} className="mt-6 md:mt-8 lg:mt-0 lg:pt-2" />
    </Container>
  );
}

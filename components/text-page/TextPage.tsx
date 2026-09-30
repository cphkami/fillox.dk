import { Container } from "@/components/ui";
import type { TextPageContent } from "@/content/types";
import { TextBlocks } from "./TextBlocks";
import { TextPageAside } from "./TextPageAside";
import { TextPageHero } from "./TextPageHero";

type TextPageProps = {
  content: TextPageContent;
  /** Prefix for element ids (aria-labelledby), e.g. "handelsbetingelser". */
  id: string;
};

/**
 * Simple text page (terms, privacy, jobs, content creator): sand hero, a readable
 * text column (max ~684px at 17px) and a sticky CTA card on the right from 1024px.
 * Below 1024px the CTA card follows the text. The text lines up with the hero text
 * at every width (20 / 64 / 80px from the page edge).
 */
export function TextPage({ content, id }: TextPageProps) {
  const titleId = `${id}-title`;
  return (
    <article aria-labelledby={titleId}>
      <TextPageHero hero={content.hero} titleId={titleId} />
      <Container gutter="surface">
        <div className="px-2 pt-6 pb-10 md:px-10 md:pt-14 md:pb-14 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-14 lg:px-14 lg:pt-[72px] lg:pb-14">
          <TextBlocks blocks={content.body} className="md:max-w-[720px]" />
          {content.aside ? (
            <TextPageAside
              aside={content.aside}
              titleId={`${id}-aside-title`}
              className="mt-10 md:mt-14 md:max-w-[720px] lg:sticky lg:top-[112px] lg:mt-0"
            />
          ) : null}
        </div>
      </Container>
    </article>
  );
}

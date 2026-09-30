import { Container } from "@/components/ui";
import type { TextPageContent } from "@/content/types";
import { cn } from "@/lib/cn";
import { TextBlocks } from "./TextBlocks";
import { TextPageAside } from "./TextPageAside";
import { TextPageHero } from "./TextPageHero";

type TextPageProps = {
  content: TextPageContent;
  /** Prefix for element ids (aria-labelledby): the route key, e.g. "terms" (language-neutral). */
  id: string;
};

/**
 * Simple text page (terms, privacy, jobs, content creator): sand hero, a readable
 * text column (max 720px at 17px) and a sticky CTA card on the right from 1024px.
 * Below 1024px the CTA card follows the text. The text lines up with the hero text
 * at every width (surface margin + the hero's side padding: 20 / 64 / 80px from the
 * page edge up to 1280px, 88px at 1280, 112px from 1536px).
 * Wide (≥1280px): the text keeps its reading measure (684px ≈ 76 characters per line, as at
 * 1180–1279px) and the CTA card grows 280 → 336px; top/bottom padding grows with the viewport.
 * - Photo hero (text left-aligned): the text stays on the hero text's left edge and the card
 *   stays flush with the band's right edge.
 * - Hero without a photo (centred title, the legal pages): text + card are centred as one
 *   group under the title, so the page does not read as a narrow column pushed to the left.
 */
export function TextPage({ content, id }: TextPageProps) {
  const titleId = `${id}-title`;
  const centred = !content.hero.image;
  return (
    <article aria-labelledby={titleId}>
      <TextPageHero hero={content.hero} titleId={titleId} />
      <Container gutter="surface">
        <div
          className={cn(
            "px-2 pt-6 pb-10 md:px-10 md:pt-14 md:pb-14 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-14 lg:px-14 lg:pt-fluid-72 lg:pb-fluid-56 xl:px-16 2xl:px-20",
            !centred && "xl:grid-cols-[minmax(0,1fr)_clamp(280px,56px_+_17.5vw,336px)] xl:gap-fluid-56/96",
            centred &&
              (content.aside
                ? "xl:grid-cols-[minmax(0,684px)_clamp(280px,56px_+_17.5vw,336px)] xl:justify-center xl:gap-fluid-96/128"
                : "xl:grid-cols-[minmax(0,684px)] xl:justify-center"),
          )}
        >
          <TextBlocks blocks={content.body} className="md:max-w-[720px] xl:max-w-[684px]" />
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

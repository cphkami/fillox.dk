import { Container, Eyebrow, Photo } from "@/components/ui";
import type { TextPageContent } from "@/content/types";
import { cn } from "@/lib/cn";

type TextPageHeroProps = { hero: TextPageContent["hero"]; titleId: string };

/**
 * Text page hero, in the language of the 6om / 6kl heroes:
 * - With an image, desktop (≥1024px): sand panel (radius 24, 24px page margin) split 50/50,
 *   text left with 72/56px padding, the photo fills the right half (6om). Tablet
 *   (768–1023px): sand panel with the text; the photo sits below it.
 * - Without an image, from 768px: the text is centred in the sand panel with 80px vertical
 *   padding and the intro at 52ch, like the 6kl "Find klinik" hero.
 * - Mobile: text left on cream (mk / mar), photo below (260px, radius 22).
 */
export function TextPageHero({ hero, titleId }: TextPageHeroProps) {
  const { image } = hero;
  return (
    <Container as="header" gutter="surface">
      <div className={cn("lg:overflow-hidden lg:rounded-[24px] lg:bg-sand", image && "lg:grid lg:grid-cols-2")}>
        <div
          className={cn(
            "px-2 pt-4 pb-2 md:rounded-[24px] md:bg-sand md:px-10 lg:rounded-none lg:bg-transparent lg:px-14",
            image ? "md:py-14 lg:flex lg:flex-col lg:justify-center lg:py-[72px]" : "md:py-20 md:text-center",
          )}
        >
          {hero.eyebrow ? <Eyebrow className="mb-4 md:mb-[18px]">{hero.eyebrow}</Eyebrow> : null}
          <h1
            id={titleId}
            className="text-[min(36px,9.25vw)] leading-[1.08] font-semibold tracking-display text-balance break-words md:text-[52px] md:leading-[1.04] lg:text-[64px] lg:leading-[1.02]"
          >
            {hero.title}
          </h1>
          {hero.intro ? (
            <p
              className={cn(
                "mt-4 text-[16px] leading-[1.7] text-pretty text-muted md:mt-5 md:max-w-[52ch] md:text-[18px] md:leading-[1.75]",
                image ? "lg:mt-[22px]" : "md:mx-auto",
              )}
            >
              {hero.intro}
            </p>
          ) : null}
        </div>
        {image ? (
          <Photo
            image={image}
            sizes="(min-width: 1180px) 566px, (min-width: 1024px) 50vw, 100vw"
            priority
            radius="var(--text-hero-radius)"
            className="mt-4 h-[260px] [--text-hero-radius:22px] md:mt-3 md:h-[380px] md:[--text-hero-radius:24px] lg:mt-0 lg:h-auto lg:min-h-[480px] lg:[--text-hero-radius:0px]"
          />
        ) : null}
      </div>
    </Container>
  );
}

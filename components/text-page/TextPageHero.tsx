import { Container, Eyebrow, Photo } from "@/components/ui";
import type { TextPageContent } from "@/content/types";
import { cn } from "@/lib/cn";

type TextPageHeroProps = { hero: TextPageContent["hero"]; titleId: string };

/**
 * Text page hero, in the language of the 6om / 6kl heroes:
 * - With an image, desktop (≥1024px): sand panel (radius 24, surface margin) split 50/50,
 *   text left with 72/56px padding, the photo fills the right half (6om). Tablet
 *   (768–1023px): sand panel with the text; the photo sits below it.
 * - Without an image, from 768px: the text is centred in the sand panel with 80px vertical
 *   padding and the intro at 52ch, like the 6kl "Find klinik" hero.
 * - Mobile: text left on cream (mk / mar), photo below (260px, radius 22).
 * - Wide (≥1280px, see ARCHITECTURE.md → "Wide layout"): the panel spans the surface band;
 *   side padding (64 · 80px), vertical padding, photo height (480 → 576px) and display type
 *   grow with the viewport. TextPage's body uses the same side padding, so the texts align.
 */
export function TextPageHero({ hero, titleId }: TextPageHeroProps) {
  const { image } = hero;
  return (
    <Container as="header" gutter="surface">
      <div className={cn("lg:overflow-hidden lg:rounded-[24px] lg:bg-sand", image && "lg:grid lg:grid-cols-2")}>
        <div
          className={cn(
            "px-2 pt-4 pb-2 md:rounded-[24px] md:bg-sand md:px-10 lg:rounded-none lg:bg-transparent lg:px-14 xl:px-16 2xl:px-20",
            image ? "md:py-14 lg:flex lg:flex-col lg:justify-center lg:py-fluid-72" : "md:py-20 md:text-center lg:py-fluid-80",
          )}
        >
          {hero.eyebrow ? <Eyebrow className="mb-4 md:mb-[18px]">{hero.eyebrow}</Eyebrow> : null}
          <h1
            id={titleId}
            className="font-heading text-[min(36px,9.25vw)] leading-[1.08] tracking-display text-balance break-words text-heading md:text-[52px] md:leading-[1.04] md:tracking-hero lg:text-h1 lg:leading-[1.02]"
          >
            {hero.title}
          </h1>
          {hero.intro ? (
            <p
              className={cn(
                "mt-4 text-[16px] leading-[1.7] text-pretty text-muted md:mt-5 md:max-w-[52ch] md:text-lead md:leading-[1.75]",
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
            // Desktop: the landscape photo covers a half band that is only a little wider than
            // tall, so it renders by height: min 480px (576px on the 1600 canvas) × up to ~1.63
            // (duo-pink) → ≈ 780px at 1024–1280, ≈ 940px on the 1600 canvas.
            sizes="(min-width: 1024px) 940px, 100vw"
            priority
            radius="var(--text-hero-radius)"
            className="mt-4 h-[260px] [--text-hero-radius:22px] md:mt-3 md:h-[380px] md:[--text-hero-radius:24px] lg:mt-0 lg:h-auto lg:min-h-fluid-480 lg:[--text-hero-radius:0px]"
          />
        ) : null}
      </div>
    </Container>
  );
}

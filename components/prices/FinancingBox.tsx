import { ButtonLink, Eyebrow, Photo, containerClasses } from "@/components/ui";
import type { ImageRef, Link } from "@/content/types";
import { cn } from "@/lib/cn";

type FinancingBoxProps = {
  id: string;
  eyebrow: string;
  title: string;
  /** Desktop text (≥768px). */
  text: string;
  /** Mobile text (<768px). */
  textShort: string;
  cta: Link;
  image: ImageRef;
};

/**
 * "Finansiering" box. Desktop (6b): plum panel, text left + clinic photo right.
 * Tablet (768–1023px): the photo sits under the text in a landscape crop, because a
 * half-width column would be portrait and cut the wide wall logo.
 * Mobile (mp): sand card with heading, short text and a full-width plum button.
 *
 * Wide screens (≥1280px): the panel spans the fluid canvas on the surface margin; the
 * text column's padding follows the footer's plum block, the H2 uses the fluid token and
 * the photo grows in height with its column to keep its crop: 376px at 1280 (the
 * design's 1180 panel height, where the H2 wraps) → 460px at 1600.
 *
 * Asset note: the source photo is only 800×533. From ~1600px on a 2× screen the
 * 768px slot upscales it (softer letters on the wall logo); a ≥1600px-wide 3:2
 * original would fix that without any code change.
 */
export function FinancingBox({ id, eyebrow, title, text, textShort, cta, image }: FinancingBoxProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className={cn(containerClasses("surface"), "pt-6 md:pt-0")}>
      <div className="overflow-hidden rounded-[24px] bg-sand md:bg-plum lg:grid lg:grid-cols-2">
        <div className="flex flex-col gap-3 px-[22px] py-7 md:justify-center md:gap-0 md:p-10 lg:px-14 lg:py-fluid-56 xl:px-16 2xl:px-20">
          <Eyebrow tone="powder" className="mb-3.5 max-md:hidden">
            {eyebrow}
          </Eyebrow>
          <h2
            id={titleId}
            className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-3.5 md:text-[40px] md:leading-[1.1] md:text-cream xl:text-h2"
          >
            {title}
          </h2>
          <p className="text-[16px] leading-[1.7] text-muted md:mb-7 md:max-w-[40ch] md:text-blush">
            <span className="md:hidden">{textShort}</span>
            <span className="max-md:hidden">{text}</span>
          </p>
          <ButtonLink href={cta.href} size="lg" fullWidth className="md:hidden">
            {cta.label}
          </ButtonLink>
          <div data-surface="plum" className="self-start max-md:hidden">
            <ButtonLink href={cta.href} variant="lightInk" size="mdTight">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
        <Photo
          image={image}
          sizes="(min-width: 1600px) 768px, (min-width: 1024px) 50vw, (min-width: 768px) 100vw, 1px"
          className="max-md:hidden md:max-lg:aspect-[2/1] lg:min-h-[340px] xl:min-h-fluid-376/460"
        />
      </div>
    </section>
  );
}

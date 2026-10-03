import Image, { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/cn";

/** A crop without its own photo: object-position + zoom applied to the other crop's photo. */
type Crop = Pick<ImageRef, "position" | "zoom">;

type CropPhotoProps = {
  /** Crop below 768px. */
  mobile: ImageRef;
  /** Crop from 768px (may be a different photo, e.g. Dr. Tom's wide 6om portrait). */
  desktop: ImageRef;
  /**
   * Optional crop for 640–767px, where a mobile slot can turn landscape and the portrait
   * crop would cut the head. Applies to the mobile photo.
   */
  sm?: Crop;
  /** next/image `sizes` covering every breakpoint (also used for the desktop <source>). */
  sizes: string;
  /** Above the fold: loading="eager" + fetchPriority="high" on the one image that loads. */
  priority?: boolean;
  /** Sizes the container: a height or an aspect ratio, plus radius etc. */
  className?: string;
  /**
   * Extra classes on the <img>, e.g. a hover zoom. The crop's zoom uses the `scale` property, so
   * a hover zoom must use `transform` (`group-hover:[transform:scale(1.03)]`), which multiplies.
   */
  imgClassName?: string;
};

const cropVars = (crop: Crop, suffix: string) => ({
  [`--crop-pos${suffix}`]: crop.position ?? "50% 50%",
  [`--crop-zoom${suffix}`]: String(crop.zoom ?? 1),
});

/**
 * One photo slot with a different crop below / from 768px, rendered as ONE image so a
 * viewport only downloads (and preloads) what it shows:
 *
 * - Same photo for both crops: a single next/image; the crop (object-position + zoom)
 *   switches with CSS variables.
 * - Different photos: a <picture> with a (min-width: 768px) <source> (art direction via
 *   getImageProps); the crop still switches with the same CSS variables.
 */
export function CropPhoto({ mobile, desktop, sm, sizes, priority, className, imgClassName: extraImgClassName }: CropPhotoProps) {
  const style = {
    ...cropVars(mobile, ""),
    ...(sm ? cropVars(sm, "-sm") : {}),
    ...cropVars(desktop, "-md"),
  } as CSSProperties;

  const imgClassName = cn(
    "object-cover [object-position:var(--crop-pos)] [transform-origin:var(--crop-pos)] [scale:var(--crop-zoom)]",
    sm && "sm:[object-position:var(--crop-pos-sm)] sm:[transform-origin:var(--crop-pos-sm)] sm:[scale:var(--crop-zoom-sm)]",
    "md:[object-position:var(--crop-pos-md)] md:[transform-origin:var(--crop-pos-md)] md:[scale:var(--crop-zoom-md)]",
    extraImgClassName,
  );
  const loading = priority ? "eager" : undefined;
  const fetchPriority = priority ? "high" : undefined;

  if (mobile.src === desktop.src) {
    return (
      <div className={cn("relative overflow-hidden bg-sand", className)} style={style}>
        <Image
          src={desktop.src}
          alt={desktop.alt}
          fill
          sizes={sizes}
          loading={loading}
          fetchPriority={fetchPriority}
          className={imgClassName}
        />
      </div>
    );
  }

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ src: desktop.src, alt: desktop.alt, fill: true, sizes });
  const { props: img } = getImageProps({
    src: mobile.src,
    alt: mobile.alt,
    fill: true,
    sizes,
    loading,
    fetchPriority,
  });

  return (
    <div className={cn("relative overflow-hidden bg-sand", className)} style={style}>
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={sizes} />
        {/* srcSet, sizes, src, decoding and loading come from next/image's getImageProps. */}
        <img {...img} alt={mobile.alt} className={imgClassName} />
      </picture>
    </div>
  );
}

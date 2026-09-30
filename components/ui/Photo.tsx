import Image from "next/image";
import type { CSSProperties } from "react";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/cn";

type PhotoSource =
  /** An ImageRef from /content (src, alt, optional position + zoom). */
  | { image: ImageRef; src?: never; alt?: never }
  | { image?: never; src: string; alt: string };

type PhotoProps = PhotoSource & {
  /** next/image `sizes`, e.g. "(min-width: 1024px) 560px, 100vw". Required for fill images. */
  sizes: string;
  /** CSS object-position (reproduces the design crop), e.g. "50% 30%". Overrides image.position. */
  position?: string;
  /**
   * Zoom (>= 1) from the design's image-slot crop. Overrides image.zoom. Applied as
   * `transform: scale(zoom)` with `transform-origin` = the object-position, so the crop
   * matches the design. Pass 1 to ignore the image's zoom.
   */
  zoom?: number;
  /** Corner radius in px (number) or any CSS length. Defaults to 0. */
  radius?: number | string;
  /** Sizes the container: give it a height or aspect ratio, e.g. "h-[170px]" or "aspect-[4/5]". */
  className?: string;
  /** Extra classes on the <img>, e.g. hover zoom. */
  imgClassName?: string;
  /** Above-the-fold hero images: loading="eager" + fetchPriority="high" (Next 16 deprecates `priority`). */
  priority?: boolean;
};

/** Rounded, cropped photo: next/image in fill mode inside a positioned container. */
export function Photo({
  image,
  src,
  alt,
  sizes,
  position,
  zoom,
  radius = 0,
  className,
  imgClassName,
  priority,
}: PhotoProps) {
  const style: CSSProperties = { borderRadius: typeof radius === "number" ? `${radius}px` : radius };
  const pos = position ?? image?.position ?? "50% 50%";
  const scale = zoom ?? image?.zoom;
  const imgStyle: CSSProperties = {
    objectPosition: pos,
    ...(scale && scale !== 1 ? { transform: `scale(${scale})`, transformOrigin: pos } : {}),
  };
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)} style={style}>
      <Image
        src={image ? image.src : src!}
        alt={image ? image.alt : alt!}
        fill
        sizes={sizes}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className={cn("object-cover", imgClassName)}
        style={imgStyle}
      />
    </div>
  );
}

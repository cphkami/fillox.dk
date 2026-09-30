import Image from "next/image";
import type { ClinicMapPin } from "@/content/pages/clinics";
import type { Clinic, ImageRef } from "@/content/types";
import { cn } from "@/lib/cn";

type ClinicMapProps = {
  /** Accessible name of the map group. */
  label: string;
  /** Map artwork, drawn at the design's 350 × 220 ratio. */
  image: ImageRef;
  pins: ClinicMapPin[];
  clinics: Clinic[];
  className?: string;
};

/**
 * Stylised clinic map (design mk, "Kort øverst"): static artwork with one pin per
 * clinic. Each pin jumps to that clinic's card (#slug). Pins are placed in % of the
 * artwork.
 *
 * The frame keeps the artwork's 350 × 220 ratio up to 260px high (mk: 350 × 220 at
 * 390px), so the map never fills a large phone or small tablet screen. Once capped,
 * the artwork and its pins sit together in a full-width 350:220 layer cropped by the
 * frame (like object-fit: cover; object-position: 50% 45%, a touch above centre as the
 * pins sit in the upper-middle band), so the pins stay on their spot. Uncapped, the
 * layer and the frame are the same box.
 */
export function ClinicMap({ label, image, pins, clinics, className }: ClinicMapProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("relative aspect-[350/220] max-h-[260px] w-full overflow-hidden rounded-[22px] bg-sand", className)}
    >
      <div className="absolute inset-x-0 top-[45%] aspect-[350/220] -translate-y-[45%]">
        {/* The map is the mobile LCP of /klinikker, so it is fetched at high priority. */}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
        <ul>
          {pins.map((pin) => {
            const clinic = clinics.find((c) => c.slug === pin.slug);
            if (!clinic) return null;
            const soon = clinic.status === "coming-soon";
            return (
              <li key={pin.slug}>
                <a
                  href={`#${pin.slug}`}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  className={cn(
                    "group absolute flex -translate-y-1/2 items-center gap-1.5 rounded-full",
                    // 44px-high invisible tap area (mobile spec: secondary tap targets min. 44px).
                    "before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-['']",
                    pin.labelSide === "right" ? "-translate-x-[7px]" : "-translate-x-[calc(100%-7px)] flex-row-reverse",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 shrink-0 rounded-full shadow-[0_0_0_3px_rgba(255,255,255,.9)]",
                      soon ? "border-[3px] border-plum bg-cream" : "bg-plum",
                    )}
                  />
                  <span className="rounded-full bg-white px-2.5 py-1 text-micro leading-[1.35] font-semibold whitespace-nowrap text-plum shadow-[0_2px_8px_rgba(36,39,36,.1)] transition-colors group-hover:bg-plum group-hover:text-cream">
                    {clinic.name}
                    {soon && clinic.openingNote ? <span className="sr-only">{`, ${clinic.openingNote}`}</span> : null}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

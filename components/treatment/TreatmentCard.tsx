import Link from "next/link";
import type { Treatment } from "@/content/types";
import { treatmentHref } from "@/content/treatments";
import { ui } from "@/content/ui";
import { formatPriceFrom } from "@/lib/content";

/**
 * Treatment card on /behandlinger: price eyebrow, name, one-liner and "Læs mere →"
 * (mobile: a plum arrow on the right instead).
 */
export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const name = treatment.detail?.title ?? treatment.name;
  return (
    <article className="relative flex h-full flex-col rounded-[18px] bg-white py-4 pr-12 pl-[18px] transition-shadow hover:shadow-menu md:rounded-[24px] md:px-7 md:pt-[26px] md:pb-[30px]">
      {treatment.priceFrom !== undefined ? (
        <p className="mb-1 text-[11px] font-bold tracking-[1.5px] text-plum uppercase md:mb-2.5 md:text-[12px] md:tracking-[2px]">
          {formatPriceFrom(treatment.priceFrom)}
        </p>
      ) : null}
      <h3 className="text-[17px] leading-[1.35] font-semibold md:text-[20px] md:leading-[1.3] md:tracking-display">
        <Link href={treatmentHref(treatment.slug)} className="after:absolute after:inset-0 after:content-['']">
          {name}
        </Link>
      </h3>
      <p className="mt-1 text-[14px] leading-[1.6] text-muted md:mt-2 md:mb-[18px] md:text-[16px] md:leading-[1.7]">
        {treatment.short}
      </p>
      <span aria-hidden="true" className="mt-auto self-start border-b border-ink pb-[3px] text-[14px] max-md:hidden">
        {ui.readMore} →
      </span>
      <span aria-hidden="true" className="absolute top-1/2 right-[18px] -translate-y-1/2 text-[18px] text-plum md:hidden">
        →
      </span>
    </article>
  );
}

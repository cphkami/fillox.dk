import Link from "next/link";
import type { MenPage } from "@/content/pages/men";
import { cn } from "@/lib/cn";
import { espresso, kremButton } from "./surface";

/**
 * "For mænd" on the /behandlinger overview: a compact espresso card (a preview of the men's
 * page) in place of the old category section. It keeps the category's id, so old
 * /behandlinger#for-maend links land on it; the menus link to the page itself.
 */
export function MenTeaser({ copy, id }: { copy: MenPage["teaser"]; id: string }) {
  const titleId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={cn(
        espresso,
        "flex flex-col gap-6 rounded-[24px] px-5 py-8 md:flex-row md:items-end md:justify-between md:gap-10 md:px-10 md:py-12 lg:px-14 lg:py-fluid-56 xl:px-16",
      )}
    >
      <div>
        <p className="mb-3 text-micro font-bold tracking-[2px] text-rule uppercase">{copy.eyebrow}</p>
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-cream md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>
        <p className="mt-3 max-w-[52ch] text-body leading-[1.7] text-cream/80 md:leading-[1.75]">{copy.text}</p>
      </div>
      <Link href={copy.cta.href} className={cn(kremButton({ size: "md", mobileSize: "lg", fullWidth: "mobile" }), "md:shrink-0")}>
        {copy.cta.label}&nbsp;<span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

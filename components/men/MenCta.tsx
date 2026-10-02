import Link from "next/link";
import { Container } from "@/components/ui";
import { site } from "@/config/site";
import type { MenPage } from "@/content/pages/men";
import { cn } from "@/lib/cn";
import { espresso, kremButton } from "./surface";

/**
 * Closing booking band: espresso like the hero (the page's bookends), so it also stays distinct
 * from the beige footer right under it. Title + text left, the krem button and the phone number
 * right from 768px; stacked and centred below.
 */
export function MenCta({ copy }: { copy: MenPage["cta"] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div
        className={cn(
          espresso,
          "flex flex-col items-center gap-7 rounded-[24px] px-5 py-12 text-center md:flex-row md:items-end md:justify-between md:gap-10 md:px-10 md:py-14 md:text-left lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20",
        )}
      >
        <div>
          <h2
            id={titleId}
            className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-cream md:text-[36px] md:leading-[1.1] lg:text-h2-sm"
          >
            {copy.title}
          </h2>
          <p className="mt-3 max-w-[44ch] text-body leading-[1.7] text-cream/80 max-md:mx-auto">{copy.text}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-5 md:w-auto md:shrink-0 md:items-end">
          <Link href={copy.primaryCta.href} className={kremButton({ size: "md", mobileSize: "lg", fullWidth: "mobile" })}>
            {copy.primaryCta.label}
          </Link>
          <p className="text-small text-cream/75">
            {copy.phonePrefix}{" "}
            <a
              href={site.contact.phoneHref}
              className="relative inline-block border-b border-rule font-semibold whitespace-nowrap text-cream transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:border-cream"
            >
              {site.contact.phone}
            </a>
          </p>
        </div>
      </div>
    </Container>
  );
}

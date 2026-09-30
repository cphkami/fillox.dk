import Link from "next/link";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import type { Bestseller } from "@/content/types";
import { cn } from "@/lib/cn";
import { formatPriceFrom } from "@/lib/content";
import { ArrowCircle } from "./ArrowCircle";
import { ResponsiveText } from "./ResponsiveText";

/**
 * "Vores bestsellers". Desktop (6a): numbered rows on a plum panel, the highlighted
 * row on powder. Mobile (mf): white cards with a round arrow.
 */
export function Bestsellers({ copy, items }: { copy: HomePage["bestsellers"]; items: Bestseller[] }) {
  return (
    <Container as="section" aria-labelledby="home-bestsellers-title" className="py-14 md:pt-20 lg:pt-24 lg:pb-[84px]">
      <SectionHeading
        id="home-bestsellers-title"
        title={copy.title}
        intro={<ResponsiveText short={copy.introShort} long={copy.intro} />}
        introClassName="max-md:mt-3 max-md:leading-[1.7]"
        className="mb-4 md:mb-10 lg:mb-[50px]"
      />

      <ul className="flex flex-col gap-2.5 lg:gap-0 lg:rounded-[24px] lg:bg-plum lg:px-14 lg:py-5">
        {items.map((item, i) => {
          const hl = Boolean(item.highlighted);
          const last = i === items.length - 1;
          return (
            <li key={item.number}>
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3.5 rounded-[20px] bg-white py-[18px] pr-[18px] pl-5",
                  "lg:grid lg:grid-cols-[56px_1.1fr_1.4fr_auto_48px] lg:gap-6 lg:py-7",
                  "lg:focus-visible:outline-powder",
                  hl
                    ? "lg:-mx-7 lg:my-1.5 lg:bg-powder lg:px-7"
                    : cn(
                        "lg:rounded-none lg:bg-transparent lg:px-0",
                        !last && "lg:border-b lg:border-[rgba(243,237,228,.16)]",
                      ),
                )}
              >
                <span
                  className={cn(
                    "w-[22px] shrink-0 text-[13px] font-semibold text-plum",
                    "lg:w-auto lg:text-[14px] lg:font-normal lg:tracking-[2px]",
                    hl ? "lg:text-ink" : "lg:text-powder",
                  )}
                >
                  {item.number}
                </span>
                <div className="min-w-0 flex-1 lg:contents">
                  <h3
                    className={cn(
                      "text-[18px] font-semibold lg:text-[22px] lg:tracking-display",
                      hl ? "text-ink" : "text-ink lg:text-cream",
                    )}
                  >
                    {item.name}
                  </h3>
                  <p
                    className={cn(
                      "text-[13px] leading-[1.5] text-muted lg:text-[16px] lg:leading-[normal]",
                      !hl && "lg:text-blush",
                    )}
                  >
                    <ResponsiveText short={item.mobileDescription} long={item.description} />
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-[14px] font-semibold text-plum",
                      "lg:mt-0 lg:font-normal lg:tracking-[1px] lg:uppercase",
                      hl ? "lg:text-ink" : "lg:text-powder",
                    )}
                  >
                    {formatPriceFrom(item.priceFrom)}
                  </p>
                </div>
                <ArrowCircle
                  className={cn(
                    "bg-sand text-plum group-hover:bg-powder",
                    hl
                      ? "lg:bg-plum lg:text-cream lg:group-hover:bg-plum-deep"
                      : "lg:size-[46px] lg:border lg:border-[rgba(243,237,228,.45)] lg:bg-transparent lg:text-cream lg:group-hover:bg-cream/10",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex justify-center lg:mt-8">
        <ButtonLink
          href={copy.cta.href}
          variant="outline"
          size="lg"
          fullWidth="mobile"
          className="md:px-9 lg:h-auto lg:border-ink lg:py-3.5 lg:text-[14px] lg:text-ink lg:hover:bg-ink lg:hover:text-cream"
        >
          <span>
            {copy.cta.label}
            <span aria-hidden="true" className="max-lg:hidden">
              {" →"}
            </span>
          </span>
        </ButtonLink>
      </div>
    </Container>
  );
}

import type { Metadata } from "next";
import { BookingBand } from "@/components/treatment/BookingBand";
import { TreatmentCard } from "@/components/treatment/TreatmentCard";
import { ArrowLink, ButtonLink, Container, Photo, ScrollRow } from "@/components/ui";
import { site } from "@/config/site";
import { treatmentCategories } from "@/content/navigation";
import { treatmentPage, treatmentsOverview as copy } from "@/content/pages/treatments";
import { priceCards } from "@/content/prices";
import { routes } from "@/content/routes";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { treatmentsInCategory } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

const PATH = routes.treatments;

export const metadata: Metadata = pageMetadata(copy.meta, PATH);

/**
 * /behandlinger — every treatment, grouped by category (no dedicated design; built from
 * the 6c hero panel, the blog-card style and the closing rose band). Each category
 * section has id="<categorySlug>" for the menu links (/behandlinger#fillers …).
 * Cards: 1 column (mobile), 2 (tablet; an odd last card spans both), 3 from lg. A category
 * with 1, 2 or 4 treatments would leave a 3-column row half empty, so from lg its heading
 * moves into the first column(s) of the same grid and the cards fill the rest.
 * `leading-[1.5]` on the containers: Poppins' "normal" (Figtree's is 1.2), as on the treatment pages.
 */
export default function TreatmentsOverviewPage() {
  const categories = treatmentCategories
    .map((category) => ({ category, items: treatmentsInCategory(category.slug) }))
    .filter(({ items }) => items.length > 0);

  return (
    <>
      <Container gutter="none" className="leading-[1.5] md:px-surface">
        <div className="flex flex-col gap-4 px-5 pt-5 pb-4 md:grid md:grid-cols-1 md:gap-0 md:overflow-hidden md:rounded-[24px] md:bg-sand md:p-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:justify-center md:gap-0 md:px-10 md:py-14 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
            <h1 className="font-heading text-[36px] leading-[1.08] tracking-display text-heading md:mb-[22px] md:text-h1 md:leading-[1.02] md:tracking-hero">
              {copy.title}
            </h1>
            <p className="text-[16px] leading-[1.7] text-muted md:mb-[30px] md:max-w-[48ch] md:text-lead md:leading-[1.75]">
              {copy.intro}
            </p>
            <nav aria-label={copy.jumpLabel}>
              {/* Below 768px a scroll row bleeding to the right edge; the 6px padding (cancelled by
                  the negative margin) keeps the chips' focus rings unclipped. */}
              <ScrollRow
                unstyled
                className="-my-1.5 -mr-5 -ml-1.5 flex snap-x scroll-pr-5 scroll-pl-1.5 gap-2 overflow-x-auto py-1.5 pr-5 pl-1.5 [scrollbar-width:none] md:m-0 md:flex-wrap md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
              >
                {categories.map(({ category }) => (
                  <li key={category.slug} className="shrink-0 snap-start">
                    <ButtonLink href={`#${category.slug}`} variant="white" size="chip">
                      {category.name}
                    </ButtonLink>
                  </li>
                ))}
              </ScrollRow>
            </nav>
          </div>
          {/* Height grows with the column (440 → 600px from 1280 to 1600) so the portrait keeps
              the design's ≈ 1.1 : 1 crop (face, chin and neck) on wide screens. */}
          <Photo
            image={copy.heroImage}
            sizes="(min-width: 1600px) 668px, (min-width: 1024px) 44vw, 1px"
            priority
            className="min-h-fluid-440/600 max-lg:hidden"
          />
        </div>
      </Container>

      <Container className="pt-8 pb-9 leading-[1.5] md:pt-fluid-84 md:pb-fluid-60">
        <div className="flex flex-col gap-14 md:gap-fluid-96">
          {categories.map(({ category, items }) => {
            const card = priceCards.find((c) => c.categorySlug === category.slug);
            const categoryIntro = copy.categoryIntros[category.slug];
            // Never repeat a card's one-liner right above it.
            const intro = items.some((t) => t.short === categoryIntro) ? undefined : categoryIntro;
            const count = items.length;
            const side = count === 1 || count === 2 || count === 4;
            return (
              <section
                key={category.slug}
                id={category.slug}
                aria-labelledby={`${category.slug}-title`}
                className={cn(side && "lg:grid lg:grid-cols-3 lg:items-start lg:gap-fluid-24")}
              >
                <div
                  className={cn(
                    "mb-4 flex flex-col gap-2 md:mb-9 md:flex-row md:items-end md:justify-between md:gap-6",
                    side ? "lg:mb-0 lg:flex-col lg:items-start lg:justify-start lg:gap-5 xl:gap-fluid-20" : "xl:mb-fluid-36",
                    count === 1 && "lg:col-span-2",
                  )}
                >
                  <div>
                    <h2
                      id={`${category.slug}-title`}
                      className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mb-3 md:text-[40px] md:leading-[1.1] xl:text-h2"
                    >
                      {category.name}
                    </h2>
                    {intro ? (
                      <p className="max-w-[52ch] text-body leading-[1.7] text-muted md:leading-[1.75]">{intro}</p>
                    ) : null}
                  </div>
                  {card ? (
                    <ArrowLink href={`${treatmentPage.prices.allPricesLink.href}#${card.id}`} className="shrink-0">
                      {copy.seePrices}
                    </ArrowLink>
                  ) : null}
                </div>
                <ul
                  className={cn(
                    "grid gap-3 md:grid-cols-2 md:gap-fluid-24",
                    !side && "lg:grid-cols-3",
                    side && count === 1 && "lg:grid-cols-1",
                    side && count > 1 && "lg:col-span-2 lg:grid-cols-2",
                  )}
                >
                  {items.map((t, i) => (
                    <li key={t.slug} className={cn(count % 2 === 1 && i === count - 1 && "md:max-lg:col-span-2")}>
                      <TreatmentCard treatment={t} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Container>

      <BookingBand id="book" title={copy.cta.title} text={copy.cta.text} cta={{ label: ui.bookCta, href: site.booking.href }} />
    </>
  );
}

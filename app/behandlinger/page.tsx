import type { Metadata } from "next";
import { BookingBand } from "@/components/treatment/BookingBand";
import { treatmentsMetadata } from "@/components/treatment/metadata";
import { TreatmentCard } from "@/components/treatment/TreatmentCard";
import { ArrowLink, ButtonLink, Container, Photo } from "@/components/ui";
import { site } from "@/config/site";
import { mainNav, treatmentCategories } from "@/content/navigation";
import { treatmentPage, treatmentsOverview as copy } from "@/content/pages/treatments";
import { priceCards } from "@/content/prices";
import { ui } from "@/content/ui";
import { treatmentsInCategory } from "@/lib/content";

const PATH = mainNav.find((n) => n.kind === "treatments")?.href ?? "/behandlinger";

export const metadata: Metadata = treatmentsMetadata({
  title: copy.meta.title,
  description: copy.meta.description,
  path: PATH,
});

/**
 * /behandlinger — every treatment, grouped by category (no dedicated design; built from
 * the 6c hero panel, the blog-card style and the closing plum band). Each category
 * section has id="<categorySlug>" for the menu links (/behandlinger#fillers …).
 */
export default function TreatmentsOverviewPage() {
  const categories = treatmentCategories
    .map((category) => ({ category, items: treatmentsInCategory(category.slug) }))
    .filter(({ items }) => items.length > 0);

  return (
    <>
      <Container gutter="none" className="md:px-surface">
        <div className="flex flex-col gap-4 px-5 pt-5 pb-4 md:grid md:grid-cols-1 md:gap-0 md:overflow-hidden md:rounded-[24px] md:bg-sand md:p-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 md:justify-center md:gap-0 md:px-10 md:py-14 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
            <h1 className="text-[36px] leading-[1.08] font-semibold tracking-display md:mb-[22px] md:text-h1 md:leading-[1.02]">
              {copy.title}
            </h1>
            <p className="text-[16px] leading-[1.7] text-muted md:mb-[30px] md:max-w-[48ch] md:text-lead md:leading-[1.75]">
              {copy.intro}
            </p>
            <nav aria-label={copy.jumpLabel}>
              <ul className="-mr-5 flex snap-x gap-2 overflow-x-auto pr-5 [scrollbar-width:none] md:mr-0 md:flex-wrap md:overflow-visible md:pr-0 [&::-webkit-scrollbar]:hidden">
                {categories.map(({ category }) => (
                  <li key={category.slug} className="shrink-0 snap-start">
                    <ButtonLink href={`#${category.slug}`} variant="white" size="chip">
                      {category.name}
                    </ButtonLink>
                  </li>
                ))}
              </ul>
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

      <Container className="pt-8 pb-9 md:pt-fluid-84 md:pb-fluid-60">
        <div className="flex flex-col gap-14 md:gap-fluid-96">
          {categories.map(({ category, items }) => {
            const card = priceCards.find((c) => c.categorySlug === category.slug);
            const categoryIntro = copy.categoryIntros[category.slug];
            // Never repeat a card's one-liner right above it.
            const intro = items.some((t) => t.short === categoryIntro) ? undefined : categoryIntro;
            return (
              <section key={category.slug} id={category.slug} aria-labelledby={`${category.slug}-title`}>
                <div className="mb-4 flex flex-col gap-2 md:mb-9 md:flex-row md:items-end md:justify-between md:gap-6">
                  <div>
                    <h2
                      id={`${category.slug}-title`}
                      className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-3 md:text-[40px] md:leading-[1.1] xl:text-h2"
                    >
                      {category.name}
                    </h2>
                    {intro ? (
                      <p className="max-w-[56ch] text-[16px] leading-[1.7] text-muted md:leading-[1.75]">{intro}</p>
                    ) : null}
                  </div>
                  {card ? (
                    <ArrowLink href={`${treatmentPage.prices.allPricesLink.href}#${card.id}`} className="shrink-0">
                      {copy.seePrices}
                    </ArrowLink>
                  ) : null}
                </div>
                <ul className="grid gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {items.map((t) => (
                    <li key={t.slug}>
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

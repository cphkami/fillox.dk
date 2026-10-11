import Link from "next/link";
import { ArrowLink, ButtonLink, Container, SectionHeading } from "@/components/ui";
import type { NewHerePage } from "@/content/pages/new-here";
import type { NeedView } from "./view";

/**
 * "Hvad ønsker du hjælp til?": the six needs as white cards on the page base (1 column below
 * 768px, 2 up to 1279px, 3 from 1280px), then the seventh, "Jeg ved ikke helt …", as a rose band
 * card across the grid.
 *
 * A card: the need (H3) and its text, then "Mulige behandlinger" (2–3 rows, each one link to the
 * treatment page with its "fra" price), the booking button and the need's "Læs mere" link. Rows
 * and buttons are ≥ 48px high; below 768px the button spans the card.
 */
export function NeedsSection({ copy, needs }: { copy: NewHerePage["needs"]; needs: NeedView[] }) {
  const titleId = `${copy.id}-title`;
  const unsureTitleId = `${copy.unsure.id}-title`;
  return (
    <Container as="section" id={copy.id} aria-labelledby={titleId} className="py-14 leading-[1.5] md:py-fluid-96">
      <SectionHeading
        id={titleId}
        title={copy.title}
        intro={copy.intro}
        align="left"
        className="mb-8 md:mb-10 xl:mb-fluid-48"
        titleClassName="text-balance"
      />

      {/* Each card spans three rows of the list's grid as a subgrid (text · treatments · buttons), so
          in a row of cards the treatment lists start on one line and the buttons line up. The
          space between card rows is the cards' bottom margin (a row gap would also open between
          the three rows inside each card). */}
      <ul className="grid md:grid-cols-2 md:gap-x-6 xl:grid-cols-3">
        {needs.map((need) => {
          const needTitleId = `${need.id}-title`;
          const listLabelId = `${need.id}-treatments`;
          return (
            <li
              key={need.id}
              id={need.id}
              className="row-span-3 mb-3 grid grid-rows-subgrid rounded-[18px] bg-white shadow-card px-5 pt-6 pb-6 md:mb-6 md:rounded-[24px] md:px-7 md:pt-8 md:pb-8 xl:px-fluid-32 xl:pt-fluid-32 xl:pb-fluid-32"
            >
              <div>
                <h3
                  id={needTitleId}
                  className="font-heading text-[21px] leading-[1.25] text-balance tracking-display text-heading md:text-h3"
                >
                  {need.title}
                </h3>
                <div className="mt-3 flex flex-col gap-3 text-body leading-[1.65] text-pretty text-muted">
                  {need.text.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="pt-6 md:pt-7">
                <p id={listLabelId} className="mb-2 text-micro font-bold tracking-[2px] text-accent uppercase">
                  {copy.treatmentsLabel}
                </p>
                <ul aria-labelledby={listLabelId} className="border-t border-line">
                  {need.treatments.map((row) => (
                    <li key={row.slug} className="border-b border-line">
                      <Link href={row.href} className="group flex min-h-12 items-center justify-between gap-3 py-2.5">
                        <span className="text-body leading-[1.35] font-semibold text-ink transition-colors group-hover:text-accent">
                          {row.name}
                        </span>{" "}
                        <span className="flex shrink-0 items-center gap-2.5 text-ui-sm whitespace-nowrap text-taupe">
                          {row.price}
                          <span
                            aria-hidden="true"
                            className="text-accent transition-transform duration-200 group-hover:translate-x-0.5"
                          >
                            →
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-5 pt-6 md:items-start">
                <ButtonLink href={need.bookCta.href} size="mdTight" mobileSize="lg" fullWidth="mobile">
                  {need.bookCta.label}
                </ButtonLink>
                <ArrowLink href={need.more.href} className="self-start text-pretty">
                  {need.more.label}
                </ArrowLink>
              </div>
            </li>
          );
        })}
      </ul>

      <div
        id={copy.unsure.id}
        data-surface="band"
        className="rounded-[18px] bg-band px-5 py-8 md:rounded-[24px] md:px-10 md:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-fluid-64 lg:px-14 lg:py-fluid-56 xl:px-16 2xl:px-20"
      >
        <div>
          <h3
            id={unsureTitleId}
            className="font-heading text-[24px] leading-[1.2] text-balance tracking-display text-on-band md:text-h3-lg"
          >
            {copy.unsure.title}
          </h3>
          <div className="mt-3 flex max-w-[60ch] flex-col gap-3 text-body leading-[1.65] text-pretty text-band-body md:mt-4">
            {copy.unsure.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <ButtonLink
          href={copy.unsure.cta.href}
          size="md"
          mobileSize="lg"
          fullWidth="mobile"
          className="mt-6 lg:mt-0"
        >
          {copy.unsure.cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}

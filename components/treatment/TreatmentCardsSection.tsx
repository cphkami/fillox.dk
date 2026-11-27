import { ArrowLink, Container } from "@/components/ui";
import type { Link, Treatment } from "@/content/types";
import { cn } from "@/lib/cn";
import { TreatmentCard } from "./TreatmentCard";

export type TreatmentCardItem = {
  treatment: Treatment;
  /** The page's own card title and text (else the treatment's name and one-liner). */
  title?: string;
  text?: string;
};

/**
 * A titled grid of treatment cards on a category page (/behandlinger/fillers → "Behandlingsområder"):
 * the /behandlinger card (TreatmentCard: "fra" price, name, text, "Læs mere →"; the whole card is the
 * link, ≥ 44px) with the page's own card copy. Set on the page like a long-form "plain" section,
 * divided from the section above by a hairline; the heading left and the prices link right from
 * 768px, as the overview's category headings. Grid: one column below 768px, two from 768 (an odd
 * last card spans both), three from 1024; `fr` columns, so the cards fill the canvas.
 */
export function TreatmentCardsSection({
  id,
  title,
  link,
  cards,
}: {
  id: string;
  title: string;
  /** "Se alle priser →" beside the heading. */
  link?: Link;
  cards: TreatmentCardItem[];
}) {
  const count = cards.length;
  return (
    <Container as="section" id={id} aria-labelledby={`${id}-title`} className="leading-[1.5]">
      <div className="border-t border-line py-12 md:py-fluid-72">
        <div className="mb-6 flex flex-col gap-2 md:mb-fluid-36 md:flex-row md:items-end md:justify-between md:gap-6">
          <h2
            id={`${id}-title`}
            className="font-heading text-[28px] leading-[1.15] tracking-display text-balance text-heading md:text-[40px] md:leading-[1.1] xl:text-h2"
          >
            {title}
          </h2>
          {link ? (
            <ArrowLink href={link.href} className="shrink-0 self-start md:self-auto">
              {link.label}
            </ArrowLink>
          ) : null}
        </div>
        <ul className="grid gap-3 md:grid-cols-2 md:gap-fluid-24 lg:grid-cols-3">
          {cards.map((card, i) => (
            <li key={card.treatment.slug} className={cn(count % 2 === 1 && i === count - 1 && "md:max-lg:col-span-2")}>
              <TreatmentCard treatment={card.treatment} title={card.title} text={card.text} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

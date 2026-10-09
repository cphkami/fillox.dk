import Link from "next/link";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import type { RichSpan, RichText, TreatmentSection, TreatmentSectionItem } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Body of a long-form treatment page (Treatment.detail.sections, e.g. /behandlinger/rynkebehandling):
 * the sections in their order, each an h2 with its text, optional h3 cards and a link.
 *
 * - "plain" (default): on the page, on the content gutter. From 1024px the heading sits left and
 *   the text right (the 1 : 1.4 split of the practitioner and FAQ sections); the cards span both
 *   columns, text after them goes back to the text column. Two plain sections in a row are
 *   divided by a hairline.
 * - "band": a rose band on the surface margin, as "Om behandlingen" (a sand card below 768px, as
 *   the mobile design's "Om behandlingen").
 * - "card": a sand card on the surface margin; consecutive cards sit side by side from 1024px
 *   (short sections such as "Priser" and "Find din klinik").
 *
 * Cards (h3 items) are white on the page, like the /behandlinger cards; an item with an `id` is a
 * jump target (hero chips, the price list), outlined while it is the URL's :target. Text sizes
 * follow the treatment page: H2 28 / 40px (→ 48 at 1600), body 16px (→ 18), card titles 19 / 20px
 * (→ 22). Line length ≤ 52ch (≈ 73 Figtree characters). Copy comes from content/treatments.ts.
 */
export function LongformSections({ sections }: { sections: TreatmentSection[] }) {
  const groups = groupSections(sections);
  return (
    <>
      {groups.map((group, i) => {
        const previous = groups[i - 1];
        if (group.kind === "cards") return <CardGroup key={group.sections[0]?.id} sections={group.sections} />;
        const { section } = group;
        if (section.surface === "band") return <BandSection key={section.id} section={section} />;
        return (
          <PlainSection
            key={section.id}
            section={section}
            first={i === 0}
            afterPlain={previous?.kind === "single" && (previous.section.surface ?? "plain") === "plain"}
          />
        );
      })}
    </>
  );
}

/** True when the last section is set on the page (the FAQ after it then needs no surface margin). */
export function endsOnPlainSection(sections: TreatmentSection[] | undefined): boolean {
  const last = sections?.at(-1);
  return Boolean(last) && (last?.surface ?? "plain") === "plain";
}

type Group = { kind: "single"; section: TreatmentSection } | { kind: "cards"; sections: TreatmentSection[] };

/** Consecutive "card" sections form one group (side by side); every other section is its own. */
function groupSections(sections: TreatmentSection[]): Group[] {
  const groups: Group[] = [];
  for (const section of sections) {
    const last = groups.at(-1);
    if (section.surface === "card" && last?.kind === "cards") last.sections.push(section);
    else if (section.surface === "card") groups.push({ kind: "cards", sections: [section] });
    else groups.push({ kind: "single", section });
  }
  return groups;
}

const titleId = (id: string) => `${id}-title`;

/** Section H2 (as "Om behandlingen" / FAQ): 28px mobile, 40px from 768, the H2 token from 1280. */
const h2Classes =
  "font-heading text-[28px] leading-[1.15] tracking-display text-balance md:text-[40px] md:leading-[1.1] xl:text-h2";

/** Running text: body size, 1.7 / 1.75, ≤ 52ch. */
const textClasses = "grid gap-4 text-body leading-[1.7] text-pretty md:leading-[1.75] [&>p]:max-w-[52ch]";

const linkClasses =
  "font-medium text-accent underline decoration-rule-strong underline-offset-[3px] transition-colors hover:decoration-accent";

/** Inline rich text: plain runs, bold runs (`strongClassName`) and links. */
function Rich({ value, strongClassName }: { value: RichText; strongClassName: string }) {
  if (typeof value === "string") return <>{value}</>;
  return value.map((span: RichSpan, i) => {
    if (typeof span === "string") return <span key={i}>{span}</span>;
    const text = span.strong ? <strong className={strongClassName}>{span.text}</strong> : span.text;
    if (!span.href) return <span key={i}>{text}</span>;
    return span.href.startsWith("/") ? (
      <Link key={i} href={span.href} className={linkClasses}>
        {text}
      </Link>
    ) : (
      <a key={i} href={span.href} className={linkClasses}>
        {text}
      </a>
    );
  });
}

function Paragraphs({ items, className, strongClassName }: { items: RichText[]; className?: string; strongClassName: string }) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <p key={i}>
          <Rich value={item} strongClassName={strongClassName} />
        </p>
      ))}
    </div>
  );
}

/** The section's link: a primary pill ("Book en konsultation") or an arrow link ("Se priser →"). */
function SectionCta({ cta, className }: { cta: NonNullable<TreatmentSection["cta"]>; className?: string }) {
  if (cta.style === "button") {
    return (
      <div className={className}>
        <ButtonLink href={cta.href} size="md" mobileSize="lg" fullWidth="mobile" className="max-md:whitespace-normal">
          {cta.label}
        </ButtonLink>
      </div>
    );
  }
  return (
    <p className={className}>
      <ArrowLink href={cta.href}>{cta.label}</ArrowLink>
    </p>
  );
}

/**
 * Card grid of a section's items. Two columns from 768px (an odd last card spans both); from
 * 1024px three per row (6 tracks, so a short last row is shared evenly: 5 = 3 + 2), four items
 * stay 2 × 2 up to 1280 and sit in one row from there; one or two items keep one / two columns.
 */
const gridClasses: Record<number, string> = {
  1: "grid gap-3 md:gap-fluid-24",
  2: "grid gap-3 md:grid-cols-2 md:gap-fluid-24",
  4: "grid gap-3 md:grid-cols-2 md:gap-fluid-24 xl:grid-cols-4",
};
const sixTracks = "grid gap-3 md:grid-cols-2 md:gap-fluid-24 lg:grid-cols-6";

function itemSpan(i: number, count: number): string | undefined {
  if (count <= 2 || count === 4) return undefined;
  const lastOdd = count % 2 === 1 && i === count - 1 ? "md:max-lg:col-span-2" : undefined;
  const rest = count % 3;
  const inLastRow = rest > 0 && i >= count - rest;
  const lg = !inLastRow ? "lg:col-span-2" : rest === 2 ? "lg:col-span-3" : "lg:col-span-6";
  return cn(lastOdd, lg);
}

function ItemCards({ items, className }: { items: TreatmentSectionItem[]; className?: string }) {
  const count = items.length;
  return (
    <div className={cn(gridClasses[count] ?? sixTracks, className)}>
      {items.map((item, i) => (
        <article
          key={item.id ?? item.title}
          id={item.id}
          aria-labelledby={item.id ? titleId(item.id) : undefined}
          className={cn(
            "rounded-[18px] bg-white px-5 py-5 md:rounded-[24px] md:px-7 md:pt-[26px] md:pb-7 xl:px-fluid-28 xl:pt-fluid-26 xl:pb-fluid-28",
            // Where a jump link lands (the hero chips, a shared link or a redirect to #lip-flip …):
            // a bronze outline while the card is the URL's #fragment.
            "target:ring-2 target:ring-rule-strong",
            itemSpan(i, count),
          )}
        >
          <h3
            id={item.id ? titleId(item.id) : undefined}
            className="mb-2 font-heading text-[19px] leading-[1.3] tracking-display text-balance text-heading md:mb-3 md:text-h4"
          >
            {item.title}
          </h3>
          <Paragraphs
            items={item.paragraphs}
            className="grid gap-2 text-body leading-[1.7] text-pretty text-muted [&>p]:max-w-[52ch]"
            strongClassName="font-semibold text-heading"
          />
        </article>
      ))}
    </div>
  );
}

function PlainSection({ section, first, afterPlain }: { section: TreatmentSection; first: boolean; afterPlain: boolean }) {
  const hasText = Boolean(section.paragraphs?.length || section.cta);
  return (
    <Container as="section" id={section.id} aria-labelledby={titleId(section.id)} className="leading-[1.5]">
      <div
        className={cn(
          "py-12 md:py-fluid-72 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-x-fluid-64",
          // Right under the hero below 768px: the hero's own bottom padding is the gap.
          first && "max-md:pt-0",
          afterPlain && "border-t border-line",
        )}
      >
        {/* Without text of its own the heading spans the row (no empty text column beside it). */}
        <h2 id={titleId(section.id)} className={cn(h2Classes, "text-heading", hasText ? "mb-4 md:mb-5 lg:mb-0" : "lg:col-span-2")}>
          {section.title}
        </h2>
        {hasText ? (
          <div>
            {section.paragraphs?.length ? (
              <Paragraphs items={section.paragraphs} className={cn(textClasses, "text-muted")} strongClassName="font-semibold text-heading" />
            ) : null}
            {section.cta && !section.items?.length && !section.closing?.length ? (
              <SectionCta cta={section.cta} className="mt-6 md:mt-8 xl:mt-fluid-32" />
            ) : null}
          </div>
        ) : null}
        {section.items?.length ? <ItemCards items={section.items} className="mt-6 md:mt-fluid-48 lg:col-span-2" /> : null}
        {section.closing?.length ? (
          <Paragraphs
            items={section.closing}
            className={cn(textClasses, "mt-6 text-muted md:mt-fluid-36 lg:col-start-2")}
            strongClassName="font-semibold text-heading"
          />
        ) : null}
        {section.cta && (section.items?.length || section.closing?.length) ? (
          <SectionCta cta={section.cta} className="mt-6 md:mt-8 lg:col-start-2 xl:mt-fluid-32" />
        ) : null}
      </div>
    </Container>
  );
}

function BandSection({ section }: { section: TreatmentSection }) {
  return (
    <Container as="section" id={section.id} gutter="surface" aria-labelledby={titleId(section.id)} className="mt-surface leading-[1.5]">
      <div
        data-surface="band-md"
        className="rounded-[24px] bg-sand px-5 py-9 md:bg-band md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-x-fluid-56 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20"
      >
        <h2 id={titleId(section.id)} className={cn(h2Classes, "mb-4 text-heading md:mb-5 md:text-on-band lg:mb-0")}>
          {section.title}
        </h2>
        <div>
          {section.paragraphs?.length ? (
            <Paragraphs
              items={section.paragraphs}
              className={cn(textClasses, "text-muted md:text-band-body")}
              strongClassName="font-semibold text-heading md:text-on-band"
            />
          ) : null}
          {section.items?.length ? <ItemCards items={section.items} className="mt-6 md:mt-8" /> : null}
          {section.closing?.length ? (
            <Paragraphs
              items={section.closing}
              className={cn(textClasses, "mt-6 text-muted md:mt-8 md:text-band-body")}
              strongClassName="font-semibold text-heading md:text-on-band"
            />
          ) : null}
          {section.cta ? <SectionCta cta={section.cta} className="mt-7 md:mt-8 xl:mt-fluid-32" /> : null}
        </div>
      </div>
    </Container>
  );
}

function CardGroup({ sections }: { sections: TreatmentSection[] }) {
  return (
    <Container gutter="surface" className="mt-surface leading-[1.5]">
      <div className={cn("grid gap-surface", sections.length > 1 && "lg:grid-cols-2")}>
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={titleId(section.id)}
            className="flex flex-col rounded-[24px] bg-sand px-5 py-8 md:px-10 md:py-12 lg:px-14 lg:py-fluid-56 xl:px-16"
          >
            <h2
              id={titleId(section.id)}
              className="mb-3 font-heading text-[24px] leading-[1.2] tracking-display text-balance text-heading md:mb-4 md:text-h3-lg"
            >
              {section.title}
            </h2>
            {section.paragraphs?.length ? (
              <Paragraphs items={section.paragraphs} className={cn(textClasses, "text-muted")} strongClassName="font-semibold text-heading" />
            ) : null}
            {section.items?.length ? <ItemCards items={section.items} className="mt-6" /> : null}
            {section.closing?.length ? (
              <Paragraphs
                items={section.closing}
                className={cn(textClasses, "mt-6 text-muted")}
                strongClassName="font-semibold text-heading"
              />
            ) : null}
            {/* Pinned to the bottom, so side-by-side cards end their links on one line. */}
            {section.cta ? <SectionCta cta={section.cta} className="mt-auto pt-6 md:pt-8 xl:pt-fluid-32" /> : null}
          </section>
        ))}
      </div>
    </Container>
  );
}

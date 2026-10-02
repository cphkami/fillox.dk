import { Eyebrow, Photo } from "@/components/ui";
import type { BlogBlock } from "@/content/types";
import { cn } from "@/lib/cn";
import { BookingCard } from "./BookingCard";
import { Responsive } from "./Responsive";

/**
 * Renders the typed article body (content/types.ts `BlogBlock`). Type sizes from 6art
 * (desktop: lead 19px, body 17px/1.75, H2 28px) and mar (mobile: lead 18px, body
 * 17px/1.7, H2 22px); from 1280px they grow with the type scale (lead `text-title`, body
 * `text-body-lg`, H2 `text-h3-lg`). Blocks without a design (h3, quote, tip, image) follow
 * the same visual language. The parent sets the vertical rhythm (gap 16px / 18px, growing
 * to ~22px at 1600 with the type, like the space above H2s and H3s).
 *
 * Prose keeps one reading measure from 768px: paragraphs and lists 48ch (Figtree sets ≈ 1.42
 * characters per ch, so ≤ ~72 characters a line), the lead 43ch, which is the same width at its
 * larger size (48 × 17/19 ≈ 43), so lead and body share one right edge. Headings, cards and
 * figures use the full 720px column.
 */
export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return blocks.map((block, i) => <Block key={i} block={block} />);
}

/** Body copy: 17px (19px at 1600), capped at a 48ch line (≤ ~72 Figtree characters) from 768px. */
const bodyText = "text-body-lg leading-[1.7] text-muted md:max-w-[48ch] md:leading-[1.75]";

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "lead":
      return <p className="text-[18px] leading-[1.65] text-ink md:max-w-[43ch] md:text-[19px] md:leading-[1.7] xl:text-title">{block.text}</p>;

    case "paragraph":
      return (
        <p className={cn(bodyText, block.hideOnMobile && "max-md:hidden")}>
          <Responsive mobile={block.mobileText} desktop={block.text} />
        </p>
      );

    case "h2":
      return (
        <h2 id={block.id} className="mt-3 font-heading text-[22px] tracking-display text-heading md:mt-[22px] md:text-[28px] md:leading-[1.2] xl:mt-fluid-22 xl:text-h3-lg">
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3 id={block.id} className="mt-2 font-heading text-[19px] leading-[1.3] tracking-[-.01em] text-heading md:mt-3 md:text-[21px] xl:mt-fluid-12 xl:text-title-lg">
          {block.text}
        </h3>
      );

    case "list": {
      const List = block.style === "number" ? "ol" : "ul";
      return (
        <List
          className={cn(
            "grid gap-2 pl-5 text-body-lg leading-[1.6] text-muted md:max-w-[48ch]",
            block.style === "number" ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      );
    }

    case "quote":
      return (
        <figure className="my-2 border-l-2 border-accent pl-5 md:pl-6">
          <blockquote className="font-heading text-[19px] leading-[1.55] tracking-[-.01em] text-heading md:text-[21px] xl:text-title-lg">
            <p>{block.text}</p>
          </blockquote>
          {block.cite ? <figcaption className="mt-2 text-small text-muted">{block.cite}</figcaption> : null}
        </figure>
      );

    case "tip":
      return (
        <aside className="rounded-[20px] bg-sand p-5 md:px-7 md:py-6 xl:px-fluid-28 xl:py-fluid-24">
          {block.title ? <Eyebrow className="mb-2">{block.title}</Eyebrow> : null}
          <p className="text-body leading-[1.7] text-ink">{block.text}</p>
        </aside>
      );

    case "image":
      return (
        <figure className="my-2">
          <div className="overflow-hidden rounded-[20px]">
            <Photo image={block.image} sizes="(min-width: 800px) 720px, 100vw" className="aspect-[16/10]" />
          </div>
          {block.caption ? <figcaption className="mt-2.5 text-small leading-[1.6] text-muted">{block.caption}</figcaption> : null}
        </figure>
      );

    case "booking":
      return (
        <BookingCard
          treatmentSlug={block.treatmentSlug}
          eyebrow={block.eyebrow}
          note={block.note}
          hideNoteOnMobile={block.hideNoteOnMobile}
        />
      );
  }
}

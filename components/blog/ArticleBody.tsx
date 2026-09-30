import { Eyebrow, Photo } from "@/components/ui";
import type { BlogBlock } from "@/content/types";
import { cn } from "@/lib/cn";
import { BookingCard } from "./BookingCard";
import { Responsive } from "./Responsive";

/**
 * Renders the typed article body (content/types.ts `BlogBlock`). Type sizes from 6art
 * (desktop: lead 19px, body 17px/1.75, H2 28px) and mar (mobile: lead 18px, body
 * 17px/1.7, H2 22px). Blocks without a design (h3, quote, tip, image) follow the same
 * visual language. The parent sets the vertical rhythm (gap 16px / 18px).
 */
export function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return blocks.map((block, i) => <Block key={i} block={block} />);
}

const bodyText = "text-[17px] leading-[1.7] text-muted md:leading-[1.75]";

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "lead":
      return <p className="text-[18px] leading-[1.65] text-ink md:text-[19px] md:leading-[1.7]">{block.text}</p>;

    case "paragraph":
      return (
        <p className={cn(bodyText, block.hideOnMobile && "max-md:hidden")}>
          <Responsive mobile={block.mobileText} desktop={block.text} />
        </p>
      );

    case "h2":
      return (
        <h2 id={block.id} className="mt-3 text-[22px] font-semibold tracking-display md:mt-[22px] md:text-[28px] md:leading-[1.2]">
          {block.text}
        </h2>
      );

    case "h3":
      return (
        <h3 id={block.id} className="mt-2 text-[19px] leading-[1.3] font-semibold tracking-[-.01em] md:mt-3 md:text-[21px]">
          {block.text}
        </h3>
      );

    case "list": {
      const List = block.style === "number" ? "ol" : "ul";
      return (
        <List
          className={cn(
            "grid gap-2 pl-5 text-[17px] leading-[1.6] text-muted",
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
        <figure className="my-2 border-l-2 border-plum pl-5 md:pl-6">
          <blockquote className="text-[19px] leading-[1.55] font-medium tracking-[-.01em] text-ink md:text-[21px]">
            <p>{block.text}</p>
          </blockquote>
          {block.cite ? <figcaption className="mt-2 text-[14px] text-muted">{block.cite}</figcaption> : null}
        </figure>
      );

    case "tip":
      return (
        <aside className="rounded-[20px] bg-sand p-5 md:px-7 md:py-6">
          {block.title ? <Eyebrow className="mb-2">{block.title}</Eyebrow> : null}
          <p className="text-[16px] leading-[1.7] text-ink">{block.text}</p>
        </aside>
      );

    case "image":
      return (
        <figure className="my-2">
          <div className="overflow-hidden rounded-[20px]">
            <Photo image={block.image} sizes="(min-width: 800px) 720px, 100vw" className="aspect-[16/10]" />
          </div>
          {block.caption ? <figcaption className="mt-2.5 text-[14px] leading-[1.6] text-muted">{block.caption}</figcaption> : null}
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

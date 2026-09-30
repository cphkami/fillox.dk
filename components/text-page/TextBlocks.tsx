import { Fragment } from "react";
import type { TextBlock } from "@/content/types";
import { cn } from "@/lib/cn";
import { RichText } from "./RichText";

/**
 * Body text of a text page, styled like the blog article column (6art / mar):
 * 17px/1.75 muted paragraphs, 28px (mobile 22px) section headings, 18px gaps.
 * Headings wrap balanced and paragraphs "pretty", so no word is left alone on a line.
 */
export function TextBlocks({ blocks, className }: { blocks: TextBlock[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-[18px]", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-3 text-[22px] leading-[1.2] font-semibold tracking-display text-balance text-ink first:mt-0 md:mt-[22px] md:text-[28px]"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                className="mt-1 text-[18px] leading-[1.35] font-semibold tracking-[-.01em] text-balance text-ink first:mt-0 md:mt-2 md:text-[19px]"
              >
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="text-[17px] leading-[1.7] text-pretty text-muted md:leading-[1.75]">
                <RichText value={block.text} />
              </p>
            );
          case "list": {
            const List = block.style === "number" ? "ol" : "ul";
            return (
              <List
                key={i}
                className={cn(
                  "grid gap-2 pl-5 text-[17px] leading-[1.6] text-pretty text-muted",
                  block.style === "number" ? "list-decimal" : "list-disc",
                )}
              >
                {block.items.map((item, j) => (
                  <li key={j} className="pl-0.5">
                    <RichText value={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "lines":
            // Company / contact details: an <address> with a line break per row, so screen
            // readers pause between the rows. A card straight under its heading keeps the
            // column gap only (as heading → paragraph); elsewhere (the company card closing
            // the legal pages) it gets extra space above.
            return (
              <address
                key={i}
                className={cn(
                  "text-muted not-italic",
                  block.card
                    ? "mt-2 rounded-[20px] bg-white px-5 py-[18px] text-[15px] leading-[1.7] md:mt-[18px] md:px-7 md:py-6 [h2+&]:mt-0"
                    : "text-[17px] leading-[1.7]",
                )}
              >
                {block.lines.map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 ? <br /> : null}
                    <RichText value={line} />
                  </Fragment>
                ))}
              </address>
            );
        }
      })}
    </div>
  );
}

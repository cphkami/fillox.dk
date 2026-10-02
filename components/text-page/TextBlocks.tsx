import { Fragment } from "react";
import type { TextBlock } from "@/content/types";
import { cn } from "@/lib/cn";
import { RichText } from "./RichText";

/**
 * Reading measure of the prose (paragraphs, lists, plain address lines, the address card):
 * ≤ ~75 characters per line (ARCHITECTURE.md → "Type scale"). Headings keep the full column.
 * From 768px: 52ch. Figtree sets ≈ 1.42 characters per `ch` (a wide "0", narrow lowercase;
 * Poppins set ≈ 1.29), so 52ch is ≈ 74 characters per line: 566px at 17px, 600px at 18px,
 * 633px at 19px, inside the 640px (tablet) / 684px (≥ 1280) column. `ch` grows with the font,
 * so the measure holds at every size. (The Poppins-era 640px / 58ch ran to 82–88 characters
 * per line in Figtree.)
 * `ch` resolves against the element's own font, so the measure only goes on elements set in
 * the prose size (`text-body-lg`).
 */
const measure = "md:max-w-[52ch]";

/**
 * Body text of a text page, styled like the blog article column (6art / mar):
 * 17px/1.75 muted paragraphs, 28px (mobile 22px) section headings, 18px gaps.
 * Headings wrap balanced and paragraphs "pretty", so no word is left alone on a line.
 * Wide (≥1280px, type scale): body 17 → 19px (`text-body-lg`), headings 28 → 32px
 * (`text-h3-lg`), H3 21 → 23px (`text-title-lg`), the address card 15 → 16px, and the gaps
 * grow in proportion.
 */
export function TextBlocks({ blocks, className }: { blocks: TextBlock[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 md:gap-[18px] xl:gap-fluid-18/20", className)}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-3 font-heading text-[22px] leading-[1.2] tracking-display text-balance text-heading first:mt-0 md:mt-[22px] md:text-[28px] xl:mt-fluid-22/25 xl:text-h3-lg"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              // Same size, leading and spacing as the article H3 (components/blog/ArticleBody):
              // 19 / 21px, `text-title-lg` (21 → 23px) from 1280.
              <h3
                key={i}
                className="mt-2 font-heading text-[19px] leading-[1.3] tracking-[-.01em] text-balance text-heading first:mt-0 md:mt-3 md:text-[21px] xl:mt-fluid-12 xl:text-title-lg"
              >
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className={cn("text-body-lg leading-[1.7] text-pretty text-muted md:leading-[1.75]", measure)}>
                <RichText value={block.text} />
              </p>
            );
          case "list": {
            const List = block.style === "number" ? "ol" : "ul";
            return (
              <List
                key={i}
                className={cn(
                  "grid gap-2 pl-5 text-body-lg leading-[1.6] text-pretty text-muted",
                  block.style === "number" ? "list-decimal" : "list-disc",
                  measure,
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
          case "lines": {
            // Company / contact details: an <address> with a line break per row, so screen
            // readers pause between the rows.
            const lines = block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 ? <br /> : null}
                <RichText value={line} />
              </Fragment>
            ));
            if (!block.card) {
              return (
                <address key={i} className={cn("text-body-lg leading-[1.7] text-muted not-italic", measure)}>
                  {lines}
                </address>
              );
            }
            // White card. Straight under its heading it keeps the column gap only (as heading →
            // paragraph); elsewhere (the company card closing the legal pages) it gets extra
            // space above. It ends on the prose's right edge: the card itself is set in the prose
            // size, so `measure` (in ch) gives the same width, and its lines use the card's own
            // 15 → 16px (`text-body-sm`).
            return (
              <address
                key={i}
                className={cn(
                  "mt-2 rounded-[20px] bg-white px-5 py-[18px] text-body-lg text-muted not-italic md:mt-[18px] md:px-7 md:py-6 xl:px-fluid-28/32 xl:py-fluid-24/28 [h2+&]:mt-0",
                  measure,
                )}
              >
                <div className="text-body-sm leading-[1.7]">{lines}</div>
              </address>
            );
          }
        }
      })}
    </div>
  );
}

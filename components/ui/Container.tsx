import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const gutters = {
  /** Text/content gutter: 20px mobile · 40px tablet · 56px desktop (design side paddings). */
  content: "px-5 md:px-10 lg:px-14",
  /** Surface gutter for rounded bands/cards: 12px mobile · 24px desktop. */
  surface: "px-3 md:px-6",
  none: "",
} as const;

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** Element to render; defaults to <div>. */
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "nav";
  gutter?: keyof typeof gutters;
};

/** Centres content on the 1180px design canvas with the design's side gutters. */
export function Container({ as: Tag = "div", gutter = "content", className, ...props }: ContainerProps) {
  return <Tag {...props} className={cn("mx-auto w-full max-w-[1180px]", gutters[gutter], className)} />;
}

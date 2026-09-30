import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Side gutters (values live in app/globals.css → --gutter-content / --gutter-surface).
 * Exported so elements that can't be a <Container> can reuse them.
 */
export const gutterClasses = {
  /** Text/content gutter: 20px mobile · 40 md · 56 lg · 64 xl · 80 2xl (px-5 md:px-10 lg:px-14 xl:px-16 2xl:px-20). */
  content: "px-gutter",
  /** Surface margin for rounded bands/cards: 12px mobile · 24 md · 32 2xl (px-3 md:px-6 2xl:px-8). */
  surface: "px-surface",
  none: "",
} as const;

export type Gutter = keyof typeof gutterClasses;

/**
 * Class string of a Container: centred, 100% wide up to the site canvas (--canvas-max,
 * 1600px) with the given side gutter. Use it on elements that can't be a <Container>,
 * e.g. `<section className={cn(containerClasses("surface"), "pt-6")}>`.
 */
export function containerClasses(gutter: Gutter = "content"): string {
  return cn("mx-auto w-full max-w-canvas", gutterClasses[gutter]);
}

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** Element to render; defaults to <div>. */
  as?: "div" | "section" | "article" | "aside" | "header" | "footer" | "nav";
  gutter?: Gutter;
};

/**
 * Centres content on the fluid site canvas (100% wide up to --canvas-max = 1600px; the
 * design canvas is 1180px) with the design's side gutters, which grow on wide screens.
 */
export function Container({ as: Tag = "div", gutter = "content", className, ...props }: ContainerProps) {
  return <Tag {...props} className={cn(containerClasses(gutter), className)} />;
}

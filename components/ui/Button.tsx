import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Pill buttons from the design (radius 100px).
 *
 * - primary   plum bg + cream text (one per section on light surfaces)
 * - light     powder bg + plum text, semibold (the CTA on plum surfaces)
 * - lightInk  powder bg + ink text, semibold (6c/6bx book band "Book Botox · fra 799 kr", 6b "Book tid")
 * - outline   1px plum border + plum text
 * - outlineInk 1px ink border + ink text
 * - white     white bg + 1px line border (chips, secondary on sand)
 * - textLink  underlined text link with a 1px border-bottom ("Se priser")
 */
export type ButtonVariant = "primary" | "light" | "lightInk" | "outline" | "outlineInk" | "white" | "textLink";

/**
 * Padding is vertical × horizontal · font size (all from the design sections).
 * - xs       10px 22px · 13px (6alb offer cards "Book hos Alberte")
 * - sm       13px 30px · 14px (desktop header "Book tid")
 * - mdTight  14px 30px · 14px ("Alle artikler om …", "Få besked", 6b "Book tid"). For the
 *            14px 32px / 14px 36px one-offs ("Vis flere artikler", "Se alle behandlinger →")
 *            add className="px-8!" / "px-9!".
 * - md       16px 36px · 14px (hero / footer / profile CTAs)
 * - xl       16px 42px · 14px (6c/6bx book band "Book Botox · fra 799 kr")
 * - chip     10px 20px · 14px on desktop (6blog filter chips); 44px high, 0 18px below 768px
 *            (mp / mbl chips, mobile "Book" pills)
 * - lg       52px high, 0 26px · 15px (mobile primary)
 * - compact  44px high, 0 20px · 14px (mobile header "Book tid" only; chips use `chip`)
 */
export type ButtonSize = "xs" | "sm" | "mdTight" | "md" | "xl" | "chip" | "lg" | "compact";

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Size below the md breakpoint (768px), e.g. size="md" mobileSize="lg". */
  mobileSize?: "lg" | "compact" | "chip";
  /** true = always full width; "mobile" = full width below 768px only. */
  fullWidth?: boolean | "mobile";
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-center transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50";

/**
 * Filled pills have no border, and Windows high contrast (forced colors) drops their fill, so
 * they would read as plain text there. Give them a system-colour border in that mode only.
 */
const forcedColorsBorder = "forced-colors:border forced-colors:border-[color:ButtonText]";

const variants: Record<ButtonVariant, string> = {
  primary: `rounded-full bg-plum text-cream hover:bg-plum-deep ${forcedColorsBorder}`,
  light: `rounded-full bg-powder font-semibold text-plum hover:bg-cream ${forcedColorsBorder}`,
  lightInk: `rounded-full bg-powder font-semibold text-ink hover:bg-cream ${forcedColorsBorder}`,
  outline: "rounded-full border border-plum text-plum hover:bg-plum hover:text-cream",
  outlineInk: "rounded-full border border-ink text-ink hover:bg-ink hover:text-cream",
  white: "rounded-full border border-line bg-white text-ink hover:border-plum hover:text-plum",
  textLink: "border-b border-current pb-[3px] text-[14px] text-ink hover:text-plum",
};

const sizes: Record<ButtonSize, string> = {
  xs: "px-[22px] py-[10px] text-[13px]",
  sm: "px-[30px] py-[13px] text-[14px]",
  mdTight: "px-[30px] py-[14px] text-[14px]",
  md: "px-9 py-4 text-[14px]",
  xl: "px-[42px] py-4 text-[14px]",
  chip: "px-5 py-2.5 text-[14px] max-md:h-11 max-md:px-[18px] max-md:py-0",
  lg: "h-[52px] px-[26px] text-[15px]",
  compact: "h-11 px-5 text-[14px]",
};

const mobileSizes: Record<NonNullable<ButtonStyleProps["mobileSize"]>, string> = {
  lg: "max-md:h-[52px] max-md:px-[26px] max-md:py-0 max-md:text-[15px]",
  compact: "max-md:h-11 max-md:px-5 max-md:py-0 max-md:text-[14px]",
  chip: "max-md:h-11 max-md:px-[18px] max-md:py-0 max-md:text-[14px]",
};

/**
 * The pressed / current chip in Windows high contrast (forced colors): that mode replaces the
 * plum fill that marks the state, so paint the chip in the system Highlight colours instead.
 * No effect outside forced-colors mode. Add it to the selected chip's classes.
 */
export const forcedColorsSelected =
  "forced-colors:forced-color-adjust-none forced-colors:border-[color:Highlight]! forced-colors:bg-[color:Highlight]! forced-colors:text-[color:HighlightText]! forced-colors:outline-[color:CanvasText]";

/** Class string for a pill button — use when you need button styling on another element. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  mobileSize,
  fullWidth,
}: ButtonStyleProps = {}): string {
  const isText = variant === "textLink";
  return cn(
    base,
    variants[variant],
    !isText && sizes[size],
    !isText && mobileSize && mobileSizes[mobileSize],
    fullWidth === true && "w-full",
    fullWidth === "mobile" && "max-md:w-full",
  );
}

type ButtonLinkProps = ButtonStyleProps & ComponentPropsWithoutRef<typeof Link>;

/** Pill-styled next/link. `className` is for layout (margins, self-alignment). */
export function ButtonLink({ variant, size, mobileSize, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link {...props} className={cn(buttonClasses({ variant, size, mobileSize, fullWidth }), className)} />;
}

type ButtonProps = ButtonStyleProps & ComponentPropsWithoutRef<"button">;

/** Pill-styled <button> (defaults to type="button"). */
export function Button({ variant, size, mobileSize, fullWidth, className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={cn(buttonClasses({ variant, size, mobileSize, fullWidth }), className)}
    />
  );
}

/**
 * Centring the short last row of a team grid, when the team does not fill it (five members:
 * 3 + 2 on three columns, 2 + 2 + 1 on two). With six (the team since 2026-11-25: 3 + 3, and
 * 2 + 2 + 2) every row is full and no card is moved; the helper stays so a seventh member, or one
 * leaving, never leaves a lone card at the left edge. The grid has twice as many tracks as it
 * shows columns and every card spans two, so a card can start half a card in; the gaps work out
 * the same: a card is (width − 2 × gap) / 3 wide on 6 tracks, as on 3. The utilities are written
 * out here so Tailwind finds them.
 *
 *   list:  md:grid-cols-6        item: md:col-span-2 + teamGridStart(i, n, 3, "md")
 */

/** Track (1-based, on the doubled grid) where the first card of a short last row starts. */
export function lastRowStart(index: number, count: number, columns: 2 | 3): 2 | 3 | undefined {
  const rest = count % columns;
  if (rest === 0 || index !== count - rest) return undefined;
  return columns === 3 && rest === 1 ? 3 : 2;
}

const START = {
  "min-[560px]": { 2: "min-[560px]:col-start-2", 3: "min-[560px]:col-start-3" },
  md: { 2: "md:col-start-2", 3: "md:col-start-3" },
  lg: { 2: "lg:col-start-2", 3: "lg:col-start-3" },
} as const;

const RESET = { "min-[560px]": "min-[560px]:col-start-auto", md: "md:col-start-auto", lg: "lg:col-start-auto" } as const;

/**
 * The col-start utility for card `index` of `count` on a grid of `columns` columns from
 * `breakpoint` up, or a reset when an earlier breakpoint moved the card and this one does not.
 */
export function teamGridStart(
  index: number,
  count: number,
  columns: 2 | 3,
  breakpoint: keyof typeof START,
  movedBefore = false,
): string | undefined {
  const start = lastRowStart(index, count, columns);
  if (start) return START[breakpoint][start];
  return movedBefore ? RESET[breakpoint] : undefined;
}

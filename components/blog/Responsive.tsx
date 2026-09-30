import type { ReactNode } from "react";

type ResponsiveProps = {
  /** Shown below 768px (the mobile design's shorter copy). Falls back to `desktop`. */
  mobile?: ReactNode;
  desktop: ReactNode;
};

/**
 * Renders the mobile copy below 768px and the desktop copy from 768px.
 *
 * - Same text: rendered once.
 * - Mobile text = desktop text with one passage left out ("Få tips og tilbud" /
 *   "Få tips og tilbud i din indbakke"): the shared words are rendered once and only the
 *   extra passage is hidden below 768px, so the DOM holds the desktop text exactly once.
 * - Otherwise (an editorial rewrite): both versions are rendered and the hidden one is
 *   display:none (assistive technology reads only the visible one). The mobile copy is
 *   marked `data-nosnippet`, so search snippets quote the full desktop text.
 */
export function Responsive({ mobile, desktop }: ResponsiveProps) {
  if (mobile === undefined || mobile === null || mobile === desktop) return <>{desktop}</>;

  const cut = typeof mobile === "string" && typeof desktop === "string" ? omittedPassage(mobile, desktop) : null;
  if (cut) {
    return (
      <>
        {cut.head}
        <span className="max-md:hidden">{cut.extra}</span>
        {cut.tail}
      </>
    );
  }

  return (
    <>
      <span className="md:hidden" data-nosnippet="">
        {mobile}
      </span>
      <span className="max-md:hidden">{desktop}</span>
    </>
  );
}

const WORD_CHAR = /[\p{L}\p{N}]/u;

/** True when position `i` of `text` is not inside a word (so a span may start or end there). */
function atWordBoundary(text: string, i: number): boolean {
  return i <= 0 || i >= text.length || !WORD_CHAR.test(text[i - 1]) || !WORD_CHAR.test(text[i]);
}

/**
 * When `mobile` is `desktop` with one contiguous passage removed, returns the text before
 * the passage, the passage and the text after it. Null when the texts differ in any other
 * way or the passage would split a word (e.g. "sep" / "september").
 */
function omittedPassage(mobile: string, desktop: string): { head: string; extra: string; tail: string } | null {
  if (mobile.length >= desktop.length) return null;

  let head = 0;
  while (head < mobile.length && mobile[head] === desktop[head]) head++;
  let tail = 0;
  while (tail < mobile.length - head && mobile[mobile.length - 1 - tail] === desktop[desktop.length - 1 - tail]) tail++;
  if (head + tail !== mobile.length) return null;

  const end = desktop.length - tail;
  if (!atWordBoundary(desktop, head) || !atWordBoundary(desktop, end)) return null;
  return { head: desktop.slice(0, head), extra: desktop.slice(head, end), tail: desktop.slice(end) };
}

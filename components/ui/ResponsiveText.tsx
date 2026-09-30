import type { ReactNode } from "react";

type ResponsiveTextProps = {
  /** Shown below 768px: the mobile design's (usually shorter) wording. Falls back to `desktop`. */
  mobile?: ReactNode;
  /** Shown from 768px. */
  desktop: ReactNode;
};

/**
 * Copy that the mobile design words differently: `mobile` below 768px, `desktop` from 768px.
 * Without a mobile text (undefined, null, "" or the same as `desktop`) only `desktop` is
 * rendered. Otherwise both are rendered and the hidden one is display:none, so assistive
 * technology reads only the visible one.
 *
 * The blog has a variant that also de-duplicates a mobile text that is the desktop text
 * minus one passage (components/blog/Responsive.tsx).
 */
export function ResponsiveText({ mobile, desktop }: ResponsiveTextProps) {
  if (mobile === undefined || mobile === null || mobile === "" || mobile === desktop) return <>{desktop}</>;
  return (
    <>
      <span className="md:hidden">{mobile}</span>
      <span className="max-md:hidden">{desktop}</span>
    </>
  );
}

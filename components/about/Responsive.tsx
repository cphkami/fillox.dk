import type { ReactNode } from "react";

type ResponsiveProps = {
  /** Shown below 768px (the mobile design's shorter copy). Falls back to `desktop`. */
  mobile?: ReactNode;
  desktop: ReactNode;
};

/**
 * Renders the mobile text below 768px and the desktop text from 768px. When both are
 * the same only one copy is rendered. The hidden copy is display:none, so assistive
 * technology reads only the visible one.
 */
export function Responsive({ mobile, desktop }: ResponsiveProps) {
  if (mobile === undefined || mobile === desktop) return <>{desktop}</>;
  return (
    <>
      <span className="md:hidden">{mobile}</span>
      <span className="max-md:hidden">{desktop}</span>
    </>
  );
}

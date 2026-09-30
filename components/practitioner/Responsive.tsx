import type { ReactNode } from "react";

type ResponsiveProps = {
  /** Shown below 768px (the mobile design's shorter copy). Falls back to `desktop`. */
  mobile?: ReactNode;
  desktop: ReactNode;
};

/**
 * Mobile text below 768px, desktop text from 768px. When both are the same only one
 * copy is rendered; the hidden copy is display:none, so assistive tech reads one.
 */
export function Responsive({ mobile, desktop }: ResponsiveProps) {
  if (mobile === undefined || mobile === null || mobile === desktop) return <>{desktop}</>;
  return (
    <>
      <span className="md:hidden">{mobile}</span>
      <span className="max-md:hidden">{desktop}</span>
    </>
  );
}

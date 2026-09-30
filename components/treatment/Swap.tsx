import type { ReactNode } from "react";

/**
 * Renders `mobile` below 768px and `desktop` from 768px, when the design uses different
 * copy per breakpoint. The hidden variant is display:none, so assistive tech reads one.
 */
export function Swap({ mobile, desktop }: { mobile?: ReactNode; desktop: ReactNode }) {
  if (mobile === undefined || mobile === null || mobile === desktop) return <>{desktop}</>;
  return (
    <>
      <span className="md:hidden">{mobile}</span>
      <span className="max-md:hidden">{desktop}</span>
    </>
  );
}

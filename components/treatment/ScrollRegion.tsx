"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal scroll row that becomes a keyboard stop (tabIndex 0, role="group" with an
 * accessible name) only while its content actually overflows, i.e. on mobile. Where the
 * content fits (the desktop grid) it is a plain <div>.
 */
export function ScrollRegion({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ResizeObserver also fires once right after observe(), which sets the initial state.
    const observer = new ResizeObserver(() => setScrollable(el.scrollWidth > el.clientWidth + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? "group" : undefined}
      aria-label={scrollable ? label : undefined}
    >
      {children}
    </div>
  );
}

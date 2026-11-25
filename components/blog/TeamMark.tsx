import { cn } from "@/lib/cn";

/**
 * The Fillox mark ("OX", outlined, as in app/icon.png) in a round accent disc: the team
 * author's avatar ("Fillox-holdet"), in place of a person's portrait. Decorative (the name
 * is always next to it). Traced from the 512px app icon: the O is two concentric circles,
 * the X one closed outline; drawn at 80% so it sits inside the circle. The stroke scales with
 * the disc: ≈ 1px at 36px, 2px at 72px.
 */
export function TeamMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" focusable="false" className={cn("block shrink-0", className)}>
      <circle cx="256" cy="256" r="256" className="fill-accent" />
      <g
        transform="translate(256 256) scale(0.8) translate(-253.75 -256)"
        fill="none"
        strokeWidth="20"
        strokeLinejoin="miter"
        className="stroke-rule"
      >
        <circle cx="169.5" cy="256" r="85" />
        <circle cx="169.5" cy="256" r="43" />
        <polygon points="258,174 312,174 341.5,217 371,174 423,174 368,256 423,338 371,338 341.5,295 312,338 258,338 313,256" />
      </g>
    </svg>
  );
}

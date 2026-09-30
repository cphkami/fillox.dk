import { cn } from "@/lib/cn";

/** 44px round arrow button face (decorative; the surrounding link carries the name). */
export function ArrowCircle({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full leading-none transition-colors duration-200",
        className,
      )}
    >
      →
    </span>
  );
}

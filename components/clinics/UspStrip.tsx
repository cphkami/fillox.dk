import { containerClasses } from "@/components/ui";
import { cn } from "@/lib/cn";

type UspStripProps = {
  items: { title: string; text: string }[];
  /** Accessible name of the strip. */
  label: string;
  className?: string;
};

/**
 * Plum band with three short promises under the clinic cards (design 6kl). Spans the
 * site canvas on the surface margin; on wide screens its side padding follows the
 * footer's (56 · 64 xl · 80 2xl), so the columns line up with the footer text.
 */
export function UspStrip({ items, label, className }: UspStripProps) {
  return (
    <section aria-label={label} data-surface="plum" className={cn(containerClasses("surface"), className)}>
      <ul className="grid gap-8 rounded-[24px] bg-plum p-10 text-blush md:grid-cols-3 lg:gap-10 lg:p-14 xl:gap-fluid-40 xl:px-16 xl:py-fluid-56 2xl:px-20">
        {items.map((item) => (
          <li key={item.title}>
            <h2 className="mb-2.5 text-micro font-bold tracking-[2px] text-powder uppercase">{item.title}</h2>
            <p className="text-body leading-[1.75]">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

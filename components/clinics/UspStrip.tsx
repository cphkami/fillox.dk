import { cn } from "@/lib/cn";

type UspStripProps = {
  items: { title: string; text: string }[];
  /** Accessible name of the strip. */
  label: string;
  className?: string;
};

/** Plum band with three short promises under the clinic cards (design 6kl). */
export function UspStrip({ items, label, className }: UspStripProps) {
  return (
    <section aria-label={label} data-surface="plum" className={cn("mx-auto w-full max-w-[1180px] px-3 md:px-6", className)}>
      <ul className="grid gap-8 rounded-[24px] bg-plum p-10 text-blush md:grid-cols-3 lg:gap-10 lg:p-14">
        {items.map((item) => (
          <li key={item.title}>
            <h2 className="mb-2.5 text-[12px] font-bold tracking-[2px] text-powder uppercase">{item.title}</h2>
            <p className="text-[16px] leading-[1.75]">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

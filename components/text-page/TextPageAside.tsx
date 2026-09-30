import { ButtonLink, Eyebrow } from "@/components/ui";
import type { TextPageContent } from "@/content/types";
import { cn } from "@/lib/cn";

type TextPageAsideProps = {
  aside: NonNullable<TextPageContent["aside"]>;
  titleId: string;
  className?: string;
};

/**
 * CTA card beside the text (sand, radius 20, like the 6art / mar booking card).
 * The first action is the primary plum button, the rest are outline buttons (all the same
 * height). Buttons are full width on mobile and in the desktop side column, side by side
 * on tablet.
 */
export function TextPageAside({ aside, titleId, className }: TextPageAsideProps) {
  return (
    <aside aria-labelledby={titleId} className={cn("rounded-[20px] bg-sand p-5 md:p-7", className)}>
      {aside.eyebrow ? <Eyebrow className="mb-1.5">{aside.eyebrow}</Eyebrow> : null}
      <h2 id={titleId} className="text-[20px] leading-[1.25] font-semibold tracking-display text-balance md:text-[22px]">
        {aside.title}
      </h2>
      {aside.text ? <p className="mt-2 text-[15px] leading-[1.65] text-pretty text-muted">{aside.text}</p> : null}
      <div className="mt-5 flex flex-col gap-2.5 md:mt-6 md:flex-row md:flex-wrap lg:flex-col">
        {aside.actions.map((action, i) => (
          <ButtonLink
            key={action.href}
            href={action.href}
            variant={i === 0 ? "primary" : "outline"}
            size="mdTight"
            mobileSize="lg"
            // The primary button gets a transparent 1px border so it is exactly as tall as the
            // outline buttons (1px plum border) on the same padding.
            className={cn("max-md:w-full lg:w-full", i === 0 && "border border-transparent")}
          >
            {action.label}
          </ButtonLink>
        ))}
      </div>
    </aside>
  );
}

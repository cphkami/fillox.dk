import { Eyebrow } from "@/components/ui/Eyebrow";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { layoutCopy } from "@/content/layout";
import { cn } from "@/lib/cn";

const copy = layoutCopy.footer.newsletter;

/** The footer appears once per page, so its ids are fixed. */
const ids = { title: "footer-newsletter-title", text: "footer-newsletter-text" } as const;

/**
 * Newsletter signup at the top of the footer block, on every page (owner, 2026-10): eyebrow,
 * heading and one line on the left, e-mail + "Tilmeld" and the unsubscribe / privacy line on the
 * right from 1024px; stacked below. The form is the shared `NewsletterForm` (the /blog band's),
 * in the footer's colours.
 *
 * Hidden on a page that has its own newsletter band (`data-newsletter-band`, /blog), which sits
 * right above the footer, and on the newsletter's thank-you page (`data-newsletter-thanks`,
 * /nyhedsbrev/tak): CSS `:has()`, so the static HTML needs no route check. (A browser without
 * `:has()` shows both.)
 */
export function FooterNewsletter({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby={ids.title}
      className={cn(
        "[body:has([data-newsletter-band])_&]:hidden [body:has([data-newsletter-thanks])_&]:hidden",
        "flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-6",
        className,
      )}
    >
      <div className="flex flex-col gap-2 lg:gap-2.5">
        <Eyebrow tone="footer">{copy.eyebrow}</Eyebrow>
        <h2
          id={ids.title}
          className="font-heading text-[24px] leading-[1.15] tracking-display text-balance text-on-footer md:text-[28px] xl:text-h3-lg"
        >
          {copy.title}
        </h2>
        <p id={ids.text} className="text-body leading-[1.6] text-footer-body">
          {copy.text}
        </p>
      </div>
      <NewsletterForm copy={copy} tone="footer" placement="footer" describedBy={ids.text} />
    </section>
  );
}

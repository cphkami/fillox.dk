import { ButtonLink, Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { blogPage } from "@/content/pages/blog";
import { getTreatment } from "@/content/treatments";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { formatPriceFrom } from "@/lib/content";

type BookingCardProps = {
  treatmentSlug: string;
  eyebrow: string;
  note?: string;
  hideNoteOnMobile?: boolean;
};

/**
 * The discreet booking card inside an article (6art: text left, "Book tid" right;
 * mar: stacked with a full-width button). The treatment name is plain text, as in the
 * design, so "Book tid" is the card's only target.
 */
export function BookingCard({ treatmentSlug, eyebrow, note, hideNoteOnMobile }: BookingCardProps) {
  const treatment = getTreatment(treatmentSlug);
  if (!treatment) return null;
  const name = treatment.detail?.title ?? treatment.name;

  return (
    <aside
      aria-label={eyebrow}
      className="flex flex-col gap-3 rounded-[20px] bg-sand p-5 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-5 md:px-7 md:py-6"
    >
      <div>
        <Eyebrow className="md:mb-1.5">{eyebrow}</Eyebrow>
        <p className="text-[18px] font-semibold max-md:mt-3">
          {name}
          {treatment.priceFrom ? (
            <span className="font-normal text-muted">
              {blogPage.separator}
              {formatPriceFrom(treatment.priceFrom)}
            </span>
          ) : null}
        </p>
        {note ? (
          <p className={cn("mt-0.5 text-[14px] text-muted", hideNoteOnMobile && "max-md:hidden")}>{note}</p>
        ) : null}
      </div>
      <ButtonLink
        href={site.booking.href}
        size="mdTight"
        mobileSize="lg"
        fullWidth="mobile"
        className="md:px-7!"
      >
        {ui.bookCta}
      </ButtonLink>
    </aside>
  );
}

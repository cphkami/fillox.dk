import Link from "next/link";
import { Photo, ResponsiveText } from "@/components/ui";
import { buttonClasses } from "@/components/ui/Button";
import { site } from "@/config/site";
import type { ClinicsPageCopy } from "@/content/pages/clinics";
import type { Clinic } from "@/content/types";
import { cn } from "@/lib/cn";
import { NotifyForm } from "./NotifyForm";

type ClinicCardProps = {
  clinic: Clinic;
  copy: ClinicsPageCopy["card"];
  notifyCopy: ClinicsPageCopy["notify"];
  /** Mobile wording for a coming-soon clinic (badge, note) and its signup form. */
  comingSoon?: ClinicsPageCopy["comingSoon"][string];
  /** Load the photo eagerly (first row on desktop). */
  priorityPhoto?: boolean;
};

/**
 * One clinic on /klinikker (design 6kl desktop / mk mobile). The card carries
 * id="<slug>" so the header dropdown, footer and map pins can link to it.
 *
 * Desktop: photo, name, address, hours grid, transport note, "Book i <name>" +
 * "Rutevejledning →". Mobile: no photo; hours in a sand box, then the transport
 * note; two pill buttons "Book her" / "Rutevejledning".
 *
 * Between 768 and 1024px the button reads "Book her" (as on mobile), so the button
 * and the directions link fit on one line in every card and neighbouring cards'
 * action rows line up.
 */
export function ClinicCard({ clinic, copy, notifyCopy, comingSoon, priorityPhoto }: ClinicCardProps) {
  const soon = clinic.status === "coming-soon";
  const titleId = `${clinic.slug}-title`;

  return (
    <article
      id={clinic.slug}
      aria-labelledby={titleId}
      className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white md:rounded-[24px]"
    >
      {/* 200px (md) / 260px (lg) as in 6kl; from 1280px the photo keeps its 7:3 shape as the card
          grows with the canvas (604 × 259 at 1280 → 752 × 322 on the 1600px canvas). */}
      <div className="relative h-[200px] shrink-0 lg:h-[260px] xl:aspect-[7/3] xl:h-auto max-md:hidden">
        <Photo
          image={copy.photos[clinic.slug] ?? copy.photo}
          // Card = (band − gap) / 2; band and gap follow the surface margin (24 · 32px at 2xl):
          // 752px on the 1600px canvas. Hidden below 768px: the 1px slot makes phones fetch
          // the tiniest variant.
          sizes="(min-width: 1600px) 752px, (min-width: 1536px) calc(50vw - 48px), (min-width: 768px) calc(50vw - 36px), 1px"
          priority={priorityPhoto}
          className="h-full"
        />
        {soon && clinic.openingNote ? (
          <p className="absolute top-[18px] left-[18px] rounded-full bg-accent px-4 py-[7px] text-micro font-semibold tracking-[.12em] text-on-accent uppercase">
            {clinic.openingNote}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-[22px] md:gap-0 md:px-7 md:pt-7 md:pb-8 lg:px-9 lg:pt-8 lg:pb-9 xl:px-fluid-40/48 xl:pt-fluid-32 xl:pb-fluid-36">
        {/* From 1280px the gaps inside the card body grow with its padding (*-fluid-N).
            The title uses the leading-[1.1] py-[.2em] recipe for headings set with line-height
            normal (one line looks the same, a wrapped name keeps a 1.1 gap), except at 768–1279px:
            there the swap changes the 24 / 28px line box by 1 / 0.02px and shifts the cards below,
            and every name fits on one line with room to spare. */}
        <div className="flex items-center justify-between gap-3 md:mb-2.5 xl:mb-fluid-10">
          <h2
            id={titleId}
            className="py-[.2em] font-heading text-[20px] leading-[1.1] text-accent md:py-0 md:text-[24px] md:leading-[normal] md:tracking-display md:text-heading lg:text-h3-lg xl:py-[.2em] xl:leading-[1.1]"
          >
            {clinic.fullName}
          </h2>
          {soon && (comingSoon?.openingNoteShort ?? clinic.openingNote) ? (
            <p className="shrink-0 rounded-full bg-secondary px-3 py-[5px] text-[12px] font-semibold text-accent md:hidden">
              {comingSoon?.openingNoteShort ?? clinic.openingNote}
            </p>
          ) : null}
        </div>

        {soon ? (
          <>
            <p className="text-[15px] leading-[1.6] text-muted md:mb-[22px] md:text-body md:leading-[1.75] xl:mb-fluid-22 xl:max-w-[56ch] xl:text-pretty">
              <ResponsiveText mobile={comingSoon?.noteShort} desktop={clinic.note} />
            </p>
            {comingSoon?.formName ? (
              <div className="md:mt-auto xl:max-w-[640px]">
                <NotifyForm formName={comingSoon.formName} copy={notifyCopy} />
              </div>
            ) : null}
          </>
        ) : (
          <>
            {/* Address, then hours (6kl). From 1440px (a common laptop width) the card body is
                ≥ 604px wide, so the two sit side by side (hours level with the address lines: their
                line height is the address's, 1.75 × text-body) instead of leaving the right half of
                every card empty. Below 1440px the wrapper is display: contents and changes nothing
                (1280 keeps the design).
                The breakpoint is written min-[90rem] (= 1440px): in rem, like md/lg/xl, so Tailwind
                orders it after them; a px value would sort first and lose to md:mt-[18px] etc. */}
            <div className="contents min-[90rem]:mb-fluid-22 min-[90rem]:grid min-[90rem]:grid-cols-2 min-[90rem]:gap-x-6">
              <address className="text-[15px] leading-[1.6] text-muted not-italic md:text-body md:leading-[1.75]">
                {clinic.address.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </address>

              <div className="md:mt-[18px] md:mb-[22px] xl:mt-fluid-18 xl:mb-fluid-22 min-[90rem]:my-0">
                <h3 className="sr-only">{copy.hoursLabel}</h3>
                {/* The two auto columns share the width (6kl); from 1280px the list stops at the
                    design's 480px text width, so the hours don't drift to the middle of a wide card,
                    and from 1440px (next to the address) the columns hug their content. Next to the
                    address the hours step up to text-body-sm (15.5 → 16px against its 17 → 18px, the
                    design's 16:14 ratio), so the opening hours don't read smaller than the address. */}
                <dl className="rounded-[14px] bg-sand px-4 py-3 text-small leading-[1.7] md:grid md:grid-cols-[auto_auto] md:gap-x-6 md:gap-y-1 md:rounded-none md:bg-transparent md:p-0 md:leading-normal md:text-muted xl:max-w-[480px] min-[90rem]:justify-start min-[90rem]:gap-x-10 min-[90rem]:gap-y-0 min-[90rem]:text-body-sm min-[90rem]:leading-[calc(var(--text-body)*1.75)]">
                  {clinic.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4 md:contents">
                      <dt>
                        <ResponsiveText mobile={copy.daysLong[h.days]} desktop={h.days} />
                      </dt>
                      <dd className="font-semibold md:text-ink">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Transport / parking note. Not drawn in mk, shown on mobile too: it is what people
                heading to a clinic need. From 1280px capped at 64ch (≈ 563px at 14px, the same
                width as the Østerbro note's 56ch at 16px; ch grows with the type scale), so a longer
                note stays readable. */}
            {clinic.note ? (
              <p className="text-small leading-[1.6] text-pretty text-muted md:mb-6 xl:mb-fluid-24 xl:max-w-[64ch]">{clinic.note}</p>
            ) : null}

            {/* As in mk: 1fr 1fr (not minmax(0,1fr)), so the longer label gets the wider pill. Both
                pills are 52px high (border-box), per the mobile spec. From 768px "Rutevejledning →" is
                a text link with an invisible ≥ 48px-high hit area (after:) that leaves the underline
                in place, at the pill's size and in the textLink button's colours (ink over a
                deep-bronze underline, accent on hover), as beside a pill on /. */}
            <div className="grid grid-cols-[1fr_1fr] items-start gap-2 md:mt-auto md:flex md:flex-wrap md:items-center md:gap-x-[18px] md:gap-y-3">
              <Link
                href={clinic.bookingHref ?? site.booking.href}
                className={cn(
                  buttonClasses({ variant: "primary", size: "mdTight", mobileSize: "lg" }),
                  "max-[374px]:px-4!",
                )}
              >
                <span className="lg:hidden">
                  {copy.bookShort}
                  <span className="sr-only">{copy.bookShortContext(clinic.fullName)}</span>
                </span>
                <span className="max-lg:hidden">{copy.bookLabel(clinic.name)}</span>
              </Link>
              {clinic.directionsHref ? (
                <a
                  href={clinic.directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[52px] items-center justify-center rounded-full border border-accent px-[26px] text-[15px] max-[374px]:px-4 whitespace-nowrap text-accent transition-colors hover:bg-accent hover:text-on-accent md:inline-block md:h-auto md:rounded-none md:border-0 md:border-b md:border-rule-strong md:relative md:px-0 md:pb-[3px] md:text-ui md:text-ink md:after:absolute md:after:-inset-x-1 md:after:-inset-y-3 md:hover:bg-transparent md:hover:border-accent md:hover:text-accent"
                >
                  {copy.directions}
                  <span aria-hidden="true" className="max-md:hidden">
                    {" →"}
                  </span>
                  <span className="sr-only">{copy.directionsContext(clinic.fullName)}</span>
                </a>
              ) : null}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

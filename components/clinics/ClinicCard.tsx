import Link from "next/link";
import { Photo } from "@/components/ui";
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
      <div className="relative h-[200px] shrink-0 lg:h-[260px] max-md:hidden">
        <Photo
          image={copy.photo}
          // Hidden below 768px: the 1px slot makes phones fetch the tiniest variant.
          sizes="(min-width: 1180px) 554px, (min-width: 768px) calc(50vw - 36px), 1px"
          priority={priorityPhoto}
          className="h-full"
        />
        {soon && clinic.openingNote ? (
          <p className="absolute top-[18px] left-[18px] rounded-full bg-plum px-4 py-[7px] text-[12px] font-semibold tracking-[.12em] text-cream uppercase">
            {clinic.openingNote}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 py-[22px] md:gap-0 md:px-7 md:pt-7 md:pb-8 lg:px-9 lg:pt-8 lg:pb-9">
        <div className="flex items-center justify-between gap-3 md:mb-2.5">
          <h2
            id={titleId}
            className="text-[20px] font-semibold text-plum md:text-[24px] md:tracking-display lg:text-[28px] md:text-ink"
          >
            {clinic.fullName}
          </h2>
          {soon && (comingSoon?.openingNoteShort ?? clinic.openingNote) ? (
            <p className="shrink-0 rounded-full bg-powder px-3 py-[5px] text-[12px] font-semibold text-plum md:hidden">
              {comingSoon?.openingNoteShort ?? clinic.openingNote}
            </p>
          ) : null}
        </div>

        {soon ? (
          <>
            <p className="text-[15px] leading-[1.6] text-muted md:mb-[22px] md:text-[16px] md:leading-[1.75]">
              {comingSoon?.noteShort ? (
                <>
                  <span className="md:hidden">{comingSoon.noteShort}</span>
                  <span className="max-md:hidden">{clinic.note}</span>
                </>
              ) : (
                clinic.note
              )}
            </p>
            {comingSoon?.formName ? (
              <div className="md:mt-auto">
                <NotifyForm formName={comingSoon.formName} copy={notifyCopy} />
              </div>
            ) : null}
          </>
        ) : (
          <>
            <address className="text-[15px] leading-[1.6] text-muted not-italic md:text-[16px] md:leading-[1.75]">
              {clinic.address.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </address>

            <div className="md:mt-[18px] md:mb-[22px]">
              <h3 className="sr-only">{copy.hoursLabel}</h3>
              <dl className="rounded-[14px] bg-sand px-4 py-3 text-[14px] leading-[1.7] md:grid md:grid-cols-[auto_auto] md:gap-x-6 md:gap-y-1 md:rounded-none md:bg-transparent md:p-0 md:leading-normal md:text-muted">
                {clinic.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 md:contents">
                    <dt>
                      <span className="md:hidden">{copy.daysLong[h.days] ?? h.days}</span>
                      <span className="max-md:hidden">{h.days}</span>
                    </dt>
                    <dd className="font-semibold md:text-ink">{h.hours}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Transport / parking note. Not drawn in mk, shown on mobile too: it is what people
                heading to a clinic need. */}
            {clinic.note ? <p className="text-[14px] leading-[1.6] text-pretty text-muted md:mb-6">{clinic.note}</p> : null}

            {/* As in mk: 1fr 1fr (not minmax(0,1fr)), so the longer label gets the wider pill. Both
                pills are 52px high (border-box), per the mobile spec. */}
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
                  className="flex h-[52px] items-center justify-center rounded-full border border-plum px-[26px] text-[15px] max-[374px]:px-4 whitespace-nowrap text-plum transition-colors hover:bg-plum hover:text-cream md:inline-block md:h-auto md:rounded-none md:border-0 md:border-b md:border-ink md:px-0 md:pb-[3px] md:text-[14px] md:text-ink md:hover:bg-transparent md:hover:border-plum md:hover:text-plum"
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

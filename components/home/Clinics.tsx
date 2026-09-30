import Link from "next/link";
import { Container, JoinedLines, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import type { Clinic } from "@/content/types";
import { cn } from "@/lib/cn";
import { ArrowCircle } from "./ArrowCircle";

/**
 * "Hverdage 10–20 · Weekend 10–18". The parts never break inside, and when the second
 * part wraps, its "·" (drawn in the column gap) falls outside the box and is clipped, so
 * no line starts or ends with a dangling separator.
 */
function HoursSummary({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\s+·\s+/);
  if (parts.length < 2) return <p className={className}>{text}</p>;
  return (
    <p className={cn("flex flex-wrap gap-x-[.75em] overflow-hidden", className)}>
      {parts.map((part, i) => (
        <span key={part} className="whitespace-nowrap">
          {i > 0 ? <span className="-ml-[.75em] inline-block w-[.75em] text-center">·</span> : null}
          {part}
        </span>
      ))}
    </p>
  );
}

/**
 * "Her finder du Fillox". Desktop (6a): four white cards. Mobile (mf): stacked cards
 * with a round arrow; the clinic that is not open yet shows its opening note instead.
 */
export function Clinics({
  copy,
  clinics,
  clinicsHref,
}: {
  copy: HomePage["clinics"];
  clinics: Clinic[];
  /** Find klinik page; each open card links to `${clinicsHref}#${slug}`. */
  clinicsHref: string;
}) {
  const card = "flex h-full items-center justify-between gap-3 rounded-[20px] bg-white px-5 py-[18px] lg:block lg:p-7 xl:p-fluid-28";

  return (
    <Container as="section" aria-labelledby="home-clinics-title" className="pt-14 pb-11 lg:py-fluid-84">
      <SectionHeading
        id="home-clinics-title"
        title={copy.title}
        align="left"
        leading="normal"
        className="mb-4 lg:mb-fluid-40 lg:text-center"
      />

      <ul className="flex flex-col gap-2.5 md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-fluid-18">
        {clinics.map((clinic) => {
          const open = clinic.status === "open";
          const body = (
            <div className="text-small leading-[1.55] text-muted lg:leading-[1.6]">
              <h3
                className={cn(
                  "text-[17px] font-semibold text-ink lg:mb-2 lg:py-[.15em] lg:text-h4 lg:leading-[1.2] lg:tracking-display",
                  open && "transition-colors group-hover:text-plum",
                )}
              >
                {clinic.name}
              </h3>
              {open ? (
                <>
                  <p>
                    <JoinedLines parts={clinic.address} separator=", " />
                  </p>
                  {clinic.hoursSummary ? (
                    <HoursSummary
                      text={clinic.hoursSummary}
                      className="lg:mt-2 lg:leading-[normal] lg:text-plum"
                    />
                  ) : null}
                </>
              ) : (
                <p className="font-semibold text-plum lg:mt-1.5 lg:text-micro lg:leading-[normal] lg:font-normal lg:tracking-[2px] lg:uppercase">
                  {clinic.openingNote}
                </p>
              )}
            </div>
          );

          return (
            <li key={clinic.slug}>
              {open ? (
                <Link href={`${clinicsHref}#${clinic.slug}`} className={cn("group", card)}>
                  {body}
                  <ArrowCircle className="bg-sand text-plum group-hover:bg-powder lg:hidden" />
                </Link>
              ) : (
                <div className={card}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

import Link from "next/link";
import { Container, HoursSummary, JoinedLines, SectionHeading, splitHours } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import type { Clinic } from "@/content/types";
import { cn } from "@/lib/cn";
import { ArrowCircle } from "./ArrowCircle";

/**
 * "Her finder du Fillox". Desktop (6a): four white cards. Mobile (mf): stacked cards
 * with a round arrow; the clinic that is not open yet shows its opening note instead.
 *
 * Hover on an open card underlines the name and turns it accent: the heading colour and the
 * accent are both dark browns (1.2:1 apart), and from lg the card has no arrow, so the colour
 * change alone was barely visible. Line height 1.5 on the section: the design's "normal" in
 * Poppins (Figtree's is 1.2).
 *
 * The opening hours (from lg) and the opening note are the accent, as 6a sets them in the plum
 * and as the Find klinik dropdown sets the hours. The accent and the muted address are close
 * (1.4:1 apart), so from lg the hours are medium weight to stand apart from the address above.
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
    <Container as="section" aria-labelledby="home-clinics-title" className="pt-14 pb-11 leading-[1.5] lg:py-fluid-84">
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
                  "font-heading text-[17px] text-heading lg:mb-2 lg:py-[.15em] lg:text-h4 lg:leading-[1.2] lg:tracking-display",
                  open && "decoration-1 underline-offset-4 transition-colors group-hover:text-accent group-hover:underline",
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
                      // "Hverdage 10–19 · Weekend 10–17"
                      parts={splitHours(clinic.hoursSummary)}
                      className="lg:mt-2 lg:leading-[1.5] lg:font-medium lg:text-accent"
                    />
                  ) : null}
                </>
              ) : (
                <p className="font-semibold text-accent lg:mt-1.5 lg:text-micro lg:leading-[1.5] lg:font-normal lg:tracking-[2px] lg:uppercase">
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
                  <ArrowCircle className="bg-sand text-accent group-hover:bg-secondary lg:hidden" />
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

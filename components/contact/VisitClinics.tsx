import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui";
import type { Clinic } from "@/content/types";
import { cn } from "@/lib/cn";

type VisitClinicsProps = {
  title: string;
  clinics: Clinic[];
  /** Base href of the clinics page; each clinic links to `${clinicsHref}#${slug}`. */
  clinicsHref: string;
  titleId: string;
  className?: string;
};

/**
 * "Besøg os" (6ko): one column per clinic with a plum top rule, name and address, or
 * the opening note for a clinic that is not open yet. Not in the mobile design (mc),
 * where the footer lists the clinics instead. Name and address grow gently from 1280px
 * (text-h4 20 → 22, text-small 14 → 15) so the wider columns under the growing H2 don't
 * read as empty rules.
 */
export function VisitClinics({ title, clinics, clinicsHref, titleId, className }: VisitClinicsProps) {
  return (
    <Container as="section" aria-labelledby={titleId} className={cn("pt-fluid-84 pb-fluid-60", className)}>
      <SectionHeading id={titleId} title={title} leading="normal" className="mb-fluid-40" />
      <ul className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {clinics.map((clinic) => (
          <li key={clinic.slug} className="border-t border-plum pt-5">
            <h3 className="mb-2 text-h4 font-semibold tracking-display text-ink">
              <Link href={`${clinicsHref}#${clinic.slug}`} className="transition-colors hover:text-plum">
                {clinic.name}
              </Link>
            </h3>
            {clinic.status === "coming-soon" ? (
              <p className="text-small font-semibold text-plum">{clinic.openingNote}</p>
            ) : (
              <p className="text-small leading-[1.7] text-muted">
                {clinic.address.map((line, i) => (
                  <span key={line} className="block">
                    {line}
                    {i < clinic.address.length - 1 ? <span className="sr-only">, </span> : null}
                  </span>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Container>
  );
}

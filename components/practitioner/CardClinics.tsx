import { cardClinics } from "@/content/team";
import type { TeamRosterMember } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * The clinics line of a team card (home, /om-os, /behandlere): where the member works, from
 * `clinicSlugs` ("Frederiksberg & Amager Centret", "Alle klinikker" for Dr. Tom; content/team.ts →
 * cardClinics), under the title. Screen readers hear it as "Arbejder i Frederiksberg & Amager
 * Centret" (the label is visually hidden: on the card the line reads as a place under the title).
 * Each grid gives it its own type (`className`). Nothing for a member whose clinics are not known.
 * Alberte, 2026-11-26: "Vis også, hvilke afdelinger hver behandler er tilknyttet."
 *
 * `relative` gives the absolutely positioned sr-only label its containing block on the card. In
 * the home page's mobile scroll row (overflow-x: auto, nothing positioned) the labels otherwise
 * sit outside the scroller, are not clipped and widen the whole page (830px at 390px).
 */
export function CardClinics({ member, className }: { member: Pick<TeamRosterMember, "clinicSlugs">; className?: string }) {
  const clinics = cardClinics(member);
  if (!clinics) return null;
  return (
    <p className={cn("relative", className)}>
      <span className="sr-only">{`${clinics.label} `}</span>
      {clinics.value}
    </p>
  );
}

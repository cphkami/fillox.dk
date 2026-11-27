import { HoursSummary, splitHours } from "@/components/ui";

/**
 * A practitioner's title with more than one part, "Kosmetisk sygeplejerske · Klinikansvarlig"
 * (content/team.ts → nurseWith) or "Æstetisk læge · Grundlægger & daglig leder": the parts (split
 * on " · ") never break inside, and when a part wraps to the next line its "·" is clipped (the
 * opening hours' HoursSummary does the same), so a narrow column (the mobile profile eyebrow, a
 * card at 320px) shows "Kosmetisk sygeplejerske" / "Klinikansvarlig" with no line ending in a
 * dangling "·". A one-part title renders as plain text.
 */
export function TitleParts({ text }: { text: string }) {
  return <HoursSummary as="span" parts={splitHours(text)} />;
}

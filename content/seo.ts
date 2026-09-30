/**
 * Market data for the structured data (JSON-LD) in components/seo. The organisation's
 * name, contact details and clinics come from config/site.ts and content/clinics.ts;
 * this file only holds what the component cannot derive from them.
 */

/** schema.org day names. */
export type SchemaDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export const seoContent = {
  /**
   * The schema.org days behind each `days` label used in content/clinics.ts opening hours
   * (e.g. "Man–fre"). A label missing here is left out of the structured opening hours.
   */
  openingDays: {
    "Man–fre": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "Lør–søn": ["Saturday", "Sunday"],
  } as Record<string, SchemaDay[]>,

  /** Photo used for every clinic in the structured data (same placeholder as the /klinikker cards). */
  // TODO: replace with a photo of each clinic once they exist.
  clinicImage: "/images/results/behandling-3.jpg",
};

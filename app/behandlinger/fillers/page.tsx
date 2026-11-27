import type { Metadata } from "next";
import { BookingBand } from "@/components/treatment/BookingBand";
import { LongformSections } from "@/components/treatment/LongformSections";
import { TreatmentCardsSection } from "@/components/treatment/TreatmentCardsSection";
import { TreatmentCollectionJsonLd } from "@/components/treatment/TreatmentCollectionJsonLd";
import { TreatmentHero, type TreatmentHeroView } from "@/components/treatment/TreatmentHero";
import { fillersPage as copy } from "@/content/pages/fillers";
import { treatmentHref } from "@/content/treatments";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(copy.meta, copy.path, copy.shareImage);

/** The treatment page's hero, filled from the page's copy (no facts: a category, not a treatment). */
const hero: TreatmentHeroView = {
  title: copy.name,
  heading: copy.hero.title,
  headingAccent: copy.hero.titleAccent,
  longform: false,
  overviewLink: copy.overviewLink,
  hero: {
    lead: copy.hero.lead,
    image: copy.hero.image,
    facts: [],
    primaryCta: copy.hero.primaryCta,
    secondaryCta: copy.hero.secondaryCta,
  },
};

/**
 * /behandlinger/fillers — "Filler hos Fillox", the fillers category's own page (Alberte,
 * 2026-11-26; no design). A static route: it wins over /behandlinger/[slug], whose
 * generateStaticParams never yields "fillers" (check:market rule 12).
 *
 * Order: the treatment page's hero (sand panel, breadcrumb Behandlinger → Fillers, H1 with its
 * second line, lead, "Book en konsultation") → "Hvad er filler?" (a long-form plain section) →
 * "Behandlingsområder" (nine /behandlinger cards with "fra" price and "Læs mere") → the closing rose
 * band ("Book en konsultation"). Copy: content/pages/fillers.ts.
 */
export default function FillersPage() {
  return (
    <>
      <TreatmentCollectionJsonLd
        path={copy.path}
        name={copy.meta.title}
        description={copy.meta.description}
        breadcrumb={copy.breadcrumb}
        items={copy.areas.cards.map(({ treatment }) => ({
          label: treatment.detail?.title ?? treatment.name,
          href: treatmentHref(treatment.slug),
        }))}
      />
      <TreatmentHero view={hero} />
      <LongformSections sections={copy.sections} />
      <TreatmentCardsSection
        id={copy.areas.id}
        title={copy.areas.title}
        link={copy.areas.pricesLink}
        cards={copy.areas.cards}
      />
      <BookingBand id={copy.cta.id} title={copy.cta.title} text={copy.cta.text} cta={copy.cta.cta} />
    </>
  );
}

import type { Metadata } from "next";
import { ClosingBand } from "@/components/new-here/ClosingBand";
import { ConsultationSteps } from "@/components/new-here/ConsultationSteps";
import { DifferencesSection } from "@/components/new-here/DifferencesSection";
import { FirstVisitSection } from "@/components/new-here/FirstVisitSection";
import { NeedsSection } from "@/components/new-here/NeedsSection";
import { NewHereFaq } from "@/components/new-here/NewHereFaq";
import { NewHereHero } from "@/components/new-here/NewHereHero";
import { NewHereJsonLd } from "@/components/new-here/NewHereJsonLd";
import { needViews } from "@/components/new-here/view";
import { MobileBookBar } from "@/components/treatment/MobileBookBar";
import { newHerePage as copy } from "@/content/pages/new-here";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(copy.meta, copy.path, copy.hero.image);

/**
 * /ny-hos-fillox — "Ny hos Fillox?", the guide for first-time visitors (the content agency's
 * page, content/pages/new-here.ts; no design). Order as in the draft: hero → "Hvad ønsker du
 * hjælp til?" (six need cards + "Jeg ved ikke helt …") → the differences between the treatments
 * → what to book the first time → what happens at a consultation → FAQ → "Begynd med en
 * samtale". Surfaces alternate: sand hero panel, cream, sand panel, cream, sand panel, cream,
 * rose closing band.
 *
 * Below 768px the treatment pages' book bar ("Book tid") follows the page until the closing band.
 */
export default function NewHerePage() {
  const needs = needViews(copy);
  return (
    <>
      <NewHereJsonLd copy={copy} />
      <NewHereHero hero={copy.hero} titleId="new-here-title" />
      <NeedsSection copy={copy.needs} needs={needs} />
      <DifferencesSection copy={copy.differences} />
      <FirstVisitSection copy={copy.firstVisit} />
      <ConsultationSteps copy={copy.consultation} />
      <NewHereFaq copy={copy.faq} />
      <ClosingBand copy={copy.closing} />
      <MobileBookBar name={copy.bookBar.name} cta={copy.bookBar.cta} hideAtId={copy.closing.id} />
    </>
  );
}

import type { Metadata } from "next";
import { MenCare } from "@/components/men/MenCare";
import { MenCta } from "@/components/men/MenCta";
import { MenFaq } from "@/components/men/MenFaq";
import { MenHero } from "@/components/men/MenHero";
import { MenJsonLd } from "@/components/men/MenJsonLd";
import { MenProcess } from "@/components/men/MenProcess";
import { MenTreatments } from "@/components/men/MenTreatments";
import { menCarePeople, menPriceRows, menTreatmentRows } from "@/components/men/menView";
import { menPage as copy } from "@/content/pages/men";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(copy.meta, copy.path, copy.shareImage);

/**
 * /behandlinger/for-maend — treatments for men (no design; the owner asked for a calmer, cleaner,
 * more masculine page with fewer treatments). A static route: it wins over
 * /behandlinger/[slug], whose generateStaticParams never yields "for-maend".
 *
 * Darker neutrals only: espresso hero and closing band (krem text, bronze accents, krem
 * buttons), cream sections on straight hairlines, one sand panel. No rose bands, no reviews
 * (Botox for mænd is on the list; see content/pages/men.ts).
 *
 * Order: hero → the four treatments (with their prices; the men's laser packages fold out under
 * them) → how it works → "Dine behandlere" (care: three practitioners and their own quotes) →
 * FAQ → booking band. Nothing about choosing a male practitioner (owner, round 4: men are glad
 * that e.g. Alberte takes good care of them; see content/pages/men.ts).
 */
export default function MenPage() {
  const rows = menTreatmentRows(copy.treatments.items);
  return (
    <>
      <MenJsonLd copy={copy} rows={rows} />
      <MenHero copy={copy} />
      <MenTreatments
        copy={copy.treatments}
        rows={rows}
        packageRows={menPriceRows(copy.treatments.laserPackages.rows)}
      />
      <MenProcess copy={copy.process} />
      <MenCare copy={copy.care} people={menCarePeople(copy.care.people)} />
      <MenFaq copy={copy.faq} />
      <MenCta copy={copy.cta} />
    </>
  );
}

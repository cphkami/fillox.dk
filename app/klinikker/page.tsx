import type { Metadata } from "next";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { ClinicMap } from "@/components/clinics/ClinicMap";
import { UspStrip } from "@/components/clinics/UspStrip";
import { containerClasses, Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { clinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { clinicsPage } from "@/content/pages/clinics";
import { cn } from "@/lib/cn";

const PATH = "/klinikker";
const { hero, map, meta } = clinicsPage;
const { ogImage, titleTemplate } = layoutCopy.meta;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: PATH },
  // Nested objects replace the root layout's, so repeat the shared Open Graph fields.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    url: PATH,
    title: titleTemplate.replace("%s", meta.title),
    description: meta.description,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
};

/** /klinikker — "Find klinik" (design 6kl desktop, mk mobile). */
export default function ClinicsPage() {
  return (
    <>
      <section aria-labelledby="klinikker-title" className={cn(containerClasses("none"), "md:px-surface")}>
        <div className="flex flex-col gap-4 px-5 py-6 md:block md:rounded-[24px] md:bg-sand md:px-14 md:py-20 md:text-center xl:py-fluid-80">
          <Eyebrow className="mb-[18px] max-md:hidden">{hero.eyebrow}</Eyebrow>
          <h1
            id="klinikker-title"
            className="text-[36px] leading-[1.08] font-semibold tracking-display md:mb-5 md:text-[52px] md:leading-[1.02] lg:text-h1"
          >
            {hero.title}
          </h1>
          <p className="text-[16px] leading-[1.7] text-muted md:mx-auto md:max-w-[52ch] md:text-[18px] md:leading-[1.75] xl:text-lead">
            <span className="md:hidden">{hero.introShort}</span>
            <span className="max-md:hidden">{hero.intro}</span>
          </p>
          <ClinicMap label={map.label} image={map.image} pins={map.pins} clinics={clinics} className="md:hidden" />
        </div>
      </section>

      <section aria-label={clinicsPage.listLabel} className={cn(containerClasses("surface"), "md:pt-surface")}>
        {/* Cards in a row stretch to the same height (buttons at the bottom, as in 6kl). While the
            "Få besked" form is open, its row partner keeps its own height instead, so no blank gap
            opens above that card's buttons. */}
        <ul
          className={cn(
            "flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-surface",
            "md:[&>li:nth-child(odd):has(+li_[data-notify-open])]:self-start",
            "md:[&>li:nth-child(odd):has([data-notify-open])+li]:self-start",
          )}
        >
          {clinics.map((clinic, i) => (
            <li key={clinic.slug}>
              <ClinicCard
                clinic={clinic}
                copy={clinicsPage.card}
                notifyCopy={clinicsPage.notify}
                comingSoon={clinicsPage.comingSoon[clinic.slug]}
                priorityPhoto={i < 2}
              />
            </li>
          ))}
        </ul>
      </section>

      <UspStrip items={clinicsPage.usps} label={clinicsPage.uspsLabel} className="pt-surface max-md:hidden" />
    </>
  );
}

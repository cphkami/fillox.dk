import type { Metadata } from "next";
import { Bestsellers } from "@/components/home/Bestsellers";
import { Clinics } from "@/components/home/Clinics";
import { Hero } from "@/components/home/Hero";
import { Results } from "@/components/home/Results";
import { Team } from "@/components/home/Team";
import { Testimonial } from "@/components/home/Testimonial";
import { UspBand } from "@/components/home/UspBand";
import { site } from "@/config/site";
import { clinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { mainNav } from "@/content/navigation";
import { homePage } from "@/content/pages/home";
import { team } from "@/content/team";
import { bestsellers } from "@/content/treatments";

const { meta } = homePage;

export const metadata: Metadata = {
  title: { absolute: meta.title },
  description: meta.description,
  alternates: { canonical: "/" },
  // openGraph replaces the layout's object as a whole, so the shared fields are repeated.
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    title: meta.title,
    description: meta.description,
    images: [
      {
        url: layoutCopy.meta.ogImage.src,
        width: layoutCopy.meta.ogImage.width,
        height: layoutCopy.meta.ogImage.height,
        alt: layoutCopy.meta.ogImage.alt,
      },
    ],
  },
};

/** Front page (design 6a desktop / mf mobile). The layout provides <main>, header and footer. */
export default function HomePage() {
  const clinicsHref = mainNav.find((item) => item.kind === "clinics")?.href ?? "/klinikker";

  return (
    <>
      <Hero hero={homePage.hero} />
      <UspBand usps={homePage.usps} />
      <Bestsellers copy={homePage.bestsellers} items={bestsellers} />
      <Results copy={homePage.results} />
      <Team copy={homePage.team} members={team} />
      <Testimonial testimonial={homePage.testimonial} />
      <Clinics copy={homePage.clinics} clinics={clinics} clinicsHref={clinicsHref} />
    </>
  );
}

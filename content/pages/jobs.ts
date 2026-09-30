import type { TextPageContent } from "../types";
import { site } from "@/config/site";
import { routes } from "../routes";

/**
 * Copy for /ledige-stillinger (no design; rendered by components/text-page).
 * The live fillox.dk has no jobs page (404 on 2026-09-30), so this is a short,
 * honest placeholder that points to an unsolicited application by e-mail.
 */

// TODO: copy review (whole page: not on the live site and not in the design)
const applicationMail = `${site.contact.emailHref}?subject=${encodeURIComponent("Uopfordret ansøgning")}`;

export const jobsPage: TextPageContent = {
  meta: {
    title: "Ledige stillinger",
    description:
      "Ingen ledige stillinger lige nu, men vi hører altid gerne fra læger og sygeplejersker, der brænder for æstetisk medicin. Send en uopfordret ansøgning.",
  },
  hero: {
    eyebrow: "Karriere",
    title: "Ledige stillinger",
    intro:
      "Vi har ingen opslag lige nu – men vi hører altid gerne fra læger og sygeplejersker, der brænder for æstetisk medicin.",
    image: {
      // TODO: asset (owner): replace with a larger original of this photo, at least 1800px wide
      // (ideally 2400px), as on /om-os (content/pages/about.ts). This file is 800×533; from
      // 1280px the hero photo covers a ≈ 864×576 half band, so it is upscaled ≈ 1.1× (≈ 2.2× on
      // retina) and the letters look soft.
      src: "/images/results/behandling-3.jpg",
      alt: "Fillox-logoet i spejlblanke bogstaver på væggen i klinikken",
      position: "50% 50%",
    },
  },
  body: [
    { type: "h2", text: "Ingen opslag lige nu" },
    {
      type: "paragraph",
      text: "Vi har ingen ledige stillinger slået op i øjeblikket. Når vi søger nye kolleger, finder du opslagene her på siden.",
    },
    { type: "h2", text: "Send en uopfordret ansøgning" },
    {
      type: "paragraph",
      text: [
        "Send dit CV og et par ord om dig selv til ",
        { text: site.contact.email, href: applicationMail },
        ". Fortæl gerne om din uddannelse og erfaring, og hvilken af vores klinikker du helst vil arbejde i.",
      ],
    },
  ],
  aside: {
    eyebrow: "Uopfordret ansøgning",
    title: "Skriv til os",
    text: "Send dit CV og et par ord om dig selv – så vender vi tilbage.",
    actions: [
      { label: "Send ansøgning", href: applicationMail },
      { label: "Mød teamet", href: routes.aboutTeam },
    ],
  },
};

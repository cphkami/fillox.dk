import type { TextPageContent } from "../types";
import { site } from "@/config/site";
import { routes } from "../routes";
import { photos } from "../photos";

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
    // The clinic's group photo (content/photos.ts, 1206 × 1468, unnamed): the colleagues an
    // applicant would join. Sharp at 1x in the ≈ 768px half band. Not the Academy training photos:
    // both show the "croma" filler brand on the safety glasses, next to the face.
    // TODO: copy review (image choice + alt text)
    image: photos.team,
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

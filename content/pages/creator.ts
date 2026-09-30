import type { TextPageContent } from "../types";
import { site } from "@/config/site";

/**
 * Copy for /content-creator (no design; rendered by components/text-page).
 * The live fillox.dk has no content creator page (404 on 2026-09-30), so this is a
 * short, honest page that invites creators to get in touch by e-mail.
 */

// TODO: copy review (whole page: not on the live site and not in the design).
// Compliance: the page deliberately says nothing about treatments in collaborations or
// about which marketing rules apply. Botox is a prescription medicine (no advertising to
// the public), and cosmetic treatment marketing has its own Danish rules, so any such
// wording must come from the client, approved, before it is added here.
const creatorMail = `${site.contact.emailHref}?subject=${encodeURIComponent("Samarbejde som content creator")}`;

export const creatorPage: TextPageContent = {
  meta: {
    title: "Content creator",
    description:
      "Laver du indhold om skønhed, hudpleje eller livsstil? Fortæl os om dig og din kanal, så tager vi en snak om et samarbejde med Fillox.",
  },
  hero: {
    eyebrow: "Samarbejde",
    title: "Content creator",
    intro:
      "Laver du indhold om skønhed, hudpleje eller livsstil? Vi hører gerne fra content creators, der har lyst til at samarbejde med Fillox.",
    image: {
      src: "/images/results/duo-pink.jpg",
      alt: "To smilende kvinder foran en rosa baggrund",
      position: "58% 40%",
    },
  },
  body: [
    { type: "h2", text: "Sådan kommer du i kontakt med os" },
    {
      type: "paragraph",
      text: [
        "Skriv til ",
        { text: site.contact.email, href: creatorMail },
        " og fortæl kort om dig selv og din kanal. Vi vender tilbage, hvis vi ser et godt match.",
      ],
    },
    { type: "h2", text: "Skriv gerne" },
    {
      type: "list",
      items: [
        "Et link til din profil, fx på Instagram, TikTok eller YouTube",
        "Hvor mange følgere du har, og hvem de er",
        "Hvilken slags indhold du forestiller dig at lave sammen med os",
      ],
    },
  ],
  aside: {
    title: "Klar til et samarbejde?",
    text: "Send os et link til din profil og et par ord om, hvad du kunne tænke dig at lave.",
    actions: [
      { label: "Skriv til os", href: creatorMail },
      { label: "Se os på Instagram", href: site.social.instagram },
    ],
  },
};

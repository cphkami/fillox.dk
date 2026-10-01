import type { TextPageContent } from "../types";
import { site } from "@/config/site";

/**
 * Copy for /content-creator (no design; rendered by components/text-page).
 * The live fillox.dk has no content creator page (404 on 2026-09-30). The contact routes come
 * from the owner (2026-10-01): creators send a DM on Instagram (no requirements, follower
 * counts or profile links to send: the profile says it all), and other collaborations go to
 * Annika by e-mail.
 */

// TODO: copy review (hero intro and meta description: our wording, not on the live site).
// Compliance: the page deliberately says nothing about treatments in collaborations or
// about which marketing rules apply. Botox is a prescription medicine (no advertising to
// the public), and cosmetic treatment marketing has its own Danish rules, so any such
// wording must come from the client, approved, before it is added here.

/** Instagram handle shown on the page, from the profile URL in config/site.ts ("@fillox_dk"). */
const instagramHandle = `@${new URL(site.social.instagram).pathname.replaceAll("/", "")}`;

/** Other collaborations (brands, events …): Annika, by e-mail (owner, 2026-10-01). */
const collaborationContact = { name: "Annika", email: "annika@fillox.dk" };
const collaborationMail = `mailto:${collaborationContact.email}?subject=${encodeURIComponent("Samarbejde med Fillox")}`;

export const creatorPage: TextPageContent = {
  meta: {
    title: "Content creator",
    description: `Laver du indhold om skønhed, hudpleje eller livsstil? Send os en DM på Instagram, ${instagramHandle}, og fortæl, hvad du kunne tænke dig at lave med Fillox.`,
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
    { type: "h2", text: "Send os en DM" },
    {
      type: "paragraph",
      text: [
        "Det nemmeste er at skrive til os på Instagram, ",
        { text: instagramHandle, href: site.social.instagram },
        ". Fortæl kort, hvem du er, og hvad du kunne tænke dig at lave sammen med os – så tager vi den derfra.",
      ],
    },
    { type: "h2", text: "Andet samarbejde?" },
    {
      type: "paragraph",
      text: [
        `Har du en anden idé til et samarbejde, så skriv til ${collaborationContact.name} på `,
        { text: collaborationContact.email, href: collaborationMail },
        ".",
      ],
    },
  ],
  aside: {
    eyebrow: "Instagram",
    title: instagramHandle,
    text: "Skriv et par ord om dig selv og din idé – din profil siger resten.",
    // "Skriv til os på Instagram" is too long for the 280px side card at 1024–1710px (the
    // buttons do not wrap), so the button names the destination and the body says the rest.
    actions: [{ label: "Skriv på Instagram", href: site.social.instagram }],
  },
};

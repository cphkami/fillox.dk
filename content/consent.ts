/**
 * Cookie consent: the banner (components/consent), the footer's "Cookieindstillinger" button and
 * the "Cookies" section of the privacy policy (content/pages/legal.ts → privacyPage).
 *
 * TODO: copy review (owner/jurist). All of this file is NEW copy (owner 2026-11-25: "cookiebanner
 * ja"), not from the live site or the design. The cookie list follows the tracking inventory of
 * 2026-11-25 (GTM-KDBJMVF2: GA4, Google Ads Conversion Linker, Meta Pixel); lifetimes from Google's
 * cookie list (business.safety.google/adscookies) and Meta's fbevents.js (90 days). Update it, and
 * `consentVersion` in config/site.ts, whenever the container gets another tag or vendor.
 */
import { routes } from "./routes";
import type { RichText, TextBlock } from "./types";

/** Id of the privacy policy's cookie section (linked from the banner). */
export const privacyCookiesAnchor = "cookies";

export type ConsentCategoryCopy = {
  name: string;
  /** What the category is for (banner settings view). */
  purpose: string;
};

// TODO: copy review (owner/jurist)
export const consentCopy = {
  /** Visible heading of the banner; also the accessible name of its region landmark. */
  title: "Cookies på fillox.dk",
  /** First layer. Consent is optional, and where to change it later, are said up front. */
  text: "Vi vil gerne bruge cookies til statistik og til at måle og målrette vores annoncer hos Google og Meta (Facebook og Instagram). Det sker kun, hvis du siger ja, og du kan altid ændre dit valg under “Cookieindstillinger” nederst på siden.",
  privacyLink: { label: "Læs mere om cookies", href: `${routes.privacy}#${privacyCookiesAnchor}` },

  /** "Accepter alle" and "Afvis alle" are shown with the same size, style and place (Datatilsynet). */
  acceptAll: "Accepter alle",
  rejectAll: "Afvis alle",
  customize: "Tilpas",

  /** Second layer ("Tilpas"): one switch per optional category, none switched on in advance. */
  settings: {
    legend: "Vælg, hvilke cookies vi må bruge",
    save: "Gem valg",
    /** Shown instead of a switch on the necessary category. */
    alwaysOn: "Altid aktiv",
  },

  /** Close button, only when the banner is reopened from the footer (a choice is already stored). */
  close: "Luk",

  categories: {
    necessary: {
      name: "Nødvendige",
      purpose: "Får sitet og online booking til at virke og husker dit cookievalg. De kan ikke slås fra.",
    },
    statistics: {
      name: "Statistik",
      purpose:
        "Viser os, hvordan sitet bliver brugt, fx hvilke sider der bliver besøgt, så vi kan gøre det bedre. Vi bruger Google Analytics.",
    },
    marketing: {
      name: "Marketing",
      purpose:
        "Måler, hvilke annoncer der fører til en booking, og gør det muligt at vise dig vores annoncer hos Google og Meta (Facebook og Instagram).",
    },
  } satisfies Record<"necessary" | "statistics" | "marketing", ConsentCategoryCopy>,

  /** Footer button that reopens the banner (components/layout/Footer.tsx). */
  footerButton: "Cookieindstillinger",
};

/* ------------------------------------------------------------------------------------------
 * The cookie list (privacy policy → "13. Cookies")
 * ---------------------------------------------------------------------------------------- */

type CookieEntry = {
  /** Cookie (or storage) name(s), as the browser shows them. */
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

// TODO: copy review (owner/jurist). Names and lifetimes: tracking inventory 2026-11-25.
const cookieList: { title: string; intro: string; cookies: CookieEntry[] }[] = [
  {
    title: consentCopy.categories.necessary.name,
    intro: consentCopy.categories.necessary.purpose,
    cookies: [
      {
        name: "fillox-consent",
        provider: "Fillox",
        purpose:
          "husker dit cookievalg, så vi ikke spørger på hver side. Det gemmes i din browsers lokale lager (localStorage), ikke som en cookie",
        duration: "12 måneder",
      },
      {
        name: "PHPSESSID",
        provider: "Gecko Booking, i kalenderen til online booking",
        purpose: "holder styr på din booking, mens du booker",
        duration: "til du lukker browseren",
      },
    ],
  },
  {
    title: consentCopy.categories.statistics.name,
    intro: consentCopy.categories.statistics.purpose,
    cookies: [
      {
        name: "_ga, _ga_<id>",
        provider: "Google Analytics",
        purpose: "skelner mellem besøgende, så vi kan tælle besøg og se, hvordan sitet bliver brugt",
        duration: "2 år",
      },
    ],
  },
  {
    title: consentCopy.categories.marketing.name,
    intro: consentCopy.categories.marketing.purpose,
    cookies: [
      {
        name: "_gcl_au, _gcl_aw, _gcl_dc, _gcl_gb, _gcl_gs, _gcl_ag",
        provider: "Google Ads",
        purpose: "kobler et klik på en af vores annoncer hos Google sammen med en booking på sitet",
        duration: "90 dage",
      },
      {
        name: "_fbp, _fbc",
        provider: "Meta Pixel",
        purpose:
          "genkender din browser og et klik fra en af vores annoncer på Facebook og Instagram, så vi kan måle og målrette annoncerne",
        duration: "90 dage",
      },
    ],
  },
];

function cookieItem(cookie: CookieEntry): RichText {
  return [
    { text: cookie.name, strong: true },
    ` (${cookie.provider}): ${cookie.purpose}. Varighed: ${cookie.duration}.`,
  ];
}

/**
 * The privacy policy's cookie section, appended after "12. Nyhedsbrev" (content/pages/legal.ts).
 * TODO: copy review (owner/jurist): new section, not from the live site. Open points for the jurist:
 * - the transfer basis for Google and Meta (USA), e.g. the EU–US Data Privacy Framework, and
 *   whether they act as processors or as independent controllers for these data;
 * - the Gecko booking calendar loads Google Tag Manager (GTM-K388CKJQ, GTM-5JMDCX4G) inside its
 *   iframe regardless of the choice here: say so, or have Gecko change it (README → "Før lancering").
 */
export const privacyCookieBlocks: TextBlock[] = [
  { type: "h2", id: privacyCookiesAnchor, text: "13. Cookies" },
  {
    type: "paragraph",
    text: "Når du besøger fillox.dk første gang, spørger vi, om vi må bruge cookies til statistik og marketing. Vi sætter kun de cookies – og indlæser først Google Tag Manager, Google Analytics, Google Ads og Meta Pixel – hvis du siger ja. Du kan sige ja til alle, nej til alle eller vælge de enkelte kategorier under “Tilpas”.",
  },
  {
    type: "paragraph",
    text: "Dit valg gemmes i din browser i 12 måneder. Derefter spørger vi igen, og det gør vi også, hvis vi ændrer, hvilke cookies vi bruger.",
  },
  ...cookieList.flatMap((group): TextBlock[] => [
    { type: "h3", text: group.title },
    { type: "paragraph", text: group.intro },
    { type: "list", items: group.cookies.map(cookieItem) },
  ]),
  {
    type: "paragraph",
    text: [
      "Google og Meta kan desuden sætte deres egne cookies på deres egne domæner, fx IDE på doubleclick.net (13 måneder), især hvis du er logget ind hos dem. Dem styrer de selv: læs ",
      { text: "Googles", href: "https://policies.google.com/technologies/cookies" },
      " og ",
      { text: "Metas cookiepolitik", href: "https://www.facebook.com/privacy/policies/cookies/" },
      ". Oplysningerne fra statistik- og marketingcookies sendes til Google og Meta og kan blive overført til USA.",
    ],
  },
  { type: "h3", text: "Sådan ændrer du dit valg" },
  {
    type: "paragraph",
    text: "Du kan til enhver tid ændre dit valg eller trække dit samtykke tilbage under “Cookieindstillinger” nederst på hver side. Trækker du samtykket tilbage, sletter vi statistik- og marketingcookies fra listen ovenfor, der ligger på fillox.dk, og siden indlæses igen. Du kan også slette cookies i din browsers indstillinger.",
  },
  {
    type: "paragraph",
    text: "Retsgrundlaget er dit samtykke (cookiebekendtgørelsen og GDPR artikel 6, stk. 1, litra a). At du trækker samtykket tilbage, påvirker ikke lovligheden af den behandling, der er sket, før du gjorde det.",
  },
];

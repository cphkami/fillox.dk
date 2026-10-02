import type { Link, TextBlock, TextPageContent } from "../types";
import { site } from "@/config/site";
import { privacyNewsletterAnchor, routes } from "../routes";

/**
 * Copy for /handelsbetingelser and /privatlivspolitik (no design; rendered by
 * components/text-page in the site's visual language).
 *
 * The legal texts are VERBATIM from the live fillox.dk pages (fetched 2026-09-30),
 * including their wording, punctuation and typos. Only the WordPress markup is gone:
 * hard line wraps inside sentences are joined with a space, section titles became h2s,
 * run-in labels inside a section ("Kvittering", "Automatisk trækning") stay bold run-in
 * text, and "• …" / "– …" lines became lists. Do not edit the wording without the
 * client's approval.
 */

/** Company block at the end of both live legal pages. */
const companyLines: TextBlock = {
  type: "lines",
  card: true,
  // Company name and CVR number from config/site.ts (same text as the live page).
  // TODO: Fillox to confirm the registered address (the City2 clinic is at Cityringen 2, content/clinics.ts).
  lines: [
    [{ text: site.legalName, strong: true }],
    `CVR-nr: ${site.company.registrationNumber}`,
    "Cityringen 20 242, 2630 Taastrup",
  ],
};

/** CTA card beside the legal text (verbatim from the live pages' "Book din konsultation" box). */
const legalAside: TextPageContent["aside"] = {
  title: "Book din konsultation",
  text: "Hos Fillox vil du altid møde meget dedikerede og dygtige behandlere.",
  actions: [
    { label: "Online booking", href: site.booking.href },
    { label: "Kontakt os", href: routes.contact },
  ] satisfies Link[],
};

// TODO: copy review ("Juridisk" eyebrow is not on the live pages)
const legalEyebrow = "Juridisk";

export const termsPage: TextPageContent = {
  meta: {
    title: "Handelsbetingelser",
    // TODO: copy review (the live page has no meta description)
    description:
      "Handelsbetingelser for Fillox: betalingskort, afbudsregler, betaling, fortrydelsesret og refundering, gavekort og abonnementer samt opsigelse.",
  },
  hero: {
    eyebrow: legalEyebrow,
    title: "Handelsbetingelser",
    intro: "Nedenfor findes til enhver tid gældende handelsbetingelser",
  },
  body: [
    { type: "h2", text: "Betalingstyper" },
    { type: "paragraph", text: "Vi modtager følgende betalingskort: Dankort /Visa Dankort og MasterCard." },

    { type: "h2", text: "Afbudsregler" },
    {
      type: "paragraph",
      text: "Afbud under 24 timer til en behandlingen, koster 500 DKK. Afbud senere end 6 timer før eller ved udeblivelse, medfører en opkrævning på 100% af bookingen.",
    },
    { type: "paragraph", text: "Afbud under 24 timer til en konsultation, koster 250 DKK." },

    { type: "h2", text: "Ferie/Lukket" },
    {
      type: "paragraph",
      text: "Der ydes ikke kompensation ved lukkedage eller ferielukket, andet end at behandlingsdatoen rykkes.",
    },

    { type: "h2", text: "Betaling" },
    {
      type: "paragraph",
      text: "Betalingen trækkes straks efter købet – dette kan gælde både for bookinger og køb af Gavekort og abonnement. Se afsnit fortrydelsesret / Refundering.",
    },

    { type: "h2", text: "Fortrydelsesret / Refundering" },
    {
      type: "paragraph",
      text: "Der er ikke fortrydelsesret på køb af Gavekort, abonnement, dog kan man inden for 14 dage fortryde købet. Dvs. at, eventuelle resterende klip på udløbne klippekort eller ved ophør i klinikken, ikke refunderes og kan ikke overdrages til andre.",
    },
    {
      type: "paragraph",
      text: "Evt. refundering ved fejlbehandling o.lign. kan kun ske ved fysisk fremmøde i klinikken hvor købet af foretaget.",
    },

    { type: "h2", text: "Gavekort og abonnement." },
    {
      type: "paragraph",
      text: "Gyldighed for Gavekort er 6 måneder fra købsdatoen og abonnement: max. 12 måneder fra købsdatoen. Måske kan der forekomme kortere gyldighedsperioder ved fx kampagner og tilbud eller ved brug af Gavekort/ abonnement på én gang. Gavekort/ abonnement er personligst og kan ikke deles med andre eller overdrages til andre. Det er kundens eget ansvar at få brugt sin Gavekort/ abonnement, inden udløbsdatoen. Gavekort/ abonnement kan købes online eller fysisk i Klinikkerne. Gavekort/ abonnement kan knyttes til din bookingprofil straks efter købet. Herefter foretager du din booking og systemet vil automatisk trække klippet fra kortet.",
    },

    // The live page repeats this title for a second section.
    { type: "h2", text: "Gavekort og abonnement." },
    {
      type: "paragraph",
      text: "Købet kan fortrydes indtil 14 efter købet ved henvendelse til FILLOX medmindre gavekortet er taget i brug. Gavekortet er gyldigt i 6 måneder fra købsdatoen og abonnement er gyldigt i 12 måneder fra købsdatoen, såfremt andet ikke fremgår på selve gavekortet eller abonnementet. Er disse købt online, kan disse printes lige efter gennemført betaling og fremsendes ligeledes på e-mail. Der modtages også en bekræftelse på købet på mail.",
    },

    { type: "h2", text: "Automatisk trækning på Abonnementer" },
    {
      type: "paragraph",
      text: "Prisen for abonnementet fremgår ved købet af de enkelte abonnementer. Alle abonnementer er personlige og kan ikke overdrages eller deles med andre.",
    },

    { type: "h2", text: "Gyldighed" },
    {
      type: "paragraph",
      text: "Gavekortes gyldighed er 6 måneder fra købsdatoen. Abonnement er gyldigt: 12 måneder fra enten købsdato. Kortet kan bruges til de hold som er beskrevet i de enkelte vilkår og betingelser for hvert af de mulige abonnementer.",
    },
    // "Kvittering" and "Automatisk trækning" are run-in labels inside the text on the live page
    // (not section titles), so they stay bold run-ins instead of headings.
    { type: "paragraph", text: [{ text: "Kvittering", strong: true }, " Der fremsendes kvittering på e-mail ved:"] },
    {
      type: "list",
      items: [
        "Indgåelse af aftale",
        "Ved automatisk trækning",
        "Ved fejlet trækning",
        "Ved ændring af betalingskort",
        "Ved opsigelse af abonnementet",
      ],
    },

    { type: "h2", text: "Ændring af betalingskort" },
    {
      type: "paragraph",
      text: "Det altid er kundens ansvar, at det korrekte og gyldige betalingskort er angivet i systemet. Man skifter betalingskort ved at logge ind på booking systemet trykke på ”Klik her for at se dine Abonnementer” Bemærk – en opsigelse af betalingskortet er ikke en opsigelse af det løbende abonnement.",
    },
    {
      type: "paragraph",
      text: [
        { text: "Automatisk trækning", strong: true },
        " Første betaling trækkes i forbindelse med indgåelsen af aftalen – herefter trækkes prisen for abonnementet automatisk hver måned, indtil udløb.",
      ],
    },

    { type: "h2", text: "Bero & Opsigelse" },
    {
      type: "paragraph",
      text: "Systemet har ikke en bero funktion. Ønsker man at holde pause med abonnementet, skal aftalen blot opsiges via booking systemet. Man kan efterfølgende, vælge at købe et nyt abonnement med det samme og sætte den ønskede startdato under købet.",
    },
    {
      type: "paragraph",
      text: "Generel opsigelse foregår også via bookingsystemet eller ved henvendelse til Fillox. Bemærk – en opsigelse af betalingskortet er ikke en opsigelse af det løbende abonnement.",
    },

    companyLines,
  ],
  aside: legalAside,
};

export const privacyPage: TextPageContent = {
  meta: {
    title: "Privatlivspolitik",
    // TODO: copy review (the live page has no meta description)
    description:
      "Sådan behandler Fillox Danmark ApS dine personoplysninger: formål, retsgrundlag, journalføring i Gecko Booking, opbevaring og dine rettigheder.",
  },
  hero: {
    eyebrow: legalEyebrow,
    title: "Privatlivspolitik",
    intro: "Privatlivspolitik for Fillox.dk",
  },
  body: [
    { type: "h2", text: "1. Dataansvarlig" },
    {
      type: "lines",
      card: true,
      lines: [
        // Company name, CVR number and phone from config/site.ts (same text as the live page).
        // TODO: Fillox to confirm the registered address and the data-protection mailbox
        // (info@ here, kontakt@ in config/site.ts → contact.email).
        [{ text: site.legalName, strong: true }],
        `CVR-nr.: ${site.company.registrationNumber}`,
        "Adresse: Cityringen 20, 242, 2630 Taastrup",
        ["E-mail: ", { text: "info@fillox.dk", href: "mailto:info@fillox.dk" }],
        ["Telefon: ", { text: site.contact.phone, href: site.contact.phoneHref }],
      ],
    },
    { type: "paragraph", text: "Fillox Danmark ApS er dataansvarlig for behandlingen af dine personoplysninger." },

    { type: "h2", text: "2. Hvilke personoplysninger behandler vi?" },
    {
      type: "paragraph",
      text: "Vi behandler personoplysninger, som er nødvendige for at levere vores ydelser og overholde gældende lovgivning. Dette kan omfatte navn, kontaktoplysninger, bookingoplysninger samt helbreds- og journaloplysninger.",
    },

    { type: "h2", text: "3. Journal- og behandlingsoplysninger (Gecko Booking)" },
    {
      type: "paragraph",
      text: "Fillox anvender Gecko Booking som eksternt booking- og journalsystem. Alle patient- og journaloplysninger opbevares i Gecko Booking, som fungerer som databehandler. Fillox opbevarer ikke journaldata lokalt. Der er indgået databehandleraftale i overensstemmelse med GDPR.",
    },

    { type: "h2", text: "4. Formål med behandlingen" },
    {
      type: "list",
      items: [
        "Booking og administration af aftaler",
        "Journalføring og dokumentation",
        "Overholdelse af lovkrav",
        "Kommunikation",
        "Fakturering og regnskab",
      ],
    },

    { type: "h2", text: "5. Retsgrundlag" },
    {
      type: "paragraph",
      text: "Behandlingen sker i henhold til GDPR artikel 6 og artikel 9 samt relevant dansk sundhedslovgivning.",
    },

    { type: "h2", text: "6. Opbevaringsperiode" },
    {
      type: "paragraph",
      text: "Journaloplysninger opbevares minimum 10 år. Øvrige oplysninger slettes, når de ikke længere er nødvendige.",
    },

    { type: "h2", text: "7. Videregivelse" },
    { type: "paragraph", text: "Oplysninger videregives kun, når det er nødvendigt eller lovpligtigt." },

    { type: "h2", text: "8. Dine rettigheder" },
    {
      type: "paragraph",
      text: "Du har ret til indsigt, berigtigelse, sletning, begrænsning, dataportabilitet og indsigelse.",
    },

    { type: "h2", text: "9. Klage" },
    {
      type: "paragraph",
      text: [
        "Klage kan indgives til Datatilsynet via ",
        { text: "www.datatilsynet.dk", href: "https://www.datatilsynet.dk" },
      ],
    },

    { type: "h2", text: "10. Sikkerhed" },
    {
      type: "paragraph",
      text: "Vi anvender passende tekniske og organisatoriske sikkerhedsforanstaltninger.",
    },

    { type: "h2", text: "11. Ændringer" },
    { type: "paragraph", text: "Den gældende version findes altid på vores hjemmeside." },

    // NOT on the live page: added 2026-10 for the newsletter signup in the footer of every page
    // and on /blog (GDPR art. 13 information where the address is collected; every signup links
    // here, routes.privacyNewsletter).
    // TODO: copy review + legal review by Fillox before launch:
    // - name the e-mail tool that will send the newsletter (it is a processor too) and confirm the
    //   data processing agreements with it and with Netlify;
    // - Netlify is a US company: add the basis for the transfer outside the EU (e.g. the EU–US
    //   Data Privacy Framework or standard contractual clauses) once confirmed;
    // - confirm how long the proof of consent is kept after an unsubscribe;
    // - newsletter offers must never promote Botox or other prescription medicines (advertising
    //   them to the public is not allowed), the same reason the Botox pages show no reviews.
    { type: "h2", id: privacyNewsletterAnchor, text: "12. Nyhedsbrev" },
    {
      type: "paragraph",
      text: "Når du tilmelder dig vores nyhedsbrev, behandler vi din e-mailadresse samt tidspunktet for tilmeldingen og den side, du tilmeldte dig på, så vi kan dokumentere dit samtykke.",
    },
    {
      type: "list",
      items: [
        [
          { text: "Formål: ", strong: true },
          "at sende dig vores nyhedsbrev med tilbud, nyheder og tips om vores behandlinger.",
        ],
        [
          { text: "Retsgrundlag: ", strong: true },
          "dit samtykke, jf. GDPR artikel 6, stk. 1, litra a, og markedsføringslovens § 10.",
        ],
        [{ text: "Opbevaring: ", strong: true }, "vi opbevarer din e-mailadresse, indtil du afmelder dig nyhedsbrevet."],
        [
          { text: "Databehandlere: ", strong: true },
          "tilmeldinger modtages og opbevares hos vores hostingudbyder, Netlify, og nyhedsbrevet sendes via vores e-mailudbyder. De behandler kun oplysningerne efter vores instruks.",
        ],
        [
          { text: "Afmelding: ", strong: true },
          "du kan til enhver tid trække dit samtykke tilbage via afmeldingslinket i bunden af hvert nyhedsbrev eller ved at skrive til os på ",
          { text: site.contact.email, href: `mailto:${site.contact.email}` },
          ". Det påvirker ikke lovligheden af den behandling, der er sket, før du afmeldte dig.",
        ],
      ],
    },

    companyLines,
  ],
  aside: legalAside,
};

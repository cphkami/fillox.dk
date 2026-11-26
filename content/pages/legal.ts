import type { Link, TextBlock, TextPageContent } from "../types";
import { site } from "@/config/site";
import { privacyCookieBlocks } from "../consent";
import { privacyNewsletterAnchor, routes } from "../routes";

/**
 * Id of the contact-form section of the privacy policy ("14. Kontaktformular" below), linked from the
 * contact form on /kontakt (content/pages/contact.ts → form.privacy) as `${routes.privacy}#${…}`.
 */
export const privacyContactFormAnchor = "kontaktformular";

/**
 * Copy for /handelsbetingelser and /privatlivspolitik (no design; rendered by
 * components/text-page in the site's visual language).
 *
 * Both texts come from the live fillox.dk pages (fetched 2026-09-30; the live
 * /handelsbetingelser was unchanged on 2026-11-26). They are NO LONGER verbatim:
 * - Handelsbetingelser: corrected on 2026-11-26 with the owner's approval ("ret det hele som du
 *   har skrevet til mig. alt fra punkt 1-9", answer to point 2 of the pre-launch audit): the
 *   self-contradicting withdrawal clause now states the rule of forbrugeraftaleloven for purchases
 *   online, by phone or otherwise outside the clinics, and keeps the live 14-day promise for clinic
 *   purchases as Fillox's own term ("medmindre du har taget gavekortet i brug"); the
 *   fitness-template remnant ("hold") and the duplicate heading are gone, and the spelling and
 *   grammar are fixed. The business terms are unchanged (card types, cancellation fees, payment,
 *   validity, refunds, subscriptions, receipts, cancelling). See the comments per section.
 * - Privatlivspolitik: sections 1–11 are the live wording; 12 (newsletter), 13 (cookies,
 *   content/consent.ts) and 14 (contact form) are new. See the comments per section.
 * Changes to the wording need the owner's approval.
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
    // Live: "Nedenfor findes til enhver tid gældende handelsbetingelser" (no full stop). Language fixed
    // with the owner's approval, 2026-11-26.
    intro: "Nedenfor finder du vores til enhver tid gældende handelsbetingelser.",
  },
  /*
   * Corrected 2026-11-26 with the owner's approval ("ret det hele som du har skrevet til mig. alt fra
   * punkt 1-9", point 2). The live text (fillox.dk/handelsbetingelser, unchanged on 2026-11-26) had a
   * self-contradicting withdrawal clause, a fitness-template remnant ("Kortet kan bruges til de hold …"),
   * the heading "Gavekort og abonnement." twice, typos and unfinished sentences. The business terms are
   * the live ones: the same card types, fees, payment, validity (gift card 6 months, subscription
   * 12 months), refunds, receipts and cancelling. The repeated statements of the validity and of
   * "personal, not transferable" are merged, so each term is stated once.
   * Not decided here (README "Før lancering"): the no-show fee (/priser: 500 kr; here 100 %) and
   * whether the subscription (Premium medlemskab) still exists.
   * TODO: copy review (owner/jurist): every paragraph below is reworded.
   */
  body: [
    { type: "h2", text: "Betalingstyper" },
    // Live: "Dankort /Visa Dankort og MasterCard." (Mastercard is the card's own spelling today).
    { type: "paragraph", text: "Vi modtager følgende betalingskort: Dankort, Visa/Dankort og Mastercard." },

    { type: "h2", text: "Afbudsregler" },
    // Live: "Afbud under 24 timer til en behandlingen, koster 500 DKK. Afbud senere end 6 timer før eller
    // ved udeblivelse, medfører en opkrævning på 100% af bookingen." Same fees, language fixed.
    {
      type: "paragraph",
      text: "Afbud mindre end 24 timer før en behandling koster 500 kr. Afbud mindre end 6 timer før og udeblivelse koster 100 % af prisen for bookingen.",
    },
    // Live: "Afbud under 24 timer til en konsultation, koster 250 DKK."
    { type: "paragraph", text: "Afbud mindre end 24 timer før en konsultation koster 250 kr." },

    // Live heading "Ferie/Lukket"; live text "… ved lukkedage eller ferielukket, andet end at
    // behandlingsdatoen rykkes."
    { type: "h2", text: "Ferie og lukkedage" },
    {
      type: "paragraph",
      text: "Der ydes ikke kompensation ved lukkedage eller ferielukning, ud over at behandlingen flyttes til en ny dato.",
    },

    { type: "h2", text: "Betaling" },
    // Live: "Betalingen trækkes straks efter købet – dette kan gælde både for bookinger og køb af Gavekort
    // og abonnement. Se afsnit fortrydelsesret / Refundering."
    {
      type: "paragraph",
      text: "Betalingen trækkes straks efter købet. Det kan gælde både bookinger og køb af gavekort og abonnementer. Se afsnittet “Fortrydelsesret og refundering”.",
    },

    /*
     * Live: "Der er ikke fortrydelsesret på køb af Gavekort, abonnement, dog kan man inden for 14 dage
     * fortryde købet." and, under the second "Gavekort og abonnement.", "Købet kan fortrydes indtil 14
     * efter købet ved henvendelse til FILLOX medmindre gavekortet er taget i brug." The live terms also
     * say "Gavekort/ abonnement kan købes online eller fysisk i Klinikkerne" and that cards bought online
     * can be printed right after payment and are e-mailed. The rule, forbrugeraftaleloven (LBK nr. 1184
     * af 28/09/2025, https://www.retsinformation.dk/eli/lta/2025/1184):
     * - § 18, stk. 1: a right of withdrawal for distance contracts ("aftaler om fjernsalg", § 3, nr. 4:
     *   online, phone, e-mail) and contracts made outside the trader's premises; none for a purchase in
     *   the clinic.
     * - § 19, stk. 1: 14 days, no reason needed; stk. 2, nr. 1: for a service the period runs from the
     *   day the contract is made (for a good, from receipt; the live terms deliver online cards at once,
     *   by print and e-mail, so that is also the purchase day).
     * - § 20, stk. 1: the consumer gives the trader an unequivocal statement before the deadline.
     * - § 22, stk. 1–2: refund within 14 days of the notice, with the same means of payment.
     * - § 25, stk. 1–2: if the service has begun at the consumer's request, the consumer pays for the part
     *   already delivered, in proportion. So "medmindre gavekortet er taget i brug" (no withdrawal once a
     *   card is used at all) was stricter than the law, and § 33 forbids terms to the consumer's detriment.
     * forbrug.dk (Gavekort og tilgodebeviser, updated 9 May 2025) has no separate rule for gift cards.
     * (https://forbrug.dk/regler/regler-gavekort, checked 2026-11-26: no withdrawal rule of its own;
     * validity 3 years unless a shorter, reasonable period is stated clearly at purchase.)
     * Legal review 2026-11-26 (re-read in LBK 1184/2025 and lov nr. 723 af 20/06/2025):
     * - § 25, stk. 1, nr. 1–2: the consumer pays for the used part only if the use began at their
     *   express request within the period (a booking with the card) AND they were told so before the
     *   purchase (§ 8, stk. 1, nr. 11 and 15). This page is that information; the sale itself must
     *   give it too (README "Onlinesalg via Gecko").
     * - § 19, stk. 3–4: the period only starts once the § 8, stk. 1, nr. 11 information is received on a
     *   durable medium (otherwise up to 12 months later), so "fra den dag, du har købt det" holds only
     *   if the purchase confirmation carries it.
     * - NOT in LBK 1184/2025 (its preamble says so): lov nr. 723 af 20/06/2025 § 1, nr. 18–19, in force
     *   19 June 2026, adds § 20, stk. 1, 3. pkt. and § 20 a: a contract made through an online interface
     *   must also be withdrawable with a "Fortryd aftale" function, and § 8, stk. 1, nr. 11 now asks for
     *   its location (https://www.retsinformation.dk/eli/lta/2025/723). Whether Gecko's online sale has
     *   one is open (README), so this page does not name one; e-mail stays a valid way (§ 20, stk. 1).
     * - Online and phone BOOKINGS of a treatment are distance contracts too (§ 3, nr. 4; § 18, stk. 1).
     *   This section does not cover them, and within their 14 days the cancellation fees above may
     *   conflict with § 19, stk. 1, 3. pkt. (no costs beyond §§ 22, 24 and 25): an open question for
     *   the owner/jurist (README), not decided here.
     */
    { type: "h2", text: "Fortrydelsesret og refundering" },
    {
      type: "paragraph",
      text: "Køber du et gavekort eller et abonnement online, over telefonen eller på anden måde uden for vores klinikker, kan du fortryde købet inden for 14 dage fra den dag, du har købt det. Du behøver ikke at give en grund.",
    },
    {
      type: "paragraph",
      text: [
        "Du fortryder ved at give os en tydelig besked inden fristen, fx på e-mail til ",
        { text: site.contact.email, href: site.contact.emailHref },
        ". Har du allerede brugt noget af gavekortet eller abonnementet, betaler du for det, du har brugt. Resten betaler vi tilbage senest 14 dage efter, at vi har fået din besked, til det kort, du betalte med.",
      ],
    },
    /*
     * Clinic purchases: the law gives no right of withdrawal (§ 18, stk. 1), but the live terms promise one
     * without distinguishing online and clinic: "Købet kan fortrydes indtil 14 efter købet ved henvendelse
     * til FILLOX medmindre gavekortet er taget i brug." That contractual promise is a business term, so it
     * is kept for clinic purchases (review 2026-11-26; an earlier draft said "er der ikke fortrydelsesret",
     * which took it away). Whether to keep it is the owner's call (README).
     * TODO: copy review
     */
    {
      type: "paragraph",
      text: "Køber du et gavekort eller et abonnement i en af vores klinikker, kan du også fortryde købet inden for 14 dage ved at kontakte os, medmindre du har taget gavekortet i brug.",
    },
    // Live: "Dvs. at, eventuelle resterende klip på udløbne klippekort eller ved ophør i klinikken, ikke
    // refunderes og kan ikke overdrages til andre." ("ved ophør i klinikken" kept as it stands.)
    // Language review 2026-11-26: "Bortset fra" (was "Ud over", which also reads "in addition to").
    // TODO: copy review
    {
      type: "paragraph",
      text: "Bortset fra fortrydelsesretten refunderes resterende klip ikke, hverken på udløbne klippekort eller ved ophør i klinikken, og de kan ikke overdrages til andre.",
    },
    // Live: "Evt. refundering ved fejlbehandling o.lign. kan kun ske ved fysisk fremmøde i klinikken hvor
    // købet af foretaget."
    {
      type: "paragraph",
      text: "Eventuel refundering ved fejlbehandling og lignende kan kun ske ved fysisk fremmøde i den klinik, hvor købet er foretaget.",
    },

    /*
     * The two live sections titled "Gavekort og abonnement." and the "Gyldighed" section, merged:
     * - "Gavekort/ abonnement kan købes online eller fysisk i Klinikkerne." + "Er disse købt online, kan
     *   disse printes lige efter gennemført betaling og fremsendes ligeledes på e-mail. Der modtages også
     *   en bekræftelse på købet på mail."
     * - "Gavekort/ abonnement er personligst og kan ikke deles med andre eller overdrages til andre." (also
     *   "Alle abonnementer er personlige …" under "Automatisk trækning på Abonnementer") + "… kan knyttes
     *   til din bookingprofil straks efter købet. Herefter foretager du din booking og systemet vil
     *   automatisk trække klippet fra kortet."
     */
    { type: "h2", text: "Gavekort og abonnementer" },
    {
      type: "paragraph",
      text: "Gavekort og abonnementer kan købes online eller i klinikkerne. Køber du online, kan du printe gavekortet eller abonnementet, så snart betalingen er gennemført, og du får det også tilsendt på e-mail sammen med en bekræftelse på købet.",
    },
    {
      type: "paragraph",
      text: "Gavekort og abonnementer er personlige og kan ikke deles med eller overdrages til andre. Du kan knytte dem til din bookingprofil straks efter købet. Når du derefter booker, trækker systemet automatisk klippet fra kortet.",
    },

    /*
     * Live (three times): "Gyldighed for Gavekort er 6 måneder fra købsdatoen og abonnement: max. 12
     * måneder fra købsdatoen. Måske kan der forekomme kortere gyldighedsperioder ved fx kampagner og
     * tilbud eller ved brug af Gavekort/ abonnement på én gang."; "… gyldigt i 6 måneder … 12 måneder fra
     * købsdatoen, såfremt andet ikke fremgår på selve gavekortet eller abonnementet."; "Gavekortes
     * gyldighed er 6 måneder fra købsdatoen. Abonnement er gyldigt: 12 måneder fra enten købsdato."
     * The vague "Måske kan der forekomme kortere gyldighedsperioder …" is replaced by the precise rule the
     * live text gives itself ("såfremt andet ikke fremgår på selve gavekortet …"); forbrug.dk: a shorter
     * validity must be stated clearly. "Det er kundens eget ansvar at få brugt sin Gavekort/ abonnement,
     * inden udløbsdatoen." "Kortet kan bruges til de hold som er beskrevet i de enkelte vilkår og
     * betingelser for hvert af de mulige abonnementer." ("hold" is a fitness-template word: behandlinger).
     */
    { type: "h2", text: "Gyldighed" },
    // Language review 2026-11-26: "en anden gyldighedsperiode" (was "en anden gyldighed").
    // TODO: copy review
    {
      type: "paragraph",
      text: "Et gavekort er gyldigt i 6 måneder og et abonnement i 12 måneder fra købsdatoen, medmindre der står en anden gyldighedsperiode på selve gavekortet eller abonnementet. Det er dit eget ansvar at bruge gavekortet eller abonnementet inden udløbsdatoen.",
    },
    {
      type: "paragraph",
      text: "Et abonnement kan bruges til de behandlinger, der er beskrevet i vilkårene for det enkelte abonnement.",
    },

    /*
     * Live: "Prisen for abonnementet fremgår ved købet af de enkelte abonnementer." and, as a run-in under
     * "Ændring af betalingskort", "Automatisk trækning Første betaling trækkes i forbindelse med indgåelsen
     * af aftalen – herefter trækkes prisen for abonnementet automatisk hver måned, indtil udløb." Then
     * "Kvittering Der fremsendes kvittering på e-mail ved: • Indgåelse af aftale • Ved automatisk trækning
     * • Ved fejlet trækning • Ved ændring af betalingskort • Ved opsigelse af abonnementet".
     */
    { type: "h2", text: "Automatisk trækning på abonnementer" },
    // Language review 2026-11-26: "Du ser prisen …" (was "Prisen for abonnementet fremgår, når du køber
    // det": "fremgå" without "af"). TODO: copy review
    {
      type: "paragraph",
      text: "Du ser prisen for abonnementet, når du køber det. Første betaling trækkes, når aftalen indgås, og derefter trækkes prisen for abonnementet automatisk hver måned, indtil abonnementet udløber.",
    },
    { type: "paragraph", text: "Du får en kvittering på e-mail ved:" },
    {
      type: "list",
      items: [
        "Indgåelse af aftalen",
        "Automatisk trækning",
        "Fejlet trækning",
        "Ændring af betalingskort",
        "Opsigelse af abonnementet",
      ],
    },

    // Live: "Det altid er kundens ansvar, at det korrekte og gyldige betalingskort er angivet i systemet.
    // Man skifter betalingskort ved at logge ind på booking systemet trykke på ”Klik her for at se dine
    // Abonnementer” Bemærk – en opsigelse af betalingskortet er ikke en opsigelse af det løbende
    // abonnement." (The quoted button label is the booking system's own.)
    { type: "h2", text: "Ændring af betalingskort" },
    {
      type: "paragraph",
      text: "Det er altid dit ansvar, at der står et korrekt og gyldigt betalingskort i systemet. Du skifter betalingskort ved at logge ind i bookingsystemet og trykke på “Klik her for at se dine Abonnementer”. Bemærk, at en opsigelse af betalingskortet ikke er en opsigelse af det løbende abonnement.",
    },

    // Live heading "Bero & Opsigelse"; live text "Systemet har ikke en bero funktion. Ønsker man at holde
    // pause med abonnementet, skal aftalen blot opsiges via booking systemet. Man kan efterfølgende, vælge
    // at købe et nyt abonnement med det samme og sætte den ønskede startdato under købet." + "Generel
    // opsigelse foregår også via bookingsystemet eller ved henvendelse til Fillox. Bemærk – …"
    { type: "h2", text: "Pause og opsigelse" },
    {
      type: "paragraph",
      text: "Bookingsystemet har ikke en pausefunktion. Vil du holde pause med abonnementet, skal du blot opsige det i bookingsystemet. Du kan derefter købe et nyt abonnement med det samme og vælge den ønskede startdato, når du køber det.",
    },
    // Language review 2026-11-26: "kontakte os" (was "kontakte Fillox"), the "vi/os" of the whole page.
    // TODO: copy review
    {
      type: "paragraph",
      text: "Du opsiger abonnementet i bookingsystemet eller ved at kontakte os. Bemærk, at en opsigelse af betalingskortet ikke er en opsigelse af det løbende abonnement.",
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
    // Transfer to the USA (Netlify): resolved 2026-11-26, the same basis as in "14. Kontaktformular"
    // below (sources there).
    // TODO: copy review + legal review by Fillox before launch:
    // - name the e-mail tool that will send the newsletter (it is a processor too) and confirm the
    //   data processing agreement with it (and its transfer basis, if it is outside the EU);
    // - confirm how long the proof of consent is kept after an unsubscribe.
    // The newsletter sends news, articles and tips only: no offers (owner 2026-11-26, point 4 of the
    // pre-launch audit, "ret det med priser osv"). The purpose below is what the signups promise
    // (content/layout.ts → footer.newsletter, content/pages/blog.ts → newsletter); change all of them
    // together before a newsletter ever carries offers (markedsføringsloven § 10: the consent covers
    // what it describes). Never rynkebehandling or other prescription medicines (lægemiddelloven § 66).
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
          // Was "… med tilbud, nyheder og tips …" (owner 2026-11-26: no offers in the newsletter).
          // TODO: copy review
          "at sende dig vores nyhedsbrev med nyheder, artikler og gode råd om vores behandlinger.",
        ],
        [
          { text: "Retsgrundlag: ", strong: true },
          "dit samtykke, jf. GDPR artikel 6, stk. 1, litra a, og markedsføringslovens § 10.",
        ],
        [{ text: "Opbevaring: ", strong: true }, "vi opbevarer din e-mailadresse, indtil du afmelder dig nyhedsbrevet."],
        [
          { text: "Databehandlere: ", strong: true },
          // TODO: copy review (the second sentence, the transfer basis, is new 2026-11-26)
          "tilmeldinger modtages og opbevares hos vores hostingudbyder, Netlify, og nyhedsbrevet sendes via vores e-mailudbyder. De behandler kun oplysningerne efter vores instruks. Netlify, Inc. ligger i USA. Overførslen dertil sker på grundlag af EU-U.S. Data Privacy Framework, som Netlify, Inc. er certificeret under, og EU-Kommissionens afgørelse af 10. juli 2023 om, at rammen sikrer et tilstrækkeligt beskyttelsesniveau.",
        ],
        [
          { text: "Afmelding: ", strong: true },
          "du kan til enhver tid trække dit samtykke tilbage via afmeldingslinket i bunden af hvert nyhedsbrev eller ved at skrive til os på ",
          { text: site.contact.email, href: `mailto:${site.contact.email}` },
          ". Det påvirker ikke lovligheden af den behandling, der er sket, før du afmeldte dig.",
        ],
      ],
    },

    // NOT on the live page: "13. Cookies", added 2026-11-25 with the cookie banner (owner:
    // "cookiebanner ja"). Its copy and the cookie list live in content/consent.ts.
    // TODO: copy review (owner/jurist): new section, not from the live site.
    ...privacyCookieBlocks,

    /*
     * NOT on the live page: "14. Kontaktformular", added 2026-11-26 (owner: "ret det hele som du har
     * skrevet til mig. alt fra punkt 1-9", point 3 of the pre-launch audit). Linked from the contact
     * form on /kontakt (content/pages/contact.ts → form.privacy). GDPR art. 13, stk. 1, litra c (purpose
     * and legal basis), litra e (recipients), litra f (transfer to a third country), stk. 2, litra a
     * (retention: the criteria, no period given by the owner), litra c (withdrawing consent).
     * - Fields: components/contact/ContactForm.tsx and public/__forms.html ("kontakt": name, email,
     *   phone, clinic, message, consent; phone and clinic are optional, the consent box is only shown
     *   below 768px, content/pages/contact.ts → form.consent.showOnDesktop).
     * - Legal basis: the policy's own bases (section 5: "GDPR artikel 6 og artikel 9"; section 12: art. 6,
     *   stk. 1, litra a), as proposed to the owner (README "Privatlivspolitikken og
     *   kontaktformularen"): art. 6, stk. 1, litra a (the consent box) and f (answering an inquiry),
     *   art. 9, stk. 2, litra a for health information written in the message.
     *   LAUNCH BLOCKER (legal review 2026-11-26): as built, art. 9, stk. 2, litra a is NOT met. It needs
     *   the data subject's explicit consent to the processing of health data for a specific purpose
     *   (GDPR art. 9, stk. 2, litra a; Datatilsynet, "Samtykke", maj 2021, 2.7: no doubt that consent
     *   was given, and the controller must be able to prove it). From 768px the form has no consent box
     *   at all, and the mobile box ("… gemmer mine oplysninger for at besvare min henvendelse") does not
     *   name health information. Also, the mobile box is required to send, so it is not a freely given
     *   consent to answering (GDPR art. 7, stk. 4), and one purpose rests on two bases (f and a).
     *   And Netlify's DPA, Exhibit I, point 4 ("Sensitive Data Transferred: None intended. Customer …
     *   shall not submit special categories of Personal Data … unless the Agreement expressly permits
     *   it"), excludes health data from Netlify Forms. Owner/jurist to choose (README): a box at every
     *   width that names health information plus a processor whose agreement covers it, or asking
     *   visitors not to write health information in the form, with another basis for what arrives
     *   anyway (e.g. art. 9, stk. 2, litra h / databeskyttelsesloven § 7, stk. 3, if authorised health
     *   staff under a duty of confidentiality answer). The text below is unchanged until then.
     * - Netlify Forms stores submissions (Netlify DPA, "Last Updated: November 13, 2026", § 1: "Forms
     *   submissions" are Customer Data; https://www.netlify.com/pdf/netlify-dpa.pdf).
     * - Transfer: Netlify, Inc. is certified under the EU-U.S. DPF. The official list
     *   (https://www.dataprivacyframework.gov/list, checked 2026-11-26) shows "Netlify, Inc", San
     *   Francisco, CA: "EU-U.S. Data Privacy Framework", "Active", "Non-HR Data". Also the Netlify
     *   Privacy Statement (last updated November 4, 2026, section 13, https://www.netlify.com/privacy/)
     *   and the DPA (§ 14.2: EU transfers
     *   "shall take place on the basis of the EU-U.S. Data Privacy Framework", § 14.3: the EU standard
     *   contractual clauses if the DPF ceases to apply). Adequacy decision: Commission Implementing
     *   Decision (EU) 2023/1795 of 10 July 2023 (GDPR art. 45; upheld by the General Court in T-553/23,
     *   3 September 2025; Latombe's appeal, Case C-703/25 P, lodged 31 October 2025, OJ C/2025/6610, is
     *   pending, so check before launch). Re-checked 2026-11-26 in the official list (participant 6208,
     *   "Netlify, Inc": EU-U.S. DPF, Swiss-U.S. DPF and the UK Extension all "Active", Non-HR Data) and in
     *   the DPA (Last Updated: November 13, 2026, § 14.2–14.3).
     * - Not listed above: Netlify says it stores the sender's IP address with each Forms submission
     *   (Netlify support forum, 2020–2021; not in its docs). Check one submission or the CSV export in
     *   Netlify, and name what is stored here and in section 12 (README).
     * - Retention: section 6, "Øvrige oplysninger slettes, når de ikke længere er nødvendige."
     *   Netlify Forms keeps the submissions in the site's Netlify dashboard (Forms), so answered ones
     *   must be deleted there for this promise to hold (README).
     * TODO: copy review (owner/jurist): new section, not from the live site.
     */
    { type: "h2", id: privacyContactFormAnchor, text: "14. Kontaktformular" },
    // Language review 2026-11-26: split into three sentences (was "… og din besked og, hvis du udfylder
    // dem, dit telefonnummer og den klinik, du vælger. På mobil får vi også …"); same fields.
    // TODO: copy review
    {
      type: "paragraph",
      text: "Når du skriver til os via kontaktformularen, får vi dit navn, din e-mailadresse og din besked. Skriver du dit telefonnummer eller vælger du en klinik, får vi dem også. På mobil får vi desuden at vide, at du har sat kryds i samtykkefeltet.",
    },
    {
      type: "list",
      items: [
        [
          { text: "Formål: ", strong: true },
          "at besvare din henvendelse og følge op på den, fx hvis du vil booke en tid.",
        ],
        [
          { text: "Retsgrundlag: ", strong: true },
          "vores legitime interesse i at besvare de henvendelser, vi får, og dit samtykke, når du sætter kryds i samtykkefeltet, jf. GDPR artikel 6, stk. 1, litra f og a. Skriver du oplysninger om dit helbred i beskeden, behandler vi dem på grundlag af dit udtrykkelige samtykke, jf. GDPR artikel 9, stk. 2, litra a.",
        ],
        [
          { text: "Helbredsoplysninger: ", strong: true },
          "skriv kun det om dit helbred, som er nødvendigt for dit spørgsmål. Vil du hellere fortælle det mundtligt, kan du ringe til os på ",
          // Non-breaking spaces: the number never wraps inside the sentence.
          { text: site.contact.phone.replace(/ /g, "\u00a0"), href: site.contact.phoneHref },
          ".",
        ],
        [
          { text: "Opbevaring: ", strong: true },
          "vi gemmer din henvendelse, så længe det er nødvendigt for at besvare og følge op på den. Derefter sletter vi den.",
        ],
        [
          { text: "Databehandler: ", strong: true },
          "det, du sender via formularen, modtages og opbevares hos vores hostingudbyder, Netlify, Inc. (Netlify Forms), som kun behandler oplysningerne efter vores instruks. Netlify, Inc. ligger i USA. Overførslen dertil sker på grundlag af EU-U.S. Data Privacy Framework, som Netlify, Inc. er certificeret under, og EU-Kommissionens afgørelse af 10. juli 2023 om, at rammen sikrer et tilstrækkeligt beskyttelsesniveau.",
        ],
        [
          { text: "Tilbagetrækning: ", strong: true },
          "du kan til enhver tid trække dit samtykke tilbage ved at skrive til os på ",
          { text: site.contact.email, href: `mailto:${site.contact.email}` },
          ". Det påvirker ikke lovligheden af den behandling, der er sket, før du trak det tilbage. Dine øvrige rettigheder står i afsnit 8.",
        ],
      ],
    },

    companyLines,
  ],
  aside: legalAside,
};

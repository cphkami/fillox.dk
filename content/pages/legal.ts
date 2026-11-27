import type { Link, RichSpan, TextBlock, TextPageContent } from "../types";
import { site } from "@/config/site";
import type { FormsConfig } from "@/config/types";
import { privacyCookieBlocks } from "../consent";
import { privacyNewsletterAnchor, routes } from "../routes";

/**
 * Id of the contact-form section of the privacy policy ("14. Kontaktformular" below), linked from the
 * contact form on /kontakt (content/pages/contact.ts → form.privacy) as `${routes.privacy}#${…}`.
 */
export const privacyContactFormAnchor = "kontaktformular";

/*
 * Who receives what the two forms send: the "Databehandler" item of "12. Nyhedsbrev" and of "14.
 * Kontaktformular" below ("Modtager" where no data processing agreement is confirmed: Formspree).
 * Each follows its form's provider (config/site.ts → forms; lib/forms.ts sends there), so the
 * policy changes with the same one line as the form does, and a new provider in config/types.ts
 * → FormsConfig does not compile until it has a text here.
 *
 * Owner 2026-11-27, about section 12's "tilmeldinger modtages og opbevares hos vores
 * hostingudbyder, Netlify": "nej vi kommer ikke til at opbevare data hos netlify. det finder vi en
 * løsning på.. vi skal intet have i USA" and "måske bruger vi https://formward.eu hvis vi skal
 * være helt sikkert. men tanken er at emails registerees måske direkte i klaviyo via nyhedsbrev".
 * Later the same day they sent a Formspree endpoint for the CONTACT form; told that Formspree is
 * a US company with its data in the USA, they chose "Formspree alligevel" and added "det bare
 * lige nu så vi kan starte, senere rykker vi til det svenske" (= Formward). So section 14 shows
 * the `formspree` text today. The newsletter is not decided: section 12 still shows its
 * `netlify` text, unchanged (sources in the comment above "14. Kontaktformular"). Every text
 * states only what the research of 2026-11-27 found in the providers' own documents (no account
 * of ours existed, nothing was ever sent).
 *
 * - formspree — the owner's TEMPORARY choice for the contact form. Read 2026-11-27 (GET only) in
 *   Formspree's own pages and two public registers:
 *   · The contracting party is "Formspree, Inc.", San Antonio, Texas
 *     (https://formspree.io/legal/terms-of-service/, last updated December 20, 2022; Texas
 *     Comptroller, franchise tax record). No EU entity, EU representative or DPO is named.
 *   · "Our services are hosted with Amazon Web Services in the United States."
 *     (https://formspree.io/security/). No EU data residency is documented.
 *   · NOT an active participant in the EU-U.S. Data Privacy Framework: the official list
 *     (https://www.dataprivacyframework.gov/list, 2026-11-27) has "Formspree, Inc." under
 *     inactive participants ("Inactive - Withdrawal", certified 04/23/2019, inactive since
 *     04/26/2022). A second check the same day could not repeat the search (the list's search is
 *     a POST to its API); the owner can look the name up in a minute (README). So the text names
 *     no DPF basis.
 *   · Transfer basis: only what Formspree says of itself, one sentence on its security page:
 *     "We rely on Standard Contractual Clauses (SCCs) as a data processor." Which clauses
 *     (version, module), and whether they are part of any contract with a customer, is shown
 *     nowhere. Hence "oplyser" in the text.
 *   · NO data processing agreement is published: the legal section lists Data Request, Privacy
 *     Policy, Subprocessors and Terms of Service only, /legal/dpa is a 404, and the Terms contain
 *     none. The Terms (section 2) call Formspree's customers "separate and independent data
 *     controllers", while the security and sub-processor pages speak of Formspree "as a data
 *     processor". So the label is "Modtager", not "Databehandler", and the text does NOT say
 *     "kun efter vores instruks".
 *   · Stored besides the fields: the privacy policy (https://formspree.io/legal/privacy-policy/,
 *     last updated April 24, 2022) lists "your IP address, browser type, domain names, access
 *     times and referring website addresses"; the dashboard's own code keeps IP address, user
 *     agent and a geo lookup with each submission.
 *   · 27 sub-processors, 26 in the United States and one in Germany, listed without purposes
 *     (https://formspree.io/legal/subprocessors/; among them Amazon, Cloudflare, Google, Mailgun,
 *     SendGrid, Sentry, Automattic, OpenAI and Anthropic). Which of them see a message is not
 *     stated; "underleverandører" in the text, since "underdatabehandlere" would claim the
 *     processor role.
 *   OPEN LEGAL POINTS for the owner / a jurist (README → "Formularerne væk fra Netlify"):
 *   1. No art. 28 agreement. The owner asks team@formspree.io for one that includes the EU
 *      standard contractual clauses. With it in hand: the label can become "Databehandler", the
 *      text can say "kun efter vores instruks" if the agreement does, and GDPR art. 13, stk. 1,
 *      litra f's "how to get a copy" of the safeguards can be added. Until then the transfer
 *      rests on Formspree's own statement, not on a contract the clinic holds.
 *   2. Formspree's privacy policy: "You agree not to use the Formspree Service to collect
 *      sensitive personal data" (not defined; liability disclaimed). A clinic's contact form can
 *      receive health details whatever it says: the hint at the message field and section 14's
 *      "Helbredsoplysninger" lower how often, they do not stop it.
 *   3. "Opbevaring: … Derefter sletter vi den" is true only if the clinic deletes handled
 *      messages in the Formspree dashboard: "Every submission is stored until you delete it"
 *      (https://formspree.io/plans), and no auto-delete setting is documented. On the Free plan
 *      the dashboard shows the last 30 days only; older ones "aren't deleted" (help centre,
 *      "Account limits"). README has the routine.
 *   4. Section 7 ("Oplysninger videregives kun, når det er nødvendigt eller lovpligtigt"): if
 *      Formspree is an independent controller, as its Terms say, the form discloses to it.
 *   The `formspree` text for the newsletter exists because the config allows that provider there
 *   too; it says the same and is as open.
 * - formward — Formward is "EGF Group AB (trading as Formward)", Swedish org.nr 559501-3573,
 *   Stockholm (https://formward.eu/impressum; allabolag.se/5595013573). Submissions, files, logs
 *   and backups are stored at Hostup AB in Sweden (https://formward.eu/eu-data-residency,
 *   https://formward.eu/compliance/subprocessors; forms.formward.eu resolved to a Hostup AB
 *   address in Sweden, 2026-11-27). Art. 28 agreement: https://formward.eu/dpa (v1.2,
 *   2026-11-18), accepted in the dashboard. The texts say WHERE the data is stored and do NOT
 *   say "ingen overførsel uden for EU/EØS": Formward's notification e-mails go through Mailjet
 *   (EU; on Google Cloud in Germany and Belgium, with US support tooling at its parent Sinch:
 *   https://sinch.com/data-protection-agreement/sub-processors/), and a notification to a Gmail or
 *   Outlook mailbox leaves a copy with a US provider unless the form's notifications are "Link
 *   only" (https://formward.eu/integrations/email). Add the sentence only when the owner has set
 *   that up (README → "Formularerne væk fra Netlify"). Formward's DPA § 3: the service is "not
 *   intended for" art. 9 data and the customer "must not submit such data through the Service
 *   without appropriate safeguards": the same residual risk as with Netlify (section 14's
 *   health hint lowers it, it does not remove it).
 * - klaviyo (newsletter only) — the contracting party is Klaviyo, Inc., Boston, also for EU
 *   customers (https://www.klaviyo.com/legal/dpa, updated 2026-09-11). "All existing customer
 *   accounts are hosted and processed in the United States"
 *   (https://www.klaviyo.com/legal/subprocessors, updated 2026-11-25). Transfer basis, DPA § 11.2:
 *   "Klaviyo is self-certified under the DPF" (§ 11.1: the EU standard contractual clauses when
 *   it cannot rely on the DPF). NOT yet checked against https://www.dataprivacyframework.gov/list:
 *   do that before the switch (check:market prints a note). THIS TEXT CONFLICTS WITH THE OWNER'S
 *   "vi skal intet have i USA": it is here so that the policy is true if Klaviyo is chosen
 *   anyway. An account created in Klaviyo's EU environment (Germany; "Limited Availability" for
 *   new contracted customers since 2026-09-15) stores in the EU, but DPA § 4.4 still lets Klaviyo
 *   and its sub-processors process outside the EU: with such an account, rewrite this text from
 *   the account's own documents. Klaviyo both stores the signups and sends the newsletter, so the
 *   sentence about "vores e-mailudbyder" is gone from its text.
 * The sender of the newsletter in the `netlify` and `formward` texts is still an unnamed "vores
 * e-mailudbyder" (`unnamedNewsletterSender`; the open TODO above section 12): name it, and its
 * transfer basis, once chosen. Until then `npm run check:market` prints a note as soon as the
 * newsletter has left Netlify (`newsletterSenderIsUnnamed` below): were that tool Klaviyo or
 * another US service, section 12 would hide a transfer to the USA.
 */
type ProcessorItem = { label: string; text: string };

/** How section 12 names the tool that sends the newsletter while none is chosen. */
const unnamedNewsletterSender = "vores e-mailudbyder";

const dpfDecision =
  "EU-Kommissionens afgørelse af 10. juli 2023 om, at rammen sikrer et tilstrækkeligt beskyttelsesniveau";

/**
 * What the `formspree` texts say about Formspree, Inc. itself, after a sentence that names
 * "Formspree"; `submission` is "indsendelsen" / "tilmeldingen". Each sentence has its source in
 * the comment above; nothing here claims a data processing agreement, an instruction or a DPF
 * certification.
 */
const formspreeFacts = (submission: string) =>
  `Formspree, Inc. ligger i USA, og tjenesten drives på servere hos Amazon Web Services i USA. Virksomheden er ikke certificeret under EU-U.S. Data Privacy Framework og oplyser, at den bruger EU-Kommissionens standardkontraktbestemmelser som grundlag for overførslen. Ud over det, du selv skriver, registrerer Formspree tekniske oplysninger om ${submission}, herunder din IP-adresse og oplysninger om din browser. Formspree bruger underleverandører, hvoraf de fleste ligger i USA; listen findes på formspree.io/legal/subprocessors.`;

const formProcessorTexts = {
  newsletter: {
    // TODO: copy review (the second half, the transfer basis, is new 2026-11-26). Unchanged 2026-11-27.
    netlify: {
      label: "Databehandlere: ",
      text: `tilmeldinger modtages og opbevares hos vores hostingudbyder, Netlify, og nyhedsbrevet sendes via ${unnamedNewsletterSender}. De behandler kun oplysningerne efter vores instruks. Netlify, Inc. ligger i USA. Overførslen dertil sker på grundlag af EU-U.S. Data Privacy Framework, som Netlify, Inc. er certificeret under, og ${dpfDecision}.`,
    },
    // TODO: copy review (2026-11-27): new text, shown when config/site.ts → forms.newsletter is "formward".
    formward: {
      label: "Databehandlere: ",
      text: `tilmeldinger modtages og opbevares hos Formward, som drives af det svenske selskab EGF Group AB. Formward opbevarer dem på servere i Sverige. Nyhedsbrevet sendes via ${unnamedNewsletterSender}. Begge behandler kun oplysningerne efter vores instruks.`,
    },
    // TODO: copy review (2026-11-27): new text, shown when config/site.ts → forms.newsletter is
    // "formspree" (not chosen; the owner may start the newsletter there too). "Modtagere", not
    // "Databehandlere": no data processing agreement with Formspree is confirmed (see above), so
    // "kun efter vores instruks" is said of the e-mail provider only.
    formspree: {
      label: "Modtagere: ",
      text: `tilmeldinger modtages og opbevares hos vores formularudbyder, Formspree. Nyhedsbrevet sendes via ${unnamedNewsletterSender}, som kun behandler oplysningerne efter vores instruks. ${formspreeFacts("tilmeldingen")}`,
    },
    // TODO: copy review (2026-11-27): new text, shown when config/site.ts → forms.newsletter is
    // "klaviyo". Names a transfer to the USA, which the owner does not want (see above).
    klaviyo: {
      label: "Databehandler: ",
      text: `tilmeldinger modtages og opbevares hos Klaviyo, Inc., som vi også sender nyhedsbrevet med. Klaviyo behandler kun oplysningerne efter vores instruks. Klaviyo, Inc. ligger i USA og opbevarer oplysningerne dér. Overførslen sker på grundlag af EU-U.S. Data Privacy Framework, som Klaviyo, Inc. er certificeret under, og ${dpfDecision}.`,
    },
  } satisfies Record<FormsConfig["newsletter"]["provider"], ProcessorItem>,
  contact: {
    // Unchanged 2026-11-27 (written 2026-11-26; sources in the comment above "14. Kontaktformular").
    netlify: {
      label: "Databehandler: ",
      text: `det, du sender via formularen, modtages og opbevares hos vores hostingudbyder, Netlify, Inc. (Netlify Forms), som kun behandler oplysningerne efter vores instruks. Netlify, Inc. ligger i USA. Overførslen dertil sker på grundlag af EU-U.S. Data Privacy Framework, som Netlify, Inc. er certificeret under, og ${dpfDecision}.`,
    },
    // TODO: copy review (2026-11-27): new text, shown when config/site.ts → forms.contact is "formward".
    formward: {
      label: "Databehandler: ",
      text: "det, du sender via formularen, modtages og opbevares hos Formward, som drives af det svenske selskab EGF Group AB. Formward opbevarer oplysningerne på servere i Sverige og behandler dem kun efter vores instruks.",
    },
    // TODO: copy review (2026-11-27) + legal review (owner / jurist): new text, SHOWN TODAY
    // (config/site.ts → forms.contact is "formspree"; owner 2026-11-27: "Formspree alligevel",
    // "det bare lige nu så vi kan starte, senere rykker vi til det svenske"). "Modtager", not
    // "Databehandler", and no "kun efter vores instruks": no data processing agreement with
    // Formspree is confirmed. The sources and the open legal points are in the comment above.
    formspree: {
      label: "Modtager: ",
      text: `det, du sender via formularen, modtages og opbevares hos vores formularudbyder, Formspree. ${formspreeFacts("indsendelsen")}`,
    },
  } satisfies Record<FormsConfig["contact"]["provider"], ProcessorItem>,
};

/**
 * True while "12. Nyhedsbrev" does not say who sends the newsletter (the text of the newsletter's
 * provider still has `unnamedNewsletterSender`). Read by scripts/check-market.mjs (rule 21), which
 * prints a note about it once the newsletter has left Netlify.
 */
export const newsletterSenderIsUnnamed: boolean =
  formProcessorTexts.newsletter[site.forms.newsletter.provider].text.includes(unnamedNewsletterSender);

/**
 * The "Databehandler" (Formspree: "Modtager") list item of a form's section, for the provider
 * the form uses. Each record above `satisfies` its form's providers, so the lookup always finds
 * a text.
 */
function formProcessorItem(kind: keyof FormsConfig): RichSpan[] {
  const texts: Record<string, ProcessorItem | undefined> = formProcessorTexts[kind];
  const { provider } = site.forms[kind];
  const item = texts[provider];
  // Only reachable with a config that does not type-check (`npm run check:market` names it first).
  if (!item) throw new Error(`content/pages/legal.ts: no "Databehandler" text for forms.${kind} at "${provider}"`);
  return [{ text: item.label, strong: true }, item.text];
}

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
        // Company name, CVR number, e-mail and phone from config/site.ts. E-mail: site.contact.email
        // (kontakt@fillox.dk) since 2026-11-27, was info@fillox.dk (the live page). Alberte
        // 2026-11-26 (forwarded by the owner): "Under content creator og kontakt oplysninger skal
        // henvendelse sendes til kontakt@fillox.dk"; the whole site now gives one address.
        // TODO: Fillox to confirm the registered address. TODO: copy review (2026-11-27, Alberte)
        [{ text: site.legalName, strong: true }],
        `CVR-nr.: ${site.company.registrationNumber}`,
        "Adresse: Cityringen 20, 242, 2630 Taastrup",
        ["E-mail: ", { text: site.contact.email, href: site.contact.emailHref }],
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
    // Who stores the signups ("Databehandlere") follows the newsletter's provider: formProcessorTexts
    // at the top of this file (owner 2026-11-27: nothing at Netlify, nothing in the USA). While it is
    // Netlify Forms (still the case: only the contact form moved to Formspree on 2026-11-27):
    // transfer to the USA, resolved 2026-11-26 on the same basis as the `netlify` text of "14.
    // Kontaktformular" (sources in the comment above that section).
    // TODO: copy review + legal review by Fillox before launch:
    // - name the e-mail tool that will send the newsletter (it is a processor too) and confirm the
    //   data processing agreement with it (and its transfer basis, if it is outside the EU); with
    //   Klaviyo as the provider it is named already;
    // - confirm how long the proof of consent is kept after an unsubscribe.
    // The newsletter carries no offers (owner 2026-11-26, point 4 of the pre-launch audit, "ret det
    // med priser osv"). The purpose below is what the signups promise (content/layout.ts →
    // footer.newsletter, content/pages/blog.ts → newsletter); change all of them together before a
    // newsletter ever carries offers (markedsføringsloven § 10: the consent covers what it
    // describes). Never rynkebehandling or other prescription medicines (lægemiddelloven § 66).
    // Since 2026-11-26 the signups promise Alberte's "det seneste nyt om vores behandlinger,
    // produktnyheder og særlige invitationer" (forwarded by the owner), so the purpose says the same
    // (it said "nyheder, artikler og gode råd om vores behandlinger").
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
          // Was "… med tilbud, nyheder og tips …" (owner 2026-11-26: no offers in the newsletter), then
          // "… med nyheder, artikler og gode råd om vores behandlinger." The signup text's words
          // (Alberte, 2026-11-26).
          // TODO: copy review (2026-11-26, Alberte) + legal review (owner)
          "at sende dig vores nyhedsbrev med det seneste nyt om vores behandlinger, produktnyheder og særlige invitationer.",
        ],
        [
          { text: "Retsgrundlag: ", strong: true },
          "dit samtykke, jf. GDPR artikel 6, stk. 1, litra a, og markedsføringslovens § 10.",
        ],
        [{ text: "Opbevaring: ", strong: true }, "vi opbevarer din e-mailadresse, indtil du afmelder dig nyhedsbrevet."],
        // By the newsletter's provider (config/site.ts → forms.newsletter): formProcessorTexts above.
        formProcessorItem("newsletter"),
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
     * and legal basis), litra d (the legitimate interest), litra e (recipients), litra f (transfer to a
     * third country), stk. 2, litra a (retention: the criteria, no period given by the owner); art. 21,
     * stk. 4 (the right to object, in its own list item).
     * - Recipient: the "Databehandler" / "Modtager" item follows the form's provider (config/site.ts
     *   → forms.contact; formProcessorTexts at the top of this file, with the sources of the
     *   Formward and Formspree texts). Owner 2026-11-27: "nej vi kommer ikke til at opbevare data hos
     *   netlify … vi skal intet have i USA", then, for this form: "Formspree alligevel" and "det bare
     *   lige nu så vi kan starte, senere rykker vi til det svenske". SINCE 2026-11-27 THE FORM IS AT
     *   FORMSPREE, so the page shows the `formspree` text ("Modtager: …"). The points below that
     *   name Netlify (the DPA's Exhibit I, "Netlify Forms stores submissions", "Transfer", "Not
     *   listed above", the dashboard in "Retention") describe the `netlify` text, which is no longer
     *   shown for this form; they are kept as the record of that text. The legal basis, the health
     *   hint and the condition on who reads the messages hold for every provider: read "Netlify
     *   Forms" there as "the provider's dashboard". What is different at Formspree, and open (see
     *   the comment at the top): no data processing agreement is published; its privacy policy
     *   forbids collecting "sensitive personal data" through the service; the IP address and
     *   browser details it keeps with each message are now named in the item itself; and
     *   "Opbevaring … Derefter sletter vi den" below is true only if the clinic deletes handled
     *   messages in the Formspree dashboard, which keeps everything until then (README).
     * - Fields: components/contact/ContactForm.tsx (name, email, phone, clinic, message; phone and
     *   clinic are optional), the same fields for every provider; while the form is at Netlify Forms
     *   also declared in public/__forms.html ("kontakt"). The mobile consent checkbox (design mc)
     *   was removed on 2026-11-26 (owner: "ja fjern krydset"), so the form collects no tick.
     * - Legal basis, rewritten 2026-11-26 after the owner rejected a ban on health information in the
     *   form ("virker dumt.. ingen sender hvis der ikke er mulighed for at sende?") and asked for a short
     *   reassurance instead (content/pages/contact.ts → form.fields.message.hint). The first version
     *   claimed explicit consent (art. 9, stk. 2, litra a) that the form never collects, and rested
     *   answering on two bases (art. 6, stk. 1, litra f and a). Workflow wf_bb2d5a45-700 (draft + a
     *   legal and a facts review, sources read at retsinformation.dk, eur-lex and datatilsynet.dk):
     *   - Answering: art. 6, stk. 1, litra f only, not consent: the data are needed to answer, and
     *     Datatilsynet ("Samtykke", maj 2021, 2.3) says to use another, more fitting basis than consent
     *     for what is necessary; a box that must be ticked to send is no free choice (art. 4, nr. 11,
     *     "frivillig"). Asking for consent and relying on legitimate interest is what Datatilsynet
     *     criticised in j.nr. 2019-32-0709 (Rejsekort). The mobile checkbox, which read like a consent
     *     ("Jeg accepterer …"), was therefore removed on 2026-11-26 (owner: "ja fjern krydset"); until
     *     then the text said plainly that the box was not the basis. (Art. 7, stk. 4 is not the reason:
     *     it covers consent to processing that is not necessary.)
     *   - Health information written in the message anyway: art. 9, stk. 2, litra h, jf.
     *     databeskyttelsesloven § 7, stk. 3 (LBK nr. 289 af 08/03/2024: "nødvendig med henblik på
     *     forebyggende sygdomsbekæmpelse, medicinsk diagnose, sygepleje eller patientbehandling eller
     *     forvaltning af læge- og sundhedstjenester", carried out "af en person inden for
     *     sundhedssektoren, der efter lovgivningen er undergivet tavshedspligt"; applied by
     *     Datatilsynet 10/02/2021, j.nr. 2019-32-0988). Cosmetic treatment is treatment of a patient
     *     (BEK nr. 1361 af 24/11/2025 om patientjournaler § 1, stk. 2; autorisationsloven § 71, stk. 4).
     *     CONDITION: only the practitioners (sundhedspersoner, sundhedsloven LBK nr. 896 af 05/10/2026
     *     § 6, stk. 1; tavshedspligt § 40) may read the submissions, in Netlify Forms and in any
     *     notification mailbox. A receptionist who only books is hardly a sundhedsperson (VEJ nr. 10248
     *     af 15/12/2025), and a confidentiality clause in a contract is not "efter lovgivningen". The
     *     owner has not yet said who reads them (README "Hvem læser beskederne?"), so the text does not
     *     promise it yet; if it is not only practitioners, access must be limited before launch.
     *     Dropping the art. 9 sentence would not help: without § 7, stk. 3 nothing in art. 9, stk. 2
     *     covers health details that arrive, and leaving it out would only hide that.
     *   - Rejected: art. 9, stk. 2, litra a (no explicit consent is collected) and litra e (a message
     *     to the clinic is not "tydeligvis offentliggjort af den registrerede").
     *   - Journal: answers with concrete advice are journalised (BEK nr. 1361 af 24/11/2025 § 15, nr. 1
     *     og 10, § 35: at least 10 years), so "Helbredsoplysninger" and "Opbevaring" point to sections 3
     *     and 6.
     *   - Residual risk: Netlify's DPA (Last Updated: November 13, 2026), Exhibit I, point 4 ("Sensitive
     *     Data Transferred (If Applicable)"): the customer must not submit special categories of personal
     *     data unless the agreement expressly permits it; § 2.3 makes the customer solely responsible for
     *     the legality of Customer Data. The hint lowers how much health information reaches Netlify, it
     *     does not stop it (README).
     * - Netlify Forms stores submissions (Netlify DPA, "Last Updated: November 13, 2026", § 1.6: Forms
     *   submissions are Customer Content; https://www.netlify.com/pdf/netlify-dpa.pdf).
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
    // 2026-11-26: the last sentence ("På mobil får vi desuden at vide, at du har sat kryds i feltet under
    // beskeden.") is gone with the mobile checkbox.
    // TODO: copy review
    {
      type: "paragraph",
      text: "Når du skriver til os via kontaktformularen, får vi dit navn, din e-mailadresse og din besked. Skriver du dit telefonnummer eller vælger du en klinik, får vi dem også.",
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
          "vores legitime interesse i at besvare de henvendelser, vi får, jf. GDPR artikel 6, stk. 1, litra f. Skriver du om dit helbred i beskeden, bruger vi oplysningerne på grundlag af GDPR artikel 9, stk. 2, litra h, jf. databeskyttelseslovens § 7, stk. 3.",
        ],
        // Same message as the hint at the message field (content/pages/contact.ts → form.fields.message.hint).
        // Who reads the messages is not promised here until the owner confirms it (see the comment above).
        [
          { text: "Helbredsoplysninger: ", strong: true },
          "du behøver ikke at skrive detaljer om dit helbred i beskeden. Skriv dit telefonnummer i formularen, så ringer vi dig op og tager en snak om det. Du kan også selv ringe til os på ",
          // Non-breaking spaces: the number never wraps inside the sentence.
          { text: site.contact.phone.replace(/ /g, "\u00a0"), href: site.contact.phoneHref },
          ". Skriver du om dit helbred i beskeden, bruger vi kun oplysningerne til at svare dig og følge op på din henvendelse. Er det vigtigt for en behandling hos os, skriver behandleren det i din journal (se afsnit 3).",
        ],
        [
          { text: "Opbevaring: ", strong: true },
          "vi gemmer din henvendelse, så længe det er nødvendigt for at besvare og følge op på den. Derefter sletter vi den. Det, der er skrevet i din journal, opbevarer vi som beskrevet i afsnit 6.",
        ],
        // By the contact form's provider (config/site.ts → forms.contact): formProcessorTexts above.
        formProcessorItem("contact"),
        // 2026-11-26: was "Tilbagetrækning" (withdrawing consent). With no consent there is nothing to
        // withdraw (art. 13, stk. 2, litra c); art. 6, stk. 1, litra f gives the right to object, which
        // must be shown clearly and separately (art. 21, stk. 4).
        [
          { text: "Indsigelse: ", strong: true },
          "du kan til enhver tid gøre indsigelse mod, at vi bruger dine oplysninger til at besvare din henvendelse. Skriv til os på ",
          { text: site.contact.email, href: `mailto:${site.contact.email}` },
          ". Dine øvrige rettigheder står i afsnit 8.",
        ],
      ],
    },

    companyLines,
  ],
  aside: legalAside,
};

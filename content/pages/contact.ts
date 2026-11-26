import { site } from "@/config/site";
import type { FormName } from "@/lib/forms";
import { forms } from "../forms";
import { routes } from "../routes";
import type { Link } from "../types";
import { ui } from "../ui";
import { privacyContactFormAnchor } from "./legal";

/** The privacy policy's contact-form section ("14. Kontaktformular", content/pages/legal.ts). */
const privacyContactFormHref = `${routes.privacy}#${privacyContactFormAnchor}`;

/**
 * Copy for /kontakt (design 6ko desktop, mc mobile). Phone number and e-mail come
 * from config/site.ts; the clinics in "Besøg os" and in the form's clinic picker come
 * from content/clinics.ts.
 *
 * Where the mobile design words a text differently, the mobile version is in `*Short`.
 */

/** One of the three contact cards next to the form. */
export type ContactChannel = {
  id: string;
  /** Small uppercase label (desktop), e.g. "Ring til os". */
  label: string;
  /** Mobile label when it differs (mc swaps label and value on the on-call card). */
  labelShort?: string;
  /** Large value, e.g. the phone number. */
  value: string;
  valueShort?: string;
  /**
   * Right-hand note on desktop, e.g. "Man–fre 10–17 · Lør 10–14". Mobile shows an arrow
   * instead (linked cards) and keeps the note for screen readers only.
   */
  note: string;
  /** tel:/mailto:/page link. Omit for an information-only card (no link, no arrow). */
  href?: string;
  /**
   * "plain": white card. "accent": rose band card on desktop (6ko's dark accent card), sand card on
   * mobile (mc).
   */
  tone: "plain" | "accent";
};

export type ContactFormCopy = {
  /** Netlify form name; field names must match public/__forms.html. */
  formName: FormName;
  /**
   * Where the form posts without JavaScript: a static file in public/, so Netlify Forms
   * stores the submission and serves that file, which forwards to the thank-you page
   * (app/kontakt/tak). With JavaScript the form posts via lib/forms.ts instead.
   */
  noJsAction: string;
  title: string;
  fields: {
    name: { label: string; placeholder: string; placeholderShort: string };
    phone: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    clinic: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
  };
  consent: {
    /** The box's label: "{label}{link}{end}"; the link opens the privacy policy's contact-form section. */
    label: string;
    link: Link;
    end: string;
    /** Value submitted when the box is ticked. */
    value: string;
    /** The consent box is only in the mobile design (mc); 6ko has five fields and no checkbox. */
    showOnDesktop: boolean;
  };
  /**
   * Fine-print line above the button where the consent box is hidden (from 768px while
   * `consent.showOnDesktop` is false): "{text} {link}{end}", the same privacy-policy section.
   */
  privacy: { text: string; link: Link; end: string };
  submit: string;
  sending: string;
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    phoneInvalid: string;
    messageRequired: string;
    consentRequired: string;
    submit: string;
  };
  success: { title: string; text: string; again: string };
};

const phoneNoBreak = site.contact.phone.replace(/ /g, " ");

export const contactPage = {
  meta: {
    title: "Kontakt",
    // TODO: copy review (meta description is not in the design; built from the hero text)
    description: `Spørgsmål til en behandling eller en booking? Ring på ${site.contact.phone}, skriv til ${site.contact.email} eller send os en besked, så svarer en behandler dig.`,
  },

  hero: {
    eyebrow: "Kontakt",
    title: "Vi hjælper dig gerne",
    intro:
      "Har du spørgsmål til en behandling, en booking eller et resultat? Skriv eller ring, så svarer en af vores behandlere dig.",
    introShort: "Ring, skriv eller send os en besked herunder. Vi svarer inden for én hverdag.",
  },

  // TODO: copy review (accessible name of the contact card list; not in the design)
  channelsLabel: "Kontaktmuligheder",

  channels: [
    {
      id: "phone",
      label: ui.callUs,
      value: site.contact.phone,
      // Telephone hours, fillox.dk/kontakt + footer: "Telefontiden: Man – Fre: 10 – 17,
      // Lørdag: 10 – 14, Søndag: Lukket".
      note: "Man–fre 10–17 · Lør 10–14",
      href: site.contact.phoneHref,
      tone: "plain",
    },
    {
      id: "email",
      label: ui.writeUs,
      value: site.contact.email,
      // The design's 6ko card said "Svar inden for 24 timer", the mobile intro (mc) and the thank-you
      // text "én hverdag": one promise on the whole site, the one already in two places (README).
      // TODO: copy review (the owner's reply-time commitment)
      note: "Svar inden for én hverdag",
      href: site.contact.emailHref,
      tone: "plain",
    },
    {
      id: "on-call",
      label: "Efter en behandling",
      labelShort: "Vagtlæge 24/7",
      value: "Vagtlæge 24/7",
      valueShort: "Efter din behandling",
      // fillox.dk/kontakt: "AKUT ASSISTANCE 24/7, Telefon: 35 10 00 50" and a "Ring AKUT
      // TELEFON" button to the same number, so the card (an arrow on mobile, mc) calls it.
      note: `Akuttelefon ${site.contact.phone}`,
      href: site.contact.phoneHref,
      tone: "accent",
    },
  ] satisfies ContactChannel[],

  form: {
    formName: forms.contact,
    noJsAction: "/__kontakt-sendt.html",
    title: "Send en besked",
    fields: {
      name: { label: "Navn", placeholder: "Dit navn", placeholderShort: "Dit fulde navn" },
      phone: { label: "Telefon", placeholder: "+45" },
      email: { label: "E-mail", placeholder: "din@email.dk" },
      clinic: { label: "Klinik", placeholder: "Vælg klinik" },
      message: { label: "Besked", placeholder: "Hvad kan vi hjælpe med?" },
    },
    consent: {
      // Design mc: "Jeg accepterer, at Fillox gemmer mine oplysninger for at besvare min henvendelse."
      // The words "som beskrevet i privatlivspolitikken" and the link to "14. Kontaktformular" are new:
      // owner 2026-11-26 ("ret det hele som du har skrevet til mig", point 3 of the pre-launch audit;
      // GDPR art. 13: the information is given where the data is collected).
      // TODO: copy review (2026-11-26)
      label: `Jeg accepterer, at ${site.name} gemmer mine oplysninger for at besvare min henvendelse, som beskrevet i `,
      link: { label: "privatlivspolitikken", href: privacyContactFormHref },
      end: ".",
      // TODO: copy review (submitted value; not visible)
      value: "Ja",
      // TODO: copy review — decide whether desktop should also ask for consent (6ko has no checkbox).
      showOnDesktop: false,
    },
    // Not in the design (6ko has no consent box): the desktop form's link to the same section, worded
    // like the newsletter's line ("Vi bruger kun din e-mail til nyhedsbrevet, … Læs vores
    // privatlivspolitik."). Owner 2026-11-26, point 3 of the pre-launch audit.
    // TODO: copy review (2026-11-26)
    privacy: {
      text: "Vi bruger dine oplysninger til at besvare din henvendelse.",
      link: { label: "Læs mere i vores privatlivspolitik", href: privacyContactFormHref },
      end: ".",
    },
    submit: "Send besked",
    // TODO: copy review (states below are not in the design)
    sending: "Sender …",
    errors: {
      nameRequired: "Skriv dit navn.",
      emailRequired: "Skriv din e-mail, så vi kan svare dig.",
      emailInvalid: "Tjek, at e-mailen er skrevet rigtigt.",
      phoneInvalid: "Tjek, at telefonnummeret er skrevet rigtigt.",
      messageRequired: "Skriv, hvad vi kan hjælpe med.",
      consentRequired: "Sæt kryds, så vi må gemme dine oplysninger og svare dig.",
      submit: `Vi kunne ikke sende din besked. Prøv igen, eller ring til os på ${phoneNoBreak}.`,
    },
    /** Shown in place of the form after sending, and as the /kontakt/tak page (no-JS fallback). */
    success: {
      title: "Tak for din besked",
      // Same promise as the mobile intro (mc: "Vi svarer inden for én hverdag") and the e-mail card
      // (6ko's "Svar inden for 24 timer" changed to match).
      text: "Vi har modtaget din henvendelse, og en af vores behandlere svarer dig inden for én hverdag.",
      again: "Send en ny besked",
    },
  } satisfies ContactFormCopy,

  /** Clinic list under the form (6ko; not in the mobile design, where the footer lists them). */
  visit: {
    title: "Besøg os",
  },
};

export type ContactPageCopy = typeof contactPage;

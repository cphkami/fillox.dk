import { site } from "@/config/site";
import type { FormName } from "@/lib/forms";
import { ui } from "../ui";

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
   * Right-hand note on desktop, e.g. "Hverdage 10–20". Mobile shows an arrow instead (linked
   * cards) and keeps the note for screen readers only.
   */
  note: string;
  /** tel:/mailto:/page link. Omit for an information-only card (no link, no arrow). */
  href?: string;
  /**
   * "plain": white card. "accent": plum card on desktop (6ko), sand card on mobile (mc).
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
    label: string;
    /** Value submitted when the box is ticked. */
    value: string;
    /** The consent box is only in the mobile design (mc); 6ko has five fields and no checkbox. */
    showOnDesktop: boolean;
  };
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
      note: "Hverdage 10–20",
      href: site.contact.phoneHref,
      tone: "plain",
    },
    {
      id: "email",
      label: ui.writeUs,
      value: site.contact.email,
      note: "Svar inden for 24 timer",
      href: site.contact.emailHref,
      tone: "plain",
    },
    {
      id: "on-call",
      label: "Efter en behandling",
      labelShort: "Vagtlæge 24/7",
      value: "Vagtlæge 24/7",
      valueShort: "Efter din behandling",
      note: "Nummer i din bekræftelse",
      // TODO: copy review — the mobile design (mc) gives this card an arrow but no target, and
      // the on-call number is only in the booking confirmation. Until Fillox gives a page or
      // number to link to, it is an information card without a link (add `href` to link it).
      tone: "accent",
    },
  ] satisfies ContactChannel[],

  form: {
    formName: "kontakt",
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
      label: `Jeg accepterer, at ${site.name} gemmer mine oplysninger for at besvare min henvendelse.`,
      // TODO: copy review (submitted value; not visible)
      value: "Ja",
      // TODO: copy review — decide whether desktop should also ask for consent (6ko has no checkbox).
      showOnDesktop: false,
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
      // Same promise as the mobile intro (mc: "Vi svarer inden for én hverdag"). Note that the
      // 6ko e-mail card says "Svar inden for 24 timer"; both are design copy.
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

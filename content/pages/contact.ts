import { site } from "@/config/site";
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

/**
 * The form's copy. Its name, where it posts (with and without JavaScript) and its hidden control
 * fields are not copy: lib/forms.ts → formPost("contact") / submitForm("contact"), from
 * content/forms.ts and config/site.ts → forms.contact.
 */
export type ContactFormCopy = {
  title: string;
  fields: {
    name: { label: string; placeholder: string; placeholderShort: string };
    phone: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    clinic: { label: string; placeholder: string };
    /**
     * `hint`: a short line with the message field (not in the design), linked to the textarea with
     * aria-describedby.
     */
    message: { label: string; placeholder: string; hint?: string };
  };
  /**
   * Fine-print line above the button at every width: "{text} {link}{end}", linking to the privacy
   * policy's contact-form section. The mobile design (mc) had a consent checkbox here; it was removed
   * on 2026-11-26 (see `privacy` in the copy below).
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
    submit: string;
  };
  success: { title: string; text: string; again: string };
  /**
   * Only when the contact form's provider cannot be posted to without JavaScript (config/site.ts
   * → forms.contact: Formspree, which is sent with fetch only; lib/forms.ts → formPost): the line
   * under the disabled button, shown without JavaScript and on a page that has still not started
   * 8 seconds after it loaded (a blocked or failed script): "{text} {phone}{or} {email}{end}",
   * the two other ways to reach the clinic.
   */
  noScript: { text: string; phone: Link; or: string; email: Link; end: string };
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
    title: "Send en besked",
    fields: {
      name: { label: "Navn", placeholder: "Dit navn", placeholderShort: "Dit fulde navn" },
      phone: { label: "Telefon", placeholder: "+45" },
      email: { label: "E-mail", placeholder: "din@email.dk" },
      clinic: { label: "Klinik", placeholder: "Vælg klinik" },
      message: {
        label: "Besked",
        placeholder: "Hvad kan vi hjælpe med?",
        // Owner 2026-11-26: no ban on health information in the form ("virker dumt.. ingen sender hvis
        // der ikke er mulighed for at sende?"), a short reassurance instead ("du behøves ikke at skrive
        // personlig oplysnigner, vi ringer til dig og tager en snak om det"). "Detaljer om dit helbred",
        // not "personlige oplysninger": name and e-mail are personal data too, and required. The call
        // depends on the optional phone field. Privacy policy section 14 ("Helbredsoplysninger") says
        // the same. No-break space before the dash, as in content/pages/about.ts.
        // TODO: copy review (2026-11-26)
        hint: "Du behøver ikke at skrive detaljer om dit helbred\u00a0– giv os dit nummer, så ringer vi og tager en snak om det.",
      },
    },
    // Not in the design: the form's link to privacy policy section 14, worded like the newsletter's line
    // ("Vi bruger kun din e-mail til nyhedsbrevet, … Læs vores privatlivspolitik."). Owner 2026-11-26,
    // point 3 of the pre-launch audit (GDPR art. 13: the information is given where the data is
    // collected). First desktop only; since the mobile consent box was removed it shows at every width.
    // The removed box (design mc): "Jeg accepterer, at Fillox gemmer mine oplysninger for at besvare min
    // henvendelse." Owner 2026-11-26: "ja fjern krydset", after section 14 stopped resting on consent
    // (answering: GDPR art. 6, stk. 1, litra f), so the box was not a consent and added nothing but a
    // step before sending.
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
    // Not in the design. Shown only while the form can be sent with JavaScript alone: today,
    // because the contact form is at Formspree (owner 2026-11-27: "Formspree alligevel" and "det
    // bare lige nu så vi kan starte, senere rykker vi til det svenske"), and a form posted there
    // without JavaScript would end on a page at formspree.io. Worded like the newsletter's line
    // (content/layout.ts → footer.newsletter.noScript); phone and e-mail from config/site.ts.
    // Not shown with Netlify Forms or Formward, which take the plain POST.
    // TODO: copy review (2026-11-27)
    noScript: {
      text: "Formularen kan kun sendes med JavaScript slået til. Ring til os på",
      phone: { label: phoneNoBreak, href: site.contact.phoneHref },
      or: ", eller skriv til",
      email: { label: site.contact.email, href: site.contact.emailHref },
      end: ", så hjælper vi dig.",
    },
  } satisfies ContactFormCopy,

  /** Clinic list under the form (6ko; not in the mobile design, where the footer lists them). */
  visit: {
    title: "Besøg os",
  },
};

export type ContactPageCopy = typeof contactPage;

/**
 * The site's forms, provider-neutral. Components call three things and never know where a
 * form's submissions go:
 *
 * - formPost(kind): the `<form>` attributes for the plain POST without JavaScript (or before
 *   hydration): name, action, hidden inputs, the honeypot's field name and how it is hidden;
 * - submitForm(kind, fields, honeypot): the POST with JavaScript; resolves when the provider
 *   accepted the submission, throws otherwise (also after SUBMIT_TIMEOUT_MS without an answer);
 * - formNeedsConfirmation(kind): whether the visitor must confirm by e-mail (double opt-in), so
 *   the receipt can say so;
 * - honeypotValue(kind, formData) and isValidEmail().
 *
 * The provider of each form is market config (config/site.ts → forms; config/types.ts →
 * FormsConfig): Netlify Forms, Formward, Formspree or, for the newsletter, Klaviyo. Each
 * provider's hosts, field names and API revision are config/formProviders.ts. Adding a provider =
 * a variant in FormsConfig + a case in each switch below (the `never` default makes TypeScript
 * list them). ARCHITECTURE.md → "Forms providers" has the table.
 */
import {
  formspree,
  formward,
  klaviyo,
  netlifyForms,
  unknownFormProvider,
} from "@/config/formProviders";
import { site } from "@/config/site";
import type { FormKind } from "@/config/types";
import { forms, netlifyNoJsActions } from "@/content/forms";
import { routes } from "@/content/routes";

/**
 * The fields each form sends: the names stored at the provider (Netlify Forms: also the inputs
 * declared in public/__forms.html) and read by the Klaviyo call below, so they are a contract.
 * `source` is where the visitor signed up ("footer:/priser", "blog:/blog").
 */
export type FormFields = {
  contact: { name: string; email: string; phone: string; clinic: string; message: string };
  newsletter: { email: string; source: string };
};

/** The thank-you page a plain POST (no JavaScript) ends on (Netlify Forms, Formward). */
const thanksRoutes: Record<FormKind, string> = {
  contact: routes.contactThanks,
  newsletter: routes.newsletterThanks,
};

/**
 * Honeypot field name where the provider has none of its own (Klaviyo): the value never leaves
 * the browser, submitForm() only looks at it.
 */
const LOCAL_HONEYPOT_FIELD = "bot-field";

export type FormPost = {
  /** `<form name>`: the market's name of the form (content/forms.ts). */
  name: string;
  /**
   * `<form action>` of the plain POST, or `undefined` when the provider cannot take one: then the
   * form can only be sent with JavaScript, and the component keeps its submit button disabled
   * until React runs (a disabled default button also blocks Enter), so nothing the visitor typed
   * is ever posted to this site's own host or put in a URL.
   */
  action: string | undefined;
  /** Hidden inputs that only the plain POST needs (the provider's control fields). */
  hidden: { name: string; value: string }[];
  /** Name of the spam honeypot field (components/ui/HoneypotField). */
  honeypot: string;
  /**
   * How the honeypot is kept from people: `false` = the `hidden` attribute (display: none),
   * `true` = positioned off-screen. Formward's field reference asks for the second ("hide it with
   * CSS (not display:none, which some bots detect)", https://formward.eu/docs/fields); Formspree,
   * whose honeypot has the same name, gets the same.
   */
  honeypotOffscreen: boolean;
};

/**
 * How a form is rendered for its provider (config/site.ts → forms):
 * - netlify: POST to the form's static file in public/ (content/forms.ts → netlifyNoJsActions),
 *   which Netlify serves after storing the submission and which forwards to the thank-you page;
 *   `form-name` tells Netlify which form it is.
 * - formward: POST straight to the form's endpoint; `_redirect` is the thank-you route as a
 *   relative path, which Formward always accepts and resolves against the page's origin, so it
 *   also works on the netlify.app preview (an absolute URL is ignored unless its origin is in
 *   the form's allowed-origins list: config/formProviders.ts).
 * - formspree: no action, on purpose. Formspree does take a plain POST, but answers it with its
 *   own "Thank You" page on formspree.io, which loads Google's tag and a Cloudflare beacon and
 *   sets a cookie (a redirect back to the site is a setting of the paid plans). So the form is
 *   only ever sent with fetch, and without JavaScript the component shows a line with another
 *   way to reach the clinic (config/formProviders.ts → formspree).
 * - klaviyo: no action. Klaviyo documents no plain form POST; the signup needs JavaScript.
 */
export function formPost(kind: FormKind): FormPost {
  const backend = site.forms[kind];
  const name = forms[kind];
  switch (backend.provider) {
    case "netlify":
      return {
        name,
        action: netlifyNoJsActions[kind],
        hidden: [{ name: netlifyForms.formNameField, value: name }],
        honeypot: netlifyForms.honeypotField,
        honeypotOffscreen: false,
      };
    case "formward":
      return {
        name,
        action: backend.endpoint,
        hidden: [{ name: formward.redirectField, value: thanksRoutes[kind] }],
        honeypot: formward.honeypotField,
        honeypotOffscreen: true,
      };
    case "formspree":
      return { name, action: undefined, hidden: [], honeypot: formspree.honeypotField, honeypotOffscreen: true };
    case "klaviyo":
      return { name, action: undefined, hidden: [], honeypot: LOCAL_HONEYPOT_FIELD, honeypotOffscreen: false };
    default:
      return unknownFormProvider(backend);
  }
}

/** What the honeypot field of a submitted form holds (people leave it empty, bots fill it in). */
export function honeypotValue(kind: FormKind, data: FormData): string {
  return String(data.get(formPost(kind).honeypot) ?? "");
}

/**
 * Whether a submission only counts once the visitor has confirmed it by e-mail: the newsletter at
 * Klaviyo on a double opt-in list (config/site.ts → forms.newsletter.optIn, which mirrors the
 * list's own "Opt-in process" setting). Klaviyo answers 202 either way, so the form's receipt
 * must be the one that asks for the confirmation (NewsletterForm: `copy.successConfirm`).
 */
export function formNeedsConfirmation(kind: FormKind): boolean {
  const backend = site.forms[kind];
  return backend.provider === "klaviyo" && backend.optIn === "double";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Loose e-mail check for inline validation: no spaces, one "@", a dot in the domain. */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

const failed = (status: number, detail?: string) =>
  new Error(`Form submission failed (${status}${detail ? `: ${detail}` : ""})`);

/**
 * How long a submission may take, the answer's body included. A provider on another host
 * (Formward is one server; Formspree; Klaviyo) can accept the connection and never answer:
 * without a limit the form would stay on "Sender …" for good, with no error and no phone number
 * or e-mail to fall back on.
 */
const SUBMIT_TIMEOUT_MS = 15_000;

/**
 * Sends a form to its provider; resolves when the provider accepted it and throws when it did
 * not: an error answer, no answer at all (fetch rejects), or no answer within SUBMIT_TIMEOUT_MS
 * (the request is aborted). Never retries by itself. After a timeout the provider may still
 * have stored the submission (the answer was lost, not necessarily the request), so a visitor
 * who sends again can leave a second copy, as after Formward's 500 (the same at Formspree).
 *
 * `fields` are the form's own fields (FormFields); `honeypot` is honeypotValue(): Netlify,
 * Formward and Formspree get it under their own field name and file or drop a filled one
 * themselves; for Klaviyo, which has no honeypot, a filled one counts as sent without any request.
 */
export async function submitForm<K extends FormKind>(kind: K, fields: FormFields[K], honeypot: string): Promise<void> {
  // AbortController + a timer, not AbortSignal.timeout(): the same in every browser that runs the page.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
  try {
    await send(kind, fields, honeypot, controller.signal);
  } finally {
    clearTimeout(timer);
  }
}

/** submitForm() without the time limit: one request to the form's provider, aborted by `signal`. */
async function send(kind: FormKind, fields: Record<string, string>, honeypot: string, signal: AbortSignal): Promise<void> {
  const backend = site.forms[kind];
  switch (backend.provider) {
    case "netlify": {
      // Url-encoded to the detection file, with the form's name (public/__forms.html).
      const res = await fetch(netlifyForms.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal,
        body: new URLSearchParams({
          [netlifyForms.formNameField]: forms[kind],
          ...fields,
          [netlifyForms.honeypotField]: honeypot,
        }).toString(),
      });
      if (!res.ok) throw failed(res.status);
      return;
    }

    case "formward": {
      // A URLSearchParams body is sent url-encoded; with only the Accept header added the request
      // stays CORS-simple (no preflight). `_redirect` is left out: it is ignored in JSON mode.
      const res = await fetch(backend.endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        signal,
        body: new URLSearchParams({ ...fields, [formward.honeypotField]: honeypot }),
      });
      // 200 { ok: true, id, files }; every error is { ok: false, error } with a 4xx / 5xx status.
      const answer: unknown = await res.json().catch(() => null);
      const body = (typeof answer === "object" && answer !== null ? answer : {}) as { ok?: unknown; error?: unknown };
      if (!res.ok || body.ok !== true) throw failed(res.status, typeof body.error === "string" ? body.error : undefined);
      return;
    }

    case "formspree": {
      // Formspree's own fetch recipe: a FormData body (multipart; the browser writes the
      // Content-Type with its boundary) and one header, Accept, so the request stays CORS-simple
      // (no preflight). Only the form's own fields and the honeypot: every named field is stored
      // and e-mailed. `credentials: "omit"`: no formspree.io cookie is sent or stored.
      const body = new FormData();
      for (const [name, value] of Object.entries(fields)) body.append(name, value);
      body.append(formspree.honeypotField, honeypot);
      const res = await fetch(backend.endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "omit",
        signal,
        body,
      });
      // Sent = a 2xx status AND a JSON object without `errors` (an array) or `error` (a string):
      // the recipe looks at the status, Formspree's client at the body, so both must agree. An
      // error is { error, errors: [{ message, code?, field? }] } with 404 (no such form), 429
      // (rate limit) or another status; a body that is not a JSON object is not the documented
      // answer either (config/formProviders.ts → formspree). Every failure is the form's one
      // submit error in the site's own words: `message` is English and is never shown, only the
      // codes go into the thrown error.
      const answer: unknown = await res.json().catch(() => null);
      const json =
        typeof answer === "object" && answer !== null && !Array.isArray(answer)
          ? (answer as { error?: unknown; errors?: unknown })
          : null;
      const rejected = json === null || typeof json.error === "string" || Array.isArray(json.errors);
      if (!res.ok || rejected) throw failed(res.status, formspreeErrorCodes(json?.errors));
      return;
    }

    case "klaviyo": {
      if (honeypot.trim()) return;
      const res = await fetch(
        `${klaviyo.origin}${klaviyo.subscriptionsPath}?company_id=${encodeURIComponent(backend.companyId)}`,
        {
          method: "POST",
          headers: { accept: klaviyo.mediaType, "content-type": klaviyo.mediaType, revision: klaviyo.revision },
          signal,
          body: JSON.stringify(klaviyoSubscription(backend.listId, fields.email, fields.source)),
        },
      );
      // The documented success is 202 Accepted with no body (any 2xx counts): accepted, processed
      // later, and on a double opt-in list not subscribed until the visitor confirms
      // (formNeedsConfirmation). Everything else (400 invalid input, 429 rate limit with
      // Retry-After, 5xx) is a failure, which the form shows as its submit error; the visitor
      // decides whether to try again.
      if (!res.ok) throw failed(res.status);
      return;
    }

    default:
      return unknownFormProvider(backend);
  }
}

/** The `code` of each error in a Formspree answer ("FORM_NOT_FOUND", "TYPE_EMAIL"), for the thrown error only. */
function formspreeErrorCodes(errors: unknown): string | undefined {
  if (!Array.isArray(errors)) return undefined;
  const codes = errors
    .map((error: unknown) => (typeof error === "object" && error !== null ? (error as { code?: unknown }).code : undefined))
    .filter((code): code is string => typeof code === "string");
  return codes.length ? codes.join(", ") : undefined;
}

/**
 * JSON:API body of Klaviyo's "Create Client Subscription" (config/formProviders.ts → klaviyo):
 * the e-mail address, subscribed to e-mail marketing only, added to the list (whose own setting
 * decides single or double opt-in). `custom_source` is stored on the consent record: where the
 * visitor signed up ("footer:/priser"). No `consented_at`: Klaviyo stamps the time itself and
 * rejects a value without its historical-import flag.
 */
function klaviyoSubscription(listId: string, email: string, source: string) {
  return {
    data: {
      type: "subscription",
      attributes: {
        custom_source: source,
        profile: {
          data: {
            type: "profile",
            attributes: {
              email,
              subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
            },
          },
        },
      },
      relationships: { list: { data: { type: "list", id: listId } } },
    },
  };
}

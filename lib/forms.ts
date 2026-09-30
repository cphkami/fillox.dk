/**
 * Form submissions go to Netlify Forms (Next.js runtime v5 pattern):
 * every form is declared once in public/__forms.html so Netlify detects it at
 * deploy time, and the client POSTs url-encoded data to that static file.
 *
 * The form names are market content (content/forms.ts). When adding a form: add its name
 * there and a matching <form name="…" data-netlify="true"> with the same field names to
 * public/__forms.html (`npm run check:market` checks the names).
 */
import type { FormName } from "@/content/forms";

export type { FormName };

/**
 * Netlify's spam honeypot (netlify-honeypot="bot-field" on every form in public/__forms.html):
 * a field hidden from people that bots fill in. Rendered by components/ui/HoneypotField.
 */
export const HONEYPOT_FIELD = "bot-field";

/** The honeypot's submitted value, to spread into the data passed to submitForm(). */
export function honeypotValue(data: FormData): Record<string, string> {
  return { [HONEYPOT_FIELD]: String(data.get(HONEYPOT_FIELD) ?? "") };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Loose e-mail check for inline validation: no spaces, one "@", a dot in the domain. */
export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

/** POSTs a form to Netlify Forms (url-encoded, with its `form-name`); throws when it fails. */
export async function submitForm(formName: FormName, data: Record<string, string>): Promise<void> {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Form submission failed (${res.status})`);
}

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

export async function submitForm(formName: FormName, data: Record<string, string>): Promise<void> {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Form submission failed (${res.status})`);
}

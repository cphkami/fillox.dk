import { HONEYPOT_FIELD } from "@/lib/forms";

/**
 * Netlify's spam honeypot field (lib/forms.ts → HONEYPOT_FIELD): hidden from people, filled by
 * bots. Place it inside every <form> that posts to Netlify Forms and submit its value with
 * `honeypotValue(formData)`.
 */
export function HoneypotField() {
  return (
    <p hidden>
      <label>
        {`${HONEYPOT_FIELD} `}
        <input name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  );
}

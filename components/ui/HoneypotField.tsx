/**
 * The spam honeypot field: kept from people, filled in by bots. Place it inside every <form>
 * with the field name and the hiding of the form's provider (lib/forms.ts → formPost(kind):
 * `honeypot`, `honeypotOffscreen`) and pass its submitted value to submitForm() with
 * `honeypotValue(kind, formData)`. Netlify Forms and Formward file a filled one as spam
 * themselves, Formspree drops the submission; for Klaviyo lib/forms.ts stops the request.
 *
 * Two ways to hide it:
 * - the `hidden` attribute (display: none), as Netlify's own examples do;
 * - `offscreen`, for Formward, whose field reference asks for it ("hide it with CSS (not
 *   display:none, which some bots detect)", https://formward.eu/docs/fields), and for Formspree,
 *   whose honeypot has the same name (its docs: "it's best to hide the input with a CSS class"):
 *   the input is absolutely positioned far to the left with opacity 0, so it takes no room in
 *   the form's layout and causes no scrolling; `aria-hidden` and `tabIndex={-1}` keep it from
 *   screen readers and from the tab order, `autoComplete="off"` from the browser's autofill.
 */
export function HoneypotField({ name, offscreen = false }: { name: string; offscreen?: boolean }) {
  if (offscreen) {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] opacity-0">
        <input type="text" name={name} tabIndex={-1} autoComplete="off" />
      </div>
    );
  }
  return (
    <p hidden>
      <label>
        {`${name} `}
        <input name={name} tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  );
}

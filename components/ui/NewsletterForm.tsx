"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { newsletterNoJsAction } from "@/content/forms";
import { cn } from "@/lib/cn";
import { honeypotValue, isValidEmail, submitForm, type FormName } from "@/lib/forms";
import { useHydrated } from "@/lib/useHydrated";
import { buttonClasses } from "./Button";
import { HoneypotField } from "./HoneypotField";

/** The form's copy (content/layout.ts → footer.newsletter, content/pages/blog.ts → newsletter). */
export type NewsletterFormCopy = {
  formName: FormName;
  placeholder: string;
  submit: string;
  /** Accessible label of the e-mail field (visually hidden; the placeholder shows it). */
  emailLabel: string;
  /** Accessible name of the form. */
  formLabel: string;
  sending: string;
  errors: { emailRequired: string; emailInvalid: string; submit: string };
  success: { title: string; text: string };
  /** The line under the field: "{text} {link}{end}", e.g. "Du kan altid afmelde dig. Læs vores privatlivspolitik." */
  privacy: { text: string; link: { label: string; href: string }; end?: string };
};

/**
 * Colours of the surface the form sits on: the rose band (/blog) or the beige footer.
 * `field`: the white field's 1px border, ≥ 3:1 against the surface at rest (WCAG 1.4.11; the white
 * alone is 1.6:1 on the footer, 2.2:1 on the band). The border is drawn over the field's white, so
 * the alpha is mixed with white: footer-accent 75% → 3.7:1 on the footer, band-accent 85% → 3.5:1
 * on the band. Full accent on hover; the accent ring on focus.
 */
const tones = {
  band: {
    field: "border-band-accent/85 hover:border-band-accent",
    error: "text-band-accent",
    note: "text-band-fine",
    link: "text-on-band hover:text-band-accent",
    successTitle: "text-on-band",
    successText: "text-band-body",
  },
  footer: {
    field: "border-footer-accent/75 hover:border-footer-accent",
    error: "text-footer-accent",
    note: "text-footer-body",
    link: "text-on-footer hover:text-footer-accent",
    successTitle: "text-on-footer",
    successText: "text-footer-body",
  },
} as const;

type NewsletterFormProps = {
  copy: NewsletterFormCopy;
  tone: keyof typeof tones;
  /** Where the form is ("footer", "blog"): sent with the page path as `source`, a record of the consent. */
  placement: string;
  /** Id of the text above the form (heading excluded) that says what the visitor signs up for. */
  describedBy?: string;
  className?: string;
};

type Status = "idle" | "sending" | "success";

/**
 * Newsletter signup (e-mail + "Tilmeld"), shared by the footer of every page and the /blog band.
 * Posts to Netlify Forms (`copy.formName`, declared in public/__forms.html with the fields email,
 * source and the honeypot) via lib/forms.ts, with inline validation: an empty or malformed
 * address moves focus back to the field with the error under it; a failed POST shows an alert;
 * success replaces the form with a focused status message.
 *
 * Consent: signing up is the visitor's own action (no pre-ticked box), the text above the form
 * says what they will receive, and the line under it says the address is only used for the
 * newsletter, that they can always unsubscribe, and links to the privacy policy's newsletter
 * section (routes.privacyNewsletter: purpose, legal basis, retention, processors, unsubscribing).
 * Without JavaScript (or before hydration) the browser validates the field (`noValidate` is only
 * set once React runs) and the form POSTs straight to Netlify (content/forms.ts →
 * newsletterNoJsAction, which forwards to routes.newsletterThanks), so the address never lands
 * in the URL.
 *
 * Layout: stacked below 768px (52px field and button, full width), one row from 768px; the error
 * and the note line up with the field's text (`md:px-6`). The field is 16px below 1280px (no iOS
 * zoom on focus) and 18px at 1600 (`text-body`).
 */
export function NewsletterForm({ copy, tone, placement, describedBy, className }: NewsletterFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef<"input" | "success" | null>(null);
  const pathname = usePathname();
  const source = `${placement}:${pathname}`;
  const colors = tones[tone];
  const hydrated = useHydrated();

  const uid = useId();
  const ids = { email: `${uid}-email`, error: `${uid}-error`, privacy: `${uid}-privacy` };

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (target === "input") inputRef.current?.focus();
    else if (target === "success") successRef.current?.focus();
  });

  const sending = status === "sending";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();

    const nextError = !email ? copy.errors.emailRequired : !isValidEmail(email) ? copy.errors.emailInvalid : null;
    if (nextError) {
      focusNext.current = "input";
      setError(nextError);
      // Re-render even when the message is unchanged, so the effect moves focus back.
      setStatus("idle");
      return;
    }

    setError(null);
    setStatus("sending");
    try {
      await submitForm(copy.formName, { email, source, ...honeypotValue(data) });
      focusNext.current = "success";
      setStatus("success");
    } catch {
      setError(copy.errors.submit);
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={cn("focus:outline-none", className)}>
        <p className={cn("text-body font-semibold", colors.successTitle)}>{copy.success.title}</p>
        <p className={cn("mt-1 text-small leading-[1.6]", colors.successText)}>{copy.success.text}</p>
      </div>
    );
  }

  const fieldError = error && error !== copy.errors.submit;

  return (
    <form
      name={copy.formName}
      method="post"
      action={newsletterNoJsAction}
      aria-label={copy.formLabel}
      aria-describedby={cn(describedBy, ids.privacy)}
      // Native validation (required, type="email") until React runs, so the no-JS POST never sends
      // an empty or malformed address; then the inline validation below takes over.
      noValidate={hydrated}
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-3 md:gap-2.5", className)}
    >
      {/* Posted by the no-JS fallback; submitForm() adds the form name itself. */}
      <input type="hidden" name="form-name" value={copy.formName} />
      <input type="hidden" name="source" value={source} />
      <HoneypotField />

      <div className="flex flex-col gap-3 md:flex-row md:gap-2.5">
        <label htmlFor={ids.email} className="sr-only">
          {copy.emailLabel}
        </label>
        <input
          ref={inputRef}
          id={ids.email}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={copy.placeholder}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={error ? ids.error : undefined}
          onChange={() => {
            if (fieldError) setError(null);
          }}
          // 16px up to 1279px, like every input (no iOS zoom on focus), 18px at 1600 (text-body).
          // From 768px the row stretches the field to the button's height (53 / 55 / 56px).
          className={cn(
            "h-[52px] w-full min-w-0 rounded-full border bg-white px-5 text-[16px] text-ink transition-colors placeholder:text-placeholder aria-[invalid=true]:border-accent md:h-auto md:flex-1 md:px-6 md:py-3 xl:text-body",
            colors.field,
          )}
        />
        <button
          type="submit"
          aria-disabled={sending || undefined}
          className={cn(
            buttonClasses({ variant: "primary", size: "mdTight", mobileSize: "lg", fullWidth: "mobile" }),
            "md:py-[15px]!",
            sending && "cursor-progress opacity-70",
          )}
        >
          {sending ? copy.sending : copy.submit}
        </button>
      </div>

      {error ? (
        <p
          id={ids.error}
          role={fieldError ? undefined : "alert"}
          className={cn("text-fine leading-[1.5] font-semibold md:px-6", colors.error)}
        >
          {error}
        </p>
      ) : null}

      <p id={ids.privacy} className={cn("text-fine leading-[1.6] md:px-6", colors.note)}>
        {copy.privacy.text}{" "}
        <Link
          href={copy.privacy.link.href}
          className={cn("underline underline-offset-2 transition-colors xl:whitespace-nowrap", colors.link)}
        >
          {copy.privacy.link.label}
        </Link>
        {copy.privacy.end}
      </p>
    </form>
  );
}

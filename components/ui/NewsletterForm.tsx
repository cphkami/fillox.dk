"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { formNeedsConfirmation, formPost, honeypotValue, isValidEmail, submitForm } from "@/lib/forms";
import { useHydrated } from "@/lib/useHydrated";
import { buttonClasses } from "./Button";
import { HoneypotField } from "./HoneypotField";

/** The form's copy (content/layout.ts → footer.newsletter, content/pages/blog.ts → newsletter). */
export type NewsletterFormCopy = {
  placeholder: string;
  submit: string;
  /** Accessible label of the e-mail field (visually hidden; the placeholder shows it). */
  emailLabel: string;
  /** Accessible name of the form. */
  formLabel: string;
  sending: string;
  errors: { emailRequired: string; emailInvalid: string; submit: string };
  success: { title: string; text: string };
  /**
   * The receipt when the signup still has to be confirmed by e-mail (a double opt-in list at
   * Klaviyo: lib/forms.ts → formNeedsConfirmation); shown in place of `success`.
   */
  successConfirm: { title: string; text: string };
  /** The line under the field: "{text} {link}{end}", e.g. "Du kan altid afmelde dig. Læs vores privatlivspolitik." */
  privacy: { text: string; link: { label: string; href: string }; end?: string };
  /**
   * Only when the newsletter's provider cannot take a plain form POST (Klaviyo, Formspree):
   * shown without JavaScript, and on a page that has still not hydrated after 8 seconds (a
   * blocked or failed script): "{text} {link}{end}", another way to sign up (an e-mail to the
   * clinic).
   */
  noScript: { text: string; link: { label: string; href: string }; end?: string };
};

/**
 * The form's plain POST for its provider (config/site.ts → forms.newsletter): name, action, the
 * provider's hidden control fields and the honeypot's field name. A constant: the same in the
 * server HTML and in the browser. `action` is undefined when the provider needs JavaScript.
 */
const post = formPost("newsletter");
/** No plain POST at this provider: the form can only be sent once React runs (see below). */
const scriptOnly = post.action === undefined;
/** The provider only subscribes after a confirmation by e-mail: the receipt says so. */
const needsConfirmation = formNeedsConfirmation("newsletter");

/**
 * Colours of the surface the form sits on: the rosa band (/blog) or the footer (offwhite, the
 * header's colour). `field`: the white field's 1px border, ≥ 3:1 against the surface at rest (WCAG
 * 1.4.11; the white alone is 1.05:1 on the footer, 1.4:1 on the band). The border is drawn over the
 * field's white, so the alpha is mixed with white: footer-accent 90% → about 7:1 on the footer and
 * against the field, band-accent 85% → 4.2:1 on the band. Full accent on hover; the accent ring on focus.
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
    field: "border-footer-accent/90 hover:border-footer-accent",
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
 * Sends the fields email and source (and the honeypot) to the newsletter's provider via
 * lib/forms.ts (submitForm; the component does not know which provider: ARCHITECTURE.md →
 * "Forms providers"), with inline validation: an empty or malformed address moves focus back to
 * the field with the error under it; a failed request (or no answer within lib/forms.ts's time
 * limit) shows an alert; success replaces the form with a focused status message
 * (`copy.success`, or `copy.successConfirm` when the provider waits for a confirmation by e-mail).
 *
 * Consent: signing up is the visitor's own action (no pre-ticked box), the text above the form
 * says what they will receive, and the line under it says the address is only used for the
 * newsletter, that they can always unsubscribe, and links to the privacy policy's newsletter
 * section (routes.privacyNewsletter: purpose, legal basis, retention, processors, unsubscribing).
 * Without JavaScript (or before hydration) the browser validates the field (`noValidate` is only
 * set once React runs) and the form POSTs straight to the provider (`formPost("newsletter")`:
 * action and hidden control fields), which ends on routes.newsletterThanks, so the address never
 * lands in the URL. A provider without a plain POST (Klaviyo; Formspree, which the site never
 * posts to without JavaScript: lib/forms.ts → formPost) gives no action: the submit button
 * is then disabled until React runs (a disabled default button also blocks Enter), so the
 * address can never be posted to this site's own host or put in a URL, and a line
 * (`copy.noScript`) offers an e-mail to the clinic instead. How that state looks is CSS
 * (app/globals.css → `[data-script-only]`, set on the form until React runs): on a normal page
 * load nothing shows (the button keeps its look for the moment before hydration, the line is
 * hidden); without JavaScript the button looks disabled and the <noscript> copy of the line
 * shows; with JavaScript on but still no React after 8 seconds (a blocked or failed script, a
 * very slow connection) the button dims and the line (`data-script-only-note`) appears.
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
      await submitForm("newsletter", { email, source }, honeypotValue("newsletter", data));
      focusNext.current = "success";
      setStatus("success");
    } catch {
      setError(copy.errors.submit);
      setStatus("idle");
    }
  }

  if (status === "success") {
    const receipt = needsConfirmation ? copy.successConfirm : copy.success;
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={cn("focus:outline-none", className)}>
        <p className={cn("text-body font-semibold", colors.successTitle)}>{receipt.title}</p>
        <p className={cn("mt-1 text-small leading-[1.6]", colors.successText)}>{receipt.text}</p>
      </div>
    );
  }

  const fieldError = error && error !== copy.errors.submit;

  /** Another way to sign up, for a provider that needs JavaScript (see above); rendered twice below. */
  const scriptOnlyLine = scriptOnly ? (
    <>
      {copy.noScript.text}{" "}
      <a href={copy.noScript.link.href} className={cn("underline underline-offset-2 transition-colors", colors.link)}>
        {copy.noScript.link.label}
      </a>
      {copy.noScript.end}
    </>
  ) : null;
  const scriptOnlyLineClasses = cn("text-fine leading-[1.5] font-semibold md:px-6", colors.error);

  return (
    <form
      name={post.name}
      method="post"
      action={post.action}
      // Until React runs: how the disabled button and the fallback line look (app/globals.css).
      data-script-only={scriptOnly && !hydrated ? "" : undefined}
      aria-label={copy.formLabel}
      aria-describedby={cn(describedBy, ids.privacy)}
      // Native validation (required, type="email") until React runs, so the no-JS POST never sends
      // an empty or malformed address; then the inline validation below takes over.
      noValidate={hydrated}
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-3 md:gap-2.5", className)}
    >
      {/* The provider's control fields for the plain POST (no JavaScript); submitForm() sends its own. */}
      {post.hidden.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}
      <input type="hidden" name="source" value={source} />
      <HoneypotField name={post.honeypot} offscreen={post.honeypotOffscreen} />

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
          // A provider without a plain POST: no native submit before React runs (see above).
          disabled={scriptOnly && !hydrated ? true : undefined}
          aria-disabled={sending || undefined}
          className={cn(
            buttonClasses({ variant: "primary", size: "mdTight", mobileSize: "lg", fullWidth: "mobile" }),
            "md:py-[15px]!",
            // 80%, not 70%: "Sender…" (the only progress feedback) stays ≥ 5:1 on every surface.
            sending && "cursor-progress opacity-80",
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

      {scriptOnly ? (
        <>
          {/* Without JavaScript: at once, in every browser. */}
          <noscript>
            <p className={scriptOnlyLineClasses}>{scriptOnlyLine}</p>
          </noscript>
          {/* With JavaScript but no React yet: hidden, shown by CSS after 8 seconds; gone once React runs. */}
          {hydrated ? null : (
            <p data-script-only-note="" className={scriptOnlyLineClasses}>
              {scriptOnlyLine}
            </p>
          )}
        </>
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

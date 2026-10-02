"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Container, HoneypotField, buttonClasses } from "@/components/ui";
import { blogPage } from "@/content/pages/blog";
import { cn } from "@/lib/cn";
import { honeypotValue, isValidEmail, submitForm } from "@/lib/forms";
import { Responsive } from "./Responsive";

const copy = blogPage.newsletter;

type Status = "idle" | "sending" | "success";

/**
 * "Få tips og tilbud i din indbakke" band at the bottom of /blog (6blog: text left,
 * e-mail + "Tilmeld" right; mbl: stacked, full-width field and button). Posts to
 * Netlify Forms (`copy.formName`, declared in public/__forms.html) with inline validation.
 *
 * The design's pale rose band is the rose band here (`bg-band`, on-band text), not the
 * `secondary` beige: it sits directly above the beige footer, and the two beiges read as one
 * block. Rose over beige keeps the design's contrast between this band and the footer.
 */
export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef<"input" | "success" | null>(null);

  const uid = useId();
  const ids = {
    title: `${uid}-title`,
    text: `${uid}-text`,
    email: `${uid}-email`,
    error: `${uid}-error`,
    privacy: `${uid}-privacy`,
  };

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
      await submitForm(copy.formName, { email, ...honeypotValue(data) });
      focusNext.current = "success";
      setStatus("success");
    } catch {
      setError(copy.errors.submit);
      setStatus("idle");
    }
  }

  return (
    <Container gutter="surface" className="md:mt-fluid-48">
      <section
        aria-labelledby={ids.title}
        data-surface="band"
        className="flex flex-col gap-3 rounded-[24px] bg-band px-5 py-7 md:gap-8 md:p-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-fluid-48 lg:px-14 lg:py-fluid-56 xl:px-fluid-64/80"
      >
        <div className="flex flex-col gap-3">
          <h2
            id={ids.title}
            className="font-heading text-[28px] leading-[1.15] tracking-display text-balance text-on-band md:text-[32px] xl:text-h2-sm"
          >
            <Responsive mobile={copy.titleShort} desktop={copy.title} />
          </h2>
          <p id={ids.text} className="text-body leading-[1.7] text-band-body md:leading-[1.75]">
            <Responsive mobile={copy.textShort} desktop={copy.text} />
          </p>
        </div>

        {status === "success" ? (
          <div ref={successRef} tabIndex={-1} role="status" className="focus:outline-none">
            <p className="text-body font-semibold text-on-band">{copy.success.title}</p>
            <p className="mt-1 text-small leading-[1.6] text-band-body">{copy.success.text}</p>
          </div>
        ) : (
          <form
            name={copy.formName}
            aria-label={copy.formLabel}
            aria-describedby={`${ids.text} ${ids.privacy}`}
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-3 md:gap-2.5"
          >
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
                aria-invalid={error && error !== copy.errors.submit ? true : undefined}
                aria-describedby={error ? ids.error : undefined}
                onChange={() => {
                  if (error && error !== copy.errors.submit) setError(null);
                }}
                // 16px up to 1279px, like every input (no iOS zoom on focus), 18px at 1600 (text-body).
                // From 768px the row stretches the field to the button's height (53 / 55 / 56px).
                className="h-[52px] w-full min-w-0 rounded-full border border-transparent bg-white px-5 text-[16px] text-ink transition-colors placeholder:text-placeholder hover:border-line aria-[invalid=true]:border-accent md:h-auto md:flex-1 md:px-6 md:py-3 xl:text-body"
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
                role={error === copy.errors.submit ? "alert" : undefined}
                className="text-fine leading-[1.5] font-semibold text-band-accent md:px-6"
              >
                {error}
              </p>
            ) : null}

            {/* In the form's flow at every width: the field, error and note are one block, centred on
                the text column from lg (6blog has no note), so the band's padding always holds them. */}
            <p id={ids.privacy} className="text-fine leading-[1.6] text-band-fine md:px-6">
              {copy.privacy.text}{" "}
              <Link
                href={copy.privacy.link.href}
                className="text-on-band underline underline-offset-2 transition-colors hover:text-band-accent xl:whitespace-nowrap"
              >
                {copy.privacy.link.label}
              </Link>
            </p>
          </form>
        )}
      </section>
    </Container>
  );
}

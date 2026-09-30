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
        className="flex flex-col gap-3 rounded-[24px] bg-powder px-5 py-7 md:gap-8 md:p-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-fluid-48 lg:px-14 lg:py-fluid-56 xl:px-16 2xl:px-20"
      >
        <div className="flex flex-col gap-3">
          <h2
            id={ids.title}
            className="text-[28px] leading-[1.15] font-semibold tracking-display text-balance text-plum md:text-[32px] xl:text-h2-sm"
          >
            <Responsive mobile={copy.titleShort} desktop={copy.title} />
          </h2>
          <p id={ids.text} className="text-[16px] leading-[1.7] text-muted md:leading-[1.75]">
            <Responsive mobile={copy.textShort} desktop={copy.text} />
          </p>
        </div>

        {status === "success" ? (
          <div ref={successRef} tabIndex={-1} role="status" className="focus:outline-none">
            <p className="text-[16px] font-semibold text-plum">{copy.success.title}</p>
            <p className="mt-1 text-[14px] leading-[1.6] text-muted">{copy.success.text}</p>
          </div>
        ) : (
          <form
            name={copy.formName}
            aria-label={copy.formLabel}
            aria-describedby={`${ids.text} ${ids.privacy}`}
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-3 md:gap-2.5 lg:relative"
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
                className="h-[52px] w-full min-w-0 rounded-full border border-transparent bg-white px-5 text-[16px] text-ink transition-colors placeholder:text-placeholder hover:border-line aria-[invalid=true]:border-plum md:h-auto md:flex-1 md:px-6 md:py-[14px] md:text-[15px]"
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
                className="text-[13px] leading-[1.5] font-semibold text-plum md:px-6"
              >
                {error}
              </p>
            ) : null}

            {/* lg: hangs below the form, so the field and button stay centred on the text as in 6blog. */}
            <p
              id={ids.privacy}
              className="text-[13px] leading-[1.6] text-muted md:px-6 lg:absolute lg:inset-x-0 lg:top-full lg:mt-2.5"
            >
              {copy.privacy.text}{" "}
              <Link
                href={copy.privacy.link.href}
                className="text-ink underline underline-offset-2 hover:text-plum xl:whitespace-nowrap"
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

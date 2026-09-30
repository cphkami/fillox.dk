"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { HoneypotField } from "@/components/ui/HoneypotField";
import type { NotifyCopy } from "@/content/pages/clinics";
import { cn } from "@/lib/cn";
import { honeypotValue, isValidEmail, submitForm, type FormName } from "@/lib/forms";

type Status = "closed" | "open" | "sending" | "success";
type RequiredField = "name" | "email";
type FocusTarget = "name" | "email" | "toggle" | "success";

const inputClasses =
  "block w-full rounded-[16px] border border-line bg-cream px-5 py-4 text-[16px] text-ink transition-colors placeholder:text-placeholder hover:border-rule focus:border-plum aria-[invalid=true]:border-plum";

type NotifyFormProps = {
  /** Netlify form name; field names must match public/__forms.html. */
  formName: FormName;
  copy: NotifyCopy;
};

/**
 * "Få besked" signup on a coming-soon clinic card. The button reveals a small
 * form (name, e-mail, optional phone) that posts to Netlify Forms, with inline
 * validation, a submit error and a success message.
 *
 * The open form and the success message carry `data-notify-open`, so the clinic
 * grid can stop stretching the neighbouring card while this one is expanded.
 */
export function NotifyForm({ formName, copy }: NotifyFormProps) {
  const [status, setStatus] = useState<Status>("closed");
  const [errors, setErrors] = useState<Partial<Record<RequiredField, string>>>({});
  const [submitFailed, setSubmitFailed] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  /** Where focus goes after the next render (set by handlers, consumed by the effect). */
  const focusNext = useRef<FocusTarget | null>(null);

  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    phone: `${uid}-phone`,
    nameError: `${uid}-name-error`,
    emailError: `${uid}-email-error`,
    privacy: `${uid}-privacy`,
  };

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (target === "name") nameRef.current?.focus();
    else if (target === "email") emailRef.current?.focus();
    else if (target === "toggle") toggleRef.current?.focus();
    else if (target === "success") successRef.current?.focus();
  });

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        data-notify-open=""
        className="rounded-[16px] bg-sand px-5 py-4 focus:outline-none"
      >
        <p className="text-[15px] font-semibold text-ink">{copy.success.title}</p>
        <p className="mt-1 text-[14px] leading-[1.6] text-muted">{copy.success.text}</p>
      </div>
    );
  }

  if (status === "closed") {
    return (
      <button
        ref={toggleRef}
        type="button"
        onClick={() => {
          focusNext.current = "name";
          setStatus("open");
        }}
        className={buttonClasses({ variant: "outline", size: "mdTight", mobileSize: "lg", fullWidth: "mobile" })}
      >
        {copy.toggle}
      </button>
    );
  }

  const sending = status === "sending";

  function clearError(field: RequiredField) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      if (errors[field] && event.target.value.trim()) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const name = value("name");
    const email = value("email");

    const nextErrors: Partial<Record<RequiredField, string>> = {};
    if (!name) nextErrors.name = copy.errors.nameRequired;
    if (!email) nextErrors.email = copy.errors.emailRequired;
    else if (!isValidEmail(email)) nextErrors.email = copy.errors.emailInvalid;
    setErrors(nextErrors);
    setSubmitFailed(false);
    if (nextErrors.name || nextErrors.email) {
      focusNext.current = nextErrors.name ? "name" : "email";
      // Re-render even when the errors are unchanged, so the effect moves focus.
      setErrors({ ...nextErrors });
      return;
    }

    setStatus("sending");
    try {
      await submitForm(formName, {
        name,
        email,
        phone: value("phone"),
        ...honeypotValue(data),
      });
      focusNext.current = "success";
      setStatus("success");
    } catch {
      setSubmitFailed(true);
      setStatus("open");
    }
  }

  function cancel() {
    // The request is already on its way; cancelling now would close the form and then
    // reopen it (error) or show the success message anyway. The button is aria-disabled.
    if (sending) return;
    setErrors({});
    setSubmitFailed(false);
    focusNext.current = "toggle";
    setStatus("closed");
  }

  return (
    <form
      name={formName}
      aria-label={copy.formLabel}
      aria-describedby={ids.privacy}
      noValidate
      onSubmit={onSubmit}
      data-notify-open=""
      className="flex flex-col gap-3.5"
    >
      <HoneypotField />

      <div className="grid gap-3.5 lg:grid-cols-2">
        <Field id={ids.name} label={copy.fields.name.label} error={errors.name} errorId={ids.nameError}>
          <input
            ref={nameRef}
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={copy.fields.name.placeholder}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? ids.nameError : undefined}
            onChange={clearError("name")}
            className={inputClasses}
          />
        </Field>
        <Field id={ids.email} label={copy.fields.email.label} error={errors.email} errorId={ids.emailError}>
          <input
            ref={emailRef}
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={copy.fields.email.placeholder}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? ids.emailError : undefined}
            onChange={clearError("email")}
            className={inputClasses}
          />
        </Field>
      </div>

      <Field
        id={ids.phone}
        label={
          <>
            {copy.fields.phone.label} <span className="font-normal text-muted">{copy.fields.phone.optional}</span>
          </>
        }
      >
        <input
          id={ids.phone}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder={copy.fields.phone.placeholder}
          className={inputClasses}
        />
      </Field>

      <p id={ids.privacy} className="text-[13px] leading-[1.6] text-muted">
        {copy.privacy.text}{" "}
        <Link href={copy.privacy.link.href} className="text-ink underline underline-offset-2 hover:text-plum">
          {copy.privacy.link.label}
        </Link>
      </p>

      {submitFailed ? (
        <p role="alert" className="text-[14px] leading-[1.6] font-semibold text-plum">
          {copy.errors.submit.text}{" "}
          <a
            href={copy.errors.submit.phone.href}
            className="whitespace-nowrap underline underline-offset-2 hover:text-plum-deep"
          >
            {copy.errors.submit.phone.label}
          </a>
          {copy.errors.submit.end}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-[18px]">
        <button
          type="submit"
          aria-disabled={sending || undefined}
          className={cn(
            buttonClasses({ variant: "primary", size: "mdTight", mobileSize: "lg", fullWidth: "mobile" }),
            sending && "cursor-progress opacity-70",
          )}
        >
          {sending ? copy.sending : copy.submit}
        </button>
        <button
          type="button"
          onClick={cancel}
          aria-disabled={sending || undefined}
          className={cn(
            "self-center text-[14px] text-muted underline underline-offset-2 max-md:h-11",
            sending ? "cursor-not-allowed opacity-50" : "hover:text-plum",
          )}
        >
          {copy.cancel}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  errorId,
  children,
}: {
  id: string;
  label: ReactNode;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={errorId} className="mt-1.5 text-[13px] leading-[1.5] font-semibold text-plum">
          {error}
        </p>
      ) : null}
    </div>
  );
}

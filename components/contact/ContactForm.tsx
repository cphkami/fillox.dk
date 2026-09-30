"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { buttonClasses } from "@/components/ui/Button";
import { HoneypotField } from "@/components/ui/HoneypotField";
import type { ContactFormCopy } from "@/content/pages/contact";
import { cn } from "@/lib/cn";
import { honeypotValue, isValidEmail, submitForm } from "@/lib/forms";
import { useMediaQuery } from "@/lib/useMediaQuery";

type Field = "name" | "email" | "phone" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "success";

/** Order in which invalid fields receive focus: the visual order on each layout. */
const FIELD_ORDER: Field[] = ["name", "phone", "email", "message", "consent"];
const FIELD_ORDER_MOBILE: Field[] = ["name", "email", "phone", "message", "consent"];

/** Digits, spaces, "+", "-", "(" and ")", with at least 6 digits. */
const PHONE_PATTERN = /^\+?[\d\s()-]+$/;

/** Tailwind's md breakpoint (48rem): below it the mobile design (mc) applies. */
const MOBILE_QUERY = "(max-width: 47.99rem)";

/**
 * Mobile (mc): white pills, 52px high. Desktop (6ko): cream fields, 16px radius, 58px high.
 * Typed text is 16px everywhere (smaller text makes iOS zoom in on focus); placeholders are
 * 15px on mobile as in mc, which does not trigger the zoom.
 */
const fieldBase =
  "block w-full border border-line bg-white px-5 text-[16px] text-ink transition-colors hover:border-rule focus:border-plum aria-[invalid=true]:border-plum md:bg-cream";
/**
 * Placeholder colours: --color-placeholder on mobile (mc), --color-placeholder-soft on
 * desktop (6ko). The soft one is defined on the form card (FormCard) until it becomes a
 * token in app/globals.css.
 */
const placeholderColor =
  "placeholder:text-placeholder max-md:placeholder:text-[15px] md:placeholder:text-(--color-placeholder-soft)";
const inputClasses = cn(fieldBase, placeholderColor, "h-[52px] rounded-full md:h-[59px] md:rounded-[16px]");

type ContactFormProps = {
  copy: ContactFormCopy;
  /** Clinic names for the clinic picker. */
  clinics: string[];
  titleId: string;
  className?: string;
};

/**
 * "Send en besked" (6ko / mc): name, phone, e-mail, clinic and message, plus a consent
 * box on mobile. Validates on submit, posts to Netlify Forms via lib/forms.ts, and shows
 * inline errors, a submit error and a success message. Without JavaScript the form posts
 * straight to Netlify (method="post" to `copy.noJsAction`, a static file that forwards to
 * the /kontakt/tak thank-you page).
 */
export function ContactForm({ copy, clinics, titleId, className }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [submitFailed, setSubmitFailed] = useState(false);
  /**
   * Chosen clinic, shown by the styled overlay over the select. null in the server HTML and
   * until the select has mounted in the browser; meanwhile the select shows its own text.
   */
  const [clinic, setClinic] = useState<string | null>(null);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  /**
   * The select is uncontrolled so a choice made before hydration survives it. When it
   * mounts, read its value (it may already be set) so the overlay shows the right clinic.
   */
  const syncClinic = useCallback((el: HTMLSelectElement | null) => {
    if (el) setClinic(el.value);
  }, []);
  const showOverlay = clinic !== null;

  const successRef = useRef<HTMLDivElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  /** Where focus goes after the next render (set by handlers, consumed by the effect). */
  const focusNext = useRef<Field | "success" | null>(null);

  const uid = useId();
  const id = (key: string) => `${uid}-${key}`;

  useEffect(() => {
    const target = focusNext.current;
    focusNext.current = null;
    if (!target) return;
    if (target === "success") successRef.current?.focus();
    else document.getElementById(id(target))?.focus();
  });

  const { fields } = copy;

  if (status === "success") {
    return (
      <FormCard titleId={titleId} title={copy.title} className={className}>
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="rounded-[18px] bg-white px-5 py-5 focus:outline-none md:rounded-[16px] md:bg-cream md:px-6 md:py-6"
        >
          <p className="text-[18px] font-semibold tracking-display text-ink">{copy.success.title}</p>
          <p className="mt-2 text-[15px] leading-[1.7] text-muted">{copy.success.text}</p>
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setSubmitFailed(false);
              setClinic(null);
              focusNext.current = "name";
              setStatus("idle");
            }}
            className="mt-4 inline-flex items-center text-[14px] text-ink hover:text-plum max-md:mt-2 max-md:min-h-11"
          >
            <span className="border-b border-current pb-[3px]">{copy.success.again}</span>
          </button>
        </div>
      </FormCard>
    );
  }

  const sending = status === "sending";

  function clearError(field: Field) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const target = event.target;
      const filled = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value.trim();
      if (errors[field] && filled) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const name = value("name");
    const email = value("email");
    const phone = value("phone");
    const message = value("message");
    // The consent box is hidden on desktop (6ko has none); only require it where it is shown.
    const consentEl = consentRef.current;
    const consentShown = !!consentEl && consentEl.getClientRects().length > 0;
    const consented = consentShown && consentEl.checked;

    const next: Errors = {};
    if (!name) next.name = copy.errors.nameRequired;
    if (!email) next.email = copy.errors.emailRequired;
    else if (!isValidEmail(email)) next.email = copy.errors.emailInvalid;
    if (phone && (!PHONE_PATTERN.test(phone) || phone.replace(/\D/g, "").length < 6)) {
      next.phone = copy.errors.phoneInvalid;
    }
    if (!message) next.message = copy.errors.messageRequired;
    if (consentShown && !consented) next.consent = copy.errors.consentRequired;

    setSubmitFailed(false);
    const firstInvalid = (isMobile ? FIELD_ORDER_MOBILE : FIELD_ORDER).find((f) => next[f]);
    if (firstInvalid) {
      focusNext.current = firstInvalid;
      // New object so the effect runs (and moves focus) even when the errors are unchanged.
      setErrors({ ...next });
      return;
    }
    setErrors({});

    setStatus("sending");
    try {
      await submitForm(copy.formName, {
        name,
        email,
        phone,
        clinic: value("clinic"),
        message,
        consent: consented ? copy.consent.value : "",
        ...honeypotValue(data),
      });
      focusNext.current = "success";
      setStatus("success");
    } catch {
      setSubmitFailed(true);
      setStatus("idle");
    }
  }

  const describedBy = (field: Field) => (errors[field] ? id(`${field}-error`) : undefined);
  const invalid = (field: Field) => (errors[field] ? true : undefined);

  return (
    <FormCard titleId={titleId} title={copy.title} className={className}>
      <form
        name={copy.formName}
        method="post"
        action={copy.noJsAction}
        aria-labelledby={titleId}
        noValidate
        onSubmit={onSubmit}
        className="grid gap-3.5 md:grid-cols-2 md:gap-y-[18px]"
      >
        {/* Posted by the no-JS fallback; submitForm() adds it itself. */}
        <input type="hidden" name="form-name" value={copy.formName} />
        <HoneypotField />

        {/*
          DOM (and tab) order is the desktop order: name, phone, e-mail (6ko puts phone next to
          name). The mobile design (mc) lists e-mail before phone, so below 768px CSS `order`
          moves e-mail up. Trade-off: on mobile, screen-reader and tab order read phone before
          e-mail although e-mail is shown first; keyboard use is rare there.
        */}
        <FieldRow id={id("name")} label={fields.name.label} error={errors.name} className="max-md:-order-2">
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={isMobile ? fields.name.placeholderShort : fields.name.placeholder}
            aria-invalid={invalid("name")}
            aria-describedby={describedBy("name")}
            onChange={clearError("name")}
            className={inputClasses}
          />
        </FieldRow>

        <FieldRow id={id("phone")} label={fields.phone.label} error={errors.phone}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={fields.phone.placeholder}
            aria-invalid={invalid("phone")}
            aria-describedby={describedBy("phone")}
            onChange={clearError("phone")}
            className={inputClasses}
          />
        </FieldRow>

        <FieldRow id={id("email")} label={fields.email.label} error={errors.email} className="max-md:-order-1 md:col-span-2">
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder={fields.email.placeholder}
            aria-invalid={invalid("email")}
            aria-describedby={describedBy("email")}
            onChange={clearError("email")}
            className={inputClasses}
          />
        </FieldRow>

        <FieldRow id={id("clinic")} label={fields.clinic.label} className="md:col-span-2">
          <div className="relative">
            <select
              ref={syncClinic}
              id={id("clinic")}
              name="clinic"
              defaultValue=""
              onChange={(e) => setClinic(e.target.value)}
              className={cn(
                inputClasses,
                "cursor-pointer appearance-none pe-12 [&>option]:text-ink",
                showOverlay
                  ? // Windows high contrast forces the text colour back on, so the native text shows
                    // there (and the overlay's copy of it is hidden below).
                    "text-transparent forced-colors:text-[color:CanvasText]"
                  : // Native text (no JS / before hydration): placeholder colour while the empty option is chosen.
                    "has-[option[value='']:checked]:text-placeholder md:has-[option[value='']:checked]:text-(--color-placeholder-soft)",
              )}
            >
              <option value="">{fields.clinic.placeholder}</option>
              {clinics.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {showOverlay ? (
              /* Visible value + caret: inline on mobile (mc), caret at the right edge on desktop (6ko). */
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center px-[21px] text-[16px] max-md:text-[15px] md:justify-between",
                  clinic ? "text-ink" : "text-placeholder md:text-(--color-placeholder-soft)",
                )}
              >
                <span className="truncate forced-colors:invisible">{clinic || fields.clinic.placeholder}</span>
                <span className="ms-1.5 shrink-0 md:ms-3">▾</span>
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-[21px] text-[16px] text-placeholder md:text-(--color-placeholder-soft)"
              >
                ▾
              </span>
            )}
          </div>
        </FieldRow>

        <FieldRow id={id("message")} label={fields.message.label} error={errors.message} className="md:col-span-2">
          <textarea
            id={id("message")}
            name="message"
            required
            rows={4}
            placeholder={fields.message.placeholder}
            aria-invalid={invalid("message")}
            aria-describedby={describedBy("message")}
            onChange={clearError("message")}
            className={cn(
              fieldBase,
              placeholderColor,
              "h-[120px] resize-none rounded-[18px] py-3.5 leading-normal md:rounded-[16px] md:py-4",
            )}
          />
        </FieldRow>

        <div className={cn("md:col-span-2", !copy.consent.showOnDesktop && "md:hidden")}>
          <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5] text-muted">
            <span className="relative flex size-[22px] shrink-0">
              <input
                ref={consentRef}
                id={id("consent")}
                name="consent"
                type="checkbox"
                value={copy.consent.value}
                aria-invalid={invalid("consent")}
                aria-describedby={describedBy("consent")}
                onChange={clearError("consent")}
                className="peer size-[22px] cursor-pointer appearance-none rounded-[6px] border border-plum bg-transparent transition-colors checked:bg-plum"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute inset-0 m-auto size-3.5 text-cream opacity-0 peer-checked:opacity-100"
              >
                <path d="M3.5 8.5l3 3 6-7" />
              </svg>
            </span>
            <span>{copy.consent.label}</span>
          </label>
          {errors.consent ? (
            <ErrorText id={id("consent-error")} className="mt-2">
              {errors.consent}
            </ErrorText>
          ) : null}
        </div>

        {submitFailed ? (
          <p role="alert" className="text-[14px] leading-[1.6] font-semibold text-plum md:col-span-2">
            {copy.errors.submit}
          </p>
        ) : null}

        <button
          type="submit"
          aria-disabled={sending || undefined}
          className={cn(
            buttonClasses({ variant: "primary", size: "md", mobileSize: "lg", fullWidth: true }),
            "md:col-span-2 md:mt-1.5",
            sending && "cursor-progress opacity-70",
          )}
        >
          {sending ? copy.sending : copy.submit}
        </button>
      </form>
    </FormCard>
  );
}

function FormCard({
  titleId,
  title,
  className,
  children,
}: {
  titleId: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        // --color-placeholder-soft: the desktop (6ko) placeholder colour, used by the fields.
        "rounded-[24px] bg-sand px-5 py-7 [--color-placeholder-soft:#9a8b87] md:bg-white md:p-10",
        className,
      )}
    >
      <h2
        id={titleId}
        className="mb-3.5 text-[28px] leading-[1.15] font-semibold tracking-display text-ink md:mb-6 md:leading-normal"
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function FieldRow({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 md:gap-2", className)}>
      <label htmlFor={id} className="text-[14px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <p id={id} className={cn("mt-0.5 text-[13px] leading-[1.5] font-semibold text-plum", className)}>
      {children}
    </p>
  );
}

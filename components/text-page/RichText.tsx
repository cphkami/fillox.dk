import Link from "next/link";
import type { RichSpan, RichText as RichTextValue } from "@/content/types";

const linkClasses =
  "font-medium text-accent underline decoration-rule-strong underline-offset-[3px] transition-colors hover:decoration-accent";

function Span({ span }: { span: RichSpan }) {
  if (typeof span === "string") return <>{span}</>;
  const text = span.strong ? <strong className="font-semibold text-ink">{span.text}</strong> : span.text;
  if (!span.href) return <>{text}</>;
  // Internal routes use next/link; mailto:, tel: and external URLs are plain anchors.
  return span.href.startsWith("/") ? (
    <Link href={span.href} className={linkClasses}>
      {text}
    </Link>
  ) : (
    <a href={span.href} className={linkClasses}>
      {text}
    </a>
  );
}

/** Renders inline rich text from /content: a string, or runs with links / bold. */
export function RichText({ value }: { value: RichTextValue }) {
  if (typeof value === "string") return <>{value}</>;
  return value.map((span, i) => <Span key={i} span={span} />);
}

"use client";

/**
 * A classic inline script that runs once, from the server-rendered HTML, while the page
 * is being parsed. React never executes scripts it creates on the client and warns when
 * it does (client-side navigation), so on the client it renders an inert data block
 * (type="text/plain"). During hydration the server's element is kept as is; its `type`
 * differs on purpose, hence suppressHydrationWarning.
 */
export function InlineScript({ code }: { code: string }) {
  const onServer = typeof window === "undefined";
  return (
    <script type={onServer ? undefined : "text/plain"} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: code }} />
  );
}

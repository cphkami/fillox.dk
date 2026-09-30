/**
 * Renders the mobile (mf) wording below 768px and the desktop (6a) wording from 768px.
 * Only one variant is displayed, so screen readers read one of them.
 */
export function ResponsiveText({ short, long }: { short?: string; long: string }) {
  if (!short || short === long) return <>{long}</>;
  return (
    <>
      <span className="md:hidden">{short}</span>
      <span className="max-md:hidden">{long}</span>
    </>
  );
}

type TrustBandProps = {
  items: readonly string[];
};

/**
 * Plum band of trust points under the Priser hero (6b). Hidden on mobile (mp).
 * The "·" separators are decorative and only shown from 1024px, where the row
 * always fits on one line.
 */
export function TrustBand({ items }: TrustBandProps) {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 pt-6 max-md:hidden">
      <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 rounded-[24px] bg-plum px-7 py-[26px] text-[14px] text-cream lg:gap-x-10">
        {items.map((item, i) => (
          <li key={item} className="flex gap-10">
            {i > 0 ? (
              <span aria-hidden="true" className="text-powder max-lg:hidden">
                ·
              </span>
            ) : null}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

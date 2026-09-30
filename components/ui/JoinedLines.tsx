/**
 * Short parts (address lines, opening hours) that read as one line joined by `separator`
 * below 1024px and stack as separate lines from lg, where the separator is hidden.
 * Renders inline spans: place it inside a <p> or similar.
 */
export function JoinedLines({ parts, separator }: { parts: string[]; separator: string }) {
  return parts.map((part, i) => (
    <span key={i} className="lg:block">
      {i > 0 ? <span className="lg:hidden">{separator}</span> : null}
      {part}
    </span>
  ));
}

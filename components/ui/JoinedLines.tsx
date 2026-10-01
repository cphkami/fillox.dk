/**
 * Short parts (address lines) that read as one line joined by `separator` below 1024px and
 * stack as separate lines from lg, where the separator is hidden. Below lg a part never breaks
 * inside ("2300 København S" stays together), so a narrow column only wraps after a separator;
 * from lg each part is its own line and may wrap in a narrow column.
 * Renders inline spans: place it inside a <p> or similar.
 */
export function JoinedLines({ parts, separator }: { parts: string[]; separator: string }) {
  return parts.map((part, i) => (
    <span key={i} className="lg:block">
      {i > 0 ? <span className="lg:hidden">{separator}</span> : null}
      <span className="max-lg:whitespace-nowrap">{part}</span>
    </span>
  ));
}

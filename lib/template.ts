/**
 * Fills "{name}" placeholders in a copy string: fillTemplate("Anmeldelse {n} af {total}",
 * { n: 2, total: 5 }) → "Anmeldelse 2 af 5". Unknown placeholders are left as they are.
 * Dependency-free, so client components can use it.
 */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

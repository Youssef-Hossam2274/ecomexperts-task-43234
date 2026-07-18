/**
 * Tiny className combiner. Joins truthy string args with a single space so the
 * caller's classes land last (later source position wins for equal-specificity
 * Tailwind utilities). No dependency on clsx/cva — this is all we need.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

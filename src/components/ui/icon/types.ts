import type { SVGProps } from "react";

/**
 * Props shared by every generated icon and by {@link Icon}. Extends the native
 * SVG props, so `className`, `style`, `ref`, `onClick`, `aria-*`, and — crucially —
 * `color` all pass straight through to the underlying `<svg>`.
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * Square pixel size — sets both width and height (defaults to the icon's own
   * intrinsic size). A `className` size utility (e.g. `size-6`) still wins,
   * since CSS width/height overrides the attribute.
   */
  size?: number;
}

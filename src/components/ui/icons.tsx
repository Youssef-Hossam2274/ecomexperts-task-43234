import type { SVGProps } from "react";

/**
 * Functional/UI icons drawn inline (generic glyphs — chevrons, +/-, and a
 * delivery truck) that have no counterpart in `/public/assets/icons`. Icons
 * that DO exist there are generated from SVG instead — see
 * `src/components/ui/icon/` and `npm run icons`. Brand imagery (product photos,
 * satisfaction badge, plan logo) is loaded from `/public/assets`.
 */

type IconProps = SVGProps<SVGSVGElement>;

export function ChevronDown(props: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden {...props}>
      <path
        d="M2.5 4.25 6 7.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronUp(props: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden {...props}>
      <path
        d="M2.5 7.75 6 4.25l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Plus(props: IconProps) {
  return (
    <svg viewBox="0 0 8 8" fill="none" aria-hidden {...props}>
      <path
        d="M4 1v6M1 4h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Minus(props: IconProps) {
  return (
    <svg viewBox="0 0 8 8" fill="none" aria-hidden {...props}>
      <path
        d="M1 4h6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M2 7.5h11v8H2v-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13 10.5h4l3 3v2h-7v-5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

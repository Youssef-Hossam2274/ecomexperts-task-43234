import type { SVGProps } from "react";

/**
 * Functional/UI icons drawn inline (generic glyphs — chevrons, +/-, a
 * delivery truck, and simple step markers). Brand imagery (product photos,
 * satisfaction badge, plan logo) is loaded from `/public/assets` instead.
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

/** Step 1 — camera / livestream. */
export function CameraIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/** Step 2 — plan / protection shield. */
export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 3 5 5.6v5.2c0 4.3 2.9 7.6 7 9.2 4.1-1.6 7-4.9 7-9.2V5.6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Step 3 — sensor / signal waves. */
export function SensorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="16" r="1.6" fill="currentColor" />
      <path
        d="M8 13a5.5 5.5 0 0 1 8 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5.5 10.5a9 9 0 0 1 13 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Step 4 — extra protection / grid of add-ons. */
export function GridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      {[6, 12, 18].map((cy) =>
        [6, 12, 18].map((cx) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="1.5"
            fill="currentColor"
          />
        )),
      )}
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

export const STEP_ICONS: Record<
  string,
  (props: IconProps) => React.JSX.Element
> = {
  livestream: CameraIcon,
  shield: ShieldIcon,
  sensor: SensorIcon,
  grid: GridIcon,
};

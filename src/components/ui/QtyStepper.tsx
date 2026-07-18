"use client";

import { Icon } from "@/src/components/ui/icon";
import { cn } from "@/src/lib/cn";

interface QtyStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  /** Whole control disabled (e.g. a required item). */
  disabled?: boolean;
  /** Number scale: cards use "md" (16px), compact rows use "sm" (14px). */
  size?: "sm" | "md";
  /**
   * Visual treatment (both use 20px buttons per Figma):
   *  - "card"   — builder cards & step rows: outlined minus + filled grey add,
   *    sitting on a white surface.
   *  - "review" — order-summary rows on the light-blue panel: flat 3-up control
   *    in a fixed 72px column. When the whole control is disabled (a required
   *    item such as the hub) both buttons go grey with a border.
   */
  variant?: "card" | "review";
  label?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Per-variant styles, keyed by variant name.                        */
/*  Both variants render the identical `div → [−] n [+]` markup; only  */
/*  these class strings differ. Each button carries three visual       */
/*  states, resolved by `pickState` below:                             */
/*    active — interactive                                             */
/*    off    — this button alone can't act (minus at 0)                */
/*    locked — the whole control is disabled                           */
/* ------------------------------------------------------------------ */
const BOX = "grid size-5 place-items-center rounded-[4px] transition-colors";

interface ButtonStyle {
  base: string;
  active: string;
  off: string;
  locked: string;
}

const variantStyles: Record<
  NonNullable<QtyStepperProps["variant"]>,
  { container: string; minus: ButtonStyle; plus: ButtonStyle }
> = {
  // Builder cards and step rows on a white surface.
  card: {
    container: "inline-flex items-center gap-2",
    minus: {
      base: cn(BOX, "border-2 bg-white"),
      active: "border-gray-300 text-ink hover:bg-gray-200",
      off: "cursor-not-allowed border-gray-300 text-gray-400",
      locked: "cursor-not-allowed border-gray-300 text-gray-400",
    },
    plus: {
      base: cn(BOX, "bg-gray-200 text-ink"),
      active: "hover:bg-gray-300",
      off: "cursor-not-allowed opacity-50",
      locked: "cursor-not-allowed opacity-50",
    },
  },
  // Flat control that fills the 72px summary column (justify-between).
  // Enabled → white buttons; whole-control disabled → grey with a border.
  review: {
    container: "flex w-18 items-center justify-between",
    minus: {
      base: cn(BOX, "border"),
      active: "border-transparent bg-white text-ink hover:bg-gray-200",
      off: "cursor-not-allowed border-transparent bg-white text-gray-400",
      locked: "cursor-not-allowed border-gray-400 bg-gray-200 text-gray-500",
    },
    plus: {
      base: cn(BOX, "border"),
      active: "border-transparent bg-white text-ink hover:bg-gray-200",
      off: "cursor-not-allowed border-gray-400 bg-gray-200 text-gray-500",
      locked: "cursor-not-allowed border-gray-400 bg-gray-200 text-gray-500",
    },
  },
};

/** Resolve a button's classes for the current state. `locked` wins over `off`. */
function pickState(
  s: ButtonStyle,
  { locked, off }: { locked: boolean; off: boolean },
): string {
  return cn(s.base, locked ? s.locked : off ? s.off : s.active);
}

/**
 * `[ − ] n [ + ]` quantity control.
 *  - The minus button is disabled at 0 (and greyed) — you can't go negative.
 *  - `disabled` locks the whole control (required items such as the hub).
 *  - `variant` swaps the look between the builder cards ("card") and the
 *    order-summary panel ("review") — see the two Figma stepper components.
 */
export function QtyStepper({
  value,
  onIncrement,
  onDecrement,
  disabled = false,
  size = "md",
  variant = "card",
  label = "Quantity",
  className,
}: QtyStepperProps) {
  const minusDisabled = disabled || value <= 0;
  const num =
    size === "md"
      ? "text-[16px] min-w-5 font-medium"
      : "text-[14px] min-w-4 font-semibold";

  const styles = variantStyles[variant];
  const minusClass = pickState(styles.minus, {
    locked: disabled,
    off: value <= 0,
  });
  const plusClass = pickState(styles.plus, { locked: disabled, off: false });

  return (
    <div
      className={cn(styles.container, className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={minusDisabled}
        aria-label="Decrease quantity"
        className={minusClass}
      >
        <Icon name="minus" color="currentColor" className="size-2" />
      </button>

      <span
        className={cn(num, "text-center tabular-nums text-obsidian")}
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled}
        aria-label="Increase quantity"
        className={plusClass}
      >
        <Icon name="add" color="currentColor" className="size-2" />
      </button>
    </div>
  );
}

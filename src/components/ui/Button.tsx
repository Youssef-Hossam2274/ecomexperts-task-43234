import type { ComponentPropsWithRef } from "react";
import { cn } from "@/src/lib/cn";

const base =
  "inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wyze-purple/40 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50";

const variantClass = {
  /* Solid purple (Checkout) */
  primary: "rounded-[4px] bg-wyze-purple text-white hover:bg-[#432aba]",
  /* Purple outline that fills on hover (Next) */
  outline:
    "rounded-[7px] border border-wyze-purple text-wyze-purple hover:bg-wyze-purple hover:text-white",
  /* Low-emphasis */
  ghost: "rounded-[4px] text-obsidian hover:bg-gray-200",
} as const;

export type ButtonVariant = keyof typeof variantClass;

const sizeClass = {
  sm: "px-3 py-1.5 text-[14px]",
  md: "px-6 py-2 text-[16px]",
  lg: "px-6 py-3.5 text-[17px]",
} as const;

export type ButtonSize = keyof typeof sizeClass;

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Use the display font (TT Norms Pro Bold) — the Checkout button. */
  displayFont?: boolean;
}

/**
 * General button primitive. Extends all native `<button>` attributes
 * (`onClick`, `type`, `disabled`, `aria-*`, `ref`, …); our `className` is
 * merged with — not overridden by — any className the caller passes.
 * React 19 passes `ref` through as a normal prop — no `forwardRef` needed.
 */
export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  displayFont = false,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        base,
        variantClass[variant],
        sizeClass[size],
        displayFont
          ? "font-bold font-(family-name:--font-primary)"
          : "font-semibold",
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

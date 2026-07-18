import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { cn } from "@/src/lib/cn";

/* ------------------------------------------------------------------ */
/*  Type scale                                                         */
/*  Every text style in the app maps to exactly one token here — no    */
/*  raw `text-[..]` classes should live in feature components.         */
/*  Families: D = display, H = heading, P = paragraph/body, L = label. */
/*                                                                     */
/*  Size / leading / tracking / transform live in `variantClass`;      */
/*  the default weight lives in `variantWeight` so a `weight` prop      */
/*  cleanly REPLACES it (only ever one font-weight class is emitted).  */
/* ------------------------------------------------------------------ */
const variantClass = {
  /* Display — big numbers/titles */
  D1: "text-[28px] leading-none",

  /* Headings */
  H1: "text-[20px] leading-none sm:text-[24px] lg:text-[28px]",
  H2: "text-[24px] sm:text-[28px]",
  H3: "text-[20px]",
  H4: "text-[18px] leading-tight",
  H5: "text-[16px]",

  /* Paragraph / body */
  P1: "text-[16px]",
  P2: "text-[15px]",
  P3: "text-[14px] leading-[1.3]",
  P4: "text-[13px]",

  /* Labels — small, tracked, usually uppercase */
  L1: "text-[12px] uppercase tracking-[1.6px]",
  L2: "text-[12px] uppercase tracking-[0.36px]",
  L3: "text-[10px] tracking-[0.6px]",
  L4: "text-[12px] leading-none",
} as const;

export type TypographyVariant = keyof typeof variantClass;

const weightClass = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

export type TypographyWeight = keyof typeof weightClass;

/** Default weight per variant (overridable via the `weight` prop). */
const variantWeight: Record<TypographyVariant, TypographyWeight> = {
  D1: "bold",
  H1: "semibold",
  H2: "semibold",
  H3: "semibold",
  H4: "semibold",
  H5: "semibold",
  P1: "regular",
  P2: "regular",
  P3: "medium",
  P4: "medium",
  L1: "medium",
  L2: "regular",
  L3: "medium",
  L4: "semibold",
};

/* ------------------------------------------------------------------ */
/*  Colors — restricted to design-system tokens (see globals.css).     */
/*  There is no arbitrary/hex escape hatch: a color that isn't a token */
/*  below is a compile error. Add new colors to @theme AND this map.   */
/* ------------------------------------------------------------------ */
const colorClass = {
  inherit: "",
  purple: "text-wyze-purple",
  obsidian: "text-obsidian",
  ink: "text-ink",
  "ink-75": "text-ink/75",
  "gray-700": "text-gray-700",
  "gray-600": "text-gray-600",
  "gray-500": "text-gray-500",
  price: "text-price",
  "step-label": "text-step-label",
  "strike-red": "text-strike-red",
  "save-green": "text-save-green",
  "link-blue": "text-link-blue",
  white: "text-white",
} as const;

export type TypographyColor = keyof typeof colorClass;

/** Default HTML element per family (overridable via `as`). */
const defaultTag: Record<string, ElementType> = {
  D: "p",
  H: "h2",
  P: "p",
  L: "span",
};

type OwnProps<T extends ElementType> = {
  /** Element to render. Defaults to a sensible tag for the variant's family. */
  as?: T;
  variant: TypographyVariant;
  /** Design-system color token. Defaults to `inherit`. */
  color?: TypographyColor;
  /** Optional weight override on top of the variant's default. */
  weight?: TypographyWeight;
  className?: string;
  children?: ReactNode;
};

/**
 * Polymorphic text primitive. Renders the element chosen by `as` (or the
 * variant's default) and inherits that element's native props — e.g. `href`
 * on `as="a"`, `htmlFor` on `as="label"`, `onClick`/`type` on `as="button"`.
 * The native `color` attribute is intentionally shadowed by our design-token
 * `color` prop.
 */
export function Typography<T extends ElementType = "p">({
  as,
  variant,
  color = "inherit",
  weight,
  className,
  children,
  ...rest
}: OwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof OwnProps<T>>) {
  const Tag = (as ?? defaultTag[variant[0]] ?? "p") as ElementType;

  return (
    <Tag
      className={cn(
        variantClass[variant],
        weightClass[weight ?? variantWeight[variant]],
        colorClass[color],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

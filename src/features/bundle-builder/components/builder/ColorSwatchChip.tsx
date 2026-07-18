"use client";

import { SafeImage } from "@/src/components/ui/SafeImage";
import { Typography } from "@/src/components/ui/Typography";
import type { Variant } from "../../types";

interface ColorSwatchChipProps {
  variant: Variant;
  active: boolean;
  onSelect: () => void;
}

/**
 * Selectable colour chip: a small swatch (thumbnail if provided, else a
 * colour dot from `hex`) plus the label. The "White" chip carries a green
 * border per the design; the active chip gets a subtle purple ring.
 * (Selected-state styling is intentionally light — see REQUIREMENTS.)
 */
export function ColorSwatchChip({ variant, active, onSelect }: ColorSwatchChipProps) {
  const border = active
    ? "border-wyze-purple"
    : variant.highlightBorder
      ? "border-save-green"
      : "border-gray-400";

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`inline-flex h-[26px] items-center gap-1.5 rounded-[2px] border px-2 transition-colors ${border}`}
    >
      {variant.swatch ? (
        <SafeImage
          src={variant.swatch}
          alt=""
          wrapperClassName="size-[15px] rounded-full"
        />
      ) : (
        <span
          aria-hidden
          className="size-[15px] rounded-full border border-gray-400/70"
          style={{ backgroundColor: variant.hex }}
        />
      )}
      <Typography as="span" variant="L3" color="ink">
        {variant.label}
      </Typography>
    </button>
  );
}

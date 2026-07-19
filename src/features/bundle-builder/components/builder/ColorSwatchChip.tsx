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
 * Selectable colour chip ("Label paints" in Figma `68:9830`): a 22px swatch
 * thumbnail plus the colour label. The active chip is drawn with a teal
 * (`save-green`) border and a faint mint fill; inactive chips get a plain grey
 * border on white.
 */
export function ColorSwatchChip({
  variant,
  active,
  onSelect,
}: ColorSwatchChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`inline-flex h-[26px] items-center justify-center gap-1.5 rounded-chip border-[0.5px] px-[3px] transition-colors ${
        active
          ? "border-save-green bg-swatch-active"
          : "border-gray-400 bg-white"
      }`}
    >
      <SafeImage
        src={variant.swatch}
        alt=""
        className="object-cover"
        wrapperClassName="size-[22px] rounded-[2px]"
      />
      <Typography as="span" variant="L3" color="ink">
        {variant.label}
      </Typography>
    </button>
  );
}

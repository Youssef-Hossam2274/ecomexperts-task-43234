"use client";

import { SafeImage } from "@/src/components/ui/SafeImage";
import { PriceTag } from "@/src/components/ui/PriceTag";
import { QtyStepper } from "@/src/components/ui/QtyStepper";
import { Typography } from "@/src/components/ui/Typography";
import { useBundle } from "../../hooks/useBundle";
import type { SummaryLine } from "../../store/selectors";

/**
 * A single review-panel row. Prices shown are LINE TOTALS (unit x qty) so the
 * column reconciles with the grand total. Its quantity stepper is the same
 * action as the product card's — editing here updates the card and vice versa.
 */
export function SummaryLineItem({ line }: { line: SummaryLine }) {
  const { actions } = useBundle();

  const qty = Math.max(line.required ? 1 : 0, line.qty);
  const lineTotal = line.unitPrice * qty;
  const lineCompare =
    line.unitCompareAt != null ? line.unitCompareAt * qty : undefined;
  const isMonthly = line.cadence === "monthly";
  const isPlan = line.display === "plan";

  return (
    <li className="@container flex items-center gap-3">
      {/* Thumbnail + name — the plan row sits flush (no tile background, no
          gap) so the Wyze shield reads as part of the "Cam Unlimited" label
          instead of a separate product tile. */}
      <div
        className={`flex min-w-0 flex-1 items-center ${isPlan ? "gap-1" : "gap-3"}`}
      >
        <SafeImage
          src={line.image}
          alt={line.name}
          wrapperClassName={
            isPlan
              ? // Plan logo has its own non-square size per viewport: the
                // roomy two-column `xl` split, the narrow `2xl` sidebar, and
                // the smallest (mobile) viewport each get their own Figma size.
                "h-[17px] w-[14px] shrink-0 xl:h-[31px] xl:w-[26px] 2xl:h-[24px] 2xl:w-[20px]"
              : "size-[41px] shrink-0 rounded-[5px] bg-white"
          }
        />

        <div className="min-w-0 flex-1">
          {isPlan ? (
            <Typography
              variant="H5"
              weight="bold"
              color="obsidian"
              className="text-[18px] sm:text-[20px]"
            >
              Cam <span className="text-wyze-purple">Unlimited</span>
            </Typography>
          ) : (
            <Typography
              variant="P2"
              weight="medium"
              color="obsidian"
              className="text-[16px] leading-[1.15] sm:text-[18px]"
            >
              {line.name}
            </Typography>
          )}
        </div>
      </div>

      {/* Stepper (omitted for the plan) */}
      {!line.noStepper && (
        <QtyStepper
          value={qty}
          onIncrement={() => actions.increment(line.productId, line.variantId)}
          onDecrement={() => actions.decrement(line.productId, line.variantId)}
          disabled={line.required}
          size="sm"
          variant="review"
          label={`${line.name} quantity`}
        />
      )}

      {/* Price — stacks the compare-at above the current price once the row
          itself gets too narrow to fit both on one line (the panel rendered
          as a single, narrow column — e.g. the `2xl` sidebar — rather than
          the roomy two-column split). Queries the row's own width via
          `@container` above, not the viewport, since that's what's actually
          cramped. */}
      <div className="shrink-0 text-right">
        <PriceTag
          price={isMonthly ? line.unitPrice : lineTotal}
          compareAt={isMonthly ? line.unitCompareAt : lineCompare}
          free={line.free}
          suffix={isMonthly ? "/mo" : undefined}
          tone="summary"
          className="justify-end text-[16px] @max-[380px]:flex-col @max-[380px]:items-end @max-[380px]:gap-0"
        />
      </div>
    </li>
  );
}

"use client";

import { Typography } from "@/src/components/ui/Typography";
import { CATEGORIES } from "../../data/structure";
import { useBundle } from "../../hooks/useBundle";
import { useCatalog } from "../../store/CatalogContext";
import { formatUSD } from "../../lib/money";
import { computeTotals, summaryGroups } from "../../store/selectors";
import { CheckoutButton } from "./CheckoutButton";
import { SatisfactionBadge } from "./SatisfactionBadge";
import { ShippingLineItem } from "./ShippingLineItem";
import { SummaryGroup } from "./SummaryGroup";

/**
 * "Your security system" — the live review panel. Reflects every selected
 * variant, recalculates totals as quantities change, and hosts the
 * satisfaction badge, financing line, savings callout, Checkout and
 * "Save my system for later".
 *
 * Internal layout is a single column in the sidebar/mobile compositions and
 * splits into two columns (line items | checkout) in the full-width `xl` range
 * where there's enough room; the narrow `2xl` sidebar goes single-column again.
 */
export function ReviewPanel() {
  const { state, save, justSaved } = useBundle();
  const { products, shipping, financingLabel } = useCatalog();

  const groups = summaryGroups(state, products, CATEGORIES);
  const totals = computeTotals(state, products);

  return (
    <section
      id="review"
      aria-label="Your security system"
      className="scroll-mt-6 rounded-[10px] bg-panel p-5 sm:p-6 xl:p-8 2xl:p-5"
    >
      <div className="grid grid-cols-1 gap-x-[52px] gap-y-6 xl:grid-cols-[minmax(0,1fr)_486px] 2xl:grid-cols-1">
        {/* ---------- Line items ---------- */}
        <div>
          <Typography
            variant="L2"
            color="gray-500"
            className="xl:hidden 2xl:block"
          >
            Review
          </Typography>
          <Typography
            as="h2"
            variant="H2"
            color="obsidian"
            className="mt-1 xl:mt-0 2xl:mt-1"
          >
            Your security system
          </Typography>
          <Typography
            variant="P3"
            weight="regular"
            color="gray-600"
            className="mt-1.5 max-w-md leading-normal"
          >
            Review your personalized protection system designed to keep what
            matters most safe.
          </Typography>

          <div className="mt-5 flex flex-col gap-4">
            {groups.map((group) => (
              <SummaryGroup
                key={group.id}
                label={group.label}
                lines={group.lines}
              />
            ))}

            <ul className="border-t border-gray-400 pt-[15px]">
              <ShippingLineItem shipping={shipping} />
            </ul>
          </div>
        </div>

        {/* ---------- Checkout summary ---------- */}
        <div className="flex flex-col gap-4">
          {/* Returns copy — only in the wide two-column layout */}
          <div className="hidden items-start gap-4 xl:flex 2xl:hidden">
            <SatisfactionBadge className="size-[131px]" />
            <div>
              <Typography as="h3" variant="H3" color="obsidian">
                30-day hassle-free returns
              </Typography>
              <Typography variant="P2" color="gray-600" className="mt-1">
                If you&apos;re not totally in love with the product, we will
                refund you 100%.
              </Typography>
            </div>
          </div>

          {/* Financing + total — badge stays on the left; the financing pill
              sits above the price on the smallest and largest (sidebar)
              viewports, reverting to the original side-by-side row only in
              the middle `xl` range where the "returns copy" block replaces
              the badge instead. */}
          <div className="flex items-center justify-between gap-4">
            <SatisfactionBadge className="size-[78px] xl:hidden 2xl:block" />

            <div className="flex flex-initial flex-col items-start gap-1 xl:flex-1 xl:flex-row xl:flex-wrap xl:items-center xl:justify-between xl:gap-x-3 xl:gap-y-2 2xl:flex-initial 2xl:flex-col 2xl:items-start 2xl:gap-1">
              <span className="inline-flex items-center rounded-[3px] bg-wyze-purple px-2 py-1.5 text-[13px] font-medium tracking-tight text-white sm:text-[14px]">
                {financingLabel}
              </span>
              <div className="flex items-baseline gap-2">
                <Typography
                  as="span"
                  variant="P1"
                  color="gray-600"
                  className="text-[18px] line-through sm:text-[22px]"
                >
                  {formatUSD(totals.subtotal)}
                </Typography>
                <Typography as="span" variant="D1" color="purple">
                  {formatUSD(totals.total)}
                </Typography>
              </div>
            </div>
          </div>

          <Typography
            variant="P4"
            color="save-green"
            className="text-center sm:text-[14px]"
          >
            Congrats! You&apos;re saving {formatUSD(totals.savings)} on your
            security bundle!
          </Typography>

          <CheckoutButton />

          <Typography
            as="button"
            type="button"
            variant="P4"
            weight="regular"
            color="gray-700"
            onClick={save}
            className="text-center italic underline underline-offset-2 transition-colors hover:text-obsidian"
          >
            {justSaved ? "Saved ✓" : "Save my system for later"}
          </Typography>
        </div>
      </div>
    </section>
  );
}

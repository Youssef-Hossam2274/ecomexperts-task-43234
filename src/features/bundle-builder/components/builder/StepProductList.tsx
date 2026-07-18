"use client";

import { SafeImage } from "@/src/components/ui/SafeImage";
import { PriceTag } from "@/src/components/ui/PriceTag";
import { QtyStepper } from "@/src/components/ui/QtyStepper";
import { Typography } from "@/src/components/ui/Typography";
import { useBundle } from "../../hooks/useBundle";
import { getQty } from "../../store/selectors";
import type { Product } from "../../types";

/**
 * Compact configurator rows for steps 2–4 (plan / sensors / extra protection).
 * The Figma only details the cameras step; these render the same catalog data
 * as simple, synced rows so every step is functional and stays in sync with
 * the review panel.
 */
export function StepProductList({ products }: { products: Product[] }) {
  const { state, actions } = useBundle();

  return (
    <ul className="flex flex-col gap-3">
      {products.map((product) => {
        const qty = getQty(state, product.id);
        // The plan (Cam Unlimited) uses a brand logo, so it drops the grey
        // thumbnail box that product photos sit on.
        const isPlan = product.display === "plan";
        return (
          <li
            key={product.id}
            className="flex items-center gap-3 rounded-[10px] bg-white p-3"
          >
            <SafeImage
              src={product.image}
              alt={product.name}
              wrapperClassName={`size-12 shrink-0 rounded-[6px] ${
                isPlan ? "" : "bg-gray-200"
              }`}
            />
            <div className="min-w-0 flex-1">
              {isPlan ? (
                // Match the review panel's plan treatment.
                <Typography
                  variant="H5"
                  weight="bold"
                  color="obsidian"
                  className="text-[18px] sm:text-[20px]"
                >
                  Cam <span className="text-wyze-purple">Unlimited</span>
                </Typography>
              ) : (
                <>
                  <Typography variant="P2" weight="semibold" color="obsidian">
                    {product.name}
                  </Typography>
                  {product.description && (
                    <Typography
                      variant="P4"
                      weight="regular"
                      color="ink-75"
                      className="mt-0.5 line-clamp-1"
                    >
                      {product.description}
                    </Typography>
                  )}
                </>
              )}
            </div>

            {!product.noStepper && (
              <QtyStepper
                value={product.required ? Math.max(1, qty) : qty}
                onIncrement={() => actions.increment(product.id, "default")}
                onDecrement={() => actions.decrement(product.id, "default")}
                disabled={product.required}
                size="sm"
                label={`${product.name} quantity`}
              />
            )}

            <div className="shrink-0 text-right">
              <PriceTag
                price={product.price}
                compareAt={product.compareAt}
                free={product.free}
                suffix={product.cadence === "monthly" ? "/mo" : undefined}
                tone="summary"
                className="justify-end text-[14px]"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

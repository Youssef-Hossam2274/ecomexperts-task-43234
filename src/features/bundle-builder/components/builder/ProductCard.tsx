"use client";

import { SafeImage } from "@/src/components/ui/SafeImage";
import { Badge } from "@/src/components/ui/Badge";
import { PriceTag } from "@/src/components/ui/PriceTag";
import { QtyStepper } from "@/src/components/ui/QtyStepper";
import { Typography } from "@/src/components/ui/Typography";
import { cn } from "@/src/lib/cn";
import { useBundle } from "../../hooks/useBundle";
import { activeVariantId, getQty, productQty } from "../../store/selectors";
import type { Product } from "../../types";
import { ColorSwatchChip } from "./ColorSwatchChip";

/**
 * A product card in the builder grid.
 *
 * The card is a **container** (`@container`) and picks its own orientation from
 * its OWN rendered width — not the viewport:
 *   - narrow card  → vertical  (image on top, content below)
 *   - wide card    → horizontal (image on the left, content on the right)
 * The `@min-[280px]` breakpoint is the flip point. Callers give the card a
 * `flex-basis`/`grow` (via `className`) so it fills the row and wraps to a new
 * line once it would drop under its min width.
 *
 * The quantity stepper is bound to the currently selected variant; selecting a
 * colour swaps which variant the stepper reads/edits.
 */
export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { state, actions } = useBundle();

  const activeId = activeVariantId(state, product);
  const hasVariants = !!product.variants?.length;
  const variantId = hasVariants ? activeId : "default";
  const qty = getQty(state, product.id, variantId);
  const selected = productQty(state, product) > 0;

  return (
    <article
      className={cn(
        // `@container` so the inner layout can query the card's width.
        // `flex` makes the inner wrapper stretch to the card's (row-)height.
        "@container relative flex rounded-[10px] bg-white",
        // Constant 2px border in both states — only the colour changes, so
        // selecting a card never shifts the layout.
        "border-2",
        selected ? "border-wyze-purple-70" : "border-gray-200",
        className,
      )}
    >
      {product.badge && (
        <div className="absolute left-2 top-2 z-10">
          <Badge>{product.badge}</Badge>
        </div>
      )}

      {/* Inner layout — vertical by default, horizontal once the card is wide */}
      <div className="flex w-full flex-col gap-3 p-3 @min-[280px]:flex-row @min-[280px]:gap-4">
        {/* Image — full-width banner (vertical) / fixed box on the left (wide) */}
        <div className="flex h-[150px] w-full shrink-0 items-center justify-center @min-[280px]:h-auto @min-[280px]:w-[112px]">
          <SafeImage
            src={product.image}
            alt={product.name}
            className="object-contain @min-[280px]:object-cover"
            wrapperClassName="h-full w-full @min-[280px]:h-[110px]"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Typography as="h3" variant="H4" color="obsidian">
            {product.name}
          </Typography>

          {product.description && (
            <Typography as="p" variant="P3" color="ink-75" className="mt-1.5">
              {product.description}{" "}
              {product.learnMoreHref && (
                <a
                  href={product.learnMoreHref}
                  className="font-semibold text-link-blue underline"
                >
                  Learn More
                </a>
              )}
            </Typography>
          )}

          {/* Variant chips */}
          {hasVariants && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.variants!.map((v) => (
                <ColorSwatchChip
                  key={v.id}
                  variant={v}
                  active={v.id === activeId}
                  onSelect={() => actions.selectVariant(product.id, v.id)}
                />
              ))}
            </div>
          )}

          {/* Quantity + price (pinned to the bottom so rows align). Wraps when
            the card is too narrow so the discounted price never overflows /
            gets clipped by the accordion's overflow-hidden body. */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-3">
            <QtyStepper
              value={qty}
              onIncrement={() => actions.increment(product.id, variantId)}
              onDecrement={() => actions.decrement(product.id, variantId)}
              label={`${product.name} quantity`}
            />
            <PriceTag
              price={product.price}
              compareAt={product.compareAt}
              tone="card"
              className="shrink-0"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

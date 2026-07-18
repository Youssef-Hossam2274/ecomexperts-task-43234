import {
  lineKey,
  type Category,
  type CategoryId,
  type LineKey,
  type Product,
} from "../types";
import type { BundleState } from "./state";

/** Quantity for a single product+variant. */
export const getQty = (
  state: BundleState,
  productId: string,
  variantId = "default",
): number => state.quantities[lineKey(productId, variantId)] ?? 0;

/** The variant whose stepper the product card is currently bound to. */
export const activeVariantId = (state: BundleState, product: Product): string =>
  state.selectedVariant[product.id] ?? product.variants?.[0]?.id ?? "default";

/** Total quantity of a product across every variant. */
export const productQty = (state: BundleState, product: Product): number => {
  if (!product.variants?.length) return getQty(state, product.id);
  return product.variants.reduce(
    (sum, v) => sum + getQty(state, product.id, v.id),
    0,
  );
};

/** Distinct products with qty > 0 in a step's category. Drives the
 *  "N selected" indicator. */
export const stepSelectedCount = (
  state: BundleState,
  category: CategoryId,
  products: Product[],
): number =>
  products.filter((p) => p.category === category && productQty(state, p) > 0)
    .length;

export interface SummaryLine {
  key: LineKey;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  qty: number;
  unitPrice: number;
  unitCompareAt?: number;
  free?: boolean;
  required?: boolean;
  noStepper?: boolean;
  cadence?: "once" | "monthly";
  display?: "plan";
}

/** Every selected variant becomes its own review line. When a product has
 *  more than one variant selected, the colour label is appended to keep the
 *  rows distinguishable. */
function linesForProduct(state: BundleState, product: Product): SummaryLine[] {
  const base = {
    productId: product.id,
    image: product.image,
    unitPrice: product.price,
    unitCompareAt: product.compareAt,
    free: product.free,
    required: product.required,
    noStepper: product.noStepper,
    cadence: product.cadence,
    display: product.display,
  } as const;

  if (!product.variants?.length) {
    const qty = getQty(state, product.id);
    if (qty <= 0 && !product.noStepper && !product.required) return [];
    return [
      {
        ...base,
        key: lineKey(product.id),
        variantId: "default",
        name: product.name,
        qty,
      },
    ];
  }

  const selected = product.variants.filter(
    (v) => getQty(state, product.id, v.id) > 0,
  );
  const disambiguate = selected.length > 1;
  return selected.map((v) => ({
    ...base,
    key: lineKey(product.id, v.id),
    variantId: v.id,
    name: disambiguate ? `${product.name} · ${v.label}` : product.name,
    qty: getQty(state, product.id, v.id),
  }));
}

/** Review-panel line items grouped by category (in catalog order). Empty
 *  groups are dropped; the shipping row is surfaced separately from the
 *  catalog's `shipping` field, not from `products`. */
export function summaryGroups(
  state: BundleState,
  products: Product[],
  categories: Category[],
): { id: CategoryId; label: string; lines: SummaryLine[] }[] {
  return categories
    .map((cat) => ({
      ...cat,
      lines: products
        .filter((p) => p.category === cat.id)
        .flatMap((p) => linesForProduct(state, p)),
    }))
    .filter((group) => group.lines.length > 0);
}

export interface Totals {
  subtotal: number; // pre-discount (struck through)
  total: number; // what you pay
  savings: number;
}

/** Grand totals across every product — the always-free shipping row isn't a
 *  product, so it's never part of this sum; it carries its own row and its
 *  own (always-zero) contribution to the total, matching the Figma. */
export function computeTotals(state: BundleState, products: Product[]): Totals {
  let subtotal = 0;
  let total = 0;
  for (const product of products) {
    const qty = product.noStepper
      ? productQtyOrOne(state, product)
      : productQty(state, product);
    if (qty <= 0) continue;
    const compare = product.compareAt ?? product.price;
    subtotal += compare * qty;
    total += product.price * qty;
  }
  return { subtotal, total, savings: Math.max(0, subtotal - total) };
}

/** No-stepper rows (plan) keep a fixed quantity of at least 1. */
function productQtyOrOne(state: BundleState, product: Product): number {
  const qty = productQty(state, product);
  return qty > 0 ? qty : 1;
}

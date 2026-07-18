/**
 * Domain types for the bundle builder.
 *
 * Product data is served by the simulated backend under `src/server/catalog`
 * (see `getCatalog.ts`) and fetched by the page; static UI structure (steps,
 * categories) lives in `data/structure.ts`. Nothing about a specific product
 * is hardcoded in the components — they render from this data.
 */

export type CategoryId = "cameras" | "plan" | "sensors" | "accessories";

/** A selectable colour/variant of a product. Each variant is priced and
 *  counted independently (see REQUIREMENTS "The variant selector"). */
export interface Variant {
  id: string;
  label: string;
  /** Fallback swatch colour when no thumbnail image is supplied. */
  hex: string;
  /** Optional per-variant thumbnail (defaults to the product image). */
  swatch?: string;
  /** Draw the chip with a green-tinted border (the "White" chip in Figma). */
  highlightBorder?: boolean;
}

export interface Product {
  id: string;
  category: CategoryId;
  name: string;
  description?: string;
  learnMoreHref?: string;
  /** e.g. "Save 22%" — omitted when the product has no badge. */
  badge?: string;
  image: string;
  /** Unit price of the active variant (source of truth for all totals). */
  price: number;
  /** Struck-through compare-at unit price. Omit when there's no discount. */
  compareAt?: number;
  /** Present only for products that expose a colour selector. */
  variants?: Variant[];
  /** Price cadence — physical goods are one-time, the plan is monthly. */
  cadence?: "once" | "monthly";
  /** Render "FREE" instead of the price (hub, shipping). */
  free?: boolean;
  /** Required item: quantity is locked and its stepper is disabled. */
  required?: boolean;
  /** This product has no quantity control in the review panel. */
  noStepper?: boolean;
  /** Renders the special "Cam Unlimited" plan row treatment. */
  display?: "plan";
}

/** The always-on "Fast Shipping" review row. Not a selectable product — no
 *  id, quantity, or variants — so it's its own top-level catalog field
 *  rather than an entry in `products`. Rendered with a client-side icon
 *  (see `Icon name="shipping"`) instead of a catalog image. */
export interface ShippingInfo {
  name: string;
  price: number;
  compareAt?: number;
  free?: boolean;
}

export interface Step {
  id: string;
  category: CategoryId;
  title: string; // "Choose your cameras"
  icon: string; // key into the icon registry
  nextLabel?: string; // label of the "Next: …" button
}

/**
 * The product-data payload served by the Next server (`GET /api/catalog`) and
 * fetched by the page. Pure data — the accordion `steps` and review-panel
 * `categories` are static UI structure and live in `data/structure.ts`, not
 * here.
 */
export interface ProductCatalog {
  products: Product[];
  /** Seed quantities keyed by `${productId}:${variantId}` (variant id
   *  "default" for products with no colour options). */
  seed: Record<string, number>;
  /** The always-on shipping row — see {@link ShippingInfo}. */
  shipping: ShippingInfo;
  /** Static financing string shown in the summary. */
  financingLabel: string;
}

/** Category display order + heading label for the review panel. */
export type Category = { id: CategoryId; label: string };

/** `${productId}:${variantId}` — the key used everywhere for quantities. */
export type LineKey = string;

export const lineKey = (productId: string, variantId = "default"): LineKey =>
  `${productId}:${variantId}`;

export const parseLineKey = (key: LineKey) => {
  const [productId, variantId] = key.split(":");
  return { productId, variantId };
};

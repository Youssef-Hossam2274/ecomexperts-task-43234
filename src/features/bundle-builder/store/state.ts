import { STEPS } from "../data/structure";
import { lineKey, type LineKey, type ProductCatalog } from "../types";

export interface BundleState {
  /** `${productId}:${variantId}` -> quantity. */
  quantities: Record<LineKey, number>;
  /** productId -> currently active variant id (drives the card stepper). */
  selectedVariant: Record<string, string>;
  /** Id of the currently expanded accordion step, or null when all closed. */
  openStep: string | null;
}

export type BundleAction =
  | { type: "setQty"; productId: string; variantId: string; qty: number }
  | { type: "increment"; productId: string; variantId: string }
  | { type: "decrement"; productId: string; variantId: string }
  | { type: "selectVariant"; productId: string; variantId: string }
  | { type: "toggleStep"; stepId: string }
  | { type: "reset" };

/** Build the initial state from the catalog seed (deterministic — used for
 *  SSR and as the fallback when nothing is saved). */
export function seededState(catalog: ProductCatalog): BundleState {
  const quantities: Record<LineKey, number> = { ...catalog.seed };

  const selectedVariant: Record<string, string> = {};
  for (const product of catalog.products) {
    if (!product.variants?.length) continue;
    // Prefer a seeded variant if the shopper already has one, else the first.
    const seeded = product.variants.find(
      (v) => (quantities[lineKey(product.id, v.id)] ?? 0) > 0,
    );
    selectedVariant[product.id] = (seeded ?? product.variants[0]).id;
  }

  return {
    quantities,
    selectedVariant,
    openStep: STEPS[0]?.id ?? null,
  };
}

const clampQty = (qty: number) => (qty < 0 ? 0 : qty);

/** Builds the reducer bound to a catalog, so `reset` can re-seed from it. */
export function makeBundleReducer(catalog: ProductCatalog) {
  return function bundleReducer(
    state: BundleState,
    action: BundleAction,
  ): BundleState {
    switch (action.type) {
      case "setQty": {
        const key = lineKey(action.productId, action.variantId);
        return {
          ...state,
          quantities: { ...state.quantities, [key]: clampQty(action.qty) },
        };
      }
      case "increment": {
        const key = lineKey(action.productId, action.variantId);
        return {
          ...state,
          quantities: {
            ...state.quantities,
            [key]: clampQty((state.quantities[key] ?? 0) + 1),
          },
        };
      }
      case "decrement": {
        const key = lineKey(action.productId, action.variantId);
        return {
          ...state,
          quantities: {
            ...state.quantities,
            [key]: clampQty((state.quantities[key] ?? 0) - 1),
          },
        };
      }
      case "selectVariant":
        return {
          ...state,
          selectedVariant: {
            ...state.selectedVariant,
            [action.productId]: action.variantId,
          },
        };
      case "toggleStep":
        return {
          ...state,
          openStep: state.openStep === action.stepId ? null : action.stepId,
        };
      case "reset":
        return seededState(catalog);
      default:
        return state;
    }
  };
}

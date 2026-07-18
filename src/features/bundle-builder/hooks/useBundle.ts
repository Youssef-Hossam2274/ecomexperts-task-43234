"use client";

import { useMemo } from "react";
import { useBundleContext } from "../store/BundleProvider";

/** Thin ergonomic wrapper over the bundle context: state, save helpers, and
 *  memoised action creators. Derived values live in `store/selectors.ts`. */
export function useBundle() {
  const { state, dispatch, save, justSaved, hydrated } = useBundleContext();

  const actions = useMemo(
    () => ({
      setQty: (productId: string, variantId: string, qty: number) =>
        dispatch({ type: "setQty", productId, variantId, qty }),
      increment: (productId: string, variantId: string) =>
        dispatch({ type: "increment", productId, variantId }),
      decrement: (productId: string, variantId: string) =>
        dispatch({ type: "decrement", productId, variantId }),
      selectVariant: (productId: string, variantId: string) =>
        dispatch({ type: "selectVariant", productId, variantId }),
      toggleStep: (stepId: string) => dispatch({ type: "toggleStep", stepId }),
    }),
    [dispatch],
  );

  return { state, actions, save, justSaved, hydrated };
}

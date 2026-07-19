"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  makeBundleReducer,
  seededState,
  type BundleAction,
  type BundleState,
} from "./state";
import { CatalogProvider } from "./CatalogContext";
import { loadState, saveState } from "./persistence";
import type { ProductCatalog } from "../types";

interface BundleContextValue {
  state: BundleState;
  dispatch: React.Dispatch<BundleAction>;
  /** Persist the current system to localStorage. */
  save: () => void;
  /** True briefly after a successful save (for the "Saved" confirmation). */
  justSaved: boolean;
  /** True once the client has restored any saved system (avoids a flash). */
  hydrated: boolean;
}

const BundleContext = createContext<BundleContextValue | null>(null);

export function BundleProvider({
  catalog,
  children,
}: {
  catalog: ProductCatalog;
  children: React.ReactNode;
}) {
  const reducer = useMemo(() => makeBundleReducer(catalog), [catalog]);
  // Single init decision: a saved system wins over the catalog seed.
  // `loadState()` is SSR-guarded (returns null when there's no `window`), so
  // the server — and the very first client render — start from the seed. We
  // hold the subtree back until `hydrated` so any saved system is swapped in
  // on mount without a hydration mismatch (see the gate on `children` below).
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => loadState() ?? seededState(catalog),
  );
  const [hydrated, setHydrated] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const save = useCallback(() => {
    if (saveState(state)) {
      setJustSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setJustSaved(false), 2200);
    }
  }, [state]);

  useEffect(
    () => () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    },
    [],
  );

  const value = useMemo<BundleContextValue>(
    () => ({ state, dispatch, save, justSaved, hydrated }),
    [state, save, justSaved, hydrated],
  );

  return (
    <CatalogProvider catalog={catalog}>
      <BundleContext.Provider value={value}>
        {/* Server + first client render start from the seed; hold the subtree
            until mount so a saved system swaps in without a hydration
            mismatch. `hydrated` is still exposed for consumers that care. */}
        {hydrated ? children : null}
      </BundleContext.Provider>
    </CatalogProvider>
  );
}

export function useBundleContext(): BundleContextValue {
  const ctx = useContext(BundleContext);
  if (!ctx) {
    throw new Error("useBundleContext must be used within a <BundleProvider>");
  }
  return ctx;
}

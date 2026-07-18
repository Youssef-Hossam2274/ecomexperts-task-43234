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
  // SSR-safe: start from the deterministic seed, then restore on the client.
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    seededState(catalog),
  );
  const [hydrated, setHydrated] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (saved) dispatch({ type: "hydrate", state: saved });
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
      <BundleContext.Provider value={value}>{children}</BundleContext.Provider>
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

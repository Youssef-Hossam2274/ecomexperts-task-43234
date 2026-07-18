"use client";

import { createContext, useContext, useMemo } from "react";
import type { Product, ProductCatalog } from "../types";

interface CatalogContextValue extends ProductCatalog {
  /** Fast id → product lookup, derived once from `products`. */
  productById: Map<string, Product>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/**
 * Makes the server-fetched product catalog available to client components.
 * The data originates in a Server Component (`getCatalog()`) and is handed down
 * as a prop — no client-bundled JSON singleton.
 */
export function CatalogProvider({
  catalog,
  children,
}: {
  catalog: ProductCatalog;
  children: React.ReactNode;
}) {
  const value = useMemo<CatalogContextValue>(
    () => ({
      ...catalog,
      productById: new Map(catalog.products.map((p) => [p.id, p])),
    }),
    [catalog],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog must be used within a <CatalogProvider>");
  }
  return ctx;
}

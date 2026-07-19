import "server-only";

import { cache } from "react";
import type { ProductCatalog } from "@/src/features/bundle-builder/types";
import raw from "./catalog.json";

/**
 * Server-side loader for the product catalog — the single source of truth for
 * both the page (async Server Component) and the `GET /api/catalog` Route
 * Handler.
 *
 * This module — and everything under `src/server/` — simulates a separate
 * backend: the `server-only` import above makes it a build error to pull this
 * into a Client Component, the same way a real API boundary would forbid it.
 * The frontend (`src/features/bundle-builder`) only ever sees the catalog
 * after it's crossed that boundary, via a Server Component prop or a fetch to
 * `/api/catalog`.
 *
 * Wrapped in `React.cache` so repeated calls within a single request are
 * memoised. The data is read from a local JSON file today; swapping in a real
 * database/CMS later means changing only this function.
 */
export const getCatalog = cache(async (): Promise<ProductCatalog> => {
  const catalog = raw as ProductCatalog;
  return {
    ...catalog,
    // Product images are served by this same simulated backend rather than
    // Next's static /public folder — see src/app/api/assets/[...path].
    products: catalog.products.map((product) => ({
      ...product,
      image: toAssetUrl(product.image),
      variants: product.variants?.map((variant) => ({
        ...variant,
        swatch: toAssetUrl(variant.swatch),
      })),
    })),
  };
});

const toAssetUrl = (path: string): string =>
  path.startsWith("/assets/") ? `/api${path}` : path;

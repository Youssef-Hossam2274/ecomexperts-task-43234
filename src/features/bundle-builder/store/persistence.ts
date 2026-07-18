import type { BundleState } from "./state";

/**
 * "Save my system for later" persistence.
 *
 * We persist explicitly (on the shopper's click) rather than on every change,
 * so the link is meaningful: build → save → leave → return → restored. On
 * load, a saved system takes precedence over the catalog seed.
 */
const STORAGE_KEY = "wyze-bundle:v1";

export function saveState(state: BundleState): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadState(): BundleState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BundleState>;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.quantities !== "object" ||
      typeof parsed.selectedVariant !== "object"
    ) {
      return null;
    }
    return {
      quantities: parsed.quantities as BundleState["quantities"],
      selectedVariant: parsed.selectedVariant as BundleState["selectedVariant"],
      openStep: (parsed.openStep ?? null) as BundleState["openStep"],
    };
  } catch {
    return null;
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

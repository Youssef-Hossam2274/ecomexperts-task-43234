import type { Category, Step } from "../types";

/**
 * Static UI structure for the builder.
 *
 * These describe how the experience is laid out — the 4-step accordion and the
 * review-panel category grouping — rather than product data, so they live in
 * code as typed constants instead of in the served JSON. (The JSON is the pure
 * product catalog: see `data/catalog.json` / `getCatalog.ts`.)
 */

/** The vertical accordion steps, in order. Step 1 is open on load. */
export const STEPS: Step[] = [
  {
    id: "cameras",
    category: "cameras",
    title: "Choose your cameras",
    icon: "livestream",
    nextLabel: "Next: Choose your plan",
  },
  {
    id: "plan",
    category: "plan",
    title: "Choose your plan",
    icon: "shield",
    nextLabel: "Next: Choose your sensors",
  },
  {
    id: "sensors",
    category: "sensors",
    title: "Choose your sensors",
    icon: "sensor",
    nextLabel: "Next: Add extra protection",
  },
  {
    id: "protection",
    category: "accessories",
    title: "Add extra protection",
    icon: "grid",
    nextLabel: "Review your system",
  },
];

/** Category display order + heading labels for the review panel. */
export const CATEGORIES: Category[] = [
  { id: "cameras", label: "Cameras" },
  { id: "sensors", label: "Sensors" },
  { id: "accessories", label: "Accessories" },
  { id: "plan", label: "Plan" },
];

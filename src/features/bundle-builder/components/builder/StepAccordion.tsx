"use client";

import { Button } from "@/src/components/ui/Button";
import { STEPS } from "../../data/structure";
import { useBundle } from "../../hooks/useBundle";
import { useCatalog } from "../../store/CatalogContext";
import { stepSelectedCount } from "../../store/selectors";
import type { Product, Step } from "../../types";
import { AccordionSection } from "./AccordionSection";
import { ProductCard } from "./ProductCard";
import { StepProductList } from "./StepProductList";

/** Products rendered inside a step: camera cards for step 1, the category's
 *  configurable items for the rest. */
const stepProducts = (step: Step, products: Product[]) =>
  products.filter(
    (p) =>
      p.category === step.category &&
      (step.category === "cameras" ? p.display === undefined : true),
  );

export function StepAccordion() {
  const { state, actions } = useBundle();
  const { products } = useCatalog();
  const steps = STEPS;

  const goNext = (index: number) => {
    const next = steps[index + 1];
    if (next) {
      // Single-open accordion: opening the next step closes the current one.
      if (state.openStep !== next.id) actions.toggleStep(next.id);
    } else {
      document
        .getElementById("review")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const open = state.openStep === step.id;
        const items = stepProducts(step, products);

        return (
          <AccordionSection
            stepNumber={index + 1}
            totalSteps={steps.length}
            key={step.id}
            step={step}
            open={open}
            selectedCount={stepSelectedCount(state, step.category, products)}
            onToggle={() => actions.toggleStep(step.id)}
          >
            {step.category === "cameras" ? (
              // Column count is tied to the page's layout mode so it matches the
              // three Figma states exactly (the card picks its OWN orientation
              // from the resulting width via its container query):
              //   mobile         1-up → wide card  → horizontal (Figma 119-1716)
              //   lg .. <2xl     5-up → narrow card → vertical   (Figma 70-14264,
              //                  the "review at the bottom" full-width layout)
              //   >=2xl          2-up → medium card → horizontal (Figma 68-9791,
              //                  the "review on the right" sidebar layout)
              <div className="grid grid-cols-1 gap-[15px] md:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-2">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <StepProductList products={items} />
            )}

            {step.nextLabel && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => goNext(index)}
                  className="sm:text-[18px] "
                  size="md"
                >
                  {step.nextLabel}
                </Button>
              </div>
            )}
          </AccordionSection>
        );
      })}
    </div>
  );
}

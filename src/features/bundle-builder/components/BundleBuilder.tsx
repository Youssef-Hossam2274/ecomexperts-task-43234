import { Typography } from "@/src/components/ui/Typography";
import { BundleProvider } from "../store/BundleProvider";
import type { ProductCatalog } from "../types";
import { StepAccordion } from "./builder/StepAccordion";
import { ReviewPanel } from "./review/ReviewPanel";

/**
 * Top-level composition.
 *
 * Responsive page layout:
 *  - < 2xl   single column — builder on top, review stacked BELOW it (mobile
 *            shows the "Let's get started!" heading). On the wider end of this
 *            range the review lays out its own two-column line-items/checkout.
 *  - >= 2xl  two columns — builder left (5-up cards), sticky review sidebar on
 *            the right, so the desktop shows the steps alongside the review.
 */
export function BundleBuilder({ catalog }: { catalog: ProductCatalog }) {
  return (
    <BundleProvider catalog={catalog}>
      <main className="mx-auto w-full max-w-[1280px] px-0 py-6 sm:px-6 lg:px-8 lg:py-10 2xl:max-w-[1440px]">
        <Typography
          as="h1"
          variant="D1"
          color="obsidian"
          className="mb-4 border-b border-gray-300 pb-4 text-center lg:hidden"
        >
          Let&apos;s get started!
        </Typography>

        <div className="grid grid-cols-1 items-start gap-8 2xl:grid-cols-[minmax(0,1fr)_400px] 2xl:gap-10">
          <div className="min-w-0">
            <StepAccordion />
          </div>

          <div className="min-w-0 2xl:sticky 2xl:top-6 2xl:self-start">
            <ReviewPanel />
          </div>
        </div>
      </main>
    </BundleProvider>
  );
}

"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/cn";

interface AccordionProps {
  /** Controlled open state. */
  open: boolean;
  onToggle: () => void;
  /**
   * Trigger content (rendered inside the heading's `<button>`). Must be
   * phrasing content — no block-level headings — since it lives in a button.
   */
  header: ReactNode;
  /** Body, revealed with a height + fade animation when `open`. */
  children: ReactNode;
  /** Heading level wrapping the trigger (WAI-ARIA accordion pattern). */
  headingLevel?: 2 | 3 | 4;
  /** Classes for the outer container (e.g. background, radius). */
  className?: string;
  /** Classes for the trigger `<button>`. */
  triggerClassName?: string;
  /** Classes for the body content wrapper (e.g. padding). */
  bodyClassName?: string;
}

/**
 * Headless-ish accordion primitive. Owns the WAI-ARIA wiring and the
 * open/close animation; all visual styling comes from the caller via the
 * `className` hooks. Controlled — pass `open` / `onToggle`.
 *
 * The body animates height via a `grid-template-rows: 0fr → 1fr` transition
 * (no JS measuring), plus an opacity fade; it collapses to zero height and
 * becomes `inert` when closed so its contents leave the tab order. Honors
 * `prefers-reduced-motion`.
 */
export function Accordion({
  open,
  onToggle,
  header,
  children,
  headingLevel = 3,
  className,
  triggerClassName,
  bodyClassName,
}: AccordionProps) {
  const uid = useId();
  const triggerId = `${uid}-trigger`;
  const bodyId = `${uid}-body`;
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={cn(className)}>
      <Heading className="m-0">
        <button
          type="button"
          id={triggerId}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={bodyId}
          className={cn("block w-full cursor-pointer text-left", triggerClassName)}
        >
          {header}
        </button>
      </Heading>

      <div
        id={bodyId}
        role="region"
        aria-labelledby={triggerId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "transition-opacity duration-300 ease-out motion-reduce:transition-none",
              open ? "opacity-100" : "opacity-0",
              bodyClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

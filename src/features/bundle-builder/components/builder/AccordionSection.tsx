"use client";

import { Accordion } from "@/src/components/ui/Accordion";
import { Icon, type IconName } from "@/src/components/ui/icon";
import { ChevronDown, ChevronUp } from "@/src/components/ui/icons";
import { Typography } from "@/src/components/ui/Typography";
import { cn } from "@/src/lib/cn";
import type { Step } from "../../types";

/** Maps a step's catalog `icon` key to a generated icon name. */
const STEP_ICON: Record<string, IconName> = {
  livestream: "camera",
  shield: "plan",
  sensor: "sensor",
  grid: "extra-protection",
};

interface AccordionSectionProps {
  stepNumber: number;
  totalSteps: number;
  step: Step;
  open: boolean;
  selectedCount: number;
  onToggle: () => void;
  children: React.ReactNode;
}

/**
 * One accordion step — the builder's customized skin over the base
 * {@link Accordion}. Opening only swaps the background to the light-blue panel
 * and reveals the body (animated); the header's geometry (step label + icon +
 * title row, `px-[15px] py-[20px]`) is IDENTICAL in both states, so nothing
 * shifts or resizes on toggle.
 */
export function AccordionSection({
  stepNumber,
  totalSteps,
  step,
  open,
  selectedCount,
  onToggle,
  children,
}: AccordionSectionProps) {
  const header = (
    <div className="flex flex-col gap-[5px] pt-[15px]">
      <Typography variant="L1" color="step-label" className="px-[15px]">
        {`STEP ${stepNumber} OF ${totalSteps}`}
      </Typography>

      {/* Header row — constant across open/closed. The bottom hairline only
          shows when collapsed (the open panel's edge replaces it). */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 border-t-[0.5px] border-ink px-[15px] py-[20px]",
          !open && "border-b-[0.5px]",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Icon
            name={STEP_ICON[step.icon] ?? "camera"}
            color="currentColor"
            className="size-[26px] shrink-0 text-obsidian sm:size-[30px]"
          />
          <Typography
            as="span"
            variant="H1"
            color="obsidian"
            className="min-w-0 flex-1"
          >
            {step.title}
          </Typography>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-wyze-purple">
          {selectedCount > 0 && (
            <Typography as="span" variant="P4" className="sm:text-[14px]">
              {selectedCount} selected
            </Typography>
          )}
          {open ? (
            <ChevronUp className="size-3" />
          ) : (
            <ChevronDown className="size-3" />
          )}
        </span>
      </div>
    </div>
  );

  return (
    <Accordion
      open={open}
      onToggle={onToggle}
      header={header}
      headingLevel={2}
      className={cn(
        "rounded-[10px] transition-colors duration-300",
        open && "bg-panel",
      )}
      bodyClassName="px-[15px] pb-[20px]"
    >
      {children}
    </Accordion>
  );
}

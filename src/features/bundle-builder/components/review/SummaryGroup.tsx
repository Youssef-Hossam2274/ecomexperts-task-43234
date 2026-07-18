import { Typography } from "@/src/components/ui/Typography";
import type { SummaryLine } from "../../store/selectors";
import { SummaryLineItem } from "./SummaryLineItem";

/** A category block in the review panel: uppercase label + its line items,
 *  separated from the previous block by a top divider. */
export function SummaryGroup({
  label,
  lines,
}: {
  label: string;
  lines: SummaryLine[];
}) {
  return (
    <div className="border-t border-gray-400 pt-[15px]">
      <Typography variant="L2" color="gray-500">
        {label}
      </Typography>
      {/* Spacing between rows, no dividers — matches the Figma group. */}
      <ul className="mt-2 flex flex-col gap-3">
        {lines.map((line) => (
          <SummaryLineItem key={line.key} line={line} />
        ))}
      </ul>
    </div>
  );
}

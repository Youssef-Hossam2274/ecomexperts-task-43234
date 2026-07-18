import { formatUSD } from "@/src/features/bundle-builder/lib/money";

interface PriceTagProps {
  /** Current amount to pay. Ignored when `free`. */
  price: number;
  /** Struck-through compare-at amount. Omit when there's no discount. */
  compareAt?: number;
  free?: boolean;
  /** "/mo" for the subscription plan. */
  suffix?: string;
  /** "card" = grey price + red strike; "summary" = purple price + grey strike. */
  tone?: "card" | "summary";
  className?: string;
}

/** Price pair: optional struck-through compare-at + the active price
 *  (or "FREE"). Colours follow the two contexts in the Figma. */
export function PriceTag({
  price,
  compareAt,
  free = false,
  suffix,
  tone = "card",
  className,
}: PriceTagProps) {
  const showCompare = compareAt != null && (free || compareAt > price);
  const strikeColor = tone === "card" ? "text-strike-red" : "text-gray-600";
  const currentColor = tone === "card" ? "text-price" : "text-wyze-purple";
  const currentWeight = tone === "card" ? "font-medium" : "font-semibold";

  return (
    // `flex-nowrap` + `whitespace-nowrap` keep the compare-at and current price
    // on ONE line — they must never stack vertically, even in a narrow column.
    <span
      className={`inline-flex shrink-0 flex-nowrap items-baseline gap-1.5 whitespace-nowrap text-[16px] ${className ?? ""}`}
    >
      {showCompare && (
        <span className={`whitespace-nowrap line-through ${strikeColor}`}>
          {formatUSD(compareAt!)}
          {suffix}
        </span>
      )}
      <span className={`whitespace-nowrap ${currentColor} ${currentWeight}`}>
        {free ? "FREE" : formatUSD(price)}
        {!free && suffix}
      </span>
    </span>
  );
}

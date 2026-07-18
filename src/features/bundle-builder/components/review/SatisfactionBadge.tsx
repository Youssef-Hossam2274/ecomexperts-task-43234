import { SafeImage } from "@/src/components/ui/SafeImage";

/**
 * The circular "100% Wyze satisfaction guarantee" seal. Falls back to a CSS
 * rendition when the brand asset isn't present, so it always reads as a badge.
 */
export function SatisfactionBadge({ className }: { className?: string }) {
  return (
    <SafeImage
      src="/assets/images/satisfaction-badge.svg"
      alt="100% Wyze satisfaction guarantee"
      wrapperClassName={`shrink-0 ${className ?? ""}`}
      fallback={
        <span className="flex size-full flex-col items-center justify-center rounded-full bg-wyze-purple p-2 text-center leading-tight text-white">
          <span className="text-[18px] font-bold">100%</span>
          <span className="text-[7px] font-medium uppercase tracking-wide">
            Wyze satisfaction guarantee
          </span>
        </span>
      }
    />
  );
}

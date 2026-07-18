import { Icon } from "@/src/components/ui/icon";
import { PriceTag } from "@/src/components/ui/PriceTag";
import { Typography } from "@/src/components/ui/Typography";
import type { ShippingInfo } from "../../types";

/**
 * The always-on "Fast Shipping" review row. Unlike the other rows it isn't
 * tied to a selectable product (no id, qty, or variants), so it renders its
 * own client-side icon (`Icon name="shipping"`) instead of a catalog image.
 */
export function ShippingLineItem({ shipping }: { shipping: ShippingInfo }) {
  return (
    <li className="@container flex items-center gap-3">
      <span className="grid size-[41px] shrink-0 place-items-center rounded-[5px] bg-white">
        <Icon name="shipping" className="size-7" />
      </span>

      <Typography
        variant="P2"
        weight="medium"
        color="obsidian"
        className="min-w-0 flex-1 text-[16px] leading-[1.15] sm:text-[18px]"
      >
        {shipping.name}
      </Typography>

      <div className="shrink-0 text-right">
        <PriceTag
          price={shipping.price}
          compareAt={shipping.compareAt}
          free={shipping.free}
          tone="summary"
          className="justify-end text-[16px] @max-[380px]:flex-col @max-[380px]:items-end @max-[380px]:gap-0"
        />
      </div>
    </li>
  );
}

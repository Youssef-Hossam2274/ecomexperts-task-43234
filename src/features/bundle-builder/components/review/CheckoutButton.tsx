"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { Typography } from "@/src/components/ui/Typography";

/** Full-width Checkout button. The prototype has nowhere to go, so it shows a
 *  brief inline confirmation. */
export function CheckoutButton() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div>
      <Button
        variant="primary"
        size="lg"
        fullWidth
        displayFont
        onClick={() => setConfirmed(true)}
      >
        Checkout
      </Button>
      {confirmed && (
        <Typography
          role="status"
          variant="P4"
          color="save-green"
          className="mt-2 text-center"
        >
          Thanks! Your order is confirmed. 🎉
        </Typography>
      )}
    </div>
  );
}

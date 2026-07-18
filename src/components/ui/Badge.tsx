import { Typography } from "./Typography";

/** Purple discount badge, e.g. "Save 22%". */
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center justify-center rounded-panel bg-wyze-purple px-1.5 py-0.5">
      <Typography variant="L4" color="white" className="text-center">
        {children}
      </Typography>
    </div>
  );
}

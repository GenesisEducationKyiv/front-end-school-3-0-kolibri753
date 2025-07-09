import { Radio } from "lucide-react";
import { getValidClassNames } from "@/helpers";

interface StatusIndicatorProps {
  isConnected: boolean;
  label?: string;
}

export function StatusIndicator({
  isConnected,
  label = "Popular",
}: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm flex-shrink-0">
      <Radio
        className={getValidClassNames(
          "w-4 h-4",
          isConnected ? "text-primary" : "text-base-content/50"
        )}
        aria-hidden="true"
      />
      <span className="font-medium text-primary">{label}</span>
    </div>
  );
}

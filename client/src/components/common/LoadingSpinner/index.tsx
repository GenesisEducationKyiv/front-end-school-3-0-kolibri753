import { getValidClassNames } from "@/helpers";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
}: LoadingSpinnerProps) => (
  <span
    className={getValidClassNames(
      "loading loading-spinner",
      `loading-${size}`,
      className
    )}
    data-testid="loading-indicator"
  />
);

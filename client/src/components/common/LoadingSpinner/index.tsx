import React from "react";
import { getValidClassNames } from "@/helpers";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <span
      className={getValidClassNames(
        "loading loading-spinner",
        sizeClasses[size],
        className
      )}
      data-testid="loading-indicator"
    />
  );
};

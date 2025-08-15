import { QUERY_CONFIG } from "@/constants";

/**
 * Default retry strategy - don't retry validation errors
 */
export const defaultRetry = (failureCount: number, error: unknown): boolean => {
  if (
    error &&
    typeof error === "object" &&
    "type" in error &&
    error.type === "Validation"
  ) {
    return false;
  }

  return failureCount < QUERY_CONFIG.retryCount;
};

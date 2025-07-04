import { isAppError } from "./isAppError";
import { isRecord } from "./isRecord";

/**
 * Pulls a human-readable message
 */
export function extractErrorMessage(err: unknown): string {
  if (isAppError(err)) {
    if (err.type === "Validation") {
      const parts = Object.values(err.fieldErrors).filter(Boolean);
      return parts.length ? parts.join(", ") : err.message;
    }
    return err.message;
  }

  if (err instanceof Error && err.message) return err.message;

  if (isRecord(err) && typeof err.message === "string") return err.message;

  return "Something went wrong";
}

import { TRACK_QUERY_DEFAULTS } from "@/constants";
import type { TrackQueryParams } from "@/schemas";

/**
 * Serialise params, hiding defaults & empty values
 */
export const buildSearchParams = (
  params: TrackQueryParams
): URLSearchParams => {
  const search = new URLSearchParams();
  const defaults = TRACK_QUERY_DEFAULTS as Record<string, unknown>;

  Object.entries(params).forEach(([key, value]) => {
    if (value === "" || value === defaults[key]) return;
    search.set(key, String(value));
  });

  return search;
};

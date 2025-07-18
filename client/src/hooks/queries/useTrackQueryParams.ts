import { useCallback, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { pipe, R } from "@mobily/ts-belt";

import {
  trackQuerySchema,
  SCHEMA_DEFAULT_QUERY,
  type TrackQueryParams,
} from "@/schemas";
import { buildSearchParams, parseSearchParams } from "@/lib";

/**
 * URL <=> validated query + patcher
 */
export function useTrackQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useMemo<TrackQueryParams>(
    () =>
      pipe(
        parseSearchParams(searchParams),
        R.getWithDefault(SCHEMA_DEFAULT_QUERY)
      ),
    [searchParams]
  );

  useEffect(() => {
    const normalised = buildSearchParams(query);
    if (normalised.toString() !== searchParams.toString()) {
      setSearchParams(normalised, { replace: true });
    }
  }, [query, searchParams, setSearchParams]);

  const patch = useCallback(
    (updates: Partial<TrackQueryParams>) => {
      const merged = trackQuerySchema.parse({ ...query, ...updates });
      setSearchParams(buildSearchParams(merged), { replace: true });
    },
    [query, setSearchParams]
  );

  return { query, patch };
}

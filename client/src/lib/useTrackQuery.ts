import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { pipe, R } from "@mobily/ts-belt";
import { TRACK_QUERY_DEFAULTS } from "@/constants";
import type { TrackQueryParams } from "@/schemas";
import { parseSearchParams } from "./parseSearchParams";

export function useTrackQuery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query: TrackQueryParams = useMemo(
    () =>
      pipe(
        parseSearchParams(searchParams),
        R.getWithDefault({ ...TRACK_QUERY_DEFAULTS } as TrackQueryParams)
      ),
    [searchParams]
  );

  const patch = useCallback(
    (updates: Partial<TrackQueryParams>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([k, v]) =>
        v == null || v === "" ? next.delete(k) : next.set(k, String(v))
      );
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  return { query, patch };
}

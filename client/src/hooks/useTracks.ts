import { useState, useEffect, useCallback } from "react";
import { trackService } from "@/api";
import type { Track, Meta } from "@/types";
import type { AppError } from "@/api/errors";
import { useTrackQuery } from "@/lib";

/**
 * Fetch paginated tracks, params come from URL
 */
export function useTracks() {
  const { query, patch } = useTrackQuery();
  const { page, limit } = query;

  const [data, setData] = useState<Track[]>([]);
  const [meta, setMeta] = useState<Meta>({
    total: 0,
    page,
    limit,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      const res = await trackService.fetchTracks(query, signal);

      res.match(
        ({ data: list, meta: m }) => {
          setData(list);
          setMeta(m);
          setError(null);
        },
        (e) => setError(e)
      );
      setLoading(false);
    },
    [query]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    fetchData(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchData]);

  return { data, meta, loading, error, refetch: fetchData, patch };
}

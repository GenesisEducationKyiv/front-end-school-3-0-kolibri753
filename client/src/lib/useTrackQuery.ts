import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Track } from "@/types";
import { TRACK_QUERY_DEFAULTS } from "./constants";

export function useTrackQuery() {
  const [sp, setSp] = useSearchParams();

  const num = (k: string, d: number) =>
    Math.max(1, Number.parseInt(sp.get(k) ?? "", 10) || d);

  const page = num("page", TRACK_QUERY_DEFAULTS.page);
  const limit = num("limit", TRACK_QUERY_DEFAULTS.limit);
  const sort = (sp.get("sort") as keyof Track) ?? TRACK_QUERY_DEFAULTS.sort;
  const order =
    (sp.get("order") as "asc" | "desc") ?? TRACK_QUERY_DEFAULTS.order;

  const genre = sp.get("genre") ?? "";
  const artist = sp.get("artist") ?? "";
  const search = sp.get("search") ?? "";

  const patch = useCallback(
    (updates: Partial<Record<string, string | number | undefined>>) => {
      const next = new URLSearchParams(window.location.search);

      Object.entries(updates).forEach(([k, v]) => {
        if (v == null || v === "") {
          next.delete(k);
        } else {
          next.set(k, String(v));
        }
      });

      setSp(next, { replace: true });
    },
    [setSp]
  );

  return { page, limit, sort, order, genre, artist, search, patch };
}

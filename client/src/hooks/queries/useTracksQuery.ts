import { useQuery } from "@tanstack/react-query";
import { trackService } from "@/api";
import { QUERY_KEYS } from "@/constants";
import type { TrackQueryParams } from "@/schemas";
import { defaultRetry } from "./utils";

export function useTracksQuery(params: TrackQueryParams) {
  return useQuery({
    queryKey: [QUERY_KEYS.TRACKS, params],
    queryFn: async ({ signal }) => {
      const result = await trackService.fetchTracks(params, signal);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    retry: defaultRetry,
  });
}

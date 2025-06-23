import { useQuery } from "@tanstack/react-query";
import { genreService } from "@/api";
import { QUERY_KEYS, QUERY_CONFIG } from "@/constants";
import { defaultRetry } from "./utils";

export function useGenresQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.GENRES],
    queryFn: async ({ signal }) => {
      const result = await genreService.list({ signal });
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    staleTime: QUERY_CONFIG.staleTime,
    retry: defaultRetry,
  });
}

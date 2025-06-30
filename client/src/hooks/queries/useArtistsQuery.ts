import { useQuery } from "@tanstack/react-query";
import { artistService } from "@/api";
import { QUERY_KEYS } from "@/constants";
import { defaultRetry } from "./utils";

export function useArtistsQuery() {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTISTS],
    queryFn: async ({ signal }) => {
      const result = await artistService.list({ signal });
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    retry: defaultRetry,
  });
}

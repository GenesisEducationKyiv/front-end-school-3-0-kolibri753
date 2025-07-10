import { extractErrorMessage } from "@/helpers";
import type { RefreshableResourceState, ResourceState } from "@/types";
import type { UseQueryResult } from "@tanstack/react-query";

export const toResourceState = <T>(
  query: UseQueryResult<T[], unknown>
): ResourceState<T> => ({
  list: query.data ?? [],
  loading: query.isPending,
  error: query.isError
    ? { type: "Unknown" as const, message: extractErrorMessage(query.error) }
    : null,
});

export const toRefreshableResourceState = <T>(
  query: UseQueryResult<T[], unknown>
): RefreshableResourceState<T> => ({
  ...toResourceState(query),
  refetch: query.refetch,
});

import type { AppError } from "@/api/errors";

export interface ResourceState<T> {
  list: T[];
  loading: boolean;
  // null = OK, otherwise carries the reason
  error: AppError | null;
}

export interface RefreshableResourceState<T> extends ResourceState<T> {
  refetch(): void;
}

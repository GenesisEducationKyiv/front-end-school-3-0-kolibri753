import type { SortKey } from "@/schemas";

export const TRACK_QUERY_DEFAULTS = {
  page: 1,
  limit: 10,
  sort: "title" as SortKey,
  order: "asc" as const,
} as const;

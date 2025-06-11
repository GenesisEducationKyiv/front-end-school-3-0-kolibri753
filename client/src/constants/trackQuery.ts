export const LIMIT_SET = [5, 10, 20] as const;
export type LimitValue = (typeof LIMIT_SET)[number];

export const TRACK_QUERY_DEFAULTS = {
  page: 1,
  limit: 10 as LimitValue,
  sort: "title",
  order: "asc",
  genre: "",
  artist: "",
  search: "",
} as const;

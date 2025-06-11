import { z } from "zod";
import { TRACK_QUERY_DEFAULTS, LIMIT_SET, type LimitValue } from "@/constants";

export const SortKeySchema = z.enum(["title", "artist", "album", "genres"]);
export type SortKey = z.infer<typeof SortKeySchema>;

export const trackQuerySchema = z.object({
  page: z.coerce
    .number()
    .catch(TRACK_QUERY_DEFAULTS.page)
    .transform((n) => (n < 1 ? 1 : n))
    .default(TRACK_QUERY_DEFAULTS.page),

  limit: z.coerce
    .number()
    .catch(TRACK_QUERY_DEFAULTS.limit)
    .transform(
      (n): LimitValue =>
        LIMIT_SET.includes(n as LimitValue)
          ? (n as LimitValue)
          : n > LIMIT_SET[LIMIT_SET.length - 1]
          ? LIMIT_SET[LIMIT_SET.length - 1]
          : TRACK_QUERY_DEFAULTS.limit
    )
    .default(TRACK_QUERY_DEFAULTS.limit),

  sort: SortKeySchema.default(TRACK_QUERY_DEFAULTS.sort),
  order: z.enum(["asc", "desc"]).default(TRACK_QUERY_DEFAULTS.order),

  genre: z.string().default(""),
  artist: z.string().default(""),
  search: z.string().default(""),
});

export type TrackQueryParams = z.infer<typeof trackQuerySchema>;
export type TrackQueryInput = z.input<typeof trackQuerySchema>;

/**
 * Wide-typed defaults derived once
 */
export const SCHEMA_DEFAULT_QUERY: TrackQueryParams = trackQuerySchema.parse(
  {}
);

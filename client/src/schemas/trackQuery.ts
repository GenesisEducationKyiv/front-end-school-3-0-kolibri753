import { z } from "zod";
import { TRACK_QUERY_DEFAULTS } from "@/constants";

export const SortKeySchema = z.enum([
  "title",
  "artist",
  "album",
  "genres",
] as const);
export type SortKey = z.infer<typeof SortKeySchema>;

export const trackQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(TRACK_QUERY_DEFAULTS.page),
  limit: z.coerce.number().int().positive().default(TRACK_QUERY_DEFAULTS.limit),
  sort: SortKeySchema.default(TRACK_QUERY_DEFAULTS.sort),
  order: z.enum(["asc", "desc"]).default(TRACK_QUERY_DEFAULTS.order),
  genre: z.string().default(""),
  artist: z.string().default(""),
  search: z.string().default(""),
});

export type TrackQueryParams = z.infer<typeof trackQuerySchema>;
export type TrackQueryInput  = z.input<typeof trackQuerySchema>;
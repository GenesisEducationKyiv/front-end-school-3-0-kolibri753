/**
 * React Query configuration values
 */
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  retryCount: 3,
} as const;

/**
 * Query keys for consistent cache management
 */
export const QUERY_KEYS = {
  TRACKS: "tracks",
  ARTISTS: "artists",
  GENRES: "genres",
} as const;

export const WS_CONFIG = {
  MAX_ATTEMPTS: 5,
  BASE_DELAY: 1000,
  MAX_DELAY: 30000,
  CLOSE_NORMAL: 1000,
  URL: import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/ws/now-playing",
} as const;

export const CONNECT_DELAY = import.meta.env.DEV ? 100 : (0 as const);

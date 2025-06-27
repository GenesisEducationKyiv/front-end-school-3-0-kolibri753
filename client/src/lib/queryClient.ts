import { QueryClient } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/constants";

/**
 * Create and configure the React Query client
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_CONFIG.staleTime,
        gcTime: QUERY_CONFIG.gcTime,
        retry: QUERY_CONFIG.retryCount,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
};

// Export a singleton instance
export const queryClient = createQueryClient();

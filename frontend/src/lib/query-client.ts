import { QueryClient } from '@tanstack/react-query';
import { APP_CONFIG } from './constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: APP_CONFIG.QUERY_STALE_TIME,
      gcTime: APP_CONFIG.QUERY_GC_TIME,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

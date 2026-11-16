import type { QueryKey } from "@tanstack/react-query";
import { MutationCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    async onSettled(_data, _error, _variable, _context, mutation) {
      if (mutation.meta?.invalidatesQuery) {
        await queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidatesQuery,
        });
      }
    },
  }),
});

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
    };
  }
}

import type { QueryKey } from "@tanstack/react-query";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
    },
    mutations: {
      throwOnError: true,
    },
  },
  mutationCache: new MutationCache({
    onSuccess(_data, _variables, _context, mutation) {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
    },
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
      successMessage?: string;
    };
  }
}

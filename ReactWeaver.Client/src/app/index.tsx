import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "#src/components/ui/sonner.tsx";
import { queryClient } from "#src/lib/query-client.ts";
import { TooltipProvider } from "#src/components/ui/tooltip.tsx";
import type { getRouter } from "./router";
import { ThemeProvider } from "#src/features/theme/components/theme-provider.tsx";

interface AppProps {
  router: ReturnType<typeof getRouter>;
}

export function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider delay={0}>
          <RouterProvider router={props.router} />
          <Toaster closeButton />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

import { ThemeProvider } from "#src/components/theme/theme-provider.tsx";
import { Toaster } from "#src/components/ui/sonner.tsx";
import { TooltipProvider } from "#src/components/ui/tooltip.tsx";
import { queryClient } from "#src/lib/query-client.ts";
import { QueryClientProvider } from "@tanstack/react-query";

export function AppProvider(props: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider delay={0}>
          {props.children}
          <Toaster closeButton />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

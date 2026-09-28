import { ThemeProvider } from "#src/components/theme/theme.provider.tsx";
import { Toaster } from "#src/components/ui/sonner.tsx";
import { TooltipProvider } from "#src/components/ui/tooltip.tsx";
import { Outlet } from "@tanstack/react-router";

export function RootView() {
  return (
    <ThemeProvider>
      <TooltipProvider delay={0}>
        <Outlet />
        <Toaster closeButton />
      </TooltipProvider>
    </ThemeProvider>
  );
}

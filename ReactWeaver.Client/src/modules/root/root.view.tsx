import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

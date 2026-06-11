import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import * as AppSidebar from "./components/app-sidebar";

export function AppView() {
  return (
    <SidebarProvider>
      <AppSidebar.Root>
        <AppSidebar.Header />
        <AppSidebar.Content />
        <AppSidebar.Footer />
      </AppSidebar.Root>
      <Outlet />
    </SidebarProvider>
  );
}

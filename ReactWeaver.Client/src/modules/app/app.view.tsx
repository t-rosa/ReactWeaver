import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./components/app-sidebar";

export function AppView() {
  return (
    <SidebarProvider>
      <AppSidebar>
        <AppSidebar.Header />
        <AppSidebar.Content />
        <AppSidebar.Footer />
      </AppSidebar>
      <Outlet />
    </SidebarProvider>
  );
}

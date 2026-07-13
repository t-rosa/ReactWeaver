import { SidebarProvider } from "#/components/ui/sidebar.tsx";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./components/app-sidebar";

export function AppView() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  );
}

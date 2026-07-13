import { SidebarProvider } from "#/components/ui/sidebar.tsx";
import { Outlet } from "@tanstack/react-router";
import { AdminSidebar } from "./components/admin-sidebar";

export function AdminView() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <Outlet />
    </SidebarProvider>
  );
}

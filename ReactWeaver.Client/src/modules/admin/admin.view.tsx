import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { AdminSidebar } from "./components/admin-sidebar";

export function AdminView() {
  return (
    <SidebarProvider>
      <AdminSidebar>
        <AdminSidebar.Header />
        <AdminSidebar.Content />
        <AdminSidebar.Footer />
      </AdminSidebar>
      <Outlet />
    </SidebarProvider>
  );
}

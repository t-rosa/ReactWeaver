import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import * as AdminSidebar from "./components/admin-sidebar";

export function AdminView() {
  return (
    <SidebarProvider>
      <AdminSidebar.Root>
        <AdminSidebar.Header />
        <AdminSidebar.Content />
        <AdminSidebar.Footer />
      </AdminSidebar.Root>
      <Outlet />
    </SidebarProvider>
  );
}

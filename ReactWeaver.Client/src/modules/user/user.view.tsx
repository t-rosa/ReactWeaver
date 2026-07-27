import { SidebarProvider } from "#/components/ui/sidebar.tsx";
import { Outlet } from "@tanstack/react-router";
import { UserSidebar } from "./components/user-sidebar";

export function UserView() {
  return (
    <SidebarProvider>
      <UserSidebar />
      <Outlet />
    </SidebarProvider>
  );
}

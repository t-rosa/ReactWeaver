import { SidebarProvider } from "#src/components/ui/sidebar.tsx";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout(props: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      {props.children}
    </SidebarProvider>
  );
}

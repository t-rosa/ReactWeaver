import { SidebarProvider } from "#src/components/ui/sidebar.tsx";
import { AppSidebar } from "./app-sidebar";

export function AppLayout(props: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {props.children}
    </SidebarProvider>
  );
}

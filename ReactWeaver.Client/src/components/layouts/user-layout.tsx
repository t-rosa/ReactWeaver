import { SidebarProvider } from "#src/components/ui/sidebar.tsx";
import { UserSidebar } from "./user-sidebar";

export function UserLayout(props: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <UserSidebar />
      {props.children}
    </SidebarProvider>
  );
}

import { SidebarInset, SidebarProvider } from "#src/components/ui/sidebar.tsx";
import { ProfileSidebar } from "./profile-sidebar";

export function ProfileLayout(props: React.PropsWithChildren) {
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}

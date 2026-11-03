import { SidebarInset } from "#src/components/ui/sidebar.tsx";

export function DashboardInset(props: React.PropsWithChildren) {
  return (
    <SidebarInset>
      <div className="grid gap-6">{props.children}</div>
    </SidebarInset>
  );
}
